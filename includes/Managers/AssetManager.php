<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Main;
use Objectiv\Plugins\Checkout\Core\Assets;

/**
 * Manages the admin and front end assets (css, images, js)
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout\Managers
 */

/**
 * Handles the requiring and the passing back and forth of assets on the front end and in the back end on the admin side
 *
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Managers
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class AssetManager {

	/**
	 * The relevant registered assets (most likely the images)
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $assets
	 */
	private $assets;

	/**
	 * The type of assets that can be hooked
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $asset_types admin | front
	 */
	private $asset_types;

	/**
	 * AssetManager constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param PathManager $path_manager
	 */
	public function __construct($path_manager) {
		$this->asset_types = array("admin", "front");
		$this->assets = array();
	}

	/**
	 * Registers the asset paths and will enqueue the relevant items on the front and back end
	 *
	 * @since 0.1.0
	 * @access public
	 * @param PathManager $path_manager
	 */
	public function register_assets($path_manager, $plugin_name, $version) {
		foreach($this->asset_types as $asset_type) {
			$asset_type_base_path = "{$path_manager->get_assets_path()}/{$asset_type}";
			$this->assets[$asset_type] = new Assets($plugin_name, $version, $asset_type, $asset_type_base_path);
		}
	}

	/**
	 * Return the assets of the asset manager
	 *
	 * @since 0.1.0
	 * @access public
	 * @return array
	 */
	public function get_assets() {
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
}