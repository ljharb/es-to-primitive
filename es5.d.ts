declare function ToPrimitive(input: any, hint?: typeof String | typeof Number): ToPrimitive.PRIMITIVES;

declare namespace ToPrimitive {
	type PRIMITIVES = string | number | boolean | null | undefined;
}

export = ToPrimitive;
