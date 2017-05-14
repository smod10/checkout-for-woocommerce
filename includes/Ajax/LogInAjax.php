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
		$alt_message = "Login error";

//		if(function_exists('wp_limit_login_auth_signon')) {
//			$user = wp_limit_login_auth_signon($user, $info['user_login'], $info['user_password']);
//			$alt_message = "Too many login attempts. Please try again in " . get_option('limit_login_attepts_delay_time') . " minutes";
//		}

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