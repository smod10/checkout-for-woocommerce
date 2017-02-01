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
 * @since             1.0.0
 * @package           Midas
 *
 * @wordpress-plugin
 * Plugin Name:       Midas
 * Plugin URI:        https://cgd.io/
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Brandon Tassone
 * Author URI:        https://cgd.io/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       midas
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/*
 * Require the autoloader once and load in the main class.
 * Minimum base namespace for project is Objective\Plugins\Midas
 */
require_once "vendor/autoload.php";

use Objective\Plugins\Midas\Main;
use Objective\Plugins\Midas\Activator;
use Objective\Plugins\Midas\Deactivator;

function activate_midas() {
	Activator::activate();
}

function deactivate_midas() {
	Deactivator::deactivate();
}

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_midas() {

	$plugin = new Main();
	$plugin->run();

}
run_midas();