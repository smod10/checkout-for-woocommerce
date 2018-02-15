<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Jilt extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return function_exists('wc_jilt');
	}

	function allowed_scripts( $scripts ) {
		// Jilt
		$scripts[] = 'wc-jilt';

		return $scripts;
	}
}