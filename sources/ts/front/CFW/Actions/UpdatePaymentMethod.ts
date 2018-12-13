import { Action }                       from "./Action";
import { LogInResponse }                from "../Types/Types";
import { PaymentMethodData }                    from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { Alert, AlertInfo }             from "../Elements/Alert";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";
import { Main }                         from "../Main";

/**
 *
 */
export class UpdatePaymentMethod extends Action {

    /**
     *
     * @param id
     * @param ajaxInfo
     * @param payment_method
     */
    constructor(id: string, ajaxInfo: AjaxInfo, payment_method: string) {
        let data: PaymentMethodData = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
            payment_method: payment_method
        };

        super(id, ajaxInfo.url, data);
    }

    /**
     *
     * @param resp
     */
    @ResponsePrep
    public response(resp: any): void {

    }
}