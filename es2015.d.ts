import type { primitive } from './';

declare function ToPrimitive(
    input: unknown,
    hint?: StringConstructor | NumberConstructor,
): ToPrimitive.primitiveES6;


declare namespace ToPrimitive {
    export type primitiveES6 = Exclude<primitive, bigint>;
    export type unknownES6 = primitiveES6 | object;
}

export = ToPrimitive;
