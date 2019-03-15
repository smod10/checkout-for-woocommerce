<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Webshipper extends Base {
	public function is_available() {
		return class_exists( '\\WebshipperAPI' );
	}

	function typescript_class_and_params( $compatibility ) {
		$compatibility[] = [
			'class'  => 'Webshipper',
			'params' => [],
		];

		return $compatibility;
	}
}