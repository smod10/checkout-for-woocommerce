<?php
namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;

class Redirect {
	/**
     * @param SettingsManager $settings_manager
	 * @param PathManager $path_manager
	 * @param TemplateManager $template_manager
	 * @param $version
	 */
	public static function checkout($settings_manager, $path_manager, $template_manager, $version) {
		if ( $settings_manager->get_setting('enable') == 'yes' && function_exists('is_checkout') && is_checkout() ) {
			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('cfw_template_global_params', array());

			// Show non-cart errors
			// wc_print_notices();

			// Check cart contents for errors
			do_action( 'woocommerce_check_cart_items' );

			// Calc totals
			WC()->cart->calculate_totals();

			// Template conveniences items
			$global_template_parameters["woo"]          = \WooCommerce::instance();         // WooCommerce Instance
			$global_template_parameters["checkout"]     = WC()->checkout();                 // Checkout Object
			$global_template_parameters["cart"]         = WC()->cart;                       // Cart Object
			$global_template_parameters["customer"]     = WC()->customer;                   // Customer Object

			// Output the contents of the <head></head> section
			self::head($path_manager, $version, ['cfw']);

			// Output the contents of the <body></body> section
			self::body($path_manager, $template_manager, $global_template_parameters);

			// Output a closing </body> and closing </html> tag
			self::footer($path_manager);

			// Exit out before WordPress can do anything else
			exit;
		}
	}

	/**
	 * @param $env_extension
     * @param PathManager $path_manager
	 */
	public static function init_block($env_extension, $path_manager) {
		_wp_render_title_tag();
		wp_enqueue_scripts();
		self::remove_scripts();
		print_head_scripts();
		wp_print_styles(array('cfw_front_css', 'admin-bar'));
		?>
        <script>
	        window.$ = jQuery;
        </script>
        <script src="/wp-content/plugins/checkout-woocommerce/assets/global/bower/requirejs/require.js"></script>
		<script>
            window.requiredFiles = [
	            'Main',
	            'Elements/TabContainer',
	            'Elements/TabContainerBreadcrumb',
	            'Elements/TabContainerSection',
	            'Elements/Cart'
            ];
            window.siteBase = "<?php echo $path_manager->get_url_base(); ?>";

            var breadCrumbElId = '#<?php echo apply_filters('cfw_template_breadcrumb_id', 'cfw-breadcrumb'); ?>';
            var customerInfoElId = '#<?php echo apply_filters('cfw_template_customer_info_el', 'cfw-customer-info'); ?>';
            var shippingMethodElId = '#<?php echo apply_filters('cfw_template_shipping_method_el', 'cfw-shipping-method'); ?>';
            var paymentMethodElId = '#<?php echo apply_filters('cfw_template_payment_method_el', 'cfw-payment-method'); ?>';
            var tabContainerElId = '#<?php echo apply_filters('cfw_template_tab_container_el', 'cfw-tab-container'); ?>';
            var cartContainerId = '#<?php echo apply_filters('cfw_template_cart_el', "cfw-totals-list"); ?>';
            var cartSubtotalId = '#<?php echo apply_filters('cfw_template_cart_subtotal_el', 'cfw-cart-subtotal'); ?>';
            var cartShippingId = '#<?php echo apply_filters('cfw_template_cart_shipping_el', 'cfw-cart-shipping-total'); ?>';
            var cartTaxesId = '#<?php echo apply_filters('cfw_template_cart_taxes_el', 'cfw-cart-taxes'); ?>';
            var cartTotalId = '#<?php echo apply_filters('cfw_template_cart_total_el','cfw-cart-total'); ?>';

            window.cfwElements = {
	            breadCrumbElId: breadCrumbElId,
	            customerInfoElId: customerInfoElId,
	            shippingMethodElId: shippingMethodElId,
	            paymentMethodElId: paymentMethodElId,
	            tabContainerElId: tabContainerElId,
	            cartContainerId: cartContainerId,
	            cartSubtotalId: cartSubtotalId,
	            cartShippingId: cartShippingId,
	            cartTaxesId: cartTaxesId,
	            cartTotalId: cartTotalId
            };

            window.ajaxInfo = {
	            admin_url: new URL('<?php echo admin_url('admin-ajax.php'); ?>'),
	            nonce: '<?php echo wp_create_nonce("some-seed-word"); ?>'
            };

            requirejs.config({
	            baseUrl : window.siteBase + 'assets/front/js/',
	            bundles: {
		            'checkout-woocommerce-front': window.requiredFiles
	            }
            });

            function init() {
	            require(requiredFiles,
		            function(Main, TabContainer, TabContainerBreadcrumb, TabContainerSection, Cart){

			            // Require wraps objects for some reason in bundles
			            Main = Main.Main;
			            TabContainer = TabContainer.TabContainer;
			            TabContainerBreadcrumb = TabContainerBreadcrumb.TabContainerBreadcrumb;
			            TabContainerSection = TabContainerSection.TabContainerSection;
			            Cart = Cart.Cart;

			            var breadCrumbEl = $(cfwElements.breadCrumbElId);
			            var customerInfoEl = $(cfwElements.customerInfoElId);
			            var shippingMethodEl = $(cfwElements.shippingMethodElId);
			            var paymentMethodEl = $(cfwElements.paymentMethodElId);
			            var tabContainerEl = $(cfwElements.tabContainerElId);
			            var cartContainer = $(cfwElements.cartContainerId);
			            var cartSubtotal = $(cfwElements.cartSubtotalId);
			            var cartShipping = $(cfwElements.cartShippingId);
			            var cartTaxes = $(cfwElements.cartTaxesId);
			            var cartTotal = $(cfwElements.cartTotalId);

			            var tabContainerBreadcrumb = new TabContainerBreadcrumb(breadCrumbEl);
			            var tabContainerSections = [
				            new TabContainerSection(customerInfoEl, "customer_info"),
				            new TabContainerSection(shippingMethodEl, "shipping_method"),
				            new TabContainerSection(paymentMethodEl, "payment_method")
			            ];
			            var tabContainer = new TabContainer(tabContainerEl, tabContainerBreadcrumb, tabContainerSections);

			            var cart = new Cart(cartContainer, cartSubtotal, cartShipping, cartTaxes, cartTotal);

			            var main = new Main( tabContainer, ajaxInfo, cart );
			            main.setup();
		            });
            }
		</script>
		<?php
	}

	/**
     * @param PathManager $path_manager
	 * @param string $version
	 * @param array $classes
	 */
	public static function head($path_manager, $version, $classes) {

		?>
		<!DOCTYPE html>
		<head>
		<?php

		WC()->payment_gateways->get_available_payment_gateways();

		self::init_block((!CO_DEV_MODE) ? ".min" : "", $path_manager);

		?>
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,400i,500,500i,700,900" rel="stylesheet">
		</head>
		<body class="<?php echo implode(" ", $classes); ?>" onload="init()">
		<?php
	}

	public static function remove_scripts() {
		global $wp_scripts;
		$ignore = array(
            'jquery',
            'admin-bar',
            'cfw_front_js_hash_change',
            'cfw_front_js_easy_tabs',
            'cfw_front_js_garlic',
            'cfw_front_js_array_find_poly',
            'stripe',
            'woocommerce_stripe'
        );

		foreach($wp_scripts->queue as $handle) {
		    if(!in_array($handle, $ignore)) {
			    wp_dequeue_script( $handle );
			    wp_deregister_script( $handle );
		    }
        }
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
     * @param PathManager $path_manager
	 * @since 0.1.0
	 */
	public static function footer($path_manager) {
		$bower = "{$path_manager->get_assets_path()}/global/bower";
		$js = "{$path_manager->get_assets_path()}/global/js";
	    ?>

<!--        <script src="/wp-content/plugins/checkout-woocommerce/assets/global/bower/jquery/dist/jquery.js"></script>-->
        <?php

		print_footer_scripts();
		?>
		</body>
		</html>
		<?php
	}
}