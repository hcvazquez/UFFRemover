(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.returnExports = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/assert-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/assert-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/assert-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/assert-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/assert-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/assert-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/assert-x" title="npm version">
 * <img src="https://badge.fury.io/js/assert-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * A Javascript assertion library.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.2.18
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @see https://nodejs.org/api/assert.html
 * @module assert-x
 */
/*jslint maxlen:80, esversion:6, this:true, white:true */
/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:2,
  maxstatements:20, maxcomplexity:11 */
/*global require, module */
(function () {
    'use strict';
    var errorx = require('error-x');
    var isRegExp = require('is-regex');
    var safeToString = require('safe-to-string-x');
    var isCallable = require('is-callable');
    var AssertionError = errorx.AssertionError;
    var pTest = RegExp.prototype.test;
    var pReduce = Array.prototype.reduce;
    var define = require('define-properties-x');
    var deepEql = require('deep-equal-x');
    var truncOpts = [
        'length',
        'omission',
        'separator'
    ];
    var assertIt;
    /**
   * Extends `arg` with the `truncate` options.
   *
   * @private
   * @param {Object} arg The object to extend.
   * @param {string} name The `truncate` option name.
   * @return {Object} The `arg` object.
   */
    function extendOpts(arg, name) {
        arg[name] = assertIt.truncate[name];
        return arg;
    }
    /**
   * Throws an exception that displays the values for actual and expected
   * separated by the provided operator.
   *
   * @private
   * @param {*} actual The actual value to be tested.
   * @param {*} expected The expected value to compare against actual.
   * @param {string} message Text description of test.
   * @param {string} operator The compare operator.
   * @throws {Error} Throws an `AssertionError`.
   */
    function baseFail(actual, expected, message, operator) {
        var arg = {
            actual: actual,
            expected: expected,
            message: message,
            operator: operator
        };
        if (typeof assertIt.truncate === 'object' && assertIt.truncate !== null) {
            pReduce.call(truncOpts, extendOpts, arg);
        }
        throw new AssertionError(arg);
    }
    /**
   * Returns whether an exception is expected. Used by throws.
   *
   * @private
   * @param {*} actual The actual value to be tested.
   * @param {*} expected The expected value to compare against actual.
   * @return {boolean} True if exception expected, otherwise false.
   */
    function expectedException(actual, expected) {
        if (!actual || !expected) {
            return false;
        }
        if (isRegExp(expected)) {
            return pTest.call(expected, safeToString(actual));
        }
        if (actual instanceof expected) {
            return true;
        }
        if (isCallable(expected)) {
            return expected.call({}, actual) === true;
        }
        return false;
    }
    /**
   * Returns whether an exception is expected. Used by assertx~throws and
   * assertx~doesNotThrow.
   *
   * @private
   * @param {boolean} shouldThrow True if it should throw, otherwise false.
   * @param {Function} block The function block to be executed in testing.
   * @param {*} expected The expected value to compare against actual.
   * @param {string} [message] Text description of test.
   */
    function baseThrows(shouldThrow, block, expected, message) {
        var clause1 = !message || typeof message !== 'string';
        if (!isCallable(block)) {
            throw new TypeError('block must be a function');
        }
        if (clause1 && typeof expected === 'string') {
            message = expected;
            expected = void 0;
        }
        var actual;
        try {
            block();
        } catch (e) {
            actual = e;
        }
        var wasExceptionExpected = expectedException(actual, expected);
        clause1 = expected && typeof expected.name === 'string' && expected.name;
        message = message ? ' ' + message : '.';
        message = (clause1 ? ' (' + expected.name + ').' : '.') + message;
        if (shouldThrow && !actual) {
            baseFail(actual, expected, 'Missing expected exception' + message);
        } else if (!shouldThrow && wasExceptionExpected) {
            baseFail(actual, expected, 'Got unwanted exception' + message);
        } else {
            clause1 = shouldThrow && actual && expected && !wasExceptionExpected;
            if (clause1 || !shouldThrow && actual) {
                throw actual;
            }
        }
    }
    /**
   * Common function for `assert` and `assert~ok`.
   *
   * @private
   * @param {*} value The value to be tested.
   * @param {string} message Text description of test.
   * @param {string} operator Text description of test operator.
   */
    function baseAssert(value, message, operator) {
        if (!value) {
            baseFail(false, true, message, operator);
        }
    }
    /**
   * Tests if value is truthy, it is equivalent to
   * `equal(!!value, true, message)`.
   *
   * @param {*} value The value to be tested.
   * @param {string} message Text description of test.
   */
    module.exports = assertIt = function assert(value, message) {
        baseAssert(value, message, 'ok');
    };
    define.properties(assertIt, {
        /**
     * Error constructor for test and validation frameworks that implement the
     * standardized AssertionError specification.
     *
     * @constructor
     * @augments Error
     * @param {Object} [message] Need to document the properties.
     */
        AssertionError: AssertionError,
        /**
     * Throws an exception that displays the values for actual and expected
     * separated by the provided operator.
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     * @param {string} operator The compare operator.
     * @throws {Error} Throws an `AssertionError`.
     */
        fail: baseFail,
        /**
     * Tests if value is truthy, it is equivalent to
     * `equal(!!value, true, message)`.
     *
     * @param {*} value The value to be tested.
     * @param {string} [message] Text description of test.
     */
        ok: function ok(value, message) {
            baseAssert(value, message, 'ok');
        },
        /**
     * Tests shallow, coercive equality with the equal comparison
     * operator ( == ).
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        equal: function equal(actual, expected, message) {
            /*jshint eqeqeq:false */
            if (actual != expected) {
                baseFail(actual, expected, message, '==');
            }
        },
        /**
     * Tests shallow, coercive non-equality with the not equal comparison
     * operator ( != ).
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        notEqual: function notEqual(actual, expected, message) {
            /*jshint eqeqeq:false */
            if (actual == expected) {
                baseFail(actual, expected, message, '!=');
            }
        },
        /**
     * Tests for deep equality, coercive equality with the equal comparison
     * operator ( == ) and equivalent.
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        deepEqual: function deepEqual(actual, expected, message) {
            if (!deepEql(actual, expected)) {
                baseFail(actual, expected, message, 'deepEqual');
            }
        },
        /**
     * Tests for any deep inequality. Opposite of `deepEqual`.
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        notDeepEqual: function notDeepEqual(actual, expected, message) {
            if (deepEql(actual, expected)) {
                baseFail(actual, expected, message, 'notDeepEqual');
            }
        },
        /**
     * Tests for deep equality, coercive equality with the equal comparison
     * operator ( === ) and equivalent.
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        deepStrictEqual: function deepStrictEqual(actual, expected, message) {
            if (!deepEql(actual, expected, true)) {
                baseFail(actual, expected, message, 'deepStrictEqual');
            }
        },
        /**
     * Tests for deep inequality. Opposite of `deepStrictEqual`.
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        notDeepStrictEqual: function notDeepStrictEqual(actual, expected, message) {
            if (deepEql(actual, expected, true)) {
                baseFail(actual, expected, message, 'notDeepStrictEqual');
            }
        },
        /**
     * Tests strict equality, as determined by the strict equality
     * operator ( === ).
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        strictEqual: function strictEqual(actual, expected, message) {
            if (actual !== expected) {
                baseFail(actual, expected, message, '===');
            }
        },
        /**
     * Tests strict non-equality, as determined by the strict not equal
     * operator ( !== ).
     *
     * @param {*} actual The actual value to be tested.
     * @param {*} expected The expected value to compare against actual.
     * @param {string} [message] Text description of test.
     */
        notStrictEqual: function notStrictEqual(actual, expected, message) {
            if (actual === expected) {
                baseFail(actual, expected, message, '!==');
            }
        },
        /**
     * Expects block to throw an error. `error` can be constructor, regexp or
     * validation function.
     *
     * @param {Function} block The function block to be executed in testing.
     * @param {constructor|RegExp|Function} [error] The comparator.
     * @param {string} [message] Text description of test.
     */
        throws: function throws(block, error, message) {
            baseThrows(true, block, error, message);
        },
        /**
     * Expects block not to throw an error, see assert~throws for details.
     *
     * @param {Function} block The function block to be executed in testing.
     * @param {constructor} [error] The comparator.
     * @param {string} [message] Text description of test.
     */
        doesNotThrow: function doesNotThrow(block, error, message) {
            baseThrows(false, block, error, message);
        },
        /**
     * Tests if value is not a falsy value, throws if it is a truthy value.
     * Useful when testing the first argument, error in callbacks.
     *
     * @param {*} err The value to be tested for truthiness.
     * @throws {*} The value `err` if truthy.
     */
        ifError: function ifError(err) {
            if (err) {
                throw err;
            }
        },
        truncate: {}
    });
    /**
   * Allows `truncate` options of AssertionError to be modified. The
   * `truncate` used is the one from `lodash`.
   *
   * @name truncate
   * @type {Object}
   * @property {number} length=128 The maximum string length.
   * @property {string} omission='' The string to indicate text is omitted.
   * @property {RegExp|string} separator='' The pattern to truncate to.
   * @see https://lodash.com/docs#trunc
   */
    define.properties(assertIt.truncate, {
        length: 128,
        omission: '',
        separator: ''
    });
}());
},{"deep-equal-x":2,"define-properties-x":33,"error-x":41,"is-callable":85,"is-regex":86,"safe-to-string-x":87}],2:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/deep-equal-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/deep-equal-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/deep-equal-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/deep-equal-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/deep-equal-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/deep-equal-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/deep-equal-x" title="npm version">
 * <img src="https://badge.fury.io/js/deep-equal-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * node's deepEqual and deepStrictEqual algorithm.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.2.12
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module deep-equal-x
 */

/*jslint maxlen:80, es6:false, this:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:2,
  maxstatements:45, maxcomplexity:26 */

/*global require, module */

;(function () {
  'use strict';

  var isDate = require('is-date-object');
  var isArguments = require('is-arguments');
  var isPrimitive = require('is-primitive');
  var isObject = require('is-object');
  var isBuffer = require('is-buffer');
  var isString = require('is-string');
  var isError = require('is-error-x');
  var isMap = require('is-map-x');
  var isSet = require('is-set-x');
  var isNil = require('is-nil-x');
  var isRegExp = require('is-regex');
  var pIndexOf = Array.prototype.indexOf;
  var pPush = Array.prototype.push;
  var pPop = Array.prototype.pop;
  var pSlice = Array.prototype.slice;
  var pSome = Array.prototype.some;
  var pFilter = Array.prototype.filter;
  var pSort = Array.prototype.sort;
  var pTest = RegExp.prototype.test;
  var rToString = RegExp.prototype.toString;
  var pCharAt = String.prototype.charAt;
  var pGetTime = Date.prototype.getTime;
  var $Number = Number;
  var $keys = Object.keys;
  var $getPrototypeOf = Object.getPrototypeOf;
  // Check failure of by-index access of string characters (IE < 9)
  // and failure of `0 in boxedString` (Rhino)
  var boxedString = Object('a');
  var hasBoxedStringBug = boxedString[0] !== 'a' || !(0 in boxedString);
  // Used to detect unsigned integer values.
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var hasMapEnumerables = typeof Map === 'function' ? $keys(new Map()) : [];
  var hasSetEnumerables = typeof Set === 'function' ? $keys(new Set()) : [];
  var hasErrorEnumerables;

  try {
    throw new Error('a');
  } catch (e) {
    hasErrorEnumerables = $keys(e);
  }

  /**
   * Checks if `value` is a valid string index. Specifically for boxed string
   * bug fix and not general purpose.
   *
   * @private
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is valid index, else `false`.
   */
  function isIndex(value) {
    var num = -1;
    if (pTest.call(reIsUint, value)) {
      num = $Number(value);
    }
    return num > -1 && num % 1 === 0 && num < 4294967295;
  }

  /**
   * Get an object's key avoiding boxed string bug. Specifically for boxed
   * string bug fix and not general purpose.
   *
   * @private
   * @param {Object} object The object to get the `value` from.
   * @param {string} key The `key` reference to the `value`.
   * @param {boolean} isStr Is the object a string.
   * @param {boolean} isIdx Is the `key` a character index.
   * @return {*} Returns the `value` referenced by the `key`.
   */
  function getItem(object, key, isStr, isIdx) {
    return isStr && isIdx ? pCharAt.call(object, key) : object[key];
  }

  /**
   * Filter `keys` of unwanted Error enumerables. Specifically for Error has
   * unwanted enumerables fix and not general purpose.
   *
   * @private
   * @param {Array} keys The Error object's keys.
   * @param {Array} unwanted The unwanted keys.
   * @returns {Array} Returns the filtered keys.
   */
  function filterUnwanted(keys, unwanted) {
    return unwanted.length ? pFilter.call(keys, function (key) {
      return pIndexOf.call(unwanted, key) < 0;
    }) : keys;
  }

  /**
   * Tests for deep equality. Primitive values are compared with the equal
   * comparison operator ( == ). This only considers enumerable properties.
   * It does not test object prototypes, attached symbols, or non-enumerable
   * properties. This can lead to some potentially surprising results. If
   * `strict` is `true` then Primitive values are compared with the strict
   * equal comparison operator ( === ).
   *
   * @private
   * @param {*} actual First comparison object.
   * @param {*} expected Second comparison object.
   * @param {boolean} [strict] Comparison mode. If set to `true` use `===`.
   * @param {Object} previousStack The circular stack.
   * @return {boolean} `true` if `actual` and `expected` are deemed equal,
   *  otherwise `false`.
   */
  function baseDeepEqual(actual, expected, strict, previousStack) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    }
    if (isBuffer(actual) && isBuffer(expected)) {
      return actual.length === expected.length &&
        !pSome.call(actual, function (item, index) {
          return item !== expected[index];
        });
    }

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    if (isDate(actual) && isDate(expected)) {
      return pGetTime.call(actual) === pGetTime.call(expected);
    }

    // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same `source` and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase` & `sticky`).
    if (isRegExp(actual) && isRegExp(expected)) {
      return rToString.call(actual) === rToString.call(expected) &&
        actual.lastIndex === expected.lastIndex;
    }

    // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by == or strict ===.
    if (!isObject(actual) && !isObject(expected)) {
      /*jshint eqeqeq:false */
      return strict ? actual === expected : actual == expected;
    }

    // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
    if (isNil(actual) || isNil(expected)) {
      return false;
    }
    /*jshint eqnull:false */
    // This only considers enumerable properties. It does not test object
    // prototypes, attached symbols, or non-enumerable properties. This can
    // lead to some potentially surprising results.
    if (strict && $getPrototypeOf(actual) !== $getPrototypeOf(expected)) {
      return false;
    }
    // if one is actual primitive, the other must be same
    if (isPrimitive(actual) || isPrimitive(expected)) {
      return actual === expected;
    }
    var ka = isArguments(actual);
    var kb = isArguments(expected);
    if (ka && !kb || !ka && kb) {
      return false;
    }
    if (ka) {
      if (ka.length !== kb.length) {
        return false;
      }
      return baseDeepEqual(
        pSlice.call(actual),
        pSlice.call(expected),
        strict,
        null
      );
    }
    ka = $keys(actual);
    kb = $keys(expected);
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length !== kb.length) {
      return false;
    }
    if (isObject(actual)) {
      if (isError(actual)) {
        ka = filterUnwanted(ka, hasErrorEnumerables);
      } else if (isMap(actual)) {
        ka = filterUnwanted(ka, hasMapEnumerables);
      } else if (isSet(actual)) {
        ka = filterUnwanted(ka, hasSetEnumerables);
      }
    }
    if (isObject(expected)) {
      if (isError(expected)) {
        kb = filterUnwanted(kb, hasErrorEnumerables);
      } else if (isMap(expected)) {
        kb = filterUnwanted(kb, hasMapEnumerables);
      } else if (isSet(expected)) {
        kb = filterUnwanted(kb, hasSetEnumerables);
      }
    }
    //the same set of keys (although not necessarily the same order),
    pSort.call(ka);
    pSort.call(kb);
    var aIsString, bIsString;
    if (hasBoxedStringBug) {
      aIsString = isString(actual);
      bIsString = isString(expected);
    }
    //~~~cheap key test
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    return !pSome.call(ka, function (key, index) {
      if (key !== kb[index]) {
        return true;
      }
      var isIdx = (aIsString || bIsString) && isIndex(key);
      var stack = previousStack ? previousStack : [actual];
      var item = getItem(actual, key, aIsString, isIdx);
      var isPrim = isPrimitive(item);
      if (!isPrim) {
        if (pIndexOf.call(stack, item) > -1) {
          throw new RangeError('Circular object');
        }
        pPush.call(stack, item);
      }
      var result = !baseDeepEqual(
        item,
        getItem(expected, key, bIsString, isIdx),
        strict,
        stack
      );
      if (!isPrim) {
        pPop.call(stack);
      }
      return result;
    });
  }

  /**
   * Tests for deep equality. Primitive values are compared with the equal
   * comparison operator ( == ). This only considers enumerable properties.
   * It does not test object prototypes, attached symbols, or non-enumerable
   * properties. This can lead to some potentially surprising results. If
   * `strict` is `true` then Primitive values are compared with the strict
   * equal comparison operator ( === ).
   *
   * @param {*} actual First comparison object.
   * @param {*} expected Second comparison object.
   * @param {boolean} [strict] Comparison mode. If set to `true` use `===`.
   * @return {boolean} `true` if `actual` and `expected` are deemed equal,
   *  otherwise `false`.
   * @see https://nodejs.org/api/assert.html
   * @example
   * var deepEqual = require('deep-equal-x');
   *
   * deepEqual(Error('a'), Error('b'));
   * // => true
   * // This does not return `false` because the properties on the  Error object
   * // are non-enumerable:
   *
   * deepEqual(4, '4');
   * // => true
   *
   * deepEqual({ a: 4, b: '1' }, {  b: '1', a: 4 });
   * // => true
   *
   * deepEqual(new Date(), new Date(2000, 3, 14));
   * // => false
   *
   * deepEqual(4, '4', true);
   * // => false
   */
  module.exports = function deepEqual(actual, expected, strict) {
    return baseDeepEqual(actual, expected, strict);
  };
}());

},{"is-arguments":3,"is-buffer":4,"is-date-object":5,"is-error-x":6,"is-map-x":11,"is-nil-x":19,"is-object":22,"is-primitive":23,"is-regex":86,"is-set-x":24,"is-string":32}],3:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

var isStandardArguments = function isArguments(value) {
	return toStr.call(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		toStr.call(value) !== '[object Array]' &&
		toStr.call(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{}],4:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],5:[function(require,module,exports){
'use strict';

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

},{}],6:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-error-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-error-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-error-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-error-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-error-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-error-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-error-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-error-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isError module. Detect whether a value is an error.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.13
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-error-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:10, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var toStringTag = require('to-string-tag-x');
  var isObjectLike = require('is-object-like');
  var $getPrototypeOf = Object.getPrototypeOf;
  var errorCheck = function checkIfError(value) {
    return toStringTag(value) === '[object Error]';
  };

  if (!errorCheck(Error.prototype)) {
    var errorProto = Error.prototype;
    var testStringTag = errorCheck;
    errorCheck = function checkIfError(value) {
      return value === errorProto || testStringTag(value);
    };
  }

  /**
   * Determine whether or not a given `value` is an `Error` type.
   *
   * @param {*} value The object to be tested.
   * @return {boolean} Returns `true` if `value` is an `Error` type,
   *  else `false`.
   * @example
   * var isError = require('is-error-x');
   *
   * isError(); // false
   * isError(Number.MIN_VALUE); // false
   * isError('abc'); // false
   * isError(new Error()); //true
   */
  module.exports = function isError(value) {
    if (!isObjectLike(value)) {
      return false;
    }
    var object = value;
    var maxLoop = 100;
    while (object && maxLoop > -1) {
      if (errorCheck(object)) {
        return true;
      }
      object = $getPrototypeOf(object);
      maxLoop -= 1;
    }
    return false;
  };
}());

},{"is-object-like":7,"to-string-tag-x":8}],7:[function(require,module,exports){
'use strict'

module.exports = function isObjectLike (value) {
  return (typeof value === 'object' || typeof value === 'function') && value !== null
}

},{}],8:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/to-string-tag-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/to-string-tag-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-tag-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-tag-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-string-tag-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/to-string-tag-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/to-string-tag-x" title="npm version">
 * <img src="https://badge.fury.io/js/to-string-tag-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Get an object's @@toStringTag. Includes fixes to correct ES3 differences
 * for the following.
 * - undefined => '[object Undefined]'
 * - null => '[object Null]'
 *
 * No other fixes are included, so legacy `arguments` will
 * give `[object Object]`, and many older native objects
 * give `[object Object]`. There are also other environmental bugs
 * for example `RegExp` gives `[object Function]` and `Uint8Array`
 * gives `[object Object]` on certain engines. While these and more could
 * be fixed, it was decided that this should be a very raw version and it
 * is left to the coder to use other `is` implimentations for detection.
 * It is also worth noting that as of ES6 `Symbol.toStringTag` can be set on
 * an object and therefore can report any string that it wishes.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.11
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-string-tag-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:6, maxcomplexity:3 */

/*global module */

;(function () {
  'use strict';

  var pToString = Object.prototype.toString;
  var isNull = require('lodash.isnull');
  var isUndefined = require('validate.io-undefined');
  var nullTag = '[object Null]';
  var undefTag = '[object Undefined]';

  /**
   * The `toStringTag` method returns "[object type]", where type is the
   * object type.
   *
   * @param {*} value The object of which to get the object type string.
   * @return {string} The object type string.
   * @example
   * var o = new Object();
   *
   * toStringTag(o); // returns '[object Object]'
   */
  module.exports = function toStringTag(value) {
    if (isNull(value)) {
      return nullTag;
    }
    if (isUndefined(value)) {
      return undefTag;
    }
    return pToString.call(value);
  };
}());

},{"lodash.isnull":9,"validate.io-undefined":10}],9:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],10:[function(require,module,exports){
/**
*
*	VALIDATE: undefined
*
*
*	DESCRIPTION:
*		- Validates if a value is undefined.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

'use strict';

/**
* FUNCTION: isUndefined( value )
*	Validates if a value is undefined.
*
* @param {*} value - value to be validated
* @returns {Boolean} boolean indicating whether value is undefined
*/
function isUndefined( value ) {
	return value === void 0;
} // end FUNCTION isUndefined()


// EXPORTS //

module.exports = isUndefined;

},{}],11:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-map-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-map-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-map-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-map-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-map-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-map-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-map-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-map-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isMap module. Detect whether or not an object is an ES6 Map.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.13
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-map-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike, getSize;

  if (typeof Map === 'function') {
    try {
      getSize = Object.getOwnPropertyDescriptor(Map.prototype, 'size').get;
      getSize = typeof getSize.call(new Map()) === 'number' && getSize;
      isObjectLike = require('is-object-like-x');
    } catch (ignore) {
      getSize = null;
    }
  }

  /**
   * Determine if an `object` is a `Map`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `Map`,
   *  else false`
   * @example
   * var isMap = require('is-map-x');
   * var m = new Map();
   *
   * isMap([]); // false
   * isMap(true); // false
   * isMap(m); // true
   */
  module.exports = function isMap(object) {
    if (!getSize || !isObjectLike(object)) {
      return false;
    }
    try {
      return typeof getSize.call(object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"is-object-like-x":12}],12:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-object-like-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-object-like-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-object-like-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-object-like-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-object-like-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-object-like-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-object-like-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-object-like-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * ES6 isObjectLike module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.11
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-object-like-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:3, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  var isFunction = require('is-function-x');
  var isPrimitive = require('is-primitive');

  /**
   * Checks if `value` is object-like. A value is object-like if it's not a
   * primitive and not a function.
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   * var isObjectLike = require('is-object-like-x');
   *
   * isObjectLike({});
   * // => true
   *
   * isObjectLike([1, 2, 3]);
   * // => true
   *
   * isObjectLike(_.noop);
   * // => false
   *
   * isObjectLike(null);
   * // => false
   */
  module.exports = function isObjectLike(value) {
    return !isPrimitive(value) && !isFunction(value);
  };
}());

},{"is-function-x":13,"is-primitive":23}],13:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-function-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/is-function-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-function-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-function-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-function-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-function-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-function-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-function-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isFunction module. Determine whether a given value is a function object.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.6
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-function-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var fToString = Function.prototype.toString;
  var toStringTag = require('to-string-tag-x');
  var hasToStringTag = require('has-to-string-tag-x');
  var isPrimitive = require('is-primitive');
  var funcTag = '[object Function]';
  var genTag = '[object GeneratorFunction]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @private
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is correctly classified,
   * else `false`.
   */
  function tryFunctionObject(value) {
    try {
      fToString.call(value);
      return true;
    } catch (ignore) {}
    return false;
  }

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @param {*} value The value to check.
   * @return {boolean} Returns `true` if `value` is correctly classified,
   * else `false`.
   * @example
   * var isFunction = require('is-function-x');
   *
   * isFunction(); // false
   * isFunction(Number.MIN_VALUE); // false
   * isFunction('abc'); // false
   * isFunction(true); // false
   * isFunction({ name: 'abc' }); // false
   * isFunction(function () {}); // true
   * isFunction(new Function ()); // true
   * isFunction(function* test1() {}); // true
   * isFunction(function test2(a, b) {}); // true
   * isFunction(class Test {}); // true
   * isFunction((x, y) => {return this;}); // true
   */
  module.exports = function isFunction(value) {
    if (isPrimitive(value)) {
      return false;
    }
    if (hasToStringTag) {
      return tryFunctionObject(value);
    }
    var strTag = toStringTag(value);
    return strTag === funcTag || strTag === genTag;
  };
}());

},{"has-to-string-tag-x":14,"is-primitive":23,"to-string-tag-x":16}],14:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/has-to-string-tag-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/has-to-string-tag-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/has-to-string-tag-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/has-to-string-tag-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/has-to-string-tag-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/has-to-string-tag-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/has-to-string-tag-x" title="npm version">
 * <img src="https://badge.fury.io/js/has-to-string-tag-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * hasToStringTag tests if @@toStringTag is supported. `true` if supported.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.10
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-to-string-tag-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:1, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  /**
   * Indicates if `Symbol.toStringTag`exists and is the correct type.
   * `true`, if it exists and is the correct type, otherwise `false`.
   *
   * @type boolean
   */
  module.exports = require('has-symbol-support-x') &&
    typeof Symbol.toStringTag === 'symbol';
}());

},{"has-symbol-support-x":15}],15:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/has-symbol-support-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/has-symbol-support-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/has-symbol-support-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/has-symbol-support-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/has-symbol-support-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/has-symbol-support-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/has-symbol-support-x" title="npm version">
 * <img src="https://badge.fury.io/js/has-symbol-support-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * hasSymbolSupport module. Tests if `Symbol` exists and creates the correct
 * type.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.11
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module has-symbol-support-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:1, maxcomplexity:1 */

/*global module */

;(function () {
  'use strict';

  /**
   * Indicates if `Symbol`exists and creates the correct type.
   * `true`, if it exists and creates the correct type, otherwise `false`.
   *
   * @type boolean
   */
  module.exports = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
}());

},{}],16:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":17,"validate.io-undefined":18}],17:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],18:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],19:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-nil-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-nil-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-nil-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-nil-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-nil-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-nil-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-nil-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-nil-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isNil module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.10
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-nil-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:3, maxcomplexity:2 */

/*global module */

;(function () {
  'use strict';

  var isUndefined = require('validate.io-undefined');
  var isNull = require('lodash.isnull');

  /**
   * Checks if `value` is `null` or `undefined`.
   *
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
   * @example
   *
   * _.isNil(null);
   * // => true
   *
   * _.isNil(void 0);
   * // => true
   *
   * _.isNil(NaN);
   * // => false
   */
  module.exports = function isNil(value) {
    return isNull(value) || isUndefined(value);
  };
}());

},{"lodash.isnull":20,"validate.io-undefined":21}],20:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],21:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],22:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],23:[function(require,module,exports){
/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

// see http://jsperf.com/testing-value-is-primitive/7
module.exports = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

},{}],24:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-set-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-set-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-set-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-set-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-set-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-set-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-set-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-set-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isSet module. Detect whether or not an object is an ES6 SET.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.11
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-set-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:8, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike, getSize;

  if (typeof Set === 'function') {
    try {
      getSize = Object.getOwnPropertyDescriptor(Set.prototype, 'size').get;
      getSize = typeof getSize.call(new Set()) === 'number' && getSize;
      isObjectLike = require('is-object-like-x');
    } catch (ignore) {
      getSize = null;
    }
  }

  /**
   * Determine if an `object` is a `Set`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `Set`,
   *  else false`
   * @example
   * var isSet = require('is-set-x');
   * var s = new Set();
   *
   * isSet([]); // false
   * isSet(true); // false
   * isSet(s); // true
   */
  module.exports = function isSet(object) {
    if (!getSize || !isObjectLike(object)) {
      return false;
    }
    try {
      return typeof getSize.call(object) === 'number';
    } catch (ignore) {}

    return false;
  };
}());

},{"is-object-like-x":25}],25:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is-function-x":26,"is-primitive":23}],26:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13,"has-to-string-tag-x":27,"is-primitive":23,"to-string-tag-x":29}],27:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14,"has-symbol-support-x":28}],28:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],29:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":30,"validate.io-undefined":31}],30:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],31:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],32:[function(require,module,exports){
'use strict';

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isString(value) {
	if (typeof value === 'string') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};

},{}],33:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/define-properties-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/define-properties-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/define-properties-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/define-properties-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/define-properties-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/define-properties-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/define-properties-x" title="npm version">
 * <img src="https://badge.fury.io/js/define-properties-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Based on the original work by Jordan Harband
 * {@link https://www.npmjs.com/package/define-properties `define-properties`}.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.1.4
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module define-properties-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:4, maxdepth:2,
  maxstatements:12, maxcomplexity:3 */

/*global module */

;(function () {
  'use strict';

  var hasSymbols = require('has-symbol-support-x');
  var isFunction = require('is-function-x');
  var isUndefined = require('validate.io-undefined');
  var pConcat = Array.prototype.concat;
  var pForEach = Array.prototype.forEach;
  var $keys = Object.keys;
  var $getOwnPropertySymbols = isFunction(Object.getOwnPropertySymbols) &&
    Object.getOwnPropertySymbols;
  var $defineProperty = isFunction(Object.defineProperty) &&
    Object.defineProperty;
  var supportsDescriptors = Boolean($defineProperty) && (function (unused) {
    var obj = {};
    try {
      $defineProperty(obj, 'x', {
        enumerable: false,
        value: obj
      });
      for (unused in obj) {
        /*jshint forin:false */
        return false;
      }
      return obj.x === obj;
    } catch (e) { /* this is IE 8. */
      return false;
    }
  })();

  /**
   * Method `property`.
   *
   * @private
   * @param {Object} object The object on which to define the property.
   * @param {string|Symbol} prop The property name.
   * @param {*} value The value of the property.
   * @param {boolean} [force=false] If `true` then set property regardless.
   */
  function property(object, prop, value, force) {
    if (prop in object && !force) {
      return;
    }
    if (supportsDescriptors) {
      $defineProperty(object, prop, {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
      });
    } else {
      object[prop] = value;
    }
  }

  /**
   * Method `properties`.
   *
   * @private
   * @param {Object} object The object on which to define the property.
   * @param {Object} map The object of properties.
   * @param {Object} [predicates] The object of property predicates.
   */
  function properties(object, map, predicates) {
    var preds = isUndefined(predicates) ? {} : predicates;
    var props = $keys(map);
    if (hasSymbols && $getOwnPropertySymbols) {
      props = pConcat.call(props, $getOwnPropertySymbols(map));
    }
    pForEach.call(props, function (name) {
      var predicate = preds[name];
      property(
        object,
        name,
        map[name],
        isFunction(predicate) && predicate()
      );
    });
  }

  properties(module.exports, {
    /**
     * Just like `properties` but for defining a single non-enumerable
     * property. Useful in environments that do not
     * support `Computed property names`. This can be done
     * with `properties`, but this method can read a little cleaner.
     *
     * @function
     * @param {Object} object The object on which to define the property.
     * @param {string|Symbol} prop The property name.
     * @param {*} value The value of the property.
     * @param {boolean} [force=false] If `true` then set property regardless.
     * @example
     * var define = require('define-properties-x');
     * var myString = 'something';
     * define.property(obj, Symbol.iterator, function () {}, true);
     * define.property(obj, myString, function () {}, true);
     */
    property: property,
    /**
     * Define multiple non-enumerable properties at once.
     * Uses `Object.defineProperty` when available; falls back to standard
     * assignment in older engines. Existing properties are not overridden.
     * Accepts a map of property names to a predicate that, when true,
     * force-overrides.
     *
     * @function
     * @param {Object} object The object on which to define the property.
     * @param {Object} map The object of properties.
     * @param {Object} [predicates] The object of property predicates.
     * @example
     * var define = require('define-properties-x');
     * define.properties({
     *   a: 1,
     *   b: 2
     * }, {
     *   a: function () { return false; },
     *   b: function () { return true; }
     * });
     */
    properties: properties,
    /**
     * Boolean indicator as to whether the environments supports descriptors
     * or not.
     *
     * @type boolean
     * @example
     * var define = require('define-properties-x');
     * define.supportsDescriptors; // true or false
     */
    supportsDescriptors: supportsDescriptors
  });
}());

},{"has-symbol-support-x":34,"is-function-x":35,"validate.io-undefined":40}],34:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],35:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13,"has-to-string-tag-x":36,"is-primitive":37,"to-string-tag-x":38}],36:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14,"has-symbol-support-x":34}],37:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],38:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":39,"validate.io-undefined":40}],39:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],40:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],41:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/error-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/error-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/error-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/error-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/error-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/error-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/error-x" title="npm version">
 * <img src="https://badge.fury.io/js/error-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Create custom Javascript Error objects.
 *
 * Want to create your own Error objects, this module will allow you to do
 * just that. It ships with all the standard Error objects already created
 * for you. Why? Well, these offer some improvements over the native versions.
 * - They have a `toJSON` method and so they can be serialised.
 * - They have a standardised `stack` property, using
 * [`error-stack-parser`](https://github.com/stacktracejs/error-stack-parser)
 * messages and stacks are parsed and then re-formatted.
 * - They have a `frames` property which is an array of the parsed `stack`
 * message, so you have easy access to the information.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @example
 * var errorX = require('error-x');
 * var MyError = errorX.create('MyError'); // Uses `Error` as no constructor
 *                                         // specified.
 * var err = new MyError('somethingHappened');
 *
 * JSON.stringify(err); // => see below.
 * // A searialised error, showing the custom error object's structure and
 * // format
 * {
 *   "name": "MyError",
 *   "message": "somethingHappened",
 *   "frames": [
 *     {
 *       "functionName": "Y.x",
 *       "fileName": "http://fiddle.jshell.net/2k5x5dj8/183/show/",
 *       "lineNumber": 65,
 *       "columnNumber": 13,
 *       "source": "Y.x (http://fiddle.jshell.net/2k5x5dj8/183/show/:65:13)"
 *     },
 *     {
 *       "functionName": "window.onload",
 *       "fileName": "http://fiddle.jshell.net/2k5x5dj8/183/show/",
 *       "lineNumber": 73,
 *       "columnNumber": 3,
 *       "source": "window.onload (http://fiddle.jshell.net/2k5x5dj8/183/show/:73:3)"
 *     }
 *   ],
 *   "stack": "MyError\n    Y.x()@http://fiddle.jshell.net/2k5x5dj8/183/show/:65:13\n    window.onload()@http://fiddle.jshell.net/2k5x5dj8/183/show/:73:3"
 * }
 *
 * @version 1.3.12
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module error-x
 */

/*jslint maxlen:80, esversion:6, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:4, maxdepth:3,
  maxstatements:38, maxcomplexity:7 */

/*global require, module */

;(function () {
  'use strict';

  var $create = Object.create;
  var $toStringTag = require('has-to-string-tag-x') && Symbol.toStringTag;
  var pMap = Array.prototype.map;
  var pJoin = Array.prototype.join;
  var pSlice = Array.prototype.slice;
  var pIndexOf = String.prototype.indexOf;
  var pTrim = String.prototype.trim;
  var safeToString = require('safe-to-string-x');
  var StackFrame = require('stackframe');
  var errorStackParser = require('error-stack-parser');
  var define = require('define-properties-x');
  var CircularJSON = require('circular-json');
  var pFindIndex = Array.prototype.findIndex;
  var isCallable = require('is-callable');
  var inspect = require('inspect-x');
  var truncate = require('./truncate.js');
  var isError = require('is-error-x');
  var isNil = require('is-nil-x');
  var isUndefined = require('validate.io-undefined');
  var toLength = require('to-length-x');
  var ERROR = Error;
  var cV8 = ERROR.captureStackTrace && (function () {
      // Capture the function (if any).
      var captureStackTrace = ERROR.captureStackTrace;
      // Test to see if the function works.
      try {
        captureStackTrace(new ERROR(), captureStackTrace);
      } catch (ignore) {
        return false;
      }
      /**
       * The stack preparation function for the V8 stack.
       *
       * @private
       * @param {*} ignore Unused argument.
       * @param {!Object} thisStack The V8 stack.
       * @return {!Object} The V8 stack.
       */
      function prepareStackTrace(ignore, thisStack) {
        return thisStack;
      }
      /**
       * Captures the V8 stack and converts it to an array of Stackframes.
       *
       * @private
       * @function captureV8
       * @param {!Object} context The Custom Error this object.
       * @return {!Array.<!Object>} Array of StackFrames.
       */
      return function captureV8(context) {
        var temp = ERROR.prepareStackTrace;
        ERROR.prepareStackTrace = prepareStackTrace;
        var error = new ERROR();
        captureStackTrace(error, context.constructor);
        var frames = pMap.call(error.stack, function (frame) {
          return new StackFrame(
            frame.getFunctionName(),
            void 0,
            frame.getFileName(),
            frame.getLineNumber(),
            frame.getColumnNumber(),
            frame.toString()
          );
        });
        if (isUndefined(temp)) {
          delete ERROR.prepareStackTrace;
        } else {
          ERROR.prepareStackTrace = temp;
        }
        return frames;
      };
    }(ERROR));
  var allCtrs = true;

  /**
   * For use with define.properties, a predicate that returns `true`.
   *
   * @private
   * @return {boolean} `true`.
   */
  function truePredicate() {
    return true;
  }

  /**
   * Defines frames and stack on the Custom Error this object.
   *
   * @private
   * @param {!Object} context The Custom Error this object.
   * @param {!Array.<!Object>} frames Array of StackFrames.
   * @param {string} name The name of the constructor.
   */
  function defContext(context, frames, name) {
    define.properties(context, {
      frames: frames,
      stack: name + '\n    ' +
        pJoin.call(pMap.call(frames, function (frame) {
          return frame.toString();
        }), '\n    ')
    }, {
      frames: truePredicate,
      stack: truePredicate
    });
  }

  /**
   * Captures the other stacks and converts them to an array of Stackframes.
   *
   * @private
   * @param {!Object} context The Custom Error this object.
   * @param {!Object} err The Error object to be parsed.
   * @param {string} name The name of the constructor.
   * @return {boolean} True if the Error object was parsed, otherwise false.
   */
  function errParse(context, err, name) {
    var frames;
    try {
      frames = errorStackParser.parse(err);
    } catch (ignore) {
      return false;
    }
    var start = pFindIndex.call(frames, function (frame) {
      return pIndexOf.call(
        typeof frame.functionName === 'string' ? frame.functionName : '',
        name
      ) > -1;
    });
    if (start > -1) {
      var item = frames[start];
      frames = pSlice.call(frames, start + 1);
      var end = pFindIndex.call(frames, function (frame) {
        return item.source === frame.source;
      });
      if (end > -1) {
        frames = pSlice.call(frames, 0, end);
      }
    }
    defContext(context, frames, name);
    return true;
  }

  /**
   * The main function for capturing and parsing stacks and setting properties
   * on Custom Error.
   *
   * @private
   * @param {!Object} context The Custom Error this object.
   * @param {string} name The name of the constructor.
   */
  function parse(context, name) {
    var err;
    if (cV8) {
      defContext(context, cV8(context), name);
    } else {
      try {
        // Error must be thrown to get stack in IE
        throw ERROR();
      } catch (e) {
        err = e;
      }
      if (!errParse(context, err, name)) {
        // If `Error` has a non-standard `stack`, `stacktrace` or
        // `opera#sourceloc` property that offers a trace of which functions
        // were called, in what order, from which line and  file, and with what
        // argument, then we will set it.
        if (!isUndefined(err['opera#sourceloc'])) {
          define.property(
            context,
            'opera#sourceloc',
            err['opera#sourceloc'],
            true
          );
        }
        if (!isUndefined(err.stacktrace)) {
          define.property(context, 'stacktrace', err.stacktrace, true);
        }
        if (!isUndefined(err.stack)) {
          define.property(context, 'stack', err.stack, true);
        }
        define.property(context, 'frames', [], true);
      }
    }
  }

  /**
   * Test whether we have a valid Error constructor.
   *
   * @private
   * @param {Function} ErrorCtr Constructor to test it creates an Error.
   * @return {boolean} True if ErrorCtr creates an Error, otherwise false.
   */
  function isErrorCtr(ErrorCtr) {
    if (isCallable(ErrorCtr)) {
      try {
        return isError(new ErrorCtr({}));
      } catch (ignore) {}
    }
    return false;
  }

  /**
   * Detect whether we are creating an 'AssertionError' constructor.
   *
   * @private
   * @param {string} name Name to test if it is 'AssertionError'.
   * @param {Function} ErrorCtr Constructor to test it creates ASSERTIONERROR.
   * @return {boolean} True if either arguments asserts, otherwise false.
   */
  function asAssertionError(name, ErrorCtr) {
    if (name === 'AssertionError') {
      return true;
    }
    if (isErrorCtr(ErrorCtr)) {
      var err = new ErrorCtr({
        message: 'a',
        actual: 'b',
        expected: 'c',
        operator: 'd'
      });
      return typeof err.name === 'string' &&
        err.message === 'a' &&
        err.actual === 'b' &&
        err.expected === 'c' &&
        err.operator === 'd';
    }
    return false;
  }

  /**
   * Message generator for AssertionError.
   *
   * @private
   * @param {!Object} message The message object.
   * @return {string} The generated message.
   */
  function getMessage(message) {
    var opts = {
      length: message.length ? toLength(message.length) : 128,
      separator: message.separator ? safeToString(message.separator) : '',
      omission: message.omission ? safeToString(message.omission) : ''
    };
    return truncate(inspect(message.actual), opts) + ' ' +
      message.operator + ' ' +  truncate(inspect(message.expected), opts);
  }

  /**
   * The toJSON method returns a string representation of the Error object.
   *
   * @private
   * @this {!Object} A custom error instance.
   * @return {string} A JSON stringified representation.
   */
  function toJSON() {
    /*jshint validthis:true */
    return CircularJSON.stringify({
      name: this.name,
      message: this.message,
      frames: this.frames,
      stack: this.stack,
      stackframe: this.stackframe,
      'opera#sourceloc': this['opera#sourceloc'],
      actual: this.actual,
      expected: this.expected,
      operator: this.operator
    });
  }

  /**
   * Initialise a new instance of a custom error.
   *
   * @private
   * @param {!Object} context The Custom Error this object.
   * @param {string} message Human-readable description of the error.
   * @param {string} name The name for the custom Error.
   * @param {Function} [ErrorCtr=Error] Error constructor to be used.
   */
  function init(context, message, name, ErrorCtr) {
    if (asAssertionError(name, ErrorCtr)) {
      define.properties(context, {
        actual: message.actual,
        expected: message.expected,
        message: message.message ? message.message : getMessage(message),
        operator: message.operator,
        generatedMessage: !message.message
      }, {
        actual: truePredicate,
        expected: truePredicate,
        message: truePredicate,
        operator: truePredicate,
        generatedMessage: truePredicate
      });
    } else {
      // Standard Errors. Only set `this.message` if the argument `message`
      // was not `undefined`.
      if (!isUndefined(message)) {
        define.property(context, 'message', safeToString(message), true);
      }
    }
    // Parse and set the 'this' properties.
    parse(context, name);
  }

  // `init` is used in `eval`, don't delete.
  init({}, 'message', 'name', ERROR);

  /**
   * Creates a custom Error constructor. Will use `Error` if argument is not
   * a valid constructor.
   *
   * @private
   * @param {string} [name='CustomError'] The name for the custom Error.
   * @param {Function} [ErrorCtr=Error] Error constructor to be used.
   * @return {Function} The custom Error constructor.
   */
  function create(name, ErrorCtr) {
    /*jshint eqnull:true */
    var customName = isNil(name) ? 'CustomError' : name,
      CstmCtr;
    /*jshint eqnull:false */

    if (customName !== 'CustomError') {
      try {
        customName = pTrim.call(safeToString(customName));
        /*jshint evil:true */
        eval('(function ' + customName + ' () {})');
        /*jshint evil:false */
      } catch (ignore) {
        customName = 'CustomError';
      }
    }

    if (!allCtrs || !isErrorCtr(ErrorCtr)) {
      ErrorCtr = ERROR;
    }

    /**
     * Create a new object, that prototypally inherits from the `Error`
     * constructor.
     *
     * @private
     * @constructor CstmCtr
     * @augments Error
     * @param {string} [message] Human-readable description of the error.
     */
    /*jshint evil:true */
    CstmCtr = eval(
      '(0,function ' + customName + ' (message){' +
      'if(!(this instanceof CstmCtr)){return new CstmCtr(message);}' +
      'init(this,message,customName,ErrorCtr);})');
    /*jshint evil:false */

    // Inherit the prototype methods from `ErrorCtr`.
    CstmCtr.prototype = $create(ErrorCtr.prototype);
    define.properties(CstmCtr.prototype, /** @lends module:error-x.CstmCtr.prototype */ {
      /**
       * Specifies the function that created an instance's prototype.
       *
       * @constructor
       */
      constructor: CstmCtr,
      /**
       * The name property represents a name for the type of error.
       *
       * @default 'Error'
       * @type {string}
       */
      name: customName,
      /**
       * The toJSON method returns a string representation of the Error object.
       *
       * @return {string} A JSON stringified representation.
       */
      toJSON: toJSON
    }, {
      constructor: truePredicate,
      name: truePredicate,
      toJSON: truePredicate
    });
    if ($toStringTag) {
      /**
       * name Symbol.toStringTag
       * @memberof module:error-x.CstmCtr.prototype
       * @type {string}
       */
      define.property(
        CstmCtr.prototype,
        $toStringTag,
        '[object Error]',
        true
      );
    }
    return CstmCtr;
  }

  // Test if we can use more than just the Error constructor.
  try {
    allCtrs = create('X', SyntaxError)('x') instanceof SyntaxError;
  } catch (ignore) {
    allCtrs = false;
  }

  define.properties(module.exports, {
    /**
    * Indicates if the Javascript engine supports subclassing of all Error
    * types. If `true` then all are supported, if `false` (only very old
    * browsers IE6) then only `Error` is supported.
    *
    * @type boolean
    * */
    supportsAllConstructors: allCtrs,
    /**
     * Creates a custom Error constructor. Will use `Error` if argument is not
     * a valid constructor.
     *
     * @function
     * @param {string} [name='Error'] The name for the custom Error.
     * @param {Function} [ErrorCtr=Error] Error constructor to be used.
     * @return {Function} The custom Error constructor.
     */
    create: create,
    /**
     * The Error constructor creates an error object.
     *
     * @constructor
     * @augments Error
     * @param {string} [message] Human-readable description of the error.
     */
    Error: create('Error', Error),
    /**
     * Creates an instance representing a syntax error that occurs while parsing
     * code in eval().
     *
     * @constructor
     * @augments SyntaError
     * @param {string} [message] Human-readable description of the error.
     */
    SyntaxError: create('SyntaxError', SyntaxError),
    /**
     * Creates an instance representing an error that occurs when a variable or
     * parameter is not of a valid type.
     *
     * @constructor
     * @augments TypeError
     * @param {string} [message] Human-readable description of the error.
     */
    TypeError: create('TypeError', TypeError),
    /**
     * Creates an instance representing an error that occurs when a numeric
     * variable or parameter is outside of its valid range.
     *
     * @constructor
     * @augments RangeError
     * @param {string} [message] Human-readable description of the error.
     */
    RangeError: create('RangeError', RangeError),
    /**
     * Creates an instance representing an error that occurs regarding the
     * global function eval().
     *
     * @constructor
     * @augments EvalError
     * @param {string} [message] Human-readable description of the error.
     */
    EvalError: create('EvalError', EvalError),
    /**
     * Creates an instance representing an error that occurs when de-referencing
     * an invalid reference
     *
     * @constructor
     * @augments ReferenceError
     * @param {string} [message] Human-readable description of the error.
     */
    ReferenceError: create('ReferenceError', ReferenceError),
    /**
     * Creates an instance representing an error that occurs when encodeURI() or
     * decodeURI() are passed invalid parameters.
     *
     * @constructor
     * @augments URIError
     * @param {string} [message] Human-readable description of the error.
     */
    URIError: create('URIError', URIError),
    /**
     * The InternalError object indicates an error that occurred internally in
     * the JavaScript engine. For example: "InternalError: too much recursion".
     *
     * @constructor
     * @augments Error
     * @param {string} [message] Human-readable description of the error.
     */
    InternalError: create('InternalError', Error),
    /**
     * Error constructor for test and validation frameworks that implement the
     * standardized AssertionError specification.
     *
     * @constructor
     * @augments Error
     * @param {Object} [message] Need to document the properties.
     */
    AssertionError: create('AssertionError', Error),
    /**
     * Determine whether or not a given `value` is an `Error` type.
     *
     * @function
     * @param {*} value The object to be tested.
     * @return {boolean} Returns `true` if `value` is an `Error` type,
     *  else `false`.
     */
    isError: isError
  });
}());

},{"./truncate.js":84,"circular-json":42,"define-properties-x":33,"error-stack-parser":43,"has-to-string-tag-x":45,"inspect-x":47,"is-callable":85,"is-error-x":69,"is-nil-x":73,"safe-to-string-x":87,"stackframe":80,"to-length-x":81,"validate.io-undefined":83}],42:[function(require,module,exports){
/*!
Copyright (C) 2013 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var
  // should be a not so common char
  // possibly one JSON does not encode
  // possibly one encodeURIComponent does not encode
  // right now this char is '~' but this might change in the future
  specialChar = '~',
  safeSpecialChar = '\\x' + (
    '0' + specialChar.charCodeAt(0).toString(16)
  ).slice(-2),
  escapedSafeSpecialChar = '\\' + safeSpecialChar,
  specialCharRG = new RegExp(safeSpecialChar, 'g'),
  safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),

  safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),

  indexOf = [].indexOf || function(v){
    for(var i=this.length;i--&&this[i]!==v;);
    return i;
  },
  $String = String  // there's no way to drop warnings in JSHint
                    // about new String ... well, I need that here!
                    // faked, and happy linter!
;

function generateReplacer(value, replacer, resolve) {
  var
    path = [],
    all  = [value],
    seen = [value],
    mapp = [resolve ? specialChar : '[Circular]'],
    last = value,
    lvl  = 1,
    i
  ;
  return function(key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (replacer) value = replacer.call(this, key, value);

    // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check
    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      }
      // console.log(lvl, key, path);
      if (typeof value === 'object' && value) {
    	// if object isn't referring to parent object, add to the
        // object path stack. Otherwise it is already there.
        if (indexOf.call(all, value) < 0) {
          all.push(last = value);
        }
        lvl = all.length;
        i = indexOf.call(seen, value);
        if (i < 0) {
          i = seen.push(value) - 1;
          if (resolve) {
            // key cannot contain specialChar but could be not a string
            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
            mapp[i] = specialChar + path.join(specialChar);
          } else {
            mapp[i] = mapp[0];
          }
        } else {
          value = mapp[i];
        }
      } else {
        if (typeof value === 'string' && resolve) {
          // ensure no special char involved on deserialization
          // in this case only first char is important
          // no need to replace all value (better performance)
          value = value .replace(safeSpecialChar, escapedSafeSpecialChar)
                        .replace(specialChar, safeSpecialChar);
        }
      }
    }
    return value;
  };
}

function retrieveFromPath(current, keys) {
  for(var i = 0, length = keys.length; i < length; current = current[
    // keys should be normalized back here
    keys[i++].replace(safeSpecialCharRG, specialChar)
  ]);
  return current;
}

function generateReviver(reviver) {
  return function(key, value) {
    var isString = typeof value === 'string';
    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }
    if (key === '') value = regenerate(value, value, {});
    // again, only one needed, do not use the RegExp for this replacement
    // only keys need the RegExp
    if (isString) value = value .replace(safeStartWithSpecialCharRG, '$1' + specialChar)
                                .replace(escapedSafeSpecialChar, safeSpecialChar);
    return reviver ? reviver.call(this, key, value) : value;
  };
}

function regenerateArray(root, current, retrieve) {
  for (var i = 0, length = current.length; i < length; i++) {
    current[i] = regenerate(root, current[i], retrieve);
  }
  return current;
}

function regenerateObject(root, current, retrieve) {
  for (var key in current) {
    if (current.hasOwnProperty(key)) {
      current[key] = regenerate(root, current[key], retrieve);
    }
  }
  return current;
}

function regenerate(root, current, retrieve) {
  return current instanceof Array ?
    // fast Array reconstruction
    regenerateArray(root, current, retrieve) :
    (
      current instanceof $String ?
        (
          // root is an empty string
          current.length ?
            (
              retrieve.hasOwnProperty(current) ?
                retrieve[current] :
                retrieve[current] = retrieveFromPath(
                  root, current.split(specialChar)
                )
            ) :
            root
        ) :
        (
          current instanceof Object ?
            // dedicated Object parser
            regenerateObject(root, current, retrieve) :
            // value as it is
            current
        )
    )
  ;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}
this.stringify = stringifyRecursion;
this.parse = parseRecursion;
},{}],43:[function(require,module,exports){
(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define('error-stack-parser', ['stackframe'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('stackframe'));
    } else {
        root.ErrorStackParser = factory(root.StackFrame);
    }
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

    function _map(array, fn, thisArg) {
        if (typeof Array.prototype.map === 'function') {
            return array.map(fn, thisArg);
        } else {
            var output = new Array(array.length);
            for (var i = 0; i < array.length; i++) {
                output[i] = fn.call(thisArg, array[i]);
            }
            return output;
        }
    }

    function _filter(array, fn, thisArg) {
        if (typeof Array.prototype.filter === 'function') {
            return array.filter(fn, thisArg);
        } else {
            var output = [];
            for (var i = 0; i < array.length; i++) {
                if (fn.call(thisArg, array[i])) {
                    output.push(array[i]);
                }
            }
            return output;
        }
    }

    function _indexOf(array, target) {
        if (typeof Array.prototype.indexOf === 'function') {
            return array.indexOf(target);
        } else {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === target) {
                    return i;
                }
            }
            return -1;
        }
    }

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
                }
                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = _indexOf(['eval', '<anonymous>'], locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame(line);
                } else {
                    var tokens = line.split('@');
                    var locationParts = this.extractLocation(tokens.pop());
                    var functionName = tokens.join('@') || undefined;
                    return new StackFrame(functionName,
                        undefined,
                        locationParts[0],
                        locationParts[1],
                        locationParts[2],
                        line);
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame(
                            match[3] || undefined,
                            undefined,
                            match[2],
                            match[1],
                            undefined,
                            lines[i]
                        )
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return _map(filtered, function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                        .replace(/<anonymous function(: (\w+))?>/, '$2')
                        .replace(/\([^\)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^\)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');
                return new StackFrame(
                    functionName,
                    args,
                    locationParts[0],
                    locationParts[1],
                    locationParts[2],
                    line);
            }, this);
        }
    };
}));


},{"stackframe":44}],44:[function(require,module,exports){
(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define('stackframe', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.StackFrame = factory();
    }
}(this, function () {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
        if (functionName !== undefined) {
            this.setFunctionName(functionName);
        }
        if (args !== undefined) {
            this.setArgs(args);
        }
        if (fileName !== undefined) {
            this.setFileName(fileName);
        }
        if (lineNumber !== undefined) {
            this.setLineNumber(lineNumber);
        }
        if (columnNumber !== undefined) {
            this.setColumnNumber(columnNumber);
        }
        if (source !== undefined) {
            this.setSource(source);
        }
    }

    StackFrame.prototype = {
        getFunctionName: function () {
            return this.functionName;
        },
        setFunctionName: function (v) {
            this.functionName = String(v);
        },

        getArgs: function () {
            return this.args;
        },
        setArgs: function (v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        // NOTE: Property name may be misleading as it includes the path,
        // but it somewhat mirrors V8's JavaScriptStackTraceApi
        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
        getFileName: function () {
            return this.fileName;
        },
        setFileName: function (v) {
            this.fileName = String(v);
        },

        getLineNumber: function () {
            return this.lineNumber;
        },
        setLineNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Line Number must be a Number');
            }
            this.lineNumber = Number(v);
        },

        getColumnNumber: function () {
            return this.columnNumber;
        },
        setColumnNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Column Number must be a Number');
            }
            this.columnNumber = Number(v);
        },

        getSource: function () {
            return this.source;
        },
        setSource: function (v) {
            this.source = String(v);
        },

        toString: function() {
            var functionName = this.getFunctionName() || '{anonymous}';
            var args = '(' + (this.getArgs() || []).join(',') + ')';
            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
            return functionName + args + fileName + lineNumber + columnNumber;
        }
    };

    return StackFrame;
}));

},{}],45:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14,"has-symbol-support-x":46}],46:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],47:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/inspect-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/inspect-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/inspect-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/inspect-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/inspect-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/inspect-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/inspect-x" title="npm version">
 * <img src="https://badge.fury.io/js/inspect-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * An implementation of node's ES6 inspect module.
 * Return a string representation of object, which is useful for debugging.
 * An optional options object may be passed that alters certain aspects of the
 * fmtted string:
 * - showHidden - if true then the object's non-enumerable and symbol properties
 * will be shown too. Defaults to false.
 * - depth - tells inspect how many times to recurse while fmtting the
 * object. This is useful for inspecting large complicated objects.
 * Defaults to 2. To make it recurse indefinitely pass null.
 * - colors - if true, then the out will be styled with ANSI color codes.
 * Defaults to false. Colors are customizable, see below.
 * - customInspect - if false, then custom inspect(depth, opts) functions
 * defined on the objects being inspected won't be called. Defaults to true.
 *
 * <h2>Customizing inspect colors</h2>
 * Color out (if enabled) of inspect is customizable globally
 * via `inspect.styles` and `inspect.colors` objects.
 *
 * The `inspect.styles` is a map assigning each style a color
 * from `inspect.colors`. Highlighted styles and their default values are:
 * - number (yellow)
 * - boolean (yellow)
 * - string (green)
 * - date (magenta)
 * - regexp (red)
 * - null (bold)
 * - undefined (grey)
 * - special - only function at this time (cyan)
 * - name (intentionally no styling)
 *
 * Predefined color codes are:
 * - white
 * - grey
 * - black
 * - blue
 * - cyan
 * - green
 * - magenta
 * - red
 * - yellow.
 *
 * There are also:
 *  - bold
 *  - italic
 *  - underline
 *  - inverse
 *
 * <h2>Custom inspect() function on Objects</h2>
 * Objects also may define their own `inspect(depth)` function which `inspect`
 * will invoke and use the result of when inspecting the object.
 *
 * You may also return another Object entirely, and the returned String will
 * be fmtted according to the returned Object. This is similar to
 * how JSON.stringify() works.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @example
 * var util = require('inspect-x');
 *
 * var obj = { name: 'nate' };
 * obj.inspect = function(depth) {
 *   return '{' + this.name + '}';
 * };
 *
 * inspect(obj);
 *   // "{nate}"
 *
 * var obj = { foo: 'this will not show up in the inspect() out' };
 * obj.inspect = function(depth) {
 *   return { bar: 'baz' };
 * };
 *
 * inspect(obj);
 *   // "{ bar: 'baz' }"
 * @version 1.0.18
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_options
 * @module inspect-x
 */

/*jslint maxlen:80, esversion:6, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:false, esnext:true, plusplus:true, maxparams:false, maxdepth:false,
  maxstatements:false, maxcomplexity:false */

/*global require, module */

;(function () {
  'use strict';

  var isFunction = require('is-function-x');
  var isRegExp = require('is-regex');
  var define = require('define-properties-x');
  var isDate = require('is-date-object');
  var isArrayBuffer = require('is-array-buffer-x');
  var isSet = require('is-set-x');
  var isMap = require('is-map-x');
  var isTypedArray = require('is-typed-array');
  var isDataView = require('is-data-view-x');
  var isPrimitive = require('is-primitive');
  var isUndefined = require('validate.io-undefined');
  var isNil = require('is-nil-x');
  var isNull = require('lodash.isnull');
  var isError = require('is-error-x');
  var isObjectLike = require('is-object-like-x');
  var isPromise = require('is-promise');
  var isString = require('is-string');
  var isNumber = require('is-number-object');
  var isBoolean = require('is-boolean-object');
  var isNegZero = require('is-negative-zero');
  var getFunctionName = require('get-function-name-x');
  var hasSymbolSupport = require('has-symbol-support-x');
  var reSingle = new RegExp('\\{[' + require('white-space-x').ws + ']+\\}');
  var hasSet = typeof Set === 'function' && isSet(new Set());
  var testSet = hasSet && new Set(['SetSentinel']);
  var sForEach = hasSet && Set.prototype.forEach;
  var sValues = hasSet && Set.prototype.values;
  var hasMap = typeof Map === 'function' && isMap(new Map());
  var testMap = hasMap && new Map([
    [1, 'MapSentinel']
  ]);
  var mForEach = hasMap && Map.prototype.forEach;
  var mValues = hasMap && Map.prototype.values;
  var pSymToStr = hasSymbolSupport && Symbol.prototype.toString;
  var eToStr = Error.prototype.toString;
  var bToStr = Boolean.prototype.toString;
  var nToStr = Number.prototype.toString;
  var rToStr = RegExp.prototype.toString;
  var dToISOStr = Date.prototype.toISOString;
  var sValueOf = String.prototype.valueOf;
  var bValueOf = Boolean.prototype.valueOf;
  var nValueOf = Number.prototype.valueOf;
  var pUnshift = Array.prototype.unshift;
  var pPush = Array.prototype.push;
  var pPop = Array.prototype.pop;
  var pIndexOf = Array.prototype.indexOf;
  var pReduce = Array.prototype.reduce;
  var pJoin = Array.prototype.join;
  var pForEach = Array.prototype.forEach;
  var pSplice = Array.prototype.splice;
  var aSlice = Array.prototype.slice;
  var pConcat = Array.prototype.concat;
  var pReplace = String.prototype.replace;
  var pTest = RegExp.prototype.test;
  var sSlice = String.prototype.slice;
  var sIndexOf = String.prototype.indexOf;
  var $stringify = JSON.stringify;
  var $keys = Object.keys;
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var $getPrototypeOf = Object.getPrototypeOf;
  var $getOwnPropertyNames = Object.getOwnPropertyNames;
  var $getOwnPropertySymbols = hasSymbolSupport && Object.getOwnPropertySymbols;
  var $isArray = Array.isArray;
  var $String = String;
  var $Object = Object;
  var bpe = 'BYTES_PER_ELEMENT';
  var inspectIt, fmtValueIt;

  function isBooleanType(arg) {
    return typeof arg === 'boolean';
  }

  function isNumberType(arg) {
    return typeof arg === 'number';
  }

  function isStringType(arg) {
    return typeof arg === 'string';
  }

  function isSymbolType(arg) {
    return typeof arg === 'symbol';
  }

  function isMapIterator(value) {
    if (!hasMap || !isObjectLike(value)) {
      return false;
    }
    try {
      return value.next.call(mValues.call(testMap)).value === 'MapSentinel';
    } catch (ignore) {}
    return false;
  }

  function isSetIterator(value) {
    if (!hasSet || !isObjectLike(value)) {
      return false;
    }
    try {
      return value.next.call(sValues.call(testSet)).value === 'SetSentinel';
    } catch (ignore) {}
    return false;
  }

  function includes(arr, value) {
    return pIndexOf.call(arr, value) > -1;
  }

  function filterIndexes(keys, length) {
    var i = keys.length - 1;
    while (i > -1) {
      var key = keys[i];
      if (key > -1 && key % 1 === 0 && key < length) {
        pSplice.call(keys, i, 1);
      }
      i -= 1;
    }
  }

  function pushUniq(arr, value) {
    if (!includes(arr, value)) {
      pPush.call(arr, value);
    }
  }

  function unshiftUniq(arr, value) {
    var index = pIndexOf.call(arr, value);
    if (index > -1) {
      pSplice.call(arr, index, 1);
    }
    pUnshift.call(arr, value);
  }

  function stylizeWithColor(str, styleType) {
    var style = inspectIt.styles[styleType];
    if (style) {
      var colors = inspectIt.colors[style];
      return '\u001b[' + colors[0] + 'm' + str + '\u001b[' + colors[1] + 'm';
    }
    return str;
  }

  function stylizeNoColor(str) {
    return str;
  }

  function getNameSep(obj) {
    var name = getFunctionName(obj);
    return name ? ': ' + name : name;
  }

  function each(arrayLike, callback) {
    var l = arrayLike.length;
    var i = 0;
    while (i < l) {
      callback(arrayLike[i], i);
      i += 1;
    }
  }

  function collectionEach(collection, callback) {
    if (isMap(collection)) {
      mForEach.call(collection, callback);
    } else if (isSet(collection)) {
      sForEach.call(collection, callback);
    }
  }

  function getConstructorOf(obj) {
    var maxLoop = 100;
    while (!isNil(obj) && maxLoop > -1) {
      obj = $Object(obj);
      var descriptor = $getOwnPropertyDescriptor(obj, 'constructor');
      if (descriptor && descriptor.value) {
        return descriptor.value;
      }
      obj = $getPrototypeOf(obj);
      maxLoop -= 1;
    }
    return null;
  }

  function fmtNumber(ctx, value) {
    // Format -0 as '-0'.
    return ctx.stylize(isNegZero(value) ? '-0' : nToStr.call(value), 'number');
  }

  function fmtPrimitive(ctx, value) {
    if (isNil(value)) {
      var str = $String(value);
      return ctx.stylize(str, str);
    }
    if (isStringType(value)) {
      var simple = pReplace.call($stringify(value), /^"|"$/g, '');
      simple = pReplace.call(simple, /'/g, '\\\'');
      simple = pReplace.call(simple, /\\"/g, '"');
      return ctx.stylize('\'' + simple + '\'', 'string');
    }
    if (isNumberType(value)) {
      return fmtNumber(ctx, value);
    }
    if (isBooleanType(value)) {
      return ctx.stylize(bToStr.call(value), 'boolean');
    }
    // es6 symbol primitive
    if (isSymbolType(value)) {
      return ctx.stylize(pSymToStr.call(value), 'symbol');
    }
  }

  function fmtPrimNoColor(ctx, value) {
    var stylize = ctx.stylize;
    ctx.stylize = stylizeNoColor;
    var str = fmtPrimitive(ctx, value);
    ctx.stylize = stylize;
    return str;
  }

  function recurse(depth) {
    return isNull(depth) ? null : depth - 1;
  }

  /*
  function isCollection(value) {
    return isSet(value) || isMap(value);
  }
  */

  function isDigits(key) {
    return pTest.call(/^\d+$/, key);
  }

  function fmtProp(ctx, value, depth, visibleKeys, key, arr) {
    var desc = $getOwnPropertyDescriptor(value, key) || {
      value: value[key]
    };

    /*
    // this is a fix for broken FireFox, should not be needed with es6-shim
    if (key === 'size' && isCollection(value) && isFunction(value.size)) {
      desc.value = value.size();
    }
    */

    var name;
    if (!includes(visibleKeys, key)) {
      if (key === bpe && !value[bpe] && isTypedArray(value)) {
        var constructor = getConstructorOf(value);
        if (constructor) {
          desc.value = constructor[bpe];
        }
      } else if (isSymbolType(key)) {
        name = '[' + ctx.stylize(pSymToStr.call(key), 'symbol') + ']';
      } else {
        name = '[' + key + ']';
      }
    }

    var str;
    if (desc.get) {
      str = ctx.stylize(desc.set ? '[Getter/Setter]' : '[Getter]', 'special');
    } else if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    } else if (!includes(ctx.seen, desc.value)) {
      str = fmtValueIt(ctx, desc.value, recurse(depth));
      if (sIndexOf.call(str, '\n') > -1) {
        str = pReplace.apply(str, arr ? [/\n/g, '\n  '] : [/(^|\n)/g, '\n   ']);
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }

    if (isUndefined(name)) {
      if (arr && isDigits(key)) {
        return str;
      }
      name = $stringify(key);
      if (pTest.call(/^"[\w$]+"$/, name)) {
        name = ctx.stylize(sSlice.call(name, 1, -1), 'name');
      } else {
        name = pReplace.call(name, /'/g, '\\\'');
        name = pReplace.call(name, /\\"/g, '"');
        name = pReplace.call(name, /(^"|"$)/g, '\'');
        name = pReplace.call(name, /\\\\/g, '\\');
        name = ctx.stylize(name, 'string');
      }
    }
    return name + ': ' + str;
  }

  function fmtObject(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    pForEach.call(keys, function (key) {
      pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  }

  function fmtArray(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    each(value, function (unused, index) {
      pPush.call(
        out,
        index in value ?
          fmtProp(ctx, value, depth, visibleKeys, nToStr.call(index), true) :
          ''
      );
    });
    pForEach.call(keys, function (key) {
      if (isSymbolType(key) || !isDigits(key)) {
        pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, true));
      }
    });
    return out;
  }

  function fmtTypedArray(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    each(value, function (item) {
      pPush.call(out, fmtNumber(ctx, item));
    });
    pForEach.call(keys, function (key) {
      if (isSymbolType(key) || !isDigits(key)) {
        pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, true));
      }
    });
    return out;
  }

  function fmtSet(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    collectionEach(value, function (v) {
      pPush.call(out, fmtValueIt(ctx, v, recurse(depth)));
    });
    pForEach.call(keys, function (key) {
      pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  }

  function fmtMap(ctx, value, depth, visibleKeys, keys) {
    var out = [];
    collectionEach(value, function (v, k) {
      var r = recurse(depth);
      pPush.call(out, fmtValueIt(ctx, k, r) + ' => ' + fmtValueIt(ctx, v, r));
    });
    pForEach.call(keys, function (key) {
      pPush.call(out, fmtProp(ctx, value, depth, visibleKeys, key, false));
    });
    return out;
  }

  function reduceToSingleString(out, base, braces) {
    var length = pReduce.call(out, function (prev, cur) {
      return prev + pReplace.call(cur, /\u001b\[\d\d?m/g, '').length + 1;
    }, 0);
    var result;
    if (length > 60) {
      result = braces[0] +
        // If the opening "brace" is too large, like in the case of "Set {",
        // we need to force the first item to be on the next line or the
        // items will not line up correctly.
        (base === '' && braces[0].length === 1 ? '' : base + '\n ') + ' ' +
        pJoin.call(out, ',\n  ') + ' ' + braces[1];
    } else {
      result = braces[0] + base + ' ' + pJoin.call(out, ', ') + ' ' + braces[1];
    }
    return pReplace.call(result, reSingle, '{}');
  }

  fmtValueIt = function fmtValue(ctx, value, depth) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect && !isPrimitive(value) &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspectIt &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {

      var ret = value.inspect(depth, ctx);
      if (!isStringType(ret)) {
        return fmtValue(ctx, ret, depth);
      }
      return ret;
    }
    // Primitive types cannot have properties
    var primitive = fmtPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }
    // Look up the keys of the object.
    var visibleKeys = $keys(value);
    var keys;
    if (ctx.showHidden) {
      keys = $getOwnPropertyNames(value);
      if ($getOwnPropertySymbols) {
        keys = pConcat.call(keys, $getOwnPropertySymbols(value));
      }
      if (isError(value)) {
        if (!includes(visibleKeys, 'message') && !includes(keys, 'message')) {
          unshiftUniq(keys, 'message');
        }
        /*
        if (!includes(visibleKeys, 'name') && !includes(keys, 'name')) {
          unshiftUniq(keys, 'name');
        }
        */
      }
    } else {
      keys = aSlice.call(visibleKeys);
    }
    if (isString(value)) {
      // for boxed Strings, we have to remove the 0-n indexed entries,
      // since they just noisey up the out and are redundant
      filterIndexes(keys, value.length);
      filterIndexes(visibleKeys, value.length);
    } else if (isArrayBuffer(value)) {
      filterIndexes(keys, value.byteLength);
      filterIndexes(visibleKeys, value.byteLength);
    }
    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      // This could be a boxed primitive (new String(), etc.)
      if (isString(value)) {
        return ctx.stylize(
          '[String: ' + fmtPrimNoColor(ctx, sValueOf.call(value)) + ']',
          'string'
        );
      }
      if (isNumber(value)) {
        return ctx.stylize(
          '[Number: ' + fmtPrimNoColor(ctx, nValueOf.call(value)) + ']',
          'number'
        );
      }
      if (isBoolean(value)) {
        return ctx.stylize(
          '[Boolean: ' + fmtPrimNoColor(ctx, bValueOf.call(value)) + ']',
          'boolean'
        );
      }
      if (isFunction(value)) {
        return ctx.stylize('[Function' + getNameSep(value) + ']', 'special');
      }
      if (isRegExp(value)) {
        return ctx.stylize(rToStr.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(dToISOStr.call(value), 'date');
      }
      if (isError(value)) {
        return '[' + eToStr.call(value) + ']';
      }
      // Fast path for ArrayBuffer. Can't do the same for DataView because it
      // has a non-primitive buffer property that we need to recurse for.
      if (isArrayBuffer(value)) {
        return 'ArrayBuffer { byteLength: ' +
          fmtNumber(ctx, value.byteLength) + ' }';
      }
      if (isMapIterator(value)) {
        return 'MapIterator {}';
      }
      if (isSetIterator(value)) {
        return 'SetIterator {}';
      }
      if (isPromise(value)) {
        return 'Promise {}';
      }
    }
    var name = getFunctionName(getConstructorOf(value));
    var base = '';
    var empty = false;
    var braces = ['{', '}'];
    var fmtter = fmtObject;
    // We can't compare constructors for various objects using a comparison
    // like `constructor === Array` because the object could have come from a
    // different context and thus the constructor won't match. Instead we check
    // the constructor names (including those up the prototype chain where
    // needed) to determine object types.
    if (isString(value)) {
      // Make boxed primitive Strings look like such
      base = '[String: ' + fmtPrimNoColor(ctx, sValueOf.call(value)) + ']';
    } else if (isNumber(value)) {
      // Make boxed primitive Numbers look like such
      base = '[Number: ' + fmtPrimNoColor(ctx, nValueOf.call(value)) + ']';
    } else if (isBoolean(value)) {
      // Make boxed primitive Booleans look like such
      base = '[Boolean: ' + fmtPrimNoColor(ctx, bValueOf.call(value)) + ']';
    } else if (isFunction(value)) {
      // Make functions say that they are functions
      base = '[Function' + getNameSep(value) + ']';
    } else if (isRegExp(value)) {
      // Make RegExps say that they are RegExps
      name = 'RegExp';
      base = rToStr.call(value);
    } else if (isDate(value)) {
      // Make dates with properties first say the date
      name = 'Date';
      base = dToISOStr.call(value);
    } else if (isError(value)) {
      // Make error with message first say the error
      base = '[' + eToStr.call(value) + ']';
    } else if ($isArray(value)) {
      // Unset the constructor to prevent "Array [...]" for ordinary arrays.
      name = name === 'Array' ? '' : name;
      braces = ['[', ']'];
      if (ctx.showHidden) {
        unshiftUniq(keys, 'length');
      }
      empty = value.length === 0;
      fmtter = fmtArray;
    } else if (isSet(value)) {
      name = 'Set';
      fmtter = fmtSet;
      // With `showHidden`, `length` will display as a hidden property for
      // arrays. For consistency's sake, do the same for `size`, even though
      // this property isn't selected by Object.getOwnPropertyNames().
      if (ctx.showHidden) {
        unshiftUniq(keys, 'size');
      }
      empty = value.size === 0;
    } else if (isMap(value)) {
      name = 'Map';
      fmtter = fmtMap;
      // With `showHidden`, `length` will display as a hidden property for
      // arrays. For consistency's sake, do the same for `size`, even though
      // this property isn't selected by Object.getOwnPropertyNames().
      if (ctx.showHidden) {
        unshiftUniq(keys, 'size');
      }
      empty = value.size === 0;
    } else if (isArrayBuffer(value)) {
      name = 'ArrayBuffer';
      unshiftUniq(keys, 'byteLength');
      pushUniq(visibleKeys, 'byteLength');
    } else if (isDataView(value)) {
      name = 'DataView';
      unshiftUniq(keys, 'buffer');
      unshiftUniq(keys, 'byteOffset');
      unshiftUniq(keys, 'byteLength');
      pushUniq(visibleKeys, 'byteLength');
      pushUniq(visibleKeys, 'byteOffset');
      pushUniq(visibleKeys, 'buffer');
    } else if (isTypedArray(value)) {
      braces = ['[', ']'];
      fmtter = fmtTypedArray;
      if (ctx.showHidden) {
        unshiftUniq(keys, 'buffer');
        unshiftUniq(keys, 'byteOffset');
        unshiftUniq(keys, 'byteLength');
        unshiftUniq(keys, 'length');
        unshiftUniq(keys, bpe);
      }
    } else if (isPromise(value)) {
      name = 'Promise';
    } else if (isMapIterator(value)) {
      name = 'MapIterator';
      empty = true;
    } else if (isSetIterator(value)) {
      name = 'SetIterator';
      empty = true;
    } else {
      // Unset the constructor to prevent "Object {...}" for ordinary objects.
      name = name === 'Object' ? '' : name;
      empty = true; // No other data than keys.
    }
    empty = empty === true && keys.length === 0;
    if (base) {
      base = ' ' + base;
    } else if (name) {
      // Add constructor name if available
      braces[0] = name + ' ' + braces[0];
    }
    if (empty) {
      return braces[0] + base + braces[1];
    }
    if (depth < 0) {
      return isRegExp(value) ?
        ctx.stylize(rToStr.call(value), 'regexp') :
        ctx.stylize('[Object]', 'special');
    }
    pPush.call(ctx.seen, value);
    var out = fmtter(ctx, value, depth, visibleKeys, keys);
    pPop.call(ctx.seen);
    return reduceToSingleString(out, base, braces);
  };

  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   * Values may supply their own custom `inspect(depth, opts)` functions,
   * when called they receive the current depth in the recursive inspection,
   * as well as the options object passed to `inspect`.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} [opts] Options object that alters the out.
   * @return {string} The string representation.
   * @example
   * var inspect = require('inspect-x');
   *
   * console.log(inspect(inspect, { showHidden: true, depth: null }));
   * //{ [Function: inspect]
   * //  [length]: 2,
   * //  [name]: 'inspect',
   * //  [prototype]: inspect { [constructor]: [Circular] },
   * //  [colors]:
   * //   { [bold]: [ 1, 22, [length]: 2 ],
   * //     [italic]: [ 3, 23, [length]: 2 ],
   * //     [underline]: [ 4, 24, [length]: 2 ],
   * //     [inverse]: [ 7, 27, [length]: 2 ],
   * //     [white]: [ 37, 39, [length]: 2 ],
   * //     [grey]: [ 90, 39, [length]: 2 ],
   * //     [black]: [ 30, 39, [length]: 2 ],
   * //     [blue]: [ 34, 39, [length]: 2 ],
   * //     [cyan]: [ 36, 39, [length]: 2 ],
   * //     [green]: [ 32, 39, [length]: 2 ],
   * //     [magenta]: [ 35, 39, [length]: 2 ],
   * //     [red]: [ 31, 39, [length]: 2 ],
   * //     [yellow]: [ 33, 39, [length]: 2 ] },
   * //  [styles]:
   * //   { [special]: 'cyan',
   * //     [number]: 'yellow',
   * //     [boolean]: 'yellow',
   * //     [undefined]: 'grey',
   * //     [null]: 'bold',
   * //     [string]: 'green',
   * //     [symbol]: 'green',
   * //     [date]: 'magenta',
   * //     [regexp]: 'red' } }
   */
  module.exports = inspectIt = function inspect(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) {
      ctx.depth = arguments[2];
      if (arguments.length >= 4) {
        ctx.colors = arguments[3];
      }
    }
    if (isBooleanType(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (isObjectLike(opts)) {
      // got an "options" object
      pForEach.call($keys(opts), function (key) {
        ctx[key] = opts[key];
      });
    }
    // set default options
    if (isUndefined(ctx.showHidden)) {
      ctx.showHidden = false;
    }
    if (isUndefined(ctx.depth)) {
      ctx.depth = 2;
    }
    if (isUndefined(ctx.colors)) {
      ctx.colors = false;
    }
    if (isUndefined(ctx.customInspect)) {
      ctx.customInspect = true;
    }
    if (ctx.colors) {
      ctx.stylize = stylizeWithColor;
    }
    return fmtValueIt(ctx, obj, ctx.depth);
  };

  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  define.properties(inspectIt, {
    colors: {},
    styles: {}
  });

  define.properties(inspectIt.colors, {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  });

  // Don't use 'blue' not visible on cmd.exe
  define.properties(inspectIt.styles, {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'symbol': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  });
}());

},{"define-properties-x":33,"get-function-name-x":48,"has-symbol-support-x":49,"is-array-buffer-x":50,"is-boolean-object":52,"is-data-view-x":53,"is-date-object":55,"is-error-x":69,"is-function-x":56,"is-map-x":58,"is-negative-zero":59,"is-nil-x":73,"is-number-object":60,"is-object-like-x":75,"is-primitive":61,"is-promise":62,"is-regex":86,"is-set-x":63,"is-string":64,"is-typed-array":65,"lodash.isnull":67,"validate.io-undefined":83,"white-space-x":68}],48:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/get-function-name-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/get-function-name-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/get-function-name-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/get-function-name-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/get-function-name-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/get-function-name-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/get-function-name-x" title="npm version">
 * <img src="https://badge.fury.io/js/get-function-name-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * getFunctionName module. Returns the name of the function.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.11
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module get-function-name-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:2,
  maxstatements:13, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var isFunction = require('is-function-x');
  var getFnName;

  if ((function test() {}).name !== 'test') {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var fToString = Function.prototype.toString;
    var pMatch = String.prototype.match;
    var pReplace = String.prototype.replace;
    var s = require('white-space-x').ws;
    var reName = new RegExp(
      '^[' + s + ']*(?:function|class)[' + s + ']*\\*?[' + s + ']+([\\w\\$]+)[' + s + ']*',
      'i'
    );
    getFnName = function getName(fn) {
      var name = pMatch.call(
        pReplace.call(fToString.call(fn), STRIP_COMMENTS, ' '),
        reName
      );
      return name && name[1] !== 'anonymous' ? name[1] : '';
    };
  } else {
    /*jshint evil:true */
    if ((new Function()).name === 'anonymous') {
      getFnName = function getName(fn) {
        return fn.name && fn.name !== 'anonymous' ? fn.name : '';
      };
    }
  }
  /**
   * This method returns the name of the function, or `undefined` if not
   * a function.
   *
   * @param {Function} fn The function to get the name of.
   * @return {undefined|string} The name of the function,  or `undefined` if
   *  not a function.
   * @example
   * var getFunctionName = require('get-function-name-x');
   *
   * getFunctionName(); // undefined
   * getFunctionName(Number.MIN_VALUE); // undefined
   * getFunctionName('abc'); // undefined
   * getFunctionName(true); // undefined
   * getFunctionName({ name: 'abc' }); // undefined
   * getFunctionName(function () {}); // ''
   * getFunctionName(new Function ()); // ''
   * getFunctionName(function test1() {}); // 'test1'
   * getFunctionName(function* test2() {}); // 'test2'
   * getFunctionName(class Test {}); // 'Test'
   */
  module.exports = function getFunctionName(fn) {
    if (!isFunction(fn)) {
      return;
    }
    return getFnName ? getFnName(fn) : fn.name;
  };
}());

},{"is-function-x":56,"white-space-x":68}],49:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],50:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-array-buffer-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-array-buffer-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-array-buffer-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-array-buffer-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-array-buffer-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-array-buffer-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-array-buffer-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-array-buffer-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isArrayBuffer module. Detect whether or not an object is an Arraybuffer.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.13
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-array-buffer-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:2, maxdepth:3,
  maxstatements:14, maxcomplexity:6 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike = require('is-object-like-x');
  var hasABuf = typeof ArrayBuffer === 'function';
  var toStringTag, aBufTag, bLength;

  if (hasABuf) {
    if (require('has-to-string-tag-x')) {
      try {
        bLength = Object.getOwnPropertyDescriptor(
          ArrayBuffer.prototype,
          'byteLength'
        ).get;
        bLength =
          typeof bLength.call(new ArrayBuffer(4)) === 'number' && bLength;
      } catch (ignore) {
        bLength = null;
      }
    }
    if (!bLength) {
      toStringTag = require('to-string-tag-x');
      aBufTag = '[object ArrayBuffer]';
    }
  }

  /**
   * Determine if an `object` is an `ArrayBuffer`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is an `ArrayBuffer`,
   *  else false`.
   * @example
   * var isArrayBuffer = require('is-array-buffer-x');
   *
   * isArrayBuffer(new ArrayBuffer(4)); // true
   * isArrayBuffer(null); // false
   * isArrayBuffer([]); // false
   */
  module.exports = function isArrayBuffer(object) {
    if (!hasABuf || !isObjectLike(object)) {
      return false;
    }
    if (!bLength) {
      return toStringTag(object) === aBufTag;
    }
    try {
      return typeof bLength.call(object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"has-to-string-tag-x":45,"is-object-like-x":75,"to-string-tag-x":51}],51:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":67,"validate.io-undefined":83}],52:[function(require,module,exports){
'use strict';

var boolToStr = Boolean.prototype.toString;

var tryBooleanObject = function tryBooleanObject(value) {
	try {
		boolToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var boolClass = '[object Boolean]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isBoolean(value) {
	if (typeof value === 'boolean') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryBooleanObject(value) : toStr.call(value) === boolClass;
};

},{}],53:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/is-data-view-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/is-data-view-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/is-data-view-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/is-data-view-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/is-data-view-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/is-data-view-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/is-data-view-x" title="npm version">
 * <img src="https://badge.fury.io/js/is-data-view-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * isDataView module. Detect whether or not an object is a DataView.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.14
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-data-view-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:3,
  maxstatements:17, maxcomplexity:6 */

/*global module */

;(function () {
  'use strict';

  var isObjectLike = require('is-object-like-x');
  var hasDView = typeof DataView === 'function';
  var getByteLength, legacyCheck;

  if (hasDView) {
    if (require('has-to-string-tag-x')) {
      try {
        getByteLength = Object.getOwnPropertyDescriptor(
          DataView.prototype,
          'byteLength'
        ).get;
        getByteLength = typeof getByteLength.call(
          new DataView(new ArrayBuffer(4))
        ) !== 'number' && getByteLength;
      } catch (ignore) {
        getByteLength = null;
      }
    }
    if (!getByteLength) {
      var toStringTag = require('to-string-tag-x');
      var dViewTag = '[object DataView]';
      if (toStringTag(new DataView(new ArrayBuffer(4))) === dViewTag) {
        legacyCheck = function byStringTag(object) {
          return toStringTag(object) === dViewTag;
        };
      } else {
        var isArrayBuffer = require('is-array-buffer-x');
        legacyCheck = function byDuckType(object) {
          return typeof object.byteLength === 'number' &&
            typeof object.byteOffset === 'number' &&
            typeof object.getFloat32 === 'function' &&
            typeof object.setFloat64 === 'function' &&
            isArrayBuffer(object.buffer);
        };
      }
    }
  }

  /**
   * Determine if an `object` is an `DataView`.
   *
   * @param {*} object The object to test.
   * @return {boolean} `true` if the `object` is a `DataView`, else `false`.
   * @example
   * var isDataView = require('is-data-view-x');
   * var ab = new ArrayBuffer(4);
   * var dv = new DataView(ab);
   *
   * isDataView(ab); // false
   * isDataView(true); // false
   * isDataView(dv); // true
   */
  module.exports = function isDataView(object) {
    if (!hasDView || !isObjectLike(object)) {
      return false;
    }
    if (legacyCheck) {
      return legacyCheck(object);
    }
    try {
      return typeof getByteLength.call(object) === 'number';
    } catch (ignore) {}
    return false;
  };
}());

},{"has-to-string-tag-x":45,"is-array-buffer-x":50,"is-object-like-x":75,"to-string-tag-x":54}],54:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":67,"validate.io-undefined":83}],55:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],56:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13,"has-to-string-tag-x":45,"is-primitive":61,"to-string-tag-x":57}],57:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":67,"validate.io-undefined":83}],58:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is-object-like-x":75}],59:[function(require,module,exports){
'use strict';

module.exports = function isNegativeZero(number) {
	return number === 0 && (1 / number) === -Infinity;
};


},{}],60:[function(require,module,exports){
'use strict';

var numToStr = Number.prototype.toString;
var tryNumberObject = function tryNumberObject(value) {
	try {
		numToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var numClass = '[object Number]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isNumberObject(value) {
	if (typeof value === 'number') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryNumberObject(value) : toStr.call(value) === numClass;
};

},{}],61:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],62:[function(require,module,exports){
module.exports = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

},{}],63:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24,"is-object-like-x":75}],64:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],65:[function(require,module,exports){
(function (global){
'use strict';

var forEach = require('foreach');

var toStr = Object.prototype.toString;
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var typedArrays = {
	Float32Array: true,
	Float64Array: true,
	Int8Array: true,
	Int16Array: true,
	Int32Array: true,
	Uint8Array: true,
	Uint8ClampedArray: true,
	Uint16Array: true,
	Uint32Array: true
};

var slice = String.prototype.slice;
var toStrTags = {};
var gOPD = Object.getOwnPropertyDescriptor;
if (hasToStringTag && gOPD && Object.getPrototypeOf) {
	forEach(typedArrays, function (_, typedArray) {
		var arr = new global[typedArray]();
		if (!(Symbol.toStringTag in arr)) {
			throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
		}
		var proto = Object.getPrototypeOf(arr);
		var descriptor = gOPD(proto, Symbol.toStringTag);
		if (!descriptor) {
			var superProto = Object.getPrototypeOf(proto);
			descriptor = gOPD(superProto, Symbol.toStringTag);
		}
		toStrTags[typedArray] = descriptor.get;
	});
}

var tryTypedArrays = function tryTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag) { return !!typedArrays[slice.call(toStr.call(value), 8, -1)]; }
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"foreach":66}],66:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],67:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],68:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/white-space-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/white-space-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/white-space-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/white-space-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/white-space-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/white-space-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/white-space-x" title="npm version">
 * <img src="https://badge.fury.io/js/white-space-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * whitespace module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.10
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module white-space-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:2, maxdepth:2,
  maxstatements:12, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var define = require('define-properties-x');

  /**
   * An array of the whitespace char codes.
   *
   * @name whiteSpaces
   * @type Array.<number>
   * @property {number} 0 0x0009 // Tab
   * @property {number} 1 0x000a // Line Feed
   * @property {number} 2 0x000b // Vertical Tab
   * @property {number} 3 0x000c // Form Feed
   * @property {number} 4 0x000d // Carriage Return
   * @property {number} 5 0x0020 // Space
   * @property {number} 6 0x00a0 // No-break space
   * @property {number} 7 0x1680 // Ogham space mark
   * @property {number} 8 0x180e // Mongolian vowel separator
   * @property {number} 9 0x2000 // En quad
   * @property {number} 10 0x2001 // Em quad
   * @property {number} 11 0x2002 // En space
   * @property {number} 12 0x2003 // Em space
   * @property {number} 13 0x2004 // Three-per-em space
   * @property {number} 14 0x2005 // Four-per-em space
   * @property {number} 15 0x2006 // Six-per-em space
   * @property {number} 16 0x2007 // Figure space
   * @property {number} 17 0x2008 // Punctuation space
   * @property {number} 18 0x2009 // Thin space
   * @property {number} 19 0x200a // Hair space
   * @property {number} 20 0x2028 // Line separator
   * @property {number} 21 0x2029 // Paragraph separator
   * @property {number} 22 0x202f // Narrow no-break space
   * @property {number} 23 0x205f // Medium mathematical space
   * @property {number} 24 0x3000 // Ideographic space
   * @property {number} 25 0xfeff // Byte Order Mark
   * @example
   * var lib = require('white-space-x');
   * var count = 0x110000;
   * var nws = ''; // A string of all the non-whitepaces
   * do {
   *   count -= 1;
   *   if (lib.whiteSpaces.indexOf(count) < 0) {
   *     nws = String.fromCodePoint(count) + nws;
   *   }
   * } while (count);
   */
  define.property(module.exports, 'whiteSpaces', [
    0x0009, // Tab
    0x000a, // Line Feed
    0x000b, // Vertical Tab
    0x000c, // Form Feed
    0x000d, // Carriage Return
    0x0020, // Space
    //0x0085, // Next line - Not ES5 whitespace
    0x00a0, // No-break space
    0x1680, // Ogham space mark
    0x180e, // Mongolian vowel separator
    0x2000, // En quad
    0x2001, // Em quad
    0x2002, // En space
    0x2003, // Em space
    0x2004, // Three-per-em space
    0x2005, // Four-per-em space
    0x2006, // Six-per-em space
    0x2007, // Figure space
    0x2008, // Punctuation space
    0x2009, // Thin space
    0x200a, // Hair space
    //0x200b, // Zero width space - Not ES5 whitespace
    0x2028, // Line separator
    0x2029, // Paragraph separator
    0x202f, // Narrow no-break space
    0x205f, // Medium mathematical space
    0x3000, // Ideographic space
    0xfeff // Byte Order Mark
  ]);

  /**
   * A string of the whitespace characters.
   *
   * @name ws
   * @type string
   * @default \u0009\u000a\u000b\u000c\u000d\u0020\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff
   * @example
   * var lib = require('white-space-x');
   * var ws = '\u0009\u000a\u000b\u000c\u000d\u0020\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff';
   * var re1 = new RegExp('^[' + lib.ws + ']+$)');
   * re1.test(ws); // true
   */
  define.property(module.exports, 'ws', module.exports.whiteSpaces.reduce(function (acc, item) {
      return acc + String.fromCharCode(item);
    }, '')
  );
}());

},{"define-properties-x":33}],69:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"is-object-like":70,"to-string-tag-x":71}],70:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],71:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":72,"validate.io-undefined":83}],72:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],73:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19,"lodash.isnull":74,"validate.io-undefined":83}],74:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],75:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is-function-x":76,"is-primitive":79}],76:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13,"has-to-string-tag-x":45,"is-primitive":79,"to-string-tag-x":77}],77:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"lodash.isnull":78,"validate.io-undefined":83}],78:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],79:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],80:[function(require,module,exports){
(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define('stackframe', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.StackFrame = factory();
    }
}(this, function () {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str[0].toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function () {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];

    function StackFrame(obj) {
        if (obj instanceof Object) {
            var props = booleanProps.concat(numericProps.concat(stringProps.concat(arrayProps)));
            for (var i = 0; i < props.length; i++) {
                if (obj.hasOwnProperty(props[i]) && obj[props[i]] !== undefined) {
                    this['set' + _capitalize(props[i])](obj[props[i]]);
                }
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function () {
            return this.args;
        },
        setArgs: function (v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function () {
            return this.evalOrigin;
        },
        setEvalOrigin: function (v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function () {
            var functionName = this.getFunctionName() || '{anonymous}';
            var args = '(' + (this.getArgs() || []).join(',') + ')';
            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
            return functionName + args + fileName + lineNumber + columnNumber;
        }
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function (p) {
            return function (v) {
                this[p] = Boolean(v);
            };
        })(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function (p) {
            return function (v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        })(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function (p) {
            return function (v) {
                this[p] = String(v);
            };
        })(stringProps[k]);
    }

    return StackFrame;
}));

},{}],81:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/to-length-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/to-length-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-length-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/to-length-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/to-length-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/to-length-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/to-length-x" title="npm version">
 * <img src="https://badge.fury.io/js/to-length-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * toLength module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.5
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-length-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:6, maxcomplexity:3 */

/*global require, module */

;(function () {
  'use strict';

  var toInteger = require('to-integer-x');
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

  /**
   * Converts `value` to an integer suitable for use as the length of an
   * array-like object.
   *
   * @param {*} value The value to convert.
   * @return {number} Returns the converted integer.
   * @example
   * var toLength = require('to-length-x');
   * toLength(3); // 3
   * toLength(Number.MIN_VALUE); // 0
   * toLength(Infinity); // Number.MAX_SAFE_INTEGER
   * toLength('3'); // 3
   */
  module.exports = function toLength(value) {
    var len = toInteger(value);
    if (len <= 0) {
      return 0;
    } // includes converting -0 to +0
    if (len > MAX_SAFE_INTEGER) {
      return MAX_SAFE_INTEGER;
    }
    return len;
  };
}());

},{"to-integer-x":82}],82:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/to-integer-x"
 * title="Travis status">
 * <img
 * src="https://travis-ci.org/Xotic750/to-integer-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/to-integer-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/to-integer-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a
 * href="https://david-dm.org/Xotic750/to-integer-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/to-integer-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/to-integer-x" title="npm version">
 * <img src="https://badge.fury.io/js/to-integer-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * toInteger module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.6
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module to-integer-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:7, maxcomplexity:4 */

/*global module */

;(function () {
  'use strict';

  var $Number = Number;
  var $isNaN = Number.isNaN;
  var $isFinite = Number.isFinite;
  var $sign = Math.sign;
  var $floor = Math.floor;
  var $abs = Math.abs;

  /**
   * Converts `value` to an integer.
   *
   * @param {*} value The value to convert.
   * @return {number} Returns the converted integer.
   * @example
   * var toInteger = require('to-integer-x');
   * toInteger(3); // 3
   * toInteger(Number.MIN_VALUE); // 0
   * toInteger(Infinity); // 1.7976931348623157e+308
   * toInteger('3'); // 3
   */
  module.exports = function toInteger(value) {
    var number = $Number(value);
    if ($isNaN(number)) {
      return 0;
    }
    if (number === 0 || !$isFinite(number)) {
      return number;
    }
    return $sign(number) * $floor($abs(number));
  };
}());

},{}],83:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],84:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/truncate-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/truncate-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/truncate-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/truncate-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/truncate-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/truncate-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/truncate-x" title="npm version">
 * <img src="https://badge.fury.io/js/truncate-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * truncate module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module truncate-x
 */

/*jslint maxlen:80, es6:false, this:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:2, maxdepth:3,
  maxstatements:42, maxcomplexity:18 */

/*global require, module */

;(function () {
  'use strict';

  var RE = RegExp;
  var pTest = RE.prototype.test;
  var pExec = RE.prototype.exec;
  var sSlice = String.prototype.slice;
  var sIndexOf = String.prototype.indexOf;
  var sLastIndexOf = String.prototype.lastIndexOf;
  var pMatch = String.prototype.match;
  var aSlice = Array.prototype.slice;
  var pJoin = Array.prototype.join;
  var isUndefined = require('validate.io-undefined');
  var toLength = require('to-length-x');
  var isRegExp = require('is-regex');
  var safeToString = require('safe-to-string-x');
  var isObjectLike = require('is-object-like-x');

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff';
  var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
  var rsComboSymbolsRange = '\\u20d0-\\u20f0';
  var rsVarRange = '\\ufe0e\\ufe0f';

  /** Used to compose unicode capture groups. */
  var rsAstral = '[' + rsAstralRange + ']';
  var rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']';
  var rsFitz = '\\ud83c[\\udffb-\\udfff]';
  var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
  var rsNonAstral = '[^' + rsAstralRange + ']';
  var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
  var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
  var rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var reOptMod = rsModifier + '?';
  var rsOptVar = '[' + rsVarRange + ']?';
  var rsOptJoin = '(?:' + rsZWJ + '(?:' + pJoin.call(
    [rsNonAstral, rsRegional, rsSurrPair],
    '|'
  ) + ')' + rsOptVar + reOptMod + ')*';
  var rsSeq = rsOptVar + reOptMod + rsOptJoin;
  var rsSymbol = '(?:' + pJoin.call(
    [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral],
    '|'
  ) + ')';

  /**
   * Used to match string symbols
   * @see https://mathiasbynens.be/notes/javascript-unicode
   */
  var reComplexSymbol = new RE(
    rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq,
    'g'
  );

  /**
   * Used to detect strings with [zero-width joiners or code points from
   * the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/).
   */
  var reHasComplexSymbol = new RE(
    '[' + rsZWJ + rsAstralRange + rsComboMarksRange +
    rsComboSymbolsRange + rsVarRange + ']'
  );

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    if (!string || !pTest.call(reHasComplexSymbol, string)) {
      return string.length;
    }
    var result = reComplexSymbol.lastIndex = 0;
    while (pTest.call(reComplexSymbol, string)) {
      result += 1;
    }
    return result;
  }

  /**
   * Truncates `string` if it's longer than the given maximum string length.
   * The last characters of the truncated string are replaced with the omission
   * string which defaults to "...".
   *
   * @param {string} [string=''] The string to truncate.
   * @param {Object} [options] The options object.
   * @param {number} [options.length=30] The maximum string length.
   * @param {string} [options.omission='...'] The string to indicate text
   * is omitted.
   * @param {RegExp|string} [options.separator] The separator pattern to
   * truncate to.
   * @returns {string} Returns the truncated string.
   * @example
   *
   * truncate('hi-diddly-ho there, neighborino');
   * // 'hi-diddly-ho there, neighbo...'
   *
   * truncate('hi-diddly-ho there, neighborino', {
   *   'length': 24,
   *   'separator': ' '
   * });
   * // 'hi-diddly-ho there,...'
   *
   * truncate('hi-diddly-ho there, neighborino', {
   *   'length': 24,
   *   'separator': /,? +/
   * });
   * // 'hi-diddly-ho there...'
   *
   * truncate('hi-diddly-ho there, neighborino', {
   *   'omission': ' [...]'
   * });
   * // 'hi-diddly-ho there, neig [...]'
   */
  module.exports = function truncate(string, options) {
    var str = safeToString(string);
    var length = 30;
    var omission = '...';
    var separator;
    if (isObjectLike(options)) {
      if ('separator' in options) {
        separator = options.separator;
      }
      if ('length' in options) {
        length = toLength(options.length);
      }
      if ('omission' in options) {
        omission = safeToString(options.omission);
      }
    }
    var strLength = str.length;
    var strSymbols;
    if (pTest.call(reHasComplexSymbol, str)) {
      strSymbols = pMatch.call(str, reComplexSymbol);
      strLength = strSymbols.length;
    }
    if (length >= strLength) {
      return str;
    }
    var end = length - stringSize(omission);
    if (end < 1) {
      return omission;
    }
    var result = strSymbols ?
      pJoin.call(aSlice.call(strSymbols, 0, end), '') :
      sSlice.call(str, 0, end);
    if (isUndefined(separator)) {
      return result + omission;
    }
    if (strSymbols) {
      end += result.length - end;
    }
    if (isRegExp(separator)) {
      if (sSlice.call(str, end).search(separator)) {
        var substr = result;
        if (!separator.global) {
          separator = new RE(
            separator.source,
            safeToString(pExec.call(reFlags, separator)) + 'g'
          );
        }
        separator.lastIndex = 0;
        var newEnd;
        var match = pExec.call(separator, substr);
        while (match) {
          newEnd = match.index;
          match = pExec.call(separator, substr);
        }
        result = sSlice.call(result, 0, isUndefined(newEnd) ? end : newEnd);
      }
    } else if (sIndexOf.call(str, separator, end) !== end) {
      var index = sLastIndexOf.call(result, separator);
      if (index > -1) {
        result = sSlice.call(result, 0, index);
      }
    }
    return result + omission;
  };
}());

},{"is-object-like-x":75,"is-regex":86,"safe-to-string-x":87,"to-length-x":81,"validate.io-undefined":83}],85:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],86:[function(require,module,exports){
'use strict';

var regexExec = RegExp.prototype.exec;
var tryRegexExec = function tryRegexExec(value) {
	try {
		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryRegexExec(value) : toStr.call(value) === regexClass;
};

},{}],87:[function(require,module,exports){
/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/safe-to-string-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/safe-to-string-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/safe-to-string-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/safe-to-string-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/safe-to-string-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/safe-to-string-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/safe-to-string-x" title="npm version">
 * <img src="https://badge.fury.io/js/safe-to-string-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * ES6 safeToString module. Converts a `Symbol` literal or object to `Symbol()`
 * instead of throwing a `TypeError`. Its primary use is for logging/debugging.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.1.11
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module safe-to-string-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:1, maxdepth:1,
  maxstatements:4, maxcomplexity:2 */

/*global module */

;(function () {
  'use strict';

  var $String = String;
  var isSymbol = require('is-symbol');
  var pToString = require('has-symbol-support-x') && Symbol.prototype.toString;

  /**
   * The abstract operation `safeToString` converts a `Symbol` literal or
   * object to `Symbol()` instead of throwing a `TypeError`.
   *
   * @param {*} value The value to convert to a string.
   * @return {string} The converted value.
   * @example
   * var safeToString = require('safe-to-string-x');
   *
   * safeToString(); // 'undefined'
   * safeToString(null); // 'null'
   * safeToString('abc'); // 'abc'
   * safeToString(true); // 'true'
   * safeToString(Symbol('foo')); // 'Symbol(foo)'
   * safeToString(Symbol.iterator); // 'Symbol(Symbol.iterator)'
   * safeToString(Object(Symbol.iterator)); // 'Symbol(Symbol.iterator)'
   */
  module.exports = function safeToString(value) {
    return pToString && isSymbol(value) ? pToString.call(value): $String(value);
  };
}());

},{"has-symbol-support-x":88,"is-symbol":89}],88:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],89:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

},{}]},{},[1])(1)
});