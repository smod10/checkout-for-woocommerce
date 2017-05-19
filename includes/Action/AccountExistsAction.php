<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

class AccountExistsAction extends Action {
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