import { EasyTabService }                           from "./EasyTabService";
import { EasyTab }                                  from "./EasyTabService";

let w: any = window;

export type InfoType = "shipping" | "billing" | "error";

export class ParsleyService {

    /**
     * @type {boolean}
     * @private
     */
    private static _cityStateValidating: boolean = false;

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

                // Pass the original state element to the fail callback. Even if it's hidden we want to destroy the garlic cache
                let failStateElement: JQuery = stateElement;

                // If the stateElement is not visible, it's null
                if(!stateElement.is(":visible")) {
                    stateElement = null;
                }

                // Where to check the zip
                let requestLocation = `//www.zippopotam.us/${country}/${zipElement.val()}`;

                // Our request
                let xhr = $.ajax(requestLocation);

                // If we aren't already checking, check.
                if(!ParsleyService.cityStateValidating) {

                    // Start the check
                    ParsleyService.cityStateValidating = true;

                    return xhr
                        .then((response) => this.stateAndZipValidatorOnSuccess(response, instance, infoType, cityElement, stateElement, zipElement, failLocation))
                        .fail(() => this.stateAndZipValidatorOnFail(failLocation, failStateElement, instance))
                }

                // Return true, if we fail we will go back.
                return true;
            }.bind(this),
            messages: {en: 'Zip is not valid for country "%s"'}
        });
    }

    /**
     *
     * @param {EasyTab} failLocation
     * @param {JQuery} stateElement
     * @param {any} instance
     */
    stateAndZipValidatorOnFail(failLocation: EasyTab, stateElement: JQuery, instance: any): void {
        EasyTabService.go(failLocation);

        if(w.CREATE_ORDER) {
            let event = new Event("cfw:state-zip-failure");
            window.dispatchEvent(event);
        }

        stateElement.garlic('destroy');

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
    stateAndZipValidatorOnSuccess(json, instance, infoType: InfoType, cityElement: JQuery, stateElement: JQuery, zipElement: JQuery, failLocation: EasyTab): void {
        let ret = null;
        let eventName = "";

        // Set the state response value
        let stateResponseValue = json.places[0]["state abbreviation"];

        // Set the city response value
        let cityResponseValue = json.places[0]["place name"];

        let fieldType = $(instance.element).attr("id").split("_")[1];

        // Set the city field
        cityElement.val(cityResponseValue);

        // If the country in question has a state
        if(stateElement) {

            // Set the state element if the field type is postcode
            if(fieldType === "postcode") {
                stateElement.val(stateResponseValue);
            }

            if (stateResponseValue !== stateElement.val()) {
                eventName = "cfw:state-zip-failure";

                EasyTabService.go(failLocation);

                ret = $.Deferred().reject("The zip code " + zipElement.val() + " is in " + stateResponseValue + ", not in " + stateElement.val());
            } else {
                eventName = "cfw:state-zip-success";

                stateElement.trigger("DOMAttrModified");

                ret = true;
            }
        }

        if(w.CREATE_ORDER) {
            let event = new Event(eventName);
            window.dispatchEvent(event);
        }

        ParsleyService.cityStateValidating = false;
        ParsleyService.resetElements(cityElement, zipElement, stateElement);

        return ret;
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
     * @param elements
     */
    static resetElements(...elements) {
        elements.forEach(element => element.parsley().reset());
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
}