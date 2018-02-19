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
		add_action('cfw_wp_footer_before_scripts', '\\AutomateWoo\Hooks::maybe_print_presubmit_js' );
	}
}