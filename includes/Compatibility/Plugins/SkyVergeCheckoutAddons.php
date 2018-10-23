<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class SkyVergeCheckoutAddons extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return function_exists( 'init_woocommerce_checkout_add_ons' );
	}

	public function run() {
		add_filter( 'wc_checkout_add_ons_position', array( $this, 'set_checkout_add_ons_position' ) );
	}

	function set_checkout_add_ons_position() {
		return 'cfw_checkout_before_payment_method_terms_checkbox';
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'plupload-all';
		$scripts[] = 'wc-checkout-add-ons-frontend';
		$scripts[] = 'selectWoo';

		return $scripts;
	}

	function allowed_styles( $styles ) {
		// Checkout Add-ons
		$styles[] = 'wc-checkout-add-ons-frontend';
		$styles[] = 'select2';

		return $styles;
	}
}
