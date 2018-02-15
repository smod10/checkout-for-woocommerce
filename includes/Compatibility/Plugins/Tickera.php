<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

class Tickera {
	public function __construct() {
		// Tickera Attendee Forms
		global $tc_woocommerce_bridge;

		if ( ! empty($tc_woocommerce_bridge) ) {
			add_action('cfw_checkout_before_payment_method_terms_checkbox', array($tc_woocommerce_bridge, 'add_standard_tc_fields_to_checkout'));
		}
	}
}