<?php

namespace Objectiv\Plugins\Checkout;

/**
 * Description goes here
 *
 * @link       brandont.me
 * @since      0.1.0
 *
 * @package    Objectiv\Plugins\Checkout
 */

/**
 * Description goes here
 *
 * @since      0.1.0
 * @package    Objectiv\Plugins\Checkout
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
     * @var      string    $theme_template_directory_path    The array of sub folder and file information.
     */
    protected $template_sub_folders_and_files;

    /**
     * TemplateManager constructor.
     *
     * @param   string      $plugin_directory_path      The base directory path to the plugin
     */
    public function __construct($plugin_directory_path) {
        // Set the template directory name and join it with the plugin path
        $this->plugin_template_directory_name = "templates";
        $this->plugin_template_directory_path = $plugin_directory_path . $this->plugin_template_directory_name;

        // Set the theme template directory name and join it with the theme path
        $this->theme_template_directory_name = "cfw-templates";
        $this->theme_template_directory_path = get_template_directory() . "/" . $this->theme_template_directory_name;

        // Set the sub folder information that will be looked for regardless of the base folder
        $this->template_sub_folders_and_files = array(
            "header"    => "header.php",
            "content"   => "content.php",
            "footer"    => "footer.php"
        );
    }

    /**
     * @return string
     */
    public function get_template_sub_folders_and_files()
    {
        return $this->template_sub_folders_and_files;
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