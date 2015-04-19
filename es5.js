'use strict';

var toStr = Object.prototype.toString;

var isPrimitive = require('./helpers/isPrimitive');

var isCallable = require('is-callable');

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function (O, hint) {
		var actualHint = hint || toStr.call(O) === '[object Date]' ? String : Number;

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var preferredType = PreferredType;
	if (arguments.length < 2) {
		preferredType = toStr.call(input) === '[object Date]' ? String : Number;
	}
	if (preferredType === String) {
		return String(input);
	} else if (preferredType === Number) {
		return Number(input);
	} else {
		throw new TypeError('invalid PreferredType supplied');
	}
	return ES5internalSlots['[[DefaultValue]]'](input, preferredType);
};
