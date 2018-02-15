<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

class GatewayPayTrace {
	public function __construct() {
		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'paytrace-js';

		return $scripts;
	}
}