<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

class UpdateShippingMethodAction extends Action {

	/**
	 * UpdateShippingMethodAction constructor.
	 *
	 * @param $id
	 */
	public function __construct( $id ) {
		parent::__construct( $id );
	}

	public function action() {
		check_ajax_referer("some-seed-word", "security");

		wc_maybe_define_constant( 'WOOCOMMERCE_CART', true );

		$chosen_shipping_methods = WC()->session->get( 'chosen_shipping_methods' );

		if ( isset( $_POST['shipping_method'] ) && is_array( $_POST['shipping_method'] ) ) {
			foreach ( $_POST['shipping_method'] as $i => $value ) {
				$chosen_shipping_methods[ $i ] = wc_clean( $value );
			}
		}

		WC()->session->set( 'chosen_shipping_methods', $chosen_shipping_methods );

		WC()->cart->calculate_totals();

		$this->out(array(
			"new_totals" => array(
				"new_subtotal" => WC()->cart->get_cart_subtotal(),
				"new_shipping_total" => WC()->cart->get_cart_shipping_total(),
				"new_taxes_total" => WC()->cart->get_cart_tax(),
				"new_total" => WC()->cart->get_total()
			)
		));
	}
}