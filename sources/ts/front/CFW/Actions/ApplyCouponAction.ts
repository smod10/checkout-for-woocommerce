import { Action }                       from "./Action";
import { AjaxInfo }                     from "../Types/Types";
import { Cart }                         from "../Elements/Cart";
import { Alert, AlertInfo }             from "../Elements/Alert";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";
import { Main }                         from "../Main";
import {UpdateCheckoutAction} from "./UpdateCheckoutAction";

/**
 *
 */
export class ApplyCouponAction extends Action {

    /**
     * @type {Cart}
     * @private
     */
    private _cart: Cart;

    private _fields: any;

    /**
     * @param {string} id
     * @param {AjaxInfo} ajaxInfo
     * @param {string} code
     * @param {Cart} cart
     * @param {any} fields
     */
    constructor(id: string, ajaxInfo: AjaxInfo, code: string, cart: Cart, fields: any) {
        let data: {} = {
            action: id,
            security: ajaxInfo.nonce,
            coupon_code: code
        };

        super(id, ajaxInfo.admin_url, data);

        this.cart = cart;
        this.fields = fields;
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: any): void {
        let alertInfo: AlertInfo;

        if(resp.new_totals) {
            Cart.outputValues(this.cart, resp.new_totals);
        }

        if(resp.coupons) {
            let coupons = $.map(resp.coupons, function(value, index) {
                return [value];
            });

            Cart.outputCoupons(this.cart.coupons, coupons);
        }

        if(resp.message.success) {
            alertInfo = {
                type: "ApplyCouponSuccess",
                message: resp.message.success[0],
                cssClass: "cfw-alert-success"
            };
        }

        if(resp.message.error) {
            alertInfo = {
                type: "ApplyCouponError",
                message: resp.message.error[0],
                cssClass: "cfw-alert-danger"
            };
        }

        let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
        alert.addAlert();

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
     * @param {Cart} value
     */
    set cart(value: Cart) {
        this._cart = value;
    }
}