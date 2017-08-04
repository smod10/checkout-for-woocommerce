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

		$out = array(
			"billing_first_name" => $_POST['billing_first_name'],
		    "billing_last_name" => $_POST['billing_last_name'],
			"billing_company" => $_POST['billing_company'],
			"billing_country" => $_POST['billing_country'],
			"billing_address_1" => $_POST['billing_address_1'],
			"billing_address_2" => $_POST['billing_address_2'],
			"billing_city" => $_POST['billing_city'],
			"billing_state" => $_POST['billing_state'],
			"billing_postcode" => $_POST['billing_postcode'],
			"billing_phone" => $_POST['billing_phone'],
			"billing_email" => $_POST['billing_email'],
			"ship_to_different_address" => $_POST['ship_to_different_address'],
			"shipping_first_name" => $_POST['shipping_first_name'],
			"shipping_last_name" => $_POST['shipping_last_name'],
			"shipping_company" => $_POST['shipping_company'],
			"shipping_country" => $_POST['shipping_country'],
			"shipping_address_1" => $_POST['shipping_address_1'],
			"shipping_address_2" => $_POST['shipping_address_2'],
			"shipping_city" => $_POST['shipping_city'],
			"shipping_state" => $_POST['shipping_state'],
			"shipping_postcode" => $_POST['shipping_postcode'],
			"order_comments" => $_POST['order_comments'],
			"shipping_method[0]" => $_POST['shipping_method'][0],
			"payment_method" => $_POST['payment_method'],
			"wc-stripe-payment-token" => $_POST['wc-stripe-payment-token'],
			"_wpnonce" => $_POST['_wpnonce'],
			"_wp_http_referer" => $_POST['_wp_http_referer'],
			"stripe_token" => $_POST['stripe_token']
		);

		$this->out($out);
	}
}