<?php

namespace Objectiv\Plugins\Checkout\Core;

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

class Assets extends Tracked {

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
	 * @param $version
	 */
	public function load_echo($version) {

		foreach($this->get_asset_files() as $folder => $files) {
			foreach($files as $file_info) {

				$attrs = "";

				foreach($file_info->attrs as $key => $value) {
					$attrs .= " $key=\"$value\"";
				}

				switch($folder) {
					case 'css':
						$out = "<link rel='stylesheet' href='$file_info->path?ver=$version' type='text/css' media='all' $attrs />";
						break;
					case 'js':
						$out = "<script type='text/javascript' src='$file_info->path?ver=$version' $attrs></script>";
						break;
					default:
						$out = "";
				}

				echo $out;
			}
		}
	}

	/**
	 * @param $version
	 */
	public function load_enqueue($version) {
		// TODO: Admin assets go here
	}
}