<?php

namespace Objectiv\Plugins\Checkout\Ajax;

use Objectiv\Plugins\Checkout\Core\Base\Ajax;

class AccountExistsAjax extends Ajax {
	public function __construct( $id ) {
		parent::__construct( $id );
	}

	public function action() {
		check_ajax_referer("some-seed-word", "security");

		$email = $_POST['email'];

		$this->out(array(
			"account_exists" => (boolean) email_exists($email)
		));
	}
}