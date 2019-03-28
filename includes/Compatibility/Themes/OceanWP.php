<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Themes;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class OceanWP extends Base {
	public function is_available() {
		return defined( 'OCEANWP_THEME_DIR' );
	}

	public function pre_init() {
		add_filter( 'theme_mod_ocean_woo_multi_step_checkout', '__return_false', 1000 );
	}

	public function run() {
		// silence is golden
	}
}