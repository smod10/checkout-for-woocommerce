<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Core\Template;

/**
 * The template manager gathers the relevant path information for the sub folder files. The theme paths are deduced from
 * built in WordPress functions and the plugin path is passed in from the Main class on creation. The relevant path info
 * is pulled in from get_template_information. It is an array of Key Value pairs in the form of sub folder => file path
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Managers
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class TemplateManager {

	/**
	 * Holds an array of key value pairs with the key being the sub folder name and the value to be the main template
	 * piece relating to the folder. There are 3 base folders: header, content, and footer. The main files for each sub
	 * folder are aptly named
	 *
	 * @since 1.0.0
	 * @access private
	 * @var array $template_sub_folders The array of sub folder and file information.
	 */
	private $template_sub_folders = array();

	/**
	 * @since 2.0.0
	 * @acces private
	 * @var array
	 */
	private $template_info = array();

	/**
	 * @since 1.0.0
	 * @access private
	 * @var array $templates Array of Templates
	 */
	private $templates = array();

	/**
	 * since 2.0.0
	 * @access private
	 * @var array
	 */
	private $template_pieces = array();

	/**
	 * @since 1.0.0
	 * @access private
	 * @var ExtendedPathManager
	 */
	private $path_manager = null;

	/**
	 * TemplateManager constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param ExtendedPathManager $path_manager
	 * @param array $template_sub_folders
	 */
	public function __construct($path_manager, $template_sub_folders = array( "header", "content", "footer" )) {
		// Path manager for path references
		$this->path_manager = $path_manager;
		// Set the sub folder information that will be looked for regardless of the base folder
		$this->template_sub_folders = $template_sub_folders;

		$this->template_pieces = apply_filters("cfw_template_redirect_body_pieces",
			array(
				"header" => "header.php",
				"content" => "content.php",
				"footer" => "footer.php"
			)
		);

		$this->template_info = $this->get_template_information($this->template_sub_folders, $this->template_pieces);
	}

	/**
	 * Iterate over each template in the array and run the view method
	 *
	 * @since 1.0.0
	 * @param array $global_parameters
	 */
	public function load_templates($global_parameters = array()) {
		foreach($this->template_info as $template_name => $template_paths) {
			// Filter template level variables
			$parameters["template"] = apply_filters("cfw_template_{$template_name}_params", array());

			// Assign the global parameters
			$parameters["global"] = $global_parameters;

			foreach($template_paths as $template_piece_name => $template_path) {
				// Create new template
				$template = new Template($template_name, $template_path, $parameters);

				// Before the template is actually spat out
				do_action("cfw_template_load_before_{$template_name}_{$template_piece_name}");

				// Pass the parameters to the view
				$template->view();

				// After the template has been echoed out
				do_action("cfw_template_load_after_{$template_name}_{$template_piece_name}");

				// Store the template
				$this->templates[$template_name][$template_piece_name] = $template;
			}
		}
	}

	/**
	 * Determines where each sub folder file is actually located. Theme template files take precedence over plugin
	 * template files returned in the array.
	 *
	 * @since 1.1.4
	 * @access public
	 * @param array $sub_folders List of folder names within the template directories to look for template files.
	 * @param array $file_names Names of the file template pieces to look for
	 * @return array
	 */
	public function get_template_information($sub_folders, $file_names) {
		$template_information = array();

		foreach($sub_folders as $template_folder) {

			foreach($file_names as $file_piece_name => $file_name) {
				// Set up the possible paths
				$plugin_template_path = $this->path_manager->get_plugin_template(). "/" . $template_folder . "/{$file_name}";
				$theme_template_path = $this->path_manager->get_theme_template() . "/" . $template_folder . "/{$file_name}";

				// Get the template path we want (user overloaded, or base)
				$template_path = file_exists($theme_template_path) ? $theme_template_path : $plugin_template_path;

				// Add the appropriate paths to the template information array.
				$template_information[$template_folder][$file_piece_name] = $template_path;
			}
		}
		return $template_information;
	}

	/**
	 * Get the list of template sub folders
	 *
	 * @since 1.0.0
	 * @access public
	 * @return array
	 */
	public function get_template_sub_folders()
	{
		return $this->template_sub_folders;
	}

	/**
	 * Return the array of templates
	 *
	 * @since 1.0.0
	 * @access public
	 * @return array
	 */
	public function get_templates() {
		return $this->templates;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @return array
	 */
	public function get_template_info() {
		return $this->template_info;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @return array
	 */
	public function get_template_pieces() {
		return $this->template_pieces;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @return ExtendedPathManager
	 */
	public function get_path_manager() {
		return $this->path_manager;
	}
}