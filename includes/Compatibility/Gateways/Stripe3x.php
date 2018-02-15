<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

class Stripe3x {
	private $_CompatibilityManager;
	public $wc_stripe_apple_pay;

	public function __construct( $CompatibilityManager ) {
		$this->_CompatibilityManager = $CompatibilityManager;

		// Apple Pay
		add_action('wp', array($this, 'add_stripe_apple_pay') );

		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function add_stripe_apple_pay() {
		// Setup Apple Pay
		if ( class_exists('\\WC_Stripe_Apple_Pay') && is_checkout() ) {
			$this->wc_stripe_apple_pay = new \WC_Stripe_Apple_Pay();
			$gateways = WC()->payment_gateways->get_available_payment_gateways();

			if ( ! method_exists($this->wc_stripe_apple_pay, 'display_apple_pay_button') ) return;

			// Display button
			add_action( 'cfw_checkout_before_customer_info_tab', array(
				$this->wc_stripe_apple_pay,
				'display_apple_pay_button'
			), 1 );

			// If Apple Pay is off or stripe isn't enabled, bail
			if ( !  $this->wc_stripe_apple_pay->apple_pay || ! isset( $gateways['stripe'] ) ) {
				return;
			}

			if ( ! has_action('cfw_checkout_before_customer_info_tab', array($this->_CompatibilityManager, 'add_separator') ) ) {
				add_action('cfw_checkout_before_customer_info_tab', array($this, 'add_apple_pay_separator'), 10);
			}
		}
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