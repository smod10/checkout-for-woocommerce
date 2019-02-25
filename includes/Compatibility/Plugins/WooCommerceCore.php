<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommerceCore extends Base {
	public function is_available() {
		return true; // always on, baby
	}

	public function pre_init() {
		if ( is_ajax() ) {
			return;
		}
		
		add_action( 'wp_loaded', array( $this, 'move_add_to_cart_action' ), 0 );
		add_filter( 'wc_add_to_cart_message_html', array( $this, 'suppress_add_to_cart_notices' ), 1 ); // run this late
	}

	function move_add_to_cart_action() {
		remove_action( 'wp_loaded', array( 'WC_Form_Handler', 'add_to_cart_action' ), 20 );
		add_action( 'wp', array( 'WC_Form_Handler', 'add_to_cart_action' ), 10, 0 );
	}

	function suppress_add_to_cart_notices( $notice ) {
		if ( is_checkout() && ! empty( $_REQUEST['add-to-cart'] ) ) {
			return '';
		} else {
			return $notice;
		}
	}

	public function remove_scripts( $scripts ) {
		$scripts['woocommerce'] = 'woocommerce';
		$scripts['wc-checkout'] = 'wc-checkout';
		$scripts['wc-cart-fragments'] = 'wc-cart-fragments';
		$scripts['wc-address-i18n'] = 'wc-address-i18n';
		$scripts['wc-country-select'] = 'wc-country-select';

		return $scripts;
	}

	public function remove_styles( $styles ) {
		$styles['woocommerce-general'] = 'woocommerce-general';

		return $styles;
	}
}
