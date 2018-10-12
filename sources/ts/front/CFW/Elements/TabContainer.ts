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
import { Alert }                            from "./Alert";
import { AlertInfo }                        from "./Alert";

declare let wc_stripe_params: any;
declare let $: any;

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
    constructor(jel: any, tabContainerBreadcrumb: TabContainerBreadcrumb, tabContainerSections: Array<TabContainerSection>) {
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
            let email_input: any = email_input_wrap.holder.jel;

            let handler = () => new AccountExistsAction("account_exists", ajax_info, email_input.val(), this.jel).load();

            // Add check to keyup event
            email_input.on("keyup", handler);
            email_input.on("change", handler);

            // Handles page onload use case
            new AccountExistsAction("account_exists", ajax_info, email_input.val(), this.jel).load();
        }
    }

    /**
     *
     */
    setLogInListener() {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");

        if(email_input_wrap) {
            let email_input: any = email_input_wrap.holder.jel;

            let password_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-password-wrap");
            let password_input: any = password_input_wrap.holder.jel;

            let login_btn: any = $("#cfw-login-btn");

            // Fire the login action on click
            login_btn.on("click", () => new LoginAction("login", Main.instance.ajaxInfo, email_input.val(), password_input.val()).load() );
        }
    }

    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     */
    setUpdateAllShippingFieldsListener() {
        let continueBtn: any = $("#cfw-shipping-info-action .cfw-next-tab");
        let shipping_payment_bc: any = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");

        continueBtn.on("click", () => $(document.body).trigger("update_checkout"));
        shipping_payment_bc.on("click", () => $(document.body).trigger("update_checkout"));
    }

    /**
     *
     */
    setUpCreditCardRadioReveal() {
        let stripe_container: any = $(".payment_method_stripe");

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
        // TODO: Once Compatibility class is setup move each of these pieces to it's relevant class
        const CHECK = "paytrace_check_choice";
        const CARD = "paytrace_card_choice";

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
            let checked_radio: any = $("input[type='radio'][name='paytrace_type_choice']:checked");
            checked_radio.trigger("change");

            $(document.body).trigger('wc-credit-card-form-init');
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

        // FirstData - PayEezy
        let firstdata_payeezy_form_wraps = $("#wc-first-data-payeezy-gateway-credit-card-credit-card-form .form-row");

        $("#wc-first-data-payeezy-gateway-credit-card-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        firstdata_payeezy_form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label[for!='wc-first-data-payeezy-gateway-credit-card-tokenize-payment-method']").addClass("cfw-input-label");
            $(elem).find("input").not(':checkbox').css("width", "100%");

            $(elem).wrap("<div class='cfw-column-12 pad-bottom'></div>");
        });

        // First Data - Global Gateway
        let firstdata_global_form_wraps = $("#wc-first-data-global-gateway-credit-card-form .form-row");

        $("#wc-first-data-global-gateway-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        firstdata_global_form_wraps.each(function(index, elem) {
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

        // First Data - Payeezy JS
        let firstdata_payeezyjs_form_wraps = $("#wc-first-data-payeezy-credit-card-credit-card-form .form-row");

        $("#wc-first-data-payeezy-credit-card-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        firstdata_payeezyjs_form_wraps.each(function(index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label[for!='wc-first-data-payeezy-credit-card-tokenize-payment-method']").addClass("cfw-input-label");
            $(elem).find("input").not(':checkbox').css("width", "100%");

            $(elem).wrap("<div class='cfw-column-12 pad-bottom'></div>");
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
                    let input: any = $(elem).find("input");
                    let select: any = $(elem).find("select");
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

        shipping_method.jel.find('#cfw-shipping-method-list input[type="radio"]').each((index, el) => {
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
     *
     */
    setShippingFieldsOnLoad(): void {
        let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
        let form_elements: Array<FormElement> = customer_info.getFormElementsByModule('cfw-shipping-info');
        let staticShippingFields: UpdateShippingFieldsRI = this.getUpdateShippingRequiredItems();

        form_elements.forEach((formElement: FormElement) => {
            let feFieldKey: string = formElement.holder.jel.attr("field_key");
            let feFieldValue: string = formElement.holder.jel.val();

            let match: any = staticShippingFields.shipping_details_fields.find((sdf: any) => sdf.attr("field_type") == feFieldKey);

            match.children(".field_value").text(feFieldValue);
        })
    }

    /**
     *
     */
    setUpMobileCartDetailsReveal(): void {
        let showCartDetails: Element = new Element($("#cfw-show-cart-details"));
        showCartDetails.jel.on('click tap', () => {
            $("#cfw-cart-details-collapse-wrap").slideToggle(300).parent().toggleClass("active")
        });

        $(window).on('resize', () => {
            if(window.innerWidth >= 767) {
                $("#cfw-cart-details-collapse-wrap").css('display', 'block');
                $("#cfw-cart-details").removeClass('active');
            }
        });

        if(window.innerWidth >= 767) {
            $("#cfw-cart-details-collapse-wrap").css('display', 'block');
        } else {
            $("#cfw-cart-details-collapse-wrap").css('display', 'none');
        }
    }

    /**
     * @returns {{}}
     */
    getFormObject() {
        let main: Main = Main.instance;
        let checkout_form: any = main.checkoutForm;
        let ship_to_different_address = parseInt( <string>$("[name='ship_to_different_address']:checked").val() );
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
        let checkout_form: any = Main.instance.checkoutForm;
        let completeOrderButton: Element = new Element($("#place_order"));

        checkout_form.on('submit', this.completeOrderSubmitHandler.bind(this));
        completeOrderButton.jel.on('click', this.completeOrderClickHandler.bind(this));
    }

    /**
     *
     */
    completeOrderSubmitHandler(e) {
        let main: Main = Main.instance;
        let checkout_form: any = Main.instance.checkoutForm;
        let preSwapData = this.checkoutDataAtSubmitClick;
        console.log("Form Submit Triggered");

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

            console.log("About to call orderKickOff");
            this.orderKickOff(main.ajaxInfo, this.getFormObject());
        }
    }

    /**
     *
     */
    completeOrderClickHandler() {
        let main: Main = Main.instance;
        let checkout_form: any = main.checkoutForm;
        let lookFor: Array<string> = main.settings.default_address_fields;
        let preSwapData = this.checkoutDataAtSubmitClick = {};

        Main.addOverlay();

		checkout_form.find(".woocommerce-error").remove();

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
            let observer = new MutationObserver(this.submitOrderErrorMutationListener.bind(this));

            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);

            console.log("Created Observer");
            this.errorObserver = observer;
        }

        console.log("Next move is trigger form submit", checkout_form);
        checkout_form.trigger('submit');
    }

    /**
     * @param mutationsList
     */
    submitOrderErrorMutationListener(mutationsList) {
        for ( let mutation of mutationsList ) {
            if(mutation.type === "childList") {
                let addedNodes = mutation.addedNodes;
                let $errorNode: any = null;

                addedNodes.forEach(node => {
                    let $node: any = $(node);
                    let hasClass: boolean = $node.hasClass("woocommerce-error");
                    let hasGroupCheckoutClass: boolean = $node.hasClass("woocommerce-NoticeGroup-checkout");

                    if ( hasClass || hasGroupCheckoutClass ) {
                        Main.removeOverlay();
                        console.log("Removed Overlay");
                        $errorNode = $node;
                        $errorNode.attr("class", "");
                    }
                });

                if($errorNode) {
					console.log("error node", $errorNode);
                    let alertInfo: AlertInfo = {
                        type: "CFWSubmitError",
                        message: $errorNode,
                        cssClass: "cfw-alert-danger"
                    };

                    let alert: Alert = new Alert(Main.instance.alertContainer, alertInfo);
                    alert.addAlert();
                }

                if(this.errorObserver !== undefined && this.errorObserver !== null) {
                    this.errorObserver.disconnect();
                    this.errorObserver = null;
                    console.log("Disconnected Observer");
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
            let coupon_field: any = $("#cfw-promo-code");

            if(coupon_field.val() !== "") {
                new ApplyCouponAction('cfw_apply_coupon', Main.instance.ajaxInfo, coupon_field.val(), Main.instance.cart, this.getFormObject()).load();
            } else {
                // Remove alerts
                Alert.removeAlerts(Main.instance.alertContainer);
            }
        })
    }

    /**
     * @returns {UpdateShippingFieldsRI}
     */
    getUpdateShippingRequiredItems(): UpdateShippingFieldsRI {
        let sdf_any_results: any = $("#cfw-shipping-details-fields .cfw-shipping-details-field");
        let shipping_details_fields: Array<any> = [];
        let action: string = "update_shipping_fields";

        sdf_any_results.each((index, val) => { shipping_details_fields.push($(val)) });

        return <UpdateShippingFieldsRI>{
            action: action,
            shipping_details_fields: shipping_details_fields
        }
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