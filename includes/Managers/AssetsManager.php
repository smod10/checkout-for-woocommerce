<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Core\Assets;

/**
 * Handles the requiring and the passing back and forth of assets on the front end and in the back end on the admin side
 *
 * @since 0.1.0
 * @link cgd.io
 * @package Objectiv\Plugins\Checkout\Managers
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class AssetsManager {

	/**
	 * The relevant registered assets (most likely the images)
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $assets
	 */
	private $assets = array();

	/**
	 * The type of assets that can be hooked with class to instantiate
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $asset_types admin | front
	 */
	private $asset_types = array();

	/**
	 * Reference to the PathManager object
	 *
	 * @since 0.1.0
	 * @access private
	 * @var PathManager $path_manager
	 */
	private $path_manager = null;

	/**
	 * AssetManager constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 */
	public function __construct($pm) {
		$this->path_manager = $pm;
		$assets_path = $this->path_manager->get_assets_path();

		$admin = "$assets_path/admin";
		$front = "$assets_path/front";
		$bower = "$assets_path/global/bower";
		$js = "$assets_path/global/js";

		$this->asset_types = array(
			"admin"         => (object) array(
				"func"      => 'load_enqueue',
				"files"     => array(
					"css"   => array(
						(object) array(
							"path" => "$admin/css/checkout-woocommerce-admin.css",
							"attrs" => array()
						)
					),
					"js"    => array(
						(object) array(
							"path" => "$admin/js/checkout-woocommerce-admin.js",
							"attrs" => array()
						)
					)
				)
			),

			"front"         => (object) array(
				"func"      => 'load_echo',
				"files"     => array(
					"css"   => array(
						(object) array(
							"path" => "$front/css/checkout-woocommerce-front.css",
							"attrs" => array()
						)
					),
					"js"    => array(
						(object) array(
							"path" => "$bower/easytabs/vendor/jquery-1.7.1.min.js",
							"attrs" => array()
						),
						(object) array(
							"path" => "$bower/easytabs/vendor/jquery.hashchange.min.js",
							"attrs" => array()
						),
						(object) array(
							"path" => "$bower/requirejs/require.js",
							"attrs" => array()
						),
						(object) array(
							"path" => "$bower/easytabs/lib/jquery.easytabs.min.js",
							"attrs" => array()
						),
						(object) array(
							"path" => "$bower/garlicjs/dist/garlic.min.js",
							"attrs" => array()
						),
						(object) array(
							"path" => "$js/ArrayFindPoly.js",
							"attrs" => array()
						)
					)
				)
			)
		);
	}

	/**
	 * Returns the PathManager
	 *
	 * @return PathManager
	 */
	public function get_path_manager() {
		return $this->path_manager;
	}

	/**
	 * Return the assets of the assets manager
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $type
	 * @return array
	 * @return Assets
	 */
	public function get_assets($type = null) {
		if($type) {
			return $this->assets[$type];
		}

		return $this->assets;
	}

	/**
	 * Return the asset types
	 *
	 * @since 0.1.0
	 * @access public
	 * @return array
	 */
	public function get_asset_types() {
		return $this->asset_types;
	}

	/**
	 * Load the assets of the assets manager
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $version
	 * @param string $type
	 */
	public function load_assets($version, $type = null) {
		// Loop over each assets type and register it
		foreach($this->asset_types as $asset_type => $ops) {

			// Create a new Assets object
			$asset_set = new Assets($asset_type, $ops->files);

			// If the asset type is null or the asset type is equal to the set type. Load it
			if(!$type || $asset_type == $type) {
				$func = $ops->func;
				$asset_set->$func($version);
			}

			// Store the assets set
			$this->assets[$asset_type] = $asset_set;
		}
	}
}