<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class SkyVergeSocialLogin extends Base {
	public function is_available() {
		return function_exists( 'wc_social_login' );
	}

	public function run() {
		$WC_Social_Login = wc_social_login();

		add_action( 'cfw_checkout_after_login', array( $WC_Social_Login->get_frontend_instance(), 'render_social_login_buttons' ) );
		add_action( 'cfw_wp_footer_before_scripts', array( $this, 'adjust_deps' ), 1000 );
		add_filter( 'wc_social_login_enqueue_frontend_scripts_in_footer', '__return_true' );
	}

	function adjust_deps() {
		global $wp_scripts;
		
		if ( ! empty( $wp_scripts->registered['wc-social-login-frontend'] ) ) {
			$wp_scripts->registered['wc-social-login-frontend']->deps = array( 'jquery' );
		}
	}
}
