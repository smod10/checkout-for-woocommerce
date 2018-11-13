<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class CheckoutManager extends Base {
	public function is_available() {
		return defined('WOOCCM_PATH');
	}

	public function run() {
		remove_filter( 'woocommerce_checkout_fields', 'wooccm_remove_fields_filter_billing', 15 );
		remove_filter( 'woocommerce_checkout_fields', 'wooccm_remove_fields_filter_shipping', 1 );
		remove_filter( 'woocommerce_billing_fields', 'wooccm_checkout_billing_fields' );
		remove_filter( 'woocommerce_default_address_fields', 'wooccm_checkout_default_address_fields' );
		remove_filter( 'woocommerce_shipping_fields', 'wooccm_checkout_shipping_fields' );
		remove_action( 'woocommerce_checkout_fields', 'wooccm_order_notes' );
	}
}