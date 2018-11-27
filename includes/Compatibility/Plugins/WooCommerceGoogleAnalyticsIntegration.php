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
		add_action( 'wp', array($this, 'init') );
	}

	function init() {
		if ( false === apply_filters( 'cfw_load_checkout_template', function_exists( 'is_checkout' ) && is_checkout() && ! is_order_received_page() && ! is_checkout_pay_page() ) ) {
			return;
		}

		add_action( 'cfw_wp_footer_before_scripts', array( $this, 'checkout_process' ) );
		$all_integrations = WC()->integrations->get_integrations();

		$google_analytics = $all_integrations['google_analytics'];

		add_action( 'cfw_wp_head', array( $google_analytics, 'tracking_code_display' ), 999999 );
		add_action( 'cfw_wp_head', array( $this, 'handle_script_output' ) );
	}

	function handle_script_output() {
		// Footer
		$WC_Google_Analytics_JS = \WC_Google_Analytics_JS::get_instance();
		$logged_in              = is_user_logged_in() ? 'yes' : 'no';
		if ( 'yes' === $WC_Google_Analytics_JS::get( 'ga_use_universal_analytics' ) ) {
			add_action( 'cfw_wp_footer_before_scripts', array( '\\WC_Google_Analytics_JS', 'universal_analytics_footer' ) );
			echo "<script type='text/javascript'>" . $WC_Google_Analytics_JS::load_analytics_universal( $logged_in ) . '</script>';
		} else {
			add_action( 'cfw_wp_footer_before_scripts', array( '\\WC_Google_Analytics_JS', 'classic_analytics_footer' ) );
			echo "<script type='text/javascript'>" . $WC_Google_Analytics_JS::load_analytics_classic( $logged_in, $order = false ) . '</script>';
		}
	}

	function checkout_process() {
		if ( ! class_exists( '\\WC_Google_Analytics_JS' ) ) {
			return;
		}

		\WC_Google_Analytics_JS::get_instance()->checkout_process( WC()->cart->get_cart() );
	}

	/**
	 * Standard Google Analytics tracking
	 */
	function get_standard_tracking_code() {
		return '<!-- WooCommerce Google Analytics Integration -->
		' . \WC_Google_Analytics_JS::get_instance()->header() . "
		<script type='text/javascript'>" . \WC_Google_Analytics_JS::get_instance()->load_analytics() . '</script>
		<!-- /WooCommerce Google Analytics Integration -->';
	}
}
