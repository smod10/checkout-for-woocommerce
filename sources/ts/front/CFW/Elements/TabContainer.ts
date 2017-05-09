import { Element }                          from "Element";
import { TabContainerBreadcrumb }           from "TabContainerBreadcrumb";
import { TabContainerSection }              from "TabContainerSection";
import { InputLabelWrap }                   from "InputLabelWrap";
import { AccountExistsAction }              from "../Actions/AccountExistsAction";
import { AjaxInfo }                         from "../Types/Types";

export class TabContainer extends Element {

    private _tabContainerBreadcrumb: TabContainerBreadcrumb;
    private _tabContainerSections: Array<TabContainerSection>;

    constructor(jel: JQuery, tabContainerBreadcrumb: TabContainerBreadcrumb, tabContainerSections: Array<TabContainerSection>) {
        super(jel);

        this.tabContainerBreadcrumb = tabContainerBreadcrumb;
        this.tabContainerSections = tabContainerSections;
    }

    setAccountCheckListener(ajaxInfo: AjaxInfo) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
        let email_input: JQuery = email_input_wrap.input.jel;

        let onLoadAea = new AccountExistsAction("account_exists", ajaxInfo, email_input.val());

        email_input.on("keyup", () => new AccountExistsAction("account_exists", ajaxInfo, email_input.val()));
    }

    easyTabs() {
        this.jel.easytabs();
    }

    tabContainerSectionBy(by: string, value: any): TabContainerSection {
        return <TabContainerSection>this.tabContainerSections.find((tabContainerSection: TabContainerSection) => tabContainerSection[by] == value);
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