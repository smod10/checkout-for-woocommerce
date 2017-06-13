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
	 * Form constructor.
	 */
	public function __construct() {
		$this->base_fields = add_filter('woocommerce_default_address_fields', function($defaults) {
			return array(
				'first_name' => array(
					'label'        => __( 'First name', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__('First name', 'checkout-woocommerce'),
					'required'     => true,
					'class'        => array(),
					'autocomplete' => 'given-name',
					'autofocus'    => true,
					'priority'     => 05,
					'wrap'         => $this->input_wrap('text', 6, 05),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => false
				),
				'last_name' => array(
					'label'        => __( 'Last name', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__('Last name', 'checkout-woocommerce'),
					'required'     => true,
					'class'        => array(),
					'autocomplete' => 'family-name',
					'priority'     => 10,
					'wrap'         => $this->input_wrap('text', 6, 10),
					'label_class'  => 'cfw-input-label',
					'start'        => false,
					'end'          => true
				),
				'address_1' => array(
					'label'        => __( 'Address', 'checkout-woocommerce' ),
					'placeholder'  => esc_attr__( 'Street address', 'checkout-woocommerce' ),
					'required'     => true,
					'class'        => array( 'address-field' ),
					'autocomplete' => 'address-line1',
					'priority'     => 15,
					'wrap'         => $this->input_wrap('text', 8,15),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => false
				),
				'address_2' => array(
					'label'        => __('Apartment, suite, unit etc.', 'checkout-woocommerce'),
					'placeholder'  => esc_attr__( 'Apartment, suite, unit etc.', 'checkout-woocommerce' ),
					'class'        => array( 'address-field' ),
					'required'     => false,
					'autocomplete' => 'address-line2',
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
					'priority'     => 45,
					'wrap'         => $this->input_wrap('text', 4, 45),
					'label_class'  => 'cfw-input-label',
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
					'priority'     => 60,
					'wrap'         => $this->input_wrap('text', 12, 60),
					'label_class'  => 'cfw-input-label',
					'start'        => true,
					'end'          => true
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