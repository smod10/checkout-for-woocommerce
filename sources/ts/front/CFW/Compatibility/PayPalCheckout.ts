import { Compatibility } from "./Compatibility";

export class PayPalCheckout extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load(): void {
        $(window).on('load updated_checkout', () => {
            if ( $('#woo_pp_ec_button_checkout').is(':visible') ) {
                var isPPEC = $( '#payment_method_ppec_paypal' ).is(':checked');
                $( '#place_order' ).toggle( ! isPPEC );
                $( '#woo_pp_ec_button_checkout' ).toggle( isPPEC );
            }
        });
    }
}