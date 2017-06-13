<?php

namespace Objectiv\Plugins\Checkout\Assets;

use Objectiv\Plugins\Checkout\Core\Base\Assets;

/**
 * Class FrontAssets
 * @package Objectiv\Plugins\Checkout\Assets
 */
class FrontAssets extends Assets {

	/**
	 * FrontAssets constructor.
	 *
	 * @param string $id
	 * @param array $asset_files
	 */
	public function __construct( $id, array $asset_files = array() ) {
		parent::__construct( $id, $asset_files );
	}

	/**
	 * @param $version
	 */
	public function load($version) {

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
}
