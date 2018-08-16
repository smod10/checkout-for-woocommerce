<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PayPalForWooCommerce extends Base {

	private $_CompatibilityManager;
	private $gateway_instance;

	public function __construct( $CompatibilityManager ) {
		parent::__construct();

		$this->_CompatibilityManager = $CompatibilityManager;
	}

	public function is_available() {
		if ( ! class_exists('WC_Payment_Gateways') ) return false;

		$gateways = \WC_Payment_Gateways::instance()->payment_gateways();

		if ( isset( $gateways['paypal_express'] ) && class_exists( 'AngellEYE_Gateway_Paypal' ) ) {
			$this->gateway_instance = $gateways['paypal_express'];

			return true;
		}

		return false;
	}

	public function run() {
		// Add PayPal Express Checkout Button
		add_action('wp', array($this, 'add_paypal_express_to_checkout') );
	}

	public function add_paypal_express_to_checkout() {
		global $wp_filter;

		if ( is_checkout() ) {
			// Remove "OR" separator
			remove_all_actions( 'woocommerce_proceed_to_checkout');

			$existing_hooks = $wp_filter['woocommerce_before_checkout_form'];
			$WC_Gateway_PayPal_Express_AngellEYE = false;

			foreach ( $existing_hooks[5] as $key => $callback ) {
				if ( false !== stripos($key, 'checkout_message') ) {
					$WC_Gateway_PayPal_Express_AngellEYE = $callback['function'][0];

					if ( $WC_Gateway_PayPal_Express_AngellEYE->show_on_checkout == 'top' || $WC_Gateway_PayPal_Express_AngellEYE->show_on_checkout == 'both' ) {
						// Add button above customer info tab
						// 0 puts us above the stripe apple pay button if it's there so we can use it's separator
						add_action('cfw_checkout_before_customer_info_tab', $callback['function'], 0 );
					} else {
						return;
					}
				}
			}

			// Don't add the separator if PayPal Express isn't actually active
			if ( empty($WC_Gateway_PayPal_Express_AngellEYE) || ! $this->gateway_instance->is_available() ) {
				return;
			}

			add_action('cfw_checkout_before_customer_info_tab', array($this, 'add_separator'), 10);
		}
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'angelleye-in-context-checkout-js';
		$scripts[] = 'angelleye-in-context-checkout-js-frontend';
		$scripts[] = 'angelleye-express-checkout-js';
		$scripts[] = 'angelleye_button';
		$scripts[] = 'angelleye_frontend';

		return $scripts;
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'angelleye-express-checkout-css';
		$styles[] = 'ppe_checkout';

		return $styles;
	}
}