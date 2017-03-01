<?php

namespace Objectiv\Plugins\Checkout\Language;

use Objectiv\Plugins\Checkout\Managers\PathManager;

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link cgd.io
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Language
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class i18n {

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param PathManager $path_manager
	 */
	public function load_plugin_textdomain($path_manager) {
		load_plugin_textdomain(
			'checkout-woocommerce',
			false,
			dirname( plugin_basename( $path_manager->get_path_main_file() ) ) . '/languages'
		);
	}
}