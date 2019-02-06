import { Compatibility } from "./Compatibility";

declare let jQuery: any;

export class PayPalForWooCommerce extends Compatibility {
	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	load(): void {
		jQuery(window).on('load updated_checkout', () => {
			var isPPEC = jQuery( '#payment_method_paypal_express' ).is(':checked');
			jQuery( '#place_order' ).toggle( ! isPPEC );
			jQuery( '.angelleye_smart_button_checkout_bottom' ).toggle( isPPEC );
		});
	}
}