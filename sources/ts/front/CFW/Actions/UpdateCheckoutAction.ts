import { Action }                           from "./Action";
import { AjaxInfo, FieldTypeInfo }          from "../Types/Types";
import { Main }                             from "../Main";
import { Cart, UpdateCartTotalsData }       from "../Elements/Cart";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { TabContainerSection }              from "../Elements/TabContainerSection";
import { Element }                          from "../Elements/Element";

declare let jQuery: any;

export type UpdateShippingFieldsResponse = {
    error: boolean,
    updated_fields_info: Array<FieldTypeInfo>,
    new_totals: UpdateCartTotalsData,
    needs_payment: boolean,
    updated_ship_methods: any,
    updated_shipping_preview: any
}

export type UpdateShippingFieldsData = {
    action: string,
    security: string,
    shipping_fields_info: Array<FieldTypeInfo>
}

export type UpdateShippingFieldsRI = {
    action: string,
    shipping_details_fields: Array<any>
}

export class UpdateCheckoutAction extends Action {
    /**
     *
     */
    private static _underlyingRequest: any = null;

    /**
     * @param {string} id
     * @param {AjaxInfo} ajaxInfo
     * @param fields
     */
    constructor(id: string, ajaxInfo: AjaxInfo, fields: any) {
        super(id, ajaxInfo.url, Action.prep(id, ajaxInfo, fields));
    }

    public load(): void {
        if(UpdateCheckoutAction.underlyingRequest !== null) {
            UpdateCheckoutAction.underlyingRequest.abort();
        }

        UpdateCheckoutAction.underlyingRequest = jQuery.post(this.url, this.data, this.response.bind(this));
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: any): void {
        let main: Main = Main.instance;
        main.updating = false;

        if(resp.fees) {
            let fees = jQuery.map(resp.fees, value => [value]);

            Cart.outputFees(main.cart.fees, fees);
        }

        if(resp.coupons) {
            let coupons = jQuery.map(resp.coupons, function(value, index) {
                return [value];
            });

            Cart.outputCoupons(main.cart.coupons, coupons);
        }

        // Update shipping methods
        let shipping_method_container = jQuery("#shipping_method");

        shipping_method_container.html("");
        shipping_method_container.append(`${resp.updated_ship_methods}`);

        let shipping_preview_container = jQuery('#cfw-shipping-details-fields');
        shipping_preview_container.html(`${resp.updated_shipping_preview}`);

        // Other totals
        let other_totals_container = jQuery('#cfw-other-totals');
        other_totals_container.html(`${resp.updated_other_totals}`);

        // Save payment details to a temporary object
        var paymentDetails = {};
        jQuery( '.payment_box :input' ).each( function() {
            var ID = jQuery( this ).attr( 'id' );

            if ( ID ) {
                if ( jQuery.inArray( jQuery( this ).attr( 'type' ), [ 'checkbox', 'radio' ] ) !== -1 ) {
                    paymentDetails[ ID ] = jQuery( this ).prop( 'checked' );
                } else {
                    paymentDetails[ ID ] = jQuery( this ).val();
                }
            }
        });

        // Payment methods
        let updated_payment_methods_container = jQuery('#cfw-billing-methods');

        if ( false !== resp.updated_payment_methods ) {
            updated_payment_methods_container.html(`${resp.updated_payment_methods}`);

            // Fill in the payment details if possible without overwriting data if set.
            if ( ! jQuery.isEmptyObject( paymentDetails ) ) {
                jQuery( '.payment_box :input' ).each( function() {
                    var ID = jQuery( this ).attr( 'id' );

                    if ( ID ) {
                        if ( jQuery.inArray( jQuery( this ).attr( 'type' ), [ 'checkbox', 'radio' ] ) !== -1 ) {
                            jQuery( this ).prop( 'checked', paymentDetails[ ID ] ).change();
                        } else if ( null !== jQuery( this ).val() && 0 === jQuery( this ).val().length ) {
                            jQuery( this ).val( paymentDetails[ ID ] ).change();
                        }
                    }
                });
            }
        }

        // Place order button
        let updated_place_order_container = jQuery('#cfw-place-order');
        updated_place_order_container.html(`${resp.updated_place_order}`);

        Main.togglePaymentRequired(resp.needs_payment);

        Cart.outputValues(main.cart, resp.new_totals);

        Main.instance.tabContainer.setShippingMethodUpdate();
        Main.instance.tabContainer.setUpPaymentTabRadioButtons();

		window.dispatchEvent(new CustomEvent("cfw-custom-update-finished"));

        jQuery(document.body).trigger( 'updated_checkout' );
    }

    /**
     * @returns {any}
     */
    static get underlyingRequest(): any {
        return this._underlyingRequest;
    }

    /**
     * @param value
     */
    static set underlyingRequest(value: any) {
        this._underlyingRequest = value;
    }
}