var test = require('tape');
var toPrimitive = require('../es6');
var is = require('object-is');
var forEach = require('foreach');
var debug = require('util').inspect;

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var primitives = [null, undefined, true, false, 0, -0, 42, NaN, Infinity, -Infinity, '', 'abc'];

test('primitives', function (t) {
	forEach(primitives, function (i) {
		t.ok(is(toPrimitive(i), i), 'toPrimitive(' + debug(i) + ') returns the same value');
		t.ok(is(toPrimitive(i, String), i), 'toPrimitive(' + debug(i) + ', String) returns the same value');
		t.ok(is(toPrimitive(i, Number), i), 'toPrimitive(' + debug(i) + ', Number) returns the same value');
	});
	t.end();
});

test('Symbols', { skip: !hasSymbols }, function (t) {
	var symbols = [Symbol(), Symbol.iterator, Symbol.for('foo')];
	forEach(symbols, function (sym) {
		t.equal(toPrimitive(sym), sym, 'toPrimitive(' + debug(sym) + ') returns the same value');
		t.equal(toPrimitive(sym, String), sym, 'toPrimitive(' + debug(sym) + ', String) returns the same value');
		t.equal(toPrimitive(sym, Number), sym, 'toPrimitive(' + debug(sym) + ', Number) returns the same value');
	});

	var primitiveSym = Symbol('primitiveSym');
	var objectSym = Object(primitiveSym);
	t.equal(toPrimitive(objectSym), primitiveSym, 'toPrimitive(' + debug(objectSym) + ') returns ' + debug(primitiveSym));
	t.equal(toPrimitive(objectSym, String), primitiveSym, 'toPrimitive(' + debug(objectSym) + ', String) returns ' + debug(primitiveSym));
	t.equal(toPrimitive(objectSym, Number), primitiveSym, 'toPrimitive(' + debug(objectSym) + ', Number) returns ' + debug(primitiveSym));
	t.end();
});

test('Arrays', function (t) {
	var arrays = [[], ['a', 'b'], [1, 2]];
	forEach(arrays, function (arr) {
		t.equal(toPrimitive(arr), String(arr), 'toPrimitive(' + debug(arr) + ') returns the string version of the array');
		t.equal(toPrimitive(arr, String), String(arr), 'toPrimitive(' + debug(arr) + ') returns the string version of the array');
		t.equal(toPrimitive(arr, Number), String(arr), 'toPrimitive(' + debug(arr) + ') returns the string version of the array');
	});
	t.end();
});

test('Dates', function (t) {
	var dates = [new Date(), new Date(0), new Date(NaN)];
	forEach(dates, function (date) {
		t.equal(toPrimitive(date), String(date), 'toPrimitive(' + debug(date) + ') returns the string version of the date');
		t.equal(toPrimitive(date, String), String(date), 'toPrimitive(' + debug(date) + ') returns the string version of the date');
		t.ok(is(toPrimitive(date, Number), Number(date)), 'toPrimitive(' + debug(date) + ') returns the number version of the date');
	});
	t.end();
});

var coercibleObject = { valueOf: function () { return 3; }, toString: function () { return 42; } };
var valueOfOnlyObject = { valueOf: function () { return 4; }, toString: function () { return {}; } };
var toStringOnlyObject = { valueOf: function () { return {}; }, toString: function () { return 7; } };
var coercibleFnObject = { valueOf: function () { return function valueOfFn() {}; }, toString: function () { return 42; } };
var uncoercibleObject = { valueOf: function () { return {}; }, toString: function () { return {}; } };
var uncoercibleFnObject = { valueOf: function () { return function valueOfFn() {}; }, toString: function () { return function toStrFn() {}; } };

test('Objects', function (t) {
	t.equal(toPrimitive(coercibleObject), coercibleObject.valueOf(), 'coercibleObject with no hint coerces to valueOf');
	t.equal(toPrimitive(coercibleObject, Number), coercibleObject.valueOf(), 'coercibleObject with hint Number coerces to valueOf');
	t.equal(toPrimitive(coercibleObject, String), coercibleObject.toString(), 'coercibleObject with hint String coerces to non-stringified toString');

	t.equal(toPrimitive(coercibleFnObject), coercibleFnObject.toString(), 'coercibleFnObject coerces to non-stringified toString');
	t.equal(toPrimitive(coercibleFnObject, Number), coercibleFnObject.toString(), 'coercibleFnObject with hint Number coerces to non-stringified toString');
	t.equal(toPrimitive(coercibleFnObject, String), coercibleFnObject.toString(), 'coercibleFnObject with hint String coerces to non-stringified toString');

	t.equal(toPrimitive({}), '[object Object]', '{} with no hint coerces to Object#toString');
	t.equal(toPrimitive({}, Number), '[object Object]', '{} with hint Number coerces to Object#toString');
	t.equal(toPrimitive({}, String), '[object Object]', '{} with hint String coerces to Object#toString');

	t.equal(toPrimitive(toStringOnlyObject), toStringOnlyObject.toString(), 'toStringOnlyObject returns non-stringified toString');
	t.equal(toPrimitive(toStringOnlyObject, Number), toStringOnlyObject.toString(), 'toStringOnlyObject with hint Number returns non-stringified toString');
	t.equal(toPrimitive(toStringOnlyObject, String), toStringOnlyObject.toString(), 'toStringOnlyObject with hint String returns non-stringified toString');

	t.equal(toPrimitive(valueOfOnlyObject), valueOfOnlyObject.valueOf(), 'valueOfOnlyObject returns valueOf');
	t.equal(toPrimitive(valueOfOnlyObject, Number), valueOfOnlyObject.valueOf(), 'valueOfOnlyObject with hint Number returns valueOf');
	t.equal(toPrimitive(valueOfOnlyObject, String), valueOfOnlyObject.valueOf(), 'valueOfOnlyObject with hint String returns non-stringified valueOf');

	t.throws(function () { return toPrimitive(uncoercibleObject); }, TypeError, 'uncoercibleObject throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleObject, Number); }, TypeError, 'uncoercibleObject with hint Number throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleObject, String); }, TypeError, 'uncoercibleObject with hint String throws a TypeError');

	t.throws(function () { return toPrimitive(uncoercibleFnObject); }, TypeError, 'uncoercibleFnObject throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleFnObject, Number); }, TypeError, 'uncoercibleFnObject with hint Number throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleFnObject, String); }, TypeError, 'uncoercibleFnObject with hint String throws a TypeError');
	t.end();
});