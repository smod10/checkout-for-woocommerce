<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

class Stripe4x {
	private $_CompatibilityManager;

	public function __construct( $CompatibilityManager ) {
		$this->_CompatibilityManager = $CompatibilityManager;

		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function add_apple_pay_separator() {
		$this->_CompatibilityManager->add_separator('apple-pay-button-checkout-separator');
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'stripe';
		$scripts[] = 'stripe_checkout';
		$scripts[] = 'wc-stripe-payment-request';
		$scripts[] = 'woocommerce_stripe';
		$scripts[] = 'woocommerce_stripe_apple_pay';

		return $scripts;
	}
}