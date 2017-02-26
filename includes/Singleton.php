<?php
/**
 * Created by PhpStorm.
 * User: brandontassone
 * Date: 2/25/17
 * Time: 10:10 PM
 */

namespace Objectiv\Plugins\Checkout;

abstract class Singleton
{
	private static $_i = null;

	private function __construct() {}
	private function __clone() {}
	private function __wakeup() {}

	final public static function i()
	{
		if (self::$_i === null) {
			self::$_i = new static;
		}

		return self::$_i;
	}
}