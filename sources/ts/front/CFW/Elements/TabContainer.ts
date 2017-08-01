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
import {UpdateShippingMethodAction} from "../Actions/UpdateShippingMethodAction";
import {Cart} from "./Cart";

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
            new AccountExistsAction("account_exists", ajaxInfo, email_input.val(), this.jel).load();

            // Add check to keyup event
            email_input.on("keyup", () => new AccountExistsAction("account_exists", ajaxInfo, email_input.val(), this.jel).load() );

            // On page load check
            let onLoadAccCheck: AccountExistsAction = new AccountExistsAction("account_exists", ajaxInfo, email_input.val(), this.jel);
            onLoadAccCheck.load();
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
     * @param cart
     */
    setUpdateShippingFieldsListener(ajaxInfo: AjaxInfo, cart: Cart) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let form_elements: Array<FormElement> = customer_info.getFormElementsByModule('cfw-shipping-info');
        let on: string = "change";
        let usfri: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();
        let tc: TabContainer = this;

        let registerUpdateShippingFieldsActionOnChange: Function = function(fe: FormElement, action: string, ajaxInfo: AjaxInfo, shipping_details_fields: Array<JQuery>, on: string) {
            fe.holder.jel.on(on, (event: any) => TabContainer.genericUpdateShippingFieldsActionProcess(fe, event.target.value,
                ajaxInfo, action, shipping_details_fields, cart, tc).load());
        };

        form_elements.forEach((fe: FormElement) => registerUpdateShippingFieldsActionOnChange(fe, usfri.action, ajaxInfo,
            usfri.shipping_details_fields, on));
    }

    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     *
     * @param ajaxInfo
     * @param cart
     */
    setUpdateAllShippingFieldsListener(ajaxInfo: AjaxInfo, cart: Cart) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let form_elements: Array<FormElement> = customer_info.getFormElementsByModule('cfw-shipping-info');
        let continue_button: JQuery = customer_info.jel.find("#cfw-shipping-info-action");
        let shipping_payment_bc: JQuery = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");
        let usfri: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();
        let tc: TabContainer = this;

        let updateAllProcess: Function = function(event: any) {
            form_elements.forEach((fe: FormElement) => TabContainer.genericUpdateShippingFieldsActionProcess(fe, fe.holder.jel.val(),
                ajaxInfo, usfri.action, usfri.shipping_details_fields, cart, tc).load());
        };

        continue_button.on("click", updateAllProcess.bind(this));
        shipping_payment_bc.on("click", updateAllProcess.bind(this));
    }

    setUpCreditCardRadioReveal() {
        let stripe_container: JQuery = $(".payment_method_stripe");

        if(stripe_container.length > 0) {
            let stripe_options = stripe_container.find('input[type="radio"][name="wc-stripe-payment-token"]');
            stripe_options.each((index: number, elem: HTMLElement) => {
                if($(elem).attr("id") == "wc-stripe-payment-token-new") {
                    $(elem).on('click', () => {
                        $("#wc-stripe-cc-form").slideDown(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                        $(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                    });

                    if($(elem).is(":checked")) {
                        $("#wc-stripe-cc-form").slideDown(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                        $(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                    }
                } else {
                    $(elem).on('click', () => {
                        $("#wc-stripe-cc-form").slideUp(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideUp(300);
                        $(".wc-saved-payment-methods").addClass("kill-bottom-margin");

                    });

                    if($(elem).is(":checked")) {
                        $(".wc-saved-payment-methods").addClass("kill-bottom-margin");
                    }
                }
            })
        }
    }

    setUpCreditCardFields() {
        let form_wraps = $("#wc-stripe-cc-form .form-row");

        $("#wc-stripe-cc-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        $("#wc-stripe-cc-form").find(".clear").remove();

        form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");

            if($(elem).hasClass("form-row-wide")) {
                $(elem).wrap("<div class='cfw-column-6'></div>")
            }

            if($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-3'></div>")
            }
        });
    }

    setUpPaymentTabRadioButtons() {
        // The payment radio buttons to register the click events too
        let payment_radio_buttons: Array<Element> = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="payment_method"]');

        let shipping_same_radio_buttons: Array<Element> = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="shipping_same"]');

        this.setRevealOnRadioButtonGroup(payment_radio_buttons);
        this.setRevealOnRadioButtonGroup(shipping_same_radio_buttons);
    }

    /**
     * Handles the payment method revealing and registering the click events.
     */
    setRevealOnRadioButtonGroup(radio_buttons: Array<Element>) {

        // Handles sliding down the containers that aren't supposed to be open, and opens the one that is.
        let slideUpAndDownContainers = (rb: Element) => {
            // Filter out the current radio button
            // Slide up the other buttons
            radio_buttons
                .filter((filterItem: Element) => filterItem != rb)
                .forEach((other: Element) => other.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideUp(300));

            // Slide down our button
            rb.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideDown(300);
        };

        // Register the slide up and down container on click
        radio_buttons
            .forEach((rb: Element) => {
                // On payment radio button click....
                rb.jel.on('click', () => {
                    slideUpAndDownContainers(rb);
                });

                // Fire it once for page load if selected
                if(rb.jel.is(":checked")) {
                    slideUpAndDownContainers(rb);
                }
            });
    }

    /**
     *
     * @param ajaxInfo
     * @param cart
     */
    setShippingPaymentUpdate(ajaxInfo: AjaxInfo, cart: Cart): void {
        let shipping_method: TabContainerSection = this.tabContainerSectionBy("name", "shipping_method");
        let updateShippingMethod: Function = function(event: any) {
            let shipMethodVal = event.target.value;

            new UpdateShippingMethodAction("update_shipping_method", ajaxInfo, shipMethodVal, cart).load();
        };

        shipping_method.jel.find('#cfw-shipping-method input[type="radio"]').each((index, el) => {
            $(el).on("click", updateShippingMethod.bind(this));
        });
    }

    /**
     *
     */
    setShippingFieldsOnLoad(): void {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let form_elements: Array<FormElement> = customer_info.getFormElementsByModule('cfw-shipping-info');
        let staticShippingFields: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();

        form_elements.forEach((formElement: FormElement) => {
            let feFieldKey: string = formElement.holder.jel.attr("field_key");
            let feFieldValue: string = formElement.holder.jel.val();

            let match: JQuery = staticShippingFields.shipping_details_fields.find((sdf: JQuery) => sdf.attr("field_type") == feFieldKey);

            match.children(".field_value").text(feFieldValue);
        })
    }

    setUpMobileCartDetailsReveal(): void {
        let showCartDetails: Element = new Element($("#cfw-show-cart-details"));
        showCartDetails.jel.on('click', () => {
            $("#cfw-cart-details-collapse-wrap").slideToggle(300).parent().toggleClass("active")
        });

        $(window).on('resize', () => {
            if(window.innerWidth >= 767) {
                $("#cfw-cart-details-collapse-wrap").css('display', 'block');
                $("#cfw-cart-details").removeClass('active');
            } else {
                $("#cfw-cart-details-collapse-wrap").css('display', 'none');
            }
        })
    }

    /**
     * @param fe
     * @param value
     * @param ajaxInfo
     * @param action
     * @param shipping_details_fields
     * @param cart
     * @param tabContainer
     */
    static genericUpdateShippingFieldsActionProcess(fe: FormElement, value: any, ajaxInfo: AjaxInfo, action: string,
                                                    shipping_details_fields: Array<JQuery>, cart: Cart, tabContainer: TabContainer): UpdateShippingFieldsAction {
        let type = fe.holder.jel.attr("field_key");
        let cdi: CustomerDataInfo = {field_type: type, field_value: value};

        return new UpdateShippingFieldsAction(action, ajaxInfo, [cdi], shipping_details_fields, cart, tabContainer);
    }

    /**
     *
     * @returns {UpdateShippingFieldsRI}
     */
    getUpdateShippingRequiredItems(): UpdateShippingFieldsRI {
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