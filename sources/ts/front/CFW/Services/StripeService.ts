import { StripeNoDataResponse }                         from "../Types/Types";
import { StripeBadDataResponse }                        from "../Types/Types";
import { StripeResponse }                               from "../Types/Types";
import { StripeValidResponse }                          from "../Types/Types";
import { StripeServiceCallbacks }                       from "../Types/Types";

/**
 * Handles intercepting the stripe javascript to and from data. Performs various actions based on the data returned
 */
export class StripeService {

    /**
     * @type {[string]}
     * @private
     */
    private static _serviceUrls: Array<string> = ["https://js.stripe.com"];

    /**
     * Setup the stripe message listener with our callbacks
     *
     * @param {StripeServiceCallbacks} callbacks
     */
    static setupStripeMessageListener(callbacks: StripeServiceCallbacks): void {
        (<any>window).addEventListener("message", (event: MessageEvent) => StripeService.stripeMessageListener(event, callbacks), { once: true });
    }

    /**
     * Based on the data passed via message, if it's the correct URL handle the data.
     *
     * @param {MessageEvent} event
     * @param {StripeServiceCallbacks} callbacks
     */
    static stripeMessageListener(event: MessageEvent, callbacks: StripeServiceCallbacks): void {
        let origin: string = event.origin;

        if(this.serviceUrls.find(serviceUrl => origin == serviceUrl)) {
            if(typeof event.data == "string"){
                let stripeResponse = StripeService.parseStripeMessage(event.data);

                switch(stripeResponse.code) {
                    case 200:
                        callbacks.success(<StripeValidResponse>stripeResponse.resp);
                        break;
                    case 400:
                        callbacks.noData(<StripeNoDataResponse>stripeResponse.resp);
                        break;
                    case 402:
                        callbacks.badData(<StripeBadDataResponse>stripeResponse.resp);
                        break;
                }
            }
        }
    }

    /**
     * Trigger the stripe event that checks the credit card ata
     */
    static triggerStripe(): void {
        console.log("StripeService::triggerStripe");
        let checkoutForm: JQuery = $("form.woocommerce-checkout");
        checkoutForm.trigger('checkout_place_order_stripe');
        checkoutForm.on('submit', (event) => event.preventDefault());
    }

    /**
     * Parse the data returned by stripe. This mainly removes the random string that comes before the JSON object.
     *
     * @param {string} message
     * @returns {StripeResponse}
     */
    static parseStripeMessage(message: string): StripeResponse {
        console.log(message);
        let matchResults = message.match('default\\d{0,}(?:(?!{).)*');
        let out: StripeResponse = null;

        if(matchResults.length > 0 ) {
            let match = matchResults[0];
            let dataString: string = message.substr(match.length, message.length);

            out = <StripeResponse>JSON.parse(dataString);
        }

        return out;
    }

    /**
     * Is the stripe method checked?
     *
     * @returns {boolean}
     */
    static hasStripe(): boolean {
        return $("#payment_method_stripe:checked").length > 0
    }

    /**
     * Is the new payment option checked?
     *
     * @returns {boolean}
     */
    static hasNewPayment(): boolean {
        return $("#wc-stripe-payment-token-new:checked").length > 0;
    }

    /**
     * @returns {Array<string>}
     */
    static get serviceUrls(): Array<string> {
        return this._serviceUrls;
    }

    /**
     * @param {Array<string>} value
     */
    static set serviceUrls(value: Array<string>) {
        this._serviceUrls = value;
    }
}