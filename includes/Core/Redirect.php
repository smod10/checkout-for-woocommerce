<?php

namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Managers\TemplateManager;

/**
 * Handles all redirects for the checkout theme overhaul
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout\Core
 */

/**
 * Handles all redirects for the checkout theme overhaul
 *
 * Currently the class only handles redirection for the checkout page. Future redirect functionality would go here.
 *
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
	 * @param string $wp_template
	 * @return string
	 */
	public function checkout($template_manager, $wp_template){
		d($wp_template);
		if( function_exists('is_checkout') && is_checkout() ) {
			$template_manager->load_templates();
		}

		return $wp_template;
	}
}