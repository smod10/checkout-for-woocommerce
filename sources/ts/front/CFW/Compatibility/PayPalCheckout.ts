import { Compatibility } from "./Compatibility";
import { Main } from "../Main";

declare let jQuery: any;

export class PayPalCheckout extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    load(main: Main): void {

    }
}