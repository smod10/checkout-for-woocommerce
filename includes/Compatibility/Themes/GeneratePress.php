<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Themes;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class GeneratePress extends Base {
	function is_available() {
		return defined( 'GENERATE_VERSION' );
	}

	public function run() {
		remove_action( 'wp_enqueue_scripts', 'generatepress_wc_scripts', 100 );
	}
}
