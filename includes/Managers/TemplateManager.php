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
	 * @var array $template_pieces
	 */
	private $template_pieces = array();

	/**
	 * @since 1.0.0
	 * @access private
	 * @var ExtendedPathManager $path_manager
	 */
	private $path_manager = null;

	/**
	 * @since 2.0.0
	 * @access private
	 * @var string $selected_template
	 */
	private $selected_template = '';

	/**
	 * @since 2.0.0
	 * @access private
	 * @var string $theme_style_filename
	 */
	private $theme_style_filename = 'style';

	/**
	 * @since 2.0.0
	 * @access private
	 * @var string $theme_javascript_filename
	 */
	private $theme_javascript_filename = "theme";

	/**
	 * @since 2.0.0
	 * @access private
	 * @static
	 * @var array $default_headers
	 */
	public static $default_headers = array(
		'Name'          => 'Template Name',
		'TemplateURI'      => 'Template URI',
		'Description'   => 'Description',
		'Author'        => 'Author',
		'AuthorURI'     => 'Author URI',
		'Version'       => 'Version',
		'Capabilities'  => 'Capabilities'
	);

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

		$this->theme_style_filename = apply_filters("cfw_template_theme_style_filename", $this->theme_style_filename);

		$this->theme_javascript_filename = apply_filters("cfw_template_theme_javascript_filename", $this->theme_javascript_filename);
	}

	/**
	 * Iterate over each template in the array and run the view method
	 *
	 * @since 1.0.0
	 * @param array $global_parameters
	 */
	public function load_templates($global_parameters = array()) {
		foreach($this->get_template_information() as $template_name => $template_info) {
			// Filter template level variables
			$parameters["template"] = apply_filters("cfw_template_{$template_name}_params", array());

			// Assign the global parameters
			$parameters["global"] = $global_parameters;

			// Only output the selected template
			if($template_name == $this->selected_template) {

				foreach ( $template_info["paths"] as $template_piece_name => $template_path ) {
					// Create new template
					$template = new Template( $template_name, $template_path, $parameters );

					// Before the template is actually spat out
					do_action( "cfw_template_load_before_{$template_name}_{$template_piece_name}" );

					// Pass the parameters to the view
					$template->view();

					// After the template has been echoed out
					do_action( "cfw_template_load_after_{$template_name}_{$template_piece_name}" );

					// Store the template
					$this->templates[$template_name][$template_piece_name] = $template;
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

			$plugin_template_base_path = $this->path_manager->get_plugin_template(). "/" . $template_folder;
			$theme_template_base_path = $this->path_manager->get_theme_template() . "/" . $template_folder;

			$base_path = $plugin_template_base_path;
			$base_url_path = $this->path_manager->get_plugin_template_url() . "/" . $template_folder;

			if(file_exists($theme_template_base_path)) {
				$base_path = $theme_template_base_path;
				$base_url_path = $this->path_manager->get_theme_template_url() . "/" . $template_folder;
			}

			$stylesheet_file_path = $this->get_generated_file_info($base_path, $this->get_theme_style_filename(), "css")["path"];
			$stylesheet_comment_data = $this->get_stylesheet_comment_data($stylesheet_file_path, $template_folder);

			$template_information[$template_folder]["base_path"] = $base_path;
			$template_information[$template_folder]["base_url_path"] = $base_url_path;
			$template_information[$template_folder]["stylesheet_info"] = $stylesheet_comment_data;
			$template_information[$template_folder]["paths"] = array();

			foreach($this->template_pieces as $file_piece_name => $file_name) {
				// Set up the possible paths
				$template_path = $base_path . "/{$file_name}";

				// Add the appropriate paths to the template information array.
				$template_information[$template_folder]["paths"][$file_piece_name] = $template_path;
			}
		}

		d($template_information);

		return $template_information;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @param string $base_path
	 * @param string $filename
	 * @param string $extension
	 *
	 * @return array
	 */
	public function get_generated_file_info($base_path, $filename, $extension) {
		$path = "";
		$is_min = false;
		$non_min_path = "{$base_path}/{$filename}.{$extension}";
		$min_path = "{$base_path}/{$filename}.min.{$extension}";

		if(file_exists($min_path)) {
			$is_min = true;
			$path = $min_path;
		} else if(file_exists($non_min_path)) {
			$path = $non_min_path;
		}

		return array(
			"path" => $path,
			"is_min" => $is_min
		);
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @param string $stylesheet_path
	 * @param string $template_folder
	 *
	 * @return array
	 */
	public function get_stylesheet_comment_data($stylesheet_path, $template_folder) {
		$comment_data = get_file_data($stylesheet_path, self::$default_headers);

		$comment_data["Name"] = ($comment_data["Name"] == "") ? ucfirst($template_folder) : $comment_data["Name"];

		return $comment_data;
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
		$plugin_defined_templates = array('default', 'gotham');
		$user_defined_templates = array();

		// Search the theme checkout-wc templates
		foreach(glob("{$this->path_manager->get_theme_template()}/*", GLOB_ONLYDIR) as $dir) {
			$user_defined_templates[] = basename($dir);
		}

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
	public function get_theme_style_filename() {
		return $this->theme_style_filename;
	}

	/**
	 * @return string
	 */
	public function get_theme_javascript_filename() {
		return $this->theme_javascript_filename;
	}
}