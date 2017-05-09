import { Element }                  from "Element";
import { InputLabelWrap }           from "InputLabelWrap";
import { LabelType }                from "../Enums/LabelType";
import { InputLabelType }           from "../Types/Types";

export class TabContainerSection extends Element {
    private _name: string = "";
    private _inputLabelWrapClass: string = "";
    private _inputLabelTypes: Array<InputLabelType> = [];
    private _inputLabelWraps: Array<InputLabelWrap> = [];

    constructor(
        jel: JQuery,
        name: string,
        inputLabelWrapClass: string = "cfw-input-wrap",
        inputLabelTypes: Array<InputLabelType> = [
            { type: LabelType.TEXT, cssClass: "cfw-text-input" },
            { type: LabelType.PASSWORD, cssClass: "cfw-password-input"}
        ]
    ) {
        super(jel);

        this.name = name;
        this.inputLabelWrapClass = inputLabelWrapClass;
        this.inputLabelTypes = inputLabelTypes;

        this.setInputLabelWraps();
    }

    getInputLabelWrapSelector(): string {
        let selector: string = "";

        this.inputLabelTypes.forEach((labelType, index) => {
            selector += "." + this.inputLabelWrapClass + "." + labelType.cssClass;

            if(index+1 != this.inputLabelTypes.length) {
                selector += ", ";
            }
        });

        return selector;
    }

    setInputLabelWraps(): void {
        let inputLabelWraps: Array<InputLabelWrap> = [];
        let jInputLabelWraps: JQuery = this.jel.find(this.getInputLabelWrapSelector());

        jInputLabelWraps.each((index, wrap) => {
            inputLabelWraps.push( new InputLabelWrap( $(wrap) ) );
        });

        this.inputLabelWraps = inputLabelWraps;
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

    get inputLabelTypes(): Array<InputLabelType> {
        return this._inputLabelTypes;
    }

    set inputLabelTypes(value: Array<InputLabelType>) {
        this._inputLabelTypes = value;
    }

    get inputLabelWrapClass(): string {
        return this._inputLabelWrapClass;
    }

    set inputLabelWrapClass(value: string) {
        this._inputLabelWrapClass = value;
    }
}