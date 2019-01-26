import { Compatibility } from "./Compatibility";

declare let jQuery: any;

export class PayPalCheckout extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load(): void {
        jQuery(window).on('load updated_checkout', () => {
            if ( jQuery('#woo_pp_ec_button_checkout').is(':visible') ) {
                var isPPEC = jQuery( '#payment_method_ppec_paypal' ).is(':checked');
                jQuery( '#place_order' ).toggle( ! isPPEC );
                jQuery( '#woo_pp_ec_button_checkout' ).toggle( isPPEC );
            }
        });
    }
}