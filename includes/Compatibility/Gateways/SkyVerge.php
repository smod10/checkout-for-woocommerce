<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class SkyVerge extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return class_exists( '\\SV_WC_Payment_Gateway' ) || class_exists( 'SkyVerge\Plugin_Framework\SV_WC_Payment_Gateway' );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'sv-wc-payment-gateway-payment-form';

		return $scripts;
	}

	function allowed_styles( $styles ) {
		$styles[] = 'sv-wc-payment-gateway-my-payment-methods';
		$styles[] = 'sv-wc-payment-gateway-payment-form';

		return $styles;
	}
}
