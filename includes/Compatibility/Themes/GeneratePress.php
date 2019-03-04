<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Themes;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class GeneratePress extends Base {
	function is_available() {
		return defined( 'GENERATE_VERSION' );
	}

	public function run() {
		add_action( 'wp', array( $this, 'remove_gp_scripts' ) );
	}

	function remove_gp_scripts() {
		if ( ! apply_filters('cfw_load_checkout_template', function_exists('is_checkout') && is_checkout() && ! is_order_received_page() && ! is_checkout_pay_page() ) ) {
			return;
		}

		remove_action( 'wp_enqueue_scripts', 'generatepress_wc_scripts', 100 );
	}
}
