<?php

namespace Objectiv\Plugins\Checkout\Compatibility;

abstract class Base {
	/**
	 * Base constructor.
	 */
	public function __construct() {
	    $this->pre_init();

	    add_action( 'init', array( $this, 'compat_init') );
	}

	/**
	 * Run after init (normative use case)
	 */
	function compat_init() {
		if ( $this->is_available() ) {
			// Allow scripts and styles for certain plugins
			add_filter( 'cfw_allowed_script_handles', array( $this, 'allowed_scripts' ), 10, 1 );
			add_filter( 'cfw_allowed_style_handles', array( $this, 'allowed_styles' ), 10, 1 );
			add_filter( 'cfw_typescript_compatibility_classes_and_params', array( $this, 'typescript_class_and_params' ), 10, 1 );

			$this->run();
		}
    }

	/**
	 * Allow some things to be run before init
	 */
	public function pre_init() {
        // Silence is golden
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
	 * @param array $compatibility
	 *
	 * @return array
	 */
	function typescript_class_and_params( $compatibility ) {
		return $compatibility;
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
	 * @param string $id
	 * @param string $style
	 */
	function add_separator( $class = '', $id = '', $style = '' ) {
		if ( ! defined( 'CFW_PAYMENT_BUTTON_SEPARATOR' ) ) {
			define( 'CFW_PAYMENT_BUTTON_SEPARATOR', true );
		} else {
			return;
		}
		?>
		<div class="<?php echo $class; ?>" style="padding-top: 1em;">
			<p <?php echo ( $id ) ? "id='{$id}'" : ''; ?> <?php echo ( $style ) ? "style='{$style}'" : ''; ?> class="pay-button-separator">
				<span><?php esc_html_e( 'Or', 'checkout-wc' ); ?></span>
			</p>
		</div>
		<?php
	}
}
