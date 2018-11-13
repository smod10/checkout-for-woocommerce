import { Compatibility } from "./Compatibility";

export class Klarna extends Compatibility {
	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	load(): void {
		console.log("Klarna Compatibility loaded");
	}
}