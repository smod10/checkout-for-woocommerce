<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PayTrace extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return function_exists( 'wc_paytrace_load_plugin' );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'paytrace-js';

		return $scripts;
	}
}
