<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Core\Base\Assets;

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
	 * AssetManager constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param array $assets;
	 */
	public function __construct($assets) {
		$this->assets = $assets;
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
	 * @param string    $version
	 * @param string    $type
	 * @param array     $additional
	 * @param boolean   $replace
	 */
	public function load_assets($version, $type = null, $additional = array(), $replace = false) {
		// Loop over each assets type and register it
		foreach($this->assets as $asset) {

			// If type isn't set, load them all. If type is set load just the type
			if(!$type || $asset->get_id() == $type) {
				if(!$replace) {
					$asset->load( $version );
				}

				if(count($additional) > 0) {
					foreach($additional as $add) {
						$add->load($version);
					}
				}
			}

		}
	}
}