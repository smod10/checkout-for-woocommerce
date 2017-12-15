import { TabContainerSection }                  from "../Elements/TabContainerSection";
import { Main }                                 from "../Main";
import { TabContainer }                         from "../Elements/TabContainer";
import { ParsleyService }                       from "./ParsleyService";
import { EasyTabService }                       from "./EasyTabService";

/**
 * Validation Sections Enum
 */
export enum EValidationSections {
    SHIPPING,
    BILLING,
    ACCOUNT
}

/**
 * Panels Enum
 */
export enum Panel {
    CUSTOMER,
    SHIPPING,
    PAYMENT,
}

/**
 * Panel Direction Object Blueprint
 */
export type PanelDirection = { current: Panel, target: Panel };

/**
 *
 */
export class ValidationService {

    /**
     * @type {ParsleyService}
     * @private
     */
    private _parsleyService: ParsleyService;

    /**
     * @type {EasyTabService}
     * @private
     */
    private _easyTabService: EasyTabService;

    /**
     *
     */
    constructor() {
        this.parsleyService = new ParsleyService();
        this.easyTabService = new EasyTabService()

        this.validateSectionsBeforeSwitch();

        ValidationService.validateShippingOnLoadIfNotCustomerPanel();
    }

    /**
     * Execute validation checks before each easy tab panel switch.
     */
    validateSectionsBeforeSwitch(): void {

        Main.instance.tabContainer.jel.bind('easytabs:before', function(event, clicked, target) {

            // Where are we going?
            let panelDirection: PanelDirection = ValidationService.getPanelDirection(target);

            // If we are moving forward in the checkout process and we are currently on the customer tab
            if(panelDirection.current === Panel.CUSTOMER && panelDirection.target > panelDirection.current) {

                // Validate the required sections for the customer panel
                let validated: boolean = ValidationService.validateSectionsForCustomerPanel();

                // If we encountered and error / problem stay on the current tab
                if ( !validated ) {
                    ValidationService.go(panelDirection.current);
                }

                // Return the validation
                return validated;
            }

            // If we are moving forward / backwards, have a shipping panel, and are not on the customer tab then allow
            // the tab switch
            return true;

        }.bind(this));
    }

    /**
     * @param {Panel} panel
     */
    static go(panel: Panel): void {
        Main.instance.tabContainer.jel.easytabs("select", ValidationService.getTabId(panel))
    }

    /**
     * Returns the id of the Panel passed in
     *
     * @param {Panel} panel
     * @returns {string}
     */
    static getTabId(panel: Panel): string {
        let tabContainer: TabContainer = Main.instance.tabContainer;
        let easyTabs: Array<TabContainerSection> = tabContainer.tabContainerSections;

        return easyTabs[panel].jel.attr("id");
    }

    /**
     *
     * @returns {boolean}
     */
    static validateSectionsForCustomerPanel(): boolean {
        let validated = false;

        if ( !ValidationService.isThereAShippingPanel() ) {
            validated = ValidationService.validate(EValidationSections.ACCOUNT) && ValidationService.validate(EValidationSections.BILLING);
        } else {
            validated = ValidationService.validate(EValidationSections.ACCOUNT) && ValidationService.validate(EValidationSections.SHIPPING);
        }

        return validated;
    }

    /**
     * Returns the current and target panel indexes
     *
     * @param target
     * @returns {PanelDirection}
     */
    static getPanelDirection(target): PanelDirection {
        let currentPanelIndex: number = 0;
        let targetPanelIndex: number = 0;

        Main.instance.tabContainer.tabContainerSections.forEach((tab: TabContainerSection, index: number) => {
            let $tab: JQuery = tab.jel;

            if($tab.filter(":visible").length !== 0) {
                currentPanelIndex = index;
            }

            if($tab.is($(target))) {
                targetPanelIndex = index;
            }
        });

        return <PanelDirection>{ current: currentPanelIndex, target: targetPanelIndex };
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
    static validateShippingOnLoadIfNotCustomerPanel(): void {
        let hash: string = window.location.hash;
        let customerInfoId: string = "#cfw-customer-info";
        let sectionToValidate: EValidationSections = (ValidationService.isThereAShippingPanel()) ? EValidationSections.SHIPPING : EValidationSections.BILLING;

        if(hash != customerInfoId && hash != "") {

            if(!ValidationService.validate(sectionToValidate)) {
                ValidationService.go(Panel.CUSTOMER);
            }
        }
    }

    /**
     * Is there a shipping panel present?
     *
     * @returns {boolean}
     */
    static isThereAShippingPanel(): boolean {
        return Main.instance.tabContainer.jel.find('.etabs > li').length !== 2;
    }

    /**
     * @returns {ParsleyService}
     */
    get parsleyService(): ParsleyService {
        return this._parsleyService;
    }

    /**
     * @param {ParsleyService} value
     */
    set parsleyService(value: ParsleyService) {
        this._parsleyService = value;
    }

    /**
     * @returns {EasyTabService}
     */
    get easyTabService(): EasyTabService {
        return this._easyTabService;
    }

    /**
     * @param {EasyTabService} value
     */
    set easyTabService(value: EasyTabService) {
        this._easyTabService = value;
    }
}