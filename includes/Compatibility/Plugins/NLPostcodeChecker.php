<?php

namespace Objectiv\Plugins\Checkout\Compatibility\Plugins;

use Objectiv\Plugins\Checkout\Compatibility\Base;

class NLPostcodeChecker extends Base {
	function is_available() {
		return class_exists('\\WPO_WCNLPC_Checkout');
	}

	function run() {
		add_action('init', array($this, 'disable_nl_hooks'), 11 );
		add_action('wp', array($this, 'wp') );
		add_filter( 'woocommerce_default_address_fields', array( $this, 'add_new_fields' ), 100001, 1 ); // run after our normal hook
		add_filter( 'woocommerce_default_address_fields', array( $this, 'sort_fields' ), 200000, 1 ); // run after our normal hook
		add_filter( 'woocommerce_get_country_locale', array($this, 'prevent_postcode_sort_change') );
		add_action( 'wp_enqueue_scripts', array($this, 'adjust_deps'), 1000 );
		add_filter( 'cfw_enable_zip_autocomplete', '__return_false' );

		// Move form-row class to input container from row
		add_filter( 'cfw_input_wrap_start', array($this, 'input_wrap_start') );
		add_filter( 'cfw_input_row_wrap', array($this, 'input_row_wrap') );
	}

	function disable_nl_hooks() {
		global $wp_filter;

		$existing_hooks                      = $wp_filter['woocommerce_billing_fields'];

		if ( $existing_hooks[100] ) {
			foreach ( $existing_hooks[100] as $key => $callback ) {
				if ( false !== stripos( $key, 'nl_billing_fields' ) ) {
					global $WPO_WCNLPC_Checkout;

					$WPO_WCNLPC_Checkout = $callback['function'][0];
				}
			}
		}

		$priority = apply_filters( 'nl_checkout_fields_priority', 9, 'billing' );

		if ( $existing_hooks[$priority] ) {
			foreach ( $existing_hooks[$priority] as $key => $callback ) {
				if ( false !== stripos( $key, 'nl_billing_fields' ) ) {
					global $WC_NLPostcode_Fields;

					$WC_NLPostcode_Fields = $callback['function'][0];
				}
			}
		}

		if ( ! empty( $WPO_WCNLPC_Checkout ) ) {
			remove_filter( 'woocommerce_billing_fields', array( $WPO_WCNLPC_Checkout, 'nl_billing_fields' ), 100 );
			remove_filter( 'woocommerce_shipping_fields', array( $WPO_WCNLPC_Checkout, 'nl_shipping_fields' ), 100 );
		}

		if ( ! empty( $WC_NLPostcode_Fields ) ) {
			remove_filter( 'woocommerce_billing_fields', array( $WC_NLPostcode_Fields, 'nl_billing_fields' ), $priority );
			remove_filter( 'woocommerce_shipping_fields', array( $WC_NLPostcode_Fields, 'nl_shipping_fields' ),$priority );
			remove_action('woocommerce_checkout_update_order_meta', array( &$WC_NLPostcode_Fields, 'merge_street_number_suffix' ), 20 );
		}
	}

	function wp() {
		$cfw = \Objectiv\Plugins\Checkout\Main::instance();
		remove_filter( 'woocommerce_get_country_locale', array($cfw->get_form(), 'prevent_postcode_sort_change') );
	}

	function add_new_fields( $fields ) {
		$cfw = \Objectiv\Plugins\Checkout\Main::instance();

		// Adjust postcode field
		$fields['postcode']['priority'] = 11;
		$fields['postcode']['start'] = true;
		$fields['postcode']['end'] = false;

		// Then add house number
		$fields['house_number'] = array(
			'label'             => cfw__( 'Nr.', 'wpo_wcnlpc' ),
			'placeholder'       => cfw_esc_attr__( 'Nr.', 'wpo_wcnlpc' ),
			'required'          => true,
			'class'             => array(),
			'autocomplete'      => '',
			'input_class'       => array( 'garlic-auto-save' ),
			'priority'          => 12,
			'wrap'              => $cfw->get_form()->input_wrap( 'text', 4, 10 ),
			'label_class'       => 'cfw-input-label',
			'start'             => false,
			'end'               => false,
			'custom_attributes' => array(
				'data-parsley-trigger' => 'change focusout',
			),
		);

		// Then house number suffix
		$fields['house_number_suffix'] = array(
			'label'             => cfw__( 'Suffix', 'wpo_wcnlpc' ),
			'placeholder'       => cfw_esc_attr__( 'Suffix', 'wpo_wcnlpc' ),
			'required'          => false,
			'class'             => array(),
			'autocomplete'      => '',
			'input_class'       => array( 'garlic-auto-save' ),
			'priority'          => 13,
			'wrap'              => $cfw->get_form()->input_wrap( 'text', 4, 10 ),
			'label_class'       => 'cfw-input-label',
			'start'             => false,
			'end'               => true,
			'custom_attributes' => array(
				'data-parsley-trigger' => 'change focusout',
			),
		);

		return $fields;
	}

	function sort_fields( $fields ) {
		uasort($fields, function($a, $b) {
			return $a['priority'] - $b['priority'];
		});

		return $fields;
	}

	function prevent_postcode_sort_change( $locales ) {
		foreach( $locales as $key => $value ) {
			if ( ! empty( $value['postcode'] ) && ! empty( $value['postcode']['priority'] ) ) {
				$locales[ $key ]['postcode']['priority'] = 11;
			}
		}

		return $locales;
	}

	function adjust_deps() {
		global $wp_scripts;

		if ( ! empty($wp_scripts->registered['wpo-wcnlpc']) ) {
			$wp_scripts->registered['wpo-wcnlpc']->deps = array('jquery');
		}
	}

	function input_wrap_start( $input_wrap_start ) {
		$input_wrap_start = str_replace( 'cfw-col', 'form-row cfw-col', $input_wrap_start );

		return $input_wrap_start;
	}

	function input_row_wrap( $input_row_wrap ) {
		$input_row_wrap = str_replace( 'form-row', '', $input_row_wrap );

		return $input_row_wrap;
	}
}