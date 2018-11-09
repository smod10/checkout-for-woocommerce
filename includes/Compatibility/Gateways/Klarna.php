<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Klarna extends Base {

	private $klarna = null;

	private $klarna_gateway = null;

	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		$is_available = false;

		if(class_exists( '\\Klarna_Checkout_For_WooCommerce' )) {
			$available_gateways = WC()->payment_gateways->get_available_payment_gateways();
			$klarna_gateway = $available_gateways["kco"] ?: null;

			if($klarna_gateway) {
				$is_available = $klarna_gateway->is_available();

				$this->klarna = \Klarna_Checkout_For_WooCommerce::get_instance();
				$this->klarna_gateway = $klarna_gateway;
			}
		}

		return $is_available;
	}

	function run() {

	}

	public function allowed_styles( $styles ) {
		$styles[] = 'kco';
		$styles[] = 'krokedil_events_style';

		return $styles;
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'kco';
		$scripts[] = 'kco_admin';
		$scripts[] = 'krokedil_event_log';
		$scripts[] = 'render_json';

		return $scripts;
	}
}
