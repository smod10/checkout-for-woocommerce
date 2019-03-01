<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class FacebookForWooCommerce extends Base {
	public function is_available() {
		return class_exists( '\\WC_Facebookcommerce' );
	}

	public function run() {
		$integrations = WC()->integrations->get_integrations();

		foreach( $integrations as $integration ) {
			if ( is_a($integration, '\\WC_Facebookcommerce_Integration') && ! empty( $integration->events_tracker ) ) {
				add_action( 'cfw_checkout_after_form', array( $integration->events_tracker, 'inject_initiate_checkout_event' ) );
			}
		}
	}
}