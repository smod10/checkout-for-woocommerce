<?php

namespace Objectiv\Plugins\Checkout\Core;

/**
 * Class Compatibility
 *
 * @link objectiv.co
 * @since 1.0.1
 * @package Objectiv\Plugins\Checkout\Core
 * @author Clifton Griffin <clif@objectiv.co>
 */
class Compatibility {
	public function __construct() {
		// MixPanel Compatibility
	    add_action('cfw_wp_head', array($this, 'mixpanel_fixes') );

	    // MonsterInisghts (Google Analytics)
        if ( function_exists('monsterinsights_tracking_script') ) {
	        add_action( 'cfw_wp_head', 'monsterinsights_tracking_script', 6 );
        }
        
		// Checkout Add-ons Compatibility
        add_filter('wc_checkout_add_ons_position', array($this, 'set_checkout_add_ons_position') );

        // Allow scripts and styles for certain plugins
        add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts') );
        add_filter('cfw_allowed_style_handles', array($this, 'allowed_styles') );

        // Add PayPal Express Checkout Button
        add_action('wp', array($this, 'add_paypal_express_to_checkout') );

        // Add Stripe apple pay (3.x)
        add_action('wp', array($this, 'add_stripe_apple_pay') );

        // Tickera Attendee Forms
        global $tc_woocommerce_bridge;

        if ( ! empty($tc_woocommerce_bridge) ) {
	        add_action('cfw_checkout_before_payment_method_terms_checkbox', array($tc_woocommerce_bridge, 'add_standard_tc_fields_to_checkout'));
        }

        // WooCommerce add-to-cart URL parameter redirection
        add_action('wp_loaded', array($this, 'add_to_cart_redirect'), 0 );

        // Checkout Address Autocomplete
        if ( function_exists('ecr_addrac_scripts') ) {
	        add_action( 'cfw_wp_head', 'ecr_addrac_scripts' );
        }

		/**
		 * Pixel Caffeine
		 */
		if ( class_exists( '\\PixelCaffeine' ) && class_exists('\\AEPC_Pixel_Scripts') && class_exists('\\AEPC_Woocommerce_Addon_Support') ) {
		    $AEPC_Woocommerce_Addon_Support = new \AEPC_Woocommerce_Addon_Support();

			add_action( 'cfw_wp_footer_before_scripts', array( 'AEPC_Pixel_Scripts', 'enqueue_scripts' ), 10 );
			add_action( 'cfw_wp_footer_before_scripts', array( $AEPC_Woocommerce_Addon_Support, 'register_add_payment_info_params' ), 11 );

			add_filter( 'cfw_body_classes', array( $this, 'add_pixel_caffeine_body_class' ) );

			if ( 'head' == get_option( 'aepc_pixel_position', 'head' ) ) {
				add_action( 'cfw_wp_head', array( 'AEPC_Pixel_Scripts', 'pixel_init' ), 99 );
			} else {
				add_action( 'cfw_wp_footer', array( 'AEPC_Pixel_Scripts', 'pixel_init' ), 1 );
			}
		}

		/**
         * One Click Upsells
         */
		if ( defined('GB_OCU_VER') ) {
			add_action('wp', array($this, 'add_ocu_checkout_buttons' ) );
        }
	}

	function add_ocu_checkout_buttons() {
		$gateways = WC()->payment_gateways->get_available_payment_gateways();
		$add_sep = false;

		if ( ! empty( $gateways['ocustripe'] ) ) {
		    if ( $gateways['ocustripe']->apple_pay_enabled != 'no' ) {
			    add_action( 'cfw_checkout_before_customer_info_tab', 'gb_ocu_stripe_apple_pay_display_button', 5);

			    $add_sep = true;
            }
        }

        if ( ! empty( $gateways[ 'ocupaypal' ] ) ) {
		    if ( $gateways['ocupaypal']->checkout_page == 'top' || $gateways['ocupaypal']->checkout_page == 'both' ) {
			    add_action( 'cfw_checkout_before_customer_info_tab', array($this, 'gb_ocu_paypal_display_button'), 5 );

			    $add_sep = true;
            }
        }

        if ( $add_sep ) {
	        if ( ! has_action('cfw_checkout_before_customer_info_tab', array($this, 'add_separator') ) ) {
		        add_action('cfw_checkout_before_customer_info_tab', array($this, 'add_separator'), 10);
	        }
        }
    }

	function gb_ocu_paypal_display_button() {
		$gateways = WC()->payment_gateways->get_available_payment_gateways();

		if(
			! empty( $gateways[ 'ocupaypal' ] ) &&
			method_exists( $gateways[ 'ocupaypal' ], 'paypal_display_button' )
		)
		{
			$checkout_page = $gateways[ 'ocupaypal' ]->checkout_page;

			if( $checkout_page == 'top' || $checkout_page == 'both' ) {
				echo '<div class="woocommerce-info" style="text-align: center;">';

				$gateways[ 'ocupaypal' ]->paypal_display_button();

				echo '</div>';
			}
		}
	}

	function add_pixel_caffeine_body_class( $classes ) {
		$classes[] = "woocommerce-page";

		return $classes;
    }

	function mixpanel_fixes() {
		$all_integrations = WC()->integrations->get_integrations();
		$WC_Mixpanel = isset($all_integrations['mixpanel']) ? $all_integrations['mixpanel'] : null;

		if($WC_Mixpanel) {
			$WC_Mixpanel->output_head();
			$WC_Mixpanel->started_checkout();

			// Payment form
			$this->echo_payment_start_script( $WC_Mixpanel );
		}
	}

	function echo_payment_start_script($WC_Mixpanel) {
		ob_start();
		$WC_Mixpanel->started_payment();
		$script = ob_get_clean();
		?>
		<script type="text/javascript">
			jQuery(document).ready(function(){
                jQuery('#<?php echo apply_filters('cfw_template_tab_container_el', 'cfw-tab-container'); ?>').bind('easytabs:after', function() {
                    if ( jQuery('#<?php echo apply_filters('cfw_template_payment_method_el', 'cfw-payment-method'); ?>').hasClass('active') ) {
						<?php echo preg_replace('#<script[^>]*>([^<]+)</script>#', '$1', $script); ?>
                    }
                });
			});
		</script>
		<?php
	}

	function set_checkout_add_ons_position() {
        return 'cfw_checkout_before_payment_method_terms_checkbox';
    }

    function allowed_scripts( $scripts ) {
	    // Jilt
        $scripts[] = 'wc-jilt';

        // Checkout Add-ons
	    $scripts[] = 'plupload-all';
	    $scripts[] = 'wc-checkout-add-ons-frontend';
	    $scripts[] = 'selectWoo';

	    // Paytrace
	    $scripts[] = 'paytrace-js';

	    // Checkout Address AutoComplete
	    $scripts[] = 'google-autocomplete';
	    $scripts[] = 'rp-autocomplete';

	    // One Click Upsell Stripe
        $scripts[] = 'ocustripe';
	    $scripts[] = 'ocuadyen';
	    $scripts[] = 'ocuamazon';
	    $scripts[] = 'ocubraintree';

	    // Pixel Caffeine
        $scripts[] = 'aepc-pixel-events';

        // Authorize.net - AIM
	    $scripts[] = 'wc-authorize-net-aim';
	    $scripts[] = 'wc-authorize-net-aim-accept-js';

        // Authorize.net - CIM
        $scripts[] = 'wc-authorize-net-cim';
        $scripts[] = 'wc-authorize-net-cim-accept-js';
        $scripts[] = 'sv-wc-payment-gateway-payment-form';

	    return $scripts;
    }

    function allowed_styles( $styles ) {
	    // Checkout Add-ons
	    $styles[] = 'wc-checkout-add-ons-frontend';
	    $styles[] = 'select2';

	    // Authorize.net - CIM
	    $styles[] = 'sv-wc-payment-gateway-my-payment-methods';
	    $styles[] = 'sv-wc-payment-gateway-payment-form';

	    return $styles;
    }

    function add_paypal_express_to_checkout() {
	    if ( function_exists('wc_gateway_ppec') && wc_gateway_ppec()->settings->is_enabled() && is_checkout() ) {
	        // Remove "OR" separator
		    remove_all_actions( 'woocommerce_proceed_to_checkout');

		    // Add button above customer info tab
            // 0 puts us above the stripe apple pay button if it's there so we can use it's separator
		    add_action('cfw_checkout_before_customer_info_tab', array( wc_gateway_ppec()->cart, 'display_paypal_button'), 0 );

		    $gateways = WC()->payment_gateways->get_available_payment_gateways();
		    $settings = wc_gateway_ppec()->settings;

		    // Don't add the separator if PayPal Express isn't actually active
		    if ( ! isset( $gateways['ppec_paypal'] ) || 'no' === $settings->cart_checkout_enabled ) {
			    return;
		    }

		    if ( ! has_action('cfw_checkout_before_customer_info_tab', array($this, 'add_separator') ) ) {
			    add_action('cfw_checkout_before_customer_info_tab', array($this, 'add_separator'), 10);
		    }
	    }
    }

    function add_stripe_apple_pay() {
	    // Setup Apple Pay
	    if ( class_exists('\\WC_Stripe_Apple_Pay') && is_checkout() ) {
		    $this->wc_stripe_apple_pay = new \WC_Stripe_Apple_Pay();
		    $gateways = WC()->payment_gateways->get_available_payment_gateways();

		    if ( ! method_exists($this->wc_stripe_apple_pay, 'display_apple_pay_button') ) return;

		    // Display button
		    add_action( 'cfw_checkout_before_customer_info_tab', array(
			    $this->wc_stripe_apple_pay,
			    'display_apple_pay_button'
		    ), 1 );

		    // If Apple Pay is off or stripe isn't enabled, bail
		    if ( !  $this->wc_stripe_apple_pay->apple_pay || ! isset( $gateways['stripe'] ) ) {
		        return;
            }

		    if ( ! has_action('cfw_checkout_before_customer_info_tab', array($this, 'add_separator') ) ) {
		        add_action('cfw_checkout_before_customer_info_tab', array($this, 'add_apple_pay_separator'), 10);
            }
	    }
    }

    function add_separator( $class = '' ) {
	    ?>
        <div class="<?php echo $class; ?>">
            <p class="pay-button-separator">
                <span><?php esc_html_e( 'Or', CFW_TEXT_DOMAIN ); ?></span>
            </p>
        </div>
        <?php
    }

    function add_apple_pay_separator() {
	    $this->add_separator('apple-pay-button-checkout-separator');
    }

    function add_to_cart_redirect() {
	    if ( ! empty($_GET['add-to-cart']) && ! empty($_GET['checkout-redirect']) ) {
		    add_filter('woocommerce_add_to_cart_redirect', function($url) {
			    $url = wc_get_checkout_url();
			    return $url;
		    } );
        }
    }
}