<?php

namespace Objectiv\Plugins\Checkout;

use Objectiv\Plugins\Checkout\Base\Singleton;
use Objectiv\Plugins\Checkout\Core\Loader;
use Objectiv\Plugins\Checkout\Core\Redirect;
use Objectiv\Plugins\Checkout\Utilities\Activator;
use Objectiv\Plugins\Checkout\Language\i18n;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       cgd.io
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

class Main extends Singleton {
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
     * The redirect class handles the theme redirects in relation to the woocommerce checkout system
     *
     * @since    0.1.0
     * @access   protected
     * @var      TemplateManager    $template_manager    Handles all template related functionality.
     */
    protected $template_manager;

    /**
     * The unique identifier of this plugin.
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $plugin_name    The string used to uniquely identify this plugin.
     */
    protected $plugin_name;

	/**
	 * @since   0.1.0
	 * @access  protected
	 * @var     PathManager     $path_manager       Handles the path information for the plugin
	 */
    protected $path_manager;

    /**
     * The current version of the plugin.
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    protected $version;


	/**
	 * Takes place of the constructor for the main class. Calls this to setup the plugin.
	 *
	 * @param $path_manager PathManager Plugin related path information
	 */
	public function setup($path_manager) {
	    // Program Details
	    $this->plugin_name = "Checkout for Woocommerce";
	    $this->version = "0.1.0";
	    $this->path_manager = $path_manager;

	    // Enable program flags
	    $this->check_flags();

	    // Instantiate program objects
	    $this->loader = new Loader();

		// Create the template manager
		$this->template_manager = new TemplateManager();

	    // Set up localization
	    $this->set_locale();

	    // Load the plugin actions
	    $this->load_actions();

	    // Pull in backend admin and public resources
	    $this->define_admin_hooks();
	    $this->define_public_hooks();

	    // Enable the checkout redirects
	    $this->enable_redirects();
    }

    /**
     * Handles general purpose Wordpress actions.
     */
    protected function load_actions() {
        $this->loader->add_action('admin_notices', function(){
        	Activator::activate_admin_notice($this->path_manager);
        });
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
     * Whoops - Pretty Errors
     * Kint - Pretty Debug
     *
     * @since    0.1.0
     * @access   private
     */
    private function enable_dev_mode() {
        // Enable Whoops
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
        $this->redirect = new Redirect();

        $this->loader->add_action('template_redirect', function(){
        	$this->redirect->checkout($this->template_manager);
        });
    }

	/**
	 * Returns the path manager
	 *
	 * @return PathManager
	 */
	public function get_path_manager() {
    	return $this->path_manager;
    }

    /**
     * Returns the template manager
     *
     * @return TemplateManager
     */
    public function get_template_manager()
    {
        return $this->template_manager;
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

        $this->loader->add_action('init', array($plugin_i18n, 'load_plugin_textdomain'));
    }
}