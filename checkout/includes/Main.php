<?php

namespace Objectiv\Plugins\Checkout;

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       brandont.me
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      0.1.0
 * @package    Objectiv\Plugins\Checkout
 * @author     Brandon Tassone <brandontassone@gmail.com>
 */

class Main {
    /**
     * The loader that's responsible for maintaining and registering all hooks that power
     * the plugin.
     *
     * @since    0.1.0
     * @access   protected
     * @var      Loader    $loader    Maintains and registers all hooks for the plugin.
     */
	protected $loader;

    /**
     * The redirect class handles the theme redirects in relation to the woocommerce checkout system
     *
     * @since    0.1.0
     * @access   protected
     * @var      Redirect    $redirect    Maintains and registers all the redirects
     */
    protected $redirect;

    /**
     * The unique identifier of this plugin.
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $plugin_name    The string used to uniquely identify this plugin.
     */
	protected $plugin_name;

    /**
     * The current version of the plugin.
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
	protected $version;

    /**
     * Define the core functionality of the plugin.
     *
     * Set the plugin name and the plugin version that can be used throughout the plugin.
     * Load the dependencies, define the locale, and set the hooks for the admin area and
     * the public-facing side of the site.
     *
     * @since    0.1.0
     */
	public function __construct() {
		$this->plugin_name = "Checkout";
		$this->version = "0.1.0";

		$this->loader = new Loader();
		$this->redirect = new Redirect();

		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->enable_redirects();
		$this->check_flags();
	}

    /**
     * When run checks to see if the flag is defined and its value (inversely). If found to be active, it runs the
     * function
     *
     * @since    0.1.0
     * @access   private
     */
	private function check_flags() {
        (!defined('CO_DEV_MODE') || !CO_DEV_MODE) ?: $this->enable_dev_mode();
    }

    /**
     * Enables libraries and functions for the specific task of aiding in development
     *
     * @since    0.1.0
     * @access   private
     */
	private function enable_dev_mode() {
        $whoops = new \Whoops\Run;
        $whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
        $whoops->register();

        // Enable Kint
        \Kint::enabled(true);
    }

    /**
     * Enables the redirects that reroute certain portions of the woocommerce framework
     *
     * @since    0.1.0
     * @access   protected
     */
	protected function enable_redirects() {
	    $this->loader->add_action('template_redirect', $this->redirect, 'checkout_redirect');
    }

    /**
     * The reference to the class that orchestrates the hooks with the plugin.
     *
     * @since     0.1.0
     * @return    Loader    Orchestrates the hooks of the plugin.
     */
	public function get_loader() {
		return $this->loader;
	}

    /**
     * The name of the plugin used to uniquely identify it within the context of
     * WordPress and to define internationalization functionality.
     *
     * @since     0.1.0
     * @return    string    The name of the plugin.
     */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

    /**
     * Retrieve the version number of the plugin.
     *
     * @since     0.1.0
     * @return    string    The version number of the plugin.
     */
	public function get_version() {
		return $this->version;
	}

    /**
     * Run the loader to execute all of the hooks with WordPress.
     *
     * @since    0.1.0
     */
	public function run() {
		$this->loader->run();
	}

    /**
     * Register all of the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    0.1.0
     * @access   private
     */
	private function define_admin_hooks() {

	}

    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    0.1.0
     * @access   private
     */
	private function define_public_hooks() {

	}

    /**
     * Define the locale for this plugin for internationalization.
     *
     * Uses the i18n class in order to set the domain and to register the hook
     * with WordPress.
     *
     * @since    0.1.0
     * @access   private
     */
	private function set_locale() {
		$plugin_i18n = new i18n();

		$this->loader->add_action('plugins_loaded', $plugin_i18n, 'load_plugin_textdomain');
	}
}