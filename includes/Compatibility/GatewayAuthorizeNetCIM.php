<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

class GatewayAuthorizeNetCIM {
	public function __construct() {
		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function allowed_scripts( $scripts ) {
		// Authorize.net - CIM
		$scripts[] = 'wc-authorize-net-cim';
		$scripts[] = 'wc-authorize-net-cim-accept-js';

		return $scripts;
	}
}