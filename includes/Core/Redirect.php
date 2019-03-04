<?php
namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Main;
use Objectiv\Plugins\Checkout\Managers\SettingsManager;
use Objectiv\Plugins\Checkout\Managers\ExtendedPathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;

/**
 * Class Redirect
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Brandon Tassone <brandontassone@gmail.com>
 */
class Redirect {

	/**
	 * @since 1.0.0
	 * @access public
	 *
	 * @param SettingsManager $settings_manager
	 * @param ExtendedPathManager $path_manager
	 * @param TemplateManager $template_manager
	 * @param $version
	 */
	public static function checkout($settings_manager, $path_manager, $template_manager, $version) {
		if ( apply_filters( 'cfw_load_checkout_template', Main::is_checkout() ) ) {
			/**
			 * PHP Warning / Notice Suppression
			 */
			if ( ! defined( 'CFW_DEV_MODE' ) || ! CFW_DEV_MODE ) {
				ini_set( 'display_errors', 'Off' );
            }

			/**
			 * Discourage Caching if Anyone Dares Try
			 */
			header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );
			header( 'Cache-Control: post-check=0, pre-check=0', false );
			header( 'Pragma: no-cache' );

			/**
			 * Set Checkout Constant
			 */
			wc_maybe_define_constant( 'WOOCOMMERCE_CHECKOUT', true );

			// This seems to be a 3.5 requirement
			// Ensure gateways and shipping methods are loaded early.
			WC()->payment_gateways();
			WC()->shipping();

			// When on the checkout with an empty cart, redirect to cart page
			if ( WC()->cart->is_empty() ) {
				wc_add_notice( cfw__( 'Checkout is not available whilst your cart is empty.', 'woocommerce' ), 'notice' );
				wp_redirect( wc_get_page_permalink( 'cart' ) );
				exit;
			}

			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('cfw_template_global_params', array());

			// Check cart contents for errors
			do_action( 'woocommerce_check_cart_items' );

			// Calc totals
			WC()->cart->calculate_totals();

			// Template conveniences items
			$global_template_parameters["woo"]          = \WooCommerce::instance();         // WooCommerce Instance
			$global_template_parameters["checkout"]     = WC()->checkout();                 // Checkout Object
			$global_template_parameters["cart"]         = WC()->cart;                       // Cart Object
			$global_template_parameters["customer"]     = WC()->customer;                   // Customer Object
			$global_template_parameters["css_classes"]  = self::get_css_classes();

			do_action('cfw_checkout_loaded_pre_head');

			/**
			 * Remove scripts and styles
			 *
			 * Do this at wp_head as well as wp_enqueue_scripts. This gives us two chances to win.
			 */
			add_action( 'wp_head', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'remove_styles' ), 100000 );
			add_action( 'wp_head', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'remove_scripts' ), 100000 );
			add_action( 'wp_enqueue_scripts', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'remove_styles' ), 100000 );
			add_action( 'wp_enqueue_scripts', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'remove_scripts' ), 100000 );

			// Setup default cfw_wp_head actions
			add_action( 'cfw_wp_head', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'output_meta_tags' ), 10, 4 );
			add_action( 'cfw_wp_head', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'output_custom_scripts' ), 20, 4 );
			add_action( 'cfw_wp_head', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'output_page_title' ), 30, 4 );
			add_action( 'cfw_wp_head', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'output_wp_styles' ), 30, 4 );
			add_action( 'cfw_wp_head', array( 'Objectiv\Plugins\Checkout\Core\Redirect', 'output_custom_styles' ), 40, 5 );

			$css_classes = array('checkout-wc', 'woocommerce', $template_manager->get_selected_template());

			// Output the contents of the <head></head> section
			self::head($path_manager, $version, apply_filters('cfw_body_classes', $css_classes), $settings_manager, $template_manager);

			// Output the contents of the <body></body> section
			self::body($template_manager, $global_template_parameters, $settings_manager);

			// Output a closing </body> and closing </html> tag
			self::footer($path_manager, $settings_manager);

			// Exit out before WordPress can do anything else
			exit;
		}
	}

	/**
	 * Initial classes for visibility states
	 *
	 * @return string
	 */
	public static function get_css_classes() {
		$css_classes = [];

		if(!WC()->cart->needs_payment()) {
			$css_classes[] = "cfw-payment-false";
		}

		if(!WC()->cart->needs_shipping_address()) {
			$css_classes[] = "cfw-shipping-address-false";
		}

		return implode(" ", $css_classes);
	}

	/**
	 * @since 1.0.0
	 * @access public
	 */
	public static function title_block() {
		// We use this instead of _wp_render_title_tag because it requires the theme support title-tag capability.
		echo '<title>' . wp_get_document_title() . '</title>' . "\n";
	}

	public static function wp_styles() {
		wp_print_styles();
    }

	/**
	 * @since 1.0.0
	 * @access public
	 *
	 * @param ExtendedPathManager $path_manager
	 * @param string $version
	 * @param array $classes
	 * @param SettingsManager $settings_manager
	 * @param TemplateManager $template_manager
	 */
	public static function head($path_manager, $version, $classes, $settings_manager, $template_manager) {
		$classes[] = (wp_is_mobile()) ? "wp-is-mobile" : "";
		?>
		<!DOCTYPE html>
		<html <?php language_attributes(); ?>>
		<head>
			<?php self::cfw_wp_head($path_manager, $version, $classes, $settings_manager, $template_manager); ?>
		</head>
		<body class="<?php echo implode(" ", $classes); ?>">
		<?php
	}

	/**
	 *
	 */
	public static function output_meta_tags() {
		?>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width">
		<?php
	}

	/**
	 * @param ExtendedPathManager $path_manager
	 * @param string $version
	 * @param array $classes
	 * @param SettingsManager $settings_manager
	 */
	public static function output_custom_scripts($path_manager, $version, $classes, $settings_manager) {
		echo $settings_manager->get_setting('header_scripts');
	}

	/**
	 * @param ExtendedPathManager $path_manager
	 * @param string $version
	 * @param array $classes
	 * @param SettingsManager $settings_manager
	 */
	public static function output_page_title() {
		self::title_block();
	}

	public static function output_wp_styles() {
		self::wp_styles();
    }

	/**
	 * @param ExtendedPathManager $path_manager
	 * @param string $version
	 * @param array $classes
	 * @param SettingsManager $settings_manager
	 * @param TemplateManager $template_manager
	 */
	public static function output_custom_styles($path_manager, $version, $classes, $settings_manager, $template_manager) {
		// Get logo attachment ID if available
		$logo_attachment_id = $settings_manager->get_setting('logo_attachment_id');
		$active_theme = $template_manager->get_selected_template();
		$templates_information = $template_manager->get_templates_information();
		$supports = ! empty( $templates_information[ $active_theme ][ 'stylesheet_info' ][ 'Supports' ] ) ? array_map('trim', explode(',', $templates_information[ $active_theme ][ 'stylesheet_info' ][ 'Supports' ] ) ) : array();
		?>
		<style>
            <?php if ( in_array( 'header-background', $supports ) ): ?>
                #cfw-header {
                    background: <?php echo $settings_manager->get_setting('header_background_color', array($active_theme) ); ?>;

                    <?php if ( strtolower( $settings_manager->get_setting('header_background_color', array($active_theme) ) ) !== "#ffffff" ): ?>
                    margin-bottom: 2em;
                    <?php endif; ?>
                }
            <?php endif; ?>

            <?php if ( in_array( 'footer-background', $supports ) ): ?>
                #cfw-footer {
                    color: <?php echo $settings_manager->get_setting('footer_color', array($active_theme) ); ?>;
                    background: <?php echo $settings_manager->get_setting('footer_background_color', array($active_theme) ); ?>;

                    <?php if ( strtolower( $settings_manager->get_setting('footer_background_color', array($active_theme) ) ) !== "#ffffff" ): ?>
                    margin-top: 2em;
                    <?php endif; ?>
                }
			<?php endif; ?>

            <?php if ( in_array( 'summary-background', $supports ) ): ?>
                #cfw-cart-details:before {
                    background: <?php echo $settings_manager->get_setting('summary_background_color', array($active_theme) ); ?>;
                }
            <?php endif; ?>

			#cfw-cart-details-arrow {
				color: <?php echo $settings_manager->get_setting('link_color', array($active_theme) ); ?> !important;
				fill: <?php echo $settings_manager->get_setting('link_color', array($active_theme) ); ?> !important;
			}
			.cfw-link, .woocommerce-remove-coupon {
				color: <?php echo $settings_manager->get_setting('link_color', array($active_theme) ); ?> !important;
			}

            .cfw-bottom-controls .cfw-primary-btn, .place-order .cfw-primary-btn {
				background-color: <?php echo $settings_manager->get_setting('button_color', array($active_theme) ); ?>;
				color: <?php echo $settings_manager->get_setting('button_text_color', array($active_theme) ); ?>;
			}

			.cfw-def-action-btn {
				background-color: <?php echo $settings_manager->get_setting('secondary_button_color', array($active_theme) ); ?>;
				color: <?php echo $settings_manager->get_setting('secondary_button_text_color', array($active_theme) ); ?>;
			}

			<?php if ( ! empty($logo_attachment_id) ): ?>
			.cfw-logo .logo {
				background: transparent url( <?php echo wp_get_attachment_url($logo_attachment_id); ?> ) no-repeat;
				background-size: contain;
                background-position: left center;
			}
			<?php else: ?>
			.cfw-logo .logo {
                <?php if ( in_array( 'header-background', $supports ) ): ?>
				background: <?php echo $settings_manager->get_setting('header_background_color', array($active_theme) ); ?>;
				<?php endif; ?>
				height: auto !important;
				width: auto;
				margin: 20px auto;
				color: <?php echo $settings_manager->get_setting('header_text_color', array($active_theme) ); ?>;
			}
			.cfw-logo .logo:after {
				content: "<?php echo get_bloginfo( 'name' ); ?>";
				font-size: 2em;
			}
			<?php endif; ?>

            .cfw-input-wrap > input[type="text"]:focus, .cfw-input-wrap > input[type="email"]:focus, .cfw-input-wrap > input[type="tel"]:focus, .cfw-input-wrap > input[type="number"]:focus, .cfw-input-wrap > input[type="password"]:focus, .cfw-input-wrap select:focus {
                box-shadow: 0 0 0 2px <?php echo $settings_manager->get_setting('button_color', array($active_theme) ); ?>;
            }

			.woocommerce-info {
				padding: 1em 1.618em;
				margin-bottom: 1.3em;
				background-color: <?php echo $settings_manager->get_setting('secondary_button_color', array($active_theme) ); ?>;
				margin-left: 0;
				border-radius: 2px;
				color: #fff;
				clear: both;
				border-left: .6180469716em solid rgba(0, 0, 0, 0.15);
                box-sizing: border-box;
                width: 100%;
                display: inline-block;
			}
			.woocommerce-info a {
				color: #fff;
			}

			.woocommerce-info .button:hover {
				opacity: 1;
			}

			.woocommerce-info .button {
				float: right;
				padding: 0;
				background: none;
				color: #fff;
				box-shadow: none;
				line-height: 1.3em;
				padding-left: 1em;
				border-width: 0;
				border-left-width: 1px;
				border-left-style: solid;
				border-left-color: rgba(255, 255, 255, 0.25) !important;
				border-radius: 0;
			}

			.woocommerce-info .button:hover {
				background: none;
				color: #fff;
				opacity: 0.7;
				cursor: pointer;
			}

			.woocommerce-info pre {
				background-color: rgba(0,0,0,.1);
			}
			<?php echo $settings_manager->get_setting('custom_css', array($active_theme) ); ?>;
		</style>
		<?php
	}

	/**
	 * @param ExtendedPathManager $path_manager
	 * @param string $version
	 * @param array $classes
	 * @param SettingsManager $settings_manager
	 * @param TemplateManager $template_manager
	 */
	public static function cfw_wp_head($path_manager, $version, $classes, $settings_manager, $template_manager) {
	    // Make sure gateways load before we call wp_head()
		WC()->payment_gateways->get_available_payment_gateways();
		\WC_Payment_Gateways::instance();

		wp_head();
	    do_action_ref_array( 'cfw_wp_head', array($path_manager, $version, $classes, $settings_manager, $template_manager) );
	}

	/**
	 * Remove specifically excluded styles
	 */
	public static function remove_styles() {
		$blocked_style_handles = apply_filters('cfw_blocked_style_handles', array() );

		foreach ( $blocked_style_handles as $blocked_style_handle ) {
			wp_dequeue_style( $blocked_style_handle );
            wp_deregister_style( $blocked_style_handle );
        }
	}

    /**
     * Remove specifically excluded scripts
     */
	public static function remove_scripts() {
		$blocked_script_handles = apply_filters('cfw_blocked_script_handles', array() );

		foreach ( $blocked_script_handles as $blocked_script_handle ) {
			wp_dequeue_script( $blocked_script_handle );
			wp_deregister_script( $blocked_script_handle );
		}
    }

	/**
	 * @since 1.0.0
	 * @access public
	 * @param TemplateManager $template_manager
	 * @param array $global_template_parameters
	 * @param SettingsManager $settings_manager
	 */
	public static function body($template_manager, $global_template_parameters, $settings_manager) {
		// Fire off an action before we load the template pieces
		do_action('cfw_template_before_load');

		$settings_selected_template = $settings_manager->get_setting('templates_list');
		$is_old_theme = $template_manager->is_old_theme();
		$use_old_template_loader = false;

		if ( $is_old_theme ) {
			$use_old_template_loader = true;
		}

		if ( ! $use_old_template_loader ) {
		    // Load the template pieces
		    $template_manager->load_templates( $global_template_parameters );
		} else {
			// TODO: Remove in version 3.0.0
			$template_manager->load_old_templates( $template_manager->get_old_template_information( $template_manager->get_old_theme_folders() ), $global_template_parameters );
		}

		// Fire off an action after we load the template pieces
		do_action('cfw_template_after_load', array(Template::get_i()) );
	}

	/**
	 * @since 1.0.0
	 * @access public
	 *
	 * @param ExtendedPathManager $path_manager
	 * @param SettingsManager $settings_manager
	 */
	public static function footer($path_manager, $settings_manager) {
		do_action('cfw_wp_footer_before_scripts');

		// Prevent themes and plugins from injecting HTML on wp_footer
		echo '<div id="wp_footer">';
		wp_footer();
		echo "</div>";

		echo $settings_manager->get_setting('footer_scripts');

		do_action('cfw_wp_footer');
		?>
		</body>
		</html>
		<?php
	}
}
