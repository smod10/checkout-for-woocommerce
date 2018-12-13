<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommerceCore extends Base {
	public function is_available() {
		return true; // always on, baby
	}

	public function remove_scripts( $scripts ) {
		$scripts['woocommerce'] = 'woocommerce';

		return $scripts;
	}

	public function remove_styles( $styles ) {
		$styles['woocommerce-general'] = 'woocommerce-general';

		return $styles;
	}
}