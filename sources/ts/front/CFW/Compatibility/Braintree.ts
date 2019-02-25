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
	 * @type {any}
	 * @private
	 */

	private _ccWrap: any;

	/**
	 * @type {string}
	 * @private
	 */
	private _refreshingClass: string;

	/**
	 * @type {boolean}
	 * @private
	 */
	private _runRefresh: boolean;

	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);

		this.ccWrap = jQuery("#payment .wc-braintree-credit-card-new-payment-method-form");
		this.runRefresh = true;
		this.refreshingClass = "braintree-refreshing";
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
			jQuery(document.body).on( 'updated_checkout', () => {
				this.creditCardRefresh();
				this.savedPaymentMethods();
			} );

			window.addEventListener("cfw-payment-error-observer-ignore-list", () => {
				(<any>window).errorObserverIgnoreList.push("Currently unavailable. Please try a different payment method.");
			});
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
	creditCardPaymentRefreshOnTabSwitch(main: Main, event: any, clicked: any, target: any): void {
		let easyTabDirection: EasyTabDirection = EasyTabService.getTabDirection(target);
		let easyTabID: string = EasyTabService.getTabId(easyTabDirection.target);
		let paymentContainerId: string = main.tabContainer.tabContainerSectionBy("name", "payment_method").jel.attr("id");

		if(paymentContainerId === easyTabID) {
			this.creditCardRefresh();
			this.savedPaymentMethods();
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

	/**
	 * @param {string} message
	 *
	 * @return {string}
	 */
	refreshingBoxNotification(message: string): string {
		return `<div class='${this.refreshingClass}'>${message}</div>`;
	}

	/**
	 * @return {any}
	 */
	get ccWrap(): any {
		return this._ccWrap;
	}

	/**
	 * @param {any} value
	 */
	set ccWrap(value: any) {
		this._ccWrap = value;
	}

	/**
	 * @return {string}
	 */
	get refreshingClass(): string {
		return this._refreshingClass;
	}

	/**
	 * @param {string} value
	 */
	set refreshingClass(value: string) {
		this._refreshingClass = value;
	}

	/**
	 * @return {boolean}
	 */
	get runRefresh(): boolean {
		return this._runRefresh;
	}

	/**
	 * @param {boolean} value
	 */
	set runRefresh(value: boolean) {
		this._runRefresh = value;
	}
}