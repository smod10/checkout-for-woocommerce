import { Compatibility } 			from "./Compatibility";
import { Main } 					from "../Main";
import {EasyTabDirection, EasyTabService} from "../Services/EasyTabService";

export class KlarnaPayment extends Compatibility {

	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	load(main: Main, params: any): void {
        let easyTabsWrap: any = main.easyTabService.easyTabsWrap;

        // Bind to the easytabs after
        this.easyTabsCreditCardAfterEvent(easyTabsWrap, main);
	}

    /**
     * @param easyTabsWrap
     * @param main
     */
    easyTabsCreditCardAfterEvent(easyTabsWrap: any, main: Main): void {
        easyTabsWrap.bind('easytabs:after', (event, clicked, target) => this.creditCardPaymentRefreshOnTabSwitch(main, event, clicked, target));
    }

    /**
     * Klarna Payments needs to be refreshed when switching to the payment tab from another tab otherwise the fields won't re-generate.
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

        if ( paymentContainerId === easyTabID ) {
        	var selected_gateway = $('input[name="payment_method"]:checked');
            var selected_value = <string>selected_gateway.val();

            if ( selected_value.indexOf('klarna_payments') !== -1 ) {
                selected_gateway.trigger('click').trigger('change');
			}
        }
    }
}