<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class FacebookWooCommerce extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return class_exists( 'WC_Facebookcommerce' );
	}

	function run() {
		$all_integrations = WC()->integrations->get_integrations();
		$facebookcommerce = ! empty( $all_integrations['facebookcommerce'] ) ? $all_integrations['facebookcommerce'] : false;

		if ( $facebookcommerce ) {
			add_action(
				'cfw_wp_head',
				array( $facebookcommerce->events_tracker, 'inject_base_pixel' )
			);
			add_action(
				'cfw_wp_footer',
				array( $facebookcommerce->events_tracker, 'inject_base_pixel_noscript' )
			);
			add_action(
				'cfw_wp_footer',
				array( $facebookcommerce->events_tracker, 'inject_checkout_pixel' )
			);
		}
	}
}
