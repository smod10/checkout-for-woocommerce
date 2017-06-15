<?php
namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Core\Form;
use Objectiv\Plugins\Checkout\Managers\AssetsManager;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;

class Redirect {
	/**
	 * @param PathManager $path_manager
	 * @param TemplateManager $template_manager
	 * @param AssetsManager $assets_manager
	 * @param $version
	 */
	public static function checkout($path_manager, $template_manager, $assets_manager, $version) {
		if( function_exists('is_checkout') && is_checkout() ) {
			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('cfw_template_global_params', array());

			// Template conveniences items
			$global_template_parameters["woo"]          = \WooCommerce::instance();         // WooCommerce Instance
			$global_template_parameters["checkout"]     = WC()->checkout();                 // Checkout Object
			$global_template_parameters["cart"]         = WC()->cart;                       // Cart Object
			$global_template_parameters["customer"]     = WC()->customer;                   // Customer Object

			// Output the contents of the <head></head> section
			self::head($path_manager, $assets_manager, $version, ['cfw']);

			// Output the contents of the <body></body> section
			self::body($path_manager, $template_manager, $global_template_parameters);

			// Output a closing </body> and closing </html> tag
			self::footer();

			// Exit out before WordPress can do anything else
			exit;
		}
	}

	/**
	 * @param $env_extension
     * @param PathManager $path_manager
	 */
	public static function init_block($env_extension, $path_manager) {
		?>
		<script>
			requirejs.config({
				baseUrl : '<?php echo $path_manager->get_url_base(); ?>' + 'assets/front/js/',
				bundles: {
					'checkout-woocommerce-front<?php echo $env_extension; ?>': ['Main', 'Elements/TabContainer', 'Elements/TabContainerBreadcrumb', 'Elements/TabContainerSection']
				}
			});

			function init() {
				require(['Main', 'Elements/TabContainer', 'Elements/TabContainerBreadcrumb', 'Elements/TabContainerSection'],
					function(Main, TabContainer, TabContainerBreadcrumb, TabContainerSection){

						// Require wraps objects for some reason in bundles
						Main = Main.Main;
						TabContainer = TabContainer.TabContainer;
						TabContainerBreadcrumb = TabContainerBreadcrumb.TabContainerBreadcrumb;
						TabContainerSection = TabContainerSection.TabContainerSection;

						var breadCrumbEl = $('<?php echo apply_filters('cfw_template_breadcrumb_el', '#cfw-breadcrumb'); ?>');
						var customerInfoEl = $('<?php echo apply_filters('cfw_template_customer_info_el', '#cfw-customer-info'); ?>');
						var shippingMethodEl = $('<?php echo apply_filters('cfw_template_shipping_method_el', '#cfw-shipping-method'); ?>');
						var paymentMethodEl = $('<?php echo apply_filters('cfw_template_payment_method_el', '#cfw-payment-method'); ?>');
						var tabContainerEl = $('<?php echo apply_filters('cfw_template_tab_container_el', '#cfw-tab-container'); ?>');

						var tabContainerBreadcrumb = new TabContainerBreadcrumb(breadCrumbEl);
						var tabContainerSections = [
							new TabContainerSection(customerInfoEl, "customer_info"),
							new TabContainerSection(shippingMethodEl, "shipping_method"),
							new TabContainerSection(paymentMethodEl, "payment_method")
						];
						var tabContainer = new TabContainer(tabContainerEl, tabContainerBreadcrumb, tabContainerSections);
						var ajaxInfo = {
							admin_url: new URL('<?php echo admin_url('admin-ajax.php'); ?>'),
							nonce: '<?php echo wp_create_nonce("some-seed-word"); ?>'
						};

						var main = new Main( tabContainer, ajaxInfo );
						main.setup();
					});
			}
		</script>
		<?php
	}

	/**
     * @param PathManager $path_manager
	 * @param AssetsManager $assets_manager
	 * @param string $version
	 * @param array $classes
	 */
	public static function head($path_manager, $assets_manager, $version, $classes) {

		?>
		<!DOCTYPE html>
		<head>
		<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,400i,500,500i,700,900" rel="stylesheet">
		<?php

		// Fire off an action before the default loading of styles and scripts
		do_action('cfw_assets_before_assets');

		// Load the front end assets
		$assets_manager->load_assets($version, "front_assets", apply_filters('cfw_front_assets_additional', array()), apply_filters('cfw_front_assets_replace', false));

		// Fire off an action after the default loading of styles and scripts
		do_action('cfw_assets_after_assets');

		self::init_block((!CO_DEV_MODE) ? ".min" : "", $path_manager);
		?>
		</head>
		<body class="<?php echo implode(" ", $classes); ?>" onload="init()">
		<?php
	}

	/**
	 * @param PathManager $path_manager
	 * @param TemplateManager $template_manager
	 * @param array $global_template_parameters
	 */
	public static function body($path_manager, $template_manager, $global_template_parameters) {
		// Fire off an action before we load the template pieces
		do_action('cfw_template_before_load');

		// Required to render form fields
		$form = new Form();

		// Load the template pieces
		$template_manager->load_templates( $path_manager->get_template_information( $template_manager->get_template_sub_folders() ), $global_template_parameters );

		// Fire off an action after we load the template pieces
		do_action('cfw_template_after_load', array(Template::get_i()) );
	}

	/**
	 * @since 0.1.0
	 */
	public static function footer() {
		?>
		</body>
		</html>
		<?php
	}
}