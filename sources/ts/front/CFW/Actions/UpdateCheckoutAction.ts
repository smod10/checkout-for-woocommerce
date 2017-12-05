import {Action} from "./Action";
import {AjaxInfo} from "../Types/Types";
import {Main} from "../Main";
import {Cart} from "../Elements/Cart";
import {ResponsePrep} from "../Decorators/ResponsePrep";

export class UpdateCheckoutAction extends Action {

    constructor(id: string, ajaxInfo: AjaxInfo, fields: any) {
        super(id, ajaxInfo.admin_url, Action.prep(id, ajaxInfo, fields));
    }

    @ResponsePrep
    public response(resp: any): void {
        let main: Main = Main.instance;
        main.updating = false;

        Object.keys(resp.fees).forEach(key => console.log(key, resp.fees[key]));

        if(resp.fees) {
            let fees = $.map(resp.fees, function(value, index) {
                return [value]
            });

            Cart.outputFees(main.cart.fees, fees);
        }
    }
}