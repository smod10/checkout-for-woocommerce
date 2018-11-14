/// <reference path="Definitions/ArrayFind.d.ts" />

import { TabContainer }							from "./Elements/TabContainer";
import { AjaxInfo } 							from "./Types/Types";
import { Cart }									from "./Elements/Cart";
import { TabContainerSection }					from "./Elements/TabContainerSection";
import { ValidationService }					from "./Services/ValidationService";
import { EasyTabService }						from "./Services/EasyTabService";
import { ParsleyService }						from "./Services/ParsleyService";
import { LocalizationService }					from "./Services/LocalizationService";
import { Alert, AlertInfo } 					from "./Elements/Alert";
import { CompleteOrderAction } 					from "./Actions/CompleteOrderAction";
import { Compatibility }						from "./Compatibility/Compatibility";
import { CompatibilityClassOptions }        	from "./Types/Types";
import { CompatibilityFactory } 				from "./Factories/CompatibilityFactory";

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
	 * @type {any}
	 * @private
     */
    private _alertContainer: any;

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
	 * @type {any}
	 * @private
	 */
	private _compatibility: any;

	/**
	 * @type {Array<Compatibility>}
	 * @private
	 */
	private _createdCompatibilityClasses: Array<Compatibility>;

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
	 * @type {MutationObserver}
	 * @private
	 */
	private _errorObserver: MutationObserver;

	/**
	 * @type {Main}
	 * @private
	 * @static
	 */
	private static _instance: Main;

	/**
	 * @param {any} checkoutFormEl
	 * @param {any} easyTabsWrap
	 * @param {any} alertContainer
	 * @param {TabContainer} tabContainer
	 * @param {AjaxInfo} ajaxInfo
	 * @param {Cart} cart
	 * @param {any} settings
	 * @param {any} compatibility
	 */
	constructor(
		checkoutFormEl: any,
		easyTabsWrap: any,
		alertContainer: any,
		tabContainer: TabContainer,
		ajaxInfo: AjaxInfo,
		cart: Cart,
		settings: any,
		compatibility: any
	) {
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
		this.alertContainer = alertContainer;
		this.ajaxInfo = ajaxInfo;
		this.cart = cart;
		this.settings = settings;
		this.compatibility = compatibility;
		this.createdCompatibilityClasses = [];
		this.parsleyService = new ParsleyService();
		this.easyTabService = new EasyTabService(easyTabsWrap);
		this.validationService = new ValidationService(easyTabsWrap);
		this.localizationService = new LocalizationService();

		// Setup events and event listeners
		this.eventSetup();
	}

	/**
	 * Handles event setup and registration of listeners
	 */
	eventSetup(): void {
		this.overlayEvents();
		this.compatibilityEvents();
		this.observerEvents();
	};

	/**
	 * Overlay event setup
	 */
	overlayEvents(): void {
		// Handle Stripe gateway UI blocking function
		// Otherwise we throw errors
		// Also discard our overlay when the modal is closed on desktop and mobile
		$.fn.block = function () {
			window.dispatchEvent(new CustomEvent("cfw-block-event"));
			Main.addOverlay();
		};
		$.fn.unblock = function () {
			window.dispatchEvent(new CustomEvent("cfw-un-block-event"));
			Main.removeOverlay();
		};

		$.fn.blockUI = function () {
			window.dispatchEvent(new CustomEvent("cfw-block-event"));
			Main.addOverlay();
		};
		$.fn.unblockUI = function () {
			window.dispatchEvent(new CustomEvent("cfw-un-block-event"));
			Main.removeOverlay();
		};
	}

	/**
	 * Event setup relating to the registration and creation of compatibility classes
	 */
	compatibilityEvents(): void {
		// Access to window without the compiler yelling / having to cast every time
		let w: any = window;

		// Compatibility Class Creation
		let beforeFilter = ops => ops.event && ops.event === 'before-setup';
		let afterFilter = ops => !ops.event || ops.event === 'after-setup';

		w.addEventListener("cfw-main-before-setup", ({ detail }) => CompatibilityFactory.filterAndCreate(detail.main, beforeFilter));
		w.addEventListener("cfw-main-after-setup", ({ detail }) => CompatibilityFactory.filterAndCreate(detail.main, afterFilter));
	}

	/**
	 * Event setup relating to observers
	 */
	observerEvents() {
		(<any>window).addEventListener("cfw-main-after-setup", ({ detail }) => {
			// Error observer messages to ignore
			window.dispatchEvent(new CustomEvent("cfw-payment-error-observer-ignore-list"));

			// Setup the errorObserver
			detail.main.errorObserverWatch();
		});
	}

	/**
	 * Sets up the tab container by running easy tabs, setting up animation listeners, and setting up events and on load
	 * functionality
	 */
	setup(): void {

		// Before setup event
		window.dispatchEvent(new CustomEvent("cfw-main-before-setup", { detail: { main: this } }));

		// Initialize the easy tabs
		this.easyTabService.initialize(this.tabContainer.tabContainerBreadcrumb);

		// Setup animation listeners
		this.setupAnimationListeners();

		// Set up credit card fields if there. Needs to happen before wrap
		this.tabContainer.setUpCreditCardFields();

		// Fix floating labels
		this.tabContainer.setFloatLabelOnGarlicRetrieve();

		// Before set wraps event in case anyone needs to do some JIT class adding
		window.dispatchEvent(new CustomEvent("cfw-main-before-tab-container-set-wraps", { detail: { main: this } }));

		/**
		 * NOTE: If you are doing any DOM manipulation (adding and removing classes specifically). Do it before the setWraps
		 * call on the tab container sections. Once this is called all the setup of the different areas will have completed and
		 * wont be run again until next page load
		 */
		// Loop through and set up the wraps on the tab container sections
		this.tabContainer.tabContainerSections.forEach((tcs: TabContainerSection) => tcs.setWraps());

		// After the set wraps has done but before we set up any tabContainer listeners
		window.dispatchEvent(new CustomEvent("cfw-main-after-tab-container-set-wraps", { detail: { main: this } }));

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

		// After setup event
		window.dispatchEvent(new CustomEvent("cfw-main-after-setup", { detail: { main: this } }));
	}

	errorObserverWatch() {
		// Select the node that will be observed for mutations
		let targetNode = this.checkoutForm[0];

		// Options for the observer (which mutations to observe)
		let config = { childList: true, characterData: true, subtree: true };

		if ( ! this.errorObserver ) {
			// Create an observer instance linked to the callback function
			let observer = new MutationObserver((mutationsList) => this.errorMutationListener(mutationsList));

			// Start observing the target node for configured mutations
			observer.observe(targetNode, config);

			this.errorObserver = observer;
		}
	}

	/**
	 * @param mutationsList
	 */
	errorMutationListener(mutationsList) {
		let ignoreList = (<any>window).errorObserverIgnoreList;

		if($("#cfw-payment-method:visible").length > 0) {
			for (let mutation of mutationsList) {
				if (mutation.type === "childList") {
					let addedNodes = mutation.addedNodes;
					let $errorNode: any = null;

					addedNodes.forEach(node => {
						let $node: any = $(node);
						let hasClass: boolean = $node.hasClass("woocommerce-error");
						let hasGroupCheckoutClass: boolean = $node.hasClass("woocommerce-NoticeGroup-checkout");

						if (hasClass || hasGroupCheckoutClass) {
							if(ignoreList.indexOf($node.text()) == -1) {
								Main.removeOverlay();
								$errorNode = $node;
								$errorNode.attr("class", "");
							}
						}
					});

					if ($errorNode) {
						let alertInfo: AlertInfo = {
							type: "CFWSubmitError",
							message: $errorNode,
							cssClass: "cfw-alert-danger"
						};

						let alert: Alert = new Alert(Main.instance.alertContainer, alertInfo);
						alert.addAlert();

						CompleteOrderAction.initCompleteOrder = false;
					}
				}
			}
		}
	}

	/**
	 * Adds a visual indicator that the checkout is doing something
	 */
	static addOverlay(): void {
		if($("#cfw-payment-method:visible").length > 0) {
			$("body").addClass("show-overlay");
		}
	}

	/**
	 * Remove the visual indicator
	 */
	static removeOverlay(): void {
		$("body").removeClass("show-overlay");
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
			$("#cfw-login-slide").addClass("stay-open");
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
	 * @return {any}
     */
    get alertContainer(): any {
        return this._alertContainer;
    }

    /**
     * @param {any} value
     */
    set alertContainer(value: any) {
        this._alertContainer = value;
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
	 * @return {any}
	 */
	get compatibility(): any {
		return this._compatibility;
	}

	/**
	 * @param {any} value
	 */
	set compatibility(value: any) {
		this._compatibility = value;
	}

	/**
	 * @return {Array<Compatibility>}
	 */
	get createdCompatibilityClasses(): Array<Compatibility> {
		return this._createdCompatibilityClasses;
	}

	/**
	 * @param {Array<Compatibility>} value
	 */
	set createdCompatibilityClasses(value: Array<Compatibility>) {
		this._createdCompatibilityClasses = value;
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
	 * @returns {MutationObserver}
	 */
	get errorObserver(): MutationObserver {
		return this._errorObserver;
	}

	/**
	 * @param {MutationObserver} value
	 */
	set errorObserver(value: MutationObserver) {
		this._errorObserver = value;
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