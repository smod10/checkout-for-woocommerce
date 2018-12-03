<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

use Objectiv\Plugins\Checkout\Compatibility\Gateways\AfterPay;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\AmazonPay;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\Braintree;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\KlarnaCheckout;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\PayPalExpress;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\PayPalForWooCommerce;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\Stripe4x;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CheckoutAddressAutoComplete;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CheckoutFieldEditor;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CheckoutManager;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CraftyClicks;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\GoogleAnalyticsPro;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\MixPanel;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\OneClickUpsells;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\OnePageCheckout;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PixelCaffeine;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PointsRewards;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\SkyVergeCheckoutAddons;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\Tickera;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\EnhancedEcommerceGoogleAnalytics;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommerceCore;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommerceGermanized;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommerceSubscriptions;
use Objectiv\Plugins\Checkout\Compatibility\Themes\Avada;

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

		// WooCommerce Core
		new WooCommerceCore();

		// MixPanel
		new MixPanel();

		// Checkout Add-ons
		new SkyVergeCheckoutAddons();

		// Tickera
		new Tickera();

		// Pixel Caffeine
		new PixelCaffeine();

		// One Click Upsells
		new OneClickUpsells();

		// Google Analytics Pro
		new GoogleAnalyticsPro();

		// One Page Checkout
		new OnePageCheckout();

		// WooCommerce Subscriptions
		new WooCommerceSubscriptions();

		// WooCommerce Germanized
		new WooCommerceGermanized();

		// CraftyClicks
		new CraftyClicks();

		// WooCommerce Checkout Manager
		new CheckoutManager();

		// Woo Checkout Field Editor Pro
		new CheckoutFieldEditor();

		// Checkout Address Autocomplete
		new CheckoutAddressAutoComplete();

		/**
		 * Gateways
		 */

		// PayPal Express
		new PayPalExpress( $this );

		// Stripe 4.x
		new Stripe4x();

		// Enhanced Ecommerce Google Analytics
		new EnhancedEcommerceGoogleAnalytics();

		// Points and Rewards
		new PointsRewards();

		// PayPal for WooCommerce
		new PayPalForWooCommerce( $this );

		// Braintree
		new Braintree();

		// Amazon Pay
		new AmazonPay();

		// Klarna
		new KlarnaCheckout();

		// AfterPay
		new AfterPay();

		// Themes
		new Avada();

		/**
		 * Misc
		 */
		// TODO: Move this somewhere better
		// WooCommerce add-to-cart URL parameter redirection
		add_action( 'wp_loaded', array( $this, 'add_to_cart_redirect' ), 0 );
	}

	function add_to_cart_redirect() {
		if ( ! empty( $_GET['add-to-cart'] ) && ! empty( $_GET['checkout-redirect'] ) ) {
			add_filter(
				'woocommerce_add_to_cart_redirect', function() {
					return wc_get_checkout_url();
				}
			);
		}
	}
}
