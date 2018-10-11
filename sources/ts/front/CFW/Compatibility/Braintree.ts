import { Compatibility }                    from "./Compatibility";
import { Main }                             from "../Main";

/**
 * Helper compatibility class for the Braintree plugin
 */
export class Braintree extends Compatibility {
    /**
     * @param params
     * @param load
     */
    constructor(params: any[], load: boolean = true) {
        super(params, load);
    }

    /**
     * Loads the Braintree compatibility class
     * @param main
     */
    load(main: Main) {

    }
}