import { TabContainer }                         from "../Elements/TabContainer";

let w: any = window;

export enum EValidationSections {
    SHIPPING,
    BILLING,
    ACCOUNT
}

export class ValidationService {

    /**
     * @type {Array}
     * @private
     */
    private _easyTabsOrder: Array<JQuery> = [];

    /**
     * @type {TabContainer}
     * @private
     */
    private _tabContainer: TabContainer;

    /**
     * @type {boolean}
     * @private
     */
    private static _cityStateValidating: boolean = false;

    /**
     * @param {TabContainer} tabContainer
     */
    constructor(tabContainer: TabContainer) {
        this.tabContainer = tabContainer;
        this.easyTabsOrder = [$("#cfw-customer-info"), $("#cfw-shipping-method"), $("#cfw-payment-method")];

        this.setup();
    }

    /**
     *
     */
    setup(): void {
        this.setEventListeners();
        let max_iterations = 1000;
        let iterations = 0;

        this.floatLabelOnGarlicRetrieve();

        if(window.location.hash != "#cfw-customer-info" && window.location.hash != "") {
            if(!this.validate(EValidationSections.SHIPPING)) {
                window.location.hash = "#cfw-customer-info";
            }
        }

        // Parsley isn't a jquery default, this gets around it.
        let $temp: any = $;
        let shipping_action: Function = function(element) {
            $("#cfw-tab-container").easytabs("select", "#cfw-customer-info");
        };

        if ( $temp("#shipping_postcode").length !== 0 ) {
            $temp("#shipping_postcode").parsley().on("field:error", shipping_action);
            $temp("#shipping_state").parsley().on("field:error", shipping_action);
        }

        let interval: any = setInterval(() => {
            if ( w.Parsley !== undefined ) {
                this.setParsleyCustomValidators(w.Parsley);
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
     * Sometimes in some browsers (looking at you safari and chrome) the label doesn't float when the data is retrieved
     * via garlic. This will fix this issue and float the label like it should.
     */
    floatLabelOnGarlicRetrieve(): void {
        $(".garlic-auto-save").each((index: number, elem: Element) => {
            $(elem).garlic({
                onRetrieve: (element, retrievedValue) => {
                    $(element).parent().addClass("cfw-floating-label");
                }
            })
        });
    }

    /**
     * @param parsley
     */
    setParsleyCustomValidators(parsley): void {
        parsley.addValidator('stateAndZip', {
            validateString: function(_ignoreValue, country, instance) {
                let elementType = instance.$element[0].getAttribute("id").split("_")[0];
                let stateElement = $("#" + elementType + "_state");
                let zipElement = $("#" + elementType + "_postcode");
                let cityElement = $("#" + elementType + "_city");
                let failLocation = (elementType === "shipping") ? "#cfw-customer-info" : "#cfw-payment-method";
                let xhr = $.ajax('//www.zippopotam.us/' + country + '/' + zipElement.val());

                if(!ValidationService.cityStateValidating) {
                    ValidationService.cityStateValidating = true;

                    return xhr.then(function(json) {
                        let ret = null;
                        let stateResponseValue = "";
                        let eventName = "";
                        let cityResponseValue = "";

                        // Set the state response value
                        stateResponseValue = json.places[0]["state abbreviation"];

                        // Set the city response value and set the corresponding city field
                        cityResponseValue = json.places[0]["place name"];
                        cityElement.val(cityResponseValue);

                        let fieldType = $(instance.element).attr("id").split("_")[1];

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

                            $("#" + elementType + "_state").parsley().reset();
                            $("#" + elementType + "_postcode").parsley().reset();

                            ret = true;
                        }

                        if(w.CREATE_ORDER) {
                            let event = new Event(eventName);
                            window.dispatchEvent(event);
                        }

                        ValidationService.cityStateValidating = false;

                        cityElement.parsley().reset();
                        zipElement.parsley().reset();
                        stateElement.parsley().reset();

                        return ret;
                    }).fail(function(){
                        $("#cfw-tab-container").easytabs("select", failLocation);

                        if(w.CREATE_ORDER) {
                            let event = new Event("cfw:state-zip-failure");
                            window.dispatchEvent(event);
                        }

                        stateElement.garlic('destroy');

                        ValidationService.cityStateValidating = false;
                    })
                }

                return true;
            }.bind(this),
            messages: {en: 'Zip is not valid for country "%s"'}
        });
    }

    /**
     *
     */
    setEventListeners(): void {
        this.tabContainer.jel.bind('easytabs:before', function(event, clicked, target, settings) {
            let currentPanelIndex: number = 0;
            let targetPanelIndex: number = 0;

            this.easyTabsOrder.forEach((tab, index) => {
                if(tab.filter(":visible").length !== 0) {
                    currentPanelIndex = index;
                }

                if(tab.is($(target))) {
                    targetPanelIndex = index;
                }
            });

            if(targetPanelIndex > currentPanelIndex) {
                if(currentPanelIndex === 0) {
                    let validated = false;

                    if ( this.tabContainer.jel.find('.etabs > li').length == 2 ) {
                        validated = this.validate(EValidationSections.ACCOUNT) && this.validate(EValidationSections.BILLING);
                    } else {
                        validated = this.validate(EValidationSections.ACCOUNT) && this.validate(EValidationSections.SHIPPING);
                    }

                    if ( ! validated ) {
                        window.location.hash = "#" + this.easyTabsOrder[currentPanelIndex].attr("id");
                    }

                    return validated;
                }
            }

            return true;

        }.bind(this));
    }

    /**
     * @param {EValidationSections} section
     * @returns {any}
     */
    validate(section: EValidationSections): any {
        let validated: boolean;
        let checkoutForm: JQuery = $("#checkout");

        switch(section) {
            case EValidationSections.SHIPPING:
                validated = checkoutForm.parsley().validate("shipping");
                break;
            case EValidationSections.BILLING:
                validated = checkoutForm.parsley().validate("billing");
                break;
            case EValidationSections.ACCOUNT:
                validated = checkoutForm.parsley().validate("account");
                break;
        }

        if(validated == null)
            validated = true;

        return validated;
    }

    /**
     * @returns {Array<JQuery>}
     */
    get easyTabsOrder(): Array<JQuery> {
        return this._easyTabsOrder;
    }

    /**
     * @param {Array<JQuery>} value
     */
    set easyTabsOrder(value: Array<JQuery>) {
        this._easyTabsOrder = value;
    }

    /**
     * @returns {TabContainer}
     */
    get tabContainer(): TabContainer {
        return this._tabContainer;
    }

    /**
     * @param {TabContainer} value
     */
    set tabContainer(value: TabContainer) {
        this._tabContainer = value;
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