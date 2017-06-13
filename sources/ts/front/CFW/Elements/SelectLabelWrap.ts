import { FormElement }          from "./FormElement";

/**
 *
 */
export class SelectLabelWrap extends FormElement {

    /**
     *
     * @param jel
     */
    constructor(jel: JQuery) {
        super(jel);

        this.setHolderAndLabel(this.jel.find('select'));

        this.eventCallbacks = [
            { eventName: "change", func: function(){
                this.wrapClassSwap(this.holder.jel.val());
            }.bind(this), target: null },
            { eventName: "keyup", func: function(){
                this.wrapClassSwap(this.holder.jel.val());
            }.bind(this), target: null }
        ];

        this.regAndWrap();
    }
}