<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class BlueSnap extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists( '\\Bsnp_Payment_Gateway' );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'bsnp-cc';
		$scripts[] = 'bsnp-ex';
		$scripts[] = 'bsnp-ex-cookie';
		$scripts[] = 'bsnp-cse';

		return $scripts;
	}

	function allowed_styles( $styles ) {
		$styles[] = 'bsnp-css';

		return $styles;
	}
}
