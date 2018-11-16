import { CompatibilityClassOptions } 			from "../Types/Types";
import { Compatibility } 						from "../Compatibility/Compatibility";
import { Main } 								from "../Main";

export class CompatibilityFactory {

	static createAll(ops: Array<CompatibilityClassOptions>, classes: Array<Compatibility>): Array<Compatibility> {
		let createdCompats: Array<Compatibility> = [];

		ops.forEach( opSet => {
			// If any of these aren't set return. Just don't even try to load it
			if(opSet.params === undefined || opSet.class === undefined || classes[opSet.class] === undefined)
				return;

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

	static filterAndCreate(main: Main, compatFilter: (ops: CompatibilityClassOptions) => boolean) {
		// Compatibility options filtered and main injected into params list
		let compatibilityOptions: Array<CompatibilityClassOptions> = main
			.compatibility
			.filter( compatFilter )
			.map( compOps => ({ ...compOps, params: [main, ...compOps.params] }) );

		// The filtered created compatibility classes
		let createdCompatibilityClasses = CompatibilityFactory.createAll(compatibilityOptions, (<any>window).CompatibilityClasses);

		// Add the after-setup compat classes to the compat class holder on main
		main.createdCompatibilityClasses = main.createdCompatibilityClasses.concat(createdCompatibilityClasses);
	}
}