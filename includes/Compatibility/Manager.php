<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

use Objectiv\Plugins\Checkout\Compatibility\Gateways\AfterPayKrokedil;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\AmazonPay;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\Braintree;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\KlarnaCheckout;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\KlarnaPayment;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\PayPalCheckout;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\PayPalForWooCommerce;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\Stripe;
use Objectiv\Plugins\Checkout\Compatibility\Gateways\ToCheckout;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\ActiveCampaign;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CheckoutAddressAutoComplete;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CheckoutFieldEditor;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CheckoutManager;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\CraftyClicks;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\DirectCheckout;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\EUVATNumber;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\FacebookForWooCommerce;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\GoogleAnalyticsPro;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\KodiakGiftCards;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\MailChimpforWooCommerce;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\MixPanel;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\NLPostcodeChecker;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\OneClickUpsells;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\OnePageCheckout;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PixelCaffeine;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PointsRewards;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\PostNL;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\SkyVergeCheckoutAddons;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\SkyVergeSocialLogin;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\Tickera;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\EnhancedEcommerceGoogleAnalytics;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\UltimateRewardsPoints;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommerceCore;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommerceGermanized;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommercePriceBasedOnCountry;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommerceSmartCoupons;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WooCommerceSubscriptions;
use Objectiv\Plugins\Checkout\Compatibility\Plugins\WPGensReferAFriend;
use Objectiv\Plugins\Checkout\Compatibility\Themes\Avada;
use Objectiv\Plugins\Checkout\Compatibility\Themes\BeaverBuilder;
use Objectiv\Plugins\Checkout\Compatibility\Themes\GeneratePress;
use Objectiv\Plugins\Checkout\Compatibility\Themes\Porto;
use Objectiv\Plugins\Checkout\Compatibility\Themes\TMOrganik;

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

		// NL Postcode Checker
		new NLPostcodeChecker();

		// WooCommerce PostNL
		new PostNL();

		// MailChimp for WooCommerce
		new MailChimpforWooCommerce();

		// WooCommerce Direct Checkout
		new DirectCheckout();

		// ActiveCampaign for WooCommerce
		new ActiveCampaign();

		// Ultimate Points and Rewards
		new UltimateRewardsPoints();

		// Smart Coupons
		new WooCommerceSmartCoupons();

		// EU VAT Number
		new EUVATNumber();

		// Kodiak Gift Cards
		new KodiakGiftCards();

		// WP Gens Refer a Friend
		new WPGensReferAFriend();

		// SkyVerge WooCommerce Social Login
		new SkyVergeSocialLogin();

		// WooCommerce Price Based on Country
		new WooCommercePriceBasedOnCountry();

		// Facebook for WooCommerce
		new FacebookForWooCommerce();


		/**
		 * Gateways
		 */

		// PayPal Express
		new PayPalCheckout( $this );

		// Stripe 4.x
		new Stripe();

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

		// Klarna Payment
		new KlarnaPayment();

		// AfterPay
		new AfterPayKrokedil();

		// ToCheckout
		new ToCheckout();


		/**
		 * Themes
		 */
		// Avada
		new Avada();

		// Porto
		new Porto();

		// GeneratePress / GP Premium
		new GeneratePress();

		// TM Organik / any theme that uses InsightFramework
		new TMOrganik();

		// Beaver Builder Theme
		new BeaverBuilder();


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
