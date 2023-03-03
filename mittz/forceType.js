const enforcer = (type, value) => typeof new type().valueOf() === typeof value && value !== null ? value : new type().valueOf();

const forceNull    = $ => null;
const forceBoolean = $ => enforcer(Boolean, $);
const forceNumber  = $ => enforcer(Number, isNaN($) ? false : Number($));
const forceBigInt  = $ => enforcer(BigInt, $);
const forceString  = $ => enforcer(String, $);
const forceObject  = $ => enforcer(Object, $);
const forceArray   = $ => Array.isArray($) ? $ : [];

export {
	forceNull,
	forceBoolean,
	forceNumber,
	forceBigInt,
	forceString,
	forceObject,
	forceArray
}