<?php
/**
 * Provides standard object for accessing user-defined plugin settings
 *
 * @link cgd.io
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core\Base
 * @author Brandon Tassone <brandontassone@gmail.com>
 */


namespace Objectiv\Plugins\Checkout\Managers;


class SettingsManager extends \WordPress_SimpleSettings {

	var $prefix = "_cfw_";

	public function __construct() {
		parent::__construct();

		// Silence is golden
	}
}