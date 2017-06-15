<?php
/**
 * Provides standard object for accessing user-defined plugin settings
 *
 * @link cgd.io
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Core\Base
 * @author Brandon Tassone <brandontassone@gmail.com>
 */


namespace Objectiv\Plugins\Checkout\Core;


class SettingsManager extends \WordPress_SimpleSettings {

	var $prefix = "_cfw_";

	public function __construct() {
		parent::__construct();

		// Silence is golden
	}
}