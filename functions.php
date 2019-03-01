<?php

if ( ! function_exists( 'woocommerce_form_field' ) ) {

    function cfw_extra_account_fields() {
        ?>
        <div id="cfw-first-for-plugins" class="cfw-input-wrap cfw-text-input">
            <label class="cfw-input-label" for="billing_first_name"><?php esc_html_e('First Name', 'checkout-wc'); ?></label>
            <input type="text" name="billing_first_name" id="billing_first_name" data-parsley-group="billing" autocomplete="given-name" autofocus="autofocus" size="30" title="First Name" placeholder="First Name" class="garlic-auto-save" value="" required="" data-parsley-trigger="keyup">
        </div>

        <div id="cfw-last-for-plugins" class="cfw-input-wrap cfw-text-input">
            <label class="cfw-input-label" for="billing_last_name"><?php esc_html_e('Last Name', 'checkout-wc'); ?></label>
            <input type="text" name="billing_last_name" id="billing_last_name" data-parsley-group="shipping" autocomplete="family-name" autofocus="autofocus" size="30" title="Last Name" placeholder="Last Name" class="garlic-auto-save" value="" required="" data-parsley-trigger="keyup">
        </div>
        <?php
    }

	/**
	 * Outputs a checkout/address form field.
	 *
	 * @subpackage	Forms
	 * @param string $key
	 * @param mixed $args
	 * @param string $value (default: null)
	 * @return $field
	 */
	function cfw_form_field( $key, $args, $value = null ) {
		$defaults = array(
			'type'              => 'text',
			'label'             => '',
			'description'       => '',
			'placeholder'       => '',
			'maxlength'         => false,
			'required'          => false,
			'autocomplete'      => false,
			'id'                => $key,
			'class'             => array(),
			'label_class'       => array(),
			'input_class'       => array(),
			'return'            => false,
			'options'           => array(),
			'custom_attributes' => array(),
			'validate'          => array(),
			'default'           => '',
			'autofocus'         => '',
			'priority'          => '',
			'wrap'              => ''
		);
		$key_sans_type = cfw_strip_key_type($key);
		$ship_or_bill_key = explode("_", $key)[0];

		$args = wp_parse_args( $args, $defaults );
		$args = apply_filters( 'woocommerce_form_field_args', $args, $key, $value );
		$args['custom_attributes']["data-parsley-group"] = $ship_or_bill_key;

		if ( $args['required'] ) {
			$args['class'][] = 'validate-required';
			$required = ' <abbr class="required" title="' . cfw_esc_attr__( 'required', 'woocommerce' ) . '">*</abbr>';
		} else {
			$required = '';
		}

		if ( is_string( $args['label_class'] ) ) {
			$args['label_class'] = array( $args['label_class'] );
		}

		if ( is_null( $value ) ) {
			$value = $args['default'];
		}

		// Custom attribute handling
		$custom_attributes         = array();
		$args['custom_attributes'] = array_filter( (array) $args['custom_attributes'], 'strlen' );

		if ( $args['maxlength'] ) {
			$args['custom_attributes']['maxlength'] = absint( $args['maxlength'] );
		}

		if ( ! empty( $args['autocomplete'] ) ) {
			$args['custom_attributes']['autocomplete'] = $args['autocomplete'];
		}

		if ( true === $args['autofocus'] ) {
			$args['custom_attributes']['autofocus'] = 'autofocus';
		}

		if ( ! empty( $args['custom_attributes'] ) && is_array( $args['custom_attributes'] ) ) {
			foreach ( $args['custom_attributes'] as $attribute => $attribute_value ) {
				$custom_attributes[] = esc_attr( $attribute ) . '="' . esc_attr( $attribute_value ) . '"';
			}
		}

		if ( ! empty( $args['validate'] ) ) {
			foreach ( $args['validate'] as $validate ) {
				$args['class'][] = 'validate-' . $validate;
			}
		}

		$field           = '';
		$label_id        = $args['id'];
		$sort            = $args['priority'] ? $args['priority'] : '';
		$field_container_start = '';

		if( isset($args['wrap']) && !empty($args['wrap']) ) {
			$field_container_start = $args['wrap']->start . $args['wrap']->end;
		}

		$parsleyOut = "";

		if($args['required']) {
		    $parsleyOut = 'required=""';
        }

		switch ( $args['type'] ) {
			case 'country' :

				$countries = 'shipping_country' === $key ? WC()->countries->get_shipping_countries() : WC()->countries->get_allowed_countries();

				$field = '<select field_key="' . $key_sans_type . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="country_to_state country_select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . $parsleyOut .  '>' . '<option value="">' . cfw_esc_html__( 'Select a country&hellip;', 'woocommerce' ) . '</option>';

				foreach ( $countries as $ckey => $cvalue ) {
					$field .= '<option value="' . esc_attr( $ckey ) . '" ' . selected( $value, $ckey, false ) . '>' . $cvalue . '</option>';
				}

				$field .= '</select>';

				$field .= '<noscript><input type="submit" name="woocommerce_checkout_update_totals" value="' . cfw_esc_attr__( 'Update country', 'woocommerce' ) . '" /></noscript>';

				break;
			case 'state' :

				/* Get Country */
				$country_key = 'billing_state' === $key ? 'billing_country' : 'shipping_country';
				$current_cc  = WC()->checkout->get_value( $country_key );
				$states      = WC()->countries->get_states( $current_cc );

				if ( is_array( $states ) && empty( $states ) ) {

					$field_container_start = '<div class="cfw-column-4 address-field %1$s" id="%2$s"><div class="cfw-input-wrap">%3$s</div></div>';

					$field .= '<input type="hidden" field_key="' . $key_sans_type . '" class="hidden" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="" ' . implode( ' ', $custom_attributes ) . ' placeholder="' . esc_attr( $args['placeholder'] ) . '" />';

				} elseif ( ! is_null( $current_cc ) && is_array( $states ) ) {

					$field .= '<select field_key="' . $key_sans_type . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="state_select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . $parsleyOut . ' data-placeholder="' . esc_attr( $args['placeholder'] ) . '">
						<option value="">' . cfw_esc_html__( 'Select a state&hellip;', 'woocommerce' ) . '</option>';

					foreach ( $states as $ckey => $cvalue ) {
						$field .= '<option value="' . esc_attr( $ckey ) . '" ' . selected( $value, $ckey, false ) . '>' . $cvalue . '</option>';
					}

					$field .= '</select>';

				} else {

					$field .= '<input ' . $parsleyOut . ' field_key="' . $key_sans_type . '" type="text" class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" value="' . esc_attr( $value ) . '"  placeholder="' . esc_attr( $args['placeholder'] ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" ' . implode( ' ', $custom_attributes ) . ' />';

				}

				break;
			case 'textarea' :

				$field .= '<textarea name="' . esc_attr( $key ) . '" class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" id="' . esc_attr( $args['id'] ) . '" placeholder="' . esc_attr( $args['placeholder'] ) . '" ' . ( empty( $args['custom_attributes']['rows'] ) ? ' rows="2"' : '' ) . ( empty( $args['custom_attributes']['cols'] ) ? ' cols="5"' : '' ) . implode( ' ', $custom_attributes ) . $parsleyOut . '>' . esc_textarea( $value ) . '</textarea>';

				break;
			case 'checkbox' :

				$field = '<label class="checkbox ' . implode( ' ', $args['label_class'] ) . '" ' . implode( ' ', $custom_attributes ) . '>
						<input type="' . esc_attr( $args['type'] ) . '" class="input-checkbox ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="1" ' . checked( $value, 1, false ) . ' /> '
				         . $args['label'] . $required . '</label>';

				break;
			case 'password' :
			case 'text' :
			case 'email' :
			case 'tel' :
			case 'number' :
				$field .= '<input type="' . esc_attr( $args['type'] ) . '" field_key="' . $key_sans_type . '" class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" placeholder="' . esc_attr( $args['placeholder'] ) . '"  value="' . esc_attr( $value ) . '" ' . implode( ' ', $custom_attributes ) . $parsleyOut . ' />';

				break;
			case 'select' :

				$options = $field = '';

				if ( ! empty( $args['options'] ) ) {
					foreach ( $args['options'] as $option_key => $option_text ) {
						if ( '' === $option_key ) {
							// If we have a blank option, select2 needs a placeholder
							if ( empty( $args['placeholder'] ) ) {
								$args['placeholder'] = $option_text ? $option_text : cfw__( 'Choose an option', 'woocommerce' );
							}
							$custom_attributes[] = 'data-allow_clear="true"';
						}
						$options .= '<option value="' . esc_attr( $option_key ) . '" ' . selected( $value, $option_key, false ) . '>' . esc_attr( $option_text ) . '</option>';
					}

					$field .= '<select field_key="' . $key_sans_type . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . ' data-placeholder="' . esc_attr( $args['placeholder'] ) . $parsleyOut . '">
							' . $options . '
						</select>';
				}

				break;
			case 'radio' :

				$label_id = current( array_keys( $args['options'] ) );

				if ( ! empty( $args['options'] ) ) {
				    $count = 0;
					foreach ( $args['options'] as $option_key => $option_text ) {
					    if($count == 0 ) {
						    $field .= '<input type="radio" class="input-radio ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" value="' . esc_attr( $option_key ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '_' . esc_attr( $option_key ) . '"' . checked( $value, $option_key, false ) . $parsleyOut . ' />';
                        } else {
						    $field .= '<input type="radio" class="input-radio ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" value="' . esc_attr( $option_key ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '_' . esc_attr( $option_key ) . '"' . checked( $value, $option_key, false ) . ' />';
                        }
						$field .= '<label for="' . esc_attr( $args['id'] ) . '_' . esc_attr( $option_key ) . '" class="radio ' . implode( ' ', $args['label_class'] ) . '">' . $option_text . '</label>';

						$count++;
					}
				}

				break;
		}

		if ( ! empty( $field ) ) {

			$field_html = '';

			if ( $args['label'] != "Order notes" ) {
				if ( $args['label'] && 'checkbox' != $args['type'] ) {
					$field_html .= '<label for="' . esc_attr( $label_id ) . '" class="' . esc_attr( implode( ' ', $args['label_class'] ) ) . '">' . $args['label'] . $required . '</label>';
				}

                $field_html .= $field;

    //			if ( $args['description'] ) {
    //				$field_html .= '<span class="description">' . esc_html( $args['description'] ) . '</span>';
    //			}

                $container_class = esc_attr( implode( ' ', $args['class'] ) );
                $container_id    = esc_attr( $args['id'] ) . '_field';
                $row_wrap = '';


                if( isset($args['start']) && $args['start'] ) {
                    $row_wrap = '<div class="cfw-sg-container cfw-input-wrap-row form-row">';
                }

				$row_wrap = apply_filters( 'cfw_input_row_wrap', $row_wrap, $key, $args, $value );

                $field = $row_wrap . sprintf( $field_container_start, $container_class, $container_id, $field_html );

                if( isset($args['end']) && $args['end'] ) {
                    $field .= "</div>";
                }

			} else {
				$field_html .= '<h3 class="cfw-module-title">' . $args['label'] . '</h3>';
				$field_html .= $field;
				$field = $field_html;
			}
		}

		$field = apply_filters( 'woocommerce_form_field_' . $args['type'], $field, $key, $args, $value );

		if ( $args['return'] ) {
			return $field;
		} else {
			echo $field;
		}
	}

	function cfw_strip_key_type($key) {
		$key_exp = explode("_", $key);
		$key_sans_type = implode("_", array_slice($key_exp, 1, count($key_exp)-1, true));

		return $key_sans_type;
	}

	function cfw_get_shipping_checkout_fields($checkout) {
	    $shipping_checkout_fields = apply_filters('cfw_get_shipping_checkout_fields', $checkout->get_checkout_fields( 'shipping' ) );

		foreach ( $shipping_checkout_fields as $key => $field ) {
			cfw_form_field( $key, $field, $checkout->get_value( $key ) );
		}
	}

	function cfw_get_billing_checkout_fields($checkout) {
	    $billing_checkout_fields = apply_filters('cfw_get_billing_checkout_fields', $checkout->get_checkout_fields( 'billing' ) );

		foreach ( $billing_checkout_fields as $key => $field ) {
			cfw_form_field( $key, $field, $checkout->get_value( $key ) );
		}
	}

	function cfw_get_shipping_details( $checkout ) {
        return WC()->countries->get_formatted_address(
	        array(
		        'first_name' => $checkout->get_value( 'shipping_first_name' ),
		        'last_name'  => $checkout->get_value( 'shipping_last_name' ),
		        'company'    => $checkout->get_value( 'shipping_company' ),
		        'address_1'  => $checkout->get_value( 'shipping_address_1' ),
		        'address_2'  => $checkout->get_value( 'shipping_address_2' ),
		        'city'       => $checkout->get_value( 'shipping_city' ),
		        'state'      => $checkout->get_value( 'shipping_state' ),
		        'postcode'   => $checkout->get_value( 'shipping_postcode' ),
		        'country'    => $checkout->get_value( 'shipping_country' ),
	        )
        );
	}

	/**
	 * Trim white space and commas off a line.
	 *
	 * @param  string $line Line.
	 * @return string
	 */
	function cfw_trim_formatted_address_line( $line ) {
		return trim( $line, ', ' );
	}

	function cfw_cart_totals_shipping_html() {
		$packages = WC()->shipping->get_packages();

		foreach ( $packages as $i => $package ) {
			$chosen_method = isset( WC()->session->chosen_shipping_methods[ $i ] ) ? WC()->session->chosen_shipping_methods[ $i ] : '';
			$product_names = array();

			if ( sizeof( $packages ) > 1 ) {
				foreach ( $package['contents'] as $item_id => $values ) {
					$product_names[ $item_id ] = $values['data']->get_name() . ' &times;' . $values['quantity'];
				}
				$product_names = apply_filters( 'woocommerce_shipping_package_details_array', $product_names, $package );
			}

			$available_methods = $package['rates'];
			$show_package_details = sizeof($packages) > 1;
			$package_details = implode(', ', $product_names);
			$package_name = apply_filters( 'woocommerce_shipping_package_name', sprintf( cfw_nx( 'Shipping', 'Shipping %d', ( $i + 1 ), 'shipping packages', 'woocommerce' ), ( $i + 1 ) ), $i, $package );
			$index = $i;

			// Next section ripped straight from cart-shipping and edited for now
			?>

			<?php if ( count( $available_methods ) > 0  ) : ?>
				<?php if ( 1 < count( $packages ) ) : ?>
                <h4 class="cfw-shipping-package-title"><?php echo $package_name; ?></h4>
                <?php endif; ?>
				<ul class="cfw-shipping-methods-list">
					<?php foreach ( $available_methods as $method ) :
						ob_start();
						do_action( 'woocommerce_after_shipping_rate', $method, $index );
						$after_shipping_method = ob_get_clean();
                        ?>
						<li>
							<?php
							printf( '<label for="shipping_method_%1$d_%2$s"><input type="radio" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d_%2$s" value="%3$s" class="shipping_method" %4$s /> %5$s %6$s</label>', $index, sanitize_title( $method->id ), esc_attr( $method->id ),
								checked( $method->id, $chosen_method, false ), wc_cart_totals_shipping_method_label( $method ), $after_shipping_method );
							?>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php else : ?>
                <div class="shipping-message">
				    <?php echo apply_filters('woocommerce_no_shipping_available_html', wpautop( cfw__( 'There are no shipping methods available. Please double check your address, or contact us if you need any help.', 'woocommerce' ) ) ); ?>
                </div>
			<?php endif; ?>

			<?php if ( $show_package_details ) : ?>
				<?php echo '<p class="woocommerce-shipping-contents"><small>' . esc_html( $package_details ) . '</small></p>'; ?>
			<?php endif; ?>
		<?php
		}
	}

	function cfw_get_payment_methods_html() {
		$available_gateways = WC()->payment_gateways->get_available_payment_gateways();
		$current_gateway    = WC()->session->get( 'chosen_payment_method' );
        ob_start();

		?><ul class="wc_payment_methods payment_methods methods cfw-radio-reveal-group"><?php
		if ( ! empty( $available_gateways ) ) {
			$count = 0;
			foreach ( $available_gateways as $gateway ) {
				if ( apply_filters( "cfw_show_gateway_{$gateway->id}", true ) ):
					?>

                    <li class="wc_payment_method payment_method_<?php echo $gateway->id; ?> cfw-radio-reveal-li">
                        <div class="payment_method_title_wrap cfw-radio-reveal-title-wrap">
                            <label class="payment_method_label cfw-radio-reveal-label" for="payment_method_<?php echo $gateway->id; ?>">
                                <input id="payment_method_<?php echo $gateway->id; ?>" type="radio" class="input-radio" name="payment_method" value="<?php echo esc_attr( $gateway->id ); ?>" <?php echo ( ( empty($current_gateway) && $count == 0 ) || $current_gateway === $gateway->id ) ? "checked='checked'" : ""; ?> data-order_button_text="<?php echo esc_attr( $gateway->order_button_text ); ?>" />
                                <span class="payment_method_title cfw-radio-reveal-title"><?php echo $gateway->get_title(); ?></span>
                            </label>

                            <span class="payment_method_icons">
                            <?php echo $gateway->get_icon(); ?>
                        </span>
                        </div>
						<?php if ( apply_filters("cfw_payment_gateway_{$gateway->id}_content", $gateway->has_fields() || $gateway->get_description() ) ) : ?>
                            <div class="payment_box_wrap cfw-radio-reveal-content-wrap" <?php if ( ! $gateway->chosen ) : ?>style="display:none;"<?php endif; ?>>
                                <div class="payment_box payment_method_<?php echo $gateway->id; ?> cfw-radio-reveal-content">
									<?php
									ob_start();
									$gateway->payment_fields();

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
				else:
					do_action_ref_array( "cfw_payment_gateway_list_{$gateway->id}_alternate", array( $count ) );
				endif;

				$count++;
			}
		} else {
			echo '<li class="woocommerce-notice woocommerce-notice--info woocommerce-info">' . apply_filters( 'woocommerce_no_available_payment_methods_message', cfw__( 'Sorry, it seems that there are no available payment methods for your location. Please contact us if you require assistance or wish to make alternate arrangements.', 'woocommerce' ) ) . '</li>';
		}
		?></ul><?php

        return ob_get_clean();
    }

	function cfw_payment_methods_html() {
        echo cfw_get_payment_methods_html();
    }

    function cfw_cart_html() {
	    echo cfw_get_cart_html();
    }

	function cfw_get_cart_html() {
		$cart = WC()->cart;

		ob_start(); ?>
        <div id="cfw-cart-list" class="cfw-module">
        <?php foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			$_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

			if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
				$item_data = $cart_item['data'];

				$item_thumb_url = wp_get_attachment_url( $item_data->get_image_id() );
				$item_quantity  = $cart_item['quantity'];
				$item_title     = $item_data->get_name();
				$item_url       = get_permalink( $cart_item['product_id'] );
				$item_subtotal  = $cart->get_product_subtotal( $_product, $cart_item['quantity'] );
				/**
				 * If the product doesn't have an image increment the title and subtotal by half the image column size
				 * to accommodate the lack of an image
				 */
				$columns        = array(
					"image"     => 2,
					"title"     => 7 + ((!$item_thumb_url) ? 1 : 0),
					"subtotal"  => 3 + ((!$item_thumb_url) ? 1 : 0)
				);
				$column_base = "cfw-column-";
				?>
                <div class="cfw-cart-row cfw-sg-container cfw-collapse">
					<?php if($item_thumb_url): ?>
                        <div class="cfw-cart-item-image cfw-cart-item-col <?php echo "${column_base}${columns["image"]}"; ?>">
                            <img src="<?php echo $item_thumb_url; ?>"/>
                        </div>
					<?php endif; ?>
                    <div class="cfw-cart-item-title-quantity cfw-cart-item-col <?php echo "${column_base}${columns["title"]}"; ?>">
                        <div class="cfw-cart-item-title">
							<?php if ( apply_filters('cfw_link_cart_items', __return_false() ) ): ?>
                                <a target="_blank" href="<?php echo $item_url; ?>" class="cfw-link"><?php echo $item_title; ?></a> x
							<?php else: ?>
								<?php echo $item_title; ?> x
							<?php endif; ?>
                            <strong><?php echo $item_quantity; ?></strong>
                        </div>
						<?php echo cfw_get_formatted_cart_item_data( $cart_item ); ?>
                    </div>
                    <div class="cfw-cart-item-subtotal cfw-cart-item-col <?php echo "${column_base}${columns["subtotal"]}"; ?>">
						<?php echo $item_subtotal; ?>
                    </div>
                </div>
				<?php
			}
		}
		?>
        </div>
        <?php
		return ob_get_clean();
	}

    function cfw_get_checkout_cart_html() {
	    _deprecated_function( __FUNCTION__, '2.9.0', 'cfw_cart_html' );

	    $cart = WC()->cart;

        foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
	        $_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

	        if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
		        $item_data = $cart_item['data'];

		        $item_thumb_url = wp_get_attachment_url( $item_data->get_image_id() );
		        $item_quantity  = $cart_item['quantity'];
		        $item_title     = $item_data->get_name();
		        $item_url       = get_permalink( $cart_item['product_id'] );
		        $item_subtotal  = $cart->get_product_subtotal( $_product, $cart_item['quantity'] );
		        /**
                 * If the product doesn't have an image increment the title and subtotal by half the image column size
		         * to accommodate the lack of an image
		         */
                $columns        = array(
                    "image"     => 2,
                    "title"     => 7 + ((!$item_thumb_url) ? 1 : 0),
                    "subtotal"  => 3 + ((!$item_thumb_url) ? 1 : 0)
                );
                $column_base = "cfw-column-";
		        ?>
                <div class="cfw-cart-row cfw-sg-container cfw-collapse">
                    <?php if($item_thumb_url): ?>
                    <div class="cfw-cart-item-image cfw-cart-item-col <?php echo "${column_base}${columns["image"]}"; ?>">
                        <img src="<?php echo $item_thumb_url; ?>"/>
                    </div>
                    <?php endif; ?>
                    <div class="cfw-cart-item-title-quantity cfw-cart-item-col <?php echo "${column_base}${columns["title"]}"; ?>">
                        <div class="cfw-cart-item-title">
                            <?php if ( apply_filters('cfw_link_cart_items', __return_false() ) ): ?>
                                <a target="_blank" href="<?php echo $item_url; ?>" class="cfw-link"><?php echo $item_title; ?></a> x
                            <?php else: ?>
                               <?php echo $item_title; ?> x
                            <?php endif; ?>
                            <strong><?php echo $item_quantity; ?></strong>
                        </div>
	                    <?php echo cfw_get_formatted_cart_item_data( $cart_item ); ?>
                    </div>
                    <div class="cfw-cart-item-subtotal cfw-cart-item-col <?php echo "${column_base}${columns["subtotal"]}"; ?>">
				        <?php echo $item_subtotal; ?>
                    </div>
                </div>
		        <?php
	        }
        }
    }

    function cfw_address_class_wrap( $shipping = true ) {
	    $result = "woocommerce-billing-fields";

	    if ( $shipping === true ) {
	        $result = "woocommerce-shipping-fields";
        }

        echo $result;
    }

	function cfw_get_all_package_shipping_methods() {
		$packages = WC()->shipping->get_packages();
		$all_methods = [];

		foreach ( $packages as $i => $package ) {
			$available_methods = $package['rates'];

			if ( count( $available_methods ) > 0 ) {
			    foreach ( $available_methods as $available_method ) {
				    $all_methods[ $available_method->id ] = $available_method;
                }
            }
		}

		return $all_methods;
	}

    function cfw_get_shipping_total() {
	    $chosen_shipping_methods = WC()->session->get('chosen_shipping_methods');
	    $shipping_methods = cfw_get_all_package_shipping_methods();
	    $new_shipping_total = __( 'Not Calculated', 'checkout-wc' );

	    if ( WC()->customer->has_calculated_shipping() && is_array( $chosen_shipping_methods ) && $chosen_shipping_methods[ 0 ] !== false ) {
		    $new_shipping_total = WC()->cart->get_cart_shipping_total();
	    } else if ( WC()->customer->has_calculated_shipping() && is_array( $chosen_shipping_methods ) && $chosen_shipping_methods[ 0 ] === false ) {
		    $new_shipping_total = __( 'Not Available', 'checkout-wc' );
	    } else if ( ! WC()->customer->has_calculated_shipping() && ( is_array( $chosen_shipping_methods ) && $chosen_shipping_methods[ 0 ] === false ) && count( $shipping_methods ) == 0 ) {
		    $new_shipping_total = __( 'Not Calculated', 'checkout-wc' );
	    } else if ( count( $shipping_methods ) > 0 ) {
		    $new_shipping_total = WC()->cart->get_cart_shipping_total();
        }

	    return $new_shipping_total;
    }

    function cfw_get_place_order() {
	    ob_start();

	    $order_button_text = apply_filters( 'woocommerce_order_button_text', __( 'Complete Order', 'checkout-wc' ) );
	    ?>
        <div class="place-order" id="cfw-place-order">
            <?php do_action( 'woocommerce_review_order_before_submit' ); ?>

            <?php echo apply_filters( 'woocommerce_order_button_html', '<button type="submit" class="cfw-primary-btn cfw-next-tab validate" name="woocommerce_checkout_place_order" id="place_order" value="' . esc_attr( $order_button_text ) . '" data-value="' . esc_attr( $order_button_text ) . '">' . esc_html( $order_button_text ) . '</button>' ); // @codingStandardsIgnoreLine ?>

            <?php do_action( 'woocommerce_review_order_after_submit' ); ?>

            <?php wp_nonce_field( 'woocommerce-process_checkout', 'woocommerce-process-checkout-nonce' ); ?>
        </div>
        <?php
        return ob_get_clean();
    }

    function cfw_place_order() {
	    echo cfw_get_place_order();
    }

    function cfw_get_payment_methods() {
	    $payment_methods_html = cfw_get_payment_methods_html();

	    $payment_methods_fingerprint = cfw_get_payment_methods_html_fingerprint( $payment_methods_html );

	    ob_start();
	    ?>
        <div id="cfw-billing-methods" class="cfw-module">
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
					    <?php echo $payment_methods_html; ?>
                    </div>
                </div>
            </div>

            <div class="cfw-no-payment-method-wrap">
                <span class="cfw-small"><?php echo apply_filters('cfw_no_payment_required_text', esc_html__('Your order is free. No payment is required.', 'checkout-wc') ); ?></span>
            </div>

            <?php echo "<input type='hidden' id='cfw_payment_methods_fingerprint' name='cfw_payment_methods_fingerprint' value='{$payment_methods_fingerprint}' />"; ?>
		    <?php do_action('cfw_checkout_after_payment_methods'); ?>
        </div>
        <?php

        return ob_get_clean();
    }

    function cfw_get_payment_methods_html_fingerprint( $payment_methods_html, $strip = true ) {
	    if ( $strip ) {
	        // TODO: Move this into the compat classes with some magicness and a filter
            
	        // Stripe
		    $payment_methods_html = preg_replace( '/data-amount="[0-9]+"/', '', $payment_methods_html );

		    // Braintree
		    $payment_methods_html = preg_replace( '/<input type="hidden" name="wc-braintree-credit-card-3d-secure-order-total" value="[0-9]+\.?[0-9]+" \/>/', '', $payment_methods_html );
        }

	    return md5( $payment_methods_html );
    }

    function cfw_payment_methods() {
	    echo cfw_get_payment_methods();
    }

    function cfw_wc_print_notices() {
	    // Show non-cart errors
	    $wc_notices = wc_print_notices( $return = true );

	    if ( empty($wc_notices) ) return;

	    echo "<div id='cfw-wc-print-notices' class='cfw-alert cfw-alert-danger' style='display:block;'><div class='message'>$wc_notices</div></div>";
    }

    function cfw_billing_address_radio_group() {
	    ?>
        <div id="cfw-shipping-same-billing" class="cfw-module">
            <ul class="cfw-radio-reveal-group">
                <li class="cfw-radio-reveal-li cfw-no-reveal">
                    <div class="cfw-radio-reveal-title-wrap">
                        <label class="cfw-radio-reveal-title-wrap cfw-radio-reveal-label">
                            <input type="radio" name="ship_to_different_address" id="ship_to_different_address_as_billing" value="same_as_shipping" class="garlic-auto-save" checked />
                            <span class="cfw-radio-reveal-title"><?php esc_html_e( 'Same as shipping address', 'checkout-wc' ); ?></span>
                        </label>
                    </div>
                </li>
                <li class="cfw-radio-reveal-li">
                    <div class="cfw-radio-reveal-title-wrap">
                        <label class="cfw-radio-reveal-label">
                            <input type="radio" name="ship_to_different_address" id="shipping_dif_from_billing" value="different_from_shipping" class="garlic-auto-save" />
                            <span class="cfw-radio-reveal-title"><?php esc_html_e( 'Use a different billing address', 'checkout-wc' ); ?></span>
                        </label>
                    </div>
                    <div class="cfw-radio-reveal-content-wrap" style="display: none">
                        <div id="cfw-billing-fields-container" class="cfw-radio-reveal-content <?php cfw_address_class_wrap( false ); ?>">
						    <?php cfw_get_billing_checkout_fields( WC()->checkout() ); ?>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <?php
    }

	/**
	 * Gets and formats a list of cart item data + variations for display on the frontend.
	 *
	 * @since 3.3.0
	 * @param array $cart_item Cart item object.
	 * @param bool  $flat Should the data be returned flat or in a list.
	 * @return string
	 */
	function cfw_get_formatted_cart_item_data( $cart_item, $flat = false ) {
		$item_data = array();

		// Variation values are shown only if they are not found in the title as of 3.0.
		// This is because variation titles display the attributes.
		if ( $cart_item['data']->is_type( 'variation' ) && is_array( $cart_item['variation'] ) ) {
			foreach ( $cart_item['variation'] as $name => $value ) {
				$taxonomy = wc_attribute_taxonomy_name( str_replace( 'attribute_pa_', '', urldecode( $name ) ) );

				if ( taxonomy_exists( $taxonomy ) ) {
					// If this is a term slug, get the term's nice name.
					$term = get_term_by( 'slug', $value, $taxonomy );
					if ( ! is_wp_error( $term ) && $term && $term->name ) {
						$value = $term->name;
					}
					$label = wc_attribute_label( $taxonomy );
				} else {
					// If this is a custom option slug, get the options name.
					$value = apply_filters( 'woocommerce_variation_option_name', $value );
					$label = wc_attribute_label( str_replace( 'attribute_', '', $name ), $cart_item['data'] );
				}

				// Check the nicename against the title.
				if ( '' === $value || wc_is_attribute_in_product_name( $value, $cart_item['data']->get_name() ) ) {
					continue;
				}

				$item_data[] = array(
					'key'   => $label,
					'value' => $value,
				);
			}
		}

		// Filter item data to allow 3rd parties to add more to the array.
		$item_data = apply_filters( 'woocommerce_get_item_data', $item_data, $cart_item );

		// Format item data ready to display.
		foreach ( $item_data as $key => $data ) {
			// Set hidden to true to not display meta on cart.
			if ( ! empty( $data['hidden'] ) ) {
				unset( $item_data[ $key ] );
				continue;
			}
			$item_data[ $key ]['key']     = ! empty( $data['key'] ) ? $data['key'] : $data['name'];
			$item_data[ $key ]['display'] = ! empty( $data['display'] ) ? $data['display'] : $data['value'];
		}

		// Output flat or in list format.
		if ( count( $item_data ) > 0 ) {
			ob_start();

			if ( $flat ) {
				foreach ( $item_data as $data ) {
					echo esc_html( $data['key'] ) . ': ' . wp_kses_post( $data['display'] ) . "\n";
				}
			} else {
			    ?>
                <div class="variation-data-wrapper">
					<?php foreach ( $item_data as $data ) : ?>
                        <div class="variation-data">
                            <div class="variation-data-key <?php echo sanitize_html_class( 'variation-' . $data['key'] ); ?>"><?php echo wp_kses_post( $data['key'] ); ?>:</div>
                            <div class="variation-data-value <?php echo sanitize_html_class( 'variation-' . $data['key'] ); ?>"><?php echo wp_kses_post( wpautop( $data['display'] ) ); ?></div>
                        </div>
					<?php endforeach; ?>
                </div>
                <?php
			}

			return ob_get_clean();
		}

		return '';
	}
}
