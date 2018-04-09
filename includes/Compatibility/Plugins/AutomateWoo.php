<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class AutomateWoo extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return defined('AUTOMATEWOO_NAME');
	}

	public function run() {
		// < 3.7.0
		add_action('cfw_wp_footer_before_scripts', '\\AutomateWoo\Hooks::maybe_print_presubmit_js' );
	}

	public function allowed_scripts( $scripts ) {
		// 3.7.0+
		$scripts[] = 'automatewoo-presubmit';

		return $scripts;
	}
}