<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class AuthorizeNetCIM extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists( '\\WC_Authorize_Net_CIM' );
	}

	function allowed_scripts( $scripts ) {
		// Authorize.net - CIM
		$scripts[] = 'wc-authorize-net-cim';
		$scripts[] = 'wc-authorize-net-cim-accept-js';
		$scripts[] = 'sv-wc-payment-gateway-payment-form';

		return $scripts;
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'sv-wc-payment-gateway-payment-form';

		return $styles;
	}
}
