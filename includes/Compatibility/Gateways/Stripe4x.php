<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Stripe4x extends Base {
	private $_CompatibilityManager;

	public function __construct( $CompatibilityManager ) {
		parent::__construct();

		$this->_CompatibilityManager = $CompatibilityManager;
	}

	function is_available() {
		if ( class_exists( '\\WC_Stripe' ) && defined('WC_STRIPE_VERSION') ) {
			if ( version_compare(WC_STRIPE_VERSION, '4.0.0') >= 0 && version_compare(WC_STRIPE_VERSION, '5.0.0', '<') ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * TODO: Implement this when Stripe implements it
	 */
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