<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class GoogleAnalyticsPro extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return function_exists( 'wc_google_analytics_pro' );
	}

	function run() {
		$wc_google_analytics_pro             = wc_google_analytics_pro();
		$wc_google_analytics_pro_integration = $wc_google_analytics_pro->get_integration();

		if ( $wc_google_analytics_pro_integration->get_tracking_id() ) {

			add_action( 'cfw_wp_head', array( $wc_google_analytics_pro_integration, 'ga_tracking_code' ), 9 );

			// print tracking JavaScript
			add_action( 'cfw_wp_footer_before_scripts', array( $wc_google_analytics_pro_integration, 'print_js' ) );
		}

		// pageviews
		add_action( 'cfw_wp_head', array( $wc_google_analytics_pro_integration, 'pageview' ) );

		// started checkout
		if ( $wc_google_analytics_pro_integration->has_event( 'started_checkout' ) ) {
			add_action( 'cfw_wp_footer', array( $wc_google_analytics_pro_integration, 'started_checkout' ) );
		}

		// selected payment method
		if ( $wc_google_analytics_pro_integration->event_name['provided_billing_email'] ) {
			add_action( 'cfw_wp_footer', array( $wc_google_analytics_pro_integration, 'provided_billing_email' ) );
		}

		// selected payment method
		if ( $wc_google_analytics_pro_integration->has_event( 'selected_payment_method' ) ) {
			add_action( 'cfw_checkout_after_payment_methods', array( $wc_google_analytics_pro_integration, 'selected_payment_method' ) );
		}
	}

	function allowed_scripts( $scripts ) {
		return $scripts;
	}
}
