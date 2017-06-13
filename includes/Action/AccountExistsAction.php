<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

/**
 * Class AccountExistsAction
 * @package Objectiv\Plugins\Checkout\Action
 */
class AccountExistsAction extends Action {

	/**
	 * AccountExistsAction constructor.
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

		$email = $_POST['email'];

		$this->out(array(
			"account_exists" => (boolean) email_exists($email)
		));
	}
}