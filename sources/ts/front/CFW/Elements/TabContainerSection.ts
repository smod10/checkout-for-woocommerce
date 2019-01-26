import { Element }                  from "./Element";
import { InputLabelWrap }           from "./InputLabelWrap";
import { LabelType }                from "../Enums/LabelType";
import { InputLabelType }           from "../Types/Types";
import { SelectLabelWrap }          from "./SelectLabelWrap";
import { FormElement }              from "./FormElement";

declare let jQuery: any;

/**
 *
 */
export class TabContainerSection extends Element {

    /**
     *
     * @type {string}
     * @private
     */
    private _name: string = "";

    /**
     *
     * @type {Array}
     * @private
     */
    private _inputLabelWraps: Array<InputLabelWrap> = [];

    /**
     *
     * @type {Array}
     * @private
     */
    private _selectLabelWraps: Array<SelectLabelWrap> = [];

    /**
     *
     * @type {string}
     * @private
     */
    private static _inputLabelWrapClass: string = "cfw-input-wrap";

    /**
     *
     * @type {[{type: LabelType; cssClass: string},{type: LabelType; cssClass: string},{type: LabelType; cssClass: string}]}
     * @private
     */
    private static _inputLabelTypes: Array<InputLabelType> = [
        { type: LabelType.TEXT, cssClass: "cfw-text-input" },
        { type: LabelType.TEL, cssClass: "cfw-tel-input"},
        { type: LabelType.PASSWORD, cssClass: "cfw-password-input"},
        { type: LabelType.SELECT, cssClass: "cfw-select-input"}
    ];

    /**
     *
     * @param jel
     * @param name
     */
    constructor(
        jel: any,
        name: string
    ) {
        super(jel);

        this.name = name;
    }

    /**
     *
     * @param id
     * @returns {InputLabelWrap}
     */
    getInputLabelWrapById(id: string): InputLabelWrap {
        return <InputLabelWrap>this.inputLabelWraps.find((inputLabelWrap) => inputLabelWrap.jel.attr("id") == id);
    }

    /**
     *
     * @returns {string}
     */
    getWrapSelector(): string {
        let selector: string = "";

        TabContainerSection.inputLabelTypes.forEach((labelType, index) => {
            selector += `.${TabContainerSection.inputLabelWrapClass}.${labelType.cssClass}`;

            if(index+1 != TabContainerSection.inputLabelTypes.length) {
                selector += ", ";
            }
        });

        return selector;
    }

    /**
     * Gets all the inputs for a tab section
     *
     * @param query
     * @returns {Array<Element>}
     */
    getInputsFromSection(query: string = ""): Array<Element> {
        let out: Array<Element> = [];

        this.jel.find(`input${query}`).each((index, elem) => {
            out.push(new Element(jQuery(elem)));
        });

        return out;
    }

    /**
     *
     */
    setWraps(): void {
        let inputLabelWraps: Array<InputLabelWrap> = [];
        let selectLabelWraps: Array<SelectLabelWrap> = [];

        let jLabelWrap: any = this.jel.find(this.getWrapSelector());

        jLabelWrap.each((index, wrap) => {

            if(jQuery(wrap).hasClass("cfw-select-input") && jQuery(wrap).find("select").length > 0) {
                let slw: SelectLabelWrap = new SelectLabelWrap( jQuery(wrap) );

                selectLabelWraps.push( slw );
            } else {
                let ilw: InputLabelWrap = new InputLabelWrap( jQuery(wrap) );

                inputLabelWraps.push( ilw );
            }
        });

        this.inputLabelWraps = inputLabelWraps;
        this.selectLabelWraps = selectLabelWraps;
    }

    /**
     * Modules are sections within tab container sections. They are the direct containers of the input / select wraps.
     * The purpose of this method is to allow the developer to get all the input wraps via a cfw-module class, rather
     * than having to do deep dives to figure out what input wrap belongs to where. Makes it easier to add actions to
     * input wraps / inputs
     *
     * @param moduleId
     * @returns {Array<FormElement>}
     */
    getFormElementsByModule(moduleId: string): Array<FormElement> {
        let wraps: Array<FormElement> = [];

        this.inputLabelWraps.forEach((ilw: InputLabelWrap) => {
            let mc: any = ilw.moduleContainer;

            if(mc.attr('id') == moduleId) {
                wraps.push(ilw);
            }
        });

        this.selectLabelWraps.forEach((slw: SelectLabelWrap) => {
            let mc: any = slw.moduleContainer;

            if(mc.attr('id') == moduleId) {
                wraps.push(slw);
            }
        });

        return wraps;
    }

    /**
     *
     * @returns {string}
     */
    get name(): string {
        return this._name;
    }

    /**
     *
     * @param value
     */
    set name(value: string) {
        this._name = value;
    }

    /**
     *
     * @returns {Array<InputLabelWrap>}
     */
    get inputLabelWraps(): Array<InputLabelWrap> {
        return this._inputLabelWraps;
    }

    /**
     *
     * @param value
     */
    set inputLabelWraps(value: Array<InputLabelWrap>) {
        this._inputLabelWraps = value;
    }

    /**
     *
     * @returns {Array<SelectLabelWrap>}
     */
    get selectLabelWraps(): Array<SelectLabelWrap> {
        return this._selectLabelWraps;
    }

    /**
     *
     * @param value
     */
    set selectLabelWraps(value: Array<SelectLabelWrap>) {
        this._selectLabelWraps = value;
    }

    /**
     *
     * @returns {Array<InputLabelType>}
     */
    static get inputLabelTypes(): Array<InputLabelType> {
        return TabContainerSection._inputLabelTypes;
    }

    /**
     *
     * @param value
     */
    static set inputLabelTypes(value: Array<InputLabelType>) {
        TabContainerSection._inputLabelTypes = value;
    }

    /**
     *
     * @returns {string}
     */
    static get inputLabelWrapClass(): string {
        return TabContainerSection._inputLabelWrapClass;
    }

    /**
     *
     * @param value
     */
    static set inputLabelWrapClass(value: string) {
        TabContainerSection._inputLabelWrapClass = value;
    }
}