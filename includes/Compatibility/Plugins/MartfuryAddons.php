<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;
use Objectiv\Plugins\Checkout\Main;

class MartfuryAddons extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return function_exists( 'martfury_vc_addons_init' );
	}

	public function pre_init() {
		if ( is_callable( 'martfury_vc_addons_init' ) ) {
			remove_action( 'after_setup_theme', 'martfury_vc_addons_init', 30 );
			add_action( 'wp', 'martfury_vc_addons_init', 1000 );
		}
	}

	function run() {
		add_action( 'wp', array($this, 'remove_actions'), 999 );
	}

	function remove_actions() {
		if ( Main::is_checkout() ) {
			remove_action( 'wp', 'martfury_vc_addons_init', 1000 );
		}
	}
}
