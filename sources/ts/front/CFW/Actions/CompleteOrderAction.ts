import { Action }                               from "./Action";
import { AjaxInfo }                             from "../Types/Types";
import { StripeNoDataResponse }                 from "../Types/Types";
import { StripeBadDataResponse }                from "../Types/Types";
import { StripeValidResponse }                  from "../Types/Types";
import { StripeServiceCallbacks }               from "../Types/Types"
import { StripeService }                        from "../Services/StripeService";
import { AlertInfo }                            from "../Elements/Alert";
import { Alert }                                from "../Elements/Alert";
import { Main }                                 from "../Main";
import {EValidationSections, ValidationService} from "../Services/ValidationService";

export class CompleteOrderAction extends Action {

    /**
     * @type {boolean}
     * @static
     * @private
     */
    private static _preppingOrder: boolean = false;

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
        super(id, ajaxInfo.admin_url, Action.prep(id, ajaxInfo, checkoutData));

        $("#cfw-content").addClass("show-overlay");

        this.stripeServiceCallbacks = {
            success: (response: StripeValidResponse) => {
                this.stripeResponse = response;
                this.addStripeTokenToData(response.id);
                this.needsStripeToken = false;

                $("#checkout").off('form:validate');

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
        if(StripeService.hasStripe() && StripeService.hasNewPayment() && Main.isPaymentRequired()) {
            this.needsStripeToken = true;

            StripeService.setupStripeMessageListener(this.stripeServiceCallbacks);
            StripeService.triggerStripe();
        } else {
            this.needsStripeToken = false;

            $("#checkout").off('form:validate');

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
     * @param resp
     */
    public response(resp: any): void {

        if(resp.result === "success") {
            // Destroy all the cache!
            $('.garlic-auto-save').each((index: number, elem: Element) => $(elem).garlic('destroy'));

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