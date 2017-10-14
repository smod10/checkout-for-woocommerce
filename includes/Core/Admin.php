<?php
/**
 * Admin class
 *
 * @since 0.1.0
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

		// Initiate tab object
        $this->tabs = new \WP_Tabbed_Navigation( __( 'Checkout for WooCommerce', 'cfw' ) );
	}

	function admin_menu() {
		add_options_page( __( 'Checkout for WooCommerce', 'cfw' ), __( 'Checkout for WooCommerce', 'cfw' ), "manage_options", "cfw-settings", array($this, "admin_page") );

		// Setup tabs
        $this->tabs->add_tab( __( 'Welcome', 'cfw' ), menu_page_url('cfw-settings', false) );
		$this->tabs->add_tab( __( 'Design', 'cfw' ), add_query_arg( array('subpage' => 'design'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'License', 'cfw' ), add_query_arg( array('subpage' => 'license'), menu_page_url('cfw-settings', false) ) );
	}

	function admin_page() {
		?>
		<div class="wrap">
            <?php $this->tabs->display_tabs(); ?>

            <?php if ( $this->get_current_tab() == "license" ): ?>
                <?php $this->plugin_instance->get_updater()->admin_page(); ?>
            <?php else: ?>
                <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
                    <?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>
                    <table class="form-table">
                        <tbody>

                        <?php if ( $this->get_current_tab() === false ): ?>
                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>"><?php _e('Enable Template', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input type="hidden" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="no" />
                                <label><input type="checkbox" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" id="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="yes" <?php if ( $this->plugin_instance->get_settings_manager()->get_setting('enable') == "yes" ) echo "checked"; ?> /> <?php _e('Enable Checkout for WooCommerce', 'cfw'); ?></label>
                                <p class="description">When disabled, only admin users will see Checkout for WooCommerce checkout theme.</p>
                            </td>
                        </tr>
                        <?php endif; ?>

                        <?php if ( $this->get_current_tab() == "design" ): ?>
                        <tr>
                            <th scope="row" valign="top">
                                Logo
                            </th>
                            <td>
                                <div class='image-preview-wrapper'>
                                    <img id='image-preview' src='<?php echo wp_get_attachment_url( $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id') ); ?>' width='100' style='max-height: 100px; width: 100px;'>
                                </div>
                                <input id="upload_image_button" type="button" class="button" value="<?php _e( 'Upload image' ); ?>" />
                                <input type='hidden' name='<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('logo_attachment_id'); ?>' id='logo_attachment_id' value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id'); ?>">

                                <a class="delete-custom-img button secondary-button">Clear Logo</a>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_background_color'); ?>"><?php _e('Header Background Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_background_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('header_background_color'); ?>" data-default-color="#000000" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_text_color'); ?>"><?php _e('Header Text Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('header_text_color'); ?>" data-default-color="#ffffff" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_shadow_color'); ?>"><?php _e('Header Shadow Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_shadow_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('header_shadow_color'); ?>" data-default-color="#000000" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_background_color'); ?>"><?php _e('Footer Background Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_background_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('footer_background_color'); ?>" data-default-color="#000000" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_color'); ?>"><?php _e('Footer Text Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('footer_color'); ?>" data-default-color="#ffffff" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_text'); ?>"><?php _e('Footer Text', 'cfw'); ?></label>
                            </th>
                            <td>
                                <?php wp_editor( $this->plugin_instance->get_settings_manager()->get_setting('footer_text'), $this->plugin_instance->get_settings_manager()->get_field_name('footer_text'), array('textarea_rows' => 5) ); ?>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('link_color'); ?>"><?php _e('Link Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('link_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('link_color'); ?>" data-default-color="#e9a81d" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_color'); ?>"><?php _e('Button Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('button_color'); ?>" data-default-color="#e9a81d" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_text_color'); ?>"><?php _e('Button Text Color', 'cfw'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('button_text_color'); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('button_text_color'); ?>" data-default-color="#000000" />
                            </td>
                        </tr>

                        <?php endif; ?>

                        </tbody>
                    </table>

                    <?php submit_button(); ?>
                </form>

            <?php endif; ?>

		</div>
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
}