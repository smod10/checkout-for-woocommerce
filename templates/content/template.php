<?php
    if ( ! defined( 'ABSPATH' ) ) {
        exit; // Exit if accessed directly
    }
?>
<main id="cfw-content">
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

                    <form id="cfw-checkout-form" data-persist="garlic" method="POST">

                        <!-- Customer Info Panel -->
                        <div id="cfw-customer-info">

                            <div id="cfw-login-details" class="cfw-module">
                                <h3 class="cfw-module-title">Customer Information</h3>

                                <?php if(!is_user_logged_in()): ?>
                                <div class="cfw-have-acc-text cfw-small">
                                    <span>
                                        <?php echo __('Already have an account with us?', 'checkout-woocommerce'); ?>
                                    </span>
                                    <a id="cfw-ci-login" class="cfw-link" href="#cfw-customer-info">
                                        <?php echo __('Log in', 'checkout-woocommerce'); ?>
                                    </a>
                                </div>

                                <div id="" class="cfw-input-container">
                                    <div id="cfw-email-wrap" class="cfw-input-wrap cfw-text-input">
                                        <label class="cfw-input-label" for="cfw-email">Email</label>
                                        <input type="text" name="cfw-email" id="cfw-email" autocomplete="email" size="30" title="Email" placeholder="Email" class="required" value="">
                                    </div>
                                    <div id="cfw-login-slide">
                                        <div id="cfw-password-wrap" class="cfw-input-wrap cfw-password-input">
                                            <label class="cfw-input-label" for="cfw-email">Password</label>
                                            <input type="password" name="cfw-password" id="cfw-password" autocomplete="off" title="Password" placeholder="Password" class="required">
                                        </div>
                                        <div class="cfw-input-wrap cfw-button-input">
                                            <input type="button" name="cfw-login-btn" id="cfw-login-btn" value="Login" />
                                        </div>
                                    </div>
                                    <div class="cfw-input-wrap cfw-check-input">
                                        <input type="checkbox" id="cfw-acc-register-chk" name="cfw-acc-register-chk" />
                                        <label class="cfw-small" for="cfw-acc-register-chk">Create a <?php echo get_bloginfo('name'); ?> shopping account.</label>
                                    </div>
                                </div>
                                <?php else: ?>
                                <div class="cfw-have-acc-text cfw-small">
                                    Welcome back <strong><?php echo wp_get_current_user()->display_name; ?></strong>
                                </div>
                                <?php endif; ?>
                            </div>

                            <div id="cfw-shipping-info" class="cfw-module">
                                <h3 class="cfw-module-title">Shipping Address</h3>

                                <div class="cfw-shipping-info-container">
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
                                    <?php $available_gateways = WC()->payment_gateways->get_available_payment_gateways(); ?>
                                    <?php if ( WC()->cart->needs_payment() ) : ?>
                                        <ul class="wc_payment_methods payment_methods methods">
                                            <?php
                                                if ( ! empty( $available_gateways ) ) {
                                                    foreach ( $available_gateways as $gateway ) {
                                                        wc_get_template( 'checkout/payment-method.php', array( 'gateway' => $gateway ) );
                                                    }
                                                } else {
                                                    echo '<li class="woocommerce-notice woocommerce-notice--info woocommerce-info">' . apply_filters( 'woocommerce_no_available_payment_methods_message', __( 'Sorry, it seems that there are no available payment methods for your location. Please contact us if you require assistance or wish to make alternate arrangements.', 'woocommerce' ) ) . '</li>';
                                                }
                                            ?>
                                        </ul>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <div id="cfw-payment-action" class="cfw-bottom-controls">
                                <div>
                                    <a href="#cfw-shipping-method" class="cfw-prev-tab" rel="0">« Return to shipping information</a>
                                </div>
                                <div>
                                    <a href="#" class="cfw-primary-btn cfw-next-tab" style="text-transform: uppercase;">Complete Order</a>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                <!-- Cart / Sidebar Column -->
                <div class="cfw-right-column cfw-column-5">
                    <div id="cfw-cart-list" class="cfw-module">
                    <?php
                        foreach ( $cart->get_cart() as $cart_item_key => $cart_item ):
                            $_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

                            if ( $_product && $_product->exists()  && $cart_item['quantity'] > 0  && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ):
                                $item_data = $cart_item['data'];

                                $item_thumb_url = wp_get_attachment_url( $item_data->get_image_id() );
                                $item_quantity = $cart_item['quantity'];
                                $item_title = $item_data->get_title();
                                $item_url = get_permalink( $cart_item['product_id'] );
                                $item_subtotal = $cart->get_product_subtotal($_product, $cart_item['quantity']);

                                ?>
                                <div class="cfw-cart-row cfw-container cfw-collapse">
                                    <div class="cfw-cart-item-image cfw-cart-item-col cfw-column-2">
                                        <img src="<?php echo $item_thumb_url; ?>" />
                                    </div>
                                    <div class="cfw-cart-item-title-quantity cfw-cart-item-col cfw-column-7">
                                        <a href="<?php echo $item_url; ?>" class="cfw-link"><?php echo $item_title; ?></a> x <strong><?php echo $item_quantity; ?></strong>
                                    </div>
                                    <div class="cfw-cart-item-subtotal cfw-cart-item-col cfw-column-3">
                                        <?php echo $item_subtotal; ?>
                                    </div>
                                </div>
                                <?php
                            endif;
                        endforeach;
                    ?>
                    </div>

                    <div id="cfw-deductors-list" class="cfw-module">
                        <div class="cfw-sg-container cfw-gc-row cfw-input-wrap-row">
                            <div class="cfw-column-8">
                                <div class="cfw-input-wrap cfw-text-input">
                                    <input type="text" name="cfw-gift-card" id="cfw-gift-card" size="30" title="Enter Gift Card" placeholder="Enter Gift Card" class="required">
                                </div>
                            </div>
                            <div class="cfw-column-4">
                                <div class="cfw-input-wrap cfw-button-input">
                                    <input type="button" name="cfw-gift-card-btn" id="cfw-gift-card-btn" class="cfw-def-action-btn" value="Apply" />
                                </div>
                            </div>
                        </div>
                        <div class="cfw-sg-container cfw-promo-row cfw-input-wrap-row">
                            <div class="cfw-column-8">
                                <div class="cfw-input-wrap cfw-text-input">
                                    <input type="text" name="cfw-promo-code" id="cfw-promo-code" size="30" title="Enter Promo Code" placeholder="Enter Promo Code" class="required">
                                </div>
                            </div>
                            <div class="cfw-column-4">
                                <div class="cfw-input-wrap cfw-button-input">
                                    <input type="button" name="cfw-promo-code-btn" id="cfw-promo-code-btn" class="cfw-def-action-btn" value="Apply" />
                                </div>
                            </div>
                        </div>
                        <div class="cfw-sg-container cfw-extra-desc-row cfw-input-wrap-row">
                            <div class="cfw-column-12">
                                <span>Have a catalog source code? Enter it here for free ground shipping.</span>
                            </div>
                        </div>
                    </div>

                    <div id="cfw-totals-list" class="cfw-module">
                        <div class="cfw-totals-normal">
                            <div class="cfw-flex-row cfw-flex-justify">
                                <span class="type">Subtotal</span>
                                <span class="amount"><?php echo $cart->get_cart_subtotal(); ?></span>
                            </div>
                            <div id="cfw-cart-shipping-total" class="cfw-flex-row cfw-flex-justify">
                                <span class="type">Shipping</span>
                                <span class="amount"><?php echo $cart->get_cart_shipping_total(); ?></span>
                            </div>
                            <?php if($cart->get_cart_tax() != ""): ?>
                            <div class="cfw-flex-row cfw-flex-justify">
                                <span class="type">Taxes</span>
                                <span class="amount"><?php echo $cart->get_cart_tax(); ?></span>
                            </div>
                            <?php endif; ?>
                        </div>
                        <div class="cfw-totals-total">
                            <div class="cfw-flex-row cfw-flex-justify">
                                <span class="type">Total</span>
                                <span class="amount"><?php echo $cart->get_total(); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>

	    <?php endif; ?>
    </div>
</main>
