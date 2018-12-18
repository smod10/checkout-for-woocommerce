import { Action }                           from "./Action";
import { AjaxInfo, FieldTypeInfo }          from "../Types/Types";
import { Main }                             from "../Main";
import { Cart, UpdateCartTotalsData }       from "../Elements/Cart";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { TabContainerSection }              from "../Elements/TabContainerSection";
import { Element }                          from "../Elements/Element";

declare let $:any;

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

        UpdateCheckoutAction.underlyingRequest = $.post(this.url, this.data, this.response.bind(this));
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: any): void {
        let main: Main = Main.instance;
        main.updating = false;

        if(resp.fees) {
            let fees = $.map(resp.fees, value => [value]);

            Cart.outputFees(main.cart.fees, fees);
        }

        if(resp.coupons) {
            let coupons = $.map(resp.coupons, function(value, index) {
                return [value];
            });

            Cart.outputCoupons(main.cart.coupons, coupons);
        }

        // Update shipping methods
        let shipping_method_container = $("#shipping_method");

        shipping_method_container.html("");
        shipping_method_container.append(`${resp.updated_ship_methods}`);

        let shipping_preview_container = $('#cfw-shipping-details-fields');
        shipping_preview_container.html(`${resp.updated_shipping_preview}`);

        // Other totals
        let other_totals_container = $('#cfw-other-totals');
        other_totals_container.html(`${resp.updated_other_totals}`);

        // Payment methods
        let updated_payment_methods_container = $('#cfw-billing-methods');

        if ( false !== resp.updated_payment_methods ) {
            updated_payment_methods_container.html(`${resp.updated_payment_methods}`);
        }

        // Place order button
        let updated_place_order_container = $('#cfw-place-order');
        updated_place_order_container.html(`${resp.updated_place_order}`);

        Main.togglePaymentRequired(resp.needs_payment);

        Cart.outputValues(main.cart, resp.new_totals);

        Main.instance.tabContainer.setShippingMethodUpdate();
        Main.instance.tabContainer.setUpPaymentTabRadioButtons();

		window.dispatchEvent(new CustomEvent("cfw-custom-update-finished"));

        $(document.body).trigger( 'updated_checkout' );
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