<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommercePriceBasedOnCountry extends Base {
	public function is_available() {
		return class_exists( '\\WC_Product_Price_Based_Country' );
	}

	public function pre_init() {
		add_action( 'woocommerce_init',  array( $this, 'woo_init' ) );
	}

	function woo_init() {
		if ( $this->is_available() && defined( 'WC_DOING_AJAX' ) && WC_DOING_AJAX && isset( $_GET['wc-ajax'] ) && 'update_checkout' === $_GET['wc-ajax'] ) {
			$this->set_country();
		}
	}

	function set_country() {
		$country   = isset( $_POST['billing_country'] ) ? wc_clean( wp_unslash( $_POST['billing_country'] ) ) : false;
		$s_country = isset( $_POST['shipping_country'] ) ? wc_clean( wp_unslash( $_POST['shipping_country'] ) ) : false;

		if ( $country ) {
			wcpbc_set_wc_biling_country( $country );
		}

		if ( ! empty( $_POST['ship_to_different_address'] ) && $_POST['ship_to_different_address'] == 'same_as_shipping' && $s_country ) {
			wcpbc_set_wc_biling_country( $s_country );
		}

		if ( wc_ship_to_billing_address_only() ) {
			if ( $country ) {
				WC()->customer->set_shipping_country( $country );
			}
		} else {
			if ( $s_country ) {
				WC()->customer->set_shipping_country( $s_country );
			}
		}
	}
}