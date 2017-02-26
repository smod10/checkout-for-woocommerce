<?php

namespace Objectiv\Plugins\Checkout\Core;

/**
 * Template handler for associated template piece
 *
 * @link       cgd.io
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout\Core
 */

/**
 * Template handler for associated template piece. Typically there should only be 3 of these in total (header, footer,
 * content)
 *
 * @since      0.1.0
 * @package    Objectiv\Plugins\Checkout\Core
 * @author     Brandon Tassone <brandontassone@gmail.com>
 */

class Template {

	/**
	 * The template path
	 *
	 * @since    0.1.0
	 * @access   protected
	 * @var      string    $path    The template path
	 */
	protected $path;

	/**
	 * The template callback
	 *
	 * @since    0.1.0
	 * @access   protected
	 * @var      string    $callback    The template callback
	 */
	protected $callback;

	/**
	 * The template parameters
	 *
	 * @since    0.1.0
	 * @access   protected
	 * @var      array    $parameters    The template parameters
	 */
	protected $parameters;

	/**
	 * Template constructor.
	 *
	 * @param $path
	 * @param $callback
	 * @param $parameters
	 */
	public function __construct($path, $callback, $parameters) {
		$this->path = $path;
		$this->callback = $callback;
		$this->parameters = $parameters;
	}

	/**
	 * @return mixed
	 */
	public function get_path()
	{
		return $this->path;
	}

	/**
	 * @return mixed
	 */
	public function get_callback()
	{
		return $this->callback;
	}

	/**
	 * @return mixed
	 */
	public function get_parameters()
	{
		return $this->parameters;
	}

	/**
	 * @return mixed
	 */
	public function view() {
		$output = call_user_func_array($this->callback, $this->parameters);

		require_once $this->path;
	}
}