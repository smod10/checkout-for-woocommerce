import { TabContainer }                         from "../Elements/TabContainer";

export enum EValidationSections {
    SHIPPING,
    BILLING
}

export class ValidationService {

    /**
     *
     */
    private _tabContainer: TabContainer;

    constructor(tabContainer: TabContainer) {
        this.tabContainer = tabContainer;

        this.setup();
    }

    setup(): void {
        this.setEventListeners();
        this.setStripeCacheDestroyers();
    }

    setEventListeners(): void{
        this.tabContainer.jel.bind('easytabs:before', function() {
            let validated = $("#cfw-checkout-form").parsley().validate();

            // if(!validated) {
            //     window.location.hash = '';
            // }

            return validated;
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
        return
    }

    get tabContainer(): TabContainer {
        return this._tabContainer;
    }

    set tabContainer(value: TabContainer) {
        this._tabContainer = value;
    }
}