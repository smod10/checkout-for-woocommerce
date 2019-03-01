<?php

namespace Objectiv\Plugins\Checkout\Core;

use Objectiv\Plugins\Checkout\Main;
use Objectiv\Plugins\Checkout\Managers\TemplateManager;
use Objectiv\Plugins\Checkout\Stats\StatCollection;

/**
 * Class Admin
 *
 * @link objectiv.co
 * @since 1.0.0
 * @package Objectiv\Plugins\Checkout\Core
 * @author Clifton Griffin <clif@objectiv.co>
 */
class Admin {

	/**
	 * @since 1.0.0
	 * @access public
	 * @var object $plugin_instance The plugin instance
	 */
	public $plugin_instance;

	/**
     * @since 1.0.0
     * @access public
	 * @var object $tabs The tabs for the admin navigation
	 */
	public $tabs;

	/**
	 * Admin constructor.
	 *
     * @since 1.0.0
     * @access public
	 * @param $plugin
	 */
	public function __construct( $plugin ) {
		$this->plugin_instance = $plugin;
	}

	/**
	 * Initializes the admin backend
     *
     * @since 1.0.0
     * @access public
	 */
	public function run() {
		// Run this as early as we can to maximize integrations
		add_action(
			'plugins_loaded', function() {
			    // Adds the plugins hooks
			    $this->start();
		    }, 1
		);
	}

	public function start() {
		// Admin Menu
		add_action('admin_menu', array($this, 'admin_menu'), 100 );

		// Key Nag
		add_action('admin_menu', array($this, 'add_key_nag'), 11);

		// Enqueue Admin Scripts
		add_action( 'admin_enqueue_scripts', array($this, 'admin_scripts') );

		// Admin notice
		add_action('admin_notices', array($this, 'add_notice_key_nag') );

		// Welcome notice
		add_action('admin_notices', array($this, 'add_welcome_notice') );

		// Add deprecated theme notice
		add_action('admin_notices', array($this, 'add_deprecated_theme_notice') );

		// Welcome redirect
		add_action( 'admin_init', array($this, 'welcome_screen_do_activation_redirect') );

		// Add settings link
		add_filter( 'plugin_action_links_' . plugin_basename( CFW_MAIN_FILE ), array( $this, 'add_action_links' ), 10, 1 );

		// Migrate settings
		add_action( 'admin_init', array( $this, 'maybe_migrate_settings' ) );

		// Show shipping phone on order editor
		add_action( 'woocommerce_admin_order_data_after_shipping_address', array( $this, 'shipping_phone_display_admin_order_meta' ), 10, 1 );
    }

	/**
	 * The main admin menu setup
     *
     * @since 1.0.0
     * @access public
	 */
	public function admin_menu() {
		// Initiate tab object
		$this->tabs = new \WP_Tabbed_Navigation('');

		add_options_page( __( 'Checkout for WooCommerce', 'checkout-wc' ), __( 'Checkout for WooCommerce', 'checkout-wc' ), "manage_options", "cfw-settings", array($this, "admin_page") );

		// Setup tabs
        $this->tabs->add_tab( __( 'General', 'checkout-wc' ), menu_page_url('cfw-settings', false) );
		$this->tabs->add_tab( __( 'Template', 'checkout-wc' ), add_query_arg( array('subpage' => 'templates'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'Design', 'checkout-wc' ), add_query_arg( array('subpage' => 'design'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'License', 'checkout-wc' ), add_query_arg( array('subpage' => 'license'), menu_page_url('cfw-settings', false) ) );
		$this->tabs->add_tab( __( 'Support', 'checkout-wc' ), add_query_arg( array('subpage' => 'support'), menu_page_url('cfw-settings', false) ) );
	}

	/**
	 * The admin page wrap
     *
     * @since 1.0.0
     * @access public
	 */
	public function admin_page() {
	    $current_tab_function = $this->get_current_tab() === false ? 'general_tab' : $this->get_current_tab() . "_tab";
		?>
        <script type="text/javascript">!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});</script>
        <script type="text/javascript">window.Beacon('init', '355a5a54-eb9d-4b64-ac5f-39c95644ad36')</script>
		<div class="wrap about-wrap" style="margin-left:2px;">

            <h1><?php _e('Checkout for WooCommerce', 'checkout-wc'); ?></h1>
            <p class="about-text"><?php _e( 'Checkout for WooCommerce provides a beautiful, conversion optimized checkout template for WooCommerce.' , 'checkout-wc' ); ?></p>
        </div>

        <div class="wrap">
            <?php $this->tabs->display_tabs(); ?>

            <?php $this->$current_tab_function(); ?>
		</div>
		<?php
	}

	/**
	 * The general tab
     *
     * @since 1.0.0
     * @access public
	 */
	public function general_tab() {
	    $stat_collection = StatCollection::instance();
	    ?>
        <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
			<?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>"><?php _e('Enable / Disable', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input type="hidden" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="no" />
                            <label><input type="checkbox" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" id="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable'); ?>" value="yes" <?php if ( $this->plugin_instance->get_settings_manager()->get_setting('enable') == "yes" ) echo "checked"; ?> /> <?php _e('Use Checkout for WooCommerce Template', 'checkout-wc'); ?></label>
                            <p><span class="description"><?php _e('Enable or disable Checkout for WooCommerce theme. (NOTE: Theme is always enabled for admin users.)', 'checkout-wc'); ?></span></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable_phone_fields'); ?>"><?php _e('Show Phone Fields', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input type="hidden" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable_phone_fields'); ?>" value="no" />
                            <label><input type="checkbox" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable_phone_fields'); ?>" id="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('enable_phone_fields'); ?>" value="yes" <?php if ( $this->plugin_instance->get_settings_manager()->get_setting('enable_phone_fields') == "yes" ) echo "checked"; ?> /> <?php _e('Enable billing and shipping phone fields', 'checkout-wc'); ?></label>
                            <p><span class="description"><?php _e('Enable or disable billing and shipping phone fields as required fields. (Default: Disabled)', 'checkout-wc'); ?></span></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('header_scripts'); ?>"><?php _e('Header Scripts', 'checkout-wc'); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( stripslashes_deep( $this->plugin_instance->get_settings_manager()->get_setting('header_scripts') ), sanitize_title_with_dashes( $this->plugin_instance->get_settings_manager()->get_field_name('header_scripts') ), array('textarea_rows' => 6, 'quicktags' => false, 'media_buttons' => false, 'textarea_name' => $this->plugin_instance->get_settings_manager()->get_field_name('header_scripts'), 'tinymce' => false ) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('This code will output immediately before the closing <code>&lt;/head&gt;</code> tag in the document source.', 'checkout-wc'); ?>
                                </span>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('footer_scripts'); ?>"><?php _e('Footer Scripts', 'checkout-wc'); ?></label>
                        </th>
                        <td>
		                    <?php wp_editor( stripslashes_deep( $this->plugin_instance->get_settings_manager()->get_setting('footer_scripts') ), sanitize_title_with_dashes( $this->plugin_instance->get_settings_manager()->get_field_name('footer_scripts') ), array('textarea_rows' => 6, 'quicktags' => false, 'media_buttons' => false, 'textarea_name' => $this->plugin_instance->get_settings_manager()->get_field_name('footer_scripts'), 'tinymce' => false ) ); ?>
                            <p>
                                <span class="description">
				                    <?php _e('This code will output immediately before the closing <code>&lt;/body&gt;</code> tag in the document source.', 'checkout-wc'); ?>
                                </span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <?php
                            $tracking_field_name = $this->plugin_instance->get_settings_manager()->get_field_name('allow_tracking');
                            $tracking_value = $this->plugin_instance->get_settings_manager()->get_setting('allow_tracking');
                        ?>
                        <th scope="row" valign="top">
                            <label for="<?php echo $tracking_field_name; ?>"><?php _e('Enable Usage Tracking', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <input type="hidden" name="<?php echo $tracking_field_name; ?>" value="0" />
                            <label for="<?php echo $tracking_field_name; ?>">
                                <input type="checkbox" name="<?php echo $tracking_field_name; ?>" id="<?php echo $tracking_field_name; ?>" value="1" <?php if ( $tracking_value == 1 ) echo "checked"; ?> />
								<?php _e('Allow Checkout for WooCommerce to track plugin usage?', 'checkout-wc'); ?>
                            </label>
                        </td>
                    </tr>
                    <?php if( false && CFW_DEV_MODE ): ?>
                    <tr>
                        <th scope="row" valign="top">
                            <label for="#cfw-stat-collection-testing"><?php _e('Stat Collection Data Viewer', 'checkout-wc'); ?></label>
                        </th>
                        <td>
							<?php
                                $stats = $this->plugin_instance->get_stat_collection();
							    $stats->setup_data();
                            ?>
                            <div>
                                <?php
								    d($stats->get_data());
                                ?>
                            </div>
                        </td>
                    </tr>
                    <?php endif; ?>
                </tbody>
            </table>

			<?php submit_button(); ?>
        </form>
        <?php
    }

	/**
	 * The template tab
	 *
	 * @since 2.0.0
	 * @access public
	 */
    public function templates_tab() {
	    $cfw_templates = $this->plugin_instance->get_template_manager()->get_templates_information();
	    $cfw_template_stylesheet_headers = TemplateManager::$default_headers;
	    $active_template = $this->plugin_instance->get_settings_manager()->get_setting('active_template');
	    ?>
        <h3><?php _e( 'Templates', 'checkout-wc' ); ?></h3>

        <?php if ( ! $this->plugin_instance->get_template_manager()->is_old_theme() ): ?>
            <div class="theme-browser">
                <div class="themes wp-clearfix">
                    <?php foreach($cfw_templates as $folder_name => $template_information):
                        $base_url_path = $template_information["base_url_path"];
                        $screen_shot = "{$base_url_path}/screenshot.png";
                        $stylesheet_info = $template_information["stylesheet_info"];
                        $selected = ($active_template == $folder_name) ? true : false;

                        ?>
						<?php add_thickbox(); ?>
                        <div class="theme <?php if ( $selected ) echo "active"; ?>">
                            <div class="theme-screenshot">
                                <a href="#TB_inline?width=1200&height=900&inlineId=theme-preview-<?php echo $folder_name; ?>" class="thickbox">
                                    <img class="theme-screenshot-img" src="<?php echo $screen_shot; ?>" />
                                </a>
                                <div id="theme-preview-<?php echo $folder_name; ?>" style="display:none;">
                                    <img src="<?php echo $screen_shot; ?>" />
                                </div>
                            </div>
                            <div class="theme-id-container">

                                <h2 class="theme-name" id="<?php echo $folder_name; ?>-name"><strong><?php if ( $selected ) _e('Active: '); ?></strong><?php echo $stylesheet_info['Name']; ?></h2>


                                <?php if ( ! $selected ): ?>
                                    <div class="theme-actions">
                                        <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
                                            <input type="hidden" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('active_template'); ?>" value="<?php echo $folder_name; ?>" />
	                                        <?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>
                                            <?php submit_button( __('Activate', 'checkout-wc'), 'button-secondary', $name = 'submit', $wrap = false); ?>
                                        </form>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php else: ?>
            <?php _e('You are using a legacy child theme which will be disabled in a future version. Changing theme settings is not possible for legacy themes.', 'checkout-wc' ); ?>
        <?php endif; ?>
	    <?php
    }

	/**
	 * The design tab
     *
     * @since 1.0.0
     * @access public
	 */
    public function design_tab() {
        $cfw_templates = $this->plugin_instance->get_template_manager()->get_templates_information();
        $cfw_template_stylesheet_headers = TemplateManager::$default_headers;
	    ?>
        <form name="settings" id="mg_gwp" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
		    <?php $this->plugin_instance->get_settings_manager()->the_nonce(); ?>

            <h3><?php _e( 'Global Settings', 'checkout-wc' ); ?></h3>
            <p><?php _e( 'These settings apply to all themes.', 'checkout-wc' ) ;?></p>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row" valign="top">
                            <?php _e('Logo', 'checkout-wc'); ?>
                        </th>
                        <td>
                            <div class='image-preview-wrapper'>
                                <img id='image-preview' src='<?php echo wp_get_attachment_url( $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id') ); ?>' width='100' style='max-height: 100px; width: 100px;'>
                            </div>
                            <input id="upload_image_button" type="button" class="button" value="<?php _e( 'Upload image' ); ?>" />
                            <input type='hidden' name='<?php echo $this->plugin_instance->get_settings_manager()->get_field_name('logo_attachment_id'); ?>' id='logo_attachment_id' value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id'); ?>">

                            <a class="delete-custom-img button secondary-button"><?php _e('Clear Logo', 'checkout-wc'); ?></a>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" valign="top">
                            <label for="<?php echo sanitize_title_with_dashes( $this->plugin_instance->get_settings_manager()->get_field_name('footer_text') ); ?>"><?php _e('Footer Text', 'checkout-wc'); ?></label>
                        </th>
                        <td>
                            <?php wp_editor( $this->plugin_instance->get_settings_manager()->get_setting('footer_text'), sanitize_title_with_dashes( $this->plugin_instance->get_settings_manager()->get_field_name('footer_text') ), array('textarea_rows' => 5, 'textarea_name' => $this->plugin_instance->get_settings_manager()->get_field_name('footer_text'), 'tinymce' => true ) ); ?>
                            <p>
                                        <span class="description">
                                            <?php _e('If left blank, a standard copyright notice will be displayed. Set to a single space to override this behavior.', 'checkout-wc'); ?>
                                        </span>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3><?php _e( 'Theme Specific Settings', 'checkout-wc' ); ?></h3>

	        <?php if ( ! $this->plugin_instance->get_template_manager()->is_old_theme() ):
		        $template_path = $this->plugin_instance->get_template_manager()->get_selected_template();
		        $templates_information = $this->plugin_instance->get_template_manager()->get_templates_information();
		        $supports = ! empty( $templates_information[ $template_path ][ 'stylesheet_info' ][ 'Supports' ] ) ? array_map('trim', explode(',', $templates_information[ $template_path ][ 'stylesheet_info' ][ 'Supports' ] ) ) : array();
		        ?>
                <table class="form-table template-settings template-<?php echo $template_path; ?>">
                        <tbody>
                        <?php if ( in_array('header-background', $supports) ): ?>
                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'header_background_color', array( $template_path ) ); ?>"><?php _e('Header Background Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'header_background_color', array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'header_background_color', array( $template_path ) ); ?>" data-default-color="#ffffff" />
                            </td>
                        </tr>
                        <?php endif; ?>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'header_text_color', array( $template_path ) ); ?>"><?php _e('Header Text Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'header_text_color', array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'header_text_color', array( $template_path ) ); ?>" data-default-color="#2b2b2b" />
                            </td>
                        </tr>

                        <?php if ( in_array('footer-background', $supports) ): ?>
                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'footer_background_color',  array( $template_path ) ); ?>"><?php _e('Footer Background Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'footer_background_color',  array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'footer_background_color',  array( $template_path ) ); ?>" data-default-color="#ffffff" />
                            </td>
                        </tr>
                        <?php endif; ?>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'footer_color',  array( $template_path ) ); ?>"><?php _e('Footer Text Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'footer_color',  array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'footer_color',  array( $template_path ) ); ?>" data-default-color="#999999" />
                            </td>
                        </tr>

                        <?php if ( in_array('summary-background', $supports) ): ?>
                            <tr>
                                <th scope="row" valign="top">
                                    <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'summary_background_color', array( $template_path ) ); ?>"><?php _e('Summary Background Color', 'checkout-wc'); ?></label>
                                </th>
                                <td>
                                    <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'summary_background_color', array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'summary_background_color', array( $template_path ) ); ?>" data-default-color="#fafafa" />
                                </td>
                            </tr>
                        <?php endif; ?>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'button_color',  array( $template_path ) ); ?>"><?php _e('Primary Button Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'button_color',  array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'button_color',  array( $template_path ) ); ?>" data-default-color="#e9a81d" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'button_text_color',  array( $template_path ) ); ?>"><?php _e('Primary Button Text Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'button_text_color',  array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'button_text_color',  array( $template_path ) ); ?>" data-default-color="#000000" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'secondary_button_color',  array( $template_path ) ); ?>"><?php _e('Secondary Button Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'secondary_button_color',  array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'secondary_button_color',  array( $template_path ) ); ?>" data-default-color="#999999" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'secondary_button_text_color',  array( $template_path ) ); ?>"><?php _e('Secondary Button Text Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'secondary_button_text_color',  array( $template_path ) ); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'secondary_button_text_color', array( $template_path ) ); ?>" data-default-color="#ffffff" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'link_color',  array( $template_path ) ); ?>"><?php _e('Link Color', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <input class="color-picker" type="text" name="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'link_color',  array( $template_path )); ?>" value="<?php echo $this->plugin_instance->get_settings_manager()->get_setting( 'link_color',  array( $template_path ) ); ?>" data-default-color="#e9a81d" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" valign="top">
                                <label for="<?php echo $this->plugin_instance->get_settings_manager()->get_field_name( 'custom_css',  array( $template_path ) ); ?>"><?php _e('Custom CSS', 'checkout-wc'); ?></label>
                            </th>
                            <td>
                                <?php wp_editor( $this->plugin_instance->get_settings_manager()->get_setting( 'custom_css',  array( $template_path ) ), sanitize_title_with_dashes( $this->plugin_instance->get_settings_manager()->get_field_name( 'custom_css',  array( $template_path ) ) ), array('textarea_rows' => 5, 'quicktags' => false, 'media_buttons' => false, 'textarea_name' => $this->plugin_instance->get_settings_manager()->get_field_name( 'custom_css',  array( $template_path ) ), 'tinymce' => false ) ); ?>
                                <p>
                                    <span class="description">
                                        <?php _e('Add Custom CSS rules to fully control the appearance of the checkout template.', 'checkout-wc'); ?>
                                    </span>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                    </table>
	        <?php else: ?>
		        <?php _e('You are using a legacy child theme which will be disabled in a future version. Changing theme settings is not possible for legacy themes.', 'checkout-wc' ); ?>
	        <?php endif; ?>

		    <?php submit_button(); ?>
        </form>
        <?php
    }

	/**
	 * The license tab
     *
     * @since 1.0.0
     * @access public
	 */
    public function license_tab() {
	    $this->plugin_instance->get_updater()->admin_page();
    }

	/**
	 * The support tab
     *
     * @since 1.0.0
     * @access public
	 */
    public function support_tab() {
        ?>
        <h3><?php _e('Need help?', 'checkout-wc'); ?></h3>

        <p><?php _e('Excellent support is in our DNA.', 'checkout-wc'); ?></p>

	    <?php submit_button( __('Contact Support', 'checkout-wc'), 'primary', false, false, array('id'=> 'checkoutwc-support-button') ); ?>

        <script>
            jQuery("#checkoutwc-support-button").click(function() {
                Beacon("open");
            });
        </script>
        <?php
    }

	/**
     * Retrieves the current tab
     *
     * @since 1.0.0
     * @access public
	 * @return bool
	 */
	public function get_current_tab() {
	    return empty($_GET['subpage']) ? false : $_GET['subpage'];
    }

	/**
	 * Adds a notification that nags about the license key
     *
     * @since 1.0.0
     * @access public
	 */
	public function add_key_nag() {
		global $pagenow;

		if( $pagenow == 'plugins.php' ) {
			add_action( 'after_plugin_row_' . $this->plugin_instance->get_path_manager()->get_base(), array($this, 'after_plugin_row_message'), 10, 2 );
		}
	}

	/**
	 * @since 1.0.0
     * @access public
	 */
	public function after_plugin_row_message() {
		$key_status = $this->plugin_instance->get_updater()->get_field_value('key_status');

		if ( empty($key_status) ) return;

		if ( $key_status != "valid" ) {
			$current = get_site_transient( 'update_plugins' );
			if ( isset( $current->response[ plugin_basename(__FILE__) ] ) ) return;

			if ( is_network_admin() || ! is_multisite() ) {
				$wp_list_table = _get_list_table('WP_Plugins_List_Table');
				echo '<tr class="plugin-update-tr"><td colspan="' . $wp_list_table->get_column_count() . '" class="plugin-update colspanchange"><div class="update-message">';
				echo $this->keynag();
				echo '</div></td></tr>';
			}
		}
	}

	/**
     * @since 1.0.0
     * @access public
	 * @return string
	 */
	public function keynag() {
		return "<span style='color:red'>You're missing out on important updates because your license key is missing, invalid, or expired.</span>";
	}

	/**
	 * @since 1.0.0
     * @access public
	 */
	public function admin_scripts() {
		// Add the admin stylesheet
	    wp_enqueue_style('objectiv-cfw-admin-styles', CFW_URL . "assets/admin/css/admin.css", array(), CFW_VERSION);

	    // Enqueue the admin stylesheet
		wp_enqueue_style('objectiv-cfw-admin-styles');

		// Add the color picker css file
		wp_enqueue_style( 'wp-color-picker' );

		// Add media picker script
		wp_enqueue_media();

		// Include our custom jQuery file with WordPress Color Picker dependency
		wp_enqueue_script( 'objectiv-cfw-admin', CFW_URL . 'assets/admin/js/admin.js', array( 'jquery', 'wp-color-picker' ), CFW_VERSION );

		// Localize the script with new data
		$settings_array = array(
			'logo_attachment_id' => $this->plugin_instance->get_settings_manager()->get_setting('logo_attachment_id'),
		);
		wp_localize_script( 'objectiv-cfw-admin', 'objectiv_cfw_admin', $settings_array );
    }

	/**
	 * add_notice_key_nag function
     *
     * @since 1.0.0
     * @acess public
	 */
	public function add_notice_key_nag() {
		$key_status = $this->plugin_instance->get_updater()->get_field_value('key_status');
		$license_key = $this->plugin_instance->get_updater()->get_field_value('license_key');

		if ( ! empty($_GET['cfw_welcome']) ) return;

		// Validate Key Status
		if ( empty($license_key) || ( ($key_status !== "valid" || $key_status == "inactive" || $key_status == "site_inactive") ) ) {
			$important = '';
		    if ( isset($_GET['page']) && $_GET['page'] == 'cfw-settings') {
		        $important = "style='display:block !important'";
            }
			echo "<div $important class='notice notice-error is-dismissible checkout-wc'> <p>" . $this->renew_or_purchase_nag($key_status, $license_key) . "</p></div>";
		}
	}

	/**
     * @since 1.0.0
     * @access public
	 * @param $key_status
	 * @param $license_key
	 * @return String The renewal or purchase notice.
	 */
	public function renew_or_purchase_nag( $key_status, $license_key ) {
		if ( $key_status == "expired" ) {
			return sprintf(__('Checkout for WooCommerce: Your license key appears to have expired. Please verify that your license key is valid or <a target="_blank" href="https://www.checkoutwc.com/checkout/?edd_license_key=%s">renew your license now</a> to restore full functionality.', $license_key), 'checkout-wc');
		}

		return __( 'Checkout for WooCommerce: Your license key is missing or invalid. Please verify that your license key is valid or <a target="_blank" href="https://www.checkoutwc.com/">purchase a license</a> to restore full functionality.', 'checkout-wc');
	}

	function add_welcome_notice() {
	    if ( ! empty($_GET['cfw_welcome']) ) {
	        echo "<div style='display:block !important' class='notice notice-info'><p>" . __('Thank you for installing Checkout for WooCommerce! To get started, click on <strong>License</strong> below and activate your license key!', 'checkout-wc') . "</p></div>";
        }
    }

    function add_deprecated_theme_notice() {
	    if ( $this->plugin_instance->get_template_manager()->is_old_theme() ) {
		    $important = '';

		    if ( isset($_GET['page']) && $_GET['page'] == 'cfw-settings' ) {
			    $important = "style='display:block !important'";
		    }
		    echo "<div $important class='notice notice-error is-dismissible checkout-wc'> <p>" . sprintf( __( 'It looks like you are using a legacy checkout theme, located in %s. Legacy themes are deprecated and you should upgrade to the new theme structure as soon as possible to prevent problems with future release. For more information, <a target="_blank" href="https://www.checkoutwc.com/docs/developer-api/template-files/upgrading-legacy-custom-templates/">read our migration guide.</a>', 'checkout-wc' ), get_stylesheet_directory_uri() . "/checkout-wc" ) . "</p></div>";
        }
    }

	function welcome_screen_do_activation_redirect() {
		// Bail if no activation redirect
		if ( ! get_transient( '_cfw_welcome_screen_activation_redirect' ) ) {
			return;
		}

		// Delete the redirect transient
		delete_transient( '_cfw_welcome_screen_activation_redirect' );

		// Bail if activating from network, or bulk
		if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
			return;
		}

		// Redirect to bbPress about page
		wp_safe_redirect( add_query_arg( array( 'page' => 'cfw-settings', 'cfw_welcome' => 'true' ), admin_url( 'options-general.php' ) ) );
    }

    function add_action_links( $links ) {
	    $settings_link = array(
		    '<a href="' . admin_url( 'options-general.php?page=cfw-settings' ) . '">' . __('Settings', 'checkout-wc') . '</a>',
	    );

	    return array_merge( $settings_link, $links );
    }

    function maybe_migrate_settings() {
	    $settings_version = $this->plugin_instance->get_settings_manager()->get_setting( 'settings_version' );

	    if ( empty($settings_version) ) {
		    $cfw_templates = $this->plugin_instance->get_template_manager()->get_templates_information();

		    foreach( $cfw_templates as $template_path => $template_information ) {
                $this->plugin_instance->get_settings_manager()->update_setting( 'header_background_color', $this->plugin_instance->get_settings_manager()->get_setting('header_background_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'header_text_color', $this->plugin_instance->get_settings_manager()->get_setting('header_text_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'footer_background_color', $this->plugin_instance->get_settings_manager()->get_setting('footer_background_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'footer_color', $this->plugin_instance->get_settings_manager()->get_setting('footer_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'link_color', $this->plugin_instance->get_settings_manager()->get_setting('link_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'button_color', $this->plugin_instance->get_settings_manager()->get_setting('button_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'button_text_color', $this->plugin_instance->get_settings_manager()->get_setting('button_text_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'secondary_button_color', $this->plugin_instance->get_settings_manager()->get_setting('secondary_button_color'), array( $template_path ) );
                $this->plugin_instance->get_settings_manager()->update_setting( 'secondary_button_text_color', $this->plugin_instance->get_settings_manager()->get_setting('secondary_button_text_color'), array( $template_path ) );
            }

		    /**
		     * Theme Specific Settings
		     */

		    // Copify Summary Background
		    $this->plugin_instance->get_settings_manager()->update_setting( 'summary_background_color', '#f8f8f8', array( 'copify' ) );

		    // Futurist Header Background / Header Text
		    $this->plugin_instance->get_settings_manager()->update_setting( 'header_background_color', '#000000', array( 'futurist' ) );
		    $this->plugin_instance->get_settings_manager()->update_setting( 'header_text_color', '#ffffff', array( 'futurist' ) );

		    // Set active theme
            $this->plugin_instance->get_settings_manager()->update_setting( 'active_template', 'default' );

		    $this->plugin_instance->get_settings_manager()->update_setting( 'settings_version', '200' );
        }
    }

	/**
	 * @since 1.1.5
	 * @param $order
	 */
	public function shipping_phone_display_admin_order_meta( $order ) {
		$shipping_phone = get_post_meta( $order->get_id(), '_shipping_phone', true );

		if ( empty($shipping_phone) ) {
		    return;
        }

		echo '<p><strong>' . __( 'Phone' ) . ':</strong><br /><a href="tel:' . $shipping_phone . '">' . $shipping_phone . '</a></p>';
	}
}