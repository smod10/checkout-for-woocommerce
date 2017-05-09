<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Core\Loader;

class AjaxManager {

	/**
	 * AjaxManager constructor.
	 *
	 * @param array $ajaxModules
	 * @param Loader $loader
	 */
	public function __construct($ajaxModules, $loader) {
		foreach($ajaxModules as $ajax) {
			$ajax->load($loader);
		}
	}
}