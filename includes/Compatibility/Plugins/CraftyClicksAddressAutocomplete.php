<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class CraftyClicksAddressAutocomplete extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists( '\\WC_ClickToAddress_Autocomplete' );
	}

	function run() {
		$all_integrations = WC()->integrations->get_integrations();

		if ( ! empty( $all_integrations['clicktoaddress_autocomplete'] ) ) {
			$craftyclicks_address_autocomplete = $all_integrations['clicktoaddress_autocomplete'];

			add_action( 'cfw_checkout_before_customer_info_tab', array( $craftyclicks_address_autocomplete, 'addCheckoutJs' ) );
		}
	}

	function allowed_styles( $styles ) {
		$styles[] = "clicktoaddress*"; // for address autocomplete plugin
		return $styles;
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = "clicktoaddress*"; // for address autocomplete plugin
		return $scripts;
	}
}
