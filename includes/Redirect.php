<?php

namespace Objectiv\Plugins\Checkout;

/**
 * Handles all redirects for the checkout theme overhaul
 *
 * @link       brandont.me
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout
 */

/**
 * Handles all redirects for the checkout theme overhaul
 *
 * Currently the class only handles redirection for the checkout page. Future redirect functionality would go here.
 *
 * @since      0.1.0
 * @package    Objectiv\Plugins\Checkout
 * @author     Brandon Tassone <brandontassone@gmail.com>
 */


class Redirect
{
    /**
     * If is_checkout and exists and it is the checkout section we redirect to the template section.
     *
     * @since    0.1.0
     * @access   public
     */
    public function checkout(){
        if( function_exists('is_checkout') && is_checkout() ) {
            exit;
        }
    }
}