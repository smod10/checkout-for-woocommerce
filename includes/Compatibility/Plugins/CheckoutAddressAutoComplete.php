<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

class CheckoutAddressAutoComplete {
	public function __construct() {
		// Checkout Address Autocomplete
		if ( function_exists('ecr_addrac_scripts') ) {
			add_action( 'cfw_wp_head', 'ecr_addrac_scripts' );
		}

		// Allow scripts and styles for certain plugins
		add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
	}

	function allowed_scripts( $scripts ) {
		// Checkout Address AutoComplete
		$scripts[] = 'google-autocomplete';
		$scripts[] = 'rp-autocomplete';

		return $scripts;
	}
}