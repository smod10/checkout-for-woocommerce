<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

class OneClickUpsells {
	private $_CompatibilityManager;

	public function __construct( $CompatibilityManager ) {
		$this->_CompatibilityManager = $CompatibilityManager;

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
			if ( ! has_action('cfw_checkout_before_customer_info_tab', array($this->_CompatibilityManager, 'add_separator') ) ) {
				add_action('cfw_checkout_before_customer_info_tab', array($this->_CompatibilityManager, 'add_separator'), 10);
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

	function allowed_scripts( $scripts ) {
		// One Click Upsell Stripe
		$scripts[] = 'ocustripe';
		$scripts[] = 'ocuadyen';
		$scripts[] = 'ocuamazon';
		$scripts[] = 'ocubraintree';

		return $scripts;
	}
}