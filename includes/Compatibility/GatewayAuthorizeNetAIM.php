<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

class GatewayAuthorizeNetAIM {
	public function __construct() {
		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function allowed_scripts( $scripts ) {
		// Authorize.net - AIM
		$scripts[] = 'wc-authorize-net-aim';
		$scripts[] = 'wc-authorize-net-aim-accept-js';

		return $scripts;
	}
}