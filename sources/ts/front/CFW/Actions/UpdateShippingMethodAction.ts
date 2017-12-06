import { Action }                           from "./Action";
import { AjaxInfo }                         from "../Types/Types";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { UpdateCartTotalsData }             from "../Elements/Cart";
import { Cart }                             from "../Elements/Cart";
import { Main }                             from "../Main";
import {UpdateCheckoutAction} from "./UpdateCheckoutAction";

export type UpdateShippingMethodData = {
    action: string,
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

    private _fields: any;

    /**
     * @param id
     * @param ajaxInfo
     * @param shipping_method
     * @param cart
     * @param fields
     */
    constructor(id: string, ajaxInfo: AjaxInfo, shipping_method: any, cart: Cart, fields: any) {
        let data: UpdateShippingMethodData = {
            action: id,
            security: ajaxInfo.nonce,
            shipping_method: [shipping_method]
        };

        super(id, ajaxInfo.admin_url, data);

        this.cart = cart;
        this.fields = fields;
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: UpdateShippingMethodResponse): void {
        if(resp.new_totals) {
            Cart.outputValues(this.cart, resp.new_totals);
        }

        Main.togglePaymentRequired(resp.needs_payment);

        new UpdateCheckoutAction("update_checkout", Main.instance.ajaxInfo, this.fields).load();
    }

    get fields(): any {
        return this._fields;
    }

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