<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class FirstData extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists( '\\WC_Gateway_First_Data_Payeezy_Credit_Card' );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'wc-first-data-payeezy';

		return $scripts;
	}
}
