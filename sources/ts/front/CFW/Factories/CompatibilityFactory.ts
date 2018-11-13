import { Main } 								from "../Main";
import { CompatibilityClassOptions } 			from "../Types/Types";
import { Compatibility } 						from "../Compatibility/Compatibility";

export class CompatibilityFactory {

	static createAll(main: Main, ops: Array<CompatibilityClassOptions>, classes: Array<Compatibility>): Array<Compatibility> {
		let createdCompats: Array<Compatibility> = [];

		ops.forEach( opSet => {
			// If any of these aren't set return. Just don't even try to load it
			if(opSet.params === undefined || opSet.class === undefined || classes[opSet.class] === undefined)
				return;

			// Add the main instance to the first parameter
			opSet.params.unshift(main);

			// If a class definition exists for a given class instantiate it
			if(classes[opSet.class]) {
				createdCompats.push(CompatibilityFactory.create(classes[opSet.class], opSet.params, opSet.fireLoad))
			}
		});

		return createdCompats;
	}

	static create(classDef, params, fireLoad): Compatibility {
		return new classDef(params, fireLoad);
	}
}