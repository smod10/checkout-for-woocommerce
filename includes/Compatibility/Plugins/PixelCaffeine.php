<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PixelCaffeine extends Base {
	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		if ( class_exists( '\\PixelCaffeine' ) && class_exists('\\AEPC_Pixel_Scripts') && class_exists('\\AEPC_Woocommerce_Addon_Support') ) {
			return true;
		}
		return false;
	}

	function run() {
		$AEPC_Woocommerce_Addon_Support = new \AEPC_Woocommerce_Addon_Support();

		add_action( 'cfw_wp_footer_before_scripts', array( 'AEPC_Pixel_Scripts', 'enqueue_scripts' ), 10 );
		add_action( 'cfw_wp_footer_before_scripts', array( $AEPC_Woocommerce_Addon_Support, 'register_add_payment_info_params' ), 11 );

		add_filter( 'cfw_body_classes', array( $this, 'add_pixel_caffeine_body_class' ) );

		if ( 'head' == get_option( 'aepc_pixel_position', 'head' ) ) {
			add_action( 'cfw_wp_head', array( 'AEPC_Pixel_Scripts', 'pixel_init' ), 99 );
		} else {
			add_action( 'cfw_wp_footer', array( 'AEPC_Pixel_Scripts', 'pixel_init' ), 1 );
		}
	}

	function add_pixel_caffeine_body_class( $classes ) {
		$classes[] = "woocommerce-page";

		return $classes;
	}

	function allowed_scripts( $scripts ) {
		$scripts[] = 'aepc-pixel-events';

		return $scripts;
	}
}