<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommerceCore extends Base {
	public function is_available() {
		return true; // always on, baby
	}

	public function remove_scripts( $scripts ) {
		global $wp_scripts;

		$scripts['woocommerce'] = 'woocommerce';

		return $scripts;
	}
}