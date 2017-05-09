/// <reference path="../../../../typings/index.d.ts" />

import { TabContainer } from "./Elements/TabContainer";

export class Main {

	private _tabContainer: TabContainer;

	constructor(tabContainer: TabContainer) {
		this.tabContainer = tabContainer;
	}

	setup() {
		// Setup easy tabs
		this.tabContainer.easyTabs();
		this.setupAnimationListeners();
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
}