<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class Klarna extends Base {

	protected $klarna = null;

	protected $klarna_gateway = null;

	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		$is_available = false;

		// If the Karna main class exists
		if(class_exists( '\\Klarna_Checkout_For_WooCommerce' )) {
			$available_gateways = WC()->payment_gateways->get_available_payment_gateways();
			$klarna_gateway = $available_gateways["kco"] ?: null;

			// If the gateway is not null
			if($klarna_gateway) {
				// Get the gateway availability and set it
				$is_available = $klarna_gateway->is_available();

				// Save the necessary integration class instances
				$this->klarna = \Klarna_Checkout_For_WooCommerce::get_instance();
				$this->klarna_gateway = $klarna_gateway;
			}
		}

		return $is_available;
	}

	function run() {
        add_filter('cfw_load_checkout_template', array($this, 'detect_confirmation_page'), 10, 1);
		add_filter('cfw_show_gateway_kco', '__return_false');
		add_action('cfw_checkout_loaded_pre_head', array($this, 'klarna_template_hooks'));
	}

	function klarna_template_hooks() {
		if(WC()->session->get( 'chosen_payment_method' ) == 'kco') {
			add_filter( 'cfw_replace_form', '__return_true' );
			add_action( 'cfw_checkout_form', array( $this, 'klarna_checkout_form' ) );
		}
	}

	function klarna_checkout_form() {
		include wc_locate_template('checkout/form-checkout.php');
	}

	function detect_confirmation_page($load) {
		if (!empty($_GET['confirm']) && !empty($_GET['kco_wc_order_id'] )) {
			return false;
		}

		return $load;
    }

	public function allowed_styles( $styles ) {
		$styles[] = 'kco';
		$styles[] = 'krokedil_events_style';

		return $styles;
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'kco';
		$scripts[] = 'kco_admin';
		$scripts[] = 'krokedil_event_log';
		$scripts[] = 'render_json';

		if(WC()->session->get( 'chosen_payment_method' ) == 'kco') {
			$scripts[] = 'woocommerce';
			$scripts[] = 'wc-cart';
			$scripts[] = 'wc-checkout';
			$scripts[] = 'wc-country-select';
			$scripts[] = 'wc-address-i18n';
		}

		return $scripts;
	}
}
