<?php

namespace Objectiv\Plugins\Checkout;

use Objectiv\Plugins\Checkout\Action\ApplyCouponAction;
use Objectiv\Plugins\Checkout\Action\CompleteOrderAction;
use Objectiv\Plugins\Checkout\Language\i18n;
use Objectiv\Plugins\Checkout\Utilities\Activator;
use Objectiv\Plugins\Checkout\Utilities\Deactivator;
use Objectiv\Plugins\Checkout\Core\Base\Singleton;
use Objectiv\Plugins\Checkout\Core\Redirect;
use Objectiv\Plugins\Checkout\Core\Loader;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Managers\AjaxManager;
use Objectiv\Plugins\Checkout\Action\AccountExistsAction;
use Objectiv\Plugins\Checkout\Action\LogInAction;
use Objectiv\Plugins\Checkout\Action\UpdateShippingFieldsAction;
use Objectiv\Plugins\Checkout\Action\UpdateShippingMethodAction;

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
	 * Settings class for accessing user defined settings.
	 *
	 * @since 0.1.0
	 * @access private
	 * @var SettingsManager $settings The settings object.
	 */
	private $settings_manager;

	/**
	 * Updater class for handling licenses
	 *
	 * @since 0.1.0
	 * @access private
	 * @var \CGD_EDDSL_Magic $updater The updater object.
	 */
	private $updater;

	/**
	 * Main constructor.
	 */
	public function __construct() {
		// Program Details
		$this->plugin_name = "Checkout for WooCommerce";
		$this->version = "0.1.0";
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
	 * Get the settings manager
	 *
	 * @since 0.1.0
	 * @access public
	 * @return SettingsManager The settings manager object
	 */
	public function get_settings_manager() {
		return $this->settings_manager;
	}

	/**
	 * Get the updater object
	 *
	 * @since 0.1.0
	 * @access public
	 * @return \CGD_EDDSL_Magic The updater object
	 */
	public function get_updater() {
		return $this->updater;
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

		// Loads all the ajax handlers on the php side
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
//		$whoops = new Run();
//		$whoops->pushHandler(new PrettyPageHandler());
//		$whoops->register();

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

		// Create the ajax manager
		$this->ajax_manager = new AjaxManager($this->get_ajax_actions(), $this->loader);

		// The settings manager for the plugin
		$this->settings_manager = new SettingsManager();

		// License updater
		$this->updater = new \CGD_EDDSL_Magic("_cfw_licensing", false, $this->path_manager->get_url_base(), $this->get_version(), CFW_NAME, "Objectiv", $this->path_manager->get_main_file(), $theme = false);
	}

	/**
	 * @since 0.1.0
	 * @access private
	 */
	private function configure_objects() {
		$this->ajax_manager->load_all();
	}

	/**
	 * @return array
	 */
	public function get_ajax_actions() {
		return array(
			new AccountExistsAction("account_exists"),
			new LogInAction("login"),
			new UpdateShippingFieldsAction("update_shipping_fields"),
			new UpdateShippingMethodAction("update_shipping_method"),
			new CompleteOrderAction("complete_order"),
			new ApplyCouponAction("apply_coupon")
		);
	}

	public function set_assets() {
		$admin = "{$this->path_manager->get_assets_path()}/admin";
		$front = "{$this->path_manager->get_assets_path()}/front";
		$bower = "{$this->path_manager->get_assets_path()}/global/bower";
		$js = "{$this->path_manager->get_assets_path()}/global/js";

		$min = (!CO_DEV_MODE) ? ".min" : "";

		wp_enqueue_style('cfw_front_css', "${front}/css/checkout-woocommerce-front${min}.css", array(), $this->get_version());

		wp_enqueue_script('jquery');
		wp_enqueue_script('cfw_front_js_hash_change', "${bower}/easytabs/vendor/jquery.hashchange.min.js", array('jquery'));
		wp_enqueue_script('cfw_front_js_easy_tabs', "${bower}/easytabs/lib/jquery.easytabs.min.js", array('jquery'));
		wp_enqueue_script('cfw_front_js_garlic', "${bower}/garlicjs/dist/garlic.min.js", array('jquery'));
		wp_enqueue_script('cfw_front_js_parsley', "${bower}/parsleyjs/dist/parsley.js", array('jquery'));
		wp_enqueue_script('cfw_front_js_array_find_poly', "${js}/ArrayFindPoly.js", array('jquery'), $this->get_version());

//		wp_enqueue_script('cfw_front_js', "${front}/js/checkout-woocommerce-front${min}.js", array(), $this->get_version(), true);
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
	 * Handles general purpose WordPress actions.
	 *
	 * @since 0.1.0
	 * @access private
	 */
	private function load_actions() {
		$this->loader->add_action('wp_enqueue_scripts', array($this, 'set_assets'));

		// Add the Language class
		$this->loader->add_action('init', function() {
			$this->i18n->load_plugin_textdomain($this->path_manager);
		});

		// Handle the Activation notices
		$this->loader->add_action('admin_notices', function() {
			Activator::activate_admin_notice($this->path_manager);
		});

		// Setup the Checkout redirect
		$this->loader->add_action('template_redirect', function() {
			if ( $this->settings_manager->get_setting('enable') == "yes" || current_user_can('manage_options') ) {
				// For some reason, using the loader add_filter here doesn't work *shrug*
				add_filter( 'pre_option_woocommerce_registration_generate_password', array($this, 'override_woocommerce_registration_generate_password'), 10, 1 );

				Redirect::checkout($this->settings_manager, $this->path_manager, $this->template_manager, $this->version);
			}
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
		// filters
	}

	/**
	 * The code that runs during plugin activation.
	 * This action is documented in includes/class-midas-activator.php
	 */
	public static function activation() {
		Activator::activate();

		// Get main
		$main = Main::instance();

		// Init settings
		$main->settings_manager->add_setting('enable', 'no');
		$main->settings_manager->add_setting('header_background_color', '#ffffff');
		$main->settings_manager->add_setting('header_text_color', '#2b2b2b');
		$main->settings_manager->add_setting('footer_background_color', '#ffffff');
		$main->settings_manager->add_setting('footer_color', '#999999');
		$main->settings_manager->add_setting('link_color', '#e9a81d');
		$main->settings_manager->add_setting('button_color', '#e9a81d');
		$main->settings_manager->add_setting('button_text_color', '#000000');
		$main->settings_manager->add_setting('secondary_button_color', '#999999');
		$main->settings_manager->add_setting('secondary_button_text_color', '#ffffff');

		// Updater license status cron
		$main->updater->set_license_check_cron();
	}

	/**
	 * The code that runs during plugin deactivation.
	 * This action is documented in includes/class-midas-deactivator.php
	 */
	public static function deactivation() {
		Deactivator::deactivate();

		// Get main
		$main = Main::instance();

		// Remove cron for license update check
		$main->updater->unset_license_check_cron();
	}

	/**
	 * @return string
	 */
	function override_woocommerce_registration_generate_password() {
		return "yes";
	}
}