<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class CheckoutAddressAutoComplete extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return function_exists( 'ecr_addrac_scripts' );
	}

	function run() {
		add_action( 'cfw_wp_head', 'ecr_addrac_scripts' );
	}

	function allowed_scripts( $scripts ) {
		// Checkout Address AutoComplete
		$scripts[] = 'google-autocomplete';
		$scripts[] = 'rp-autocomplete';

		return $scripts;
	}
}
