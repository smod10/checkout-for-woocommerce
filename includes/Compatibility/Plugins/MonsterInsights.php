<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class MonsterInsights extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return function_exists( 'monsterinsights_tracking_script' );
	}

	public function run() {
		add_action( 'cfw_wp_head', 'monsterinsights_tracking_script', 6 );
	}
}