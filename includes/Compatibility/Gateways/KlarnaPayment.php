<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class KlarnaPayment extends Base {

	protected $klarna_payments = null;

	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		$is_available = false;

		$available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
		$this->klarna_payments = $available_gateways['klarna_payments'];

		if(class_exists( '\\WC_Klarna_Payments' ) && $this->klarna_payments){
			$is_available = true;
		}

		return $is_available;
	}

	function typescript_class_and_params( $compatibility ) {
		$compatibility[] = [
			'class'  => 'KlarnaPayment',
			'event' => 'before-setup',
			'params' => [],
		];

		return $compatibility;
	}

	function run() {
		add_action('cfw_payment_gateway_field_html_klarna_payments', array($this, 'klarna_payments_content'));
	}

	function klarna_payments_content() {
		d(include wc_get_template('checkout/payment-method.php'));
	}

	public function allowed_styles( $styles ) {
		$styles[] = "klarna_payments_admin";

		return $styles;
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = "klarna_payments";

		return $scripts;
	}
}
