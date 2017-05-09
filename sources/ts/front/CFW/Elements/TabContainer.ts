import { Element }                          from "Element";
import { TabContainerBreadcrumb }           from "TabContainerBreadcrumb";
import { TabContainerSection }              from "TabContainerSection";

export class TabContainer extends Element {

    private _tabContainerBreadcrumb: TabContainerBreadcrumb;
    private _tabContainerSections: Array<TabContainerSection>;

    constructor(jel: JQuery, tabContainerBreadcrumb: TabContainerBreadcrumb, tabContainerSections: Array<TabContainerSection>) {
        super(jel);

        this.tabContainerBreadcrumb = tabContainerBreadcrumb;
        this.tabContainerSections = tabContainerSections;
    }

    easyTabs() {
        this.jel.easytabs();
    }


    get tabContainerBreadcrumb(): TabContainerBreadcrumb {
        return this._tabContainerBreadcrumb;
    }

    set tabContainerBreadcrumb(value: TabContainerBreadcrumb) {
        this._tabContainerBreadcrumb = value;
    }

    get tabContainerSections(): Array<TabContainerSection> {
        return this._tabContainerSections;
    }

    set tabContainerSections(value: Array<TabContainerSection>) {
        this._tabContainerSections = value;
    }
}