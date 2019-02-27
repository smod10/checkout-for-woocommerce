<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class DirectCheckout extends Base {
	function is_available() {
		return class_exists( '\\WooCommerce_Direct_Checkout' );
	}

	function run() {
		if ( get_option( 'direct_checkout_enabled' ) ) {
			add_filter( 'wc_add_to_cart_message_html', array( $this, 'remove_notice' ) );
		}
	}

	function remove_notice( $message ) {
		return '';
	}
}
