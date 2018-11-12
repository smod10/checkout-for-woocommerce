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
//		add_filter('cfw_replace_form', '__return_true');
//		add_filter("cfw_payment_gateway_kco_content", '__return_true');
//		add_filter("cfw_payment_gateway_field_html_kco", array($this, 'kco_payment_html'), 10, 1);
//		add_action('cfw_form_action', array($this, 'klarna_template_override'));
//        add_filter('cfw_load_checkout_template', array($this, 'detect_confirmation_page'), 10, 1);
	}

	function detect_confirmation_page($load) {
		if (!empty($_GET['confirm']) && !empty($_GET['kco_wc_order_id'] )) {
			return false;
		}

		return $load;
    }

	function kco_payment_html($html) {
		ob_start();
		?>
		<div id="kco-iframe">
			<?php do_action( 'kco_wc_before_snippet' ); ?>
			<?php kco_wc_show_snippet(); ?>
			<?php do_action( 'kco_wc_after_snippet' ); ?>
		</div>
		<?php
		$kco_html = ob_get_contents();
		ob_end_clean();

		return $kco_html;
	}

	/**
	 * Override checkout form template if Klarna Checkout is the selected payment method.
	 *
	 * @param string $template      Template.
	 * @param string $template_name Template name.
	 * @param string $template_path Template path.
	 *
	 * @return string
	 */
	public function override_template( $template, $template_name, $template_path ) {

		// Fallback Klarna Order Received, used when WooCommerce checkout form submission fails.
		if ( 'checkout/thankyou.php' === $template_name ) {
			if ( isset( $_GET['kco_wc'] ) && 'true' === $_GET['kco_wc'] ) {
				$template = KCO_WC_PLUGIN_PATH . '/templates/klarna-checkout-order-received.php';
			}
		}

		return $template;
	}

	function klarna_template_override() {
		// Override template if Klarna Checkout page.
		remove_filter( 'woocommerce_locate_template', array( \Klarna_Checkout_For_WooCommerce_Templates::get_instance(), 'override_template' ), 10 );
		add_filter('woocommerce_locate_template', array($this, 'override_template'));

		// Template hooks.
//		add_action( 'cfw_checkout_before_form', 'kco_wc_print_notices' );
//		add_action( 'cfw_checkout_before_form', 'kco_wc_calculate_totals', 1 );
//		add_action( 'cfw_checkout_before_form', 'woocommerce_checkout_login_form', 10 );
//		add_action( 'cfw_checkout_before_form', 'woocommerce_checkout_coupon_form', 20 );
//		add_action( 'cfw_checkout_after_payment_methods_tab', 'kco_wc_show_extra_fields', 10 );
//		add_action( 'cfw_checkout_after_payment_methods_tab', 'kco_wc_show_another_gateway_button', 20 );
//		add_action( 'kco_wc_before_snippet', 'kco_wc_prefill_consent', 10 );
//		add_action( 'kco_wc_after_snippet', 'kco_wc_show_payment_method_field', 10 );
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'kco';
		$styles[] = 'krokedil_events_style';

		return $styles;
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'wc-cart';
		$scripts[] = 'kco';
		$scripts[] = 'kco_admin';
		$scripts[] = 'krokedil_event_log';
		$scripts[] = 'render_json';

		return $scripts;
	}
}
