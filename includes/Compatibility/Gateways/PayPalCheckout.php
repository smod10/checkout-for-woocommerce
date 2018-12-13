<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PayPalCheckout extends Base {

	private $_CompatibilityManager;

	public function __construct( $CompatibilityManager ) {
		parent::__construct();

		$this->_CompatibilityManager = $CompatibilityManager;
	}

	public function is_available() {
		return ( function_exists( 'wc_gateway_ppec' ) && wc_gateway_ppec()->settings->is_enabled() );
	}

	function typescript_class_and_params( $compatibility ) {

		$compatibility[] = [
			'class'  => 'PayPalCheckout',
			'params' => [],
		];

		return $compatibility;

	}
}
