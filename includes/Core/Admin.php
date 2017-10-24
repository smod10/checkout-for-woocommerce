<?php
/**
 * Admin class
 *
 * @since 1.0.0
 * @access private
 * @var string $version The current version of the plugin.
 */

namespace Objectiv\Plugins\Checkout\Core;

class Admin {
	var $plugin_instance;
	var $tabs;

	public function __construct( $plugin ) {
		$this->plugin_instance = $plugin;
	}

	public function start() {
	    // Admin Menu
		add_action('admin_menu', array($this, 'admin_menu'), 100 );

		// Key Nag
		add_action('admin_menu', array($this, 'add_key_nag'), 11);

        // Enqueue Admin Scripts
		add_action( 'admin_enqueue_scripts', array($this, 'admin_scripts') );

		// Admin notice
        add_action('admin_notices', array($this, 'add_notice_key_nag') );
	}

	function admin_menu() {
		// Initiate tab object
		$this->tabs = new \WP_Tabbed_Navigation('');

		add_options_page( __( 'Checkout for WooCommerce', 'checkout-wc' ), __( 'Checkout for WooCommerce', 'checkout-wc' ), "manage_options", "cfw-settings", array($this, "admin_page") );

		// Setup tabs
        $this->tabs->add_tab( __( 'General', 'checkout-wc' ), menu_page_url('cfw-settings', false) );
		$this->tabs->add_tab( __( 'Design', 'checkout-wc' ), add_query_arg( array('subpage' => 'design'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'License', 'checkout-wc' ), add_query_arg( array('subpage' => 'license'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'Support', 'checkout-wc' ), add_query_arg( array('subpage' => 'support'), menu_page_url('cfw-settings', false) ) );
	}

	function admin_page() {
	    $current_tab_function = $this->get_current_tab() === false ? 'general_tab' : $this->get_current_tab() . "_tab";
		?>
		<div class="wrap about-wrap" style="margin-left:2px;">

            <h1><?php _e('Checkout for WooCommerce', 'checkout-wc'); ?></h1>
            <p class="about-text"><?php _e( 'Checkout for WooCommerce provides a beautiful, conversion optimized checkout template for WooCommerce.' , 'checkout-wc' ); ?></p>
        </div>

        <div class="wrap">
            <?php $this->tabs->display_tabs(); ?>

            <?php $this->$current_tab_function(); ?>
		</div>
		<?php
	}

	function general_tab() {
	    ?>
        <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
			<?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>"><?php _e('Enable / Disable', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input type="hidden" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="no" />
                            <label><input type="checkbox" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" id="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="yes" <?php if ( $this->plugin_instance->get_settings_manager()->get_setting('enable') == "yes" ) echo "checked"; ?> /> <?php _e('Use Checkout for WooCommerce Template', 'checkout-wc'); ?></label>
                            <p><span class="description"><?php _e('Enable or disable Checkout for WooCommerce theme. (NOTE: Theme is always enabled for admin users.)', 'checkout-wc'); ?></span></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_scripts'); ?>"><?php _e('Header Scripts', 'checkout-wc'); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( stripslashes_deep( $this->plugin_instance->get_settings_manager()->get_setting('header_scripts') ), $this->plugin_instance->get_settings_manager()->get_field_name('header_scripts'), array('textarea_rows' => 6, 'quicktags' => false, 'media_buttons' => false) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('This code will output immediately before the closing <code>&lt;/head&gt;</code> tag in the document source.', 'checkout-wc'); ?>
                                </span>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_scripts'); ?>"><?php _e('Footer Scripts', 'checkout-wc'); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( stripslashes_deep( $this->plugin_instance->get_settings_manager()->get_setting('footer_scripts') ), $this->plugin_instance->get_settings_manager()->get_field_name('footer_scripts'), array('textarea_rows' => 6, 'quicktags' => false, 'media_buttons' => false) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('This code will output immediately before the closing <code>&lt;/body&gt;</code> tag in the document source.', 'checkout-wc'); ?>
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

    function design_tab() {
	    ?>
        <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
		    <?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>

            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row" valign="top">
						    <?php _e('Logo', 'checkout-wc'); ?>
                        </th>
                        <td>
                            <div class='image-preview-wrapper'>
                                <img id='image-preview' src='<?php echo wp_get_attachment_url( $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id') ); ?>' width='100' style='max-height: 100px; width: 100px;'>
                            </div>
                            <input id="upload_image_button" type="button" class="button" value="<?php _e( 'Upload image' ); ?>" />
                            <input type='hidden' name='<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('logo_attachment_id'); ?>' id='logo_attachment_id' value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id'); ?>">

                            <a class="delete-custom-img button secondary-button"><?php _e('Clear Logo', 'checkout-wc'); ?></a>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_background_color'); ?>"><?php _e('Header Background Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_background_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('header_background_color'); ?>" data-default-color="#ffffff" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_text_color'); ?>"><?php _e('Header Text Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('header_text_color'); ?>" data-default-color="#2b2b2b" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_background_color'); ?>"><?php _e('Footer Background Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_background_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('footer_background_color'); ?>" data-default-color="#ffffff" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_color'); ?>"><?php _e('Footer Text Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('footer_color'); ?>" data-default-color="#999999" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_text'); ?>"><?php _e('Footer Text', 'checkout-wc'); ?></label>
                        </th>
                        <td>
						    <?php wp_editor( $this->plugin_instance->get_settings_manager()->get_setting('footer_text'), $this->plugin_instance->get_settings_manager()->get_field_name('footer_text'), array('textarea_rows' => 5) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('If left blank, a standard copyright notice will be displayed. Set to a single space to override this behavior.', 'checkout-wc'); ?>
                                </span>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_color'); ?>"><?php _e('Primary Button Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('button_color'); ?>" data-default-color="#e9a81d" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_text_color'); ?>"><?php _e('Primary Button Text Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('button_text_color'); ?>" data-default-color="#000000" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_color'); ?>"><?php _e('Secondary Button Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('secondary_button_color'); ?>" data-default-color="#999999" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_text_color'); ?>"><?php _e('Secondary Button Text Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('secondary_button_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('secondary_button_text_color'); ?>" data-default-color="#ffffff" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('link_color'); ?>"><?php _e('Link Color', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('link_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('link_color'); ?>" data-default-color="#e9a81d" />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('custom_css'); ?>"><?php _e('Custom CSS', 'checkout-wc'); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( $this->plugin_instance->get_settings_manager()->get_setting('custom_css'), $this->plugin_instance->get_settings_manager()->get_field_name('custom_css'), array('textarea_rows' => 5, 'quicktags' => false, 'media_buttons' => false) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('Add Custom CSS rules to fully control the appearance of the checkout template.', 'checkout-wc'); ?>
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

    function license_tab() {
	    $this->plugin_instance->get_updater()->admin_page();
    }

    function support_tab() {
        ?>
        <script>!function(e,o,n){window.HSCW=o,window.HS=n,n.beacon=n.beacon||{};var t=n.beacon;t.userConfig={},t.readyQueue=[],t.config=function(e){this.userConfig=e},t.ready=function(e){this.readyQueue.push(e)},o.config={docs:{enabled:!1,baseUrl:""},contact:{enabled:!0,formId:"dd423b99-b372-11e7-b466-0ec85169275a"}};var r=e.getElementsByTagName("script")[0],c=e.createElement("script");c.type="text/javascript",c.async=!0,c.src="https://djtflbt20bdde.cloudfront.net/",r.parentNode.insertBefore(c,r)}(document,window.HSCW||{},window.HS||{});</script>
        <script>
            HS.beacon.config({
                modal: true,
                instructions: 'We can\'t wait to help you with Checkout for WooCommerce! Please fill out the following form and one of our support staff will respond within 12-24 hours. (average)',
            });
        </script>

        <h3>Need help?</h3>
        <p>Excellent support is in our DNA.</p><p>If you need help with anything at all, please click this button to file a support request:</p>
	    <?php submit_button('Support Request', 'primary', false, false, array('id'=> 'checkoutwc-support-button') ); ?>

        <script>
            jQuery("#checkoutwc-support-button").click(function() {
                HS.beacon.open();
            });
        </script>
        <?php
    }

	function get_current_tab() {
	    return empty($_GET['subpage']) ? false : $_GET['subpage'];
    }

	function add_key_nag() {
		global $pagenow;

		if( $pagenow == 'plugins.php' ) {
			add_action( 'after_plugin_row_' . $this->plugin_instance->get_path_manager()->get_base(), array($this, 'after_plugin_row_message'), 10, 2 );
		}
	}

	function after_plugin_row_message() {
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

	function keynag() {
		return "<span style='color:red'>You're missing out on important updates because your license key is missing, invalid, or expired.</span>";
	}

	function admin_scripts() {
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
	 */
	function add_notice_key_nag() {
		$key_status = $this->plugin_instance->get_updater()->get_field_value('key_status');
		$license_key = $this->plugin_instance->get_updater()->get_field_value('license_key');

		// Validate Key Status
		if ( empty($license_key) || ( ($key_status !== "valid" || $key_status == "inactive" || $key_status == "site_inactive") ) ) {
			echo "<div class='notice notice-error is-dismissible'> <p>" . $this->renew_or_purchase_nag($key_status, $license_key) . "</p></div>";
		}
	}

	/**
	 * @param $key_status
	 * @param $license_key
	 *
	 * @return String The renewal or purchase notice.
	 */
	function renew_or_purchase_nag( $key_status, $license_key ) {
		if ( true || $key_status == "expired" ) {
			return sprintf(__('Checkout for WooCommerce: Your license key appears to have expired. Please verify that your license key is valid or <a target="_blank" href="https://www.checkoutwc.com/checkout/?edd_license_key=%s">renew your license now</a> to restore full functionality.', $license_key), 'checkout-wc');
		}

		return __( 'Checkout for WooCommerce: Your license key is missing or invalid. Please verify that your license key is valid or <a target="_blank" href="https://www.checkoutwc.com/">purchase a license</a> to restore full functionality.', 'checkout-wc');
	}
}