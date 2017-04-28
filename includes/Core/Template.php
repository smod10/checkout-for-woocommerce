<?php

namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Core\Base\Tracked;

/**
 * Template handler for associated template piece. Typically there should only be 3 of these in total (header, footer,
 * content)
 *
 * @link cgd.io
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class Template extends Tracked {

	/**
	 * The template path
	 *
	 * @since 0.1.0
	 * @access protected
	 * @var string $path The template path
	 */
	protected $path;

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
	 * @param $id
	 * @param $path
	 * @param $parameters
	 */
	public function __construct($id, $path, $parameters) {
		parent::__construct($id);

		$this->path = $path;
		$this->parameters = $parameters;
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
	 *
	 * @since 0.1.0
	 */
	public function view() {
		/**
		 * Extract the template global level items
		 *
		 * Global variables always extracted
		 * ---------------------------------
		 * $woo
		 * $checkout
		 */
		extract($this->parameters["global"], EXTR_SKIP);

		// Output the user level template variables into a template anon object
		$template = (object) $this->parameters["template"];

		require_once $this->get_path();
	}
}