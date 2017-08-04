import { Action }                               from "./Action";
import { AjaxInfo }                             from "../Types/Types";
import { CompleteOrderData }                    from "../Types/Types";
import { CompleteOrderResponse }                from "../Types/Types";
import { StripeNoDataResponse }                 from "../Types/Types";
import { StripeBadDataResponse }                from "../Types/Types";
import { StripeValidResponse }                  from "../Types/Types";
import { StripeServiceCallbacks }               from "../Types/Types"
import { ResponsePrep }                         from "../Decorators/ResponsePrep";
import { StripeService }                        from "../Services/StripeService";

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
     * {StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse}
     * @private
     */
    private _stripeResponse: StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse;

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

        super(id, ajaxInfo.admin_url, data);

        this.stripeServiceCallbacks = {
            success: (response: StripeValidResponse) => {
                this.stripeResponse = response;
                this.needsStripeToken = false;
                this.load();
            },
            noData: (response: StripeNoDataResponse) => console.log("Stripe has no data to go off of. Try putting some in"),
            badData: (response: StripeBadDataResponse) => console.log("Stripe has had bad or invalid data entered")
        };

        this.setup();
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
    @ResponsePrep
    public response(resp: CompleteOrderResponse) {
        console.log(resp);
    }
}