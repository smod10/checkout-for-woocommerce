<?php

namespace Objectiv\Plugins\Checkout\Assets;

use Objectiv\Plugins\Checkout\Core\Base\Assets;

class AdminAssets extends Assets {

	public function __construct( $id, array $asset_files = array() ) {
		parent::__construct( $id, $asset_files );
	}

	/**
	 * @param $version
	 */
	public function load($version) {
		// TODO: Admin assets go here
	}
}