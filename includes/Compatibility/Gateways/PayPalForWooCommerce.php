<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Closure;
use Objectiv\Plugins\Checkout\Compatibility\Base;
use Objectiv\Plugins\Checkout\Main;

class PayPalForWooCommerce extends Base {

	private $_CompatibilityManager;
	private $gateway_instance;

	public function __construct( $CompatibilityManager ) {
		parent::__construct();

		$this->_CompatibilityManager = $CompatibilityManager;
	}

	public function is_available() {
		return class_exists( '\\AngellEYE_Gateway_Paypal' );
	}

	function typescript_class_and_params( $compatibility ) {
		$compatibility[] = [
			'class'  => 'PayPalForWooCommerce',
			'params' => [],
		];

		return $compatibility;
	}

	public function run() {
		if ( version_compare( VERSION_PFW, '1.5.7', '>=' ) ) {
			add_filter( 'angelleye_ec_checkout_page_buy_now_nutton', array( $this, 'modify_payment_button_output' ), 10, 1 );
			add_action( 'cfw_payment_request_buttons', array( $this, 'add_paypal_express_to_checkout' ) );
		} else {
			// Legacy
			add_action( 'wp', array( $this, 'legacy_add_paypal_express_to_checkout' ), 1 );
		}
	}

	function modify_payment_button_output( $button_output ) {
		$content_strings_to_remove = [
			'<div style="clear:both; margin-bottom:10px;"></div>',
			'<div class="clear"></div>',
		];

		// Remove unwanted strings
		foreach ( $content_strings_to_remove as $content_str ) {
			$button_output = str_replace( $content_str, '', $button_output );
		}

		return $button_output;
	}

	function add_paypal_express_to_checkout() {
		global $Angelleye_PayPal_Express_Checkout_Helper;

		if ( Main::is_checkout() ) {

			$gateways = \WC_Payment_Gateways::instance()->payment_gateways();

			if ( isset( $gateways['paypal_express'] ) && class_exists( '\\AngellEYE_Gateway_Paypal' ) ) {
				$this->gateway_instance = $gateways['paypal_express'];
			} else {
				return;
			}

			$Angelleye_PayPal_Express_Checkout_Helper = \Angelleye_PayPal_Express_Checkout_Helper::instance();

			if ( ! empty( $Angelleye_PayPal_Express_Checkout_Helper ) && $Angelleye_PayPal_Express_Checkout_Helper->show_on_checkout == 'top' || $Angelleye_PayPal_Express_Checkout_Helper->show_on_checkout == 'both' ) {
				add_action(
					'cfw_checkout_after_payment_methods', function () {
					global $Angelleye_PayPal_Express_Checkout_Helper;
					echo '<p class="paypal-cancel-wrapper">' . $Angelleye_PayPal_Express_Checkout_Helper->angelleye_woocommerce_order_button_html( '' ) . '</p>';
				}
				);

				$Angelleye_PayPal_Express_Checkout_Helper->checkout_message();

				if ( empty( $Angelleye_PayPal_Express_Checkout_Helper ) ) {
					return;
				}

				if ( ! $Angelleye_PayPal_Express_Checkout_Helper->function_helper->ec_is_express_checkout() ) {
					add_action( 'cfw_checkout_before_customer_info_tab', array( $this, 'add_separator' ), 10 );
				} else {
					add_action( 'cfw_checkout_before_customer_info_tab', array( $this, 'add_notice' ), 10 );
				}
			}
		}
	}

	public function legacy_add_paypal_express_to_checkout() {
		global $wp_filter;

		if ( Main::is_checkout() ) {

			$gateways = \WC_Payment_Gateways::instance()->payment_gateways();

			if ( isset( $gateways['paypal_express'] ) && class_exists( '\\AngellEYE_Gateway_Paypal' ) ) {
				$this->gateway_instance = $gateways['paypal_express'];
			} else {
				return;
			}

			// Remove "OR" separator
			remove_all_actions( 'woocommerce_proceed_to_checkout' );

			$existing_hooks                      = $wp_filter['woocommerce_before_checkout_form'];
			$WC_Gateway_PayPal_Express_AngellEYE = false;

			if ( $existing_hooks[5] ) {
				foreach ( $existing_hooks[5] as $key => $callback ) {
					if ( false !== stripos( $key, 'checkout_message' ) ) {
						global $WC_Gateway_PayPal_Express_AngellEYE;

						$WC_Gateway_PayPal_Express_AngellEYE = $callback['function'][0];

						if ( $WC_Gateway_PayPal_Express_AngellEYE->show_on_checkout == 'top' || $WC_Gateway_PayPal_Express_AngellEYE->show_on_checkout == 'both' ) {

							add_action(
								'cfw_checkout_after_payment_methods', function() {
									global $WC_Gateway_PayPal_Express_AngellEYE;
									echo '<p class="paypal-cancel-wrapper">' . $WC_Gateway_PayPal_Express_AngellEYE->angelleye_woocommerce_order_button_html( '' ) . '</p>';
								}
							);

							$checkout_message = (object) [
								'instance'  => $callback['function'][0],
								'func_name' => $callback['function'][1],
							];

							// Define the callback function to be ran on payment_request_buttons. Only ran if the appropriate conditions
							// are met from the if statement above
							$func = function() {

								// Strings to remove from output
								$content_strings_to_remove = [
									'<div style="clear:both; margin-bottom:10px;"></div>',
									'<div class="clear"></div>',
								];

								$paypal           = $this->instance;                  // The object
								$checkout_message = $this->func_name;       // The function name

								ob_start();                                 // Start output capture

								$paypal->{$checkout_message}();             // Call the function in question
								$content = ob_get_contents();               // Store the output content

								ob_end_clean();                             // Clean the content and aend the bfufering

								// Remove unwanted strings
								foreach ( $content_strings_to_remove as $content_str ) {
									$content = str_replace( $content_str, '', $content );
								}

								// Output the content
								echo $content;

							};

							// Add button above customer info tab
							// 0 puts us above the stripe apple pay button if it's there so we can use it's separator
							add_action( 'cfw_payment_request_buttons', Closure::bind( $func, $checkout_message ), 0 );
						} else {
							return;
						}
					}
				}

				// Don't add the separator if PayPal Express isn't actually active
			}
		}
	}

	function add_notice() {
		?>
		<div class="woocommerce-info">
			<?php _e( 'Logged in with PayPal. Please continue your order below.', 'checkout-wc' ); ?>
		</div>
		<?php
	}
}
