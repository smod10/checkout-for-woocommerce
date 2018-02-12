import { Element }                          from "./Element";
import { TabContainerBreadcrumb }           from "./TabContainerBreadcrumb";
import { TabContainerSection }              from "./TabContainerSection";
import { InputLabelWrap }                   from "./InputLabelWrap";
import { AjaxInfo }                         from "../Types/Types";
import { AccountExistsAction }              from "../Actions/AccountExistsAction";
import { LoginAction }                      from "../Actions/LoginAction";
import { FormElement }                      from "./FormElement";
import { Main }                             from "../Main";
import { ValidationService }                from "../Services/ValidationService";
import { UpdateCheckoutAction }             from "../Actions/UpdateCheckoutAction";
import { UpdateShippingFieldsRI }           from "../Actions/UpdateCheckoutAction";
import { ApplyCouponAction }                from "../Actions/ApplyCouponAction";
import { InfoType }                         from "../Services/ParsleyService";
import { SelectLabelWrap }                  from "./SelectLabelWrap";
import { Alert }                            from "./Alert";
import { AlertInfo }                        from "./Alert";

declare let wc_address_i18n_params: any;
declare let wc_country_select_params: any;
declare let wc_stripe_params: any;

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
     * @type {MutationObserver}
     * @private
     */
    private _errorObserver: MutationObserver;

    /**
     * @type {any}
     * @private
     */
    private _checkoutDataAtSubmitClick: any;

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
     *
     */
    setAccountCheckListener() {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
        let ajax_info = Main.instance.ajaxInfo;

        if(email_input_wrap) {

            let email_input: JQuery = email_input_wrap.holder.jel;
            let reg_email: JQuery = $("#createaccount");

            // Handles page onload use case
            new AccountExistsAction("account_exists", ajax_info, email_input.val(), this.jel).load();

            let handler = () => new AccountExistsAction("account_exists", ajax_info, email_input.val(), this.jel).load();

            // Add check to keyup event
            email_input.on("keyup", handler);
            email_input.on("change", handler);
            reg_email.on('change', handler);

            // On page load check
            let onLoadAccCheck: AccountExistsAction = new AccountExistsAction("account_exists", ajax_info, email_input.val(), this.jel);
            onLoadAccCheck.load();
        }
    }

    /**
     *
     */
    setLogInListener() {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");

        if(email_input_wrap) {
            let email_input: JQuery = email_input_wrap.holder.jel;

            let password_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-password-wrap");
            let password_input: JQuery = password_input_wrap.holder.jel;

            let login_btn: JQuery = $("#cfw-login-btn");

            // Fire the login action on click
            login_btn.on("click", () => new LoginAction("login", Main.instance.ajaxInfo, email_input.val(), password_input.val()).load() );
        }
    }

    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     */
    setUpdateAllShippingFieldsListener() {
        let continueBtn: JQuery = $("#cfw-shipping-info-action .cfw-next-tab");
        let shipping_payment_bc: JQuery = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");

        continueBtn.on("click", () => $(document.body).trigger("update_checkout"));
        shipping_payment_bc.on("click", () => $(document.body).trigger("update_checkout"));
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

        // Authorize.net - AIM
        let authorizenet_aim_form_wraps = $("#wc-authorize-net-aim-credit-card-form .form-row");

        $("#wc-authorize-net-aim-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        authorizenet_aim_form_wraps.each(function(index, elem) {
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

        // Authorize.net - AIM
        let authorizenet_cim_form_wraps = $("#wc-authorize-net-cim-credit-card-credit-card-form .form-row");

        $("#wc-authorize-net-cim-credit-card-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        authorizenet_cim_form_wraps.each(function(index, elem) {
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

        // One Click Upsells - Stripe Form
        let ocu_stripe_form_wraps = $("#wc-ocustripe-cc-form .form-row");
        let ocu_stripe_container = $("#wc-ocustripe-cc-form");

        ocu_stripe_container.wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        ocu_stripe_container.find(".clear").remove();

        ocu_stripe_form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");

            if( $(elem).hasClass("form-row-wide") && $(elem).index() !== 0 ) {
                $(elem).wrap("<div class='cfw-column-6'></div>")
            } else if ( $(elem).hasClass("form-row-wide") && $(elem).index() === 0 ) {
                $(elem).wrap("<div class='cfw-column-12'></div>")
            }

            if($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-3'></div>")
            }
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

        let ship_to_different_address_radio_buttons: Array<Element> = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="ship_to_different_address"]');

        this.setRevealOnRadioButtonGroup(payment_radio_buttons);
        this.setRevealOnRadioButtonGroup(ship_to_different_address_radio_buttons, true);
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
     */
    setShippingPaymentUpdate(): void {
        let shipping_method: TabContainerSection = this.tabContainerSectionBy("name", "shipping_method");

        shipping_method.jel.find('#cfw-shipping-method input[type="radio"]').each((index, el) => {
            $(el).on("click", () => new UpdateCheckoutAction("update_checkout", Main.instance.ajaxInfo, this.getFormObject()).load());
        });
    }

    /**
     *
     */
    setUpdateCheckout() {
        let main: Main = Main.instance;

        $(document.body).on("update_checkout", () => {
            if(!main.updating) {
                main.updating = true;

                new UpdateCheckoutAction("update_checkout", main.ajaxInfo, this.getFormObject()).load();
            }
        });

        $(document.body).trigger( 'update_checkout' );
    }

    /**
     *  Handles localization information for countries and relevant states
     */
    setCountryChangeHandlers() {
        let shipping_country: JQuery = $("#shipping_country");
        let billing_country: JQuery = $("#billing_country");

        let shipping_postcode: JQuery = $("#shipping_postcode");
        let billing_postcode: JQuery = $("#billing_postcode");

        let shipping_state: JQuery = $("#shipping_state");
        let billing_state: JQuery = $("#billing_state");

        // When the country (shipping or billing) get's changed
        let country_change = (event) => {
            let target: JQuery = $(event.target);
            let target_country: string = target.val();
            let info_type: InfoType = <InfoType>target.attr("id").split("_")[0];
            let country_state_list = JSON.parse(wc_country_select_params.countries);
            let state_list_for_country = country_state_list[target_country];
            let locale_data = JSON.parse(wc_address_i18n_params.locale);

            $(`#${info_type}_state`).parsley().reset();

            // If there is a state list for the country and it actually has states in it. Handle the field generation
            if(state_list_for_country && Object.keys(state_list_for_country).length > 0) {
                this.handleFieldsIfStateListExistsForCountry(info_type, state_list_for_country, target_country);

                // If the state list is either undefined or empty fire here.
            } else {
                /**
                 * If the state list is undefined it means we need to reset everything to it's defaults and apply specific
                 * settings
                 */
                if(state_list_for_country === undefined) {
                    this.removeStateAndReplaceWithTextInput(locale_data[target_country], info_type);

                /**
                 * If there is a state list with nothing in it, we usually need to hide the state field.
                 */
                } else {
                    this.removeStateAndReplaceWithHiddenInput(locale_data[target_country], info_type);
                }
            }

            /**
             * After we have replaced and reset everything change the labels, required items, and placeholders
             */
            this.layoutDefaultLabelsAndRequirements(target_country, locale_data, info_type, wc_address_i18n_params.add2_text);

            $(`#${info_type}_state`).parsley().reset();

            // Re-register all the elements
            Main.instance.checkoutForm.parsley();

            $(document.body).trigger("update_checkout");
        };

        let locale_data = JSON.parse(wc_address_i18n_params.locale);

        this.layoutDefaultLabelsAndRequirements(shipping_country.val(), locale_data, "shipping", wc_address_i18n_params.add2_text);
        this.layoutDefaultLabelsAndRequirements(billing_country.val(), locale_data, "billing", wc_address_i18n_params.add2_text);

        shipping_country.on('change', country_change);
        billing_country.on('change', country_change);

        shipping_postcode.attr("data-parsley-state-and-zip", shipping_country.val());
        billing_postcode.attr("data-parsley-state-and-zip", billing_country.val());

        shipping_state.attr("data-parsley-state-and-zip", shipping_country.val());
        billing_state.attr("data-parsley-state-and-zip", billing_country.val());

        TabContainer.initStateMobileMargin();
    }

    /**
     * Add mobile margin removal for state if it doesn't exist on page load. Also removes down arrow if no select state.
     */
    static initStateMobileMargin(): void {
        let shipping_state_field: JQuery = $("#shipping_state_field");
        let billing_state_field: JQuery = $("#billing_state_field");

        [shipping_state_field, billing_state_field].forEach(field => {

            // If the field is hidden, remove the margin on mobile by adding the appropriate class.
            if(field.find("input[type='hidden']").length > 0) {
                TabContainer.addOrRemoveStateMarginForMobile("add", field.attr("id").split("_")[0]);
            }

            // While we are at it, let's remove the down arrow if no select is there
            if(field.find("input").length > 0) {
                field.addClass("remove-state-down-arrow");
            }
        });
    }

    /**
     * Adds or removes the margin class for mobile on state if it's hidden
     *
     * @param {"add" | "remove"} type
     * @param info_type
     */
    static addOrRemoveStateMarginForMobile(type: "add" | "remove", info_type) {
        let info_type_state_field = $(`#${info_type}_state_field`);
        let state_gone_wrap_class = "state-gone-margin";

        if(type === "remove") {
            info_type_state_field.removeClass(state_gone_wrap_class);
        }

        if(type === "add") {
            if(!info_type_state_field.hasClass(state_gone_wrap_class)) {
                info_type_state_field.addClass(state_gone_wrap_class);
            }
        }
    }

    /**
     * Sets up the default labels, required items, and placeholders for the country after it has been changed. It also
     * kicks off the overriding portion of the same task at the end.
     *
     * @param target_country
     * @param locale_data
     * @param info_type
     * @param add2_text
     */
    layoutDefaultLabelsAndRequirements(target_country, locale_data, info_type, add2_text): void {
        let default_postcode_data = locale_data.default.postcode;
        let default_state_data = locale_data.default.state;
        let default_city_data = locale_data.default.city;
        let default_add2_data = locale_data.default.address_2;

        let label_class = "cfw-input-label";
        let asterisk = ' <abbr class="required" title="required">*</abbr>';

        let $postcode = $(`#${info_type}_postcode`);
        let $state = $(`#${info_type}_state`);
        let $city = $(`#${info_type}_city`);
        let $address_2 = $(`#${info_type}_address_2`);

        let fields = [["postcode", $postcode], ["state", $state], ["city", $city], ["address_2", $address_2]];

        // Handle Address 2
        $address_2.attr("required", default_add2_data.required);
        $address_2.attr("placeholder", add2_text);
        $address_2.attr("autocomplete", default_add2_data.autocomplete);
        $address_2.siblings(`.${label_class}`).text(add2_text);

        // Handle Postcode
        $postcode.attr("required", default_postcode_data.required);
        $postcode.attr("placeholder", default_postcode_data.label);
        $postcode.attr("autocomplete", default_postcode_data.autocomplete);
        $postcode.siblings(`.${label_class}`).text(default_postcode_data.label);

        if(default_postcode_data.required == true) {
            $postcode.siblings(`.${label_class}`).append(asterisk);
        }

        $state.attr("required", default_state_data.required);
        $state.attr("placeholder", default_state_data.label);
        $state.attr("autocomplete", default_state_data.autocomplete);
        $state.siblings(`.${label_class}`).text(default_state_data.label);

        if(default_state_data.required == true) {
            $state.siblings(`.${label_class}`).append(asterisk);
        }

        $city.attr("required", default_city_data.required);
        $city.attr("placeholder", default_city_data.label);
        $city.attr("autocomplete", default_city_data.autocomplete);
        $city.siblings(`.${label_class}`).text(default_city_data.label);

        if(default_city_data.required == true) {
            $city.siblings(`.${label_class}`).append(asterisk);
        }

        this.findAndApplyDifferentLabelsAndRequirements(fields, asterisk, locale_data[target_country], label_class, locale_data);
    }

    /**
     * This function is for override the defaults if the specified country has more information for the labels,
     * placeholders, and required items
     *
     * @param fields
     * @param asterisk
     * @param locale_data_for_country
     * @param label_class
     * @param locale_data
     */
    findAndApplyDifferentLabelsAndRequirements(fields, asterisk, locale_data_for_country, label_class, locale_data) {
        let default_lookup = locale_data.default;
        let add2_text = locale_data.add2_text;

        fields.forEach(field_pair => {
            let field_name = field_pair[0];
            let field = field_pair[1];

            /**
             * If the locale data for the country exists and it has a length of greater than 0 we can override the
             * defaults
             */
            if(locale_data_for_country !== undefined && Object.keys(locale_data_for_country).length > 0) {

                /**
                 * If the field name exists on the locale for the country precede on overwriting the defaults.
                 */
                if(locale_data_for_country[field_name] !== undefined) {
                    let locale_data_for_field = locale_data_for_country[field_name];
                    let defaultItem = default_lookup[field_name];
                    let label: string = "";

                    /**
                     * If the field is the address_2 it doesn't use label it uses placeholder for some reason. So what
                     * we do here is simply assign the placeholder to the label if it's address_2
                     */
                    if(field_name == "address_2") {
                        label = add2_text;
                    } else {
                        label = locale_data_for_field.label;
                    }

                    let field_siblings = field.siblings(`.${label_class}`);

                    /**
                     * If the label for the locale isn't undefined. we need to set the placeholder and the label
                     */
                    if(label !== undefined) {
                        field.attr("placeholder", locale_data_for_field.label);
                        field_siblings.html(locale_data_for_field.label);

                    /**
                     * Otherwise we reset the defaults here for good measure. The field address_2 needs to have it's
                     * label be set as the placeholder (because it doesn't use label for some reason)
                     */
                    } else {
                        if(field_name == "address_2") {
                            field.attr("placeholder", add2_text);
                            field_siblings.html(add2_text);

                        /**
                         * If we aren't acdress_2 we can simply procede as normal and set the label for both the
                         * placeholder and the label.
                         */
                        } else {
                            field.attr("placeholder", defaultItem.label);
                            field_siblings.html(defaultItem.label);
                        }
                    }

                    /**
                     * If the locale data for this field is not undefined and is true go ahead and set it's required
                     * attribute to true, and append the asterisk to the label
                     */
                    if(locale_data_for_field.required !== undefined && locale_data_for_field.required == true) {
                        field.attr("required", true);
                        field_siblings.append(asterisk);

                    /**
                     * If the field is not required, go ahead and set it's required attribute to false
                     */
                    } else if (locale_data_for_field.required == false) {
                        field.attr("required", false);

                    /**
                     * Lastly if the field is undefined we need to revert back to the default (maybe we do?)
                     *
                     * TODO: Possibly refactor a lot of these default settings in this function. We may not have to do it.
                     */
                    } else {
                        field.attr("required", defaultItem.required);

                        // If the default item is required, append the asterisk.
                        if(defaultItem.required == true) {
                            field_siblings.append(asterisk);
                        }
                    }
                }
            }
        })
    }

    /**
     *
     * @param country_display_data
     * @param info_type
     */
    removeStateAndReplaceWithTextInput(country_display_data, info_type) {
        let current_state_field = $(`#${info_type}_state`);
        let state_element_wrap: JQuery = current_state_field.parents(".cfw-input-wrap");
        let group: string = info_type;
        let tab_section: TabContainerSection = Main.instance
            .tabContainer
            .tabContainerSectionBy("name", (info_type === "shipping") ? "customer_info" : "payment_method");

        // Remove old element
        current_state_field.remove();


        // Append and amend new element
        state_element_wrap.append(`<input type="text" id="${info_type}_state" value="" />`);
        state_element_wrap.removeClass("cfw-select-input");
        state_element_wrap.addClass("cfw-text-input");
        state_element_wrap.removeClass("cfw-floating-label");

        // Get reference to new element
        let new_state_input = $(`#${info_type}_state`);

        // Amend new element further
        new_state_input.attr("field_key", "state")
            .attr("data-parsley-validate-if-empty", "")
            .attr("data-parsley-trigger", "keyup change focusout")
            .attr("data-parsley-group", group)
            .attr("data-parsley-required", 'true');

        tab_section.selectLabelWraps.forEach((select_label_wrap, index) => {
            if(select_label_wrap.jel.is(state_element_wrap)) {
                tab_section.selectLabelWraps.splice(index, 1);
            }
        });

        tab_section.inputLabelWraps.push(new InputLabelWrap(state_element_wrap));

        TabContainer.addOrRemoveStateMarginForMobile("remove", info_type);
    }

    /**
     *
     * @param country_display_data
     * @param info_type
     */
    removeStateAndReplaceWithHiddenInput(country_display_data, info_type) {
        let current_state_field: JQuery = $(`#${info_type}_state`);
        let state_element_wrap: JQuery = current_state_field.parents(".cfw-input-wrap");

        current_state_field.remove();

        if(country_display_data && Object.keys(country_display_data).length > 0) {
            let is_required: boolean = country_display_data["state"]["required"] === "true";

            if(!is_required) {
                state_element_wrap.removeClass("cfw-select-input");
                state_element_wrap.removeClass("cfw-text-input");
                state_element_wrap.removeClass("cfw-floating-label");

                state_element_wrap.append(`<input type="hidden" id="${info_type}_state" field_key="state" />`);

                TabContainer.addOrRemoveStateMarginForMobile("add", info_type);
            }
        }
    }

    /**
     * Removes the state input field and appends a select element for the state field. Returns a JQuery reference to the
     * newly created select element
     *
     * @param {JQuery} state_input
     * @param info_type
     * @returns {JQuery}
     */
    removeInputAndAddSelect(state_input: JQuery, info_type): JQuery {
        let id: string = state_input.attr("id");
        let classes: string = state_input.attr("class");
        let group: string = state_input.data("parsleyGroup");
        let tab_section: TabContainerSection = Main.instance
            .tabContainer
            .tabContainerSectionBy("name", (info_type === "shipping") ? "customer_info" : "payment_method");
        let state_input_wrap = state_input.parent(".cfw-input-wrap");

        if(state_input) {
            // Remove the old input
            state_input.remove();
        }

        // Add the new input base (select field)
        state_input_wrap.append(`<select id="${id}"></select>`);
        state_input_wrap.removeClass("cfw-text-input");
        state_input_wrap.addClass("cfw-select-input");

        // Set the selects properties
        let new_state_input = $(`#${id}`);

        new_state_input.attr("field_key", "state")
            .attr("class", classes)
            .attr("data-parsley-validate-if-empty", "")
            .attr("data-parsley-trigger", "keyup change focusout")
            .attr("data-parsley-group", group)
            .attr("data-parsley-required", 'true');

        // Re-register all the elements
        Main.instance.checkoutForm.parsley();

        tab_section.inputLabelWraps.forEach((input_label_wrap, index) => {
            if(input_label_wrap.jel.is(state_input_wrap)) {
                tab_section.inputLabelWraps.splice(index, 1);
            }
        });

        tab_section.selectLabelWraps.push(new SelectLabelWrap(state_input_wrap));

        return new_state_input;
    }

    /**
     * Given the current state element, if the state element is an input remove it and create the appropriate select
     * element. Once there is a guaranteed select go ahead and populate it with the state list.
     *
     * @param info_type
     * @param state_list_for_country
     * @param target_country
     */
    handleFieldsIfStateListExistsForCountry(info_type, state_list_for_country, target_country): void {
        // Get the current state handler field (either a select or input)
        let current_state_field = $(`#${info_type}_state`);
        let current_state_field_wrap = $(`#${info_type}_state_field`);
        let current_zip_field = $(`#${info_type}_postcode`)

        current_state_field_wrap.removeClass("remove-state-down-arrow");

        TabContainer.addOrRemoveStateMarginForMobile("remove", info_type);

        // If the current state handler is an input field, we need to change it to a select
        if (current_state_field.is('input')) {
            current_state_field = this.removeInputAndAddSelect(current_state_field, info_type);
        }

        // Now that the state field is guaranteed to be a select, we need to populate it.
        this.populateStates(current_state_field, state_list_for_country);
        this.setCountryOnZipAndState(current_zip_field, current_state_field, target_country);
    }

    /**
     *
     * @param {JQuery} postcode
     * @param {JQuery} state
     * @param country
     */
    setCountryOnZipAndState(postcode: JQuery, state: JQuery, country) {
        postcode.attr("data-parsley-state-and-zip", country);
        state.attr("data-parsley-state-and-zip", country);
    }

    /**
     * Given a state select field, populate it with the given list
     *
     * @param select
     * @param state_list
     */
    populateStates(select, state_list) {
        if(select.is("select")) {
            select.empty();

            select.append(`<option value="">Select a state...</option>`);

            Object.getOwnPropertyNames(state_list)
                .forEach(state => select.append(`<option value="${state}">${state_list[state]}</option>}`));

            select.parents(".cfw-input-wrap").removeClass("cfw-floating-label");
        }
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
    getFormObject() {
        let main: Main = Main.instance;
        let checkout_form: JQuery = main.checkoutForm;
        let ship_to_different_address = parseInt($("[name='ship_to_different_address']:checked").val());
        let $required_inputs = checkout_form.find( '.address-field.validate-required:visible' );
        let has_full_address: boolean = true;
        let lookFor: Array<string> = main.settings.default_address_fields;

        let formData = {
            post_data: checkout_form.serialize()
        };

        if ( $required_inputs.length ) {
            $required_inputs.each( function() {
                if ( $( this ).find( ':input' ).val() === '' ) {
                    has_full_address = false;
                }
            });
        }

        let formArr: Array<Object> = checkout_form.serializeArray();
        formArr.forEach((item: any) => formData[item.name] = item.value);

        formData["has_full_address"] = has_full_address;
        formData["ship_to_different_address"] = ship_to_different_address;

        if(ship_to_different_address === 0) {
            lookFor.forEach(field => {
                if($(`#billing_${field}`).length > 0) {
                    formData[`billing_${field}`] = formData[`shipping_${field}`];
                }
            });
        }

        return formData;
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
     *
     */
    setCompleteOrderHandlers(): void {
        let checkout_form: JQuery = Main.instance.checkoutForm;
        let completeOrderButton: Element = new Element($("#place_order"));

        checkout_form.on('submit', this.completeOrderSubmitHandler.bind(this));
        completeOrderButton.jel.on('click', this.completeOrderClickHandler.bind(this));
    }

    /**
     *
     */
    completeOrderSubmitHandler(e) {
        let main: Main = Main.instance;
        let checkout_form: JQuery = Main.instance.checkoutForm;
        let preSwapData = this.checkoutDataAtSubmitClick;

        // Prevent any weirdness by preventing default
        e.preventDefault();

        // If all the payment stuff has finished any ajax calls, run the complete order.
        if ( checkout_form.triggerHandler( 'checkout_place_order' ) !== false && checkout_form.triggerHandler( 'checkout_place_order_' + checkout_form.find( 'input[name="payment_method"]:checked' ).val() ) !== false ) {

            // Reset data
            for ( let field in preSwapData ) {
                let billing = $(`#billing_${field}`);

                billing.val(preSwapData[field]);
            }

            if ( this.errorObserver ) {
                this.errorObserver.disconnect();
            }

            this.orderKickOff(main.ajaxInfo, this.getFormObject());
        }
    }

    /**
     *
     */
    completeOrderClickHandler() {
        let main: Main = Main.instance;
        let checkout_form: JQuery = main.checkoutForm;
        let lookFor: Array<string> = main.settings.default_address_fields;
        let preSwapData = this.checkoutDataAtSubmitClick = {};

        Main.addOverlay();

        if ( parseInt(checkout_form.find('input[name="ship_to_different_address"]:checked').val()) === 0 ) {
            lookFor.forEach( field => {
                let billing = $(`#billing_${field}`);
                let shipping = $(`#shipping_${field}`);

                if(billing.length > 0) {
                    preSwapData[field] = billing.val();

                    billing.val(shipping.val());
                    billing.trigger("keyup");
                }
            });
        }

        // Select the node that will be observed for mutations
        let targetNode = checkout_form[0];

        // Options for the observer (which mutations to observe)
        let config = { childList: true, characterData: true, subtree: true };

        if ( ! this.errorObserver ) {
            // Create an observer instance linked to the callback function
            let observer = new MutationObserver(this.submitOrderErrorMutationListener);

            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);

            this.errorObserver = observer;
        }

        checkout_form.trigger('submit');
    }

    /**
     * @param mutationsList
     */
    submitOrderErrorMutationListener(mutationsList) {
        let main: Main = Main.instance;

        for ( let mutation of mutationsList ) {
            if(mutation.type === "childList") {
                let addedNodes = mutation.addedNodes;
                let $errorNode: JQuery = null;

                addedNodes.forEach(node => {
                    let $node: JQuery = $(node);
                    let hasClass: boolean = $node.hasClass("woocommerce-error");
                    let hasGroupCheckoutClass: boolean = $node.hasClass("woocommerce-NoticeGroup-checkout");

                    if ( hasClass || hasGroupCheckoutClass ) {
                        Main.removeOverlay();
                        $errorNode = $node;
                        $errorNode.attr("class", "");
                    }
                });

                if($errorNode) {
                    let alertInfo: AlertInfo = {
                        type: "CFWSubmitError",
                        message: $errorNode,
                        cssClass: "cfw-alert-danger"
                    };

                    let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
                    alert.addAlert();

                    if(this.errorObserver) {
                        this.errorObserver.disconnect();
                        this.errorObserver = null;
                    }
                }
            }
        }
    }

    /**
     *
     * @param {AjaxInfo} ajaxInfo
     * @param data
     */
    orderKickOff(ajaxInfo: AjaxInfo, data): void {
        let isShippingDifferentFromBilling: boolean = $("#shipping_dif_from_billing:checked").length !== 0;

        ValidationService.createOrder(isShippingDifferentFromBilling, ajaxInfo, data);
    }

    /**
     *
     */
    setApplyCouponListener() {
        $("#cfw-promo-code-btn").on('click', () => {
            let coupon_field: JQuery = $("#cfw-promo-code");

            if(coupon_field.val() !== "") {
                new ApplyCouponAction('apply_coupon', Main.instance.ajaxInfo, coupon_field.val(), Main.instance.cart, this.getFormObject()).load();
            } else {
                // Remove alerts
                Alert.removeAlerts();
            }
        })
    }

    /**
     * @param {boolean} show
     */
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
        this.jel.easytabs({
            defaultTab: "li.tab#default-tab",
            tabs: "ul > li.tab"
        });
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

    /**
     * @returns {MutationObserver}
     */
    get errorObserver(): MutationObserver {
        return this._errorObserver;
    }

    /**
     * @param {MutationObserver} value
     */
    set errorObserver(value: MutationObserver) {
        this._errorObserver = value;
    }

    /**
     * @returns {any}
     */
    get checkoutDataAtSubmitClick(): any {
        return this._checkoutDataAtSubmitClick;
    }

    /**
     * @param value
     */
    set checkoutDataAtSubmitClick(value: any) {
        this._checkoutDataAtSubmitClick = value;
    }
}