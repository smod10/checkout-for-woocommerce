<?php
/**
 * Created by PhpStorm.
 * User: brandontassone
 * Date: 2/26/17
 * Time: 4:20 PM
 */

namespace Objectiv\Plugins\Checkout\Core;

/**
 * The public-facing functionality of the plugin.
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout\Core
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package Objectiv\Plugins\Checkout\Core
 * @author Brandon Tassone <brandontassone@gmail.com>
 */
class Assets {

	/**
	 * The ID of this plugin.
	 *
	 * @since 0.1.0
	 * @access private
	 * @var string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since 0.1.0
	 * @access private
	 * @var string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * The type of assets this assets class contains (front end, admin)
	 *
	 * @since 0.1.0
	 * @access private
	 * @var string $version The current version of this plugin.
	 */
	private $type;

	/**
	 * The base path of this asset type
	 *
	 * @since 0.1.0
	 * @access private
	 * @var string $base_path The current base path of this asset type
	 */
	private $base_path;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $plugin_name The name of the plugin.
	 * @param string $version The version of this plugin.
	 * @param string $type admin | front
	 * @param string $base_path base path of the asset
	 */
	public function __construct( $plugin_name, $version, $type, $base_path ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->type = $type;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since 0.1.0
	 * @access public
	 */
	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name, "{$this->base_path}/css/{$this->type}.css", array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->plugin_name, "{$this->base_path}/js/checkout-woocommerce-{$this->type}.js", array( 'jquery' ), $this->version, false );
	}

	/**
	 * Return the asset type
	 *
	 * @since    1.0.0
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * Return the base path of the asset
	 *
	 * @since    1.0.0
	 */
	public function get_base_path() {
		return $this->base_path;
	}

}