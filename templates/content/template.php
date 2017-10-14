<?php
    if ( ! defined( 'ABSPATH' ) ) {
        exit; // Exit if accessed directly
    }
?>
<main id="cfw-content">
    <div class="overlay"></div>
    <div class="wrap">

        <div class="cfw-container">
            <div class="cfw-column-12">
                <div id="cfw-alert-container" class="cfw-alert">
                    <div class="message"></div>
                </div>
            </div>
        </div>

	    <?php if ( WC()->cart->is_empty() ): ?>

		    <?php wc_get_template( 'cart/cart-empty.php' ); ?>

	    <?php else: ?>

            <div id="cfw-main-container" class="cfw-container" customer="<?php echo $customer->get_id(); ?>">

                <!-- Easy Tab Container -->
                <div id="cfw-tab-container" class="cfw-left-column cfw-column-7 tab-container">

                    <ul id="cfw-breadcrumb" class="etabs">
                        <li class="tab">
                            <a href="#cfw-customer-info" class="cfw-small">Customer information</a>
                        </li>
                        <li class="tab">
                            <a href="#cfw-shipping-method" class="cfw-small">Shipping method</a>
                        </li>
                        <li class="tab">
                            <a href="#cfw-payment-method" class="cfw-small">Payment method</a>
                        </li>
                    </ul>

                    <form id="cfw-checkout-form" data-persist="garlic" class="woocommerce-checkout" method="POST" data-parsley-validate="">

                        <div id="order_review" class="woocommerce-checkout-review-order">
                            <!-- Customer Info Panel -->
                            <div id="cfw-customer-info">

                                <div id="cfw-login-details" class="cfw-module">
                                    <h3 class="cfw-module-title">Customer Information</h3>

                                    <?php do_action('cfw_checkout_before_customer_info'); ?>

                                    <?php if( ! is_user_logged_in() ): ?>
                                    <div class="cfw-have-acc-text cfw-small">
                                        <span>
                                            <?php echo __('Already have an account with us?', 'checkout-woocommerce'); ?>
                                        </span>
                                        <a id="cfw-ci-login" class="cfw-link" href="#cfw-customer-info">
                                            <?php echo __('Log in.', 'checkout-woocommerce'); ?>
                                        </a>
                                        <span>
                                            <?php echo __('Otherwise the information provided here will be used to create an account on checkout', 'checkout-woocommerce'); ?>
                                        </span>
                                    </div>

                                    <div id="" class="cfw-input-container">
                                        <div id="cfw-email-wrap" class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="cfw-email">Email</label>
                                            <input type="email" name="cfw-email" id="cfw-email" data-parsley-group="account" autocomplete="email" size="30" title="Email" placeholder="Email" class="garlic-auto-save" value="" required="" data-parsley-trigger="keyup">
                                        </div>
                                        <div id="cfw-login-slide">
                                            <div id="cfw-password-wrap" class="cfw-input-wrap cfw-password-input">
                                                <label class="cfw-input-label" for="cfw-email">Password</label>
                                                <input type="password" name="cfw-password" id="cfw-password" autocomplete="off" title="Password" placeholder="Password">
                                            </div>
                                            <div class="cfw-input-wrap cfw-button-input">
                                                <input type="button" name="cfw-login-btn" id="cfw-login-btn" value="Login" />
                                            </div>
                                        </div>
                                        <?php if(!WC()->checkout->is_registration_required()): ?>
                                        <div class="cfw-input-wrap cfw-check-input">
                                            <input type="checkbox" id="cfw-acc-register-chk" class="garlic-auto-save" name="cfw-acc-register-chk" />
                                            <label class="cfw-small" for="cfw-acc-register-chk">Create a <?php echo get_bloginfo('name'); ?> shopping account.</label>
                                        </div>
                                        <?php endif; ?>
                                    </div>
                                    <?php else: ?>
                                    <div class="cfw-have-acc-text cfw-small">
                                        Welcome back <strong><?php echo wp_get_current_user()->display_name; ?></strong>
                                    </div>
                                    <?php endif; ?>
                                </div>

                                <div id="cfw-shipping-info" class="cfw-module">
                                    <h3 class="cfw-module-title">Shipping Address</h3>

                                    <div class="cfw-shipping-info-container cfw-parsley-shipping-details">
                                        <?php cfw_get_shipping_checkout_fields($checkout); ?>
                                    </div>
                                </div>

                                <div id="cfw-shipping-info-action" class="cfw-bottom-controls">
                                    <a href="#cfw-shipping-method" class="cfw-primary-btn cfw-next-tab">Continue to shipping method</a>
                                </div>
                            </div>

                            <!-- Shipping Method Panel -->
                            <div id="cfw-shipping-method">

                                <div id="cfw-shipping-details" class="cfw-module">
                                    <h3 class="cfw-module-title">Shipping address</h3>

                                    <div id="cfw-shipping-details-fields">
                                        <?php cfw_get_shipping_details($checkout); ?>
                                    </div>

                                    <div>
                                        <a href="#cfw-customer-info" class="cfw-link">Edit shipping address</a>
                                    </div>
                                </div>

                                <?php if ( WC()->cart->needs_shipping() && WC()->cart->show_shipping() ) : ?>
                                    <div id="cfw-shipping-method" class="cfw-module">
                                        <h3 class="cfw-module-title">Shipping method</h3>
                                        <span>Select a shipping method:</span>
                                        <div>
                                            <?php cfw_cart_totals_shipping_html(); ?>
                                        </div>
                                    </div>
                                <?php endif; ?>

                                <div id="cfw-shipping-action" class="cfw-bottom-controls">
                                    <div>
                                        <a href="#cfw-customer-info" class="cfw-prev-tab" rel="0">« Return to customer information</a>
                                    </div>
                                    <div>
                                        <a href="#cfw-payment-method" class="cfw-primary-btn cfw-next-tab">Continue to payment method</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Method Panel -->
                            <div id="cfw-payment-method">

                            <div id="cfw-billing-methods" class="cfw-module">
                                <h3 class="cfw-module-title">Payment method</h3>
                                <div>
                                    <span class="cfw-small">All transactions are secure and encrypted. Credit card information is never stored on our servers.</span>
                                </div>
                                <div>
                                    <?php cfw_get_payment_methods_html(); ?>
                                </div>
                            </div>

                            <div id="cfw-shipping-same-billing" class="cfw-module">
                                <ul class="cfw-radio-reveal-group">
                                    <li class="cfw-radio-reveal-li cfw-no-reveal">
                                        <div class="cfw-radio-reveal-title-wrap">
                                            <label class="cfw-radio-reveal-title-wrap cfw-radio-reveal-label">
                                                <input type="radio" name="shipping_same" id="shipping_same_as_billing" value="0" class="garlic-auto-save" checked />
                                                <span class="cfw-radio-reveal-title">Same as shipping address</span>
                                            </label>
                                        </div>
                                    </li>
                                    <li class="cfw-radio-reveal-li">
                                        <div class="cfw-radio-reveal-title-wrap">
                                            <label class="cfw-radio-reveal-label">
                                                <input type="radio" name="shipping_same" id="shipping_dif_from_billing" value="1" class="garlic-auto-save" />
                                                <span class="cfw-radio-reveal-title">Use a different billing address</span>
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

                            <div id="cfw-payment-action" class="cfw-bottom-controls">
                                <div>
                                    <a href="#cfw-shipping-method" class="cfw-prev-tab" rel="0">« Return to shipping information</a>
                                </div>
                                <div>
                                    <a id="cfw-complete-order-button" href="javascript:;" class="cfw-primary-btn cfw-next-tab validate" style="text-transform: uppercase;">Complete Order</a>
                                </div>
                            </div>
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
                                <a href="javascript:;" class="cfw-link">Show order summary</a>
                                <svg id="cfw-cart-details-arrow" height="512px" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "/></svg>
                            </div>
                        </div>
                        <div class="cfw-column-4">
                            <span class="total">
                                <?php echo $cart->get_total(); ?>
                            </span>
                        </div>
                    </div>

                    <div id="cfw-cart-details-collapse-wrap">
                        <div id="cfw-cart-list" class="cfw-module">
                            <?php cfw_get_checkout_cart_html(); ?>
                        </div>

                        <div id="cfw-deductors-list" class="cfw-module">
                            <?php if(wc_coupons_enabled()): ?>
                            <div class="cfw-sg-container cfw-promo-row cfw-input-wrap-row">
                                <div class="cfw-column-8">
                                    <div class="cfw-input-wrap cfw-text-input">
                                        <input type="text" name="cfw-promo-code" id="cfw-promo-code" size="30" title="Enter Promo Code" placeholder="Enter Promo Code">
                                    </div>
                                </div>
                                <div class="cfw-column-4">
                                    <div class="cfw-input-wrap cfw-button-input">
                                        <input type="button" name="cfw-promo-code-btn" id="cfw-promo-code-btn" class="cfw-def-action-btn" value="Apply" />
                                    </div>
                                </div>
                            </div>
                            <?php endif; ?>
                        </div>

                        <div id="cfw-totals-list" class="cfw-module">
                            <div class="cfw-totals-normal">
                                <div id="cfw-cart-subtotal" class="cfw-flex-row cfw-flex-justify">
                                    <span class="type">Subtotal</span>
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
                                    <span class="type">Shipping</span>
                                    <span class="amount"><?php echo $cart->get_cart_shipping_total(); ?></span>
                                </div>
                                <?php if($cart->get_cart_tax() != ""): ?>
                                <div id="cfw-cart-taxes" class="cfw-flex-row cfw-flex-justify">
                                    <span class="type">Taxes</span>
                                    <span class="amount"><?php echo $cart->get_cart_tax(); ?></span>
                                </div>
                                <?php endif; ?>
                            </div>
                            <div class="cfw-totals-total">
                                <div id="cfw-cart-total" class="cfw-flex-row cfw-flex-justify">
                                    <span class="type">Total</span>
                                    <span class="amount"><?php echo $cart->get_total(); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>

	    <?php endif; ?>
    </div>
</main>
