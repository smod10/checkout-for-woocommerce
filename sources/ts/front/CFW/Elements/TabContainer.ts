import { Element }                          from "./Element";
import { TabContainerBreadcrumb }           from "./TabContainerBreadcrumb";
import { TabContainerSection }              from "./TabContainerSection";
import { InputLabelWrap }                   from "./InputLabelWrap";
import { CustomerDataInfo }                 from "../Types/Types";
import { AjaxInfo }                         from "../Types/Types";
import { UpdateShippingFieldsRI }           from "../Actions/UpdateShippingFieldsAction";
import { AccountExistsAction }              from "../Actions/AccountExistsAction";
import { LoginAction }                      from "../Actions/LoginAction";
import { FormElement }                      from "./FormElement";
import { UpdateShippingFieldsAction }       from "../Actions/UpdateShippingFieldsAction";
import { UpdateShippingMethodAction }       from "../Actions/UpdateShippingMethodAction";
import { Cart }                             from "./Cart";
import { Main }                             from "../Main";
import { ValidationService }                from "../Services/ValidationService";
import { UpdateCheckoutAction }             from "../Actions/UpdateCheckoutAction";
import { ApplyCouponAction }                from "../Actions/ApplyCouponAction";

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
     * Sometimes in some browsers (looking at you safari and chrome) the label doesn't float when the data is retrieved
     * via garlic. This will fix this issue and float the label like it should.
     */
    setFloatLabelOnGarlicRetrieve(): void {
        $(".garlic-auto-save").each((index: number, elem) => {
            $(elem).garlic({ onRetrieve: element => $(element).parent().addClass(FormElement.labelClass) })
        });
    }

    /**
     * @param ajaxInfo
     */
    setAccountCheckListener(ajaxInfo: AjaxInfo) {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");

        if(email_input_wrap) {

            let email_input: JQuery = email_input_wrap.holder.jel;
            let reg_email: JQuery = $("#createaccount");

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
        let onEvent: string = "change";
        let usfri: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();
        let tc: TabContainer = this;

        let registerUpdateShippingFieldsActionOnChange: Function = (fe: FormElement, action: string, ajaxInfo: AjaxInfo, shipping_details_fields: Array<JQuery>, on: string) => {
            fe.holder.jel.on(on, (event: any) => TabContainer.genericUpdateShippingFieldsActionProcess(fe, event.target.value,
                ajaxInfo, action, shipping_details_fields, cart, tc, this.getOrderDetails()).load());
        };

        form_elements.forEach((fe: FormElement) => registerUpdateShippingFieldsActionOnChange(fe, usfri.action, ajaxInfo,
            usfri.shipping_details_fields, onEvent));
    }

    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     */
    setUpdateAllShippingFieldsListener() {
        let continueBtn: JQuery = $("#cfw-shipping-info-action .cfw-next-tab");
        let shipping_payment_bc: JQuery = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");
        let updateAllProcesses = this.getShippingFieldsUpdateCallback();

        continueBtn.on("click", updateAllProcesses.bind(this));
        shipping_payment_bc.on("click", updateAllProcesses.bind(this));
    }

    /**
     * @returns {Function}
     */
    getShippingFieldsUpdateCallback(): Function {
        let customerInfoSection: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let formElements: Array<FormElement> = customerInfoSection.getFormElementsByModule('cfw-shipping-info');
        let shippingFieldsInfo: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();

        return () => {
            formElements.forEach(formElement => TabContainer.genericUpdateShippingFieldsActionProcess(
                    formElement,
                    formElement.holder.jel.val(),
                    Main.instance.ajaxInfo,
                    shippingFieldsInfo.action,
                    shippingFieldsInfo.shipping_details_fields,
                    Main.instance.cart,
                    this,
                    this.getOrderDetails()
                ).load()
            );
        };
    }

    /**
     * @param fe
     * @param value
     * @param ajaxInfo
     * @param action
     * @param shippingDetailFields
     * @param cart
     * @param tabContainer
     * @param allFields
     */
    static genericUpdateShippingFieldsActionProcess(fe: FormElement,
                                                    value: any,
                                                    ajaxInfo: AjaxInfo,
                                                    action: string,
                                                    shippingDetailFields: Array<JQuery>,
                                                    cart: Cart,
                                                    tabContainer: TabContainer,
                                                    allFields: any): UpdateShippingFieldsAction
    {
        let type = fe.holder.jel.attr("field_key");
        let cdi: CustomerDataInfo = {field_type: type, field_value: value};

        return new UpdateShippingFieldsAction(action, ajaxInfo, [cdi], shippingDetailFields, cart, tabContainer, allFields);
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
        const CHECK = "paytrace_check_choice";
        const CARD = "paytrace_card_choice";

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

        // PayTrace Credit
        let paytrace_form_wraps = $("#paytrace-cards-form .form-row");

        $("#paytrace-cards-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        paytrace_form_wraps.each(function(index, elem) {
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

        let paytrace_check_form_wraps = $("#paytrace-checks-form .form-row");

        $("#paytrace-checks-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        paytrace_check_form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");

            if( $(elem).hasClass("form-row-wide") ) {
                $(elem).wrap("<div class='cfw-column-6'></div>")
            }

            if( $(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last") ) {
                $(elem).wrap("<div class='cfw-column-6'></div>")
            }
        });

        $(window).on('load', () => {
            // PayTrace gateway field state workaround
            let checked_radio: JQuery = $("input[type='radio'][name='paytrace_type_choice']:checked");
            checked_radio.trigger("change");

            jQuery(document.body).trigger('wc-credit-card-form-init');
        });
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

            new UpdateShippingMethodAction("update_shipping_method", ajaxInfo, shipMethodVal, cart, this.getFields()).load();
        };

        shipping_method.jel.find('#cfw-shipping-method input[type="radio"]').each((index, el) => {
            $(el).on("click", updateShippingMethod.bind(this));
        });
    }

    setUpdateCheckout() {
        let main: Main = Main.instance;

        $(document.body).on("update_checkout", () => {
            if(!main.updating) {
                main.updating = true;

                new UpdateCheckoutAction("update_checkout", main.ajaxInfo, this.getFields()).load();
            }
        });

        $(document.body).trigger( 'update_checkout' );
    }

    getFields(): any {
        let checkout_form: JQuery = $("form[name='checkout']");
        let $required_inputs = checkout_form.find( '.address-field.validate-required:visible' );
        let has_full_address: boolean = true;

        if ( $required_inputs.length ) {
            $required_inputs.each( function() {
                if ( $( this ).find( ':input' ).val() === '' ) {
                    has_full_address = false;
                }
            });
        }

        let details: any = this.getOrderDetails();
        let fields: any = {
            payment_method: details.payment_method,
            country: details.billing_country,
            state: details.billing_state,
            postcode: details.billing_postcode,
            city: details.billing_city,
            address: details.billing_address_1,
            address_2: details.billing_address_2,
            s_country: details.shipping_country,
            s_state: details.shipping_state,
            s_postcode: details.shipping_postcode,
            s_city: details.shipping_city,
            s_address: details.shipping_address_1,
            s_address_2: details.shipping_address_2,
            has_full_address: has_full_address,
            post_data: details.post_data,
            shipping_method: details["shipping_method[0]"]
        };

        return fields;
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
        let checkout_form: JQuery = $("form[name='checkout']");
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
            post_data: checkout_form.serialize()
        };

        let formArr: Array<Object> = checkout_form.serializeArray();
        formArr.forEach((item: any) => {
            if(!completeOrderCheckoutData[item.name]) {
                completeOrderCheckoutData[item.name] = item.value;
            }
        });

        if(account_password && account_password.length > 0) {
            completeOrderCheckoutData["account_password"] = account_password;
        }

        if($("#createaccount:checked").length > 0) {
            completeOrderCheckoutData["createaccount"] = 1;
        }

        if($("#wc-stripe-new-payment-method:checked").length > 0) {
            completeOrderCheckoutData["wc-stripe-new-payment-method"] = true;
        }

        if($("#terms").length > 0) {
            completeOrderCheckoutData["terms-field"] = 1;

            if($("#terms:checked").length > 0) {
                completeOrderCheckoutData["terms"] = "on";
            }
        }

        return completeOrderCheckoutData;
    }

    /**
     *
     */
    setTermsAndConditions(): void {
        const termsAndConditionsLinkClass: string = "woocommerce-terms-and-conditions-link";
        const termsAndConditionsContentClass: string = "woocommerce-terms-and-conditions";

        let termsAndConditionsLink: Element = new Element($(`.${termsAndConditionsLinkClass}`));
        let termsAndConditionsContent: Element = new Element($(`.${termsAndConditionsContentClass}`));

        termsAndConditionsLink.jel.on('click', (eventObject) => {
            eventObject.preventDefault();

            termsAndConditionsContent.jel.slideToggle(300);
        });
    }

    /**
     * @param {AjaxInfo} ajaxInfo
     */
    setCompleteOrderHandlers(ajaxInfo: AjaxInfo): void {
        let completeOrderButton: Element = new Element($("#cfw-complete-order-button"));

        completeOrderButton.jel.on('click', () => this.completeOrderClickListener(ajaxInfo));
    }

    /**
     *
     * @param {AjaxInfo} ajaxInfo
     */
    completeOrderClickListener(ajaxInfo: AjaxInfo): void {
        let isShippingDifferentFromBilling: boolean = $("#shipping_dif_from_billing:checked").length !== 0;

        ValidationService.createOrder(isShippingDifferentFromBilling, ajaxInfo, this.getOrderDetails());
    }

    /**
     * @param {AjaxInfo} ajaxInfo
     * @param {Cart} cart
     */
    setApplyCouponListener(ajaxInfo: AjaxInfo, cart: Cart) {
        $("#cfw-promo-code-btn").on('click', () => {
            new ApplyCouponAction('apply_coupon', ajaxInfo, $("#cfw-promo-code").val(), cart, this.getFields()).load();
        })
    }

    static togglePaymentFields(show: boolean) {
        let togglePaymentClass: string = "cfw-payment-false";
        let mainEl: JQuery = $("#cfw-content");

        if(show) {
            mainEl.removeClass(togglePaymentClass);
        } else if (!mainEl.hasClass(togglePaymentClass)) {
            mainEl.addClass(togglePaymentClass);
        }
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