<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Main;
use Objectiv\Plugins\Checkout\Core\Template;

/**
 * The template manager is responsible for the template paths
 *
 * @link       cgd.io
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout\Managers
 */

/**
 * The template manager gathers the relevant path information for the sub folder files. The theme paths are deduced from
 * built in wordpress functions and the plugin path is passed in from the Main class on creation. The relevant path info
 * is pulled in from get_template_information. It is an array of Key Value pairs in the form of sub folder => file path
 *
 * @since      0.1.0
 * @package    Objectiv\Plugins\Checkout\Managers
 * @author     Brandon Tassone <brandontassone@gmail.com>
 */

class TemplateManager {

    /**
     * The name of the plugin template directory folder
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $plugin_template_directory_name    The name of the plugin template directory folder
     */
    protected $plugin_template_directory_name;

    /**
     * The full path of the template folder located in the plugin folder
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $plugin_template_directory_path    The full path of the template folder located in the plugin folder
     */
    protected $plugin_template_directory_path;

    /**
     * The name of the theme template folder the template manager checks to find
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $theme_template_directory_name    The name of the theme template directory
     */
    protected $theme_template_directory_name;

    /**
     * The full path to the template directory located in the theme folder
     *
     * @since    0.1.0
     * @access   protected
     * @var      string    $theme_template_directory_path    The path of the template folder in the theme folder
     */
    protected $theme_template_directory_path;

    /**
     * Holds an array of key value pairs with the key being the sub folder name and the value to be the main template
     * piece relating to the folder. There are 3 base folders: header, content, and footer. The main files for each sub
     * folder are aptly named
     *
     * @since    0.1.0
     * @access   protected
     * @var      array    $template_sub_folders    The array of sub folder and file information.
     */
    protected $template_sub_folders;

    /**
     * @var     array       $templates      Array of Templates
     */
    protected $templates;

    /**
     * TemplateManager constructor.
     */
    public function __construct() {
        // Set the template directory name and join it with the plugin path
        $this->plugin_template_directory_name = "templates";
        $this->plugin_template_directory_path = Main::instance()->get_path_manager()->get_base() . $this->plugin_template_directory_name;

        // Set the theme template directory name and join it with the theme path
        $this->theme_template_directory_name = "checkout";
        $this->theme_template_directory_path = get_template_directory() . "/" . $this->theme_template_directory_name;

        // Set the sub folder information that will be looked for regardless of the base folder
        $this->template_sub_folders = array("header", "content", "footer");
        $this->templates = array();

        // Generate the template objects
        $this->create_templates();
    }

    /**
     * Generates the template objects based on the order listed in the template_sub_folders array.
     */
    public function create_templates() {
        foreach($this->get_template_information() as $template_name => $template_path_info) {
        	$template_path = $template_path_info["template"];
        	$template_function_path = $template_path_info["function"];

        	$template_file_info = require_once $template_function_path;

        	$template_parameters = $template_file_info["parameters"];
        	$template_callback = $template_file_info["callback"];

        	$this->templates[$template_name] = new Template($template_path, $template_callback, $template_parameters);
        }
    }

	/**
	 * Iterate over each template in the array and run the view method
	 */
    public function load_templates() {
    	foreach($this->templates as $template) {
    		$template->view();
	    }
    }

    /**
     * Determines where each sub folder file is actually located. Theme template files take precedence over plugin
     * template files returned in the array.
     *
     * @return array
     */
    public function get_template_information() {
        $template_information = array();

        foreach($this->template_sub_folders as $sub_folder) {

        	// Set up the possible paths
            $plugin_template_test = $this->plugin_template_directory_path . "/" . $sub_folder . "/template.php";
            $theme_template_test = $this->theme_template_directory_path . "/" . $sub_folder . "/template.php";

            // Add the appropriate paths to the template information array.
            $template_information[$sub_folder] = array(
            	"template" => file_exists($theme_template_test) ? $theme_template_test : $plugin_template_test,
                "function" => $this->plugin_template_directory_path . "/" . $sub_folder . "/function.php"
            );
        }
        return $template_information;
    }

	/**
	 * @return array
	 */
	public function get_templates() {
		return $this->templates;
	}

    /**
     * @return string
     */
    public function get_template_sub_folders()
    {
        return $this->template_sub_folders;
    }

    /**
     * @return string
     */
    public function get_plugin_template_directory_name()
    {
        return $this->plugin_template_directory_name;
    }

    /**
     * @return string
     */
    public function get_plugin_template_directory_path()
    {
        return $this->plugin_template_directory_path;
    }

    /**
     * @return string
     */
    public function get_theme_template_directory_name()
    {
        return $this->theme_template_directory_name;
    }

    /**
     * @return string
     */
    public function get_theme_template_directory_path()
    {
        return $this->theme_template_directory_path;
    }
}