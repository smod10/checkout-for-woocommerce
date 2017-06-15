import { Action }                           from "./Action";
import { AjaxInfo }                         from "../Types/Types";
import { UpdateShippingMethodData }         from "../Types/Types";
import { UpdateShippingMethodResponse }     from "../Types/Types";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";

export class UpdateShippingMethodAction extends Action {
    constructor(id: string, ajaxInfo: AjaxInfo, shipping_method: any) {
        let data: UpdateShippingMethodData = {
            action: id,
            security: ajaxInfo.nonce,
            shipping_method: [shipping_method]
        };

        super(id, ajaxInfo.admin_url, data);
    }

    @ResponsePrep
    public response(resp: UpdateShippingMethodResponse) {
        if(resp.new_shipping_total) {
            $("#cfw-cart-shipping-total .amount").html(resp.new_shipping_total);
        }
    }
}