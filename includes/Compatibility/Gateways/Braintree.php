<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Braintree extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists('\\WC_Braintree');
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = "wc-braintree";
		$scripts[] = "braintree-data";
		$scripts[] = "braintree-js-hosted-fields";
		$scripts[] = "braintree-js-3d-secure";
		$scripts[] = "braintree-js-paypal-checkout";
		$scripts[] = "braintree-js-client";

		return $scripts;
	}

	function allowed_styles( $styles ) {
		$styles[] = "wc-braintree";

		return $styles;
	}
}