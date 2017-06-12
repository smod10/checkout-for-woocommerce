/// <reference path="../../../../typings/index.d.ts" />
/// <reference path="Definitions/ArrayFind.d.ts" />

import { TabContainer } 			from "./Elements/TabContainer";
import { AjaxInfo }					from "./Types/Types";

export class Main {

	private _tabContainer: TabContainer;
	private _ajaxInfo: AjaxInfo;

	constructor(tabContainer: TabContainer, ajaxInfo: AjaxInfo) {
		this.tabContainer = tabContainer;
		this.ajaxInfo = ajaxInfo;
	}

	setup() {
		// Setup easy tabs
		this.tabContainer.easyTabs();
		this.setupAnimationListeners();
		this.tabContainer.setAccountCheckListener(this.ajaxInfo);
		this.tabContainer.setLogInListener(this.ajaxInfo);
		this.tabContainer.setUpdateShippingFieldsListener(this.ajaxInfo);
		this.tabContainer.setUpdateAllShippingFieldsListener(this.ajaxInfo);
	}

	setupAnimationListeners() {
		$("#cfw-ci-login").on("click", function(){
			$("#cfw-login-slide").slideDown(300);
		});
	}

	get tabContainer() {
		return this._tabContainer;
	}

	set tabContainer(value: TabContainer) {
		this._tabContainer = value;
	}

	get ajaxInfo(): AjaxInfo {
		return this._ajaxInfo;
	}

	set ajaxInfo(value: AjaxInfo) {
		this._ajaxInfo = value;
	}
}