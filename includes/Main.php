<?php

namespace Objectiv\Plugins\Checkout;

// Base package classes
use Objectiv\BoosterSeat\Language\i18n;
use Objectiv\BoosterSeat\Utilities\Activator;
use Objectiv\BoosterSeat\Utilities\Deactivator;
use Objectiv\BoosterSeat\Base\Singleton;

// Checkout for WooCommerce
use Objectiv\Plugins\Checkout\Action\ApplyCouponAction;
use Objectiv\Plugins\Checkout\Action\CompleteOrderAction;
use Objectiv\Plugins\Checkout\Action\UpdateCheckoutAction;
use Objectiv\Plugins\Checkout\Core\Form;
use Objectiv\Plugins\Checkout\Core\Redirect;
use Objectiv\Plugins\Checkout\Core\Loader;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Managers\AjaxManager;
use Objectiv\Plugins\Checkout\Managers\CFWPathManager;
use Objectiv\Plugins\Checkout\Action\AccountExistsAction;
use Objectiv\Plugins\Checkout\Action\LogInAction;
use Objectiv\Plugins\Checkout\Action\UpdateShippingMethodAction;
use Objectiv\Plugins\Checkout\Core\Compatibility;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class Main extends Singleton {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since 1.0.0
	 * @access private
	 * @var Loader $loader Maintains and registers all hooks for the plugin.
	 */
	private $loader;

	/**
	 * Template related functionality manager
	 *
	 * @since 1.0.0
	 * @access private
	 * @var TemplateManager $template_manager Handles all template related functionality.
	 */
	private $template_manager;

	/**
	 * @since 1.1.4
	 * @access private
	 * @var CFWPathManager $path_manager Handles the path information for the plugin
	 */
	private $path_manager;

	/**
	 * @since 1.0.0
	 * @access private
	 * @var AjaxManager $ajax_manager
	 */
	private $ajax_manager;

	/**
	 * Language class dealing with translating the various parts of the plugin
	 *
	 * @since 1.0.0
	 * @access private
	 * @var i18n The language class
	 */
	private $i18n;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since 1.0.0
	 * @access private
	 * @var string $plugin_name The string used to uniquely identify this plugin.
	 */
	private $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 1.0.0
	 * @access private
	 * @var string $version The current version of the plugin.
	 */
	private $version;

	/**
	 * Settings class for accessing user defined settings.
	 *
	 * @since 1.0.0
	 * @access private
	 * @var SettingsManager $settings The settings object.
	 */
	private $settings_manager;

	/**
	 * Updater class for handling licenses
	 *
	 * @since 1.0.0
	 * @access private
	 * @var \CGD_EDDSL_Magic $updater The updater object.
	 */
	private $updater;

	/**
	 * Settings class for accessing user defined settings.
	 *
	 * @since 1.1.4
	 * @access private
	 * @var Activator $activator Handles activation
	 */
	private $activator;

	/**
	 * Settings class for accessing user defined settings.
	 *
	 * @since 1.1.4
	 * @access private
	 * @var Deactivator $deactivator Handles deactivation
	 */
	private $deactivator;

	/**
	 * @since 1.1.5
	 * @access private
	 * @var Form $form Handles the WooCommerce form changes
	 */
	private $form;

	/**
	 * Main constructor.
	 */
	public function __construct() {
		// Program Details
		$this->plugin_name = "Checkout for WooCommerce";
		$this->version = CFW_VERSION;
	}

	/**
	 * Returns the i18n language class
	 *
	 * @since 1.0.0
	 * @access public
	 * @return i18n
	 */
	public function get_i18n() {
		return $this->i18n;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return Loader Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Returns the path manager
	 *
	 * @since 1.1.4
	 * @access public
	 * @return CFWPathManager
	 */
	public function get_path_manager() {
		return $this->path_manager;
	}

	/**
	 * @since 1.0.0
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
	 * @since 1.0.0
	 * @access public
	 * @return string The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Returns the template manager
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
	 * @access public
	 * @return string The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Get the settings manager
	 *
	 * @since 1.0.0
	 * @access public
	 * @return SettingsManager The settings manager object
	 */
	public function get_settings_manager() {
		return $this->settings_manager;
	}

	/**
	 * Get the updater object
	 *
	 * @since 1.0.0
	 * @access public
	 * @return \CGD_EDDSL_Magic The updater object
	 */
	public function get_updater() {
		return $this->updater;
	}

	/**
	 * Get the updater object
	 *
	 * @since 1.1.4
	 * @access public
	 * @return Activator The class handling activation of the plugin
	 */
	public function get_activator() {
		return $this->activator;
	}

	/**
	 * Get the updater object
	 *
	 * @since 1.1.4
	 * @access public
	 * @return Deactivator The class handling deactivation of the plugin
	 */
	public function get_deactivator() {
		return $this->deactivator;
	}

	/**
	 * @since 1.1.5
	 * @access public
	 * @return Form The form object
	 */
	public function get_form() {
		return $this->form;
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since 1.0.0
	 * @param string $file The file path to the main plugin file
	 */
	public function run($file) {
		// Enable program flags
		$this->check_flags();

		// Create and setup the plugins main objects
		$this->create_main_objects($file);

		// Loads all the ajax handlers on the php side
		$this->configure_objects();

		add_action('init', function() {
			// Adds the plugins hooks
			$this->add_plugin_hooks();
		});
	}

	/**
	 * When run checks to see if the flag is defined and its value (inversely). If found to be active, it runs the
	 * function
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
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
	 * @since 1.0.0
	 * @access private
	 * @param string $file The file path to the main plugin file
	 */
	private function create_main_objects($file) {

		// Create the loader for actions and filters
		$this->loader = new Loader();

		// Set up localization
		$this->i18n = new i18n('checkout-wc');

		// Activator
		$this->activator = new Activator($this->get_activator_checks());

		// Deactivator
		$this->deactivator = new Deactivator();

		// The path manager for the plugin
		$this->path_manager = new CFWPathManager(plugin_dir_path($file), plugin_dir_url($file), $file);

		// Create the template manager
		$this->template_manager = new TemplateManager();

		// Create the ajax manager
		$this->ajax_manager = new AjaxManager($this->get_ajax_actions(), $this->loader);

		// The settings manager for the plugin
		$this->settings_manager = new SettingsManager();

		// License updater
		$this->updater = new \CGD_EDDSL_Magic("_cfw_licensing", false, CFW_UPDATE_URL, $this->get_version(), CFW_NAME, "Objectiv", $file, $theme = false);
	}

	public function get_activator_checks() {
		return array(
			"woocommerce/woocommerce.php" => ["checkout-woocommerce_activation", array(
				"success"           => false,
				"class"             => "notice error",
				"message"           => __("Activation failed: Please activate WooCommerce in order to use Checkout for WooCommerce", $this->get_i18n()->get_text_domain())
			)]
		);
	}

	/**
	 * @since 1.0.0
	 * @access private
	 */
	private function configure_objects() {
		$this->ajax_manager->load_all();
	}

	/**
	 * @return array
	 */
	public function get_ajax_actions() {
		// Setting no_privilege to false because wc_ajax doesn't have a no privilege endpoint.
		return array(
			new AccountExistsAction("account_exists", false, "wc_ajax_"),
			new LogInAction("login", false, "wc_ajax_"),
			new UpdateShippingMethodAction("update_shipping_method", false, "wc_ajax_"),
			new CompleteOrderAction("complete_order", false, "wc_ajax_"),
			new ApplyCouponAction("apply_coupon", false, "wc_ajax_"),
			new UpdateCheckoutAction("update_checkout", false, "wc_ajax_"),
		);
	}

	/**
	 * Set the plugin assets
	 */
	public function set_assets() {
		if ( ! function_exists('is_checkout') || ! is_checkout() ) return;
		
		$front = "{$this->path_manager->get_assets_path()}/front";

		$min = ( ! CO_DEV_MODE ) ? ".min" : "";

		wp_enqueue_style('cfw_front_css', "${front}/css/checkout-woocommerce-front${min}.css", array(), $this->get_version());

		wp_enqueue_script('jquery');
		wp_enqueue_script('cfw_front_js', "${front}/js/checkout-woocommerce-front${min}.js", array('jquery'), $this->get_version(), true);

		$this->handle_countries();
	}

	public function handle_countries() {
		wp_localize_script('cfw_front_js', 'wc_country_select_params',  array(
			'countries'                 => json_encode( array_merge( WC()->countries->get_allowed_country_states(), WC()->countries->get_shipping_country_states() ) ),
			'i18n_select_state_text'    => esc_attr__( 'Select an option&hellip;', 'woocommerce' ),
			'i18n_no_matches'           => _x( 'No matches found', 'enhanced select', 'woocommerce' ),
			'i18n_ajax_error'           => _x( 'Loading failed', 'enhanced select', 'woocommerce' ),
			'i18n_input_too_short_1'    => _x( 'Please enter 1 or more characters', 'enhanced select', 'woocommerce' ),
			'i18n_input_too_short_n'    => _x( 'Please enter %qty% or more characters', 'enhanced select', 'woocommerce' ),
			'i18n_input_too_long_1'     => _x( 'Please delete 1 character', 'enhanced select', 'woocommerce' ),
			'i18n_input_too_long_n'     => _x( 'Please delete %qty% characters', 'enhanced select', 'woocommerce' ),
			'i18n_selection_too_long_1' => _x( 'You can only select 1 item', 'enhanced select', 'woocommerce' ),
			'i18n_selection_too_long_n' => _x( 'You can only select %qty% items', 'enhanced select', 'woocommerce' ),
			'i18n_load_more'            => _x( 'Loading more results&hellip;', 'enhanced select', 'woocommerce' ),
			'i18n_searching'            => _x( 'Searching&hellip;', 'enhanced select', 'woocommerce' ),
		));

		wp_localize_script('cfw_front_js', 'wc_address_i18n_params', array(
			'locale'             => json_encode( WC()->countries->get_country_locale() ),
			'locale_fields'      => json_encode( WC()->countries->get_country_locale_field_selectors() ),
			'add2_text'          => _x('Apt, suite, etc. (optional)', 'checkout-wc'),
			'i18n_required_text' => esc_attr__( 'required', 'woocommerce' )
		));
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

		if ( ( $this->license_is_valid() && $this->settings_manager->get_setting('enable') == "yes" ) || current_user_can('manage_options') ) {
			// Load Assets
			$this->loader->add_action( 'wp_enqueue_scripts', array( $this, 'set_assets' ) );

			// Load Compatibility Class
			$this->compatibility();

			// Required to render form fields
			$this->form = new Form();
		}

		// Add the actions and filters to the system. They were added to the class, this registers them in WordPress.
		$this->loader->run();
	}

	function compatibility() {
		new Compatibility();
	}

	/**
	 * Handles general purpose WordPress actions.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function load_actions() {

		// Add the Language class
		$this->i18n->load_plugin_textdomain($this->path_manager);

		// Override some WooCommerce Options
		if ( ( $this->license_is_valid() && $this->settings_manager->get_setting('enable') == "yes" ) ) {
			// For some reason, using the loader add_filter here doesn't work *shrug*
			add_filter( 'pre_option_woocommerce_registration_generate_password', array($this, 'override_woocommerce_registration_generate_password'), 10, 1 );
		}


		// Handle the Activation notices
		$this->loader->add_action('admin_notices', function() {
			$this->get_activator()->activate_admin_notice($this->get_path_manager());
		});

		// Setup the Checkout redirect
		$this->loader->add_action('template_redirect', function() {
			if ( ( $this->license_is_valid() && $this->settings_manager->get_setting('enable') == "yes" ) || current_user_can('manage_options') ) {
				// Call Redirect
				Redirect::checkout($this->settings_manager, $this->path_manager, $this->template_manager, $this->version);
			}
		});
	}

	/**
	 * Filters in this plugin allow you to augment a lot of the default functionality present. Anything mission critical
	 * that needs to be augmented will probably have a filter attached
	 *
	 * @since 1.0.0
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
		// Get main
		$main = Main::instance();

		$errors = $main->get_activator()->activate();

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

		if ( !$errors ) {

			// Welcome screen transient
			set_transient( '_cfw_welcome_screen_activation_redirect', true, 30 );
		}
	}

	/**
	 * The code that runs during plugin deactivation.
	 * This action is documented in includes/class-midas-deactivator.php
	 */
	public static function deactivation() {
		// Get main
		$main = Main::instance();

		$main->get_deactivator()->deactivate();

		// Remove cron for license update check
		$main->updater->unset_license_check_cron();
	}

	/**
	 * @return string
	 */
	function override_woocommerce_registration_generate_password( $result ) {
		if ( is_checkout() ) {
			return "yes";
		}

		return $result;
	}

	/**
	 * @return bool True if license valid, false if it is invalid
	 */
	function license_is_valid() {
		// Get main
		$main = Main::instance();

		$key_status = $main->updater->get_field_value('key_status');
		$license_key = $main->updater->get_field_value('license_key');

		$valid = true;

		// Validate Key Status
		if ( empty($license_key) || ( ($key_status !== "valid" || $key_status == "inactive" || $key_status == "site_inactive") ) ) {
			$valid = false;
		}

		return $valid;
	}
}