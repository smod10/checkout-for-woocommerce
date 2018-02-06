<?php

namespace Objectiv\Plugins\Checkout\Core;

/**
 * Class Form
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Brandon Tassone <brandontassone@gmail.com>
 */
class Form {

	/**
	 * @since 1.0.0
	 * @access public
	 * @var true|void $base_fields
	 */
	public $base_fields;

	/**
	 * @since 1.0.0
	 * @access public
	 * @var object $wc_stripe_apple_pay
	 */
	public $wc_stripe_apple_pay;

	/**
	 * Form constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		$this->base_fields = add_filter('woocommerce_default_address_fields', array($this, 'get_custom_default_address_fields'));

		add_filter('woocommerce_billing_fields', function($address_fields, $country) {
			$address_fields["billing_phone"] = $this->get_custom_default_address_fields()["phone"];

			return $address_fields;
		}, 10, 2);
	}

	public function get_custom_default_address_fields() {
		return array(
			'first_name' => array(
				'label'        => __( 'First name', CFW_TEXT_DOMAIN ),
				'placeholder'  => esc_attr__('First name', CFW_TEXT_DOMAIN),
				'required'     => true,
				'class'        => array(),
				'autocomplete' => 'given-name',
				'autofocus'    => false,
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
				'label'        => __( 'Last name', CFW_TEXT_DOMAIN ),
				'placeholder'  => esc_attr__('Last name', CFW_TEXT_DOMAIN),
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
				'label'        => __( 'Address', CFW_TEXT_DOMAIN ),
				'placeholder'  => esc_attr__( 'Street address', CFW_TEXT_DOMAIN ),
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
				'label'        => __('Apt, suite, etc. (optional)', CFW_TEXT_DOMAIN),
				'placeholder'  => esc_attr__('Apt, suite, etc. (optional)', CFW_TEXT_DOMAIN),
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
				'label'        => __( 'Company name', CFW_TEXT_DOMAIN ),
				'placeholder'  => esc_attr__('Company name', CFW_TEXT_DOMAIN),
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
				'label'        => __( 'Country', CFW_TEXT_DOMAIN ),
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
				'label'        => __( 'Postcode / ZIP', CFW_TEXT_DOMAIN ),
				'placeholder'  => esc_attr__('Postcode / ZIP', CFW_TEXT_DOMAIN),
				'required'     => true,
				'class'        => array( 'address-field' ),
				'validate'     => array( 'postcode' ),
				'autocomplete' => 'postal-code',
				'input_class'  => array('garlic-auto-save'),
				'priority'     => 45,
				'wrap'         => $this->input_wrap('text', 4, 45),
				'label_class'  => 'cfw-input-label',
				'custom_attributes' => array(
					"data-parsley-state-and-zip"        => "",
					"data-parsley-validate-if-empty"    => "",
					"data-parsley-length"               => "[2,12]",
					"data-parsley-trigger"              => "keyup change focusout"
				),
				'start'        => false,
				'end'          => false
			),
			'state' => array(
				'type'         => 'state',
				'label'        => __( 'State / County', CFW_TEXT_DOMAIN ),
				'placeholder'  => __( 'State / County', CFW_TEXT_DOMAIN ),
				'required'     => true,
				'class'        => array( 'address-field' ),
				'validate'     => array( 'state' ),
				'autocomplete' => 'address-level1',
				'priority'     => 50,
				'wrap'         => $this->input_wrap('select', 4, 50),
				'label_class'  => 'cfw-input-label',
				'input_class'  => array('garlic-auto-save'),
				'custom_attributes' => array(
					"data-parsley-state-and-zip"        => "",
					"data-parsley-validate-if-empty"    => "",
					"data-parsley-trigger"              => "keyup change focusout"
				),
				'start'        => false,
				'end'          => true,
				'is_select'    => true
			),
			'city' => array(
				'label'        => __( 'Town / City', CFW_TEXT_DOMAIN ),
				'required'     => true,
				'placeholder'  => esc_attr__('Town / City', CFW_TEXT_DOMAIN),
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
			'phone' => array(
				'type'         => 'tel',
				'label'        => __( 'Phone', 'woocommerce' ),
				'required'     => true,
				'placeholder'  => esc_attr__('Phone', CFW_TEXT_DOMAIN),
				'class'        => array( 'address-field' ),
				'autocomplete' => 'tel',
				'input_class'  => array('garlic-auto-save'),
				'priority'     => 70,
				'wrap'         => $this->input_wrap('tel', 12, 70),
				'label_class'  => 'cfw-input-label',
				'start'        => true,
				'end'          => true,
				'validate'     => array( 'phone' ),
			)
		);
	}

	/**
	 * @since 1.0.0
	 * @access public
	 * @param $type
	 * @param $col
	 * @param $priority
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
			case "tel":
				$inner_start = '<div class="cfw-input-wrap cfw-tel-input">';
				$inner_end = '</div>';
				break;
		}

		$priority = esc_attr($priority);

		$start = '<div class="cfw-column-' . $col . ' %1$s" id="%2$s" data-priority="' . $priority . '">' . $inner_start . '%3$s';

		$end = "$inner_end</div>";

		return (object)["start" => $start, "end" => $end];
	}
}