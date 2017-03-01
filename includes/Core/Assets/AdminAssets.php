<?php
/**
 * Created by PhpStorm.
 * User: brandontassone
 * Date: 3/1/17
 * Time: 12:17 AM
 */

namespace Objectiv\Plugins\Checkout\Core\Assets;

use Objectiv\Plugins\Checkout\Core\Assets;

/**
 * AdminAssets is a child class specifically used for implementing the logic side of the Assets abstract class. The two
 * key pieces (__toString) and load are implemented. The load function is called in the load_actions method of the Main
 * class
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout\Core\Assets
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class AdminAssets extends Assets {

	/**
	 * AdminAssets constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $plugin_name
	 * @param string $version
	 * @param string $base_path
	 */
	public function __construct( $plugin_name, $version, $base_path ) {
		parent::__construct( $plugin_name, $version, $base_path );
	}

	/**
	 *  The admin assets load method. Handles outputting the specific files or registering them if need be
	 *
	 * @since 0.1.0
	 * @access public
	 */
	public function load() {
		// TODO: Implement admin side load method
	}

	/**
	 * The folder name of the assets type
	 *
	 * @since 0.1.0
	 * @access public
	 * @return string
	 */
	public function __toString() {
		return 'admin';
	}
}