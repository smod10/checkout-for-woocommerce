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
	 * @since 2.0.0
	 * @access private
	 * @var string
	 */
	private $selected_template = '';

	/**
	 * TemplateManager constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param ExtendedPathManager $path_manager
	 * @param string $selected_template
	 * @param array $body_pieces
	 */
	public function __construct(
		$path_manager,
		$selected_template = 'default',
		$body_pieces = array(
		"header" => "header.php",
		"content" => "content.php",
		"footer" => "footer.php"
	)) {
		// Path manager for path references
		$this->path_manager = $path_manager;

		$this->selected_template = $selected_template;

		$this->template_pieces = apply_filters("cfw_template_redirect_body_pieces", $body_pieces );
	}

	/**
	 * Iterate over each template in the array and run the view method
	 *
	 * @since 1.0.0
	 * @param array $global_parameters
	 */
	public function load_templates($global_parameters = array()) {
		foreach($this->get_template_information() as $template_name => $template_paths) {
			// Filter template level variables
			$parameters["template"] = apply_filters("cfw_template_{$template_name}_params", array());

			// Assign the global parameters
			$parameters["global"] = $global_parameters;

			// Only output the selected template
			if($template_name == $this->selected_template) {

				foreach ( $template_paths as $template_piece_name => $template_path ) {
					// Create new template
					$template = new Template( $template_name, $template_path, $parameters );

					// Before the template is actually spat out
					do_action( "cfw_template_load_before_{$template_name}_{$template_piece_name}" );

					// Pass the parameters to the view
					$template->view();

					// After the template has been echoed out
					do_action( "cfw_template_load_after_{$template_name}_{$template_piece_name}" );

					// Store the template
					$this->templates[ $template_name ][ $template_piece_name ] = $template;
				}
			}
		}
	}

	/**
	 * Determines where each sub folder file is actually located. Theme template files take precedence over plugin
	 * template files returned in the array.
	 *
	 * @since 1.1.4
	 * @access public
	 * @return array
	 */
	public function get_template_information() {
		$template_information = array();

		foreach($this->get_template_sub_folders() as $template_folder) {

			foreach($this->template_pieces as $file_piece_name => $file_name) {
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
		$plugin_defined_templates = array('default', 'fakeify');
		$user_defined_templates = array();

		return array_merge($plugin_defined_templates, $user_defined_templates);
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

	/**
	 * @return string
	 */
	public function getSelectedTemplate() {
		return $this->selected_template;
	}
}