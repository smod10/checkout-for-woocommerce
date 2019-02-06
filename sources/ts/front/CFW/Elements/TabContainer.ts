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
import { Alert, AlertInfo}                  from "./Alert";
import { CompleteOrderAction }              from "../Actions/CompleteOrderAction";
import { UpdatePaymentMethod }              from "../Actions/UpdatePaymentMethod";

declare let jQuery: any;
declare let woocommerce_params: any;

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
        jQuery(".garlic-auto-save").each((index: number, elem) => {
            jQuery(elem).garlic({ onRetrieve: element => jQuery(element).parent().addClass(FormElement.labelClass) })
        });
    }
    /**
     *
     */
    setAccountCheckListener() {
        if ( woocommerce_params.enable_checkout_login_reminder == 1 ) {
            let customer_info: TabContainerSection = this.tabContainerSectionBy("name", "customer_info");
            let email_input_wrap: InputLabelWrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
            let ajax_info = Main.instance.ajaxInfo;

            if ( email_input_wrap ) {
                let email_input: any = email_input_wrap.holder.jel;

                let handler = () => new AccountExistsAction("account_exists", ajax_info, email_input.val(), this.jel).load();

                // Add check to keyup event
                email_input.on("keyup", handler);
                email_input.on("change", handler);

                // Handles page onload use case
                new AccountExistsAction("account_exists", ajax_info, email_input.val(), this.jel).load();
            }
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

            let login_btn: any = jQuery("#cfw-login-btn");

            // Fire the login action on click
            login_btn.on("click", () => new LoginAction("login", Main.instance.ajaxInfo, email_input.val(), password_input.val()).load() );
        }
    }

    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     */
    setUpdateAllShippingFieldsListener() {
        let continueBtn: any = jQuery("#cfw-shipping-info-action .cfw-next-tab");
        let shipping_payment_bc: any = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");

        continueBtn.on("click", () => jQuery(document.body).trigger("update_checkout"));
        shipping_payment_bc.on("click", () => jQuery(document.body).trigger("update_checkout"));
    }

    /**
     *
     */
    setUpCreditCardRadioReveal() {
        let stripe_container: any = jQuery(".payment_method_stripe");

        if(stripe_container.length > 0) {
            let stripe_options = stripe_container.find('input[type="radio"][name="wc-stripe-payment-token"]');
            stripe_options.each((index: number, elem: HTMLElement) => {
                if(jQuery(elem).attr("id") == "wc-stripe-payment-token-new") {
                    jQuery(elem).on('click', () => {
                        jQuery("#wc-stripe-cc-form").slideDown(300);
                        jQuery(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                        jQuery(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                    });

                    jQuery(window).on('load updated_checkout', () => {
                        if(jQuery(elem).is(":checked")) {
                            jQuery("#wc-stripe-cc-form").slideDown(300);
                            jQuery(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                            jQuery(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                        }
                    });
                } else {
                    jQuery(elem).on('click', () => {
                        jQuery("#wc-stripe-cc-form").slideUp(300);
                        jQuery(".woocommerce-SavedPaymentMethods-saveNew").slideUp(300);
                        jQuery(".wc-saved-payment-methods").addClass("kill-bottom-margin");

                    });

                    jQuery(window).on('load updated_checkout', () => {
                        if(jQuery(elem).is(":checked")) {
                            jQuery(".wc-saved-payment-methods").addClass("kill-bottom-margin");
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
        let paytrace_form_wraps = jQuery("#paytrace-cards-form .form-row");

        jQuery("#paytrace-cards-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        paytrace_form_wraps.each(function(index, elem) {
            jQuery(elem).addClass("cfw-input-wrap");
            jQuery(elem).addClass("cfw-text-input");
            jQuery(elem).find("label").addClass("cfw-input-label");
            jQuery(elem).find("input").css("width", "100%");

            if( jQuery(elem).hasClass("form-row-wide") ) {
                jQuery(elem).wrap("<div class='cfw-column-6'></div>")
            }

            if( jQuery(elem).hasClass("form-row-first") || jQuery(elem).hasClass("form-row-last") ) {
                jQuery(elem).wrap("<div class='cfw-column-3'></div>")
            }
        });

        let paytrace_check_form_wraps = jQuery("#paytrace-checks-form .form-row");

        jQuery("#paytrace-checks-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");

        paytrace_check_form_wraps.each(function(index, elem) {
            jQuery(elem).addClass("cfw-input-wrap");
            jQuery(elem).addClass("cfw-text-input");
            jQuery(elem).find("label").addClass("cfw-input-label");
            jQuery(elem).find("input").css("width", "100%");

            if( jQuery(elem).hasClass("form-row-wide") ) {
                jQuery(elem).wrap("<div class='cfw-column-6'></div>")
            }

            if( jQuery(elem).hasClass("form-row-first") || jQuery(elem).hasClass("form-row-last") ) {
                jQuery(elem).wrap("<div class='cfw-column-6'></div>")
            }
        });

        jQuery(window).on('load', () => {
            // PayTrace gateway field state workaround
            let checked_radio: any = jQuery("input[type='radio'][name='paytrace_type_choice']:checked");
            checked_radio.trigger("change");

            jQuery(document.body).trigger('wc-credit-card-form-init');
        });

        // One Click Upsells - Stripe Form
        let ocu_stripe_form_wraps = jQuery("#wc-ocustripe-cc-form .form-row");
        let ocu_stripe_container = jQuery("#wc-ocustripe-cc-form");

        ocu_stripe_container.wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        ocu_stripe_container.find(".clear").remove();

        ocu_stripe_form_wraps.each(function(index, elem) {
            jQuery(elem).addClass("cfw-input-wrap");
            jQuery(elem).addClass("cfw-text-input");
            jQuery(elem).find("label").addClass("cfw-input-label");
            jQuery(elem).find("input").css("width", "100%");

            if( jQuery(elem).hasClass("form-row-wide") && jQuery(elem).index() !== 0 ) {
                jQuery(elem).wrap("<div class='cfw-column-6'></div>")
            } else if ( jQuery(elem).hasClass("form-row-wide") && jQuery(elem).index() === 0 ) {
                jQuery(elem).wrap("<div class='cfw-column-12'></div>")
            }

            if(jQuery(elem).hasClass("form-row-first") || jQuery(elem).hasClass("form-row-last")) {
                jQuery(elem).wrap("<div class='cfw-column-3'></div>")
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
        this.setRevealOnRadioButtonGroup(ship_to_different_address_radio_buttons, [this.toggleRequiredInputAttribute]);
    }

    /**
     * Handles the payment method revealing and registering the click events.
     */
    setRevealOnRadioButtonGroup(radio_buttons: Array<Element>, callbacks: Array<(radio_button: Element) => void> = []) {
        // Register the slide up and down container on click
        radio_buttons
            .forEach((radio_button: Element) => {
                let $radio_button = radio_button.jel;

                // On payment radio button click....
                $radio_button.on('click', () => {
                    this.toggleRadioButtonContainers(radio_button, radio_buttons, callbacks);
                });

                // Fire it once for page load if selected
                // Also fire on updated_checkout
                jQuery(window).on('load updated_checkout', () => {
                    if($radio_button.is(":checked")) {
                        this.toggleRadioButtonContainers(radio_button, radio_buttons, callbacks);
                    }
                });
            });
    }

    toggleRadioButtonContainers(radio_button: Element, radio_buttons: Array<Element>, callbacks: Array<(radio_button: Element) => void>) {
        // Filter out the current radio button
        // Slide up the other containers
        radio_buttons
            .filter((filterItem: Element) => filterItem != radio_button)
            .forEach((other: Element) => {
                other.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").find(':input').prop('disabled', true);
                other.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideUp(300);
            } );

        // Slide down our container
        radio_button.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").find(':input').prop('disabled', false);
        radio_button.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").not(':visible').slideDown(300);

        // Fire any callbacks
        callbacks.forEach(callback => callback(radio_button));
    }

    toggleRequiredInputAttribute(radio_button: Element) {
        const selected_radio_value = radio_button.jel.val();
        const shipping_dif_than_billing = "different_from_shipping";
        const billing_selected = selected_radio_value === shipping_dif_than_billing;
        const placeholder_attribute = 'cfw-required-placeholder';
        const required_attribute = 'required';
        const attribute_value = '';
        const input_wraps = jQuery('#cfw-billing-fields-container').find('.cfw-input-wrap');

        let toggleRequired = (item, {search, replace, value}) => {
            if(item.hasAttribute(search)) {
                item.setAttribute(replace, value);
                item.removeAttribute(search);
            }
        };

        input_wraps.each((index, elem) => {
            let items = jQuery(elem).find('input, select');

            items.each((index, item) => {

                let attributes_data = {
                    search: billing_selected ? placeholder_attribute : required_attribute,
                    replace: billing_selected ? required_attribute : placeholder_attribute,
                    value: attribute_value
                };

                toggleRequired(item, attributes_data);
            })
        });
    }

    /**
     *
     */
    setShippingMethodUpdate(): void {
        jQuery('input[name^="shipping_method"][type="radio"]').each((index, el) => {
            jQuery(el).on("click", () => new UpdateCheckoutAction("update_checkout", Main.instance.ajaxInfo, this.getFormObject()).load());
        });
    }

    /**
     *
     */
    setPaymentMethodUpdate(): void {
        jQuery(document.body).on('click', 'input[name^="payment_method"][type="radio"]', function() {
            new UpdatePaymentMethod("update_payment_method", Main.instance.ajaxInfo, jQuery(this).val() ).load();
        });
    }

    /**
     *
     */
    setUpdateCheckout() {
        let main: Main = Main.instance;

        jQuery(document.body).on("update_checkout", () => {
            if(!main.updating) {
                main.updating = true;

                new UpdateCheckoutAction("update_checkout", main.ajaxInfo, this.getFormObject()).load();
            }
        });

        if(!CompleteOrderAction.initCompleteOrder) {
			jQuery(document.body).trigger('update_checkout');
		}
    }

    /**
     *
     */
    setUpMobileCartDetailsReveal(): void {
        let showCartDetails: Element = new Element(jQuery("#cfw-show-cart-details"));
        showCartDetails.jel.on('click tap', () => {
            jQuery("#cfw-cart-details-collapse-wrap").slideToggle(300).parent().toggleClass("active")
        });

        jQuery(window).on('resize', () => {
            if(window.innerWidth >= 770) {
                jQuery("#cfw-cart-details-collapse-wrap").css('display', 'block');
                jQuery("#cfw-cart-details").removeClass('active');
            }
        });

        if(window.innerWidth >= 770) {
            jQuery("#cfw-cart-details-collapse-wrap").css('display', 'block');
        } else {
            jQuery("#cfw-cart-details-collapse-wrap").css('display', 'none');
        }
    }

    /**
     * @returns {{}}
     */
    getFormObject() {
        let main: Main = Main.instance;
        let checkout_form: any = main.checkoutForm;
        let ship_to_different_address = <string>jQuery("[name='ship_to_different_address']:checked").val();
        let $required_inputs = checkout_form.find( '.address-field.validate-required:visible' );
        let has_full_address: boolean = true;
        let lookFor: Array<string> = main.settings.default_address_fields;

        let formData = {
            post_data: checkout_form.serialize()
        };

        if ( $required_inputs.length ) {
            $required_inputs.each( function() {
                if ( jQuery( this ).find( ':input' ).val() === '' ) {
                    has_full_address = false;
                }
            });
        }

        let formArr: Array<Object> = checkout_form.serializeArray();
        formArr.forEach((item: any) => formData[item.name] = item.value);

        // Handle shipped subscriptions since they are render outside of the form
        jQuery('#cfw-other-totals input[name^="shipping_method"][type="radio"]:checked, #cfw-other-totals input[name^="shipping_method"][type="hidden"]').each((index, el) => {
            formData[ jQuery(el).attr('name') ] = jQuery(el).val();
        });

        formData["has_full_address"] = has_full_address;
        formData["ship_to_different_address"] = ship_to_different_address;

        if( ship_to_different_address === "same_as_shipping" ) {
            lookFor.forEach(field => {
                if(jQuery(`#billing_${field}`).length > 0) {
                    formData[`billing_${field}`] = formData[`shipping_${field}`];
                }
            });
        }

		/**
         * Some gateways remove the checkout and shipping fields. If guest checkout is enabled we need to check for
         * these fields
		 */
		if(jQuery("#cfw-first-for-plugins #billing_first_name").length > 0 && jQuery("#cfw-last-for-plugins #billing_last_name").length > 0) {
            formData["billing_first_name"] = jQuery("#cfw-first-for-plugins #billing_first_name").val();
            formData["billing_last_name"] = jQuery("#cfw-last-for-plugins #billing_last_name").val();
        }

        return formData;
    }

    /**
     *
     */
    setTermsAndConditions(): void {
        const termsAndConditionsLinkClass: string = "woocommerce-terms-and-conditions-link";
        const termsAndConditionsContentClass: string = "woocommerce-terms-and-conditions";

        let termsAndConditionsLink: Element = new Element(jQuery(`.${termsAndConditionsLinkClass}`));
        let termsAndConditionsContent: Element = new Element(jQuery(`.${termsAndConditionsContentClass}`));

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

        checkout_form.on( 'submit', this.completeOrderSubmitHandler.bind(this) );
    }

    /**
     *
     */
    completeOrderSubmitHandler(e) {
        let main: Main = Main.instance;
        let checkout_form: any = main.checkoutForm;
        let lookFor: Array<string> = main.settings.default_address_fields;
        let preSwapData = this.checkoutDataAtSubmitClick = {};

        CompleteOrderAction.initCompleteOrder = true;

        Main.addOverlay();

        checkout_form.find(".woocommerce-error").remove();

        jQuery(document.body).on("checkout_error", () => {
            checkout_form.removeClass( 'processing' ).unblock(); // compatibility with gateways / plugins that expect this
            Main.removeOverlay();
            CompleteOrderAction.initCompleteOrder = false
        });

        if ( checkout_form.find('input[name="ship_to_different_address"]:checked').val() === "same_as_shipping" ) {
            lookFor.forEach( field => {
                let billing = jQuery(`#billing_${field}`);
                let shipping = jQuery(`#shipping_${field}`);

                if(billing.length > 0) {
                    preSwapData[field] = billing.val();

                    billing.val(shipping.val());
                    billing.trigger("keyup");
                }
            });
        }

        // If all the payment stuff has finished any ajax calls, run the complete order.
        if ( checkout_form.triggerHandler( 'checkout_place_order' ) !== false && checkout_form.triggerHandler( 'checkout_place_order_' + checkout_form.find( 'input[name="payment_method"]:checked' ).val() ) !== false ) {
            checkout_form.addClass( 'processing' );

            // Reset data
            for ( let field in preSwapData ) {
                let billing = jQuery(`#billing_${field}`);

                billing.val(preSwapData[field]);
            }

            this.orderKickOff(main.ajaxInfo, this.getFormObject());
        }

        // TODO: Throwing an error here seems to cause situations where the error briefly appears during a successful order
        return false;
    }

    /**
     *
     * @param {AjaxInfo} ajaxInfo
     * @param data
     */
    orderKickOff(ajaxInfo: AjaxInfo, data): void {
        let isShippingDifferentFromBilling: boolean = <string>jQuery("[name='ship_to_different_address']:checked").val() === "different_from_shipping";

        ValidationService.createOrder(isShippingDifferentFromBilling, ajaxInfo, data);
    }

    /**
     *
     */
    setApplyCouponListener() {
        jQuery("#cfw-promo-code-btn").on('click', () => {
            let coupon_field: any = jQuery("#cfw-promo-code");

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
        let sdf_any_results: any = jQuery("#cfw-shipping-details-fields .cfw-shipping-details-field");
        let shipping_details_fields: Array<any> = [];
        let action: string = "update_shipping_fields";

        sdf_any_results.each((index, val) => { shipping_details_fields.push(jQuery(val)) });

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