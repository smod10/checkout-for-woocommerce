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

	/**
	 * Determines where each sub folder file is actually located. Theme template files take precedence over plugin
	 * template files returned in the array.
	 *
	 * @since 1.1.4
	 * @access public
	 * @param array $sub_folders List of folder names within the template directories to look for template files.
	 * @param array $file_names Names of the file template pieces to look for
	 * @return array
	 */
	public function get_template_information($sub_folders, $file_names) {
		$template_information = array();

		foreach($sub_folders as $template_folder) {

			foreach($file_names as $file_piece_name => $file_name) {
				// Set up the possible paths
				$plugin_template_path = $this->plugin_template . "/" . $template_folder . "/{$file_name}";
				$theme_template_path = $this->theme_template . "/" . $template_folder . "/{$file_name}";

				// Get the template path we want (user overloaded, or base)
				$template_path = file_exists($theme_template_path) ? $theme_template_path : $plugin_template_path;

				// Add the appropriate paths to the template information array.
				$template_information[$template_folder][$file_piece_name] = $template_path;
			}
		}
		return $template_information;
	}
}