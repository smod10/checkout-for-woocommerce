<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Core\Loader;

class AjaxManager {

	/**
	 * @var array
	 */
	protected $ajax_modules;

	/**
	 * @var Loader
	 */
	protected $loader;

	/**
	 * AjaxManager constructor.
	 *
	 * @param array $ajax_modules
	 * @param Loader $loader
	 */
	public function __construct($ajax_modules, $loader) {
		$this->ajax_modules = $ajax_modules;
		$this->loader = $loader;
	}

	/**
	 *
	 */
	public function load_all() {
		foreach($this->ajax_modules as $ajax) {
			$ajax->load($this->get_loader());
		}
	}

	/**
	 * @return mixed
	 */
	public function get_ajax_modules() {
		return $this->ajax_modules;
	}

	/**
	 * @return mixed
	 */
	public function get_loader() {
		return $this->loader;
	}
}