<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\BoosterSeat\Managers\PathManager;

class CFWPathManager extends PathManager {

	/**
	 * @since 1.1.4
	 * @access private
	 * @var string The assets path
	 */
	private $assets;

	/**
	 * @since 1.1.4
	 * @access private
	 * @var string The plugin template path
	 */
	private $plugin_template;

	/**
	 * @since 1.1.4
	 * @access private
	 * @var string The theme template path
	 */
	private $theme_template;

	/**
	 * CFWPathManager constructor.
	 *
	 * @param string $base
	 * @param string $url_base
	 * @param string $main_file
	 */
	public function __construct( $base, $url_base, $main_file ) {
		parent::__construct( $base, $url_base, $main_file );

		$this->plugin_template = $this->get_base() . "templates";
		$this->assets = $this->get_url_base() . "assets";
		$this->theme_template = get_stylesheet_directory() . "/checkout-wc";
	}

	/**
	 * Get the path to the assets folder
	 *
	 * @since 1.1.4
	 * @access public
	 * @return string
	 */
	public function get_assets_path() {
		return $this->assets;
	}

	/**
	 * Returns the value of the theme_template variable
	 *
	 * @since 1.1.4
	 * @access public
	 * @return string The theme template path
	 */
	public function get_theme_template() {
		return $this->theme_template;
	}

	/**
	 * @since 1.1.4
	 * @access public
	 * @return string The plugin template path
	 */
	public function get_plugin_template() {
		return $this->plugin_template;
	}
}