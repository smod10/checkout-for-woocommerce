<?php

namespace Objectiv\Plugins\Checkout\Ajax;

use Objectiv\Plugins\Checkout\Core\Base\Ajax;

class LogInAjax extends Ajax {
	public function __construct( $id ) {
		parent::__construct( $id );
	}

	public function action() {
		check_ajax_referer("some-seed-word", "security");

		$info = array();
		$info['user_login'] = $_POST['email'];
		$info['user_password'] = $_POST['password'];
		$info['remember'] = true;

		$user = wp_signon($info, false);

		$out = array();

		if(is_wp_error($user)) {
			$out["logged_in"] = false;
			$out["message"] = "Wrong username or password";
		} else {
			$out["logged_in"] = true;
			$out["message"] = "Login successful";
		}

		$this->out($out);
	}
}