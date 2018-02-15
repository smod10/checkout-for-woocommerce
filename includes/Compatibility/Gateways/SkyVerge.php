<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

class SkyVerge {
	public function __construct() {
		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'sv-wc-payment-gateway-payment-form';

		return $scripts;
	}

	function allowed_styles() {
		$styles[] = 'sv-wc-payment-gateway-my-payment-methods';
		$styles[] = 'sv-wc-payment-gateway-payment-form';

		return $styles;
	}
}