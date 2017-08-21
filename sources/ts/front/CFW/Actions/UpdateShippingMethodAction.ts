import { Action }                           from "./Action";
import { AjaxInfo }                         from "../Types/Types";
import { UpdateShippingMethodData }         from "../Types/Types";
import { UpdateShippingMethodResponse }     from "../Types/Types";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { Cart }                             from "../Elements/Cart";

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
    public response(resp: UpdateShippingMethodResponse) {
        if(resp.new_totals) {
            Cart.outputValues(this.cart, resp.new_totals);
        }
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