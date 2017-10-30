<?php

namespace Objectiv\Plugins\Checkout\Core;

/**
 * Class Compatibility
 *
 * @link objectiv.co
 * @since 1.0.1
 * @package Objectiv\Plugins\Checkout\Core
 * @author Clifton Griffin <clif@objectiv.co>
 */
class Compatibility {
	public function __construct() {
		add_action('cfw_wp_head', array($this, 'mixpanel_fixes') );
	}

	function mixpanel_fixes() {
		$all_integrations = WC()->integrations->get_integrations();
		$WC_Mixpanel = $all_integrations['mixpanel'];

		if($WC_Mixpanel) {
			$WC_Mixpanel->output_head();
			$WC_Mixpanel->started_checkout();

			// Payment form
			$this->echo_payment_start_script( $WC_Mixpanel );
		}
	}

	function echo_payment_start_script($WC_Mixpanel) {
		ob_start();
		$WC_Mixpanel->started_payment();
		$script = ob_get_clean();
		?>
		<script type="text/javascript">
			jQuery(document).ready(function(){
                jQuery('#<?php echo apply_filters('cfw_template_tab_container_el', 'cfw-tab-container'); ?>').bind('easytabs:after', function() {
                    if ( jQuery('#<?php echo apply_filters('cfw_template_payment_method_el', 'cfw-payment-method'); ?>').hasClass('active') ) {
						<?php echo preg_replace('#<script[^>]*>([^<]+)</script>#', '$1', $script); ?>
                    }
                });
			});
		</script>
		<?php
	}
}