<?php
namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\Managers\ExtendedPathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;

/**
 * Class Redirect
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Brandon Tassone <brandontassone@gmail.com>
 */
class Redirect {

	/**
     * @since 1.0.0
     * @access public
     *
     * @param SettingsManager $settings_manager
	 * @param ExtendedPathManager $path_manager
	 * @param TemplateManager $template_manager
	 * @param $version
	 */
	public static function checkout($settings_manager, $path_manager, $template_manager, $version) {
		if ( function_exists('is_checkout') && is_checkout() && ! is_order_received_page() && ! is_checkout_pay_page() ) {
			// When on the checkout with an empty cart, redirect to cart page
			if ( WC()->cart->is_empty() ) {
				wc_add_notice( __( 'Checkout is not available whilst your cart is empty.', 'woocommerce' ), 'notice' );
				wp_redirect( wc_get_page_permalink( 'cart' ) );
				exit;
			}

			wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('cfw_template_global_params', array());

			// Show non-cart errors
			wc_print_notices();

			// Check cart contents for errors
			do_action( 'woocommerce_check_cart_items' );

			// Calc totals
			WC()->cart->calculate_totals();

			// Template conveniences items
			$global_template_parameters["woo"]          = \WooCommerce::instance();         // WooCommerce Instance
			$global_template_parameters["checkout"]     = WC()->checkout();                 // Checkout Object
			$global_template_parameters["cart"]         = WC()->cart;                       // Cart Object
			$global_template_parameters["customer"]     = WC()->customer;                   // Customer Object
            $global_template_parameters["css_classes"]  = self::get_css_classes();

            // Setup default cfw_wp_head actions
            add_action('cfw_wp_head', 'wp_enqueue_scripts', 0, 0);
            add_action('cfw_wp_head', array('Objectiv\Plugins\Checkout\Core\Redirect', 'output_meta_tags'), 10, 4);
            add_action('cfw_wp_head', array('Objectiv\Plugins\Checkout\Core\Redirect', 'output_custom_scripts'), 20, 4);
            add_action('cfw_wp_head', array('Objectiv\Plugins\Checkout\Core\Redirect', 'output_init_block'), 30, 4);
			add_action('cfw_wp_head', array('Objectiv\Plugins\Checkout\Core\Redirect', 'output_custom_styles'), 40, 5);

			// Output the contents of the <head></head> section
			self::head($path_manager, $version, apply_filters('cfw_body_classes', array('checkout-wc')), $settings_manager, $template_manager);

			// Output the contents of the <body></body> section
			self::body($template_manager, $global_template_parameters);

			// Output a closing </body> and closing </html> tag
			self::footer($path_manager, $settings_manager);

			// Exit out before WordPress can do anything else
			exit;
		}
	}

	/**
     * Initial classes for visibility states
     *
	 * @return string
	 */
	public static function get_css_classes() {
	    $css_classes = [];

		if(!WC()->cart->needs_payment()) {
			$css_classes[] = "cfw-payment-false";
		}

		if(!WC()->cart->needs_shipping_address()) {
		    $css_classes[] = "cfw-shipping-address-false";
        }

		return implode(" ", $css_classes);
    }

	/**
     * @since 1.0.0
     * @access public
	 *
	 * @param $env_extension
	 * @param ExtendedPathManager $path_manager
	 */
	public static function init_block($env_extension, $path_manager) {
	    $default_fields = json_encode(array_keys(WC()->countries->get_default_address_fields()));

		// We use this instead of _wp_render_title_tag because it requires the theme support title-tag capability.
		echo '<title>' . wp_get_document_title() . '</title>' . "\n";

		self::remove_scripts();
		self::remove_styles();

		print_head_scripts();
		?>
        <script>
            window.$ = jQuery;

            var checkoutFormSelector = '<?php echo apply_filters('cfw_checkout_form_selector', '.woocommerce-checkout'); ?>';
            var breadCrumbElId = '#<?php echo apply_filters('cfw_template_breadcrumb_id', 'cfw-breadcrumb'); ?>';
            var customerInfoElId = '#<?php echo apply_filters('cfw_template_customer_info_el', 'cfw-customer-info'); ?>';
            var shippingMethodElId = '#<?php echo apply_filters('cfw_template_shipping_method_el', 'cfw-shipping-method'); ?>';
            var paymentMethodElId = '#<?php echo apply_filters('cfw_template_payment_method_el', 'cfw-payment-method'); ?>';
            var tabContainerElId = '#<?php echo apply_filters('cfw_template_tab_container_el', 'cfw-tab-container'); ?>';
            var cartContainerId = '#<?php echo apply_filters('cfw_template_cart_el', "cfw-totals-list"); ?>';
            var cartSubtotalId = '#<?php echo apply_filters('cfw_template_cart_subtotal_el', 'cfw-cart-subtotal'); ?>';
            var cartShippingId = '#<?php echo apply_filters('cfw_template_cart_shipping_el', 'cfw-cart-shipping-total'); ?>';
            var cartTaxesId = '#<?php echo apply_filters('cfw_template_cart_taxes_el', 'cfw-cart-taxes'); ?>';
            var cartFeesId = '#<?php echo apply_filters('cfw_template_cart_fees_el', 'cfw-cart-fees'); ?>';
            var cartTotalId = '#<?php echo apply_filters('cfw_template_cart_total_el','cfw-cart-total'); ?>';
            var cartCoupons = '#<?php echo apply_filters('cfw_template_cart_coupons_el', 'cfw-cart-coupons'); ?>';
            var cartReviewBarId = '#<?php echo apply_filters('cfw_template_cart_review_bar_id', 'cfw-cart-details-review-bar'); ?>';

            var cfwEventData = {
                elements: {
                    breadCrumbElId: breadCrumbElId,
                    customerInfoElId: customerInfoElId,
                    shippingMethodElId: shippingMethodElId,
                    paymentMethodElId: paymentMethodElId,
                    tabContainerElId: tabContainerElId,
                    cartContainerId: cartContainerId,
                    cartSubtotalId: cartSubtotalId,
                    cartShippingId: cartShippingId,
                    cartTaxesId: cartTaxesId,
                    cartFeesId: cartFeesId,
                    cartTotalId: cartTotalId,
                    cartCouponsId: cartCoupons,
                    cartReviewBarId: cartReviewBarId,
                    checkoutFormSelector: checkoutFormSelector
                },
                ajaxInfo: {
                    url: '<?php echo get_home_url(); ?>',
                    nonce: '<?php echo wp_create_nonce("some-seed-word"); ?>'
                },
                settings: {
                    isRegistrationRequired: <?php echo WC()->checkout->is_registration_required() ? "true" : "false"; ?>,
                    user_logged_in: '<?php echo (is_user_logged_in()) ? "true" : "false"; ?>',
                    is_stripe_three: <?php echo ( defined('WC_STRIPE_VERSION') && ( version_compare(WC_STRIPE_VERSION, '4.0.0') >= 0 || version_compare(WC_STRIPE_VERSION, '3.0.0', '<') ) ) ? 'false' : 'true'; ?>,
                    default_address_fields: <?php echo $default_fields; ?>
                }
            };

            $(document).ready(function() {
                var cfwInitEvent = new CustomEvent("cfw-initialize", { detail: cfwEventData });
                window.dispatchEvent(cfwInitEvent);
            });
        </script>
		<?php

		wp_print_styles();
	}

	/**
     * @since 1.0.0
     * @access public
	 *
	 * @param ExtendedPathManager $path_manager
	 * @param string $version
	 * @param array $classes
     * @param SettingsManager $settings_manager
     * @param TemplateManager $template_manager
	 */
	public static function head($path_manager, $version, $classes, $settings_manager, $template_manager) {
	    $classes[] = (wp_is_mobile()) ? "wp-is-mobile" : "";
		?>
		<!DOCTYPE html>
        <html <?php language_attributes(); ?>>
		<head>
            <?php self::cfw_wp_head($path_manager, $version, $classes, $settings_manager, $template_manager); ?>
		</head>
		<body class="<?php echo implode(" ", $classes); ?>">
		<?php
	}

    /**
     *
     */
	public static function output_meta_tags() {
	    ?>
        <meta charset="<?php bloginfo( 'charset' ); ?>">
        <meta name="viewport" content="width=device-width">
        <?php
    }

    /**
     * @param ExtendedPathManager $path_manager
     * @param string $version
     * @param array $classes
     * @param SettingsManager $settings_manager
     */
    public static function output_custom_scripts($path_manager, $version, $classes, $settings_manager) {
	    echo $settings_manager->get_setting('header_scripts');
    }

    /**
     * @param ExtendedPathManager $path_manager
     * @param string $version
     * @param array $classes
     * @param SettingsManager $settings_manager
     */
	public static function output_init_block($path_manager, $version, $classes, $settings_manager) {
		WC()->payment_gateways->get_available_payment_gateways();

		self::init_block(( ! CFW_DEV_MODE ) ? ".min" : "", $path_manager);
    }

    /**
     * @param ExtendedPathManager $path_manager
     * @param string $version
     * @param array $classes
     * @param SettingsManager $settings_manager
     * @param TemplateManager $template_manager
     */
	public static function output_custom_styles($path_manager, $version, $classes, $settings_manager, $template_manager) {
        // Get logo attachment ID if available
        $logo_attachment_id = $settings_manager->get_setting('logo_attachment_id');
        $selected_theme = $template_manager->get_selected_template();
        ?>
        <style>
            <?php if($selected_theme == $template_manager->get_theme_template_names()[1]): ?>
                /**
                    Gotham Styles
                 */
                #cfw-breadcrumb:after {
                    background: <?php echo $settings_manager->get_setting('header_background_color'); ?>;
                }

                #cfw-breadcrumb li > a {
                    color: <?php echo $settings_manager->get_setting('header_background_color'); ?>;
                }

                #cfw-breadcrumb li:first-child:before {
                    background: <?php echo $settings_manager->get_setting('header_background_color'); ?>;
                }

                #cfw-breadcrumb li:before {
                    border: 2px solid <?php echo $settings_manager->get_setting('header_background_color'); ?>;
                }
            <?php endif; ?>

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

            .woocommerce-info {
                padding: 1em 1.618em;
                margin-bottom: 1.3em;
                background-color: <?php echo $settings_manager->get_setting('secondary_button_color'); ?>;
                margin-left: 0;
                border-radius: 2px;
                color: #fff;
                clear: both;
                border-left: .6180469716em solid rgba(0, 0, 0, 0.15);
            }
            .woocommerce-info a {
                color: #fff;
            }

            .woocommerce-info:hover {
                color: #fff;
                opacity: 0.7;
            }

            .woocommerce-info .button:hover {
                opacity: 1;
            }

            .woocommerce-info .button {
                float: right;
                padding: 0;
                background: none;
                color: #fff;
                box-shadow: none;
                line-height: 1.3em;
                padding-left: 1em;
                border-width: 0;
                border-left-width: 1px;
                border-left-style: solid;
                border-left-color: rgba(255, 255, 255, 0.25) !important;
                border-radius: 0;
            }

            .woocommerce-info .button:hover {
                background: none;
                color: #fff;
                opacity: 0.7;
                cursor: pointer;
            }

            .woocommerce-info pre {
                background-color: rgba(0,0,0,.1);
            }
            <?php echo $settings_manager->get_setting('custom_css'); ?>;
        </style>
        <?php
    }

    /**
     * @param ExtendedPathManager $path_manager
     * @param string $version
     * @param array $classes
     * @param SettingsManager $settings_manager
     * @param TemplateManager $template_manager
     */
	public static function cfw_wp_head($path_manager, $version, $classes, $settings_manager, $template_manager) {
		do_action_ref_array('cfw_wp_head', array($path_manager, $version, $classes, $settings_manager, $template_manager) );
    }

    /**
     * Removes all scripts besides the listed ignored scripts from being loaded onto the page.
     *
     * @since 1.0.0
     * @access public
     */
	public static function remove_scripts() {
		global $wp_scripts;
        $ignore = array(
            'jquery',
            'admin-bar',
            'cfw_front_js',
            'cfw_front_template_js',
            'cfw_front_js_vendor',
            'cfw_front_js_hash_change',
            'cfw_front_js_easy_tabs',
            'cfw_front_js_garlic',
            'cfw_front_js_parsley',
            'cfw_front_js_array_find_poly',
            'woocommerce-tokenization-form',
            'wc-credit-card-form',
            'jquery-payment',
        );

		$ignore = apply_filters('cfw_allowed_script_handles', $ignore);

		foreach ( $wp_scripts->queue as $handle ) {
		    if ( ! in_array($handle, $ignore) ) {
			    wp_dequeue_script( $handle );
			    wp_deregister_script( $handle );
		    }
        }
    }

    public static function remove_styles() {
	    global $wp_styles;

	    $ignore = array(
		    'cfw_front_css',
            'cfw_front_template_css',
            'admin-bar',
        );

	    $ignore = apply_filters('cfw_allowed_style_handles', $ignore);

	    foreach ( $wp_styles->queue as $handle ) {
		    if ( ! in_array($handle, $ignore) ) {
			    wp_dequeue_style( $handle );
			    wp_deregister_style( $handle );
		    }
	    }
    }
	/**
     * @since 1.0.0
     * @access public
	 * @param TemplateManager $template_manager
	 * @param array $global_template_parameters
	 */
	public static function body($template_manager, $global_template_parameters) {
		// Fire off an action before we load the template pieces
		do_action('cfw_template_before_load');

		// Load the template pieces
		$template_manager->load_templates( $global_template_parameters );

		// Fire off an action after we load the template pieces
		do_action('cfw_template_after_load', array(Template::get_i()) );
	}

	/**
     * @since 1.0.0
     * @access public
	 *
	 * @param ExtendedPathManager $path_manager
	 */
	public static function footer($path_manager, $settings_manager) {
		do_action('cfw_wp_footer_before_scripts');
		print_footer_scripts();
		wc_print_js();
		echo $settings_manager->get_setting('footer_scripts');
		do_action('cfw_wp_footer');
		?>
        </body>
		</html>
		<?php
	}
}