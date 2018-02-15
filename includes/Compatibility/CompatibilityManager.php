<?php
namespace Objectiv\Plugins\Checkout\Compatibility;

/**
 * Class Compatibility
 *
 * @link objectiv.co
 * @since 1.0.1
 * @package Objectiv\Plugins\Checkout\Core
 * @author Clifton Griffin <clif@objectiv.co>
 */
class CompatibilityManager {
	public function __construct() {
		/**
		 * Plugins
		 */

	    // MixPanel
        new MixPanel();

	    // MonsterInsights
        new MonsterInsights();

        // Checkout Add-ons
        new SkyVergeCheckoutAddons();

        // Tickera
        new Tickera();

        // Checkout Address Autocomplete
        new eCreationsCheckoutAddressAutoComplete();

        // Pixel Caffeine
        new PixelCaffeine();

        // One Click Upsells
        new OneClickUpsells( $this );

        // Jilt
		new Jilt();

		/**
		 * Gateways
		 */

		// SkyVerge Gateway Framework
        new GatewaySkyVerge();

		// PayPal Express
        new GatewayPayPalExpress( $this );

        // Stripe 3.x
        new GatewayStripe3x( $this );

        // Authorize.net AIM
        new GatewayAuthorizeNetAIM();

		// Authorize.net CIM
        new GatewayAuthorizeNetCIM();

        // PayTrace
        new GatewayPayTrace();

        // BlueSnap
        new GatewayBlueSnap();

		/**
		 * Misc
		 */

		// WooCommerce add-to-cart URL parameter redirection
		add_action('wp_loaded', array($this, 'add_to_cart_redirect'), 0 );
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

    function add_to_cart_redirect() {
	    if ( ! empty($_GET['add-to-cart']) && ! empty($_GET['checkout-redirect']) ) {
		    add_filter('woocommerce_add_to_cart_redirect', function() {
			    return wc_get_checkout_url();
		    } );
        }
    }
}