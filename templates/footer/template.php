<?php
    if ( ! defined( 'ABSPATH' ) ) {
        exit; // Exit if accessed directly
    }
?>
<footer id="cfw-footer">
    <div class="wrap">
        <div class="cfw-container cfw-column-12">
            <div class="cfw-footer-inner">
                <?php if ( ! empty( $footer_text = Objectiv\Plugins\Checkout\Main::instance()->get_settings_manager()->get_setting('footer_text') ) ): ?>
                    <?php echo $footer_text; ?>
                <?php else: ?>
                    Copyright &copy; <?php echo date("Y"); ?>, <?php echo get_bloginfo('name'); ?>. All rights reserved.
                <?php endif; ?>
            </div>
        </div>
    </div>
</footer>