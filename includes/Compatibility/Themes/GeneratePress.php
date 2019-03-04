<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Themes;

use Objectiv\Plugins\Checkout\Compatibility\Base;
use Objectiv\Plugins\Checkout\Main;

class GeneratePress extends Base {
	function is_available() {
		return defined( 'GENERATE_VERSION' );
	}

	public function run() {
		add_action( 'wp', array( $this, 'remove_gp_scripts' ) );
	}

	function remove_gp_scripts() {
		if ( ! Main::is_checkout() ) {
			return;
		}

		remove_action( 'wp_enqueue_scripts', 'generatepress_wc_scripts', 100 );
	}
}
