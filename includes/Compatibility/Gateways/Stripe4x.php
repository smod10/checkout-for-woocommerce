<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Stripe4x extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		if ( class_exists( '\\WC_Stripe' ) && defined( 'WC_STRIPE_VERSION' ) ) {
			if ( version_compare( WC_STRIPE_VERSION, '4.0.0' ) >= 0 && version_compare( WC_STRIPE_VERSION, '5.0.0', '<' ) ) {
				return true;
			}
		}

		return false;
	}

	function run() {
		// Apple Pay
		add_action( 'wp', array( $this, 'add_stripe_apple_pay' ) );
	}

	function add_stripe_apple_pay() {
		// Setup Apple Pay
		if ( class_exists( '\\WC_Stripe_Payment_Request' ) && is_checkout() ) {
			$stripe_payment_request = \WC_Stripe_Payment_Request::instance();

			if ( class_exists( '\\WC_Stripe_Apple_Pay_Registration' ) ) {
				$apple_pay_reg = new \WC_Stripe_Apple_Pay_Registration();

				if ( $apple_pay_reg->stripe_enabled && $apple_pay_reg->apple_pay_domain_set && $apple_pay_reg->payment_request ) {
					add_filter( 'wc_stripe_show_payment_request_on_checkout', '__return_true' );
					add_action( 'cfw_checkout_before_customer_info_tab', array( $stripe_payment_request, 'display_payment_request_button_html' ), 1 );
					add_action( 'cfw_checkout_before_customer_info_tab', array( $this, 'add_apple_pay_separator' ), 2 );
				}
			}
		}
	}

	/**
	 * TODO: Implement this when Stripe implements it
	 */
	function add_apple_pay_separator() {
		$this->add_separator( '', 'wc-stripe-payment-request-button-separator', 'margin-top: 1.5em; text-align: center;' );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'stripe';
		$scripts[] = 'stripe_checkout';
		$scripts[] = 'wc-stripe-payment-request';
		$scripts[] = 'woocommerce_stripe';
		$scripts[] = 'woocommerce_stripe_apple_pay';
		$scripts[] = 'jquery-payment';
		$scripts[] = 'wc_stripe_payment_request';

		return $scripts;
	}
}
