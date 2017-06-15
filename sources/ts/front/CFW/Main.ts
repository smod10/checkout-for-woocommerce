/// <reference path="../../../../typings/index.d.ts" />
/// <reference path="Definitions/ArrayFind.d.ts" />

import { TabContainer } 			from "./Elements/TabContainer";
import { AjaxInfo }					from "./Types/Types";

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
	 * @type {AjaxInfo}
	 * @private
	 */
	private _ajaxInfo: AjaxInfo;

	/**
	 *
	 * @param tabContainer
	 * @param ajaxInfo
	 */
	constructor(tabContainer: TabContainer, ajaxInfo: AjaxInfo) {
		this.tabContainer = tabContainer;
		this.ajaxInfo = ajaxInfo;
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

		// Set up event handlers
		this.tabContainer.setAccountCheckListener(this.ajaxInfo);
		this.tabContainer.setLogInListener(this.ajaxInfo);
		this.tabContainer.setUpdateShippingFieldsListener(this.ajaxInfo);
		this.tabContainer.setUpdateAllShippingFieldsListener(this.ajaxInfo);
		this.tabContainer.setShippingPaymentUpdate(this.ajaxInfo);

		// Handles the shipping fields on load if the user happens to land on the shipping method page.
		this.tabContainer.setShippingFieldsOnLoad();
	}

	/**
	 * Sets up animation listeners
	 */
	setupAnimationListeners() {
		$("#cfw-ci-login").on("click", function(){
			$("#cfw-login-slide").slideDown(300);
		});
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
}