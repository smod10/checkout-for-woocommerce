<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class PixelYourSitePro extends Base {

	public function __construct() {
		parent::__construct();
	}

	public function is_available() {
		return class_exists('\\PixelYourSite\PYS');
	}

	public function run() {
		// PixelYourSite initializes on the init hook (priority 11), so we need to run after that
		add_action('init', array($this, 'init'), 100);
	}

	function init() {
		if ( ! is_admin() && ! defined( 'DOING_AJAX' ) ) {
			add_action('cfw_wp_head', function() {
				$pys = \PixelYourSite\PYS::instance();
				if($pys) {
					$pys->managePixels();
					$pys->getEventsManager()->outputData();
				}
			});
		}
	}

	public function allowed_scripts( $scripts ) {
		$scripts[] = "vimeo";
		$scripts[] = "jquery-bind-first";
		$scripts[] = "js-cookie";
		$scripts[] = "pys";

		return $scripts;
	}
}