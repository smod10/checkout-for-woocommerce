import { Main }                                         from "../Main";
import { EasyTabService }                               from "./EasyTabService";
import { EasyTabDirection }                             from "./EasyTabService";
import { EasyTab }                                      from "./EasyTabService";
import { CompleteOrderAction }                          from "../Actions/CompleteOrderAction";
import { AjaxInfo }                                     from "../Types/Types";
import { UpdateCheckoutAction }                         from "../Actions/UpdateCheckoutAction";
import { Alert } 										from "../Elements/Alert";

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
	 * @type {EValidationSections}
	 * @private
	 */
	private static _currentlyValidating: EValidationSections;

	/**
	 * @param easyTabsWrap
	 */
	constructor(easyTabsWrap: any) {
		this.validateSectionsBeforeSwitch(easyTabsWrap);
		this.validateBillingFieldsBeforeSubmit();

		ValidationService.validateShippingOnLoadIfNotCustomerTab();
	}

	/**
	 * Execute validation checks before each easy tab easy tab switch.
	 *
	 * @param {any} easyTabsWrap
	 */
	validateSectionsBeforeSwitch(easyTabsWrap: any): void {

		easyTabsWrap.bind('easytabs:before', function(event, clicked, target) {
			// Where are we going?
			let easyTabDirection: EasyTabDirection = EasyTabService.getTabDirection(target);

			// If we are moving forward in the checkout process and we are currently on the customer tab
			if ( easyTabDirection.current === EasyTab.CUSTOMER && easyTabDirection.target > easyTabDirection.current ) {

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

			Alert.removeAlerts(Main.instance.alertContainer);

			// If we are moving forward / backwards, have a shipping easy tab, and are not on the customer tab then allow
			// the tab switch
			return true;
		}.bind(this));
	}

	validateBillingFieldsBeforeSubmit(): void {
		let checkoutForm: any = Main.instance.checkoutForm;

		checkoutForm.on( 'submit', function( e ) {
			let validated = false;

			if ( EasyTabService.isThereAShippingTab() ) {
				validated = ValidationService.validate(EValidationSections.BILLING);
			} else {
				validated = true; // If digital only order, billing address was handled on customer info tab so set to true
			}

			if ( ! validated ) {
				e.preventDefault();
				e.stopPropagation();
			}

			return validated;
		} );
	}

	/**
	 * Kick off the order process and register it's event listener.
	 *
	 * @param {boolean} difBilling
	 * @param {AjaxInfo} ajaxInfo
	 * @param orderDetails
	 */
	static createOrder(difBilling: boolean = false, ajaxInfo: AjaxInfo, orderDetails: any): void {
		// TODO: This looks like evil coupling
		new CompleteOrderAction('complete_order', ajaxInfo, orderDetails);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	static validateSectionsForCustomerTab(): boolean {
		let validated = false;

		if ( ! EasyTabService.isThereAShippingTab() ) {
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
		let checkoutForm: any = Main.instance.checkoutForm;

		ValidationService.currentlyValidating = section;

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

		if(validated == null) {
			validated = true;
		}

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


	/**
	 * @return {EValidationSections}
	 */
	static get currentlyValidating(): EValidationSections {
		return this._currentlyValidating;
	}

	/**
	 * @param {EValidationSections} value
	 */
	static set currentlyValidating(value: EValidationSections) {
		this._currentlyValidating = value;
	}
}