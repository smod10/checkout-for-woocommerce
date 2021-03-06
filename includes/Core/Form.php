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

		// Calculate rows for our fields
		add_filter( 'cfw_calculate_field_rows', array($this, 'calculate_rows'), 0, 1 );
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
		$fields = array(
			'first_name' => array(
				'label'             => __( 'First name', 'checkout-wc' ),
				'placeholder'       => esc_attr__( 'First name', 'checkout-wc' ),
				'required'          => true,
				'class'             => array(),
				'autocomplete'      => 'given-name',
				'autofocus'         => false,
				'input_class'       => array( 'garlic-auto-save' ),
				'priority'          => 05,
				'columns'           => 6,
				'label_class'       => 'cfw-input-label',
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
				'columns'           => 6,
				'label_class'       => 'cfw-input-label',
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
				'columns'           => 8,
				'label_class'       => 'cfw-input-label',
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
				'columns'      => 4,
				'label_class'  => 'cfw-input-label',
			),
			'company'    => array(
				'label'        => __( 'Company name', 'checkout-wc' ),
				'placeholder'  => esc_attr__( 'Company name', 'checkout-wc' ),
				'class'        => array(),
				'autocomplete' => 'organization',
				'input_class'  => array( 'garlic-auto-save' ),
				'priority'     => 30,
				'columns'      => 12,
				'label_class'  => 'cfw-input-label',
			),
			'country'    => array(
				'type'         => 'country',
				'label'        => __( 'Country', 'checkout-wc' ),
				'required'     => true,
				'class'        => array( 'address-field', 'update_totals_on_change' ),
				'autocomplete' => 'country',
				'input_class'  => array( 'garlic-auto-save' ),
				'priority'     => 40,
				'columns'      => 4,
				'label_class'  => 'cfw-input-label',
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
				'columns'           => 4,
				'label_class'       => 'cfw-input-label',
				'custom_attributes' => array(
					'data-parsley-state-and-zip'     => '',
					'data-parsley-validate-if-empty' => '',
					'data-parsley-length'            => '[2,12]',
					'data-parsley-trigger'           => 'keyup change focusout',
				),
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
				'columns'           => 4,
				'label_class'       => 'cfw-input-label',
				'input_class'       => array( 'garlic-auto-save' ),
				'custom_attributes' => array(
					'data-parsley-state-and-zip'     => '',
					'data-parsley-validate-if-empty' => '',
					'data-parsley-trigger'           => 'keyup change focusout',
				),
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
				'columns'           => 12,
				'label_class'       => 'cfw-input-label',
				'custom_attributes' => array(
					'data-parsley-trigger' => 'change focusout',
				),
			),
		);

		// If the phone is enabled in the settings
		if ( $this->phone_enabled ) {
			$fields['phone'] = array(
				'type'         => 'tel',
				'label'        => cfw__( 'Phone', 'woocommerce' ),
				'required'     => true,
				'placeholder'  => esc_attr__( 'Phone', 'checkout-wc' ),
				'class'        => array( 'address-field' ),
				'autocomplete' => 'tel',
				'input_class'  => array( 'garlic-auto-save' ),
				'priority'     => 70,
				'columns'      => 12,
				'label_class'  => 'cfw-input-label',
				'validate'     => array( 'phone' ),
				'custom_attributes' => array(
					'data-parsley-trigger' => 'change focusout',
				),
			);
		}

		$fields = apply_filters( 'cfw_calculate_field_rows', $fields );

		return $fields;
	}

	function calculate_wrap( $field, $start_end = null ) {
		if ( empty( $field['wrap']) ) {
			// Convert to field types for wrap
			if ( ! empty( $field['type'] ) && in_array( $field['type'], array( 'state', 'country' ) ) ) {
				$wrap_type = 'select';
			} elseif( empty( $field['type'] ) ) {
				$wrap_type = 'text';
			} else {
				$wrap_type = $field['type'];
			}

			// Add our wrap
			$field['wrap'] = $this->input_wrap( $wrap_type, $field['columns'], $field['priority'] );

			// Default these to false
			$field['start'] = $start_end;
			$field['end'] = $start_end;

			/**
			 * If neither start or end are set and $start_end is a boolean value,
			 * init both values to passed in $start_end value
			 */
			if ( is_bool( $start_end ) ) {
				if ( ! isset( $field['start'] ) ) {
					$field['start'] = $start_end;
				}

				if ( ! isset( $field['end'] ) ) {
					$field['end'] = $start_end;
				}
			}
		}

		return $field;
	}

	function calculate_rows( $fields ) {
		$start              = true;
		$summed_column_size = 0;
		$max_size           = 12;
		$last_index         = false;

		foreach ( $fields as $index => $field ) {
			// Set our wrap
			$fields[ $index ] = $this->calculate_wrap( $field );

			// If we flagged this field in the last loop iteration to be
			// the start of a row, or we are on the first iteration, set start to true
			if ( $start === true ) {
				$fields[ $index ]['start'] = true;

				// Make sure the last field was an end, if this is a start
				if ( $last_index !== false ) {
					$fields[ $last_index ]['end'] = true;
				}

				// Set start to null
				$start = null;
			}

			/**
			 * If the field is the max possible size, it should be the start and end of the row
			 *
			 * OR if the summed column size + this field is over the max size, set to start of row
			 * and set last item to end of row
			 *
			 * OR if summed column size + this field is under the max size, set end to false
			 */
			if ( $fields[ $index ]['columns'] == $max_size ) {
				$fields[ $index ]['start'] = true;
				$fields[ $index ]['end'] = true;

				// Next field should be start of row
				$start = true;
			} elseif ( $summed_column_size + $fields[ $index ]['columns'] > $max_size  ) {
				$fields[ $index ]['start'] = true;

				// Since this is the start, last field should be the end
				if ( $last_index !== false ) {
					$fields[ $last_index ][ 'end' ] = true;
				}

				// Reset size counter
				$summed_column_size = 0;
			} elseif ( $summed_column_size + $fields[ $index ]['columns'] < $max_size ) {
				// Add to summed size
				$summed_column_size = $summed_column_size + $field['columns'];

				// Not the end, so set to false
				$fields[ $index ]['end'] = false;
			} elseif ( $summed_column_size + $fields[ $index ]['columns'] === $max_size ) {
				// Reset summed size to 0
				$summed_column_size = 0;

				// This is the end
				$fields[ $index ]['end'] = true;

				// So the next field is logically the beginning
				$start = true;
			}

			/**
			 * If for some reason neither start or end are set above,
			 * Init both values to false
			 */
			if ( ! isset( $fields[ $index ]['start'] ) ) {
				$fields[ $index ]['start'] = false;
			}

			if ( ! isset( $fields[ $index ]['end'] ) ) {
				$fields[ $index ]['end'] = false;
			}

			// Store this index so we can use it for backwards lookups later
			$last_index = $index;
		}

		return $fields;
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
			case 'textarea':
				$inner_start = '<div class="cfw-input-wrap cfw-textarea-input">';
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
