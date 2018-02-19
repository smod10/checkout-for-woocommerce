<?php
namespace Objectiv\Plugins\Checkout\Compatibility;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\AuthorizeNetAIM;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\AuthorizeNetCIM;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\PayPalExpress;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\PayTrace;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\SkyVerge;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\Stripe3x;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\Stripe4x;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\AutomateWoo;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CheckoutAddressAutoComplete;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\GoogleAnalyticsPro;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\Jilt;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\MixPanel;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\MonsterInsights;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\OneClickUpsells;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PixelCaffeine;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PixelCat;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PointsRewards;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\SkyVergeCheckoutAddons;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\Tickera;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\BlueSnap;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\EnhancedEcommerceGoogleAnalytics;

/**
 * Class Compatibility
 *
 * @link objectiv.co
 * @since 1.0.1
 * @package Objectiv\Plugins\Checkout\Core
 * @author Clifton Griffin <clif@objectiv.co>
 */
class Manager {
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
        new CheckoutAddressAutoComplete();

        // Pixel Caffeine
        new PixelCaffeine();

        // One Click Upsells
        new OneClickUpsells();

        // Jilt
		new Jilt();

		// Google Analytics Pro
		new GoogleAnalyticsPro();

		/**
		 * Gateways
		 */

		// SkyVerge Gateway Framework
        new SkyVerge();

		// PayPal Express
        new PayPalExpress( $this );

        // Stripe 3.x
        new Stripe3x();

        // Stripe 4.x
        new Stripe4x();

        // Authorize.net AIM
        new AuthorizeNetAIM();

		// Authorize.net CIM
        new AuthorizeNetCIM();

        // PayTrace
        new PayTrace();

        // BlueSnap
        new BlueSnap();

        // Enhanced Ecommerce Google Analytics
		new EnhancedEcommerceGoogleAnalytics();

		// Points and Rewards
		new PointsRewards();

		// Pixel Cat
		new PixelCat();

		// AutomateWoo
		new AutomateWoo();

		/**
		 * Misc
		 */
        // TODO: Move this somewhere better
		// WooCommerce add-to-cart URL parameter redirection
		add_action('wp_loaded', array($this, 'add_to_cart_redirect'), 0 );
	}

    function add_to_cart_redirect() {
	    if ( ! empty($_GET['add-to-cart']) && ! empty($_GET['checkout-redirect']) ) {
		    add_filter('woocommerce_add_to_cart_redirect', function() {
			    return wc_get_checkout_url();
		    } );
        }
    }
}