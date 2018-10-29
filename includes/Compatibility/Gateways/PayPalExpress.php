<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PayPalExpress extends Base {

	private $_CompatibilityManager;

	public function __construct( $CompatibilityManager ) {
		parent::__construct();

		$this->_CompatibilityManager = $CompatibilityManager;
	}

	public function is_available() {
		return ( function_exists( 'wc_gateway_ppec' ) && wc_gateway_ppec()->settings->is_enabled() );
	}

	public function run() {
		// Add PayPal Express Checkout Button
		add_action( 'wp', array( $this, 'add_paypal_express_to_checkout' ) );
	}

	public function add_paypal_express_to_checkout() {
		if ( is_checkout() ) {
			// Remove "OR" separator
			remove_all_actions( 'woocommerce_proceed_to_checkout' );

			// Add button above customer info tab
			// 0 puts us above the stripe apple pay button if it's there so we can use it's separator
			add_action( 'cfw_checkout_before_customer_info_tab', array( wc_gateway_ppec()->cart, 'display_paypal_button' ), 0 );

			$gateways = WC()->payment_gateways->get_available_payment_gateways();
			$settings = wc_gateway_ppec()->settings;

			// Don't add the separator if PayPal Express isn't actually active
			if ( ! isset( $gateways['ppec_paypal'] ) || 'no' === $settings->cart_checkout_enabled ) {
				return;
			}

			add_action( 'cfw_checkout_before_customer_info_tab', array( $this, 'add_separator' ), 10 );
		}
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'wc-gateway-ppec-frontend-in-context-checkout';
		$scripts[] = 'paypal-checkout-js';

		return $scripts;
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'wc-gateway-ppec-frontend-cart';

		return $styles;
	}
}
