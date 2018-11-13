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

	function typescript_class_and_params( $compatibility ) {

		$compatibility[] = [
			'class'  => 'Klarna',
			'params' => [],
		];

		return $compatibility;
	}

	function run() {
        add_filter('cfw_load_checkout_template', array($this, 'detect_confirmation_page'), 10, 1);
        add_action('cfw_checkout_loaded_pre_head', array($this, 'klarna_pay_clicked'), 9);
		add_action('cfw_checkout_loaded_pre_head', array($this, 'klarna_template_hooks'), 10);
	}

	function klarna_pay_clicked() {
		if($_GET["payment_method"] == "klarna") {
			WC()->session->set("chosen_payment_method", "kco");
		}
    }

	function klarna_template_hooks() {
		if(WC()->session->get( 'chosen_payment_method' ) == 'kco') {
			add_filter( 'cfw_replace_form', '__return_true' );
			add_action( 'cfw_checkout_form', array( $this, 'klarna_checkout_form' ) );
		} else {
			add_filter('cfw_show_gateway_kco', '__return_false');
			add_action('cfw_checkout_before_customer_info_tab', array( $this, 'add_klarna_separator' ));
			add_action('cfw_payment_request_buttons', array($this, 'add_klarna_pay_button'));
		}
	}

	function klarna_checkout_form() {
		include wc_locate_template('checkout/form-checkout.php');
	}

	function add_klarna_pay_button() {
		?>
		<button id="klarna-pay-button" class="klarna-pay-button">
			Klarna
		</button>
		<?php
	}

	function add_klarna_separator() {
		$this->add_separator();
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
