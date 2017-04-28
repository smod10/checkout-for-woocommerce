<?php
    if ( ! defined( 'ABSPATH' ) ) {
        exit; // Exit if accessed directly
    }
?>
<main id="cfw-content">
    <div class="wrap">
        <div id="cfw-main-container" class="cfw-container">

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

                <form data-persist="garlic" method="POST">

                    <!-- Customer Info Panel -->
                    <div id="cfw-customer-info">
                        <div id="cfw-login-details" class="cfw-module">
                            <h3 class="cfw-module-title">Customer Information</h3>

                            <div class="cfw-have-acc-text cfw-small">
                                <span>
                                    <?php echo __('Already have an account with us?', 'checkout-woocommerce'); ?>
                                </span>
                                <a id="cfw-ci-login" class="cfw-link" href="#cfw-customer-info">
                                    <?php echo __('Log in', 'checkout-woocommerce'); ?>
                                </a>
                            </div>

                            <div class="cfw-input-container">
                                <div class="cfw-input-wrap cfw-text-input">
                                    <label class="cfw-input-label" for="cfw-email">Email</label>
                                    <input type="text" name="cfw-email" id="cfw-email" autocomplete="email" size="30" title="Email" placeholder="Email" class="required garlic-auto-save">
                                </div>
                                <div id="cfw-login-slide">
                                    <div class="cfw-input-wrap cfw-password-input">
                                        <label class="cfw-input-label" for="cfw-email">Password</label>
                                        <input type="password" name="cfw-password" id="cfw-password" autocomplete="off" size="30" title="Password" placeholder="Password" class="required">
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
                        </div>

                        <div id="cfw-billing-details" class="cfw-module">
                            <h3 class="cfw-module-title">Billing Address</h3>

                            <div class="cfw-billing-container">
                                <div class="cfw-sg-container cfw-input-wrap-row">
                                    <div class="cfw-column-6">
                                        <div class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="cfw-first-name">First name</label>
                                            <input type="text" name="cfw-first-name" id="cfw-first-name" autocomplete="given-name" size="30" title="First name" placeholder="First name" class="required garlic-auto-save">
                                        </div>
                                    </div>
                                    <div class="cfw-column-6">
                                        <div class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="cfw-last-name">Last name</label>
                                            <input type="text" name="cfw-last-name" id="cfw-last-name" autocomplete="family-name" size="30" title="Last name" placeholder="Last name" class="required garlic-auto-save">
                                        </div>
                                    </div>
                                </div>
                                <div class="cfw-sg-container cfw-input-wrap-row">
                                    <div class="cfw-column-8">
                                        <div class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="cfw-address1">Address</label>
                                            <input type="text" name="cfw-address1" id="cfw-address1" autocomplete="billing address-line1" size="30" title="Address" placeholder="Address" class="required garlic-auto-save">
                                        </div>
                                    </div>
                                    <div class="cfw-column-4">
                                        <div class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="cfw-address2">Apt, suite, etc. (optional)</label>
                                            <input type="text" name="cfw-address2" id="cfw-address2" autocomplete="billing address-line2" size="30" title="Apt, suite, etc. (optional)" placeholder="Apt, suite, etc. (optional)" class="required garlic-auto-save">
                                        </div>
                                    </div>
                                </div>
                                <div class="cfw-sg-container cfw-input-wrap-row">
                                    <div class="cfw-column-12">
                                        <div class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="cfw-city">City</label>
                                            <input type="text" name="cfw-city" id="cfw-city" autocomplete="billing address-level2" size="30" title="City" placeholder="City" class="required garlic-auto-save">
                                        </div>
                                    </div>
                                </div>
                                <div class="cfw-sg-container cfw-input-wrap-row">
                                    <div class="cfw-column-12">
                                        <div class="cfw-input-wrap cfw-text-input">
                                            <label class="cfw-input-label" for="cfw-phone">Phone (required by UPS)</label>
                                            <input type="text" name="cfw-phone" id="cfw-phone" autocomplete="billing tel" size="30" title="Phone (required by UPS)" placeholder="Phone (required by UPS)" class="required garlic-auto-save">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="cfw-billing-action" class="cfw-bottom-controls">
                            <a href="#cfw-shipping-method" class="cfw-primary-btn cfw-next-tab">Continue to shipping method</a>
                        </div>
                    </div>

                    <!-- Shipping Method Panel -->
                    <div id="cfw-shipping-method">
                        <div id="cfw-shipping-details" class="cfw-module">
                            <h3 class="cfw-module-title">Shipping address</h3>

                            <div>
                                [Content]
                            </div>
                        </div>

                        <div id="cfw-shipping-method" class="cfw-module">
                            <h3 class="cfw-module-title">Shipping method</h3>
                            <div>
                                <?php if ( 1 < count( $available_methods ) ) : ?>
                                    <ul id="shipping_method">
                                        <?php foreach ( $available_methods as $method ) : ?>
                                            <li>
                                                <?php
                                                printf( '<input type="radio" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d_%2$s" value="%3$s" class="shipping_method" %4$s />
                                    <label for="shipping_method_%1$d_%2$s">%5$s</label>',
                                                    $index, sanitize_title( $method->id ), esc_attr( $method->id ), checked( $method->id, $chosen_method, false ), wc_cart_totals_shipping_method_label( $method ) );
                                                do_action( 'woocommerce_after_shipping_rate', $method, $index );
                                                ?>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                <?php elseif ( 1 === count( $available_methods ) ) :  ?>
                                    <?php
                                    $method = current( $available_methods );
                                    printf( '%3$s <input type="hidden" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d" value="%2$s" class="shipping_method" />', $index, esc_attr( $method->id ), wc_cart_totals_shipping_method_label( $method ) );
                                    do_action( 'woocommerce_after_shipping_rate', $method, $index );
                                    ?>
                                <?php elseif ( ! WC()->customer->has_calculated_shipping() ) : ?>
                                    <?php echo wpautop( __( 'Shipping costs will be calculated once you have provided your address.', 'woocommerce' ) ); ?>
                                <?php else : ?>
                                    <?php echo apply_filters( is_cart() ? 'woocommerce_cart_no_shipping_available_html' : 'woocommerce_no_shipping_available_html', wpautop( __( 'There are no shipping methods available. Please double check your address, or contact us if you need any help.', 'woocommerce' ) ) ); ?>
                                <?php endif; ?>

                                <?php if ( $show_package_details ) : ?>
                                    <?php echo '<p class="woocommerce-shipping-contents"><small>' . esc_html( $package_details ) . '</small></p>'; ?>
                                <?php endif; ?>

                                <?php if ( ! empty( $show_shipping_calculator ) ) : ?>
                                    <?php woocommerce_shipping_calculator(); ?>
                                <?php endif; ?>
                            </div>
                        </div>

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
                        <div class="cfw-flex-row cfw-flex-justify">
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
    </div>
</main>
