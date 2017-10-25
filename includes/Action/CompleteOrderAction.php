<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

/**
 * Class CompleteOrderAction
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Action
 * @author Brandon Tassone <brandontassone@gmail.com>
 */
class CompleteOrderAction extends Action {

	/**
	 * LogInAction constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 * @param $id
	 */
	public function __construct( $id ) {
		parent::__construct( $id );
	}

	/**
	 * Takes in the information from the order form and hands it off to Woocommerce.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function action() {
		check_ajax_referer("some-seed-word", "security");

		wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

		// If the user is logged in don't try and get the user from the front end, just get it on the back before we checkout
		if(!$_POST['billing_email']) {
			$current_user = wp_get_current_user();
			if($current_user) {
				$_POST['billing_email'] = $current_user->user_email;
			}
		}

		WC()->checkout()->process_checkout();
	}
}