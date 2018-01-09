import { Action }                                   from "./Action";
import { AjaxInfo }                                 from "../Types/Types";
import { FieldTypeInfo }                         from "../Types/Types";
import { ResponsePrep }                             from "../Decorators/ResponsePrep";
import { UpdateCartTotalsData }                     from "../Elements/Cart";
import { Cart }                                     from "../Elements/Cart";
import { TabContainer }                             from "../Elements/TabContainer";
import { Main }                                     from "../Main";
import {CompleteOrderAction} from "./CompleteOrderAction";
import {UpdateCheckoutAction} from "./UpdateCheckoutAction";

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

/**
 *
 */
export class UpdateShippingFieldsAction extends Action {

    /**
     * @type {Cart}
     * @private
     */
    private _cart: Cart;

    /**
     * @type {AjaxInfo}
     * @private
     */
    private _ajaxInfo: AjaxInfo;

    /**
     * @type {TabContainer}
     * @private
     */
    private _tabContainer: TabContainer;

    private _fields: any;

    /**
     * @type {Array<JQuery>}
     * @private
     */
    private _shipping_details_fields: Array<JQuery>;

    /**
     * @param id
     * @param ajaxInfo
     * @param shipping_fields_info
     * @param shipping_details_fields
     * @param cart
     * @param tabContainer
     * @param fields
     */
    constructor(id:string, ajaxInfo: AjaxInfo, shipping_fields_info: Array<FieldTypeInfo>, shipping_details_fields: Array<JQuery>, cart: Cart, tabContainer: TabContainer, fields: any) {
        let data: UpdateShippingFieldsData = {
            action: id,
            security: ajaxInfo.nonce,
            shipping_fields_info: shipping_fields_info
        };

        super(id, ajaxInfo.admin_url, data);

        this.shipping_details_fields = shipping_details_fields;
        this.cart = cart;
        this.tabContainer = tabContainer;
        this.ajaxInfo = ajaxInfo;
        this.fields = fields;
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: UpdateShippingFieldsResponse): void {
        if(!resp.error) {
            let updated_shipping_methods: Array<any> = [];

            if(resp.updated_fields_info) {

                if(typeof resp.updated_ship_methods !== "string") {
                    Object.keys(resp.updated_ship_methods).forEach((key) => updated_shipping_methods.push(resp.updated_ship_methods[key]));

                    if(updated_shipping_methods.length > 0) {
                        $("#shipping_method").html("");
                        $("#shipping_method").append("<ul class='cfw-shipping-methods-list'></ul>");

                        // Update shipping methods
                        updated_shipping_methods.forEach((ship_method: string) =>
                            $("#shipping_method ul").append($(`<li>${ship_method}</li>`))
                        );
                    }
                // There is a message
                } else {
                    $("#shipping_method").html("");
                    $("#shipping_method").append(`<div class="shipping-message">${resp.updated_ship_methods}</div>`);
                }

                this.tabContainer.setShippingPaymentUpdate();

                // Update totals
                Cart.outputValues(this.cart, resp.new_totals);
            }

            Main.togglePaymentRequired(resp.needs_payment);
        }

        new UpdateCheckoutAction("update_checkout", Main.instance.ajaxInfo, this.fields).load();
    }

    /**
     * @returns {AjaxInfo}
     */
    get ajaxInfo(): AjaxInfo {
        return this._ajaxInfo;
    }

    /**
     * @param value
     */
    set ajaxInfo(value: AjaxInfo) {
        this._ajaxInfo = value;
    }

    /**
     * @returns {TabContainer}
     */
    get tabContainer(): TabContainer {
        return this._tabContainer;
    }

    /**
     * @param value
     */
    set tabContainer(value: TabContainer) {
        this._tabContainer = value;
    }

    /**
     * @returns {Cart}
     */
    get cart() {
        return this._cart;
    }

    /**
     * @param value
     */
    set cart(value) {
        this._cart = value;
    }

    /**
     * @returns {Array<JQuery>}
     */
    get shipping_details_fields(): Array<JQuery> {
        return this._shipping_details_fields;
    }

    /**
     * @param value
     */
    set shipping_details_fields(value: Array<JQuery>) {
        this._shipping_details_fields = value;
    }

    get fields(): any {
        return this._fields;
    }

    set fields(value: any) {
        this._fields = value;
    }
}