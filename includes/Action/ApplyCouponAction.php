<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\BoosterSeat\Base\Action;

/**
 * Class ApplyCouponAction
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Action
 * @author Brandon Tassone <brandontassone@gmail.com>
 */
class ApplyCouponAction extends Action {

	/**
	 * ApplyCouponAction constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 * @param $id
	 */
	public function __construct( $id, $no_privilege, $action_prefix ) {
		parent::__construct( $id, $no_privilege, $action_prefix );
	}

	/**
	 * Applies the coupon discount and returns the new totals
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function action() {
		check_ajax_referer( 'some-seed-word', 'security' );

		wc_maybe_define_constant( 'WOOCOMMERCE_CART', true );

		if ( ! empty( $_POST['coupon_code'] ) ) {
			WC()->cart->add_discount( sanitize_text_field( $_POST['coupon_code'] ) );
			WC()->cart->calculate_totals();

			$discount_amounts = array();

			//  We set it true to here so when the HTML is generated the target is correct
			wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

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

			$all_notices  = WC()->session->get( 'wc_notices', array() );
			$notice_types = apply_filters( 'woocommerce_notice_types', array( 'error', 'success', 'notice' ) );
			$message      = [];

			foreach ( $notice_types as $notice_type ) {
				if ( wc_notice_count( $notice_type ) > 0 ) {
					$message = array( $notice_type => $all_notices[ $notice_type ] );
				}
			}

			wc_clear_notices();
			wc_maybe_define_constant( 'WOOCOMMERCE_CART', true );
			WC()->cart->calculate_totals();

			$this->out(
				array(
					'new_totals'    => array(
						'new_subtotal'       => WC()->cart->get_cart_subtotal(),
						'new_shipping_total' => WC()->cart->get_cart_shipping_total(),
						'new_taxes_total'    => WC()->cart->get_cart_tax(),
						'new_total'          => WC()->cart->get_total(),
					),
					'needs_payment' => WC()->cart->needs_payment(),
					'fees'          => $this->prep_fees(),
					'coupons'       => $discount_amounts,
					'message'       => $message,
				)
			);
		} else {
			$this->out(
				array(
					'message' => array( 'error' => [ 'Please provide a coupon code' ] ),
				)
			);
		}
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
}
