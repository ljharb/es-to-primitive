declare function ToPrimitive(input: any, hint?: Function): ToPrimitive.PRIMITIVES;

declare namespace ToPrimitive {
	type PRIMITIVES = string | number | boolean | symbol | null | undefined;
}

export = ToPrimitive;
