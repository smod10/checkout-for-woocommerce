<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PixelYourSitePro extends Base {
	var $PSY_Addon;

	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return defined('PYS_FB_PIXEL_VERSION');
	}

	public function run() {
		// PixelYourSite initializes on the init hook (priority 11), so we need to run after that
		add_action('init', array($this, 'init'), 100);
	}

	function init() {
		$PixelYourSite = \PixelYourSite\PYS();

		$addons = $PixelYourSite->get_enabled_addons();

		// Main addon is enabled, lets get going
		if ( ! empty( $addons['fb_pixel_pro'] ) ) {
			$this->PSY_Addon = $addons['fb_pixel_pro'];

			if ( ! is_admin() && ! defined( 'DOING_AJAX' ) ) {
				// Setup their actions
				add_action( 'template_redirect', array( $this->PSY_Addon, 'manage_pixel' ), 0 );

				// Ok, now do our actions
				add_action('pys_fb_pixel_manage_pixel', array($this, 'manage_pixel') );
			}
		}
	}

	function manage_pixel() {
		/**
		 * The Hooks
		 */
		if ( has_action('wp_head', array( $this->PSY_Addon, 'output_version_message' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'output_version_message' ), 1 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'output_pixel_options' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'output_pixel_options' ), 2 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'add_initialize_pixel_event' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'add_initialize_pixel_event' ), 3 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'add_page_view_event' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'add_page_view_event' ), 3 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'add_general_event' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'add_general_event' ), 3 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'add_search_event' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'add_search_event' ), 3 );
		}


		if ( $this->PSY_Addon->get_option( 'events_enabled' ) ) {
			if ( has_action('wp_head', array( $this->PSY_Addon, 'add_custom_events' ) ) ) {
				add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'add_custom_events' ), 3 );
			}
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'add_woo_events' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'add_woo_events' ), 3 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'output_regular_events' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'output_regular_events' ), 4 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'output_dynamic_events' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'output_dynamic_events' ), 4 );
		}

		if ( has_action('wp_head', array( $this->PSY_Addon, 'output_custom_code_events' ) ) ) {
			add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'output_custom_code_events' ), 4 );
		}

		if ( has_action('wp_footer', array( $this->PSY_Addon, 'output_noscript_code' ) ) ) {
			add_action( 'cfw_wp_footer', array( $this->PSY_Addon, 'output_noscript_code' ), 10 );
		}

		if ( has_action('wp_footer', array( $this->PSY_Addon, 'output_ajax_events' ) ) ) {
			add_action( 'cfw_wp_footer', array( $this->PSY_Addon, 'output_ajax_events' ), 10 );
		}

		// WooCommerce
		if ( \PixelYourSite\is_woocommerce_active() && $this->PSY_Addon->get_option( 'woo_enabled' ) ) {

			if ( $this->PSY_Addon->get_option( 'woo_paypal_enabled' ) ) {
				if ( has_action('wp_head', array( $this->PSY_Addon, 'output_ajax_events' ) ) ) {
					add_action( 'cfw_wp_head', array( $this->PSY_Addon, 'output_ajax_events' ), 4 );
				}
			}

		}
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = 'fb_pixel_pro';
		$scripts[] = 'jquery-bind-first';
		$scripts[] = 'js-cookie';
		$scripts[] = 'pys-yt-track';
		$scripts[] = 'pys-vimeo-js';
		$scripts[] = 'pys-vimeo-track';
		$scripts[] = 'pys-adsense-track';

		return $scripts;
	}
}