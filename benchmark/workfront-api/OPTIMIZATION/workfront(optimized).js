(function (f) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = f();
    } else if (typeof define === 'function' && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== 'undefined') {
            g = window;
        } else if (typeof global !== 'undefined') {
            g = global;
        } else if (typeof self !== 'undefined') {
            g = self;
        } else {
            g = this;
        }
        g.Workfront = f();
    }
}(function () {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == 'function' && require;
                    if (!u && a)
                        return a(o, !0);
                    if (i)
                        return i(o, !0);
                    var f = new Error('Cannot find module \'' + o + '\'');
                    throw f.code = 'MODULE_NOT_FOUND', f;
                }
                var l = n[o] = { exports: {} };
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == 'function' && require;
        for (var o = 0; o < r.length; o++)
            s(r[o]);
        return s;
    }({
        1: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                require('promise/polyfill');
                /**
 * Simplifies creation of API instances as singletons
 * @type {exports}
 */
                var ApiFactory = require('./src/ApiFactory');
                /**
 * An Api class
 * @type {exports}
 */
                var Api = require('./src/Api');
                /**
 * Various utility methods for working with API
 * @type {exports}
 */
                var ApiUtil = require('./src/ApiUtil');
                /**
 * Constants to be used when working with API
 * @type {exports}
 */
                var ApiConstants = require('workfront-api-constants/dist/umd/constants');
                module.exports = {
                    Api: Api,
                    ApiFactory: ApiFactory,
                    ApiUtil: ApiUtil,
                    ApiConstants: ApiConstants
                };
            },
            {
                './src/Api': 61,
                './src/ApiFactory': 62,
                './src/ApiUtil': 63,
                'promise/polyfill': 30,
                'workfront-api-constants/dist/umd/constants': 59
            }
        ],
        2: [
            function (require, module, exports) {
                'use strict';
                // rawAsap provides everything we need except exception management.
                var rawAsap = require('./raw');
                // RawTasks are recycled to reduce GC churn.
                var freeTasks = [];
                // We queue errors to ensure they are thrown in right order (FIFO).
                // Array-as-queue is good enough here, since we are just dealing with exceptions.
                var pendingErrors = [];
                var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);
                function throwFirstError() {
                }
                /**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
                module.exports = asap;
                function asap(task) {
                }
                // We wrap tasks with recyclable task objects.  A task object implements
                // `call`, just like a function.
                function RawTask() {
                }
                // The sole purpose of wrapping the task is to catch the exception and recycle
                // the task object after its single use.
                RawTask.prototype.call = function () {
                };
            },
            { './raw': 3 }
        ],
        3: [
            function (require, module, exports) {
                (function (global) {
                    'use strict';
                    // Use the fastest means possible to execute a task in its own turn, with
                    // priority over other events including IO, animation, reflow, and redraw
                    // events in browsers.
                    //
                    // An exception thrown by a task will permanently interrupt the processing of
                    // subsequent tasks. The higher level `asap` function ensures that if an
                    // exception is thrown by a task, that the task queue will continue flushing as
                    // soon as possible, but if you use `rawAsap` directly, you are responsible to
                    // either ensure that no exceptions are thrown from your task, or to manually
                    // call `rawAsap.requestFlush` if an exception is thrown.
                    module.exports = rawAsap;
                    function rawAsap(task) {
                    }
                    var queue = [];
                    // Once a flush has been requested, no further calls to `requestFlush` are
                    // necessary until the next `flush` completes.
                    var flushing = false;
                    // `requestFlush` is an implementation-specific method that attempts to kick
                    // off a `flush` event as quickly as possible. `flush` will attempt to exhaust
                    // the event queue before yielding to the browser's own event loop.
                    var requestFlush;
                    // The position of the next task to execute in the task queue. This is
                    // preserved between calls to `flush` so that it can be resumed if
                    // a task throws an exception.
                    var index = 0;
                    // If a task schedules additional tasks recursively, the task queue can grow
                    // unbounded. To prevent memory exhaustion, the task queue will periodically
                    // truncate already-completed tasks.
                    var capacity = 1024;
                    // The flush function processes all tasks that have been scheduled with
                    // `rawAsap` unless and until one of those tasks throws an exception.
                    // If a task throws an exception, `flush` ensures that its state will remain
                    // consistent and will resume where it left off when called again.
                    // However, `flush` does not make any arrangements to be called again if an
                    // exception is thrown.
                    function flush() {
                    }
                    // `requestFlush` is implemented using a strategy based on data collected from
                    // every available SauceLabs Selenium web driver worker at time of writing.
                    // https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593
                    // Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
                    // have WebKitMutationObserver but not un-prefixed MutationObserver.
                    // Must use `global` instead of `window` to work in both frames and web
                    // workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
                    var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;
                    // MutationObservers are desirable because they have high priority and work
                    // reliably everywhere they are implemented.
                    // They are implemented in all modern browsers.
                    //
                    // - Android 4-4.3
                    // - Chrome 26-34
                    // - Firefox 14-29
                    // - Internet Explorer 11
                    // - iPad Safari 6-7.1
                    // - iPhone Safari 7-7.1
                    // - Safari 6-7
                    if (typeof BrowserMutationObserver === 'function') {
                        requestFlush = makeRequestCallFromMutationObserver(flush);    // MessageChannels are desirable because they give direct access to the HTML
                                                                                      // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
                                                                                      // 11-12, and in web workers in many engines.
                                                                                      // Although message channels yield to any queued rendering and IO tasks, they
                                                                                      // would be better than imposing the 4ms delay of timers.
                                                                                      // However, they do not work reliably in Internet Explorer or Safari.
                                                                                      // Internet Explorer 10 is the only browser that has setImmediate but does
                                                                                      // not have MutationObservers.
                                                                                      // Although setImmediate yields to the browser's renderer, it would be
                                                                                      // preferrable to falling back to setTimeout since it does not have
                                                                                      // the minimum 4ms penalty.
                                                                                      // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
                                                                                      // Desktop to a lesser extent) that renders both setImmediate and
                                                                                      // MessageChannel useless for the purposes of ASAP.
                                                                                      // https://github.com/kriskowal/q/issues/396
                                                                                      // Timers are implemented universally.
                                                                                      // We fall back to timers in workers in most engines, and in foreground
                                                                                      // contexts in the following browsers.
                                                                                      // However, note that even this simple case requires nuances to operate in a
                                                                                      // broad spectrum of browsers.
                                                                                      //
                                                                                      // - Firefox 3-13
                                                                                      // - Internet Explorer 6-9
                                                                                      // - iPad Safari 4.3
                                                                                      // - Lynx 2.8.7
                    } else {
                        requestFlush = makeRequestCallFromTimer(flush);
                    }
                    // `requestFlush` requests that the high priority event queue be flushed as
                    // soon as possible.
                    // This is useful to prevent an error thrown in a task from stalling the event
                    // queue if the exception handled by Node.js’s
                    // `process.on("uncaughtException")` or by a domain.
                    rawAsap.requestFlush = requestFlush;
                    // To request a high priority event, we induce a mutation observer by toggling
                    // the text of a text node between "1" and "-1".
                    function makeRequestCallFromMutationObserver(callback) {
                    }
                    // The message channel technique was discovered by Malte Ubl and was the
                    // original foundation for this library.
                    // http://www.nonblocking.io/2011/06/windownexttick.html
                    // Safari 6.0.5 (at least) intermittently fails to create message ports on a
                    // page's first load. Thankfully, this version of Safari supports
                    // MutationObservers, so we don't need to fall back in that case.
                    // function makeRequestCallFromMessageChannel(callback) {
                    //     var channel = new MessageChannel();
                    //     channel.port1.onmessage = callback;
                    //     return function requestCall() {
                    //         channel.port2.postMessage(0);
                    //     };
                    // }
                    // For reasons explained above, we are also unable to use `setImmediate`
                    // under any circumstances.
                    // Even if we were, there is another bug in Internet Explorer 10.
                    // It is not sufficient to assign `setImmediate` to `requestFlush` because
                    // `setImmediate` must be called *by name* and therefore must be wrapped in a
                    // closure.
                    // Never forget.
                    // function makeRequestCallFromSetImmediate(callback) {
                    //     return function requestCall() {
                    //         setImmediate(callback);
                    //     };
                    // }
                    // Safari 6.0 has a problem where timers will get lost while the user is
                    // scrolling. This problem does not impact ASAP because Safari 6.0 supports
                    // mutation observers, so that implementation is used instead.
                    // However, if we ever elect to use timers in Safari, the prevalent work-around
                    // is to add a scroll event listener that calls for a flush.
                    // `setTimeout` does not call the passed callback if the delay is less than
                    // approximately 7 in web workers in Firefox 8 through 18, and sometimes not
                    // even then.
                    function makeRequestCallFromTimer(callback) {
                    }
                    // This is for `asap.js` only.
                    // Its name will be periodically randomized to break any code that depends on
                    // its existence.
                    rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;    // ASAP was originally a nextTick shim included in Q. This was factored out
                                                                                    // into this ASAP package. It was later adapted to RSVP which made further
                                                                                    // amendments. These decisions, particularly to marginalize MessageChannel and
                                                                                    // to capture the MutationObserver implementation in a closure, were integrated
                                                                                    // back into ASAP proper.
                                                                                    // https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {}
        ],
        4: [
            function (require, module, exports) {
                (function (process) {
                    /*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
                    /*jshint onevar: false, indent:4 */
                    /*global setImmediate: false, setTimeout: false, console: false */
                    (function () {
                        var async = {};
                        // global on the server, window in the browser
                        var root, previous_async;
                        root = this;
                        if (root != null) {
                            previous_async = root.async;
                        }
                        async.noConflict = function () {
                        };
                        function only_once(fn) {
                        }
                        //// cross-browser compatiblity functions ////
                        var _toString = Object.prototype.toString;
                        var _isArray = Array.isArray || function (obj) {
                        };
                        var _each = function (arr, iterator) {
                        };
                        var _map = function (arr, iterator) {
                        };
                        var _reduce = function (arr, iterator, memo) {
                        };
                        var _keys = function (obj) {
                        };
                        //// exported async module functions ////
                        //// nextTick implementation with browser-compatible fallback ////
                        if (typeof process === 'undefined' || !process.nextTick) {
                            if (typeof setImmediate === 'function') {
                                async.nextTick = function (fn) {
                                };
                                async.setImmediate = async.nextTick;
                            } else {
                                async.nextTick = function (fn) {
                                };
                                async.setImmediate = async.nextTick;
                            }
                        } else {
                            async.nextTick = process.nextTick;
                            if (typeof setImmediate !== 'undefined') {
                                async.setImmediate = function (fn) {
                                };
                            } else {
                                async.setImmediate = async.nextTick;
                            }
                        }
                        async.each = function (arr, iterator, callback) {
                        };
                        async.forEach = async.each;
                        async.eachSeries = function (arr, iterator, callback) {
                        };
                        async.forEachSeries = async.eachSeries;
                        async.eachLimit = function (arr, limit, iterator, callback) {
                        };
                        async.forEachLimit = async.eachLimit;
                        var _eachLimit = function (limit) {
                        };
                        var doParallel = function (fn) {
                            return function () {
                            };
                        };
                        var doParallelLimit = function (limit, fn) {
                        };
                        var doSeries = function (fn) {
                            return function () {
                            };
                        };
                        var _asyncMap = function (eachfn, arr, iterator, callback) {
                        };
                        async.map = doParallel(_asyncMap);
                        async.mapSeries = doSeries(_asyncMap);
                        async.mapLimit = function (arr, limit, iterator, callback) {
                        };
                        var _mapLimit = function (limit) {
                        };
                        // reduce only has a series version, as doing reduce in parallel won't
                        // work in many situations.
                        async.reduce = function (arr, memo, iterator, callback) {
                        };
                        // inject alias
                        async.inject = async.reduce;
                        // foldl alias
                        async.foldl = async.reduce;
                        async.reduceRight = function (arr, memo, iterator, callback) {
                        };
                        // foldr alias
                        async.foldr = async.reduceRight;
                        var _filter = function (eachfn, arr, iterator, callback) {
                        };
                        async.filter = doParallel(_filter);
                        async.filterSeries = doSeries(_filter);
                        // select alias
                        async.select = async.filter;
                        async.selectSeries = async.filterSeries;
                        var _reject = function (eachfn, arr, iterator, callback) {
                        };
                        async.reject = doParallel(_reject);
                        async.rejectSeries = doSeries(_reject);
                        var _detect = function (eachfn, arr, iterator, main_callback) {
                        };
                        async.detect = doParallel(_detect);
                        async.detectSeries = doSeries(_detect);
                        async.some = function (arr, iterator, main_callback) {
                        };
                        // any alias
                        async.any = async.some;
                        async.every = function (arr, iterator, main_callback) {
                        };
                        // all alias
                        async.all = async.every;
                        async.sortBy = function (arr, iterator, callback) {
                        };
                        async.auto = function (tasks, callback) {
                        };
                        async.retry = function (times, task, callback) {
                        };
                        async.waterfall = function (tasks, callback) {
                        };
                        var _parallel = function (eachfn, tasks, callback) {
                        };
                        async.parallel = function (tasks, callback) {
                        };
                        async.parallelLimit = function (tasks, limit, callback) {
                        };
                        async.series = function (tasks, callback) {
                        };
                        async.iterator = function (tasks) {
                        };
                        async.apply = function (fn) {
                        };
                        var _concat = function (eachfn, arr, fn, callback) {
                        };
                        async.concat = doParallel(_concat);
                        async.concatSeries = doSeries(_concat);
                        async.whilst = function (test, iterator, callback) {
                        };
                        async.doWhilst = function (iterator, test, callback) {
                        };
                        async.until = function (test, iterator, callback) {
                        };
                        async.doUntil = function (iterator, test, callback) {
                        };
                        async.queue = function (worker, concurrency) {
                        };
                        async.priorityQueue = function (worker, concurrency) {
                        };
                        async.cargo = function (worker, payload) {
                        };
                        var _console_fn = function (name) {
                            return function (fn) {
                            };
                        };
                        async.log = _console_fn('log');
                        async.dir = _console_fn('dir');
                        /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/
                        async.memoize = function (fn, hasher) {
                        };
                        async.unmemoize = function (fn) {
                        };
                        async.times = function (count, iterator, callback) {
                        };
                        async.timesSeries = function (count, iterator, callback) {
                        };
                        async.seq = function () {
                        };
                        async.compose = function () {
                        };
                        var _applyEach = function (eachfn, fns) {
                        };
                        async.applyEach = doParallel(_applyEach);
                        async.applyEachSeries = doSeries(_applyEach);
                        async.forever = function (fn, callback) {
                        };
                        // Node.js
                        if (typeof module !== 'undefined' && module.exports) {
                            module.exports = async;
                        }    // AMD / RequireJS
                        else if (typeof define !== 'undefined' && define.amd) {
                            define([], function () {
                            });
                        }    // included directly via <script> tag
                        else {
                            root.async = async;
                        }
                    }());
                }.call(this, require('_process')));
            },
            { '_process': 26 }
        ],
        5: [
            function (require, module, exports) {
                'use strict';
                exports.toByteArray = toByteArray;
                exports.fromByteArray = fromByteArray;
                var lookup = [];
                var revLookup = [];
                var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
                function init() {
                    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                    for (var i = 0, len = code.length; i < len; ++i) {
                        lookup[i] = code[i];
                        revLookup[code.charCodeAt(i)] = i;
                    }
                    revLookup['-'.charCodeAt(0)] = 62;
                    revLookup['_'.charCodeAt(0)] = 63;
                }
                init();
                function toByteArray(b64) {
                    var i, j, l, tmp, placeHolders, arr;
                    var len = b64.length;
                    if (len % 4 > 0) {
                        throw new Error('Invalid string. Length must be a multiple of 4');
                    }
                    // the number of equal signs (place holders)
                    // if there are two placeholders, than the two characters before it
                    // represent one byte
                    // if there is only one, then the three characters before it represent 2 bytes
                    // this is just a cheap hack to not do indexOf twice
                    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
                    // base64 is 4/3 + up to two characters of the original data
                    arr = new Arr(len * 3 / 4 - placeHolders);
                    // if there are placeholders, only get up to the last complete 4 chars
                    l = placeHolders > 0 ? len - 4 : len;
                    var L = 0;
                    for (i = 0, j = 0; i < l; i += 4, j += 3) {
                        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
                        arr[L++] = tmp >> 16 & 255;
                        arr[L++] = tmp >> 8 & 255;
                        arr[L++] = tmp & 255;
                    }
                    if (placeHolders === 2) {
                        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
                        arr[L++] = tmp & 255;
                    } else if (placeHolders === 1) {
                        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
                        arr[L++] = tmp >> 8 & 255;
                        arr[L++] = tmp & 255;
                    }
                    return arr;
                }
                function tripletToBase64(num) {
                    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
                }
                function encodeChunk(uint8, start, end) {
                    var tmp;
                    var output = [];
                    for (var i = start; i < end; i += 3) {
                        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
                        output.push(tripletToBase64(tmp));
                    }
                    return output.join('');
                }
                function fromByteArray(uint8) {
                    var tmp;
                    var len = uint8.length;
                    var extraBytes = len % 3;
                    // if we have 1 byte left, pad 2 bytes
                    var output = '';
                    var parts = [];
                    var maxChunkLength = 16383;
                    // must be multiple of 3
                    // go through the array every three bytes, we'll deal with trailing stuff later
                    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
                    }
                    // pad the end with zeros, but make sure to not forget the extra bytes
                    if (extraBytes === 1) {
                        tmp = uint8[len - 1];
                        output += lookup[tmp >> 2];
                        output += lookup[tmp << 4 & 63];
                        output += '==';
                    } else if (extraBytes === 2) {
                        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                        output += lookup[tmp >> 10];
                        output += lookup[tmp >> 4 & 63];
                        output += lookup[tmp << 2 & 63];
                        output += '=';
                    }
                    parts.push(output);
                    return parts.join('');
                }
            },
            {}
        ],
        6: [
            function (require, module, exports) {
            },
            {}
        ],
        7: [
            function (require, module, exports) {
                arguments[4][6][0].apply(exports, arguments);
            },
            { 'dup': 6 }
        ],
        8: [
            function (require, module, exports) {
                (function (global) {
                    'use strict';
                    var buffer = require('buffer');
                    var Buffer = buffer.Buffer;
                    var SlowBuffer = buffer.SlowBuffer;
                    var MAX_LEN = buffer.kMaxLength || 2147483647;
                    exports.alloc = function alloc(size, fill, encoding) {
                        if (typeof Buffer.alloc === 'function') {
                            return Buffer.alloc(size, fill, encoding);
                        }
                        if (typeof encoding === 'number') {
                            throw new TypeError('encoding must not be number');
                        }
                        if (typeof size !== 'number') {
                            throw new TypeError('size must be a number');
                        }
                        if (size > MAX_LEN) {
                            throw new RangeError('size is too large');
                        }
                        var enc = encoding;
                        var _fill = fill;
                        if (_fill === undefined) {
                            enc = undefined;
                            _fill = 0;
                        }
                        var buf = new Buffer(size);
                        if (typeof _fill === 'string') {
                            var fillBuf = new Buffer(_fill, enc);
                            var flen = fillBuf.length;
                            var i = -1;
                            while (++i < size) {
                                buf[i] = fillBuf[i % flen];
                            }
                        } else {
                            buf.fill(_fill);
                        }
                        return buf;
                    };
                    exports.allocUnsafe = function allocUnsafe(size) {
                        if (typeof Buffer.allocUnsafe === 'function') {
                            return Buffer.allocUnsafe(size);
                        }
                        if (typeof size !== 'number') {
                            throw new TypeError('size must be a number');
                        }
                        if (size > MAX_LEN) {
                            throw new RangeError('size is too large');
                        }
                        return new Buffer(size);
                    };
                    exports.from = function from(value, encodingOrOffset, length) {
                        if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
                            return Buffer.from(value, encodingOrOffset, length);
                        }
                        if (typeof value === 'number') {
                            throw new TypeError('"value" argument must not be a number');
                        }
                        if (typeof value === 'string') {
                            return new Buffer(value, encodingOrOffset);
                        }
                        if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
                            var offset = encodingOrOffset;
                            if (arguments.length === 1) {
                                return new Buffer(value);
                            }
                            if (typeof offset === 'undefined') {
                                offset = 0;
                            }
                            var len = length;
                            if (typeof len === 'undefined') {
                                len = value.byteLength - offset;
                            }
                            if (offset >= value.byteLength) {
                                throw new RangeError('\'offset\' is out of bounds');
                            }
                            if (len > value.byteLength - offset) {
                                throw new RangeError('\'length\' is out of bounds');
                            }
                            return new Buffer(value.slice(offset, offset + len));
                        }
                        if (Buffer.isBuffer(value)) {
                            var out = new Buffer(value.length);
                            value.copy(out, 0, 0, value.length);
                            return out;
                        }
                        if (value) {
                            if (Array.isArray(value) || typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer || 'length' in value) {
                                return new Buffer(value);
                            }
                            if (value.type === 'Buffer' && Array.isArray(value.data)) {
                                return new Buffer(value.data);
                            }
                        }
                        throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
                    };
                    exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
                        if (typeof Buffer.allocUnsafeSlow === 'function') {
                            return Buffer.allocUnsafeSlow(size);
                        }
                        if (typeof size !== 'number') {
                            throw new TypeError('size must be a number');
                        }
                        if (size >= MAX_LEN) {
                            throw new RangeError('size is too large');
                        }
                        return new SlowBuffer(size);
                    };
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            { 'buffer': 9 }
        ],
        9: [
            function (require, module, exports) {
                (function (global) {
                    /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
                    /* eslint-disable no-proto */
                    'use strict';
                    var base64 = require('base64-js');
                    var ieee754 = require('ieee754');
                    var isArray = require('isarray');
                    exports.Buffer = Buffer;
                    exports.SlowBuffer = SlowBuffer;
                    exports.INSPECT_MAX_BYTES = 50;
                    /**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
                    Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
                    /*
 * Export kMaxLength after typed array support is determined.
 */
                    exports.kMaxLength = kMaxLength();
                    function typedArraySupport() {
                        try {
                            var arr = new Uint8Array(1);
                            arr.__proto__ = {
                                __proto__: Uint8Array.prototype,
                                foo: function () {
                                    return 42;
                                }
                            };
                            return arr.foo() === 42 && // typed array instances can be augmented
                            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
                            arr.subarray(1, 1).byteLength === 0    // ie10 has broken `subarray`
;
                        } catch (e) {
                            return false;
                        }
                    }
                    function kMaxLength() {
                        return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
                    }
                    function createBuffer(that, length) {
                        if (kMaxLength() < length) {
                            throw new RangeError('Invalid typed array length');
                        }
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            // Return an augmented `Uint8Array` instance, for best performance
                            that = new Uint8Array(length);
                            that.__proto__ = Buffer.prototype;
                        } else {
                            // Fallback: Return an object instance of the Buffer class
                            if (that === null) {
                                that = new Buffer(length);
                            }
                            that.length = length;
                        }
                        return that;
                    }
                    /**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */
                    function Buffer(arg, encodingOrOffset, length) {
                        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
                            return new Buffer(arg, encodingOrOffset, length);
                        }
                        // Common case.
                        if (typeof arg === 'number') {
                            if (typeof encodingOrOffset === 'string') {
                                throw new Error('If encoding is specified then the first argument must be a string');
                            }
                            return allocUnsafe(this, arg);
                        }
                        return from(this, arg, encodingOrOffset, length);
                    }
                    Buffer.poolSize = 8192;
                    // not used by this implementation
                    // TODO: Legacy, not needed anymore. Remove in next major version.
                    Buffer._augment = function (arr) {
                        arr.__proto__ = Buffer.prototype;
                        return arr;
                    };
                    function from(that, value, encodingOrOffset, length) {
                        if (typeof value === 'number') {
                            throw new TypeError('"value" argument must not be a number');
                        }
                        if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
                            return fromArrayBuffer(that, value, encodingOrOffset, length);
                        }
                        if (typeof value === 'string') {
                            return fromString(that, value, encodingOrOffset);
                        }
                        return fromObject(that, value);
                    }
                    /**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
                    Buffer.from = function (value, encodingOrOffset, length) {
                        return from(null, value, encodingOrOffset, length);
                    };
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        Buffer.prototype.__proto__ = Uint8Array.prototype;
                        Buffer.__proto__ = Uint8Array;
                        if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
                            // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
                            Object.defineProperty(Buffer, Symbol.species, {
                                value: null,
                                configurable: true
                            });
                        }
                    }
                    function assertSize(size) {
                        if (typeof size !== 'number') {
                            throw new TypeError('"size" argument must be a number');
                        } else if (size < 0) {
                            throw new RangeError('"size" argument must not be negative');
                        }
                    }
                    function alloc(that, size, fill, encoding) {
                        assertSize(size);
                        if (size <= 0) {
                            return createBuffer(that, size);
                        }
                        if (fill !== undefined) {
                            // Only pay attention to encoding if it's a string. This
                            // prevents accidentally sending in a number that would
                            // be interpretted as a start offset.
                            return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
                        }
                        return createBuffer(that, size);
                    }
                    /**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
                    Buffer.alloc = function (size, fill, encoding) {
                        return alloc(null, size, fill, encoding);
                    };
                    function allocUnsafe(that, size) {
                        assertSize(size);
                        that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
                        if (!Buffer.TYPED_ARRAY_SUPPORT) {
                            for (var i = 0; i < size; ++i) {
                                that[i] = 0;
                            }
                        }
                        return that;
                    }
                    /**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
                    Buffer.allocUnsafe = function (size) {
                        return allocUnsafe(null, size);
                    };
                    /**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
                    Buffer.allocUnsafeSlow = function (size) {
                        return allocUnsafe(null, size);
                    };
                    function fromString(that, string, encoding) {
                        if (typeof encoding !== 'string' || encoding === '') {
                            encoding = 'utf8';
                        }
                        if (!Buffer.isEncoding(encoding)) {
                            throw new TypeError('"encoding" must be a valid string encoding');
                        }
                        var length = byteLength(string, encoding) | 0;
                        that = createBuffer(that, length);
                        var actual = that.write(string, encoding);
                        if (actual !== length) {
                            // Writing a hex string, for example, that contains invalid characters will
                            // cause everything after the first invalid character to be ignored. (e.g.
                            // 'abxxcd' will be treated as 'ab')
                            that = that.slice(0, actual);
                        }
                        return that;
                    }
                    function fromArrayLike(that, array) {
                        var length = array.length < 0 ? 0 : checked(array.length) | 0;
                        that = createBuffer(that, length);
                        for (var i = 0; i < length; i += 1) {
                            that[i] = array[i] & 255;
                        }
                        return that;
                    }
                    function fromArrayBuffer(that, array, byteOffset, length) {
                        array.byteLength;
                        // this throws if `array` is not a valid ArrayBuffer
                        if (byteOffset < 0 || array.byteLength < byteOffset) {
                            throw new RangeError('\'offset\' is out of bounds');
                        }
                        if (array.byteLength < byteOffset + (length || 0)) {
                            throw new RangeError('\'length\' is out of bounds');
                        }
                        if (byteOffset === undefined && length === undefined) {
                            array = new Uint8Array(array);
                        } else if (length === undefined) {
                            array = new Uint8Array(array, byteOffset);
                        } else {
                            array = new Uint8Array(array, byteOffset, length);
                        }
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            // Return an augmented `Uint8Array` instance, for best performance
                            that = array;
                            that.__proto__ = Buffer.prototype;
                        } else {
                            // Fallback: Return an object instance of the Buffer class
                            that = fromArrayLike(that, array);
                        }
                        return that;
                    }
                    function fromObject(that, obj) {
                        if (Buffer.isBuffer(obj)) {
                            var len = checked(obj.length) | 0;
                            that = createBuffer(that, len);
                            if (that.length === 0) {
                                return that;
                            }
                            obj.copy(that, 0, 0, len);
                            return that;
                        }
                        if (obj) {
                            if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
                                if (typeof obj.length !== 'number' || isnan(obj.length)) {
                                    return createBuffer(that, 0);
                                }
                                return fromArrayLike(that, obj);
                            }
                            if (obj.type === 'Buffer' && isArray(obj.data)) {
                                return fromArrayLike(that, obj.data);
                            }
                        }
                        throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
                    }
                    function checked(length) {
                        // Note: cannot use `length < kMaxLength()` here because that fails when
                        // length is NaN (which is otherwise coerced to zero.)
                        if (length >= kMaxLength()) {
                            throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
                        }
                        return length | 0;
                    }
                    function SlowBuffer(length) {
                        if (+length != length) {
                            // eslint-disable-line eqeqeq
                            length = 0;
                        }
                        return Buffer.alloc(+length);
                    }
                    Buffer.isBuffer = function isBuffer(b) {
                        return !!(b != null && b._isBuffer);
                    };
                    Buffer.compare = function compare(a, b) {
                        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                            throw new TypeError('Arguments must be Buffers');
                        }
                        if (a === b)
                            return 0;
                        var x = a.length;
                        var y = b.length;
                        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                            if (a[i] !== b[i]) {
                                x = a[i];
                                y = b[i];
                                break;
                            }
                        }
                        if (x < y)
                            return -1;
                        if (y < x)
                            return 1;
                        return 0;
                    };
                    Buffer.isEncoding = function isEncoding(encoding) {
                        switch (String(encoding).toLowerCase()) {
                        case 'hex':
                        case 'utf8':
                        case 'utf-8':
                        case 'ascii':
                        case 'latin1':
                        case 'binary':
                        case 'base64':
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return true;
                        default:
                            return false;
                        }
                    };
                    Buffer.concat = function concat(list, length) {
                        if (!isArray(list)) {
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        }
                        if (list.length === 0) {
                            return Buffer.alloc(0);
                        }
                        var i;
                        if (length === undefined) {
                            length = 0;
                            for (i = 0; i < list.length; ++i) {
                                length += list[i].length;
                            }
                        }
                        var buffer = Buffer.allocUnsafe(length);
                        var pos = 0;
                        for (i = 0; i < list.length; ++i) {
                            var buf = list[i];
                            if (!Buffer.isBuffer(buf)) {
                                throw new TypeError('"list" argument must be an Array of Buffers');
                            }
                            buf.copy(buffer, pos);
                            pos += buf.length;
                        }
                        return buffer;
                    };
                    function byteLength(string, encoding) {
                        if (Buffer.isBuffer(string)) {
                            return string.length;
                        }
                        if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                            return string.byteLength;
                        }
                        if (typeof string !== 'string') {
                            string = '' + string;
                        }
                        var len = string.length;
                        if (len === 0)
                            return 0;
                        // Use a for loop to avoid recursion
                        var loweredCase = false;
                        for (;;) {
                            switch (encoding) {
                            case 'ascii':
                            case 'latin1':
                            case 'binary':
                                return len;
                            case 'utf8':
                            case 'utf-8':
                            case undefined:
                                return utf8ToBytes(string).length;
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return len * 2;
                            case 'hex':
                                return len >>> 1;
                            case 'base64':
                                return base64ToBytes(string).length;
                            default:
                                if (loweredCase)
                                    return utf8ToBytes(string).length;
                                // assume utf8
                                encoding = ('' + encoding).toLowerCase();
                                loweredCase = true;
                            }
                        }
                    }
                    Buffer.byteLength = byteLength;
                    function slowToString(encoding, start, end) {
                        var loweredCase = false;
                        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
                        // property of a typed array.
                        // This behaves neither like String nor Uint8Array in that we set start/end
                        // to their upper/lower bounds if the value passed is out of range.
                        // undefined is handled specially as per ECMA-262 6th Edition,
                        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
                        if (start === undefined || start < 0) {
                            start = 0;
                        }
                        // Return early if start > this.length. Done here to prevent potential uint32
                        // coercion fail below.
                        if (start > this.length) {
                            return '';
                        }
                        if (end === undefined || end > this.length) {
                            end = this.length;
                        }
                        if (end <= 0) {
                            return '';
                        }
                        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
                        end >>>= 0;
                        start >>>= 0;
                        if (end <= start) {
                            return '';
                        }
                        if (!encoding)
                            encoding = 'utf8';
                        while (true) {
                            switch (encoding) {
                            case 'hex':
                                return hexSlice(this, start, end);
                            case 'utf8':
                            case 'utf-8':
                                return utf8Slice(this, start, end);
                            case 'ascii':
                                return asciiSlice(this, start, end);
                            case 'latin1':
                            case 'binary':
                                return latin1Slice(this, start, end);
                            case 'base64':
                                return base64Slice(this, start, end);
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return utf16leSlice(this, start, end);
                            default:
                                if (loweredCase)
                                    throw new TypeError('Unknown encoding: ' + encoding);
                                encoding = (encoding + '').toLowerCase();
                                loweredCase = true;
                            }
                        }
                    }
                    // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
                    // Buffer instances.
                    Buffer.prototype._isBuffer = true;
                    function swap(b, n, m) {
                        var i = b[n];
                        b[n] = b[m];
                        b[m] = i;
                    }
                    Buffer.prototype.swap16 = function swap16() {
                        var len = this.length;
                        if (len % 2 !== 0) {
                            throw new RangeError('Buffer size must be a multiple of 16-bits');
                        }
                        for (var i = 0; i < len; i += 2) {
                            swap(this, i, i + 1);
                        }
                        return this;
                    };
                    Buffer.prototype.swap32 = function swap32() {
                        var len = this.length;
                        if (len % 4 !== 0) {
                            throw new RangeError('Buffer size must be a multiple of 32-bits');
                        }
                        for (var i = 0; i < len; i += 4) {
                            swap(this, i, i + 3);
                            swap(this, i + 1, i + 2);
                        }
                        return this;
                    };
                    Buffer.prototype.swap64 = function swap64() {
                        var len = this.length;
                        if (len % 8 !== 0) {
                            throw new RangeError('Buffer size must be a multiple of 64-bits');
                        }
                        for (var i = 0; i < len; i += 8) {
                            swap(this, i, i + 7);
                            swap(this, i + 1, i + 6);
                            swap(this, i + 2, i + 5);
                            swap(this, i + 3, i + 4);
                        }
                        return this;
                    };
                    Buffer.prototype.toString = function toString() {
                        var length = this.length | 0;
                        if (length === 0)
                            return '';
                        if (arguments.length === 0)
                            return utf8Slice(this, 0, length);
                        return slowToString.apply(this, arguments);
                    };
                    Buffer.prototype.equals = function equals(b) {
                        if (!Buffer.isBuffer(b))
                            throw new TypeError('Argument must be a Buffer');
                        if (this === b)
                            return true;
                        return Buffer.compare(this, b) === 0;
                    };
                    Buffer.prototype.inspect = function inspect() {
                        var str = '';
                        var max = exports.INSPECT_MAX_BYTES;
                        if (this.length > 0) {
                            str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
                            if (this.length > max)
                                str += ' ... ';
                        }
                        return '<Buffer ' + str + '>';
                    };
                    Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                        if (!Buffer.isBuffer(target)) {
                            throw new TypeError('Argument must be a Buffer');
                        }
                        if (start === undefined) {
                            start = 0;
                        }
                        if (end === undefined) {
                            end = target ? target.length : 0;
                        }
                        if (thisStart === undefined) {
                            thisStart = 0;
                        }
                        if (thisEnd === undefined) {
                            thisEnd = this.length;
                        }
                        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                            throw new RangeError('out of range index');
                        }
                        if (thisStart >= thisEnd && start >= end) {
                            return 0;
                        }
                        if (thisStart >= thisEnd) {
                            return -1;
                        }
                        if (start >= end) {
                            return 1;
                        }
                        start >>>= 0;
                        end >>>= 0;
                        thisStart >>>= 0;
                        thisEnd >>>= 0;
                        if (this === target)
                            return 0;
                        var x = thisEnd - thisStart;
                        var y = end - start;
                        var len = Math.min(x, y);
                        var thisCopy = this.slice(thisStart, thisEnd);
                        var targetCopy = target.slice(start, end);
                        for (var i = 0; i < len; ++i) {
                            if (thisCopy[i] !== targetCopy[i]) {
                                x = thisCopy[i];
                                y = targetCopy[i];
                                break;
                            }
                        }
                        if (x < y)
                            return -1;
                        if (y < x)
                            return 1;
                        return 0;
                    };
                    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
                    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
                    //
                    // Arguments:
                    // - buffer - a Buffer to search
                    // - val - a string, Buffer, or number
                    // - byteOffset - an index into `buffer`; will be clamped to an int32
                    // - encoding - an optional encoding, relevant is val is a string
                    // - dir - true for indexOf, false for lastIndexOf
                    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                        // Empty buffer means no match
                        if (buffer.length === 0)
                            return -1;
                        // Normalize byteOffset
                        if (typeof byteOffset === 'string') {
                            encoding = byteOffset;
                            byteOffset = 0;
                        } else if (byteOffset > 2147483647) {
                            byteOffset = 2147483647;
                        } else if (byteOffset < -2147483648) {
                            byteOffset = -2147483648;
                        }
                        byteOffset = +byteOffset;
                        // Coerce to Number.
                        if (isNaN(byteOffset)) {
                            // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                            byteOffset = dir ? 0 : buffer.length - 1;
                        }
                        // Normalize byteOffset: negative offsets start from the end of the buffer
                        if (byteOffset < 0)
                            byteOffset = buffer.length + byteOffset;
                        if (byteOffset >= buffer.length) {
                            if (dir)
                                return -1;
                            else
                                byteOffset = buffer.length - 1;
                        } else if (byteOffset < 0) {
                            if (dir)
                                byteOffset = 0;
                            else
                                return -1;
                        }
                        // Normalize val
                        if (typeof val === 'string') {
                            val = Buffer.from(val, encoding);
                        }
                        // Finally, search either indexOf (if dir is true) or lastIndexOf
                        if (Buffer.isBuffer(val)) {
                            // Special case: looking for empty string/buffer always fails
                            if (val.length === 0) {
                                return -1;
                            }
                            return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                        } else if (typeof val === 'number') {
                            val = val & 255;
                            // Search for a byte value [0-255]
                            if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
                                if (dir) {
                                    return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
                                } else {
                                    return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
                                }
                            }
                            return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
                        }
                        throw new TypeError('val must be string, number or Buffer');
                    }
                    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                        var indexSize = 1;
                        var arrLength = arr.length;
                        var valLength = val.length;
                        if (encoding !== undefined) {
                            encoding = String(encoding).toLowerCase();
                            if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
                                if (arr.length < 2 || val.length < 2) {
                                    return -1;
                                }
                                indexSize = 2;
                                arrLength /= 2;
                                valLength /= 2;
                                byteOffset /= 2;
                            }
                        }
                        function read(buf, i) {
                            if (indexSize === 1) {
                                return buf[i];
                            } else {
                                return buf.readUInt16BE(i * indexSize);
                            }
                        }
                        var i;
                        if (dir) {
                            var foundIndex = -1;
                            for (i = byteOffset; i < arrLength; i++) {
                                if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                                    if (foundIndex === -1)
                                        foundIndex = i;
                                    if (i - foundIndex + 1 === valLength)
                                        return foundIndex * indexSize;
                                } else {
                                    if (foundIndex !== -1)
                                        i -= i - foundIndex;
                                    foundIndex = -1;
                                }
                            }
                        } else {
                            if (byteOffset + valLength > arrLength)
                                byteOffset = arrLength - valLength;
                            for (i = byteOffset; i >= 0; i--) {
                                var found = true;
                                for (var j = 0; j < valLength; j++) {
                                    if (read(arr, i + j) !== read(val, j)) {
                                        found = false;
                                        break;
                                    }
                                }
                                if (found)
                                    return i;
                            }
                        }
                        return -1;
                    }
                    Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
                        return this.indexOf(val, byteOffset, encoding) !== -1;
                    };
                    Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
                        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
                    };
                    Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
                        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
                    };
                    function hexWrite(buf, string, offset, length) {
                        offset = Number(offset) || 0;
                        var remaining = buf.length - offset;
                        if (!length) {
                            length = remaining;
                        } else {
                            length = Number(length);
                            if (length > remaining) {
                                length = remaining;
                            }
                        }
                        // must be an even number of digits
                        var strLen = string.length;
                        if (strLen % 2 !== 0)
                            throw new TypeError('Invalid hex string');
                        if (length > strLen / 2) {
                            length = strLen / 2;
                        }
                        for (var i = 0; i < length; ++i) {
                            var parsed = parseInt(string.substr(i * 2, 2), 16);
                            if (isNaN(parsed))
                                return i;
                            buf[offset + i] = parsed;
                        }
                        return i;
                    }
                    function utf8Write(buf, string, offset, length) {
                        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
                    }
                    function asciiWrite(buf, string, offset, length) {
                        return blitBuffer(asciiToBytes(string), buf, offset, length);
                    }
                    function latin1Write(buf, string, offset, length) {
                        return asciiWrite(buf, string, offset, length);
                    }
                    function base64Write(buf, string, offset, length) {
                        return blitBuffer(base64ToBytes(string), buf, offset, length);
                    }
                    function ucs2Write(buf, string, offset, length) {
                        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
                    }
                    Buffer.prototype.write = function write(string, offset, length, encoding) {
                        // Buffer#write(string)
                        if (offset === undefined) {
                            encoding = 'utf8';
                            length = this.length;
                            offset = 0    // Buffer#write(string, encoding)
;
                        } else if (length === undefined && typeof offset === 'string') {
                            encoding = offset;
                            length = this.length;
                            offset = 0    // Buffer#write(string, offset[, length][, encoding])
;
                        } else if (isFinite(offset)) {
                            offset = offset | 0;
                            if (isFinite(length)) {
                                length = length | 0;
                                if (encoding === undefined)
                                    encoding = 'utf8';
                            } else {
                                encoding = length;
                                length = undefined;
                            }    // legacy write(string, encoding, offset, length) - remove in v0.13
                        } else {
                            throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                        }
                        var remaining = this.length - offset;
                        if (length === undefined || length > remaining)
                            length = remaining;
                        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
                            throw new RangeError('Attempt to write outside buffer bounds');
                        }
                        if (!encoding)
                            encoding = 'utf8';
                        var loweredCase = false;
                        for (;;) {
                            switch (encoding) {
                            case 'hex':
                                return hexWrite(this, string, offset, length);
                            case 'utf8':
                            case 'utf-8':
                                return utf8Write(this, string, offset, length);
                            case 'ascii':
                                return asciiWrite(this, string, offset, length);
                            case 'latin1':
                            case 'binary':
                                return latin1Write(this, string, offset, length);
                            case 'base64':
                                // Warning: maxLength not taken into account in base64Write
                                return base64Write(this, string, offset, length);
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return ucs2Write(this, string, offset, length);
                            default:
                                if (loweredCase)
                                    throw new TypeError('Unknown encoding: ' + encoding);
                                encoding = ('' + encoding).toLowerCase();
                                loweredCase = true;
                            }
                        }
                    };
                    Buffer.prototype.toJSON = function toJSON() {
                        return {
                            type: 'Buffer',
                            data: Array.prototype.slice.call(this._arr || this, 0)
                        };
                    };
                    function base64Slice(buf, start, end) {
                        if (start === 0 && end === buf.length) {
                            return base64.fromByteArray(buf);
                        } else {
                            return base64.fromByteArray(buf.slice(start, end));
                        }
                    }
                    function utf8Slice(buf, start, end) {
                        end = Math.min(buf.length, end);
                        var res = [];
                        var i = start;
                        while (i < end) {
                            var firstByte = buf[i];
                            var codePoint = null;
                            var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
                            if (i + bytesPerSequence <= end) {
                                var secondByte, thirdByte, fourthByte, tempCodePoint;
                                switch (bytesPerSequence) {
                                case 1:
                                    if (firstByte < 128) {
                                        codePoint = firstByte;
                                    }
                                    break;
                                case 2:
                                    secondByte = buf[i + 1];
                                    if ((secondByte & 192) === 128) {
                                        tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                                        if (tempCodePoint > 127) {
                                            codePoint = tempCodePoint;
                                        }
                                    }
                                    break;
                                case 3:
                                    secondByte = buf[i + 1];
                                    thirdByte = buf[i + 2];
                                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                                        tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                                        if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                                            codePoint = tempCodePoint;
                                        }
                                    }
                                    break;
                                case 4:
                                    secondByte = buf[i + 1];
                                    thirdByte = buf[i + 2];
                                    fourthByte = buf[i + 3];
                                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                                        tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                                        if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                                            codePoint = tempCodePoint;
                                        }
                                    }
                                }
                            }
                            if (codePoint === null) {
                                // we did not generate a valid codePoint so insert a
                                // replacement char (U+FFFD) and advance only 1 byte
                                codePoint = 65533;
                                bytesPerSequence = 1;
                            } else if (codePoint > 65535) {
                                // encode to utf16 (surrogate pair dance)
                                codePoint -= 65536;
                                res.push(codePoint >>> 10 & 1023 | 55296);
                                codePoint = 56320 | codePoint & 1023;
                            }
                            res.push(codePoint);
                            i += bytesPerSequence;
                        }
                        return decodeCodePointsArray(res);
                    }
                    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
                    // the lowest limit is Chrome, with 0x10000 args.
                    // We go 1 magnitude less, for safety
                    var MAX_ARGUMENTS_LENGTH = 4096;
                    function decodeCodePointsArray(codePoints) {
                        var len = codePoints.length;
                        if (len <= MAX_ARGUMENTS_LENGTH) {
                            return String.fromCharCode.apply(String, codePoints)    // avoid extra slice()
;
                        }
                        // Decode in chunks to avoid "call stack size exceeded".
                        var res = '';
                        var i = 0;
                        while (i < len) {
                            res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
                        }
                        return res;
                    }
                    function asciiSlice(buf, start, end) {
                        var ret = '';
                        end = Math.min(buf.length, end);
                        for (var i = start; i < end; ++i) {
                            ret += String.fromCharCode(buf[i] & 127);
                        }
                        return ret;
                    }
                    function latin1Slice(buf, start, end) {
                        var ret = '';
                        end = Math.min(buf.length, end);
                        for (var i = start; i < end; ++i) {
                            ret += String.fromCharCode(buf[i]);
                        }
                        return ret;
                    }
                    function hexSlice(buf, start, end) {
                        var len = buf.length;
                        if (!start || start < 0)
                            start = 0;
                        if (!end || end < 0 || end > len)
                            end = len;
                        var out = '';
                        for (var i = start; i < end; ++i) {
                            out += toHex(buf[i]);
                        }
                        return out;
                    }
                    function utf16leSlice(buf, start, end) {
                        var bytes = buf.slice(start, end);
                        var res = '';
                        for (var i = 0; i < bytes.length; i += 2) {
                            res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
                        }
                        return res;
                    }
                    Buffer.prototype.slice = function slice(start, end) {
                        var len = this.length;
                        start = ~~start;
                        end = end === undefined ? len : ~~end;
                        if (start < 0) {
                            start += len;
                            if (start < 0)
                                start = 0;
                        } else if (start > len) {
                            start = len;
                        }
                        if (end < 0) {
                            end += len;
                            if (end < 0)
                                end = 0;
                        } else if (end > len) {
                            end = len;
                        }
                        if (end < start)
                            end = start;
                        var newBuf;
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            newBuf = this.subarray(start, end);
                            newBuf.__proto__ = Buffer.prototype;
                        } else {
                            var sliceLen = end - start;
                            newBuf = new Buffer(sliceLen, undefined);
                            for (var i = 0; i < sliceLen; ++i) {
                                newBuf[i] = this[i + start];
                            }
                        }
                        return newBuf;
                    };
                    /*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
                    function checkOffset(offset, ext, length) {
                        if (offset % 1 !== 0 || offset < 0)
                            throw new RangeError('offset is not uint');
                        if (offset + ext > length)
                            throw new RangeError('Trying to access beyond buffer length');
                    }
                    Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                        offset = offset | 0;
                        byteLength = byteLength | 0;
                        if (!noAssert)
                            checkOffset(offset, byteLength, this.length);
                        var val = this[offset];
                        var mul = 1;
                        var i = 0;
                        while (++i < byteLength && (mul *= 256)) {
                            val += this[offset + i] * mul;
                        }
                        return val;
                    };
                    Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                        offset = offset | 0;
                        byteLength = byteLength | 0;
                        if (!noAssert) {
                            checkOffset(offset, byteLength, this.length);
                        }
                        var val = this[offset + --byteLength];
                        var mul = 1;
                        while (byteLength > 0 && (mul *= 256)) {
                            val += this[offset + --byteLength] * mul;
                        }
                        return val;
                    };
                    Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 1, this.length);
                        return this[offset];
                    };
                    Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 2, this.length);
                        return this[offset] | this[offset + 1] << 8;
                    };
                    Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 2, this.length);
                        return this[offset] << 8 | this[offset + 1];
                    };
                    Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 4, this.length);
                        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
                    };
                    Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 4, this.length);
                        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
                    };
                    Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                        offset = offset | 0;
                        byteLength = byteLength | 0;
                        if (!noAssert)
                            checkOffset(offset, byteLength, this.length);
                        var val = this[offset];
                        var mul = 1;
                        var i = 0;
                        while (++i < byteLength && (mul *= 256)) {
                            val += this[offset + i] * mul;
                        }
                        mul *= 128;
                        if (val >= mul)
                            val -= Math.pow(2, 8 * byteLength);
                        return val;
                    };
                    Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                        offset = offset | 0;
                        byteLength = byteLength | 0;
                        if (!noAssert)
                            checkOffset(offset, byteLength, this.length);
                        var i = byteLength;
                        var mul = 1;
                        var val = this[offset + --i];
                        while (i > 0 && (mul *= 256)) {
                            val += this[offset + --i] * mul;
                        }
                        mul *= 128;
                        if (val >= mul)
                            val -= Math.pow(2, 8 * byteLength);
                        return val;
                    };
                    Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 1, this.length);
                        if (!(this[offset] & 128))
                            return this[offset];
                        return (255 - this[offset] + 1) * -1;
                    };
                    Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 2, this.length);
                        var val = this[offset] | this[offset + 1] << 8;
                        return val & 32768 ? val | 4294901760 : val;
                    };
                    Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 2, this.length);
                        var val = this[offset + 1] | this[offset] << 8;
                        return val & 32768 ? val | 4294901760 : val;
                    };
                    Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 4, this.length);
                        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
                    };
                    Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 4, this.length);
                        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
                    };
                    Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 4, this.length);
                        return ieee754.read(this, offset, true, 23, 4);
                    };
                    Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 4, this.length);
                        return ieee754.read(this, offset, false, 23, 4);
                    };
                    Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 8, this.length);
                        return ieee754.read(this, offset, true, 52, 8);
                    };
                    Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                        if (!noAssert)
                            checkOffset(offset, 8, this.length);
                        return ieee754.read(this, offset, false, 52, 8);
                    };
                    function checkInt(buf, value, offset, ext, max, min) {
                        if (!Buffer.isBuffer(buf))
                            throw new TypeError('"buffer" argument must be a Buffer instance');
                        if (value > max || value < min)
                            throw new RangeError('"value" argument is out of bounds');
                        if (offset + ext > buf.length)
                            throw new RangeError('Index out of range');
                    }
                    Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        byteLength = byteLength | 0;
                        if (!noAssert) {
                            var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                            checkInt(this, value, offset, byteLength, maxBytes, 0);
                        }
                        var mul = 1;
                        var i = 0;
                        this[offset] = value & 255;
                        while (++i < byteLength && (mul *= 256)) {
                            this[offset + i] = value / mul & 255;
                        }
                        return offset + byteLength;
                    };
                    Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        byteLength = byteLength | 0;
                        if (!noAssert) {
                            var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                            checkInt(this, value, offset, byteLength, maxBytes, 0);
                        }
                        var i = byteLength - 1;
                        var mul = 1;
                        this[offset + i] = value & 255;
                        while (--i >= 0 && (mul *= 256)) {
                            this[offset + i] = value / mul & 255;
                        }
                        return offset + byteLength;
                    };
                    Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 1, 255, 0);
                        if (!Buffer.TYPED_ARRAY_SUPPORT)
                            value = Math.floor(value);
                        this[offset] = value & 255;
                        return offset + 1;
                    };
                    function objectWriteUInt16(buf, value, offset, littleEndian) {
                        if (value < 0)
                            value = 65535 + value + 1;
                        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
                            buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
                        }
                    }
                    Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 65535, 0);
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset] = value & 255;
                            this[offset + 1] = value >>> 8;
                        } else {
                            objectWriteUInt16(this, value, offset, true);
                        }
                        return offset + 2;
                    };
                    Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 65535, 0);
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset] = value >>> 8;
                            this[offset + 1] = value & 255;
                        } else {
                            objectWriteUInt16(this, value, offset, false);
                        }
                        return offset + 2;
                    };
                    function objectWriteUInt32(buf, value, offset, littleEndian) {
                        if (value < 0)
                            value = 4294967295 + value + 1;
                        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
                            buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
                        }
                    }
                    Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 4, 4294967295, 0);
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset + 3] = value >>> 24;
                            this[offset + 2] = value >>> 16;
                            this[offset + 1] = value >>> 8;
                            this[offset] = value & 255;
                        } else {
                            objectWriteUInt32(this, value, offset, true);
                        }
                        return offset + 4;
                    };
                    Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 4, 4294967295, 0);
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset] = value >>> 24;
                            this[offset + 1] = value >>> 16;
                            this[offset + 2] = value >>> 8;
                            this[offset + 3] = value & 255;
                        } else {
                            objectWriteUInt32(this, value, offset, false);
                        }
                        return offset + 4;
                    };
                    Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert) {
                            var limit = Math.pow(2, 8 * byteLength - 1);
                            checkInt(this, value, offset, byteLength, limit - 1, -limit);
                        }
                        var i = 0;
                        var mul = 1;
                        var sub = 0;
                        this[offset] = value & 255;
                        while (++i < byteLength && (mul *= 256)) {
                            if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                                sub = 1;
                            }
                            this[offset + i] = (value / mul >> 0) - sub & 255;
                        }
                        return offset + byteLength;
                    };
                    Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert) {
                            var limit = Math.pow(2, 8 * byteLength - 1);
                            checkInt(this, value, offset, byteLength, limit - 1, -limit);
                        }
                        var i = byteLength - 1;
                        var mul = 1;
                        var sub = 0;
                        this[offset + i] = value & 255;
                        while (--i >= 0 && (mul *= 256)) {
                            if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                                sub = 1;
                            }
                            this[offset + i] = (value / mul >> 0) - sub & 255;
                        }
                        return offset + byteLength;
                    };
                    Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 1, 127, -128);
                        if (!Buffer.TYPED_ARRAY_SUPPORT)
                            value = Math.floor(value);
                        if (value < 0)
                            value = 255 + value + 1;
                        this[offset] = value & 255;
                        return offset + 1;
                    };
                    Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 32767, -32768);
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset] = value & 255;
                            this[offset + 1] = value >>> 8;
                        } else {
                            objectWriteUInt16(this, value, offset, true);
                        }
                        return offset + 2;
                    };
                    Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 32767, -32768);
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset] = value >>> 8;
                            this[offset + 1] = value & 255;
                        } else {
                            objectWriteUInt16(this, value, offset, false);
                        }
                        return offset + 2;
                    };
                    Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 4, 2147483647, -2147483648);
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset] = value & 255;
                            this[offset + 1] = value >>> 8;
                            this[offset + 2] = value >>> 16;
                            this[offset + 3] = value >>> 24;
                        } else {
                            objectWriteUInt32(this, value, offset, true);
                        }
                        return offset + 4;
                    };
                    Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                        value = +value;
                        offset = offset | 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 4, 2147483647, -2147483648);
                        if (value < 0)
                            value = 4294967295 + value + 1;
                        if (Buffer.TYPED_ARRAY_SUPPORT) {
                            this[offset] = value >>> 24;
                            this[offset + 1] = value >>> 16;
                            this[offset + 2] = value >>> 8;
                            this[offset + 3] = value & 255;
                        } else {
                            objectWriteUInt32(this, value, offset, false);
                        }
                        return offset + 4;
                    };
                    function checkIEEE754(buf, value, offset, ext, max, min) {
                        if (offset + ext > buf.length)
                            throw new RangeError('Index out of range');
                        if (offset < 0)
                            throw new RangeError('Index out of range');
                    }
                    function writeFloat(buf, value, offset, littleEndian, noAssert) {
                        if (!noAssert) {
                            checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
                        }
                        ieee754.write(buf, value, offset, littleEndian, 23, 4);
                        return offset + 4;
                    }
                    Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                        return writeFloat(this, value, offset, true, noAssert);
                    };
                    Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                        return writeFloat(this, value, offset, false, noAssert);
                    };
                    function writeDouble(buf, value, offset, littleEndian, noAssert) {
                        if (!noAssert) {
                            checkIEEE754(buf, value, offset, 8, 1.7976931348623157e+308, -1.7976931348623157e+308);
                        }
                        ieee754.write(buf, value, offset, littleEndian, 52, 8);
                        return offset + 8;
                    }
                    Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                        return writeDouble(this, value, offset, true, noAssert);
                    };
                    Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                        return writeDouble(this, value, offset, false, noAssert);
                    };
                    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
                    Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                        if (!start)
                            start = 0;
                        if (!end && end !== 0)
                            end = this.length;
                        if (targetStart >= target.length)
                            targetStart = target.length;
                        if (!targetStart)
                            targetStart = 0;
                        if (end > 0 && end < start)
                            end = start;
                        // Copy 0 bytes; we're done
                        if (end === start)
                            return 0;
                        if (target.length === 0 || this.length === 0)
                            return 0;
                        // Fatal error conditions
                        if (targetStart < 0) {
                            throw new RangeError('targetStart out of bounds');
                        }
                        if (start < 0 || start >= this.length)
                            throw new RangeError('sourceStart out of bounds');
                        if (end < 0)
                            throw new RangeError('sourceEnd out of bounds');
                        // Are we oob?
                        if (end > this.length)
                            end = this.length;
                        if (target.length - targetStart < end - start) {
                            end = target.length - targetStart + start;
                        }
                        var len = end - start;
                        var i;
                        if (this === target && start < targetStart && targetStart < end) {
                            // descending copy from end
                            for (i = len - 1; i >= 0; --i) {
                                target[i + targetStart] = this[i + start];
                            }
                        } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
                            // ascending copy from start
                            for (i = 0; i < len; ++i) {
                                target[i + targetStart] = this[i + start];
                            }
                        } else {
                            Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
                        }
                        return len;
                    };
                    // Usage:
                    //    buffer.fill(number[, offset[, end]])
                    //    buffer.fill(buffer[, offset[, end]])
                    //    buffer.fill(string[, offset[, end]][, encoding])
                    Buffer.prototype.fill = function fill(val, start, end, encoding) {
                        // Handle string cases:
                        if (typeof val === 'string') {
                            if (typeof start === 'string') {
                                encoding = start;
                                start = 0;
                                end = this.length;
                            } else if (typeof end === 'string') {
                                encoding = end;
                                end = this.length;
                            }
                            if (val.length === 1) {
                                var code = val.charCodeAt(0);
                                if (code < 256) {
                                    val = code;
                                }
                            }
                            if (encoding !== undefined && typeof encoding !== 'string') {
                                throw new TypeError('encoding must be a string');
                            }
                            if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                                throw new TypeError('Unknown encoding: ' + encoding);
                            }
                        } else if (typeof val === 'number') {
                            val = val & 255;
                        }
                        // Invalid ranges are not set to a default, so can range check early.
                        if (start < 0 || this.length < start || this.length < end) {
                            throw new RangeError('Out of range index');
                        }
                        if (end <= start) {
                            return this;
                        }
                        start = start >>> 0;
                        end = end === undefined ? this.length : end >>> 0;
                        if (!val)
                            val = 0;
                        var i;
                        if (typeof val === 'number') {
                            for (i = start; i < end; ++i) {
                                this[i] = val;
                            }
                        } else {
                            var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
                            var len = bytes.length;
                            for (i = 0; i < end - start; ++i) {
                                this[i + start] = bytes[i % len];
                            }
                        }
                        return this;
                    };
                    // HELPER FUNCTIONS
                    // ================
                    var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
                    function base64clean(str) {
                        // Node strips out invalid characters like \n and \t from the string, base64-js does not
                        str = stringtrim(str).replace(INVALID_BASE64_RE, '');
                        // Node converts strings with length < 2 to ''
                        if (str.length < 2)
                            return '';
                        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                        while (str.length % 4 !== 0) {
                            str = str + '=';
                        }
                        return str;
                    }
                    function stringtrim(str) {
                        if (str.trim)
                            return str.trim();
                        return str.replace(/^\s+|\s+$/g, '');
                    }
                    function toHex(n) {
                        if (n < 16)
                            return '0' + n.toString(16);
                        return n.toString(16);
                    }
                    function utf8ToBytes(string, units) {
                        units = units || Infinity;
                        var codePoint;
                        var length = string.length;
                        var leadSurrogate = null;
                        var bytes = [];
                        for (var i = 0; i < length; ++i) {
                            codePoint = string.charCodeAt(i);
                            // is surrogate component
                            if (codePoint > 55295 && codePoint < 57344) {
                                // last char was a lead
                                if (!leadSurrogate) {
                                    // no lead yet
                                    if (codePoint > 56319) {
                                        // unexpected trail
                                        if ((units -= 3) > -1)
                                            bytes.push(239, 191, 189);
                                        continue;
                                    } else if (i + 1 === length) {
                                        // unpaired lead
                                        if ((units -= 3) > -1)
                                            bytes.push(239, 191, 189);
                                        continue;
                                    }
                                    // valid lead
                                    leadSurrogate = codePoint;
                                    continue;
                                }
                                // 2 leads in a row
                                if (codePoint < 56320) {
                                    if ((units -= 3) > -1)
                                        bytes.push(239, 191, 189);
                                    leadSurrogate = codePoint;
                                    continue;
                                }
                                // valid surrogate pair
                                codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
                            } else if (leadSurrogate) {
                                // valid bmp char, but last char was a lead
                                if ((units -= 3) > -1)
                                    bytes.push(239, 191, 189);
                            }
                            leadSurrogate = null;
                            // encode utf8
                            if (codePoint < 128) {
                                if ((units -= 1) < 0)
                                    break;
                                bytes.push(codePoint);
                            } else if (codePoint < 2048) {
                                if ((units -= 2) < 0)
                                    break;
                                bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
                            } else if (codePoint < 65536) {
                                if ((units -= 3) < 0)
                                    break;
                                bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
                            } else if (codePoint < 1114112) {
                                if ((units -= 4) < 0)
                                    break;
                                bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
                            } else {
                                throw new Error('Invalid code point');
                            }
                        }
                        return bytes;
                    }
                    function asciiToBytes(str) {
                        var byteArray = [];
                        for (var i = 0; i < str.length; ++i) {
                            // Node's code seems to be doing this and not & 0x7F..
                            byteArray.push(str.charCodeAt(i) & 255);
                        }
                        return byteArray;
                    }
                    function utf16leToBytes(str, units) {
                        var c, hi, lo;
                        var byteArray = [];
                        for (var i = 0; i < str.length; ++i) {
                            if ((units -= 2) < 0)
                                break;
                            c = str.charCodeAt(i);
                            hi = c >> 8;
                            lo = c % 256;
                            byteArray.push(lo);
                            byteArray.push(hi);
                        }
                        return byteArray;
                    }
                    function base64ToBytes(str) {
                        return base64.toByteArray(base64clean(str));
                    }
                    function blitBuffer(src, dst, offset, length) {
                        for (var i = 0; i < length; ++i) {
                            if (i + offset >= dst.length || i >= src.length)
                                break;
                            dst[i + offset] = src[i];
                        }
                        return i;
                    }
                    function isnan(val) {
                        return val !== val    // eslint-disable-line no-self-compare
;
                    }
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {
                'base64-js': 5,
                'ieee754': 17,
                'isarray': 20
            }
        ],
        10: [
            function (require, module, exports) {
                module.exports = {
                    '100': 'Continue',
                    '101': 'Switching Protocols',
                    '102': 'Processing',
                    '200': 'OK',
                    '201': 'Created',
                    '202': 'Accepted',
                    '203': 'Non-Authoritative Information',
                    '204': 'No Content',
                    '205': 'Reset Content',
                    '206': 'Partial Content',
                    '207': 'Multi-Status',
                    '208': 'Already Reported',
                    '226': 'IM Used',
                    '300': 'Multiple Choices',
                    '301': 'Moved Permanently',
                    '302': 'Found',
                    '303': 'See Other',
                    '304': 'Not Modified',
                    '305': 'Use Proxy',
                    '307': 'Temporary Redirect',
                    '308': 'Permanent Redirect',
                    '400': 'Bad Request',
                    '401': 'Unauthorized',
                    '402': 'Payment Required',
                    '403': 'Forbidden',
                    '404': 'Not Found',
                    '405': 'Method Not Allowed',
                    '406': 'Not Acceptable',
                    '407': 'Proxy Authentication Required',
                    '408': 'Request Timeout',
                    '409': 'Conflict',
                    '410': 'Gone',
                    '411': 'Length Required',
                    '412': 'Precondition Failed',
                    '413': 'Payload Too Large',
                    '414': 'URI Too Long',
                    '415': 'Unsupported Media Type',
                    '416': 'Range Not Satisfiable',
                    '417': 'Expectation Failed',
                    '418': 'I\'m a teapot',
                    '421': 'Misdirected Request',
                    '422': 'Unprocessable Entity',
                    '423': 'Locked',
                    '424': 'Failed Dependency',
                    '425': 'Unordered Collection',
                    '426': 'Upgrade Required',
                    '428': 'Precondition Required',
                    '429': 'Too Many Requests',
                    '431': 'Request Header Fields Too Large',
                    '500': 'Internal Server Error',
                    '501': 'Not Implemented',
                    '502': 'Bad Gateway',
                    '503': 'Service Unavailable',
                    '504': 'Gateway Timeout',
                    '505': 'HTTP Version Not Supported',
                    '506': 'Variant Also Negotiates',
                    '507': 'Insufficient Storage',
                    '508': 'Loop Detected',
                    '509': 'Bandwidth Limit Exceeded',
                    '510': 'Not Extended',
                    '511': 'Network Authentication Required'
                };
            },
            {}
        ],
        11: [
            function (require, module, exports) {
                (function (Buffer) {
                    var util = require('util');
                    var Stream = require('stream').Stream;
                    var DelayedStream = require('delayed-stream');
                    module.exports = CombinedStream;
                    function CombinedStream() {
                        this.writable = false;
                        this.readable = true;
                        this.dataSize = 0;
                        this.maxDataSize = 2 * 1024 * 1024;
                        this.pauseStreams = true;
                        this._released = false;
                        this._streams = [];
                        this._currentStream = null;
                    }
                    util.inherits(CombinedStream, Stream);
                    CombinedStream.create = function (options) {
                    };
                    CombinedStream.isStreamLike = function (stream) {
                        return typeof stream !== 'function' && typeof stream !== 'string' && typeof stream !== 'boolean' && typeof stream !== 'number' && !Buffer.isBuffer(stream);
                    };
                    CombinedStream.prototype.append = function (stream) {
                        var isStreamLike = CombinedStream.isStreamLike(stream);
                        if (isStreamLike) {
                            if (!(stream instanceof DelayedStream)) {
                                var newStream = DelayedStream.create(stream, {
                                    maxDataSize: Infinity,
                                    pauseStream: this.pauseStreams
                                });
                                stream.on('data', this._checkDataSize.bind(this));
                                stream = newStream;
                            }
                            this._handleErrors(stream);
                            if (this.pauseStreams) {
                                stream.pause();
                            }
                        }
                        this._streams.push(stream);
                        return this;
                    };
                    CombinedStream.prototype.pipe = function (dest, options) {
                        Stream.prototype.pipe.call(this, dest, options);
                        this.resume();
                        return dest;
                    };
                    CombinedStream.prototype._getNext = function () {
                        this._currentStream = null;
                        var stream = this._streams.shift();
                        if (typeof stream == 'undefined') {
                            this.end();
                            return;
                        }
                        if (typeof stream !== 'function') {
                            this._pipeNext(stream);
                            return;
                        }
                        var getStream = stream;
                        getStream(function (stream) {
                            var isStreamLike = CombinedStream.isStreamLike(stream);
                            if (isStreamLike) {
                                stream.on('data', this._checkDataSize.bind(this));
                                this._handleErrors(stream);
                            }
                            this._pipeNext(stream);
                        }.bind(this));
                    };
                    CombinedStream.prototype._pipeNext = function (stream) {
                        this._currentStream = stream;
                        var isStreamLike = CombinedStream.isStreamLike(stream);
                        if (isStreamLike) {
                            stream.on('end', this._getNext.bind(this));
                            stream.pipe(this, { end: false });
                            return;
                        }
                        var value = stream;
                        this.write(value);
                        this._getNext();
                    };
                    CombinedStream.prototype._handleErrors = function (stream) {
                        var self = this;
                        stream.on('error', function (err) {
                        });
                    };
                    CombinedStream.prototype.write = function (data) {
                        this.emit('data', data);
                    };
                    CombinedStream.prototype.pause = function () {
                        if (!this.pauseStreams) {
                            return;
                        }
                        if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == 'function')
                            this._currentStream.pause();
                        this.emit('pause');
                    };
                    CombinedStream.prototype.resume = function () {
                        if (!this._released) {
                            this._released = true;
                            this.writable = true;
                            this._getNext();
                        }
                        if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == 'function')
                            this._currentStream.resume();
                        this.emit('resume');
                    };
                    CombinedStream.prototype.end = function () {
                        this._reset();
                        this.emit('end');
                    };
                    CombinedStream.prototype.destroy = function () {
                    };
                    CombinedStream.prototype._reset = function () {
                        this.writable = false;
                        this._streams = [];
                        this._currentStream = null;
                    };
                    CombinedStream.prototype._checkDataSize = function () {
                        this._updateDataSize();
                        if (this.dataSize <= this.maxDataSize) {
                            return;
                        }
                        var message = 'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
                        this._emitError(new Error(message));
                    };
                    CombinedStream.prototype._updateDataSize = function () {
                        this.dataSize = 0;
                        var self = this;
                        this._streams.forEach(function (stream) {
                            if (!stream.dataSize) {
                                return;
                            }
                            self.dataSize += stream.dataSize;
                        });
                        if (this._currentStream && this._currentStream.dataSize) {
                            this.dataSize += this._currentStream.dataSize;
                        }
                    };
                    CombinedStream.prototype._emitError = function (err) {
                    };
                }.call(this, { 'isBuffer': require('../../is-buffer/index.js') }));
            },
            {
                '../../is-buffer/index.js': 19,
                'delayed-stream': 13,
                'stream': 46,
                'util': 58
            }
        ],
        12: [
            function (require, module, exports) {
                (function (Buffer) {
                    // Copyright Joyent, Inc. and other Node contributors.
                    //
                    // Permission is hereby granted, free of charge, to any person obtaining a
                    // copy of this software and associated documentation files (the
                    // "Software"), to deal in the Software without restriction, including
                    // without limitation the rights to use, copy, modify, merge, publish,
                    // distribute, sublicense, and/or sell copies of the Software, and to permit
                    // persons to whom the Software is furnished to do so, subject to the
                    // following conditions:
                    //
                    // The above copyright notice and this permission notice shall be included
                    // in all copies or substantial portions of the Software.
                    //
                    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                    // USE OR OTHER DEALINGS IN THE SOFTWARE.
                    // NOTE: These type checking functions intentionally don't use `instanceof`
                    // because it is fragile and can be easily faked with `Object.create()`.
                    function isArray(arg) {
                        if (Array.isArray) {
                            return Array.isArray(arg);
                        }
                        return objectToString(arg) === '[object Array]';
                    }
                    exports.isArray = isArray;
                    function isBoolean(arg) {
                        return typeof arg === 'boolean';
                    }
                    exports.isBoolean = isBoolean;
                    function isNull(arg) {
                        return arg === null;
                    }
                    exports.isNull = isNull;
                    function isNullOrUndefined(arg) {
                        return arg == null;
                    }
                    exports.isNullOrUndefined = isNullOrUndefined;
                    function isNumber(arg) {
                        return typeof arg === 'number';
                    }
                    exports.isNumber = isNumber;
                    function isString(arg) {
                        return typeof arg === 'string';
                    }
                    exports.isString = isString;
                    function isSymbol(arg) {
                        return typeof arg === 'symbol';
                    }
                    exports.isSymbol = isSymbol;
                    function isUndefined(arg) {
                        return arg === void 0;
                    }
                    exports.isUndefined = isUndefined;
                    function isRegExp(re) {
                        return objectToString(re) === '[object RegExp]';
                    }
                    exports.isRegExp = isRegExp;
                    function isObject(arg) {
                        return typeof arg === 'object' && arg !== null;
                    }
                    exports.isObject = isObject;
                    function isDate(d) {
                        return objectToString(d) === '[object Date]';
                    }
                    exports.isDate = isDate;
                    function isError(e) {
                        return objectToString(e) === '[object Error]' || e instanceof Error;
                    }
                    exports.isError = isError;
                    function isFunction(arg) {
                        return typeof arg === 'function';
                    }
                    exports.isFunction = isFunction;
                    function isPrimitive(arg) {
                        return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
                        typeof arg === 'undefined';
                    }
                    exports.isPrimitive = isPrimitive;
                    exports.isBuffer = Buffer.isBuffer;
                    function objectToString(o) {
                        return Object.prototype.toString.call(o);
                    }
                }.call(this, { 'isBuffer': require('../../is-buffer/index.js') }));
            },
            { '../../is-buffer/index.js': 19 }
        ],
        13: [
            function (require, module, exports) {
                var Stream = require('stream').Stream;
                var util = require('util');
                module.exports = DelayedStream;
                function DelayedStream() {
                    this.source = null;
                    this.dataSize = 0;
                    this.maxDataSize = 1024 * 1024;
                    this.pauseStream = true;
                    this._maxDataSizeExceeded = false;
                    this._released = false;
                    this._bufferedEvents = [];
                }
                util.inherits(DelayedStream, Stream);
                DelayedStream.create = function (source, options) {
                    var delayedStream = new this();
                    options = options || {};
                    for (var option in options) {
                        delayedStream[option] = options[option];
                    }
                    delayedStream.source = source;
                    var realEmit = source.emit;
                    source.emit = function () {
                        delayedStream._handleEmit(arguments);
                        return realEmit.apply(source, arguments);
                    };
                    source.on('error', function () {
                    });
                    if (delayedStream.pauseStream) {
                        source.pause();
                    }
                    return delayedStream;
                };
                DelayedStream.prototype.__defineGetter__('readable', function () {
                });
                DelayedStream.prototype.resume = function () {
                    if (!this._released) {
                        this.release();
                    }
                    this.source.resume();
                };
                DelayedStream.prototype.pause = function () {
                    this.source.pause();
                };
                DelayedStream.prototype.release = function () {
                    this._released = true;
                    this._bufferedEvents.forEach(function (args) {
                        this.emit.apply(this, args);
                    }.bind(this));
                    this._bufferedEvents = [];
                };
                DelayedStream.prototype.pipe = function () {
                    var r = Stream.prototype.pipe.apply(this, arguments);
                    this.resume();
                    return r;
                };
                DelayedStream.prototype._handleEmit = function (args) {
                    if (this._released) {
                        this.emit.apply(this, args);
                        return;
                    }
                    if (args[0] === 'data') {
                        this.dataSize += args[1].length;
                        this._checkIfMaxDataSizeExceeded();
                    }
                    this._bufferedEvents.push(args);
                };
                DelayedStream.prototype._checkIfMaxDataSizeExceeded = function () {
                };
            },
            {
                'stream': 46,
                'util': 58
            }
        ],
        14: [
            function (require, module, exports) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                function EventEmitter() {
                    this._events = this._events || {};
                    this._maxListeners = this._maxListeners || undefined;
                }
                module.exports = EventEmitter;
                // Backwards-compat with node 0.10.x
                EventEmitter.EventEmitter = EventEmitter;
                EventEmitter.prototype._events = undefined;
                EventEmitter.prototype._maxListeners = undefined;
                // By default EventEmitters will print a warning if more than 10 listeners are
                // added to it. This is a useful default which helps finding memory leaks.
                EventEmitter.defaultMaxListeners = 10;
                // Obviously not all Emitters should be limited to 10. This function allows
                // that to be increased. Set to zero for unlimited.
                EventEmitter.prototype.setMaxListeners = function (n) {
                    if (!isNumber(n) || n < 0 || isNaN(n))
                        throw TypeError('n must be a positive number');
                    this._maxListeners = n;
                    return this;
                };
                EventEmitter.prototype.emit = function (type) {
                    var er, handler, len, args, i, listeners;
                    if (!this._events)
                        this._events = {};
                    // If there is no 'error' event listener then throw.
                    if (type === 'error') {
                        if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
                            er = arguments[1];
                            if (er instanceof Error) {
                                throw er;    // Unhandled 'error' event
                            } else {
                                // At least give some kind of context to the user
                                var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
                                err.context = er;
                                throw err;
                            }
                        }
                    }
                    handler = this._events[type];
                    if (isUndefined(handler))
                        return false;
                    if (isFunction(handler)) {
                        switch (arguments.length) {
                        // fast cases
                        case 1:
                            handler.call(this);
                            break;
                        case 2:
                            handler.call(this, arguments[1]);
                            break;
                        case 3:
                            handler.call(this, arguments[1], arguments[2]);
                            break;
                        // slower
                        default:
                            args = Array.prototype.slice.call(arguments, 1);
                            handler.apply(this, args);
                        }
                    } else if (isObject(handler)) {
                        args = Array.prototype.slice.call(arguments, 1);
                        listeners = handler.slice();
                        len = listeners.length;
                        for (i = 0; i < len; i++)
                            listeners[i].apply(this, args);
                    }
                    return true;
                };
                EventEmitter.prototype.addListener = function (type, listener) {
                    var m;
                    if (!isFunction(listener))
                        throw TypeError('listener must be a function');
                    if (!this._events)
                        this._events = {};
                    // To avoid recursion in the case that type === "newListener"! Before
                    // adding it to the listeners, first emit "newListener".
                    if (this._events.newListener)
                        this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
                    if (!this._events[type])
                        // Optimize the case of one listener. Don't need the extra array object.
                        this._events[type] = listener;
                    else if (isObject(this._events[type]))
                        // If we've already got an array, just append.
                        this._events[type].push(listener);
                    else
                        // Adding the second element, need to change to array.
                        this._events[type] = [
                            this._events[type],
                            listener
                        ];
                    // Check for listener leak
                    if (isObject(this._events[type]) && !this._events[type].warned) {
                        if (!isUndefined(this._maxListeners)) {
                            m = this._maxListeners;
                        } else {
                            m = EventEmitter.defaultMaxListeners;
                        }
                        if (m && m > 0 && this._events[type].length > m) {
                            this._events[type].warned = true;
                            console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
                            if (typeof console.trace === 'function') {
                                // not supported in IE 10
                                console.trace();
                            }
                        }
                    }
                    return this;
                };
                EventEmitter.prototype.on = EventEmitter.prototype.addListener;
                EventEmitter.prototype.once = function (type, listener) {
                    if (!isFunction(listener))
                        throw TypeError('listener must be a function');
                    var fired = false;
                    function g() {
                        this.removeListener(type, g);
                        if (!fired) {
                            fired = true;
                            listener.apply(this, arguments);
                        }
                    }
                    g.listener = listener;
                    this.on(type, g);
                    return this;
                };
                // emits a 'removeListener' event iff the listener was removed
                EventEmitter.prototype.removeListener = function (type, listener) {
                    var list, position, length, i;
                    if (!isFunction(listener))
                        throw TypeError('listener must be a function');
                    if (!this._events || !this._events[type])
                        return this;
                    list = this._events[type];
                    length = list.length;
                    position = -1;
                    if (list === listener || isFunction(list.listener) && list.listener === listener) {
                        delete this._events[type];
                        if (this._events.removeListener)
                            this.emit('removeListener', type, listener);
                    } else if (isObject(list)) {
                        for (i = length; i-- > 0;) {
                            if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                                position = i;
                                break;
                            }
                        }
                        if (position < 0)
                            return this;
                        if (list.length === 1) {
                            list.length = 0;
                            delete this._events[type];
                        } else {
                            list.splice(position, 1);
                        }
                        if (this._events.removeListener)
                            this.emit('removeListener', type, listener);
                    }
                    return this;
                };
                EventEmitter.prototype.removeAllListeners = function (type) {
                    var key, listeners;
                    if (!this._events)
                        return this;
                    // not listening for removeListener, no need to emit
                    if (!this._events.removeListener) {
                        if (arguments.length === 0)
                            this._events = {};
                        else if (this._events[type])
                            delete this._events[type];
                        return this;
                    }
                    // emit removeListener for all listeners on all events
                    if (arguments.length === 0) {
                        for (key in this._events) {
                            if (key === 'removeListener')
                                continue;
                            this.removeAllListeners(key);
                        }
                        this.removeAllListeners('removeListener');
                        this._events = {};
                        return this;
                    }
                    listeners = this._events[type];
                    if (isFunction(listeners)) {
                        this.removeListener(type, listeners);
                    } else if (listeners) {
                        // LIFO order
                        while (listeners.length)
                            this.removeListener(type, listeners[listeners.length - 1]);
                    }
                    delete this._events[type];
                    return this;
                };
                EventEmitter.prototype.listeners = function (type) {
                    var ret;
                    if (!this._events || !this._events[type])
                        ret = [];
                    else if (isFunction(this._events[type]))
                        ret = [this._events[type]];
                    else
                        ret = this._events[type].slice();
                    return ret;
                };
                EventEmitter.prototype.listenerCount = function (type) {
                    if (this._events) {
                        var evlistener = this._events[type];
                        if (isFunction(evlistener))
                            return 1;
                        else if (evlistener)
                            return evlistener.length;
                    }
                    return 0;
                };
                EventEmitter.listenerCount = function (emitter, type) {
                    return emitter.listenerCount(type);
                };
                function isFunction(arg) {
                    return typeof arg === 'function';
                }
                function isNumber(arg) {
                    return typeof arg === 'number';
                }
                function isObject(arg) {
                    return typeof arg === 'object' && arg !== null;
                }
                function isUndefined(arg) {
                    return arg === void 0;
                }
            },
            {}
        ],
        15: [
            function (require, module, exports) {
                (function (Buffer) {
                    var CombinedStream = require('combined-stream');
                    var util = require('util');
                    var path = require('path');
                    var http = require('http');
                    var https = require('https');
                    var parseUrl = require('url').parse;
                    var fs = require('fs');
                    var mime = require('mime-types');
                    var async = require('async');
                    module.exports = FormData;
                    function FormData() {
                        this._overheadLength = 0;
                        this._valueLength = 0;
                        this._lengthRetrievers = [];
                        CombinedStream.call(this);
                    }
                    util.inherits(FormData, CombinedStream);
                    FormData.LINE_BREAK = '\r\n';
                    FormData.prototype.append = function (field, value, options) {
                        options = options || {};
                        var append = CombinedStream.prototype.append.bind(this);
                        // all that streamy business can't handle numbers
                        if (typeof value == 'number')
                            value = '' + value;
                        // https://github.com/felixge/node-form-data/issues/38
                        if (util.isArray(value)) {
                            // Please convert your array into string
                            // the way web server expects it
                            this._error(new Error('Arrays are not supported.'));
                            return;
                        }
                        var header = this._multiPartHeader(field, value, options);
                        var footer = this._multiPartFooter(field, value, options);
                        append(header);
                        append(value);
                        append(footer);
                        // pass along options.knownLength
                        this._trackLength(header, value, options);
                    };
                    FormData.prototype._trackLength = function (header, value, options) {
                        var valueLength = 0;
                        // used w/ getLengthSync(), when length is known.
                        // e.g. for streaming directly from a remote server,
                        // w/ a known file a size, and not wanting to wait for
                        // incoming file to finish to get its size.
                        if (options.knownLength != null) {
                            valueLength += +options.knownLength;
                        } else if (Buffer.isBuffer(value)) {
                            valueLength = value.length;
                        } else if (typeof value === 'string') {
                            valueLength = Buffer.byteLength(value);
                        }
                        this._valueLength += valueLength;
                        // @check why add CRLF? does this account for custom/multiple CRLFs?
                        this._overheadLength += Buffer.byteLength(header) + +FormData.LINE_BREAK.length;
                        // empty or either doesn't have path or not an http response
                        if (!value || !value.path && !(value.readable && value.hasOwnProperty('httpVersion'))) {
                            return;
                        }
                        // no need to bother with the length
                        if (!options.knownLength)
                            this._lengthRetrievers.push(function (next) {
                            });
                    };
                    FormData.prototype._multiPartHeader = function (field, value, options) {
                        var boundary = this.getBoundary();
                        var header = '';
                        // custom header specified (as string)?
                        // it becomes responsible for boundary
                        // (e.g. to handle extra CRLFs on .NET servers)
                        if (options.header != null) {
                            header = options.header;
                        } else {
                            header += '--' + boundary + FormData.LINE_BREAK + 'Content-Disposition: form-data; name="' + field + '"';
                            // fs- and request- streams have path property
                            // or use custom filename and/or contentType
                            // TODO: Use request's response mime-type
                            if (options.filename || value.path) {
                                header += '; filename="' + path.basename(options.filename || value.path) + '"' + FormData.LINE_BREAK + 'Content-Type: ' + (options.contentType || mime.lookup(options.filename || value.path));    // http response has not
                            } else if (value.readable && value.hasOwnProperty('httpVersion')) {
                                header += '; filename="' + path.basename(value.client._httpMessage.path) + '"' + FormData.LINE_BREAK + 'Content-Type: ' + value.headers['content-type'];
                            }
                            header += FormData.LINE_BREAK + FormData.LINE_BREAK;
                        }
                        return header;
                    };
                    FormData.prototype._multiPartFooter = function (field, value, options) {
                        return function (next) {
                            var footer = FormData.LINE_BREAK;
                            var lastPart = this._streams.length === 0;
                            if (lastPart) {
                                footer += this._lastBoundary();
                            }
                            next(footer);
                        }.bind(this);
                    };
                    FormData.prototype._lastBoundary = function () {
                        return '--' + this.getBoundary() + '--';
                    };
                    FormData.prototype.getHeaders = function (userHeaders) {
                        var formHeaders = { 'content-type': 'multipart/form-data; boundary=' + this.getBoundary() };
                        for (var header in userHeaders) {
                            formHeaders[header.toLowerCase()] = userHeaders[header];
                        }
                        return formHeaders;
                    };
                    FormData.prototype.getCustomHeaders = function (contentType) {
                    };
                    FormData.prototype.getBoundary = function () {
                        if (!this._boundary) {
                            this._generateBoundary();
                        }
                        return this._boundary;
                    };
                    FormData.prototype._generateBoundary = function () {
                        // This generates a 50 character boundary similar to those used by Firefox.
                        // They are optimized for boyer-moore parsing.
                        var boundary = '--------------------------';
                        for (var i = 0; i < 24; i++) {
                            boundary += Math.floor(Math.random() * 10).toString(16);
                        }
                        this._boundary = boundary;
                    };
                    // Note: getLengthSync DOESN'T calculate streams length
                    // As workaround one can calculate file size manually
                    // and add it as knownLength option
                    FormData.prototype.getLengthSync = function (debug) {
                    };
                    FormData.prototype.getLength = function (cb) {
                    };
                    FormData.prototype.submit = function (params, cb) {
                    };
                    FormData.prototype._error = function (err) {
                    };
                    /*
 * Santa's little helpers
 */
                    // populates missing values
                    function populate(dst, src) {
                    }
                }.call(this, require('buffer').Buffer));
            },
            {
                'async': 4,
                'buffer': 9,
                'combined-stream': 11,
                'fs': 7,
                'http': 47,
                'https': 16,
                'mime-types': 23,
                'path': 24,
                'url': 53,
                'util': 58
            }
        ],
        16: [
            function (require, module, exports) {
                var http = require('http');
                var https = module.exports;
                for (var key in http) {
                    if (http.hasOwnProperty(key))
                        https[key] = http[key];
                }
                ;
                https.request = function (params, cb) {
                    if (!params)
                        params = {};
                    params.scheme = 'https';
                    params.protocol = 'https:';
                    return http.request.call(this, params, cb);
                };
            },
            { 'http': 47 }
        ],
        17: [
            function (require, module, exports) {
                exports.read = function (buffer, offset, isLE, mLen, nBytes) {
                    var e, m;
                    var eLen = nBytes * 8 - mLen - 1;
                    var eMax = (1 << eLen) - 1;
                    var eBias = eMax >> 1;
                    var nBits = -7;
                    var i = isLE ? nBytes - 1 : 0;
                    var d = isLE ? -1 : 1;
                    var s = buffer[offset + i];
                    i += d;
                    e = s & (1 << -nBits) - 1;
                    s >>= -nBits;
                    nBits += eLen;
                    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
                    }
                    m = e & (1 << -nBits) - 1;
                    e >>= -nBits;
                    nBits += mLen;
                    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
                    }
                    if (e === 0) {
                        e = 1 - eBias;
                    } else if (e === eMax) {
                        return m ? NaN : (s ? -1 : 1) * Infinity;
                    } else {
                        m = m + Math.pow(2, mLen);
                        e = e - eBias;
                    }
                    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
                };
                exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
                    var e, m, c;
                    var eLen = nBytes * 8 - mLen - 1;
                    var eMax = (1 << eLen) - 1;
                    var eBias = eMax >> 1;
                    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                    var i = isLE ? 0 : nBytes - 1;
                    var d = isLE ? 1 : -1;
                    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
                    value = Math.abs(value);
                    if (isNaN(value) || value === Infinity) {
                        m = isNaN(value) ? 1 : 0;
                        e = eMax;
                    } else {
                        e = Math.floor(Math.log(value) / Math.LN2);
                        if (value * (c = Math.pow(2, -e)) < 1) {
                            e--;
                            c *= 2;
                        }
                        if (e + eBias >= 1) {
                            value += rt / c;
                        } else {
                            value += rt * Math.pow(2, 1 - eBias);
                        }
                        if (value * c >= 2) {
                            e++;
                            c /= 2;
                        }
                        if (e + eBias >= eMax) {
                            m = 0;
                            e = eMax;
                        } else if (e + eBias >= 1) {
                            m = (value * c - 1) * Math.pow(2, mLen);
                            e = e + eBias;
                        } else {
                            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                            e = 0;
                        }
                    }
                    for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
                    }
                    e = e << mLen | m;
                    eLen += mLen;
                    for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
                    }
                    buffer[offset + i - d] |= s * 128;
                };
            },
            {}
        ],
        18: [
            function (require, module, exports) {
                if (typeof Object.create === 'function') {
                    // implementation from standard node.js 'util' module
                    module.exports = function inherits(ctor, superCtor) {
                        ctor.super_ = superCtor;
                        ctor.prototype = Object.create(superCtor.prototype, {
                            constructor: {
                                value: ctor,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                    };
                } else {
                    // old school shim for old browsers
                    module.exports = function inherits(ctor, superCtor) {
                        ctor.super_ = superCtor;
                        var TempCtor = function () {
                        };
                        TempCtor.prototype = superCtor.prototype;
                        ctor.prototype = new TempCtor();
                        ctor.prototype.constructor = ctor;
                    };
                }
            },
            {}
        ],
        19: [
            function (require, module, exports) {
                /*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
                // The _isBuffer check is for Safari 5-7 support, because it's missing
                // Object.prototype.constructor. Remove this eventually
                module.exports = function (obj) {
                    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
                };
                function isBuffer(obj) {
                    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
                }
                // For Node v0.10 support. Remove this eventually.
                function isSlowBuffer(obj) {
                    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
                }
            },
            {}
        ],
        20: [
            function (require, module, exports) {
                var toString = {}.toString;
                module.exports = Array.isArray || function (arr) {
                    return toString.call(arr) == '[object Array]';
                };
            },
            {}
        ],
        21: [
            function (require, module, exports) {
                module.exports = {
                    'application/1d-interleaved-parityfec': { 'source': 'iana' },
                    'application/3gpdash-qoe-report+xml': { 'source': 'iana' },
                    'application/3gpp-ims+xml': { 'source': 'iana' },
                    'application/a2l': { 'source': 'iana' },
                    'application/activemessage': { 'source': 'iana' },
                    'application/alto-costmap+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-costmapfilter+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-directory+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-endpointcost+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-endpointcostparams+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-endpointprop+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-endpointpropparams+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-error+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-networkmap+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/alto-networkmapfilter+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/aml': { 'source': 'iana' },
                    'application/andrew-inset': {
                        'source': 'iana',
                        'extensions': ['ez']
                    },
                    'application/applefile': { 'source': 'iana' },
                    'application/applixware': {
                        'source': 'apache',
                        'extensions': ['aw']
                    },
                    'application/atf': { 'source': 'iana' },
                    'application/atfx': { 'source': 'iana' },
                    'application/atom+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['atom']
                    },
                    'application/atomcat+xml': {
                        'source': 'iana',
                        'extensions': ['atomcat']
                    },
                    'application/atomdeleted+xml': { 'source': 'iana' },
                    'application/atomicmail': { 'source': 'iana' },
                    'application/atomsvc+xml': {
                        'source': 'iana',
                        'extensions': ['atomsvc']
                    },
                    'application/atxml': { 'source': 'iana' },
                    'application/auth-policy+xml': { 'source': 'iana' },
                    'application/bacnet-xdd+zip': { 'source': 'iana' },
                    'application/batch-smtp': { 'source': 'iana' },
                    'application/bdoc': {
                        'compressible': false,
                        'extensions': ['bdoc']
                    },
                    'application/beep+xml': { 'source': 'iana' },
                    'application/calendar+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/calendar+xml': { 'source': 'iana' },
                    'application/call-completion': { 'source': 'iana' },
                    'application/cals-1840': { 'source': 'iana' },
                    'application/cbor': { 'source': 'iana' },
                    'application/ccmp+xml': { 'source': 'iana' },
                    'application/ccxml+xml': {
                        'source': 'iana',
                        'extensions': ['ccxml']
                    },
                    'application/cdfx+xml': { 'source': 'iana' },
                    'application/cdmi-capability': {
                        'source': 'iana',
                        'extensions': ['cdmia']
                    },
                    'application/cdmi-container': {
                        'source': 'iana',
                        'extensions': ['cdmic']
                    },
                    'application/cdmi-domain': {
                        'source': 'iana',
                        'extensions': ['cdmid']
                    },
                    'application/cdmi-object': {
                        'source': 'iana',
                        'extensions': ['cdmio']
                    },
                    'application/cdmi-queue': {
                        'source': 'iana',
                        'extensions': ['cdmiq']
                    },
                    'application/cea': { 'source': 'iana' },
                    'application/cea-2018+xml': { 'source': 'iana' },
                    'application/cellml+xml': { 'source': 'iana' },
                    'application/cfw': { 'source': 'iana' },
                    'application/cms': { 'source': 'iana' },
                    'application/cnrp+xml': { 'source': 'iana' },
                    'application/coap-group+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/commonground': { 'source': 'iana' },
                    'application/conference-info+xml': { 'source': 'iana' },
                    'application/cpl+xml': { 'source': 'iana' },
                    'application/csrattrs': { 'source': 'iana' },
                    'application/csta+xml': { 'source': 'iana' },
                    'application/cstadata+xml': { 'source': 'iana' },
                    'application/cu-seeme': {
                        'source': 'apache',
                        'extensions': ['cu']
                    },
                    'application/cybercash': { 'source': 'iana' },
                    'application/dart': { 'compressible': true },
                    'application/dash+xml': {
                        'source': 'iana',
                        'extensions': ['mdp']
                    },
                    'application/dashdelta': { 'source': 'iana' },
                    'application/davmount+xml': {
                        'source': 'iana',
                        'extensions': ['davmount']
                    },
                    'application/dca-rft': { 'source': 'iana' },
                    'application/dcd': { 'source': 'iana' },
                    'application/dec-dx': { 'source': 'iana' },
                    'application/dialog-info+xml': { 'source': 'iana' },
                    'application/dicom': { 'source': 'iana' },
                    'application/dii': { 'source': 'iana' },
                    'application/dit': { 'source': 'iana' },
                    'application/dns': { 'source': 'iana' },
                    'application/docbook+xml': {
                        'source': 'apache',
                        'extensions': ['dbk']
                    },
                    'application/dskpp+xml': { 'source': 'iana' },
                    'application/dssc+der': {
                        'source': 'iana',
                        'extensions': ['dssc']
                    },
                    'application/dssc+xml': {
                        'source': 'iana',
                        'extensions': ['xdssc']
                    },
                    'application/dvcs': { 'source': 'iana' },
                    'application/ecmascript': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['ecma']
                    },
                    'application/edi-consent': { 'source': 'iana' },
                    'application/edi-x12': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'application/edifact': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'application/emma+xml': {
                        'source': 'iana',
                        'extensions': ['emma']
                    },
                    'application/emotionml+xml': { 'source': 'iana' },
                    'application/encaprtp': { 'source': 'iana' },
                    'application/epp+xml': { 'source': 'iana' },
                    'application/epub+zip': {
                        'source': 'iana',
                        'extensions': ['epub']
                    },
                    'application/eshop': { 'source': 'iana' },
                    'application/exi': {
                        'source': 'iana',
                        'extensions': ['exi']
                    },
                    'application/fastinfoset': { 'source': 'iana' },
                    'application/fastsoap': { 'source': 'iana' },
                    'application/fdt+xml': { 'source': 'iana' },
                    'application/fits': { 'source': 'iana' },
                    'application/font-sfnt': { 'source': 'iana' },
                    'application/font-tdpfr': {
                        'source': 'iana',
                        'extensions': ['pfr']
                    },
                    'application/font-woff': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['woff']
                    },
                    'application/font-woff2': {
                        'compressible': false,
                        'extensions': ['woff2']
                    },
                    'application/framework-attributes+xml': { 'source': 'iana' },
                    'application/gml+xml': {
                        'source': 'apache',
                        'extensions': ['gml']
                    },
                    'application/gpx+xml': {
                        'source': 'apache',
                        'extensions': ['gpx']
                    },
                    'application/gxf': {
                        'source': 'apache',
                        'extensions': ['gxf']
                    },
                    'application/gzip': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'application/h224': { 'source': 'iana' },
                    'application/held+xml': { 'source': 'iana' },
                    'application/http': { 'source': 'iana' },
                    'application/hyperstudio': {
                        'source': 'iana',
                        'extensions': ['stk']
                    },
                    'application/ibe-key-request+xml': { 'source': 'iana' },
                    'application/ibe-pkg-reply+xml': { 'source': 'iana' },
                    'application/ibe-pp-data': { 'source': 'iana' },
                    'application/iges': { 'source': 'iana' },
                    'application/im-iscomposing+xml': { 'source': 'iana' },
                    'application/index': { 'source': 'iana' },
                    'application/index.cmd': { 'source': 'iana' },
                    'application/index.obj': { 'source': 'iana' },
                    'application/index.response': { 'source': 'iana' },
                    'application/index.vnd': { 'source': 'iana' },
                    'application/inkml+xml': {
                        'source': 'iana',
                        'extensions': [
                            'ink',
                            'inkml'
                        ]
                    },
                    'application/iotp': { 'source': 'iana' },
                    'application/ipfix': {
                        'source': 'iana',
                        'extensions': ['ipfix']
                    },
                    'application/ipp': { 'source': 'iana' },
                    'application/isup': { 'source': 'iana' },
                    'application/its+xml': { 'source': 'iana' },
                    'application/java-archive': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['jar']
                    },
                    'application/java-serialized-object': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['ser']
                    },
                    'application/java-vm': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['class']
                    },
                    'application/javascript': {
                        'source': 'iana',
                        'charset': 'UTF-8',
                        'compressible': true,
                        'extensions': ['js']
                    },
                    'application/jose': { 'source': 'iana' },
                    'application/jose+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/jrd+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/json': {
                        'source': 'iana',
                        'charset': 'UTF-8',
                        'compressible': true,
                        'extensions': [
                            'json',
                            'map'
                        ]
                    },
                    'application/json-patch+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/json-seq': { 'source': 'iana' },
                    'application/json5': { 'extensions': ['json5'] },
                    'application/jsonml+json': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': ['jsonml']
                    },
                    'application/jwk+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/jwk-set+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/jwt': { 'source': 'iana' },
                    'application/kpml-request+xml': { 'source': 'iana' },
                    'application/kpml-response+xml': { 'source': 'iana' },
                    'application/ld+json': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['jsonld']
                    },
                    'application/link-format': { 'source': 'iana' },
                    'application/load-control+xml': { 'source': 'iana' },
                    'application/lost+xml': {
                        'source': 'iana',
                        'extensions': ['lostxml']
                    },
                    'application/lostsync+xml': { 'source': 'iana' },
                    'application/lxf': { 'source': 'iana' },
                    'application/mac-binhex40': {
                        'source': 'iana',
                        'extensions': ['hqx']
                    },
                    'application/mac-compactpro': {
                        'source': 'apache',
                        'extensions': ['cpt']
                    },
                    'application/macwriteii': { 'source': 'iana' },
                    'application/mads+xml': {
                        'source': 'iana',
                        'extensions': ['mads']
                    },
                    'application/manifest+json': {
                        'charset': 'UTF-8',
                        'compressible': true,
                        'extensions': ['webmanifest']
                    },
                    'application/marc': {
                        'source': 'iana',
                        'extensions': ['mrc']
                    },
                    'application/marcxml+xml': {
                        'source': 'iana',
                        'extensions': ['mrcx']
                    },
                    'application/mathematica': {
                        'source': 'iana',
                        'extensions': [
                            'ma',
                            'nb',
                            'mb'
                        ]
                    },
                    'application/mathml+xml': {
                        'source': 'iana',
                        'extensions': ['mathml']
                    },
                    'application/mathml-content+xml': { 'source': 'iana' },
                    'application/mathml-presentation+xml': { 'source': 'iana' },
                    'application/mbms-associated-procedure-description+xml': { 'source': 'iana' },
                    'application/mbms-deregister+xml': { 'source': 'iana' },
                    'application/mbms-envelope+xml': { 'source': 'iana' },
                    'application/mbms-msk+xml': { 'source': 'iana' },
                    'application/mbms-msk-response+xml': { 'source': 'iana' },
                    'application/mbms-protection-description+xml': { 'source': 'iana' },
                    'application/mbms-reception-report+xml': { 'source': 'iana' },
                    'application/mbms-register+xml': { 'source': 'iana' },
                    'application/mbms-register-response+xml': { 'source': 'iana' },
                    'application/mbms-schedule+xml': { 'source': 'iana' },
                    'application/mbms-user-service-description+xml': { 'source': 'iana' },
                    'application/mbox': {
                        'source': 'iana',
                        'extensions': ['mbox']
                    },
                    'application/media-policy-dataset+xml': { 'source': 'iana' },
                    'application/media_control+xml': { 'source': 'iana' },
                    'application/mediaservercontrol+xml': {
                        'source': 'iana',
                        'extensions': ['mscml']
                    },
                    'application/merge-patch+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/metalink+xml': {
                        'source': 'apache',
                        'extensions': ['metalink']
                    },
                    'application/metalink4+xml': {
                        'source': 'iana',
                        'extensions': ['meta4']
                    },
                    'application/mets+xml': {
                        'source': 'iana',
                        'extensions': ['mets']
                    },
                    'application/mf4': { 'source': 'iana' },
                    'application/mikey': { 'source': 'iana' },
                    'application/mods+xml': {
                        'source': 'iana',
                        'extensions': ['mods']
                    },
                    'application/moss-keys': { 'source': 'iana' },
                    'application/moss-signature': { 'source': 'iana' },
                    'application/mosskey-data': { 'source': 'iana' },
                    'application/mosskey-request': { 'source': 'iana' },
                    'application/mp21': {
                        'source': 'iana',
                        'extensions': [
                            'm21',
                            'mp21'
                        ]
                    },
                    'application/mp4': {
                        'source': 'iana',
                        'extensions': [
                            'mp4s',
                            'm4p'
                        ]
                    },
                    'application/mpeg4-generic': { 'source': 'iana' },
                    'application/mpeg4-iod': { 'source': 'iana' },
                    'application/mpeg4-iod-xmt': { 'source': 'iana' },
                    'application/mrb-consumer+xml': { 'source': 'iana' },
                    'application/mrb-publish+xml': { 'source': 'iana' },
                    'application/msc-ivr+xml': { 'source': 'iana' },
                    'application/msc-mixer+xml': { 'source': 'iana' },
                    'application/msword': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'doc',
                            'dot'
                        ]
                    },
                    'application/mxf': {
                        'source': 'iana',
                        'extensions': ['mxf']
                    },
                    'application/nasdata': { 'source': 'iana' },
                    'application/news-checkgroups': { 'source': 'iana' },
                    'application/news-groupinfo': { 'source': 'iana' },
                    'application/news-transmission': { 'source': 'iana' },
                    'application/nlsml+xml': { 'source': 'iana' },
                    'application/nss': { 'source': 'iana' },
                    'application/ocsp-request': { 'source': 'iana' },
                    'application/ocsp-response': { 'source': 'iana' },
                    'application/octet-stream': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'bin',
                            'dms',
                            'lrf',
                            'mar',
                            'so',
                            'dist',
                            'distz',
                            'pkg',
                            'bpk',
                            'dump',
                            'elc',
                            'deploy',
                            'buffer'
                        ]
                    },
                    'application/oda': {
                        'source': 'iana',
                        'extensions': ['oda']
                    },
                    'application/odx': { 'source': 'iana' },
                    'application/oebps-package+xml': {
                        'source': 'iana',
                        'extensions': ['opf']
                    },
                    'application/ogg': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['ogx']
                    },
                    'application/omdoc+xml': {
                        'source': 'apache',
                        'extensions': ['omdoc']
                    },
                    'application/onenote': {
                        'source': 'apache',
                        'extensions': [
                            'onetoc',
                            'onetoc2',
                            'onetmp',
                            'onepkg'
                        ]
                    },
                    'application/oxps': {
                        'source': 'iana',
                        'extensions': ['oxps']
                    },
                    'application/p2p-overlay+xml': { 'source': 'iana' },
                    'application/parityfec': { 'source': 'iana' },
                    'application/patch-ops-error+xml': {
                        'source': 'iana',
                        'extensions': ['xer']
                    },
                    'application/pdf': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['pdf']
                    },
                    'application/pdx': { 'source': 'iana' },
                    'application/pgp-encrypted': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['pgp']
                    },
                    'application/pgp-keys': { 'source': 'iana' },
                    'application/pgp-signature': {
                        'source': 'iana',
                        'extensions': [
                            'asc',
                            'sig'
                        ]
                    },
                    'application/pics-rules': {
                        'source': 'apache',
                        'extensions': ['prf']
                    },
                    'application/pidf+xml': { 'source': 'iana' },
                    'application/pidf-diff+xml': { 'source': 'iana' },
                    'application/pkcs10': {
                        'source': 'iana',
                        'extensions': ['p10']
                    },
                    'application/pkcs7-mime': {
                        'source': 'iana',
                        'extensions': [
                            'p7m',
                            'p7c'
                        ]
                    },
                    'application/pkcs7-signature': {
                        'source': 'iana',
                        'extensions': ['p7s']
                    },
                    'application/pkcs8': {
                        'source': 'iana',
                        'extensions': ['p8']
                    },
                    'application/pkix-attr-cert': {
                        'source': 'iana',
                        'extensions': ['ac']
                    },
                    'application/pkix-cert': {
                        'source': 'iana',
                        'extensions': ['cer']
                    },
                    'application/pkix-crl': {
                        'source': 'iana',
                        'extensions': ['crl']
                    },
                    'application/pkix-pkipath': {
                        'source': 'iana',
                        'extensions': ['pkipath']
                    },
                    'application/pkixcmp': {
                        'source': 'iana',
                        'extensions': ['pki']
                    },
                    'application/pls+xml': {
                        'source': 'iana',
                        'extensions': ['pls']
                    },
                    'application/poc-settings+xml': { 'source': 'iana' },
                    'application/postscript': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'ai',
                            'eps',
                            'ps'
                        ]
                    },
                    'application/provenance+xml': { 'source': 'iana' },
                    'application/prs.alvestrand.titrax-sheet': { 'source': 'iana' },
                    'application/prs.cww': {
                        'source': 'iana',
                        'extensions': ['cww']
                    },
                    'application/prs.hpub+zip': { 'source': 'iana' },
                    'application/prs.nprend': { 'source': 'iana' },
                    'application/prs.plucker': { 'source': 'iana' },
                    'application/prs.rdf-xml-crypt': { 'source': 'iana' },
                    'application/prs.xsf+xml': { 'source': 'iana' },
                    'application/pskc+xml': {
                        'source': 'iana',
                        'extensions': ['pskcxml']
                    },
                    'application/qsig': { 'source': 'iana' },
                    'application/raptorfec': { 'source': 'iana' },
                    'application/rdap+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/rdf+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['rdf']
                    },
                    'application/reginfo+xml': {
                        'source': 'iana',
                        'extensions': ['rif']
                    },
                    'application/relax-ng-compact-syntax': {
                        'source': 'iana',
                        'extensions': ['rnc']
                    },
                    'application/remote-printing': { 'source': 'iana' },
                    'application/reputon+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/resource-lists+xml': {
                        'source': 'iana',
                        'extensions': ['rl']
                    },
                    'application/resource-lists-diff+xml': {
                        'source': 'iana',
                        'extensions': ['rld']
                    },
                    'application/riscos': { 'source': 'iana' },
                    'application/rlmi+xml': { 'source': 'iana' },
                    'application/rls-services+xml': {
                        'source': 'iana',
                        'extensions': ['rs']
                    },
                    'application/rpki-ghostbusters': {
                        'source': 'iana',
                        'extensions': ['gbr']
                    },
                    'application/rpki-manifest': {
                        'source': 'iana',
                        'extensions': ['mft']
                    },
                    'application/rpki-roa': {
                        'source': 'iana',
                        'extensions': ['roa']
                    },
                    'application/rpki-updown': { 'source': 'iana' },
                    'application/rsd+xml': {
                        'source': 'apache',
                        'extensions': ['rsd']
                    },
                    'application/rss+xml': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': ['rss']
                    },
                    'application/rtf': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['rtf']
                    },
                    'application/rtploopback': { 'source': 'iana' },
                    'application/rtx': { 'source': 'iana' },
                    'application/samlassertion+xml': { 'source': 'iana' },
                    'application/samlmetadata+xml': { 'source': 'iana' },
                    'application/sbml+xml': {
                        'source': 'iana',
                        'extensions': ['sbml']
                    },
                    'application/scaip+xml': { 'source': 'iana' },
                    'application/scvp-cv-request': {
                        'source': 'iana',
                        'extensions': ['scq']
                    },
                    'application/scvp-cv-response': {
                        'source': 'iana',
                        'extensions': ['scs']
                    },
                    'application/scvp-vp-request': {
                        'source': 'iana',
                        'extensions': ['spq']
                    },
                    'application/scvp-vp-response': {
                        'source': 'iana',
                        'extensions': ['spp']
                    },
                    'application/sdp': {
                        'source': 'iana',
                        'extensions': ['sdp']
                    },
                    'application/sep+xml': { 'source': 'iana' },
                    'application/sep-exi': { 'source': 'iana' },
                    'application/session-info': { 'source': 'iana' },
                    'application/set-payment': { 'source': 'iana' },
                    'application/set-payment-initiation': {
                        'source': 'iana',
                        'extensions': ['setpay']
                    },
                    'application/set-registration': { 'source': 'iana' },
                    'application/set-registration-initiation': {
                        'source': 'iana',
                        'extensions': ['setreg']
                    },
                    'application/sgml': { 'source': 'iana' },
                    'application/sgml-open-catalog': { 'source': 'iana' },
                    'application/shf+xml': {
                        'source': 'iana',
                        'extensions': ['shf']
                    },
                    'application/sieve': { 'source': 'iana' },
                    'application/simple-filter+xml': { 'source': 'iana' },
                    'application/simple-message-summary': { 'source': 'iana' },
                    'application/simplesymbolcontainer': { 'source': 'iana' },
                    'application/slate': { 'source': 'iana' },
                    'application/smil': { 'source': 'iana' },
                    'application/smil+xml': {
                        'source': 'iana',
                        'extensions': [
                            'smi',
                            'smil'
                        ]
                    },
                    'application/smpte336m': { 'source': 'iana' },
                    'application/soap+fastinfoset': { 'source': 'iana' },
                    'application/soap+xml': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/sparql-query': {
                        'source': 'iana',
                        'extensions': ['rq']
                    },
                    'application/sparql-results+xml': {
                        'source': 'iana',
                        'extensions': ['srx']
                    },
                    'application/spirits-event+xml': { 'source': 'iana' },
                    'application/sql': { 'source': 'iana' },
                    'application/srgs': {
                        'source': 'iana',
                        'extensions': ['gram']
                    },
                    'application/srgs+xml': {
                        'source': 'iana',
                        'extensions': ['grxml']
                    },
                    'application/sru+xml': {
                        'source': 'iana',
                        'extensions': ['sru']
                    },
                    'application/ssdl+xml': {
                        'source': 'apache',
                        'extensions': ['ssdl']
                    },
                    'application/ssml+xml': {
                        'source': 'iana',
                        'extensions': ['ssml']
                    },
                    'application/tamp-apex-update': { 'source': 'iana' },
                    'application/tamp-apex-update-confirm': { 'source': 'iana' },
                    'application/tamp-community-update': { 'source': 'iana' },
                    'application/tamp-community-update-confirm': { 'source': 'iana' },
                    'application/tamp-error': { 'source': 'iana' },
                    'application/tamp-sequence-adjust': { 'source': 'iana' },
                    'application/tamp-sequence-adjust-confirm': { 'source': 'iana' },
                    'application/tamp-status-query': { 'source': 'iana' },
                    'application/tamp-status-response': { 'source': 'iana' },
                    'application/tamp-update': { 'source': 'iana' },
                    'application/tamp-update-confirm': { 'source': 'iana' },
                    'application/tar': { 'compressible': true },
                    'application/tei+xml': {
                        'source': 'iana',
                        'extensions': [
                            'tei',
                            'teicorpus'
                        ]
                    },
                    'application/thraud+xml': {
                        'source': 'iana',
                        'extensions': ['tfi']
                    },
                    'application/timestamp-query': { 'source': 'iana' },
                    'application/timestamp-reply': { 'source': 'iana' },
                    'application/timestamped-data': {
                        'source': 'iana',
                        'extensions': ['tsd']
                    },
                    'application/ttml+xml': { 'source': 'iana' },
                    'application/tve-trigger': { 'source': 'iana' },
                    'application/ulpfec': { 'source': 'iana' },
                    'application/urc-grpsheet+xml': { 'source': 'iana' },
                    'application/urc-ressheet+xml': { 'source': 'iana' },
                    'application/urc-targetdesc+xml': { 'source': 'iana' },
                    'application/urc-uisocketdesc+xml': { 'source': 'iana' },
                    'application/vcard+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vcard+xml': { 'source': 'iana' },
                    'application/vemmi': { 'source': 'iana' },
                    'application/vividence.scriptfile': { 'source': 'apache' },
                    'application/vnd.3gpp.bsf+xml': { 'source': 'iana' },
                    'application/vnd.3gpp.pic-bw-large': {
                        'source': 'iana',
                        'extensions': ['plb']
                    },
                    'application/vnd.3gpp.pic-bw-small': {
                        'source': 'iana',
                        'extensions': ['psb']
                    },
                    'application/vnd.3gpp.pic-bw-var': {
                        'source': 'iana',
                        'extensions': ['pvb']
                    },
                    'application/vnd.3gpp.sms': { 'source': 'iana' },
                    'application/vnd.3gpp2.bcmcsinfo+xml': { 'source': 'iana' },
                    'application/vnd.3gpp2.sms': { 'source': 'iana' },
                    'application/vnd.3gpp2.tcap': {
                        'source': 'iana',
                        'extensions': ['tcap']
                    },
                    'application/vnd.3m.post-it-notes': {
                        'source': 'iana',
                        'extensions': ['pwn']
                    },
                    'application/vnd.accpac.simply.aso': {
                        'source': 'iana',
                        'extensions': ['aso']
                    },
                    'application/vnd.accpac.simply.imp': {
                        'source': 'iana',
                        'extensions': ['imp']
                    },
                    'application/vnd.acucobol': {
                        'source': 'iana',
                        'extensions': ['acu']
                    },
                    'application/vnd.acucorp': {
                        'source': 'iana',
                        'extensions': [
                            'atc',
                            'acutc'
                        ]
                    },
                    'application/vnd.adobe.air-application-installer-package+zip': {
                        'source': 'apache',
                        'extensions': ['air']
                    },
                    'application/vnd.adobe.flash.movie': { 'source': 'iana' },
                    'application/vnd.adobe.formscentral.fcdt': {
                        'source': 'iana',
                        'extensions': ['fcdt']
                    },
                    'application/vnd.adobe.fxp': {
                        'source': 'iana',
                        'extensions': [
                            'fxp',
                            'fxpl'
                        ]
                    },
                    'application/vnd.adobe.partial-upload': { 'source': 'iana' },
                    'application/vnd.adobe.xdp+xml': {
                        'source': 'iana',
                        'extensions': ['xdp']
                    },
                    'application/vnd.adobe.xfdf': {
                        'source': 'iana',
                        'extensions': ['xfdf']
                    },
                    'application/vnd.aether.imp': { 'source': 'iana' },
                    'application/vnd.ah-barcode': { 'source': 'iana' },
                    'application/vnd.ahead.space': {
                        'source': 'iana',
                        'extensions': ['ahead']
                    },
                    'application/vnd.airzip.filesecure.azf': {
                        'source': 'iana',
                        'extensions': ['azf']
                    },
                    'application/vnd.airzip.filesecure.azs': {
                        'source': 'iana',
                        'extensions': ['azs']
                    },
                    'application/vnd.amazon.ebook': {
                        'source': 'apache',
                        'extensions': ['azw']
                    },
                    'application/vnd.americandynamics.acc': {
                        'source': 'iana',
                        'extensions': ['acc']
                    },
                    'application/vnd.amiga.ami': {
                        'source': 'iana',
                        'extensions': ['ami']
                    },
                    'application/vnd.amundsen.maze+xml': { 'source': 'iana' },
                    'application/vnd.android.package-archive': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['apk']
                    },
                    'application/vnd.anser-web-certificate-issue-initiation': {
                        'source': 'iana',
                        'extensions': ['cii']
                    },
                    'application/vnd.anser-web-funds-transfer-initiation': {
                        'source': 'apache',
                        'extensions': ['fti']
                    },
                    'application/vnd.antix.game-component': {
                        'source': 'iana',
                        'extensions': ['atx']
                    },
                    'application/vnd.apache.thrift.binary': { 'source': 'iana' },
                    'application/vnd.apache.thrift.compact': { 'source': 'iana' },
                    'application/vnd.apache.thrift.json': { 'source': 'iana' },
                    'application/vnd.api+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.apple.installer+xml': {
                        'source': 'iana',
                        'extensions': ['mpkg']
                    },
                    'application/vnd.apple.mpegurl': {
                        'source': 'iana',
                        'extensions': ['m3u8']
                    },
                    'application/vnd.arastra.swi': { 'source': 'iana' },
                    'application/vnd.aristanetworks.swi': {
                        'source': 'iana',
                        'extensions': ['swi']
                    },
                    'application/vnd.artsquare': { 'source': 'iana' },
                    'application/vnd.astraea-software.iota': {
                        'source': 'iana',
                        'extensions': ['iota']
                    },
                    'application/vnd.audiograph': {
                        'source': 'iana',
                        'extensions': ['aep']
                    },
                    'application/vnd.autopackage': { 'source': 'iana' },
                    'application/vnd.avistar+xml': { 'source': 'iana' },
                    'application/vnd.balsamiq.bmml+xml': { 'source': 'iana' },
                    'application/vnd.balsamiq.bmpr': { 'source': 'iana' },
                    'application/vnd.bekitzur-stech+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.blueice.multipass': {
                        'source': 'iana',
                        'extensions': ['mpm']
                    },
                    'application/vnd.bluetooth.ep.oob': { 'source': 'iana' },
                    'application/vnd.bluetooth.le.oob': { 'source': 'iana' },
                    'application/vnd.bmi': {
                        'source': 'iana',
                        'extensions': ['bmi']
                    },
                    'application/vnd.businessobjects': {
                        'source': 'iana',
                        'extensions': ['rep']
                    },
                    'application/vnd.cab-jscript': { 'source': 'iana' },
                    'application/vnd.canon-cpdl': { 'source': 'iana' },
                    'application/vnd.canon-lips': { 'source': 'iana' },
                    'application/vnd.cendio.thinlinc.clientconf': { 'source': 'iana' },
                    'application/vnd.century-systems.tcp_stream': { 'source': 'iana' },
                    'application/vnd.chemdraw+xml': {
                        'source': 'iana',
                        'extensions': ['cdxml']
                    },
                    'application/vnd.chipnuts.karaoke-mmd': {
                        'source': 'iana',
                        'extensions': ['mmd']
                    },
                    'application/vnd.cinderella': {
                        'source': 'iana',
                        'extensions': ['cdy']
                    },
                    'application/vnd.cirpack.isdn-ext': { 'source': 'iana' },
                    'application/vnd.citationstyles.style+xml': { 'source': 'iana' },
                    'application/vnd.claymore': {
                        'source': 'iana',
                        'extensions': ['cla']
                    },
                    'application/vnd.cloanto.rp9': {
                        'source': 'iana',
                        'extensions': ['rp9']
                    },
                    'application/vnd.clonk.c4group': {
                        'source': 'iana',
                        'extensions': [
                            'c4g',
                            'c4d',
                            'c4f',
                            'c4p',
                            'c4u'
                        ]
                    },
                    'application/vnd.cluetrust.cartomobile-config': {
                        'source': 'iana',
                        'extensions': ['c11amc']
                    },
                    'application/vnd.cluetrust.cartomobile-config-pkg': {
                        'source': 'iana',
                        'extensions': ['c11amz']
                    },
                    'application/vnd.coffeescript': { 'source': 'iana' },
                    'application/vnd.collection+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.collection.doc+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.collection.next+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.commerce-battelle': { 'source': 'iana' },
                    'application/vnd.commonspace': {
                        'source': 'iana',
                        'extensions': ['csp']
                    },
                    'application/vnd.contact.cmsg': {
                        'source': 'iana',
                        'extensions': ['cdbcmsg']
                    },
                    'application/vnd.cosmocaller': {
                        'source': 'iana',
                        'extensions': ['cmc']
                    },
                    'application/vnd.crick.clicker': {
                        'source': 'iana',
                        'extensions': ['clkx']
                    },
                    'application/vnd.crick.clicker.keyboard': {
                        'source': 'iana',
                        'extensions': ['clkk']
                    },
                    'application/vnd.crick.clicker.palette': {
                        'source': 'iana',
                        'extensions': ['clkp']
                    },
                    'application/vnd.crick.clicker.template': {
                        'source': 'iana',
                        'extensions': ['clkt']
                    },
                    'application/vnd.crick.clicker.wordbank': {
                        'source': 'iana',
                        'extensions': ['clkw']
                    },
                    'application/vnd.criticaltools.wbs+xml': {
                        'source': 'iana',
                        'extensions': ['wbs']
                    },
                    'application/vnd.ctc-posml': {
                        'source': 'iana',
                        'extensions': ['pml']
                    },
                    'application/vnd.ctct.ws+xml': { 'source': 'iana' },
                    'application/vnd.cups-pdf': { 'source': 'iana' },
                    'application/vnd.cups-postscript': { 'source': 'iana' },
                    'application/vnd.cups-ppd': {
                        'source': 'iana',
                        'extensions': ['ppd']
                    },
                    'application/vnd.cups-raster': { 'source': 'iana' },
                    'application/vnd.cups-raw': { 'source': 'iana' },
                    'application/vnd.curl': { 'source': 'iana' },
                    'application/vnd.curl.car': {
                        'source': 'apache',
                        'extensions': ['car']
                    },
                    'application/vnd.curl.pcurl': {
                        'source': 'apache',
                        'extensions': ['pcurl']
                    },
                    'application/vnd.cyan.dean.root+xml': { 'source': 'iana' },
                    'application/vnd.cybank': { 'source': 'iana' },
                    'application/vnd.dart': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['dart']
                    },
                    'application/vnd.data-vision.rdz': {
                        'source': 'iana',
                        'extensions': ['rdz']
                    },
                    'application/vnd.debian.binary-package': { 'source': 'iana' },
                    'application/vnd.dece.data': {
                        'source': 'iana',
                        'extensions': [
                            'uvf',
                            'uvvf',
                            'uvd',
                            'uvvd'
                        ]
                    },
                    'application/vnd.dece.ttml+xml': {
                        'source': 'iana',
                        'extensions': [
                            'uvt',
                            'uvvt'
                        ]
                    },
                    'application/vnd.dece.unspecified': {
                        'source': 'iana',
                        'extensions': [
                            'uvx',
                            'uvvx'
                        ]
                    },
                    'application/vnd.dece.zip': {
                        'source': 'iana',
                        'extensions': [
                            'uvz',
                            'uvvz'
                        ]
                    },
                    'application/vnd.denovo.fcselayout-link': {
                        'source': 'iana',
                        'extensions': ['fe_launch']
                    },
                    'application/vnd.desmume-movie': { 'source': 'iana' },
                    'application/vnd.dir-bi.plate-dl-nosuffix': { 'source': 'iana' },
                    'application/vnd.dm.delegation+xml': { 'source': 'iana' },
                    'application/vnd.dna': {
                        'source': 'iana',
                        'extensions': ['dna']
                    },
                    'application/vnd.document+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.dolby.mlp': {
                        'source': 'apache',
                        'extensions': ['mlp']
                    },
                    'application/vnd.dolby.mobile.1': { 'source': 'iana' },
                    'application/vnd.dolby.mobile.2': { 'source': 'iana' },
                    'application/vnd.doremir.scorecloud-binary-document': { 'source': 'iana' },
                    'application/vnd.dpgraph': {
                        'source': 'iana',
                        'extensions': ['dpg']
                    },
                    'application/vnd.dreamfactory': {
                        'source': 'iana',
                        'extensions': ['dfac']
                    },
                    'application/vnd.ds-keypoint': {
                        'source': 'apache',
                        'extensions': ['kpxx']
                    },
                    'application/vnd.dtg.local': { 'source': 'iana' },
                    'application/vnd.dtg.local.flash': { 'source': 'iana' },
                    'application/vnd.dtg.local.html': { 'source': 'iana' },
                    'application/vnd.dvb.ait': {
                        'source': 'iana',
                        'extensions': ['ait']
                    },
                    'application/vnd.dvb.dvbj': { 'source': 'iana' },
                    'application/vnd.dvb.esgcontainer': { 'source': 'iana' },
                    'application/vnd.dvb.ipdcdftnotifaccess': { 'source': 'iana' },
                    'application/vnd.dvb.ipdcesgaccess': { 'source': 'iana' },
                    'application/vnd.dvb.ipdcesgaccess2': { 'source': 'iana' },
                    'application/vnd.dvb.ipdcesgpdd': { 'source': 'iana' },
                    'application/vnd.dvb.ipdcroaming': { 'source': 'iana' },
                    'application/vnd.dvb.iptv.alfec-base': { 'source': 'iana' },
                    'application/vnd.dvb.iptv.alfec-enhancement': { 'source': 'iana' },
                    'application/vnd.dvb.notif-aggregate-root+xml': { 'source': 'iana' },
                    'application/vnd.dvb.notif-container+xml': { 'source': 'iana' },
                    'application/vnd.dvb.notif-generic+xml': { 'source': 'iana' },
                    'application/vnd.dvb.notif-ia-msglist+xml': { 'source': 'iana' },
                    'application/vnd.dvb.notif-ia-registration-request+xml': { 'source': 'iana' },
                    'application/vnd.dvb.notif-ia-registration-response+xml': { 'source': 'iana' },
                    'application/vnd.dvb.notif-init+xml': { 'source': 'iana' },
                    'application/vnd.dvb.pfr': { 'source': 'iana' },
                    'application/vnd.dvb.service': {
                        'source': 'iana',
                        'extensions': ['svc']
                    },
                    'application/vnd.dxr': { 'source': 'iana' },
                    'application/vnd.dynageo': {
                        'source': 'iana',
                        'extensions': ['geo']
                    },
                    'application/vnd.dzr': { 'source': 'iana' },
                    'application/vnd.easykaraoke.cdgdownload': { 'source': 'iana' },
                    'application/vnd.ecdis-update': { 'source': 'iana' },
                    'application/vnd.ecowin.chart': {
                        'source': 'iana',
                        'extensions': ['mag']
                    },
                    'application/vnd.ecowin.filerequest': { 'source': 'iana' },
                    'application/vnd.ecowin.fileupdate': { 'source': 'iana' },
                    'application/vnd.ecowin.series': { 'source': 'iana' },
                    'application/vnd.ecowin.seriesrequest': { 'source': 'iana' },
                    'application/vnd.ecowin.seriesupdate': { 'source': 'iana' },
                    'application/vnd.emclient.accessrequest+xml': { 'source': 'iana' },
                    'application/vnd.enliven': {
                        'source': 'iana',
                        'extensions': ['nml']
                    },
                    'application/vnd.enphase.envoy': { 'source': 'iana' },
                    'application/vnd.eprints.data+xml': { 'source': 'iana' },
                    'application/vnd.epson.esf': {
                        'source': 'iana',
                        'extensions': ['esf']
                    },
                    'application/vnd.epson.msf': {
                        'source': 'iana',
                        'extensions': ['msf']
                    },
                    'application/vnd.epson.quickanime': {
                        'source': 'iana',
                        'extensions': ['qam']
                    },
                    'application/vnd.epson.salt': {
                        'source': 'iana',
                        'extensions': ['slt']
                    },
                    'application/vnd.epson.ssf': {
                        'source': 'iana',
                        'extensions': ['ssf']
                    },
                    'application/vnd.ericsson.quickcall': { 'source': 'iana' },
                    'application/vnd.eszigno3+xml': {
                        'source': 'iana',
                        'extensions': [
                            'es3',
                            'et3'
                        ]
                    },
                    'application/vnd.etsi.aoc+xml': { 'source': 'iana' },
                    'application/vnd.etsi.asic-e+zip': { 'source': 'iana' },
                    'application/vnd.etsi.asic-s+zip': { 'source': 'iana' },
                    'application/vnd.etsi.cug+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvcommand+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvdiscovery+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvprofile+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvsad-bc+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvsad-cod+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvsad-npvr+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvservice+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvsync+xml': { 'source': 'iana' },
                    'application/vnd.etsi.iptvueprofile+xml': { 'source': 'iana' },
                    'application/vnd.etsi.mcid+xml': { 'source': 'iana' },
                    'application/vnd.etsi.mheg5': { 'source': 'iana' },
                    'application/vnd.etsi.overload-control-policy-dataset+xml': { 'source': 'iana' },
                    'application/vnd.etsi.pstn+xml': { 'source': 'iana' },
                    'application/vnd.etsi.sci+xml': { 'source': 'iana' },
                    'application/vnd.etsi.simservs+xml': { 'source': 'iana' },
                    'application/vnd.etsi.timestamp-token': { 'source': 'iana' },
                    'application/vnd.etsi.tsl+xml': { 'source': 'iana' },
                    'application/vnd.etsi.tsl.der': { 'source': 'iana' },
                    'application/vnd.eudora.data': { 'source': 'iana' },
                    'application/vnd.ezpix-album': {
                        'source': 'iana',
                        'extensions': ['ez2']
                    },
                    'application/vnd.ezpix-package': {
                        'source': 'iana',
                        'extensions': ['ez3']
                    },
                    'application/vnd.f-secure.mobile': { 'source': 'iana' },
                    'application/vnd.fastcopy-disk-image': { 'source': 'iana' },
                    'application/vnd.fdf': {
                        'source': 'iana',
                        'extensions': ['fdf']
                    },
                    'application/vnd.fdsn.mseed': {
                        'source': 'iana',
                        'extensions': ['mseed']
                    },
                    'application/vnd.fdsn.seed': {
                        'source': 'iana',
                        'extensions': [
                            'seed',
                            'dataless'
                        ]
                    },
                    'application/vnd.ffsns': { 'source': 'iana' },
                    'application/vnd.fints': { 'source': 'iana' },
                    'application/vnd.flographit': {
                        'source': 'iana',
                        'extensions': ['gph']
                    },
                    'application/vnd.fluxtime.clip': {
                        'source': 'iana',
                        'extensions': ['ftc']
                    },
                    'application/vnd.font-fontforge-sfd': { 'source': 'iana' },
                    'application/vnd.framemaker': {
                        'source': 'iana',
                        'extensions': [
                            'fm',
                            'frame',
                            'maker',
                            'book'
                        ]
                    },
                    'application/vnd.frogans.fnc': {
                        'source': 'iana',
                        'extensions': ['fnc']
                    },
                    'application/vnd.frogans.ltf': {
                        'source': 'iana',
                        'extensions': ['ltf']
                    },
                    'application/vnd.fsc.weblaunch': {
                        'source': 'iana',
                        'extensions': ['fsc']
                    },
                    'application/vnd.fujitsu.oasys': {
                        'source': 'iana',
                        'extensions': ['oas']
                    },
                    'application/vnd.fujitsu.oasys2': {
                        'source': 'iana',
                        'extensions': ['oa2']
                    },
                    'application/vnd.fujitsu.oasys3': {
                        'source': 'iana',
                        'extensions': ['oa3']
                    },
                    'application/vnd.fujitsu.oasysgp': {
                        'source': 'iana',
                        'extensions': ['fg5']
                    },
                    'application/vnd.fujitsu.oasysprs': {
                        'source': 'iana',
                        'extensions': ['bh2']
                    },
                    'application/vnd.fujixerox.art-ex': { 'source': 'iana' },
                    'application/vnd.fujixerox.art4': { 'source': 'iana' },
                    'application/vnd.fujixerox.ddd': {
                        'source': 'iana',
                        'extensions': ['ddd']
                    },
                    'application/vnd.fujixerox.docuworks': {
                        'source': 'iana',
                        'extensions': ['xdw']
                    },
                    'application/vnd.fujixerox.docuworks.binder': {
                        'source': 'iana',
                        'extensions': ['xbd']
                    },
                    'application/vnd.fujixerox.docuworks.container': { 'source': 'iana' },
                    'application/vnd.fujixerox.hbpl': { 'source': 'iana' },
                    'application/vnd.fut-misnet': { 'source': 'iana' },
                    'application/vnd.fuzzysheet': {
                        'source': 'iana',
                        'extensions': ['fzs']
                    },
                    'application/vnd.genomatix.tuxedo': {
                        'source': 'iana',
                        'extensions': ['txd']
                    },
                    'application/vnd.geo+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.geocube+xml': { 'source': 'iana' },
                    'application/vnd.geogebra.file': {
                        'source': 'iana',
                        'extensions': ['ggb']
                    },
                    'application/vnd.geogebra.tool': {
                        'source': 'iana',
                        'extensions': ['ggt']
                    },
                    'application/vnd.geometry-explorer': {
                        'source': 'iana',
                        'extensions': [
                            'gex',
                            'gre'
                        ]
                    },
                    'application/vnd.geonext': {
                        'source': 'iana',
                        'extensions': ['gxt']
                    },
                    'application/vnd.geoplan': {
                        'source': 'iana',
                        'extensions': ['g2w']
                    },
                    'application/vnd.geospace': {
                        'source': 'iana',
                        'extensions': ['g3w']
                    },
                    'application/vnd.gerber': { 'source': 'iana' },
                    'application/vnd.globalplatform.card-content-mgt': { 'source': 'iana' },
                    'application/vnd.globalplatform.card-content-mgt-response': { 'source': 'iana' },
                    'application/vnd.gmx': {
                        'source': 'iana',
                        'extensions': ['gmx']
                    },
                    'application/vnd.google-earth.kml+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['kml']
                    },
                    'application/vnd.google-earth.kmz': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['kmz']
                    },
                    'application/vnd.gov.sk.e-form+xml': { 'source': 'iana' },
                    'application/vnd.gov.sk.e-form+zip': { 'source': 'iana' },
                    'application/vnd.gov.sk.xmldatacontainer+xml': { 'source': 'iana' },
                    'application/vnd.grafeq': {
                        'source': 'iana',
                        'extensions': [
                            'gqf',
                            'gqs'
                        ]
                    },
                    'application/vnd.gridmp': { 'source': 'iana' },
                    'application/vnd.groove-account': {
                        'source': 'iana',
                        'extensions': ['gac']
                    },
                    'application/vnd.groove-help': {
                        'source': 'iana',
                        'extensions': ['ghf']
                    },
                    'application/vnd.groove-identity-message': {
                        'source': 'iana',
                        'extensions': ['gim']
                    },
                    'application/vnd.groove-injector': {
                        'source': 'iana',
                        'extensions': ['grv']
                    },
                    'application/vnd.groove-tool-message': {
                        'source': 'iana',
                        'extensions': ['gtm']
                    },
                    'application/vnd.groove-tool-template': {
                        'source': 'iana',
                        'extensions': ['tpl']
                    },
                    'application/vnd.groove-vcard': {
                        'source': 'iana',
                        'extensions': ['vcg']
                    },
                    'application/vnd.hal+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.hal+xml': {
                        'source': 'iana',
                        'extensions': ['hal']
                    },
                    'application/vnd.handheld-entertainment+xml': {
                        'source': 'iana',
                        'extensions': ['zmm']
                    },
                    'application/vnd.hbci': {
                        'source': 'iana',
                        'extensions': ['hbci']
                    },
                    'application/vnd.hcl-bireports': { 'source': 'iana' },
                    'application/vnd.heroku+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.hhe.lesson-player': {
                        'source': 'iana',
                        'extensions': ['les']
                    },
                    'application/vnd.hp-hpgl': {
                        'source': 'iana',
                        'extensions': ['hpgl']
                    },
                    'application/vnd.hp-hpid': {
                        'source': 'iana',
                        'extensions': ['hpid']
                    },
                    'application/vnd.hp-hps': {
                        'source': 'iana',
                        'extensions': ['hps']
                    },
                    'application/vnd.hp-jlyt': {
                        'source': 'iana',
                        'extensions': ['jlt']
                    },
                    'application/vnd.hp-pcl': {
                        'source': 'iana',
                        'extensions': ['pcl']
                    },
                    'application/vnd.hp-pclxl': {
                        'source': 'iana',
                        'extensions': ['pclxl']
                    },
                    'application/vnd.httphone': { 'source': 'iana' },
                    'application/vnd.hydrostatix.sof-data': {
                        'source': 'iana',
                        'extensions': ['sfd-hdstx']
                    },
                    'application/vnd.hyperdrive+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.hzn-3d-crossword': { 'source': 'iana' },
                    'application/vnd.ibm.afplinedata': { 'source': 'iana' },
                    'application/vnd.ibm.electronic-media': { 'source': 'iana' },
                    'application/vnd.ibm.minipay': {
                        'source': 'iana',
                        'extensions': ['mpy']
                    },
                    'application/vnd.ibm.modcap': {
                        'source': 'iana',
                        'extensions': [
                            'afp',
                            'listafp',
                            'list3820'
                        ]
                    },
                    'application/vnd.ibm.rights-management': {
                        'source': 'iana',
                        'extensions': ['irm']
                    },
                    'application/vnd.ibm.secure-container': {
                        'source': 'iana',
                        'extensions': ['sc']
                    },
                    'application/vnd.iccprofile': {
                        'source': 'iana',
                        'extensions': [
                            'icc',
                            'icm'
                        ]
                    },
                    'application/vnd.ieee.1905': { 'source': 'iana' },
                    'application/vnd.igloader': {
                        'source': 'iana',
                        'extensions': ['igl']
                    },
                    'application/vnd.immervision-ivp': {
                        'source': 'iana',
                        'extensions': ['ivp']
                    },
                    'application/vnd.immervision-ivu': {
                        'source': 'iana',
                        'extensions': ['ivu']
                    },
                    'application/vnd.ims.imsccv1p1': { 'source': 'iana' },
                    'application/vnd.ims.imsccv1p2': { 'source': 'iana' },
                    'application/vnd.ims.imsccv1p3': { 'source': 'iana' },
                    'application/vnd.ims.lis.v2.result+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.ims.lti.v2.toolconsumerprofile+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.ims.lti.v2.toolproxy+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.ims.lti.v2.toolproxy.id+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.ims.lti.v2.toolsettings+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.ims.lti.v2.toolsettings.simple+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.informedcontrol.rms+xml': { 'source': 'iana' },
                    'application/vnd.informix-visionary': { 'source': 'iana' },
                    'application/vnd.infotech.project': { 'source': 'iana' },
                    'application/vnd.infotech.project+xml': { 'source': 'iana' },
                    'application/vnd.innopath.wamp.notification': { 'source': 'iana' },
                    'application/vnd.insors.igm': {
                        'source': 'iana',
                        'extensions': ['igm']
                    },
                    'application/vnd.intercon.formnet': {
                        'source': 'iana',
                        'extensions': [
                            'xpw',
                            'xpx'
                        ]
                    },
                    'application/vnd.intergeo': {
                        'source': 'iana',
                        'extensions': ['i2g']
                    },
                    'application/vnd.intertrust.digibox': { 'source': 'iana' },
                    'application/vnd.intertrust.nncp': { 'source': 'iana' },
                    'application/vnd.intu.qbo': {
                        'source': 'iana',
                        'extensions': ['qbo']
                    },
                    'application/vnd.intu.qfx': {
                        'source': 'iana',
                        'extensions': ['qfx']
                    },
                    'application/vnd.iptc.g2.catalogitem+xml': { 'source': 'iana' },
                    'application/vnd.iptc.g2.conceptitem+xml': { 'source': 'iana' },
                    'application/vnd.iptc.g2.knowledgeitem+xml': { 'source': 'iana' },
                    'application/vnd.iptc.g2.newsitem+xml': { 'source': 'iana' },
                    'application/vnd.iptc.g2.newsmessage+xml': { 'source': 'iana' },
                    'application/vnd.iptc.g2.packageitem+xml': { 'source': 'iana' },
                    'application/vnd.iptc.g2.planningitem+xml': { 'source': 'iana' },
                    'application/vnd.ipunplugged.rcprofile': {
                        'source': 'iana',
                        'extensions': ['rcprofile']
                    },
                    'application/vnd.irepository.package+xml': {
                        'source': 'iana',
                        'extensions': ['irp']
                    },
                    'application/vnd.is-xpr': {
                        'source': 'iana',
                        'extensions': ['xpr']
                    },
                    'application/vnd.isac.fcs': {
                        'source': 'iana',
                        'extensions': ['fcs']
                    },
                    'application/vnd.jam': {
                        'source': 'iana',
                        'extensions': ['jam']
                    },
                    'application/vnd.japannet-directory-service': { 'source': 'iana' },
                    'application/vnd.japannet-jpnstore-wakeup': { 'source': 'iana' },
                    'application/vnd.japannet-payment-wakeup': { 'source': 'iana' },
                    'application/vnd.japannet-registration': { 'source': 'iana' },
                    'application/vnd.japannet-registration-wakeup': { 'source': 'iana' },
                    'application/vnd.japannet-setstore-wakeup': { 'source': 'iana' },
                    'application/vnd.japannet-verification': { 'source': 'iana' },
                    'application/vnd.japannet-verification-wakeup': { 'source': 'iana' },
                    'application/vnd.jcp.javame.midlet-rms': {
                        'source': 'iana',
                        'extensions': ['rms']
                    },
                    'application/vnd.jisp': {
                        'source': 'iana',
                        'extensions': ['jisp']
                    },
                    'application/vnd.joost.joda-archive': {
                        'source': 'iana',
                        'extensions': ['joda']
                    },
                    'application/vnd.jsk.isdn-ngn': { 'source': 'iana' },
                    'application/vnd.kahootz': {
                        'source': 'iana',
                        'extensions': [
                            'ktz',
                            'ktr'
                        ]
                    },
                    'application/vnd.kde.karbon': {
                        'source': 'iana',
                        'extensions': ['karbon']
                    },
                    'application/vnd.kde.kchart': {
                        'source': 'iana',
                        'extensions': ['chrt']
                    },
                    'application/vnd.kde.kformula': {
                        'source': 'iana',
                        'extensions': ['kfo']
                    },
                    'application/vnd.kde.kivio': {
                        'source': 'iana',
                        'extensions': ['flw']
                    },
                    'application/vnd.kde.kontour': {
                        'source': 'iana',
                        'extensions': ['kon']
                    },
                    'application/vnd.kde.kpresenter': {
                        'source': 'iana',
                        'extensions': [
                            'kpr',
                            'kpt'
                        ]
                    },
                    'application/vnd.kde.kspread': {
                        'source': 'iana',
                        'extensions': ['ksp']
                    },
                    'application/vnd.kde.kword': {
                        'source': 'iana',
                        'extensions': [
                            'kwd',
                            'kwt'
                        ]
                    },
                    'application/vnd.kenameaapp': {
                        'source': 'iana',
                        'extensions': ['htke']
                    },
                    'application/vnd.kidspiration': {
                        'source': 'iana',
                        'extensions': ['kia']
                    },
                    'application/vnd.kinar': {
                        'source': 'iana',
                        'extensions': [
                            'kne',
                            'knp'
                        ]
                    },
                    'application/vnd.koan': {
                        'source': 'iana',
                        'extensions': [
                            'skp',
                            'skd',
                            'skt',
                            'skm'
                        ]
                    },
                    'application/vnd.kodak-descriptor': {
                        'source': 'iana',
                        'extensions': ['sse']
                    },
                    'application/vnd.las.las+xml': {
                        'source': 'iana',
                        'extensions': ['lasxml']
                    },
                    'application/vnd.liberty-request+xml': { 'source': 'iana' },
                    'application/vnd.llamagraphics.life-balance.desktop': {
                        'source': 'iana',
                        'extensions': ['lbd']
                    },
                    'application/vnd.llamagraphics.life-balance.exchange+xml': {
                        'source': 'iana',
                        'extensions': ['lbe']
                    },
                    'application/vnd.lotus-1-2-3': {
                        'source': 'iana',
                        'extensions': ['123']
                    },
                    'application/vnd.lotus-approach': {
                        'source': 'iana',
                        'extensions': ['apr']
                    },
                    'application/vnd.lotus-freelance': {
                        'source': 'iana',
                        'extensions': ['pre']
                    },
                    'application/vnd.lotus-notes': {
                        'source': 'iana',
                        'extensions': ['nsf']
                    },
                    'application/vnd.lotus-organizer': {
                        'source': 'iana',
                        'extensions': ['org']
                    },
                    'application/vnd.lotus-screencam': {
                        'source': 'iana',
                        'extensions': ['scm']
                    },
                    'application/vnd.lotus-wordpro': {
                        'source': 'iana',
                        'extensions': ['lwp']
                    },
                    'application/vnd.macports.portpkg': {
                        'source': 'iana',
                        'extensions': ['portpkg']
                    },
                    'application/vnd.marlin.drm.actiontoken+xml': { 'source': 'iana' },
                    'application/vnd.marlin.drm.conftoken+xml': { 'source': 'iana' },
                    'application/vnd.marlin.drm.license+xml': { 'source': 'iana' },
                    'application/vnd.marlin.drm.mdcf': { 'source': 'iana' },
                    'application/vnd.mason+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.maxmind.maxmind-db': { 'source': 'iana' },
                    'application/vnd.mcd': {
                        'source': 'iana',
                        'extensions': ['mcd']
                    },
                    'application/vnd.medcalcdata': {
                        'source': 'iana',
                        'extensions': ['mc1']
                    },
                    'application/vnd.mediastation.cdkey': {
                        'source': 'iana',
                        'extensions': ['cdkey']
                    },
                    'application/vnd.meridian-slingshot': { 'source': 'iana' },
                    'application/vnd.mfer': {
                        'source': 'iana',
                        'extensions': ['mwf']
                    },
                    'application/vnd.mfmp': {
                        'source': 'iana',
                        'extensions': ['mfm']
                    },
                    'application/vnd.micro+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.micrografx.flo': {
                        'source': 'iana',
                        'extensions': ['flo']
                    },
                    'application/vnd.micrografx.igx': {
                        'source': 'iana',
                        'extensions': ['igx']
                    },
                    'application/vnd.microsoft.portable-executable': { 'source': 'iana' },
                    'application/vnd.miele+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.mif': {
                        'source': 'iana',
                        'extensions': ['mif']
                    },
                    'application/vnd.minisoft-hp3000-save': { 'source': 'iana' },
                    'application/vnd.mitsubishi.misty-guard.trustweb': { 'source': 'iana' },
                    'application/vnd.mobius.daf': {
                        'source': 'iana',
                        'extensions': ['daf']
                    },
                    'application/vnd.mobius.dis': {
                        'source': 'iana',
                        'extensions': ['dis']
                    },
                    'application/vnd.mobius.mbk': {
                        'source': 'iana',
                        'extensions': ['mbk']
                    },
                    'application/vnd.mobius.mqy': {
                        'source': 'iana',
                        'extensions': ['mqy']
                    },
                    'application/vnd.mobius.msl': {
                        'source': 'iana',
                        'extensions': ['msl']
                    },
                    'application/vnd.mobius.plc': {
                        'source': 'iana',
                        'extensions': ['plc']
                    },
                    'application/vnd.mobius.txf': {
                        'source': 'iana',
                        'extensions': ['txf']
                    },
                    'application/vnd.mophun.application': {
                        'source': 'iana',
                        'extensions': ['mpn']
                    },
                    'application/vnd.mophun.certificate': {
                        'source': 'iana',
                        'extensions': ['mpc']
                    },
                    'application/vnd.motorola.flexsuite': { 'source': 'iana' },
                    'application/vnd.motorola.flexsuite.adsi': { 'source': 'iana' },
                    'application/vnd.motorola.flexsuite.fis': { 'source': 'iana' },
                    'application/vnd.motorola.flexsuite.gotap': { 'source': 'iana' },
                    'application/vnd.motorola.flexsuite.kmr': { 'source': 'iana' },
                    'application/vnd.motorola.flexsuite.ttc': { 'source': 'iana' },
                    'application/vnd.motorola.flexsuite.wem': { 'source': 'iana' },
                    'application/vnd.motorola.iprm': { 'source': 'iana' },
                    'application/vnd.mozilla.xul+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['xul']
                    },
                    'application/vnd.ms-3mfdocument': { 'source': 'iana' },
                    'application/vnd.ms-artgalry': {
                        'source': 'iana',
                        'extensions': ['cil']
                    },
                    'application/vnd.ms-asf': { 'source': 'iana' },
                    'application/vnd.ms-cab-compressed': {
                        'source': 'iana',
                        'extensions': ['cab']
                    },
                    'application/vnd.ms-color.iccprofile': { 'source': 'apache' },
                    'application/vnd.ms-excel': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'xls',
                            'xlm',
                            'xla',
                            'xlc',
                            'xlt',
                            'xlw'
                        ]
                    },
                    'application/vnd.ms-excel.addin.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['xlam']
                    },
                    'application/vnd.ms-excel.sheet.binary.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['xlsb']
                    },
                    'application/vnd.ms-excel.sheet.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['xlsm']
                    },
                    'application/vnd.ms-excel.template.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['xltm']
                    },
                    'application/vnd.ms-fontobject': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['eot']
                    },
                    'application/vnd.ms-htmlhelp': {
                        'source': 'iana',
                        'extensions': ['chm']
                    },
                    'application/vnd.ms-ims': {
                        'source': 'iana',
                        'extensions': ['ims']
                    },
                    'application/vnd.ms-lrm': {
                        'source': 'iana',
                        'extensions': ['lrm']
                    },
                    'application/vnd.ms-office.activex+xml': { 'source': 'iana' },
                    'application/vnd.ms-officetheme': {
                        'source': 'iana',
                        'extensions': ['thmx']
                    },
                    'application/vnd.ms-opentype': {
                        'source': 'apache',
                        'compressible': true
                    },
                    'application/vnd.ms-package.obfuscated-opentype': { 'source': 'apache' },
                    'application/vnd.ms-pki.seccat': {
                        'source': 'apache',
                        'extensions': ['cat']
                    },
                    'application/vnd.ms-pki.stl': {
                        'source': 'apache',
                        'extensions': ['stl']
                    },
                    'application/vnd.ms-playready.initiator+xml': { 'source': 'iana' },
                    'application/vnd.ms-powerpoint': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'ppt',
                            'pps',
                            'pot'
                        ]
                    },
                    'application/vnd.ms-powerpoint.addin.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['ppam']
                    },
                    'application/vnd.ms-powerpoint.presentation.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['pptm']
                    },
                    'application/vnd.ms-powerpoint.slide.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['sldm']
                    },
                    'application/vnd.ms-powerpoint.slideshow.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['ppsm']
                    },
                    'application/vnd.ms-powerpoint.template.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['potm']
                    },
                    'application/vnd.ms-printing.printticket+xml': { 'source': 'apache' },
                    'application/vnd.ms-project': {
                        'source': 'iana',
                        'extensions': [
                            'mpp',
                            'mpt'
                        ]
                    },
                    'application/vnd.ms-tnef': { 'source': 'iana' },
                    'application/vnd.ms-windows.printerpairing': { 'source': 'iana' },
                    'application/vnd.ms-wmdrm.lic-chlg-req': { 'source': 'iana' },
                    'application/vnd.ms-wmdrm.lic-resp': { 'source': 'iana' },
                    'application/vnd.ms-wmdrm.meter-chlg-req': { 'source': 'iana' },
                    'application/vnd.ms-wmdrm.meter-resp': { 'source': 'iana' },
                    'application/vnd.ms-word.document.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['docm']
                    },
                    'application/vnd.ms-word.template.macroenabled.12': {
                        'source': 'iana',
                        'extensions': ['dotm']
                    },
                    'application/vnd.ms-works': {
                        'source': 'iana',
                        'extensions': [
                            'wps',
                            'wks',
                            'wcm',
                            'wdb'
                        ]
                    },
                    'application/vnd.ms-wpl': {
                        'source': 'iana',
                        'extensions': ['wpl']
                    },
                    'application/vnd.ms-xpsdocument': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['xps']
                    },
                    'application/vnd.msa-disk-image': { 'source': 'iana' },
                    'application/vnd.mseq': {
                        'source': 'iana',
                        'extensions': ['mseq']
                    },
                    'application/vnd.msign': { 'source': 'iana' },
                    'application/vnd.multiad.creator': { 'source': 'iana' },
                    'application/vnd.multiad.creator.cif': { 'source': 'iana' },
                    'application/vnd.music-niff': { 'source': 'iana' },
                    'application/vnd.musician': {
                        'source': 'iana',
                        'extensions': ['mus']
                    },
                    'application/vnd.muvee.style': {
                        'source': 'iana',
                        'extensions': ['msty']
                    },
                    'application/vnd.mynfc': {
                        'source': 'iana',
                        'extensions': ['taglet']
                    },
                    'application/vnd.ncd.control': { 'source': 'iana' },
                    'application/vnd.ncd.reference': { 'source': 'iana' },
                    'application/vnd.nervana': { 'source': 'iana' },
                    'application/vnd.netfpx': { 'source': 'iana' },
                    'application/vnd.neurolanguage.nlu': {
                        'source': 'iana',
                        'extensions': ['nlu']
                    },
                    'application/vnd.nintendo.nitro.rom': { 'source': 'iana' },
                    'application/vnd.nintendo.snes.rom': { 'source': 'iana' },
                    'application/vnd.nitf': {
                        'source': 'iana',
                        'extensions': [
                            'ntf',
                            'nitf'
                        ]
                    },
                    'application/vnd.noblenet-directory': {
                        'source': 'iana',
                        'extensions': ['nnd']
                    },
                    'application/vnd.noblenet-sealer': {
                        'source': 'iana',
                        'extensions': ['nns']
                    },
                    'application/vnd.noblenet-web': {
                        'source': 'iana',
                        'extensions': ['nnw']
                    },
                    'application/vnd.nokia.catalogs': { 'source': 'iana' },
                    'application/vnd.nokia.conml+wbxml': { 'source': 'iana' },
                    'application/vnd.nokia.conml+xml': { 'source': 'iana' },
                    'application/vnd.nokia.iptv.config+xml': { 'source': 'iana' },
                    'application/vnd.nokia.isds-radio-presets': { 'source': 'iana' },
                    'application/vnd.nokia.landmark+wbxml': { 'source': 'iana' },
                    'application/vnd.nokia.landmark+xml': { 'source': 'iana' },
                    'application/vnd.nokia.landmarkcollection+xml': { 'source': 'iana' },
                    'application/vnd.nokia.n-gage.ac+xml': { 'source': 'iana' },
                    'application/vnd.nokia.n-gage.data': {
                        'source': 'iana',
                        'extensions': ['ngdat']
                    },
                    'application/vnd.nokia.n-gage.symbian.install': {
                        'source': 'iana',
                        'extensions': ['n-gage']
                    },
                    'application/vnd.nokia.ncd': { 'source': 'iana' },
                    'application/vnd.nokia.pcd+wbxml': { 'source': 'iana' },
                    'application/vnd.nokia.pcd+xml': { 'source': 'iana' },
                    'application/vnd.nokia.radio-preset': {
                        'source': 'iana',
                        'extensions': ['rpst']
                    },
                    'application/vnd.nokia.radio-presets': {
                        'source': 'iana',
                        'extensions': ['rpss']
                    },
                    'application/vnd.novadigm.edm': {
                        'source': 'iana',
                        'extensions': ['edm']
                    },
                    'application/vnd.novadigm.edx': {
                        'source': 'iana',
                        'extensions': ['edx']
                    },
                    'application/vnd.novadigm.ext': {
                        'source': 'iana',
                        'extensions': ['ext']
                    },
                    'application/vnd.ntt-local.content-share': { 'source': 'iana' },
                    'application/vnd.ntt-local.file-transfer': { 'source': 'iana' },
                    'application/vnd.ntt-local.ogw_remote-access': { 'source': 'iana' },
                    'application/vnd.ntt-local.sip-ta_remote': { 'source': 'iana' },
                    'application/vnd.ntt-local.sip-ta_tcp_stream': { 'source': 'iana' },
                    'application/vnd.oasis.opendocument.chart': {
                        'source': 'iana',
                        'extensions': ['odc']
                    },
                    'application/vnd.oasis.opendocument.chart-template': {
                        'source': 'iana',
                        'extensions': ['otc']
                    },
                    'application/vnd.oasis.opendocument.database': {
                        'source': 'iana',
                        'extensions': ['odb']
                    },
                    'application/vnd.oasis.opendocument.formula': {
                        'source': 'iana',
                        'extensions': ['odf']
                    },
                    'application/vnd.oasis.opendocument.formula-template': {
                        'source': 'iana',
                        'extensions': ['odft']
                    },
                    'application/vnd.oasis.opendocument.graphics': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['odg']
                    },
                    'application/vnd.oasis.opendocument.graphics-template': {
                        'source': 'iana',
                        'extensions': ['otg']
                    },
                    'application/vnd.oasis.opendocument.image': {
                        'source': 'iana',
                        'extensions': ['odi']
                    },
                    'application/vnd.oasis.opendocument.image-template': {
                        'source': 'iana',
                        'extensions': ['oti']
                    },
                    'application/vnd.oasis.opendocument.presentation': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['odp']
                    },
                    'application/vnd.oasis.opendocument.presentation-template': {
                        'source': 'iana',
                        'extensions': ['otp']
                    },
                    'application/vnd.oasis.opendocument.spreadsheet': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['ods']
                    },
                    'application/vnd.oasis.opendocument.spreadsheet-template': {
                        'source': 'iana',
                        'extensions': ['ots']
                    },
                    'application/vnd.oasis.opendocument.text': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['odt']
                    },
                    'application/vnd.oasis.opendocument.text-master': {
                        'source': 'iana',
                        'extensions': ['odm']
                    },
                    'application/vnd.oasis.opendocument.text-template': {
                        'source': 'iana',
                        'extensions': ['ott']
                    },
                    'application/vnd.oasis.opendocument.text-web': {
                        'source': 'iana',
                        'extensions': ['oth']
                    },
                    'application/vnd.obn': { 'source': 'iana' },
                    'application/vnd.oftn.l10n+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.oipf.contentaccessdownload+xml': { 'source': 'iana' },
                    'application/vnd.oipf.contentaccessstreaming+xml': { 'source': 'iana' },
                    'application/vnd.oipf.cspg-hexbinary': { 'source': 'iana' },
                    'application/vnd.oipf.dae.svg+xml': { 'source': 'iana' },
                    'application/vnd.oipf.dae.xhtml+xml': { 'source': 'iana' },
                    'application/vnd.oipf.mippvcontrolmessage+xml': { 'source': 'iana' },
                    'application/vnd.oipf.pae.gem': { 'source': 'iana' },
                    'application/vnd.oipf.spdiscovery+xml': { 'source': 'iana' },
                    'application/vnd.oipf.spdlist+xml': { 'source': 'iana' },
                    'application/vnd.oipf.ueprofile+xml': { 'source': 'iana' },
                    'application/vnd.oipf.userprofile+xml': { 'source': 'iana' },
                    'application/vnd.olpc-sugar': {
                        'source': 'iana',
                        'extensions': ['xo']
                    },
                    'application/vnd.oma-scws-config': { 'source': 'iana' },
                    'application/vnd.oma-scws-http-request': { 'source': 'iana' },
                    'application/vnd.oma-scws-http-response': { 'source': 'iana' },
                    'application/vnd.oma.bcast.associated-procedure-parameter+xml': { 'source': 'iana' },
                    'application/vnd.oma.bcast.drm-trigger+xml': { 'source': 'iana' },
                    'application/vnd.oma.bcast.imd+xml': { 'source': 'iana' },
                    'application/vnd.oma.bcast.ltkm': { 'source': 'iana' },
                    'application/vnd.oma.bcast.notification+xml': { 'source': 'iana' },
                    'application/vnd.oma.bcast.provisioningtrigger': { 'source': 'iana' },
                    'application/vnd.oma.bcast.sgboot': { 'source': 'iana' },
                    'application/vnd.oma.bcast.sgdd+xml': { 'source': 'iana' },
                    'application/vnd.oma.bcast.sgdu': { 'source': 'iana' },
                    'application/vnd.oma.bcast.simple-symbol-container': { 'source': 'iana' },
                    'application/vnd.oma.bcast.smartcard-trigger+xml': { 'source': 'iana' },
                    'application/vnd.oma.bcast.sprov+xml': { 'source': 'iana' },
                    'application/vnd.oma.bcast.stkm': { 'source': 'iana' },
                    'application/vnd.oma.cab-address-book+xml': { 'source': 'iana' },
                    'application/vnd.oma.cab-feature-handler+xml': { 'source': 'iana' },
                    'application/vnd.oma.cab-pcc+xml': { 'source': 'iana' },
                    'application/vnd.oma.cab-subs-invite+xml': { 'source': 'iana' },
                    'application/vnd.oma.cab-user-prefs+xml': { 'source': 'iana' },
                    'application/vnd.oma.dcd': { 'source': 'iana' },
                    'application/vnd.oma.dcdc': { 'source': 'iana' },
                    'application/vnd.oma.dd2+xml': {
                        'source': 'iana',
                        'extensions': ['dd2']
                    },
                    'application/vnd.oma.drm.risd+xml': { 'source': 'iana' },
                    'application/vnd.oma.group-usage-list+xml': { 'source': 'iana' },
                    'application/vnd.oma.pal+xml': { 'source': 'iana' },
                    'application/vnd.oma.poc.detailed-progress-report+xml': { 'source': 'iana' },
                    'application/vnd.oma.poc.final-report+xml': { 'source': 'iana' },
                    'application/vnd.oma.poc.groups+xml': { 'source': 'iana' },
                    'application/vnd.oma.poc.invocation-descriptor+xml': { 'source': 'iana' },
                    'application/vnd.oma.poc.optimized-progress-report+xml': { 'source': 'iana' },
                    'application/vnd.oma.push': { 'source': 'iana' },
                    'application/vnd.oma.scidm.messages+xml': { 'source': 'iana' },
                    'application/vnd.oma.xcap-directory+xml': { 'source': 'iana' },
                    'application/vnd.omads-email+xml': { 'source': 'iana' },
                    'application/vnd.omads-file+xml': { 'source': 'iana' },
                    'application/vnd.omads-folder+xml': { 'source': 'iana' },
                    'application/vnd.omaloc-supl-init': { 'source': 'iana' },
                    'application/vnd.openeye.oeb': { 'source': 'iana' },
                    'application/vnd.openofficeorg.extension': {
                        'source': 'apache',
                        'extensions': ['oxt']
                    },
                    'application/vnd.openxmlformats-officedocument.custom-properties+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.customxmlproperties+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.drawing+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.drawingml.chart+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.extended-properties+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml-template': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.comments+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['pptx']
                    },
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.presprops+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.slide': {
                        'source': 'iana',
                        'extensions': ['sldx']
                    },
                    'application/vnd.openxmlformats-officedocument.presentationml.slide+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.slideshow': {
                        'source': 'iana',
                        'extensions': ['ppsx']
                    },
                    'application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.tags+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.template': {
                        'source': 'apache',
                        'extensions': ['potx']
                    },
                    'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml-template': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['xlsx']
                    },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.template': {
                        'source': 'apache',
                        'extensions': ['xltx']
                    },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.theme+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.themeoverride+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.vmldrawing': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml-template': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['docx']
                    },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.template': {
                        'source': 'apache',
                        'extensions': ['dotx']
                    },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-package.core-properties+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml': { 'source': 'iana' },
                    'application/vnd.openxmlformats-package.relationships+xml': { 'source': 'iana' },
                    'application/vnd.oracle.resource+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.orange.indata': { 'source': 'iana' },
                    'application/vnd.osa.netdeploy': { 'source': 'iana' },
                    'application/vnd.osgeo.mapguide.package': {
                        'source': 'iana',
                        'extensions': ['mgp']
                    },
                    'application/vnd.osgi.bundle': { 'source': 'iana' },
                    'application/vnd.osgi.dp': {
                        'source': 'iana',
                        'extensions': ['dp']
                    },
                    'application/vnd.osgi.subsystem': {
                        'source': 'iana',
                        'extensions': ['esa']
                    },
                    'application/vnd.otps.ct-kip+xml': { 'source': 'iana' },
                    'application/vnd.palm': {
                        'source': 'iana',
                        'extensions': [
                            'pdb',
                            'pqa',
                            'oprc'
                        ]
                    },
                    'application/vnd.panoply': { 'source': 'iana' },
                    'application/vnd.paos+xml': { 'source': 'iana' },
                    'application/vnd.paos.xml': { 'source': 'apache' },
                    'application/vnd.pawaafile': {
                        'source': 'iana',
                        'extensions': ['paw']
                    },
                    'application/vnd.pcos': { 'source': 'iana' },
                    'application/vnd.pg.format': {
                        'source': 'iana',
                        'extensions': ['str']
                    },
                    'application/vnd.pg.osasli': {
                        'source': 'iana',
                        'extensions': ['ei6']
                    },
                    'application/vnd.piaccess.application-licence': { 'source': 'iana' },
                    'application/vnd.picsel': {
                        'source': 'iana',
                        'extensions': ['efif']
                    },
                    'application/vnd.pmi.widget': {
                        'source': 'iana',
                        'extensions': ['wg']
                    },
                    'application/vnd.poc.group-advertisement+xml': { 'source': 'iana' },
                    'application/vnd.pocketlearn': {
                        'source': 'iana',
                        'extensions': ['plf']
                    },
                    'application/vnd.powerbuilder6': {
                        'source': 'iana',
                        'extensions': ['pbd']
                    },
                    'application/vnd.powerbuilder6-s': { 'source': 'iana' },
                    'application/vnd.powerbuilder7': { 'source': 'iana' },
                    'application/vnd.powerbuilder7-s': { 'source': 'iana' },
                    'application/vnd.powerbuilder75': { 'source': 'iana' },
                    'application/vnd.powerbuilder75-s': { 'source': 'iana' },
                    'application/vnd.preminet': { 'source': 'iana' },
                    'application/vnd.previewsystems.box': {
                        'source': 'iana',
                        'extensions': ['box']
                    },
                    'application/vnd.proteus.magazine': {
                        'source': 'iana',
                        'extensions': ['mgz']
                    },
                    'application/vnd.publishare-delta-tree': {
                        'source': 'iana',
                        'extensions': ['qps']
                    },
                    'application/vnd.pvi.ptid1': {
                        'source': 'iana',
                        'extensions': ['ptid']
                    },
                    'application/vnd.pwg-multiplexed': { 'source': 'iana' },
                    'application/vnd.pwg-xhtml-print+xml': { 'source': 'iana' },
                    'application/vnd.qualcomm.brew-app-res': { 'source': 'iana' },
                    'application/vnd.quark.quarkxpress': {
                        'source': 'iana',
                        'extensions': [
                            'qxd',
                            'qxt',
                            'qwd',
                            'qwt',
                            'qxl',
                            'qxb'
                        ]
                    },
                    'application/vnd.quobject-quoxdocument': { 'source': 'iana' },
                    'application/vnd.radisys.moml+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-audit+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-audit-conf+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-audit-conn+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-audit-dialog+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-audit-stream+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-conf+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-dialog+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-dialog-base+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-dialog-fax-detect+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-dialog-fax-sendrecv+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-dialog-group+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-dialog-speech+xml': { 'source': 'iana' },
                    'application/vnd.radisys.msml-dialog-transform+xml': { 'source': 'iana' },
                    'application/vnd.rainstor.data': { 'source': 'iana' },
                    'application/vnd.rapid': { 'source': 'iana' },
                    'application/vnd.realvnc.bed': {
                        'source': 'iana',
                        'extensions': ['bed']
                    },
                    'application/vnd.recordare.musicxml': {
                        'source': 'iana',
                        'extensions': ['mxl']
                    },
                    'application/vnd.recordare.musicxml+xml': {
                        'source': 'iana',
                        'extensions': ['musicxml']
                    },
                    'application/vnd.renlearn.rlprint': { 'source': 'iana' },
                    'application/vnd.rig.cryptonote': {
                        'source': 'iana',
                        'extensions': ['cryptonote']
                    },
                    'application/vnd.rim.cod': {
                        'source': 'apache',
                        'extensions': ['cod']
                    },
                    'application/vnd.rn-realmedia': {
                        'source': 'apache',
                        'extensions': ['rm']
                    },
                    'application/vnd.rn-realmedia-vbr': {
                        'source': 'apache',
                        'extensions': ['rmvb']
                    },
                    'application/vnd.route66.link66+xml': {
                        'source': 'iana',
                        'extensions': ['link66']
                    },
                    'application/vnd.rs-274x': { 'source': 'iana' },
                    'application/vnd.ruckus.download': { 'source': 'iana' },
                    'application/vnd.s3sms': { 'source': 'iana' },
                    'application/vnd.sailingtracker.track': {
                        'source': 'iana',
                        'extensions': ['st']
                    },
                    'application/vnd.sbm.cid': { 'source': 'iana' },
                    'application/vnd.sbm.mid2': { 'source': 'iana' },
                    'application/vnd.scribus': { 'source': 'iana' },
                    'application/vnd.sealed.3df': { 'source': 'iana' },
                    'application/vnd.sealed.csf': { 'source': 'iana' },
                    'application/vnd.sealed.doc': { 'source': 'iana' },
                    'application/vnd.sealed.eml': { 'source': 'iana' },
                    'application/vnd.sealed.mht': { 'source': 'iana' },
                    'application/vnd.sealed.net': { 'source': 'iana' },
                    'application/vnd.sealed.ppt': { 'source': 'iana' },
                    'application/vnd.sealed.tiff': { 'source': 'iana' },
                    'application/vnd.sealed.xls': { 'source': 'iana' },
                    'application/vnd.sealedmedia.softseal.html': { 'source': 'iana' },
                    'application/vnd.sealedmedia.softseal.pdf': { 'source': 'iana' },
                    'application/vnd.seemail': {
                        'source': 'iana',
                        'extensions': ['see']
                    },
                    'application/vnd.sema': {
                        'source': 'iana',
                        'extensions': ['sema']
                    },
                    'application/vnd.semd': {
                        'source': 'iana',
                        'extensions': ['semd']
                    },
                    'application/vnd.semf': {
                        'source': 'iana',
                        'extensions': ['semf']
                    },
                    'application/vnd.shana.informed.formdata': {
                        'source': 'iana',
                        'extensions': ['ifm']
                    },
                    'application/vnd.shana.informed.formtemplate': {
                        'source': 'iana',
                        'extensions': ['itp']
                    },
                    'application/vnd.shana.informed.interchange': {
                        'source': 'iana',
                        'extensions': ['iif']
                    },
                    'application/vnd.shana.informed.package': {
                        'source': 'iana',
                        'extensions': ['ipk']
                    },
                    'application/vnd.simtech-mindmapper': {
                        'source': 'iana',
                        'extensions': [
                            'twd',
                            'twds'
                        ]
                    },
                    'application/vnd.siren+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.smaf': {
                        'source': 'iana',
                        'extensions': ['mmf']
                    },
                    'application/vnd.smart.notebook': { 'source': 'iana' },
                    'application/vnd.smart.teacher': {
                        'source': 'iana',
                        'extensions': ['teacher']
                    },
                    'application/vnd.software602.filler.form+xml': { 'source': 'iana' },
                    'application/vnd.software602.filler.form-xml-zip': { 'source': 'iana' },
                    'application/vnd.solent.sdkm+xml': {
                        'source': 'iana',
                        'extensions': [
                            'sdkm',
                            'sdkd'
                        ]
                    },
                    'application/vnd.spotfire.dxp': {
                        'source': 'iana',
                        'extensions': ['dxp']
                    },
                    'application/vnd.spotfire.sfs': {
                        'source': 'iana',
                        'extensions': ['sfs']
                    },
                    'application/vnd.sss-cod': { 'source': 'iana' },
                    'application/vnd.sss-dtf': { 'source': 'iana' },
                    'application/vnd.sss-ntf': { 'source': 'iana' },
                    'application/vnd.stardivision.calc': {
                        'source': 'apache',
                        'extensions': ['sdc']
                    },
                    'application/vnd.stardivision.draw': {
                        'source': 'apache',
                        'extensions': ['sda']
                    },
                    'application/vnd.stardivision.impress': {
                        'source': 'apache',
                        'extensions': ['sdd']
                    },
                    'application/vnd.stardivision.math': {
                        'source': 'apache',
                        'extensions': ['smf']
                    },
                    'application/vnd.stardivision.writer': {
                        'source': 'apache',
                        'extensions': [
                            'sdw',
                            'vor'
                        ]
                    },
                    'application/vnd.stardivision.writer-global': {
                        'source': 'apache',
                        'extensions': ['sgl']
                    },
                    'application/vnd.stepmania.package': {
                        'source': 'iana',
                        'extensions': ['smzip']
                    },
                    'application/vnd.stepmania.stepchart': {
                        'source': 'iana',
                        'extensions': ['sm']
                    },
                    'application/vnd.street-stream': { 'source': 'iana' },
                    'application/vnd.sun.wadl+xml': { 'source': 'iana' },
                    'application/vnd.sun.xml.calc': {
                        'source': 'apache',
                        'extensions': ['sxc']
                    },
                    'application/vnd.sun.xml.calc.template': {
                        'source': 'apache',
                        'extensions': ['stc']
                    },
                    'application/vnd.sun.xml.draw': {
                        'source': 'apache',
                        'extensions': ['sxd']
                    },
                    'application/vnd.sun.xml.draw.template': {
                        'source': 'apache',
                        'extensions': ['std']
                    },
                    'application/vnd.sun.xml.impress': {
                        'source': 'apache',
                        'extensions': ['sxi']
                    },
                    'application/vnd.sun.xml.impress.template': {
                        'source': 'apache',
                        'extensions': ['sti']
                    },
                    'application/vnd.sun.xml.math': {
                        'source': 'apache',
                        'extensions': ['sxm']
                    },
                    'application/vnd.sun.xml.writer': {
                        'source': 'apache',
                        'extensions': ['sxw']
                    },
                    'application/vnd.sun.xml.writer.global': {
                        'source': 'apache',
                        'extensions': ['sxg']
                    },
                    'application/vnd.sun.xml.writer.template': {
                        'source': 'apache',
                        'extensions': ['stw']
                    },
                    'application/vnd.sus-calendar': {
                        'source': 'iana',
                        'extensions': [
                            'sus',
                            'susp'
                        ]
                    },
                    'application/vnd.svd': {
                        'source': 'iana',
                        'extensions': ['svd']
                    },
                    'application/vnd.swiftview-ics': { 'source': 'iana' },
                    'application/vnd.symbian.install': {
                        'source': 'apache',
                        'extensions': [
                            'sis',
                            'sisx'
                        ]
                    },
                    'application/vnd.syncml+xml': {
                        'source': 'iana',
                        'extensions': ['xsm']
                    },
                    'application/vnd.syncml.dm+wbxml': {
                        'source': 'iana',
                        'extensions': ['bdm']
                    },
                    'application/vnd.syncml.dm+xml': {
                        'source': 'iana',
                        'extensions': ['xdm']
                    },
                    'application/vnd.syncml.dm.notification': { 'source': 'iana' },
                    'application/vnd.syncml.dmddf+wbxml': { 'source': 'iana' },
                    'application/vnd.syncml.dmddf+xml': { 'source': 'iana' },
                    'application/vnd.syncml.dmtnds+wbxml': { 'source': 'iana' },
                    'application/vnd.syncml.dmtnds+xml': { 'source': 'iana' },
                    'application/vnd.syncml.ds.notification': { 'source': 'iana' },
                    'application/vnd.tao.intent-module-archive': {
                        'source': 'iana',
                        'extensions': ['tao']
                    },
                    'application/vnd.tcpdump.pcap': {
                        'source': 'iana',
                        'extensions': [
                            'pcap',
                            'cap',
                            'dmp'
                        ]
                    },
                    'application/vnd.tmd.mediaflex.api+xml': { 'source': 'iana' },
                    'application/vnd.tmobile-livetv': {
                        'source': 'iana',
                        'extensions': ['tmo']
                    },
                    'application/vnd.trid.tpt': {
                        'source': 'iana',
                        'extensions': ['tpt']
                    },
                    'application/vnd.triscape.mxs': {
                        'source': 'iana',
                        'extensions': ['mxs']
                    },
                    'application/vnd.trueapp': {
                        'source': 'iana',
                        'extensions': ['tra']
                    },
                    'application/vnd.truedoc': { 'source': 'iana' },
                    'application/vnd.ubisoft.webplayer': { 'source': 'iana' },
                    'application/vnd.ufdl': {
                        'source': 'iana',
                        'extensions': [
                            'ufd',
                            'ufdl'
                        ]
                    },
                    'application/vnd.uiq.theme': {
                        'source': 'iana',
                        'extensions': ['utz']
                    },
                    'application/vnd.umajin': {
                        'source': 'iana',
                        'extensions': ['umj']
                    },
                    'application/vnd.unity': {
                        'source': 'iana',
                        'extensions': ['unityweb']
                    },
                    'application/vnd.uoml+xml': {
                        'source': 'iana',
                        'extensions': ['uoml']
                    },
                    'application/vnd.uplanet.alert': { 'source': 'iana' },
                    'application/vnd.uplanet.alert-wbxml': { 'source': 'iana' },
                    'application/vnd.uplanet.bearer-choice': { 'source': 'iana' },
                    'application/vnd.uplanet.bearer-choice-wbxml': { 'source': 'iana' },
                    'application/vnd.uplanet.cacheop': { 'source': 'iana' },
                    'application/vnd.uplanet.cacheop-wbxml': { 'source': 'iana' },
                    'application/vnd.uplanet.channel': { 'source': 'iana' },
                    'application/vnd.uplanet.channel-wbxml': { 'source': 'iana' },
                    'application/vnd.uplanet.list': { 'source': 'iana' },
                    'application/vnd.uplanet.list-wbxml': { 'source': 'iana' },
                    'application/vnd.uplanet.listcmd': { 'source': 'iana' },
                    'application/vnd.uplanet.listcmd-wbxml': { 'source': 'iana' },
                    'application/vnd.uplanet.signal': { 'source': 'iana' },
                    'application/vnd.valve.source.material': { 'source': 'iana' },
                    'application/vnd.vcx': {
                        'source': 'iana',
                        'extensions': ['vcx']
                    },
                    'application/vnd.vd-study': { 'source': 'iana' },
                    'application/vnd.vectorworks': { 'source': 'iana' },
                    'application/vnd.verimatrix.vcas': { 'source': 'iana' },
                    'application/vnd.vidsoft.vidconference': { 'source': 'iana' },
                    'application/vnd.visio': {
                        'source': 'iana',
                        'extensions': [
                            'vsd',
                            'vst',
                            'vss',
                            'vsw'
                        ]
                    },
                    'application/vnd.visionary': {
                        'source': 'iana',
                        'extensions': ['vis']
                    },
                    'application/vnd.vividence.scriptfile': { 'source': 'iana' },
                    'application/vnd.vsf': {
                        'source': 'iana',
                        'extensions': ['vsf']
                    },
                    'application/vnd.wap.sic': { 'source': 'iana' },
                    'application/vnd.wap.slc': { 'source': 'iana' },
                    'application/vnd.wap.wbxml': {
                        'source': 'iana',
                        'extensions': ['wbxml']
                    },
                    'application/vnd.wap.wmlc': {
                        'source': 'iana',
                        'extensions': ['wmlc']
                    },
                    'application/vnd.wap.wmlscriptc': {
                        'source': 'iana',
                        'extensions': ['wmlsc']
                    },
                    'application/vnd.webturbo': {
                        'source': 'iana',
                        'extensions': ['wtb']
                    },
                    'application/vnd.wfa.p2p': { 'source': 'iana' },
                    'application/vnd.wfa.wsc': { 'source': 'iana' },
                    'application/vnd.windows.devicepairing': { 'source': 'iana' },
                    'application/vnd.wmc': { 'source': 'iana' },
                    'application/vnd.wmf.bootstrap': { 'source': 'iana' },
                    'application/vnd.wolfram.mathematica': { 'source': 'iana' },
                    'application/vnd.wolfram.mathematica.package': { 'source': 'iana' },
                    'application/vnd.wolfram.player': {
                        'source': 'iana',
                        'extensions': ['nbp']
                    },
                    'application/vnd.wordperfect': {
                        'source': 'iana',
                        'extensions': ['wpd']
                    },
                    'application/vnd.wqd': {
                        'source': 'iana',
                        'extensions': ['wqd']
                    },
                    'application/vnd.wrq-hp3000-labelled': { 'source': 'iana' },
                    'application/vnd.wt.stf': {
                        'source': 'iana',
                        'extensions': ['stf']
                    },
                    'application/vnd.wv.csp+wbxml': { 'source': 'iana' },
                    'application/vnd.wv.csp+xml': { 'source': 'iana' },
                    'application/vnd.wv.ssp+xml': { 'source': 'iana' },
                    'application/vnd.xacml+json': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/vnd.xara': {
                        'source': 'iana',
                        'extensions': ['xar']
                    },
                    'application/vnd.xfdl': {
                        'source': 'iana',
                        'extensions': ['xfdl']
                    },
                    'application/vnd.xfdl.webform': { 'source': 'iana' },
                    'application/vnd.xmi+xml': { 'source': 'iana' },
                    'application/vnd.xmpie.cpkg': { 'source': 'iana' },
                    'application/vnd.xmpie.dpkg': { 'source': 'iana' },
                    'application/vnd.xmpie.plan': { 'source': 'iana' },
                    'application/vnd.xmpie.ppkg': { 'source': 'iana' },
                    'application/vnd.xmpie.xlim': { 'source': 'iana' },
                    'application/vnd.yamaha.hv-dic': {
                        'source': 'iana',
                        'extensions': ['hvd']
                    },
                    'application/vnd.yamaha.hv-script': {
                        'source': 'iana',
                        'extensions': ['hvs']
                    },
                    'application/vnd.yamaha.hv-voice': {
                        'source': 'iana',
                        'extensions': ['hvp']
                    },
                    'application/vnd.yamaha.openscoreformat': {
                        'source': 'iana',
                        'extensions': ['osf']
                    },
                    'application/vnd.yamaha.openscoreformat.osfpvg+xml': {
                        'source': 'iana',
                        'extensions': ['osfpvg']
                    },
                    'application/vnd.yamaha.remote-setup': { 'source': 'iana' },
                    'application/vnd.yamaha.smaf-audio': {
                        'source': 'iana',
                        'extensions': ['saf']
                    },
                    'application/vnd.yamaha.smaf-phrase': {
                        'source': 'iana',
                        'extensions': ['spf']
                    },
                    'application/vnd.yamaha.through-ngn': { 'source': 'iana' },
                    'application/vnd.yamaha.tunnel-udpencap': { 'source': 'iana' },
                    'application/vnd.yaoweme': { 'source': 'iana' },
                    'application/vnd.yellowriver-custom-menu': {
                        'source': 'iana',
                        'extensions': ['cmp']
                    },
                    'application/vnd.zul': {
                        'source': 'iana',
                        'extensions': [
                            'zir',
                            'zirz'
                        ]
                    },
                    'application/vnd.zzazz.deck+xml': {
                        'source': 'iana',
                        'extensions': ['zaz']
                    },
                    'application/voicexml+xml': {
                        'source': 'iana',
                        'extensions': ['vxml']
                    },
                    'application/vq-rtcpxr': { 'source': 'iana' },
                    'application/watcherinfo+xml': { 'source': 'iana' },
                    'application/whoispp-query': { 'source': 'iana' },
                    'application/whoispp-response': { 'source': 'iana' },
                    'application/widget': {
                        'source': 'iana',
                        'extensions': ['wgt']
                    },
                    'application/winhlp': {
                        'source': 'apache',
                        'extensions': ['hlp']
                    },
                    'application/wita': { 'source': 'iana' },
                    'application/wordperfect5.1': { 'source': 'iana' },
                    'application/wsdl+xml': {
                        'source': 'iana',
                        'extensions': ['wsdl']
                    },
                    'application/wspolicy+xml': {
                        'source': 'iana',
                        'extensions': ['wspolicy']
                    },
                    'application/x-7z-compressed': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['7z']
                    },
                    'application/x-abiword': {
                        'source': 'apache',
                        'extensions': ['abw']
                    },
                    'application/x-ace-compressed': {
                        'source': 'apache',
                        'extensions': ['ace']
                    },
                    'application/x-amf': { 'source': 'apache' },
                    'application/x-apple-diskimage': {
                        'source': 'apache',
                        'extensions': ['dmg']
                    },
                    'application/x-authorware-bin': {
                        'source': 'apache',
                        'extensions': [
                            'aab',
                            'x32',
                            'u32',
                            'vox'
                        ]
                    },
                    'application/x-authorware-map': {
                        'source': 'apache',
                        'extensions': ['aam']
                    },
                    'application/x-authorware-seg': {
                        'source': 'apache',
                        'extensions': ['aas']
                    },
                    'application/x-bcpio': {
                        'source': 'apache',
                        'extensions': ['bcpio']
                    },
                    'application/x-bdoc': {
                        'compressible': false,
                        'extensions': ['bdoc']
                    },
                    'application/x-bittorrent': {
                        'source': 'apache',
                        'extensions': ['torrent']
                    },
                    'application/x-blorb': {
                        'source': 'apache',
                        'extensions': [
                            'blb',
                            'blorb'
                        ]
                    },
                    'application/x-bzip': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['bz']
                    },
                    'application/x-bzip2': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'bz2',
                            'boz'
                        ]
                    },
                    'application/x-cbr': {
                        'source': 'apache',
                        'extensions': [
                            'cbr',
                            'cba',
                            'cbt',
                            'cbz',
                            'cb7'
                        ]
                    },
                    'application/x-cdlink': {
                        'source': 'apache',
                        'extensions': ['vcd']
                    },
                    'application/x-cfs-compressed': {
                        'source': 'apache',
                        'extensions': ['cfs']
                    },
                    'application/x-chat': {
                        'source': 'apache',
                        'extensions': ['chat']
                    },
                    'application/x-chess-pgn': {
                        'source': 'apache',
                        'extensions': ['pgn']
                    },
                    'application/x-chrome-extension': { 'extensions': ['crx'] },
                    'application/x-compress': { 'source': 'apache' },
                    'application/x-conference': {
                        'source': 'apache',
                        'extensions': ['nsc']
                    },
                    'application/x-cpio': {
                        'source': 'apache',
                        'extensions': ['cpio']
                    },
                    'application/x-csh': {
                        'source': 'apache',
                        'extensions': ['csh']
                    },
                    'application/x-deb': { 'compressible': false },
                    'application/x-debian-package': {
                        'source': 'apache',
                        'extensions': [
                            'deb',
                            'udeb'
                        ]
                    },
                    'application/x-dgc-compressed': {
                        'source': 'apache',
                        'extensions': ['dgc']
                    },
                    'application/x-director': {
                        'source': 'apache',
                        'extensions': [
                            'dir',
                            'dcr',
                            'dxr',
                            'cst',
                            'cct',
                            'cxt',
                            'w3d',
                            'fgd',
                            'swa'
                        ]
                    },
                    'application/x-doom': {
                        'source': 'apache',
                        'extensions': ['wad']
                    },
                    'application/x-dtbncx+xml': {
                        'source': 'apache',
                        'extensions': ['ncx']
                    },
                    'application/x-dtbook+xml': {
                        'source': 'apache',
                        'extensions': ['dtb']
                    },
                    'application/x-dtbresource+xml': {
                        'source': 'apache',
                        'extensions': ['res']
                    },
                    'application/x-dvi': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['dvi']
                    },
                    'application/x-envoy': {
                        'source': 'apache',
                        'extensions': ['evy']
                    },
                    'application/x-eva': {
                        'source': 'apache',
                        'extensions': ['eva']
                    },
                    'application/x-font-bdf': {
                        'source': 'apache',
                        'extensions': ['bdf']
                    },
                    'application/x-font-dos': { 'source': 'apache' },
                    'application/x-font-framemaker': { 'source': 'apache' },
                    'application/x-font-ghostscript': {
                        'source': 'apache',
                        'extensions': ['gsf']
                    },
                    'application/x-font-libgrx': { 'source': 'apache' },
                    'application/x-font-linux-psf': {
                        'source': 'apache',
                        'extensions': ['psf']
                    },
                    'application/x-font-otf': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': ['otf']
                    },
                    'application/x-font-pcf': {
                        'source': 'apache',
                        'extensions': ['pcf']
                    },
                    'application/x-font-snf': {
                        'source': 'apache',
                        'extensions': ['snf']
                    },
                    'application/x-font-speedo': { 'source': 'apache' },
                    'application/x-font-sunos-news': { 'source': 'apache' },
                    'application/x-font-ttf': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': [
                            'ttf',
                            'ttc'
                        ]
                    },
                    'application/x-font-type1': {
                        'source': 'apache',
                        'extensions': [
                            'pfa',
                            'pfb',
                            'pfm',
                            'afm'
                        ]
                    },
                    'application/x-font-vfont': { 'source': 'apache' },
                    'application/x-freearc': {
                        'source': 'apache',
                        'extensions': ['arc']
                    },
                    'application/x-futuresplash': {
                        'source': 'apache',
                        'extensions': ['spl']
                    },
                    'application/x-gca-compressed': {
                        'source': 'apache',
                        'extensions': ['gca']
                    },
                    'application/x-glulx': {
                        'source': 'apache',
                        'extensions': ['ulx']
                    },
                    'application/x-gnumeric': {
                        'source': 'apache',
                        'extensions': ['gnumeric']
                    },
                    'application/x-gramps-xml': {
                        'source': 'apache',
                        'extensions': ['gramps']
                    },
                    'application/x-gtar': {
                        'source': 'apache',
                        'extensions': ['gtar']
                    },
                    'application/x-gzip': { 'source': 'apache' },
                    'application/x-hdf': {
                        'source': 'apache',
                        'extensions': ['hdf']
                    },
                    'application/x-install-instructions': {
                        'source': 'apache',
                        'extensions': ['install']
                    },
                    'application/x-iso9660-image': {
                        'source': 'apache',
                        'extensions': ['iso']
                    },
                    'application/x-java-jnlp-file': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['jnlp']
                    },
                    'application/x-javascript': { 'compressible': true },
                    'application/x-latex': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['latex']
                    },
                    'application/x-lua-bytecode': { 'extensions': ['luac'] },
                    'application/x-lzh-compressed': {
                        'source': 'apache',
                        'extensions': [
                            'lzh',
                            'lha'
                        ]
                    },
                    'application/x-mie': {
                        'source': 'apache',
                        'extensions': ['mie']
                    },
                    'application/x-mobipocket-ebook': {
                        'source': 'apache',
                        'extensions': [
                            'prc',
                            'mobi'
                        ]
                    },
                    'application/x-mpegurl': { 'compressible': false },
                    'application/x-ms-application': {
                        'source': 'apache',
                        'extensions': ['application']
                    },
                    'application/x-ms-shortcut': {
                        'source': 'apache',
                        'extensions': ['lnk']
                    },
                    'application/x-ms-wmd': {
                        'source': 'apache',
                        'extensions': ['wmd']
                    },
                    'application/x-ms-wmz': {
                        'source': 'apache',
                        'extensions': ['wmz']
                    },
                    'application/x-ms-xbap': {
                        'source': 'apache',
                        'extensions': ['xbap']
                    },
                    'application/x-msaccess': {
                        'source': 'apache',
                        'extensions': ['mdb']
                    },
                    'application/x-msbinder': {
                        'source': 'apache',
                        'extensions': ['obd']
                    },
                    'application/x-mscardfile': {
                        'source': 'apache',
                        'extensions': ['crd']
                    },
                    'application/x-msclip': {
                        'source': 'apache',
                        'extensions': ['clp']
                    },
                    'application/x-msdownload': {
                        'source': 'apache',
                        'extensions': [
                            'exe',
                            'dll',
                            'com',
                            'bat',
                            'msi'
                        ]
                    },
                    'application/x-msmediaview': {
                        'source': 'apache',
                        'extensions': [
                            'mvb',
                            'm13',
                            'm14'
                        ]
                    },
                    'application/x-msmetafile': {
                        'source': 'apache',
                        'extensions': [
                            'wmf',
                            'wmz',
                            'emf',
                            'emz'
                        ]
                    },
                    'application/x-msmoney': {
                        'source': 'apache',
                        'extensions': ['mny']
                    },
                    'application/x-mspublisher': {
                        'source': 'apache',
                        'extensions': ['pub']
                    },
                    'application/x-msschedule': {
                        'source': 'apache',
                        'extensions': ['scd']
                    },
                    'application/x-msterminal': {
                        'source': 'apache',
                        'extensions': ['trm']
                    },
                    'application/x-mswrite': {
                        'source': 'apache',
                        'extensions': ['wri']
                    },
                    'application/x-netcdf': {
                        'source': 'apache',
                        'extensions': [
                            'nc',
                            'cdf'
                        ]
                    },
                    'application/x-ns-proxy-autoconfig': {
                        'compressible': true,
                        'extensions': ['pac']
                    },
                    'application/x-nzb': {
                        'source': 'apache',
                        'extensions': ['nzb']
                    },
                    'application/x-pkcs12': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'p12',
                            'pfx'
                        ]
                    },
                    'application/x-pkcs7-certificates': {
                        'source': 'apache',
                        'extensions': [
                            'p7b',
                            'spc'
                        ]
                    },
                    'application/x-pkcs7-certreqresp': {
                        'source': 'apache',
                        'extensions': ['p7r']
                    },
                    'application/x-rar-compressed': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['rar']
                    },
                    'application/x-research-info-systems': {
                        'source': 'apache',
                        'extensions': ['ris']
                    },
                    'application/x-sh': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': ['sh']
                    },
                    'application/x-shar': {
                        'source': 'apache',
                        'extensions': ['shar']
                    },
                    'application/x-shockwave-flash': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['swf']
                    },
                    'application/x-silverlight-app': {
                        'source': 'apache',
                        'extensions': ['xap']
                    },
                    'application/x-sql': {
                        'source': 'apache',
                        'extensions': ['sql']
                    },
                    'application/x-stuffit': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['sit']
                    },
                    'application/x-stuffitx': {
                        'source': 'apache',
                        'extensions': ['sitx']
                    },
                    'application/x-subrip': {
                        'source': 'apache',
                        'extensions': ['srt']
                    },
                    'application/x-sv4cpio': {
                        'source': 'apache',
                        'extensions': ['sv4cpio']
                    },
                    'application/x-sv4crc': {
                        'source': 'apache',
                        'extensions': ['sv4crc']
                    },
                    'application/x-t3vm-image': {
                        'source': 'apache',
                        'extensions': ['t3']
                    },
                    'application/x-tads': {
                        'source': 'apache',
                        'extensions': ['gam']
                    },
                    'application/x-tar': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': ['tar']
                    },
                    'application/x-tcl': {
                        'source': 'apache',
                        'extensions': ['tcl']
                    },
                    'application/x-tex': {
                        'source': 'apache',
                        'extensions': ['tex']
                    },
                    'application/x-tex-tfm': {
                        'source': 'apache',
                        'extensions': ['tfm']
                    },
                    'application/x-texinfo': {
                        'source': 'apache',
                        'extensions': [
                            'texinfo',
                            'texi'
                        ]
                    },
                    'application/x-tgif': {
                        'source': 'apache',
                        'extensions': ['obj']
                    },
                    'application/x-ustar': {
                        'source': 'apache',
                        'extensions': ['ustar']
                    },
                    'application/x-wais-source': {
                        'source': 'apache',
                        'extensions': ['src']
                    },
                    'application/x-web-app-manifest+json': {
                        'compressible': true,
                        'extensions': ['webapp']
                    },
                    'application/x-www-form-urlencoded': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'application/x-x509-ca-cert': {
                        'source': 'apache',
                        'extensions': [
                            'der',
                            'crt'
                        ]
                    },
                    'application/x-xfig': {
                        'source': 'apache',
                        'extensions': ['fig']
                    },
                    'application/x-xliff+xml': {
                        'source': 'apache',
                        'extensions': ['xlf']
                    },
                    'application/x-xpinstall': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['xpi']
                    },
                    'application/x-xz': {
                        'source': 'apache',
                        'extensions': ['xz']
                    },
                    'application/x-zmachine': {
                        'source': 'apache',
                        'extensions': [
                            'z1',
                            'z2',
                            'z3',
                            'z4',
                            'z5',
                            'z6',
                            'z7',
                            'z8'
                        ]
                    },
                    'application/x400-bp': { 'source': 'iana' },
                    'application/xacml+xml': { 'source': 'iana' },
                    'application/xaml+xml': {
                        'source': 'apache',
                        'extensions': ['xaml']
                    },
                    'application/xcap-att+xml': { 'source': 'iana' },
                    'application/xcap-caps+xml': { 'source': 'iana' },
                    'application/xcap-diff+xml': {
                        'source': 'iana',
                        'extensions': ['xdf']
                    },
                    'application/xcap-el+xml': { 'source': 'iana' },
                    'application/xcap-error+xml': { 'source': 'iana' },
                    'application/xcap-ns+xml': { 'source': 'iana' },
                    'application/xcon-conference-info+xml': { 'source': 'iana' },
                    'application/xcon-conference-info-diff+xml': { 'source': 'iana' },
                    'application/xenc+xml': {
                        'source': 'iana',
                        'extensions': ['xenc']
                    },
                    'application/xhtml+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'xhtml',
                            'xht'
                        ]
                    },
                    'application/xhtml-voice+xml': { 'source': 'apache' },
                    'application/xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'xml',
                            'xsl',
                            'xsd'
                        ]
                    },
                    'application/xml-dtd': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['dtd']
                    },
                    'application/xml-external-parsed-entity': { 'source': 'iana' },
                    'application/xml-patch+xml': { 'source': 'iana' },
                    'application/xmpp+xml': { 'source': 'iana' },
                    'application/xop+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['xop']
                    },
                    'application/xproc+xml': {
                        'source': 'apache',
                        'extensions': ['xpl']
                    },
                    'application/xslt+xml': {
                        'source': 'iana',
                        'extensions': ['xslt']
                    },
                    'application/xspf+xml': {
                        'source': 'apache',
                        'extensions': ['xspf']
                    },
                    'application/xv+xml': {
                        'source': 'iana',
                        'extensions': [
                            'mxml',
                            'xhvml',
                            'xvml',
                            'xvm'
                        ]
                    },
                    'application/yang': {
                        'source': 'iana',
                        'extensions': ['yang']
                    },
                    'application/yin+xml': {
                        'source': 'iana',
                        'extensions': ['yin']
                    },
                    'application/zip': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['zip']
                    },
                    'application/zlib': { 'source': 'iana' },
                    'audio/1d-interleaved-parityfec': { 'source': 'iana' },
                    'audio/32kadpcm': { 'source': 'iana' },
                    'audio/3gpp': { 'source': 'iana' },
                    'audio/3gpp2': { 'source': 'iana' },
                    'audio/ac3': { 'source': 'iana' },
                    'audio/adpcm': {
                        'source': 'apache',
                        'extensions': ['adp']
                    },
                    'audio/amr': { 'source': 'iana' },
                    'audio/amr-wb': { 'source': 'iana' },
                    'audio/amr-wb+': { 'source': 'iana' },
                    'audio/aptx': { 'source': 'iana' },
                    'audio/asc': { 'source': 'iana' },
                    'audio/atrac-advanced-lossless': { 'source': 'iana' },
                    'audio/atrac-x': { 'source': 'iana' },
                    'audio/atrac3': { 'source': 'iana' },
                    'audio/basic': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'au',
                            'snd'
                        ]
                    },
                    'audio/bv16': { 'source': 'iana' },
                    'audio/bv32': { 'source': 'iana' },
                    'audio/clearmode': { 'source': 'iana' },
                    'audio/cn': { 'source': 'iana' },
                    'audio/dat12': { 'source': 'iana' },
                    'audio/dls': { 'source': 'iana' },
                    'audio/dsr-es201108': { 'source': 'iana' },
                    'audio/dsr-es202050': { 'source': 'iana' },
                    'audio/dsr-es202211': { 'source': 'iana' },
                    'audio/dsr-es202212': { 'source': 'iana' },
                    'audio/dv': { 'source': 'iana' },
                    'audio/dvi4': { 'source': 'iana' },
                    'audio/eac3': { 'source': 'iana' },
                    'audio/encaprtp': { 'source': 'iana' },
                    'audio/evrc': { 'source': 'iana' },
                    'audio/evrc-qcp': { 'source': 'iana' },
                    'audio/evrc0': { 'source': 'iana' },
                    'audio/evrc1': { 'source': 'iana' },
                    'audio/evrcb': { 'source': 'iana' },
                    'audio/evrcb0': { 'source': 'iana' },
                    'audio/evrcb1': { 'source': 'iana' },
                    'audio/evrcnw': { 'source': 'iana' },
                    'audio/evrcnw0': { 'source': 'iana' },
                    'audio/evrcnw1': { 'source': 'iana' },
                    'audio/evrcwb': { 'source': 'iana' },
                    'audio/evrcwb0': { 'source': 'iana' },
                    'audio/evrcwb1': { 'source': 'iana' },
                    'audio/fwdred': { 'source': 'iana' },
                    'audio/g719': { 'source': 'iana' },
                    'audio/g722': { 'source': 'iana' },
                    'audio/g7221': { 'source': 'iana' },
                    'audio/g723': { 'source': 'iana' },
                    'audio/g726-16': { 'source': 'iana' },
                    'audio/g726-24': { 'source': 'iana' },
                    'audio/g726-32': { 'source': 'iana' },
                    'audio/g726-40': { 'source': 'iana' },
                    'audio/g728': { 'source': 'iana' },
                    'audio/g729': { 'source': 'iana' },
                    'audio/g7291': { 'source': 'iana' },
                    'audio/g729d': { 'source': 'iana' },
                    'audio/g729e': { 'source': 'iana' },
                    'audio/gsm': { 'source': 'iana' },
                    'audio/gsm-efr': { 'source': 'iana' },
                    'audio/gsm-hr-08': { 'source': 'iana' },
                    'audio/ilbc': { 'source': 'iana' },
                    'audio/ip-mr_v2.5': { 'source': 'iana' },
                    'audio/isac': { 'source': 'apache' },
                    'audio/l16': { 'source': 'iana' },
                    'audio/l20': { 'source': 'iana' },
                    'audio/l24': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'audio/l8': { 'source': 'iana' },
                    'audio/lpc': { 'source': 'iana' },
                    'audio/midi': {
                        'source': 'apache',
                        'extensions': [
                            'mid',
                            'midi',
                            'kar',
                            'rmi'
                        ]
                    },
                    'audio/mobile-xmf': { 'source': 'iana' },
                    'audio/mp4': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'mp4a',
                            'm4a'
                        ]
                    },
                    'audio/mp4a-latm': { 'source': 'iana' },
                    'audio/mpa': { 'source': 'iana' },
                    'audio/mpa-robust': { 'source': 'iana' },
                    'audio/mpeg': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'mpga',
                            'mp2',
                            'mp2a',
                            'mp3',
                            'm2a',
                            'm3a'
                        ]
                    },
                    'audio/mpeg4-generic': { 'source': 'iana' },
                    'audio/musepack': { 'source': 'apache' },
                    'audio/ogg': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'oga',
                            'ogg',
                            'spx'
                        ]
                    },
                    'audio/opus': { 'source': 'iana' },
                    'audio/parityfec': { 'source': 'iana' },
                    'audio/pcma': { 'source': 'iana' },
                    'audio/pcma-wb': { 'source': 'iana' },
                    'audio/pcmu': { 'source': 'iana' },
                    'audio/pcmu-wb': { 'source': 'iana' },
                    'audio/prs.sid': { 'source': 'iana' },
                    'audio/qcelp': { 'source': 'iana' },
                    'audio/raptorfec': { 'source': 'iana' },
                    'audio/red': { 'source': 'iana' },
                    'audio/rtp-enc-aescm128': { 'source': 'iana' },
                    'audio/rtp-midi': { 'source': 'iana' },
                    'audio/rtploopback': { 'source': 'iana' },
                    'audio/rtx': { 'source': 'iana' },
                    'audio/s3m': {
                        'source': 'apache',
                        'extensions': ['s3m']
                    },
                    'audio/silk': {
                        'source': 'apache',
                        'extensions': ['sil']
                    },
                    'audio/smv': { 'source': 'iana' },
                    'audio/smv-qcp': { 'source': 'iana' },
                    'audio/smv0': { 'source': 'iana' },
                    'audio/sp-midi': { 'source': 'iana' },
                    'audio/speex': { 'source': 'iana' },
                    'audio/t140c': { 'source': 'iana' },
                    'audio/t38': { 'source': 'iana' },
                    'audio/telephone-event': { 'source': 'iana' },
                    'audio/tone': { 'source': 'iana' },
                    'audio/uemclip': { 'source': 'iana' },
                    'audio/ulpfec': { 'source': 'iana' },
                    'audio/vdvi': { 'source': 'iana' },
                    'audio/vmr-wb': { 'source': 'iana' },
                    'audio/vnd.3gpp.iufp': { 'source': 'iana' },
                    'audio/vnd.4sb': { 'source': 'iana' },
                    'audio/vnd.audiokoz': { 'source': 'iana' },
                    'audio/vnd.celp': { 'source': 'iana' },
                    'audio/vnd.cisco.nse': { 'source': 'iana' },
                    'audio/vnd.cmles.radio-events': { 'source': 'iana' },
                    'audio/vnd.cns.anp1': { 'source': 'iana' },
                    'audio/vnd.cns.inf1': { 'source': 'iana' },
                    'audio/vnd.dece.audio': {
                        'source': 'iana',
                        'extensions': [
                            'uva',
                            'uvva'
                        ]
                    },
                    'audio/vnd.digital-winds': {
                        'source': 'iana',
                        'extensions': ['eol']
                    },
                    'audio/vnd.dlna.adts': { 'source': 'iana' },
                    'audio/vnd.dolby.heaac.1': { 'source': 'iana' },
                    'audio/vnd.dolby.heaac.2': { 'source': 'iana' },
                    'audio/vnd.dolby.mlp': { 'source': 'iana' },
                    'audio/vnd.dolby.mps': { 'source': 'iana' },
                    'audio/vnd.dolby.pl2': { 'source': 'iana' },
                    'audio/vnd.dolby.pl2x': { 'source': 'iana' },
                    'audio/vnd.dolby.pl2z': { 'source': 'iana' },
                    'audio/vnd.dolby.pulse.1': { 'source': 'iana' },
                    'audio/vnd.dra': {
                        'source': 'iana',
                        'extensions': ['dra']
                    },
                    'audio/vnd.dts': {
                        'source': 'iana',
                        'extensions': ['dts']
                    },
                    'audio/vnd.dts.hd': {
                        'source': 'iana',
                        'extensions': ['dtshd']
                    },
                    'audio/vnd.dvb.file': { 'source': 'iana' },
                    'audio/vnd.everad.plj': { 'source': 'iana' },
                    'audio/vnd.hns.audio': { 'source': 'iana' },
                    'audio/vnd.lucent.voice': {
                        'source': 'iana',
                        'extensions': ['lvp']
                    },
                    'audio/vnd.ms-playready.media.pya': {
                        'source': 'iana',
                        'extensions': ['pya']
                    },
                    'audio/vnd.nokia.mobile-xmf': { 'source': 'iana' },
                    'audio/vnd.nortel.vbk': { 'source': 'iana' },
                    'audio/vnd.nuera.ecelp4800': {
                        'source': 'iana',
                        'extensions': ['ecelp4800']
                    },
                    'audio/vnd.nuera.ecelp7470': {
                        'source': 'iana',
                        'extensions': ['ecelp7470']
                    },
                    'audio/vnd.nuera.ecelp9600': {
                        'source': 'iana',
                        'extensions': ['ecelp9600']
                    },
                    'audio/vnd.octel.sbc': { 'source': 'iana' },
                    'audio/vnd.qcelp': { 'source': 'iana' },
                    'audio/vnd.rhetorex.32kadpcm': { 'source': 'iana' },
                    'audio/vnd.rip': {
                        'source': 'iana',
                        'extensions': ['rip']
                    },
                    'audio/vnd.rn-realaudio': { 'compressible': false },
                    'audio/vnd.sealedmedia.softseal.mpeg': { 'source': 'iana' },
                    'audio/vnd.vmx.cvsd': { 'source': 'iana' },
                    'audio/vnd.wave': { 'compressible': false },
                    'audio/vorbis': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'audio/vorbis-config': { 'source': 'iana' },
                    'audio/wav': {
                        'compressible': false,
                        'extensions': ['wav']
                    },
                    'audio/wave': {
                        'compressible': false,
                        'extensions': ['wav']
                    },
                    'audio/webm': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['weba']
                    },
                    'audio/x-aac': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['aac']
                    },
                    'audio/x-aiff': {
                        'source': 'apache',
                        'extensions': [
                            'aif',
                            'aiff',
                            'aifc'
                        ]
                    },
                    'audio/x-caf': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['caf']
                    },
                    'audio/x-flac': {
                        'source': 'apache',
                        'extensions': ['flac']
                    },
                    'audio/x-matroska': {
                        'source': 'apache',
                        'extensions': ['mka']
                    },
                    'audio/x-mpegurl': {
                        'source': 'apache',
                        'extensions': ['m3u']
                    },
                    'audio/x-ms-wax': {
                        'source': 'apache',
                        'extensions': ['wax']
                    },
                    'audio/x-ms-wma': {
                        'source': 'apache',
                        'extensions': ['wma']
                    },
                    'audio/x-pn-realaudio': {
                        'source': 'apache',
                        'extensions': [
                            'ram',
                            'ra'
                        ]
                    },
                    'audio/x-pn-realaudio-plugin': {
                        'source': 'apache',
                        'extensions': ['rmp']
                    },
                    'audio/x-tta': { 'source': 'apache' },
                    'audio/x-wav': {
                        'source': 'apache',
                        'extensions': ['wav']
                    },
                    'audio/xm': {
                        'source': 'apache',
                        'extensions': ['xm']
                    },
                    'chemical/x-cdx': {
                        'source': 'apache',
                        'extensions': ['cdx']
                    },
                    'chemical/x-cif': {
                        'source': 'apache',
                        'extensions': ['cif']
                    },
                    'chemical/x-cmdf': {
                        'source': 'apache',
                        'extensions': ['cmdf']
                    },
                    'chemical/x-cml': {
                        'source': 'apache',
                        'extensions': ['cml']
                    },
                    'chemical/x-csml': {
                        'source': 'apache',
                        'extensions': ['csml']
                    },
                    'chemical/x-pdb': { 'source': 'apache' },
                    'chemical/x-xyz': {
                        'source': 'apache',
                        'extensions': ['xyz']
                    },
                    'font/opentype': {
                        'compressible': true,
                        'extensions': ['otf']
                    },
                    'image/bmp': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': ['bmp']
                    },
                    'image/cgm': {
                        'source': 'iana',
                        'extensions': ['cgm']
                    },
                    'image/fits': { 'source': 'iana' },
                    'image/g3fax': {
                        'source': 'iana',
                        'extensions': ['g3']
                    },
                    'image/gif': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['gif']
                    },
                    'image/ief': {
                        'source': 'iana',
                        'extensions': ['ief']
                    },
                    'image/jp2': { 'source': 'iana' },
                    'image/jpeg': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'jpeg',
                            'jpg',
                            'jpe'
                        ]
                    },
                    'image/jpm': { 'source': 'iana' },
                    'image/jpx': { 'source': 'iana' },
                    'image/ktx': {
                        'source': 'iana',
                        'extensions': ['ktx']
                    },
                    'image/naplps': { 'source': 'iana' },
                    'image/pjpeg': { 'compressible': false },
                    'image/png': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': ['png']
                    },
                    'image/prs.btif': {
                        'source': 'iana',
                        'extensions': ['btif']
                    },
                    'image/prs.pti': { 'source': 'iana' },
                    'image/pwg-raster': { 'source': 'iana' },
                    'image/sgi': {
                        'source': 'apache',
                        'extensions': ['sgi']
                    },
                    'image/svg+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'svg',
                            'svgz'
                        ]
                    },
                    'image/t38': { 'source': 'iana' },
                    'image/tiff': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'tiff',
                            'tif'
                        ]
                    },
                    'image/tiff-fx': { 'source': 'iana' },
                    'image/vnd.adobe.photoshop': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['psd']
                    },
                    'image/vnd.airzip.accelerator.azv': { 'source': 'iana' },
                    'image/vnd.cns.inf2': { 'source': 'iana' },
                    'image/vnd.dece.graphic': {
                        'source': 'iana',
                        'extensions': [
                            'uvi',
                            'uvvi',
                            'uvg',
                            'uvvg'
                        ]
                    },
                    'image/vnd.djvu': {
                        'source': 'iana',
                        'extensions': [
                            'djvu',
                            'djv'
                        ]
                    },
                    'image/vnd.dvb.subtitle': {
                        'source': 'iana',
                        'extensions': ['sub']
                    },
                    'image/vnd.dwg': {
                        'source': 'iana',
                        'extensions': ['dwg']
                    },
                    'image/vnd.dxf': {
                        'source': 'iana',
                        'extensions': ['dxf']
                    },
                    'image/vnd.fastbidsheet': {
                        'source': 'iana',
                        'extensions': ['fbs']
                    },
                    'image/vnd.fpx': {
                        'source': 'iana',
                        'extensions': ['fpx']
                    },
                    'image/vnd.fst': {
                        'source': 'iana',
                        'extensions': ['fst']
                    },
                    'image/vnd.fujixerox.edmics-mmr': {
                        'source': 'iana',
                        'extensions': ['mmr']
                    },
                    'image/vnd.fujixerox.edmics-rlc': {
                        'source': 'iana',
                        'extensions': ['rlc']
                    },
                    'image/vnd.globalgraphics.pgb': { 'source': 'iana' },
                    'image/vnd.microsoft.icon': { 'source': 'iana' },
                    'image/vnd.mix': { 'source': 'iana' },
                    'image/vnd.ms-modi': {
                        'source': 'iana',
                        'extensions': ['mdi']
                    },
                    'image/vnd.ms-photo': {
                        'source': 'apache',
                        'extensions': ['wdp']
                    },
                    'image/vnd.net-fpx': {
                        'source': 'iana',
                        'extensions': ['npx']
                    },
                    'image/vnd.radiance': { 'source': 'iana' },
                    'image/vnd.sealed.png': { 'source': 'iana' },
                    'image/vnd.sealedmedia.softseal.gif': { 'source': 'iana' },
                    'image/vnd.sealedmedia.softseal.jpg': { 'source': 'iana' },
                    'image/vnd.svf': { 'source': 'iana' },
                    'image/vnd.tencent.tap': { 'source': 'iana' },
                    'image/vnd.valve.source.texture': { 'source': 'iana' },
                    'image/vnd.wap.wbmp': {
                        'source': 'iana',
                        'extensions': ['wbmp']
                    },
                    'image/vnd.xiff': {
                        'source': 'iana',
                        'extensions': ['xif']
                    },
                    'image/vnd.zbrush.pcx': { 'source': 'iana' },
                    'image/webp': {
                        'source': 'apache',
                        'extensions': ['webp']
                    },
                    'image/x-3ds': {
                        'source': 'apache',
                        'extensions': ['3ds']
                    },
                    'image/x-cmu-raster': {
                        'source': 'apache',
                        'extensions': ['ras']
                    },
                    'image/x-cmx': {
                        'source': 'apache',
                        'extensions': ['cmx']
                    },
                    'image/x-freehand': {
                        'source': 'apache',
                        'extensions': [
                            'fh',
                            'fhc',
                            'fh4',
                            'fh5',
                            'fh7'
                        ]
                    },
                    'image/x-icon': {
                        'source': 'apache',
                        'compressible': true,
                        'extensions': ['ico']
                    },
                    'image/x-mrsid-image': {
                        'source': 'apache',
                        'extensions': ['sid']
                    },
                    'image/x-ms-bmp': {
                        'compressible': true,
                        'extensions': ['bmp']
                    },
                    'image/x-pcx': {
                        'source': 'apache',
                        'extensions': ['pcx']
                    },
                    'image/x-pict': {
                        'source': 'apache',
                        'extensions': [
                            'pic',
                            'pct'
                        ]
                    },
                    'image/x-portable-anymap': {
                        'source': 'apache',
                        'extensions': ['pnm']
                    },
                    'image/x-portable-bitmap': {
                        'source': 'apache',
                        'extensions': ['pbm']
                    },
                    'image/x-portable-graymap': {
                        'source': 'apache',
                        'extensions': ['pgm']
                    },
                    'image/x-portable-pixmap': {
                        'source': 'apache',
                        'extensions': ['ppm']
                    },
                    'image/x-rgb': {
                        'source': 'apache',
                        'extensions': ['rgb']
                    },
                    'image/x-tga': {
                        'source': 'apache',
                        'extensions': ['tga']
                    },
                    'image/x-xbitmap': {
                        'source': 'apache',
                        'extensions': ['xbm']
                    },
                    'image/x-xcf': { 'compressible': false },
                    'image/x-xpixmap': {
                        'source': 'apache',
                        'extensions': ['xpm']
                    },
                    'image/x-xwindowdump': {
                        'source': 'apache',
                        'extensions': ['xwd']
                    },
                    'message/cpim': { 'source': 'iana' },
                    'message/delivery-status': { 'source': 'iana' },
                    'message/disposition-notification': { 'source': 'iana' },
                    'message/external-body': { 'source': 'iana' },
                    'message/feedback-report': { 'source': 'iana' },
                    'message/global': { 'source': 'iana' },
                    'message/global-delivery-status': { 'source': 'iana' },
                    'message/global-disposition-notification': { 'source': 'iana' },
                    'message/global-headers': { 'source': 'iana' },
                    'message/http': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'message/imdn+xml': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'message/news': { 'source': 'iana' },
                    'message/partial': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'message/rfc822': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'eml',
                            'mime'
                        ]
                    },
                    'message/s-http': { 'source': 'iana' },
                    'message/sip': { 'source': 'iana' },
                    'message/sipfrag': { 'source': 'iana' },
                    'message/tracking-status': { 'source': 'iana' },
                    'message/vnd.si.simp': { 'source': 'iana' },
                    'message/vnd.wfa.wsc': { 'source': 'iana' },
                    'model/iges': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'igs',
                            'iges'
                        ]
                    },
                    'model/mesh': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'msh',
                            'mesh',
                            'silo'
                        ]
                    },
                    'model/vnd.collada+xml': {
                        'source': 'iana',
                        'extensions': ['dae']
                    },
                    'model/vnd.dwf': {
                        'source': 'iana',
                        'extensions': ['dwf']
                    },
                    'model/vnd.flatland.3dml': { 'source': 'iana' },
                    'model/vnd.gdl': {
                        'source': 'iana',
                        'extensions': ['gdl']
                    },
                    'model/vnd.gs-gdl': { 'source': 'apache' },
                    'model/vnd.gs.gdl': { 'source': 'iana' },
                    'model/vnd.gtw': {
                        'source': 'iana',
                        'extensions': ['gtw']
                    },
                    'model/vnd.moml+xml': { 'source': 'iana' },
                    'model/vnd.mts': {
                        'source': 'iana',
                        'extensions': ['mts']
                    },
                    'model/vnd.opengex': { 'source': 'iana' },
                    'model/vnd.parasolid.transmit.binary': { 'source': 'iana' },
                    'model/vnd.parasolid.transmit.text': { 'source': 'iana' },
                    'model/vnd.valve.source.compiled-map': { 'source': 'iana' },
                    'model/vnd.vtu': {
                        'source': 'iana',
                        'extensions': ['vtu']
                    },
                    'model/vrml': {
                        'source': 'iana',
                        'compressible': false,
                        'extensions': [
                            'wrl',
                            'vrml'
                        ]
                    },
                    'model/x3d+binary': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'x3db',
                            'x3dbz'
                        ]
                    },
                    'model/x3d+fastinfoset': { 'source': 'iana' },
                    'model/x3d+vrml': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'x3dv',
                            'x3dvz'
                        ]
                    },
                    'model/x3d+xml': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'x3d',
                            'x3dz'
                        ]
                    },
                    'model/x3d-vrml': { 'source': 'iana' },
                    'multipart/alternative': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'multipart/appledouble': { 'source': 'iana' },
                    'multipart/byteranges': { 'source': 'iana' },
                    'multipart/digest': { 'source': 'iana' },
                    'multipart/encrypted': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'multipart/form-data': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'multipart/header-set': { 'source': 'iana' },
                    'multipart/mixed': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'multipart/parallel': { 'source': 'iana' },
                    'multipart/related': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'multipart/report': { 'source': 'iana' },
                    'multipart/signed': {
                        'source': 'iana',
                        'compressible': false
                    },
                    'multipart/voice-message': { 'source': 'iana' },
                    'multipart/x-mixed-replace': { 'source': 'iana' },
                    'text/1d-interleaved-parityfec': { 'source': 'iana' },
                    'text/cache-manifest': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'appcache',
                            'manifest'
                        ]
                    },
                    'text/calendar': {
                        'source': 'iana',
                        'extensions': [
                            'ics',
                            'ifb'
                        ]
                    },
                    'text/calender': { 'compressible': true },
                    'text/cmd': { 'compressible': true },
                    'text/coffeescript': {
                        'extensions': [
                            'coffee',
                            'litcoffee'
                        ]
                    },
                    'text/css': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['css']
                    },
                    'text/csv': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['csv']
                    },
                    'text/csv-schema': { 'source': 'iana' },
                    'text/directory': { 'source': 'iana' },
                    'text/dns': { 'source': 'iana' },
                    'text/ecmascript': { 'source': 'iana' },
                    'text/encaprtp': { 'source': 'iana' },
                    'text/enriched': { 'source': 'iana' },
                    'text/fwdred': { 'source': 'iana' },
                    'text/grammar-ref-list': { 'source': 'iana' },
                    'text/hjson': { 'extensions': ['hjson'] },
                    'text/html': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'html',
                            'htm'
                        ]
                    },
                    'text/jade': { 'extensions': ['jade'] },
                    'text/javascript': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'text/jcr-cnd': { 'source': 'iana' },
                    'text/jsx': {
                        'compressible': true,
                        'extensions': ['jsx']
                    },
                    'text/less': { 'extensions': ['less'] },
                    'text/markdown': { 'source': 'iana' },
                    'text/mizar': { 'source': 'iana' },
                    'text/n3': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['n3']
                    },
                    'text/parameters': { 'source': 'iana' },
                    'text/parityfec': { 'source': 'iana' },
                    'text/plain': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'txt',
                            'text',
                            'conf',
                            'def',
                            'list',
                            'log',
                            'in',
                            'ini'
                        ]
                    },
                    'text/provenance-notation': { 'source': 'iana' },
                    'text/prs.fallenstein.rst': { 'source': 'iana' },
                    'text/prs.lines.tag': {
                        'source': 'iana',
                        'extensions': ['dsc']
                    },
                    'text/raptorfec': { 'source': 'iana' },
                    'text/red': { 'source': 'iana' },
                    'text/rfc822-headers': { 'source': 'iana' },
                    'text/richtext': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['rtx']
                    },
                    'text/rtf': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['rtf']
                    },
                    'text/rtp-enc-aescm128': { 'source': 'iana' },
                    'text/rtploopback': { 'source': 'iana' },
                    'text/rtx': { 'source': 'iana' },
                    'text/sgml': {
                        'source': 'iana',
                        'extensions': [
                            'sgml',
                            'sgm'
                        ]
                    },
                    'text/stylus': {
                        'extensions': [
                            'stylus',
                            'styl'
                        ]
                    },
                    'text/t140': { 'source': 'iana' },
                    'text/tab-separated-values': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['tsv']
                    },
                    'text/troff': {
                        'source': 'iana',
                        'extensions': [
                            't',
                            'tr',
                            'roff',
                            'man',
                            'me',
                            'ms'
                        ]
                    },
                    'text/turtle': {
                        'source': 'iana',
                        'extensions': ['ttl']
                    },
                    'text/ulpfec': { 'source': 'iana' },
                    'text/uri-list': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': [
                            'uri',
                            'uris',
                            'urls'
                        ]
                    },
                    'text/vcard': {
                        'source': 'iana',
                        'compressible': true,
                        'extensions': ['vcard']
                    },
                    'text/vnd.a': { 'source': 'iana' },
                    'text/vnd.abc': { 'source': 'iana' },
                    'text/vnd.curl': {
                        'source': 'iana',
                        'extensions': ['curl']
                    },
                    'text/vnd.curl.dcurl': {
                        'source': 'apache',
                        'extensions': ['dcurl']
                    },
                    'text/vnd.curl.mcurl': {
                        'source': 'apache',
                        'extensions': ['mcurl']
                    },
                    'text/vnd.curl.scurl': {
                        'source': 'apache',
                        'extensions': ['scurl']
                    },
                    'text/vnd.debian.copyright': { 'source': 'iana' },
                    'text/vnd.dmclientscript': { 'source': 'iana' },
                    'text/vnd.dvb.subtitle': {
                        'source': 'iana',
                        'extensions': ['sub']
                    },
                    'text/vnd.esmertec.theme-descriptor': { 'source': 'iana' },
                    'text/vnd.fly': {
                        'source': 'iana',
                        'extensions': ['fly']
                    },
                    'text/vnd.fmi.flexstor': {
                        'source': 'iana',
                        'extensions': ['flx']
                    },
                    'text/vnd.graphviz': {
                        'source': 'iana',
                        'extensions': ['gv']
                    },
                    'text/vnd.in3d.3dml': {
                        'source': 'iana',
                        'extensions': ['3dml']
                    },
                    'text/vnd.in3d.spot': {
                        'source': 'iana',
                        'extensions': ['spot']
                    },
                    'text/vnd.iptc.newsml': { 'source': 'iana' },
                    'text/vnd.iptc.nitf': { 'source': 'iana' },
                    'text/vnd.latex-z': { 'source': 'iana' },
                    'text/vnd.motorola.reflex': { 'source': 'iana' },
                    'text/vnd.ms-mediapackage': { 'source': 'iana' },
                    'text/vnd.net2phone.commcenter.command': { 'source': 'iana' },
                    'text/vnd.radisys.msml-basic-layout': { 'source': 'iana' },
                    'text/vnd.si.uricatalogue': { 'source': 'iana' },
                    'text/vnd.sun.j2me.app-descriptor': {
                        'source': 'iana',
                        'extensions': ['jad']
                    },
                    'text/vnd.trolltech.linguist': { 'source': 'iana' },
                    'text/vnd.wap.si': { 'source': 'iana' },
                    'text/vnd.wap.sl': { 'source': 'iana' },
                    'text/vnd.wap.wml': {
                        'source': 'iana',
                        'extensions': ['wml']
                    },
                    'text/vnd.wap.wmlscript': {
                        'source': 'iana',
                        'extensions': ['wmls']
                    },
                    'text/vtt': {
                        'charset': 'UTF-8',
                        'compressible': true,
                        'extensions': ['vtt']
                    },
                    'text/x-asm': {
                        'source': 'apache',
                        'extensions': [
                            's',
                            'asm'
                        ]
                    },
                    'text/x-c': {
                        'source': 'apache',
                        'extensions': [
                            'c',
                            'cc',
                            'cxx',
                            'cpp',
                            'h',
                            'hh',
                            'dic'
                        ]
                    },
                    'text/x-component': { 'extensions': ['htc'] },
                    'text/x-fortran': {
                        'source': 'apache',
                        'extensions': [
                            'f',
                            'for',
                            'f77',
                            'f90'
                        ]
                    },
                    'text/x-gwt-rpc': { 'compressible': true },
                    'text/x-handlebars-template': { 'extensions': ['hbs'] },
                    'text/x-java-source': {
                        'source': 'apache',
                        'extensions': ['java']
                    },
                    'text/x-jquery-tmpl': { 'compressible': true },
                    'text/x-lua': { 'extensions': ['lua'] },
                    'text/x-markdown': {
                        'compressible': true,
                        'extensions': [
                            'markdown',
                            'md',
                            'mkd'
                        ]
                    },
                    'text/x-nfo': {
                        'source': 'apache',
                        'extensions': ['nfo']
                    },
                    'text/x-opml': {
                        'source': 'apache',
                        'extensions': ['opml']
                    },
                    'text/x-pascal': {
                        'source': 'apache',
                        'extensions': [
                            'p',
                            'pas'
                        ]
                    },
                    'text/x-sass': { 'extensions': ['sass'] },
                    'text/x-scss': { 'extensions': ['scss'] },
                    'text/x-setext': {
                        'source': 'apache',
                        'extensions': ['etx']
                    },
                    'text/x-sfv': {
                        'source': 'apache',
                        'extensions': ['sfv']
                    },
                    'text/x-uuencode': {
                        'source': 'apache',
                        'extensions': ['uu']
                    },
                    'text/x-vcalendar': {
                        'source': 'apache',
                        'extensions': ['vcs']
                    },
                    'text/x-vcard': {
                        'source': 'apache',
                        'extensions': ['vcf']
                    },
                    'text/xml': {
                        'source': 'iana',
                        'compressible': true
                    },
                    'text/xml-external-parsed-entity': { 'source': 'iana' },
                    'text/yaml': {
                        'extensions': [
                            'yaml',
                            'yml'
                        ]
                    },
                    'video/1d-interleaved-parityfec': { 'source': 'apache' },
                    'video/3gpp': {
                        'source': 'apache',
                        'extensions': ['3gp']
                    },
                    'video/3gpp-tt': { 'source': 'apache' },
                    'video/3gpp2': {
                        'source': 'apache',
                        'extensions': ['3g2']
                    },
                    'video/bmpeg': { 'source': 'apache' },
                    'video/bt656': { 'source': 'apache' },
                    'video/celb': { 'source': 'apache' },
                    'video/dv': { 'source': 'apache' },
                    'video/h261': {
                        'source': 'apache',
                        'extensions': ['h261']
                    },
                    'video/h263': {
                        'source': 'apache',
                        'extensions': ['h263']
                    },
                    'video/h263-1998': { 'source': 'apache' },
                    'video/h263-2000': { 'source': 'apache' },
                    'video/h264': {
                        'source': 'apache',
                        'extensions': ['h264']
                    },
                    'video/h264-rcdo': { 'source': 'apache' },
                    'video/h264-svc': { 'source': 'apache' },
                    'video/jpeg': {
                        'source': 'apache',
                        'extensions': ['jpgv']
                    },
                    'video/jpeg2000': { 'source': 'apache' },
                    'video/jpm': {
                        'source': 'apache',
                        'extensions': [
                            'jpm',
                            'jpgm'
                        ]
                    },
                    'video/mj2': {
                        'source': 'apache',
                        'extensions': [
                            'mj2',
                            'mjp2'
                        ]
                    },
                    'video/mp1s': { 'source': 'apache' },
                    'video/mp2p': { 'source': 'apache' },
                    'video/mp2t': {
                        'source': 'apache',
                        'extensions': ['ts']
                    },
                    'video/mp4': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'mp4',
                            'mp4v',
                            'mpg4'
                        ]
                    },
                    'video/mp4v-es': { 'source': 'apache' },
                    'video/mpeg': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'mpeg',
                            'mpg',
                            'mpe',
                            'm1v',
                            'm2v'
                        ]
                    },
                    'video/mpeg4-generic': { 'source': 'apache' },
                    'video/mpv': { 'source': 'apache' },
                    'video/nv': { 'source': 'apache' },
                    'video/ogg': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['ogv']
                    },
                    'video/parityfec': { 'source': 'apache' },
                    'video/pointer': { 'source': 'apache' },
                    'video/quicktime': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'qt',
                            'mov'
                        ]
                    },
                    'video/raw': { 'source': 'apache' },
                    'video/rtp-enc-aescm128': { 'source': 'apache' },
                    'video/rtx': { 'source': 'apache' },
                    'video/smpte292m': { 'source': 'apache' },
                    'video/ulpfec': { 'source': 'apache' },
                    'video/vc1': { 'source': 'apache' },
                    'video/vnd.cctv': { 'source': 'apache' },
                    'video/vnd.dece.hd': {
                        'source': 'apache',
                        'extensions': [
                            'uvh',
                            'uvvh'
                        ]
                    },
                    'video/vnd.dece.mobile': {
                        'source': 'apache',
                        'extensions': [
                            'uvm',
                            'uvvm'
                        ]
                    },
                    'video/vnd.dece.mp4': { 'source': 'apache' },
                    'video/vnd.dece.pd': {
                        'source': 'apache',
                        'extensions': [
                            'uvp',
                            'uvvp'
                        ]
                    },
                    'video/vnd.dece.sd': {
                        'source': 'apache',
                        'extensions': [
                            'uvs',
                            'uvvs'
                        ]
                    },
                    'video/vnd.dece.video': {
                        'source': 'apache',
                        'extensions': [
                            'uvv',
                            'uvvv'
                        ]
                    },
                    'video/vnd.directv.mpeg': { 'source': 'apache' },
                    'video/vnd.directv.mpeg-tts': { 'source': 'apache' },
                    'video/vnd.dlna.mpeg-tts': { 'source': 'apache' },
                    'video/vnd.dvb.file': {
                        'source': 'apache',
                        'extensions': ['dvb']
                    },
                    'video/vnd.fvt': {
                        'source': 'apache',
                        'extensions': ['fvt']
                    },
                    'video/vnd.hns.video': { 'source': 'apache' },
                    'video/vnd.iptvforum.1dparityfec-1010': { 'source': 'apache' },
                    'video/vnd.iptvforum.1dparityfec-2005': { 'source': 'apache' },
                    'video/vnd.iptvforum.2dparityfec-1010': { 'source': 'apache' },
                    'video/vnd.iptvforum.2dparityfec-2005': { 'source': 'apache' },
                    'video/vnd.iptvforum.ttsavc': { 'source': 'apache' },
                    'video/vnd.iptvforum.ttsmpeg2': { 'source': 'apache' },
                    'video/vnd.motorola.video': { 'source': 'apache' },
                    'video/vnd.motorola.videop': { 'source': 'apache' },
                    'video/vnd.mpegurl': {
                        'source': 'apache',
                        'extensions': [
                            'mxu',
                            'm4u'
                        ]
                    },
                    'video/vnd.ms-playready.media.pyv': {
                        'source': 'apache',
                        'extensions': ['pyv']
                    },
                    'video/vnd.nokia.interleaved-multimedia': { 'source': 'apache' },
                    'video/vnd.nokia.videovoip': { 'source': 'apache' },
                    'video/vnd.objectvideo': { 'source': 'apache' },
                    'video/vnd.sealed.mpeg1': { 'source': 'apache' },
                    'video/vnd.sealed.mpeg4': { 'source': 'apache' },
                    'video/vnd.sealed.swf': { 'source': 'apache' },
                    'video/vnd.sealedmedia.softseal.mov': { 'source': 'apache' },
                    'video/vnd.uvvu.mp4': {
                        'source': 'apache',
                        'extensions': [
                            'uvu',
                            'uvvu'
                        ]
                    },
                    'video/vnd.vivo': {
                        'source': 'apache',
                        'extensions': ['viv']
                    },
                    'video/webm': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['webm']
                    },
                    'video/x-f4v': {
                        'source': 'apache',
                        'extensions': ['f4v']
                    },
                    'video/x-fli': {
                        'source': 'apache',
                        'extensions': ['fli']
                    },
                    'video/x-flv': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['flv']
                    },
                    'video/x-m4v': {
                        'source': 'apache',
                        'extensions': ['m4v']
                    },
                    'video/x-matroska': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': [
                            'mkv',
                            'mk3d',
                            'mks'
                        ]
                    },
                    'video/x-mng': {
                        'source': 'apache',
                        'extensions': ['mng']
                    },
                    'video/x-ms-asf': {
                        'source': 'apache',
                        'extensions': [
                            'asf',
                            'asx'
                        ]
                    },
                    'video/x-ms-vob': {
                        'source': 'apache',
                        'extensions': ['vob']
                    },
                    'video/x-ms-wm': {
                        'source': 'apache',
                        'extensions': ['wm']
                    },
                    'video/x-ms-wmv': {
                        'source': 'apache',
                        'compressible': false,
                        'extensions': ['wmv']
                    },
                    'video/x-ms-wmx': {
                        'source': 'apache',
                        'extensions': ['wmx']
                    },
                    'video/x-ms-wvx': {
                        'source': 'apache',
                        'extensions': ['wvx']
                    },
                    'video/x-msvideo': {
                        'source': 'apache',
                        'extensions': ['avi']
                    },
                    'video/x-sgi-movie': {
                        'source': 'apache',
                        'extensions': ['movie']
                    },
                    'video/x-smv': {
                        'source': 'apache',
                        'extensions': ['smv']
                    },
                    'x-conference/x-cooltalk': {
                        'source': 'apache',
                        'extensions': ['ice']
                    },
                    'x-shader/x-fragment': { 'compressible': true },
                    'x-shader/x-vertex': { 'compressible': true }
                };
            },
            {}
        ],
        22: [
            function (require, module, exports) {
                /*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */
                /**
 * Module exports.
 */
                module.exports = require('./db.json');
            },
            { './db.json': 21 }
        ],
        23: [
            function (require, module, exports) {
                var db = require('mime-db');
                // types[extension] = type
                exports.types = Object.create(null);
                // extensions[type] = [extensions]
                exports.extensions = Object.create(null);
                Object.keys(db).forEach(function (name) {
                    var mime = db[name];
                    var exts = mime.extensions;
                    if (!exts || !exts.length)
                        return;
                    exports.extensions[name] = exts;
                    exts.forEach(function (ext) {
                        exports.types[ext] = name;
                    });
                });
                exports.lookup = function (string) {
                    if (!string || typeof string !== 'string')
                        return false;
                    // remove any leading paths, though we should just use path.basename
                    string = string.replace(/.*[\.\/\\]/, '').toLowerCase();
                    if (!string)
                        return false;
                    return exports.types[string] || false;
                };
                exports.extension = function (type) {
                };
                // type has to be an exact mime type
                exports.charset = function (type) {
                };
                // backwards compatibility
                exports.charsets = { lookup: exports.charset };
                // to do: maybe use set-type module or something
                exports.contentType = function (type) {
                };
            },
            { 'mime-db': 22 }
        ],
        24: [
            function (require, module, exports) {
                (function (process) {
                    // Copyright Joyent, Inc. and other Node contributors.
                    //
                    // Permission is hereby granted, free of charge, to any person obtaining a
                    // copy of this software and associated documentation files (the
                    // "Software"), to deal in the Software without restriction, including
                    // without limitation the rights to use, copy, modify, merge, publish,
                    // distribute, sublicense, and/or sell copies of the Software, and to permit
                    // persons to whom the Software is furnished to do so, subject to the
                    // following conditions:
                    //
                    // The above copyright notice and this permission notice shall be included
                    // in all copies or substantial portions of the Software.
                    //
                    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                    // USE OR OTHER DEALINGS IN THE SOFTWARE.
                    // resolves . and .. elements in a path array with directory names there
                    // must be no slashes, empty elements, or device names (c:\) in the array
                    // (so also no leading and trailing slashes - it does not distinguish
                    // relative and absolute paths)
                    function normalizeArray(parts, allowAboveRoot) {
                        // if the path tries to go above the root, `up` ends up > 0
                        var up = 0;
                        for (var i = parts.length - 1; i >= 0; i--) {
                            var last = parts[i];
                            if (last === '.') {
                                parts.splice(i, 1);
                            } else if (last === '..') {
                                parts.splice(i, 1);
                                up++;
                            } else if (up) {
                                parts.splice(i, 1);
                                up--;
                            }
                        }
                        // if the path is allowed to go above the root, restore leading ..s
                        if (allowAboveRoot) {
                            for (; up--; up) {
                                parts.unshift('..');
                            }
                        }
                        return parts;
                    }
                    // Split a filename into [root, dir, basename, ext], unix version
                    // 'root' is just a slash, or nothing.
                    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                    var splitPath = function (filename) {
                        return splitPathRe.exec(filename).slice(1);
                    };
                    // path.resolve([from ...], to)
                    // posix version
                    exports.resolve = function () {
                        var resolvedPath = '', resolvedAbsolute = false;
                        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                            var path = i >= 0 ? arguments[i] : process.cwd();
                            // Skip empty and invalid entries
                            if (typeof path !== 'string') {
                                throw new TypeError('Arguments to path.resolve must be strings');
                            } else if (!path) {
                                continue;
                            }
                            resolvedPath = path + '/' + resolvedPath;
                            resolvedAbsolute = path.charAt(0) === '/';
                        }
                        // At this point the path should be resolved to a full absolute path, but
                        // handle relative paths to be safe (might happen when process.cwd() fails)
                        // Normalize the path
                        resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
                            return !!p;
                        }), !resolvedAbsolute).join('/');
                        return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
                    };
                    // path.normalize(path)
                    // posix version
                    exports.normalize = function (path) {
                        var isAbsolute = exports.isAbsolute(path), trailingSlash = substr(path, -1) === '/';
                        // Normalize the path
                        path = normalizeArray(filter(path.split('/'), function (p) {
                            return !!p;
                        }), !isAbsolute).join('/');
                        if (!path && !isAbsolute) {
                            path = '.';
                        }
                        if (path && trailingSlash) {
                            path += '/';
                        }
                        return (isAbsolute ? '/' : '') + path;
                    };
                    // posix version
                    exports.isAbsolute = function (path) {
                        return path.charAt(0) === '/';
                    };
                    // posix version
                    exports.join = function () {
                        var paths = Array.prototype.slice.call(arguments, 0);
                        return exports.normalize(filter(paths, function (p, index) {
                            if (typeof p !== 'string') {
                                throw new TypeError('Arguments to path.join must be strings');
                            }
                            return p;
                        }).join('/'));
                    };
                    // path.relative(from, to)
                    // posix version
                    exports.relative = function (from, to) {
                        from = exports.resolve(from).substr(1);
                        to = exports.resolve(to).substr(1);
                        function trim(arr) {
                            var start = 0;
                            for (; start < arr.length; start++) {
                                if (arr[start] !== '')
                                    break;
                            }
                            var end = arr.length - 1;
                            for (; end >= 0; end--) {
                                if (arr[end] !== '')
                                    break;
                            }
                            if (start > end)
                                return [];
                            return arr.slice(start, end - start + 1);
                        }
                        var fromParts = trim(from.split('/'));
                        var toParts = trim(to.split('/'));
                        var length = Math.min(fromParts.length, toParts.length);
                        var samePartsLength = length;
                        for (var i = 0; i < length; i++) {
                            if (fromParts[i] !== toParts[i]) {
                                samePartsLength = i;
                                break;
                            }
                        }
                        var outputParts = [];
                        for (var i = samePartsLength; i < fromParts.length; i++) {
                            outputParts.push('..');
                        }
                        outputParts = outputParts.concat(toParts.slice(samePartsLength));
                        return outputParts.join('/');
                    };
                    exports.sep = '/';
                    exports.delimiter = ':';
                    exports.dirname = function (path) {
                        var result = splitPath(path), root = result[0], dir = result[1];
                        if (!root && !dir) {
                            // No dirname whatsoever
                            return '.';
                        }
                        if (dir) {
                            // It has a dirname, strip trailing slash
                            dir = dir.substr(0, dir.length - 1);
                        }
                        return root + dir;
                    };
                    exports.basename = function (path, ext) {
                        var f = splitPath(path)[2];
                        // TODO: make this comparison case-insensitive on windows?
                        if (ext && f.substr(-1 * ext.length) === ext) {
                            f = f.substr(0, f.length - ext.length);
                        }
                        return f;
                    };
                    exports.extname = function (path) {
                        return splitPath(path)[3];
                    };
                    function filter(xs, f) {
                        if (xs.filter)
                            return xs.filter(f);
                        var res = [];
                        for (var i = 0; i < xs.length; i++) {
                            if (f(xs[i], i, xs))
                                res.push(xs[i]);
                        }
                        return res;
                    }
                    // String.prototype.substr - negative index don't work in IE8
                    var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
                        return str.substr(start, len);
                    } : function (str, start, len) {
                        if (start < 0)
                            start = str.length + start;
                        return str.substr(start, len);
                    };
                }.call(this, require('_process')));
            },
            { '_process': 26 }
        ],
        25: [
            function (require, module, exports) {
                (function (process) {
                    'use strict';
                    if (!process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
                        module.exports = nextTick;
                    } else {
                        module.exports = process.nextTick;
                    }
                    function nextTick(fn, arg1, arg2, arg3) {
                        if (typeof fn !== 'function') {
                            throw new TypeError('"callback" argument must be a function');
                        }
                        var len = arguments.length;
                        var args, i;
                        switch (len) {
                        case 0:
                        case 1:
                            return process.nextTick(fn);
                        case 2:
                            return process.nextTick(function afterTickOne() {
                                fn.call(null, arg1);
                            });
                        case 3:
                            return process.nextTick(function afterTickTwo() {
                                fn.call(null, arg1, arg2);
                            });
                        case 4:
                            return process.nextTick(function afterTickThree() {
                                fn.call(null, arg1, arg2, arg3);
                            });
                        default:
                            args = new Array(len - 1);
                            i = 0;
                            while (i < args.length) {
                                args[i++] = arguments[i];
                            }
                            return process.nextTick(function afterTick() {
                                fn.apply(null, args);
                            });
                        }
                    }
                }.call(this, require('_process')));
            },
            { '_process': 26 }
        ],
        26: [
            function (require, module, exports) {
                // shim for using process in browser
                var process = module.exports = {};
                // cached from whatever global is present so that test runners that stub it
                // don't break things.  But we need to wrap it in a try catch in case it is
                // wrapped in strict mode code which doesn't define any globals.  It's inside a
                // function because try/catches deoptimize in certain engines.
                var cachedSetTimeout;
                var cachedClearTimeout;
                function defaultSetTimout() {
                    throw new Error('setTimeout has not been defined');
                }
                function defaultClearTimeout() {
                    throw new Error('clearTimeout has not been defined');
                }
                (function () {
                    try {
                        if (typeof setTimeout === 'function') {
                            cachedSetTimeout = setTimeout;
                        } else {
                            cachedSetTimeout = defaultSetTimout;
                        }
                    } catch (e) {
                        cachedSetTimeout = defaultSetTimout;
                    }
                    try {
                        if (typeof clearTimeout === 'function') {
                            cachedClearTimeout = clearTimeout;
                        } else {
                            cachedClearTimeout = defaultClearTimeout;
                        }
                    } catch (e) {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                }());
                function runTimeout(fun) {
                    if (cachedSetTimeout === setTimeout) {
                        //normal enviroments in sane situations
                        return setTimeout(fun, 0);
                    }
                    // if setTimeout wasn't available but was latter defined
                    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                        cachedSetTimeout = setTimeout;
                        return setTimeout(fun, 0);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedSetTimeout(fun, 0);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                            return cachedSetTimeout.call(null, fun, 0);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                            return cachedSetTimeout.call(this, fun, 0);
                        }
                    }
                }
                function runClearTimeout(marker) {
                    if (cachedClearTimeout === clearTimeout) {
                        //normal enviroments in sane situations
                        return clearTimeout(marker);
                    }
                    // if clearTimeout wasn't available but was latter defined
                    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                        cachedClearTimeout = clearTimeout;
                        return clearTimeout(marker);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedClearTimeout(marker);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                            return cachedClearTimeout.call(null, marker);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                            return cachedClearTimeout.call(this, marker);
                        }
                    }
                }
                var queue = [];
                var draining = false;
                var currentQueue;
                var queueIndex = -1;
                function cleanUpNextTick() {
                    if (!draining || !currentQueue) {
                        return;
                    }
                    draining = false;
                    if (currentQueue.length) {
                        queue = currentQueue.concat(queue);
                    } else {
                        queueIndex = -1;
                    }
                    if (queue.length) {
                        drainQueue();
                    }
                }
                function drainQueue() {
                    if (draining) {
                        return;
                    }
                    var timeout = runTimeout(cleanUpNextTick);
                    draining = true;
                    var len = queue.length;
                    while (len) {
                        currentQueue = queue;
                        queue = [];
                        while (++queueIndex < len) {
                            if (currentQueue) {
                                currentQueue[queueIndex].run();
                            }
                        }
                        queueIndex = -1;
                        len = queue.length;
                    }
                    currentQueue = null;
                    draining = false;
                    runClearTimeout(timeout);
                }
                process.nextTick = function (fun) {
                    var args = new Array(arguments.length - 1);
                    if (arguments.length > 1) {
                        for (var i = 1; i < arguments.length; i++) {
                            args[i - 1] = arguments[i];
                        }
                    }
                    queue.push(new Item(fun, args));
                    if (queue.length === 1 && !draining) {
                        runTimeout(drainQueue);
                    }
                };
                // v8 likes predictible objects
                function Item(fun, array) {
                    this.fun = fun;
                    this.array = array;
                }
                Item.prototype.run = function () {
                    this.fun.apply(null, this.array);
                };
                process.title = 'browser';
                process.browser = true;
                process.env = {};
                process.argv = [];
                process.version = '';
                // empty string to avoid regexp issues
                process.versions = {};
                function noop() {
                }
                process.on = noop;
                process.addListener = noop;
                process.once = noop;
                process.off = noop;
                process.removeListener = noop;
                process.removeAllListeners = noop;
                process.emit = noop;
                process.binding = function (name) {
                    throw new Error('process.binding is not supported');
                };
                process.cwd = function () {
                    return '/';
                };
                process.chdir = function (dir) {
                    throw new Error('process.chdir is not supported');
                };
                process.umask = function () {
                    return 0;
                };
            },
            {}
        ],
        27: [
            function (require, module, exports) {
                'use strict';
                var asap = require('asap/raw');
                function noop() {
                }
                // States:
                //
                // 0 - pending
                // 1 - fulfilled with _value
                // 2 - rejected with _value
                // 3 - adopted the state of another promise, _value
                //
                // once the state is no longer pending (0) it is immutable
                // All `_` prefixed properties will be reduced to `_{random number}`
                // at build time to obfuscate them and discourage their use.
                // We don't use symbols or Object.defineProperty to fully hide them
                // because the performance isn't good enough.
                // to avoid using try/catch inside critical functions, we
                // extract them to here.
                var LAST_ERROR = null;
                var IS_ERROR = {};
                function getThen(obj) {
                }
                function tryCallOne(fn, a) {
                }
                function tryCallTwo(fn, a, b) {
                }
                module.exports = Promise;
                function Promise(fn) {
                }
                Promise._10 = null;
                Promise._97 = null;
                Promise._61 = noop;
                Promise.prototype.then = function (onFulfilled, onRejected) {
                };
                function safeThen(self, onFulfilled, onRejected) {
                }
                ;
                function handle(self, deferred) {
                }
                function handleResolved(self, deferred) {
                }
                function resolve(self, newValue) {
                }
                function reject(self, newValue) {
                }
                function finale(self) {
                }
                function Handler(onFulfilled, onRejected, promise) {
                }
                /**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
                function doResolve(fn, promise) {
                }
            },
            { 'asap/raw': 3 }
        ],
        28: [
            function (require, module, exports) {
                'use strict';
                //This file contains the ES6 extensions to the core Promises/A+ API
                var Promise = require('./core.js');
                module.exports = Promise;
                /* Static Functions */
                var TRUE = valuePromise(true);
                var FALSE = valuePromise(false);
                var NULL = valuePromise(null);
                var UNDEFINED = valuePromise(undefined);
                var ZERO = valuePromise(0);
                var EMPTYSTRING = valuePromise('');
                function valuePromise(value) {
                }
                Promise.resolve = function (value) {
                };
                Promise.all = function (arr) {
                };
                Promise.reject = function (value) {
                };
                Promise.race = function (values) {
                };
                /* Prototype Methods */
                Promise.prototype['catch'] = function (onRejected) {
                };
            },
            { './core.js': 27 }
        ],
        29: [
            function (require, module, exports) {
                // should work in any browser without browserify
                if (typeof Promise.prototype.done !== 'function') {
                    Promise.prototype.done = function (onFulfilled, onRejected) {
                    };
                }
            },
            {}
        ],
        30: [
            function (require, module, exports) {
                // not "use strict" so we can declare global "Promise"
                var asap = require('asap');
                if (typeof Promise === 'undefined') {
                    Promise = require('./lib/core.js');
                    require('./lib/es6-extensions.js');
                }
                require('./polyfill-done.js');
            },
            {
                './lib/core.js': 27,
                './lib/es6-extensions.js': 28,
                './polyfill-done.js': 29,
                'asap': 2
            }
        ],
        31: [
            function (require, module, exports) {
                (function (global) {
                    /*! https://mths.be/punycode v1.4.1 by @mathias */
                    ;
                    (function (root) {
                        /** Detect free variables */
                        var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
                        var freeModule = typeof module == 'object' && module && !module.nodeType && module;
                        var freeGlobal = typeof global == 'object' && global;
                        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
                            root = freeGlobal;
                        }
                        /**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
                        var punycode,
                            /** Highest positive signed 32-bit float value */
                            maxInt = 2147483647,
                            // aka. 0x7FFFFFFF or 2^31-1
                            /** Bootstring parameters */
                            base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128,
                            // 0x80
                            delimiter = '-',
                            // '\x2D'
                            /** Regular expressions */
                            regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/,
                            // unprintable ASCII chars + non-ASCII chars
                            regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
                            // RFC 3490 separators
                            /** Error messages */
                            errors = {
                                'overflow': 'Overflow: input needs wider integers to process',
                                'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
                                'invalid-input': 'Invalid input'
                            },
                            /** Convenience shortcuts */
                            baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode,
                            /** Temporary variable */
                            key;
                        /*--------------------------------------------------------------------------*/
                        /**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
                        function error(type) {
                            throw new RangeError(errors[type]);
                        }
                        /**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
                        function map(array, fn) {
                            var length = array.length;
                            var result = [];
                            while (length--) {
                                result[length] = fn(array[length]);
                            }
                            return result;
                        }
                        /**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
                        function mapDomain(string, fn) {
                            var parts = string.split('@');
                            var result = '';
                            if (parts.length > 1) {
                                // In email addresses, only the domain name should be punycoded. Leave
                                // the local part (i.e. everything up to `@`) intact.
                                result = parts[0] + '@';
                                string = parts[1];
                            }
                            // Avoid `split(regex)` for IE8 compatibility. See #17.
                            string = string.replace(regexSeparators, '.');
                            var labels = string.split('.');
                            var encoded = map(labels, fn).join('.');
                            return result + encoded;
                        }
                        /**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
                        function ucs2decode(string) {
                            var output = [], counter = 0, length = string.length, value, extra;
                            while (counter < length) {
                                value = string.charCodeAt(counter++);
                                if (value >= 55296 && value <= 56319 && counter < length) {
                                    // high surrogate, and there is a next character
                                    extra = string.charCodeAt(counter++);
                                    if ((extra & 64512) == 56320) {
                                        // low surrogate
                                        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
                                    } else {
                                        // unmatched surrogate; only append this code unit, in case the next
                                        // code unit is the high surrogate of a surrogate pair
                                        output.push(value);
                                        counter--;
                                    }
                                } else {
                                    output.push(value);
                                }
                            }
                            return output;
                        }
                        /**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
                        function ucs2encode(array) {
                            return map(array, function (value) {
                                var output = '';
                                if (value > 65535) {
                                    value -= 65536;
                                    output += stringFromCharCode(value >>> 10 & 1023 | 55296);
                                    value = 56320 | value & 1023;
                                }
                                output += stringFromCharCode(value);
                                return output;
                            }).join('');
                        }
                        /**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
                        function basicToDigit(codePoint) {
                            if (codePoint - 48 < 10) {
                                return codePoint - 22;
                            }
                            if (codePoint - 65 < 26) {
                                return codePoint - 65;
                            }
                            if (codePoint - 97 < 26) {
                                return codePoint - 97;
                            }
                            return base;
                        }
                        /**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
                        function digitToBasic(digit, flag) {
                            //  0..25 map to ASCII a..z or A..Z
                            // 26..35 map to ASCII 0..9
                            return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
                        }
                        /**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
                        function adapt(delta, numPoints, firstTime) {
                            var k = 0;
                            delta = firstTime ? floor(delta / damp) : delta >> 1;
                            delta += floor(delta / numPoints);
                            for (; delta > baseMinusTMin * tMax >> 1; k += base) {
                                delta = floor(delta / baseMinusTMin);
                            }
                            return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
                        }
                        /**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
                        function decode(input) {
                            // Don't use UCS-2
                            var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t,
                                /** Cached calculation results */
                                baseMinusT;
                            // Handle the basic code points: let `basic` be the number of input code
                            // points before the last delimiter, or `0` if there is none, then copy
                            // the first basic code points to the output.
                            basic = input.lastIndexOf(delimiter);
                            if (basic < 0) {
                                basic = 0;
                            }
                            for (j = 0; j < basic; ++j) {
                                // if it's not a basic code point
                                if (input.charCodeAt(j) >= 128) {
                                    error('not-basic');
                                }
                                output.push(input.charCodeAt(j));
                            }
                            // Main decoding loop: start just after the last delimiter if any basic code
                            // points were copied; start at the beginning otherwise.
                            for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
                                // `index` is the index of the next character to be consumed.
                                // Decode a generalized variable-length integer into `delta`,
                                // which gets added to `i`. The overflow checking is easier
                                // if we increase `i` as we go, then subtract off its starting
                                // value at the end to obtain `delta`.
                                for (oldi = i, w = 1, k = base;; k += base) {
                                    if (index >= inputLength) {
                                        error('invalid-input');
                                    }
                                    digit = basicToDigit(input.charCodeAt(index++));
                                    if (digit >= base || digit > floor((maxInt - i) / w)) {
                                        error('overflow');
                                    }
                                    i += digit * w;
                                    t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                                    if (digit < t) {
                                        break;
                                    }
                                    baseMinusT = base - t;
                                    if (w > floor(maxInt / baseMinusT)) {
                                        error('overflow');
                                    }
                                    w *= baseMinusT;
                                }
                                out = output.length + 1;
                                bias = adapt(i - oldi, out, oldi == 0);
                                // `i` was supposed to wrap around from `out` to `0`,
                                // incrementing `n` each time, so we'll fix that now:
                                if (floor(i / out) > maxInt - n) {
                                    error('overflow');
                                }
                                n += floor(i / out);
                                i %= out;
                                // Insert `n` at position `i` of the output
                                output.splice(i++, 0, n);
                            }
                            return ucs2encode(output);
                        }
                        /**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
                        function encode(input) {
                            var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [],
                                /** `inputLength` will hold the number of code points in `input`. */
                                inputLength,
                                /** Cached calculation results */
                                handledCPCountPlusOne, baseMinusT, qMinusT;
                            // Convert the input in UCS-2 to Unicode
                            input = ucs2decode(input);
                            // Cache the length
                            inputLength = input.length;
                            // Initialize the state
                            n = initialN;
                            delta = 0;
                            bias = initialBias;
                            // Handle the basic code points
                            for (j = 0; j < inputLength; ++j) {
                                currentValue = input[j];
                                if (currentValue < 128) {
                                    output.push(stringFromCharCode(currentValue));
                                }
                            }
                            handledCPCount = basicLength = output.length;
                            // `handledCPCount` is the number of code points that have been handled;
                            // `basicLength` is the number of basic code points.
                            // Finish the basic string - if it is not empty - with a delimiter
                            if (basicLength) {
                                output.push(delimiter);
                            }
                            // Main encoding loop:
                            while (handledCPCount < inputLength) {
                                // All non-basic code points < n have been handled already. Find the next
                                // larger one:
                                for (m = maxInt, j = 0; j < inputLength; ++j) {
                                    currentValue = input[j];
                                    if (currentValue >= n && currentValue < m) {
                                        m = currentValue;
                                    }
                                }
                                // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                                // but guard against overflow
                                handledCPCountPlusOne = handledCPCount + 1;
                                if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                                    error('overflow');
                                }
                                delta += (m - n) * handledCPCountPlusOne;
                                n = m;
                                for (j = 0; j < inputLength; ++j) {
                                    currentValue = input[j];
                                    if (currentValue < n && ++delta > maxInt) {
                                        error('overflow');
                                    }
                                    if (currentValue == n) {
                                        // Represent delta as a generalized variable-length integer
                                        for (q = delta, k = base;; k += base) {
                                            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                                            if (q < t) {
                                                break;
                                            }
                                            qMinusT = q - t;
                                            baseMinusT = base - t;
                                            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                                            q = floor(qMinusT / baseMinusT);
                                        }
                                        output.push(stringFromCharCode(digitToBasic(q, 0)));
                                        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                                        delta = 0;
                                        ++handledCPCount;
                                    }
                                }
                                ++delta;
                                ++n;
                            }
                            return output.join('');
                        }
                        /**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
                        function toUnicode(input) {
                            return mapDomain(input, function (string) {
                                return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
                            });
                        }
                        /**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
                        function toASCII(input) {
                            return mapDomain(input, function (string) {
                                return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
                            });
                        }
                        /*--------------------------------------------------------------------------*/
                        /** Define the public API */
                        punycode = {
                            /**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
                            'version': '1.4.1',
                            /**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
                            'ucs2': {
                                'decode': ucs2decode,
                                'encode': ucs2encode
                            },
                            'decode': decode,
                            'encode': encode,
                            'toASCII': toASCII,
                            'toUnicode': toUnicode
                        };
                        /** Expose `punycode` */
                        // Some AMD build optimizers, like r.js, check for specific condition patterns
                        // like the following:
                        if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
                            define('punycode', function () {
                                return punycode;
                            });
                        } else if (freeExports && freeModule) {
                            if (module.exports == freeExports) {
                                // in Node.js, io.js, or RingoJS v0.8.0+
                                freeModule.exports = punycode;
                            } else {
                                // in Narwhal or RingoJS v0.7.0-
                                for (key in punycode) {
                                    punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
                                }
                            }
                        } else {
                            // in Rhino or a web browser
                            root.punycode = punycode;
                        }
                    }(this));
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {}
        ],
        32: [
            function (require, module, exports) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                'use strict';
                // If obj.hasOwnProperty has been overridden, then calling
                // obj.hasOwnProperty(prop) will break.
                // See: https://github.com/joyent/node/issues/1707
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }
                module.exports = function (qs, sep, eq, options) {
                    sep = sep || '&';
                    eq = eq || '=';
                    var obj = {};
                    if (typeof qs !== 'string' || qs.length === 0) {
                        return obj;
                    }
                    var regexp = /\+/g;
                    qs = qs.split(sep);
                    var maxKeys = 1000;
                    if (options && typeof options.maxKeys === 'number') {
                        maxKeys = options.maxKeys;
                    }
                    var len = qs.length;
                    // maxKeys <= 0 means that we should not limit keys count
                    if (maxKeys > 0 && len > maxKeys) {
                        len = maxKeys;
                    }
                    for (var i = 0; i < len; ++i) {
                        var x = qs[i].replace(regexp, '%20'), idx = x.indexOf(eq), kstr, vstr, k, v;
                        if (idx >= 0) {
                            kstr = x.substr(0, idx);
                            vstr = x.substr(idx + 1);
                        } else {
                            kstr = x;
                            vstr = '';
                        }
                        k = decodeURIComponent(kstr);
                        v = decodeURIComponent(vstr);
                        if (!hasOwnProperty(obj, k)) {
                            obj[k] = v;
                        } else if (isArray(obj[k])) {
                            obj[k].push(v);
                        } else {
                            obj[k] = [
                                obj[k],
                                v
                            ];
                        }
                    }
                    return obj;
                };
                var isArray = Array.isArray || function (xs) {
                    return Object.prototype.toString.call(xs) === '[object Array]';
                };
            },
            {}
        ],
        33: [
            function (require, module, exports) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                'use strict';
                var stringifyPrimitive = function (v) {
                    switch (typeof v) {
                    case 'string':
                        return v;
                    case 'boolean':
                        return v ? 'true' : 'false';
                    case 'number':
                        return isFinite(v) ? v : '';
                    default:
                        return '';
                    }
                };
                module.exports = function (obj, sep, eq, name) {
                    sep = sep || '&';
                    eq = eq || '=';
                    if (obj === null) {
                        obj = undefined;
                    }
                    if (typeof obj === 'object') {
                        return map(objectKeys(obj), function (k) {
                            var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                            if (isArray(obj[k])) {
                                return map(obj[k], function (v) {
                                    return ks + encodeURIComponent(stringifyPrimitive(v));
                                }).join(sep);
                            } else {
                                return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                            }
                        }).join(sep);
                    }
                    if (!name)
                        return '';
                    return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
                };
                var isArray = Array.isArray || function (xs) {
                    return Object.prototype.toString.call(xs) === '[object Array]';
                };
                function map(xs, f) {
                    if (xs.map)
                        return xs.map(f);
                    var res = [];
                    for (var i = 0; i < xs.length; i++) {
                        res.push(f(xs[i], i));
                    }
                    return res;
                }
                var objectKeys = Object.keys || function (obj) {
                    var res = [];
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key))
                            res.push(key);
                    }
                    return res;
                };
            },
            {}
        ],
        34: [
            function (require, module, exports) {
                'use strict';
                exports.decode = exports.parse = require('./decode');
                exports.encode = exports.stringify = require('./encode');
            },
            {
                './decode': 32,
                './encode': 33
            }
        ],
        35: [
            function (require, module, exports) {
                module.exports = require('./lib/_stream_duplex.js');
            },
            { './lib/_stream_duplex.js': 36 }
        ],
        36: [
            function (require, module, exports) {
                // a duplex stream is just a stream that is both readable and writable.
                // Since JS doesn't have multiple prototypal inheritance, this class
                // prototypally inherits from Readable, and then parasitically from
                // Writable.
                'use strict';
                /*<replacement>*/
                var objectKeys = Object.keys || function (obj) {
                    var keys = [];
                    for (var key in obj) {
                        keys.push(key);
                    }
                    return keys;
                };
                /*</replacement>*/
                module.exports = Duplex;
                /*<replacement>*/
                var processNextTick = require('process-nextick-args');
                /*</replacement>*/
                /*<replacement>*/
                var util = require('core-util-is');
                util.inherits = require('inherits');
                /*</replacement>*/
                var Readable = require('./_stream_readable');
                var Writable = require('./_stream_writable');
                util.inherits(Duplex, Readable);
                var keys = objectKeys(Writable.prototype);
                for (var v = 0; v < keys.length; v++) {
                    var method = keys[v];
                    if (!Duplex.prototype[method])
                        Duplex.prototype[method] = Writable.prototype[method];
                }
                function Duplex(options) {
                    if (!(this instanceof Duplex))
                        return new Duplex(options);
                    Readable.call(this, options);
                    Writable.call(this, options);
                    if (options && options.readable === false)
                        this.readable = false;
                    if (options && options.writable === false)
                        this.writable = false;
                    this.allowHalfOpen = true;
                    if (options && options.allowHalfOpen === false)
                        this.allowHalfOpen = false;
                    this.once('end', onend);
                }
                // the no-half-open enforcer
                function onend() {
                    // if we allow half-open state, or if the writable side ended,
                    // then we're ok.
                    if (this.allowHalfOpen || this._writableState.ended)
                        return;
                    // no more data can be written.
                    // But allow more writes to happen in this tick.
                    processNextTick(onEndNT, this);
                }
                function onEndNT(self) {
                    self.end();
                }
                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i);
                    }
                }
            },
            {
                './_stream_readable': 38,
                './_stream_writable': 40,
                'core-util-is': 12,
                'inherits': 18,
                'process-nextick-args': 25
            }
        ],
        37: [
            function (require, module, exports) {
                // a passthrough stream.
                // basically just the most minimal sort of Transform stream.
                // Every written chunk gets output as-is.
                'use strict';
                module.exports = PassThrough;
                var Transform = require('./_stream_transform');
                /*<replacement>*/
                var util = require('core-util-is');
                util.inherits = require('inherits');
                /*</replacement>*/
                util.inherits(PassThrough, Transform);
                function PassThrough(options) {
                    if (!(this instanceof PassThrough))
                        return new PassThrough(options);
                    Transform.call(this, options);
                }
                PassThrough.prototype._transform = function (chunk, encoding, cb) {
                    cb(null, chunk);
                };
            },
            {
                './_stream_transform': 39,
                'core-util-is': 12,
                'inherits': 18
            }
        ],
        38: [
            function (require, module, exports) {
                (function (process) {
                    'use strict';
                    module.exports = Readable;
                    /*<replacement>*/
                    var processNextTick = require('process-nextick-args');
                    /*</replacement>*/
                    /*<replacement>*/
                    var isArray = require('isarray');
                    /*</replacement>*/
                    Readable.ReadableState = ReadableState;
                    /*<replacement>*/
                    var EE = require('events').EventEmitter;
                    var EElistenerCount = function (emitter, type) {
                        return emitter.listeners(type).length;
                    };
                    /*</replacement>*/
                    /*<replacement>*/
                    var Stream;
                    (function () {
                        try {
                            Stream = require('st' + 'ream');
                        } catch (_) {
                        } finally {
                            if (!Stream)
                                Stream = require('events').EventEmitter;
                        }
                    }());
                    /*</replacement>*/
                    var Buffer = require('buffer').Buffer;
                    /*<replacement>*/
                    var bufferShim = require('buffer-shims');
                    /*</replacement>*/
                    /*<replacement>*/
                    var util = require('core-util-is');
                    util.inherits = require('inherits');
                    /*</replacement>*/
                    /*<replacement>*/
                    var debugUtil = require('util');
                    var debug = void 0;
                    if (debugUtil && debugUtil.debuglog) {
                        debug = debugUtil.debuglog('stream');
                    } else {
                        debug = function () {
                        };
                    }
                    /*</replacement>*/
                    var BufferList = require('./internal/streams/BufferList');
                    var StringDecoder;
                    util.inherits(Readable, Stream);
                    function prependListener(emitter, event, fn) {
                        if (typeof emitter.prependListener === 'function') {
                            return emitter.prependListener(event, fn);
                        } else {
                            // This is a hack to make sure that our error handler is attached before any
                            // userland ones.  NEVER DO THIS. This is here only because this code needs
                            // to continue to work with older versions of Node.js that do not include
                            // the prependListener() method. The goal is to eventually remove this hack.
                            if (!emitter._events || !emitter._events[event])
                                emitter.on(event, fn);
                            else if (isArray(emitter._events[event]))
                                emitter._events[event].unshift(fn);
                            else
                                emitter._events[event] = [
                                    fn,
                                    emitter._events[event]
                                ];
                        }
                    }
                    var Duplex;
                    function ReadableState(options, stream) {
                        Duplex = Duplex || require('./_stream_duplex');
                        options = options || {};
                        // object stream flag. Used to make read(n) ignore n and to
                        // make all the buffer merging and length checks go away
                        this.objectMode = !!options.objectMode;
                        if (stream instanceof Duplex)
                            this.objectMode = this.objectMode || !!options.readableObjectMode;
                        // the point at which it stops calling _read() to fill the buffer
                        // Note: 0 is a valid value, means "don't call _read preemptively ever"
                        var hwm = options.highWaterMark;
                        var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                        this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                        // cast to ints.
                        this.highWaterMark = ~~this.highWaterMark;
                        // A linked list is used to store data chunks instead of an array because the
                        // linked list can remove elements from the beginning faster than
                        // array.shift()
                        this.buffer = new BufferList();
                        this.length = 0;
                        this.pipes = null;
                        this.pipesCount = 0;
                        this.flowing = null;
                        this.ended = false;
                        this.endEmitted = false;
                        this.reading = false;
                        // a flag to be able to tell if the onwrite cb is called immediately,
                        // or on a later tick.  We set this to true at first, because any
                        // actions that shouldn't happen until "later" should generally also
                        // not happen before the first write call.
                        this.sync = true;
                        // whenever we return null, then we set a flag to say
                        // that we're awaiting a 'readable' event emission.
                        this.needReadable = false;
                        this.emittedReadable = false;
                        this.readableListening = false;
                        this.resumeScheduled = false;
                        // Crypto is kind of old and crusty.  Historically, its default string
                        // encoding is 'binary' so we have to make this configurable.
                        // Everything else in the universe uses 'utf8', though.
                        this.defaultEncoding = options.defaultEncoding || 'utf8';
                        // when piping, we only care about 'readable' events that happen
                        // after read()ing all the bytes and not getting any pushback.
                        this.ranOut = false;
                        // the number of writers that are awaiting a drain event in .pipe()s
                        this.awaitDrain = 0;
                        // if true, a maybeReadMore has been scheduled
                        this.readingMore = false;
                        this.decoder = null;
                        this.encoding = null;
                        if (options.encoding) {
                            if (!StringDecoder)
                                StringDecoder = require('string_decoder/').StringDecoder;
                            this.decoder = new StringDecoder(options.encoding);
                            this.encoding = options.encoding;
                        }
                    }
                    var Duplex;
                    function Readable(options) {
                        Duplex = Duplex || require('./_stream_duplex');
                        if (!(this instanceof Readable))
                            return new Readable(options);
                        this._readableState = new ReadableState(options, this);
                        // legacy
                        this.readable = true;
                        if (options && typeof options.read === 'function')
                            this._read = options.read;
                        Stream.call(this);
                    }
                    // Manually shove something into the read() buffer.
                    // This returns true if the highWaterMark has not been hit yet,
                    // similar to how Writable.write() returns true if you should
                    // write() some more.
                    Readable.prototype.push = function (chunk, encoding) {
                        var state = this._readableState;
                        if (!state.objectMode && typeof chunk === 'string') {
                            encoding = encoding || state.defaultEncoding;
                            if (encoding !== state.encoding) {
                                chunk = bufferShim.from(chunk, encoding);
                                encoding = '';
                            }
                        }
                        return readableAddChunk(this, state, chunk, encoding, false);
                    };
                    // Unshift should *always* be something directly out of read()
                    Readable.prototype.unshift = function (chunk) {
                        var state = this._readableState;
                        return readableAddChunk(this, state, chunk, '', true);
                    };
                    Readable.prototype.isPaused = function () {
                        return this._readableState.flowing === false;
                    };
                    function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                        var er = chunkInvalid(state, chunk);
                        if (er) {
                            stream.emit('error', er);
                        } else if (chunk === null) {
                            state.reading = false;
                            onEofChunk(stream, state);
                        } else if (state.objectMode || chunk && chunk.length > 0) {
                            if (state.ended && !addToFront) {
                                var e = new Error('stream.push() after EOF');
                                stream.emit('error', e);
                            } else if (state.endEmitted && addToFront) {
                                var _e = new Error('stream.unshift() after end event');
                                stream.emit('error', _e);
                            } else {
                                var skipAdd;
                                if (state.decoder && !addToFront && !encoding) {
                                    chunk = state.decoder.write(chunk);
                                    skipAdd = !state.objectMode && chunk.length === 0;
                                }
                                if (!addToFront)
                                    state.reading = false;
                                // Don't add to the buffer if we've decoded to an empty string chunk and
                                // we're not in object mode
                                if (!skipAdd) {
                                    // if we want the data now, just emit it.
                                    if (state.flowing && state.length === 0 && !state.sync) {
                                        stream.emit('data', chunk);
                                        stream.read(0);
                                    } else {
                                        // update the buffer info.
                                        state.length += state.objectMode ? 1 : chunk.length;
                                        if (addToFront)
                                            state.buffer.unshift(chunk);
                                        else
                                            state.buffer.push(chunk);
                                        if (state.needReadable)
                                            emitReadable(stream);
                                    }
                                }
                                maybeReadMore(stream, state);
                            }
                        } else if (!addToFront) {
                            state.reading = false;
                        }
                        return needMoreData(state);
                    }
                    // if it's past the high water mark, we can push in some more.
                    // Also, if we have no data yet, we can stand some
                    // more bytes.  This is to work around cases where hwm=0,
                    // such as the repl.  Also, if the push() triggered a
                    // readable event, and the user called read(largeNumber) such that
                    // needReadable was set, then we ought to push more, so that another
                    // 'readable' event will be triggered.
                    function needMoreData(state) {
                        return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
                    }
                    // backwards compatibility.
                    Readable.prototype.setEncoding = function (enc) {
                        if (!StringDecoder)
                            StringDecoder = require('string_decoder/').StringDecoder;
                        this._readableState.decoder = new StringDecoder(enc);
                        this._readableState.encoding = enc;
                        return this;
                    };
                    // Don't raise the hwm > 8MB
                    var MAX_HWM = 8388608;
                    function computeNewHighWaterMark(n) {
                        if (n >= MAX_HWM) {
                            n = MAX_HWM;
                        } else {
                            // Get the next highest power of 2 to prevent increasing hwm excessively in
                            // tiny amounts
                            n--;
                            n |= n >>> 1;
                            n |= n >>> 2;
                            n |= n >>> 4;
                            n |= n >>> 8;
                            n |= n >>> 16;
                            n++;
                        }
                        return n;
                    }
                    // This function is designed to be inlinable, so please take care when making
                    // changes to the function body.
                    function howMuchToRead(n, state) {
                        if (n <= 0 || state.length === 0 && state.ended)
                            return 0;
                        if (state.objectMode)
                            return 1;
                        if (n !== n) {
                            // Only flow one buffer at a time
                            if (state.flowing && state.length)
                                return state.buffer.head.data.length;
                            else
                                return state.length;
                        }
                        // If we're asking for more than the current hwm, then raise the hwm.
                        if (n > state.highWaterMark)
                            state.highWaterMark = computeNewHighWaterMark(n);
                        if (n <= state.length)
                            return n;
                        // Don't have enough
                        if (!state.ended) {
                            state.needReadable = true;
                            return 0;
                        }
                        return state.length;
                    }
                    // you can override either this method, or the async _read(n) below.
                    Readable.prototype.read = function (n) {
                        debug('read', n);
                        n = parseInt(n, 10);
                        var state = this._readableState;
                        var nOrig = n;
                        if (n !== 0)
                            state.emittedReadable = false;
                        // if we're doing read(0) to trigger a readable event, but we
                        // already have a bunch of data in the buffer, then just trigger
                        // the 'readable' event and move on.
                        if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
                            debug('read: emitReadable', state.length, state.ended);
                            if (state.length === 0 && state.ended)
                                endReadable(this);
                            else
                                emitReadable(this);
                            return null;
                        }
                        n = howMuchToRead(n, state);
                        // if we've ended, and we're now clear, then finish it up.
                        if (n === 0 && state.ended) {
                            if (state.length === 0)
                                endReadable(this);
                            return null;
                        }
                        // All the actual chunk generation logic needs to be
                        // *below* the call to _read.  The reason is that in certain
                        // synthetic stream cases, such as passthrough streams, _read
                        // may be a completely synchronous operation which may change
                        // the state of the read buffer, providing enough data when
                        // before there was *not* enough.
                        //
                        // So, the steps are:
                        // 1. Figure out what the state of things will be after we do
                        // a read from the buffer.
                        //
                        // 2. If that resulting state will trigger a _read, then call _read.
                        // Note that this may be asynchronous, or synchronous.  Yes, it is
                        // deeply ugly to write APIs this way, but that still doesn't mean
                        // that the Readable class should behave improperly, as streams are
                        // designed to be sync/async agnostic.
                        // Take note if the _read call is sync or async (ie, if the read call
                        // has returned yet), so that we know whether or not it's safe to emit
                        // 'readable' etc.
                        //
                        // 3. Actually pull the requested chunks out of the buffer and return.
                        // if we need a readable event, then we need to do some reading.
                        var doRead = state.needReadable;
                        debug('need readable', doRead);
                        // if we currently have less than the highWaterMark, then also read some
                        if (state.length === 0 || state.length - n < state.highWaterMark) {
                            doRead = true;
                            debug('length less than watermark', doRead);
                        }
                        // however, if we've ended, then there's no point, and if we're already
                        // reading, then it's unnecessary.
                        if (state.ended || state.reading) {
                            doRead = false;
                            debug('reading or ended', doRead);
                        } else if (doRead) {
                            debug('do read');
                            state.reading = true;
                            state.sync = true;
                            // if the length is currently zero, then we *need* a readable event.
                            if (state.length === 0)
                                state.needReadable = true;
                            // call internal read method
                            this._read(state.highWaterMark);
                            state.sync = false;
                            // If _read pushed data synchronously, then `reading` will be false,
                            // and we need to re-evaluate how much data we can return to the user.
                            if (!state.reading)
                                n = howMuchToRead(nOrig, state);
                        }
                        var ret;
                        if (n > 0)
                            ret = fromList(n, state);
                        else
                            ret = null;
                        if (ret === null) {
                            state.needReadable = true;
                            n = 0;
                        } else {
                            state.length -= n;
                        }
                        if (state.length === 0) {
                            // If we have nothing in the buffer, then we want to know
                            // as soon as we *do* get something into the buffer.
                            if (!state.ended)
                                state.needReadable = true;
                            // If we tried to read() past the EOF, then emit end on the next tick.
                            if (nOrig !== n && state.ended)
                                endReadable(this);
                        }
                        if (ret !== null)
                            this.emit('data', ret);
                        return ret;
                    };
                    function chunkInvalid(state, chunk) {
                        var er = null;
                        if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
                            er = new TypeError('Invalid non-string/buffer chunk');
                        }
                        return er;
                    }
                    function onEofChunk(stream, state) {
                        if (state.ended)
                            return;
                        if (state.decoder) {
                            var chunk = state.decoder.end();
                            if (chunk && chunk.length) {
                                state.buffer.push(chunk);
                                state.length += state.objectMode ? 1 : chunk.length;
                            }
                        }
                        state.ended = true;
                        // emit 'readable' now to make sure it gets picked up.
                        emitReadable(stream);
                    }
                    // Don't emit readable right away in sync mode, because this can trigger
                    // another read() call => stack overflow.  This way, it might trigger
                    // a nextTick recursion warning, but that's not so bad.
                    function emitReadable(stream) {
                        var state = stream._readableState;
                        state.needReadable = false;
                        if (!state.emittedReadable) {
                            debug('emitReadable', state.flowing);
                            state.emittedReadable = true;
                            if (state.sync)
                                processNextTick(emitReadable_, stream);
                            else
                                emitReadable_(stream);
                        }
                    }
                    function emitReadable_(stream) {
                        debug('emit readable');
                        stream.emit('readable');
                        flow(stream);
                    }
                    // at this point, the user has presumably seen the 'readable' event,
                    // and called read() to consume some data.  that may have triggered
                    // in turn another _read(n) call, in which case reading = true if
                    // it's in progress.
                    // However, if we're not ended, or reading, and the length < hwm,
                    // then go ahead and try to read some more preemptively.
                    function maybeReadMore(stream, state) {
                        if (!state.readingMore) {
                            state.readingMore = true;
                            processNextTick(maybeReadMore_, stream, state);
                        }
                    }
                    function maybeReadMore_(stream, state) {
                        var len = state.length;
                        while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
                            debug('maybeReadMore read 0');
                            stream.read(0);
                            if (len === state.length)
                                // didn't get any data, stop spinning.
                                break;
                            else
                                len = state.length;
                        }
                        state.readingMore = false;
                    }
                    // abstract method.  to be overridden in specific implementation classes.
                    // call cb(er, data) where data is <= n in length.
                    // for virtual (non-string, non-buffer) streams, "length" is somewhat
                    // arbitrary, and perhaps not very meaningful.
                    Readable.prototype._read = function (n) {
                        this.emit('error', new Error('not implemented'));
                    };
                    Readable.prototype.pipe = function (dest, pipeOpts) {
                        var src = this;
                        var state = this._readableState;
                        switch (state.pipesCount) {
                        case 0:
                            state.pipes = dest;
                            break;
                        case 1:
                            state.pipes = [
                                state.pipes,
                                dest
                            ];
                            break;
                        default:
                            state.pipes.push(dest);
                            break;
                        }
                        state.pipesCount += 1;
                        debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
                        var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
                        var endFn = doEnd ? onend : cleanup;
                        if (state.endEmitted)
                            processNextTick(endFn);
                        else
                            src.once('end', endFn);
                        dest.on('unpipe', onunpipe);
                        function onunpipe(readable) {
                            debug('onunpipe');
                            if (readable === src) {
                                cleanup();
                            }
                        }
                        function onend() {
                            debug('onend');
                            dest.end();
                        }
                        // when the dest drains, it reduces the awaitDrain counter
                        // on the source.  This would be more elegant with a .once()
                        // handler in flow(), but adding and removing repeatedly is
                        // too slow.
                        var ondrain = pipeOnDrain(src);
                        dest.on('drain', ondrain);
                        var cleanedUp = false;
                        function cleanup() {
                            debug('cleanup');
                            // cleanup event handlers once the pipe is broken
                            dest.removeListener('close', onclose);
                            dest.removeListener('finish', onfinish);
                            dest.removeListener('drain', ondrain);
                            dest.removeListener('error', onerror);
                            dest.removeListener('unpipe', onunpipe);
                            src.removeListener('end', onend);
                            src.removeListener('end', cleanup);
                            src.removeListener('data', ondata);
                            cleanedUp = true;
                            // if the reader is waiting for a drain event from this
                            // specific writer, then it would cause it to never start
                            // flowing again.
                            // So, if this is awaiting a drain, then we just call it now.
                            // If we don't know, then assume that we are waiting for one.
                            if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
                                ondrain();
                        }
                        // If the user pushes more data while we're writing to dest then we'll end up
                        // in ondata again. However, we only want to increase awaitDrain once because
                        // dest will only emit one 'drain' event for the multiple writes.
                        // => Introduce a guard on increasing awaitDrain.
                        var increasedAwaitDrain = false;
                        src.on('data', ondata);
                        function ondata(chunk) {
                            debug('ondata');
                            increasedAwaitDrain = false;
                            var ret = dest.write(chunk);
                            if (false === ret && !increasedAwaitDrain) {
                                // If the user unpiped during `dest.write()`, it is possible
                                // to get stuck in a permanently paused state if that write
                                // also returned false.
                                // => Check whether `dest` is still a piping destination.
                                if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                                    debug('false write response, pause', src._readableState.awaitDrain);
                                    src._readableState.awaitDrain++;
                                    increasedAwaitDrain = true;
                                }
                                src.pause();
                            }
                        }
                        // if the dest has an error, then stop piping into it.
                        // however, don't suppress the throwing behavior for this.
                        function onerror(er) {
                            debug('onerror', er);
                            unpipe();
                            dest.removeListener('error', onerror);
                            if (EElistenerCount(dest, 'error') === 0)
                                dest.emit('error', er);
                        }
                        // Make sure our error handler is attached before userland ones.
                        prependListener(dest, 'error', onerror);
                        // Both close and finish should trigger unpipe, but only once.
                        function onclose() {
                            dest.removeListener('finish', onfinish);
                            unpipe();
                        }
                        dest.once('close', onclose);
                        function onfinish() {
                            debug('onfinish');
                            dest.removeListener('close', onclose);
                            unpipe();
                        }
                        dest.once('finish', onfinish);
                        function unpipe() {
                            debug('unpipe');
                            src.unpipe(dest);
                        }
                        // tell the dest that it's being piped to
                        dest.emit('pipe', src);
                        // start the flow if it hasn't been started already.
                        if (!state.flowing) {
                            debug('pipe resume');
                            src.resume();
                        }
                        return dest;
                    };
                    function pipeOnDrain(src) {
                        return function () {
                            var state = src._readableState;
                            debug('pipeOnDrain', state.awaitDrain);
                            if (state.awaitDrain)
                                state.awaitDrain--;
                            if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
                                state.flowing = true;
                                flow(src);
                            }
                        };
                    }
                    Readable.prototype.unpipe = function (dest) {
                        var state = this._readableState;
                        // if we're not piping anywhere, then do nothing.
                        if (state.pipesCount === 0)
                            return this;
                        // just one destination.  most common case.
                        if (state.pipesCount === 1) {
                            // passed in one, but it's not the right one.
                            if (dest && dest !== state.pipes)
                                return this;
                            if (!dest)
                                dest = state.pipes;
                            // got a match.
                            state.pipes = null;
                            state.pipesCount = 0;
                            state.flowing = false;
                            if (dest)
                                dest.emit('unpipe', this);
                            return this;
                        }
                        // slow case. multiple pipe destinations.
                        if (!dest) {
                            // remove all.
                            var dests = state.pipes;
                            var len = state.pipesCount;
                            state.pipes = null;
                            state.pipesCount = 0;
                            state.flowing = false;
                            for (var _i = 0; _i < len; _i++) {
                                dests[_i].emit('unpipe', this);
                            }
                            return this;
                        }
                        // try to find the right one.
                        var i = indexOf(state.pipes, dest);
                        if (i === -1)
                            return this;
                        state.pipes.splice(i, 1);
                        state.pipesCount -= 1;
                        if (state.pipesCount === 1)
                            state.pipes = state.pipes[0];
                        dest.emit('unpipe', this);
                        return this;
                    };
                    // set up data events if they are asked for
                    // Ensure readable listeners eventually get something
                    Readable.prototype.on = function (ev, fn) {
                        var res = Stream.prototype.on.call(this, ev, fn);
                        if (ev === 'data') {
                            // Start flowing on next tick if stream isn't explicitly paused
                            if (this._readableState.flowing !== false)
                                this.resume();
                        } else if (ev === 'readable') {
                            var state = this._readableState;
                            if (!state.endEmitted && !state.readableListening) {
                                state.readableListening = state.needReadable = true;
                                state.emittedReadable = false;
                                if (!state.reading) {
                                    processNextTick(nReadingNextTick, this);
                                } else if (state.length) {
                                    emitReadable(this, state);
                                }
                            }
                        }
                        return res;
                    };
                    Readable.prototype.addListener = Readable.prototype.on;
                    function nReadingNextTick(self) {
                        debug('readable nexttick read 0');
                        self.read(0);
                    }
                    // pause() and resume() are remnants of the legacy readable stream API
                    // If the user uses them, then switch into old mode.
                    Readable.prototype.resume = function () {
                        var state = this._readableState;
                        if (!state.flowing) {
                            debug('resume');
                            state.flowing = true;
                            resume(this, state);
                        }
                        return this;
                    };
                    function resume(stream, state) {
                        if (!state.resumeScheduled) {
                            state.resumeScheduled = true;
                            processNextTick(resume_, stream, state);
                        }
                    }
                    function resume_(stream, state) {
                        if (!state.reading) {
                            debug('resume read 0');
                            stream.read(0);
                        }
                        state.resumeScheduled = false;
                        state.awaitDrain = 0;
                        stream.emit('resume');
                        flow(stream);
                        if (state.flowing && !state.reading)
                            stream.read(0);
                    }
                    Readable.prototype.pause = function () {
                        debug('call pause flowing=%j', this._readableState.flowing);
                        if (false !== this._readableState.flowing) {
                            debug('pause');
                            this._readableState.flowing = false;
                            this.emit('pause');
                        }
                        return this;
                    };
                    function flow(stream) {
                        var state = stream._readableState;
                        debug('flow', state.flowing);
                        while (state.flowing && stream.read() !== null) {
                        }
                    }
                    // wrap an old-style stream as the async data source.
                    // This is *not* part of the readable stream interface.
                    // It is an ugly unfortunate mess of history.
                    Readable.prototype.wrap = function (stream) {
                        var state = this._readableState;
                        var paused = false;
                        var self = this;
                        stream.on('end', function () {
                            debug('wrapped end');
                            if (state.decoder && !state.ended) {
                                var chunk = state.decoder.end();
                                if (chunk && chunk.length)
                                    self.push(chunk);
                            }
                            self.push(null);
                        });
                        stream.on('data', function (chunk) {
                            debug('wrapped data');
                            if (state.decoder)
                                chunk = state.decoder.write(chunk);
                            // don't skip over falsy values in objectMode
                            if (state.objectMode && (chunk === null || chunk === undefined))
                                return;
                            else if (!state.objectMode && (!chunk || !chunk.length))
                                return;
                            var ret = self.push(chunk);
                            if (!ret) {
                                paused = true;
                                stream.pause();
                            }
                        });
                        // proxy all the other methods.
                        // important when wrapping filters and duplexes.
                        for (var i in stream) {
                            if (this[i] === undefined && typeof stream[i] === 'function') {
                                this[i] = function (method) {
                                    return function () {
                                        return stream[method].apply(stream, arguments);
                                    };
                                }(i);
                            }
                        }
                        // proxy certain important events.
                        var events = [
                            'error',
                            'close',
                            'destroy',
                            'pause',
                            'resume'
                        ];
                        forEach(events, function (ev) {
                            stream.on(ev, self.emit.bind(self, ev));
                        });
                        // when we try to consume some more bytes, simply unpause the
                        // underlying stream.
                        self._read = function (n) {
                            debug('wrapped _read', n);
                            if (paused) {
                                paused = false;
                                stream.resume();
                            }
                        };
                        return self;
                    };
                    // exposed for testing purposes only.
                    Readable._fromList = fromList;
                    // Pluck off n bytes from an array of buffers.
                    // Length is the combined lengths of all the buffers in the list.
                    // This function is designed to be inlinable, so please take care when making
                    // changes to the function body.
                    function fromList(n, state) {
                        // nothing buffered
                        if (state.length === 0)
                            return null;
                        var ret;
                        if (state.objectMode)
                            ret = state.buffer.shift();
                        else if (!n || n >= state.length) {
                            // read it all, truncate the list
                            if (state.decoder)
                                ret = state.buffer.join('');
                            else if (state.buffer.length === 1)
                                ret = state.buffer.head.data;
                            else
                                ret = state.buffer.concat(state.length);
                            state.buffer.clear();
                        } else {
                            // read part of list
                            ret = fromListPartial(n, state.buffer, state.decoder);
                        }
                        return ret;
                    }
                    // Extracts only enough buffered data to satisfy the amount requested.
                    // This function is designed to be inlinable, so please take care when making
                    // changes to the function body.
                    function fromListPartial(n, list, hasStrings) {
                        var ret;
                        if (n < list.head.data.length) {
                            // slice is the same for buffers and strings
                            ret = list.head.data.slice(0, n);
                            list.head.data = list.head.data.slice(n);
                        } else if (n === list.head.data.length) {
                            // first chunk is a perfect match
                            ret = list.shift();
                        } else {
                            // result spans more than one buffer
                            ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
                        }
                        return ret;
                    }
                    // Copies a specified amount of characters from the list of buffered data
                    // chunks.
                    // This function is designed to be inlinable, so please take care when making
                    // changes to the function body.
                    function copyFromBufferString(n, list) {
                        var p = list.head;
                        var c = 1;
                        var ret = p.data;
                        n -= ret.length;
                        while (p = p.next) {
                            var str = p.data;
                            var nb = n > str.length ? str.length : n;
                            if (nb === str.length)
                                ret += str;
                            else
                                ret += str.slice(0, n);
                            n -= nb;
                            if (n === 0) {
                                if (nb === str.length) {
                                    ++c;
                                    if (p.next)
                                        list.head = p.next;
                                    else
                                        list.head = list.tail = null;
                                } else {
                                    list.head = p;
                                    p.data = str.slice(nb);
                                }
                                break;
                            }
                            ++c;
                        }
                        list.length -= c;
                        return ret;
                    }
                    // Copies a specified amount of bytes from the list of buffered data chunks.
                    // This function is designed to be inlinable, so please take care when making
                    // changes to the function body.
                    function copyFromBuffer(n, list) {
                        var ret = bufferShim.allocUnsafe(n);
                        var p = list.head;
                        var c = 1;
                        p.data.copy(ret);
                        n -= p.data.length;
                        while (p = p.next) {
                            var buf = p.data;
                            var nb = n > buf.length ? buf.length : n;
                            buf.copy(ret, ret.length - n, 0, nb);
                            n -= nb;
                            if (n === 0) {
                                if (nb === buf.length) {
                                    ++c;
                                    if (p.next)
                                        list.head = p.next;
                                    else
                                        list.head = list.tail = null;
                                } else {
                                    list.head = p;
                                    p.data = buf.slice(nb);
                                }
                                break;
                            }
                            ++c;
                        }
                        list.length -= c;
                        return ret;
                    }
                    function endReadable(stream) {
                        var state = stream._readableState;
                        // If we get here before consuming all the bytes, then that is a
                        // bug in node.  Should never happen.
                        if (state.length > 0)
                            throw new Error('"endReadable()" called on non-empty stream');
                        if (!state.endEmitted) {
                            state.ended = true;
                            processNextTick(endReadableNT, state, stream);
                        }
                    }
                    function endReadableNT(state, stream) {
                        // Check that we didn't get one last unshift.
                        if (!state.endEmitted && state.length === 0) {
                            state.endEmitted = true;
                            stream.readable = false;
                            stream.emit('end');
                        }
                    }
                    function forEach(xs, f) {
                        for (var i = 0, l = xs.length; i < l; i++) {
                            f(xs[i], i);
                        }
                    }
                    function indexOf(xs, x) {
                        for (var i = 0, l = xs.length; i < l; i++) {
                            if (xs[i] === x)
                                return i;
                        }
                        return -1;
                    }
                }.call(this, require('_process')));
            },
            {
                './_stream_duplex': 36,
                './internal/streams/BufferList': 41,
                '_process': 26,
                'buffer': 9,
                'buffer-shims': 8,
                'core-util-is': 12,
                'events': 14,
                'inherits': 18,
                'isarray': 20,
                'process-nextick-args': 25,
                'string_decoder/': 51,
                'util': 6
            }
        ],
        39: [
            function (require, module, exports) {
                // a transform stream is a readable/writable stream where you do
                // something with the data.  Sometimes it's called a "filter",
                // but that's not a great name for it, since that implies a thing where
                // some bits pass through, and others are simply ignored.  (That would
                // be a valid example of a transform, of course.)
                //
                // While the output is causally related to the input, it's not a
                // necessarily symmetric or synchronous transformation.  For example,
                // a zlib stream might take multiple plain-text writes(), and then
                // emit a single compressed chunk some time in the future.
                //
                // Here's how this works:
                //
                // The Transform stream has all the aspects of the readable and writable
                // stream classes.  When you write(chunk), that calls _write(chunk,cb)
                // internally, and returns false if there's a lot of pending writes
                // buffered up.  When you call read(), that calls _read(n) until
                // there's enough pending readable data buffered up.
                //
                // In a transform stream, the written data is placed in a buffer.  When
                // _read(n) is called, it transforms the queued up data, calling the
                // buffered _write cb's as it consumes chunks.  If consuming a single
                // written chunk would result in multiple output chunks, then the first
                // outputted bit calls the readcb, and subsequent chunks just go into
                // the read buffer, and will cause it to emit 'readable' if necessary.
                //
                // This way, back-pressure is actually determined by the reading side,
                // since _read has to be called to start processing a new chunk.  However,
                // a pathological inflate type of transform can cause excessive buffering
                // here.  For example, imagine a stream where every byte of input is
                // interpreted as an integer from 0-255, and then results in that many
                // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
                // 1kb of data being output.  In this case, you could write a very small
                // amount of input, and end up with a very large amount of output.  In
                // such a pathological inflating mechanism, there'd be no way to tell
                // the system to stop doing the transform.  A single 4MB write could
                // cause the system to run out of memory.
                //
                // However, even in such a pathological case, only a single written chunk
                // would be consumed, and then the rest would wait (un-transformed) until
                // the results of the previous transformed chunk were consumed.
                'use strict';
                module.exports = Transform;
                var Duplex = require('./_stream_duplex');
                /*<replacement>*/
                var util = require('core-util-is');
                util.inherits = require('inherits');
                /*</replacement>*/
                util.inherits(Transform, Duplex);
                function TransformState(stream) {
                    this.afterTransform = function (er, data) {
                        return afterTransform(stream, er, data);
                    };
                    this.needTransform = false;
                    this.transforming = false;
                    this.writecb = null;
                    this.writechunk = null;
                    this.writeencoding = null;
                }
                function afterTransform(stream, er, data) {
                    var ts = stream._transformState;
                    ts.transforming = false;
                    var cb = ts.writecb;
                    if (!cb)
                        return stream.emit('error', new Error('no writecb in Transform class'));
                    ts.writechunk = null;
                    ts.writecb = null;
                    if (data !== null && data !== undefined)
                        stream.push(data);
                    cb(er);
                    var rs = stream._readableState;
                    rs.reading = false;
                    if (rs.needReadable || rs.length < rs.highWaterMark) {
                        stream._read(rs.highWaterMark);
                    }
                }
                function Transform(options) {
                    if (!(this instanceof Transform))
                        return new Transform(options);
                    Duplex.call(this, options);
                    this._transformState = new TransformState(this);
                    // when the writable side finishes, then flush out anything remaining.
                    var stream = this;
                    // start out asking for a readable event once data is transformed.
                    this._readableState.needReadable = true;
                    // we have implemented the _read method, and done the other things
                    // that Readable wants before the first _read call, so unset the
                    // sync guard flag.
                    this._readableState.sync = false;
                    if (options) {
                        if (typeof options.transform === 'function')
                            this._transform = options.transform;
                        if (typeof options.flush === 'function')
                            this._flush = options.flush;
                    }
                    this.once('prefinish', function () {
                        if (typeof this._flush === 'function')
                            this._flush(function (er) {
                                done(stream, er);
                            });
                        else
                            done(stream);
                    });
                }
                Transform.prototype.push = function (chunk, encoding) {
                    this._transformState.needTransform = false;
                    return Duplex.prototype.push.call(this, chunk, encoding);
                };
                // This is the part where you do stuff!
                // override this function in implementation classes.
                // 'chunk' is an input chunk.
                //
                // Call `push(newChunk)` to pass along transformed output
                // to the readable side.  You may call 'push' zero or more times.
                //
                // Call `cb(err)` when you are done with this chunk.  If you pass
                // an error, then that'll put the hurt on the whole operation.  If you
                // never call cb(), then you'll never get another chunk.
                Transform.prototype._transform = function (chunk, encoding, cb) {
                    throw new Error('Not implemented');
                };
                Transform.prototype._write = function (chunk, encoding, cb) {
                    var ts = this._transformState;
                    ts.writecb = cb;
                    ts.writechunk = chunk;
                    ts.writeencoding = encoding;
                    if (!ts.transforming) {
                        var rs = this._readableState;
                        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
                            this._read(rs.highWaterMark);
                    }
                };
                // Doesn't matter what the args are here.
                // _transform does all the work.
                // That we got here means that the readable side wants more data.
                Transform.prototype._read = function (n) {
                    var ts = this._transformState;
                    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
                        ts.transforming = true;
                        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
                    } else {
                        // mark that we need a transform, so that any data that comes in
                        // will get processed, now that we've asked for it.
                        ts.needTransform = true;
                    }
                };
                function done(stream, er) {
                    if (er)
                        return stream.emit('error', er);
                    // if there's nothing in the write buffer, then that means
                    // that nothing more will ever be provided
                    var ws = stream._writableState;
                    var ts = stream._transformState;
                    if (ws.length)
                        throw new Error('Calling transform done when ws.length != 0');
                    if (ts.transforming)
                        throw new Error('Calling transform done when still transforming');
                    return stream.push(null);
                }
            },
            {
                './_stream_duplex': 36,
                'core-util-is': 12,
                'inherits': 18
            }
        ],
        40: [
            function (require, module, exports) {
                (function (process) {
                    // A bit simpler than readable streams.
                    // Implement an async ._write(chunk, encoding, cb), and it'll handle all
                    // the drain event emission and buffering.
                    'use strict';
                    module.exports = Writable;
                    /*<replacement>*/
                    var processNextTick = require('process-nextick-args');
                    /*</replacement>*/
                    /*<replacement>*/
                    var asyncWrite = !process.browser && [
                        'v0.10',
                        'v0.9.'
                    ].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
                    /*</replacement>*/
                    Writable.WritableState = WritableState;
                    /*<replacement>*/
                    var util = require('core-util-is');
                    util.inherits = require('inherits');
                    /*</replacement>*/
                    /*<replacement>*/
                    var internalUtil = { deprecate: require('util-deprecate') };
                    /*</replacement>*/
                    /*<replacement>*/
                    var Stream;
                    (function () {
                        try {
                            Stream = require('st' + 'ream');
                        } catch (_) {
                        } finally {
                            if (!Stream)
                                Stream = require('events').EventEmitter;
                        }
                    }());
                    /*</replacement>*/
                    var Buffer = require('buffer').Buffer;
                    /*<replacement>*/
                    var bufferShim = require('buffer-shims');
                    /*</replacement>*/
                    util.inherits(Writable, Stream);
                    function nop() {
                    }
                    function WriteReq(chunk, encoding, cb) {
                        this.chunk = chunk;
                        this.encoding = encoding;
                        this.callback = cb;
                        this.next = null;
                    }
                    var Duplex;
                    function WritableState(options, stream) {
                        Duplex = Duplex || require('./_stream_duplex');
                        options = options || {};
                        // object stream flag to indicate whether or not this stream
                        // contains buffers or objects.
                        this.objectMode = !!options.objectMode;
                        if (stream instanceof Duplex)
                            this.objectMode = this.objectMode || !!options.writableObjectMode;
                        // the point at which write() starts returning false
                        // Note: 0 is a valid value, means that we always return false if
                        // the entire buffer is not flushed immediately on write()
                        var hwm = options.highWaterMark;
                        var defaultHwm = this.objectMode ? 16 : 16 * 1024;
                        this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
                        // cast to ints.
                        this.highWaterMark = ~~this.highWaterMark;
                        this.needDrain = false;
                        // at the start of calling end()
                        this.ending = false;
                        // when end() has been called, and returned
                        this.ended = false;
                        // when 'finish' is emitted
                        this.finished = false;
                        // should we decode strings into buffers before passing to _write?
                        // this is here so that some node-core streams can optimize string
                        // handling at a lower level.
                        var noDecode = options.decodeStrings === false;
                        this.decodeStrings = !noDecode;
                        // Crypto is kind of old and crusty.  Historically, its default string
                        // encoding is 'binary' so we have to make this configurable.
                        // Everything else in the universe uses 'utf8', though.
                        this.defaultEncoding = options.defaultEncoding || 'utf8';
                        // not an actual buffer we keep track of, but a measurement
                        // of how much we're waiting to get pushed to some underlying
                        // socket or file.
                        this.length = 0;
                        // a flag to see when we're in the middle of a write.
                        this.writing = false;
                        // when true all writes will be buffered until .uncork() call
                        this.corked = 0;
                        // a flag to be able to tell if the onwrite cb is called immediately,
                        // or on a later tick.  We set this to true at first, because any
                        // actions that shouldn't happen until "later" should generally also
                        // not happen before the first write call.
                        this.sync = true;
                        // a flag to know if we're processing previously buffered items, which
                        // may call the _write() callback in the same tick, so that we don't
                        // end up in an overlapped onwrite situation.
                        this.bufferProcessing = false;
                        // the callback that's passed to _write(chunk,cb)
                        this.onwrite = function (er) {
                            onwrite(stream, er);
                        };
                        // the callback that the user supplies to write(chunk,encoding,cb)
                        this.writecb = null;
                        // the amount that is being written when _write is called.
                        this.writelen = 0;
                        this.bufferedRequest = null;
                        this.lastBufferedRequest = null;
                        // number of pending user-supplied write callbacks
                        // this must be 0 before 'finish' can be emitted
                        this.pendingcb = 0;
                        // emit prefinish if the only thing we're waiting for is _write cbs
                        // This is relevant for synchronous Transform streams
                        this.prefinished = false;
                        // True if the error was already emitted and should not be thrown again
                        this.errorEmitted = false;
                        // count buffered requests
                        this.bufferedRequestCount = 0;
                        // allocate the first CorkedRequest, there is always
                        // one allocated and free to use, and we maintain at most two
                        this.corkedRequestsFree = new CorkedRequest(this);
                    }
                    WritableState.prototype.getBuffer = function writableStateGetBuffer() {
                        var current = this.bufferedRequest;
                        var out = [];
                        while (current) {
                            out.push(current);
                            current = current.next;
                        }
                        return out;
                    };
                    (function () {
                        try {
                            Object.defineProperty(WritableState.prototype, 'buffer', {
                                get: internalUtil.deprecate(function () {
                                    return this.getBuffer();
                                }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
                            });
                        } catch (_) {
                        }
                    }());
                    var Duplex;
                    function Writable(options) {
                        Duplex = Duplex || require('./_stream_duplex');
                        // Writable ctor is applied to Duplexes, though they're not
                        // instanceof Writable, they're instanceof Readable.
                        if (!(this instanceof Writable) && !(this instanceof Duplex))
                            return new Writable(options);
                        this._writableState = new WritableState(options, this);
                        // legacy.
                        this.writable = true;
                        if (options) {
                            if (typeof options.write === 'function')
                                this._write = options.write;
                            if (typeof options.writev === 'function')
                                this._writev = options.writev;
                        }
                        Stream.call(this);
                    }
                    // Otherwise people can pipe Writable streams, which is just wrong.
                    Writable.prototype.pipe = function () {
                        this.emit('error', new Error('Cannot pipe, not readable'));
                    };
                    function writeAfterEnd(stream, cb) {
                        var er = new Error('write after end');
                        // TODO: defer error events consistently everywhere, not just the cb
                        stream.emit('error', er);
                        processNextTick(cb, er);
                    }
                    // If we get something that is not a buffer, string, null, or undefined,
                    // and we're not in objectMode, then that's an error.
                    // Otherwise stream chunks are all considered to be of length=1, and the
                    // watermarks determine how many objects to keep in the buffer, rather than
                    // how many bytes or characters.
                    function validChunk(stream, state, chunk, cb) {
                        var valid = true;
                        var er = false;
                        // Always throw error if a null is written
                        // if we are not in object mode then throw
                        // if it is not a buffer, string, or undefined.
                        if (chunk === null) {
                            er = new TypeError('May not write null values to stream');
                        } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
                            er = new TypeError('Invalid non-string/buffer chunk');
                        }
                        if (er) {
                            stream.emit('error', er);
                            processNextTick(cb, er);
                            valid = false;
                        }
                        return valid;
                    }
                    Writable.prototype.write = function (chunk, encoding, cb) {
                        var state = this._writableState;
                        var ret = false;
                        if (typeof encoding === 'function') {
                            cb = encoding;
                            encoding = null;
                        }
                        if (Buffer.isBuffer(chunk))
                            encoding = 'buffer';
                        else if (!encoding)
                            encoding = state.defaultEncoding;
                        if (typeof cb !== 'function')
                            cb = nop;
                        if (state.ended)
                            writeAfterEnd(this, cb);
                        else if (validChunk(this, state, chunk, cb)) {
                            state.pendingcb++;
                            ret = writeOrBuffer(this, state, chunk, encoding, cb);
                        }
                        return ret;
                    };
                    Writable.prototype.cork = function () {
                        var state = this._writableState;
                        state.corked++;
                    };
                    Writable.prototype.uncork = function () {
                        var state = this._writableState;
                        if (state.corked) {
                            state.corked--;
                            if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest)
                                clearBuffer(this, state);
                        }
                    };
                    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
                        // node::ParseEncoding() requires lower case.
                        if (typeof encoding === 'string')
                            encoding = encoding.toLowerCase();
                        if (!([
                                'hex',
                                'utf8',
                                'utf-8',
                                'ascii',
                                'binary',
                                'base64',
                                'ucs2',
                                'ucs-2',
                                'utf16le',
                                'utf-16le',
                                'raw'
                            ].indexOf((encoding + '').toLowerCase()) > -1))
                            throw new TypeError('Unknown encoding: ' + encoding);
                        this._writableState.defaultEncoding = encoding;
                        return this;
                    };
                    function decodeChunk(state, chunk, encoding) {
                        if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
                            chunk = bufferShim.from(chunk, encoding);
                        }
                        return chunk;
                    }
                    // if we're already writing something, then just put this
                    // in the queue, and wait our turn.  Otherwise, call _write
                    // If we return false, then we need a drain event, so set that flag.
                    function writeOrBuffer(stream, state, chunk, encoding, cb) {
                        chunk = decodeChunk(state, chunk, encoding);
                        if (Buffer.isBuffer(chunk))
                            encoding = 'buffer';
                        var len = state.objectMode ? 1 : chunk.length;
                        state.length += len;
                        var ret = state.length < state.highWaterMark;
                        // we must ensure that previous needDrain will not be reset to false.
                        if (!ret)
                            state.needDrain = true;
                        if (state.writing || state.corked) {
                            var last = state.lastBufferedRequest;
                            state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
                            if (last) {
                                last.next = state.lastBufferedRequest;
                            } else {
                                state.bufferedRequest = state.lastBufferedRequest;
                            }
                            state.bufferedRequestCount += 1;
                        } else {
                            doWrite(stream, state, false, len, chunk, encoding, cb);
                        }
                        return ret;
                    }
                    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
                        state.writelen = len;
                        state.writecb = cb;
                        state.writing = true;
                        state.sync = true;
                        if (writev)
                            stream._writev(chunk, state.onwrite);
                        else
                            stream._write(chunk, encoding, state.onwrite);
                        state.sync = false;
                    }
                    function onwriteError(stream, state, sync, er, cb) {
                        --state.pendingcb;
                        if (sync)
                            processNextTick(cb, er);
                        else
                            cb(er);
                        stream._writableState.errorEmitted = true;
                        stream.emit('error', er);
                    }
                    function onwriteStateUpdate(state) {
                        state.writing = false;
                        state.writecb = null;
                        state.length -= state.writelen;
                        state.writelen = 0;
                    }
                    function onwrite(stream, er) {
                        var state = stream._writableState;
                        var sync = state.sync;
                        var cb = state.writecb;
                        onwriteStateUpdate(state);
                        if (er)
                            onwriteError(stream, state, sync, er, cb);
                        else {
                            // Check if we're actually ready to finish, but don't emit yet
                            var finished = needFinish(state);
                            if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
                                clearBuffer(stream, state);
                            }
                            if (sync) {
                                /*<replacement>*/
                                asyncWrite(afterWrite, stream, state, finished, cb);    /*</replacement>*/
                            } else {
                                afterWrite(stream, state, finished, cb);
                            }
                        }
                    }
                    function afterWrite(stream, state, finished, cb) {
                        if (!finished)
                            onwriteDrain(stream, state);
                        state.pendingcb--;
                        cb();
                        finishMaybe(stream, state);
                    }
                    // Must force callback to be called on nextTick, so that we don't
                    // emit 'drain' before the write() consumer gets the 'false' return
                    // value, and has a chance to attach a 'drain' listener.
                    function onwriteDrain(stream, state) {
                        if (state.length === 0 && state.needDrain) {
                            state.needDrain = false;
                            stream.emit('drain');
                        }
                    }
                    // if there's something in the buffer waiting, then process it
                    function clearBuffer(stream, state) {
                        state.bufferProcessing = true;
                        var entry = state.bufferedRequest;
                        if (stream._writev && entry && entry.next) {
                            // Fast case, write everything using _writev()
                            var l = state.bufferedRequestCount;
                            var buffer = new Array(l);
                            var holder = state.corkedRequestsFree;
                            holder.entry = entry;
                            var count = 0;
                            while (entry) {
                                buffer[count] = entry;
                                entry = entry.next;
                                count += 1;
                            }
                            doWrite(stream, state, true, state.length, buffer, '', holder.finish);
                            // doWrite is almost always async, defer these to save a bit of time
                            // as the hot path ends with doWrite
                            state.pendingcb++;
                            state.lastBufferedRequest = null;
                            if (holder.next) {
                                state.corkedRequestsFree = holder.next;
                                holder.next = null;
                            } else {
                                state.corkedRequestsFree = new CorkedRequest(state);
                            }
                        } else {
                            // Slow case, write chunks one-by-one
                            while (entry) {
                                var chunk = entry.chunk;
                                var encoding = entry.encoding;
                                var cb = entry.callback;
                                var len = state.objectMode ? 1 : chunk.length;
                                doWrite(stream, state, false, len, chunk, encoding, cb);
                                entry = entry.next;
                                // if we didn't call the onwrite immediately, then
                                // it means that we need to wait until it does.
                                // also, that means that the chunk and cb are currently
                                // being processed, so move the buffer counter past them.
                                if (state.writing) {
                                    break;
                                }
                            }
                            if (entry === null)
                                state.lastBufferedRequest = null;
                        }
                        state.bufferedRequestCount = 0;
                        state.bufferedRequest = entry;
                        state.bufferProcessing = false;
                    }
                    Writable.prototype._write = function (chunk, encoding, cb) {
                        cb(new Error('not implemented'));
                    };
                    Writable.prototype._writev = null;
                    Writable.prototype.end = function (chunk, encoding, cb) {
                        var state = this._writableState;
                        if (typeof chunk === 'function') {
                            cb = chunk;
                            chunk = null;
                            encoding = null;
                        } else if (typeof encoding === 'function') {
                            cb = encoding;
                            encoding = null;
                        }
                        if (chunk !== null && chunk !== undefined)
                            this.write(chunk, encoding);
                        // .end() fully uncorks
                        if (state.corked) {
                            state.corked = 1;
                            this.uncork();
                        }
                        // ignore unnecessary end() calls.
                        if (!state.ending && !state.finished)
                            endWritable(this, state, cb);
                    };
                    function needFinish(state) {
                        return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
                    }
                    function prefinish(stream, state) {
                        if (!state.prefinished) {
                            state.prefinished = true;
                            stream.emit('prefinish');
                        }
                    }
                    function finishMaybe(stream, state) {
                        var need = needFinish(state);
                        if (need) {
                            if (state.pendingcb === 0) {
                                prefinish(stream, state);
                                state.finished = true;
                                stream.emit('finish');
                            } else {
                                prefinish(stream, state);
                            }
                        }
                        return need;
                    }
                    function endWritable(stream, state, cb) {
                        state.ending = true;
                        finishMaybe(stream, state);
                        if (cb) {
                            if (state.finished)
                                processNextTick(cb);
                            else
                                stream.once('finish', cb);
                        }
                        state.ended = true;
                        stream.writable = false;
                    }
                    // It seems a linked list but it is not
                    // there will be only 2 of these for each stream
                    function CorkedRequest(state) {
                        var _this = this;
                        this.next = null;
                        this.entry = null;
                        this.finish = function (err) {
                            var entry = _this.entry;
                            _this.entry = null;
                            while (entry) {
                                var cb = entry.callback;
                                state.pendingcb--;
                                cb(err);
                                entry = entry.next;
                            }
                            if (state.corkedRequestsFree) {
                                state.corkedRequestsFree.next = _this;
                            } else {
                                state.corkedRequestsFree = _this;
                            }
                        };
                    }
                }.call(this, require('_process')));
            },
            {
                './_stream_duplex': 36,
                '_process': 26,
                'buffer': 9,
                'buffer-shims': 8,
                'core-util-is': 12,
                'events': 14,
                'inherits': 18,
                'process-nextick-args': 25,
                'util-deprecate': 55
            }
        ],
        41: [
            function (require, module, exports) {
                'use strict';
                var Buffer = require('buffer').Buffer;
                /*<replacement>*/
                var bufferShim = require('buffer-shims');
                /*</replacement>*/
                module.exports = BufferList;
                function BufferList() {
                    this.head = null;
                    this.tail = null;
                    this.length = 0;
                }
                BufferList.prototype.push = function (v) {
                    var entry = {
                        data: v,
                        next: null
                    };
                    if (this.length > 0)
                        this.tail.next = entry;
                    else
                        this.head = entry;
                    this.tail = entry;
                    ++this.length;
                };
                BufferList.prototype.unshift = function (v) {
                    var entry = {
                        data: v,
                        next: this.head
                    };
                    if (this.length === 0)
                        this.tail = entry;
                    this.head = entry;
                    ++this.length;
                };
                BufferList.prototype.shift = function () {
                    if (this.length === 0)
                        return;
                    var ret = this.head.data;
                    if (this.length === 1)
                        this.head = this.tail = null;
                    else
                        this.head = this.head.next;
                    --this.length;
                    return ret;
                };
                BufferList.prototype.clear = function () {
                    this.head = this.tail = null;
                    this.length = 0;
                };
                BufferList.prototype.join = function (s) {
                    if (this.length === 0)
                        return '';
                    var p = this.head;
                    var ret = '' + p.data;
                    while (p = p.next) {
                        ret += s + p.data;
                    }
                    return ret;
                };
                BufferList.prototype.concat = function (n) {
                    if (this.length === 0)
                        return bufferShim.alloc(0);
                    if (this.length === 1)
                        return this.head.data;
                    var ret = bufferShim.allocUnsafe(n >>> 0);
                    var p = this.head;
                    var i = 0;
                    while (p) {
                        p.data.copy(ret, i);
                        i += p.data.length;
                        p = p.next;
                    }
                    return ret;
                };
            },
            {
                'buffer': 9,
                'buffer-shims': 8
            }
        ],
        42: [
            function (require, module, exports) {
                module.exports = require('./lib/_stream_passthrough.js');
            },
            { './lib/_stream_passthrough.js': 37 }
        ],
        43: [
            function (require, module, exports) {
                (function (process) {
                    var Stream = function () {
                        try {
                            return require('st' + 'ream');    // hack to fix a circular dependency issue when used with browserify
                        } catch (_) {
                        }
                    }();
                    exports = module.exports = require('./lib/_stream_readable.js');
                    exports.Stream = Stream || exports;
                    exports.Readable = exports;
                    exports.Writable = require('./lib/_stream_writable.js');
                    exports.Duplex = require('./lib/_stream_duplex.js');
                    exports.Transform = require('./lib/_stream_transform.js');
                    exports.PassThrough = require('./lib/_stream_passthrough.js');
                    if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
                        module.exports = Stream;
                    }
                }.call(this, require('_process')));
            },
            {
                './lib/_stream_duplex.js': 36,
                './lib/_stream_passthrough.js': 37,
                './lib/_stream_readable.js': 38,
                './lib/_stream_transform.js': 39,
                './lib/_stream_writable.js': 40,
                '_process': 26
            }
        ],
        44: [
            function (require, module, exports) {
                module.exports = require('./lib/_stream_transform.js');
            },
            { './lib/_stream_transform.js': 39 }
        ],
        45: [
            function (require, module, exports) {
                module.exports = require('./lib/_stream_writable.js');
            },
            { './lib/_stream_writable.js': 40 }
        ],
        46: [
            function (require, module, exports) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                module.exports = Stream;
                var EE = require('events').EventEmitter;
                var inherits = require('inherits');
                inherits(Stream, EE);
                Stream.Readable = require('readable-stream/readable.js');
                Stream.Writable = require('readable-stream/writable.js');
                Stream.Duplex = require('readable-stream/duplex.js');
                Stream.Transform = require('readable-stream/transform.js');
                Stream.PassThrough = require('readable-stream/passthrough.js');
                // Backwards-compat with node 0.4.x
                Stream.Stream = Stream;
                // old-style streams.  Note that the pipe method (the only relevant
                // part of this class) is overridden in the Readable class.
                function Stream() {
                    EE.call(this);
                }
                Stream.prototype.pipe = function (dest, options) {
                    var source = this;
                    function ondata(chunk) {
                        if (dest.writable) {
                            if (false === dest.write(chunk) && source.pause) {
                                source.pause();
                            }
                        }
                    }
                    source.on('data', ondata);
                    function ondrain() {
                        if (source.readable && source.resume) {
                            source.resume();
                        }
                    }
                    dest.on('drain', ondrain);
                    // If the 'end' option is not supplied, dest.end() will be called when
                    // source gets the 'end' or 'close' events.  Only dest.end() once.
                    if (!dest._isStdio && (!options || options.end !== false)) {
                        source.on('end', onend);
                        source.on('close', onclose);
                    }
                    var didOnEnd = false;
                    function onend() {
                        if (didOnEnd)
                            return;
                        didOnEnd = true;
                        dest.end();
                    }
                    function onclose() {
                        if (didOnEnd)
                            return;
                        didOnEnd = true;
                        if (typeof dest.destroy === 'function')
                            dest.destroy();
                    }
                    // don't leave dangling pipes when there are errors.
                    function onerror(er) {
                        cleanup();
                        if (EE.listenerCount(this, 'error') === 0) {
                            throw er;    // Unhandled stream error in pipe.
                        }
                    }
                    source.on('error', onerror);
                    dest.on('error', onerror);
                    // remove all the event listeners that were added.
                    function cleanup() {
                        source.removeListener('data', ondata);
                        dest.removeListener('drain', ondrain);
                        source.removeListener('end', onend);
                        source.removeListener('close', onclose);
                        source.removeListener('error', onerror);
                        dest.removeListener('error', onerror);
                        source.removeListener('end', cleanup);
                        source.removeListener('close', cleanup);
                        dest.removeListener('close', cleanup);
                    }
                    source.on('end', cleanup);
                    source.on('close', cleanup);
                    dest.on('close', cleanup);
                    dest.emit('pipe', source);
                    // Allow for unix-like usage: A.pipe(B).pipe(C)
                    return dest;
                };
            },
            {
                'events': 14,
                'inherits': 18,
                'readable-stream/duplex.js': 35,
                'readable-stream/passthrough.js': 42,
                'readable-stream/readable.js': 43,
                'readable-stream/transform.js': 44,
                'readable-stream/writable.js': 45
            }
        ],
        47: [
            function (require, module, exports) {
                (function (global) {
                    var ClientRequest = require('./lib/request');
                    var extend = require('xtend');
                    var statusCodes = require('builtin-status-codes');
                    var url = require('url');
                    var http = exports;
                    http.request = function (opts, cb) {
                        if (typeof opts === 'string')
                            opts = url.parse(opts);
                        else
                            opts = extend(opts);
                        // Normally, the page is loaded from http or https, so not specifying a protocol
                        // will result in a (valid) protocol-relative url. However, this won't work if
                        // the protocol is something else, like 'file:'
                        var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : '';
                        var protocol = opts.protocol || defaultProtocol;
                        var host = opts.hostname || opts.host;
                        var port = opts.port;
                        var path = opts.path || '/';
                        // Necessary for IPv6 addresses
                        if (host && host.indexOf(':') !== -1)
                            host = '[' + host + ']';
                        // This may be a relative url. The browser should always be able to interpret it correctly.
                        opts.url = (host ? protocol + '//' + host : '') + (port ? ':' + port : '') + path;
                        opts.method = (opts.method || 'GET').toUpperCase();
                        opts.headers = opts.headers || {};
                        // Also valid opts.auth, opts.mode
                        var req = new ClientRequest(opts);
                        if (cb)
                            req.on('response', cb);
                        return req;
                    };
                    http.get = function get(opts, cb) {
                        var req = http.request(opts, cb);
                        req.end();
                        return req;
                    };
                    http.Agent = function () {
                    };
                    http.Agent.defaultMaxSockets = 4;
                    http.STATUS_CODES = statusCodes;
                    http.METHODS = [
                        'CHECKOUT',
                        'CONNECT',
                        'COPY',
                        'DELETE',
                        'GET',
                        'HEAD',
                        'LOCK',
                        'M-SEARCH',
                        'MERGE',
                        'MKACTIVITY',
                        'MKCOL',
                        'MOVE',
                        'NOTIFY',
                        'OPTIONS',
                        'PATCH',
                        'POST',
                        'PROPFIND',
                        'PROPPATCH',
                        'PURGE',
                        'PUT',
                        'REPORT',
                        'SEARCH',
                        'SUBSCRIBE',
                        'TRACE',
                        'UNLOCK',
                        'UNSUBSCRIBE'
                    ];
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {
                './lib/request': 49,
                'builtin-status-codes': 10,
                'url': 53,
                'xtend': 60
            }
        ],
        48: [
            function (require, module, exports) {
                (function (global) {
                    exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream);
                    exports.blobConstructor = false;
                    try {
                        new Blob([new ArrayBuffer(1)]);
                        exports.blobConstructor = true;
                    } catch (e) {
                    }
                    var xhr = new global.XMLHttpRequest();
                    // If location.host is empty, e.g. if this page/worker was loaded
                    // from a Blob, then use example.com to avoid an error
                    xhr.open('GET', global.location.host ? '/' : 'https://example.com');
                    function checkTypeSupport(type) {
                        try {
                            xhr.responseType = type;
                            return xhr.responseType === type;
                        } catch (e) {
                        }
                        return false;
                    }
                    // For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
                    // Safari 7.1 appears to have fixed this bug.
                    var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined';
                    var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice);
                    exports.arraybuffer = haveArrayBuffer && checkTypeSupport('arraybuffer');
                    // These next two tests unavoidably show warnings in Chrome. Since fetch will always
                    // be used if it's available, just return false for these to avoid the warnings.
                    exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream');
                    exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer && checkTypeSupport('moz-chunked-arraybuffer');
                    exports.overrideMimeType = isFunction(xhr.overrideMimeType);
                    exports.vbArray = isFunction(global.VBArray);
                    function isFunction(value) {
                        return typeof value === 'function';
                    }
                    xhr = null    // Help gc
;
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {}
        ],
        49: [
            function (require, module, exports) {
                (function (process, global, Buffer) {
                    var capability = require('./capability');
                    var inherits = require('inherits');
                    var response = require('./response');
                    var stream = require('readable-stream');
                    var toArrayBuffer = require('to-arraybuffer');
                    var IncomingMessage = response.IncomingMessage;
                    var rStates = response.readyStates;
                    function decideMode(preferBinary, useFetch) {
                        if (capability.fetch && useFetch) {
                            return 'fetch';
                        } else if (capability.mozchunkedarraybuffer) {
                            return 'moz-chunked-arraybuffer';
                        } else if (capability.msstream) {
                            return 'ms-stream';
                        } else if (capability.arraybuffer && preferBinary) {
                            return 'arraybuffer';
                        } else if (capability.vbArray && preferBinary) {
                            return 'text:vbarray';
                        } else {
                            return 'text';
                        }
                    }
                    var ClientRequest = module.exports = function (opts) {
                        var self = this;
                        stream.Writable.call(self);
                        self._opts = opts;
                        self._body = [];
                        self._headers = {};
                        if (opts.auth)
                            self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'));
                        Object.keys(opts.headers).forEach(function (name) {
                            self.setHeader(name, opts.headers[name]);
                        });
                        var preferBinary;
                        var useFetch = true;
                        if (opts.mode === 'disable-fetch') {
                            // If the use of XHR should be preferred and includes preserving the 'content-type' header
                            useFetch = false;
                            preferBinary = true;
                        } else if (opts.mode === 'prefer-streaming') {
                            // If streaming is a high priority but binary compatibility and
                            // the accuracy of the 'content-type' header aren't
                            preferBinary = false;
                        } else if (opts.mode === 'allow-wrong-content-type') {
                            // If streaming is more important than preserving the 'content-type' header
                            preferBinary = !capability.overrideMimeType;
                        } else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
                            // Use binary if text streaming may corrupt data or the content-type header, or for speed
                            preferBinary = true;
                        } else {
                            throw new Error('Invalid value for opts.mode');
                        }
                        self._mode = decideMode(preferBinary, useFetch);
                        self.on('finish', function () {
                            self._onFinish();
                        });
                    };
                    inherits(ClientRequest, stream.Writable);
                    ClientRequest.prototype.setHeader = function (name, value) {
                        var self = this;
                        var lowerName = name.toLowerCase();
                        // This check is not necessary, but it prevents warnings from browsers about setting unsafe
                        // headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
                        // http-browserify did it, so I will too.
                        if (unsafeHeaders.indexOf(lowerName) !== -1)
                            return;
                        self._headers[lowerName] = {
                            name: name,
                            value: value
                        };
                    };
                    ClientRequest.prototype.getHeader = function (name) {
                        var self = this;
                        return self._headers[name.toLowerCase()].value;
                    };
                    ClientRequest.prototype.removeHeader = function (name) {
                        var self = this;
                        delete self._headers[name.toLowerCase()];
                    };
                    ClientRequest.prototype._onFinish = function () {
                        var self = this;
                        if (self._destroyed)
                            return;
                        var opts = self._opts;
                        var headersObj = self._headers;
                        var body;
                        if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
                            if (capability.blobConstructor) {
                                body = new global.Blob(self._body.map(function (buffer) {
                                    return toArrayBuffer(buffer);
                                }), { type: (headersObj['content-type'] || {}).value || '' });
                            } else {
                                // get utf8 string
                                body = Buffer.concat(self._body).toString();
                            }
                        }
                        if (self._mode === 'fetch') {
                            var headers = Object.keys(headersObj).map(function (name) {
                                return [
                                    headersObj[name].name,
                                    headersObj[name].value
                                ];
                            });
                            global.fetch(self._opts.url, {
                                method: self._opts.method,
                                headers: headers,
                                body: body,
                                mode: 'cors',
                                credentials: opts.withCredentials ? 'include' : 'same-origin'
                            }).then(function (response) {
                                self._fetchResponse = response;
                                self._connect();
                            }, function (reason) {
                                self.emit('error', reason);
                            });
                        } else {
                            var xhr = self._xhr = new global.XMLHttpRequest();
                            try {
                                xhr.open(self._opts.method, self._opts.url, true);
                            } catch (err) {
                                process.nextTick(function () {
                                    self.emit('error', err);
                                });
                                return;
                            }
                            // Can't set responseType on really old browsers
                            if ('responseType' in xhr)
                                xhr.responseType = self._mode.split(':')[0];
                            if ('withCredentials' in xhr)
                                xhr.withCredentials = !!opts.withCredentials;
                            if (self._mode === 'text' && 'overrideMimeType' in xhr)
                                xhr.overrideMimeType('text/plain; charset=x-user-defined');
                            Object.keys(headersObj).forEach(function (name) {
                                xhr.setRequestHeader(headersObj[name].name, headersObj[name].value);
                            });
                            self._response = null;
                            xhr.onreadystatechange = function () {
                                switch (xhr.readyState) {
                                case rStates.LOADING:
                                case rStates.DONE:
                                    self._onXHRProgress();
                                    break;
                                }
                            };
                            // Necessary for streaming in Firefox, since xhr.response is ONLY defined
                            // in onprogress, not in onreadystatechange with xhr.readyState = 3
                            if (self._mode === 'moz-chunked-arraybuffer') {
                                xhr.onprogress = function () {
                                    self._onXHRProgress();
                                };
                            }
                            xhr.onerror = function () {
                                if (self._destroyed)
                                    return;
                                self.emit('error', new Error('XHR error'));
                            };
                            try {
                                xhr.send(body);
                            } catch (err) {
                                process.nextTick(function () {
                                    self.emit('error', err);
                                });
                                return;
                            }
                        }
                    };
                    /**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
                    function statusValid(xhr) {
                        try {
                            var status = xhr.status;
                            return status !== null && status !== 0;
                        } catch (e) {
                            return false;
                        }
                    }
                    ClientRequest.prototype._onXHRProgress = function () {
                        var self = this;
                        if (!statusValid(self._xhr) || self._destroyed)
                            return;
                        if (!self._response)
                            self._connect();
                        self._response._onXHRProgress();
                    };
                    ClientRequest.prototype._connect = function () {
                        var self = this;
                        if (self._destroyed)
                            return;
                        self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode);
                        self.emit('response', self._response);
                    };
                    ClientRequest.prototype._write = function (chunk, encoding, cb) {
                        var self = this;
                        self._body.push(chunk);
                        cb();
                    };
                    ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
                        var self = this;
                        self._destroyed = true;
                        if (self._response)
                            self._response._destroyed = true;
                        if (self._xhr)
                            self._xhr.abort()    // Currently, there isn't a way to truly abort a fetch.
                                                 // If you like bikeshedding, see https://github.com/whatwg/fetch/issues/27
;
                    };
                    ClientRequest.prototype.end = function (data, encoding, cb) {
                        var self = this;
                        if (typeof data === 'function') {
                            cb = data;
                            data = undefined;
                        }
                        stream.Writable.prototype.end.call(self, data, encoding, cb);
                    };
                    ClientRequest.prototype.flushHeaders = function () {
                    };
                    ClientRequest.prototype.setTimeout = function () {
                    };
                    ClientRequest.prototype.setNoDelay = function () {
                    };
                    ClientRequest.prototype.setSocketKeepAlive = function () {
                    };
                    // Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
                    var unsafeHeaders = [
                        'accept-charset',
                        'accept-encoding',
                        'access-control-request-headers',
                        'access-control-request-method',
                        'connection',
                        'content-length',
                        'cookie',
                        'cookie2',
                        'date',
                        'dnt',
                        'expect',
                        'host',
                        'keep-alive',
                        'origin',
                        'referer',
                        'te',
                        'trailer',
                        'transfer-encoding',
                        'upgrade',
                        'user-agent',
                        'via'
                    ];
                }.call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}, require('buffer').Buffer));
            },
            {
                './capability': 48,
                './response': 50,
                '_process': 26,
                'buffer': 9,
                'inherits': 18,
                'readable-stream': 43,
                'to-arraybuffer': 52
            }
        ],
        50: [
            function (require, module, exports) {
                (function (process, global, Buffer) {
                    var capability = require('./capability');
                    var inherits = require('inherits');
                    var stream = require('readable-stream');
                    var rStates = exports.readyStates = {
                        UNSENT: 0,
                        OPENED: 1,
                        HEADERS_RECEIVED: 2,
                        LOADING: 3,
                        DONE: 4
                    };
                    var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode) {
                        var self = this;
                        stream.Readable.call(self);
                        self._mode = mode;
                        self.headers = {};
                        self.rawHeaders = [];
                        self.trailers = {};
                        self.rawTrailers = [];
                        // Fake the 'close' event, but only once 'end' fires
                        self.on('end', function () {
                            // The nextTick is necessary to prevent the 'request' module from causing an infinite loop
                            process.nextTick(function () {
                                self.emit('close');
                            });
                        });
                        if (mode === 'fetch') {
                            self._fetchResponse = response;
                            self.url = response.url;
                            self.statusCode = response.status;
                            self.statusMessage = response.statusText;
                            // backwards compatible version of for (<item> of <iterable>):
                            // for (var <item>,_i,_it = <iterable>[Symbol.iterator](); <item> = (_i = _it.next()).value,!_i.done;)
                            for (var header, _i, _it = response.headers[Symbol.iterator](); header = (_i = _it.next()).value, !_i.done;) {
                                self.headers[header[0].toLowerCase()] = header[1];
                                self.rawHeaders.push(header[0], header[1]);
                            }
                            // TODO: this doesn't respect backpressure. Once WritableStream is available, this can be fixed
                            var reader = response.body.getReader();
                            function read() {
                                reader.read().then(function (result) {
                                    if (self._destroyed)
                                        return;
                                    if (result.done) {
                                        self.push(null);
                                        return;
                                    }
                                    self.push(new Buffer(result.value));
                                    read();
                                });
                            }
                            read();
                        } else {
                            self._xhr = xhr;
                            self._pos = 0;
                            self.url = xhr.responseURL;
                            self.statusCode = xhr.status;
                            self.statusMessage = xhr.statusText;
                            var headers = xhr.getAllResponseHeaders().split(/\r?\n/);
                            headers.forEach(function (header) {
                                var matches = header.match(/^([^:]+):\s*(.*)/);
                                if (matches) {
                                    var key = matches[1].toLowerCase();
                                    if (key === 'set-cookie') {
                                        if (self.headers[key] === undefined) {
                                            self.headers[key] = [];
                                        }
                                        self.headers[key].push(matches[2]);
                                    } else if (self.headers[key] !== undefined) {
                                        self.headers[key] += ', ' + matches[2];
                                    } else {
                                        self.headers[key] = matches[2];
                                    }
                                    self.rawHeaders.push(matches[1], matches[2]);
                                }
                            });
                            self._charset = 'x-user-defined';
                            if (!capability.overrideMimeType) {
                                var mimeType = self.rawHeaders['mime-type'];
                                if (mimeType) {
                                    var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/);
                                    if (charsetMatch) {
                                        self._charset = charsetMatch[1].toLowerCase();
                                    }
                                }
                                if (!self._charset)
                                    self._charset = 'utf-8'    // best guess
;
                            }
                        }
                    };
                    inherits(IncomingMessage, stream.Readable);
                    IncomingMessage.prototype._read = function () {
                    };
                    IncomingMessage.prototype._onXHRProgress = function () {
                        var self = this;
                        var xhr = self._xhr;
                        var response = null;
                        switch (self._mode) {
                        case 'text:vbarray':
                            // For IE9
                            if (xhr.readyState !== rStates.DONE)
                                break;
                            try {
                                // This fails in IE8
                                response = new global.VBArray(xhr.responseBody).toArray();
                            } catch (e) {
                            }
                            if (response !== null) {
                                self.push(new Buffer(response));
                                break;
                            }
                        // Falls through in IE8	
                        case 'text':
                            try {
                                // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
                                response = xhr.responseText;
                            } catch (e) {
                                self._mode = 'text:vbarray';
                                break;
                            }
                            if (response.length > self._pos) {
                                var newData = response.substr(self._pos);
                                if (self._charset === 'x-user-defined') {
                                    var buffer = new Buffer(newData.length);
                                    for (var i = 0; i < newData.length; i++)
                                        buffer[i] = newData.charCodeAt(i) & 255;
                                    self.push(buffer);
                                } else {
                                    self.push(newData, self._charset);
                                }
                                self._pos = response.length;
                            }
                            break;
                        case 'arraybuffer':
                            if (xhr.readyState !== rStates.DONE || !xhr.response)
                                break;
                            response = xhr.response;
                            self.push(new Buffer(new Uint8Array(response)));
                            break;
                        case 'moz-chunked-arraybuffer':
                            // take whole
                            response = xhr.response;
                            if (xhr.readyState !== rStates.LOADING || !response)
                                break;
                            self.push(new Buffer(new Uint8Array(response)));
                            break;
                        case 'ms-stream':
                            response = xhr.response;
                            if (xhr.readyState !== rStates.LOADING)
                                break;
                            var reader = new global.MSStreamReader();
                            reader.onprogress = function () {
                                if (reader.result.byteLength > self._pos) {
                                    self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))));
                                    self._pos = reader.result.byteLength;
                                }
                            };
                            reader.onload = function () {
                                self.push(null);
                            };
                            // reader.onerror = ??? // TODO: this
                            reader.readAsArrayBuffer(response);
                            break;
                        }
                        // The ms-stream case handles end separately in reader.onload()
                        if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
                            self.push(null);
                        }
                    };
                }.call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}, require('buffer').Buffer));
            },
            {
                './capability': 48,
                '_process': 26,
                'buffer': 9,
                'inherits': 18,
                'readable-stream': 43
            }
        ],
        51: [
            function (require, module, exports) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                var Buffer = require('buffer').Buffer;
                var isBufferEncoding = Buffer.isEncoding || function (encoding) {
                    switch (encoding && encoding.toLowerCase()) {
                    case 'hex':
                    case 'utf8':
                    case 'utf-8':
                    case 'ascii':
                    case 'binary':
                    case 'base64':
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                    case 'raw':
                        return true;
                    default:
                        return false;
                    }
                };
                function assertEncoding(encoding) {
                    if (encoding && !isBufferEncoding(encoding)) {
                        throw new Error('Unknown encoding: ' + encoding);
                    }
                }
                // StringDecoder provides an interface for efficiently splitting a series of
                // buffers into a series of JS strings without breaking apart multi-byte
                // characters. CESU-8 is handled as part of the UTF-8 encoding.
                //
                // @TODO Handling all encodings inside a single object makes it very difficult
                // to reason about this code, so it should be split up in the future.
                // @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
                // points as used by CESU-8.
                var StringDecoder = exports.StringDecoder = function (encoding) {
                    this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
                    assertEncoding(encoding);
                    switch (this.encoding) {
                    case 'utf8':
                        // CESU-8 represents each of Surrogate Pair by 3-bytes
                        this.surrogateSize = 3;
                        break;
                    case 'ucs2':
                    case 'utf16le':
                        // UTF-16 represents each of Surrogate Pair by 2-bytes
                        this.surrogateSize = 2;
                        this.detectIncompleteChar = utf16DetectIncompleteChar;
                        break;
                    case 'base64':
                        // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
                        this.surrogateSize = 3;
                        this.detectIncompleteChar = base64DetectIncompleteChar;
                        break;
                    default:
                        this.write = passThroughWrite;
                        return;
                    }
                    // Enough space to store all bytes of a single character. UTF-8 needs 4
                    // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
                    this.charBuffer = new Buffer(6);
                    // Number of bytes received for the current incomplete multi-byte character.
                    this.charReceived = 0;
                    // Number of bytes expected for the current incomplete multi-byte character.
                    this.charLength = 0;
                };
                // write decodes the given buffer and returns it as JS string that is
                // guaranteed to not contain any partial multi-byte characters. Any partial
                // character found at the end of the buffer is buffered up, and will be
                // returned when calling write again with the remaining bytes.
                //
                // Note: Converting a Buffer containing an orphan surrogate to a String
                // currently works, but converting a String to a Buffer (via `new Buffer`, or
                // Buffer#write) will replace incomplete surrogates with the unicode
                // replacement character. See https://codereview.chromium.org/121173009/ .
                StringDecoder.prototype.write = function (buffer) {
                    var charStr = '';
                    // if our last write ended with an incomplete multibyte character
                    while (this.charLength) {
                        // determine how many remaining bytes this buffer has to offer for this char
                        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
                        // add the new bytes to the char buffer
                        buffer.copy(this.charBuffer, this.charReceived, 0, available);
                        this.charReceived += available;
                        if (this.charReceived < this.charLength) {
                            // still not enough chars in this buffer? wait for more ...
                            return '';
                        }
                        // remove bytes belonging to the current character from the buffer
                        buffer = buffer.slice(available, buffer.length);
                        // get the character that was split
                        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                        // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
                        var charCode = charStr.charCodeAt(charStr.length - 1);
                        if (charCode >= 55296 && charCode <= 56319) {
                            this.charLength += this.surrogateSize;
                            charStr = '';
                            continue;
                        }
                        this.charReceived = this.charLength = 0;
                        // if there are no more bytes in this buffer, just emit our char
                        if (buffer.length === 0) {
                            return charStr;
                        }
                        break;
                    }
                    // determine and set charLength / charReceived
                    this.detectIncompleteChar(buffer);
                    var end = buffer.length;
                    if (this.charLength) {
                        // buffer the incomplete character bytes we got
                        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
                        end -= this.charReceived;
                    }
                    charStr += buffer.toString(this.encoding, 0, end);
                    var end = charStr.length - 1;
                    var charCode = charStr.charCodeAt(end);
                    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
                    if (charCode >= 55296 && charCode <= 56319) {
                        var size = this.surrogateSize;
                        this.charLength += size;
                        this.charReceived += size;
                        this.charBuffer.copy(this.charBuffer, size, 0, size);
                        buffer.copy(this.charBuffer, 0, 0, size);
                        return charStr.substring(0, end);
                    }
                    // or just emit the charStr
                    return charStr;
                };
                // detectIncompleteChar determines if there is an incomplete UTF-8 character at
                // the end of the given buffer. If so, it sets this.charLength to the byte
                // length that character, and sets this.charReceived to the number of bytes
                // that are available for this character.
                StringDecoder.prototype.detectIncompleteChar = function (buffer) {
                    // determine how many bytes we have to check at the end of this buffer
                    var i = buffer.length >= 3 ? 3 : buffer.length;
                    // Figure out if one of the last i bytes of our buffer announces an
                    // incomplete char.
                    for (; i > 0; i--) {
                        var c = buffer[buffer.length - i];
                        // See http://en.wikipedia.org/wiki/UTF-8#Description
                        // 110XXXXX
                        if (i == 1 && c >> 5 == 6) {
                            this.charLength = 2;
                            break;
                        }
                        // 1110XXXX
                        if (i <= 2 && c >> 4 == 14) {
                            this.charLength = 3;
                            break;
                        }
                        // 11110XXX
                        if (i <= 3 && c >> 3 == 30) {
                            this.charLength = 4;
                            break;
                        }
                    }
                    this.charReceived = i;
                };
                StringDecoder.prototype.end = function (buffer) {
                    var res = '';
                    if (buffer && buffer.length)
                        res = this.write(buffer);
                    if (this.charReceived) {
                        var cr = this.charReceived;
                        var buf = this.charBuffer;
                        var enc = this.encoding;
                        res += buf.slice(0, cr).toString(enc);
                    }
                    return res;
                };
                function passThroughWrite(buffer) {
                    return buffer.toString(this.encoding);
                }
                function utf16DetectIncompleteChar(buffer) {
                    this.charReceived = buffer.length % 2;
                    this.charLength = this.charReceived ? 2 : 0;
                }
                function base64DetectIncompleteChar(buffer) {
                    this.charReceived = buffer.length % 3;
                    this.charLength = this.charReceived ? 3 : 0;
                }
            },
            { 'buffer': 9 }
        ],
        52: [
            function (require, module, exports) {
                var Buffer = require('buffer').Buffer;
                module.exports = function (buf) {
                    // If the buffer is backed by a Uint8Array, a faster version will work
                    if (buf instanceof Uint8Array) {
                        // If the buffer isn't a subarray, return the underlying ArrayBuffer
                        if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
                            return buf.buffer;
                        } else if (typeof buf.buffer.slice === 'function') {
                            // Otherwise we need to get a proper copy
                            return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                        }
                    }
                    if (Buffer.isBuffer(buf)) {
                        // This is the slow version that will work with any Buffer
                        // implementation (even in old browsers)
                        var arrayCopy = new Uint8Array(buf.length);
                        var len = buf.length;
                        for (var i = 0; i < len; i++) {
                            arrayCopy[i] = buf[i];
                        }
                        return arrayCopy.buffer;
                    } else {
                        throw new Error('Argument must be a Buffer');
                    }
                };
            },
            { 'buffer': 9 }
        ],
        53: [
            function (require, module, exports) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                'use strict';
                var punycode = require('punycode');
                var util = require('./util');
                exports.parse = urlParse;
                exports.resolve = urlResolve;
                exports.resolveObject = urlResolveObject;
                exports.format = urlFormat;
                exports.Url = Url;
                function Url() {
                    this.protocol = null;
                    this.slashes = null;
                    this.auth = null;
                    this.host = null;
                    this.port = null;
                    this.hostname = null;
                    this.hash = null;
                    this.search = null;
                    this.query = null;
                    this.pathname = null;
                    this.path = null;
                    this.href = null;
                }
                // Reference: RFC 3986, RFC 1808, RFC 2396
                // define these here so at least they only have to be
                // compiled once on the first module load.
                var protocolPattern = /^([a-z0-9.+-]+:)/i, portPattern = /:[0-9]*$/,
                    // Special case for a simple path URL
                    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
                    // RFC 2396: characters reserved for delimiting URLs.
                    // We actually just auto-escape these.
                    delims = [
                        '<',
                        '>',
                        '"',
                        '`',
                        ' ',
                        '\r',
                        '\n',
                        '\t'
                    ],
                    // RFC 2396: characters not allowed for various reasons.
                    unwise = [
                        '{',
                        '}',
                        '|',
                        '\\',
                        '^',
                        '`'
                    ].concat(delims),
                    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
                    autoEscape = ['\''].concat(unwise),
                    // Characters that are never ever allowed in a hostname.
                    // Note that any invalid chars are also handled, but these
                    // are the ones that are *expected* to be seen, so we fast-path
                    // them.
                    nonHostChars = [
                        '%',
                        '/',
                        '?',
                        ';',
                        '#'
                    ].concat(autoEscape), hostEndingChars = [
                        '/',
                        '?',
                        '#'
                    ], hostnameMaxLen = 255, hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/, hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
                    // protocols that can allow "unsafe" and "unwise" chars.
                    unsafeProtocol = {
                        'javascript': true,
                        'javascript:': true
                    },
                    // protocols that never have a hostname.
                    hostlessProtocol = {
                        'javascript': true,
                        'javascript:': true
                    },
                    // protocols that always contain a // bit.
                    slashedProtocol = {
                        'http': true,
                        'https': true,
                        'ftp': true,
                        'gopher': true,
                        'file': true,
                        'http:': true,
                        'https:': true,
                        'ftp:': true,
                        'gopher:': true,
                        'file:': true
                    }, querystring = require('querystring');
                function urlParse(url, parseQueryString, slashesDenoteHost) {
                    if (url && util.isObject(url) && url instanceof Url)
                        return url;
                    var u = new Url();
                    u.parse(url, parseQueryString, slashesDenoteHost);
                    return u;
                }
                Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
                    if (!util.isString(url)) {
                        throw new TypeError('Parameter \'url\' must be a string, not ' + typeof url);
                    }
                    // Copy chrome, IE, opera backslash-handling behavior.
                    // Back slashes before the query string get converted to forward slashes
                    // See: https://code.google.com/p/chromium/issues/detail?id=25916
                    var queryIndex = url.indexOf('?'), splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#', uSplit = url.split(splitter), slashRegex = /\\/g;
                    uSplit[0] = uSplit[0].replace(slashRegex, '/');
                    url = uSplit.join(splitter);
                    var rest = url;
                    // trim before proceeding.
                    // This is to support parse stuff like "  http://foo.com  \n"
                    rest = rest.trim();
                    if (!slashesDenoteHost && url.split('#').length === 1) {
                        // Try fast path regexp
                        var simplePath = simplePathPattern.exec(rest);
                        if (simplePath) {
                            this.path = rest;
                            this.href = rest;
                            this.pathname = simplePath[1];
                            if (simplePath[2]) {
                                this.search = simplePath[2];
                                if (parseQueryString) {
                                    this.query = querystring.parse(this.search.substr(1));
                                } else {
                                    this.query = this.search.substr(1);
                                }
                            } else if (parseQueryString) {
                                this.search = '';
                                this.query = {};
                            }
                            return this;
                        }
                    }
                    var proto = protocolPattern.exec(rest);
                    if (proto) {
                        proto = proto[0];
                        var lowerProto = proto.toLowerCase();
                        this.protocol = lowerProto;
                        rest = rest.substr(proto.length);
                    }
                    // figure out if it's got a host
                    // user@server is *always* interpreted as a hostname, and url
                    // resolution will treat //foo/bar as host=foo,path=bar because that's
                    // how the browser resolves relative URLs.
                    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                        var slashes = rest.substr(0, 2) === '//';
                        if (slashes && !(proto && hostlessProtocol[proto])) {
                            rest = rest.substr(2);
                            this.slashes = true;
                        }
                    }
                    if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
                        // there's a hostname.
                        // the first instance of /, ?, ;, or # ends the host.
                        //
                        // If there is an @ in the hostname, then non-host chars *are* allowed
                        // to the left of the last @ sign, unless some host-ending character
                        // comes *before* the @-sign.
                        // URLs are obnoxious.
                        //
                        // ex:
                        // http://a@b@c/ => user:a@b host:c
                        // http://a@b?@c => user:a host:c path:/?@c
                        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
                        // Review our test case against browsers more comprehensively.
                        // find the first instance of any hostEndingChars
                        var hostEnd = -1;
                        for (var i = 0; i < hostEndingChars.length; i++) {
                            var hec = rest.indexOf(hostEndingChars[i]);
                            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                                hostEnd = hec;
                        }
                        // at this point, either we have an explicit point where the
                        // auth portion cannot go past, or the last @ char is the decider.
                        var auth, atSign;
                        if (hostEnd === -1) {
                            // atSign can be anywhere.
                            atSign = rest.lastIndexOf('@');
                        } else {
                            // atSign must be in auth portion.
                            // http://a@b/c@d => host:b auth:a path:/c@d
                            atSign = rest.lastIndexOf('@', hostEnd);
                        }
                        // Now we have a portion which is definitely the auth.
                        // Pull that off.
                        if (atSign !== -1) {
                            auth = rest.slice(0, atSign);
                            rest = rest.slice(atSign + 1);
                            this.auth = decodeURIComponent(auth);
                        }
                        // the host is the remaining to the left of the first non-host char
                        hostEnd = -1;
                        for (var i = 0; i < nonHostChars.length; i++) {
                            var hec = rest.indexOf(nonHostChars[i]);
                            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                                hostEnd = hec;
                        }
                        // if we still have not hit it, then the entire thing is a host.
                        if (hostEnd === -1)
                            hostEnd = rest.length;
                        this.host = rest.slice(0, hostEnd);
                        rest = rest.slice(hostEnd);
                        // pull out port.
                        this.parseHost();
                        // we've indicated that there is a hostname,
                        // so even if it's empty, it has to be present.
                        this.hostname = this.hostname || '';
                        // if hostname begins with [ and ends with ]
                        // assume that it's an IPv6 address.
                        var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';
                        // validate a little.
                        if (!ipv6Hostname) {
                            var hostparts = this.hostname.split(/\./);
                            for (var i = 0, l = hostparts.length; i < l; i++) {
                                var part = hostparts[i];
                                if (!part)
                                    continue;
                                if (!part.match(hostnamePartPattern)) {
                                    var newpart = '';
                                    for (var j = 0, k = part.length; j < k; j++) {
                                        if (part.charCodeAt(j) > 127) {
                                            // we replace non-ASCII char with a temporary placeholder
                                            // we need this to make sure size of hostname is not
                                            // broken by replacing non-ASCII by nothing
                                            newpart += 'x';
                                        } else {
                                            newpart += part[j];
                                        }
                                    }
                                    // we test again with ASCII char only
                                    if (!newpart.match(hostnamePartPattern)) {
                                        var validParts = hostparts.slice(0, i);
                                        var notHost = hostparts.slice(i + 1);
                                        var bit = part.match(hostnamePartStart);
                                        if (bit) {
                                            validParts.push(bit[1]);
                                            notHost.unshift(bit[2]);
                                        }
                                        if (notHost.length) {
                                            rest = '/' + notHost.join('.') + rest;
                                        }
                                        this.hostname = validParts.join('.');
                                        break;
                                    }
                                }
                            }
                        }
                        if (this.hostname.length > hostnameMaxLen) {
                            this.hostname = '';
                        } else {
                            // hostnames are always lower case.
                            this.hostname = this.hostname.toLowerCase();
                        }
                        if (!ipv6Hostname) {
                            // IDNA Support: Returns a punycoded representation of "domain".
                            // It only converts parts of the domain name that
                            // have non-ASCII characters, i.e. it doesn't matter if
                            // you call it with a domain that already is ASCII-only.
                            this.hostname = punycode.toASCII(this.hostname);
                        }
                        var p = this.port ? ':' + this.port : '';
                        var h = this.hostname || '';
                        this.host = h + p;
                        this.href += this.host;
                        // strip [ and ] from the hostname
                        // the host field still retains them, though
                        if (ipv6Hostname) {
                            this.hostname = this.hostname.substr(1, this.hostname.length - 2);
                            if (rest[0] !== '/') {
                                rest = '/' + rest;
                            }
                        }
                    }
                    // now rest is set to the post-host stuff.
                    // chop off any delim chars.
                    if (!unsafeProtocol[lowerProto]) {
                        // First, make 100% sure that any "autoEscape" chars get
                        // escaped, even if encodeURIComponent doesn't think they
                        // need to be.
                        for (var i = 0, l = autoEscape.length; i < l; i++) {
                            var ae = autoEscape[i];
                            if (rest.indexOf(ae) === -1)
                                continue;
                            var esc = encodeURIComponent(ae);
                            if (esc === ae) {
                                esc = escape(ae);
                            }
                            rest = rest.split(ae).join(esc);
                        }
                    }
                    // chop off from the tail first.
                    var hash = rest.indexOf('#');
                    if (hash !== -1) {
                        // got a fragment string.
                        this.hash = rest.substr(hash);
                        rest = rest.slice(0, hash);
                    }
                    var qm = rest.indexOf('?');
                    if (qm !== -1) {
                        this.search = rest.substr(qm);
                        this.query = rest.substr(qm + 1);
                        if (parseQueryString) {
                            this.query = querystring.parse(this.query);
                        }
                        rest = rest.slice(0, qm);
                    } else if (parseQueryString) {
                        // no query string, but parseQueryString still requested
                        this.search = '';
                        this.query = {};
                    }
                    if (rest)
                        this.pathname = rest;
                    if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
                        this.pathname = '/';
                    }
                    //to support http.request
                    if (this.pathname || this.search) {
                        var p = this.pathname || '';
                        var s = this.search || '';
                        this.path = p + s;
                    }
                    // finally, reconstruct the href based on what has been validated.
                    this.href = this.format();
                    return this;
                };
                // format a parsed object into a url string
                function urlFormat(obj) {
                    // ensure it's an object, and not a string url.
                    // If it's an obj, this is a no-op.
                    // this way, you can call url_format() on strings
                    // to clean up potentially wonky urls.
                    if (util.isString(obj))
                        obj = urlParse(obj);
                    if (!(obj instanceof Url))
                        return Url.prototype.format.call(obj);
                    return obj.format();
                }
                Url.prototype.format = function () {
                    var auth = this.auth || '';
                    if (auth) {
                        auth = encodeURIComponent(auth);
                        auth = auth.replace(/%3A/i, ':');
                        auth += '@';
                    }
                    var protocol = this.protocol || '', pathname = this.pathname || '', hash = this.hash || '', host = false, query = '';
                    if (this.host) {
                        host = auth + this.host;
                    } else if (this.hostname) {
                        host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
                        if (this.port) {
                            host += ':' + this.port;
                        }
                    }
                    if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
                        query = querystring.stringify(this.query);
                    }
                    var search = this.search || query && '?' + query || '';
                    if (protocol && protocol.substr(-1) !== ':')
                        protocol += ':';
                    // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
                    // unless they had them to begin with.
                    if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
                        host = '//' + (host || '');
                        if (pathname && pathname.charAt(0) !== '/')
                            pathname = '/' + pathname;
                    } else if (!host) {
                        host = '';
                    }
                    if (hash && hash.charAt(0) !== '#')
                        hash = '#' + hash;
                    if (search && search.charAt(0) !== '?')
                        search = '?' + search;
                    pathname = pathname.replace(/[?#]/g, function (match) {
                        return encodeURIComponent(match);
                    });
                    search = search.replace('#', '%23');
                    return protocol + host + pathname + search + hash;
                };
                function urlResolve(source, relative) {
                    return urlParse(source, false, true).resolve(relative);
                }
                Url.prototype.resolve = function (relative) {
                    return this.resolveObject(urlParse(relative, false, true)).format();
                };
                function urlResolveObject(source, relative) {
                    if (!source)
                        return relative;
                    return urlParse(source, false, true).resolveObject(relative);
                }
                Url.prototype.resolveObject = function (relative) {
                    if (util.isString(relative)) {
                        var rel = new Url();
                        rel.parse(relative, false, true);
                        relative = rel;
                    }
                    var result = new Url();
                    var tkeys = Object.keys(this);
                    for (var tk = 0; tk < tkeys.length; tk++) {
                        var tkey = tkeys[tk];
                        result[tkey] = this[tkey];
                    }
                    // hash is always overridden, no matter what.
                    // even href="" will remove it.
                    result.hash = relative.hash;
                    // if the relative url is empty, then there's nothing left to do here.
                    if (relative.href === '') {
                        result.href = result.format();
                        return result;
                    }
                    // hrefs like //foo/bar always cut to the protocol.
                    if (relative.slashes && !relative.protocol) {
                        // take everything except the protocol from relative
                        var rkeys = Object.keys(relative);
                        for (var rk = 0; rk < rkeys.length; rk++) {
                            var rkey = rkeys[rk];
                            if (rkey !== 'protocol')
                                result[rkey] = relative[rkey];
                        }
                        //urlParse appends trailing / to urls like http://www.example.com
                        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
                            result.path = result.pathname = '/';
                        }
                        result.href = result.format();
                        return result;
                    }
                    if (relative.protocol && relative.protocol !== result.protocol) {
                        // if it's a known url protocol, then changing
                        // the protocol does weird things
                        // first, if it's not file:, then we MUST have a host,
                        // and if there was a path
                        // to begin with, then we MUST have a path.
                        // if it is file:, then the host is dropped,
                        // because that's known to be hostless.
                        // anything else is assumed to be absolute.
                        if (!slashedProtocol[relative.protocol]) {
                            var keys = Object.keys(relative);
                            for (var v = 0; v < keys.length; v++) {
                                var k = keys[v];
                                result[k] = relative[k];
                            }
                            result.href = result.format();
                            return result;
                        }
                        result.protocol = relative.protocol;
                        if (!relative.host && !hostlessProtocol[relative.protocol]) {
                            var relPath = (relative.pathname || '').split('/');
                            while (relPath.length && !(relative.host = relPath.shift()));
                            if (!relative.host)
                                relative.host = '';
                            if (!relative.hostname)
                                relative.hostname = '';
                            if (relPath[0] !== '')
                                relPath.unshift('');
                            if (relPath.length < 2)
                                relPath.unshift('');
                            result.pathname = relPath.join('/');
                        } else {
                            result.pathname = relative.pathname;
                        }
                        result.search = relative.search;
                        result.query = relative.query;
                        result.host = relative.host || '';
                        result.auth = relative.auth;
                        result.hostname = relative.hostname || relative.host;
                        result.port = relative.port;
                        // to support http.request
                        if (result.pathname || result.search) {
                            var p = result.pathname || '';
                            var s = result.search || '';
                            result.path = p + s;
                        }
                        result.slashes = result.slashes || relative.slashes;
                        result.href = result.format();
                        return result;
                    }
                    var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/', isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/', mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split('/') || [], relPath = relative.pathname && relative.pathname.split('/') || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
                    // if the url is a non-slashed url, then relative
                    // links like ../.. should be able
                    // to crawl up to the hostname, as well.  This is strange.
                    // result.protocol has already been set by now.
                    // Later on, put the first path part into the host field.
                    if (psychotic) {
                        result.hostname = '';
                        result.port = null;
                        if (result.host) {
                            if (srcPath[0] === '')
                                srcPath[0] = result.host;
                            else
                                srcPath.unshift(result.host);
                        }
                        result.host = '';
                        if (relative.protocol) {
                            relative.hostname = null;
                            relative.port = null;
                            if (relative.host) {
                                if (relPath[0] === '')
                                    relPath[0] = relative.host;
                                else
                                    relPath.unshift(relative.host);
                            }
                            relative.host = null;
                        }
                        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
                    }
                    if (isRelAbs) {
                        // it's absolute.
                        result.host = relative.host || relative.host === '' ? relative.host : result.host;
                        result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
                        result.search = relative.search;
                        result.query = relative.query;
                        srcPath = relPath;    // fall through to the dot-handling below.
                    } else if (relPath.length) {
                        // it's relative
                        // throw away the existing file, and take the new path instead.
                        if (!srcPath)
                            srcPath = [];
                        srcPath.pop();
                        srcPath = srcPath.concat(relPath);
                        result.search = relative.search;
                        result.query = relative.query;
                    } else if (!util.isNullOrUndefined(relative.search)) {
                        // just pull out the search.
                        // like href='?foo'.
                        // Put this after the other two cases because it simplifies the booleans
                        if (psychotic) {
                            result.hostname = result.host = srcPath.shift();
                            //occationaly the auth can get stuck only in host
                            //this especially happens in cases like
                            //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                            var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
                            if (authInHost) {
                                result.auth = authInHost.shift();
                                result.host = result.hostname = authInHost.shift();
                            }
                        }
                        result.search = relative.search;
                        result.query = relative.query;
                        //to support http.request
                        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                            result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
                        }
                        result.href = result.format();
                        return result;
                    }
                    if (!srcPath.length) {
                        // no path at all.  easy.
                        // we've already handled the other stuff above.
                        result.pathname = null;
                        //to support http.request
                        if (result.search) {
                            result.path = '/' + result.search;
                        } else {
                            result.path = null;
                        }
                        result.href = result.format();
                        return result;
                    }
                    // if a url ENDs in . or .., then it must get a trailing slash.
                    // however, if it ends in anything else non-slashy,
                    // then it must NOT get a trailing slash.
                    var last = srcPath.slice(-1)[0];
                    var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';
                    // strip single dots, resolve double dots to parent dir
                    // if the path tries to go above the root, `up` ends up > 0
                    var up = 0;
                    for (var i = srcPath.length; i >= 0; i--) {
                        last = srcPath[i];
                        if (last === '.') {
                            srcPath.splice(i, 1);
                        } else if (last === '..') {
                            srcPath.splice(i, 1);
                            up++;
                        } else if (up) {
                            srcPath.splice(i, 1);
                            up--;
                        }
                    }
                    // if the path is allowed to go above the root, restore leading ..s
                    if (!mustEndAbs && !removeAllDots) {
                        for (; up--; up) {
                            srcPath.unshift('..');
                        }
                    }
                    if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
                        srcPath.unshift('');
                    }
                    if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
                        srcPath.push('');
                    }
                    var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';
                    // put the host back
                    if (psychotic) {
                        result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
                        //occationaly the auth can get stuck only in host
                        //this especially happens in cases like
                        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                        var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
                        if (authInHost) {
                            result.auth = authInHost.shift();
                            result.host = result.hostname = authInHost.shift();
                        }
                    }
                    mustEndAbs = mustEndAbs || result.host && srcPath.length;
                    if (mustEndAbs && !isAbsolute) {
                        srcPath.unshift('');
                    }
                    if (!srcPath.length) {
                        result.pathname = null;
                        result.path = null;
                    } else {
                        result.pathname = srcPath.join('/');
                    }
                    //to support request.http
                    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
                    }
                    result.auth = relative.auth || result.auth;
                    result.slashes = result.slashes || relative.slashes;
                    result.href = result.format();
                    return result;
                };
                Url.prototype.parseHost = function () {
                    var host = this.host;
                    var port = portPattern.exec(host);
                    if (port) {
                        port = port[0];
                        if (port !== ':') {
                            this.port = port.substr(1);
                        }
                        host = host.substr(0, host.length - port.length);
                    }
                    if (host)
                        this.hostname = host;
                };
            },
            {
                './util': 54,
                'punycode': 31,
                'querystring': 34
            }
        ],
        54: [
            function (require, module, exports) {
                'use strict';
                module.exports = {
                    isString: function (arg) {
                        return typeof arg === 'string';
                    },
                    isObject: function (arg) {
                        return typeof arg === 'object' && arg !== null;
                    },
                    isNull: function (arg) {
                        return arg === null;
                    },
                    isNullOrUndefined: function (arg) {
                        return arg == null;
                    }
                };
            },
            {}
        ],
        55: [
            function (require, module, exports) {
                (function (global) {
                    /**
 * Module exports.
 */
                    module.exports = deprecate;
                    /**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */
                    function deprecate(fn, msg) {
                        if (config('noDeprecation')) {
                            return fn;
                        }
                        var warned = false;
                        function deprecated() {
                            if (!warned) {
                                if (config('throwDeprecation')) {
                                    throw new Error(msg);
                                } else if (config('traceDeprecation')) {
                                    console.trace(msg);
                                } else {
                                    console.warn(msg);
                                }
                                warned = true;
                            }
                            return fn.apply(this, arguments);
                        }
                        return deprecated;
                    }
                    /**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */
                    function config(name) {
                        // accessing global.localStorage can trigger a DOMException in sandboxed iframes
                        try {
                            if (!global.localStorage)
                                return false;
                        } catch (_) {
                            return false;
                        }
                        var val = global.localStorage[name];
                        if (null == val)
                            return false;
                        return String(val).toLowerCase() === 'true';
                    }
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {}
        ],
        56: [
            function (require, module, exports) {
                arguments[4][18][0].apply(exports, arguments);
            },
            { 'dup': 18 }
        ],
        57: [
            function (require, module, exports) {
                module.exports = function isBuffer(arg) {
                    return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
                };
            },
            {}
        ],
        58: [
            function (require, module, exports) {
                (function (process, global) {
                    // Copyright Joyent, Inc. and other Node contributors.
                    //
                    // Permission is hereby granted, free of charge, to any person obtaining a
                    // copy of this software and associated documentation files (the
                    // "Software"), to deal in the Software without restriction, including
                    // without limitation the rights to use, copy, modify, merge, publish,
                    // distribute, sublicense, and/or sell copies of the Software, and to permit
                    // persons to whom the Software is furnished to do so, subject to the
                    // following conditions:
                    //
                    // The above copyright notice and this permission notice shall be included
                    // in all copies or substantial portions of the Software.
                    //
                    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                    // USE OR OTHER DEALINGS IN THE SOFTWARE.
                    var formatRegExp = /%[sdj%]/g;
                    exports.format = function (f) {
                        if (!isString(f)) {
                            var objects = [];
                            for (var i = 0; i < arguments.length; i++) {
                                objects.push(inspect(arguments[i]));
                            }
                            return objects.join(' ');
                        }
                        var i = 1;
                        var args = arguments;
                        var len = args.length;
                        var str = String(f).replace(formatRegExp, function (x) {
                            if (x === '%%')
                                return '%';
                            if (i >= len)
                                return x;
                            switch (x) {
                            case '%s':
                                return String(args[i++]);
                            case '%d':
                                return Number(args[i++]);
                            case '%j':
                                try {
                                    return JSON.stringify(args[i++]);
                                } catch (_) {
                                    return '[Circular]';
                                }
                            default:
                                return x;
                            }
                        });
                        for (var x = args[i]; i < len; x = args[++i]) {
                            if (isNull(x) || !isObject(x)) {
                                str += ' ' + x;
                            } else {
                                str += ' ' + inspect(x);
                            }
                        }
                        return str;
                    };
                    // Mark that a method should not be used.
                    // Returns a modified function which warns once by default.
                    // If --no-deprecation is set, then it is a no-op.
                    exports.deprecate = function (fn, msg) {
                        // Allow for deprecating things in the process of starting up.
                        if (isUndefined(global.process)) {
                            return function () {
                                return exports.deprecate(fn, msg).apply(this, arguments);
                            };
                        }
                        if (process.noDeprecation === true) {
                            return fn;
                        }
                        var warned = false;
                        function deprecated() {
                            if (!warned) {
                                if (process.throwDeprecation) {
                                    throw new Error(msg);
                                } else if (process.traceDeprecation) {
                                    console.trace(msg);
                                } else {
                                    console.error(msg);
                                }
                                warned = true;
                            }
                            return fn.apply(this, arguments);
                        }
                        return deprecated;
                    };
                    var debugs = {};
                    var debugEnviron;
                    exports.debuglog = function (set) {
                        if (isUndefined(debugEnviron))
                            debugEnviron = process.env.NODE_DEBUG || '';
                        set = set.toUpperCase();
                        if (!debugs[set]) {
                            if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                                var pid = process.pid;
                                debugs[set] = function () {
                                    var msg = exports.format.apply(exports, arguments);
                                    console.error('%s %d: %s', set, pid, msg);
                                };
                            } else {
                                debugs[set] = function () {
                                };
                            }
                        }
                        return debugs[set];
                    };
                    /**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
                    /* legacy: obj, showHidden, depth, colors*/
                    function inspect(obj, opts) {
                        // default options
                        var ctx = {
                            seen: [],
                            stylize: stylizeNoColor
                        };
                        // legacy...
                        if (arguments.length >= 3)
                            ctx.depth = arguments[2];
                        if (arguments.length >= 4)
                            ctx.colors = arguments[3];
                        if (isBoolean(opts)) {
                            // legacy...
                            ctx.showHidden = opts;
                        } else if (opts) {
                            // got an "options" object
                            exports._extend(ctx, opts);
                        }
                        // set default options
                        if (isUndefined(ctx.showHidden))
                            ctx.showHidden = false;
                        if (isUndefined(ctx.depth))
                            ctx.depth = 2;
                        if (isUndefined(ctx.colors))
                            ctx.colors = false;
                        if (isUndefined(ctx.customInspect))
                            ctx.customInspect = true;
                        if (ctx.colors)
                            ctx.stylize = stylizeWithColor;
                        return formatValue(ctx, obj, ctx.depth);
                    }
                    exports.inspect = inspect;
                    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
                    inspect.colors = {
                        'bold': [
                            1,
                            22
                        ],
                        'italic': [
                            3,
                            23
                        ],
                        'underline': [
                            4,
                            24
                        ],
                        'inverse': [
                            7,
                            27
                        ],
                        'white': [
                            37,
                            39
                        ],
                        'grey': [
                            90,
                            39
                        ],
                        'black': [
                            30,
                            39
                        ],
                        'blue': [
                            34,
                            39
                        ],
                        'cyan': [
                            36,
                            39
                        ],
                        'green': [
                            32,
                            39
                        ],
                        'magenta': [
                            35,
                            39
                        ],
                        'red': [
                            31,
                            39
                        ],
                        'yellow': [
                            33,
                            39
                        ]
                    };
                    // Don't use 'blue' not visible on cmd.exe
                    inspect.styles = {
                        'special': 'cyan',
                        'number': 'yellow',
                        'boolean': 'yellow',
                        'undefined': 'grey',
                        'null': 'bold',
                        'string': 'green',
                        'date': 'magenta',
                        // "name": intentionally not styling
                        'regexp': 'red'
                    };
                    function stylizeWithColor(str, styleType) {
                        var style = inspect.styles[styleType];
                        if (style) {
                            return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
                        } else {
                            return str;
                        }
                    }
                    function stylizeNoColor(str, styleType) {
                        return str;
                    }
                    function arrayToHash(array) {
                        var hash = {};
                        array.forEach(function (val, idx) {
                            hash[val] = true;
                        });
                        return hash;
                    }
                    function formatValue(ctx, value, recurseTimes) {
                        // Provide a hook for user-specified inspect functions.
                        // Check that value is an object with an inspect function on it
                        if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
                            value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
                            !(value.constructor && value.constructor.prototype === value)) {
                            var ret = value.inspect(recurseTimes, ctx);
                            if (!isString(ret)) {
                                ret = formatValue(ctx, ret, recurseTimes);
                            }
                            return ret;
                        }
                        // Primitive types cannot have properties
                        var primitive = formatPrimitive(ctx, value);
                        if (primitive) {
                            return primitive;
                        }
                        // Look up the keys of the object.
                        var keys = Object.keys(value);
                        var visibleKeys = arrayToHash(keys);
                        if (ctx.showHidden) {
                            keys = Object.getOwnPropertyNames(value);
                        }
                        // IE doesn't make error fields non-enumerable
                        // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                        if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
                            return formatError(value);
                        }
                        // Some type of object without properties can be shortcutted.
                        if (keys.length === 0) {
                            if (isFunction(value)) {
                                var name = value.name ? ': ' + value.name : '';
                                return ctx.stylize('[Function' + name + ']', 'special');
                            }
                            if (isRegExp(value)) {
                                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                            }
                            if (isDate(value)) {
                                return ctx.stylize(Date.prototype.toString.call(value), 'date');
                            }
                            if (isError(value)) {
                                return formatError(value);
                            }
                        }
                        var base = '', array = false, braces = [
                                '{',
                                '}'
                            ];
                        // Make Array say that they are Array
                        if (isArray(value)) {
                            array = true;
                            braces = [
                                '[',
                                ']'
                            ];
                        }
                        // Make functions say that they are functions
                        if (isFunction(value)) {
                            var n = value.name ? ': ' + value.name : '';
                            base = ' [Function' + n + ']';
                        }
                        // Make RegExps say that they are RegExps
                        if (isRegExp(value)) {
                            base = ' ' + RegExp.prototype.toString.call(value);
                        }
                        // Make dates with properties first say the date
                        if (isDate(value)) {
                            base = ' ' + Date.prototype.toUTCString.call(value);
                        }
                        // Make error with message first say the error
                        if (isError(value)) {
                            base = ' ' + formatError(value);
                        }
                        if (keys.length === 0 && (!array || value.length == 0)) {
                            return braces[0] + base + braces[1];
                        }
                        if (recurseTimes < 0) {
                            if (isRegExp(value)) {
                                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                            } else {
                                return ctx.stylize('[Object]', 'special');
                            }
                        }
                        ctx.seen.push(value);
                        var output;
                        if (array) {
                            output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                        } else {
                            output = keys.map(function (key) {
                                return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                            });
                        }
                        ctx.seen.pop();
                        return reduceToSingleString(output, base, braces);
                    }
                    function formatPrimitive(ctx, value) {
                        if (isUndefined(value))
                            return ctx.stylize('undefined', 'undefined');
                        if (isString(value)) {
                            var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, '\\\'').replace(/\\"/g, '"') + '\'';
                            return ctx.stylize(simple, 'string');
                        }
                        if (isNumber(value))
                            return ctx.stylize('' + value, 'number');
                        if (isBoolean(value))
                            return ctx.stylize('' + value, 'boolean');
                        // For some reason typeof null is "object", so special case here.
                        if (isNull(value))
                            return ctx.stylize('null', 'null');
                    }
                    function formatError(value) {
                        return '[' + Error.prototype.toString.call(value) + ']';
                    }
                    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                        var output = [];
                        for (var i = 0, l = value.length; i < l; ++i) {
                            if (hasOwnProperty(value, String(i))) {
                                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
                            } else {
                                output.push('');
                            }
                        }
                        keys.forEach(function (key) {
                            if (!key.match(/^\d+$/)) {
                                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
                            }
                        });
                        return output;
                    }
                    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                        var name, str, desc;
                        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
                        if (desc.get) {
                            if (desc.set) {
                                str = ctx.stylize('[Getter/Setter]', 'special');
                            } else {
                                str = ctx.stylize('[Getter]', 'special');
                            }
                        } else {
                            if (desc.set) {
                                str = ctx.stylize('[Setter]', 'special');
                            }
                        }
                        if (!hasOwnProperty(visibleKeys, key)) {
                            name = '[' + key + ']';
                        }
                        if (!str) {
                            if (ctx.seen.indexOf(desc.value) < 0) {
                                if (isNull(recurseTimes)) {
                                    str = formatValue(ctx, desc.value, null);
                                } else {
                                    str = formatValue(ctx, desc.value, recurseTimes - 1);
                                }
                                if (str.indexOf('\n') > -1) {
                                    if (array) {
                                        str = str.split('\n').map(function (line) {
                                            return '  ' + line;
                                        }).join('\n').substr(2);
                                    } else {
                                        str = '\n' + str.split('\n').map(function (line) {
                                            return '   ' + line;
                                        }).join('\n');
                                    }
                                }
                            } else {
                                str = ctx.stylize('[Circular]', 'special');
                            }
                        }
                        if (isUndefined(name)) {
                            if (array && key.match(/^\d+$/)) {
                                return str;
                            }
                            name = JSON.stringify('' + key);
                            if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                                name = name.substr(1, name.length - 2);
                                name = ctx.stylize(name, 'name');
                            } else {
                                name = name.replace(/'/g, '\\\'').replace(/\\"/g, '"').replace(/(^"|"$)/g, '\'');
                                name = ctx.stylize(name, 'string');
                            }
                        }
                        return name + ': ' + str;
                    }
                    function reduceToSingleString(output, base, braces) {
                        var numLinesEst = 0;
                        var length = output.reduce(function (prev, cur) {
                            numLinesEst++;
                            if (cur.indexOf('\n') >= 0)
                                numLinesEst++;
                            return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                        }, 0);
                        if (length > 60) {
                            return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
                        }
                        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                    }
                    // NOTE: These type checking functions intentionally don't use `instanceof`
                    // because it is fragile and can be easily faked with `Object.create()`.
                    function isArray(ar) {
                        return Array.isArray(ar);
                    }
                    exports.isArray = isArray;
                    function isBoolean(arg) {
                        return typeof arg === 'boolean';
                    }
                    exports.isBoolean = isBoolean;
                    function isNull(arg) {
                        return arg === null;
                    }
                    exports.isNull = isNull;
                    function isNullOrUndefined(arg) {
                        return arg == null;
                    }
                    exports.isNullOrUndefined = isNullOrUndefined;
                    function isNumber(arg) {
                        return typeof arg === 'number';
                    }
                    exports.isNumber = isNumber;
                    function isString(arg) {
                        return typeof arg === 'string';
                    }
                    exports.isString = isString;
                    function isSymbol(arg) {
                        return typeof arg === 'symbol';
                    }
                    exports.isSymbol = isSymbol;
                    function isUndefined(arg) {
                        return arg === void 0;
                    }
                    exports.isUndefined = isUndefined;
                    function isRegExp(re) {
                        return isObject(re) && objectToString(re) === '[object RegExp]';
                    }
                    exports.isRegExp = isRegExp;
                    function isObject(arg) {
                        return typeof arg === 'object' && arg !== null;
                    }
                    exports.isObject = isObject;
                    function isDate(d) {
                        return isObject(d) && objectToString(d) === '[object Date]';
                    }
                    exports.isDate = isDate;
                    function isError(e) {
                        return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
                    }
                    exports.isError = isError;
                    function isFunction(arg) {
                        return typeof arg === 'function';
                    }
                    exports.isFunction = isFunction;
                    function isPrimitive(arg) {
                        return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
                        typeof arg === 'undefined';
                    }
                    exports.isPrimitive = isPrimitive;
                    exports.isBuffer = require('./support/isBuffer');
                    function objectToString(o) {
                        return Object.prototype.toString.call(o);
                    }
                    function pad(n) {
                        return n < 10 ? '0' + n.toString(10) : n.toString(10);
                    }
                    var months = [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ];
                    // 26 Feb 16:19:34
                    function timestamp() {
                        var d = new Date();
                        var time = [
                            pad(d.getHours()),
                            pad(d.getMinutes()),
                            pad(d.getSeconds())
                        ].join(':');
                        return [
                            d.getDate(),
                            months[d.getMonth()],
                            time
                        ].join(' ');
                    }
                    // log is just a thin wrapper to console.log that prepends a timestamp
                    exports.log = function () {
                        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
                    };
                    /**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
                    exports.inherits = require('inherits');
                    exports._extend = function (origin, add) {
                        // Don't do anything if add isn't an object
                        if (!add || !isObject(add))
                            return origin;
                        var keys = Object.keys(add);
                        var i = keys.length;
                        while (i--) {
                            origin[keys[i]] = add[keys[i]];
                        }
                        return origin;
                    };
                    function hasOwnProperty(obj, prop) {
                        return Object.prototype.hasOwnProperty.call(obj, prop);
                    }
                }.call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {
                './support/isBuffer': 57,
                '_process': 26,
                'inherits': 56
            }
        ],
        59: [
            function (require, module, exports) {
                /**
 * Copyright 2016 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                (function (factory) {
                    if (typeof module === 'object' && typeof module.exports === 'object') {
                        var v = factory(require, exports);
                        if (v !== undefined)
                            module.exports = v;
                    } else if (typeof define === 'function' && define.amd) {
                        define([
                            'require',
                            'exports'
                        ], factory);
                    }
                }(function (require, exports) {
                    'use strict';
                    /**
     * @author Hovhannes Babayan <bhovhannes at gmail dot com>
     */
                    /**
     * Prefix for identifying a Sort field. Value is "_1_Sort" for first sort field, "_2_Sort", "_3_Sort" ... "_n_Sort".
     * @readonly
     * @type {String}
     */
                    exports.SORT = '_Sort';
                    /**
     * Suffix for specifying expression operators (ApiConstants.Operators) on a field. Value is "_Mod".
     * @readonly
     * @type {String}
     */
                    exports.MOD = '_Mod';
                    /**
     * A delimiter which is used to separate field name and its order key.<br/>
     * Can be used for filters, sorting, etc.<br/>
     * Example: <code>{name_1_Sort: 'ASC', id_2_Sort: 'DESC'}</code>
     * @readonly
     * @type {String}
     */
                    exports.ORDERDOT = '_';
                    /**
     * Key used to specify the index of the first result to return starting with .
     * @readonly
     * @type {String}
     */
                    exports.FIRST = '$$FIRST';
                    /**
     * Key used to specify a limit on the number of results. If this key is present, the value is used.<br/>
     * If this value cannot be parsed or if it is less than or equal to 0, no limit is enforced.<br/>
     * Value is "$$LIMIT"<br/>
     * @readonly
     * @type {String}
     */
                    exports.LIMIT = '$$LIMIT';
                    /**
     * Prefix used to identify an Data Extension parameter in the Query framework.<br/>
     * Used for retrieval of custom data fields.<br/>
     * @readonly
     * @type {String}
     */
                    exports.DATAEXTENSION = 'DE:';
                    /**
     * Suffix for specifying which fields will be added to the GROUP BY clause in a ReportQuery. Value is "_GroupBy".
     * @readonly
     * @type {String}
     */
                    exports.GROUPBY = '_GroupBy';
                    /**
     * Suffix for specifying force "_GroupBy". Value is "$$_ForceGroupBy".
     */
                    exports.FORCE_GROUPBY = '$$_ForceGroupBy';
                    /**
     * Suffix for specifying aggregate functions in a ReportQuery. Value is "_AggFunc".
     */
                    exports.AGGFUNC = '_AggFunc';
                    /**
     * Suffix for specifying comma-separated list of aggregated currency fields for the report
     */
                    exports.AGGCURRENCY_FIELDS = '$$AggCurr';
                    exports.GROUPCURRENCY_FIELDS = '$$GroupCurr';
                    exports.SORTCURRENCY_FIELDS = '$$SortCurr';
                    exports.FILTERCURRENCY_FIELDS = '$$FilterCurr';
                    /**
     * Key used to specify that a GROUP BY query should be done WITH ROLLUP. Value is "$$ROLLUP"
     */
                    exports.ROLLUP = '$$ROLLUP';
                    /**
     * Prefix for constants.
     * @readonly
     * @type {String}
     */
                    exports.INTERNAL_PREFIX = '$$';
                    /**
     * Values which can be used as wildcards
     * @readonly
     * @enum {String}
     */
                    exports.WildCards = {
                        /**
         * Wildcard value for midnight (12:00AM) of the current Date. Wildcards are useful for Saved Searches.<br/>
         * If this value is passed in for any search value, it is replaced with the current date.<br/>
         * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]<br/>
         *    <code>$$TODAY+1d</code> would equal 12:00AM of the next day<br/>
         *    <code>$$TODAY-1d</code> would equal 12:00AM of the previous day<br/>
         *    <code>$$TODAY+2w</code> would equal 12:00AM of 2 weeks from today<br/>
         *    <code>$$TODAY+2m</code> would equal 12:00AM of 2 months from today<br/>
         *    <code>$$TODAYb</code> "the beginning of today" would equal 12:00AM today<br/>
         *    <code>$$TODAYe</code> "the end of today" would equal 12:00AM tomorrow<br/>
         *    <code>$$TODAYbm</code> "the beginning of the month" would equal 12:00AM of the first day of the month<br/>
         *    <code>$$TODAYe+1w</code> "the end of next week" would equal 12:00AM Sunday following the Saturday of next week<br/>
         * Value is "$$TODAY"<br/>
         */
                        TODAY: '$$TODAY',
                        /**
         * Wildcard value for the current time of the current Date. Wildcards are useful for Saved Searches.<br/>
         * If this value is passed in for any search value, it is replaced with the current date and time.<br/>
         * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]<br/>
         *    <code>$$NOW+1d</code> would equal the same time on the next day<br/>
         *    <code>$$NOW-1d</code> would equal the same time on the previous day<br/>
         *    <code>$$NOW+2w</code> would equal the same time on 2 weeks from now<br/>
         *    <code>$$NOW+2m</code> would equal the same time on 2 months from now<br/>
         * Value is "$$NOW"
         */
                        NOW: '$$NOW',
                        /**
         * Wildcard value for the currently authenticated User. Wildcards are useful for Saved Searches.<br/>
         * If this value is passed in for any search value, it is replaced with an attribute from the current User.<br/>
         * The following suffixes can be used: <code>.[ID(default)|homeGroupID|accessLevelID|categoryID|companyID|roleID|roleIDs|otherGroupIDs|accessLevelRank]</code><br/>
         *    <code>$$USER</code> would equal the current User's ID<br/>
         *    <code>$$USER.homeGroupID</code> would equal the current User's Home Group ID<br/>
         *    <code>$$USER.accessLevelID</code> would equal the current User's Access Level ID<br/>
         *    <code>$$USER.otherGroupIDs</code> would equal the all of the current User's Other Group IDs. This would translate into an "IN" clause for that queried field.<br/>
         *    <code>$$USER.roleIDs</code> would equal the all of the current User's Roles. This would translate into an "IN" clause for that queried field.<br/>
         *    <code>$$USER.roleID</code> would equal the all of the current User's Primary Role ID.<br/>
         * Value is "$$USER"
         */
                        USER: '$$USER',
                        /**
         * Wildcard value for the account Customer. Wildcards are useful for Saved Searches.<br/>
         * If this value is passed in for any search value, it is replaced with an attribute from the Customer.<br/>
         */
                        CUSTOMER: '$$CUSTOMER',
                        /**
         * Wildcard value for the account representative User. Wildcards are useful for Saved Searches.<br/>
         * If this value is passed in for any search value, it is replaced with an attribute from the Account representative.<br/>
         */
                        ACCOUNTREP: '$$AR'
                    };
                    /**
     * How to sort the result
     * @readonly
     * @enum {String}
     */
                    exports.SortOrder = {
                        /**
         * Ascending Sort. Value is "asc".
         */
                        ASC: 'asc',
                        /**
         * Descending Sort. Value is "desc".
         */
                        DESC: 'desc',
                        /**
         * Case-Insensitive Ascending Sort. Value is "ciasc".
         */
                        CIASC: 'ciasc',
                        /**
         * Case-Insensitive Descending Sort. Value is "cidesc".
         */
                        CIDESC: 'cidesc'
                    };
                    /**
     * Modifiers which can be used with filters (Mod suffix)
     * @readonly
     * @enum {String}
     */
                    exports.Operators = {
                        /**
         * Produces the SQL expression <code>field < value</code>. Value is "lt".
         */
                        LESSTHAN: 'lt',
                        /**
         * Produces the SQL expression <code>field <= value</code>. Value is "lte".
         **/
                        LESSTHANEQUAL: 'lte',
                        /**
         * Produces the SQL expression <code>field > value</code>. Value is "gt".
         **/
                        GREATERTHAN: 'gt',
                        /**
         * Produces the SQL expression <code>field >= value</code>. Value is "gte".
         **/
                        GREATERTHANEQUAL: 'gte',
                        /**
         * Produces the SQL expression <code>field = value</code><br/>
         * Note that this is the default Modifier used when 1 value exists. Value is "eq".
         **/
                        EQUAL: 'eq',
                        /**
         * Produces the SQL expression <code>UPPER(field) = UPPER(value)</code>. Value is "cieq".
         **/
                        CIEQUAL: 'cieq',
                        /**
         * Produces the SQL expression <code>field <> value or field is null</code>. Value is "ne".
         **/
                        NOTEQUAL: 'ne',
                        /**
         * Produces the SQL expression <code>field <> value</code>. This differs from NOTEQUAL in that null results are not
         * returned. Value is "nee".
         **/
                        NOTEQUALEXACT: 'nee',
                        /**
         * Produces the SQL expression <code>UPPER(field) <> UPPER(value)</code>. Value is "cine".
         **/
                        CINOTEQUAL: 'cine',
                        /**
         * Produces the SQL expression <code>field LIKE '%value%'</code>. Value is "contains".
         **/
                        CONTAINS: 'contains',
                        /**
         * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value%')</code>. Value is "cicontains".
         **/
                        CICONTAINS: 'cicontains',
                        /**
         * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') OR UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
         **/
                        CICONTAINSANY: 'cicontainsany',
                        /**
         * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
         **/
                        CICONTAINSALL: 'cicontainsall',
                        /**
         * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
         **/
                        CINOTCONTAINSALL: 'cinotcontainsall',
                        /**
         * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
         **/
                        CINOTCONTAINSANY: 'cinotcontainsany',
                        /**
         * Produces the SQL expression <code>field NOT LIKE '%value%'</code>. Value is "notcontains".
         **/
                        NOTCONTAINS: 'notcontains',
                        /**
         * Produces the SQL expression <code>UPPER(field) NOT LIKE UPPER('%value%')</code>. Value is "cinotcontains".
         **/
                        CINOTCONTAINS: 'cinotcontains',
                        /**
         * Produces the SQL expression <code>field LIKE 'value'</code>
         * where value can contain replacement characters such as % and _. Value is "like".
         **/
                        LIKE: 'like',
                        /**
         * Produces the SQL expression <code>UPPER(field) LIKE UPPER('value')</code>
         * where value can contain replacement characters such as % and _. Value is "cilike".
         **/
                        CILIKE: 'cilike',
                        /**
         * Produces the SQL expression <code>UPPER(field) LIKE UPPER('value%')</code>. Value is "startswith".
         **/
                        STARTSWITH: 'startswith',
                        /**
         * Produces the SQL expression <code>SOUNDEX(field) = SOUNDEX(value)</code>. Value is "soundex".
         **/
                        SOUNDEX: 'soundex',
                        /**
         * Use of this Modifier requires the inclusion of a <code>value_Range</code> parameter.<br/>
         * Produces the SQL expression <code>field BETWEEN value AND value_Range</code>.<br/>
         * Note that this is the default Modifier used when a <code>_Range</code> value exists. Value is "between".
         **/
                        BETWEEN: 'between',
                        /**
         * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
         * Produces the SQL expression <code>UPPER(field) BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cibetween".
         **/
                        CIBETWEEN: 'cibetween',
                        /**
         * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
         * Produces the SQL expression <code>fieldNOT BETWEEN value AND value_Range</code>. Value is "notbetween".
         **/
                        NOTBETWEEN: 'notbetween',
                        /**
         * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
         * Produces the SQL expression <code>UPPER(field)NOT BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cinotbetween".
         **/
                        CINOTBETWEEN: 'cinotbetween',
                        /**
         * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
         * Produces the SQL expression <code>field IN ( value1, value2, ..., valuen)</code><br/>
         * Note that this is the default Modifier used when multiple <code>value</code> fields exist. Value is "in".
         **/
                        IN: 'in',
                        /**
         * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
         * Produces the SQL expression <code>UPPER(field) IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
         **/
                        CIIN: 'ciin',
                        /**
         * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
         * Produces the SQL expression <code>field NOT IN ( value1, value2, ..., valuen)</code>. Value is "notin".
         **/
                        NOTIN: 'notin',
                        /**
         * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
         * Produces the SQL expression <code>UPPER(field) NOT IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
         **/
                        CINOTIN: 'cinotin',
                        /**
         * Produces the SQL expression <code>field & value > 0</code>. Value is "bitwiseor".<br/>
         * Useful for checking if any of a group of bits is set.
         **/
                        BITWISE_OR: 'bitwiseor',
                        /**
         * Produces the SQL expression <code>field & value = value</code>. Value is "bitwiseand".<br/>
         * Useful for checking if all of a group of bits is set.
         **/
                        BITWISE_AND: 'bitwiseand',
                        /**
         * Produces the SQL expression <code>field & value = 0</code>. Value is "bitwisenand".<br/>
         * Useful for checking if none of a group of bits is set.
         **/
                        BITWISE_NAND: 'bitwisenand',
                        /**
         * By default, searches for a date value generate the following SQL filter <code>field between <00:00:00:000 of day> and <23:59:59:999 of day></code>.<br/>
         * This is for convenience so that date searches return any match on items that fall on that date.<br/>
         * However, if it is desired to find an exact match on a specific time of day as well as the date, this Modifier enforces that rule.<br/>
         * The SQL filter generated by this Modifier is <code>field = value</code>. Value is "exacttime".
         */
                        EXACT_TIME: 'exacttime',
                        /**
         * Searches based on the string length of the given field.
         */
                        LENGTH_LT: 'length_lt',
                        LENGTH_EQ: 'length_eq',
                        LENGTH_GT: 'length_gt',
                        /**
         * Used for DE queries that allow multiple values.<br/>
         * This Modifier requires that DE fields have all of the specified values. Value is "allof".
         */
                        ALLOF: 'allof',
                        /**
         * Produces the SQL expression <code>field IS NULL</code>.<br/>
         * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isnull".
         */
                        ISNULL: 'isnull',
                        /**
         * Produces the SQL expression <code>field IS NOT NULL</code>.<br/>
         * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notnull".
         */
                        NOTNULL: 'notnull',
                        /**
         * Produces the SQL expression <code>field IS NULL OR field = ''</code>.<br/>
         * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isblank".
         */
                        ISBLANK: 'isblank',
                        /**
         * Produces the SQL expression <code>field IS NOT NULL AND field <> ''</code>.<br/>
         * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notblank".
         */
                        NOTBLANK: 'notblank'
                    };
                    /**
     * Aggregate functions which can be used with the AGGFUNC suffix.
     * @readonly
     * @enum {String}
     */
                    exports.Functions = {
                        /**
         * Maximum value aggregate function.<br/>
         * Can only be used with the AGGFUNC suffix. Value is "max".
         */
                        MAX: 'max',
                        /**
         * Minimum value aggregate function.<br/>
         * Can only be used with the AGGFUNC suffix. Value is "min".
         **/
                        MIN: 'min',
                        /**
         * Average value aggregate function.<br/>
         * Can only be used with the AGGFUNC suffix. Value is "avg".
         **/
                        AVG: 'avg',
                        /**
         * Summation aggregate function.
         * Can only be used with the AGGFUNC suffix. Value is "sum".
         **/
                        SUM: 'sum',
                        /**
         * Count aggregate function.<br/>
         * Can only be used with the AGGFUNC suffix. Value is "count".
         **/
                        COUNT: 'count',
                        /**
         * Standard Deviation aggregate function.<br/>
         * Can only be used with the AGGFUNC suffix. Value is "std".
         **/
                        STD: 'std',
                        /**
         * Variance aggregate function.<br/>
         * Can only be used with the AGGFUNC suffix. Value is "var".
         **/
                        VAR: 'var',
                        /**
         * Maximum value aggregate function (distinct mode).<br/>
         * Can only be used with the AGGFUNC suffix. Value is "dmax".
         **/
                        DMAX: 'dmax',
                        /**
         * Minimum value aggregate function (distinct mode).<br/>
         * Can only be used with the AGGFUNC suffix. Value is "dmin".
         **/
                        DMIN: 'dmin',
                        /**
         * Average value aggregate function (distinct mode).<br/>
         * Can only be used with the AGGFUNC suffix. Value is "davg".
         **/
                        DAVG: 'davg',
                        /**
         * Summation aggregate function (distinct mode).<br/>
         * Can only be used with the AGGFUNC suffix. Value is "dsum".
         **/
                        DSUM: 'dsum',
                        /**
         * Count aggregate function (distinct mode).<br/>
         * Can only be used with the AGGFUNC suffix. Value is "dcount".
         **/
                        DCOUNT: 'dcount',
                        /**
         * Standard Deviation aggregate function (distinct mode).<br/>
         * Can only be used with the AGGFUNC suffix. Value is "dstd".
         **/
                        DSTD: 'dstd',
                        /**
         * Variance aggregate function (distinct mode).<br/>
         * Can only be used with the AGGFUNC suffix. Value is "dvar".
         **/
                        DVAR: 'dvar'
                    };
                }));
            },
            {}
        ],
        60: [
            function (require, module, exports) {
                module.exports = extend;
                var hasOwnProperty = Object.prototype.hasOwnProperty;
                function extend() {
                    var target = {};
                    for (var i = 0; i < arguments.length; i++) {
                        var source = arguments[i];
                        for (var key in source) {
                            if (hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                    return target;
                }
            },
            {}
        ],
        61: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                var url = require('url'), http = require('http'), https = require('https');
                /**
 * Creates new Api instance.
 * @param {Object} config   An object with the following keys:<br/>
 *     <code>url</code> {String} - Required. A url to Workfront server (for example: http://localhost:8080)<br/>
 *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'unsupported' to use Workfront latest API (maybe unstable).<br/>
 *     <code>alwaysUseGet</code> {Boolean} - Optional. Defaults to false. Will cause the api to make every request as a GET with params in the query string and add method=DESIRED_METHOD_TYPE in the query string. Some Workfront urls will have issues with PUT and DELETE calls if this value is false.<br/>
 *     <code>secureProtocol</code> {String} - Optional. Used only in https. The SSL method to use, e.g. TLSv1_method to force TLS version 1. The possible values depend on your installation of OpenSSL and are defined in the constant {@link http://www.openssl.org/docs/ssl/ssl.html#DEALING_WITH_PROTOCOL_METHODS|SSL_METHODS}.
 * @constructor
 * @memberOf Workfront
 */
                function Api(config) {
                    var parsed = url.parse(config.url), isHttps = parsed.protocol === 'https:';
                    // Create the request
                    this.httpTransport = isHttps ? https : http;
                    this.httpOptions = {
                        protocol: parsed.protocol,
                        host: parsed.hostname,
                        port: parsed.port || (isHttps ? 443 : 80),
                        withCredentials: false,
                        headers: {},
                        //=== true to make undefined result in false
                        alwaysUseGet: config.alwaysUseGet === true
                    };
                    // These params will be sent with each request
                    this.httpParams = {};
                    if (isHttps) {
                        this.httpOptions.secureProtocol = config.secureProtocol || 'TLSv1_method';
                        this.httpOptions.agent = false;
                    }
                    // Append version to path if provided
                    var path;
                    if (config.version === 'internal' || config.version === 'unsupported') {
                        path = '/attask/api-' + config.version;
                    } else {
                        path = '/attask/api';
                        if (config.version) {
                            path = path + '/v' + config.version;
                        }
                    }
                    this.httpOptions.path = path;
                }
                Api.Methods = {
                    GET: 'GET',
                    PUT: 'PUT',
                    DELETE: 'DELETE',
                    POST: 'POST'
                };
                require('./plugins/request')(Api);
                require('./plugins/login')(Api);
                require('./plugins/logout')(Api);
                require('./plugins/search')(Api);
                require('./plugins/get')(Api);
                require('./plugins/create')(Api);
                require('./plugins/edit')(Api);
                require('./plugins/remove')(Api);
                require('./plugins/report')(Api);
                require('./plugins/count')(Api);
                require('./plugins/copy')(Api);
                require('./plugins/execute')(Api);
                require('./plugins/namedQuery')(Api);
                require('./plugins/metadata')(Api);
                require('./plugins/apiKey')(Api);
                if (typeof window === 'undefined') {
                    //These plugins only work in node
                    require('./plugins/upload')(Api);
                }
                module.exports = Api;
            },
            {
                './plugins/apiKey': 64,
                './plugins/copy': 65,
                './plugins/count': 66,
                './plugins/create': 67,
                './plugins/edit': 68,
                './plugins/execute': 69,
                './plugins/get': 70,
                './plugins/login': 71,
                './plugins/logout': 72,
                './plugins/metadata': 73,
                './plugins/namedQuery': 74,
                './plugins/remove': 75,
                './plugins/report': 76,
                './plugins/request': 77,
                './plugins/search': 78,
                './plugins/upload': 79,
                'http': 47,
                'https': 16,
                'url': 53
            }
        ],
        62: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                var Api = require('./Api'), _instance;
                /**
 * @name ApiFactory
 * @memberOf Workfront
 * @namespace
 */
                module.exports = {
                    /**
     * Returns an Api instance. Creates a new one if no instance exists.<br/>
     * One can use this if Api is intended to be used as singleton.
     * @memberOf Workfront.ApiFactory
     * @param {Object} config   An object with the following keys:<br/>
     *     <code>url</code> {String} - Required. An url to Workfront server (for example: http://localhost:8080)<br/>
     *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'internal' to use Workfront internal API (this is the latest version, maybe unstable)
     * @param {Boolean} [returnNewInstance]    If true, always creates a new instance
     * @return {Api}
     */
                    getInstance: function (config, returnNewInstance) {
                        if (returnNewInstance) {
                            return new Api(config);
                        } else {
                            if (!_instance) {
                                if (typeof config !== 'object') {
                                    throw new Error('Please provide configuration as an object.');
                                }
                                _instance = new Api(config);
                            }
                            return _instance;
                        }
                    },
                    /**
     * Removes previously created Api instance.
     * @memberOf Workfront.ApiFactory
     */
                    deleteInstance: function () {
                        _instance = undefined;
                    }
                };
            },
            { './Api': 61 }
        ],
        63: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                /**
 * @name ApiUtil
 * @memberOf Workfront
 * @namespace
 */
                module.exports = {};
            },
            {}
        ],
        64: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Used to obtain an API key
     * @memberOf Workfront.Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with API key if everything went ok and rejected otherwise
     */
                    Api.prototype.getApiKey = function (username, password) {
                        var that = this;
                        return new Promise(function (resolve, reject) {
                            if (typeof that.httpParams.apiKey !== 'undefined') {
                                resolve(that.httpParams.apiKey);
                            } else {
                                that.execute('USER', null, 'getApiKey', {
                                    username: username,
                                    password: password
                                }).then(function (data) {
                                    that.httpParams.apiKey = data.result;
                                    resolve(that.httpParams.apiKey);
                                }, reject);
                            }
                        });
                    };
                    /**
     * Invalidates the current API key.
     * Call this to be able to retrieve a new one using getApiKey().
     * @memberOf Workfront.Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
                    Api.prototype.clearApiKey = function () {
                        return new Promise(function (resolve, reject) {
                            this.execute('USER', null, 'clearApiKey').then(function (result) {
                                if (result) {
                                    delete this.httpParams.apiKey;
                                    resolve();
                                } else {
                                    reject();
                                }
                            }.bind(this));
                        }.bind(this));
                    };
                };
            },
            {}
        ],
        65: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Copies an existing object with making changes on a copy.
     * Copying is supported only for some objects. The {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} page displays which objects support the Copy action.
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object to copy
     * @param {Object} updates    Which fields to set on copied object. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
                    Api.prototype.copy = function (objCode, objID, updates, fields) {
                        var params = { copySourceID: objID };
                        if (updates) {
                            params.updates = JSON.stringify(updates);
                        }
                        return this.request(objCode, params, fields, Api.Methods.POST);
                    };
                };
            },
            {}
        ],
        66: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Used to retrieve number of objects matching given search criteria
     * @memberOf Workfront.Api
     * @param {String} objCode
     * @param {Object} query    An object with search criteria
     * @return {Promise}
     */
                    Api.prototype.count = function (objCode, query) {
                        return this.request(objCode + '/count', query, null, Api.Methods.GET).then(function (data) {
                            return data.count;
                        });
                    };
                };
            },
            {}
        ],
        67: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Creates a new object.
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} params    Values of fields to be set for the new object. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields of newly created object to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with the ID and any other specified fields of newly created object
     */
                    Api.prototype.create = function (objCode, params, fields) {
                        return this.request(objCode, params, fields, Api.Methods.POST);
                    };
                };
            },
            {}
        ],
        68: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Edits an existing object
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object to modify
     * @param {Object} updates    Which fields to set. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
                    Api.prototype.edit = function (objCode, objID, updates, fields) {
                        var params = { updates: JSON.stringify(updates) };
                        return this.request(objCode + '/' + objID, params, fields, Api.Methods.PUT);
                    };
                };
            },
            {}
        ],
        69: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Executes an action for the given object
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object. Optional, pass null or undefined to omit
     * @param {String} action    An action to execute. A list of allowed actions are available within the {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [actionArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
                    Api.prototype.execute = function (objCode, objID, action, actionArgs) {
                        var endPoint = objCode;
                        if (objID) {
                            endPoint += '/' + objID + '/' + action;
                        } else {
                            actionArgs = actionArgs || {};
                            actionArgs['action'] = action;
                        }
                        return this.request(endPoint, actionArgs, null, Api.Methods.PUT);
                    };
                };
            },
            {}
        ],
        70: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                var INTERNAL_PREFIX = require('workfront-api-constants/dist/umd/constants').INTERNAL_PREFIX;
                module.exports = function (Api) {
                    /**
     * Used for retrieve an object or multiple objects.
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
                    Api.prototype.get = function (objCode, objIDs, fields) {
                        if (typeof objIDs === 'string') {
                            objIDs = [objIDs];
                        }
                        var endPoint = objCode, params = null;
                        if (objIDs.length === 1) {
                            if (objIDs[0].indexOf(INTERNAL_PREFIX) === 0) {
                                params = { id: objIDs[0] };
                            } else {
                                endPoint += '/' + objIDs[0];
                            }
                        } else {
                            params = { id: objIDs };
                        }
                        return this.request(endPoint, params, fields, Api.Methods.GET);
                    };
                };
            },
            { 'workfront-api-constants/dist/umd/constants': 59 }
        ],
        71: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Logs in into Workfront. Should be a first call to Workfront API.
     * Other calls should be made after this one will be completed.
     * @memberOf Workfront.Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with logged in user data if everything went ok and rejected otherwise
     */
                    Api.prototype.login = function (username, password) {
                        return this.request('login', {
                            username: username,
                            password: password
                        }, null, Api.Methods.POST).then(function (data) {
                            this.httpOptions.headers.sessionID = data.sessionID;
                            return data;
                        }.bind(this));
                    };
                };
            },
            {}
        ],
        72: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Logs out from Workfront
     * @memberOf Workfront.Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
                    Api.prototype.logout = function () {
                        return new Promise(function (resolve, reject) {
                            this.request('logout', null, null, Api.Methods.GET).then(function (result) {
                                if (result && result.success) {
                                    delete this.httpOptions.headers.sessionID;
                                    resolve();
                                } else {
                                    reject();
                                }
                            }.bind(this));
                        }.bind(this));
                    };
                };
            },
            {}
        ],
        73: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Retrieves API metadata for an object.
     * @memberOf Workfront.Api
     * @param {String} [objCode]    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}. If omitted will return list of objects available in API.
     * @return {Promise}    A promise which will resolved with object metadata if everything went ok and rejected otherwise
     */
                    Api.prototype.metadata = function (objCode) {
                        var path = '/metadata';
                        if (objCode) {
                            path = objCode + path;
                        }
                        return this.request(path, null, null, Api.Methods.GET);
                    };
                };
            },
            {}
        ],
        74: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Executes a named query for the given obj code
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} query    A query to execute. A list of allowed named queries are available within the {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [queryArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with received data if everything went ok and rejected with error info otherwise
     */
                    Api.prototype.namedQuery = function (objCode, query, queryArgs, fields) {
                        return this.request(objCode + '/' + query, queryArgs, fields, Api.Methods.GET);
                    };
                };
            },
            {}
        ],
        75: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Deletes an object
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object
     * @param {Boolean} [bForce]    Pass true to cause the server to remove the specified data and its dependants
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
                    Api.prototype.remove = function (objCode, objID, bForce) {
                        return new Promise(function (resolve, reject) {
                            var params = bForce ? { force: true } : null;
                            this.request(objCode + '/' + objID, params, null, Api.Methods.DELETE).then(function (result) {
                                if (result && result.success) {
                                    resolve();
                                } else {
                                    reject();
                                }
                            }, reject);
                        }.bind(this));
                    };
                };
            },
            {}
        ],
        76: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Performs report request, where only the aggregate of some field is desired, with one or more groupings.
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} query    An object with search criteria and aggregate functions
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
                    Api.prototype.report = function (objCode, query) {
                        return this.request(objCode + '/report', query, null, Api.Methods.GET);
                    };
                };
            },
            {}
        ],
        77: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                var queryString = require('querystring'), util = require('util');
                module.exports = function (Api) {
                    var requestHasData = function (method) {
                        return method !== Api.Methods.GET && method !== Api.Methods.PUT;
                    };
                    Api.prototype._handleResponse = function (resolve, reject) {
                        return function (response) {
                            var body = '';
                            if (typeof response.setEncoding === 'function') {
                                response.setEncoding('utf8');
                            }
                            response.on('data', function (chunk) {
                                body += chunk;
                            });
                            response.on('end', function () {
                                var data;
                                try {
                                    data = JSON.parse(body);
                                } catch (e) {
                                    reject(body);
                                    return;
                                }
                                if (data.error) {
                                    reject(data);
                                } else {
                                    resolve(data.data);
                                }
                            });
                        };
                    };
                    Api.prototype.request = function (path, params, fields, method) {
                        fields = fields || [];
                        if (typeof fields === 'string') {
                            fields = [fields];
                        }
                        params = params || {};
                        util._extend(params, this.httpParams);
                        var options = {}, alwaysUseGet = this.httpOptions.alwaysUseGet;
                        util._extend(options, this.httpOptions);
                        if (alwaysUseGet) {
                            params.method = method;
                        } else {
                            options.method = method;
                        }
                        if (path.indexOf('/') === 0) {
                            options.path = this.httpOptions.path + path;
                        } else {
                            options.path = this.httpOptions.path + '/' + path;
                        }
                        if (fields.length !== 0) {
                            params.fields = fields.join();
                        }
                        params = queryString.stringify(params);
                        if (params) {
                            if (!alwaysUseGet && requestHasData(options.method)) {
                                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                                options.headers['Content-Length'] = params.length;
                            } else {
                                options.path += '?' + params;
                            }
                        }
                        var httpTransport = this.httpTransport;
                        return new Promise(function (resolve, reject) {
                            var request = httpTransport.request(options, this._handleResponse(resolve, reject));
                            request.on('error', reject);
                            if (!alwaysUseGet && params && requestHasData(options.method)) {
                                request.write(params);
                            }
                            request.end();
                        }.bind(this));
                    };
                };
            },
            {
                'querystring': 34,
                'util': 58
            }
        ],
        78: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Used for object retrieval by multiple search criteria.
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} query    An object with search criteria
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
     */
                    Api.prototype.search = function (objCode, query, fields) {
                        return this.request(objCode + '/search', query, fields, Api.Methods.GET);
                    };
                };
            },
            {}
        ],
        79: [
            function (require, module, exports) {
                /**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                var FormData = require('form-data'), util = require('util');
                /**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Matt Winchester <mwinche at gmail dot com>
 */
                module.exports = function (Api) {
                    /**
     * Starting from version 2.0 API allows users to upload files.
     * The server will return the JSON data which includes 'handle' of uploaded file.
     * Returned 'handle' can be passed to create() method to create a new document.
     * This method is not available for browser execution environments and it is available only for Node.
     * @memberOf Workfront.Api
     * @param {fs.ReadStream} stream    A readable stream with file contents
     * @param {Object} [overrides] Override the filename and content type (using keys
     * `filename` and `contentType` respectively).
     */
                    Api.prototype.upload = function (stream, overrides) {
                        var form = new FormData();
                        form.append('uploadedFile', stream, overrides);
                        var options = { method: 'POST' };
                        util._extend(options, this.httpOptions);
                        options.headers = form.getHeaders();
                        options.headers.sessionID = this.httpOptions.headers.sessionID;
                        options.path += '/upload';
                        delete options.headers['Content-Length'];
                        var httpTransport = this.httpTransport;
                        return new Promise(function (resolve, reject) {
                            var request = httpTransport.request(options, this._handleResponse(resolve, reject));
                            form.pipe(request);
                            request.on('error', reject);
                        }.bind(this));
                    };
                };
            },
            {
                'form-data': 15,
                'util': 58
            }
        ]
    }, {}, [1])(1);
}));