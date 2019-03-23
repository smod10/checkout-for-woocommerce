<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Square extends Base {
	public function is_available() {
		return defined( 'WC_SQUARE_VERSION' );
	}

	function typescript_class_and_params( $compatibility ) {
		$compatibility[] = [
			'class'  => 'Square',
			'params' => [],
		];

		return $compatibility;
	}
}