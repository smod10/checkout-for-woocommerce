<?php

if ( ! function_exists( 'woocommerce_form_field' ) ) {

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
			$required = ' <abbr class="required" title="' . esc_attr__( 'required', 'woocommerce' ) . '">*</abbr>';
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
		$args['custom_attributes'] = array_filter( (array) $args['custom_attributes'] );

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

		if(isset($args['wrap'])) {
			$field_container_start = $args['wrap']->start . $args['wrap']->end;
		}

		$parsleyOut = "";

		if($args['required']) {
		    $parsleyOut = 'required=""';
        }

		switch ( $args['type'] ) {
			case 'country' :

				$countries = 'shipping_country' === $key ? WC()->countries->get_shipping_countries() : WC()->countries->get_allowed_countries();

				if ( 1 === sizeof( $countries ) ) {

					$field .= '<strong>' . current( array_values( $countries ) ) . '</strong>';

					$field .= '<input type="hidden" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="' . current( array_keys( $countries ) ) . '" ' . implode( ' ', $custom_attributes ) . ' class="country_to_state" />';

				} else {

					$field = '<select field_key="' . $key_sans_type . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="country_to_state country_select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . $parsleyOut .  '>' . '<option value="">' . esc_html__( 'Select a country&hellip;', 'woocommerce' ) . '</option>';

					foreach ( $countries as $ckey => $cvalue ) {
						$field .= '<option value="' . esc_attr( $ckey ) . '" ' . selected( $value, $ckey, false ) . '>' . $cvalue . '</option>';
					}

					$field .= '</select>';

					$field .= '<noscript><input type="submit" name="woocommerce_checkout_update_totals" value="' . esc_attr__( 'Update country', 'woocommerce' ) . '" /></noscript>';

				}

				break;
			case 'state' :

				/* Get Country */
				$country_key = 'billing_state' === $key ? 'billing_country' : 'shipping_country';
				$current_cc  = WC()->checkout->get_value( $country_key );
				$states      = WC()->countries->get_states( $current_cc );

				if ( is_array( $states ) && empty( $states ) ) {

					$field_container_start = '<div class="cfw-sg-container cfw-input-wrap-row %1$s" id="%2$s" style="display: none">%3$s</div>';

					$field .= '<input type="hidden" class="hidden" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="" ' . implode( ' ', $custom_attributes ) . ' placeholder="' . esc_attr( $args['placeholder'] ) . '" />';

				} elseif ( ! is_null( $current_cc ) && is_array( $states ) ) {

					$field .= '<select field_key="' . $key_sans_type . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="state_select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . $parsleyOut . ' data-placeholder="' . esc_attr( $args['placeholder'] ) . '">
						<option value="">' . esc_html__( 'Select a state&hellip;', 'woocommerce' ) . '</option>';

					foreach ( $states as $ckey => $cvalue ) {
						$field .= '<option value="' . esc_attr( $ckey ) . '" ' . selected( $value, $ckey, false ) . '>' . $cvalue . '</option>';
					}

					$field .= '</select>';

				} else {

					$field .= '<input type="text" class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" value="' . esc_attr( $value ) . '"  placeholder="' . esc_attr( $args['placeholder'] ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" ' . implode( ' ', $custom_attributes ) . ' />';

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
								$args['placeholder'] = $option_text ? $option_text : __( 'Choose an option', 'woocommerce' );
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


			if(isset($args['start']) && $args['start']) {
				$row_wrap = '<div class="cfw-sg-container cfw-input-wrap-row">';
			}

			$field = $row_wrap . sprintf( $field_container_start, $container_class, $container_id, $field_html );

			if(isset($args['end']) && $args['end']) {
				$field .= "</div>";
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

	function cfw_strip_key_type_and_capitalize($key) {
		$key_sans_type = cfw_strip_key_type($key);
		$key_temp = explode("_", $key_sans_type);

		foreach($key_temp as $index => $word) {
			$key_temp[$index] = ucfirst($word);
		}

		return implode(" ", $key_temp);
	}

	function cfw_get_shipping_checkout_fields($checkout) {
		foreach ( $checkout->get_checkout_fields( 'shipping' ) as $key => $field ) {
			cfw_form_field( $key, $field, $checkout->get_value( $key ) );
		}
	}

	function cfw_get_billing_checkout_fields($checkout) {
		foreach ( $checkout->get_checkout_fields( 'billing' ) as $key => $field ) {
			cfw_form_field( $key, $field, $checkout->get_value( $key ) );
		}
	}

	function cfw_get_shipping_details($checkout) {
		foreach ( $checkout->get_checkout_fields( 'shipping' ) as $key => $field ) {
			echo "<div field_type='" . cfw_strip_key_type($key) ."' class='cfw-shipping-details-field'><label class='field_type'>" . cfw_strip_key_type_and_capitalize($key) . ": </label><span class='field_value'>{$checkout->get_value($key)}</span></div>";
		}
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
			$package_name = apply_filters( 'woocommerce_shipping_package_name', sprintf( _nx( 'Shipping', 'Shipping %d', ( $i + 1 ), 'shipping packages', 'woocommerce' ), ( $i + 1 ) ), $i, $package );
			$index = $i;

			// Next section ripped straight from cart-shipping and edited for now
			?>

			<?php if ( 1 < count( $available_methods ) ) : ?>
				<ul id="shipping_method" class="cfw-shipping-methods-list">
					<?php foreach ( $available_methods as $method ) : ?>
						<li>
							<?php
							printf( '<label for="shipping_method_%1$d_%2$s"><input type="radio" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d_%2$s" value="%3$s" class="shipping_method" %4$s /> %5$s</label>', $index, sanitize_title( $method->id ), esc_attr( $method->id ),
								checked( $method->id, $chosen_method, false ), wc_cart_totals_shipping_method_label( $method ) );

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

			<?php if ( is_cart() && ! $index ) : ?>
				<?php woocommerce_shipping_calculator(); ?>
			<?php endif; ?>

		<?php
		}
	}

	function cfw_get_payment_methods_html() {
        $available_gateways = WC()->payment_gateways->get_available_payment_gateways();

        if ( WC()->cart->needs_payment() ) {
            ?><ul class="wc_payment_methods payment_methods methods cfw-radio-reveal-group"><?php
                if ( ! empty( $available_gateways ) ) {
                    $count = 0;
                    foreach ( $available_gateways as $gateway ) {
                        ?>
                        <li class="wc_payment_method payment_method_<?php echo $gateway->id; ?> cfw-radio-reveal-li">
                            <div class="payment_method_title_wrap cfw-radio-reveal-title-wrap">
                                <label class="payment_method_label cfw-radio-reveal-label" for="payment_method_<?php echo $gateway->id; ?>">
                                    <input id="payment_method_<?php echo $gateway->id; ?>" type="radio" class="input-radio" name="payment_method" value="<?php echo esc_attr( $gateway->id ); ?>" <?php echo ($count == 0) ? "checked" : ""; ?> data-order_button_text="<?php echo esc_attr( $gateway->order_button_text ); ?>" />
                                    <span class="payment_method_title cfw-radio-reveal-title"><?php echo $gateway->get_title(); ?></span>
                                </label>

                                <span class="payment_method_icons">
                                    <?php echo $gateway->get_icon(); ?>
                                </span>
                            </div>
		                    <?php if ( $gateway->has_fields() || $gateway->get_description() ) : ?>
                                <div class="payment_box_wrap cfw-radio-reveal-content-wrap" <?php if ( ! $gateway->chosen ) : ?>style="display:none;"<?php endif; ?>>
                                    <div class="payment_box payment_method_<?php echo $gateway->id; ?> cfw-radio-reveal-content">
                                        <?php $gateway->payment_fields(); ?>
                                    </div>
                                </div>
		                    <?php endif; ?>
                        </li>
                        <?php
                        $count++;
                    }
                } else {
                    echo '<li class="woocommerce-notice woocommerce-notice--info woocommerce-info">' . apply_filters( 'woocommerce_no_available_payment_methods_message', __( 'Sorry, it seems that there are no available payment methods for your location. Please contact us if you require assistance or wish to make alternate arrangements.', 'woocommerce' ) ) . '</li>';
                }
            ?></ul><?php
        }
    }

    function cfw_get_checkout_cart_html() {
	    $cart = WC()->cart;

        foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
	        $_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

	        if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
		        $item_data = $cart_item['data'];

		        $item_thumb_url = wp_get_attachment_url( $item_data->get_image_id() );
		        $item_quantity  = $cart_item['quantity'];
		        $item_title     = $item_data->get_title();
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
                <div class="cfw-cart-row cfw-container cfw-collapse">
                    <?php if($item_thumb_url): ?>
                    <div class="cfw-cart-item-image cfw-cart-item-col <?php echo "${column_base}${columns["image"]}"; ?>">
                        <img src="<?php echo $item_thumb_url; ?>"/>
                    </div>
                    <?php endif; ?>
                    <div class="cfw-cart-item-title-quantity cfw-cart-item-col <?php echo "${column_base}${columns["title"]}"; ?>">
                        <a href="<?php echo $item_url; ?>" class="cfw-link"><?php echo $item_title; ?></a> x
                        <strong><?php echo $item_quantity; ?></strong>
                    </div>
                    <div class="cfw-cart-item-subtotal cfw-cart-item-col <?php echo "${column_base}${columns["subtotal"]}"; ?>">
				        <?php echo $item_subtotal; ?>
                    </div>
                </div>
		        <?php
	        }
        }
    }
}