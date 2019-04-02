import { Compatibility } from "./Compatibility";
import { Main } from "../Main";

declare let jQuery: any;

export class BlueCheck extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load( main: Main ): void {
        jQuery(document).on( 'cfw_updated_checkout', function() {
            let checkout_form: any = main.checkoutForm;
            let lookFor: Array<string> = main.settings.default_address_fields;

            if ( checkout_form.find('input[name="ship_to_different_address"]:checked').val() === "same_as_shipping" ) {
                lookFor.forEach( field => {
                    let billing = jQuery(`#billing_${field}`);
                    let shipping = jQuery(`#shipping_${field}`);

                    if(billing.length > 0) {
                        billing.val(shipping.val());
                        billing.trigger("keyup");
                    }
                });
            }
        } );
    }
}