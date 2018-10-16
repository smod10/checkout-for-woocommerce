<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Braintree extends Base {

	/**
	 * @var array
	 * @private
	 */
	private $braintree_gateways_available;

	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		$available = false;

		if(class_exists('\\WC_Braintree')) {
			$braintree = wc_braintree();
			$cc_gateway = $braintree->get_gateway( \WC_Braintree::CREDIT_CARD_GATEWAY_ID);
			$paypal_gateway = $braintree->get_gateway( \WC_Braintree::PAYPAL_GATEWAY_ID);

			$this->set_braintree_gateways_available(["cc" => $cc_gateway->is_available(), "paypal" => $paypal_gateway->is_available()]);

			if($cc_gateway->is_available() || $paypal_gateway->is_available()) {
				$available = true;
			}
		}

		return $available;
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = "wc-braintree";
		$scripts[] = "braintree-data";
		$scripts[] = "braintree-js-hosted-fields";
		$scripts[] = "braintree-js-3d-secure";
		$scripts[] = "braintree-js-paypal";
		$scripts[] = "braintree-js-paypal-checkout";
		$scripts[] = "braintree-js-client";
		$scripts[] = "jquery-payment";
		$scripts[] = "jquery-tiptip";

		return $scripts;
	}

	function typescript_class_and_params($compatibility) {
		$braintree_gateways_available = $this->get_braintree_gateways_available();

		$compatibility[] = [
			"class" => "Braintree",
			"params" => [
				[
					"cc_gateway_available" => $braintree_gateways_available["cc"],
					"paypal_gateway_available" => $braintree_gateways_available["paypal"]
				]
			]
		];

		return $compatibility;
	}

	function allowed_styles( $styles ) {
		$styles[] = "wc-braintree";

		return $styles;
	}

	/**
	 * @return array
	 */
	public function get_braintree_gateways_available() {
		return $this->braintree_gateways_available;
	}

	/**
	 * @param array $braintree_gateways_available
	 */
	public function set_braintree_gateways_available( $braintree_gateways_available ) {
		$this->braintree_gateways_available = $braintree_gateways_available;
	}
}