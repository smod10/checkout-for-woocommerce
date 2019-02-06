declare let jQuery: any;

export abstract class Compatibility {

	/**
	 * @param {array} params Params for the child class to run on load
	 * @param {boolean} load Should load be fired on instantiation
	 */
	protected constructor(params: any[] = [], load: boolean = true) {
		if(load) {
			this.load(...params);
		}
	}

	/**
	 * Literally anything function. Runs user code. Takes in params (any amount)
	 *
	 * @param params
	 */
	abstract load(...params): void;
}