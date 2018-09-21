import { Action }                           from "./Action";
import { AjaxInfo, FieldTypeInfo }          from "../Types/Types";
import { Main }                             from "../Main";
import { Cart, UpdateCartTotalsData }       from "../Elements/Cart";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { TabContainerSection }              from "../Elements/TabContainerSection";
import { Element }                          from "../Elements/Element";

export type UpdateShippingFieldsResponse = {
    error: boolean,
    updated_fields_info: Array<FieldTypeInfo>,
    new_totals: UpdateCartTotalsData,
    needs_payment: boolean,
    updated_ship_methods: any
}

export type UpdateShippingFieldsData = {
    action: string,
    security: string,
    shipping_fields_info: Array<FieldTypeInfo>
}

export type UpdateShippingFieldsRI = {
    action: string,
    shipping_details_fields: Array<JQuery>
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

        Main.togglePaymentRequired(resp.needs_payment);

        Cart.outputValues(main.cart, resp.new_totals);

        UpdateCheckoutAction.updateShippingDetails();

        Main.instance.tabContainer.setShippingPaymentUpdate();

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

    /**
     * Update the shipping details on the shipping panel
     */
    public static updateShippingDetails(): void {
        let customer_info_tab: TabContainerSection = Main.instance.tabContainer.tabContainerSectionBy("name", "customer_info");

        customer_info_tab.getInputsFromSection(", select").forEach((item: Element) => {
            let value = item.jel.val();
            let key = item.jel.attr("field_key");

            $(`.cfw-shipping-details-field[field_type="${key}"] .field_value`).text(value);
        });
    }
}