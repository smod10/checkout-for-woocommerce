<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PixelCat extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return defined( 'FCA_PC_PLUGIN_DIR' );
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'fca_pc_client_js';

		return $scripts;
	}
}
