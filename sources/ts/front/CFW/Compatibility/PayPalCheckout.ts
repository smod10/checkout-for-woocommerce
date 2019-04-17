import { Compatibility } from "./Compatibility";
import { Main } from "../Main";
import { EasyTabDirection, EasyTabService } from "../Services/EasyTabService";

declare let jQuery: any;

export class PayPalCheckout extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load( main: Main ): void {
        let interval = 0;

        // Bind to the easytabs after
        let easyTabsWrap: any = main.easyTabService.easyTabsWrap;
        this.easyTabsCreditCardAfterEvent(easyTabsWrap, main);

        jQuery(window).on('payment_method_selected cfw_updated_checkout', () => {
            let max_iterations = 200;
            let iterations = 0;

            interval = setInterval(() => {
                let main: Main = Main.instance;

                if ( jQuery('input[name="payment_method"]:checked').is('#payment_method_ppec_paypal') && jQuery( '#woo_pp_ec_button_checkout' ).is(':empty') ) {
                    main.tabContainer.triggerUpdatedCheckout();
                } else if( ! jQuery('input[name="payment_method"]:checked').is('#payment_method_ppec_paypal') || ! jQuery( '#woo_pp_ec_button_checkout' ).is(':empty') ) {
                    // Wrong gateway selected OR the button rendered
                    clearInterval(interval);
                } else if( iterations >= max_iterations ) {
                    // Give up
                    clearInterval(interval);
                } else {
                    iterations++;
                }
            }, 50);
        } );

        jQuery(window).on( 'cfw_updated_checkout', () => {
            let isPPEC = jQuery( 'input[name="payment_method"]:checked' ).is( '#payment_method_ppec_paypal' );
            jQuery( '#place_order' ).toggle( ! isPPEC );
            jQuery( '#woo_pp_ec_button_checkout' ).toggle( isPPEC );
        } );
    }

    /**
     * @param easyTabsWrap
     * @param main
     */
    easyTabsCreditCardAfterEvent(easyTabsWrap: any, main: Main): void {
        easyTabsWrap.bind('easytabs:after', (event, clicked, target) => this.refreshPayPalButtons(main, event, clicked, target));
    }

    /**
     * The braintree credit card handler needs to be refreshed when switching to the payment tab from another tab otherwise the fields won't re-generate.
     *
     * @param {Main} main
     * @param {any} event
     * @param {any} clicked
     * @param {any} target
     */
    refreshPayPalButtons(main: Main, event: any, clicked: any, target: any): void {
        let easyTabDirection: EasyTabDirection = EasyTabService.getTabDirection(target);
        let easyTabID: string = EasyTabService.getTabId(easyTabDirection.target);
        let paymentContainerId: string = main.tabContainer.tabContainerSectionBy("name", "payment_method").jel.attr("id");

        if( paymentContainerId === easyTabID ) {
            let isPPEC = jQuery( 'input[name="payment_method"]:checked' ).is( '#payment_method_ppec_paypal' );
            jQuery( '#place_order' ).toggle( ! isPPEC );
            jQuery( '#woo_pp_ec_button_checkout' ).toggle( isPPEC );
        }
    }
}