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

	public function __construct( $plugin ) {
		$this->plugin_instance = $plugin;
	}

	public function start() {
		add_action('admin_menu', array($this, 'admin_menu'), 100 );
	}

	function admin_menu() {
		add_options_page("Checkout for WooCommerce", "Checkout for WooCommerce", "manage_options", "cfw-settings", array($this, "admin_page") );
	}

	function admin_page() {
		?>
		<div class="wrap">
			<h2>Checkout for WooCommerce</h2>

			<form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
				<?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>

				<table class="form-table">
					<tbody>
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

					</tbody>
				</table>

				<?php submit_button('Save'); ?>
			</form>
		</div>
		<?php
	}
}