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
		if ( function_exists('is_checkout') && is_checkout() && ! is_order_received_page() ) {
			// When on the checkout with an empty cart, redirect to cart page
			if ( WC()->cart->is_empty() ) {
				wc_add_notice( __( 'Checkout is not available whilst your cart is empty.', 'woocommerce' ), 'notice' );
				wp_redirect( wc_get_page_permalink( 'cart' ) );
				exit;
			}

			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('cfw_template_global_params', array());

			// Show non-cart errors
			// wc_print_notices();

			// Check cart contents for errors
			do_action( 'woocommerce_check_cart_items' );

			// Calc totals
			WC()->cart->calculate_totals();

			wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

			// Template conveniences items
			$global_template_parameters["woo"]          = \WooCommerce::instance();         // WooCommerce Instance
			$global_template_parameters["checkout"]     = WC()->checkout();                 // Checkout Object
			$global_template_parameters["cart"]         = WC()->cart;                       // Cart Object
			$global_template_parameters["customer"]     = WC()->customer;                   // Customer Object

			// Output the contents of the <head></head> section
			self::head($path_manager, $version, ['checkout-wc'], $settings_manager);

			// Output the contents of the <body></body> section
			self::body($path_manager, $template_manager, $global_template_parameters, $settings_manager);

			// Output a closing </body> and closing </html> tag
			self::footer($path_manager, $settings_manager);

			// Exit out before WordPress can do anything else
			exit;
		}
	}

	/**
	 * @param $env_extension
     * @param PathManager $path_manager
	 */
	public static function init_block($env_extension, $path_manager) {
		// We use this instead of _wp_render_title_tag because it requires the theme support title-tag capability.
		echo '<title>' . wp_get_document_title() . '</title>' . "\n";

		wp_enqueue_scripts();
		self::remove_scripts();
		print_head_scripts();

		$bower = "{$path_manager->get_assets_path()}/global/bower";
		$js = "{$path_manager->get_assets_path()}/global/js";
		?>
        <script src="<?php echo $bower; ?>/requirejs/require.js"></script>
		<script>
			window.$ = jQuery;
			$.fn.block = function(item) {};
			$.fn.unblock = function(item) {};

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
            var cartCoupons = '#<?php echo apply_filters('cfw_template_cart_coupons_el', 'cfw-cart-coupons'); ?>';

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
	            cartTotalId: cartTotalId,
                cartCouponsId: cartCoupons
            };

            window.ajaxInfo = {
	            admin_url: new URL('<?php echo admin_url('admin-ajax.php'); ?>'),
	            nonce: '<?php echo wp_create_nonce("some-seed-word"); ?>'
            };

            requirejs.config({
	            baseUrl : window.siteBase + 'assets/front/js/',
	            bundles: {
		            'checkout-woocommerce-front<?php echo $env_extension; ?>': window.requiredFiles
	            }
            });

            Parsley.addValidator('stateAndZip', {
                validateString: function(_ignoreValue, country, instance) {
                    var elementType = instance.$element[0].getAttribute("id").split("_")[0];
                    var stateElement = $("#" + elementType + "_state");
                    var zipElement = $("#" + elementType + "_postcode");
                    var cityElement = $("#" + elementType + "_city");
                    var failLocation = (elementType === "shipping") ? "#cfw-customer-info" : "#cfw-payment-method";
                    var xhr = $.ajax('//www.zippopotam.us/' + country + '/' + zipElement.val());

                    return xhr.then(function(json) {
                        var ret = null;
                        var stateResponseValue = "";
                        var eventName = "";
                        var cityResponseValue = "";

                        // Set the state response value
                        stateResponseValue = json.places[0]["state abbreviation"];

                        // Set the city response value and set the corresponding city field
                        cityResponseValue = json.places[0]["place name"];
                        cityElement.val(cityResponseValue);

                        var fieldType = $(instance.element).attr("id").split("_")[1];

                        if(fieldType === "postcode") {
                            stateElement.val(stateResponseValue);
                        }

                        if (stateResponseValue !== stateElement.val()) {
                            eventName = "cfw:state-zip-failure";

                            $("#cfw-tab-container").easytabs("select", failLocation);

                            ret = $.Deferred().reject("The zip code " + zipElement.val() + " is in " + stateResponseValue + ", not in " + stateElement.val());
                        } else {
                            eventName = "cfw:state-zip-success";

                            $("#" + elementType + "_state").parsley().reset();
                            $("#" + elementType + "_postcode").parsley().reset();

                            ret = true;
                        }

                        if(window.CREATE_ORDER) {
                            var event = new Event(eventName);
                            window.dispatchEvent(event);
                        }

                        return ret;
                    }).fail(function(){
                        $("#cfw-tab-container").easytabs("select", failLocation);

                        if(window.CREATE_ORDER) {
                            var event = new Event("cfw:state-zip-failure");
                            window.dispatchEvent(event);
                        }
                    })
                },
                messages: {en: 'Zip is not valid for country "%s"'}
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
			            var cartCoupons = $(cfwElements.cartCouponsId);

			            var tabContainerBreadcrumb = new TabContainerBreadcrumb(breadCrumbEl);
			            var tabContainerSections = [
				            new TabContainerSection(customerInfoEl, "customer_info"),
				            new TabContainerSection(shippingMethodEl, "shipping_method"),
				            new TabContainerSection(paymentMethodEl, "payment_method")
			            ];
			            var tabContainer = new TabContainer(tabContainerEl, tabContainerBreadcrumb, tabContainerSections);

			            var cart = new Cart(cartContainer, cartSubtotal, cartShipping, cartTaxes, cartTotal, cartCoupons);
			            var settings = {
                            isRegistrationRequired: <?php echo WC()->checkout->is_registration_required() ? "true" : "false"; ?>
                        };

			            var main = new Main( tabContainer, ajaxInfo, cart, settings );
			            main.setup();
		            });
            }
		</script>
		<?php

		wp_print_styles(array('cfw_front_css', 'admin-bar'));
	}

	/**
     * @param PathManager $path_manager
	 * @param string $version
	 * @param array $classes
	 */
	public static function head($path_manager, $version, $classes, $settings_manager) {
		?>
		<!DOCTYPE html>
		<head>
            <?php

            WC()->payment_gateways->get_available_payment_gateways();

            self::init_block((!CO_DEV_MODE) ? ".min" : "", $path_manager);

            // Get logo attachment ID if available
            $logo_attachment_id = $settings_manager->get_setting('logo_attachment_id');
            ?>
            <style>
                #cfw-header {
                    background: <?php echo $settings_manager->get_setting('header_background_color'); ?>;

                    <?php if ( strtolower( $settings_manager->get_setting('header_background_color') ) !== "#ffffff" ): ?>
                        margin-bottom: 2em;
                    <?php endif; ?>
                }
                #cfw-footer {
                    color: <?php echo $settings_manager->get_setting('footer_color'); ?>;
                    background: <?php echo $settings_manager->get_setting('footer_background_color'); ?>;

                    <?php if ( strtolower( $settings_manager->get_setting('footer_background_color') ) !== "#ffffff" ): ?>
                        margin-top: 2em;
                    <?php endif; ?>
                }
                #cfw-cart-details-arrow {
                    color: <?php echo $settings_manager->get_setting('link_color'); ?> !important;
                    fill: <?php echo $settings_manager->get_setting('link_color'); ?> !important;
                }
                .cfw-link {
                    color: <?php echo $settings_manager->get_setting('link_color'); ?> !important;
                }
                .cfw-bottom-controls .cfw-primary-btn {
                    background-color: <?php echo $settings_manager->get_setting('button_color'); ?>;
                    color: <?php echo $settings_manager->get_setting('button_text_color'); ?>;
                }

                .cfw-def-action-btn {
                    background-color: <?php echo $settings_manager->get_setting('secondary_button_color'); ?>;
                    color: <?php echo $settings_manager->get_setting('secondary_button_text_color'); ?>;
                }

                <?php if ( ! empty($logo_attachment_id) ): ?>
                .cfw-logo .logo {
                    background: transparent url( <?php echo wp_get_attachment_url($logo_attachment_id); ?> ) no-repeat;
                    background-size: contain;
                }
                <?php else: ?>
                .cfw-logo .logo {
                    background: <?php echo $settings_manager->get_setting('header_background_color'); ?>;
                    height: auto;
                    width: auto;
                    margin: 20px auto;
                    color: <?php echo $settings_manager->get_setting('header_text_color'); ?>;
                }
                .cfw-logo .logo:after {
                    padding-top: 40px;
                    content: "<?php echo get_bloginfo( 'name' ); ?>";
                    font-size: 30px;
                }
                <?php endif; ?>
                <?php echo $settings_manager->get_setting('custom_css'); ?>;
            </style>
            <meta name="viewport" content="width=device-width">

            <?php echo $settings_manager->get_setting('header_scripts'); ?>
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
			'cfw_front_js_parsley',
            'cfw_front_js_array_find_poly',
            'stripe',
            'woocommerce_stripe',
            'stripe_apple_pay',
            'woocommerce_stripe_apple_pay',
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
	public static function body($path_manager, $template_manager, $global_template_parameters, $settings_manager) {
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
	 * @since 1.0.0
	 */
	public static function footer($path_manager, $settings_manager) {
		print_footer_scripts();
		echo $settings_manager->get_setting('footer_scripts');
		?>
		</body>
		</html>
		<?php
	}
}