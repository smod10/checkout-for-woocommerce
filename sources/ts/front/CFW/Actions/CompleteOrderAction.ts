/**
 *
 */
import {Action} from "./Action";
import {AjaxInfo, CompleteOrderData, CompleteOrderResponse} from "../Types/Types";
import {ResponsePrep} from "../Decorators/ResponsePrep";

export class CompleteOrderAction extends Action {

    /**
     *
     * @param id
     * @param ajaxInfo
     */
    constructor(id: string, ajaxInfo: AjaxInfo) {
        let data: CompleteOrderData = {
            action: id,
            security: ajaxInfo.nonce
        };

        $("form.woocommerce-checkout").trigger('checkout_place_order_stripe');
        $("form.woocommerce-checkout").on('submit', (event) => event.preventDefault());

        super(id, ajaxInfo.admin_url, data);
    }

    /**
     *
     * @param resp
     */
    @ResponsePrep
    public response(resp: CompleteOrderResponse) {
        console.log(resp);
    }
}