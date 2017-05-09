import { Element } from "Element";
import { LabelType } from "../Enums/LabelType";
import { EventCallback } from "../Types/Types";

export class InputLabelWrap extends Element {

    private static _labelClass: string = "cfw-floating-label";

    private _input: Element;
    private _eventCallbacks: Array<EventCallback>;

    constructor(jel: JQuery, eventCallbacks: Array<EventCallback> = []) {
        super(jel);

        this.eventCallbacks = [
            { eventName: "keyup", func: this.wrapClassSwap.bind(this), target: null }
        ];

        this.setInputAndLabel();
        this.wrapClassSwap();
    }

    wrapClassSwap() {
        if(this.input.jel.val() !== "" && !this.jel.hasClass(InputLabelWrap.labelClass)) {
            this.jel.addClass(InputLabelWrap.labelClass);
        }

        if(this.input.jel.val() === "" && this.jel.hasClass(InputLabelWrap.labelClass)) {
            this.jel.removeClass(InputLabelWrap.labelClass);
        }
    }

    setInputAndLabel() {
        let lt = $.map(LabelType, function(value, index) {
            return [value];
        });

        // Note: Length is divided by 2 because of ENUM implementation. Read TS docs
        for(let i = 0; i < lt.length / 2; i++) {
            let type = lt[i].toLowerCase();

            let tjel = this.jel.find('input[type="' + type + '"]');

            if(tjel.length > 0) {
                this.input = new Element(tjel);
            }

            if(this.input) {
                this.eventCallbacks.forEach((eventCb) => {
                    let eventName: any = eventCb.eventName;
                    let cb: Function = eventCb.func;
                    let target: JQuery = eventCb.target;

                    if(!target) {
                        target = this.input.jel;
                    }

                    target.on(eventName, cb);
                });
            }
        }
    }

    static get labelClass(): string {
        return InputLabelWrap._labelClass;
    }

    static set labelClass(value: string) {
        InputLabelWrap._labelClass = value;
    }

    get input(): Element {
        return this._input;
    }

    set input(value: Element) {
        this._input = value;
    }

    get eventCallbacks(): Array<EventCallback> {
        return this._eventCallbacks;
    }

    set eventCallbacks(value: Array<EventCallback>) {
        this._eventCallbacks = value;
    }
}