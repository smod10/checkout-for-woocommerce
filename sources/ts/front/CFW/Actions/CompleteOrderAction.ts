import { Action }                               from "./Action";
import { AjaxInfo }                             from "../Types/Types";
import { AlertInfo }                            from "../Elements/Alert";
import { Alert }                                from "../Elements/Alert";
import { ValidationService }                    from "../Services/ValidationService";
import { EValidationSections }                  from "../Services/ValidationService";
import { Main }                                 from "../Main";

export class CompleteOrderAction extends Action {

    /**
     * @type {boolean}
     * @static
     * @private
     */
    private static _preppingOrder: boolean = false;

    /**
     *
     * @param id
     * @param ajaxInfo
     * @param checkoutData
     */
    constructor(id: string, ajaxInfo: AjaxInfo, checkoutData: any) {
        super(id, ajaxInfo.admin_url, Action.prep(id, ajaxInfo, checkoutData));

        Main.addOverlay();

        this.setup();
    }

    /**
     * The setup function which mainly determines if we need a stripe token to continue
     */
    setup(): void {
        Main.instance.checkoutForm.off('form:validate');

        this.load();
    }

    /**
     * @param resp
     */
    public response(resp: any): void {

        if(resp.result === "success") {
            // Destroy all the cache!
            $('.garlic-auto-save').each((index: number, elem: Element) => $(elem).garlic('destroy'));

            // Destroy all the parsley!
            Main.instance.checkoutForm.parsley().destroy();

            // Redirect all the browsers! (well just the 1)
            window.location.href = resp.redirect;
        }

        if(resp.result === "failure") {
            let alertInfo: AlertInfo = {
                type: "AccPassRequiredField",
                message: resp.messages,
                cssClass: "cfw-alert-danger"
            };

            let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
            alert.addAlert();

            this.resetData();
        }
    }

    /**
     *
     */
    resetData(): void {
        $('#cfw-password').val(this.data["account_password"]);
        $("#billing_email").val(this.data.billing_email);

        $("#billing_first_name").val(this.data.billing_first_name);
        $("#billing_last_name").val(this.data.billing_last_name);
        $("#billing_company").val(this.data.billing_company);
        $("#billing_country").val(this.data.billing_country);
        $("#billing_address_1").val(this.data.billing_address_1);
        $("#billing_address_2").val(this.data.billing_address_2);
        $("#billing_city").val(this.data.billing_city);
        $("#billing_state").val(this.data.billing_state);
        $("#billing_postcode").val(this.data.billing_postcode);

        $("#shipping_first_name").val(this.data.shipping_first_name);
        $("#shipping_last_name").val(this.data.shipping_last_name);
        $("#shipping_company").val(this.data.shipping_company);
        $("#shipping_country").val(this.data.shipping_country);
        $("#shipping_address_1").val(this.data.shipping_address_1);
        $("#shipping_address_2").val(this.data.shipping_address_2);
        $("#shipping_city").val(this.data.shipping_city);
        $("#shipping_state").val(this.data.shipping_state);
        $("#shipping_postcode").val(this.data.shipping_postcode);
        $("[name='shipping_method[0]']").each((index, elem) => {
            if($(elem).val() == this.data["shipping_method[0]"]) {
                $(elem).prop('checked', true);
            }
        });
        $("[name='ship_to_different_address']").each((index, elem) => {
            if($(elem).val() == this.data.ship_to_different_address) {
                $(elem).prop('checked', true);
            }
        });
        $('[name="payment_method"]').each((index, elem) => {
            if($(elem).val() == this.data.payment_method) {
                $(elem).prop('checked', true);
            }
        });
        $("[name='wc-stripe-payment-token']").each((index, elem) => {
            if($(elem).val() == this.data["wc-stripe-payment-token"]) {
                $(elem).prop('checked', true);
            }
        });
        $("#terms").attr("checked", <any>(this.data.terms === "on"));
        $("[name='stripe_token']").remove();

        $("#_wpnonce").val(this.data._wpnonce);
        $("[name='_wp_http_referer']").val(this.data._wp_http_referer);
        $("#cfw-login-btn").val("Login");

        ValidationService.validate(EValidationSections.SHIPPING);
        ValidationService.validate(EValidationSections.BILLING);
        ValidationService.validate(EValidationSections.ACCOUNT);
    }

    /**
     * @returns {boolean}
     */
    static get preppingOrder(): boolean {
        return this._preppingOrder;
    }

    /**
     * @param {boolean} value
     */
    static set preppingOrder(value: boolean) {
        this._preppingOrder = value;
    }
}