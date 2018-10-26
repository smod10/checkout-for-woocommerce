import { Compatibility } from "./Compatibility";
import {Main} from "../Main";

declare let OffAmazonPayments: any;
declare let amazon_payments_advanced_params: any;

export class AmazonPay extends Compatibility {
	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	/**
	 * Run the compatibility
	 *
	 * @param main
	 */
	load(main: Main): void {
		let easyTabsWrap: any = main.easyTabService.easyTabsWrap;

		/**
		 * If the OffAmazonPayments and amazon_payments_advanced_params exist we can then check to see if there is a reference
		 * id set. If not we are not logged in. If there is we are logged in.
		 */
		try {

			if (OffAmazonPayments !== undefined && amazon_payments_advanced_params !== undefined && (amazon_payments_advanced_params.reference_id !== "" || amazon_payments_advanced_params.access_token !== "")) {
				$("#cfw-billing-methods .create-account").remove();
				$("#payment-info-separator-wrap").hide();
				$("#cfw-shipping-same-billing").hide();
				$("#cfw-billing-methods > .cfw-module-title").hide();
				$("#cfw-shipping-info > .cfw-module-title").hide();

				easyTabsWrap.bind('easytabs:after', (event, clicked, target) => this.amazonRefresh());

				(<any>window).addEventListener("cfw-checkout-failed-before-error-message", ({detail}) => {
					let response = detail.response;

					if (response.reload) {
						location.href = amazon_payments_advanced_params.redirect;
						console.log(amazon_payments_advanced_params);
					}
				});
			}
		}catch(error) {

		}
	}

	/**
	 * Refreshes and loads the split amazon setup
	 */
	amazonRefresh() {
		OffAmazonPayments.Widgets.Utilities.setup();
	}
}