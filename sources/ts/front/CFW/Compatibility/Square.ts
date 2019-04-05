import { Compatibility } from "./Compatibility";
import { Main } from "../Main";

declare let jQuery: any;

export class Square extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load( main: Main ): void {
        let easyTabsWrap: any = main.easyTabService.easyTabsWrap;

        jQuery(window).on('payment_method_selected cfw_updated_checkout', () => {
            jQuery.wc_square_payments.loadForm();
        } );

        easyTabsWrap.bind('easytabs:after', (event, clicked, target) => {
            if ( jQuery(target).attr('id') == 'cfw-payment-method' ) {
                jQuery.wc_square_payments.loadForm();
            }
        } );
    }
}