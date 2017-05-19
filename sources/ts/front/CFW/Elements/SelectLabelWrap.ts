import { Element }              from "Element";
import { LabelType }            from "../Enums/LabelType";
import { FormElement }          from "./FormElement";

export class SelectLabelWrap extends FormElement {

    private _select: Element;

    constructor(jel: JQuery) {
        super(jel);

        this.setSelectAndLabel();

        this.eventCallbacks = [
            { eventName: "change", func: function(){
                this.wrapClassSwap(this.select.jel.val());
            }.bind(this), target: null },
            { eventName: "keyup", func: function(){
                this.wrapClassSwap(this.select.jel.val());
            }.bind(this), target: null }
        ];

        this.registerEventCallbacks();

        this.wrapClassSwap(this.select.jel.val());
    }

    registerEventCallbacks(): void {
        if(this.select) {
            this.eventCallbacks.forEach((eventCb) => {
                let eventName: any = eventCb.eventName;
                let cb: Function = eventCb.func;
                let target: JQuery = eventCb.target;

                if(!target) {
                    target = this.select.jel;
                }

                target.on(eventName, cb);
            });
        }
    }

    setSelectAndLabel(): void {
        let lt = $.map(LabelType, function(value, index) {
            return [value];
        });

        // Note: Length is divided by 2 because of ENUM implementation. Read TS docs
        for(let i = 0; i < lt.length / 2; i++) {
            let type = lt[i].toLowerCase();
            let tjel = this.jel.find('select');

            if(tjel.length > 0) {
                this.select = new Element(tjel);
            }
        }
    }

    get select(): Element {
        return this._select;
    }

    set select(value: Element) {
        this._select = value;
    }
}