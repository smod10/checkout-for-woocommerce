<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

/**
 * Class UpdateShippingFieldsAction
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Action
 * @author Brandon Tassone <brandontassone@gmail.com>
 */
class UpdateShippingFieldsAction extends Action {
	/**
	 * UpdateShippingFieldsAction constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 * @param $id
	 */
	public function __construct($id) {
		parent::__construct($id);
	}

	/**
	 * Updates the shipping details information and based on that it updates the shipping methods. This may in turn
	 * require the updating of the price etc.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function action() {
		check_ajax_referer("some-seed-word", "security");

		$sfi = $_POST['shipping_fields_info'];
		$error = false;

		wc_maybe_define_constant( 'WOOCOMMERCE_CART', true );

		foreach($sfi as $cdi) {
			$field_type = $cdi['field_type'];
			$field_value = $cdi['field_value'];

			$method_base = "set_shipping_";
			$method_name = $method_base . $field_type;

			$get_method_base = "get_shipping_";
			$get_method_name = $get_method_base . $field_type;

			try {
				// Call the specified shipping method
				WC()->customer->$method_name( $field_value );

				WC()->cart->calculate_totals();
				WC()->cart->persistent_cart_update();
				WC()->customer->save();

			} catch(\Exception $e) {
				$error = true;
			}
		}

		// get shipping packages. If we dont return them and update them on the second panel our calculations will be
		// all off
		$ship_methods = $this->get_shipping_methods();

		$this->out(array(
			"error" => $error,
			"updated_fields_info" => $sfi,
			"new_totals" => array(
				"new_subtotal" => WC()->cart->get_cart_subtotal(),
				"new_shipping_total" => WC()->cart->get_cart_shipping_total(),
				"new_taxes_total" => WC()->cart->get_cart_tax(),
				"new_total" => WC()->cart->get_total()
			),
			"needs_payment", WC()->cart->needs_payment(),
			"updated_ship_methods" => $ship_methods
		));
	}

	/**
	 * Returns the shipping methods available
	 *
	 * @since 1.0.0
	 * @access public
	 * @return array
	 */
	public function get_shipping_methods() {
		$packages = WC()->shipping->get_packages();
		$out = [];

		foreach ( $packages as $i => $package ) {
			$chosen_method = isset( WC()->session->chosen_shipping_methods[ $i ] ) ? WC()->session->chosen_shipping_methods[ $i ] : '';
			$product_names = array();

			if ( sizeof( $packages ) > 1 ) {
				foreach ( $package['contents'] as $item_id => $values ) {
					$product_names[ $item_id ] = $values['data']->get_name() . ' &times;' . $values['quantity'];
				}
				$product_names = apply_filters( 'woocommerce_shipping_package_details_array', $product_names, $package );
			}

			$available_methods = $package['rates'];
			$show_package_details = sizeof($packages) > 1;
			$package_details = implode(', ', $product_names);
			$package_name = apply_filters( 'woocommerce_shipping_package_name', sprintf( _nx( 'Shipping', 'Shipping %d', ( $i + 1 ), 'shipping packages', 'woocommerce' ), ( $i + 1 ) ), $i, $package );
			$index = $i;

			if(1 < count($available_methods)) {
				foreach($available_methods as $method) {
					$out[] = sprintf( '<label for="shipping_method_%1$d_%2$s"><input type="radio" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d_%2$s" value="%3$s" class="shipping_method" %4$s /> %5$s</label>', $index, sanitize_title( $method->id ), esc_attr( $method->id ),
						checked( $method->id, $chosen_method, false ), wc_cart_totals_shipping_method_label( $method ) );
				}
			}
		}

		return $out;
	}
}