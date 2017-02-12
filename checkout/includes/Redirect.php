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
    public function checkout_redirect(){
        if( function_exists('is_checkout') && is_checkout() ) {
            echo "Checkout Redirect";
            throw new \Exception("Test");
            exit;
        }
    }
}