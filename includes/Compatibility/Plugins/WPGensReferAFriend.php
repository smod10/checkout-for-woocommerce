<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WPGensReferAFriend extends Base {
	public function is_available() {
		return class_exists( '\\WPGens_RAF_Checkout' );
	}

	public function run() {
		global $wpgens_raf_checkout;

		add_action( 'cfw_checkout_before_form', array( $wpgens_raf_checkout, 'apply_matched_coupons' ) );
	}
}