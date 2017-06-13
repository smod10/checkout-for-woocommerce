import { Element }                          from "Element";
import { TabContainerBreadcrumb }           from "TabContainerBreadcrumb";
import { TabContainerSection }              from "TabContainerSection";
import { InputLabelWrap }                   from "InputLabelWrap";
import { CustomerDataInfo }                 from "../Types/Types";
import { AjaxInfo }                         from "../Types/Types";
import { UpdateShippingFieldsRI }           from "../Types/Types";
import { AccountExistsAction }              from "../Actions/AccountExistsAction";
import { LoginAction }                      from "../Actions/LoginAction";
import { FormElement }                      from "./FormElement";
import { UpdateShippingFieldsAction }       from "../Actions/UpdateShippingFieldsAction";

/**
 *
 */
export class TabContainer extends Element {

    /**
     *
     */
    private _tabContainerBreadcrumb: TabContainerBreadcrumb;

    /**
     *
     */
    private _tabContainerSections: Array<TabContainerSection>;

    /**
     *
     * @param jel
     * @param tabContainerBreadcrumb
     * @param tabContainerSections
     */
    constructor(jel: JQuery, tabContainerBreadcrumb: TabContainerBreadcrumb, tabContainerSections: Array<TabContainerSection>) {
        super(jel);

        this.tabContainerBreadcrumb = tabContainerBreadcrumb;
        this.tabContainerSections = tabContainerSections;
    }

    /**
     *
     * @param ajaxInfo
     */
    setAccountCheckListener(ajaxInfo: AjaxInfo) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");

        if(email_input_wrap) {
            let email_input: JQuery = email_input_wrap.holder.jel;

            // Handles page onload use case
            new AccountExistsAction("account_exists", ajaxInfo, email_input.val()).load();

            // Add check to keyup event
            email_input.on("keyup", () => new AccountExistsAction("account_exists", ajaxInfo, email_input.val()).load() );
        }
    }

    /**
     *
     * @param ajaxInfo
     */
    setLogInListener(ajaxInfo: AjaxInfo) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");

        if(email_input_wrap) {
            let email_input: JQuery = email_input_wrap.holder.jel;

            let password_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-password-wrap");
            let password_input: JQuery = password_input_wrap.holder.jel;

            let login_btn: JQuery = $("#cfw-login-btn");

            // Fire the login action on click
            login_btn.on("click", () => new LoginAction("login", ajaxInfo, email_input.val(), password_input.val()).load() );
        }
    }

    /**
     * Handles on change events from the shipping input
     *
     * @param ajaxInfo
     */
    setUpdateShippingFieldsListener(ajaxInfo: AjaxInfo) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let form_elements: Array<FormElement> = customer_info.getFormElementsByModule('cfw-shipping-info');
        let on: string = "change";

        let usfri: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();
        let registerUpdateShippingFieldsActionOnChange: Function = function(fe: FormElement, action: string, ajaxInfo: AjaxInfo, shipping_details_fields: Array<JQuery>, on: string) {
            fe.holder.jel.on(on, function(event: any) {
                TabContainer.genericUpdateShippingFieldsActionProcess(fe, event.target.value, ajaxInfo, action, shipping_details_fields).load();
            });
        };

        form_elements.forEach((fe: FormElement) => {
            registerUpdateShippingFieldsActionOnChange(fe, usfri.action, ajaxInfo, usfri.shipping_details_fields, on);
        })
    }

    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     *
     * @param ajaxInfo
     */
    setUpdateAllShippingFieldsListener(ajaxInfo: AjaxInfo) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let form_elements: Array<FormElement> = customer_info.getFormElementsByModule('cfw-shipping-info');
        let continue_button: JQuery = customer_info.jel.find("#cfw-shipping-info-action");
        let shipping_payment_bc: JQuery = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");
        let usfri: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();

        let updateAllProcess: Function = function(event: any) {
            form_elements.forEach((fe: FormElement) => {
                TabContainer.genericUpdateShippingFieldsActionProcess(fe, fe.holder.jel.val(), ajaxInfo, usfri.action, usfri.shipping_details_fields).load();
            });
        };

        continue_button.on("click", updateAllProcess.bind(this));
        shipping_payment_bc.on("click", updateAllProcess.bind(this));
    }

    /**
     *
     * @param fe
     * @param value
     * @param ajaxInfo
     * @param action
     * @param shipping_details_fields
     */
    static genericUpdateShippingFieldsActionProcess(fe: FormElement, value: any, ajaxInfo: AjaxInfo, action: string, shipping_details_fields: Array<JQuery>): UpdateShippingFieldsAction {
        let type = fe.holder.jel.attr("field_key");
        let cdi: CustomerDataInfo = {field_type: type, field_value: value};

        console.log(fe, value, ajaxInfo, action, shipping_details_fields);

        return new UpdateShippingFieldsAction(action, ajaxInfo, [cdi], shipping_details_fields);
    }

    /**
     *
     * @returns {UpdateShippingFieldsRI}
     */
    getUpdateShippingRequiredItems(): UpdateShippingFieldsRI {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let sdf_jquery_results: JQuery = $("#cfw-shipping-details-fields .cfw-shipping-details-field");
        let shipping_details_fields: Array<JQuery> = [];
        let action: string = "update_shipping_fields";

        sdf_jquery_results.each((index, val) => { shipping_details_fields.push($(val)) });

        return <UpdateShippingFieldsRI>{
            action: action,
            shipping_details_fields: shipping_details_fields
        }
    }

    /**
     *
     */
    easyTabs() {
        this.jel.easytabs();
    }

    /**
     *
     * @param by
     * @param value
     * @returns {TabContainerSection}
     */
    tabContainerSectionBy(by: string, value: any): TabContainerSection {
        return <TabContainerSection>this.tabContainerSections.find((tabContainerSection: TabContainerSection) => tabContainerSection[by] == value);
    }

    /**
     *
     * @returns {TabContainerBreadcrumb}
     */
    get tabContainerBreadcrumb(): TabContainerBreadcrumb {
        return this._tabContainerBreadcrumb;
    }

    /**
     *
     * @param value
     */
    set tabContainerBreadcrumb(value: TabContainerBreadcrumb) {
        this._tabContainerBreadcrumb = value;
    }

    /**
     *
     * @returns {Array<TabContainerSection>}
     */
    get tabContainerSections(): Array<TabContainerSection> {
        return this._tabContainerSections;
    }

    /**
     *
     * @param value
     */
    set tabContainerSections(value: Array<TabContainerSection>) {
        this._tabContainerSections = value;
    }
}