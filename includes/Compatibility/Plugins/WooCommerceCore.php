<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommerceCore extends Base {
	public function is_available() {
		return true; // always on, baby
	}

	public function pre_init() {
		// Using this instead of is_ajax() in case is_ajax() is not available
		if ( apply_filters( 'wp_doing_ajax', defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
			return;
		}

		add_action( 'wp_loaded', array( $this, 'move_add_to_cart_action' ), 0 );
		add_filter( 'wc_add_to_cart_message_html', array( $this, 'suppress_add_to_cart_notices' ), 1 ); // run this late
		add_action( 'init', array($this, 'post_compatibility'), 1000 );
	}

	public function run() {
		add_action( 'cfw_checkout_before_billing_address', function() {
			do_action('woocommerce_before_checkout_billing_form');
		} );

		add_action( 'cfw_checkout_after_billing_address', function() {
			do_action('woocommerce_after_checkout_billing_form');
		} );

		add_action( 'cfw_checkout_before_shipping_address', function() {
			do_action('woocommerce_before_checkout_shipping_form');
		} );

		add_action( 'cfw_checkout_after_shipping_address', function() {
			do_action('woocommerce_after_checkout_shipping_form');
		} );

		// Remove some default hooks
		remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_login_form', 10 );
		remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 );
		remove_action( 'woocommerce_before_checkout_form', 'woocommerce_output_all_notices', 10 );
	}

	/**
	 * Some plugins rely too heavily on the exact field names Woo sends in their update $_POST
	 *
	 * This functionality isn't run by default, but it can be invoked by compat classes that need it.
	 */
	public function post_compatibility() {
		if ( ! empty( $_POST ) && ! empty( $_GET['wc-ajax'] ) && $_GET['wc-ajax'] == "update_checkout" && apply_filters('cfw_needs_post_compatibility', false ) ) {
			foreach ( $_POST as $key => $value ) {
				if ( $key !== "shipping_method" && stripos( $key, 'shipping_') !== false ) {
					if ( stripos( $key, 'address_1' ) ) {
						$key = str_ireplace( 'address_1', 'address', $key );
					}

					$_POST[ str_ireplace( 'shipping_', 's_', $key ) ] = $value;
				}
			}
		}
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
		$styles['woocommerce-layout'] = 'woocommerce-layout';

		return $styles;
	}
}
