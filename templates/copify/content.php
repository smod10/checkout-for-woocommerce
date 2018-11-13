<?php
    if ( ! defined( 'ABSPATH' ) ) {
        exit; // Exit if accessed directly
    }
?>
<div class="overlay">
    <div class="spinner-wrap">
        <div class="loader">Loading...</div>
    </div>
</div>
<main id="cfw-content" class="<?php echo $css_classes; ?> cfw-tabs-initialize cfw-tabs-not-initialized">
    <div class="wrap">

        <div id="cfw-logo-container-mobile">
            <div class="cfw-logo">
                <a title="<?php echo get_bloginfo( 'name' ); ?>" href="<?php echo get_home_url(); ?>" class="logo"></a>
            </div>
        </div>

	    <?php if ( ! WC()->cart->is_empty() ): ?>
        <div id="cfw-main-container" class="cfw-container" customer="<?php echo $customer->get_id(); ?>">

            <!-- Easy Tab Container -->
            <div id="cfw-tab-container" class="cfw-left-column cfw-column-7 tab-container">

                <div id="cfw-alert-container" class="cfw-alert">
                    <div class="message"></div>
                </div>

                <div id="cfw-logo-container">
                    <div class="cfw-logo">
                        <a title="<?php echo get_bloginfo( 'name' ); ?>" href="<?php echo get_home_url(); ?>" class="logo"></a>
                    </div>
                </div>

                <ul id="cfw-breadcrumb" class="etabs">
                    <li>
                        <a href="<?php echo wc_get_cart_url(); ?>#cart"><?php _e('Cart', 'woocommerce'); ?></a>
                    </li>
                    <li class="tab" id="default-tab">
                        <a href="#cfw-customer-info" class="cfw-small"><?php esc_html_e( 'Customer information', 'checkout-wc' ); ?></a>
                    </li>
                    <?php if ( WC()->cart->needs_shipping_address() && apply_filters('cfw_show_shipping_tab', true) === true ): ?>
                    <li class="tab">
                        <a href="#cfw-shipping-method" class="cfw-small"><?php esc_html_e( 'Shipping method', 'checkout-wc' ); ?></a>
                    </li>
                    <?php endif; ?>
                    <li class="tab">
                        <a href="#cfw-payment-method" class="cfw-small"><?php esc_html_e( 'Payment method', 'checkout-wc' ); ?></a>
                    </li>
                </ul>

	            <?php do_action('cfw_checkout_before_form'); ?>

                <form id="checkout" name="checkout" class="woocommerce-checkout checkout" method="POST" data-parsley-validate="">
                    <div id="order_review" class="woocommerce-checkout-review-order">
                        <!-- Customer Info Panel -->
                        <div id="cfw-customer-info" class="cfw-panel">

                            <div id="cfw-payment-request-buttons">
								<?php do_action('cfw_payment_request_buttons'); ?>
                            </div>

                            <?php do_action('cfw_checkout_before_customer_info_tab'); ?>

                            <div id="cfw-login-details" class="cfw-module">
                                <h3 class="cfw-module-title">
                                    <?php echo apply_filters('cfw_customer_information_heading', __( 'Customer information', 'checkout-wc' ) ); ?>
                                </h3>

                                <?php if( ! is_user_logged_in() ): ?>

                                    <div class="cfw-have-acc-text cfw-small">
                                        <span>
                                            <?php esc_html_e('Already have an account with us?', 'checkout-wc'); ?>
                                        </span>

                                        <a id="cfw-ci-login" class="cfw-link" href="#cfw-customer-info">
                                            <?php esc_html_e('Log in.', 'checkout-wc'); ?>
                                        </a>

                                        <?php if( WC()->checkout->is_registration_required() ): ?>
                                            <span>
                                                <?php esc_html_e('If you do not have an account, the information provided here will be used to create an account on checkout.', 'checkout-wc'); ?>
                                            </span>
                                        <?php endif; ?>
                                    </div>

                                    <div id="" class="cfw-input-container">

                                        <div id="cfw-email-wrap" class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="billing_email"><?php esc_html_e('Email', 'checkout-wc'); ?></label>
                                            <input type="email" name="billing_email" id="billing_email" data-parsley-group="account" autocomplete="email" autofocus="autofocus" size="30" title="Email" placeholder="Email" class="garlic-auto-save" value="" required="" data-parsley-trigger="keyup">
                                        </div>

										<?php do_action('cfw_checkout_after_email'); ?>

                                        <div id="cfw-login-slide">

                                            <div id="cfw-password-wrap" class="cfw-input-wrap cfw-password-input">
                                                <label class="cfw-input-label" for="cfw-password"><?php esc_html_e('Password', 'checkout-wc'); ?></label>
                                                <input type="password" name="cfw-password" id="cfw-password" autocomplete="off" title="Password" placeholder="Password">
                                            </div>

                                            <div class="cfw-input-wrap cfw-button-input">
                                                <input type="button" name="cfw-login-btn" id="cfw-login-btn" value="<?php esc_attr_e('Login', 'checkout-wc'); ?>" />
                                                <?php if( ! WC()->checkout->is_registration_required() ): ?>
                                                    <span class="login-optional cfw-small">
                                                        <?php esc_html_e('Login is optional. You may continue with your order below.', 'checkout-wc'); ?>
                                                    </span>
                                                <?php endif; ?>
                                            </div>

                                        </div>

                                        <div class="cfw-input-wrap cfw-check-input">

                                            <?php if( ! WC()->checkout->is_registration_required() ): ?>
                                                <input type="checkbox" id="createaccount" class="garlic-auto-save" name="createaccount" />
                                            <?php else: ?>
                                                <input type="checkbox" id="createaccount" class="garlic-auto-save" name="createaccount" disabled="disabled" checked />
                                            <?php endif; ?>

                                            <label class="cfw-small" for="createaccount"><?php printf( apply_filters('cfw_create_account_checkbox_label', esc_html__('Create %s shopping account.', 'checkout-wc') ), get_bloginfo('name') ); ?></label>
                                        </div>
                                    </div>

                                <?php else: ?>

                                    <div class="cfw-have-acc-text cfw-small">
                                        <?php printf( esc_html__('Welcome back, %s', 'checkout-wc'), "<strong>" . wp_get_current_user()->display_name . "</strong>" ); ?>
                                    </div>

                                <?php endif; ?>

                            </div>

	                        <?php do_action('cfw_checkout_before_customer_info_address'); ?>

                            <div id="cfw-shipping-info" class="cfw-module">
                                <h3 class="cfw-module-title">
                                    <?php
                                        if ( ! WC()->cart->needs_shipping_address() ) {
	                                        echo apply_filters('cfw_billing_address_heading', esc_html__( 'Billing address', 'checkout-wc' ) );
                                        } else {
	                                        echo apply_filters('cfw_shipping_address_heading', esc_html__( 'Shipping address', 'checkout-wc' ) );
                                        }
                                    ?>
                                </h3>

                                <div class="cfw-shipping-info-container cfw-parsley-shipping-details <?php cfw_address_class_wrap( WC()->cart->needs_shipping_address() ); ?>">
                                    <?php
                                        if ( ! WC()->cart->needs_shipping_address() ) {
	                                        do_action('cfw_checkout_before_billing_address');

                                            cfw_get_billing_checkout_fields($checkout);

	                                        do_action('cfw_checkout_after_billing_address');
                                        } else {
	                                        do_action('cfw_checkout_before_shipping_address');

                                            cfw_get_shipping_checkout_fields($checkout);

	                                        do_action('cfw_checkout_after_shipping_address');
                                        }
                                    ?>
                                </div>
                            </div>

	                        <?php do_action('cfw_checkout_after_customer_info_address'); ?>

	                        <?php do_action('cfw_checkout_before_customer_info_tab_nav'); ?>

                            <div id="cfw-shipping-info-action" class="cfw-bottom-controls">
                                <div class="previous-button">
                                    <a href="<?php echo wc_get_cart_url(); ?>" class="cfw-prev-tab">« <?php esc_html_e( 'Return to cart', 'checkout-wc' ); ?></a>
                                </div>
                                <?php if ( WC()->cart->needs_shipping_address() && apply_filters('cfw_show_shipping_tab', true) === true ): ?>
                                    <a href="#cfw-shipping-method" class="cfw-primary-btn cfw-next-tab"><?php esc_html_e('Continue to shipping method', 'checkout-wc'); ?></a>
                                <?php else: ?>
                                    <a href="#cfw-payment-method" class="cfw-primary-btn cfw-next-tab"><?php esc_html_e('Continue to payment method', 'checkout-wc'); ?></a>
                                <?php endif; ?>
                            </div>

	                        <?php do_action('cfw_checkout_after_customer_info_tab'); ?>
                        </div>

                        <!-- Shipping Method Panel -->
                        <div id="cfw-shipping-method" class="cfw-panel" style="<?php echo ( ! WC()->cart->needs_shipping_address() || apply_filters('cfw_show_shipping_tab', true) === false ) ? "display: none" : ""; ?>">
	                        <?php do_action('cfw_checkout_before_shipping_method_tab'); ?>

                            <div id="cfw-shipping-details" class="cfw-module">
                                <h3 class="cfw-module-title">
                                    <?php echo apply_filters('cfw_shipping_address_recap_heading', esc_html__( 'Shipping address', 'checkout-wc' ) ); ?>
                                </h3>

                                <div id="cfw-shipping-details-fields"></div>

                                <div>
                                    <a href="#cfw-customer-info" class="cfw-link"><?php esc_html_e( 'Edit shipping address', 'checkout-wc' ); ?></a>
                                </div>
                            </div>

	                        <?php do_action('cfw_checkout_before_shipping_methods'); ?>

                            <?php if ( WC()->cart->needs_shipping() && apply_filters('cfw_show_shipping_tab', true) === true ) : ?>
                                <div id="cfw-shipping-method-list" class="cfw-module">
                                    <h3 class="cfw-module-title">
                                        <?php echo apply_filters('cfw_shipping_method_heading', esc_html__( 'Shipping method', 'checkout-wc' ) ); ?>
                                    </h3>
                                    <span><?php esc_html_e( 'Select a shipping method:', 'checkout-wc' ); ?></span>
                                    <div id="shipping_method">
                                        <?php cfw_cart_totals_shipping_html(); ?>
                                    </div>
                                </div>
                            <?php endif; ?>

	                        <?php do_action('cfw_checkout_after_shipping_methods'); ?>

	                        <?php do_action('cfw_checkout_before_shipping_method_tab_nav'); ?>

                            <div id="cfw-shipping-action" class="cfw-bottom-controls">
                                <div class="previous-button">
                                    <a href="#cfw-customer-info" class="cfw-prev-tab" rel="0">« <?php esc_html_e( 'Return to customer information', 'checkout-wc' ); ?></a>
                                </div>
                                <div>
                                    <a href="#cfw-payment-method" class="cfw-primary-btn cfw-next-tab"><?php esc_html_e( 'Continue to payment method', 'checkout-wc' ); ?></a>
                                </div>
                            </div>

	                        <?php do_action('cfw_checkout_after_shipping_method_tab'); ?>
                        </div>

                        <!-- Payment Method Panel -->
                        <div id="cfw-payment-method" class="cfw-panel">

                            <div id="cfw-billing-methods" class="cfw-module">
	                            <?php do_action('cfw_checkout_before_payment_method_tab'); ?>

                                <h3 class="cfw-module-title">
                                    <?php echo apply_filters('cfw_payment_method_heading', esc_html__('Payment method', 'checkout-wc') ); ?>
                                </h3>

                                <?php do_action('cfw_checkout_before_payment_methods'); ?>

                                <div class="cfw-payment-method-information-wrap">
                                    <div>
                                        <span class="cfw-small secure-notice"><?php esc_html_e( 'All transactions are secure and encrypted. Credit card information is never stored on our servers.', 'checkout-wc' ); ?></span>
                                    </div>

                                    <div id="order_review" class="cfw-payment-methods-wrap">
                                        <div id="payment" class="woocommerce-checkout-payment">
                                            <?php cfw_get_payment_methods_html(); ?>
                                        </div>
                                    </div>
                                </div>

                                <div class="cfw-no-payment-method-wrap">
                                    <span class="cfw-small"><?php echo apply_filters('cfw_no_payment_required_text', esc_html__('Your order is free. No payment is required.', 'checkout-wc') ); ?></span>
                                </div>

	                            <?php do_action('cfw_checkout_after_payment_methods'); ?>
                            </div>

                            <?php if ( WC()->cart->needs_shipping_address() ): ?>
                                <h3 class="cfw-module-title">
		                            <?php echo apply_filters('cfw_billing_address_heading', esc_html__( 'Billing address', 'checkout-wc' ) ); ?>
                                </h3>
                                <div id="cfw-shipping-same-billing" class="cfw-module">
                                    <ul class="cfw-radio-reveal-group">
                                        <li class="cfw-radio-reveal-li cfw-no-reveal">
                                            <div class="cfw-radio-reveal-title-wrap">
                                                <label class="cfw-radio-reveal-title-wrap cfw-radio-reveal-label">
                                                    <input type="radio" name="ship_to_different_address" id="ship_to_different_address_as_billing" value="0" class="garlic-auto-save" checked />
                                                    <span class="cfw-radio-reveal-title"><?php esc_html_e( 'Same as shipping address', 'checkout-wc' ); ?></span>
                                                </label>
                                            </div>
                                        </li>
                                        <li class="cfw-radio-reveal-li">
                                            <div class="cfw-radio-reveal-title-wrap">
                                                <label class="cfw-radio-reveal-label">
                                                    <input type="radio" name="ship_to_different_address" id="shipping_dif_from_billing" value="1" class="garlic-auto-save" />
                                                    <span class="cfw-radio-reveal-title"><?php esc_html_e( 'Use a different billing address', 'checkout-wc' ); ?></span>
                                                </label>
                                            </div>
                                            <div class="cfw-radio-reveal-content-wrap" style="display: none">
                                                <div id="cfw-billing-fields-container" class="cfw-radio-reveal-content <?php cfw_address_class_wrap( false ); ?>">
                                                    <?php cfw_get_billing_checkout_fields($checkout); ?>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            <?php endif; ?>

	                        <?php do_action('cfw_checkout_before_payment_method_terms_checkbox'); ?>

                            <div class="cfw-additional-fields-container">
		                        <?php do_action( 'woocommerce_before_order_notes', $checkout ); ?>

		                        <?php if ( apply_filters( 'woocommerce_enable_order_notes_field', false ) ) : ?>

                                    <div class="cfw-additional-information">
				                        <?php foreach ( $checkout->get_checkout_fields( 'order' ) as $key => $field ) : ?>
					                        <?php woocommerce_form_field( $key, $field, $checkout->get_value( $key ) ); ?>
				                        <?php endforeach; ?>
                                    </div>

		                        <?php endif; ?>

		                        <?php do_action( 'woocommerce_after_order_notes', $checkout ); ?>
                            </div>

                            <?php wc_get_template('checkout/terms.php'); ?>

	                        <?php do_action('cfw_checkout_before_payment_method_tab_nav'); ?>

                            <div id="cfw-payment-action" class="cfw-bottom-controls">
                                <div class="previous-button">
                                    <?php if ( WC()->cart->needs_shipping_address() ): ?>
                                        <a href="#cfw-shipping-method" class="cfw-prev-tab" rel="0">« <?php esc_html_e( 'Return to shipping information', 'checkout-wc' ); ?></a>
                                    <?php else: ?>
                                        <a href="#cfw-customer-info" class="cfw-prev-tab" rel="0">« <?php esc_html_e( 'Return to customer information', 'checkout-wc' ); ?></a>
                                    <?php endif; ?>
                                </div>
                                <div>
	                                <?php echo apply_filters( 'woocommerce_order_button_html', '<button type="submit" class="cfw-primary-btn cfw-next-tab validate" name="woocommerce_checkout_place_order" id="place_order" value="' . esc_attr( $order_button_text ) . '" data-value="' . apply_filters( 'woocommerce_order_button_text' , esc_html__( 'Complete Order', 'checkout-wc' ) ) . '">' . apply_filters( 'woocommerce_order_button_text' , esc_html__( 'Complete Order', 'checkout-wc' ) ) . '</button>' ); // @codingStandardsIgnoreLine ?>
                                </div>
                            </div>

	                        <?php do_action('cfw_checkout_after_payment_methods_tab'); ?>
                        </div>
                    </div>

	                <?php wp_nonce_field( 'woocommerce-process_checkout', 'woocommerce-process-checkout-nonce' ); ?>
                </form>

	            <?php do_action('cfw_checkout_after_form'); ?>

                <footer id="cfw-footer">
                    <div class="wrap">
                        <div class="cfw-container cfw-column-12">
                            <div class="cfw-footer-inner">
					            <?php if ( ! empty( $footer_text = Objectiv\Plugins\Checkout\Main::instance()->get_settings_manager()->get_setting('footer_text') ) ): ?>
						            <?php echo $footer_text; ?>
					            <?php else: ?>
                                    Copyright &copy; <?php echo date("Y"); ?>, <?php echo get_bloginfo('name'); ?>. All rights reserved.
					            <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

                <!-- Cart / Sidebar Column -->
            <div id="cfw-cart-details" class="cfw-right-column cfw-column-5">
                <div id="cfw-cart-details-review-bar" class="cfw-sg-container">
                    <div class="cfw-column-8">
                        <div id="cfw-show-cart-details">
                            <a href="javascript:;" class="cfw-link"><?php esc_html_e( 'Show order summary', 'checkout-wc' ); ?></a>
                            <svg id="cfw-cart-details-arrow" height="512px" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "/></svg>
                        </div>
                    </div>
                    <div class="cfw-column-4">
                        <span class="total amount">
                            <?php echo $cart->get_total(); ?>
                        </span>
                    </div>
                </div>

                <div id="cfw-cart-details-collapse-wrap">
                    <div id="cfw-cart-list" class="cfw-module">
                        <?php cfw_get_checkout_cart_html(); ?>
                    </div>

                    <div id="cfw-deductors-list" class="cfw-module">
                        <?php if ( wc_coupons_enabled() ): ?>
                        <div class="cfw-sg-container cfw-promo-row cfw-input-wrap-row">
                            <div class="cfw-column-8">
                                <div class="cfw-input-wrap cfw-text-input">
                                    <input type="text" name="cfw-promo-code" id="cfw-promo-code" size="30" title="<?php esc_attr_e( 'Enter Promo Code', 'checkout-wc' ); ?>" placeholder="<?php esc_attr_e( 'Enter Promo Code', 'checkout-wc' ); ?>">
                                </div>
                            </div>
                            <div class="cfw-column-4">
                                <div class="cfw-input-wrap cfw-button-input">
                                    <input type="button" name="cfw-promo-code-btn" id="cfw-promo-code-btn" class="cfw-def-action-btn" value="<?php esc_attr_e('Apply','checkout-wc'); ?>" />
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>

                    <div id="<?php echo apply_filters('cfw_template_cart_el', "cfw-totals-list"); ?>" class="cfw-module">
                        <div class="cfw-totals-normal">
                            <div id="cfw-cart-subtotal" class="cfw-flex-row cfw-flex-justify">
                                <span class="type"><?php esc_html_e('Subtotal', 'checkout-wc'); ?></span>
                                <span class="amount"><?php echo $cart->get_cart_subtotal(); ?></span>
                            </div>
                            <div id="cfw-cart-coupons">
                            <?php foreach ( WC()->cart->get_coupons() as $code => $coupon ) : ?>
                                <div class="cfw-cart-coupon cfw-flex-row cfw-flex-justify">
                                    <span class="type"><?php wc_cart_totals_coupon_label( $coupon ); ?></span>
                                    <span class="amount"><?php wc_cart_totals_coupon_html( $coupon ); ?></span>
                                </div>
                            <?php endforeach; ?>
                            </div>
                            <div id="cfw-cart-shipping-total" class="cfw-flex-row cfw-flex-justify" style="<?php echo (!WC()->cart->needs_shipping()) ? 'display: none' : 'display: flex'; ?>">
                                <span class="type"><?php esc_html_e('Shipping', 'checkout-wc'); ?></span>
                                <span class="amount"><?php echo $cart->get_cart_shipping_total(); ?></span>
                            </div>
                            <div id="cfw-cart-fees"></div>
	                        <?php foreach ( WC()->cart->get_fees() as $fee ) : ?>
                                <div class="cfw-cart-fee cfw-flex-row cfw-flex-justify">
                                    <span class="type"><?php echo esc_html( $fee->name ); ?></span>
                                    <span class="amount"><?php wc_cart_totals_fee_html( $fee ); ?></span>
                                </div>
	                        <?php endforeach; ?>
                            </div>
                            <?php if ( wc_tax_enabled() ): ?>
                                <div id="cfw-cart-taxes" class="cfw-flex-row cfw-flex-justify">
                                    <span class="type"><?php esc_html_e('Taxes', 'checkout-wc'); ?></span>
                                    <span class="amount"><?php wc_cart_totals_taxes_total_html(); ?></span>
                                </div>
                            <?php endif; ?>
                            <div class="cfw-totals-total">
                                <div id="cfw-cart-total" class="cfw-flex-row cfw-flex-justify">
                                    <span class="type"><?php esc_html_e('Total', 'checkout-wc'); ?></span>
                                    <span class="amount"><?php echo $cart->get_total(); ?></span>
                                </div>
                            </div>
                        </div>

                        <div id="cfw-other-totals" class="cfw-other-totals">
                            <table><?php do_action( 'woocommerce_review_order_after_order_total' ); ?></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	    <?php endif; ?>
    </div>
</main>
