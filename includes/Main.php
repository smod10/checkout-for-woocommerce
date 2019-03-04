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
use Objectiv\Plugins\Checkout\Action\UpdatePaymentMethod;
use Objectiv\Plugins\Checkout\Core\Customizer;
use Objectiv\Plugins\Checkout\Core\Form;
use Objectiv\Plugins\Checkout\Core\Redirect;
use Objectiv\Plugins\Checkout\Core\Loader;
use Objectiv\Plugins\Checkout\Stats\StatCollection;
use Objectiv\Plugins\Checkout\Managers\ActivationManager;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Managers\AjaxManager;
use Objectiv\Plugins\Checkout\Managers\ExtendedPathManager;
use Objectiv\Plugins\Checkout\Action\AccountExistsAction;
use Objectiv\Plugins\Checkout\Action\LogInAction;
use Objectiv\Plugins\Checkout\Compatibility\Manager as CompatibilityManager;

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
	 * @var ExtendedPathManager $path_manager Handles the path information for the plugin
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
	 * Customizer compatibility class
	 *
	 * @since 2.4.0
	 * @access private
	 * @var Customizer $customizer The updater object.
	 */
	private $customizer;

	/**
	 * Activation manager for handling activation conditions
	 *
	 * @since 1.1.4
	 * @access private
	 * @var ActivationManager $activation_manager Handles activation
	 */
	private $activation_manager;

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
	 * @since 2.4.12
	 * @access private
	 * @var StatCollection Handles the stat collection for CFW
	 */
	private $stat_collection;

	/**
	 * Main constructor.
	 */
	public function __construct() {
		// Program Details
		$this->plugin_name = 'Checkout for WooCommerce';
		$this->version     = CFW_VERSION;
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
	 * @return ExtendedPathManager
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
	public function get_template_manager() {
		return $this->template_manager;
	}

	/**
	 * Returns the template manager
	 *
	 * @since 1.0.0
	 * @access public
	 * @return void
	 */
	public function set_template_manager( $template_manager ) {
		$this->template_manager = $template_manager;
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
	 * Set the settings manager
	 *
	 * @since 1.0.0
	 * @access public
	 * @return void
	 */
	public function set_settings_manager( $settings_manager ) {
		$this->settings_manager = $settings_manager;
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
	 * @return ActivationManager The class handling activation of the plugin
	 */
	public function get_activation_manager() {
		return $this->activation_manager;
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
	 * @since 2.4.12
	 * @access public
	 * @return Stats\StatCollection The form object
	 */
	public function get_stat_collection() {
		return $this->stat_collection;
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since 1.0.0
	 * @param string $file The file path to the main plugin file
	 */
	public function run( $file ) {
		// Enable program flags
		$this->check_flags();

		// Create and setup the plugins main objects
		$this->create_main_objects( $file );

		// Loads all the ajax handlers on the php side
		$this->configure_objects();

		// Run this as early as we can to maximize integrations
		add_action(
			'plugins_loaded', function() {
				// Adds the plugins hooks
				$this->add_plugin_hooks();
			}, 0
		);
	}

	/**
	 * When run checks to see if the flag is defined and its value (inversely). If found to be active, it runs the
	 * function
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function check_flags() {
		( ! defined( 'CFW_DEV_MODE' ) || ! CFW_DEV_MODE ) ?: $this->enable_dev_mode();
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
		// Enable Kint
		if ( class_exists( '\Kint' ) && property_exists( '\Kint', 'enabled_mode' ) ) {
			\Kint::$enabled_mode = true;
		}
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
	private function create_main_objects( $file ) {

		// Create the loader for actions and filters
		$this->loader = new Loader();

		// Set up localization
		$this->i18n = new i18n( 'checkout-wc' );

		// Activation Manager
		$this->activation_manager = new ActivationManager( $this->get_activator_checks() );

		// Deactivator
		$this->deactivator = new Deactivator();

		// The path manager for the plugin
		$this->path_manager = new ExtendedPathManager( plugin_dir_path( $file ), plugin_dir_url( $file ), $file );

		// The settings manager for the plugin
		$this->settings_manager = new SettingsManager();

		// Stat collection
		$this->stat_collection = StatCollection::instance($this->settings_manager);

		$active_template = $this->settings_manager->get_setting( 'active_template' );

		// Create the template manager
		$this->template_manager = new TemplateManager( $this->path_manager, empty( $active_template ) ? 'default' : $active_template );

		if ( apply_filters( 'cfw_should_load_template_functions', true ) ) {
			$this->template_manager->load_template_functions();
		}

		// Create the ajax manager
		$this->ajax_manager = new AjaxManager( $this->get_ajax_actions(), $this->loader );

		// License updater
		$this->updater = new \CGD_EDDSL_Magic( '_cfw_licensing', false, CFW_UPDATE_URL, $this->get_version(), CFW_NAME, 'Objectiv', $file, $theme = false );

		// Customizer
		$this->customizer = new Customizer( $this->get_settings_manager(), $this->get_template_manager(), $this->get_path_manager() );
	}

	public function get_activator_checks() {
		return array(
			array(
				'id'       => 'checkout-woocommerce_activation',
				'function' => 'class_exists',
				'value'    => 'WooCommerce',
				'message'  => array(
					'success' => false,
					'class'   => 'notice error',
					'message' => __( 'Activation failed: Please activate WooCommerce in order to use Checkout for WooCommerce', 'checkout-wc' ),
				),
			),
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
			new AccountExistsAction( 'account_exists', false, 'wc_ajax_' ),
			new LogInAction( 'login', false, 'wc_ajax_' ),
			new CompleteOrderAction( 'complete_order', false, 'wc_ajax_' ),
			new ApplyCouponAction( 'cfw_apply_coupon', false, 'wc_ajax_' ),
			new UpdateCheckoutAction( 'update_checkout', false, 'wc_ajax_' ),
			new UpdatePaymentMethod( 'update_payment_method', false, 'wc_ajax_' ),
		);
	}

	/**
	 * Set the plugin assets
	 */
	public function set_assets() {
		if ( ! Main::is_checkout() ) {
			return;
		}

		global $wp;

		$front = "{$this->path_manager->get_assets_path()}/front";

		$selected_template                   = $this->template_manager->get_selected_template();
		$selected_template_info              = $this->template_manager->get_templates_information()[ $selected_template ];
		$selected_template_base_path         = $selected_template_info['base_path'];
		$selected_template_base_url_path     = $selected_template_info['base_url_path'];
		$selected_template_stylesheet_is_min = $this->template_manager->get_generated_file_info(
			$selected_template_base_path,
			$this->template_manager->get_theme_style_filename(),
			'css'
		)['is_min'];
		$selected_template_javascript_is_min = $this->template_manager->get_generated_file_info(
			$selected_template_base_path,
			$this->template_manager->get_theme_javascript_filename(),
			'js'
		)['is_min'];

		$min            = ( ! CFW_DEV_MODE ) ? '.min' : '';
		$user_style_min = ( $selected_template_stylesheet_is_min ) ? '.min' : '';
		$user_js_min    = ( $selected_template_javascript_is_min ) ? '.min' : '';

		// Styles
		wp_enqueue_style( 'cfw_front_css', "{$front}/css/checkout-woocommerce-front{$min}.css", array(), $this->get_version() );
		wp_enqueue_style( 'cfw_front_template_css', "{$selected_template_base_url_path}/{$this->template_manager->get_theme_style_filename()}{$user_style_min}.css", array(), $this->get_version() );

		// Scripts
		wp_enqueue_script( 'cfw_front_js', "{$front}/js/checkout-woocommerce-front{$min}.js", array( 'jquery', 'jquery-blockui', 'jquery-migrate' ), $this->get_version() );
		wp_enqueue_script( 'cfw_front_template_js', "{$selected_template_base_url_path}/{$this->template_manager->get_theme_javascript_filename()}{$user_js_min}.js", array( 'jquery' ), $this->get_version(), true );

		wp_localize_script(
			'cfw_front_js', 'cfwEventData', array(
				'elements'      => array(
					'easyTabsWrapElClass'  => apply_filters( 'cfw_template_easy_tabs_wrap_el_id', '.cfw-tabs-initialize' ),
					'breadCrumbElId'       => apply_filters( 'cfw_template_breadcrumb_id', '#cfw-breadcrumb' ),
					'customerInfoElId'     => apply_filters( 'cfw_template_customer_info_el', '#cfw-customer-info' ),
					'shippingMethodElId'   => apply_filters( 'cfw_template_shipping_method_el', '#cfw-shipping-method' ),
					'paymentMethodElId'    => apply_filters( 'cfw_template_payment_method_el', '#cfw-payment-method' ),
					'tabContainerElId'     => apply_filters( 'cfw_template_tab_container_el', '#cfw-tab-container' ),
					'alertContainerId'     => apply_filters( 'cfw_template_alert_container_el', '#cfw-alert-container' ),
					'cartContainerId'      => apply_filters( 'cfw_template_cart_el', '#cfw-totals-list' ),
					'cartSubtotalId'       => apply_filters( 'cfw_template_cart_subtotal_el', '#cfw-cart-subtotal' ),
					'cartShippingId'       => apply_filters( 'cfw_template_cart_shipping_el', '#cfw-cart-shipping-total' ),
					'cartTaxesId'          => apply_filters( 'cfw_template_cart_taxes_el', '#cfw-cart-taxes' ),
					'cartFeesId'           => apply_filters( 'cfw_template_cart_fees_el', '#cfw-cart-fees' ),
					'cartTotalId'          => apply_filters( 'cfw_template_cart_total_el', '#cfw-cart-total' ),
					'cartCouponsId'        => apply_filters( 'cfw_template_cart_coupons_el', '#cfw-cart-coupons' ),
					'cartReviewBarId'      => apply_filters( 'cfw_template_cart_review_bar_id', '#cfw-cart-details-review-bar' ),
					'checkoutFormSelector' => apply_filters( 'cfw_checkout_form_selector', '.woocommerce-checkout' ),
				),
				'ajaxInfo'      => array(
					'url'   => get_home_url(),
					'nonce' => wp_create_nonce( 'some-seed-word' ),
				),
				'compatibility' => apply_filters( 'cfw_typescript_compatibility_classes_and_params', array() ),
				'settings'      => array(
					'user_logged_in'                  => ( is_user_logged_in() ) ? true : false,
					'is_stripe_three'                 => ( defined( 'WC_STRIPE_VERSION' ) && ( version_compare( WC_STRIPE_VERSION, '4.0.0' ) >= 0 || version_compare( WC_STRIPE_VERSION, '3.0.0', '<' ) ) ) ? false : true,
					'default_address_fields'          => array_keys( WC()->countries->get_default_address_fields() ),
					'enable_zip_autocomplete'         => apply_filters( 'cfw_enable_zip_autocomplete', true ) ? true : false,
					'locale'                          => defined( 'ICL_LANGUAGE_CODE' ) ? ICL_LANGUAGE_CODE : strstr( get_user_locale(), '_', true ),
					'check_create_account_by_default' => apply_filters( 'cfw_check_create_account_by_default', true ) ? true : false,
				),
			)
		);

		wp_localize_script(
			'cfw_front_js', 'woocommerce_params', array(
				'ajax_url'                       => WC()->ajax_url(),
				'wc_ajax_url'                    => \WC_AJAX::get_endpoint( '%%endpoint%%' ),
				'update_order_review_nonce'      => wp_create_nonce( 'update-order-review' ),
				'apply_coupon_nonce'             => wp_create_nonce( 'apply-coupon' ),
				'remove_coupon_nonce'            => wp_create_nonce( 'remove-coupon' ),
				'option_guest_checkout'          => get_option( 'woocommerce_enable_guest_checkout' ),
				'checkout_url'                   => \WC_AJAX::get_endpoint( 'checkout' ),
				'cart_url'                       => wc_get_cart_url(),
				'is_checkout'                    => is_page( wc_get_page_id( 'checkout' ) ) && empty( $wp->query_vars['order-pay'] ) && ! isset( $wp->query_vars['order-received'] ) ? 1 : 0,
				'debug_mode'                     => defined( 'WP_DEBUG' ) && WP_DEBUG,
				'i18n_checkout_error'            => cfw_esc_attr__( 'Error processing checkout. Please try again.', 'woocommerce' ),
				'is_registration_enabled'        => WC()->checkout()->is_registration_enabled() ? 1 : 0,
				'is_registration_required'       => WC()->checkout()->is_registration_required() ? 1 : 0,
				'enable_checkout_login_reminder' => 'yes' === get_option( 'woocommerce_enable_checkout_login_reminder' ) ? 1 : 0,
			)
		);

		$this->handle_countries();
	}

	public function handle_countries() {
		wp_localize_script(
			'cfw_front_js', 'wc_country_select_params', array(
				'countries'                 => json_encode( array_merge( WC()->countries->get_allowed_country_states(), WC()->countries->get_shipping_country_states() ) ),
				'i18n_select_state_text'    => cfw_esc_attr__( 'Select an option&hellip;', 'woocommerce' ),
				'i18n_no_matches'           => cfw_x( 'No matches found', 'enhanced select', 'woocommerce' ),
				'i18n_ajax_error'           => cfw_x( 'Loading failed', 'enhanced select', 'woocommerce' ),
				'i18n_input_too_short_1'    => cfw_x( 'Please enter 1 or more characters', 'enhanced select', 'woocommerce' ),
				'i18n_input_too_short_n'    => cfw_x( 'Please enter %qty% or more characters', 'enhanced select', 'woocommerce' ),
				'i18n_input_too_long_1'     => cfw_x( 'Please delete 1 character', 'enhanced select', 'woocommerce' ),
				'i18n_input_too_long_n'     => cfw_x( 'Please delete %qty% characters', 'enhanced select', 'woocommerce' ),
				'i18n_selection_too_long_1' => cfw_x( 'You can only select 1 item', 'enhanced select', 'woocommerce' ),
				'i18n_selection_too_long_n' => cfw_x( 'You can only select %qty% items', 'enhanced select', 'woocommerce' ),
				'i18n_load_more'            => cfw_x( 'Loading more results&hellip;', 'enhanced select', 'woocommerce' ),
				'i18n_searching'            => cfw_x( 'Searching&hellip;', 'enhanced select', 'woocommerce' ),
			)
		);

		wp_localize_script(
			'cfw_front_js', 'wc_address_i18n_params', array(
				'locale'             => json_encode( WC()->countries->get_country_locale() ),
				'locale_fields'      => json_encode( WC()->countries->get_country_locale_field_selectors() ),
				'add2_text'          => __( 'Apt, suite, etc. (optional)', 'checkout-wc' ),
				'i18n_required_text' => cfw_esc_attr__( 'required', 'woocommerce' ),
			)
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

		if ( $this->is_enabled() ) {
			// Load Compatibility Class
			$this->compatibility();

			// Load Assets
			$this->loader->add_action( 'wp_enqueue_scripts', array( $this, 'set_assets' ) );

			$this->loader->add_action( 'init', array( $this, 'init_hooks' ) );
		}

		// Add the actions and filters to the system. They were added to the class, this registers them in WordPress.
		$this->loader->run();
	}

	/**
	 * Check if theme should enabled
	 *
	 * @return bool
	 */
	function is_enabled() {
		$result = false;

		if ( ! function_exists( 'WC' ) ) {
			$result = false; // superfluous, but sure
		}

		if ( ( $this->license_is_valid() && $this->settings_manager->get_setting( 'enable' ) == 'yes' ) || current_user_can( 'manage_options' ) ) {
			$result = true;
		}

		return apply_filters( 'cfw_checkout_is_enabled', $result );
	}

	function compatibility() {
		new CompatibilityManager();
	}

	/**
	 * Handles general purpose WordPress actions.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function load_actions() {

		// Add the Language class
		$this->i18n->load_plugin_textdomain( $this->path_manager );

		// Override some WooCommerce Options
		if ( ( $this->license_is_valid() && $this->settings_manager->get_setting( 'enable' ) == 'yes' ) ) {
			// For some reason, using the loader add_filter here doesn't work *shrug*
			add_filter( 'pre_option_woocommerce_registration_generate_password', array( $this, 'override_woocommerce_registration_generate_password' ), 10, 1 );
		}

		// Handle the Activation notices
		$this->loader->add_action(
			'admin_notices', function() {
				$this->get_activation_manager()->activate_admin_notice( $this->get_path_manager() );
			}
		);

		// Setup the Checkout redirect
		$this->loader->add_action(
			'template_redirect', function() {
				if ( $this->is_enabled() ) {
					// Call Redirect
					Redirect::checkout( $this->settings_manager, $this->path_manager, $this->template_manager, $this->version );
				}
			}
		);

		// Admin toolbar
		$this->loader->add_action( 'admin_bar_menu', array( $this, 'add_admin_buttons' ), 100 );
	}

	function init_hooks() {
		// Required to render form fields
		$this->form = new Form();
	}

	/**
	 * Get phone field setting
	 *
	 * @return boolean
	 */
	function is_phone_fields_enabled() {
		return apply_filters( 'cfw_enable_phone_fields', $this->get_settings_manager()->get_setting( 'enable_phone_fields' ) == 'yes' );
	}

	function add_admin_buttons( $admin_bar ) {
		if ( ! function_exists( 'is_checkout' ) || ! is_checkout() ) {
			return;
		}

		// Remove irrelevant buttons
		$admin_bar->remove_node( 'new-content' );
		$admin_bar->remove_node( 'updates' );
		$admin_bar->remove_node( 'edit' );
		$admin_bar->remove_node( 'comments' );

		$admin_bar->add_node(
			array(
				'id'    => 'cfw-settings',
				'title' => '<span class="ab-icon dashicons dashicons-cart"></span>' . __( 'Checkout for WooCommerce', 'checkout-wc' ),
				'href'  => admin_url( 'options-general.php?page=cfw-settings' ),
			)
		);

		$admin_bar->add_node(
			array(
				'id'     => 'cfw-general-settings',
				'title'  => __( 'General', 'checkout-wc' ),
				'href'   => admin_url( 'options-general.php?page=cfw-settings' ),
				'parent' => 'cfw-settings',
			)
		);

		$admin_bar->add_node(
			array(
				'id'     => 'cfw-template-settings',
				'title'  => __( 'Template', 'checkout-wc' ),
				'href'   => admin_url( 'options-general.php?page=cfw-settings&subpage=templates' ),
				'parent' => 'cfw-settings',
			)
		);

		$admin_bar->add_node(
			array(
				'id'     => 'cfw-design-settings',
				'title'  => __( 'Design', 'checkout-wc' ),
				'href'   => admin_url( 'options-general.php?page=cfw-settings&subpage=design' ),
				'parent' => 'cfw-settings',
			)
		);

		$admin_bar->add_node(
			array(
				'id'     => 'cfw-license-settings',
				'title'  => __( 'License', 'checkout-wc' ),
				'href'   => admin_url( 'options-general.php?page=cfw-settings&subpage=license' ),
				'parent' => 'cfw-settings',
			)
		);

		$admin_bar->add_node(
			array(
				'id'     => 'cfw-support-settings',
				'title'  => __( 'Support', 'checkout-wc' ),
				'href'   => admin_url( 'options-general.php?page=cfw-settings&subpage=support' ),
				'parent' => 'cfw-settings',
			)
		);
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

		$errors = $main->get_activation_manager()->activate();

		// Init settings
		$main->get_settings_manager()->add_setting( 'enable', 'no' );
		$main->get_settings_manager()->add_setting( 'enable_phone_fields', 'no' );
		$main->get_settings_manager()->add_setting( 'active_template', 'default' );
		$main->get_settings_manager()->add_setting( 'settings_version', '200' );

		// Set defaults
		$cfw_templates = $main->get_template_manager()->get_templates_information();

		foreach ( $cfw_templates as $template_path => $template_information ) {
			$supports = ! empty( $template_information['stylesheet_info']['Supports'] ) ? array_map( 'trim', explode( ',', $template_information['stylesheet_info']['Supports'] ) ) : array();

			if ( in_array( 'header-background', $supports ) ) {
				if ( $template_path == 'futurist' ) {
					$main->get_settings_manager()->add_setting( 'header_background_color', '#000000', array( $template_path ) );
					$main->get_settings_manager()->add_setting( 'header_text_color', '#ffffff', array( $template_path ) );
				} else {
					$main->get_settings_manager()->add_setting( 'header_background_color', '#ffffff', array( $template_path ) );
				}
			}

			if ( in_array( 'footer-background', $supports ) ) {
				$main->get_settings_manager()->add_setting( 'footer_background_color', '#ffffff', array( $template_path ) );
				$main->get_settings_manager()->add_setting( 'footer_color', '#999999', array( $template_path ) );
			}

			if ( in_array( 'summary-background', $supports ) ) {
				if ( $template_path == 'copify' ) {
					$main->get_settings_manager()->add_setting( 'summary_background_color', '#fafafa', array( $template_path ) );
				} else {
					$main->get_settings_manager()->add_setting( 'summary_background_color', '#ffffff', array( $template_path ) );
				}
			}

			$main->get_settings_manager()->add_setting( 'header_text_color', '#2b2b2b', array( $template_path ) );
			$main->get_settings_manager()->add_setting( 'footer_color', '#999999', array( $template_path ) );
			$main->get_settings_manager()->add_setting( 'link_color', '#e9a81d', array( $template_path ) );
			$main->get_settings_manager()->add_setting( 'button_color', '#e9a81d', array( $template_path ) );
			$main->get_settings_manager()->add_setting( 'button_text_color', '#000000', array( $template_path ) );
			$main->get_settings_manager()->add_setting( 'secondary_button_color', '#999999', array( $template_path ) );
			$main->get_settings_manager()->add_setting( 'secondary_button_text_color', '#ffffff', array( $template_path ) );
		}

		// Updater license status cron
		$main->updater->set_license_check_cron();

		// Set the stat collection cron
		$main->set_stat_collection_cron();

		if ( ! $errors ) {

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

		// Unset the stat collection cron
		$main->unset_stat_collection_cron();
	}

	/**
	 * Stat collection cron
	 */
	public function set_stat_collection_cron() {
		if (! wp_next_scheduled ( 'cfw_weekly_scheduled_events_tracking' )) {
			wp_schedule_event(time(), 'weekly', 'cfw_weekly_scheduled_events_tracking');
		}
	}

	/**
	 * Unset the collection cron
	 */
	public function unset_stat_collection_cron() {
		wp_clear_scheduled_hook('cfw_weekly_scheduled_events_tracking');
	}

	/**
	 * @param string $result
	 *
	 * @return string
	 */
	function override_woocommerce_registration_generate_password( $result ) {
		if ( is_checkout() ) {
			return 'yes';
		}

		return $result;
	}

	/**
	 * @return bool True if license valid, false if it is invalid
	 */
	function license_is_valid() {
		// Get main
		$main = Main::instance();

		$key_status  = $main->updater->get_field_value( 'key_status' );
		$license_key = $main->updater->get_field_value( 'license_key' );

		$valid = true;

		if ( getenv( 'TRAVIS' ) ) {
			return $valid;
		}

		// Validate Key Status
		if ( empty( $license_key ) || ( ( $key_status !== 'valid' || $key_status == 'inactive' || $key_status == 'site_inactive' ) ) ) {
			$valid = false;
		}

		return $valid;
	}

	public static function is_checkout() {
		return apply_filters('cfw_is_checkout', function_exists('is_checkout') && is_checkout() && ! is_order_received_page() && ! is_checkout_pay_page() );
	}
}
