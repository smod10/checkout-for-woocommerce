import { Compatibility } from "./Compatibility";
import { Main } from "../Main";

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
}