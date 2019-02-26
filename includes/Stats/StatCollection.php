<?php
/**
 * Created by PhpStorm.
 * User: brandontassone
 * Date: 2019-01-07
 * Time: 13:44
 */

namespace Objectiv\Plugins\Checkout\Stats;

use Objectiv\Plugins\Checkout\Main;
use Objectiv\BoosterSeat\Base\Singleton;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use \WC_Report_Sales_By_Date;
use \DateInterval;
use \DateTime;

class StatCollection extends Singleton {
	/**
	 * The data to send to the CFW stat collection site
	 *
	 * @access private
	 */
	private $data = [];

	/**
     * The stat collection url
     *
	 * @var string
     * @access private
	 */
	private $stat_collection_url = 'http://stats.checkoutwc.com/api/v1/stats';

	/**
     * The development stat collection url
     *
	 * @var string
     * @access private
	 */
	private $dev_stat_collection_url = 'http://127.0.0.1:8000/api/v1/stats';

	/**
     * The list of settings from CFW to grab
     *
	 * @var array
     * @access private
	 */
	private $approved_cfw_settings = [];

	/**
     * The list of settings from WooCommerce to grab
	 * @var array
     * @access private
	 */
	private $approved_woocommerce_settings = [];

	/**
     * The list of store stats from WooCommerce to grab
     *
	 * @var array
     * @access private
	 */
	private $approved_woocomerce_store_stats = [];

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
	 * @var array
     * @access private
	 */
	private $woocommerce_settings = [];

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
	 * StatCollection constructor.
	 *
	 * @param SettingsManager $settings_manager
	 */
	public function __construct($settings_manager) {
		add_action( 'init', array( $this, 'schedule_send' ) );
		add_action( 'init', array($this, 'tracking_opt_in_out_listener') );
		add_action( 'settings_general_sanitize', array( $this, 'check_for_settings_optin' ) );
		add_action( 'cfw_opt_into_tracking',   array( $this, 'check_for_optin'  ) );
		add_action( 'cfw_opt_out_of_tracking', array( $this, 'check_for_optout' ) );
		add_action( 'admin_notices', array( $this, 'admin_notice' ) );
		add_filter( 'cron_schedules', array( $this, 'add_schedules' ) );

		$this->approved_cfw_settings = [
			"active_template" => (object) [
				"rename" => false,
				"name" => null,
				"action" => null
			],
			"enable" => (object) [
				"rename" => false,
				"name" => null,
				"action" => null
			],
			"enable_phone_fields" => (object) [
				"rename" => false,
				"name" => null,
				"action" => null
			],
			"header_scripts" => (object) [
				"rename"    => true,
				"name"      => "header_scripts_empty",
				"action"    => function($setting) {
					return empty($setting);
				}
			],
			"footer_scripts" => (object) [
				"rename"    => true,
				"name"      => "footer_scripts_empty",
				"action"    => function($setting) {
					return empty($setting);
				}
			]
		];

		$this->approved_woocommerce_settings = [
			"woocommerce_store_city",
			"woocommerce_default_country",
			"woocommerce_default_customer_address",
			"woocommerce_calc_taxes",
			"woocommerce_enable_coupons",
			"woocommerce_calc_discounts_sequentially",
			"woocommerce_currency",
			"woocommerce_prices_include_tax",
			"woocommerce_tax_based_on",
			"woocommerce_tax_round_at_subtotal",
			"woocommerce_tax_classes",
			"woocommerce_tax_display_shop",
			"woocommerce_tax_display_cart",
			"woocommerce_tax_total_display",
			"woocommerce_enable_shipping_calc",
			"woocommerce_shipping_cost_requires_address",
			"woocommerce_ship_to_destination",
			"woocommerce_enable_guest_checkout",
			"woocommerce_enable_checkout_login_reminder",
			"woocommerce_enable_signup_and_login_from_checkout",
			"woocommerce_registration_generate_username",
			"woocommerce_registration_generate_password"
        ];

		$this->approved_woocomerce_store_stats = [
            "total_tax_refunded",
            "total_shipping_refunded",
            "total_shipping_tax_refunded",
            "total_refunds",
            "total_tax",
            "total_shipping",
            "total_shipping_tax",
            "total_sales",
            "net_sales",
            "average_sales",
            "average_total_sales",
            "total_coupons",
            "total_refunded_orders",
            "total_orders",
            "total_items"
        ];

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
		$data['cfw_version'] = Main::instance()->get_version();
		$data['wp_version']  = get_bloginfo( 'version' );
		$data['server']      = isset( $_SERVER['SERVER_SOFTWARE'] ) ? $_SERVER['SERVER_SOFTWARE'] : '';

		$checkout_page        = $this->get_option( $this->tracked_page_key );
		$data['install_date'] = false !== $checkout_page ? get_post_field( 'post_date', $checkout_page ) : null;

		$data['multisite']   = is_multisite();
		$data['url']         = home_url();
		$data['theme']       = $theme;

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
		$data['active_gateways']  = array_keys( WC()->payment_gateways()->get_available_payment_gateways() );
		$data['locale']           = get_locale();

		$this->data = $data;
	}

	/**
	 * @return mixed
	 */
	public function get_cfw_settings() {
	    // Filter function for the cfw settings list
	    $filter_settings = \Closure::bind(function($setting) {
	        // Is the setting key in the settings approved list? Then allow it through
			return in_array($setting, array_keys($this->approved_cfw_settings));
		}, $this);

	    $settings = array_filter(Main::instance()->get_settings_manager()->settings, $filter_settings, ARRAY_FILTER_USE_KEY);

	    return $this->prep_approved_cfw_settings($settings);
    }

	/**
	 * @param $settings
	 *
	 * @return mixed
	 */
    public function prep_approved_cfw_settings($settings) {
		foreach($settings as $key => $value) {
			$setting_metadata = $this->approved_cfw_settings[$key];

			if($setting_metadata->rename) {
				unset($settings[$key]);
				$settings[$setting_metadata->name] = $value;
				$key = $setting_metadata->name;
			}

			if($setting_metadata->action) {
			    $func = $setting_metadata->action;

				$settings[$key] = $func($value);
			}
		}

	    return $settings;
    }

	/**
	 * @return mixed
	 */
    public function get_woo_site_settings() {
        $settings_pages = \WC_Admin_Settings::get_settings_pages();

		array_walk($settings_pages, function($item) {
		    $settings = $item->get_settings();

		    array_walk($settings, function($setting) {
		        if(empty($setting['id']))
		            return;

				$stats = StatCollection::instance();
				$settings = $stats->get_woocommerce_settings();
				$id = $setting['id'];

				if(strpos($id, 'woocommerce_') !== 0) {
				    $id = "woocommerce_{$id}";
                }

				if(!in_array($id, $this->approved_woocommerce_settings))
				    return;

		        $setting_name = $id;
				$settings[] = $setting_name;
				$stats->set_woocommerce_settings($settings);
            });
        });

		$options = (object)['ops' => []];
		$woo_settings = $this->get_woocommerce_settings();

		array_walk($woo_settings, \Closure::bind(function($setting) {
		    $op_value = get_option($setting);

		    if($op_value === false)
		        return;

			$this->ops[$setting] = get_option($setting);
		}, $options));

		return $options->ops;
    }

	/**
	 * @param string $interval
	 *
	 * @return array|\stdClass
	 */
	public function get_woo_order_stats($interval = 'P7D') {
	    try {
			$start_date_interval = new DateInterval( $interval );
			$start_date          = ( new DateTime() )->sub( $start_date_interval )->format( 'Y-m-d' );
		} catch(\Exception $exception) {
	        d($exception);
        }

		$wc_path = WC()->plugin_path();

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

		$report_data = $sales_by_date->get_report_data();
		$report_data_arr = get_object_vars($report_data);

		$report_data = array_filter($report_data_arr, \Closure::bind(function($key) {
		    return in_array($key, $this->approved_woocomerce_store_stats);
        }, $this), ARRAY_FILTER_USE_KEY);

		return $report_data;
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
	public function send_checkin( $override = false, $ignore_last_checkin = true ) {

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
		$remote_url = CFW_DEV_MODE ? $this->dev_stat_collection_url : $this->stat_collection_url;

		wp_remote_request( $remote_url, array(
			'method'      => 'POST',
			'headers'     => [
				'Content-Type' => 'application/json',
			],
            'timeout'     => 8,
			'redirection' => 5,
			'httpversion' => '1.1',
			'body'        => json_encode($this->data),
			'user-agent'  => 'CFW/' . Main::instance()->get_version() . '; ' . get_bloginfo( 'url' ),
		));

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
	 * Registers new cron schedules
	 *
	 * @since 1.6
	 *
	 * @param array $schedules
	 * @return array
	 */
	public function add_schedules( $schedules = array() ) {
		// Adds once weekly to the existing schedules.
		$schedules['weekly'] = array(
			'interval' => 604800,
			'display'  => __( 'Once Weekly', 'easy-digital-downloads' )
		);
		return $schedules;
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
		if ( $this->tracking_allowed() ) {
			add_action( 'cfw_weekly_scheduled_events_tracking', array( $this, 'send_checkin' ) );
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
	 * @return array
	 */
	public function get_woocommerce_settings(): array {
		return $this->woocommerce_settings;
	}

	/**
	 * @param array $woocommerce_settings
	 */
	public function set_woocommerce_settings( array $woocommerce_settings ): void {
		$this->woocommerce_settings = $woocommerce_settings;
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