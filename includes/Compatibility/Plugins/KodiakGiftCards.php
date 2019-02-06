<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class KodiakGiftCards extends Base {
	public function is_available() {
		return class_exists('\\KODIAK_GIFTCARDS');
	}

	public function run() {
		add_action( 'cfw_checkout_before_form', 'rpgc_checkout_form', 10 );
		add_action( 'woocommerce_review_order_after_order_total', 'rpgc_order_giftcard' );
	}
}