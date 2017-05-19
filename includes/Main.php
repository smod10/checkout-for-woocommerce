<?php

namespace Objectiv\Plugins\Checkout;

use Objectiv\Plugins\Checkout\Assets\AdminAssets;
use Objectiv\Plugins\Checkout\Assets\FrontAssets;
use Objectiv\Plugins\Checkout\Language\i18n;
use Objectiv\Plugins\Checkout\Utilities\Activator;
use Objectiv\Plugins\Checkout\Utilities\Deactivator;
use Objectiv\Plugins\Checkout\Core\Base\Singleton;
use Objectiv\Plugins\Checkout\Core\Redirect;
use Objectiv\Plugins\Checkout\Core\Loader;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Managers\AssetsManager;
use Objectiv\Plugins\Checkout\Managers\AjaxManager;
use Objectiv\Plugins\Checkout\Action\AccountExistsAction;
use Objectiv\Plugins\Checkout\Action\LogInAction;

use \Whoops\Run;
use \Whoops\Handler\PrettyPageHandler;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @link cgd.io
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
	 * Template related functionality manager
	 *
	 * @since 0.1.0
	 * @access private
	 * @var TemplateManager $template_manager Handles all template related functionality.
	 */
	private $template_manager;

	/**
	 * @since 0.1.0
	 * @access private
	 * @var AssetsManager $assets_manager Handles the assets and asset registration
	 */
	private $assets_manager;

	/**
	 * @since 0.1.0
	 * @access private
	 * @var PathManager $path_manager Handles the path information for the plugin
	 */
	private $path_manager;

	/**
	 * @since 0.1.0
	 * @access private
	 * @var AjaxManager $ajax_manager
	 */
	private $ajax_manager;

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
	 * Main constructor.
	 */
	public function __construct() {
		// Program Details
		$this->plugin_name = "Checkout for Woocommerce";
		$this->version = "0.1.0";
	}

	/**
	 * Returns the AssetsManager object for the plugin
	 *
	 * @since 0.1.0
	 * @access public
	 * @return AssetsManager
	 */
	public function get_assets_manager() {
		return $this->assets_manager;
	}

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
	 * @since 0.1.0
	 * @access public
	 * @return AjaxManager
	 */
	public function get_ajax_manager() {
		return $this->ajax_manager;
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
	 * @param string $file The file path to the main plugin file
	 */
	public function run($file) {
		// Enable program flags
		$this->check_flags();

		// Create and setup the plugins main objects
		$this->create_main_objects($file);

		$this->configure_objects();

		// Adds the plugins hooks
		$this->add_plugin_hooks();
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
		$whoops = new Run();
		$whoops->pushHandler(new PrettyPageHandler());
		$whoops->register();

		// Enable Kint
		\Kint::enabled(true);
	}

	/**
	 * Creates the main objects used in this plugins setup and processing
	 *
	 * Note: Realistically the only function that would be needed for testing.
	 *
	 * @since 0.1.0
	 * @access private
	 * @param string $file The file path to the main plugin file
	 */
	private function create_main_objects($file) {

		// Create the loader for actions and filters
		$this->loader = new Loader();

		// Set up localization
		$this->i18n = new i18n();

		// The path manager for the plugin
		$this->path_manager = new PathManager(plugin_dir_path($file), plugin_dir_url($file), basename($file));

		// Create the template manager
		$this->template_manager = new TemplateManager();

		// Create the asset manager and register the assets
		$this->assets_manager = new AssetsManager($this->get_assets());

		// Create the ajax manager
		$this->ajax_manager = new AjaxManager($this->get_ajax_actions(), $this->loader);
	}

	/**
	 * @since 0.1.0
	 * @access private
	 */
	private function configure_objects() {
		$this->ajax_manager->load_all();
	}

	public function get_ajax_actions() {
		return array(
			new AccountExistsAction("account_exists"),
			new LogInAction("login")
		);
	}

	public function get_assets() {
		$admin = "{$this->path_manager->get_assets_path()}/admin";
		$front = "{$this->path_manager->get_assets_path()}/front";
		$bower = "{$this->path_manager->get_assets_path()}/global/bower";
		$js = "{$this->path_manager->get_assets_path()}/global/js";

		$min = (!CO_DEV_MODE) ? ".min" : "";

		return array(
			new FrontAssets("front_assets", array(
				"css" => array(
					(object) array(
						"path" => "$front/css/checkout-woocommerce-front{$min}.css",
						"attrs" => array()
					)
				),
				"js" => array(
					(object) array(
						"path" => "$bower/easytabs/vendor/jquery-1.7.1.min.js",
						"attrs" => array()
					),
					(object) array(
						"path" => "$bower/easytabs/vendor/jquery.hashchange.min.js",
						"attrs" => array()
					),
					(object) array(
						"path" => "$bower/requirejs/require.js",
						"attrs" => array()
					),
					(object) array(
						"path" => "$bower/easytabs/lib/jquery.easytabs.min.js",
						"attrs" => array()
					),
					(object) array(
						"path" => "$bower/garlicjs/dist/garlic.min.js",
						"attrs" => array()
					),
					(object) array(
						"path" => "$js/ArrayFindPoly.js",
						"attrs" => array()
					)
				)
			)),
			new AdminAssets("admin_assets", array(
				"css" => array(
					(object) array(
						"path" => "$admin/css/checkout-woocommerce-admin{$min}.css",
						"attrs" => array()
					)
				),
				"js" => array(
					(object) array(
						"path" => "$admin/js/checkout-woocommerce-admin{$min}.js",
						"attrs" => array()
					)
				)
			))
		);
	}

	/**
	 * Add the actions and hooks used by the plugin (filtered through the Loader class) then run register them with
	 * WordPress
	 */
	public function add_plugin_hooks() {
		// Load the plugin actions
		$this->load_actions();

		// Load the plugin filters
		$this->load_filters();

		// Add the actions and filters to the system. They were added to the class, this registers them in WordPress.
		$this->loader->run();
	}

	/**
	 * Handles general purpose Wordpress actions.
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function load_actions() {
		// Add the Language class
		$this->loader->add_action('init', function(){
			$this->i18n->load_plugin_textdomain($this->path_manager);
		});

		// Handle the Activation notices
		$this->loader->add_action('admin_notices', function(){
			Activator::activate_admin_notice($this->path_manager);
		});

		// Add the admin assets
		$this->loader->add_action('admin_enqueue_scripts', function(){
			$this->assets_manager->load_assets($this->version, 'admin_assets');
		});

		// Setup the Checkout redirect
		$this->loader->add_action('template_redirect', function(){
			Redirect::checkout($this->path_manager, $this->template_manager, $this->assets_manager, $this->version);
		});
	}

	/**
	 * Filters in this plugin allow you to augment a lot of the default functionality present. Anything mission critical
	 * that needs to be augmented will probably have a filter attached
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function load_filters() {
		// Filters go here...
	}

	/**
	 * The code that runs during plugin activation.
	 * This action is documented in includes/class-midas-activator.php
	 */
	public static function activation() {
		Activator::activate();
	}

	/**
	 * The code that runs during plugin deactivation.
	 * This action is documented in includes/class-midas-deactivator.php
	 */
	public static function deactivation() {
		Deactivator::deactivate();
	}
}