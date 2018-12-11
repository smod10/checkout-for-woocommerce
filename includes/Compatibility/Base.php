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
			add_filter( 'cfw_blocked_style_handles', array( $this, 'remove_theme_styles' ), 10, 1 );
			add_filter( 'cfw_blocked_style_handles', array( $this, 'remove_styles' ), 10, 1 );
			add_filter( 'cfw_blocked_script_handles', array( $this, 'remove_theme_scripts' ), 10, 1 );
			add_filter( 'cfw_blocked_script_handles', array( $this, 'remove_scripts' ), 10, 1 );
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
	 * @param $styles array Array of handles to remove from styles queue.
	 *
	 * @return mixed
	 */
	function remove_styles( $styles ) {
		return $styles;
	}

	/**
	 * Add WP theme styles to list of blocked style handles.
	 *
	 * @param $styles
	 *
	 * @return mixed
	 */
	function remove_theme_styles( $styles ) {
		global $wp_styles;

		foreach ( $wp_styles->registered as $wp_style ) {
			if ( ! empty($wp_style->src) && stripos( $wp_style->src, '/themes/') !== false && stripos( $wp_style->src, '/checkout-wc/' ) === false ) {
				$styles[] = $wp_style->handle;
			}
		}

		return $styles;
	}

	/**
	 * @param $scripts array Array of handles to remove from scripts queue.
     *
     * @return mixed
	 */
    function remove_scripts( $scripts ) {
	    return $scripts;
    }

	/**
	 * Add WP theme styles to list of blocked style handles.
	 *
	 * @param $styles
	 *
	 * @return mixed
	 */
	function remove_theme_scripts( $scripts ) {
		global $wp_scripts;

		foreach ( $wp_scripts->registered as $wp_script ) {
			if ( ! empty($wp_script->src) && stripos( $wp_script->src, '/themes/') !== false && stripos( $wp_script->src, '/checkout-wc/' ) === false ) {
				$scripts[] = $wp_script->handle;
            }
		}

		return $scripts;
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
		<div id="payment-info-separator-wrap" class="<?php echo $class; ?>" style="padding-top: 1em;">
			<p <?php echo ( $id ) ? "id='{$id}'" : ''; ?> <?php echo ( $style ) ? "style='{$style}'" : ''; ?> class="pay-button-separator">
				<span><?php esc_html_e( 'Or', 'checkout-wc' ); ?></span>
			</p>
		</div>
		<?php
	}
}
