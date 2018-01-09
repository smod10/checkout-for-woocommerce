import { EasyTabService }                           from "./EasyTabService";
import { EasyTab }                                  from "./EasyTabService";
import { CompleteOrderAction }                      from "../Actions/CompleteOrderAction";
import { Main }                                     from "../Main";

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
        // Parsley isn't a jquery default, this gets around it.
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
                // Is it shipping or billing type of state and zip
                let infoType: InfoType = ParsleyService.getInfoType(instance.$element[0].getAttribute("id"));

                // Fail if info type is error. Something went wrong.
                if(infoType === "error") {
                    return false;
                }

                // If this goes south, where do we go (what tab)
                let failLocation: EasyTab = ParsleyService.getFailLocation(infoType);

                // Zip, State, and City
                let zipElement: JQuery = $(`#${infoType}_postcode`);
                let stateElement: JQuery = $(`#${infoType}_state`);
                let cityElement: JQuery = $(`#${infoType}_city`);

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
                    let xhr = $.ajax(requestLocation);

                    // Setup our callbacks
                    xhr
                        .then((response) => this.stateAndZipValidatorOnSuccess(response, instance, infoType, cityElement, stateElement, zipElement, failLocation))
                        .always(() => ParsleyService.cityStateValidating = false);
                }

                // Return true, if we fail we will go back.
                return true;
            }.bind(this),
            // messages: {en: 'Zip is not valid for country "%s"'}
        });
    }

    /**
     * @param {any} instance
     * @param {JQuery} cityElement
     * @param {JQuery} stateElement
     * @param {JQuery} zipElement
     * @param {EasyTab} failLocation
     */
    stateAndZipValidatorOnFail(instance: any, cityElement: JQuery, stateElement: JQuery, zipElement: JQuery, failLocation: EasyTab): void {
        // Fire off the fail event for state and zip
        let event = new Event("cfw:state-zip-failure");
        window.dispatchEvent(event);

        // Go to the fail location
        EasyTabService.go(failLocation);

        // Destroy the state garlic cache
        cityElement.garlic('destroy');

        // Set the validating to false to allow new validations
        ParsleyService.cityStateValidating = false;
    }

    /**
     *
     * @param json
     * @param instance
     * @param {InfoType} infoType
     * @param {JQuery} cityElement
     * @param {JQuery} stateElement
     * @param {JQuery} zipElement
     * @param {EasyTab} failLocation
     */
    stateAndZipValidatorOnSuccess(json, instance, infoType: InfoType, cityElement: JQuery, stateElement: JQuery, zipElement: JQuery, failLocation: EasyTab) {
        if(json.places.length === 1) {
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

                // Set the state element if the field type is postcode
                if (fieldType === "postcode") {
                    stateElement.val(stateResponseValue);
                    stateElement.trigger("change");
                }
            }

            // Resets in case error labels.
            cityElement.parsley().reset();
            stateElement.parsley().reset();

            if (CompleteOrderAction.preppingOrder) {
                let orderReadyEvent = new Event("cfw:checkout-validated");
                window.dispatchEvent(orderReadyEvent);
            }

            ParsleyService.cityStateValidating = false;
        }

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
}