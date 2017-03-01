<?php

namespace Objectiv\Plugins\Checkout\Core\Templates;

use Objectiv\Plugins\Checkout\Core\Template;

/**
 * HeaderTemplate child class. Specifically created to handle a class specific implementation of the view method
 *
 * @link cgd.io
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Core\Templates
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class HeaderTemplate extends Template {
	/**
	 * ContentTemplate constructor.
	 *
	 * @param $path
	 */
	public function __construct( $path ) {
		parent::__construct( $path );
	}

	/**
	 * Handles filtering the parameters and loading the template for the HeaderTemplate class
	 */
	public function view() {
		$parameters = apply_filters('checkout-woocommerce_template_global_params', array());
		$parameters = apply_filters('checkout-woocommerce_template_header_params', $parameters);

		require_once $this->get_path();
	}
}