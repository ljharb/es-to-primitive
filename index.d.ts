import ES5 from './es5';
import ES6 from './es6';
import ES2015 from './es2015';

declare function ToPrimitive(
    input: unknown,
    hint?: StringConstructor | NumberConstructor,
): ToPrimitive.primitive;

declare namespace ToPrimitive {
    export type ES5 = typeof ES5;

    /** @deprecated */
    export type ES6 = typeof ES6;

    export type ES2015 = typeof ES2015;

    export type primitive = null | undefined | string | symbol | number | boolean | bigint;
}

export = ToPrimitive;
