<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

class Jilt {
	public function __construct() {
		// Scripts
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function allowed_scripts( $scripts ) {
		// Jilt
		$scripts[] = 'wc-jilt';

		return $scripts;
	}
}