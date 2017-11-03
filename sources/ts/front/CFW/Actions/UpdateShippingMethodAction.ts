import { Action }                           from "./Action";
import { AjaxInfo }                         from "../Types/Types";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { UpdateCartTotalsData }             from "../Elements/Cart";
import { Cart }                             from "../Elements/Cart";
import { Main }                             from "../Main";

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

    /**
     * @param id
     * @param ajaxInfo
     * @param shipping_method
     * @param cart
     */
    constructor(id: string, ajaxInfo: AjaxInfo, shipping_method: any, cart: Cart) {
        let data: UpdateShippingMethodData = {
            action: id,
            security: ajaxInfo.nonce,
            shipping_method: [shipping_method]
        };

        super(id, ajaxInfo.admin_url, data);

        this.cart = cart;
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