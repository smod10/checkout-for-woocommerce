<?php

namespace Objectiv\Plugins\Checkout;

use Objectiv\Plugins\Checkout\Base\Singleton;
use Objectiv\Plugins\Checkout\Core\Loader;
use Objectiv\Plugins\Checkout\Core\Redirect;
use Objectiv\Plugins\Checkout\Utilities\Activator;
use Objectiv\Plugins\Checkout\Language\i18n;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Managers\AssetManager;

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link cgd.io
 * @since 0.1.0
 *
 * @package Objectiv\Plugins\Checkout
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
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class Main extends Singleton {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since 0.1.0
	 * @access private
	 * @var Loader $loader Maintains and registers all hooks for the plugin.
	 */
	private $loader;

	/**
	 * The redirect class handles the theme redirects in relation to the woocommerce checkout system
	 *
	 * @since 0.1.0
	 * @access private
	 * @var Redirect $redirect Maintains and registers all the redirects
	 */
	private $redirect;

	/**
	 * The redirect class handles the theme redirects in relation to the woocommerce checkout system
	 *
	 * @since 0.1.0
	 * @access private
	 * @var TemplateManager $template_manager Handles all template related functionality.
	 */
	private $template_manager;

	/**
	 * @since 0.1.0
	 * @access private
	 * @var AssetManager $asset_manager Handles the assets and asset registration
	 */
	private $asset_manager;

	/**
	 * @since 0.1.0
	 * @access private
	 * @var PathManager $path_manager Handles the path information for the plugin
	 */
	private $path_manager;

	/**
	 * Language class dealing with translating the various parts of the plugin
	 *
	 * @since 0.1.0
	 * @access private
	 * @var i18n The language class
	 */
	private $i18n;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since 0.1.0
	 * @access private
	 * @var string $plugin_name The string used to uniquely identify this plugin.
	 */
	private $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 0.1.0
	 * @access private
	 * @var string $version The current version of the plugin.
	 */
	private $version;

	/**
	 * Returns the i18n language class
	 *
	 * @since 0.1.0
	 * @access public
	 * @return i18n
	 */
	public function get_i18n() {
		return $this->i18n;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since 0.1.0
	 * @access public
	 * @return Loader Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Returns the path manager
	 *
	 * @since 0.1.0
	 * @access public
	 * @return PathManager
	 */
	public function get_path_manager() {
		return $this->path_manager;
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since 0.1.0
	 * @access public
	 * @return string The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Returns the template manager
	 *
	 * @since 0.1.0
	 * @access public
	 * @return TemplateManager
	 */
	public function get_template_manager()
	{
		return $this->template_manager;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since 0.1.0
	 * @access public
	 * @return string The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since 0.1.0
	 * @access public
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * Takes place of the constructor for the main class. Calls this to setup the plugin.
	 *
	 * @since 0.1.0
	 * @access public
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

		// Set up localization
		$this->set_locale();

		// Create the template manager
		$this->template_manager = new TemplateManager($this->path_manager);
		$this->template_manager->create_templates($path_manager);

		// Create the asset manager and register the assets
		$this->asset_manager = new AssetManager($this->path_manager);
		$this->asset_manager->register_assets($path_manager, $this->plugin_name, $this->version);

		// Load the plugin actions
		$this->load_actions();

		// Enable the checkout redirects
		$this->enable_redirects();
	}

	/**
	 * When run checks to see if the flag is defined and its value (inversely). If found to be active, it runs the
	 * function
	 *
	 * @since 0.1.0
	 * @access private
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
	 * @since 0.1.0
	 * @access private
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
	 * @since 0.1.0
	 * @access private
	 */
	private function enable_redirects() {
		$this->redirect = new Redirect();

		$this->loader->add_filter('template_include', function($wp_template) {
			$this->redirect->checkout($this->template_manager, $wp_template);
		});
	}

	/**
	 * Handles general purpose Wordpress actions.
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function load_actions() {
		$this->loader->add_action('admin_notices', function(){ Activator::activate_admin_notice($this->path_manager); });

		$this->register_admin_assets();
		$this->register_front_assets();
	}

	private function register_admin_assets() {
		$admin_assets = $this->asset_manager->get_assets()['admin'];

		$this->loader->add_action( 'admin_enqueue_scripts', array($admin_assets, 'enqueue_styles') );
		$this->loader->add_action( 'admin_enqueue_scripts', array($admin_assets, 'enqueue_scripts') );
	}

	private function register_front_assets() {
		$front_assets = $this->asset_manager->get_assets()['front'];

		$this->loader->add_action( 'wp_enqueue_scripts', array($front_assets, 'enqueue_styles') );
		$this->loader->add_action( 'wp_enqueue_scripts', array($front_assets, 'enqueue_scripts') );
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function set_locale() {
		$this->i18n = new i18n();

		$this->loader->add_action('init', function(){
			$this->i18n->load_plugin_textdomain($this->path_manager);
		});
	}
}