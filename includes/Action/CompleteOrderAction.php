<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

class CompleteOrderAction extends Action {

	/**
	 * LogInAction constructor.
	 *
	 * @param $id
	 */
	public function __construct( $id ) {
		parent::__construct( $id );
	}

	/**
	 *
	 */
	public function action() {
		check_ajax_referer("some-seed-word", "security");

		wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

		// If the user is logged in dont try and get the user from the front end, just get it on the back before we checkout
		if(!$_POST['billing_email']) {
			$current_user = wp_get_current_user();
			if($current_user) {
				$_POST['billing_email'] = $current_user->user_email;
			}
		}

		WC()->checkout()->process_checkout();
	}
}