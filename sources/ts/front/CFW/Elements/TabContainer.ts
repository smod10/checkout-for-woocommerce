import { Element }                          from "./Element";
import { TabContainerBreadcrumb }           from "./TabContainerBreadcrumb";
import { TabContainerSection }              from "./TabContainerSection";
import { InputLabelWrap }                   from "./InputLabelWrap";
import { CustomerDataInfo }                 from "../Types/Types";
import { AjaxInfo }                         from "../Types/Types";
import { UpdateShippingFieldsRI }           from "../Types/Types";
import { AccountExistsAction }              from "../Actions/AccountExistsAction";
import { LoginAction }                      from "../Actions/LoginAction";
import { FormElement }                      from "./FormElement";
import { UpdateShippingFieldsAction }       from "../Actions/UpdateShippingFieldsAction";
import { UpdateShippingMethodAction }       from "../Actions/UpdateShippingMethodAction";
import { Cart }                             from "./Cart";
import { CompleteOrderAction }              from "../Actions/CompleteOrderAction";
import { Main }                             from "../Main";
import { ApplyCouponAction }                from "../Actions/ApplyCouponAction";
import { EValidationSections }              from "../Services/ValidationService";

/**
 *
 */
export class TabContainer extends Element {

    /**
     * @type {TabContainerBreadcrumb}
     * @private
     */
    private _tabContainerBreadcrumb: TabContainerBreadcrumb;

    /**
     * @type {[TabContainerSection]}
     * @private
     */
    private _tabContainerSections: Array<TabContainerSection>;

    /**
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
     * @param ajaxInfo
     */
    setAccountCheckListener(ajaxInfo: AjaxInfo) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");

        if(email_input_wrap) {

            let email_input: JQuery = email_input_wrap.holder.jel;
            let reg_email: JQuery = $("#cfw-acc-register-chk");

            // Handles page onload use case
            new AccountExistsAction("account_exists", ajaxInfo, email_input.val(), this.jel).load();

            let handler = () => new AccountExistsAction("account_exists", ajaxInfo, email_input.val(), this.jel).load();

            // Add check to keyup event
            email_input.on("keyup", handler);
            email_input.on("change", handler);
            reg_email.on('change', handler);

            // On page load check
            let onLoadAccCheck: AccountExistsAction = new AccountExistsAction("account_exists", ajaxInfo, email_input.val(), this.jel);
            onLoadAccCheck.load();
        }
    }

    /**
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
     */
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

                    $(window).on('load', () => {
                        if($(elem).is(":checked")) {
                            $("#wc-stripe-cc-form").slideDown(300);
                            $(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                            $(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                        }
                    });
                } else {
                    $(elem).on('click', () => {
                        $("#wc-stripe-cc-form").slideUp(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideUp(300);
                        $(".wc-saved-payment-methods").addClass("kill-bottom-margin");

                    });

                    $(window).on('load', () => {
                        if($(elem).is(":checked")) {
                            $(".wc-saved-payment-methods").addClass("kill-bottom-margin");
                        }
                    });
                }
            })
        }
    }

    /**
     *
     */
    setUpCreditCardFields() {
        // Stripe Form
        let stripe_form_wraps = $("#wc-stripe-cc-form .form-row");

        $("#wc-stripe-cc-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        $("#wc-stripe-cc-form").find(".clear").remove();

        stripe_form_wraps.each(function(index, elem) {
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

        // Authorize.net
        let authorizenet_form_wraps = $("#wc-authorize-net-aim-credit-card-form .form-row");

        $("#wc-authorize-net-aim-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        authorizenet_form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");

            if( $(elem).hasClass("form-row-wide") ) {
                $(elem).wrap("<div class='cfw-column-6'></div>")
            }

            if( $(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last") ) {
                $(elem).wrap("<div class='cfw-column-3'></div>")
            }
        });

        // PayFlow Pro
        let payflow_pro_form_wraps = $(".payment_method_paypal_pro_payflow > fieldset > .form-row");

        $(".payment_method_paypal_pro_payflow > fieldset").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        payflow_pro_form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");

            if( $(elem).hasClass("form-row-first") && $(elem).index() === 0 ) {
                $(elem).wrap("<div class='cfw-column-6'></div>")
            } else {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });

        // PayPal Pro
        let paypro_form_wraps = $(".payment_method_paypal_pro > fieldset > .form-row");

        $(".payment_method_paypal_pro > fieldset").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        paypro_form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");

            if( $(elem).hasClass("form-row-first") && $(elem).index() === 0 ) {
                $(elem).wrap("<div class='cfw-column-6'></div>")
            } else {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
    }

    /**
     * Set up reveal radio group on customer info tab for billing
     */
    setUpCustomerTabRadioButtons() {
        let shipping_same_radio_buttons: Array<Element> = this
            .tabContainerSectionBy("name", "customer_info")
            .getInputsFromSection('[type="radio"][name="shipping_same"]');

        this.setRevealOnRadioButtonGroup(shipping_same_radio_buttons, true);
    }

    /**
     *
     */
    setUpPaymentTabRadioButtons() {
        // The payment radio buttons to register the click events too
        let payment_radio_buttons: Array<Element> = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="payment_method"]');

        let shipping_same_radio_buttons: Array<Element> = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="shipping_same"]');

        this.setRevealOnRadioButtonGroup(payment_radio_buttons);
        this.setRevealOnRadioButtonGroup(shipping_same_radio_buttons, true);
    }

    /**
     * Handles the payment method revealing and registering the click events.
     */
    setRevealOnRadioButtonGroup(radio_buttons: Array<Element>, remove_add_required: boolean = false) {

        // Handles sliding down the containers that aren't supposed to be open, and opens the one that is.
        let slideUpAndDownContainers = (rb: Element) => {
            // Filter out the current radio button
            // Slide up the other buttons
            radio_buttons
                .filter((filterItem: Element) => filterItem != rb)
                .forEach((other: Element) => other.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideUp(300));

            // Slide down our button
            rb.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideDown(300);

            let input_wraps = $("#cfw-billing-fields-container").find(".cfw-input-wrap");

            if(remove_add_required) {
                input_wraps.each((index, elem) => {
                    let input: JQuery = $(elem).find("input");
                    let select: JQuery = $(elem).find("select");
                    let items = [input, select];

                    items.forEach((item) => {
                        if(item.length > 0) {
                            if(rb.jel.val() == 1) {
                                if(item[0].hasAttribute("cfw-required-placeholder")) {
                                    item[0].setAttribute("required", "");
                                    item[0].removeAttribute("cfw-required-placeholder");
                                }
                            } else {
                                if(item[0].hasAttribute("required")) {
                                    item[0].setAttribute("cfw-required-placeholder", "");
                                }
                                item[0].removeAttribute("required");
                            }
                        }
                    })
                });
            }
        };

        // Register the slide up and down container on click
        radio_buttons
            .forEach((rb: Element) => {
                // On payment radio button click....
                rb.jel.on('click', () => {
                    slideUpAndDownContainers(rb);
                });

                // Fire it once for page load if selected
                $(window).on('load', () => {
                    if(rb.jel.is(":checked")) {
                        slideUpAndDownContainers(rb);
                    }
                });
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

    /**
     *
     */
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
     * @returns {{}}
     */
    getOrderDetails() {
        let ship_to_different_address = parseInt($("[name='shipping_same']:checked").val());
        let payment_method = $('[name="payment_method"]:checked').val();
        let account_password = $('#cfw-password').val();
        let billing_email = $("#billing_email").val();

        let billing_first_name = $("#billing_first_name").val();
        let billing_last_name = $("#billing_last_name").val();
        let billing_company = $("#billing_company").val();
        let billing_country = $("#billing_country").val();
        let billing_address_1 = $("#billing_address_1").val();
        let billing_address_2 = $("#billing_address_2").val();
        let billing_city = $("#billing_city").val();
        let billing_state = $("#billing_state").val();
        let billing_postcode = $("#billing_postcode").val();

        let shipping_first_name = $("#shipping_first_name").val();
        let shipping_last_name = $("#shipping_last_name").val();
        let shipping_company = $("#shipping_company").val();
        let shipping_country = $("#shipping_country").val();
        let shipping_address_1 = $("#shipping_address_1").val();
        let shipping_address_2 = $("#shipping_address_2").val();
        let shipping_city = $("#shipping_city").val();
        let shipping_state = $("#shipping_state").val();
        let shipping_postcode = $("#shipping_postcode").val();
        let shipping_method = $("[name='shipping_method[0]']:checked").val();

        let _wpnonce = $("#_wpnonce").val();
        let _wp_http_referer = $("[name='_wp_http_referer']").val();
        let wc_stripe_payment_token = $("[name='wc-stripe-payment-token']").val();

        let wc_authorize_net_aim_account_number = $("[name='wc-authorize-net-aim-account-number']").val();
        let wc_authorize_net_aim_expiry = $("[name='wc-authorize-net-aim-expiry']").val();
        let wc_authorize_net_aim_csc = $("[name='wc-authorize-net-aim-csc']").val();

        let paypal_pro_payflow_card_number = $("[name='paypal_pro_payflow-card-number']").val();
        let paypal_pro_payflow_card_expiry = $("[name='paypal_pro_payflow-card-expiry']").val();
        let paypal_pro_payflow_card_cvc = $("[name='paypal_pro_payflow-card-cvc']").val();

        let paypal_pro_card_number = $("[name='paypal_pro-card-number']").val();
        let paypal_pro_card_expiry = $("[name='paypal_pro-card-expiry']").val();
        let paypal_pro_card_cvc = $("[name='paypal_pro-card-cvc']").val();

        if(ship_to_different_address === 0) {
            billing_first_name = shipping_first_name;
            billing_last_name = shipping_last_name;
            billing_company = shipping_company;
            billing_country = shipping_country;
            billing_address_1 = shipping_address_1;
            billing_address_2 = shipping_address_2;
            billing_city = shipping_city;
            billing_state = shipping_state;
            billing_postcode = shipping_postcode;
        }

        let completeOrderCheckoutData = {
            billing_first_name: billing_first_name,
            billing_last_name: billing_last_name,
            billing_company: billing_company,
            billing_country: billing_country,
            billing_address_1: billing_address_1,
            billing_address_2: billing_address_2,
            billing_city: billing_city,
            billing_state: billing_state,
            billing_postcode: billing_postcode,
            billing_phone: 0,
            billing_email: billing_email,
            ship_to_different_address: ship_to_different_address,
            shipping_first_name: shipping_first_name,
            shipping_last_name: shipping_last_name,
            shipping_company: shipping_company,
            shipping_country: shipping_country,
            shipping_address_1: shipping_address_1,
            shipping_address_2: shipping_address_2,
            shipping_city: shipping_city,
            shipping_state: shipping_state,
            shipping_postcode: shipping_postcode,
            order_comments: '',
            "shipping_method[0]": shipping_method,
            payment_method: payment_method,
            "wc-stripe-payment-token": wc_stripe_payment_token,
            _wpnonce: _wpnonce,
            _wp_http_referer: _wp_http_referer,
            "wc-authorize-net-aim-account-number": wc_authorize_net_aim_account_number,
            "wc-authorize-net-aim-expiry": wc_authorize_net_aim_expiry,
            "wc-authorize-net-aim-csc": wc_authorize_net_aim_csc,
            "paypal_pro_payflow-card-number": paypal_pro_payflow_card_number,
            "paypal_pro_payflow-card-expiry": paypal_pro_payflow_card_expiry,
            "paypal_pro_payflow-card-cvc": paypal_pro_payflow_card_cvc,
            "paypal_pro-card-number": paypal_pro_card_number,
            "paypal_pro-card-expiry": paypal_pro_card_expiry,
            "paypal_pro-card-cvc": paypal_pro_card_cvc,
        };

        if(account_password && account_password.length > 0) {
            completeOrderCheckoutData["account_password"] = account_password;
        }

        if($("#cfw-acc-register-chk:checked").length > 0) {
            completeOrderCheckoutData["createaccount"] = 1;
        }

        if($("#wc-stripe-new-payment-method:checked").length > 0) {
            completeOrderCheckoutData["wc-stripe-new-payment-method"] = true;
        }

        return completeOrderCheckoutData;
    }

    /**
     * @param {AjaxInfo} ajaxInfo
     * @param {Cart} cart
     */
    setCompleteOrder(ajaxInfo: AjaxInfo, cart: Cart): void {
        let completeOrderButton: Element = new Element($("#cfw-complete-order-button"));

        completeOrderButton.jel.on('click', () => {
            let createOrder: boolean = true;
            let w: any = window;

            if($("#shipping_dif_from_billing:checked").length !== 0) {
                w.CREATE_ORDER = true;

                w.addEventListener("cfw:state-zip-success", function() {
                    w.CREATE_ORDER = false;

                    if(createOrder) {
                        new CompleteOrderAction('complete_order', ajaxInfo, this.getOrderDetails());
                    }
                }.bind(this), { once: true });

                w.addEventListener("cfw:state-zip-failure", function(){
                    w.CREATE_ORDER = false;
                }.bind(this), { once: true });

                createOrder = Main.instance.validationService.validate(EValidationSections.BILLING);
            } else {
                new CompleteOrderAction('complete_order', ajaxInfo, this.getOrderDetails());
            }
        });
    }

    /**
     * @param {AjaxInfo} ajaxInfo
     * @param {Cart} cart
     */
    setApplyCouponListener(ajaxInfo: AjaxInfo, cart: Cart) {
        $("#cfw-promo-code-btn").on('click', () => {
            new ApplyCouponAction('apply_coupon', ajaxInfo, $("#cfw-promo-code").val(), cart).load();
        })
    }

    /**
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
     * @param by
     * @param value
     * @returns {TabContainerSection}
     */
    tabContainerSectionBy(by: string, value: any): TabContainerSection {
        return <TabContainerSection>this.tabContainerSections.find((tabContainerSection: TabContainerSection) => tabContainerSection[by] == value);
    }

    /**
     * @returns {TabContainerBreadcrumb}
     */
    get tabContainerBreadcrumb(): TabContainerBreadcrumb {
        return this._tabContainerBreadcrumb;
    }

    /**
     * @param value
     */
    set tabContainerBreadcrumb(value: TabContainerBreadcrumb) {
        this._tabContainerBreadcrumb = value;
    }

    /**
     * @returns {Array<TabContainerSection>}
     */
    get tabContainerSections(): Array<TabContainerSection> {
        return this._tabContainerSections;
    }

    /**
     * @param value
     */
    set tabContainerSections(value: Array<TabContainerSection>) {
        this._tabContainerSections = value;
    }
}