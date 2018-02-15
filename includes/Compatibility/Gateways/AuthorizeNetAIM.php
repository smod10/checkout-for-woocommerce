<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class AuthorizeNetAIM extends Base {
	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists('\\WC_Authorize_Net_AIM');
	}

	function allowed_scripts( $scripts ) {
		// Authorize.net - AIM
		$scripts[] = 'wc-authorize-net-aim';
		$scripts[] = 'wc-authorize-net-aim-accept-js';

		return $scripts;
	}
}