<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class AfterPayKrokedil extends Base {
	public function is_available() {
		return defined('ARVATO_CHECKOUT_LIVE');
	}

	public function run() {
		add_action( 'wp', array($this, 'add_thickbox') );
		add_action( 'wp', array($this, 'customer_precheck') );
	}

	function add_thickbox() {
		if ( apply_filters('cfw_load_checkout_template', function_exists('is_checkout') && is_checkout() && ! is_order_received_page() && ! is_checkout_pay_page() ) ) {
			add_thickbox();
		}
	}

	function customer_precheck() {
		global $wc_afterpay_pre_check_customer;

		add_action( 'cfw_checkout_before_payment_method_terms_checkbox', array($wc_afterpay_pre_check_customer, 'display_pre_check_form') );
	}
}
