import { EasyTabService }                           from "./EasyTabService";
import { EasyTab }                                  from "./EasyTabService";
import { CompleteOrderAction }                      from "../Actions/CompleteOrderAction";
import { Main }                                     from "../Main";
import {ValidationService} from "./ValidationService";

let w: any = window;

export type InfoType = "shipping" | "billing" | "error";

export class ParsleyService {

    /**
     * @type {boolean}
     * @static
     * @private
     */
    private static _cityStateValidating: boolean = false;

    /**
     * @type {boolean}
     * @static
     * @private
     */
    private static _updateShippingTabInfo: boolean = false;

    /**
     * @type {null}
     * @private
     */
    private static _zipRequest = null;

    /**
     * @type {any}
     * @private
     */
    private _parsley: any;

    /**
     *
     */
    constructor() {
        this.setParsleyValidators();
        this.handleStateZipFailure();
    }

    /**
     *
     */
    setParsleyCustomValidators(): void {
        this.stateAndZipValidator();
    }

    /**
     *
     */
    handleStateZipFailure(): void {
        // Parsley isn't a any default, this gets around it.
        let $temp: any = $;
        let shipping_action = () => EasyTabService.go(EasyTab.CUSTOMER);

        if ( $temp("#shipping_postcode").length !== 0 ) {
            $temp("#shipping_postcode").parsley().on("field:error", shipping_action);
            $temp("#shipping_state").parsley().on("field:error", shipping_action);
        }
    }

    /**
     *
     */
    setParsleyValidators(): void {
        let max_iterations = 1000;
        let iterations = 0;

        let interval: any = setInterval(() => {
            if ( w.Parsley !== undefined ) {
                this.parsley = w.Parsley;
                this.parsley.on('form:error', () => Main.removeOverlay());
                this.setParsleyCustomValidators();

                clearInterval(interval);
            } else if( iterations >= max_iterations ) {
                // Give up
                clearInterval(interval);
            } else {
                iterations++;
            }
        }, 50);
    }

    /**
     *
     */
    stateAndZipValidator(): void {
        this.parsley.addValidator('stateAndZip', {
            validateString: function(_ignoreValue, country, instance) {
                // We have a request already running? Yea let's kill that.
                if(ParsleyService.zipRequest !== null) {
                    ParsleyService.zipRequest.abort();
                }

                // Is it shipping or billing type of state and zip
                let infoType: InfoType = ParsleyService.getInfoType(instance.$element[0].getAttribute("id"));

                // Fail if info type is error. Something went wrong.
                if(infoType === "error") {
                    return false;
                }

                // If this goes south, where do we go (what tab)
                let failLocation: EasyTab = ParsleyService.getFailLocation(infoType);

                // Zip, State, and City
                let zipElement: any = $(`#${infoType}_postcode`);
                let stateElement: any = $(`#${infoType}_state`);
                let cityElement: any = $(`#${infoType}_city`);

                // If the stateElement is not visible, it's null
                if(stateElement.is(":disabled")) {
                    stateElement = null;
                }

                // If we aren't already checking, check.
                if(!ParsleyService.cityStateValidating) {

                    // Start the check
                    ParsleyService.cityStateValidating = true;

                    // Where to check the zip
                    let requestLocation = `//api.zippopotam.us/${country}/${zipElement.val()}`;

                    // Our request
                    ParsleyService.zipRequest = $.ajax(requestLocation);

                    // Setup our callbacks
                    ParsleyService.zipRequest
                        .then((response) => this.stateAndZipValidatorOnSuccess(response, instance, infoType, cityElement, stateElement, zipElement, failLocation))
                        .always(() => {
                            ParsleyService.cityStateValidating = false;

                            let event = new Event("cfw:checkout-validated");
                            window.dispatchEvent(event);

                            $(document.body).trigger("update_checkout");
                        });
                }

                // Return true, if we fail we will go back.
                return true;
            }.bind(this),
            // messages: {en: 'Zip is not valid for country "%s"'}
        });
    }

    /**
     *
     * @param json
     * @param instance
     * @param {InfoType} infoType
     * @param {any} cityElement
     * @param {any} stateElement
     * @param {any} zipElement
     * @param {EasyTab} failLocation
     */
    stateAndZipValidatorOnSuccess(json, instance, infoType: InfoType, cityElement: any, stateElement: any, zipElement: any, failLocation: EasyTab) {
        if(ValidationService.validateZip) {
            if (json.places.length === 1) {
                // Set the state response value
                let stateResponseValue = json.places[0]["state abbreviation"];

                // Set the city response value
                let cityResponseValue = json.places[0]["place name"];

                // Billing or Shipping?
                let fieldType = $(instance.element).attr("id").split("_")[1];

                // Set the city field
                cityElement.val(cityResponseValue);
                cityElement.trigger("keyup");

                // If the country in question has a state
                if (stateElement) {
                    if (fieldType === "postcode") {

                        /**
                         * If we have a state response value abbreviation go ahead and set the new state to the state
                         * element
                         */
                        if(stateResponseValue) {
                            stateElement.val(stateResponseValue);
                            stateElement.trigger("change");

                        /**
                         * if the state doesn't have an abbreviation try to set it by the display name. If we can't find
                         * it that way we just leave the state alone
                         */
                        }  else if(json.places[0].state && json.places[0].state !== "") {
                            stateElement.val(stateElement.find(`option:contains(${json.places[0].state})`).val());
                            stateElement.trigger("change");
                        }
                    }

                    stateElement.parsley().reset();
                }

                // Resets in case error labels.
                cityElement.parsley().reset();
            }
        } else {
            // Always reset to true if false. We want this to normally fire, but under certain conditions we want to ignore this
            ValidationService.validateZip = true;
        }

        if (CompleteOrderAction.preppingOrder) {
            let orderReadyEvent = new Event("cfw:checkout-validated");
            window.dispatchEvent(orderReadyEvent);
        }

        ParsleyService.cityStateValidating = false;

        return true;
    }

    /**
     *
     * @param {string} id
     * @returns {InfoType}
     */
    static getInfoType(id: string): InfoType {
        let type: string = id.split("_")[0];

        if(type !== "shipping" && type !== "billing") {
            return "error"
        }

        return type;
    }

    /**
     * @param {InfoType} infoType
     * @returns {EasyTab}
     */
    static getFailLocation(infoType: InfoType): EasyTab {
        let location: EasyTab = (infoType === "shipping") ? EasyTab.CUSTOMER : EasyTab.PAYMENT;

        if(!EasyTabService.isThereAShippingTab()) {
            location = EasyTab.CUSTOMER;
        }

        return location;
    }
    /**
     * @returns {any}
     */
    get parsley(): any {
        return this._parsley;
    }

    /**
     * @param value
     */
    set parsley(value: any) {
        this._parsley = value;
    }

    /**
     * @returns {boolean}
     */
    static get cityStateValidating(): boolean {
        return this._cityStateValidating;
    }

    /**
     * @param {boolean} value
     */
    static set cityStateValidating(value: boolean) {
        this._cityStateValidating = value;
    }

    /**
     * @returns {boolean}
     */
    static get updateShippingTabInfo(): boolean {
        return this._updateShippingTabInfo;
    }

    /**
     * @param {boolean} value
     */
    static set updateShippingTabInfo(value: boolean) {
        this._updateShippingTabInfo = value;
    }

    /**
     * @returns {any}
     */
    static get zipRequest(): any {
        return this._zipRequest;
    }

    /**
     * @param value
     */
    static set zipRequest(value: any) {
        this._zipRequest = value;
    }
}