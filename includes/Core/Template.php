<?php

namespace Objectiv\Plugins\Checkout\Core;

/**
 * Template handler for associated template piece. Typically there should only be 3 of these in total (header, footer,
 * content)
 *
 * @link cgd.io
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

abstract class Template {

	/**
	 * The template path
	 *
	 * @since 0.1.0
	 * @access protected
	 * @var string $path The template path
	 */
	protected $path;

	/**
	 * The template callback
	 *
	 * @since 0.1.0
	 * @access protected
	 * @var string $callback The template callback
	 */
	protected $callback;

	/**
	 * The template parameters
	 *
	 * @since 0.1.0
	 * @access protected
	 * @var array $parameters The template parameters
	 */
	protected $parameters;

	/**
	 * Template constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param $path
	 */
	public function __construct($path) {
		$this->path = $path;
	}

	/**
	 * Return the callback for the template
	 *
	 * @since 0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_callback()
	{
		return $this->callback;
	}

	/**
	 * Get the parameters for the template
	 *
	 * @since 0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_parameters()
	{
		return $this->parameters;
	}

	/**
	 * Return the template path
	 *
	 * @since 0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_path()
	{
		return $this->path;
	}

	/**
	 * Call the template and its relevant callback. Override this
	 * @since 0.1.0
	 * @access public
	 * @return mixed
	 */
	abstract public function view();
}