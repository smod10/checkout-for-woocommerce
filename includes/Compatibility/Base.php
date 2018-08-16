<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

abstract class Base {
	/**
	 * Base constructor.
	 */
	public function __construct() {
		if ( $this->is_available() ) {
			// Allow scripts and styles for certain plugins
			add_filter('cfw_allowed_script_handles', array($this, 'allowed_scripts'), 10, 1 );
			add_filter('cfw_allowed_style_handles', array($this, 'allowed_styles'), 10, 1 );

			$this->run();
		}
	}

	/***
	 * Kick-off everything here
	 */
	function run() {
		// Silence be golden
	}

	/**
	 * Is dependency for this compatibility class available?
	 *
	 * @return bool
	 */
	function is_available() {
		return false;
	}

	/**
	 * Array of allowed script handles.
	 *
	 * @param $scripts
	 *
	 * @return mixed
	 */
	function allowed_scripts( $scripts ) {
		return $scripts;
	}

	/**
	 * Array of allowed style handles.
	 *
	 * @param $styles
	 *
	 * @return mixed
	 */
	function allowed_styles( $styles ) {
		return $styles;
	}

	/**
	 * For gateways that add buttons above checkout form
	 *
	 * @param string $class
	 */
	function add_separator( $class = '' ) {
	    if ( ! defined('CFW_PAYMENT_BUTTON_SEPARATOR') ) {
		    define('CFW_PAYMENT_BUTTON_SEPARATOR', true);
        } else {
	        return;
        }
		?>
		<div class="<?php echo $class; ?>">
			<p class="pay-button-separator">
				<span><?php esc_html_e( 'Or', 'checkout-wc' ); ?></span>
			</p>
		</div>
		<?php
	}
}