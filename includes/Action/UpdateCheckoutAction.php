<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\BoosterSeat\Base\Action;

class UpdateCheckoutAction extends Action {

	public function __construct( $id, $no_privilege, $action_prefix ) {
		parent::__construct( $id, $no_privilege, $action_prefix );
	}

	public function action() {
		check_ajax_referer( 'some-seed-word', 'security' );

		wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

		do_action( 'woocommerce_checkout_update_order_review', $_POST['post_data'] );
		do_action( 'cfw_checkout_update_order_review' );

		$chosen_shipping_methods = WC()->session->get( 'chosen_shipping_methods' );

		if ( isset( $_POST['shipping_method'] ) && is_array( $_POST['shipping_method'] ) ) {
			foreach ( $_POST['shipping_method'] as $i => $value ) {
				$chosen_shipping_methods[ $i ] = wc_clean( $value );
			}
		}

		WC()->session->set( 'chosen_shipping_methods', $chosen_shipping_methods );
		WC()->session->set( 'chosen_payment_method', empty( $_POST['payment_method'] ) ? '' : $_POST['payment_method'] );
		WC()->customer->set_props(
			array(
				'billing_country'   => isset( $_POST['billing_country'] ) ? wp_unslash( $_POST['billing_country'] ) : null,
				'billing_state'     => isset( $_POST['billing_state'] ) ? wp_unslash( $_POST['billing_state'] ) : null,
				'billing_postcode'  => isset( $_POST['billing_postcode'] ) ? wp_unslash( $_POST['billing_postcode'] ) : null,
				'billing_city'      => isset( $_POST['billing_city'] ) ? wp_unslash( $_POST['billing_city'] ) : null,
				'billing_address_1' => isset( $_POST['billing_address_1'] ) ? wp_unslash( $_POST['billing_address_1'] ) : null,
				'billing_address_2' => isset( $_POST['billing_address_2'] ) ? wp_unslash( $_POST['billing_address_2'] ) : null,
			)
		);

		if ( wc_ship_to_billing_address_only() ) {
			WC()->customer->set_props(
				array(
					'shipping_country'   => isset( $_POST['billing_country'] ) ? wp_unslash( $_POST['billing_country'] ) : null,
					'shipping_state'     => isset( $_POST['billing_state'] ) ? wp_unslash( $_POST['billing_state'] ) : null,
					'shipping_postcode'  => isset( $_POST['billing_postcode'] ) ? wp_unslash( $_POST['billing_postcode'] ) : null,
					'shipping_city'      => isset( $_POST['billing_city'] ) ? wp_unslash( $_POST['billing_city'] ) : null,
					'shipping_address_1' => isset( $_POST['billing_address_1'] ) ? wp_unslash( $_POST['billing_address_1'] ) : null,
					'shipping_address_2' => isset( $_POST['billing_address_2'] ) ? wp_unslash( $_POST['billing_address_2'] ) : null,
				)
			);
		} else {
			WC()->customer->set_props(
				array(
					'shipping_country'   => isset( $_POST['shipping_country'] ) ? wp_unslash( $_POST['shipping_country'] ) : null,
					'shipping_state'     => isset( $_POST['shipping_state'] ) ? wp_unslash( $_POST['shipping_state'] ) : null,
					'shipping_postcode'  => isset( $_POST['shipping_postcode'] ) ? wp_unslash( $_POST['shipping_postcode'] ) : null,
					'shipping_city'      => isset( $_POST['shipping_city'] ) ? wp_unslash( $_POST['shipping_city'] ) : null,
					'shipping_address_1' => isset( $_POST['shipping_address_1'] ) ? wp_unslash( $_POST['shipping_address_1'] ) : null,
					'shipping_address_2' => isset( $_POST['shipping_address_2'] ) ? wp_unslash( $_POST['shipping_address_2'] ) : null,
				)
			);
		}

		if ( wc_string_to_bool( $_POST['has_full_address'] ) ) {
			WC()->customer->set_calculated_shipping( true );
		} else {
			WC()->customer->set_calculated_shipping( false );
		}

		WC()->customer->save();
		WC()->cart->calculate_totals();

		unset( WC()->session->refresh_totals, WC()->session->reload_checkout );

		$updated_payment_methods = apply_filters( 'cfw_update_payment_methods', cfw_get_payment_methods() );
		$payment_methods_html    = cfw_get_payment_methods_html();

		/**
		 * If gateways haven't changed, set to false so that we don't replace
		 */
		if ( cfw_get_payment_methods_html_fingerprint( $payment_methods_html ) == $_POST['cfw_payment_methods_fingerprint'] && ( empty( $_POST['force_updated_checkout'] ) || $_POST['force_updated_checkout'] !== 'true' ) ) {
			$updated_payment_methods = false;
		}

		ob_start();
		do_action( 'woocommerce_review_order_before_order_total' );
		$updated_before_totals = ob_get_clean();
		$updated_before_totals = "<table>$updated_before_totals</table>";

		ob_start();
		do_action( 'woocommerce_review_order_after_order_total' );
		$updated_after_totals = ob_get_clean();
		$updated_after_totals = "<table>$updated_after_totals</table>";

		$this->out(
			array(
				'coupons'                  => $this->prep_coupons(),
				'fees'                     => $this->prep_fees(),
				'new_totals'               => array(
					'new_subtotal'       => WC()->cart->get_cart_subtotal(),
					'new_shipping_total' => $this->get_shipping_total(),
					'new_taxes_total'    => ( WC()->cart->get_cart_tax() != '' ) ? WC()->cart->get_cart_tax() : wc_price( 0.00 ),
					'new_total'          => WC()->cart->get_total(),
				),
				'needs_payment'            => WC()->cart->needs_payment(),
				'updated_ship_methods'     => $this->get_shipping_methods(),
				'updated_shipping_preview' => cfw_get_shipping_details( WC()->checkout() ),
				'updated_before_totals'    => $updated_before_totals,
				'updated_after_totals'     => $updated_after_totals,
				'updated_payment_methods'  => $updated_payment_methods,
				'updated_place_order'      => cfw_get_place_order(),
				'updated_cart'             => cfw_get_cart_html(),
			)
		);
	}

	function prep_coupons() {
		$discount_amounts = array();

		foreach ( WC()->cart->get_coupons() as $code => $coupon ) {
			ob_start();
			wc_cart_totals_coupon_html( $coupon );
			$coupon_html = ob_get_contents();
			ob_clean();
			wc_cart_totals_coupon_label( $coupon );
			$coupon_label_html = ob_get_contents();
			ob_end_clean();

			array_push(
				$discount_amounts, array(
					'label'  => $coupon_label_html,
					'amount' => $coupon_html,
					'code'   => $code,
				)
			);
		}

		return $discount_amounts;
	}

	function prep_fees() {
		$fees = [];

		foreach ( WC()->cart->get_fees() as $fee ) {
			$out         = (object) [];
			$out->name   = $fee->name;
			$out->amount = ( 'excl' == WC()->cart->tax_display_cart ) ? wc_price( $fee->total ) : wc_price( $fee->total + $fee->tax );
			$fees[]      = $out;
		}

		return $fees;
	}

	function get_shipping_total() {
		return cfw_get_shipping_total();
	}

	/**
	 * Returns the shipping methods available
	 *
	 * @since 1.0.0
	 * @access public
	 * @return array
	 */
	public function get_shipping_methods() {
		ob_start();
		cfw_cart_totals_shipping_html();
		return ob_get_clean();
	}
}
