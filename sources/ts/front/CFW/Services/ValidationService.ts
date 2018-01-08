import { Main }                                         from "../Main";
import { EasyTabService }                               from "./EasyTabService";
import { EasyTabDirection }                             from "./EasyTabService";
import { EasyTab }                                      from "./EasyTabService";
import { CompleteOrderAction }                          from "../Actions/CompleteOrderAction";
import { AjaxInfo }                                     from "../Types/Types";

/**
 * Validation Sections Enum
 */
export enum EValidationSections {
    SHIPPING,
    BILLING,
    ACCOUNT
}

/**
 *
 */
export class ValidationService {

    /**
     *
     */
    constructor() {
        this.validateSectionsBeforeSwitch();

        ValidationService.validateShippingOnLoadIfNotCustomerTab();
    }

    /**
     * Execute validation checks before each easy tab easy tab switch.
     */
    validateSectionsBeforeSwitch(): void {

        Main.instance.tabContainer.jel.bind('easytabs:before', function(event, clicked, target) {
            // Where are we going?
            let easyTabDirection: EasyTabDirection = EasyTabService.getTabDirection(target);

            // If we are moving forward in the checkout process and we are currently on the customer tab
            if(easyTabDirection.current === EasyTab.CUSTOMER && easyTabDirection.target > easyTabDirection.current) {

                let validated: boolean = ValidationService.validateSectionsForCustomerTab();
                let tabId: string = EasyTabService.getTabId(easyTabDirection.current);

                // Has to be done with the window.location.hash. Reason being is on false validation it somehow ignores
                // the continue button going forward. This prevents that by "resetting" the page so to speak.
                if ( ! validated ) {
                    window.location.hash = `#${tabId}`;
                }

                // Return the validation
                return validated;
            }

            // If we are moving forward / backwards, have a shipping easy tab, and are not on the customer tab then allow
            // the tab switch
            return true;
        }.bind(this));
    }

    static createOrder(difBilling: boolean = false, ajaxInfo: AjaxInfo, orderDetails: any): void {
        if(difBilling) {

            // Check the normal validation and kick off the ajax ones
            let validationResult: boolean = true;

            CompleteOrderAction.preppingOrder = true;

            (<any>window).addEventListener("cfw:checkout-validated",
                () => {
                    CompleteOrderAction.preppingOrder = false;

                    if(validationResult) {
                        new CompleteOrderAction('complete_order', ajaxInfo, orderDetails)
                    }
            }, {once: true});

            (<any>window).addEventListener("cfw:state-zip-failure", () => CompleteOrderAction.preppingOrder = false);

            validationResult = ValidationService.validate(EValidationSections.BILLING);
        } else {
            new CompleteOrderAction('complete_order', ajaxInfo, orderDetails)
        }
    }

    /**
     *
     * @returns {boolean}
     */
    static validateSectionsForCustomerTab(): boolean {
        let validated = false;

        if ( !EasyTabService.isThereAShippingTab() ) {
            validated = ValidationService.validate(EValidationSections.ACCOUNT) && ValidationService.validate(EValidationSections.BILLING);
        } else {
            validated = ValidationService.validate(EValidationSections.ACCOUNT) && ValidationService.validate(EValidationSections.SHIPPING);
        }

        return validated;
    }

    /**
     * @param {EValidationSections} section
     * @returns {any}
     */
    static validate(section: EValidationSections): any {
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
     * Handles non ajax cases
     */
    static validateShippingOnLoadIfNotCustomerTab(): void {
        let hash: string = window.location.hash;
        let customerInfoId: string = "#cfw-customer-info";
        let sectionToValidate: EValidationSections = (EasyTabService.isThereAShippingTab()) ? EValidationSections.SHIPPING : EValidationSections.BILLING;

        if(hash != customerInfoId && hash != "") {

            if(!ValidationService.validate(sectionToValidate)) {
                EasyTabService.go(EasyTab.CUSTOMER);
            }
        }
    }
}