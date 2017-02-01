<?php

namespace Objectiv\Plugins\Checkout;

class Main {
	protected $loader;
	protected $plugin_name;
	protected $version;

	public function __construct() {
		$this->plugin_name = "Checkout";
		$this->version = "1.0.0";

		$this->loader = new Loader();

		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	public function get_loader() {
		return $this->loader;
	}

	public function get_plugin_name() {
		return $this->plugin_name;
	}

	public function get_version() {
		return $this->version;
	}

	public function run() {
		$this->loader->run();
	}

	private function define_admin_hooks() {
		// Checkout admin wrap stuff goes here.
	}

	private function define_public_hooks() {
		// Public facing template goes here.
	}

	private function set_locale() {
		// Language classes go here
	}
}