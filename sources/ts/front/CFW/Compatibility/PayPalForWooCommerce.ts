import { Compatibility } from "./Compatibility";
import { Main } from "../Main";

declare let jQuery: any;

export class PayPalForWooCommerce extends Compatibility {
	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	load( main: Main ): void {
		jQuery(window).on('cfw_updated_checkout', () => {
			let max_iterations = 200;
			let iterations = 0;

			let interval: any = setInterval(() => {
				let main: Main = Main.instance;

				if ( jQuery('input[name="payment_method"]:checked').is('#payment_method_paypal_express') && jQuery( '.angelleye_smart_button_checkout_bottom' ).first().is(':empty') ) {
					main.tabContainer.triggerUpdatedCheckout();

					clearInterval(interval);
				} else if( iterations >= max_iterations ) {
					// Give up
					clearInterval(interval);
				} else {
					iterations++;
				}
			}, 50);
		});
	}
}