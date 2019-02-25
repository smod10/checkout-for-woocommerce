import {EasyTab, EasyTabService} from "./EasyTabService";
import {CompleteOrderAction} from "../Actions/CompleteOrderAction";
import {Main} from "../Main";
import {ValidationService} from "./ValidationService";

let w: any = window;
declare var jQuery: any;

export type InfoType = "shipping" | "billing" | "error";

export class ParsleyService {

    /**
     * @type {boolean}
     * @static
     * @private
     */
    private static _cityStateValidating: boolean = false;

    /**
     * @type {boolean}
     * @static
     * @private
     */
    private static _updateShippingTabInfo: boolean = false;

    /**
     * @type {null}
     * @private
     */
    private static _zipRequest = null;

    /**
     * @type {any}
     * @private
     */
    private _parsley: any;

    /**
     *
     */
    constructor() {
        this.setParsleyValidators();
        this.handleStateZipFailure();
    }

    /**
     *
     */
    handleStateZipFailure(): void {
        // Parsley isn't a any default, this gets around it.
        let shipping_action = () => EasyTabService.go(EasyTab.CUSTOMER);
        let shipping_postcode = jQuery("#shipping_postcode");

        if ( shipping_postcode.length !== 0 ) {
            shipping_postcode.parsley().on("field:error", shipping_action);
            jQuery("#shipping_state").parsley().on("field:error", shipping_action);
        }
    }

    /**
     *
     */
    setParsleyValidators(): void {
        let max_iterations = 1000;
        let iterations = 0;
        let interval = 0;

        interval = setInterval(() => {
            if ( w.Parsley !== undefined ) {
                this.parsley = w.Parsley;
                this.parsley.on('form:error', () => {
                    Main.removeOverlay();
					CompleteOrderAction.initCompleteOrder = false;
                });

				window.dispatchEvent(new CustomEvent("cfw-parsley-initialized", { detail: { parsley: this.parsley } }));

                clearInterval(interval);
            } else if( iterations >= max_iterations ) {
                // Give up
                clearInterval(interval);
            } else {
                iterations++;
            }
        }, 50);
    }

    /**
     * @returns {any}
     */
    get parsley(): any {
        return this._parsley;
    }

    /**
     * @param value
     */
    set parsley(value: any) {
        this._parsley = value;
    }
}