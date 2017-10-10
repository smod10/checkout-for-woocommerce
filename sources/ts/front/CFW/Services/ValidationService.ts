import { TabContainer }                         from "../Elements/TabContainer";

let Parsley: any;

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
     * @param {TabContainer} tabContainer
     */
    constructor(tabContainer: TabContainer) {
        this.tabContainer = tabContainer;
        this.easyTabsOrder = [$("#cfw-customer-info"), $("#cfw-shipping-method"), $("#cfw-payment-method")];

        this.setup();
    }

    setup(): void {
        this.setEventListeners();
        this.setStripeCacheDestroyers();

        if(window.location.hash != "#cfw-customer-info" && window.location.hash != "") {
            if(!this.validate(EValidationSections.SHIPPING)) {
                window.location.hash = "#cfw-customer-info";
            }
        }
    }

    setEventListeners(): void{
        this.tabContainer.jel.bind('easytabs:before', function(event, clicked, target, settings) {
            let currentPanelIndex: number;
            let targetPanelIndex: number;

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
                    let validated = this.validate(EValidationSections.ACCOUNT) && this.validate(EValidationSections.SHIPPING);

                    if(!validated) {
                        window.location.hash = "#" + this.easyTabsOrder[currentPanelIndex].attr("id");
                    }

                    return validated;
                }
            }

            return true;

        }.bind(this));
    }

    setStripeCacheDestroyers(): void {
        let destroyCacheItems = ["stripe-card-number", "stripe-card-expiry", "stripe-card-cvc"];

        destroyCacheItems.forEach(function(item) {
            $("#" + item).on('keyup', function(){
                destroyCacheItems.forEach(function(innerItem){
                    $("#" + innerItem).garlic('destroy');
                })
            })
        });
    }

    validate(section: EValidationSections): boolean {
        let validated: boolean;

        switch(section) {
            case EValidationSections.SHIPPING:
                validated = $("#cfw-checkout-form").parsley().validate("shipping");
                break;
            case EValidationSections.BILLING:
                validated = $("#cfw-checkout-form").parsley().validate("billing");
                break;
            case EValidationSections.ACCOUNT:
                validated = $("#cfw-checkout-form").parsley().validate("account");
                break;
        }

        if(validated == null)
            validated = true;

        return validated;
    }

    get easyTabsOrder(): Array<JQuery> {
        return this._easyTabsOrder;
    }

    set easyTabsOrder(value: Array<JQuery>) {
        this._easyTabsOrder = value;
    }

    get tabContainer(): TabContainer {
        return this._tabContainer;
    }

    set tabContainer(value: TabContainer) {
        this._tabContainer = value;
    }
}