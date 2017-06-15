<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              getcheckout.co
 * @since             0.1.0
 * @package           Objectiv\Plugins\Checkout
 *
 * @wordpress-plugin
 * Plugin Name:       Checkout for WooCommerce
 * Plugin URI:        https://getcheckout.co/
 * Description:       Beautiful, conversion optimized checkout template for WooCommerce.
 * Version:           1.0.0
 * Author:            Brandon Tassone
 * Author URI:        https://objectiv.co
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       checkout-woocommerce
 * Domain Path:       /languages
 */

/**
 * If this file is called directly, abort.
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

define('CFW_NAME', 'Checkout for WooCommerce');
define('CFW_UPDATE_URL', 'https://www.getcheckout.co');

/**
 * Auto-loader (composer)
 */
require_once "vendor/autoload.php";

use Objectiv\Plugins\Checkout\Main;

/**
 * Kint disabled by default. Enable by enabling developer mode (see docs)
 */
Kint::enabled(false);

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function cfw_plugin_init() {

	global $cfw;

	$cfw = Main::instance();
	$cfw->run(__FILE__);

}
cfw_plugin_init();

// Use the global instance
global $cfw;

/**
 * Activation hook
 */
register_activation_hook( __FILE__, array($cfw, 'activation') );

/**
 * Deactivation hook
 */
register_deactivation_hook( __FILE__, array($cfw, 'deactivation') );

/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

if ( is_admin() && ! wp_doing_ajax() ) {
	global $cfw_admin, $cfw;

	$cfw_admin = new \Objectiv\Plugins\Checkout\Core\Admin( $cfw );
	$cfw_admin->start();
}