import { Action }                               from "./Action";
import { AjaxInfo }                             from "../Types/Types";
import { StripeNoDataResponse }                 from "../Types/Types";
import { StripeBadDataResponse }                from "../Types/Types";
import { StripeValidResponse }                  from "../Types/Types";
import { StripeServiceCallbacks }               from "../Types/Types"
import { StripeService }                        from "../Services/StripeService";
import { AlertInfo }                            from "../Elements/Alert";
import { Alert }                                from "../Elements/Alert";

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

        // We do a normal object here becuase to make a new type just to add two different options seems silly.
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

        this.stripeServiceCallbacks = {
            success: (response: StripeValidResponse) => {
                this.stripeResponse = response;
                this.addStripeTokenToData(response.id);
                this.needsStripeToken = false;
                this.load();
            },
            noData: (response: StripeNoDataResponse) => console.log("Stripe has no data to go off of. Try putting some in"),
            badData: (response: StripeBadDataResponse) => console.log("Stripe has had bad or invalid data entered")
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
     *
     * @param resp
     */
    public response(resp: any) {
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
        }
    }
}