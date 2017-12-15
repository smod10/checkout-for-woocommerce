import { ValidationService }                    from "./ValidationService";
import { Panel }                                from "./ValidationService";

let w: any = window;

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
    handleStateZipFailure(): void {
        // Parsley isn't a jquery default, this gets around it.
        let $temp: any = $;
        let shipping_action = () => ValidationService.go(Panel.CUSTOMER);

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

                $("#checkout").parsley().on("form:error", (data) => {
                    console.log("Data", $.makeArray(data._focusedField));
                });

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
     * @param {string} id
     * @returns {string}
     */
    static getInfoType(id: string): string {
        let type: string = id.split("_")[0];

        if(type !== "shipping" && type !== "billing") {
            return "error"
        }

        return type;
    }

    /**
     * @param {string} infoType
     * @returns {string}
     */
    static getFailLocation(infoType: string): string {
        let customerTabId: string = ValidationService.getTabId(Panel.CUSTOMER);
        let paymentTabId: string = ValidationService.getTabId(Panel.PAYMENT);

        let location: string = (infoType === "shipping") ? customerTabId : paymentTabId;

        if(!ValidationService.isThereAShippingPanel()) {
            location = customerTabId;
        }

        return location;
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
    stateAndZipValidator(): void {
        this.parsley.addValidator('stateAndZip', {
            validateString: function(_ignoreValue, country, instance) {
                // Is it shipping or billing type of state and zip
                let infoType: string = ParsleyService.getInfoType(instance.$element[0].getAttribute("id"));

                // If this goes south, where do we go (what tab)
                let failLocation: string = ParsleyService.getFailLocation(infoType);

                // Zip, State, and City
                let zipElement = $(`#${infoType}_postcode`);
                let stateElement = $(`#${infoType}_state`);
                let cityElement = $(`#${infoType}_city`);

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
                        .fail(() => this.stateAndZipValidatorOnFail(failLocation, stateElement, instance))
                }

                // Return true, if we fail we will go back.
                return true;
            }.bind(this),
            messages: {en: 'Zip is not valid for country "%s"'}
        });
    }

    /**
     *
     * @param failLocation
     * @param stateElement
     * @param instance
     */
    stateAndZipValidatorOnFail(failLocation, stateElement, instance): void {
        console.log("FAIL", failLocation, ParsleyService.getInfoType(instance.$element[0].getAttribute("id")));

        $("#cfw-tab-container").easytabs("select", failLocation);

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
     * @param infoType
     * @param cityElement
     * @param stateElement
     * @param zipElement
     * @param failLocation
     */
    stateAndZipValidatorOnSuccess(json, instance, infoType, cityElement, stateElement, zipElement, failLocation): void {
        let ret = null;
        let eventName = "";

        // Set the state response value
        let stateResponseValue = json.places[0]["state abbreviation"];

        // Set the city response value
        let cityResponseValue = json.places[0]["place name"];

        let fieldType = $(instance.element).attr("id").split("_")[1];

        // Set the city field
        cityElement.val(cityResponseValue);

        // Set the state element if the field type is postcode
        if(fieldType === "postcode") {
            stateElement.val(stateResponseValue);
        }

        if (stateResponseValue !== stateElement.val()) {
            eventName = "cfw:state-zip-failure";

            $("#cfw-tab-container").easytabs("select", failLocation);

            ret = $.Deferred().reject("The zip code " + zipElement.val() + " is in " + stateResponseValue + ", not in " + stateElement.val());
        } else {
            eventName = "cfw:state-zip-success";

            stateElement.trigger("DOMAttrModified");

            $("#" + infoType + "_state").parsley().reset();
            $("#" + infoType + "_postcode").parsley().reset();

            ret = true;
        }

        if(w.CREATE_ORDER) {
            let event = new Event(eventName);
            window.dispatchEvent(event);
        }

        ParsleyService.cityStateValidating = false;

        cityElement.parsley().reset();
        zipElement.parsley().reset();
        stateElement.parsley().reset();

        return ret;
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