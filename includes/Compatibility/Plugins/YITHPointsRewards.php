<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class YITHPointsRewards extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return defined( 'YITH_YWPAR_VERSION' );
	}

	public function run() {
		global $wc_points_rewards;

		if ( class_exists('\\YITH_WC_Points_Rewards_Frontend' ) ) {
			$YITH_WC_Points_Rewards_Frontend = \YITH_WC_Points_Rewards_Frontend::get_instance();
		}

		add_action( 'cfw_checkout_before_form', array( $YITH_WC_Points_Rewards_Frontend, 'print_messages_in_cart' ) );
		add_action( 'cfw_checkout_before_form', array( $YITH_WC_Points_Rewards_Frontend, 'print_rewards_message_in_cart' ) );
	}
}
