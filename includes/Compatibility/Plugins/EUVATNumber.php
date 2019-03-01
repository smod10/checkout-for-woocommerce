<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class EUVATNumber extends Base {
	public function is_available() {
		return class_exists( '\\WC_EU_VAT_Number' );
	}

	public function run() {
		add_action( 'cfw_checkout_after_payment_tab_billing_address', array( 'WC_EU_VAT_Number', 'vat_number_field' ) );
		add_action( 'wp_enqueue_scripts', array($this, 'adjust_deps'), 1000 );
	}

	function adjust_deps() {
		global $wp_scripts;

		if ( ! empty($wp_scripts->registered['wc-eu-vat']) ) {
			$wp_scripts->registered['wc-eu-vat']->deps = array('jquery');
		}
	}
}
