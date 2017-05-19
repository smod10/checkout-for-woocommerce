import { Element }                  from "Element";
import { InputLabelWrap }           from "InputLabelWrap";
import { LabelType }                from "../Enums/LabelType";
import { InputLabelType }           from "../Types/Types";
import { SelectLabelWrap }          from "./SelectLabelWrap";

export class TabContainerSection extends Element {
    private _name: string = "";
    private _inputLabelWraps: Array<InputLabelWrap> = [];
    private _selectLabelWraps: Array<SelectLabelWrap> = [];

    private static _inputLabelWrapClass: string = "cfw-input-wrap";
    private static _inputLabelTypes: Array<InputLabelType> = [
        { type: LabelType.TEXT, cssClass: "cfw-text-input" },
        { type: LabelType.PASSWORD, cssClass: "cfw-password-input"},
        { type: LabelType.SELECT, cssClass: "cfw-select-input"}
    ];

    constructor(
        jel: JQuery,
        name: string
    ) {
        super(jel);

        this.name = name;

        this.setWraps();
    }

    getInputLabelWrapById(id: string): InputLabelWrap {
        return <InputLabelWrap>this.inputLabelWraps.find((inputLabelWrap) => inputLabelWrap.jel.attr("id") == id);
    }

    getWrapSelector(): string {
        let selector: string = "";

        TabContainerSection.inputLabelTypes.forEach((labelType, index) => {
            selector += "." + TabContainerSection.inputLabelWrapClass + "." + labelType.cssClass;

            if(index+1 != TabContainerSection.inputLabelTypes.length) {
                selector += ", ";
            }
        });

        return selector;
    }

    setWraps(): void {
        let inputLabelWraps: Array<InputLabelWrap> = [];
        let selectLabelWraps: Array<SelectLabelWrap> = [];

        let jLabelWrap: JQuery = this.jel.find(this.getWrapSelector());

        jLabelWrap.each((index, wrap) => {
            if($(wrap).hasClass("cfw-select-input")) {
                selectLabelWraps.push( new SelectLabelWrap( $(wrap) ) );
            } else {
                inputLabelWraps.push( new InputLabelWrap( $(wrap) ) );
            }

        });

        this.inputLabelWraps = inputLabelWraps;
        this.selectLabelWraps = selectLabelWraps;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get inputLabelWraps(): Array<InputLabelWrap> {
        return this._inputLabelWraps;
    }

    set inputLabelWraps(value: Array<InputLabelWrap>) {
        this._inputLabelWraps = value;
    }

    get selectLabelWraps(): Array<SelectLabelWrap> {
        return this._selectLabelWraps;
    }

    set selectLabelWraps(value: Array<SelectLabelWrap>) {
        this._selectLabelWraps = value;
    }

    static get inputLabelTypes(): Array<InputLabelType> {
        return TabContainerSection._inputLabelTypes;
    }

    static set inputLabelTypes(value: Array<InputLabelType>) {
        TabContainerSection._inputLabelTypes = value;
    }

    static get inputLabelWrapClass(): string {
        return TabContainerSection._inputLabelWrapClass;
    }

    static set inputLabelWrapClass(value: string) {
        TabContainerSection._inputLabelWrapClass = value;
    }
}