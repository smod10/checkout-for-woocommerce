<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
?>
<style type="text/css">
    <?php
    $cfw = \Objectiv\Plugins\Checkout\Main::instance();
    $active_theme = $cfw->get_template_manager()->get_selected_template();
    $active_theme_information = $cfw->get_template_manager()->get_templates_information()[ $active_theme ];
    ?>
    /**
    Special Futurist breadcrumb styles
     */
    #cfw-breadcrumb:after {
        background: <?php echo $cfw->get_settings_manager()->get_setting( 'header_background_color', array($active_theme) ); ?>;
    }

    #cfw-breadcrumb li > a {
        color: <?php echo $cfw->get_settings_manager()->get_setting('header_background_color', array($active_theme) ); ?>;
    }

    #cfw-breadcrumb .filled-circle:before {
        background: <?php echo $cfw->get_settings_manager()->get_setting('header_background_color', array($active_theme) ); ?>;
    }

    #cfw-breadcrumb li:before {
        border: 2px solid <?php echo $cfw->get_settings_manager()->get_setting('header_background_color', array($active_theme) ); ?>;
    }
</style>
<header id="cfw-header">
    <div class="wrap">
        <div class="cfw-container cfw-column-12">
            <div id="cfw-logo-container">
                <!-- TODO: Find a way to inject certain backend settings as global params without having to put logic in the templates -->
                <div class="cfw-logo">
                    <a title="<?php echo get_bloginfo( 'name' ); ?>" href="<?php echo get_home_url(); ?>" class="logo"></a>
                </div>
            </div>
        </div>
    </div>
</header>