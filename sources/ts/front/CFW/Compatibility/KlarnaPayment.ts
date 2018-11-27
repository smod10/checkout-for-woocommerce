import { Compatibility } 			from "./Compatibility";
import { Main } 					from "../Main";

export class KlarnaPayment extends Compatibility {

	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	load(main: Main, params: any): void {

	}
}