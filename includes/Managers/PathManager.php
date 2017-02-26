<?php

namespace Objectiv\Plugins\Checkout\Managers;

/**
 * Manages plugin related path information
 *
 * @link       cgd.io
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout\Managers
 */


/**
 * Class PathManager
 *
 * Manages plugin related path information.
 *
 * This class is mainly used in the template manager and other classes related to plugin setup and file management
 *
 * @package Objectiv\Plugins\Checkout\Managers
 * @author Brandon Tassone
 */

class PathManager {
	/**
	 * @var string The base path to the plugin
	 */
	private $base = '';
	/**
	 * @var string The main file name that initiates the plugin
	 */
	private $main_file = '';

	/**
	 * PathManager constructor.
	 *
	 * @param string $base The plugin base path
	 * @param string $main_file The main plugin file
	 */
	public function __construct($base, $main_file) {
		$this->base = $base;
		$this->main_file = $main_file;
	}

	/**
	 * Return the base plugin path
	 *
	 * @since 0.1.0
	 * @return string
	 */
	public function get_base() {
		return $this->base;
	}

	/**
	 * Return the main file name
	 *
	 * @since 0.1.0
	 * @return string
	 */
	public function get_main_file() {
		return $this->main_file;
	}

	/**
	 * Returns the concatenated folder name with the main file name in one strong
	 *
	 * @since 0.1.0
	 * @return string    Returns the concatenated folder name with the main file name in one strong
	 */
	public function get_path_main_file() {
		return $this->base . "/" . $this->main_file;
	}
}