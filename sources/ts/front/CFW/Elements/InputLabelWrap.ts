import { FormElement }          from "./FormElement";

/**
 *
 */
export class InputLabelWrap extends FormElement {

    /**
     * @param jel
     */
    constructor(jel: any) {
        super(jel);

        this.setHolderAndLabel('input[type="%s"]', true);

        if(this.holder) {
            this.eventCallbacks = [
                {
                    eventName: "keyup", func: function () {
                        this.wrapClassSwap(this.holder.jel.val());
                    }.bind(this), target: null
                }
            ];

            this.regAndWrap();
        }
    }
}