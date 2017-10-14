<?php

namespace Objectiv\Plugins\Checkout\Core;

/**
 * Class Form
 * @package Objectiv\Plugins\Checkout\Core
 */
class Form {

	/**
	 * @var true|void
	 */
	public $base_fields;

	/**
	 * WP_Stripe_Apple_Pay Instance
	 */
	public $wc_stripe_apple_pay;

	/**
	 * Form constructor.
	 */
	public function __construct() {
		// Setup Apple Pay
		if ( class_exists('\\WC_Stripe_Apple_Pay') ) {
			$this->wc_stripe_apple_pay = new \WC_Stripe_Apple_Pay();
			$gateways = WC()->payment_gateways->get_available_payment_gateways();

			if ( $this->wc_stripe_apple_pay->apple_pay && isset( $gateways['stripe'] ) ) {
				// Display button
				add_action( 'cfw_checkout_before_customer_info', array(
					$this->wc_stripe_apple_pay,
					'display_apple_pay_button'
				), 1 );

				// Display separator
				add_action( 'cfw_checkout_before_customer_info', array(
					$this->wc_stripe_apple_pay,
					'display_apple_pay_separator_html'
				), 2 );
			}
		}

		$this->base_fields = add_filter('woocommerce_default_address_fields', function($defaults) {
			return array(
				'first_name' => array(
					'label'        => __( 'First name', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__('First name', 'checkout-woocommerce'),
					'required'     => true,
					'class'        => array(),
					'autocomplete' => 'given-name',
					'autofocus'    => true,
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 05,
					'wrap'         => $this->input_wrap('text', 6, 05),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => false,
					'custom_attributes' => array(
						"data-parsley-trigger"              => "change focusout"
					)
				),
				'last_name' => array(
					'label'        => __( 'Last name', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__('Last name', 'checkout-woocommerce'),
					'required'     => true,
					'class'        => array(),
					'autocomplete' => 'family-name',
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 10,
					'wrap'         => $this->input_wrap('text', 6, 10),
					'label_class'  => 'cfw-input-label',
					'start'        => false,
					'end'          => true,
					'custom_attributes' => array(
						"data-parsley-trigger"              => "change focusout"
					)
				),
				'address_1' => array(
					'label'        => __( 'Address', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__( 'Street address', 'checkout-woocommerce' ),
					'required'     => true,
					'class'        => array( 'address-field' ),
					'autocomplete' => 'address-line1',
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 15,
					'wrap'         => $this->input_wrap('text', 8,15),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => false,
					'custom_attributes' => array(
						"data-parsley-trigger"              => "change focusout"
					)
				),
				'address_2' => array(
					'label'        => __('Apartment, suite, unit etc.', 'checkout-woocommerce'),
					'placeholder'  => esc_attr__( 'Apartment, suite, unit etc.', 'checkout-woocommerce' ),
					'class'        => array( 'address-field' ),
					'required'     => false,
					'autocomplete' => 'address-line2',
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 20,
					'wrap'         => $this->input_wrap('text', 4, 20),
					'label_class'  => 'cfw-input-label',
					'start'        => false,
					'end'          => true
				),
				'company' => array(
					'label'        => __( 'Company name', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__('Company name', 'checkout-woocommerce'),
					'class'        => array( ),
					'autocomplete' => 'organization',
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 30,
					'wrap'         => $this->input_wrap('text', 12, 30),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => true
				),
				'country' => array(
					'type'         => 'country',
					'label'        => __( 'Country', 'checkout-woocommerce' ),
					'required'     => true,
					'class'        => array( 'address-field', 'update_totals_on_change' ),
					'autocomplete' => 'country',
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 40,
					'wrap'         => $this->input_wrap('select', 4, 40),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => false,
					'is_select'    => true
				),
				'postcode' => array(
					'label'        => __( 'Postcode / ZIP', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__('Postcode / ZIP', 'checkout-woocommerce'),
					'required'     => true,
					'class'        => array( 'address-field' ),
					'validate'     => array( 'postcode' ),
					'autocomplete' => 'postal-code',
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 45,
					'wrap'         => $this->input_wrap('text', 4, 45),
					'label_class'  => 'cfw-input-label',
					'custom_attributes' => array(
						"data-parsley-state-and-zip"        => "us",
						"data-parsley-validate-if-empty"    => "",
						"data-parsley-type"                 => "digits",
						"data-parsley-length"               => "[5,5]",
						"data-parsley-trigger"              => "keyup change focusout"
					),
					'start'        => false,
					'end'          => false
				),
				'state' => array(
					'type'         => 'state',
					'label'        => __( 'State / County', 'checkout-woocommerce' ),
					'required'     => true,
					'class'        => array( 'address-field' ),
					'validate'     => array( 'state' ),
					'autocomplete' => 'address-level1',
					'priority'     => 50,
					'wrap'         => $this->input_wrap('select', 4, 50),
					'label_class'  => 'cfw-input-label',
					'input_class'  => array('garlic-auto-save'),
					'custom_attributes' => array(
						"data-parsley-state-and-zip"        => "us",
						"data-parsley-validate-if-empty"    => "",
						"data-parsley-trigger"              => "keyup change focusout"
					),
					'start'        => false,
					'end'          => true,
					'is_select'    => true
				),
				'city' => array(
					'label'        => __( 'Town / City', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__('Town / City', 'checkout-woocommerce'),
					'required'     => true,
					'class'        => array( 'address-field' ),
					'autocomplete' => 'address-level2',
					'input_class'  => array('garlic-auto-save'),
					'priority'     => 60,
					'wrap'         => $this->input_wrap('text', 12, 60),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => true,
					'custom_attributes' => array(
						"data-parsley-trigger"              => "change focusout"
					)
				),
			);
		});
	}

	/**
	 * @param $type
	 * @param $col
	 * @param $priority
	 *
	 * @return object
	 */
	public function input_wrap($type, $col, $priority) {

		$inner_start = "";
		$inner_end = "";

		switch($type) {
			case "text":
				$inner_start = '<div class="cfw-input-wrap cfw-text-input">';
				$inner_end = '</div>';
				break;
			case "password":
				$inner_start = '<div class="cfw-input-wrap cfw-password-input">';
				$inner_end = '</div>';
				break;
			case "select":
				$inner_start = '<div class="cfw-input-wrap cfw-select-input">';
				$inner_end = '</div>';
				break;
		}

		$priority = esc_attr($priority);

		$start = '<div class="cfw-column-' . $col . ' %1$s" id="%2$s" data-priority="' . $priority . '">' . $inner_start . '%3$s';

		$end = "$inner_end</div>";

		return (object)["start" => $start, "end" => $end];
	}
}