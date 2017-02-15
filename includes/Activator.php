<?php

namespace Objectiv\Plugins\Checkout;

/**
 * Fired during plugin activation
 *
 * @link       cgd.io
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      0.1.0
 * @package    Objectiv\Plugins\Checkout
 * @author     Brandon Tassone <brandontassone@gmail.com>
 */

class Activator {

    /**
     * The admin notice option flag the admin notice function uses to determine if an admin notice needs to be displayed
     * for a plugin activation error
     *
     * @since    0.1.0
     * @access   public static
     * @var      string    $anotice_op_name    Plugin activation flag option name
     */
    public static $anotice_op_name = 'checkout-woocommerce_activation';

    /**
     * Method to be run on plugin activation.
     *
     * Place the plugin dependncy checks in relevantly named functions
     *
     * @since    0.1.0
     */
	public static function activate() {
	    // If no check fails, activate the plugin
        $activation = array();

        // Message is translated on the notice side
        if(!is_plugin_active('woocommerce/woocommerce.php')) {
            $activation[] = array(
                "success"           => false,
                "class"             => "notice error",
                "message"           => "Activation failed: Please activate Woocommerce in order to use Checkout for Woocommerce",
            );
        }

        if(!empty($activation)) {
            add_option(self::$anotice_op_name, $activation);
        }
	}

    /**
     * Method to be run on unsuccessful plugin activation. The function that generates the error admin notice for plugin
     * activation
     *
     * @since    0.1.0
     */
	public static function activate_admin_notice() {

	    global $CFW;

	    $activation_error = get_option(self::$anotice_op_name);

	    if(!empty($activation_error)) {

	        // Get rid of "Plugin Activated" message on error.
	        unset($_GET["activate"]);

	        foreach($activation_error as $error) {
	            if(!$error["success"]) {
	                // Print the error notice
                    printf("<div class='%s'><p>%s</p></div>", $error["class"], __($error["message"], 'checkout-woocommerce'));
                }
            }

            // Remove the option after all error messages displayed
            delete_option(self::$anotice_op_name);

	        // Deactivate the plugin
            deactivate_plugins($CFW->get_plugin_full_path_main_file());
        }
    }
}