<?php

namespace Objectiv\Plugins\Checkout\Core\Templates;

use Objectiv\Plugins\Checkout\Core\Base\Template;

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
	 *
	 * @since 0.1.0
	 * @access public
	 * @param array $global_parameters
	 */
	public function view($global_parameters) {
		$parameters = apply_filters('checkout-woocommerce_template_header_params', $global_parameters);

		require_once $this->get_path();
	}
}