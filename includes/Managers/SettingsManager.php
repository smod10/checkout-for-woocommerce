<?php
/**
 * Provides standard object for accessing user-defined plugin settings
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Managers
 * @author Brandon Tassone <brandontassone@gmail.com>
 */


namespace Objectiv\Plugins\Checkout\Managers;

/**
 * Class SettingsManager
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Managers
 * @author Clifton Griffin <clif@objectiv.co>
 */
class SettingsManager extends \WordPress_SimpleSettings {

	var $prefix = "_cfw_";

	/**
	 * SettingsManager constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		parent::__construct();

		// Silence is golden
	}
}