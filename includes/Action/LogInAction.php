<?php

namespace Objectiv\Plugins\Checkout\Action;

use Objectiv\Plugins\Checkout\Core\Base\Action;

/**
 * Class LogInAction
 * @package Objectiv\Plugins\Checkout\Action
 */
class LogInAction extends Action {

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

		$info = array();
		$info['user_login'] = $_POST['email'];
		$info['user_password'] = $_POST['password'];
		$info['remember'] = true;

		$user = wp_signon($info, false);
		$alt_message = "Login error.";

		$out = array();

		if(is_wp_error($user)) {
			$out["logged_in"] = false;
			$out["message"] = ($user->get_error_message()) ?: $alt_message;
		} else {
			$out["logged_in"] = true;
			$out["message"] = "Login successful";
		}

		$this->out($out);
	}
}