import {Action} from "./Action";
import {AjaxInfo} from "../Types/Types";
import {Main} from "../Main";
import {Cart} from "../Elements/Cart";
import {ResponsePrep} from "../Decorators/ResponsePrep";
import {TabContainer} from "../Elements/TabContainer";

export class UpdateCheckoutAction extends Action {

    /**
     * @param {string} id
     * @param {AjaxInfo} ajaxInfo
     * @param fields
     */
    constructor(id: string, ajaxInfo: AjaxInfo, fields: any) {
        super(id, ajaxInfo.admin_url, Action.prep(id, ajaxInfo, fields));
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: any): void {
        let main: Main = Main.instance;
        main.updating = false;

        if(resp.fees) {
            let fees = $.map(resp.fees, value => [value]);

            Cart.outputFees(main.cart.fees, fees);
        }

        Cart.outputValues(main.cart, resp.new_totals);

        TabContainer.togglePaymentFields(resp.show_payment_fields);

        $(document.body).trigger( 'updated_checkout' );
    }
}