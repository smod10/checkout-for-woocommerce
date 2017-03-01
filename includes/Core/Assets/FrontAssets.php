<?php

namespace Objectiv\Plugins\Checkout\Core\Assets;

use Objectiv\Plugins\Checkout\Core\Base\Assets;

/**
 * FrontAssets is a child class specifically used for implementing the logic side of the Assets abstract class. The two
 * key pieces (__toString) and load are implemented. The load function is called in the Redirect class checkout method
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout\Core\Assets
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class FrontAssets extends Assets {

	/**
	 * FrontAssets constructor.
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
	 *  The front end assets load method. Handles outputting the specific files
	 *
	 * @since 0.1.0
	 * @access public
	 */
	public function load() {
		foreach($this->get_asset_files() as $folder => $files) {
			foreach($files as $file) {

				// Asset path (assets/base_path/folder/file)
				$path = "{$this->get_base_path()}/$folder/$file";

				switch($folder) {
					case 'css':
						$out = "<link rel='stylesheet' href='$path?ver=$this->version' type='text/css' media='all' />";
						break;
					case 'js':
						$out = "<script type='text/javascript' src='$path?ver=$this->version'></script>";
						break;
					default:
						$out = "";
				}

				echo $out;
			}
		}
	}

	/**
	 * The folder name of the assets type
	 *
	 * @since 0.1.0
	 * @access public
	 * @return string
	 */
	public function __toString() {
		return 'front';
	}
}