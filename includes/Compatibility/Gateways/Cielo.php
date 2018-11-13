<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Cielo extends Base {
	public function is_available() {
		return class_exists('\\WC_Cielo');
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'wc-cielo*';

		return $scripts;
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'wc-cielo*';

		return $styles;
	}
}