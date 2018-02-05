<?php

namespace Objectiv\Plugins\Checkout\Core;

/**
 * Class Admin
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Clifton Griffin <clif@objectiv.co>
 */
class Admin {

	/**
	 * @since 1.0.0
	 * @access public
	 * @var object $plugin_instance The plugin instance
	 */
	public $plugin_instance;

	/**
     * @since 1.0.0
     * @access public
	 * @var object $tabs The tabs for the admin navigation
	 */
	public $tabs;

	/**
	 * Admin constructor.
	 *
     * @since 1.0.0
     * @access public
	 * @param $plugin
	 */
	public function __construct( $plugin ) {
		$this->plugin_instance = $plugin;
	}

	/**
	 * Initializes the admin backend
     *
     * @since 1.0.0
     * @access public
	 */
	public function start() {
	    // Admin Menu
		add_action('admin_menu', array($this, 'admin_menu'), 100 );

		// Key Nag
		add_action('admin_menu', array($this, 'add_key_nag'), 11);

        // Enqueue Admin Scripts
		add_action( 'admin_enqueue_scripts', array($this, 'admin_scripts') );

		// Admin notice
        add_action('admin_notices', array($this, 'add_notice_key_nag') );

        // Welcome notice
		add_action('admin_notices', array($this, 'add_welcome_notice') );

		// Stripe 4.x warning
		add_action('admin_notices', array($this, 'add_stripe_wrong_version_notice') );

        // Welcome redirect
		add_action( 'admin_init', array($this, 'welcome_screen_do_activation_redirect') );

		// Add settings link
		add_filter( 'plugin_action_links_' . plugin_basename( $this->plugin_instance->get_path_manager()->get_raw_file() ), array($this, 'add_action_links'), 10, 1 );
	}

	/**
	 * The main admin menu setup
     *
     * @since 1.0.0
     * @access public
	 */
	public function admin_menu() {
		// Initiate tab object
		$this->tabs = new \WP_Tabbed_Navigation('');

		add_options_page( __( 'Checkout for WooCommerce', CFW_TEXT_DOMAIN ), __( 'Checkout for WooCommerce', CFW_TEXT_DOMAIN ), "manage_options", "cfw-settings", array($this, "admin_page") );

		// Setup tabs
        $this->tabs->add_tab( __( 'General', CFW_TEXT_DOMAIN ), menu_page_url('cfw-settings', false) );
		$this->tabs->add_tab( __( 'Design', CFW_TEXT_DOMAIN ), add_query_arg( array('subpage' => 'design'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'License', CFW_TEXT_DOMAIN ), add_query_arg( array('subpage' => 'license'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'Support', CFW_TEXT_DOMAIN ), add_query_arg( array('subpage' => 'support'), menu_page_url('cfw-settings', false) ) );
	}

	/**
	 * The admin page wrap
     *
     * @since 1.0.0
     * @access public
	 */
	public function admin_page() {
	    $current_tab_function = $this->get_current_tab() === false ? 'general_tab' : $this->get_current_tab() . "_tab";
		?>
		<div class="wrap about-wrap" style="margin-left:2px;">

            <h1><?php _e('Checkout for WooCommerce', CFW_TEXT_DOMAIN); ?></h1>
            <p class="about-text"><?php _e( 'Checkout for WooCommerce provides a beautiful, conversion optimized checkout template for WooCommerce.' , CFW_TEXT_DOMAIN ); ?></p>
        </div>

        <div class="wrap">
            <?php $this->tabs->display_tabs(); ?>

            <?php $this->$current_tab_function(); ?>
		</div>
		<?php
	}

	/**
	 * The general tab
     *
     * @since 1.0.0
     * @access public
	 */
	public function general_tab() {
	    ?>
        <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
			<?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>"><?php _e('Enable / Disable', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input type="hidden" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="no" />
                            <label><input type="checkbox" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" id="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="yes" <?php if ( $this->plugin_instance->get_settings_manager()->get_setting('enable') == "yes" ) echo "checked"; ?> /> <?php _e('Use Checkout for WooCommerce Template', CFW_TEXT_DOMAIN); ?></label>
                            <p><span class="description"><?php _e('Enable or disable Checkout for WooCommerce theme. (NOTE: Theme is always enabled for admin users.)', CFW_TEXT_DOMAIN); ?></span></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_scripts'); ?>"><?php _e('Header Scripts', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( stripslashes_deep( $this->plugin_instance->get_settings_manager()->get_setting('header_scripts') ), $this->plugin_instance->get_settings_manager()->get_field_name('header_scripts'), array('textarea_rows' => 6, 'quicktags' => false, 'media_buttons' => false) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('This code will output immediately before the closing <code>&lt;/head&gt;</code> tag in the document source.', CFW_TEXT_DOMAIN); ?>
                                </span>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_scripts'); ?>"><?php _e('Footer Scripts', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( stripslashes_deep( $this->plugin_instance->get_settings_manager()->get_setting('footer_scripts') ), $this->plugin_instance->get_settings_manager()->get_field_name('footer_scripts'), array('textarea_rows' => 6, 'quicktags' => false, 'media_buttons' => false) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('This code will output immediately before the closing <code>&lt;/body&gt;</code> tag in the document source.', CFW_TEXT_DOMAIN); ?>
                                </span>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

			<?php submit_button(); ?>
        </form>
        <?php
    }

	/**
	 * The design tab
     *
     * @since 1.0.0
     * @access public
	 */
    public function design_tab() {
	    ?>
        <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
		    <?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>

            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row" valign="top">
						    <?php _e('Logo', CFW_TEXT_DOMAIN); ?>
                        </th>
                        <td>
                            <div class='image-preview-wrapper'>
                                <img id='image-preview' src='<?php echo wp_get_attachment_url( $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id') ); ?>' width='100' style='max-height: 100px; width: 100px;'>
                            </div>
                            <input id="upload_image_button" type="button" class="button" value="<?php _e( 'Upload image' ); ?>" />
                            <input type='hidden' name='<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('logo_attachment_id'); ?>' id='logo_attachment_id' value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id'); ?>">

                            <a class="delete-custom-img button secondary-button"><?php _e('Clear Logo', CFW_TEXT_DOMAIN); ?></a>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_background_color'); ?>"><?php _e('Header Background Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_background_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('header_background_color'); ?>" data-default-color="#ffffff" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_text_color'); ?>"><?php _e('Header Text Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('header_text_color'); ?>" data-default-color="#2b2b2b" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_background_color'); ?>"><?php _e('Footer Background Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_background_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('footer_background_color'); ?>" data-default-color="#ffffff" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_color'); ?>"><?php _e('Footer Text Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('footer_color'); ?>" data-default-color="#999999" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_text'); ?>"><?php _e('Footer Text', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
						    <?php wp_editor( $this->plugin_instance->get_settings_manager()->get_setting('footer_text'), $this->plugin_instance->get_settings_manager()->get_field_name('footer_text'), array('textarea_rows' => 5) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('If left blank, a standard copyright notice will be displayed. Set to a single space to override this behavior.', CFW_TEXT_DOMAIN); ?>
                                </span>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_color'); ?>"><?php _e('Primary Button Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('button_color'); ?>" data-default-color="#e9a81d" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_text_color'); ?>"><?php _e('Primary Button Text Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('button_text_color'); ?>" data-default-color="#000000" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_color'); ?>"><?php _e('Secondary Button Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('secondary_button_color'); ?>" data-default-color="#999999" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_text_color'); ?>"><?php _e('Secondary Button Text Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('secondary_button_text_color'); ?>" data-default-color="#ffffff" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('link_color'); ?>"><?php _e('Link Color', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('link_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('link_color'); ?>" data-default-color="#e9a81d" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('custom_css'); ?>"><?php _e('Custom CSS', CFW_TEXT_DOMAIN); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( $this->plugin_instance->get_settings_manager()->get_setting('custom_css'), $this->plugin_instance->get_settings_manager()->get_field_name('custom_css'), array('textarea_rows' => 5, 'quicktags' => false, 'media_buttons' => false) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('Add Custom CSS rules to fully control the appearance of the checkout template.', CFW_TEXT_DOMAIN); ?>
                                </span>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

		    <?php submit_button(); ?>
        </form>
        <?php
    }

	/**
	 * The license tab
     *
     * @since 1.0.0
     * @access public
	 */
    public function license_tab() {
	    $this->plugin_instance->get_updater()->admin_page();
    }

	/**
	 * The support tab
     *
     * @since 1.0.0
     * @access public
	 */
    public function support_tab() {
        ?>
        <script>!function(e,o,n){window.HSCW=o,window.HS=n,n.beacon=n.beacon||{};var t=n.beacon;t.userConfig={},t.readyQueue=[],t.config=function(e){this.userConfig=e},t.ready=function(e){this.readyQueue.push(e)},o.config={docs:{enabled:!1,baseUrl:""},contact:{enabled:!0,formId:"dd423b99-b372-11e7-b466-0ec85169275a"}};var r=e.getElementsByTagName("script")[0],c=e.createElement("script");c.type="text/javascript",c.async=!0,c.src="https://djtflbt20bdde.cloudfront.net/",r.parentNode.insertBefore(c,r)}(document,window.HSCW||{},window.HS||{});</script>
        <script>
            HS.beacon.config({
                modal: true,
                instructions: "<?php _e('We can\'t wait to help you with Checkout for WooCommerce! Please fill out the following form and one of our support staff will respond within 12-24 hours. (average)',CFW_TEXT_DOMAIN); ?>",
            });
        </script>

        <h3><?php _e('Need help?', CFW_TEXT_DOMAIN); ?></h3>

        <p><?php _e('Excellent support is in our DNA.', CFW_TEXT_DOMAIN); ?></p>

        <p><?php _e('Many issues are addressed in our documentation:', CFW_TEXT_DOMAIN); ?></p>
        <a href="https://www.checkoutwc.com/docs/" target="_blank" class="button button-primary"><?php _e('View Documentation', CFW_TEXT_DOMAIN); ?></a>

        <p><?php _e('If you need help for something not covered in our documentation, please click this button to file a support request:', CFW_TEXT_DOMAIN); ?></p>
	    <?php submit_button( __('Support Request', CFW_TEXT_DOMAIN), 'primary', false, false, array('id'=> 'checkoutwc-support-button') ); ?>

        <script>
            jQuery("#checkoutwc-support-button").click(function() {
                HS.beacon.open();
            });
        </script>
        <?php
    }

	/**
     * Retrieves the current tab
     *
     * @since 1.0.0
     * @access public
	 * @return bool
	 */
	public function get_current_tab() {
	    return empty($_GET['subpage']) ? false : $_GET['subpage'];
    }

	/**
	 * Adds a notification that nags about the license key
     *
     * @since 1.0.0
     * @access public
	 */
	public function add_key_nag() {
		global $pagenow;

		if( $pagenow == 'plugins.php' ) {
			add_action( 'after_plugin_row_' . $this->plugin_instance->get_path_manager()->get_base(), array($this, 'after_plugin_row_message'), 10, 2 );
		}
	}

	/**
	 * @since 1.0.0
     * @access public
	 */
	public function after_plugin_row_message() {
		$key_status = $this->plugin_instance->get_updater()->get_field_value('key_status');

		if ( empty($key_status) ) return;

		if ( $key_status != "valid" ) {
			$current = get_site_transient( 'update_plugins' );
			if ( isset( $current->response[ plugin_basename(__FILE__) ] ) ) return;

			if ( is_network_admin() || ! is_multisite() ) {
				$wp_list_table = _get_list_table('WP_Plugins_List_Table');
				echo '<tr class="plugin-update-tr"><td colspan="' . $wp_list_table->get_column_count() . '" class="plugin-update colspanchange"><div class="update-message">';
				echo $this->keynag();
				echo '</div></td></tr>';
			}
		}
	}

	/**
     * @since 1.0.0
     * @access public
	 * @return string
	 */
	public function keynag() {
		return "<span style='color:red'>You're missing out on important updates because your license key is missing, invalid, or expired.</span>";
	}

	/**
	 * @since 1.0.0
     * @access public
	 */
	public function admin_scripts() {
		// Add the color picker css file
		wp_enqueue_style( 'wp-color-picker' );

		// Add media picker script
		wp_enqueue_media();

		// Include our custom jQuery file with WordPress Color Picker dependency
		wp_enqueue_script( 'objectiv-cfw-admin', CFW_URL . 'assets/admin/admin.js', array( 'jquery', 'wp-color-picker' ), CFW_VERSION );

		// Localize the script with new data
		$settings_array = array(
			'logo_attachment_id' => $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id'),
		);
		wp_localize_script( 'objectiv-cfw-admin', 'objectiv_cfw_admin', $settings_array );
    }

	/**
	 * add_notice_key_nag function
     *
     * @since 1.0.0
     * @acess public
	 */
	public function add_notice_key_nag() {
		$key_status = $this->plugin_instance->get_updater()->get_field_value('key_status');
		$license_key = $this->plugin_instance->get_updater()->get_field_value('license_key');

		if ( ! empty($_GET['cfw_welcome']) ) return;

		// Validate Key Status
		if ( empty($license_key) || ( ($key_status !== "valid" || $key_status == "inactive" || $key_status == "site_inactive") ) ) {
			$important = '';
		    if ( isset($_GET['page']) && $_GET['page'] == 'cfw-settings') {
		        $important = "style='display:block !important'";
            }
			echo "<div $important class='notice notice-error is-dismissible checkout-wc'> <p>" . $this->renew_or_purchase_nag($key_status, $license_key) . "</p></div>";
		}
	}

	public function add_stripe_wrong_version_notice() {
	    if ( defined('WC_STRIPE_VERSION') && version_compare(WC_STRIPE_VERSION, '4.0.0', '<') ) {
		    $important = '';
		    if ( isset($_GET['page']) && $_GET['page'] == 'cfw-settings') {
			    $important = "style='display:block !important'";
		    }
		    echo "<div $important class='notice notice-error is-dismissible checkout-wc'> <p>" . __( 'Checkout for WooCommerce requires WooCommerce Stripe Payment Gateway 4.x.x or higher. You currently have version ' . WC_STRIPE_VERSION . ' installed. Stripe will not work correctly.', CFW_TEXT_DOMAIN) . "</p></div>";
        }
    }

	/**
     * @since 1.0.0
     * @access public
	 * @param $key_status
	 * @param $license_key
	 * @return String The renewal or purchase notice.
	 */
	public function renew_or_purchase_nag( $key_status, $license_key ) {
		if ( $key_status == "expired" ) {
			return sprintf(__('Checkout for WooCommerce: Your license key appears to have expired. Please verify that your license key is valid or <a target="_blank" href="https://www.checkoutwc.com/checkout/?edd_license_key=%s">renew your license now</a> to restore full functionality.', $license_key), CFW_TEXT_DOMAIN);
		}

		return __( 'Checkout for WooCommerce: Your license key is missing or invalid. Please verify that your license key is valid or <a target="_blank" href="https://www.checkoutwc.com/">purchase a license</a> to restore full functionality.', CFW_TEXT_DOMAIN);
	}

	function add_welcome_notice() {
	    if ( ! empty($_GET['cfw_welcome']) ) {
	        echo "<div style='display:block !important' class='notice notice-info'><p>" . __('Thank you for installing Checkout for WooCommerce! To get started, click on <strong>License</strong> below and activate your license key!', CFW_TEXT_DOMAIN) . "</p></div>";
        }
    }

	function welcome_screen_do_activation_redirect() {
		// Bail if no activation redirect
		if ( ! get_transient( '_cfw_welcome_screen_activation_redirect' ) ) {
			return;
		}

		// Delete the redirect transient
		delete_transient( '_cfw_welcome_screen_activation_redirect' );

		// Bail if activating from network, or bulk
		if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
			return;
		}

		// Redirect to bbPress about page
		wp_safe_redirect( add_query_arg( array( 'page' => 'cfw-settings', 'cfw_welcome' => 'true' ), admin_url( 'options-general.php' ) ) );
    }

    function add_action_links( $links ) {
	    $settings_link = array(
		    '<a href="' . admin_url( 'options-general.php?page=cfw-settings' ) . '">' . __('Settings', CFW_TEXT_DOMAIN) . '</a>',
	    );

	    return array_merge( $settings_link, $links );
    }
}