import { Compatibility }                    from "./Compatibility";
import { Main }                             from "../Main";
import { EasyTabService } 					from "../Services/EasyTabService";
import { EasyTabDirection }					from "../Services/EasyTabService";

declare let wc_braintree_credit_card_handler: any;

/**
 * Helper compatibility class for the Braintree plugin
 */
export class Braintree extends Compatibility {
	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	/**
	 * Loads the Braintree compatibility class
	 *
	 * @param {Main} main
	 * @param {any} params
	 */
	load(main: Main, params: any) {
		let easyTabsWrap: any = main.easyTabService.easyTabsWrap;

		if(params.cc_gateway_available) {
			// Bind to the easytabs after
			easyTabsWrap.bind('easytabs:after', (event, clicked, target) => this.creditCardPaymentRefreshOnTabSwitch(main, event, clicked, target));
		}
	}

	/**
	 * The braintree credit card handler needs to be refreshed when switching to the payment tab from another tab otherwise the fields won't re-generate.
	 *
	 * @param {Main} main
	 * @param {any} event
	 * @param {any} clicked
	 * @param {any} target
	 */
	creditCardPaymentRefreshOnTabSwitch(main: Main, event: any, clicked: any, target: any) {
		let easyTabDirection: EasyTabDirection = EasyTabService.getTabDirection(target);
		let easyTabID: string = EasyTabService.getTabId(easyTabDirection.target);
		let paymentContainerId: string = main.tabContainer.tabContainerSectionBy("name", "payment_method").jel.attr("id");

		if(paymentContainerId === easyTabID) {
			wc_braintree_credit_card_handler.refresh_braintree();
		}
	}
}