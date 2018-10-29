<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommerceSubscriptions extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return class_exists('\\WC_Subscriptions_Cart');
	}

	public function run() {
		add_filter('woocommerce_checkout_registration_required', array($this, 'override_registration_required') );
	}

	function override_registration_required( $result ) {
		if ( \WC_Subscriptions_Cart::cart_contains_subscription() && ! is_user_logged_in() ) {
			$result = true;
		}

		return true;
	}
}
