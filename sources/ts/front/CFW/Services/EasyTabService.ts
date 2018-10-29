import { Main }                             from "../Main";
import { TabContainerSection }              from "../Elements/TabContainerSection";
import { TabContainer }                     from "../Elements/TabContainer";
import {Alert} from "../Elements/Alert";

/**
 * EzTab Enum
 */
export enum EasyTab {
    CUSTOMER,
    SHIPPING,
    PAYMENT,
}

/**
 * Easy tab Direction Object Blueprint
 */
export type EasyTabDirection = { current: EasyTab, target: EasyTab };

/**
 *
 */
export class EasyTabService {

    /**
     * @type {any}
     * @private
     */
    private _easyTabsWrap: any;

    /**
     * @param easyTabsWrap
     */
    constructor(easyTabsWrap: any) {
       this.easyTabsWrap = easyTabsWrap;
    }

    /**
     * Returns the current and target tab indexes
     *
     * @param target
     * @returns {EasyTabDirection}
     */
    static getTabDirection(target): EasyTabDirection {
        let currentTabIndex: number = 0;
        let targetTabIndex: number = 0;

        Main.instance.tabContainer.tabContainerSections.forEach((tab: TabContainerSection, index: number) => {
            let $tab: any = tab.jel;

            if($tab.filter(":visible").length !== 0) {
                currentTabIndex = index;
            }

            if($tab.is($(target))) {
                targetTabIndex = index;
            }
        });

        return <EasyTabDirection>{ current: currentTabIndex, target: targetTabIndex };
    }

    /**
     *
     */
    initialize() {
        this.easyTabsWrap.easytabs({
            defaultTab: "li.tab#default-tab",
            tabs: "ul > li.tab"
        });

        this.easyTabsWrap.removeClass("cfw-tabs-not-initialized");
    }

    /**
     * @param {EasyTab} tab
     */
    static go(tab: EasyTab): void {
        Main.instance.easyTabService.easyTabsWrap.easytabs("select", EasyTabService.getTabId(tab));
    }

    /**
     * Returns the id of the tab passed in
     *
     * @param {EasyTab} tab
     * @returns {string}
     */
    static getTabId(tab: EasyTab): string {
        let tabContainer: TabContainer = Main.instance.tabContainer;
        let easyTabs: Array<TabContainerSection> = tabContainer.tabContainerSections;

        return easyTabs[tab].jel.attr("id");
    }

    /**
     * Is there a shipping easy tab present?
     *
     * @returns {boolean}
     */
    static isThereAShippingTab(): boolean {
        return Main.instance.easyTabService.easyTabsWrap.find('.etabs > li.tab').length !== 2;
    }


    get easyTabsWrap(): any {
        return this._easyTabsWrap;
    }

    set easyTabsWrap(value: any) {
        this._easyTabsWrap = value;
    }
}