<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

class MonsterInsights {
	public function __construct() {
		if ( function_exists('monsterinsights_tracking_script') ) {
			add_action( 'cfw_wp_head', 'monsterinsights_tracking_script', 6 );
		}
	}
}