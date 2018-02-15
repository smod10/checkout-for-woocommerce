<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

class SkyVergeCheckoutAddons {
	public function __construct() {
		add_filter('wc_checkout_add_ons_position', array($this, 'set_checkout_add_ons_position') );

		// Allow scripts and styles for certain plugins
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
		add_filter('cfw_allowed_style_handles', array($this, 'allowed_styles') );
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