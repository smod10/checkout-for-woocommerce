<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class AfterPay extends Base {
	public function is_available() {
		return defined('ARVATO_CHECKOUT_LIVE');
	}

	public function run() {
		add_action( 'wp', array($this, 'add_thickbox') );
	}

	function add_thickbox() {
		if ( is_checkout() ) {
			add_thickbox();
		}
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'afterpay_pre_check_customer';
		$scripts[] = 'thickbox';

		return $scripts;
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'thickbox';

		return $styles;
	}
}
