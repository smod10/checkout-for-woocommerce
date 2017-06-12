<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

class UpdateShippingFieldsAction extends Action {
	public function __construct($id) {
		parent::__construct($id);
	}

	public function action() {
		check_ajax_referer("some-seed-word", "security");

		$sfi = $_POST['shipping_fields_info'];
		$error = false;

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
				WC()->customer->set_calculated_shipping(true);

				// If we can show shipping, calculate it.
				if(WC()->cart->show_shipping()) {
					WC()->cart->calculate_shipping();
					WC()->cart->persistent_cart_update();
					WC()->customer->save();
				}
			} catch(\Exception $e) {
				$error = true;
			}
		}

		$this->out(array(
			"error" => $error,
			"updated_fields_info" => $sfi,
			"new_shipping_total" => WC()->cart->get_cart_shipping_total()
		));
	}
}