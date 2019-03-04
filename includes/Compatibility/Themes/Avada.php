<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Themes;

use Objectiv\Plugins\Checkout\Compatibility\Base;
use Objectiv\Plugins\Checkout\Main;

class Avada extends Base {
	public function is_available() {
		return true; // determining if themes are available is a bit difficult and not really helpful here, so let's just always load it
	}

	public function run() {
		add_action( 'wp', array($this, 'kill_dynamic_css'), 0 );
	}

	function kill_dynamic_css() {
		if ( Main::is_checkout() ) {
			add_filter( 'fusion_dynamic_css_final', array($this, 'return_empty_string'), 10000 );
		}
	}

	function return_empty_string() {
		return '';
	}
}