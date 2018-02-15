<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

class GatewayBlueSnap {
	public function __construct() {
		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );

		// Styles
		add_filter('cfw_allowed_style_handles', array($this, 'allowed_styles') );
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'bsnp-cc';
        $scripts[] = 'bsnp-ex';
        $scripts[] = 'bsnp-ex-cookie';
        $scripts[] = 'bsnp-cse';

		return $scripts;
	}

	function allowed_styles( $styles ) {
		$styles = 'bsnp-css';

		return $styles;
	}
}