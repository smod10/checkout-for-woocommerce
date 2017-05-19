import { Element }          from "Element";
import { EventCallback }    from "../Types/Types";

export class FormElement extends Element {
    protected static _labelClass: string = "cfw-floating-label";
    protected _eventCallbacks: Array<EventCallback> = [];

    constructor(jel: JQuery) {
        super(jel);
    }

    wrapClassSwap(value: string) {
        if(value !== "" && !this.jel.hasClass(FormElement.labelClass)) {
            this.jel.addClass(FormElement.labelClass);
        }

        if(value === "" && this.jel.hasClass(FormElement.labelClass)) {
            this.jel.removeClass(FormElement.labelClass);
        }
    }

    static get labelClass(): string {
        return FormElement._labelClass;
    }

    static set labelClass(value: string) {
        FormElement._labelClass = value;
    }

    get eventCallbacks(): Array<EventCallback> {
        return this._eventCallbacks;
    }

    set eventCallbacks(value: Array<EventCallback>) {
        this._eventCallbacks = value;
    }
}