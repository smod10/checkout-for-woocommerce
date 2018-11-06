<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class WooCommerceGermanized extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return function_exists( 'WC_germanized' );
	}

	public function run() {
		add_action( 'cfw_checkout_before_payment_method_tab_nav', 'woocommerce_gzd_template_render_checkout_checkboxes' );
		add_action( 'cfw_checkout_before_payment_method_tab_nav', 'woocommerce_gzd_template_checkout_set_terms_manually' );
	}
}
