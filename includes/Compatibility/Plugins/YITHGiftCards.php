<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class YITHGiftCards extends Base {
	public function is_available() {
		return defined( 'YITH_YWGC_PREMIUM' );
	}

	public function run() {
		add_action( 'wp_enqueue_scripts', array( $this, 'adjust_deps' ), 1000 );
	}

	function adjust_deps() {
		global $wp_scripts;

		if ( ! empty( $wp_scripts->registered['ywgc-frontend-script'] ) ) {
			$wp_scripts->registered['ywgc-frontend-script']->deps = array( 'jquery', 'jquery-ui-datepicker', 'accounting' );
		}
	}
}
