/// <reference path="Definitions/ArrayFind.d.ts" />

import { TabContainer }							from "./Elements/TabContainer";
import { AjaxInfo }								from "./Types/Types";
import { Cart }									from "./Elements/Cart";
import { TabContainerSection }					from "./Elements/TabContainerSection";
import { ValidationService }					from "./Services/ValidationService";
import { EasyTabService }						from "./Services/EasyTabService";
import { ParsleyService }						from "./Services/ParsleyService";
import { LocalizationService }                  from "./Services/LocalizationService";

declare let $: any;

/**
 * The main class of the front end checkout system
 */
export class Main {

    /**
     * @type {any}
     * @private
     */
    private _checkoutForm: any;

	/**
	 * @type {TabContainer}
	 * @private
	 */
	private _tabContainer: TabContainer;

	/**
	 * @type {Cart}
	 * @private
	 */
	private _cart: Cart;

	/**
	 * @type {AjaxInfo}
	 * @private
	 */
	private _ajaxInfo: AjaxInfo;

	/**
	 * @type {any}
	 * @private
	 */
	private _settings: any;

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
	 * @type {ValidationService}
	 * @private
	 */
	private _validationService: ValidationService;

    /**
     * @type {LocalizationService}
     * @private
     */
    private _localizationService: LocalizationService;

	/**
	 * @type {boolean}
	 * @private
	 */
	private _updating: boolean;

	/**
	 * @type {Main}
	 * @private
	 * @static
	 */
	private static _instance: Main;

	/**
     * @param {any} checkoutFormEl
	 * @param {any} easyTabsWrap
	 * @param {TabContainer} tabContainer
	 * @param {AjaxInfo} ajaxInfo
	 * @param {Cart} cart
	 * @param {any} settings
	 */
	constructor( checkoutFormEl: any, easyTabsWrap: any, tabContainer: TabContainer, ajaxInfo: AjaxInfo, cart: Cart, settings: any) {
		Main.instance = this;

        checkoutFormEl.garlic({
			events: ['textInput', 'input', 'change', 'click', 'keypress', 'paste', 'focus'],
			destroy: false,
            excluded: 'input[type="file"], input[type="hidden"], input[type="submit"], input[type="reset"], input[name="paypal_pro-card-number"], input[name="paypal_pro-card-cvc"], input[name="wc-authorize-net-aim-account-number"], input[name="wc-authorize-net-aim-csc"], input[name="paypal_pro_payflow-card-number"], input[name="paypal_pro_payflow-card-cvc"], input[name="paytrace-card-number"], input[name="paytrace-card-cvc"], input[id="stripe-card-number"], input[id="stripe-card-cvc"], input[name="creditCard"], input[name="cvv"], input.wc-credit-card-form-card-number, input[name="wc-authorize-net-cim-credit-card-account-number"], input[name="wc-authorize-net-cim-credit-card-csc"], input.wc-credit-card-form-card-cvc, input.js-sv-wc-payment-gateway-credit-card-form-account-number, input.js-sv-wc-payment-gateway-credit-card-form-csc, input.shipping_method'
		});

        if(easyTabsWrap.length === 0) {
        	easyTabsWrap = tabContainer.jel;
		}

        this.checkoutForm = checkoutFormEl;
        this.tabContainer = tabContainer;
        this.ajaxInfo = ajaxInfo;
        this.cart = cart;
        this.settings = settings;
        this.parsleyService = new ParsleyService();
        this.easyTabService = new EasyTabService(easyTabsWrap);
        this.validationService = new ValidationService(easyTabsWrap);
        this.localizationService = new LocalizationService();

        // Handle Stripe gateway UI blocking function
        // Otherwise we throw errors
        // Also discard our overlay when the modal is closed on desktop and mobile
        $.fn.block = function (item) {
			Main.addOverlay();
        };
        $.fn.unblock = function (item) {
            Main.removeOverlay();
        };

        $.fn.blockUI = function (item) {
            Main.addOverlay();
        };
        $.fn.unblockUI = function (item) {
            Main.removeOverlay();
        };
    }


	/**
	 * Sets up the tab container by running easy tabs, setting up animation listeners, and setting up events and on load
	 * functionality
	 */
	setup(): void {

		// Initialize the easy tabs
		this.easyTabService.initialize();

		// Setup animation listeners
		this.setupAnimationListeners();

		// Set up credit card fields if there. Needs to happen before wrap
		this.tabContainer.setUpCreditCardFields();

		// Fix floating labels
		this.tabContainer.setFloatLabelOnGarlicRetrieve();

		/**
		 * NOTE: If you are doing any DOM manipulation (adding and removing classes specifically). Do it before the setWraps
		 * call on the tab container sections. Once this is called all the setup of the different areas will have completed and
		 * wont be run again until next page load
		 */
		// Loop through and set up the wraps on the tab container sections
		this.tabContainer.tabContainerSections.forEach((tcs: TabContainerSection) => tcs.setWraps());

		// Set up event handlers
		this.tabContainer.setAccountCheckListener();
		this.tabContainer.setLogInListener();
		this.tabContainer.setUpdateAllShippingFieldsListener();
		this.tabContainer.setShippingPaymentUpdate();
		this.tabContainer.setUpPaymentTabRadioButtons();
		this.tabContainer.setUpCreditCardRadioReveal();
		this.tabContainer.setUpMobileCartDetailsReveal();
		this.tabContainer.setCompleteOrderHandlers();
		this.tabContainer.setApplyCouponListener();
		this.tabContainer.setTermsAndConditions();
		this.tabContainer.setUpdateCheckout();

		// Localization
		this.localizationService.setCountryChangeHandlers();

		// Handles the shipping fields on load if the user happens to land on the shipping method page.
		this.tabContainer.setShippingFieldsOnLoad();
	}

    /**
     * Adds a visual indicator that the checkout is doing something
     */
    static addOverlay(): void {
        $("body").addClass("show-overlay");
    }

    static removeOverlay(): void {
        $("body").removeClass("show-overlay");
    }

	/**
	 * @returns {boolean}
	 */
	static isPaymentRequired(): boolean {
		return !$("#cfw-content").hasClass("cfw-payment-false");
	}

    /**
     * @param {boolean} isPaymentRequired
     */
	static togglePaymentRequired(isPaymentRequired: boolean): void {
		let $cfw = $("#cfw-content");
		let noPaymentCssClass = "cfw-payment-false";

		if( ! isPaymentRequired ) {
			if( ! $cfw.hasClass(noPaymentCssClass) ) {
				$cfw.addClass(noPaymentCssClass);
			}

			if(EasyTabService.isThereAShippingTab()) {
                this.toggleBillingFieldsAbility(true);
            }

            // Always uncheck the payment method if order does not require payment
            $('[name="payment_method"]:checked').prop("checked", false);
		} else {
            if(EasyTabService.isThereAShippingTab()) {
                this.toggleBillingFieldsAbility(false);
			}

			$cfw.removeClass(noPaymentCssClass);
		}
	}

	static toggleBillingFieldsAbility( enabled: boolean ) {
        Main.instance.settings.default_address_fields.forEach( function( field_name ) {
			$(`[name="billing_${field_name}"]`).prop('disabled', enabled);
		} );

        if(enabled) {
        	$("#ship_to_different_address_as_billing").prop("checked", true);
		}
	}

	/**
	 * Sets up animation listeners
	 */
	setupAnimationListeners(): void {
		$("#cfw-ci-login").on("click", function(){
			$("#cfw-login-slide").slideDown(300);
		});
	}

    /**
     * @returns {boolean}
     */
	get updating(): boolean {
		return this._updating;
	}

    /**
     * @param {boolean} value
     */
	set updating(value: boolean) {
		this._updating = value;
	}

    /**
     * @returns {any}
     */
    get checkoutForm(): any {
        return this._checkoutForm;
    }

    /**
     * @param {any} value
     */
    set checkoutForm(value: any) {
        this._checkoutForm = value;
    }

    /**
	 * @returns {TabContainer}
	 */
	get tabContainer() {
		return this._tabContainer;
	}

	/**
	 * @param value
	 */
	set tabContainer(value: TabContainer) {
		this._tabContainer = value;
	}

	/**
	 * @returns {AjaxInfo}
	 */
	get ajaxInfo(): AjaxInfo {
		return this._ajaxInfo;
	}

	/**
	 * @param value
	 */
	set ajaxInfo(value: AjaxInfo) {
		this._ajaxInfo = value;
	}

	/**
	 * @returns {Cart}
	 */
	get cart(): Cart {
		return this._cart;
	}

	/**
	 * @param value
	 */
	set cart(value: Cart) {
		this._cart = value;
	}

	/**
	 * @returns {any}
	 */
	get settings(): any {
		return this._settings;
	}

	/**
	 * @param value
	 */
	set settings(value: any) {
		this._settings = value;
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

	/**
	 * @returns {ValidationService}
	 */
	get validationService(): ValidationService {
		return this._validationService;
	}

	/**
	 * @param {ValidationService} value
	 */
	set validationService(value: ValidationService) {
		this._validationService = value;
	}

    /**
     * @returns {LocalizationService}
     */
    get localizationService(): LocalizationService {
        return this._localizationService;
    }

    /**
     * @param {LocalizationService} value
     */
    set localizationService(value: LocalizationService) {
        this._localizationService = value;
    }

    /**
	 * @returns {Main}
	 */
	static get instance(): Main {
		return Main._instance;
	}

	/**
	 * @param {Main} value
	 */
	static set instance(value: Main) {
		if(!Main._instance) {
			Main._instance = value;
		}
	}
}