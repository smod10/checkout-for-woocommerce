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

		return $scripts;
	}

	function allowed_styles( $styles ) {

		return $styles;
	}
}