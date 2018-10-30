<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;
use PakkelabelsForWooCommerce\Plugin\Plugin;

class Pakkelabels extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function run() {
		add_action( 'cfw_wp_footer', array( $this, 'add_modal' ) );
	}

	public function is_available() {
		return function_exists( 'pkl_is_woocommerce_active' ) && pkl_is_woocommerce_active();
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'pakkelabels*';

		return $scripts;
	}

	public function allowed_styles( $styles ) {
		$styles[] = 'pakkelabels*';

		return $styles;
	}

	function add_modal() {
		Plugin::getTemplate( 'pickup-point-modal.modal' );
	}
}
