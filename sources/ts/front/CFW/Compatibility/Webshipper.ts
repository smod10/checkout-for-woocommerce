import { Compatibility } from "./Compatibility";
import { Main } from "../Main";

declare let jQuery: any;

export class Webshipper extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load( main: Main ): void {
        let cfw_before_totals_container = jQuery("#cfw-before-totals");

        cfw_before_totals_container.hide();

        jQuery(window).on( 'update_checkout', () => {
            jQuery("#cfw-shipping-method-list .pakkeshop_dropdown").remove();
        } );

        jQuery(window).on( 'cfw_updated_checkout', () => {
            let pakkeshop_dropdown_table = jQuery("#cfw-before-totals table:contains('Pakkeshop')");
            jQuery("#cfw-shipping-method-list .pakkeshop_dropdown").remove();

            if ( pakkeshop_dropdown_table.length ) {
                pakkeshop_dropdown_table.addClass('pakkeshop_dropdown').appendTo( "#cfw-shipping-method-list" );
            }

            cfw_before_totals_container.show();
        } );
    }
}