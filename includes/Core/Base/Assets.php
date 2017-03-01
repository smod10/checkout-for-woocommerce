<?php

namespace Objectiv\Plugins\Checkout\Core\Base;

/**
 * Abstract base class with some baked in limited functionality. Front and Admin asset classes are extended from this
 * to handle the specific front and back end loading cycles of the assets required.
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout\Core\Base
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

abstract class Assets {

	/**
	 * The ID of this plugin.
	 *
	 * @since 0.1.0
	 * @access protected
	 * @var string $plugin_name
	 */
	protected $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since 0.1.0
	 * @access protected
	 * @var string $version
	 */
	protected $version;

	/**
	 * The base path of this asset type
	 *
	 * @since 0.1.0
	 * @access private
	 * @var string $base_path
	 */
	private $base_path;

	/**
	 * Asset file list in sub_folder => file pattern
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $asset_files
	 */
	private $asset_files;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $plugin_name The name of the plugin.
	 * @param string $version The version of this plugin.
	 * @param string $base_path base path of the asset
	 */
	public function __construct( $plugin_name, $version, $base_path ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->base_path = $base_path;
		$this->asset_files = array(
			"css"   => ["checkout-woocommerce-{$this}.css"],
			"js"    => ["checkout-woocommerce-{$this}.js"]
		);
	}

	/**
	 * Return the asset files list array
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function get_asset_files() {
		return $this->asset_files;
	}

	/**
	 * Return the base path of the asset
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function get_base_path() {
		return $this->base_path;
	}

	/**
	 * How the assets are loaded. Override in a base class.
	 *
	 * @since 0.1.0
	 * @access public
	 */
	abstract public function load();

	/**
	 * The main folder name of the asset. Override in a base class.
	 *
	 * @since 0.1.0
	 * @access public
	 */
	abstract public function __toString();
}