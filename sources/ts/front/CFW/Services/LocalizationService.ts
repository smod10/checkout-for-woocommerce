import {Main} from "../Main";
import {InfoType} from "./ParsleyService";
import {TabContainerSection} from "../Elements/TabContainerSection";
import {InputLabelWrap} from "../Elements/InputLabelWrap";
import {SelectLabelWrap} from "../Elements/SelectLabelWrap";
import {EValidationSections, ValidationService} from "./ValidationService";

declare let wc_address_i18n_params: any;
declare let wc_country_select_params: any;
declare let jQuery: any;

export class LocalizationService {

    /**
     *  Handles localization information for countries and relevant states
     */
    setCountryChangeHandlers() {
        let shipping_country: any = jQuery("#shipping_country");
        let billing_country: any = jQuery("#billing_country");

        let shipping_postcode: any = jQuery("#shipping_postcode");
        let billing_postcode: any = jQuery("#billing_postcode");

        let shipping_state: any = jQuery("#shipping_state");
        let billing_state: any = jQuery("#billing_state");

        // When the country (shipping or billing) get's changed
        let country_change = (event) => {
            let $wrapper    = jQuery( this ).closest('.woocommerce-billing-fields, .woocommerce-shipping-fields, .woocommerce-shipping-calculator');
            let target: any = jQuery(event.target);
            let target_country: string = target.val();
            let info_type: InfoType = <InfoType>target.attr("id").split("_")[0];
            let country_state_list = JSON.parse(wc_country_select_params.countries);
            let state_list_for_country = country_state_list[target_country];
            let locale_data = JSON.parse(wc_address_i18n_params.locale);

            jQuery(`#${info_type}_state`).parsley().reset();

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

            jQuery(`#${info_type}_state`).parsley().reset();

            // Re-register all the elements
            Main.instance.checkoutForm.parsley();

			jQuery(document.body).trigger("update_checkout");
            jQuery( document.body ).trigger( 'country_to_state_changing', [target_country, $wrapper ] );
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

        LocalizationService.initStateMobileMargin();
    }

    /**
     * Add mobile margin removal for state if it doesn't exist on page load. Also removes down arrow if no select state.
     */
    static initStateMobileMargin(): void {
        let shipping_state_field: any = jQuery("#shipping_state_field");
        let billing_state_field: any = jQuery("#billing_state_field");

        [shipping_state_field, billing_state_field].forEach(field => {

            // If the field is hidden, remove the margin on mobile by adding the appropriate class.
            if(field.find("input[type='hidden']").length > 0) {
                LocalizationService.addOrRemoveStateMarginForMobile("add", field.attr("id").split("_")[0]);
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
        let info_type_state_field = jQuery(`#${info_type}_state_field`);
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

        let $postcode = jQuery(`#${info_type}_postcode`);
        let $state = jQuery(`#${info_type}_state`);
        let $city = jQuery(`#${info_type}_city`);
        let $address_2 = jQuery(`#${info_type}_address_2`);

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
        $state.attr("name", `${info_type}_state`);
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
        let current_state_field = jQuery(`#${info_type}_state`);
        let state_element_wrap: any = current_state_field.parents(".cfw-input-wrap");
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
        let new_state_input = jQuery(`#${info_type}_state`);

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

        LocalizationService.addOrRemoveStateMarginForMobile("remove", info_type);
    }

    /**
     *
     * @param country_display_data
     * @param info_type
     */
    removeStateAndReplaceWithHiddenInput(country_display_data, info_type) {
        let current_state_field: any = jQuery(`#${info_type}_state`);
        let state_element_wrap: any = current_state_field.parents(".cfw-input-wrap");

        current_state_field.remove();

        if(country_display_data && Object.keys(country_display_data).length > 0) {
            let is_required: boolean = country_display_data["state"]["required"] === "true";

            if(!is_required) {
                state_element_wrap.removeClass("cfw-select-input");
                state_element_wrap.removeClass("cfw-text-input");
                state_element_wrap.removeClass("cfw-floating-label");

                state_element_wrap.append(`<input type="hidden" id="${info_type}_state" field_key="state" />`);

                LocalizationService.addOrRemoveStateMarginForMobile("add", info_type);
            }
        }
    }

    /**
     * Removes the state input field and appends a select element for the state field. Returns a any reference to the
     * newly created select element
     *
     * @param {any} state_input
     * @param info_type
     * @returns {any}
     */
    removeInputAndAddSelect(state_input: any, info_type): any {
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
        let new_state_input = jQuery(`#${id}`);

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
        let current_state_field = jQuery(`#${info_type}_state`);
        let current_state_field_wrap = jQuery(`#${info_type}_state_field`);
        let current_zip_field = jQuery(`#${info_type}_postcode`)

        current_state_field_wrap.removeClass("remove-state-down-arrow");

        LocalizationService.addOrRemoveStateMarginForMobile("remove", info_type);

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
     * @param {any} postcode
     * @param {any} state
     * @param country
     */
    setCountryOnZipAndState(postcode: any, state: any, country) {
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
}