<?php
namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Managers\AssetsManager;
use Objectiv\Plugins\Checkout\Managers\PathManager;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Main;

class Redirect {
	/**
	 * @param PathManager $pm
	 * @param TemplateManager $tm
	 * @param AssetsManager $am
	 * @param $version
	 */
	public static function checkout($pm, $tm, $am, $version) {
		if( function_exists('is_checkout') && is_checkout() ) {
			// Allow global parameters accessible by the templates
			$global_template_parameters = apply_filters('cfw_template_global_params', array());

			// Template conveniences items
			$global_template_parameters["woo"]          = \WooCommerce::instance();         // WooCommerce Instance
			$global_template_parameters["checkout"]     = WC()->checkout();                 // Checkout Object
            $global_template_parameters["cart"]         = WC()->cart;          // Cart Object

			// Output the default html start template with starting <head> tag
			Redirect::start();

			// Output the contents of the <head></head> section
			Redirect::head($pm, $am, $version);

			// Output the default middle template which outputs the closing </head> tag and outputs a <body> tag
			Redirect::middle(["cfw"]);

			// Output the contents of the <body></body> section
			Redirect::body($pm, $tm, $global_template_parameters);

			// Output a closing </body> and closing </html> tag
			Redirect::end();

			// Exit out before WordPress can do anything else
			exit;
		}
	}

	/**
	 * @param PathManager $pm
	 * @param AssetsManager $am
	 * @param string $version
	 */
	public static function head($pm, $am, $version) {
		// Fire off an action before the default loading of styles and scripts
		do_action('cfw_assets_before_assets');

		// Load the front end assets
		$am->load_assets($version, "front");

		// Fire off an action after the default loading of styles and scripts
		do_action('cfw_assets_after_assets');
	}

	/**
	 * @param PathManager $pm
	 * @param TemplateManager $tm
	 * @param array $gtp
	 */
	public static function body($pm, $tm, $gtp) {
		// Fire off an action before we load the template pieces
		do_action('cfw_template_before_load');

		// Load the template pieces
		$tm->load_templates($pm->get_template_information($tm->get_template_sub_folders()), $gtp);

		// Fire off an action after we load the template pieces
		do_action('cfw_template_after_load', array(Template::get_i()) );
	}

	/**
	 * @since 0.1.0
	 */
	public static function start() {
		?>
		<!DOCTYPE html>
		<head>
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,400i,500,500i,700,900" rel="stylesheet">
		<?php
	}

	/**
	 * @since 0.1.0
	 * @param $classes
	 */
	public static function middle($classes = array()) {
	    $min = (!CO_DEV_MODE) ? ".min" : "";
		?>
        <script>
	        requirejs.config({
		        baseUrl : '<?php echo get_site_url(); ?>' + '/wp-content/plugins/checkout-woocommerce/assets/front/js/',
		        bundles: {
			        'checkout-woocommerce-front<?php echo $min; ?>': ['Main', 'Elements/TabContainer', 'Elements/TabContainerBreadcrumb', 'Elements/TabContainerSection']
		        }
	        });

	        function init() {
		        require(['Main', 'Elements/TabContainer', 'Elements/TabContainerBreadcrumb', 'Elements/TabContainerSection'],
			        function(Main, TabContainer, TabContainerBreadcrumb, TabContainerSection){

				        // Require wraps objects for some reason in bundles
				        Main = Main.Main;
				        TabContainer = TabContainer.TabContainer;
				        TabContainerBreadcrumb = TabContainerBreadcrumb.TabContainerBreadcrumb;
				        TabContainerSection = TabContainerSection.TabContainerSection;

				        var tabContainerBreadcrumb = new TabContainerBreadcrumb($("#cfw-breadcrumb"));
				        var tabContainerSections = [
					        new TabContainerSection($("#cfw-customer-info"), "customer_info"),
					        new TabContainerSection($("#cfw-shipping-method"), "shipping_method"),
					        new TabContainerSection($("#cfw-payment-method"), "payment_method")
				        ];
				        var tabContainer = new TabContainer($("#cfw-tab-container"), tabContainerBreadcrumb, tabContainerSections);
                        var ajaxInfo = {
                            admin_url: new URL('<?php echo admin_url('admin-ajax.php'); ?>'),
                            nonce: '<?php echo wp_create_nonce("some-seed-word"); ?>'
                        };

				        var main = new Main( tabContainer, ajaxInfo );
				        main.setup();
			        });
            }
        </script>
		</head>
		<body class="<?php echo implode(" ", $classes); ?>" onload="init()">
		<?php
	}

	/**
	 * @since 0.1.0
	 */
	public static function end() {
		?>
		</body>
		</html>
		<?php
	}
}