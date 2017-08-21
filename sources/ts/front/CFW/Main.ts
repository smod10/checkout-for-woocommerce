/// <reference path="../../../../typings/index.d.ts" />
/// <reference path="Definitions/ArrayFind.d.ts" />

import { TabContainer } 			from "./Elements/TabContainer";
import { AjaxInfo }					from "./Types/Types";
import { Cart } 					from "./Elements/Cart";
import { TabContainerSection } 		from "./Elements/TabContainerSection";

/**
 *
 */
export class Main {

	/**
	 * @type {TabContainer}
	 * @private
	 */
	private _tabContainer: TabContainer;

	/**
	 *
	 */
	private _cart: Cart;

	/**
	 * @type {AjaxInfo}
	 * @private
	 */
	private _ajaxInfo: AjaxInfo;

    /**
	 *
     */
	private _settings: any;

    /**
	 *
     */
	private static _instance: Main;

	/**
	 *
	 * @param tabContainer
	 * @param ajaxInfo
	 * @param cart
	 * @param settings
	 */
	constructor(tabContainer: TabContainer, ajaxInfo: AjaxInfo, cart: Cart, settings: any) {
		this.tabContainer = tabContainer;
		this.ajaxInfo = ajaxInfo;
		this.cart = cart;
		this.settings = settings;

		Main.instance = this;
	}

	/**
	 * Sets up the tab container by running easy tabs, setting up animation listeners, and setting up events and on load
	 * functionality
	 */
	setup() {
		// Setup easy tabs
		this.tabContainer.easyTabs();

		// Setup animation listeners
		this.setupAnimationListeners();

		// Set up credit card fields if there. Needs to happen before wrap
		this.tabContainer.setUpCreditCardFields();

		/**
		 * NOTE: If you are doing any DOM manipulation (adding and removing classes specifically). Do it before the setWraps
		 * call on the tab container sections. Once this is called all the setup of the different areas will have completed and
		 * wont be run again until next page load
		 */
		// Loop through and set up the wraps on the tab container sections
		this.tabContainer.tabContainerSections.forEach((tcs: TabContainerSection) => tcs.setWraps());

		// Set up event handlers
		this.tabContainer.setAccountCheckListener(this.ajaxInfo);
		this.tabContainer.setLogInListener(this.ajaxInfo);
		this.tabContainer.setUpdateShippingFieldsListener(this.ajaxInfo, this.cart);
		this.tabContainer.setUpdateAllShippingFieldsListener(this.ajaxInfo, this.cart);
		this.tabContainer.setShippingPaymentUpdate(this.ajaxInfo, this.cart);
		this.tabContainer.setUpPaymentTabRadioButtons();
		this.tabContainer.setUpCreditCardRadioReveal();
		this.tabContainer.setUpMobileCartDetailsReveal();
		this.tabContainer.setCompleteOrder(this.ajaxInfo, this.cart);
		this.tabContainer.setApplyCouponListener(this.ajaxInfo, this.cart);

		// Handles the shipping fields on load if the user happens to land on the shipping method page.
		this.tabContainer.setShippingFieldsOnLoad();

		this.setupParsley();
    }

	/**
	 * Sets up animation listeners
	 */
	setupAnimationListeners() {
		$("#cfw-ci-login").on("click", function(){
			$("#cfw-login-slide").slideDown(300);
		});
	}

	setupParsley() {
        $('#cfw-tab-container')
            .bind('easytabs:before', function() {
                return $("#cfw-checkout-form").parsley().validate();
            })
	}

	/**
	 *
	 * @returns {TabContainer}
	 */
	get tabContainer() {
		return this._tabContainer;
	}

	/**
	 *
	 * @param value
	 */
	set tabContainer(value: TabContainer) {
		this._tabContainer = value;
	}

	/**
	 *
	 * @returns {AjaxInfo}
	 */
	get ajaxInfo(): AjaxInfo {
		return this._ajaxInfo;
	}

	/**
	 * 
	 * @param value
	 */
	set ajaxInfo(value: AjaxInfo) {
		this._ajaxInfo = value;
	}

	/**
	 *
	 * @returns {Cart}
	 */
	get cart(): Cart {
		return this._cart;
	}

	/**
	 *
	 * @param value
	 */
	set cart(value: Cart) {
		this._cart = value;
	}

    get settings(): any {
        return this._settings;
    }

    set settings(value: any) {
        this._settings = value;
    }

    static get instance(): Main {
        return Main._instance;
    }

    static set instance(value: Main) {
		if(!Main._instance) {
            Main._instance = value;
        }
    }
}