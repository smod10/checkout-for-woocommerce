<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

class UpdateCheckoutAction extends Action {

	public function __construct( $id ) {
		parent::__construct( $id );
	}

	public function action() {
		check_ajax_referer("some-seed-word", "security");

		wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

		do_action( 'woocommerce_checkout_update_order_review', $_POST['post_data'] );

		$chosen_shipping_methods = WC()->session->get( 'chosen_shipping_methods' );

		if ( isset( $_POST['shipping_method'] ) && is_array( $_POST['shipping_method'] ) ) {
			foreach ( $_POST['shipping_method'] as $i => $value ) {
				$chosen_shipping_methods[ $i ] = wc_clean( $value );
			}
		}

		WC()->session->set( 'chosen_shipping_methods', $chosen_shipping_methods );
		WC()->session->set( 'chosen_payment_method', empty( $_POST['payment_method'] ) ? '' : $_POST['payment_method'] );
		WC()->customer->set_props( array(
			'billing_country'   => isset( $_POST['country'] ) ? wp_unslash( $_POST['country'] )    	: null,
			'billing_state'     => isset( $_POST['state'] ) ? wp_unslash( $_POST['state'] )        	: null,
			'billing_postcode'  => isset( $_POST['postcode'] ) ? wp_unslash( $_POST['postcode'] )  	: null,
			'billing_city'      => isset( $_POST['city'] ) ? wp_unslash( $_POST['city'] )           : null,
			'billing_address_1' => isset( $_POST['address'] ) ? wp_unslash( $_POST['address'] )    	: null,
			'billing_address_2' => isset( $_POST['address_2'] ) ? wp_unslash( $_POST['address_2'] ) : null,
		) );

		if ( wc_ship_to_billing_address_only() ) {
			WC()->customer->set_props( array(
				'shipping_country'   => isset( $_POST['country'] ) ? wp_unslash( $_POST['country'] )    : null,
				'shipping_state'     => isset( $_POST['state'] ) ? wp_unslash( $_POST['state'] )        : null,
				'shipping_postcode'  => isset( $_POST['postcode'] ) ? wp_unslash( $_POST['postcode'] )  : null,
				'shipping_city'      => isset( $_POST['city'] ) ? wp_unslash( $_POST['city'] )          : null,
				'shipping_address_1' => isset( $_POST['address'] ) ? wp_unslash( $_POST['address'] )    : null,
				'shipping_address_2' => isset( $_POST['address_2'] ) ? wp_unslash( $_POST['address_2'] ): null,
			) );
		} else {
			WC()->customer->set_props( array(
				'shipping_country'   => isset( $_POST['s_country'] ) ? wp_unslash( $_POST['s_country'] )    : null,
				'shipping_state'     => isset( $_POST['s_state'] ) ? wp_unslash( $_POST['s_state'] )        : null,
				'shipping_postcode'  => isset( $_POST['s_postcode'] ) ? wp_unslash( $_POST['s_postcode'] )  : null,
				'shipping_city'      => isset( $_POST['s_city'] ) ? wp_unslash( $_POST['s_city'] )          : null,
				'shipping_address_1' => isset( $_POST['s_address'] ) ? wp_unslash( $_POST['s_address'] )    : null,
				'shipping_address_2' => isset( $_POST['s_address_2'] ) ? wp_unslash( $_POST['s_address_2'] ): null,
			) );
		}

		if ( wc_string_to_bool( $_POST['has_full_address'] ) ) {
			WC()->customer->set_calculated_shipping( true );
		} else {
			WC()->customer->set_calculated_shipping( false );
		}

		WC()->customer->save();
		WC()->cart->calculate_totals();

		unset( WC()->session->refresh_totals, WC()->session->reload_checkout );

		$this->out(array(
			"fees" => $this->prep_fees(),
			"new_totals" => array(
				"new_subtotal" => WC()->cart->get_cart_subtotal(),
				"new_shipping_total" => WC()->cart->get_cart_shipping_total(),
				"new_taxes_total" => WC()->cart->get_cart_tax(),
				"new_total" => WC()->cart->get_total()
			),
			"show_payment_fields" => WC()->cart->get_total('') > 0
		));
	}

	function prep_fees() {
		$fees = [];

		foreach(WC()->cart->get_fees() as $fee) {
			$out = (object)[];
			$out->name = $fee->name;
			$out->amount = ( 'excl' == WC()->cart->tax_display_cart ) ? wc_price( $fee->total ) : wc_price( $fee->total + $fee->tax );
			$fees[] = $out;
		}

		return $fees;
	}
}