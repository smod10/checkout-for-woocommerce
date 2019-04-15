import { Compatibility }                    from "./Compatibility";
import { Main }                             from "../Main";
import { EasyTabService }                   from "../Services/EasyTabService";
import { EasyTabDirection }                 from "../Services/EasyTabService";

declare let wc_braintree_credit_card_handler: any;
declare let jQuery: any;

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
	load(main: Main, params: any): void {
		let easyTabsWrap: any = main.easyTabService.easyTabsWrap;

		if(params.cc_gateway_available) {
			// Bind to the easytabs after
			this.easyTabsCreditCardAfterEvent(easyTabsWrap, main);

			jQuery(document.body).on( 'updated_checkout payment_method_selected', () => {
				this.creditCardRefresh();
				this.savedPaymentMethods();
			} );

			jQuery(document.body).one( 'cfw_run_braintree_refresh', () => {
				this.creditCardRefresh();
				this.savedPaymentMethods();
			} );

			window.addEventListener("cfw-payment-error-observer-ignore-list", () => {
				(<any>window).errorObserverIgnoreList.push("Currently unavailable. Please try a different payment method.");
			});
		}
	}

	/**
	 * @param easyTabsWrap
	 * @param main
	 */
	easyTabsCreditCardAfterEvent(easyTabsWrap: any, main: Main): void {
		easyTabsWrap.bind('easytabs:after', (event, clicked, target) => this.creditCardPaymentRefreshOnTabSwitch(main, event, clicked, target));
	}

	/**
	 * The braintree credit card handler needs to be refreshed when switching to the payment tab from another tab otherwise the fields won't re-generate.
	 *
	 * @param {Main} main
	 * @param {any} event
	 * @param {any} clicked
	 * @param {any} target
	 */
	creditCardPaymentRefreshOnTabSwitch(main: Main, event: any, clicked: any, target: any): void {
		let easyTabDirection: EasyTabDirection = EasyTabService.getTabDirection(target);
		let easyTabID: string = EasyTabService.getTabId(easyTabDirection.target);
		let paymentContainerId: string = main.tabContainer.tabContainerSectionBy("name", "payment_method").jel.attr("id");

		if( paymentContainerId === easyTabID ) {
			jQuery(document.body).trigger( 'cfw_run_braintree_refresh' );
		}
	}

    /**
	 * Calls the refresh_braintree method on the credit card handler. Resets the state back to default
     */
	creditCardRefresh(): void {
        wc_braintree_credit_card_handler.refresh_braintree();
	}

	savedPaymentMethods(): void {
		jQuery(".wc-braintree-credit-card-new-payment-method-form .form-row").css("display", "block");
	}
}