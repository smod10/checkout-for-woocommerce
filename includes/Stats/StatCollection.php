<?php
/**
 * Created by PhpStorm.
 * User: brandontassone
 * Date: 2019-01-07
 * Time: 13:44
 */

namespace Objectiv\Plugins\Checkout\Stats;

use Braintree\Exception;
use Objectiv\Plugins\Checkout\Main;
use Objectiv\BoosterSeat\Base\Singleton;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use \WC_Report_Sales_By_Date;
use \DateInterval;
use \DateTime;

class StatCollection extends Singleton {
	/**
	 * The data to send to the EDD site
	 *
	 * @access private
	 */
	private $data = [];

	/**
	 * @var string
	 * @access private
	 */
	private $allow_tracking_key = 'allow_tracking';

	/**
	 * @var string
	 * @access private
	 */
	private $tracked_page_key = 'purchase_page';

	/**
	 * @var string
	 * @access private
	 */
	private $tracking_notice_key = 'tracking_notice';

	/**
	 * @var string 
	 * @access private
	 */
	private $last_send_key = 'tracking_last_send';

	/**
	 * @var string
	 * @access private
	 */
	private $tracking_action_param = 'cfw_tracking_action';

	/**
	 * @var string
	 * @access private
	 */
	private $cfw_home_site_url = 'http://www.checkoutwc.com';

	/**
	 * @var bool
     * @access private
	 */
	private $just_opted_in = false;

	/**
	 * @var string
	 * @access private
	 */
	private $track_data_message = 'Something something track data. Something. No sensitive data is tracked.';

	/**
	 * @var SettingsManager
     * @access private
	 */
	private $settings_manager = null;

	/**
	 *
	 */
	public function __construct($settings_manager) {
		add_action( 'init', array( $this, 'schedule_send' ) );
		add_action( 'init', array($this, 'tracking_opt_in_out_listener') );
		add_action( 'settings_general_sanitize', array( $this, 'check_for_settings_optin' ) );
		add_action( 'cfw_opt_into_tracking',   array( $this, 'check_for_optin'  ) );
		add_action( 'cfw_opt_out_of_tracking', array( $this, 'check_for_optout' ) );
		add_action( 'admin_notices',           array( $this, 'admin_notice'     ) );

		$this->settings_manager = $settings_manager;
	}

	/**
	 * If the tracking get parameter exists on the page lets grab the acton name and fire it off
	 *
	 * @return void
	 */
	public function tracking_opt_in_out_listener() {
		add_action( 'updated_option', array($this, 'updated_option'), 10, 3 );

		if(key_exists($this->tracking_action_param, $_GET) && !empty($_GET[$this->tracking_action_param])) {
			do_action("cfw_{$_GET[$this->tracking_action_param]}");
		}
	}

	/**
	 * Check if the user has opted into tracking
	 *
	 * @access private
	 * @return bool
	 */
	private function tracking_allowed() {
		return (bool) $this->get_option( $this->allow_tracking_key );
	}

	/**
	 * Setup the data that is going to be tracked
	 *
	 * @access private
	 * @return void
	 */
	public function setup_data() {

		$data = array();

		// Retrieve current theme info
		$theme_data = wp_get_theme();
		$theme      = $theme_data->Name . ' ' . $theme_data->Version;

		$data['php_version'] = phpversion();
		$data['edd_version'] = Main::instance()->get_version();
		$data['wp_version']  = get_bloginfo( 'version' );
		$data['server']      = isset( $_SERVER['SERVER_SOFTWARE'] ) ? $_SERVER['SERVER_SOFTWARE'] : '';

		$checkout_page        = $this->get_option( $this->tracked_page_key );
		$data['install_date'] = false !== $checkout_page ? get_post_field( 'post_date', $checkout_page ) : 'not set';

		$data['multisite']   = is_multisite();
		$data['url']         = home_url();
		$data['theme']       = $theme;
		$data['email']       = get_bloginfo( 'admin_email' );

		// Retrieve current plugin information
		if( ! function_exists( 'get_plugins' ) ) {
			include ABSPATH . '/wp-admin/includes/plugin.php';
		}

		$plugins        = array_keys( get_plugins() );
		$active_plugins = get_option( 'active_plugins', array() );

		foreach ( $plugins as $key => $plugin ) {
			if ( in_array( $plugin, $active_plugins ) ) {
				// Remove active plugins from list so we can show active and inactive separately
				unset( $plugins[ $key ] );
			}
		}

		$data['wc_order_stats'] = $this->get_woo_order_stats();
		$data['wc_settings'] = $this->get_woo_site_settings();
		$data['cfw_settings'] = $this->get_cfw_settings();

		$data['active_plugins']   = $active_plugins;
		$data['inactive_plugins'] = $plugins;
		$data['active_gateways']  = array_keys( WC()->payment_gateways()->get_available_payment_gateways() );
		$data['locale']           = get_locale();

		$this->data = $data;
	}

	public function get_cfw_settings() {
	    return Main::instance()->get_settings_manager()->settings;
    }

    public function get_woo_site_settings() {
	    // Filter non woo settings
		$options = array_filter(wp_load_alloptions(), function($option){
            return strpos($option, 'woocommerce_') === 0;
        },ARRAY_FILTER_USE_KEY);

		// Unserialize child data
		$options = array_map(function($option){
		    return !unserialize($option) ? $option : unserialize($option);
        }, $options);

		return $options;
    }

	public function get_woo_order_stats($interval = 'P7D') {
	    try {
			$start_date_interval = new DateInterval( $interval );
			$start_date          = ( new DateTime() )->sub( $start_date_interval )->format( 'Y-m-d' );
		} catch(\Exception $exception) {
	        d($exception);
        }

		$wc_path = \WooCommerce::plugin_path();

		include_once "$wc_path/includes/admin/reports/class-wc-admin-report.php";
		include_once "$wc_path/includes/admin/reports/class-wc-report-sales-by-date.php";

		$sales_by_date = null;

		if(class_exists('WC_Report_Sales_By_Date')) {
			$sales_by_date                 = new WC_Report_Sales_By_Date();
			$sales_by_date->start_date     = strtotime( $start_date );
			$sales_by_date->end_date       = current_time( 'timestamp' );
			$sales_by_date->chart_groupby  = 'day';
			$sales_by_date->group_by_query = 'YEAR(posts.post_date), MONTH(posts.post_date), DAY(posts.post_date)';
		}

		return $sales_by_date->get_report_data();
    }

	/**
	 * Send the data to the EDD server
	 *
	 * @access private
	 *
	 * @param  bool $override If we should override the tracking setting.
	 * @param  bool $ignore_last_checkin If we should ignore when the last check in was.
	 *
	 * @return bool
	 */
	public function send_checkin( $override = false, $ignore_last_checkin = false ) {

		$home_url = trailingslashit( home_url() );
		// Allows us to stop our own site from checking in, and a filter for our additional sites
		if ( $home_url === $this->cfw_home_site_url || apply_filters( 'cfw_disable_tracking_checkin', false ) ) {
			return false;
		}

		if( ! $this->tracking_allowed() && ! $override ) {
			return false;
		}

		// Send a maximum of once per week
		$last_send = $this->get_last_send();
		if( is_numeric( $last_send ) && $last_send > strtotime( '-1 week' ) && ! $ignore_last_checkin ) {
			return false;
		}

		$this->setup_data();

		d($this->data);
		d(\WooCommerce::plugin_path());

//		wp_remote_post( 'https://easydigitaldownloads.com/?cfw_action=checkin', array(
//			'method'      => 'POST',
//			'timeout'     => 8,
//			'redirection' => 5,
//			'httpversion' => '1.1',
//			'blocking'    => false,
//			'body'        => $this->data,
//			'user-agent'  => 'CFW/' . Main::instance()->get_version() . '; ' . get_bloginfo( 'url' )
//		) );

		$this->settings_manager->update_setting( $this->last_send_key, time() );

		return true;

	}

	/**
	 * Check for a new opt-in on settings save
	 *
	 * This runs during the sanitation of General settings, thus the return
	 *
	 * @return array
	 */
	public function check_for_settings_optin( $input ) {
		// Send an initial check in on settings save

		if( isset( $input[$this->allow_tracking_key] ) && $input[$this->allow_tracking_key] == 1 ) {
			$this->send_checkin( true );
		}

		return $input;

	}

	/**
	 * Check for a new opt-in via the admin notice
	 *
	 * @return void
	 */
	public function check_for_optin() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$this->settings_manager->update_setting( $this->allow_tracking_key, 1 );

		$this->send_checkin( true );

		$this->settings_manager->update_setting( $this->tracking_notice_key, '1' );

	}

	/**
	 * Check for a new opt-in via the admin notice
	 *
	 * @return void
	 */
	public function check_for_optout() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$this->settings_manager->delete_setting( $this->allow_tracking_key );
		$this->settings_manager->update_setting( $this->tracking_notice_key, '1');
		wp_redirect( remove_query_arg( $this->tracking_action_param ) ); exit;
	}

	/**
	 * Get the last time a checkin was sent
	 *
	 * @access private
	 * @return false|string
	 */
	private function get_last_send() {
		return $this->get_option( $this->last_send_key );
	}

	/**
	 * Schedule a weekly checkin
	 *
	 * We send once a week (while tracking is allowed) to check in, which can be
	 * used to determine active sites.
	 *
	 * @return void
	 */
	public function schedule_send() {
		if ( wp_doing_cron() ) {
			add_action( 'cfw_weekly_scheduled_events', array( $this, 'send_checkin' ) );
		}
	}

	/**
	 * Display the admin notice to users that have not opted-in or out
	 *
	 * @return void
	 */
	public function admin_notice() {
		$hide_notice = $this->get_option( $this->tracking_notice_key );

		if ( $hide_notice ) {
			return;
		}

		if ( $this->settings_manager->get_setting( $this->allow_tracking_key ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if (
			stristr( network_site_url( '/' ), 'dev'       ) !== false ||
			stristr( network_site_url( '/' ), 'localhost' ) !== false ||
			stristr( network_site_url( '/' ), ':8888'     ) !== false // This is common with MAMP on OS X
		) {
			$this->settings_manager->update_setting( $this->tracking_notice_key, '1' );
		} else {
			$optin_url  = add_query_arg( 'cfw_tracking_action', 'opt_into_tracking' );
			$optout_url = add_query_arg( 'cfw_tracking_action', 'opt_out_of_tracking' );

			$main = Main::instance();
			$i18n = $main->get_i18n();
			?>
				<div class="updated" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap">
					<div class="cfw-tracking-message">
						<?php echo __( $this->track_data_message, $i18n->get_text_domain() ); ?>
					</div>
					<div class="cfw-tracking-actions" style="margin: 1em 0;">
						<a href="<?php echo esc_url( $optin_url ); ?>" class="button-secondary"><?php echo __( 'Allow', $i18n->get_text_domain() ); ?></a>
						<a href="<?php echo esc_url( $optout_url ); ?>" class="button-secondary"><?php echo __( 'Do not allow', $i18n->get_text_domain() ) ?></a>
					</div>
				</div>
			<?php
		}
	}

	/**
	 * @param $key
	 *
	 * @return mixed
	 */
	public function get_option($key) {
		return $this->settings_manager->get_setting($key);
	}

	/**
	 * @param $key
	 * @param $old_value
	 * @param $value
	 */
	public function updated_option($key, $old_value, $value) {
		if($key == "_cfw__settings") {
		    if(is_array( $value ) && $value[$this->allow_tracking_key] != null && $old_value[$this->allow_tracking_key] != $value[$this->allow_tracking_key]) {
                if($value[ $this->allow_tracking_key ] == "0") {
                    $this->settings_manager->delete_setting( $this->allow_tracking_key );
                    $this->settings_manager->update_setting( $this->tracking_notice_key, '0' );
                    wp_redirect( remove_query_arg( $this->tracking_action_param ) );
                    exit;
                }

                if($value[ $this->allow_tracking_key ] == "1") {
                    if ( ! current_user_can( 'manage_options' ) ) {
                        return;
                    }

                    $this->send_checkin( true );

                    $this->settings_manager->update_setting( $this->tracking_notice_key, '1' );
                }
            }
		}
	}

	/**
	 * @param $key
	 * @param $value
	 */
	public function set_option($key, $value) {
		$this->settings_manager->add_setting($key, $value);
	}

	/**
	 * @param $key
	 */
	public function delete_option($key) {
		$this->settings_manager->delete_setting($key);
	}

	/**
	 * @return mixed
	 */
	public function get_data() {
		return $this->data;
	}

	/**
	 * @return string
	 */
	public function get_allow_tracking_key(): string {
		return $this->allow_tracking_key;
	}

	/**
	 * @return string
	 */
	public function get_tracked_page_key(): string {
		return $this->tracked_page_key;
	}

	/**
	 * @return string
	 */
	public function get_tracking_notice_key(): string {
		return $this->tracking_notice_key;
	}

	/**
	 * @return string
	 */
	public function get_last_send_key(): string {
		return $this->last_send_key;
	}

	/**
	 * @return string
	 */
	public function get_tracking_action_param(): string {
		return $this->tracking_action_param;
	}

	/**
	 * @return string
	 */
	public function get_cfw_home_site_url(): string {
		return $this->cfw_home_site_url;
	}

	/**
	 * @return string
	 */
	public function get_track_data_message(): string {
		return $this->track_data_message;
	}


}