<?php

namespace Objectiv\Plugins\Checkout\Managers;

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
	private $template_sub_folders;

	/**
	 * @since 0.1.0
	 * @access private
	 * @var array $templates Array of Templates
	 */
	private $templates;

	/**
	 * TemplateManager constructor.
	 *
	 * @since 0.1.0
	 * @access public
	 */
	public function __construct() {
		// Set the sub folder information that will be looked for regardless of the base folder
		$this->template_sub_folders = array(
			"header"    => 'Objectiv\Plugins\Checkout\Core\Templates\HeaderTemplate',
			"content"   => 'Objectiv\Plugins\Checkout\Core\Templates\ContentTemplate',
			"footer"    => 'Objectiv\Plugins\Checkout\Core\Templates\FooterTemplate'
		);
		$this->templates = array();
	}

	/**
	 * Generates the template objects based on the order listed in the template_sub_folders array.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param PathManager $path_manager
	 */
	public function create_templates($path_manager) {
		foreach($path_manager->get_template_information(array_keys($this->template_sub_folders)) as $template_name => $template_path_info) {
			$template_path = $template_path_info["template"];
			$class = $this->template_sub_folders[$template_name];

			$this->templates[$template_name] = new $class($template_path);
		}
	}

	/**
	 * Iterate over each template in the array and run the view method
	 *
	 * @since 0.1.0
	 * @access public
	 * @param array $global_parameters
	 */
	public function load_templates($global_parameters) {
		foreach($this->templates as $template) {
			$template->view($global_parameters);
		}
	}

	/**
	 * Get the list of template sub folders
	 *
	 * @since 0.1.0
	 * @access public
	 * @return string
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