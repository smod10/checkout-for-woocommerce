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
	}

	function mixpanel_fixes() {
		$all_integrations = WC()->integrations->get_integrations();
		$WC_Mixpanel = $all_integrations['mixpanel'];

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
	    $scripts[] = 'paytrace-js';

	    return $scripts;
    }

    function allowed_styles( $styles ) {
	    // Checkout Add-ons
	    $styles[] = 'wc-checkout-add-ons-frontend';
	    $styles[] = 'select2';

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
	    if ( class_exists('\\WC_Stripe_Apple_Pay') ) {
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
		        add_action('cfw_checkout_before_customer_info_tab', array($this, 'add_separator'), 10);
            }
	    }
    }

    function add_separator() {
	    ?>
        <p class="pay-button-separator">
            <span><?php esc_html_e( 'Or', 'checkout-wc' ); ?></span>
        </p>
        <?php
    }
}