<?php
    if ( ! defined( 'ABSPATH' ) ) {
        exit; // Exit if accessed directly
    }
?>
<main id="cfw-content" class="<?php echo $css_classes; ?>">
    <div class="overlay"></div>
    <div class="wrap">

        <div class="cfw-container">
            <div class="cfw-column-12">
                <div id="cfw-alert-container" class="cfw-alert">
                    <div class="message"></div>
                </div>
            </div>
        </div>

	    <?php if ( ! WC()->cart->is_empty() ): ?>
        <div id="cfw-main-container" class="cfw-container" customer="<?php echo $customer->get_id(); ?>">

            <!-- Easy Tab Container -->
            <div id="cfw-tab-container" class="cfw-left-column cfw-column-7 tab-container">

                <ul id="cfw-breadcrumb" class="etabs">
                    <li class="tab">
                        <a href="#cfw-customer-info" class="cfw-small"><?php esc_html_e( 'Customer information', 'checkout-wc' ); ?></a>
                    </li>
                    <?php if ( WC()->cart->needs_shipping_address() ): ?>
                    <li class="tab">
                        <a href="#cfw-shipping-method" class="cfw-small"><?php esc_html_e( 'Shipping method', 'checkout-wc' ); ?></a>
                    </li>
                    <?php endif; ?>
                    <li class="tab">
                        <a href="#cfw-payment-method" class="cfw-small"><?php esc_html_e( 'Payment method', 'checkout-wc' ); ?></a>
                    </li>
                </ul>

                <form id="checkout" name="checkout" data-persist="garlic" class="woocommerce-checkout" method="POST" data-parsley-validate="">

                    <div id="order_review" class="woocommerce-checkout-review-order">
                        <!-- Customer Info Panel -->
                        <div id="cfw-customer-info" class="cfw-panel">

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
                                                <input type="checkbox" id="createaccount" class="garlic-auto-save" name="cfw-acc-register-chk" />
                                            <?php else: ?>
                                                <input type="checkbox" id="createaccount" class="garlic-auto-save" name="cfw-acc-register-chk" disabled="disabled" checked />
                                            <?php endif; ?>

                                            <label class="cfw-small" for="createaccount"><?php printf( esc_html__('Create a %s shopping account.', 'checkout-wc'), get_bloginfo('name') ); ?></label>
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

                                <div class="cfw-shipping-info-container cfw-parsley-shipping-details">
                                    <?php
                                        if ( ! WC()->cart->needs_shipping_address() ) {
                                            cfw_get_billing_checkout_fields($checkout);
                                        } else {
                                            cfw_get_shipping_checkout_fields($checkout);
                                        }
                                    ?>
                                </div>
                            </div>

	                        <?php do_action('cfw_checkout_after_customer_info_address'); ?>

	                        <?php do_action('cfw_checkout_before_customer_info_tab_nav'); ?>

                            <div id="cfw-shipping-info-action" class="cfw-bottom-controls">
                                <?php if ( WC()->cart->needs_shipping_address() ): ?>
                                    <a href="#cfw-shipping-method" class="cfw-primary-btn cfw-next-tab"><?php esc_html_e('Continue to shipping method', 'checkout-wc'); ?></a>
                                <?php else: ?>
                                    <a href="#cfw-payment-method" class="cfw-primary-btn cfw-next-tab"><?php esc_html_e('Continue to payment method', 'checkout-wc'); ?></a>
                                <?php endif; ?>
                            </div>

	                        <?php do_action('cfw_checkout_after_customer_info_tab'); ?>
                        </div>

                        <!-- Shipping Method Panel -->
                        <div id="cfw-shipping-method" class="cfw-panel" style="<?php echo (!WC()->cart->needs_shipping_address()) ? "display: none" : ""; ?>">
	                        <?php do_action('cfw_checkout_before_shipping_method_tab'); ?>

                            <div id="cfw-shipping-details" class="cfw-module">
                                <h3 class="cfw-module-title">
                                    <?php echo apply_filters('cfw_shipping_address_recap_heading', esc_html__( 'Shipping address', 'checkout-wc' ) ); ?>
                                </h3>

                                <div id="cfw-shipping-details-fields">
                                    <?php cfw_get_shipping_details($checkout); ?>
                                </div>

                                <div>
                                    <a href="#cfw-customer-info" class="cfw-link"><?php esc_html_e( 'Edit shipping address', 'checkout-wc' ); ?></a>
                                </div>
                            </div>

	                        <?php do_action('cfw_checkout_before_shipping_methods'); ?>

                            <?php if ( WC()->cart->needs_shipping() && WC()->cart->show_shipping() ) : ?>
                                <div id="cfw-shipping-method" class="cfw-module">
                                    <h3 class="cfw-module-title">
                                        <?php echo apply_filters('cfw_shipping_method_heading', esc_html__( 'Shipping method', 'checkout-wc' ) ); ?>
                                    </h3>
                                    <span><?php esc_html_e( 'Select a shipping method:', 'checkout-wc' ); ?></span>
                                    <div>
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
                                        <span class="cfw-small"><?php esc_html_e( 'All transactions are secure and encrypted. Credit card information is never stored on our servers.', 'checkout-wc' ); ?></span>
                                    </div>

                                    <div class="cfw-payment-methods-wrap">
                                        <?php cfw_get_payment_methods_html(); ?>
                                    </div>
                                </div>

                                <div class="cfw-no-payment-method-wrap">
                                    <span class="cfw-small"><?php echo apply_filters('cfw_no_payment_required_text', esc_html__('Your order is free. No payment is required.', 'checkout-wc') ); ?></span>
                                </div>

	                            <?php do_action('cfw_checkout_after_payment_methods'); ?>
                            </div>

                            <?php if ( WC()->cart->needs_shipping_address() ): ?>
                                <div id="cfw-shipping-same-billing" class="cfw-module">
                                    <ul class="cfw-radio-reveal-group">
                                        <li class="cfw-radio-reveal-li cfw-no-reveal">
                                            <div class="cfw-radio-reveal-title-wrap">
                                                <label class="cfw-radio-reveal-title-wrap cfw-radio-reveal-label">
                                                    <input type="radio" name="shipping_same" id="shipping_same_as_billing" value="0" class="garlic-auto-save" checked />
                                                    <span class="cfw-radio-reveal-title"><?php esc_html_e( 'Same as shipping address', 'checkout-wc' ); ?></span>
                                                </label>
                                            </div>
                                        </li>
                                        <li class="cfw-radio-reveal-li">
                                            <div class="cfw-radio-reveal-title-wrap">
                                                <label class="cfw-radio-reveal-label">
                                                    <input type="radio" name="shipping_same" id="shipping_dif_from_billing" value="1" class="garlic-auto-save" />
                                                    <span class="cfw-radio-reveal-title"><?php esc_html_e( 'Use a different billing address', 'checkout-wc' ); ?></span>
                                                </label>
                                            </div>
                                            <div class="cfw-radio-reveal-content-wrap" style="display: none">
                                                <div id="cfw-billing-fields-container" class="cfw-radio-reveal-content">
                                                    <?php cfw_get_billing_checkout_fields($checkout); ?>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            <?php endif; ?>

	                        <?php do_action('cfw_checkout_before_payment_method_terms_checkbox'); ?>

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
                                    <a id="cfw-complete-order-button" href="javascript:;" class="cfw-primary-btn cfw-next-tab validate"><?php esc_html_e( 'Complete Order', 'checkout-wc' ); ?></a>
                                </div>
                            </div>

	                        <?php do_action('cfw_checkout_after_payment_methods_tab'); ?>
                        </div>
                    </div>

                    <?php wp_nonce_field( 'woocommerce-process_checkout' ); ?>
                </form>
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
                            <div id="cfw-cart-shipping-total" class="cfw-flex-row cfw-flex-justify">
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
                            <?php if($cart->get_cart_tax() != ""): ?>
                            <div id="cfw-cart-taxes" class="cfw-flex-row cfw-flex-justify">
                                <span class="type"><?php esc_html_e('Taxes', 'checkout-wc'); ?></span>
                                <span class="amount"><?php echo $cart->get_cart_tax(); ?></span>
                            </div>
                            <?php endif; ?>

                            <div class="cfw-totals-total">
                                <div id="cfw-cart-total" class="cfw-flex-row cfw-flex-justify">
                                    <span class="type"><?php esc_html_e('Total', 'checkout-wc'); ?></span>
                                    <span class="amount"><?php echo $cart->get_total(); ?></span>
                                </div>
                            </div>
                        </div>

                        <div class="cfw-other-totals">
                            <table>
	                        <?php do_action( 'woocommerce_review_order_after_order_total' ); ?>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	    <?php endif; ?>
    </div>
</main>
