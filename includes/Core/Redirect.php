<?php
namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Managers\AssetsManager;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Main;

class Redirect {
	/**
	 * @param PathManager $pm
	 * @param TemplateManager $tm
	 * @param AssetsManager $am
	 * @param $version
	 */
	public static function checkout($pm, $tm, $am, $version) {
		if( function_exists('is_checkout') && is_checkout() ) {
			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('cfw_template_global_params', array());

			// Template conveniences items
			$global_template_parameters["woo"]          = \WooCommerce::instance();         // WooCommerce Instance
			$global_template_parameters["checkout"]     = WC()->checkout();                 // Checkout Object
            $global_template_parameters["cart"]         = WC()->cart;          // Cart Object

			// Output the contents of the <head></head> section
			self::head($pm, $am, $version, ['cfw']);

			// Output the contents of the <body></body> section
			self::body($pm, $tm, $global_template_parameters);

			// Output a closing </body> and closing </html> tag
			self::footer();

			// Exit out before WordPress can do anything else
			exit;
		}
	}

	/**
	 * @param PathManager $pm
	 * @param AssetsManager $am
	 * @param string $version
     * @param array $classes
	 */
	public static function head($pm, $am, $version, $classes) {

	    ?>
        <!DOCTYPE html>
        <head>
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,400i,500,500i,700,900" rel="stylesheet">
		<?php

		// Fire off an action before the default loading of styles and scripts
		do_action('cfw_assets_before_assets');

		// Load the front end assets
		$am->load_assets($version, "front");

		// Fire off an action after the default loading of styles and scripts
		do_action('cfw_assets_after_assets');

		self::init_block((!CO_DEV_MODE) ? ".min" : "");
		?>
        </head>
        <body class="<?php echo implode(" ", $classes); ?>" onload="init()">
		<?php
	}

	public static function init_block($env_extension) {
        ?>
        <script>
			requirejs.config({
				baseUrl : '<?php echo get_site_url(); ?>' + '/wp-content/plugins/checkout-woocommerce/assets/front/js/',
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
	 * @param PathManager $pm
	 * @param TemplateManager $tm
	 * @param array $gtp
	 */
	public static function body($pm, $tm, $gtp) {
		// Fire off an action before we load the template pieces
		do_action('cfw_template_before_load');

		// Load the template pieces
		$tm->load_templates($pm->get_template_information($tm->get_template_sub_folders()), $gtp);

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