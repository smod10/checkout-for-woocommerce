<?php

namespace Objectiv\Plugins\Checkout\Managers;

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
	 * Contains the folder names that go under front and admin folders
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $sub_folders
	 */
	private $sub_folders;

	/**
	 * The relevant registered assets (most likely the images)
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $assets
	 */
	private $assets;

	/**
	 * AssetManager constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param PathManager $path_manager
	 */
	public function __construct($path_manager) {
		$this->sub_folders = array("css", "js", "images");
		$this->assets = array();

		$this->register_assets($path_manager);
	}

	/**
	 * Registers the asset paths and will enqueue the relevant items on the front and back end
	 *
	 * @since 0.1.0
	 * @access public
	 * @param PathManager $path_manager
	 */
	public function register_assets($path_manager) {
		// TODO: Implementation goes here
	}

	/**
	 * Return the asset sub folders array
	 *
	 * @since 0.1.0
	 * @access public
	 * @return array
	 */
	public function get_sub_folders() {
		return $this->sub_folders;
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
}