import { Compatibility } from "./Compatibility";
import { Main } from "../Main";

declare let jQuery: any;

export class NLPostcodeChecker extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load( main: Main ): void {
        jQuery('body').on('wpo_wcnlpc_fields_updated', () => {
            // Shipping address
            let shipping_street_name = jQuery('#shipping_street_name').val();
            let shipping_house_number = jQuery('#shipping_house_number').val();
            let shipping_house_number_suffix = jQuery('#shipping_house_number_suffix').val();
            let shipping_address_1 = '';

            if ( shipping_street_name && shipping_house_number ) {
                shipping_address_1 = shipping_street_name + ' ' + shipping_house_number;
            }

            if ( shipping_house_number_suffix && shipping_address_1 ) {
                shipping_address_1 = shipping_address_1 + '-' + shipping_house_number_suffix;
            }

            if ( shipping_address_1 ) {
                jQuery('#shipping_address_1').val( shipping_address_1 );
            }

            // Billing address
            let billing_street_name = jQuery('#billing_street_name').val();
            let billing_house_number = jQuery('#billing_house_number').val();
            let billing_house_number_suffix = jQuery('#billing_house_number_suffix').val();
            let billing_address_1 = '';

            if ( billing_street_name && billing_house_number ) {
                billing_address_1 = billing_street_name + ' ' + billing_house_number;
            }

            if ( billing_house_number_suffix && billing_address_1 ) {
                billing_address_1 = billing_address_1 + '-' + billing_house_number_suffix;
            }

            if ( billing_address_1 ) {
                jQuery('#billing_address_1').val( billing_address_1 );
            }
        } );
    }
}