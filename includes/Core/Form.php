<?php

namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Main;

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
	 * @since 1.1.5
	 * @access private
	 * @var string Is the phone enabled in the settings?
	 */
	private $phone_enabled;

	/**
	 * Form constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		$cfw = Main::instance();
		$this->phone_enabled = $cfw->is_phone_fields_enabled();

		add_filter( 'woocommerce_default_address_fields', array( $this, 'get_custom_default_address_fields' ), 100000 ); // seriously, run this last
		add_filter( 'woocommerce_get_country_locale', array($this, 'prevent_postcode_sort_change') );

		if ( $this->phone_enabled ) {
			add_filter( 'woocommerce_billing_fields', array( $this, 'enforce_billing_phone_options_from_default' ), 10, 2 );
			add_action( 'woocommerce_checkout_create_order', array( $this, 'update_shipping_phone_on_order_create' ), 10, 2 );
		} else {
			add_filter( 'woocommerce_billing_fields', array( $this, 'unrequire_billing_phone' ), 10, 1 );
		}
	}

	/**
	 * @since 1.2.0
	 * @param $address_fields
	 *
	 * @return mixed
	 */
	public function unrequire_billing_phone( $address_fields ) {
		$address_fields['billing_phone']['required'] = false;

		return $address_fields;
	}

	/**
	 * @since 1.1.5
	 * @param $address_fields
	 * @param $country
	 *
	 * @return mixed
	 */
	public function enforce_billing_phone_options_from_default( $address_fields, $country ) {
		$address_fields['billing_phone'] = $this->get_custom_default_address_fields()['phone'];

		return $address_fields;
	}


	/**
	 * @since 1.1.5
	 * @param $order
	 * @param $data
	 */
	public function update_shipping_phone_on_order_create( $order, $data ) {
		if ( ! empty( $_POST['shipping_phone'] ) ) {
			$order->update_meta_data( '_shipping_phone', sanitize_text_field( $_POST['shipping_phone'] ) );
		}
	}

	/**
	 * @return array
	 */
	public function get_custom_default_address_fields() {
		$defaults = array(
			'first_name' => array(
				'label'             => __( 'First name', 'checkout-wc' ),
				'placeholder'       => esc_attr__( 'First name', 'checkout-wc' ),
				'required'          => true,
				'class'             => array(),
				'autocomplete'      => 'given-name',
				'autofocus'         => false,
				'input_class'       => array( 'garlic-auto-save' ),
				'priority'          => 05,
				'wrap'              => $this->input_wrap( 'text', 6, 05 ),
				'label_class'       => 'cfw-input-label',
				'start'             => true,
				'end'               => false,
				'custom_attributes' => array(
					'data-parsley-trigger' => 'change focusout',
				),
			),
			'last_name'  => array(
				'label'             => __( 'Last name', 'checkout-wc' ),
				'placeholder'       => esc_attr__( 'Last name', 'checkout-wc' ),
				'required'          => true,
				'class'             => array(),
				'autocomplete'      => 'family-name',
				'input_class'       => array( 'garlic-auto-save' ),
				'priority'          => 10,
				'wrap'              => $this->input_wrap( 'text', 6, 10 ),
				'label_class'       => 'cfw-input-label',
				'start'             => false,
				'end'               => true,
				'custom_attributes' => array(
					'data-parsley-trigger' => 'change focusout',
				),
			),
			'address_1'  => array(
				'label'             => __( 'Address', 'checkout-wc' ),
				'placeholder'       => esc_attr__( 'Street address', 'checkout-wc' ),
				'required'          => true,
				'class'             => array( 'address-field' ),
				'autocomplete'      => 'address-line1',
				'input_class'       => array( 'garlic-auto-save' ),
				'priority'          => 15,
				'wrap'              => $this->input_wrap( 'text', 8, 15 ),
				'label_class'       => 'cfw-input-label',
				'start'             => true,
				'end'               => false,
				'custom_attributes' => array(
					'data-parsley-trigger' => 'change focusout',
				),
			),
			'address_2'  => array(
				'label'        => __( 'Apt, suite, etc. (optional)', 'checkout-wc' ),
				'placeholder'  => esc_attr__( 'Apt, suite, etc. (optional)', 'checkout-wc' ),
				'class'        => array( 'address-field' ),
				'required'     => false,
				'autocomplete' => 'address-line2',
				'input_class'  => array( 'garlic-auto-save' ),
				'priority'     => 20,
				'wrap'         => $this->input_wrap( 'text', 4, 20 ),
				'label_class'  => 'cfw-input-label',
				'start'        => false,
				'end'          => true,
			),
			'company'    => array(
				'label'        => __( 'Company name', 'checkout-wc' ),
				'placeholder'  => esc_attr__( 'Company name', 'checkout-wc' ),
				'class'        => array(),
				'autocomplete' => 'organization',
				'input_class'  => array( 'garlic-auto-save' ),
				'priority'     => 30,
				'wrap'         => $this->input_wrap( 'text', 12, 30 ),
				'label_class'  => 'cfw-input-label',
				'start'        => true,
				'end'          => true,
			),
			'country'    => array(
				'type'         => 'country',
				'label'        => __( 'Country', 'checkout-wc' ),
				'required'     => true,
				'class'        => array( 'address-field', 'update_totals_on_change' ),
				'autocomplete' => 'country',
				'input_class'  => array( 'garlic-auto-save' ),
				'priority'     => 40,
				'wrap'         => $this->input_wrap( 'select', 4, 40 ),
				'label_class'  => 'cfw-input-label',
				'start'        => true,
				'end'          => false,
				'is_select'    => true,
			),
			'postcode'   => array(
				'label'             => __( 'Postcode / ZIP', 'checkout-wc' ),
				'placeholder'       => esc_attr__( 'Postcode / ZIP', 'checkout-wc' ),
				'required'          => true,
				'class'             => array( 'address-field' ),
				'validate'          => array( 'postcode' ),
				'autocomplete'      => 'postal-code',
				'input_class'       => array( 'garlic-auto-save' ),
				'priority'          => 45,
				'wrap'              => $this->input_wrap( 'text', 4, 45 ),
				'label_class'       => 'cfw-input-label',
				'custom_attributes' => array(
					'data-parsley-state-and-zip'     => '',
					'data-parsley-validate-if-empty' => '',
					'data-parsley-length'            => '[2,12]',
					'data-parsley-trigger'           => 'keyup change focusout',
				),
				'start'             => false,
				'end'               => false,
			),
			'state'      => array(
				'type'              => 'state',
				'label'             => __( 'State / County', 'checkout-wc' ),
				'placeholder'       => __( 'State / County', 'checkout-wc' ),
				'required'          => true,
				'class'             => array( 'address-field' ),
				'validate'          => array( 'state' ),
				'autocomplete'      => 'address-level1',
				'priority'          => 50,
				'wrap'              => $this->input_wrap( 'select', 4, 50 ),
				'label_class'       => 'cfw-input-label',
				'input_class'       => array( 'garlic-auto-save' ),
				'custom_attributes' => array(
					'data-parsley-state-and-zip'     => '',
					'data-parsley-validate-if-empty' => '',
					'data-parsley-trigger'           => 'keyup change focusout',
				),
				'start'             => false,
				'end'               => true,
				'is_select'         => true,
			),
			'city'       => array(
				'label'             => __( 'Town / City', 'checkout-wc' ),
				'required'          => true,
				'placeholder'       => esc_attr__( 'Town / City', 'checkout-wc' ),
				'class'             => array( 'address-field' ),
				'autocomplete'      => 'address-level2',
				'input_class'       => array( 'garlic-auto-save' ),
				'priority'          => 60,
				'wrap'              => $this->input_wrap( 'text', 12, 60 ),
				'label_class'       => 'cfw-input-label',
				'start'             => true,
				'end'               => true,
				'custom_attributes' => array(
					'data-parsley-trigger' => 'change focusout',
				),
			),
		);

		// If the phone is enabled in the settings
		if ( $this->phone_enabled ) {
			$defaults['phone'] = array(
				'type'         => 'tel',
				'label'        => cfw__( 'Phone', 'woocommerce' ),
				'required'     => true,
				'placeholder'  => esc_attr__( 'Phone', 'checkout-wc' ),
				'class'        => array( 'address-field' ),
				'autocomplete' => 'tel',
				'input_class'  => array( 'garlic-auto-save' ),
				'priority'     => 70,
				'wrap'         => $this->input_wrap( 'tel', 12, 70 ),
				'label_class'  => 'cfw-input-label',
				'start'        => true,
				'end'          => true,
				'validate'     => array( 'phone' ),
			);
		}

		return $defaults;
	}

	/**
	 * @param $locales
	 *
	 * Some locales reprioritize the postcode to be later than we do. This is undesirable behavior
	 * In the future, we should probably adjust our form styles to allow for reordering like this on a locale basis
	 *
	 * @return array $locales
	 */
	function prevent_postcode_sort_change( $locales ) {
		foreach( $locales as $key => $value ) {
			if ( ! empty( $value['postcode'] ) && ! empty( $value['postcode']['priority'] ) ) {
				$locales[ $key ]['postcode']['priority'] = 45;
			}
		}

		return $locales;
	}

	/**
	 * @since 1.0.0
	 * @access public
	 * @param $type
	 * @param $col
	 * @param $priority
	 * @return object
	 */
	public function input_wrap( $type, $col, $priority ) {

		$inner_start = '';
		$inner_end   = '';

		switch ( $type ) {
			case 'text':
				$inner_start = '<div class="cfw-input-wrap cfw-text-input">';
				$inner_end   = '</div>';
				break;
			case 'password':
				$inner_start = '<div class="cfw-input-wrap cfw-password-input">';
				$inner_end   = '</div>';
				break;
			case 'select':
				$inner_start = '<div class="cfw-input-wrap cfw-select-input">';
				$inner_end   = '</div>';
				break;
			case 'tel':
				$inner_start = '<div class="cfw-input-wrap cfw-tel-input">';
				$inner_end   = '</div>';
				break;
		}

		$priority = esc_attr( $priority );

		$start = '<div class="cfw-column-' . $col . ' %1$s" id="%2$s" data-priority="' . $priority . '">' . $inner_start . '%3$s';

		$end = "$inner_end</div>";

		$start = apply_filters( 'cfw_input_wrap_start', $start, $type, $col, $priority );
		$end   = apply_filters( 'cfw_input_wrap_end', $end, $type, $col, $priority );

		return (object) [
			'start' => $start,
			'end'   => $end,
		];
	}
}
