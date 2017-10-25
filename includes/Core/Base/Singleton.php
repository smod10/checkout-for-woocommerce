<?php

namespace Objectiv\Plugins\Checkout\Core\Base;

/**
 * Enforces a single instance of an object. Useful for mission critical objects that should never be duplicated beyond
 * plugin initialization
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core\Base
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

abstract class Singleton
{
	/**
	 * @since 1.0.0
	 * @access private
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Singleton constructor. Just a stub. Do not fill with logic
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function __construct() {}

	/**
	 * Clone method. Just a stub. Do not fill with logic
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function __clone() {}

	/**
	 * Wakeup method. Just a stub. Do not fill with logic
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function __wakeup() {}

	/**
	 * Returns the class instantiated instance. Will return the first instance generated, and nothing else.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return null|static
	 */
	final public static function instance()
	{
		if (self::$instance === null) {
			self::$instance = new static;
		}

		return self::$instance;
	}
}