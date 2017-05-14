<?php

namespace Objectiv\Plugins\Checkout\Core\Base;

use Objectiv\Plugins\Checkout\Core\Base\Tracked;

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

abstract class Assets extends Tracked {

	/**
	 * Asset file list in sub_folder => file pattern
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $asset_files
	 */
	private $asset_files;

	/**
	 * @since 0.1.0
	 * @access private
	 * @var string $id
	 */
	protected $id;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $id
	 * @param array $asset_files
	 */
	public function __construct( $id, $asset_files = array()) {
		parent::__construct($id);

		$this->id = $id;
		$this->asset_files = $asset_files;
	}

	/**
	 * @since 0.1.0
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Return the asset files list array
	 *
	 * @since 0.1.0
	 * @access public
	 */
	public function get_asset_files() {
		return $this->asset_files;
	}

	/**
	 * @since 0.1.0
	 * @param $version
	 */
	abstract public function load($version);
}