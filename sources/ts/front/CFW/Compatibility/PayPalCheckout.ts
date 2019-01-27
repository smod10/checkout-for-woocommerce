import { Compatibility } from "./Compatibility";
import {Main} from "../Main";
import {EasyTabDirection, EasyTabService} from "../Services/EasyTabService";

declare let jQuery: any;

export class PayPalCheckout extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load(main: Main): void {
        let easyTabsWrap: any = main.easyTabService.easyTabsWrap;

        easyTabsWrap.bind('easytabs:after', (event, clicked, target) => {
            let easyTabDirection: EasyTabDirection = EasyTabService.getTabDirection(target);
            let payment_tab_id = main.tabContainer.tabContainerSectionBy("name", "payment_method").jel.attr("id");
            let current_tab_id = EasyTabService.getTabId(easyTabDirection.target);

            if ( payment_tab_id == current_tab_id ) {
                jQuery(document.body).trigger( 'updated_checkout' );
            }
        });

        jQuery(window).on('load updated_checkout', () => {
            if ( jQuery('#woo_pp_ec_button_checkout').is(':visible') ) {
                var isPPEC = jQuery( '#payment_method_ppec_paypal' ).is(':checked');
                jQuery( '#place_order' ).toggle( ! isPPEC );
                jQuery( '#woo_pp_ec_button_checkout' ).toggle( isPPEC );
            }
        });
    }
}