import { Action }                           from "./Action";
import { AjaxInfo, FieldTypeInfo }          from "../Types/Types";
import { Main }                             from "../Main";
import { Cart, UpdateCartTotalsData }       from "../Elements/Cart";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";;

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
        super( id, ajaxInfo.url, Action.prep(id, ajaxInfo, fields) );
    }

    public load(): void {
        if( UpdateCheckoutAction.underlyingRequest !== null ) {
            UpdateCheckoutAction.underlyingRequest.abort();
        }

        UpdateCheckoutAction.underlyingRequest = jQuery.post( this.url, this.data, this.response.bind(this) );
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: any): void {
        let main: Main = Main.instance;

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

        // Before totals
        let before_totals_container = jQuery('#cfw-before-totals');
        before_totals_container.html(`${resp.updated_before_totals}`);

        // Other totals
        let after_totals_container = jQuery('#cfw-after-totals');
        after_totals_container.html(`${resp.updated_after_totals}`);

        // Payment methods
        let updated_payment_methods_container = jQuery('#cfw-billing-methods');

        /**
         * Updated payment methods will be false if md5 fingerprint hasn't changed
         */
        if ( false !== resp.updated_payment_methods ) {
            /**
             * Save payment details to a temporary object
             */
            let paymentDetails = {};
            jQuery( '.payment_box :input' ).each( function() {
                let ID = jQuery( this ).attr( 'id' );

                if ( ID ) {
                    if ( jQuery.inArray( jQuery( this ).attr( 'type' ), [ 'checkbox', 'radio' ] ) !== -1 ) {
                        paymentDetails[ ID ] = jQuery( this ).prop( 'checked' );
                    } else {
                        paymentDetails[ ID ] = jQuery( this ).val();
                    }
                }
            });

            updated_payment_methods_container.html(`${resp.updated_payment_methods}`);

            /**
             * Fill in the payment details if possible without overwriting data if set.
             */
            if ( ! jQuery.isEmptyObject( paymentDetails ) ) {
                jQuery( '.payment_box :input' ).each( function() {
                    let ID = jQuery( this ).attr( 'id' );

                    if ( ID ) {
                        if ( jQuery.inArray( jQuery( this ).attr( 'type' ), [ 'checkbox', 'radio' ] ) !== -1 ) {
                            jQuery( this ).prop( 'checked', paymentDetails[ ID ] ).change();
                        } else if ( null !== jQuery( this ).val() && 0 === jQuery( this ).val().length ) {
                            jQuery( this ).val( paymentDetails[ ID ] ).change();
                        }
                    }
                });
            }

            // Setup payment gateway radio buttons again
            // since we replaced the HTML
            Main.instance.tabContainer.setUpPaymentGatewayRadioButtons();
        }

        // Update Place Order Button Container
        let updated_place_order_container = jQuery('#cfw-place-order');
        updated_place_order_container.replaceWith(`${resp.updated_place_order}`);

        // Update cart
        let updated_cart = jQuery('#cfw-cart-list');
        updated_cart.replaceWith(`${resp.updated_cart}`)

        // Toggle payment required, in case it has changed
        Main.togglePaymentRequired(resp.needs_payment);

        // Update Cart Totals
        Cart.outputValues(main.cart, resp.new_totals);

        /**
         * Re-init Payment Gateways
         */
        main.tabContainer.initSelectedPaymentGateway();

        /**
         * A custom event that runs every time, since we are supressing
         * updated_checkout if the payment gateways haven't updated
         */
		jQuery(document.body).trigger( 'cfw_updated_checkout' );

		if ( main.force_updated_checkout == true || false !== resp.updated_payment_methods ) {
		    main.force_updated_checkout = false;
            Main.instance.tabContainer.triggerUpdatedCheckout();
        }

        main.updating = false;
        updated_payment_methods_container.unblock();
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