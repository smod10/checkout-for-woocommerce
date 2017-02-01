<?php

namespace Objective\Plugins\Midas;

class Main {
	protected $loader;
	protected $plugin_name;
	protected $version;

	public function __construct() {
		$this->plugin_name = "Midas";
		$this->version = "1.0.0";

		$this->load_dependencies();
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
		// Run
	}

	private function define_admin_hooks() {
		// Midas admin wrap stuff goes here.
	}

	private function define_public_hooks() {
		// Public facing template goes here.
	}

	private function load_dependencies() {
		// Loader logic and wrap here
	}

	private function set_locale() {
		// Language classes go here
	}
}