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
	private $assets;

	/**
	 * The type of assets that can be hooked with class to instantiate
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
	 */
	public function __construct() {
		$this->asset_types = array(
			"admin"     => 'Objectiv\Plugins\Checkout\Core\Assets\AdminAssets',
			"front"     => 'Objectiv\Plugins\Checkout\Core\Assets\FrontAssets'
		);
		$this->assets = array();
	}

	/**
	 * Registers the asset paths and will enqueue the relevant items on the front and back end
	 *
	 * @since 0.1.0
	 * @access public
	 * @param PathManager $path_manager
	 * @param string $plugin_name
	 * @param string $version
	 */
	public function register_assets($path_manager, $plugin_name, $version) {
		// Loop over each assets type and register it
		foreach($this->asset_types as $asset_type => $class) {
			// Set the base path
			$asset_type_base_path = "{$path_manager->get_assets_path()}/{$asset_type}";

			// Create the assets type
			$this->assets[$asset_type] = new $class($plugin_name, $version, $asset_type_base_path);
		}
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
	 * Load the assets of the assets manager
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $type
	 */
	public function load_assets($type = null) {
		if($type) {
			$this->assets[$type]->load();
		} else {
			foreach($this->assets as $asset) {
				$asset->load();
			}
		}
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