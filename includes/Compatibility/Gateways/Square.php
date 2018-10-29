<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Square extends Base {

	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return class_exists( '\\Woocommerce_Square' );
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'woocommerce-square';

		return $scripts;
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'woocommerce-square-styles';

		return $styles;
	}
}
