<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              brandont.me
 * @since             0.1.0
 * @package           Objectiv\Plugins\Checkout
 *
 * @wordpress-plugin
 * Plugin Name:       Checkout
 * Plugin URI:        https://cgd.io/
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Brandon Tassone
 * Author URI:        https://cgd.io/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       checkout
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once "vendor/autoload.php";

use Objectiv\Plugins\Checkout\Main as Main;
use Objectiv\Plugins\Checkout\Activator as Activator;
use Objectiv\Plugins\Checkout\Deactivator as Deactivator;

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-midas-activator.php
 */
function activate_checkout() {
    Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-midas-deactivator.php
 */
function deactivate_checkout() {
    Deactivator::deactivate();
}

register_activation_hook( __FILE__, '\activate_checkout' );
register_deactivation_hook( __FILE__, '\deactivate_checkout' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_checkout() {

	$plugin = new Main();
	$plugin->run();

}
run_checkout();