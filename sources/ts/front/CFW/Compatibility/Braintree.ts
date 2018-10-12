import { Compatibility }                    from "./Compatibility";
import { Main }                             from "../Main";
import { EasyTabService }                   from "../Services/EasyTabService";
import { EasyTabDirection }                 from "../Services/EasyTabService";
import {ParsleyService} from "../Services/ParsleyService";
import {CompleteOrderAction} from "../Actions/CompleteOrderAction";

declare let wc_braintree_credit_card_handler: any;

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

		this.ccWrap = $("#payment .wc-braintree-credit-card-new-payment-method-form");
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
			// Bind to the easytabs after
			this.easyTabsCreditCardAfterEvent(easyTabsWrap, main);
			this.onCreditCardErrorAlertRefresh();

			/**
			 * On click we need to set this boolean to false so when the updated_checkout runs (and it does run on complete
			 * order) we can step in and say "You don't need to refresh". However there are times during the complete order
			 * process where say parsley encounters a form error during the validation steps and we need to refresh.
			 *
			 * The updated_checkout call they make messes everything up for some reason
			 */
			$("#place_order").on('click', () => {
				this.runRefresh = false;
			});

			$(document.body).on("updated_checkout", () => {
				if(this.runRefresh) {
					this.creditCardRefresh();
				}
			});

			(<any>window).addEventListener("cfw-parsley-initialized", eventData => {
				let parsley = eventData.detail.parsley;

				parsley.on('form:error', () => this.creditCardRefresh());
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

		if(paymentContainerId === easyTabID) {
			this.creditCardRefresh();
		}
	}

    /**
	 * Calls the refresh_braintree method on the credit card handler. Resets the state back to default
     */
	creditCardRefresh(): void {
		this.runRefresh = true;
		// Event listeners only run once so its ok to run this every time we need to refresh
		this.onBlockAndUnblockUI();

        wc_braintree_credit_card_handler.refresh_braintree();
	}

	/**
	 *
	 */
	onBlockAndUnblockUI(): void {
		let w: any = <any>window;

		w.addEventListener("cfw-block-event", () => {
			console.log("onBlock Event");
			this.ccWrap.find(`.${this.refreshingClass}`).remove();
			this.ccWrap.prepend(this.refreshingBoxNotification("Braintree Is Refreshing"));
		}, {once: true});

		w.addEventListener("cfw-un-block-event", () => {
			console.log("onUnBlock Event");
			this.ccWrap.find(`.${this.refreshingClass}`).remove();
		}, {once: true});
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
	 * If a CFWSubmitError has been generated and braintree credit card is active we need to refresh the UI so it
	 * reloads back to default state
     */
	onCreditCardErrorAlertRefresh(): void {
		(<any>window).addEventListener("cfw-add-alert-event", eventData => {
			let alertInfo = eventData.detail.alertInfo;

			if(alertInfo.type = "CFWSubmitError") {
				this.creditCardRefresh();
			}
		});
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