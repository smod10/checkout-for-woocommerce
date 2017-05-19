import { Element }              from "Element";
import { LabelType }            from "../Enums/LabelType";
import { FormElement }          from "./FormElement";

export class InputLabelWrap extends FormElement {

    private _input: Element;

    constructor(jel: JQuery) {
        super(jel);

        this.setInputAndLabel();

        this.eventCallbacks = [
            { eventName: "keyup", func: function(){
                this.wrapClassSwap(this.input.jel.val());
            }.bind(this), target: null }
        ];

        this.registerEventCallbacks();

        this.wrapClassSwap(this.input.jel.val());
    }

    registerEventCallbacks(): void {
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
        }
    }

    get input(): Element {
        return this._input;
    }

    set input(value: Element) {
        this._input = value;
    }
}