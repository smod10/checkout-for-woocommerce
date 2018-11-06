<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommerceGoogleAnalyticsIntegration extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists( '\\WC_Google_Analytics_Integration' );
	}

	function run() {
		add_action( 'cfw_wp_footer_before_scripts', array($this, 'checkout_process') );
		$all_integrations = WC()->integrations->get_integrations();

		$google_analytics = $all_integrations[ 'google_analytics' ];

		add_action('cfw_wp_head', array($google_analytics, 'tracking_code_display'), 999999);
	}

	function checkout_process() {
		if ( ! class_exists('\\WC_Google_Analytics_JS') ) return;

		\WC_Google_Analytics_JS::get_instance()->checkout_process( WC()->cart->get_cart() );
	}
}
