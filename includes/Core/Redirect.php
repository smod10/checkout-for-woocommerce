<?php

namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Managers\AssetsManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;

/**
 * Handles all redirects for the checkout theme overhaul
 *
 * Currently the class only handles redirection for the checkout page. Future redirect functionality would go here.
 *
 * @link cgd.io
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class Redirect
{
	/**
	 * If is_checkout and exists and it is the checkout section we redirect to the template section.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param TemplateManager $template_manager
	 * @param AssetsManager $assets_manager
	 * @return string
	 */
	public function checkout($template_manager, $assets_manager){
		if( function_exists('is_checkout') && is_checkout() ) {
			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('checkout-woocommerce_template_global_params', array(\WooCommerce::instance()));

			// Load the front end assets, then load the templates
			$assets_manager->load_assets('front');
			$template_manager->load_templates($global_template_parameters);
			exit;
		}
	}
}