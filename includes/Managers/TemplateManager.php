<?php

namespace Objectiv\Plugins\Checkout\Managers;

use Objectiv\Plugins\Checkout\Core\Template;

/**
 * The template manager gathers the relevant path information for the sub folder files. The theme paths are deduced from
 * built in WordPress functions and the plugin path is passed in from the Main class on creation. The relevant path info
 * is pulled in from get_template_information. It is an array of Key Value pairs in the form of sub folder => file path
 *
 * @link cgd.io
 * @since 0.1.0
 * @package Objectiv\Plugins\Checkout\Managers
 * @author Brandon Tassone <brandontassone@gmail.com>
 */

class TemplateManager {

	/**
	 * Holds an array of key value pairs with the key being the sub folder name and the value to be the main template
	 * piece relating to the folder. There are 3 base folders: header, content, and footer. The main files for each sub
	 * folder are aptly named
	 *
	 * @since 0.1.0
	 * @access private
	 * @var array $template_sub_folders The array of sub folder and file information.
	 */
	private $template_sub_folders = array();

	/**
	 * @since 0.1.0
	 * @access private
	 * @var array $templates Array of Templates
	 */
	private $templates = array();

	/**
	 * TemplateManager constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param array $template_sub_folders
	 */
	public function __construct($template_sub_folders = array( "header", "content", "footer" )) {
		// Set the sub folder information that will be looked for regardless of the base folder
		$this->template_sub_folders = $template_sub_folders;
	}

	/**
	 * Iterate over each template in the array and run the view method
	 *
	 * @since 0.1.0
	 * @param array $template_info
	 * @param array $global_parameters
	 */
	public function load_templates($template_info, $global_parameters) {

		foreach($template_info as $template_name => $template_path) {
			// Filter template level variables
			$parameters["template"] = apply_filters("cfw_template_{$template_name}_params", array());

			// Assign the global parameters
			$parameters["global"] = $global_parameters;

			// Create new template
			$template = new Template($template_name, $template_path, $parameters);

			// Before the template is actually spat out
			do_action("cfw_template_load_before_{$template_name}");

			// Pass the parameters to the view
			$template->view();

			// After the template has been echoed out
			do_action("cfw_template_load_after_{$template_name}");

			// Store the template
			$this->templates[$template_name] = $template;
		}
	}

	/**
	 * Get the list of template sub folders
	 *
	 * @since 0.1.0
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
	 * @since 0.1.0
	 * @access public
	 * @return array
	 */
	public function get_templates() {
		return $this->templates;
	}
}