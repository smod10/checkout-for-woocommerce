import { Action }                           from "./Action";
import { AjaxInfo }                         from "../Types/Types";
import { Main }                             from "../Main";
import { Cart }                             from "../Elements/Cart";
import { ResponsePrep }                     from "../Decorators/ResponsePrep";
import { TabContainer }                     from "../Elements/TabContainer";
import {TabContainerSection} from "../Elements/TabContainerSection";
import {Element} from "../Elements/Element";

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

        let updated_shipping_methods: Array<any> = [];

        if(typeof resp.updated_ship_methods !== "string") {
            Object.keys(resp.updated_ship_methods).forEach((key) => updated_shipping_methods.push(resp.updated_ship_methods[key]));

            if(updated_shipping_methods.length > 0) {
                $("#shipping_method").html("");
                $("#shipping_method").append("<ul class='cfw-shipping-methods-list'></ul>");

                // Update shipping methods
                updated_shipping_methods.forEach((ship_method: string) =>
                    $("#shipping_method ul").append($(`<li>${ship_method}</li>`))
                );
            }
            // There is a message
        } else {
            $("#shipping_method").html("");
            $("#shipping_method").append(`<div class="shipping-message">${resp.updated_ship_methods}</div>`);
        }

        Main.instance.tabContainer.setShippingPaymentUpdate();

        Main.togglePaymentRequired(resp.needs_payment);

        Cart.outputValues(main.cart, resp.new_totals);

        TabContainer.togglePaymentFields(resp.show_payment_fields);

        this.updateShippingDetails();

        $(document.body).trigger( 'updated_checkout' );
    }

    public updateShippingDetails(): void {
        let customer_info_tab: TabContainerSection = Main.instance.tabContainer.tabContainerSectionBy("name", "customer_info");

        customer_info_tab.getInputsFromSection(", select").forEach((item: Element) => {
            let value = item.jel.val();
            let key = item.jel.attr("field_key");

            $(`.cfw-shipping-details-field[field_type="${key}"] .field_value`).text(value);
        });
    }
}