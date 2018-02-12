import { Action }                           from "./Action";
import { AjaxInfo }                         from "../Types/Types";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { UpdateCartTotalsData }             from "../Elements/Cart";
import { Cart }                             from "../Elements/Cart";
import { Main }                             from "../Main";
import { UpdateCheckoutAction }             from "./UpdateCheckoutAction";

export type UpdateShippingMethodData = {
    "wc-ajax": string,
    security: string,
    shipping_method: any
}

export type UpdateShippingMethodResponse = {
    new_totals: UpdateCartTotalsData,
    needs_payment: boolean
}

/**
 *
 */
export class UpdateShippingMethodAction extends Action {

    /**
     * @type {Cart}
     * @private
     */
    private _cart: Cart;

    /**
     *
     */
    private _fields: any;

    /**
     *
     */
    private static _underlyingRequest: any = null;

    /**
     * @param id
     * @param ajaxInfo
     * @param shipping_method
     * @param cart
     * @param fields
     */
    constructor(id: string, ajaxInfo: AjaxInfo, shipping_method: any, cart: Cart, fields: any) {
        let data: UpdateShippingMethodData = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
            shipping_method: [shipping_method]
        };

        super(id, ajaxInfo.url, data);

        this.cart = cart;
        this.fields = fields;
    }

    public load(): void {
        if(UpdateShippingMethodAction.underlyingRequest !== null) {
            UpdateShippingMethodAction.underlyingRequest.abort();
        }

        UpdateShippingMethodAction.underlyingRequest = $.post(this.url, this.data, this.response.bind(this));
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: UpdateShippingMethodResponse): void {
        UpdateShippingMethodAction.underlyingRequest = null;

        if(resp.new_totals) {
            Cart.outputValues(this.cart, resp.new_totals);
        }

        Main.togglePaymentRequired(resp.needs_payment);

        new UpdateCheckoutAction("update_checkout", Main.instance.ajaxInfo, this.fields).load();
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
     * @returns {any}
     */
    get fields(): any {
        return this._fields;
    }

    /**
     * @param value
     */
    set fields(value: any) {
        this._fields = value;
    }

    /**
     * @returns {Cart}
     */
    get cart(): Cart {
        return this._cart;
    }

    /**
     * @param value
     */
    set cart(value: Cart) {
        this._cart = value;
    }
}