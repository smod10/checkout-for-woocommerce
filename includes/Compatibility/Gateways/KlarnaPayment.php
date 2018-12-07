<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Gateways;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class KlarnaPayment extends Base {

	protected $klarna_payments = null;

	public function __construct() {
		parent::__construct();
	}

	function is_available() {
		return class_exists( '\\WC_Klarna_Payments' );
	}

	function run() {
		$available_gateways = WC()->payment_gateways()->get_available_payment_gateways();

		if ( empty( $available_gateways['klarna_payments'] ) ) {
			return;
		}

		$this->klarna_payments = $available_gateways['klarna_payments'];

		add_action( 'cfw_payment_gateway_list_klarna_payments_alternate', array( $this, 'klarna_payments_content' ) );
		add_filter( 'cfw_show_gateway_klarna_payments', '__return_false' );
	}

	function klarna_payments_content() {
		do_action( 'klarna_payments_template' );
		if ( is_array( WC()->session->get( 'klarna_payments_categories' ) ) ) {
			$available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
			$kp                 = $available_gateways['klarna_payments'];

			foreach ( apply_filters( 'wc_klarna_payments_available_payment_categories', WC()->session->get( 'klarna_payments_categories' ) ) as $payment_category ) {
				$payment_category_id   = 'klarna_payments_' . $payment_category->identifier;
				$payment_category_name = $payment_category->name;
				$payment_category_icon = $payment_category->asset_urls->standard;
				$kp                    = $available_gateways['klarna_payments'];
				$kp->id                = $payment_category_id;
				$kp->title             = $payment_category_name;
				$kp->icon              = $payment_category_icon;
				$headers               = get_headers( $kp->icon );
				if ( 'HTTP/1.1 404 Not Found' === $headers[0] ) {
					switch ( $kp->id ) {
						case 'klarna_payments_pay_later':
							$kp->icon = 'https://cdn.klarna.com/1.0/shared/image/generic/badge/sv_se/pay_later/standard/pink.svg';
							break;
						case 'klarna_payments_pay_over_time':
							$kp->icon = 'https://cdn.klarna.com/1.0/shared/image/generic/badge/sv_se/slice_it/standard/pink.svg';
							break;
						case 'klarna_payments_pay_now':
							$kp->icon = 'https://cdn.klarna.com/1.0/shared/image/generic/badge/sv_se/pay_now/standard/pink.svg';
							break;
					}
				}
				?>
				<li class="wc_payment_method payment_method_<?php echo $kp->id; ?> cfw-radio-reveal-li">
					<div class="payment_method_title_wrap cfw-radio-reveal-title-wrap">
						<label class="payment_method_label cfw-radio-reveal-label" for="payment_method_<?php echo $kp->id; ?>">
							<input id="payment_method_<?php echo $kp->id; ?>" type="radio" class="input-radio" name="payment_method" value="<?php echo esc_attr( $kp->id ); ?>" <?php echo ($count == 0) ? "checked" : ""; ?> data-order_button_text="<?php echo esc_attr( $gateway->order_button_text ); ?>" />
							<span class="payment_method_title cfw-radio-reveal-title"><?php echo $kp->get_title(); ?></span>
						</label>

						<span class="payment_method_icons">
                            <?php echo $kp->get_icon(); ?>
                        </span>
					</div>
					<?php if ( apply_filters("cfw_payment_gateway_{$kp->id}_content", $kp->has_fields() || $kp->get_description() ) ) : ?>
						<div class="payment_box_wrap cfw-radio-reveal-content-wrap" <?php if ( ! $kp->chosen ) : ?>style="display:none;"<?php endif; ?>>
							<div class="payment_box payment_method_<?php echo $kp->id; ?> cfw-radio-reveal-content">
								<?php
								ob_start();
								$kp->payment_fields();

								$field_html = ob_get_clean();

								/**
								 * Gateway Compatibility Patches
								 */
								// Expiration field fix
								$field_html = str_ireplace('js-sv-wc-payment-gateway-credit-card-form-expiry', 'js-sv-wc-payment-gateway-credit-card-form-expiry  wc-credit-card-form-card-expiry', $field_html);
								$field_html = str_ireplace('js-sv-wc-payment-gateway-credit-card-form-account-number', 'js-sv-wc-payment-gateway-credit-card-form-account-number  wc-credit-card-form-card-number', $field_html);

								// Credit Card Field Placeholders
								$field_html = str_ireplace('•••• •••• •••• ••••', 'Card Number', $field_html);
								$field_html = str_ireplace('&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;', 'Card Number', $field_html);

								echo apply_filters("cfw_payment_gateway_field_html_{$gateway->id}", $field_html);
								?>
							</div>
						</div>
					<?php endif; ?>
				</li>
				<?php
			}
		}
	}
}
