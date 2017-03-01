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
	 * @param string $wp_template
	 * @return string
	 */
	public function checkout($template_manager, $assets_manager, $wp_template){
		if( function_exists('is_checkout') && is_checkout() ) {
			$assets_manager->load_assets('front');
			$template_manager->load_templates();
			exit;
		}

		return $wp_template;
	}
}