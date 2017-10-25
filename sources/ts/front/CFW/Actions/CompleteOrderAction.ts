import { Action }                               from "./Action";
import { AjaxInfo }                             from "../Types/Types";
import { StripeNoDataResponse }                 from "../Types/Types";
import { StripeBadDataResponse }                from "../Types/Types";
import { StripeValidResponse }                  from "../Types/Types";
import { StripeServiceCallbacks }               from "../Types/Types"
import { StripeService }                        from "../Services/StripeService";
import { AlertInfo }                            from "../Elements/Alert";
import { Alert }                                from "../Elements/Alert";
import {Main} from "../Main";
import {EValidationSections} from "../Services/ValidationService";

export class CompleteOrderAction extends Action {

    /**
     * Do we need a stripe token to continue load?
     *
     * @type {boolean}
     * @private
     */
    private _needsStripeToken: boolean;

    /**
     * Stripe service callbacks for various response types
     *
     * @type {StripeServiceCallbacks}
     * @private
     */
    private _stripeServiceCallbacks: StripeServiceCallbacks;

    /**
     * Current stripe response data
     *
     * @type {StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse}
     * @private
     */
    private _stripeResponse: StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse;

    /**
     *
     * @param id
     * @param ajaxInfo
     * @param checkoutData
     */
    constructor(id: string, ajaxInfo: AjaxInfo, checkoutData: any) {

        // We do a normal object here because to make a new type just to add two different options seems silly.
        let data: {} = {
            action: id,
            security: ajaxInfo.nonce,
            billing_first_name: checkoutData.billing_first_name,
            billing_last_name: checkoutData.billing_last_name,
            billing_company: checkoutData.billing_company,
            billing_country: checkoutData.billing_country,
            billing_address_1: checkoutData.billing_address_1,
            billing_address_2: checkoutData.billing_address_2,
            billing_city: checkoutData.billing_city,
            billing_state: checkoutData.billing_state,
            billing_postcode: checkoutData.billing_postcode,
            billing_phone: checkoutData.billing_phone,
            billing_email: checkoutData.billing_email,
            ship_to_different_address: checkoutData.ship_to_different_address,
            shipping_first_name: checkoutData.shipping_first_name,
            shipping_last_name: checkoutData.shipping_last_name,
            shipping_company: checkoutData.shipping_company,
            shipping_country: checkoutData.shipping_country,
            shipping_address_1: checkoutData.shipping_address_1,
            shipping_address_2: checkoutData.shipping_address_2,
            shipping_city: checkoutData.shipping_city,
            shipping_state: checkoutData.shipping_state,
            shipping_postcode: checkoutData.shipping_postcode,
            order_comments: checkoutData.order_comments,
            "shipping_method[0]": checkoutData["shipping_method[0]"],
            payment_method: checkoutData.payment_method,
            "wc-stripe-payment-token": checkoutData["wc-stripe-payment-token"],
            _wpnonce: checkoutData._wpnonce,
            _wp_http_referer: checkoutData._wp_http_referer,
            "wc-authorize-net-aim-account-number": checkoutData["wc-authorize-net-aim-account-number"],
            "wc-authorize-net-aim-expiry": checkoutData["wc-authorize-net-aim-expiry"],
            "wc-authorize-net-aim-csc": checkoutData["wc-authorize-net-aim-csc"],
            "paypal_pro_payflow-card-number": checkoutData["paypal_pro_payflow-card-number"],
            "paypal_pro_payflow-card-expiry": checkoutData["paypal_pro_payflow-card-expiry"],
            "paypal_pro_payflow-card-cvc": checkoutData["paypal_pro_payflow-card-cvc"],
            "paypal_pro-card-number": checkoutData["paypal_pro-card-number"],
            "paypal_pro-card-expiry": checkoutData["paypal_pro-card-expiry"],
            "paypal_pro-card-cvc": checkoutData["paypal_pro-card-cvc"],
        };

        if(checkoutData.account_password) {
            data["account_password"] = checkoutData.account_password;
        }

        if(checkoutData.createaccount) {
            data["createaccount"] = checkoutData.createaccount;
        }

        if(checkoutData["wc-stripe-new-payment-method"]) {
            data["wc-stripe-new-payment-method"] = checkoutData["wc-stripe-new-payment-method"];
        }

        super(id, ajaxInfo.admin_url, data);

        $("#cfw-content").addClass("show-overlay");

        this.stripeServiceCallbacks = {
            success: (response: StripeValidResponse) => {
                this.stripeResponse = response;
                this.addStripeTokenToData(response.id);
                this.needsStripeToken = false;
                this.load();
            },
            noData: (response: StripeNoDataResponse) => {
                let alertInfo: AlertInfo = {
                    type: "StripeNoDataError",
                    message: "Stripe: " + response.error.message,
                    cssClass: "cfw-alert-danger"
                };

                let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
                alert.addAlert();
            },
            badData: (response: StripeBadDataResponse) => {
                let alertInfo: AlertInfo = {
                    type: "StripeBadDataError",
                    message: "Stripe: " + response.error.message,
                    cssClass: "cfw-alert-danger"
                };

                let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
                alert.addAlert();

                this.resetData();
            }
        };

        this.setup();
    }

    /**
     * Provided a Stripe Token was given add it to the data that will be sent with the request
     *
     * @param {string} stripeToken
     */
    addStripeTokenToData(stripeToken: string): void {
        if(stripeToken) {
            this.data["stripe_token"] = stripeToken;

            if(!this.data["payment_method"]) {
                this.data["payment_method"] = "stripe";
            }
        }
    }

    /**
     * The setup function which mainly determines if we need a stripe token to continue
     */
    setup(): void {
        if(StripeService.hasStripe() && StripeService.hasNewPayment()) {
            this.needsStripeToken = true;

            StripeService.setupStripeMessageListener(this.stripeServiceCallbacks);
            StripeService.triggerStripe();
        } else {
            this.needsStripeToken = false;
            this.load();
        }
    }

    /**
     * Overridden to handle if we need a stripe token or not.
     */
    load(): void {
        if(!this.needsStripeToken) {
            super.load();
        }
    }

    /**
     * @returns {boolean}
     */
    get needsStripeToken(): boolean {
        return this._needsStripeToken;
    }

    /**
     * @param {boolean} value
     */
    set needsStripeToken(value: boolean) {
        this._needsStripeToken = value;
    }

    /**
     * @returns {StripeServiceCallbacks}
     */
    get stripeServiceCallbacks(): StripeServiceCallbacks {
        return this._stripeServiceCallbacks;
    }

    /**
     * @param {StripeServiceCallbacks} value
     */
    set stripeServiceCallbacks(value: StripeServiceCallbacks) {
        this._stripeServiceCallbacks = value;
    }

    /**
     * @returns {StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse}
     */
    get stripeResponse(): StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse {
        return this._stripeResponse;
    }

    /**
     * @param {StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse} value
     */
    set stripeResponse(value: StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse) {
        this._stripeResponse = value;
    }

    /**
     * @param resp
     */
    public response(resp: any): void {

        if(resp.result === "success") {
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
        $("#cfw-email").val(this.data.billing_email);

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
        $("[name='shipping_same']").each((index, elem) => {
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

        $("#_wpnonce").val(this.data._wpnonce);
        $("[name='_wp_http_referer']").val(this.data._wp_http_referer);
        $("#cfw-login-btn").val("Login");

        Main.instance.validationService.validate(EValidationSections.SHIPPING);
        Main.instance.validationService.validate(EValidationSections.BILLING);
        Main.instance.validationService.validate(EValidationSections.ACCOUNT);
    }
}