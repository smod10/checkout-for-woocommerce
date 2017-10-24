/**
 * First argument of success response is the data object. What we do since on the PHP side it's prepped as a json object
 * we intercept the argument and parse the JSON. On the overloaded function side we specify the object type.
 *
 * @param target {Object}
 * @param propertyKey {string}
 * @param descriptor {PropertyDescriptor}
 * @returns {PropertyDescriptor}
 * @constructor
 */
export function ResponsePrep(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {

    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if(descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    }
    let originalMethod = descriptor.value;

    //editing the descriptor/value parameter
    descriptor.value = function () {
        arguments[0] = JSON.parse(arguments[0]);

        return originalMethod.apply(this, arguments);
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}