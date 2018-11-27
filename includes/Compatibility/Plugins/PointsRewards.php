<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PointsRewards extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		global $wc_points_rewards;

		if ( ! empty( $wc_points_rewards ) ) {
			return true;
		}

		return false;
	}

	public function run() {
		global $wc_points_rewards;

		// Add earn points and save message
		add_action( 'cfw_checkout_before_form', array( $wc_points_rewards->cart, 'render_earn_points_message' ) );

		// Add redeem previously earned points message
		add_action( 'cfw_checkout_before_form', array( $wc_points_rewards->cart, 'render_redeem_points_message' ) );
	}
}
