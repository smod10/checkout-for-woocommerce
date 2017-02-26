<?php

namespace Objectiv\Plugins\Checkout\Base;

/**
 * Base class Singleton
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout\Base
 */

/**
 * Enforces a single instance of an object. Useful for mission critical objects that should never be duplicated beyond
 * plugin initialization
 *
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Base
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

abstract class Singleton
{
	/**
	 * @since 0.1.0
	 * @access private
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Singleton constructor. Just a stub. Do not fill with logic
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function __construct() {}

	/**
	 * Clone method. Just a stub. Do not fill with logic
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function __clone() {}

	/**
	 * Wakeup method. Just a stub. Do not fill with logic
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function __wakeup() {}

	/**
	 * Returns the class instantiated instance. Will return the first instance generated, and nothing else.
	 *
	 * @since 0.1.0
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