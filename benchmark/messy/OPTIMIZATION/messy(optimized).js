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
        g.messy = f();
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
        2: [
            function (require, module, exports) {
            },
            {}
        ],
        3: [
            function (require, module, exports) {
                (function (global) {
                    'use strict';
                    var buffer = require(4);
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
            { '4': 4 }
        ],
        4: [
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
                    var base64 = require(1);
                    var ieee754 = require(7);
                    var isArray = require(10);
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
                '1': 1,
                '10': 10,
                '7': 7
            }
        ],
        5: [
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
                }.call(this, { 'isBuffer': require(9) }));
            },
            { '9': 9 }
        ],
        6: [
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
        7: [
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
        8: [
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
        9: [
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
        10: [
            function (require, module, exports) {
                var toString = {}.toString;
                module.exports = Array.isArray || function (arr) {
                    return toString.call(arr) == '[object Array]';
                };
            },
            {}
        ],
        11: [
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
                }.call(this, require(12)));
            },
            { '12': 12 }
        ],
        12: [
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
        13: [
            function (require, module, exports) {
                module.exports = require(14);
            },
            { '14': 14 }
        ],
        14: [
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
                var processNextTick = require(11);
                /*</replacement>*/
                /*<replacement>*/
                var util = require(5);
                util.inherits = require(8);
                /*</replacement>*/
                var Readable = require(16);
                var Writable = require(18);
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
                '11': 11,
                '16': 16,
                '18': 18,
                '5': 5,
                '8': 8
            }
        ],
        15: [
            function (require, module, exports) {
                // a passthrough stream.
                // basically just the most minimal sort of Transform stream.
                // Every written chunk gets output as-is.
                'use strict';
                module.exports = PassThrough;
                var Transform = require(17);
                /*<replacement>*/
                var util = require(5);
                util.inherits = require(8);
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
                '17': 17,
                '5': 5,
                '8': 8
            }
        ],
        16: [
            function (require, module, exports) {
                (function (process) {
                    'use strict';
                    module.exports = Readable;
                    /*<replacement>*/
                    var processNextTick = require(11);
                    /*</replacement>*/
                    /*<replacement>*/
                    var isArray = require(10);
                    /*</replacement>*/
                    Readable.ReadableState = ReadableState;
                    /*<replacement>*/
                    var EE = require(6).EventEmitter;
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
                                Stream = require(6).EventEmitter;
                        }
                    }());
                    /*</replacement>*/
                    var Buffer = require(4).Buffer;
                    /*<replacement>*/
                    var bufferShim = require(3);
                    /*</replacement>*/
                    /*<replacement>*/
                    var util = require(5);
                    util.inherits = require(8);
                    /*</replacement>*/
                    /*<replacement>*/
                    var debugUtil = require(2);
                    var debug = void 0;
                    if (debugUtil && debugUtil.debuglog) {
                        debug = debugUtil.debuglog('stream');
                    } else {
                        debug = function () {
                        };
                    }
                    /*</replacement>*/
                    var BufferList = require(19);
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
                        Duplex = Duplex || require(14);
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
                                StringDecoder = require(25).StringDecoder;
                            this.decoder = new StringDecoder(options.encoding);
                            this.encoding = options.encoding;
                        }
                    }
                    var Duplex;
                    function Readable(options) {
                        Duplex = Duplex || require(14);
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
                            StringDecoder = require(25).StringDecoder;
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
                }.call(this, require(12)));
            },
            {
                '10': 10,
                '11': 11,
                '12': 12,
                '14': 14,
                '19': 19,
                '2': 2,
                '25': 25,
                '3': 3,
                '4': 4,
                '5': 5,
                '6': 6,
                '8': 8
            }
        ],
        17: [
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
                var Duplex = require(14);
                /*<replacement>*/
                var util = require(5);
                util.inherits = require(8);
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
                '14': 14,
                '5': 5,
                '8': 8
            }
        ],
        18: [
            function (require, module, exports) {
                (function (process) {
                    // A bit simpler than readable streams.
                    // Implement an async ._write(chunk, encoding, cb), and it'll handle all
                    // the drain event emission and buffering.
                    'use strict';
                    module.exports = Writable;
                    /*<replacement>*/
                    var processNextTick = require(11);
                    /*</replacement>*/
                    /*<replacement>*/
                    var asyncWrite = !process.browser && [
                        'v0.10',
                        'v0.9.'
                    ].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
                    /*</replacement>*/
                    Writable.WritableState = WritableState;
                    /*<replacement>*/
                    var util = require(5);
                    util.inherits = require(8);
                    /*</replacement>*/
                    /*<replacement>*/
                    var internalUtil = { deprecate: require(26) };
                    /*</replacement>*/
                    /*<replacement>*/
                    var Stream;
                    (function () {
                        try {
                            Stream = require('st' + 'ream');
                        } catch (_) {
                        } finally {
                            if (!Stream)
                                Stream = require(6).EventEmitter;
                        }
                    }());
                    /*</replacement>*/
                    var Buffer = require(4).Buffer;
                    /*<replacement>*/
                    var bufferShim = require(3);
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
                        Duplex = Duplex || require(14);
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
                        Duplex = Duplex || require(14);
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
                }.call(this, require(12)));
            },
            {
                '11': 11,
                '12': 12,
                '14': 14,
                '26': 26,
                '3': 3,
                '4': 4,
                '5': 5,
                '6': 6,
                '8': 8
            }
        ],
        19: [
            function (require, module, exports) {
                'use strict';
                var Buffer = require(4).Buffer;
                /*<replacement>*/
                var bufferShim = require(3);
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
                '3': 3,
                '4': 4
            }
        ],
        20: [
            function (require, module, exports) {
                module.exports = require(15);
            },
            { '15': 15 }
        ],
        21: [
            function (require, module, exports) {
                (function (process) {
                    var Stream = function () {
                        try {
                            return require('st' + 'ream');    // hack to fix a circular dependency issue when used with browserify
                        } catch (_) {
                        }
                    }();
                    exports = module.exports = require(16);
                    exports.Stream = Stream || exports;
                    exports.Readable = exports;
                    exports.Writable = require(18);
                    exports.Duplex = require(14);
                    exports.Transform = require(17);
                    exports.PassThrough = require(15);
                    if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
                        module.exports = Stream;
                    }
                }.call(this, require(12)));
            },
            {
                '12': 12,
                '14': 14,
                '15': 15,
                '16': 16,
                '17': 17,
                '18': 18
            }
        ],
        22: [
            function (require, module, exports) {
                module.exports = require(17);
            },
            { '17': 17 }
        ],
        23: [
            function (require, module, exports) {
                module.exports = require(18);
            },
            { '18': 18 }
        ],
        24: [
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
                var EE = require(6).EventEmitter;
                var inherits = require(8);
                inherits(Stream, EE);
                Stream.Readable = require(21);
                Stream.Writable = require(23);
                Stream.Duplex = require(13);
                Stream.Transform = require(22);
                Stream.PassThrough = require(20);
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
                '13': 13,
                '20': 20,
                '21': 21,
                '22': 22,
                '23': 23,
                '6': 6,
                '8': 8
            }
        ],
        25: [
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
                var Buffer = require(4).Buffer;
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
            { '4': 4 }
        ],
        26: [
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
        27: [
            function (require, module, exports) {
                arguments[4][8][0].apply(exports, arguments);
            },
            { '8': 8 }
        ],
        28: [
            function (require, module, exports) {
                module.exports = function isBuffer(arg) {
                    return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
                };
            },
            {}
        ],
        29: [
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
                    exports.isBuffer = require(28);
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
                    exports.inherits = require(27);
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
                }.call(this, require(12), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {
                '12': 12,
                '27': 27,
                '28': 28
            }
        ],
        30: [
            function (require, module, exports) {
                var foldHeaderLine = require(41), formatHeaderName = require(42), isRegExp = require(45), rfc2231 = require(64);
                function Headers(obj, doNotStringify) {
                    this.valuesByName = {};
                    this.populate(obj, doNotStringify);
                }
                Headers.prototype.isMessyHeaders = true;
                Headers.prototype.serializeHeaderValue = function (parsedHeaderValue) {
                    return parsedHeaderValue;
                };
                Headers.prototype.parseHeaderValue = function (serializedHeaderValue) {
                    return String(serializedHeaderValue);
                };
                Headers.prototype.populate = function (obj, doNotStringify) {
                    if (typeof obj === 'string') {
                        this.populateFromString(obj);
                    } else if (obj && typeof obj === 'object') {
                        if (obj instanceof Headers) {
                            this.populateFromObject(obj.valuesByName, doNotStringify);
                        } else {
                            this.populateFromObject(obj, doNotStringify);
                        }
                    }
                    return this;
                };
                Headers.prototype.populateFromString = function (str) {
                    this.populateFromStringAndReturnBodyStartIndex(str);
                    return this;
                };
                Headers.prototype.populateFromStringAndReturnBodyStartIndex = function (str) {
                    var that = this, state = 'startLine', currentHeaderName = '', currentValue = '';
                    function flush() {
                        if (currentHeaderName.length > 0) {
                            that.set(currentHeaderName, currentValue);
                        }
                        currentHeaderName = '';
                        currentValue = '';
                        state = 'startLine';
                    }
                    for (var i = 0; i < str.length; i += 1) {
                        var ch = str[i];
                        if (state === 'startLine') {
                            if (ch === ':') {
                                state = 'startHeaderValue';
                            } else if (ch === '\r' || ch === '\n') {
                                // Parse error or terminating CRLFCRLF
                                if (ch === '\r' && str[i + 1] === '\n' || ch === '\n' && str[i + 1] === '\r') {
                                    i += 2;
                                } else {
                                    i += 1;
                                }
                                flush();
                                return i;
                            } else {
                                currentHeaderName += ch;
                            }
                        } else if (state === 'startHeaderValue' || state === 'headerValue') {
                            if (state === 'startHeaderValue') {
                                if (ch === ' ') {
                                    // Ignore space after :
                                    continue;
                                } else {
                                    state = 'headerValue';
                                }
                            }
                            if (ch === '\r') {
                                if (str[i + 1] === '\n') {
                                    if (/[ \t]/.test(str[i + 2])) {
                                        // Skip past CRLF fold
                                        i += 1;
                                    } else {
                                        i += 1;
                                        flush();
                                    }
                                } else if (/[ \t]/.test(str[i + 1])) {
                                } else {
                                    flush();
                                }
                            } else if (ch === '\n') {
                                if (str[i + 1] === '\r') {
                                    if (/[ \t]/.test(str[i + 2])) {
                                        // Skip past LFCR fold
                                        i += 1;
                                    } else {
                                        i += 1;
                                        flush();
                                    }
                                } else if (/[ \t]/.test(str[i + 1])) {
                                } else {
                                    flush();
                                }
                            } else {
                                currentValue += ch;
                            }
                        }
                    }
                    flush();
                    return i;
                };
                Headers.prototype.populateFromObject = function (valuesByName, doNotStringify) {
                    Object.keys(valuesByName).forEach(function (headerName) {
                        var value = valuesByName[headerName], headerNameLowerCase = headerName.toLowerCase();
                        if (Array.isArray(value)) {
                            if (!doNotStringify) {
                                value = value.map(function (serializedHeaderValue) {
                                    return this.parseHeaderValue(serializedHeaderValue);
                                }, this);
                            }
                            if (this.valuesByName[headerNameLowerCase]) {
                                Array.prototype.push.apply(this.valuesByName[headerNameLowerCase], value);
                            } else {
                                this.valuesByName[headerNameLowerCase] = [].concat(value);
                            }
                        } else if (typeof value === 'undefined' && !doNotStringify) {
                            // Hmm, this might not behave as intended when the header occurs multiple times in the object with different casing
                            delete this.valuesByName[headerNameLowerCase];
                        } else {
                            if (!doNotStringify) {
                                value = this.parseHeaderValue(value);
                            }
                            if (this.valuesByName[headerNameLowerCase]) {
                                this.valuesByName[headerNameLowerCase].push(value);
                            } else {
                                this.valuesByName[headerNameLowerCase] = [value];
                            }
                        }
                    }, this);
                    return this;
                };
                Headers.prototype.get = function (headerName, valueNumber) {
                    valueNumber = valueNumber || 0;
                    var values = this.valuesByName[headerName.toLowerCase()];
                    if (values) {
                        return values[valueNumber];
                    }
                };
                Headers.prototype.getAll = function (headerName) {
                    var values = this.valuesByName[headerName.toLowerCase()];
                    if (values) {
                        return [].concat(values);
                    }
                };
                Headers.prototype.getNames = function () {
                    return Object.keys(this.valuesByName);
                };
                Headers.prototype.count = function (headerName) {
                    var values = this.valuesByName[headerName.toLowerCase()];
                    if (values) {
                        return values.length;
                    } else {
                        return 0;
                    }
                };
                Headers.prototype.set = function (headerName, valueOrValues, valueNumber) {
                    if (headerName && typeof headerName === 'object') {
                        Object.keys(headerName).forEach(function (key) {
                            this.set(key, headerName[key]);
                        }, this);
                    } else {
                        var headerNameLowerCase = headerName.toLowerCase();
                        if (Array.isArray(valueOrValues)) {
                            if (typeof valueNumber !== 'undefined') {
                                throw new Error('Headers.set: valueNumber not supported when the values are provided as an array');
                            }
                            if (valueOrValues.length === 0) {
                                delete this.valuesByName[headerNameLowerCase];
                            } else {
                                this.valuesByName[headerNameLowerCase] = valueOrValues.map(function (value) {
                                    return this.parseHeaderValue(value);
                                }, this);
                            }
                        } else if (typeof valueNumber === 'number' && Array.isArray(this.valuesByName[headerNameLowerCase]) && valueNumber < this.valuesByName[headerNameLowerCase].length) {
                            this.valuesByName[headerNameLowerCase][valueNumber] = this.parseHeaderValue(valueOrValues);
                        } else {
                            (this.valuesByName[headerNameLowerCase] = this.valuesByName[headerNameLowerCase] || []).push(this.parseHeaderValue(valueOrValues));
                        }
                    }
                };
                Headers.prototype.remove = function (headerNameOrObj, valueOrValuesOrValueNumber) {
                    var numRemoved = 0;
                    if (headerNameOrObj && typeof headerNameOrObj === 'object') {
                        Object.keys(headerNameOrObj).forEach(function (headerName) {
                            numRemoved += this.remove(headerName, headerNameOrObj[headerName]);
                        }, this);
                        return numRemoved;
                    }
                    var headerNameLowerCase = headerNameOrObj.toLowerCase(), values = this.valuesByName[headerNameLowerCase];
                    if (!values) {
                        return 0;
                    } else if (typeof valueOrValuesOrValueNumber === 'undefined') {
                        delete this.valuesByName[headerNameLowerCase];
                        return values.length;
                    } else if (Array.isArray(valueOrValuesOrValueNumber)) {
                        valueOrValuesOrValueNumber.forEach(function (value) {
                            numRemoved += this.remove(headerNameLowerCase, value);
                        }, this);
                        return numRemoved;
                    } else if (typeof valueOrValuesOrValueNumber === 'number') {
                        if (values.length === 1 && valueOrValuesOrValueNumber === 0) {
                            delete this.valuesByName[headerNameLowerCase];
                            numRemoved = 1;
                        } else if (valueOrValuesOrValueNumber < values.length) {
                            values.splice(valueOrValuesOrValueNumber, 1);
                            numRemoved = 1;
                        }
                    } else {
                        var value = String(valueOrValuesOrValueNumber), index = values.indexOf(value);
                        if (index !== -1) {
                            if (index === 0 && values.length === 1) {
                                delete this.valuesByName[headerNameLowerCase];
                            } else {
                                values.splice(index, 1);
                            }
                            numRemoved = 1;
                        }
                    }
                    return numRemoved;
                };
                // has('Content-Length')
                // has('Content-Type', 'text/html');
                // has('Cookie', ['foo=bar', 'baz=quux']);
                Headers.prototype.has = function (headerName, stringOrArrayOrRegExp) {
                    var values = this.valuesByName[headerName.toLowerCase()];
                    if (typeof stringOrArrayOrRegExp === 'undefined') {
                        return !!values;
                    } else if (typeof values === 'undefined') {
                        return false;
                    } else {
                        if (Array.isArray(stringOrArrayOrRegExp)) {
                            return stringOrArrayOrRegExp.every(function (expectedValue) {
                                if (isRegExp(expectedValue)) {
                                    return values.some(function (value) {
                                        return expectedValue.test(value);
                                    });
                                } else {
                                    return values.indexOf(String(expectedValue)) !== -1;
                                }
                            });
                        } else {
                            return values.length === 1 && values[0] === String(stringOrArrayOrRegExp);
                        }
                    }
                };
                Headers.prototype.parameter = function (headerName, attributeName, attributeValue) {
                    var headerValue = this.get(headerName, 0), rfc2231DisabledForThisHeader = this.isMessyHeadersWithRfc2047 && headerName.toLowerCase() === 'content-type';
                    if (headerValue) {
                        // FIXME: Will break if a quoted parameter value contains a semicolon
                        var tokens = headerValue.split(/\s*;\s*/), parameters = {}, usesRfc2231 = false;
                        for (var i = 1; i < tokens.length; i += 1) {
                            var matchKeyValue = tokens[i].match(/^([^=]+)=(.*)$/);
                            if (matchKeyValue && !(matchKeyValue[1] in parameters)) {
                                var parameterName = matchKeyValue[1], value = matchKeyValue[2], matchQuotedValue = value.match(/^"(.*)"$/);
                                if (matchQuotedValue) {
                                    value = matchQuotedValue[1].replace(/\\/, '');
                                }
                                if (!usesRfc2231 && /\*$/.test(parameterName)) {
                                    usesRfc2231 = true;
                                }
                                parameters[parameterName] = value;
                            }
                        }
                        if (usesRfc2231 && !rfc2231DisabledForThisHeader) {
                            parameters = rfc2231.unfoldAndDecodeParameters(parameters);
                        }
                        if (attributeName) {
                            if (attributeValue) {
                                parameters[attributeName] = attributeValue;
                                var tokensAfterUpdate = [tokens[0]];
                                if (!rfc2231DisabledForThisHeader) {
                                    parameters = rfc2231.encodeAndFoldParameters(parameters);
                                }
                                Object.keys(parameters).forEach(function (parameterName) {
                                    tokensAfterUpdate.push(parameterName + '=' + parameters[parameterName]);
                                });
                                this.set(headerName, tokensAfterUpdate.join('; '), 0);
                            } else {
                                return parameters[attributeName];
                            }
                        } else {
                            return parameters;
                        }
                    }
                };
                Headers.prototype.equals = function (other) {
                    if (this === other) {
                        return true;
                    }
                    var headerNames = this.getNames(), otherHeaderNames = other.getNames();
                    if (headerNames.length !== otherHeaderNames.length) {
                        return false;
                    }
                    headerNames.sort();
                    otherHeaderNames.sort();
                    for (var i = 0; i < headerNames.length; i += 1) {
                        var headerName = headerNames[i];
                        if (headerName !== otherHeaderNames[i]) {
                            return false;
                        }
                        var headerValues = this.getAll(headerName), otherHeaderValues = other.getAll(headerName);
                        if (headerValues.length !== otherHeaderValues.length) {
                            return false;
                        }
                        if (headerValues.length === 1 && otherHeaderValues.length === 1) {
                            if (headerValues[0] !== otherHeaderValues[0]) {
                                return false;
                            }
                        } else {
                            headerValues.sort();
                            otherHeaderValues.sort();
                            for (var j = 0; j < headerValues.length; j += 1) {
                                if (headerValues[i] !== otherHeaderValues[i]) {
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                };
                Headers.prototype.clone = function () {
                    var clone = new Headers();
                    this.getNames().forEach(function (headerName) {
                        clone.set(headerName, this.getAll(headerName));
                    }, this);
                    return clone;
                };
                Headers.prototype.toString = function (maxLineLength) {
                    var result = '', lowerCaseHeaderNames = this.getNames();
                    lowerCaseHeaderNames.forEach(function (lowerCaseHeaderName) {
                        this.valuesByName[lowerCaseHeaderName].forEach(function (value) {
                            result += formatHeaderName(lowerCaseHeaderName) + ': ' + foldHeaderLine(this.serializeHeaderValue(value), maxLineLength, maxLineLength - lowerCaseHeaderName.length - 2) + '\r\n';
                        }, this);
                    }, this);
                    return result;
                };
                Headers.prototype.toCanonicalObject = function () {
                    var canonicalObject = {};
                    this.getNames().forEach(function (lowerCaseHeaderName) {
                        canonicalObject[formatHeaderName(lowerCaseHeaderName)] = this.getAll(lowerCaseHeaderName);
                    }, this);
                    return canonicalObject;
                };
                Headers.prototype.toJSON = function () {
                    var obj = {};
                    this.getNames().forEach(function (lowerCaseHeaderName) {
                        var values = this.getAll(lowerCaseHeaderName);
                        if (values.length === 1) {
                            obj[formatHeaderName(lowerCaseHeaderName)] = this.get(lowerCaseHeaderName);
                        } else {
                            obj[formatHeaderName(lowerCaseHeaderName)] = this.getAll(lowerCaseHeaderName);
                        }
                    }, this);
                    return obj;
                };
                module.exports = Headers;
            },
            {
                '41': 41,
                '42': 42,
                '45': 45,
                '64': 64
            }
        ],
        31: [
            function (require, module, exports) {
                var Headers = require(30), rfc2047 = require(60), util = require(29);
                function HeadersWithRfc2047(obj, doNotStringify) {
                    Headers.call(this, obj, doNotStringify);
                }
                util.inherits(HeadersWithRfc2047, Headers);
                HeadersWithRfc2047.prototype.isMessyHeadersWithRfc2047 = true;
                HeadersWithRfc2047.prototype.serializeHeaderValue = function (parsedHeaderValue) {
                    return rfc2047.encode(parsedHeaderValue);
                };
                HeadersWithRfc2047.prototype.parseHeaderValue = function (serializedHeaderValue) {
                    return rfc2047.decode(String(serializedHeaderValue));
                };
                module.exports = HeadersWithRfc2047;
            },
            {
                '29': 29,
                '30': 30,
                '60': 60
            }
        ],
        32: [
            function (require, module, exports) {
                var HttpExchange = require(33);
                function HttpConversation(obj, doNotStringify) {
                    obj = obj || {};
                    this.exchanges = (obj.exchanges || []).map(function (httpExchange) {
                        if (httpExchange instanceof HttpExchange) {
                            return httpExchange;
                        } else {
                            return new HttpExchange(httpExchange, doNotStringify);
                        }
                    });
                }
                HttpConversation.prototype.isMessyHttpConversation = true;
                HttpConversation.prototype.clone = function () {
                    return new HttpConversation({
                        exchanges: this.exchanges.map(function (httpExchange) {
                            return httpExchange.clone();
                        })
                    });
                };
                HttpConversation.prototype.toString = function (maxLineLength) {
                    return this.exchanges.map(function (httpExchange) {
                        return httpExchange.toString(maxLineLength);
                    }).join('\r\n\r\n');
                };
                HttpConversation.prototype.equals = function (other) {
                    return this === other || other instanceof HttpConversation && this.exchanges.length === other.exchanges.length && this.exchanges.every(function (httpExchange, i) {
                        return httpExchange.equals(other.exchanges[i]);
                    });
                };
                HttpConversation.prototype.toJSON = function () {
                    return {
                        exchanges: this.exchanges.map(function (exchange) {
                            return exchange.toJSON();
                        })
                    };
                };
                module.exports = HttpConversation;
            },
            { '33': 33 }
        ],
        33: [
            function (require, module, exports) {
                var HttpRequest = require(34), HttpResponse = require(35);
                function HttpExchange(obj, doNotStringify) {
                    obj = obj || {};
                    if (typeof obj.request !== 'undefined') {
                        this.request = obj.request instanceof HttpRequest ? obj.request : new HttpRequest(obj.request, doNotStringify);
                    }
                    if (typeof obj.response !== 'undefined') {
                        this.response = obj.response instanceof HttpResponse ? obj.response : new HttpResponse(obj.response, doNotStringify);
                    }
                }
                HttpExchange.prototype.isMessyHttpExchange = true;
                HttpExchange.prototype.clone = function () {
                    return new HttpExchange({
                        request: this.request && this.request.clone(),
                        response: this.response && this.response.clone()
                    });
                };
                HttpExchange.prototype.toString = function (maxLineLength) {
                    return (this.request ? this.request.toString(maxLineLength) : '<no request>') + '\r\n\r\n' + (this.response ? this.response.toString(maxLineLength) : '<no response>');
                };
                HttpExchange.prototype.equals = function (other) {
                    return this === other || other instanceof HttpExchange && (this.request === other.request || this.request && other.request && this.request.equals(other.request)) && (this.response === other.response || this.response && other.response && this.response.equals(other.response));
                };
                HttpExchange.prototype.toJSON = function () {
                    var obj = {};
                    if (this.request) {
                        obj.request = this.request.toJSON();
                    }
                    if (this.response) {
                        obj.response = this.response.toJSON();
                    }
                    return obj;
                };
                module.exports = HttpExchange;
            },
            {
                '34': 34,
                '35': 35
            }
        ],
        34: [
            function (require, module, exports) {
                (function (Buffer) {
                    /*global btoa*/
                    var Message = require(37), RequestLine = require(38), util = require(29), _ = require(68);
                    function HttpRequest(obj, doNotStringify) {
                        this.requestLine = new RequestLine();
                        this.encrypted = false;
                        Message.call(this, obj);
                    }
                    HttpRequest.metadataPropertyNames = [
                        'host',
                        'port',
                        'encrypted',
                        'cert',
                        'key',
                        'ca',
                        'rejectUnauthorized'
                    ];
                    HttpRequest.propertyNames = Message.propertyNames.concat(HttpRequest.metadataPropertyNames).concat(RequestLine.propertyNames).concat(['requestLine']);
                    util.inherits(HttpRequest, Message);
                    HttpRequest.prototype.isMessyHttpRequest = true;
                    HttpRequest.prototype.populate = function (obj) {
                        if (obj && typeof obj === 'object' && (typeof Buffer === 'undefined' || !Buffer.isBuffer(obj))) {
                            this.populateFromObject(obj);
                        } else {
                            Message.prototype.populate.call(this, obj);
                        }
                        return this;
                    };
                    HttpRequest.prototype.populateFromObject = function (obj) {
                        Message.prototype.populateFromObject.call(this, obj);
                        HttpRequest.metadataPropertyNames.forEach(function (metadataPropertyName) {
                            if (typeof obj[metadataPropertyName] !== 'undefined') {
                                this[metadataPropertyName] = obj[metadataPropertyName];
                            }
                        }, this);
                        if (typeof obj.url === 'string') {
                            var fragments = obj.url.split(' ');
                            if (fragments.length > 1) {
                                this.method = fragments.shift();
                            }
                            if (fragments.length > 0) {
                                this._updateUrl(fragments[0]);
                                obj = _.extend({}, obj);
                                obj.url = this.path;
                            }
                            if (fragments.length > 1) {
                                this.protocol = fragments[1];
                            }
                        }
                        if (typeof obj.requestLine !== 'undefined') {
                            this.requestLine.populate(obj.requestLine);
                        }
                        this.requestLine.populateFromObject(_.omit(obj, 'url'));
                        return this;
                    };
                    function safeDecodeURIComponent(str) {
                        try {
                            return decodeURIComponent(str);
                        } catch (e) {
                            // Assume URIError: URI malformed (percent encoded octets that don't decode as UTF-8)
                            return str;
                        }
                    }
                    HttpRequest.prototype.populateFromString = function (str) {
                        var matchRequestLine = str.match(/^([^\r\n]*)(\r\n?|\n\r?|$)/);
                        if (matchRequestLine) {
                            Message.prototype.populateFromString.call(this, str.substr(matchRequestLine[0].length));
                            var requestLineStr = matchRequestLine[1], requestLineFragments = requestLineStr.split(' ');
                            if (requestLineFragments.length === 1) {
                                requestLineFragments.unshift('GET');
                            }
                            if (requestLineFragments.length >= 2) {
                                this.url = requestLineFragments[1];
                                requestLineFragments[1] = this.requestLine.url;
                            }
                            requestLineStr = requestLineFragments.join(' ');
                            this.requestLine.populateFromString(requestLineStr);
                        }
                        return this;
                    };
                    HttpRequest.prototype.populateFromBuffer = function (buffer) {
                        var i = 0;
                        while (i < buffer.length && buffer[i] !== 13 && buffer[i] !== 10) {
                            i += 1;
                        }
                        if (i > 0) {
                            this.requestLine.populateFromString(buffer.slice(0, i).toString('ascii'));
                        }
                        if (buffer[i] === 13) {
                            i += 1;
                        }
                        if (buffer[i] === 10) {
                            i += 1;
                        }
                        Message.prototype.populateFromBuffer.call(this, buffer.slice(i));
                        return this;
                    };
                    Object.defineProperty(HttpRequest.prototype, 'basicAuthCredentials', {
                        get: function () {
                            var authorizationHeaderValue = this.headers.get('Authorization');
                            if (typeof authorizationHeaderValue === 'string') {
                                var authorizationFragments = authorizationHeaderValue.split(' ');
                                if (authorizationFragments.length === 2 && authorizationFragments[0] === 'Basic') {
                                    var credentials = new Buffer(authorizationFragments[1], 'base64').toString('utf-8').split(':'), username = credentials.shift(), password = credentials.join(':') || undefined;
                                    return {
                                        username: username,
                                        password: password
                                    };
                                }
                            }
                        }
                    });
                    Object.defineProperty(HttpRequest.prototype, 'username', {
                        get: function () {
                            var basicAuthCredentials = this.basicAuthCredentials;
                            return basicAuthCredentials && basicAuthCredentials.username;
                        }
                    });
                    Object.defineProperty(HttpRequest.prototype, 'password', {
                        get: function () {
                            var basicAuthCredentials = this.basicAuthCredentials;
                            return basicAuthCredentials && basicAuthCredentials.password;
                        }
                    });
                    Object.defineProperty(HttpRequest.prototype, 'url', {
                        get: function () {
                            var host = this.host;
                            if (host) {
                                var port = this.port, encrypted = this.encrypted, basicAuthCredentials = this.basicAuthCredentials;
                                return 'http' + (encrypted ? 's' : '') + '://' + (basicAuthCredentials ? encodeURIComponent(basicAuthCredentials.username) + (basicAuthCredentials.password ? ':' + encodeURIComponent(basicAuthCredentials.password) : '') + '@' : '') + host + (typeof port === 'number' && port !== (encrypted ? 443 : 80) ? ':' + port : '') + (this.requestLine.url || '/');
                            } else {
                                return this.requestLine.url || '/';
                            }
                        },
                        set: function (url) {
                            this.host = undefined;
                            this.port = undefined;
                            this._updateUrl(url, true);
                        }
                    });
                    HttpRequest.prototype._updateUrl = function (url, invokedAsSetter) {
                        var fragments = url.split(' ');
                        if (fragments.length > 1) {
                            this.method = fragments.shift();
                        }
                        if (fragments.length > 0) {
                            var matchUrl = fragments[0].match(/^(https?:)\/\/(?:([^:@\/]+(?::[^@\/]+?))@)?((?:[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?\.)*[a-z][\-a-z]*[a-z]|(?:(?:[0-9]|1?[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|1?[0-9][0-9]|2[0-4][0-9]|25[0-5]))(:\d{1,5})?(\/[\w\-\.~%!$&'\(\)*+,;=:@\/]*(?:\?[\w\-\.~%!$&'\(\)*+,;=:@\/?]*)?(?:#[\w\-\.~%!$&'\(\)*+,;=:@\/?#]*)?)?$/);
                            if (matchUrl) {
                                var protocol = matchUrl[1], auth = matchUrl[2], host = matchUrl[3], port = matchUrl[4], path = matchUrl[5];
                                if (!this.headers.has('Host')) {
                                    this.headers.set('Host', host + (port || ''));
                                }
                                if (typeof this.host !== 'undefined' && this.host !== host) {
                                    throw new Error('the host property and the url specify different hosts, ' + this.host + ' vs. ' + host);
                                }
                                this.host = host;
                                if (typeof port !== 'undefined') {
                                    port = parseInt(port.substr(1), 10);
                                    if (typeof this.port !== 'undefined' && this.port !== port) {
                                        throw new Error('the port property and the url specify different ports, ' + this.port + ' vs. ' + port);
                                    }
                                    this.port = port;
                                } else if (typeof this.port === 'undefined') {
                                    if (protocol === 'https:') {
                                        this.port = 443;
                                    } else {
                                        this.port = 80;
                                    }
                                }
                                if (invokedAsSetter) {
                                    this.headers.remove('Authorization');
                                }
                                if (typeof auth === 'string' && auth.length > 0) {
                                    var authFragments = auth.split(':'), username = safeDecodeURIComponent(authFragments.shift()), password = safeDecodeURIComponent(authFragments.join(':'));
                                    this.headers.set('Authorization', 'Basic ' + (typeof Buffer !== 'undefined' ? new Buffer(username + ':' + password, 'utf-8').toString('base64') : btoa(auth)));
                                }
                                this.encrypted = protocol === 'https:';
                                this.requestLine.url = path || '/';
                            } else {
                                this.requestLine.url = fragments[0] || '/';
                            }
                        }
                        if (fragments.length >= 2) {
                            this.protocol = fragments[2];
                        }
                    };
                    HttpRequest.prototype.clone = function () {
                        return new HttpRequest({
                            requestLine: this.requestLine.clone(),
                            headers: this.headers.clone(),
                            body: this.body
                        });
                    };
                    HttpRequest.prototype.toString = function (maxLineLength) {
                        return this.requestLine.toString() + '\r\n' + Message.prototype.toString.call(this, maxLineLength);
                    };
                    HttpRequest.prototype.equals = function (other) {
                        return this === other || other instanceof HttpRequest && this.requestLine.equals(other.requestLine) && Boolean(this.encrypted) === Boolean(other.encrypted) && Message.prototype.equals.call(this, other);
                    };
                    RequestLine.propertyNames.forEach(function (requestLinePropertyName) {
                        if (requestLinePropertyName !== 'url') {
                            Object.defineProperty(HttpRequest.prototype, requestLinePropertyName, {
                                enumerable: true,
                                get: function () {
                                    return this.requestLine[requestLinePropertyName];
                                },
                                set: function (value) {
                                    this.requestLine[requestLinePropertyName] = value;
                                }
                            });
                        }
                    });
                    HttpRequest.prototype.toJSON = function () {
                        return _.extend(Message.prototype.toJSON.call(this), this.requestLine.toJSON());
                    };
                    module.exports = HttpRequest;
                }.call(this, require(4).Buffer));
            },
            {
                '29': 29,
                '37': 37,
                '38': 38,
                '4': 4,
                '68': 68
            }
        ],
        35: [
            function (require, module, exports) {
                (function (Buffer) {
                    var Message = require(37), StatusLine = require(39), util = require(29), _ = require(68);
                    function HttpResponse(obj, doNotStringify) {
                        this.statusLine = new StatusLine();
                        Message.call(this, obj, doNotStringify);
                    }
                    HttpResponse.propertyNames = Message.propertyNames.concat(StatusLine.propertyNames).concat(['statusLine']);
                    util.inherits(HttpResponse, Message);
                    HttpResponse.prototype.isMessyHttpResponse = true;
                    HttpResponse.prototype.populate = function (obj) {
                        if (typeof obj === 'number') {
                            this.populateFromObject({ statusCode: obj });
                        } else if (obj && typeof obj === 'object' && (typeof Buffer === 'undefined' || !Buffer.isBuffer(obj))) {
                            this.populateFromObject(obj);
                        } else {
                            Message.prototype.populate.call(this, obj);
                        }
                        return this;
                    };
                    HttpResponse.prototype.populateFromObject = function (obj) {
                        Message.prototype.populateFromObject.call(this, obj);
                        if (typeof obj.statusLine !== 'undefined') {
                            this.statusLine.populate(obj.statusLine);
                        }
                        this.statusLine.populateFromObject(obj);
                        return this;
                    };
                    HttpResponse.prototype.populateFromString = function (str) {
                        var matchStatusLine = str.match(/^([^\r\n]*)(\r\n?|\n\r?|$)/);
                        if (matchStatusLine) {
                            this.statusLine.populateFromString(matchStatusLine[1]);
                            Message.prototype.populateFromString.call(this, str.substr(matchStatusLine[0].length));
                        }
                        return this;
                    };
                    HttpResponse.prototype.populateFromBuffer = function (buffer) {
                        var i = 0;
                        while (i < buffer.length && buffer[i] !== 13 && buffer[i] !== 10) {
                            i += 1;
                        }
                        if (i > 0) {
                            this.statusLine.populateFromString(buffer.slice(0, i).toString('ascii'));
                        } else {
                            return;
                        }
                        if (buffer[i] === 13) {
                            i += 1;
                        }
                        if (buffer[i] === 10) {
                            i += 1;
                        }
                        Message.prototype.populateFromBuffer.call(this, buffer.slice(i));
                        return this;
                    };
                    HttpResponse.prototype.clone = function () {
                        return new HttpResponse({
                            statusLine: this.statusLine.clone(),
                            headers: this.headers.clone(),
                            body: this.body
                        });
                    };
                    HttpResponse.prototype.toString = function (maxLineLength) {
                        return this.statusLine.toString() + '\r\n' + Message.prototype.toString.call(this, maxLineLength);
                    };
                    HttpResponse.prototype.equals = function (other) {
                        return this === other || other instanceof HttpResponse && this.statusLine.equals(other.statusLine) && Message.prototype.equals.call(this, other);
                    };
                    StatusLine.propertyNames.forEach(function (statusLinePropertyName) {
                        Object.defineProperty(HttpResponse.prototype, statusLinePropertyName, {
                            enumerable: true,
                            get: function () {
                                return this.statusLine[statusLinePropertyName];
                            },
                            set: function (value) {
                                this.statusLine[statusLinePropertyName] = value;
                            }
                        });
                    });
                    HttpResponse.prototype.toJSON = function () {
                        return _.extend(Message.prototype.toJSON.call(this), this.statusLine.toJSON());
                    };
                    module.exports = HttpResponse;
                }.call(this, require(4).Buffer));
            },
            {
                '29': 29,
                '37': 37,
                '39': 39,
                '4': 4,
                '68': 68
            }
        ],
        36: [
            function (require, module, exports) {
                var Message = require(37), HeadersWithRfc2047 = require(31), util = require(29);
                function Mail(obj) {
                    Message.call(this, obj);
                }
                util.inherits(Mail, Message);
                Mail.prototype.isMessyMail = true;
                Mail.prototype.HeadersConstructor = HeadersWithRfc2047;
                module.exports = Mail;
            },
            {
                '29': 29,
                '31': 31,
                '37': 37
            }
        ],
        37: [
            function (require, module, exports) {
                (function (Buffer) {
                    /*global unescape, btoa, atob, JSON*/
                    var Headers = require(30), isRegExp = require(45), iconvLite = require(57), quotedPrintable = require(59), decodeChunkedTransferEncoding = require(40), zlib;
                    try {
                        zlib = require('' + 'zlib');
                    } catch (e) {
                    }
                    function isDefined(obj) {
                        return obj !== null && typeof obj !== 'undefined';
                    }
                    function quoteRegExp(str) {
                        return str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                    }
                    function Message(obj, doNotStringify) {
                        this.headers = new this.HeadersConstructor();
                        this.populate(obj, doNotStringify);
                    }
                    // Descending priority:
                    var bodyPropertyNames = [
                        'parts',
                        'body',
                        'unchunkedBody',
                        'rawBody'
                    ];
                    Message.propertyNames = [
                        'headers',
                        'fileName',
                        'isJson',
                        'isMultipart',
                        'boundary',
                        'charset'
                    ].concat(bodyPropertyNames);
                    Message.prototype.isMessyMessage = true;
                    Message.prototype.HeadersConstructor = Headers;
                    Message.prototype.populate = function (obj) {
                        if (typeof Buffer === 'function' && Buffer.isBuffer(obj)) {
                            this.populateFromBuffer(obj);
                        } else if (typeof obj === 'string') {
                            this.populateFromString(obj);
                        } else if (obj && typeof obj === 'object') {
                            this.populateFromObject(obj);
                        }
                        return this;
                    };
                    Message.prototype.populateFromObject = function (obj) {
                        if (typeof obj.headers !== 'undefined') {
                            this.headers.populate(obj.headers);
                        }
                        if (typeof obj.parts !== 'undefined') {
                            this.parts = (Array.isArray(obj.parts) ? obj.parts : [obj.parts]).map(function (part) {
                                return part && part.isMessyMessage ? part : new Message(part);
                            });
                        } else if (typeof obj.rawBody !== 'undefined') {
                            this.rawBody = obj.rawBody;
                        } else if (typeof obj.body !== 'undefined') {
                            if (typeof Buffer !== 'undefined' && Buffer.isBuffer(obj.body)) {
                                this.unchunkedBody = obj.body;
                            } else {
                                this.body = obj.body;
                            }
                        } else if (typeof obj.unchunkedBody !== 'undefined') {
                            this.unchunkedBody = obj.unchunkedBody;
                        }
                        return this;
                    };
                    Message.prototype.populateFromBuffer = function (buffer) {
                        // Hack: Interpret non-ASCII in headers as iso-8859-1:
                        var str = '';
                        for (var i = 0; i < buffer.length; i += 1) {
                            var octet = buffer[i];
                            if (octet > 127) {
                                str += unescape('%' + octet.toString(16));
                            } else {
                                str += String.fromCharCode(octet);
                            }
                            if (/\r\r$|\n\n$|\r\n\r\n$|\n\r\n\r$/.test(str)) {
                                i += 1;
                                if (i < buffer.length) {
                                    this.rawBody = buffer.slice(i);
                                }
                                break;
                            }
                        }
                        this.headers.populateFromString(str, true);
                        return this;
                    };
                    Message.prototype.populateFromString = function (str) {
                        var bodyStartIndex = this.headers.populateFromStringAndReturnBodyStartIndex(str);
                        if (bodyStartIndex < str.length) {
                            this.rawBody = str.substr(bodyStartIndex);
                        }
                        return this;
                    };
                    Object.defineProperty(Message.prototype, 'hasTextualContentType', {
                        get: function () {
                            var contentType = this.headers.get('Content-Type');
                            if (typeof contentType === 'string') {
                                contentType = contentType.toLowerCase().trim().replace(/\s*;.*$/, '');
                                return /^text\//.test(contentType) || /^application\/(?:json|javascript)$/.test(contentType) || /^application\/xml/.test(contentType) || /^application\/x-www-form-urlencoded\b/.test(contentType) || /\+xml$/.test(contentType) || /\+json$/.test(contentType);
                            }
                            return false;
                        }
                    });
                    Object.defineProperty(Message.prototype, 'isJson', {
                        get: function () {
                            return /^application\/json\b|\+json\b/i.test(this.headers.get('Content-Type'));
                        }
                    });
                    Object.defineProperty(Message.prototype, 'charset', {
                        get: function () {
                            var charset = this.headers.parameter('Content-Type', 'charset');
                            if (charset) {
                                return charset;
                            }
                            var contentType = this.headers.get('Content-Type');
                            if (contentType && /^application\/json\b|\+json\b/i.test(contentType)) {
                                return 'utf-8';
                            }
                            return 'iso-8859-1';
                        }
                    });
                    Object.defineProperty(Message.prototype, 'isMultipart', {
                        enumerable: true,
                        get: function () {
                            return /^multipart\//.test(this.headers.get('Content-Type'));
                        }
                    });
                    Object.defineProperty(Message.prototype, 'boundary', {
                        enumerable: true,
                        get: function () {
                            return this.isMultipart && this.headers.parameter('Content-Type', 'boundary');
                        }
                    });
                    Object.defineProperty(Message.prototype, '_bodyMustBeBuffer', {
                        get: function () {
                            if (this._parts) {
                                return this._parts.some(function (part) {
                                    return part._bodyMustBeBuffer;
                                });
                            } else {
                                return typeof Buffer === 'function' && Buffer.isBuffer(this.body);
                            }
                        }
                    });
                    Object.defineProperty(Message.prototype, 'unchunkedBody', {
                        enumerable: true,
                        get: function () {
                            if (!isDefined(this._unchunkedBody)) {
                                if (isDefined(this._rawBody)) {
                                    this._unchunkedBody = this._rawBody;
                                    var transferEncoding = this.headers.get('Transfer-Encoding');
                                    if (transferEncoding && transferEncoding === 'chunked') {
                                        try {
                                            this._unchunkedBody = decodeChunkedTransferEncoding(this._unchunkedBody);
                                        } catch (e) {
                                        }
                                    }
                                } else if (isDefined(this._body) || isDefined(this._parts)) {
                                    this._unchunkedBody = this.body;
                                    if ((this.isJson && typeof this._unchunkedBody !== 'undefined' || this._unchunkedBody && typeof this._unchunkedBody === 'object') && (typeof Buffer === 'undefined' || !Buffer.isBuffer(this._unchunkedBody))) {
                                        try {
                                            this._unchunkedBody = JSON.stringify(this._unchunkedBody);
                                        } catch (e) {
                                        }
                                    }
                                    var charset = this.charset;
                                    if (/^utf-?8$/i.test(charset) && typeof Buffer !== 'undefined') {
                                        this._unchunkedBody = new Buffer(this._unchunkedBody, 'utf-8');
                                    } else if (iconvLite.encodingExists(charset) && !/^utf-?8$/i.test(charset)) {
                                        this._unchunkedBody = iconvLite.encode(this._unchunkedBody, charset);
                                    }
                                    var contentTransferEncoding = this.headers.get('Content-Transfer-Encoding');
                                    if (contentTransferEncoding) {
                                        contentTransferEncoding = contentTransferEncoding.trim().toLowerCase();
                                        if (contentTransferEncoding === 'base64') {
                                            if (typeof Buffer !== 'undefined') {
                                                if (!Buffer.isBuffer(this._unchunkedBody)) {
                                                    this._unchunkedBody = new Buffer(this._unchunkedBody, 'utf-8');
                                                }
                                                this._unchunkedBody = this.rawBody.toString('base64');
                                            } else {
                                                this._unchunkedBody = btoa(this._unchunkedBody);
                                            }
                                        } else if (contentTransferEncoding === 'quoted-printable') {
                                            if (typeof Buffer !== 'undefined' && Buffer.isBuffer(this._unchunkedBody)) {
                                                this._unchunkedBody = this._unchunkedBody.toString('binary');
                                            }
                                            this._unchunkedBody = quotedPrintable.encode(this._unchunkedBody);
                                        }
                                    }
                                    if (zlib && zlib.gzipSync) {
                                        var contentEncoding = this.headers.get('Content-Encoding');
                                        if (contentEncoding) {
                                            contentEncoding = contentEncoding.trim().toLowerCase();
                                            if (contentEncoding === 'gzip' || contentEncoding === 'deflate') {
                                                try {
                                                    this._unchunkedBody = zlib[contentEncoding === 'gzip' ? 'gzipSync' : 'deflateSync'](this._unchunkedBody || '');
                                                } catch (e) {
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return this._unchunkedBody;
                        },
                        set: function (unchunkedBody) {
                            this._unchunkedBody = unchunkedBody;
                            this._body = null;
                            this._rawBody = null;
                            this._parts = null;
                        }
                    });
                    Object.defineProperty(Message.prototype, 'rawBody', {
                        enumerable: true,
                        get: function () {
                            if (!isDefined(this._rawBody) && (isDefined(this._body) || isDefined(this._parts) || isDefined(this._unchunkedBody))) {
                                this._rawBody = this.unchunkedBody;
                                var transferEncoding = this.headers.get('Transfer-Encoding');
                                if (transferEncoding && transferEncoding === 'chunked') {
                                    if (typeof Buffer !== 'undefined' && !Buffer.isBuffer(this._rawBody)) {
                                        this._rawBody = new Buffer(this._rawBody, 'utf-8');
                                    }
                                    var chunks = [];
                                    if (this._rawBody.length > 0) {
                                        chunks.push(new Buffer(this._rawBody.length.toString(16) + '\r\n', 'ascii'), this._rawBody, new Buffer('\r\n', 'ascii'));
                                    }
                                    chunks.push(new Buffer('0\r\n\r\n', 'ascii'));
                                    this._rawBody = Buffer.concat(chunks);
                                }
                            }
                            return this._rawBody;
                        },
                        set: function (rawBody) {
                            this._rawBody = rawBody;
                            this._unchunkedBody = null;
                            this._body = null;
                            this._parts = null;
                        }
                    });
                    Object.defineProperty(Message.prototype, 'body', {
                        enumerable: true,
                        get: function () {
                            if (this._parts) {
                                if (this._parts.length === 0) {
                                    return;
                                } else {
                                    var boundary = this.boundary || '';
                                    if (this._bodyMustBeBuffer) {
                                        var chunks = [];
                                        this._parts.forEach(function (part, i) {
                                            if (i > 0) {
                                                chunks.push(new Buffer('\r\n'));
                                            }
                                            chunks.push(new Buffer('--' + boundary + '\r\n'));
                                            var serializedPart = part.serialize();
                                            if (!Buffer.isBuffer(serializedPart)) {
                                                serializedPart = new Buffer(serializedPart);
                                            }
                                            chunks.push(serializedPart);
                                        }, this);
                                        chunks.push(new Buffer('\r\n--' + boundary + '--\r\n'));
                                        return Buffer.concat(chunks);
                                    } else {
                                        return '--' + boundary + '\r\n' + this._parts.join('\r\n--' + boundary + '\r\n') + '\r\n--' + boundary + '--\r\n';
                                    }
                                }
                            } else if (!isDefined(this._body) && (isDefined(this._rawBody) || isDefined(this._unchunkedBody))) {
                                this._body = this.unchunkedBody;
                                if (zlib && zlib.gunzipSync) {
                                    var contentEncoding = this.headers.get('Content-Encoding');
                                    if (contentEncoding) {
                                        contentEncoding = contentEncoding.trim().toLowerCase();
                                        if (contentEncoding === 'gzip' || contentEncoding === 'deflate') {
                                            if (typeof Buffer !== 'undefined' && !Buffer.isBuffer(this._rawBody)) {
                                                this._rawBody = new Buffer(this._rawBody, 'utf-8');
                                            }
                                            try {
                                                this._body = zlib[contentEncoding === 'gzip' ? 'gunzipSync' : 'inflateSync'](this._body);
                                            } catch (e) {
                                            }
                                        }
                                    }
                                }
                                var contentTransferEncoding = this.headers.get('Content-Transfer-Encoding'), contentTransferEncodingIsHonored = !contentTransferEncoding;
                                if (contentTransferEncoding) {
                                    contentTransferEncoding = contentTransferEncoding.trim().toLowerCase();
                                    if (contentTransferEncoding === 'quoted-printable') {
                                        if (typeof Buffer === 'function' && Buffer.isBuffer(this._body)) {
                                            this._body = this._body.toString('ascii');
                                        }
                                        var qpDecodedBodyAsByteString = quotedPrintable.decode(this._body);
                                        this._body = new Buffer(qpDecodedBodyAsByteString.length);
                                        for (var i = 0; i < qpDecodedBodyAsByteString.length; i += 1) {
                                            this._body[i] = qpDecodedBodyAsByteString.charCodeAt(i);
                                        }
                                        contentTransferEncodingIsHonored = true;
                                    } else if (contentTransferEncoding === 'base64') {
                                        if (typeof Buffer === 'function' && Buffer.isBuffer(this._body)) {
                                            this._body = this._body.toString('ascii');
                                        }
                                        if (typeof Buffer !== 'undefined') {
                                            this._body = new Buffer(this._body, 'base64');
                                        } else {
                                            this._body = atob(this._body);
                                        }
                                        contentTransferEncodingIsHonored = true;
                                    } else if (contentTransferEncoding === '8bit' || contentTransferEncoding === '7bit') {
                                        contentTransferEncodingIsHonored = true;
                                    }
                                }
                                if (this.hasTextualContentType && contentTransferEncodingIsHonored && this._body && typeof this._body !== 'string') {
                                    var charset = this.charset;
                                    if (iconvLite.encodingExists(charset)) {
                                        this._body = iconvLite.decode(this._body, charset);
                                    }
                                }
                                if (this.isJson && typeof this._body === 'string') {
                                    try {
                                        this._body = JSON.parse(this._body);
                                    } catch (e) {
                                    }
                                }
                            }
                            return this._body;
                        },
                        set: function (body) {
                            this._body = body;
                            if (this.isJson && typeof this._body === 'string') {
                                try {
                                    this._body = JSON.parse(this._body);
                                } catch (e) {
                                }
                            }
                            this._rawBody = null;
                            this._unchunkedBody = null;
                            this._parts = null;
                        }
                    });
                    Object.defineProperty(Message.prototype, 'parts', {
                        enumerable: true,
                        set: function (parts) {
                            this._parts = parts;
                            this._body = null;
                            this._rawBody = null;
                            this._unchunkedBody = null;
                        },
                        get: function () {
                            if (!this._parts && this.isMultipart) {
                                var boundary = this.boundary || '', bodyAsString;
                                if (typeof Buffer === 'function' && Buffer.isBuffer(this.body)) {
                                    bodyAsString = this.body.toString('ascii');
                                } else {
                                    bodyAsString = this.body;
                                }
                                var boundaryRegExp = new RegExp('(^|\r\n?|\n\r?)--' + quoteRegExp(boundary) + '(--)?(?:\r\n?|\n\r?|$)', 'g'), startIndex = -1, parts = [], match;
                                // TODO: Basic validation of end marker etc.
                                while (match = boundaryRegExp.exec(bodyAsString)) {
                                    var index = match.index;
                                    if (startIndex !== -1) {
                                        parts.push(new Message(this.body.slice(startIndex, index)));
                                    }
                                    startIndex = index + match[0].length;
                                }
                                if (parts.length > 0) {
                                    this._parts = parts;
                                }
                            }
                            return this._parts;
                        }
                    });
                    Object.defineProperty(Message.prototype, 'fileName', {
                        get: function () {
                            return this.headers.parameter('Content-Disposition', 'filename') || this.isMessyMail && this.headers.parameter('Content-Type', 'name');
                        },
                        set: function (fileName) {
                            if (!this.headers.has('Content-Disposition')) {
                                this.headers.set('Content-Disposition', 'attachment');
                            }
                            this.headers.parameter('Content-Disposition', 'filename', fileName);
                            if (this.isMessyMail && this.headers.has('Content-Type')) {
                                this.headers.parameter('Content-Type', 'name', fileName);
                            }
                        }
                    });
                    function buffersEqual(a, b) {
                        if (a === b) {
                            return true;
                        }
                        if (a.length !== b.length)
                            return false;
                        for (var i = 0; i < a.length; i += 1) {
                            if (a[i] !== b[i])
                                return false;
                        }
                        return true;
                    }
                    function isNonBufferNonRegExpObject(obj) {
                        return obj && typeof obj === 'object' && (typeof Buffer === 'undefined' || !Buffer.isBuffer(obj)) && !isRegExp(obj);
                    }
                    Message.prototype.clone = function () {
                        return new Message({
                            headers: this.headers.clone(),
                            body: this.body
                        });
                    };
                    Message.prototype.serialize = function (maxLineLength, forceString) {
                        if (typeof maxLineLength === 'undefined') {
                            maxLineLength = 72;
                        }
                        var result = this.headers.toString(maxLineLength);
                        if (typeof this.body !== 'undefined') {
                            result += '\r\n';
                            if (this.body && typeof this.body === 'object' && isNonBufferNonRegExpObject(this.body)) {
                                result += JSON.stringify(this.body);
                            } else {
                                if (!forceString && this._bodyMustBeBuffer) {
                                    result = Buffer.concat([
                                        new Buffer(result),
                                        this.body
                                    ]);
                                } else {
                                    result += this.body;
                                }
                            }
                        }
                        return result;
                    };
                    Message.prototype.toString = function (maxLineLength) {
                        return this.serialize(maxLineLength, true);
                    };
                    Message.prototype.equals = function (other) {
                        return this === other || this.headers.equals(other.headers) && (this.body === other.body || typeof Buffer === 'function' && Buffer.isBuffer(this.body) && Buffer.isBuffer(other.body) && buffersEqual(this.body, other.body));
                    };
                    Message.prototype.hasEmptyBody = function () {
                        if (typeof this.body === 'string') {
                            return this.body.length === 0;
                        } else if (typeof Buffer === 'function' && Buffer.isBuffer(this.body)) {
                            return this.body.length === 0;
                        } else if (this.body && typeof this.body === 'object') {
                            return false;
                        } else {
                            return true;
                        }
                    };
                    Message.prototype.toJSON = function () {
                        var obj = {};
                        if (this.headers.getNames().length > 0) {
                            obj.headers = this.headers.toJSON();
                        }
                        bodyPropertyNames.some(function (bodyPropertyName) {
                            var propertyValue = this['_' + bodyPropertyName];
                            if (propertyValue !== null && typeof propertyValue !== 'undefined') {
                                // An empty string is OK, but we use both null and undefined
                                if (bodyPropertyName === 'parts') {
                                    propertyValue = propertyValue.map(function (part) {
                                        return part.toJSON();
                                    });
                                }
                                obj[bodyPropertyName] = propertyValue;
                                return true;
                            }
                        }, this);
                        return obj;
                    };
                    module.exports = Message;
                }.call(this, require(4).Buffer));
            },
            {
                '30': 30,
                '4': 4,
                '40': 40,
                '45': 45,
                '57': 57,
                '59': 59
            }
        ],
        38: [
            function (require, module, exports) {
                (function (Buffer) {
                    function RequestLine(obj) {
                        this.populate(obj);
                    }
                    RequestLine.nonComputedPropertyNames = [
                        'method',
                        'url',
                        'protocolName',
                        'protocolVersion'
                    ];
                    RequestLine.propertyNames = [
                        'protocol',
                        'path',
                        'search',
                        'query'
                    ].concat(RequestLine.nonComputedPropertyNames);
                    RequestLine.prototype.isMessyRequestLine = true;
                    RequestLine.prototype.populate = function (obj) {
                        if (obj && typeof obj === 'object' && !Buffer.isBuffer(obj)) {
                            this.populateFromObject(obj);
                        } else if (typeof obj === 'string') {
                            this.populateFromString(obj);
                        }
                        return this;
                    };
                    RequestLine.prototype.populateFromObject = function (obj) {
                        RequestLine.propertyNames.forEach(function (propertyName) {
                            if (typeof obj[propertyName] !== 'undefined') {
                                this[propertyName] = obj[propertyName];
                            }
                        }, this);
                        return this;
                    };
                    RequestLine.prototype.populateProtocolFromString = function (str) {
                        if (str !== '') {
                            var protocolFragments = str.split('/');
                            if (protocolFragments.length === 2) {
                                this.protocolName = protocolFragments[0];
                                this.protocolVersion = protocolFragments[1];
                            } else {
                                throw new Error('Could not parse protocol: ' + str);
                            }
                        }
                        return this;
                    };
                    RequestLine.prototype.populateFromString = function (str) {
                        if (str !== '') {
                            var requestLineFragments = str.split(/\s+/);
                            if (requestLineFragments.length > 3) {
                                throw new Error('Could not parse request line: ' + str);
                            } else {
                                if (requestLineFragments.length > 0) {
                                    this.method = requestLineFragments[0].toUpperCase();
                                }
                                if (requestLineFragments.length > 1) {
                                    this.url = requestLineFragments[1];
                                }
                                if (requestLineFragments.length > 2) {
                                    this.populateProtocolFromString(requestLineFragments[2]);
                                }
                            }
                        }
                        return this;
                    };
                    RequestLine.prototype.populateUrlFromString = function (url) {
                        var matchUrl = url.match(/^([^?]*)(\?.*)?$/);
                        this.path = matchUrl[1] ? matchUrl[1].replace(/^\/?/, '/') : '/';
                        this.search = matchUrl[2] || undefined;
                        return this;
                    };
                    Object.defineProperty(RequestLine.prototype, 'protocol', {
                        enumerable: true,
                        get: function () {
                            var fragments = [];
                            if (typeof this.protocolName !== 'undefined') {
                                fragments.push(String(this.protocolName).toUpperCase());
                            }
                            if (typeof this.protocolVersion !== 'undefined') {
                                fragments.push('/' + this.protocolVersion);
                            }
                            if (fragments.length > 0) {
                                return fragments.join('');
                            }
                        },
                        set: function (protocol) {
                            this.populateProtocolFromString(protocol);
                        }
                    });
                    Object.defineProperty(RequestLine.prototype, 'url', {
                        enumerable: true,
                        get: function () {
                            return (this.path || '') + (this.search || '');
                        },
                        set: function (url) {
                            this.populateUrlFromString(url);
                        }
                    });
                    Object.defineProperty(RequestLine.prototype, 'query', {
                        enumerable: true,
                        get: function () {
                            return typeof this.search === 'undefined' ? undefined : String(this.search).replace(/^\?/, '');
                        },
                        set: function (query) {
                            this.url = this.url.replace(/(?:\?.*)?$/, typeof query === 'undefined' ? '' : '?' + String(query));
                        }
                    });
                    RequestLine.prototype.clone = function () {
                        return new RequestLine(this);
                    };
                    RequestLine.prototype.toString = function (maxLineLength) {
                        return String(this.method).toUpperCase() + (typeof this.url === 'string' ? ' ' + this.url + (typeof this.protocol === 'string' ? ' ' + this.protocol : '') : '');
                    };
                    RequestLine.prototype.equals = function (other) {
                        return this === other || other instanceof RequestLine && this.method === other.method && (this.path || '') === (other.path || '') && (this.search || '') === (other.search || '') && this.protocolName === other.protocolName && this.protocolVersion === other.protocolVersion;
                    };
                    RequestLine.prototype.toJSON = function () {
                        var obj = {};
                        RequestLine.nonComputedPropertyNames.forEach(function (propertyName) {
                            if (typeof this[propertyName] !== 'undefined') {
                                obj[propertyName] = this[propertyName];
                            }
                        }, this);
                        return obj;
                    };
                    module.exports = RequestLine;
                }.call(this, { 'isBuffer': require(9) }));
            },
            { '9': 9 }
        ],
        39: [
            function (require, module, exports) {
                (function (Buffer) {
                    function StatusLine(obj) {
                        this.populate(obj);
                    }
                    StatusLine.nonComputedPropertyNames = [
                        'protocolName',
                        'protocolVersion',
                        'statusCode',
                        'statusMessage'
                    ];
                    StatusLine.propertyNames = ['protocol'].concat(StatusLine.nonComputedPropertyNames);
                    StatusLine.prototype.isMessyStatusLine = true;
                    StatusLine.prototype.populate = function (obj) {
                        if (typeof obj === 'number') {
                            this.populateFromObject({ statusCode: obj });
                        } else if (typeof obj === 'string') {
                            this.populateFromString(obj);
                        } else if (obj && typeof obj === 'object' && !Buffer.isBuffer(obj)) {
                            this.populateFromObject(obj);
                        }
                        return this;
                    };
                    StatusLine.prototype.populateFromObject = function (obj) {
                        StatusLine.propertyNames.forEach(function (propertyName) {
                            if (typeof obj[propertyName] !== 'undefined') {
                                this[propertyName] = obj[propertyName];
                            }
                        }, this);
                        return this;
                    };
                    StatusLine.prototype.populateFromString = function (str) {
                        var statusLineFragments = str.split(/\s+/);
                        if (statusLineFragments.length > 0) {
                            this.populateProtocolFromString(statusLineFragments[0]);
                        }
                        if (statusLineFragments.length > 1) {
                            this.statusCode = parseInt(statusLineFragments[1], 10);
                        }
                        if (statusLineFragments.length > 2) {
                            this.statusMessage = statusLineFragments.slice(2).join(' ');
                        }
                        return this;
                    };
                    StatusLine.prototype.populateProtocolFromString = function (protocol) {
                        if (protocol !== '') {
                            var protocolFragments = protocol.split('/');
                            if (protocolFragments.length === 2) {
                                this.protocolName = protocolFragments[0];
                                this.protocolVersion = protocolFragments[1];
                            } else {
                                throw new Error('Could not parse protocol: ' + protocol);
                            }
                        }
                        return this;
                    };
                    Object.defineProperty(StatusLine.prototype, 'protocol', {
                        enumerable: true,
                        get: function () {
                            var fragments = [];
                            if (typeof this.protocolName !== 'undefined') {
                                fragments.push(String(this.protocolName).toUpperCase());
                            }
                            if (typeof this.protocolVersion !== 'undefined') {
                                fragments.push(this.protocolVersion);
                            }
                            if (fragments.length > 0) {
                                return fragments.join('/');
                            }
                        },
                        set: function (protocol) {
                            this.populateProtocolFromString(protocol);
                        }
                    });
                    StatusLine.prototype.clone = function () {
                        return new StatusLine(this);
                    };
                    StatusLine.prototype.toString = function () {
                        return this.protocol + ' ' + this.statusCode + ' ' + this.statusMessage;
                    };
                    StatusLine.prototype.equals = function (other) {
                        return this === other || other instanceof StatusLine && this.protocolName === other.protocolName && this.protocolVersion === other.protocolVersion && this.statusCode === other.statusCode && this.statusMessage === other.statusMessage;
                    };
                    StatusLine.prototype.toJSON = function () {
                        var obj = {};
                        StatusLine.nonComputedPropertyNames.forEach(function (propertyName) {
                            if (typeof this[propertyName] !== 'undefined') {
                                obj[propertyName] = this[propertyName];
                            }
                        }, this);
                        return obj;
                    };
                    module.exports = StatusLine;
                }.call(this, { 'isBuffer': require(9) }));
            },
            { '9': 9 }
        ],
        40: [
            function (require, module, exports) {
                (function (Buffer) {
                    module.exports = function decodeTransferEncodingChunked(body) {
                        var chunks = [], index = 0, nextChunkLength, nextChunkLengthHex;
                        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
                            while (index < body.length) {
                                nextChunkLengthHex = '';
                                while (index < body.length && body[index] !== 13) {
                                    var hexChar = String.fromCharCode(body[index]);
                                    if (!/[0-9a-f]/i.test(hexChar)) {
                                        throw new Error('decodeTransferEncodingChunked: Invalid hex char when decoding chunk length: ' + hexChar);
                                    }
                                    nextChunkLengthHex += hexChar;
                                    index += 1;
                                }
                                if (body[index] === 13 && body[index + 1] === 10) {
                                    index += 2;
                                    nextChunkLength = parseInt(nextChunkLengthHex, 16);
                                    if (nextChunkLength === 0) {
                                        return Buffer.concat(chunks);
                                    } else if (nextChunkLength > 0 && body.length >= index + nextChunkLength) {
                                        chunks.push(body.slice(index, index + nextChunkLength));
                                        index += nextChunkLength;
                                        // We do a best effort and exit if we've reached the end of some partial body
                                        if (index === body.length || index + 2 === body.length && body[index] === 13 && body[index + 1] === 10) {
                                            return Buffer.concat(chunks);
                                        }
                                        if (index + 2 >= body.length || body[index] !== 13 || body[index + 1] !== 10) {
                                            throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk');
                                        } else {
                                            index += 2;
                                        }
                                    } else {
                                        throw new Error('decodeTransferEncodingChunked: Parse error, not enough data to consume a chunk of ' + nextChunkLength + ' byte(s)');
                                    }
                                } else {
                                    throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk length');
                                }
                            }
                        } else {
                            // Assume string
                            while (index < body.length) {
                                nextChunkLengthHex = '';
                                while (index < body.length && body[index] !== '\r') {
                                    nextChunkLengthHex += body[index];
                                    index += 1;
                                }
                                if (body[index] === '\r' && body[index + 1] === '\n') {
                                    index += 2;
                                    nextChunkLength = parseInt(nextChunkLengthHex, 16);
                                    if (nextChunkLength === 0) {
                                        return chunks.join('');
                                    } else if (nextChunkLength > 0 && body.length >= index + nextChunkLength) {
                                        chunks.push(body.slice(index, index + nextChunkLength));
                                        index += nextChunkLength;
                                        // We do a best effort and exit if we've reached the end of some partial body
                                        if (index === body.length || index + 2 === body.length && body[index] === '\r' && body[index + 1] === '\n') {
                                            return chunks.join('');
                                        }
                                        if (index + 2 >= body.length || body[index] !== '\r' || body[index + 1] !== '\n') {
                                            throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk');
                                        } else {
                                            index += 2;
                                        }
                                    } else {
                                        throw new Error('decodeTransferEncodingChunked: Parse error, not enough data to consume a chunk of ' + nextChunkLength + ' byte(s)');
                                    }
                                } else {
                                    throw new Error('decodeTransferEncodingChunked: Parse error, expecting \\r\\n after chunk length');
                                }
                            }
                        }
                    };
                }.call(this, require(4).Buffer));
            },
            { '4': 4 }
        ],
        41: [
            function (require, module, exports) {
                module.exports = function foldHeaderLine(str, maxLength, firstLineMaxLength) {
                    maxLength = maxLength || 78;
                    firstLineMaxLength = firstLineMaxLength || maxLength;
                    if (str.length <= firstLineMaxLength) {
                        return str;
                    }
                    var result = '', currentLineStartIndex = 0, lastSpaceIndex = -1, lastSpace, isFirstLine = true;
                    for (var i = 0; i < str.length; i += 1) {
                        if (/^\s$/.test(str[i])) {
                            lastSpaceIndex = i;
                            lastSpace = str[i];
                        }
                        if (i - currentLineStartIndex >= (isFirstLine ? firstLineMaxLength : maxLength - 1) && lastSpaceIndex !== -1) {
                            result += (isFirstLine ? '' : '\r\n' + lastSpace) + str.substring(currentLineStartIndex, lastSpaceIndex);
                            isFirstLine = false;
                            i = lastSpaceIndex;
                            currentLineStartIndex = i + 1;
                            lastSpaceIndex = -1;
                        }
                    }
                    if (i > currentLineStartIndex) {
                        result += (isFirstLine ? '' : '\r\n' + lastSpace) + str.substring(currentLineStartIndex, str.length);
                    }
                    return result;
                };
            },
            {}
        ],
        42: [
            function (require, module, exports) {
                var headerNameSpecialCases = require(43);
                /**
 * Convert a header name to its canonical form,
 * e.g. "content-length" => "Content-Length".
 * @param headerName the header name (case insensitive)
 * @return {String} the formatted header name
 */
                function formatHeaderName(headerName) {
                    var lowerCasedHeaderName = headerName.toLowerCase();
                    if (headerNameSpecialCases.hasOwnProperty(lowerCasedHeaderName)) {
                        return headerNameSpecialCases[lowerCasedHeaderName];
                    } else {
                        // Make sure that the first char and all chars following a dash are upper-case:
                        return lowerCasedHeaderName.replace(/(^|-)([a-z])/g, function ($0, optionalLeadingDash, ch) {
                            return optionalLeadingDash + ch.toUpperCase();
                        });
                    }
                }
                module.exports = formatHeaderName;
            },
            { '43': 43 }
        ],
        43: [
            function (require, module, exports) {
                // Headers that cannot be canonicalized by naive camel casing:
                module.exports = {
                    'a-im': 'A-IM',
                    bcc: 'BCC',
                    cc: 'CC',
                    'content-md5': 'Content-MD5',
                    'c-pep': 'C-PEP',
                    'c-pep-info': 'C-PEP-Info',
                    'content-features': 'Content-features',
                    'content-id': 'Content-ID',
                    dasl: 'DASL',
                    dav: 'DAV',
                    'dl-expansion-history': 'DL-Expansion-History',
                    'differential-id': 'Differential-ID',
                    'discarded-x400-ipms-extensions': 'Discarded-X400-IPMS-Extensions',
                    'discarded-x400-mts-extensions': 'Discarded-X400-MTS-Extensions',
                    'dkim-signature': 'DKIM-Signature',
                    'ediint-features': 'EDIINT-Features',
                    'jabber-id': 'Jabber-ID',
                    'list-id': 'List-ID',
                    'mime-version': 'MIME-Version',
                    'message-id': 'Message-ID',
                    'mmhs-exempted-address': 'MMHS-Exempted-Address',
                    'mmhs-extended-authorisation-info': 'MMHS-Extended-Authorisation-Info',
                    'mmhs-subject-indicator-codes': 'MMHS-Subject-Indicator-Codes',
                    'mmhs-handling-instructions': 'MMHS-Handling-Instructions',
                    'mmhs-message-instructions': 'MMHS-Message-Instructions',
                    'mmhs-codress-message-indicator': 'MMHS-Codress-Message-Indicator',
                    'mmhs-originator-reference': 'MMHS-Originator-Reference',
                    'mmhs-primary-precedence': 'MMHS-Primary-Precedence',
                    'mmhs-copy-precedence': 'MMHS-Copy-Precedence',
                    'mmhs-message-type': 'MMHS-Message-Type',
                    'mmhs-other-receipients-indicator-to': 'MMHS-Other-Recipients-Indicator-To',
                    'mmhs-other-recipients-indicator-cc': 'MMHS-Other-Recipients-Indicator-CC',
                    'mmhs-acp127-message-identifier': 'MMHS-Acp127-Message-Identifier',
                    'mmhs-originator-plad': 'MMHS-Originator-PLAD',
                    'mt-priority': 'MT-Priority',
                    'nntp-posting-date': 'NNTP-Posting-Date',
                    'nntp-posting-host': 'NNTP-Posting-Host',
                    'original-message-id': 'Original-Message-ID',
                    dnt: 'DNT',
                    etag: 'ETag',
                    p3p: 'P3P',
                    pep: 'PEP̈́',
                    'pics-label': 'PICS-Label',
                    'prevent-nondelivery-report': 'Prevent-NonDelivery-Report',
                    profileobject: 'ProfileObject',
                    'received-spf': 'Received-SPF',
                    'resent-message-id': 'Resent-Message-ID',
                    'sec-websocket-accept': 'Sec-WebSocket-Accept',
                    'sec-websocket-extensions': 'Sec-WebSocket-Extensions',
                    'sec-websocket-key': 'Sec-WebSocket-Key',
                    'sec-websocket-protocol': 'Sec-WebSocket-Protocol',
                    'sec-websocket-version': 'Sec-WebSocket-Version',
                    slug: 'SLUG',
                    soapaction: 'SoapAction',
                    'status-uri': 'Status-URI',
                    subok: 'SubOK',
                    tcn: 'TCN',
                    te: 'TE',
                    'ua-color': 'UA-Color',
                    'ua-media': 'UA-Media',
                    'ua-pixels': 'UA-Pixels',
                    'ua-resolution': 'UA-Resolution',
                    'ua-windowpixels': 'UA-Windowpixels',
                    uri: 'URI',
                    'vbr-info': 'VBR-Info',
                    'www-authenticate': 'WWW-Authenticate',
                    'x400-mts-identifier': 'X400-MTS-Identifier',
                    'x-att-deviceid': 'X-ATT-DeviceId',
                    'x-cdn': 'X-CDN',
                    'x-csa-complaints': 'x-csa-complaints',
                    'x-originating-ip': 'X-Originating-IP',
                    'x-riferimento-message-id': 'X-Riferimento-Message-ID',
                    'x-sg-eid': 'X-SG-EID',
                    'x-tiporicevuta': 'X-TipoRicevuta',
                    'x-ua-compatible': 'X-UA-Compatible',
                    'x-verificasicurezza': 'X-VerificaSicurezza',
                    'x-xss-protection': 'X-XSS-Protection'
                };
            },
            {}
        ],
        44: [
            function (require, module, exports) {
                module.exports = {
                    Headers: require(30),
                    Message: require(37),
                    Mail: require(36),
                    RequestLine: require(38),
                    HttpRequest: require(34),
                    StatusLine: require(39),
                    HttpResponse: require(35),
                    HttpExchange: require(33),
                    HttpConversation: require(32),
                    formatHeaderName: require(42),
                    foldHeaderLine: require(41),
                    headerNameSpecialCases: require(43)
                };
            },
            {
                '30': 30,
                '32': 32,
                '33': 33,
                '34': 34,
                '35': 35,
                '36': 36,
                '37': 37,
                '38': 38,
                '39': 39,
                '41': 41,
                '42': 42,
                '43': 43
            }
        ],
        45: [
            function (require, module, exports) {
                module.exports = function isRegExp(re) {
                    var s;
                    try {
                        s = '' + re;
                    } catch (e) {
                        return false;
                    }
                    return re instanceof RegExp || // easy case
                    // duck-type for context-switching evalcx case
                    typeof re === 'function' && re.constructor.name === 'RegExp' && re.compile && re.test && re.exec && s.match(/^\/.*\/[gim]{0,3}$/);
                };
            },
            {}
        ],
        46: [
            function (require, module, exports) {
                'use strict';
                // Multibyte codec. In this scheme, a character is represented by 1 or more bytes.
                // Our codec supports UTF-16 surrogates, extensions for GB18030 and unicode sequences.
                // To save memory and loading time, we read table files only when requested.
                exports._dbcs = DBCSCodec;
                var UNASSIGNED = -1, GB18030_CODE = -2, SEQ_START = -10, NODE_START = -1000, UNASSIGNED_NODE = new Array(256), DEF_CHAR = -1;
                for (var i = 0; i < 256; i++)
                    UNASSIGNED_NODE[i] = UNASSIGNED;
                // Class DBCSCodec reads and initializes mapping tables.
                function DBCSCodec(codecOptions, iconv) {
                }
                DBCSCodec.prototype.encoder = DBCSEncoder;
                DBCSCodec.prototype.decoder = DBCSDecoder;
                // Decoder helpers
                DBCSCodec.prototype._getDecodeTrieNode = function (addr) {
                };
                DBCSCodec.prototype._addDecodeChunk = function (chunk) {
                };
                // Encoder helpers
                DBCSCodec.prototype._getEncodeBucket = function (uCode) {
                };
                DBCSCodec.prototype._setEncodeChar = function (uCode, dbcsCode) {
                };
                DBCSCodec.prototype._setEncodeSequence = function (seq, dbcsCode) {
                };
                DBCSCodec.prototype._fillEncodeTable = function (nodeIdx, prefix, skipEncodeChars) {
                };
                // == Encoder ==================================================================
                function DBCSEncoder(options, codec) {
                }
                DBCSEncoder.prototype.write = function (str) {
                };
                DBCSEncoder.prototype.end = function () {
                };
                // Export for testing
                DBCSEncoder.prototype.findIdx = findIdx;
                // == Decoder ==================================================================
                function DBCSDecoder(options, codec) {
                }
                DBCSDecoder.prototype.write = function (buf) {
                };
                DBCSDecoder.prototype.end = function () {
                };
                // Binary search for GB18030. Returns largest i such that table[i] <= val.
                function findIdx(table, val) {
                }
            },
            {}
        ],
        47: [
            function (require, module, exports) {
                'use strict';
                // Description of supported double byte encodings and aliases.
                // Tables are not require()-d until they are needed to speed up library load.
                // require()-s are direct to support Browserify.
                module.exports = {
                    // == Japanese/ShiftJIS ====================================================
                    // All japanese encodings are based on JIS X set of standards:
                    // JIS X 0201 - Single-byte encoding of ASCII + ¥ + Kana chars at 0xA1-0xDF.
                    // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes. 
                    //              Has several variations in 1978, 1983, 1990 and 1997.
                    // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
                    // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
                    //              2 planes, first is superset of 0208, second - revised 0212.
                    //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)
                    // Byte encodings are:
                    //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
                    //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
                    //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
                    //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
                    //               0x00-0x7F       - lower part of 0201
                    //               0x8E, 0xA1-0xDF - upper part of 0201
                    //               (0xA1-0xFE)x2   - 0208 plane (94x94).
                    //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
                    //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
                    //               Used as-is in ISO2022 family.
                    //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII, 
                    //                0201-1976 Roman, 0208-1978, 0208-1983.
                    //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
                    //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
                    //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
                    //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
                    //
                    // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
                    //
                    // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html
                    'shiftjis': {
                        type: '_dbcs',
                        table: function () {
                        },
                        encodeAdd: {
                            '\xA5': 92,
                            '\u203E': 126
                        },
                        encodeSkipVals: [{
                                from: 60736,
                                to: 63808
                            }]
                    },
                    'csshiftjis': 'shiftjis',
                    'mskanji': 'shiftjis',
                    'sjis': 'shiftjis',
                    'windows31j': 'shiftjis',
                    'xsjis': 'shiftjis',
                    'windows932': 'shiftjis',
                    '932': 'shiftjis',
                    'cp932': 'shiftjis',
                    'eucjp': {
                        type: '_dbcs',
                        table: function () {
                        },
                        encodeAdd: {
                            '\xA5': 92,
                            '\u203E': 126
                        }
                    },
                    // TODO: KDDI extension to Shift_JIS
                    // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
                    // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.
                    // == Chinese/GBK ==========================================================
                    // http://en.wikipedia.org/wiki/GBK
                    // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
                    'gb2312': 'cp936',
                    'gb231280': 'cp936',
                    'gb23121980': 'cp936',
                    'csgb2312': 'cp936',
                    'csiso58gb231280': 'cp936',
                    'euccn': 'cp936',
                    'isoir58': 'gbk',
                    // Microsoft's CP936 is a subset and approximation of GBK.
                    // TODO: Euro = 0x80 in cp936, but not in GBK (where it's valid but undefined)
                    'windows936': 'cp936',
                    '936': 'cp936',
                    'cp936': {
                        type: '_dbcs',
                        table: function () {
                        }
                    },
                    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
                    'gbk': {
                        type: '_dbcs',
                        table: function () {
                        }
                    },
                    'xgbk': 'gbk',
                    // GB18030 is an algorithmic extension of GBK.
                    'gb18030': {
                        type: '_dbcs',
                        table: function () {
                        },
                        gb18030: function () {
                        }
                    },
                    'chinese': 'gb18030',
                    // TODO: Support GB18030 (~27000 chars + whole unicode mapping, cp54936)
                    // http://icu-project.org/docs/papers/gb18030.html
                    // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
                    // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0
                    // == Korean ===============================================================
                    // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
                    'windows949': 'cp949',
                    '949': 'cp949',
                    'cp949': {
                        type: '_dbcs',
                        table: function () {
                        }
                    },
                    'cseuckr': 'cp949',
                    'csksc56011987': 'cp949',
                    'euckr': 'cp949',
                    'isoir149': 'cp949',
                    'korean': 'cp949',
                    'ksc56011987': 'cp949',
                    'ksc56011989': 'cp949',
                    'ksc5601': 'cp949',
                    // == Big5/Taiwan/Hong Kong ================================================
                    // There are lots of tables for Big5 and cp950. Please see the following links for history:
                    // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
                    // Variations, in roughly number of defined chars:
                    //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
                    //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
                    //  * Big5-2003 (Taiwan standard) almost superset of cp950.
                    //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
                    //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard. 
                    //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
                    //    Plus, it has 4 combining sequences.
                    //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
                    //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
                    //    Implementations are not consistent within browsers; sometimes labeled as just big5.
                    //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
                    //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
                    //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
                    //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
                    //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
                    // 
                    // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
                    // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.
                    'windows950': 'cp950',
                    '950': 'cp950',
                    'cp950': {
                        type: '_dbcs',
                        table: function () {
                        }
                    },
                    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
                    'big5': 'big5hkscs',
                    'big5hkscs': {
                        type: '_dbcs',
                        table: function () {
                        },
                        encodeSkipVals: [41676]
                    },
                    'cnbig5': 'big5hkscs',
                    'csbig5': 'big5hkscs',
                    'xxbig5': 'big5hkscs'
                };
            },
            {}
        ],
        48: [
            function (require, module, exports) {
                'use strict';
                // Update this array if you add/rename/remove files in this directory.
                // We support Browserify by skipping automatic module discovery and requiring modules directly.
                var modules = [
                    require(49),
                    require(53),
                    require(54),
                    require(50),
                    require(52),
                    require(51),
                    require(46),
                    require(47)
                ];
                // Put all encoding/alias/codec definitions to single object and export it. 
                for (var i = 0; i < modules.length; i++) {
                    var module = modules[i];
                    for (var enc in module)
                        if (Object.prototype.hasOwnProperty.call(module, enc))
                            exports[enc] = module[enc];
                }
            },
            {
                '46': 46,
                '47': 47,
                '49': 49,
                '50': 50,
                '51': 51,
                '52': 52,
                '53': 53,
                '54': 54
            }
        ],
        49: [
            function (require, module, exports) {
                (function (Buffer) {
                    'use strict';
                    // Export Node.js internal encodings.
                    module.exports = {
                        // Encodings
                        utf8: {
                            type: '_internal',
                            bomAware: true
                        },
                        cesu8: {
                            type: '_internal',
                            bomAware: true
                        },
                        unicode11utf8: 'utf8',
                        ucs2: {
                            type: '_internal',
                            bomAware: true
                        },
                        utf16le: 'ucs2',
                        binary: { type: '_internal' },
                        base64: { type: '_internal' },
                        hex: { type: '_internal' },
                        // Codec.
                        _internal: InternalCodec
                    };
                    //------------------------------------------------------------------------------
                    function InternalCodec(codecOptions, iconv) {
                        this.enc = codecOptions.encodingName;
                        this.bomAware = codecOptions.bomAware;
                        if (this.enc === 'base64')
                            this.encoder = InternalEncoderBase64;
                        else if (this.enc === 'cesu8') {
                            this.enc = 'utf8';
                            // Use utf8 for decoding.
                            this.encoder = InternalEncoderCesu8;
                            // Add decoder for versions of Node not supporting CESU-8
                            if (new Buffer('eda080', 'hex').toString().length == 3) {
                                this.decoder = InternalDecoderCesu8;
                                this.defaultCharUnicode = iconv.defaultCharUnicode;
                            }
                        }
                    }
                    InternalCodec.prototype.encoder = InternalEncoder;
                    InternalCodec.prototype.decoder = InternalDecoder;
                    //------------------------------------------------------------------------------
                    // We use node.js internal decoder. Its signature is the same as ours.
                    var StringDecoder = require(25).StringDecoder;
                    if (!StringDecoder.prototype.end)
                        // Node v0.8 doesn't have this method.
                        StringDecoder.prototype.end = function () {
                        };
                    function InternalDecoder(options, codec) {
                        StringDecoder.call(this, codec.enc);
                    }
                    InternalDecoder.prototype = StringDecoder.prototype;
                    //------------------------------------------------------------------------------
                    // Encoder is mostly trivial
                    function InternalEncoder(options, codec) {
                    }
                    InternalEncoder.prototype.write = function (str) {
                    };
                    InternalEncoder.prototype.end = function () {
                    };
                    //------------------------------------------------------------------------------
                    // Except base64 encoder, which must keep its state.
                    function InternalEncoderBase64(options, codec) {
                    }
                    InternalEncoderBase64.prototype.write = function (str) {
                    };
                    InternalEncoderBase64.prototype.end = function () {
                    };
                    //------------------------------------------------------------------------------
                    // CESU-8 encoder is also special.
                    function InternalEncoderCesu8(options, codec) {
                    }
                    InternalEncoderCesu8.prototype.write = function (str) {
                    };
                    InternalEncoderCesu8.prototype.end = function () {
                    };
                    //------------------------------------------------------------------------------
                    // CESU-8 decoder is not implemented in Node v4.0+
                    function InternalDecoderCesu8(options, codec) {
                    }
                    InternalDecoderCesu8.prototype.write = function (buf) {
                    };
                    InternalDecoderCesu8.prototype.end = function () {
                    };
                }.call(this, require(4).Buffer));
            },
            {
                '25': 25,
                '4': 4
            }
        ],
        50: [
            function (require, module, exports) {
                (function (Buffer) {
                    'use strict';
                    // Single-byte codec. Needs a 'chars' string parameter that contains 256 or 128 chars that
                    // correspond to encoded bytes (if 128 - then lower half is ASCII). 
                    exports._sbcs = SBCSCodec;
                    function SBCSCodec(codecOptions, iconv) {
                        if (!codecOptions)
                            throw new Error('SBCS codec is called without the data.');
                        // Prepare char buffer for decoding.
                        if (!codecOptions.chars || codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256)
                            throw new Error('Encoding \'' + codecOptions.type + '\' has incorrect \'chars\' (must be of len 128 or 256)');
                        if (codecOptions.chars.length === 128) {
                            var asciiString = '';
                            for (var i = 0; i < 128; i++)
                                asciiString += String.fromCharCode(i);
                            codecOptions.chars = asciiString + codecOptions.chars;
                        }
                        this.decodeBuf = new Buffer(codecOptions.chars, 'ucs2');
                        // Encoding buffer.
                        var encodeBuf = new Buffer(65536);
                        encodeBuf.fill(iconv.defaultCharSingleByte.charCodeAt(0));
                        for (var i = 0; i < codecOptions.chars.length; i++)
                            encodeBuf[codecOptions.chars.charCodeAt(i)] = i;
                        this.encodeBuf = encodeBuf;
                    }
                    SBCSCodec.prototype.encoder = SBCSEncoder;
                    SBCSCodec.prototype.decoder = SBCSDecoder;
                    function SBCSEncoder(options, codec) {
                        this.encodeBuf = codec.encodeBuf;
                    }
                    SBCSEncoder.prototype.write = function (str) {
                        var buf = new Buffer(str.length);
                        for (var i = 0; i < str.length; i++)
                            buf[i] = this.encodeBuf[str.charCodeAt(i)];
                        return buf;
                    };
                    SBCSEncoder.prototype.end = function () {
                    };
                    function SBCSDecoder(options, codec) {
                        this.decodeBuf = codec.decodeBuf;
                    }
                    SBCSDecoder.prototype.write = function (buf) {
                        // Strings are immutable in JS -> we use ucs2 buffer to speed up computations.
                        var decodeBuf = this.decodeBuf;
                        var newBuf = new Buffer(buf.length * 2);
                        var idx1 = 0, idx2 = 0;
                        for (var i = 0; i < buf.length; i++) {
                            idx1 = buf[i] * 2;
                            idx2 = i * 2;
                            newBuf[idx2] = decodeBuf[idx1];
                            newBuf[idx2 + 1] = decodeBuf[idx1 + 1];
                        }
                        return newBuf.toString('ucs2');
                    };
                    SBCSDecoder.prototype.end = function () {
                    };
                }.call(this, require(4).Buffer));
            },
            { '4': 4 }
        ],
        51: [
            function (require, module, exports) {
                'use strict';
                // Generated data for sbcs codec. Don't edit manually. Regenerate using generation/gen-sbcs.js script.
                module.exports = {
                    '437': 'cp437',
                    '737': 'cp737',
                    '775': 'cp775',
                    '850': 'cp850',
                    '852': 'cp852',
                    '855': 'cp855',
                    '856': 'cp856',
                    '857': 'cp857',
                    '858': 'cp858',
                    '860': 'cp860',
                    '861': 'cp861',
                    '862': 'cp862',
                    '863': 'cp863',
                    '864': 'cp864',
                    '865': 'cp865',
                    '866': 'cp866',
                    '869': 'cp869',
                    '874': 'windows874',
                    '922': 'cp922',
                    '1046': 'cp1046',
                    '1124': 'cp1124',
                    '1125': 'cp1125',
                    '1129': 'cp1129',
                    '1133': 'cp1133',
                    '1161': 'cp1161',
                    '1162': 'cp1162',
                    '1163': 'cp1163',
                    '1250': 'windows1250',
                    '1251': 'windows1251',
                    '1252': 'windows1252',
                    '1253': 'windows1253',
                    '1254': 'windows1254',
                    '1255': 'windows1255',
                    '1256': 'windows1256',
                    '1257': 'windows1257',
                    '1258': 'windows1258',
                    '28591': 'iso88591',
                    '28592': 'iso88592',
                    '28593': 'iso88593',
                    '28594': 'iso88594',
                    '28595': 'iso88595',
                    '28596': 'iso88596',
                    '28597': 'iso88597',
                    '28598': 'iso88598',
                    '28599': 'iso88599',
                    '28600': 'iso885910',
                    '28601': 'iso885911',
                    '28603': 'iso885913',
                    '28604': 'iso885914',
                    '28605': 'iso885915',
                    '28606': 'iso885916',
                    'windows874': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\uFFFD\uFFFD\uFFFD\u2026\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\xA0กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\uFFFD\uFFFD\uFFFD\uFFFD\u0E3Fเแโใไๅๆ็่้๊๋์ํ๎\u0E4F๐๑๒๓๔๕๖๗๘๙\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'win874': 'windows874',
                    'cp874': 'windows874',
                    'windows1250': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\u201A\uFFFD\u201E\u2026\u2020\u2021\uFFFD\u2030Š\u2039ŚŤŽŹ\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122š\u203Aśťžź\xA0ˇ\u02D8Ł\xA4Ą\xA6\xA7\xA8\xA9Ş\xAB\xAC\xAD\xAEŻ\xB0\xB1\u02DBł\xB4µ\xB6\xB7\xB8ąş\xBBĽ\u02DDľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ\xD7ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö\xF7řůúűüýţ\u02D9'
                    },
                    'win1250': 'windows1250',
                    'cp1250': 'windows1250',
                    'windows1251': {
                        'type': '_sbcs',
                        'chars': 'ЂЃ\u201Aѓ\u201E\u2026\u2020\u2021\u20AC\u2030Љ\u2039ЊЌЋЏђ\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122љ\u203Aњќћџ\xA0ЎўЈ\xA4Ґ\xA6\xA7Ё\xA9Є\xAB\xAC\xAD\xAEЇ\xB0\xB1Ііґµ\xB6\xB7ё\u2116є\xBBјЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя'
                    },
                    'win1251': 'windows1251',
                    'cp1251': 'windows1251',
                    'windows1252': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\u201Aƒ\u201E\u2026\u2020\u2021ˆ\u2030Š\u2039Œ\uFFFDŽ\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122š\u203Aœ\uFFFDžŸ\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ\xD7ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö\xF7øùúûüýþÿ'
                    },
                    'win1252': 'windows1252',
                    'cp1252': 'windows1252',
                    'windows1253': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\u201Aƒ\u201E\u2026\u2020\u2021\uFFFD\u2030\uFFFD\u2039\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\uFFFD\u203A\uFFFD\uFFFD\uFFFD\uFFFD\xA0\u0385Ά\xA3\xA4\xA5\xA6\xA7\xA8\xA9\uFFFD\xAB\xAC\xAD\xAE\u2015\xB0\xB1\xB2\xB3\u0384µ\xB6\xB7ΈΉΊ\xBBΌ\xBDΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ\uFFFDΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ\uFFFD'
                    },
                    'win1253': 'windows1253',
                    'cp1253': 'windows1253',
                    'windows1254': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\u201Aƒ\u201E\u2026\u2020\u2021ˆ\u2030Š\u2039Œ\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122š\u203Aœ\uFFFD\uFFFDŸ\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ\xD7ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö\xF7øùúûüışÿ'
                    },
                    'win1254': 'windows1254',
                    'cp1254': 'windows1254',
                    'windows1255': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\u201Aƒ\u201E\u2026\u2020\u2021ˆ\u2030\uFFFD\u2039\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\uFFFD\u203A\uFFFD\uFFFD\uFFFD\uFFFD\xA0\xA1\xA2\xA3\u20AA\xA5\xA6\xA7\xA8\xA9\xD7\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9\xF7\xBB\xBC\xBD\xBE\xBFְֱֲֳִֵֶַָֹ\uFFFDֻּֽ\u05BEֿ\u05C0ׁׂ\u05C3װױײ\u05F3\u05F4\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFDאבגדהוזחטיךכלםמןנסעףפץצקרשת\uFFFD\uFFFD\u200E\u200F\uFFFD'
                    },
                    'win1255': 'windows1255',
                    'cp1255': 'windows1255',
                    'windows1256': {
                        'type': '_sbcs',
                        'chars': '\u20ACپ\u201Aƒ\u201E\u2026\u2020\u2021ˆ\u2030ٹ\u2039Œچژڈگ\u2018\u2019\u201C\u201D\u2022\u2013\u2014ک\u2122ڑ\u203Aœ‌‍ں\xA0\u060C\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ھ\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9\u061B\xBB\xBC\xBD\xBE\u061Fہءآأؤإئابةتثجحخدذرزسشصض\xD7طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ\xF7ّùْûü\u200E\u200Fے'
                    },
                    'win1256': 'windows1256',
                    'cp1256': 'windows1256',
                    'windows1257': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\u201A\uFFFD\u201E\u2026\u2020\u2021\uFFFD\u2030\uFFFD\u2039\uFFFD\xA8ˇ\xB8\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\uFFFD\u203A\uFFFD\xAF\u02DB\uFFFD\xA0\uFFFD\xA2\xA3\xA4\uFFFD\xA6\xA7Ø\xA9Ŗ\xAB\xAC\xAD\xAEÆ\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7ø\xB9ŗ\xBB\xBC\xBD\xBEæĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ\xD7ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö\xF7ųłśūüżž\u02D9'
                    },
                    'win1257': 'windows1257',
                    'cp1257': 'windows1257',
                    'windows1258': {
                        'type': '_sbcs',
                        'chars': '\u20AC\uFFFD\u201Aƒ\u201E\u2026\u2020\u2021ˆ\u2030\uFFFD\u2039Œ\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\uFFFD\u203Aœ\uFFFD\uFFFDŸ\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ\xD7ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö\xF7øùúûüư\u20ABÿ'
                    },
                    'win1258': 'windows1258',
                    'cp1258': 'windows1258',
                    'iso88591': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ\xD7ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö\xF7øùúûüýþÿ'
                    },
                    'cp28591': 'iso88591',
                    'iso88592': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0Ą\u02D8Ł\xA4ĽŚ\xA7\xA8ŠŞŤŹ\xADŽŻ\xB0ą\u02DBł\xB4ľśˇ\xB8šşťź\u02DDžżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ\xD7ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö\xF7řůúűüýţ\u02D9'
                    },
                    'cp28592': 'iso88592',
                    'iso88593': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0Ħ\u02D8\xA3\xA4\uFFFDĤ\xA7\xA8İŞĞĴ\xAD\uFFFDŻ\xB0ħ\xB2\xB3\xB4µĥ\xB7\xB8ışğĵ\xBD\uFFFDżÀÁÂ\uFFFDÄĊĈÇÈÉÊËÌÍÎÏ\uFFFDÑÒÓÔĠÖ\xD7ĜÙÚÛÜŬŜßàáâ\uFFFDäċĉçèéêëìíîï\uFFFDñòóôġö\xF7ĝùúûüŭŝ\u02D9'
                    },
                    'cp28593': 'iso88593',
                    'iso88594': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0ĄĸŖ\xA4ĨĻ\xA7\xA8ŠĒĢŦ\xADŽ\xAF\xB0ą\u02DBŗ\xB4ĩļˇ\xB8šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ\xD7ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö\xF7øųúûüũū\u02D9'
                    },
                    'cp28594': 'iso88594',
                    'iso88595': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0ЁЂЃЄЅІЇЈЉЊЋЌ\xADЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя\u2116ёђѓєѕіїјљњћќ\xA7ўџ'
                    },
                    'cp28595': 'iso88595',
                    'iso88596': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\uFFFD\uFFFD\uFFFD\xA4\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u060C\xAD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u061B\uFFFD\uFFFD\uFFFD\u061F\uFFFDءآأؤإئابةتثجحخدذرزسشصضطظعغ\uFFFD\uFFFD\uFFFD\uFFFD\uFFFDـفقكلمنهوىيًٌٍَُِّْ\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'cp28596': 'iso88596',
                    'iso88597': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u2018\u2019\xA3\u20AC\u20AF\xA6\xA7\xA8\xA9ͺ\xAB\xAC\xAD\uFFFD\u2015\xB0\xB1\xB2\xB3\u0384\u0385Ά\xB7ΈΉΊ\xBBΌ\xBDΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ\uFFFDΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ\uFFFD'
                    },
                    'cp28597': 'iso88597',
                    'iso88598': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\uFFFD\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xD7\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9\xF7\xBB\xBC\xBD\xBE\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2017אבגדהוזחטיךכלםמןנסעףפץצקרשת\uFFFD\uFFFD\u200E\u200F\uFFFD'
                    },
                    'cp28598': 'iso88598',
                    'iso88599': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ\xD7ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö\xF7øùúûüışÿ'
                    },
                    'cp28599': 'iso88599',
                    'iso885910': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0ĄĒĢĪĨĶ\xA7ĻĐŠŦŽ\xADŪŊ\xB0ąēģīĩķ\xB7ļđšŧž\u2015ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ'
                    },
                    'cp28600': 'iso885910',
                    'iso885911': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\uFFFD\uFFFD\uFFFD\uFFFD\u0E3Fเแโใไๅๆ็่้๊๋์ํ๎\u0E4F๐๑๒๓๔๕๖๗๘๙\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'cp28601': 'iso885911',
                    'iso885913': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u201D\xA2\xA3\xA4\u201E\xA6\xA7Ø\xA9Ŗ\xAB\xAC\xAD\xAEÆ\xB0\xB1\xB2\xB3\u201Cµ\xB6\xB7ø\xB9ŗ\xBB\xBC\xBD\xBEæĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ\xD7ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö\xF7ųłśūüżž\u2019'
                    },
                    'cp28603': 'iso885913',
                    'iso885914': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0Ḃḃ\xA3ĊċḊ\xA7Ẁ\xA9ẂḋỲ\xAD\xAEŸḞḟĠġṀṁ\xB6ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ'
                    },
                    'cp28604': 'iso885914',
                    'iso885915': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\u20AC\xA5Š\xA7š\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3Žµ\xB6\xB7ž\xB9º\xBBŒœŸ\xBFÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ\xD7ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö\xF7øùúûüýþÿ'
                    },
                    'cp28605': 'iso885915',
                    'iso885916': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0ĄąŁ\u20AC\u201EŠ\xA7š\xA9Ș\xABŹ\xADźŻ\xB0\xB1ČłŽ\u201D\xB6\xB7žčș\xBBŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ'
                    },
                    'cp28606': 'iso885916',
                    'cp437': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ\xA2\xA3\xA5\u20A7ƒáíóúñÑªº\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580αßΓπΣσµτΦΘΩδ\u221Eφε\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0'
                    },
                    'ibm437': 'cp437',
                    'csibm437': 'cp437',
                    'cp737': {
                        'type': '_sbcs',
                        'chars': 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580ωάέήϊίόύϋώΆΈΉΊΌΎΏ\xB1\u2265\u2264ΪΫ\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0'
                    },
                    'ibm737': 'cp737',
                    'csibm737': 'cp737',
                    'cp775': {
                        'type': '_sbcs',
                        'chars': 'ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ\xA2ŚśÖÜø\xA3Ø\xD7\xA4ĀĪóŻżź\u201D\xA6\xA9\xAE\xAC\xBD\xBCŁ\xAB\xBB\u2591\u2592\u2593\u2502\u2524ĄČĘĖ\u2563\u2551\u2557\u255DĮŠ\u2510\u2514\u2534\u252C\u251C\u2500\u253CŲŪ\u255A\u2554\u2569\u2566\u2560\u2550\u256CŽąčęėįšųūž\u2518\u250C\u2588\u2584\u258C\u2590\u2580ÓßŌŃõÕµńĶķĻļņĒŅ\u2019\xAD\xB1\u201C\xBE\xB6\xA7\xF7\u201E\xB0\u2219\xB7\xB9\xB3\xB2\u25A0\xA0'
                    },
                    'ibm775': 'cp775',
                    'csibm775': 'cp775',
                    'cp850': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø\xA3Ø\xD7ƒáíóúñÑªº\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524ÁÂÀ\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253CãÃ\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4ðÐÊËÈıÍÎÏ\u2518\u250C\u2588\u2584\xA6Ì\u2580ÓßÔÒõÕµþÞÚÛÙýÝ\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0'
                    },
                    'ibm850': 'cp850',
                    'csibm850': 'cp850',
                    'cp852': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ\xD7čáíóúĄąŽžĘę\xACźČş\xAB\xBB\u2591\u2592\u2593\u2502\u2524ÁÂĚŞ\u2563\u2551\u2557\u255DŻż\u2510\u2514\u2534\u252C\u251C\u2500\u253CĂă\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4đĐĎËďŇÍÎě\u2518\u250C\u2588\u2584ŢŮ\u2580ÓßÔŃńňŠšŔÚŕŰýÝţ\xB4\xAD\u02DD\u02DBˇ\u02D8\xA7\xF7\xB8\xB0\xA8\u02D9űŘř\u25A0\xA0'
                    },
                    'ibm852': 'cp852',
                    'csibm852': 'cp852',
                    'cp855': {
                        'type': '_sbcs',
                        'chars': 'ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ\xAB\xBB\u2591\u2592\u2593\u2502\u2524хХиИ\u2563\u2551\u2557\u255DйЙ\u2510\u2514\u2534\u252C\u251C\u2500\u253CкК\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4лЛмМнНоОп\u2518\u250C\u2588\u2584Пя\u2580ЯрРсСтТуУжЖвВьЬ\u2116\xADыЫзЗшШэЭщЩчЧ\xA7\u25A0\xA0'
                    },
                    'ibm855': 'cp855',
                    'csibm855': 'cp855',
                    'cp856': {
                        'type': '_sbcs',
                        'chars': 'אבגדהוזחטיךכלםמןנסעףפץצקרשת\uFFFD\xA3\uFFFD\xD7\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\xAE\xAC\xBD\xBC\uFFFD\xAB\xBB\u2591\u2592\u2593\u2502\u2524\uFFFD\uFFFD\uFFFD\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253C\uFFFD\uFFFD\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2518\u250C\u2588\u2584\xA6\uFFFD\u2580\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFDµ\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0'
                    },
                    'ibm856': 'cp856',
                    'csibm856': 'cp856',
                    'cp857': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø\xA3ØŞşáíóúñÑĞğ\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524ÁÂÀ\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253CãÃ\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4ºªÊËÈ\uFFFDÍÎÏ\u2518\u250C\u2588\u2584\xA6Ì\u2580ÓßÔÒõÕµ\uFFFD\xD7ÚÛÙìÿ\xAF\xB4\xAD\xB1\uFFFD\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0'
                    },
                    'ibm857': 'cp857',
                    'csibm857': 'cp857',
                    'cp858': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø\xA3Ø\xD7ƒáíóúñÑªº\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524ÁÂÀ\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253CãÃ\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4ðÐÊËÈ\u20ACÍÎÏ\u2518\u250C\u2588\u2584\xA6Ì\u2580ÓßÔÒõÕµþÞÚÛÙýÝ\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0'
                    },
                    'ibm858': 'cp858',
                    'csibm858': 'cp858',
                    'cp860': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ\xA2\xA3Ù\u20A7ÓáíóúñÑªº\xBFÒ\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580αßΓπΣσµτΦΘΩδ\u221Eφε\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0'
                    },
                    'ibm860': 'cp860',
                    'csibm860': 'cp860',
                    'cp861': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø\xA3Ø\u20A7ƒáíóúÁÍÓÚ\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580αßΓπΣσµτΦΘΩδ\u221Eφε\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0'
                    },
                    'ibm861': 'cp861',
                    'csibm861': 'cp861',
                    'cp862': {
                        'type': '_sbcs',
                        'chars': 'אבגדהוזחטיךכלםמןנסעףפץצקרשת\xA2\xA3\xA5\u20A7ƒáíóúñÑªº\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580αßΓπΣσµτΦΘΩδ\u221Eφε\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0'
                    },
                    'ibm862': 'cp862',
                    'csibm862': 'cp862',
                    'cp863': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâÂà\xB6çêëèïî\u2017À\xA7ÉÈÊôËÏûù\xA4ÔÜ\xA2\xA3ÙÛƒ\xA6\xB4óú\xA8\xB8\xB3\xAFÎ\u2310\xAC\xBD\xBC\xBE\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580αßΓπΣσµτΦΘΩδ\u221Eφε\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0'
                    },
                    'ibm863': 'cp863',
                    'csibm863': 'cp863',
                    'cp864': {
                        'type': '_sbcs',
                        'chars': '\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$\u066A&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F\xB0\xB7\u2219\u221A\u2592\u2500\u2502\u253C\u2524\u252C\u251C\u2534\u2510\u250C\u2514\u2518β\u221Eφ\xB1\xBD\xBC\u2248\xAB\xBBﻷﻸ\uFFFD\uFFFDﻻﻼ\uFFFD\xA0\xADﺂ\xA3\xA4ﺄ\uFFFD\uFFFDﺎﺏﺕﺙ\u060Cﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ\u061Bﺱﺵﺹ\u061F\xA2ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ\xA6\xAC\xF7\xD7ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ\u25A0\uFFFD'
                    },
                    'ibm864': 'cp864',
                    'csibm864': 'cp864',
                    'cp865': {
                        'type': '_sbcs',
                        'chars': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø\xA3Ø\u20A7ƒáíóúñÑªº\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xA4\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580αßΓπΣσµτΦΘΩδ\u221Eφε\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0'
                    },
                    'ibm865': 'cp865',
                    'csibm865': 'cp865',
                    'cp866': {
                        'type': '_sbcs',
                        'chars': 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580рстуфхцчшщъыьэюяЁёЄєЇїЎў\xB0\u2219\xB7\u221A\u2116\xA4\u25A0\xA0'
                    },
                    'ibm866': 'cp866',
                    'csibm866': 'cp866',
                    'cp869': {
                        'type': '_sbcs',
                        'chars': '\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFDΆ\uFFFD\xB7\xAC\xA6\u2018\u2019Έ\u2015ΉΊΪΌ\uFFFD\uFFFDΎΫ\xA9Ώ\xB2\xB3ά\xA3έήίϊΐόύΑΒΓΔΕΖΗ\xBDΘΙ\xAB\xBB\u2591\u2592\u2593\u2502\u2524ΚΛΜΝ\u2563\u2551\u2557\u255DΞΟ\u2510\u2514\u2534\u252C\u251C\u2500\u253CΠΡ\u255A\u2554\u2569\u2566\u2560\u2550\u256CΣΤΥΦΧΨΩαβγ\u2518\u250C\u2588\u2584δε\u2580ζηθικλμνξοπρσςτ\u0384\xAD\xB1υφχ\xA7ψ\u0385\xB0\xA8ωϋΰώ\u25A0\xA0'
                    },
                    'ibm869': 'cp869',
                    'csibm869': 'cp869',
                    'cp922': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\u203E\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ\xD7ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö\xF7øùúûüýžÿ'
                    },
                    'ibm922': 'cp922',
                    'csibm922': 'cp922',
                    'cp1046': {
                        'type': '_sbcs',
                        'chars': 'ﺈ\xD7\xF7\uF8F6\uF8F5\uF8F4\uF8F7ﹱ\x88\u25A0\u2502\u2500\u2510\u250C\u2514\u2518ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ\xA0\uF8FA\uF8F9\uF8F8\xA4\uF8FBﺋﺑﺗﺛﺟﺣ\u060C\xADﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ\u061Bﺻﺿﻊ\u061Fﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟ\uF8FCﻵﻷﻹﻻﻣﻧﻬﻩ\uFFFD'
                    },
                    'ibm1046': 'cp1046',
                    'csibm1046': 'cp1046',
                    'cp1124': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0ЁЂҐЄЅІЇЈЉЊЋЌ\xADЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя\u2116ёђґєѕіїјљњћќ\xA7ўџ'
                    },
                    'ibm1124': 'cp1124',
                    'csibm1124': 'cp1124',
                    'cp1125': {
                        'type': '_sbcs',
                        'chars': 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580рстуфхцчшщъыьэюяЁёҐґЄєІіЇї\xB7\u221A\u2116\xA4\u25A0\xA0'
                    },
                    'ibm1125': 'cp1125',
                    'csibm1125': 'cp1125',
                    'cp1129': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7œ\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3Ÿµ\xB6\xB7Œ\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ\xD7ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö\xF7øùúûüư\u20ABÿ'
                    },
                    'ibm1129': 'cp1129',
                    'csibm1129': 'cp1129',
                    'cp1133': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ\uFFFD\uFFFD\uFFFDຯະາຳິີຶືຸູຼັົຽ\uFFFD\uFFFD\uFFFDເແໂໃໄ່້໊໋໌ໍໆ\uFFFDໜໝ\u20AD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD໐໑໒໓໔໕໖໗໘໙\uFFFD\uFFFD\xA2\xAC\xA6\uFFFD'
                    },
                    'ibm1133': 'cp1133',
                    'csibm1133': 'cp1133',
                    'cp1161': {
                        'type': '_sbcs',
                        'chars': '\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋\u20AC\u0E3Fเแโใไๅๆ็่้๊๋์ํ๎\u0E4F๐๑๒๓๔๕๖๗๘๙\u0E5A\u0E5B\xA2\xAC\xA6\xA0'
                    },
                    'ibm1161': 'cp1161',
                    'csibm1161': 'cp1161',
                    'cp1162': {
                        'type': '_sbcs',
                        'chars': '\u20AC\x81\x82\x83\x84\u2026\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\u2018\u2019\u201C\u201D\u2022\u2013\u2014\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\uFFFD\uFFFD\uFFFD\uFFFD\u0E3Fเแโใไๅๆ็่้๊๋์ํ๎\u0E4F๐๑๒๓๔๕๖๗๘๙\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'ibm1162': 'cp1162',
                    'csibm1162': 'cp1162',
                    'cp1163': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\u20AC\xA5\xA6\xA7œ\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3Ÿµ\xB6\xB7Œ\xB9º\xBB\xBC\xBD\xBE\xBFÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ\xD7ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö\xF7øùúûüư\u20ABÿ'
                    },
                    'ibm1163': 'cp1163',
                    'csibm1163': 'cp1163',
                    'maccroatian': {
                        'type': '_sbcs',
                        'chars': 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü\u2020\xB0\xA2\xA3\xA7\u2022\xB6ß\xAEŠ\u2122\xB4\xA8\u2260ŽØ\u221E\xB1\u2264\u2265\u2206µ\u2202\u2211\u220Fš\u222BªºΩžø\xBF\xA1\xAC\u221Aƒ\u2248Ć\xABČ\u2026\xA0ÀÃÕŒœĐ\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\uFFFD\xA9\u2044\xA4\u2039\u203AÆ\xBB\u2013\xB7\u201A\u201E\u2030ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ\u02DC\xAFπË\u02DA\xB8Êæˇ'
                    },
                    'maccyrillic': {
                        'type': '_sbcs',
                        'chars': 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\u2020\xB0\xA2\xA3\xA7\u2022\xB6І\xAE\xA9\u2122Ђђ\u2260Ѓѓ\u221E\xB1\u2264\u2265іµ\u2202ЈЄєЇїЉљЊњјЅ\xAC\u221Aƒ\u2248\u2206\xAB\xBB\u2026\xA0ЋћЌќѕ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u201EЎўЏџ\u2116Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю\xA4'
                    },
                    'macgreek': {
                        'type': '_sbcs',
                        'chars': 'Ä\xB9\xB2É\xB3ÖÜ\u0385àâä\u0384\xA8çéèêë\xA3\u2122îï\u2022\xBD\u2030ôö\xA6\xADùûü\u2020ΓΔΘΛΞΠß\xAE\xA9ΣΪ\xA7\u2260\xB0\u0387Α\xB1\u2264\u2265\xA5ΒΕΖΗΙΚΜΦΫΨΩάΝ\xACΟΡ\u2248Τ\xAB\xBB\u2026\xA0ΥΧΆΈœ\u2013\u2015\u201C\u201D\u2018\u2019\xF7ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\uFFFD'
                    },
                    'maciceland': {
                        'type': '_sbcs',
                        'chars': 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ\xB0\xA2\xA3\xA7\u2022\xB6ß\xAE\xA9\u2122\xB4\xA8\u2260ÆØ\u221E\xB1\u2264\u2265\xA5µ\u2202\u2211\u220Fπ\u222BªºΩæø\xBF\xA1\xAC\u221Aƒ\u2248\u2206\xAB\xBB\u2026\xA0ÀÃÕŒœ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CAÿŸ\u2044\xA4ÐðÞþý\xB7\u201A\u201E\u2030ÂÊÁËÈÍÎÏÌÓÔ\uFFFDÒÚÛÙıˆ\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DBˇ'
                    },
                    'macroman': {
                        'type': '_sbcs',
                        'chars': 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü\u2020\xB0\xA2\xA3\xA7\u2022\xB6ß\xAE\xA9\u2122\xB4\xA8\u2260ÆØ\u221E\xB1\u2264\u2265\xA5µ\u2202\u2211\u220Fπ\u222BªºΩæø\xBF\xA1\xAC\u221Aƒ\u2248\u2206\xAB\xBB\u2026\xA0ÀÃÕŒœ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CAÿŸ\u2044\xA4\u2039\u203Aﬁﬂ\u2021\xB7\u201A\u201E\u2030ÂÊÁËÈÍÎÏÌÓÔ\uFFFDÒÚÛÙıˆ\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DBˇ'
                    },
                    'macromania': {
                        'type': '_sbcs',
                        'chars': 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü\u2020\xB0\xA2\xA3\xA7\u2022\xB6ß\xAE\xA9\u2122\xB4\xA8\u2260ĂŞ\u221E\xB1\u2264\u2265\xA5µ\u2202\u2211\u220Fπ\u222BªºΩăş\xBF\xA1\xAC\u221Aƒ\u2248\u2206\xAB\xBB\u2026\xA0ÀÃÕŒœ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CAÿŸ\u2044\xA4\u2039\u203AŢţ\u2021\xB7\u201A\u201E\u2030ÂÊÁËÈÍÎÏÌÓÔ\uFFFDÒÚÛÙıˆ\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DBˇ'
                    },
                    'macthai': {
                        'type': '_sbcs',
                        'chars': '\xAB\xBB\u2026\uF88C\uF88F\uF892\uF895\uF898\uF88B\uF88E\uF891\uF894\uF897\u201C\u201D\uF899\uFFFD\u2022\uF884\uF889\uF885\uF886\uF887\uF888\uF88A\uF88D\uF890\uF893\uF896\u2018\u2019\uFFFD\xA0กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\uFEFF\u200B\u2013\u2014\u0E3Fเแโใไๅๆ็่้๊๋์ํ\u2122\u0E4F๐๑๒๓๔๕๖๗๘๙\xAE\xA9\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'macturkish': {
                        'type': '_sbcs',
                        'chars': 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü\u2020\xB0\xA2\xA3\xA7\u2022\xB6ß\xAE\xA9\u2122\xB4\xA8\u2260ÆØ\u221E\xB1\u2264\u2265\xA5µ\u2202\u2211\u220Fπ\u222BªºΩæø\xBF\xA1\xAC\u221Aƒ\u2248\u2206\xAB\xBB\u2026\xA0ÀÃÕŒœ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CAÿŸĞğİıŞş\u2021\xB7\u201A\u201E\u2030ÂÊÁËÈÍÎÏÌÓÔ\uFFFDÒÚÛÙ\uFFFDˆ\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DBˇ'
                    },
                    'macukraine': {
                        'type': '_sbcs',
                        'chars': 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\u2020\xB0Ґ\xA3\xA7\u2022\xB6І\xAE\xA9\u2122Ђђ\u2260Ѓѓ\u221E\xB1\u2264\u2265іµґЈЄєЇїЉљЊњјЅ\xAC\u221Aƒ\u2248\u2206\xAB\xBB\u2026\xA0ЋћЌќѕ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u201EЎўЏџ\u2116Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю\xA4'
                    },
                    'koi8r': {
                        'type': '_sbcs',
                        'chars': '\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2580\u2584\u2588\u258C\u2590\u2591\u2592\u2593\u2320\u25A0\u2219\u221A\u2248\u2264\u2265\xA0\u2321\xB0\xB2\xB7\xF7\u2550\u2551\u2552ё\u2553\u2554\u2555\u2556\u2557\u2558\u2559\u255A\u255B\u255C\u255D\u255E\u255F\u2560\u2561Ё\u2562\u2563\u2564\u2565\u2566\u2567\u2568\u2569\u256A\u256B\u256C\xA9юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
                    },
                    'koi8u': {
                        'type': '_sbcs',
                        'chars': '\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2580\u2584\u2588\u258C\u2590\u2591\u2592\u2593\u2320\u25A0\u2219\u221A\u2248\u2264\u2265\xA0\u2321\xB0\xB2\xB7\xF7\u2550\u2551\u2552ёє\u2554ії\u2557\u2558\u2559\u255A\u255Bґ\u255D\u255E\u255F\u2560\u2561ЁЄ\u2563ІЇ\u2566\u2567\u2568\u2569\u256AҐ\u256C\xA9юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
                    },
                    'koi8ru': {
                        'type': '_sbcs',
                        'chars': '\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2580\u2584\u2588\u258C\u2590\u2591\u2592\u2593\u2320\u25A0\u2219\u221A\u2248\u2264\u2265\xA0\u2321\xB0\xB2\xB7\xF7\u2550\u2551\u2552ёє\u2554ії\u2557\u2558\u2559\u255A\u255Bґў\u255E\u255F\u2560\u2561ЁЄ\u2563ІЇ\u2566\u2567\u2568\u2569\u256AҐЎ\xA9юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
                    },
                    'koi8t': {
                        'type': '_sbcs',
                        'chars': 'қғ\u201AҒ\u201E\u2026\u2020\u2021\uFFFD\u2030ҳ\u2039ҲҷҶ\uFFFDҚ\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\uFFFD\u203A\uFFFD\uFFFD\uFFFD\uFFFD\uFFFDӯӮё\xA4ӣ\xA6\xA7\uFFFD\uFFFD\uFFFD\xAB\xAC\xAD\xAE\uFFFD\xB0\xB1\xB2Ё\uFFFDӢ\xB6\xB7\uFFFD\u2116\uFFFD\xBB\uFFFD\uFFFD\uFFFD\xA9юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ'
                    },
                    'armscii8': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\uFFFDև\u0589)(\xBB\xAB\u2014.\u055D,-\u058A\u2026\u055C\u055B\u055EԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ\u055A\uFFFD'
                    },
                    'rk1048': {
                        'type': '_sbcs',
                        'chars': 'ЂЃ\u201Aѓ\u201E\u2026\u2020\u2021\u20AC\u2030Љ\u2039ЊҚҺЏђ\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122љ\u203Aњқһџ\xA0ҰұӘ\xA4Ө\xA6\xA7Ё\xA9Ғ\xAB\xAC\xAD\xAEҮ\xB0\xB1Ііөµ\xB6\xB7ё\u2116ғ\xBBәҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя'
                    },
                    'tcvn': {
                        'type': '_sbcs',
                        'chars': '\0ÚỤ\x03ỪỬỮ\x07\b\t\n\x0B\f\r\x0E\x0F\x10ỨỰỲỶỸÝỴ\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7FÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ\xA0ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ'
                    },
                    'georgianacademy': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\u201Aƒ\u201E\u2026\u2020\u2021ˆ\u2030Š\u2039Œ\x8D\x8E\x8F\x90\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122š\u203Aœ\x9D\x9EŸ\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFაბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö\xF7øùúûüýþÿ'
                    },
                    'georgianps': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\u201Aƒ\u201E\u2026\u2020\u2021ˆ\u2030Š\u2039Œ\x8D\x8E\x8F\x90\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122š\u203Aœ\x9D\x9EŸ\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9ª\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4µ\xB6\xB7\xB8\xB9º\xBB\xBC\xBD\xBE\xBFაბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö\xF7øùúûüýþÿ'
                    },
                    'pt154': {
                        'type': '_sbcs',
                        'chars': 'ҖҒӮғ\u201E\u2026ҶҮҲүҠӢҢҚҺҸҗ\u2018\u2019\u201C\u201D\u2022\u2013\u2014ҳҷҡӣңқһҹ\xA0ЎўЈӨҘҰ\xA7Ё\xA9Ә\xAB\xACӯ\xAEҜ\xB0ұІіҙө\xB6\xB7ё\u2116ә\xBBјҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя'
                    },
                    'viscii': {
                        'type': '_sbcs',
                        'chars': '\0\x01Ẳ\x03\x04ẴẪ\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13Ỷ\x15\x16\x17\x18Ỹ\x1A\x1B\x1C\x1DỴ\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7FẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ'
                    },
                    'iso646cn': {
                        'type': '_sbcs',
                        'chars': '\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#\xA5%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}\u203E\x7F\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'iso646jp': {
                        'type': '_sbcs',
                        'chars': '\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\xA5]^_`abcdefghijklmnopqrstuvwxyz{|}\u203E\x7F\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'hproman8': {
                        'type': '_sbcs',
                        'chars': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0ÀÂÈÊËÎÏ\xB4ˋˆ\xA8\u02DCÙÛ\u20A4\xAFÝý\xB0ÇçÑñ\xA1\xBF\xA4\xA3\xA5\xA7ƒ\xA2âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ\xB7µ\xB6\xBE\u2014\xBC\xBDªº\xAB\u25A0\xBB\xB1\uFFFD'
                    },
                    'macintosh': {
                        'type': '_sbcs',
                        'chars': 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü\u2020\xB0\xA2\xA3\xA7\u2022\xB6ß\xAE\xA9\u2122\xB4\xA8\u2260ÆØ\u221E\xB1\u2264\u2265\xA5µ\u2202\u2211\u220Fπ\u222BªºΩæø\xBF\xA1\xAC\u221Aƒ\u2248\u2206\xAB\xBB\u2026\xA0ÀÃÕŒœ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CAÿŸ\u2044\xA4\u2039\u203Aﬁﬂ\u2021\xB7\u201A\u201E\u2030ÂÊÁËÈÍÎÏÌÓÔ\uFFFDÒÚÛÙıˆ\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DBˇ'
                    },
                    'ascii': {
                        'type': '_sbcs',
                        'chars': '\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD'
                    },
                    'tis620': {
                        'type': '_sbcs',
                        'chars': '\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFDกขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\uFFFD\uFFFD\uFFFD\uFFFD\u0E3Fเแโใไๅๆ็่้๊๋์ํ๎\u0E4F๐๑๒๓๔๕๖๗๘๙\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD'
                    }
                };
            },
            {}
        ],
        52: [
            function (require, module, exports) {
                'use strict';
                // Manually added data to be used by sbcs codec in addition to generated one.
                module.exports = {
                    // Not supported by iconv, not sure why.
                    '10029': 'maccenteuro',
                    'maccenteuro': {
                        'type': '_sbcs',
                        'chars': 'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü\u2020\xB0Ę\xA3\xA7\u2022\xB6ß\xAE\xA9\u2122ę\xA8\u2260ģĮįĪ\u2264\u2265īĶ\u2202\u2211łĻļĽľĹĺŅņŃ\xAC\u221AńŇ\u2206\xAB\xBB\u2026\xA0ňŐÕőŌ\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CAōŔŕŘ\u2039\u203AřŖŗŠ\u201A\u201EšŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ'
                    },
                    '808': 'cp808',
                    'ibm808': 'cp808',
                    'cp808': {
                        'type': '_sbcs',
                        'chars': 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580рстуфхцчшщъыьэюяЁёЄєЇїЎў\xB0\u2219\xB7\u221A\u2116\u20AC\u25A0\xA0'
                    },
                    // Aliases of generated encodings.
                    'ascii8bit': 'ascii',
                    'usascii': 'ascii',
                    'ansix34': 'ascii',
                    'ansix341968': 'ascii',
                    'ansix341986': 'ascii',
                    'csascii': 'ascii',
                    'cp367': 'ascii',
                    'ibm367': 'ascii',
                    'isoir6': 'ascii',
                    'iso646us': 'ascii',
                    'iso646irv': 'ascii',
                    'us': 'ascii',
                    'latin1': 'iso88591',
                    'latin2': 'iso88592',
                    'latin3': 'iso88593',
                    'latin4': 'iso88594',
                    'latin5': 'iso88599',
                    'latin6': 'iso885910',
                    'latin7': 'iso885913',
                    'latin8': 'iso885914',
                    'latin9': 'iso885915',
                    'latin10': 'iso885916',
                    'csisolatin1': 'iso88591',
                    'csisolatin2': 'iso88592',
                    'csisolatin3': 'iso88593',
                    'csisolatin4': 'iso88594',
                    'csisolatincyrillic': 'iso88595',
                    'csisolatinarabic': 'iso88596',
                    'csisolatingreek': 'iso88597',
                    'csisolatinhebrew': 'iso88598',
                    'csisolatin5': 'iso88599',
                    'csisolatin6': 'iso885910',
                    'l1': 'iso88591',
                    'l2': 'iso88592',
                    'l3': 'iso88593',
                    'l4': 'iso88594',
                    'l5': 'iso88599',
                    'l6': 'iso885910',
                    'l7': 'iso885913',
                    'l8': 'iso885914',
                    'l9': 'iso885915',
                    'l10': 'iso885916',
                    'isoir14': 'iso646jp',
                    'isoir57': 'iso646cn',
                    'isoir100': 'iso88591',
                    'isoir101': 'iso88592',
                    'isoir109': 'iso88593',
                    'isoir110': 'iso88594',
                    'isoir144': 'iso88595',
                    'isoir127': 'iso88596',
                    'isoir126': 'iso88597',
                    'isoir138': 'iso88598',
                    'isoir148': 'iso88599',
                    'isoir157': 'iso885910',
                    'isoir166': 'tis620',
                    'isoir179': 'iso885913',
                    'isoir199': 'iso885914',
                    'isoir203': 'iso885915',
                    'isoir226': 'iso885916',
                    'cp819': 'iso88591',
                    'ibm819': 'iso88591',
                    'cyrillic': 'iso88595',
                    'arabic': 'iso88596',
                    'arabic8': 'iso88596',
                    'ecma114': 'iso88596',
                    'asmo708': 'iso88596',
                    'greek': 'iso88597',
                    'greek8': 'iso88597',
                    'ecma118': 'iso88597',
                    'elot928': 'iso88597',
                    'hebrew': 'iso88598',
                    'hebrew8': 'iso88598',
                    'turkish': 'iso88599',
                    'turkish8': 'iso88599',
                    'thai': 'iso885911',
                    'thai8': 'iso885911',
                    'celtic': 'iso885914',
                    'celtic8': 'iso885914',
                    'isoceltic': 'iso885914',
                    'tis6200': 'tis620',
                    'tis62025291': 'tis620',
                    'tis62025330': 'tis620',
                    '10000': 'macroman',
                    '10006': 'macgreek',
                    '10007': 'maccyrillic',
                    '10079': 'maciceland',
                    '10081': 'macturkish',
                    'cspc8codepage437': 'cp437',
                    'cspc775baltic': 'cp775',
                    'cspc850multilingual': 'cp850',
                    'cspcp852': 'cp852',
                    'cspc862latinhebrew': 'cp862',
                    'cpgr': 'cp869',
                    'msee': 'cp1250',
                    'mscyrl': 'cp1251',
                    'msansi': 'cp1252',
                    'msgreek': 'cp1253',
                    'msturk': 'cp1254',
                    'mshebr': 'cp1255',
                    'msarab': 'cp1256',
                    'winbaltrim': 'cp1257',
                    'cp20866': 'koi8r',
                    '20866': 'koi8r',
                    'ibm878': 'koi8r',
                    'cskoi8r': 'koi8r',
                    'cp21866': 'koi8u',
                    '21866': 'koi8u',
                    'ibm1168': 'koi8u',
                    'strk10482002': 'rk1048',
                    'tcvn5712': 'tcvn',
                    'tcvn57121': 'tcvn',
                    'gb198880': 'iso646cn',
                    'cn': 'iso646cn',
                    'csiso14jisc6220ro': 'iso646jp',
                    'jisc62201969ro': 'iso646jp',
                    'jp': 'iso646jp',
                    'cshproman8': 'hproman8',
                    'r8': 'hproman8',
                    'roman8': 'hproman8',
                    'xroman8': 'hproman8',
                    'ibm1051': 'hproman8',
                    'mac': 'macintosh',
                    'csmacintosh': 'macintosh'
                };
            },
            {}
        ],
        53: [
            function (require, module, exports) {
                'use strict';
                // == UTF16-BE codec. ==========================================================
                exports.utf16be = Utf16BECodec;
                function Utf16BECodec() {
                }
                Utf16BECodec.prototype.encoder = Utf16BEEncoder;
                Utf16BECodec.prototype.decoder = Utf16BEDecoder;
                Utf16BECodec.prototype.bomAware = true;
                // -- Encoding
                function Utf16BEEncoder() {
                }
                Utf16BEEncoder.prototype.write = function (str) {
                };
                Utf16BEEncoder.prototype.end = function () {
                };
                // -- Decoding
                function Utf16BEDecoder() {
                }
                Utf16BEDecoder.prototype.write = function (buf) {
                };
                Utf16BEDecoder.prototype.end = function () {
                };
                // == UTF-16 codec =============================================================
                // Decoder chooses automatically from UTF-16LE and UTF-16BE using BOM and space-based heuristic.
                // Defaults to UTF-16LE, as it's prevalent and default in Node.
                // http://en.wikipedia.org/wiki/UTF-16 and http://encoding.spec.whatwg.org/#utf-16le
                // Decoder default can be changed: iconv.decode(buf, 'utf16', {defaultEncoding: 'utf-16be'});
                // Encoder uses UTF-16LE and prepends BOM (which can be overridden with addBOM: false).
                exports.utf16 = Utf16Codec;
                function Utf16Codec(codecOptions, iconv) {
                }
                Utf16Codec.prototype.encoder = Utf16Encoder;
                Utf16Codec.prototype.decoder = Utf16Decoder;
                // -- Encoding (pass-through)
                function Utf16Encoder(options, codec) {
                }
                Utf16Encoder.prototype.write = function (str) {
                };
                Utf16Encoder.prototype.end = function () {
                };
                // -- Decoding
                function Utf16Decoder(options, codec) {
                }
                Utf16Decoder.prototype.write = function (buf) {
                };
                Utf16Decoder.prototype.end = function () {
                };
                function detectEncoding(buf, defaultEncoding) {
                }
            },
            {}
        ],
        54: [
            function (require, module, exports) {
                'use strict';
                // UTF-7 codec, according to https://tools.ietf.org/html/rfc2152
                // See also below a UTF-7-IMAP codec, according to http://tools.ietf.org/html/rfc3501#section-5.1.3
                exports.utf7 = Utf7Codec;
                exports.unicode11utf7 = 'utf7';
                // Alias UNICODE-1-1-UTF-7
                function Utf7Codec(codecOptions, iconv) {
                }
                ;
                Utf7Codec.prototype.encoder = Utf7Encoder;
                Utf7Codec.prototype.decoder = Utf7Decoder;
                Utf7Codec.prototype.bomAware = true;
                // -- Encoding
                var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;
                function Utf7Encoder(options, codec) {
                }
                Utf7Encoder.prototype.write = function (str) {
                };
                Utf7Encoder.prototype.end = function () {
                };
                // -- Decoding
                function Utf7Decoder(options, codec) {
                }
                var base64Regex = /[A-Za-z0-9\/+]/;
                var base64Chars = [];
                for (var i = 0; i < 256; i++)
                    base64Chars[i] = base64Regex.test(String.fromCharCode(i));
                var plusChar = '+'.charCodeAt(0), minusChar = '-'.charCodeAt(0), andChar = '&'.charCodeAt(0);
                Utf7Decoder.prototype.write = function (buf) {
                };
                Utf7Decoder.prototype.end = function () {
                };
                // UTF-7-IMAP codec.
                // RFC3501 Sec. 5.1.3 Modified UTF-7 (http://tools.ietf.org/html/rfc3501#section-5.1.3)
                // Differences:
                //  * Base64 part is started by "&" instead of "+"
                //  * Direct characters are 0x20-0x7E, except "&" (0x26)
                //  * In Base64, "," is used instead of "/"
                //  * Base64 must not be used to represent direct characters.
                //  * No implicit shift back from Base64 (should always end with '-')
                //  * String must end in non-shifted position.
                //  * "-&" while in base64 is not allowed.
                exports.utf7imap = Utf7IMAPCodec;
                function Utf7IMAPCodec(codecOptions, iconv) {
                }
                ;
                Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
                Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
                Utf7IMAPCodec.prototype.bomAware = true;
                // -- Encoding
                function Utf7IMAPEncoder(options, codec) {
                }
                Utf7IMAPEncoder.prototype.write = function (str) {
                };
                Utf7IMAPEncoder.prototype.end = function () {
                };
                // -- Decoding
                function Utf7IMAPDecoder(options, codec) {
                }
                var base64IMAPChars = base64Chars.slice();
                base64IMAPChars[','.charCodeAt(0)] = true;
                Utf7IMAPDecoder.prototype.write = function (buf) {
                };
                Utf7IMAPDecoder.prototype.end = function () {
                };
            },
            {}
        ],
        55: [
            function (require, module, exports) {
                'use strict';
                var BOMChar = '\uFEFF';
                exports.PrependBOM = PrependBOMWrapper;
                function PrependBOMWrapper(encoder, options) {
                }
                PrependBOMWrapper.prototype.write = function (str) {
                };
                PrependBOMWrapper.prototype.end = function () {
                };
                //------------------------------------------------------------------------------
                exports.StripBOM = StripBOMWrapper;
                function StripBOMWrapper(decoder, options) {
                    this.decoder = decoder;
                    this.pass = false;
                    this.options = options || {};
                }
                StripBOMWrapper.prototype.write = function (buf) {
                    var res = this.decoder.write(buf);
                    if (this.pass || !res)
                        return res;
                    if (res[0] === BOMChar) {
                        res = res.slice(1);
                        if (typeof this.options.stripBOM === 'function')
                            this.options.stripBOM();
                    }
                    this.pass = true;
                    return res;
                };
                StripBOMWrapper.prototype.end = function () {
                    return this.decoder.end();
                };
            },
            {}
        ],
        56: [
            function (require, module, exports) {
                (function (Buffer) {
                    'use strict';
                    // == Extend Node primitives to use iconv-lite =================================
                    module.exports = function (iconv) {
                        var original = undefined;
                        // Place to keep original methods.
                        // Node authors rewrote Buffer internals to make it compatible with
                        // Uint8Array and we cannot patch key functions since then.
                        iconv.supportsNodeEncodingsExtension = !(new Buffer(0) instanceof Uint8Array);
                        iconv.extendNodeEncodings = function extendNodeEncodings() {
                        };
                        // Remove iconv-lite Node primitive extensions.
                        iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
                        };
                    };
                }.call(this, require(4).Buffer));
            },
            { '4': 4 }
        ],
        57: [
            function (require, module, exports) {
                (function (process, Buffer) {
                    'use strict';
                    var bomHandling = require(55), iconv = module.exports;
                    // All codecs and aliases are kept here, keyed by encoding name/alias.
                    // They are lazy loaded in `iconv.getCodec` from `encodings/index.js`.
                    iconv.encodings = null;
                    // Characters emitted in case of error.
                    iconv.defaultCharUnicode = '\uFFFD';
                    iconv.defaultCharSingleByte = '?';
                    // Public API.
                    iconv.encode = function encode(str, encoding, options) {
                        str = '' + (str || '');
                        // Ensure string.
                        var encoder = iconv.getEncoder(encoding, options);
                        var res = encoder.write(str);
                        var trail = encoder.end();
                        return trail && trail.length > 0 ? Buffer.concat([
                            res,
                            trail
                        ]) : res;
                    };
                    iconv.decode = function decode(buf, encoding, options) {
                        if (typeof buf === 'string') {
                            if (!iconv.skipDecodeWarning) {
                                console.error('Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding');
                                iconv.skipDecodeWarning = true;
                            }
                            buf = new Buffer('' + (buf || ''), 'binary');    // Ensure buffer.
                        }
                        var decoder = iconv.getDecoder(encoding, options);
                        var res = decoder.write(buf);
                        var trail = decoder.end();
                        return trail ? res + trail : res;
                    };
                    iconv.encodingExists = function encodingExists(enc) {
                        try {
                            iconv.getCodec(enc);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    };
                    // Legacy aliases to convert functions
                    iconv.toEncoding = iconv.encode;
                    iconv.fromEncoding = iconv.decode;
                    // Search for a codec in iconv.encodings. Cache codec data in iconv._codecDataCache.
                    iconv._codecDataCache = {};
                    iconv.getCodec = function getCodec(encoding) {
                        if (!iconv.encodings)
                            iconv.encodings = require(48);
                        // Lazy load all encoding definitions.
                        // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
                        var enc = ('' + encoding).toLowerCase().replace(/[^0-9a-z]|:\d{4}$/g, '');
                        // Traverse iconv.encodings to find actual codec.
                        var codecOptions = {};
                        while (true) {
                            var codec = iconv._codecDataCache[enc];
                            if (codec)
                                return codec;
                            var codecDef = iconv.encodings[enc];
                            switch (typeof codecDef) {
                            case 'string':
                                // Direct alias to other encoding.
                                enc = codecDef;
                                break;
                            case 'object':
                                // Alias with options. Can be layered.
                                for (var key in codecDef)
                                    codecOptions[key] = codecDef[key];
                                if (!codecOptions.encodingName)
                                    codecOptions.encodingName = enc;
                                enc = codecDef.type;
                                break;
                            case 'function':
                                // Codec itself.
                                if (!codecOptions.encodingName)
                                    codecOptions.encodingName = enc;
                                // The codec function must load all tables and return object with .encoder and .decoder methods.
                                // It'll be called only once (for each different options object).
                                codec = new codecDef(codecOptions, iconv);
                                iconv._codecDataCache[codecOptions.encodingName] = codec;
                                // Save it to be reused later.
                                return codec;
                            default:
                                throw new Error('Encoding not recognized: \'' + encoding + '\' (searched as: \'' + enc + '\')');
                            }
                        }
                    };
                    iconv.getEncoder = function getEncoder(encoding, options) {
                        var codec = iconv.getCodec(encoding), encoder = new codec.encoder(options, codec);
                        if (codec.bomAware && options && options.addBOM)
                            encoder = new bomHandling.PrependBOM(encoder, options);
                        return encoder;
                    };
                    iconv.getDecoder = function getDecoder(encoding, options) {
                        var codec = iconv.getCodec(encoding), decoder = new codec.decoder(options, codec);
                        if (codec.bomAware && !(options && options.stripBOM === false))
                            decoder = new bomHandling.StripBOM(decoder, options);
                        return decoder;
                    };
                    // Load extensions in Node. All of them are omitted in Browserify build via 'browser' field in package.json.
                    var nodeVer = typeof process !== 'undefined' && process.versions && process.versions.node;
                    if (nodeVer) {
                        // Load streaming support in Node v0.10+
                        var nodeVerArr = nodeVer.split('.').map(Number);
                        if (nodeVerArr[0] > 0 || nodeVerArr[1] >= 10) {
                            require(58)(iconv);
                        }
                        // Load Node primitive extensions.
                        require(56)(iconv);
                    }
                }.call(this, require(12), require(4).Buffer));
            },
            {
                '12': 12,
                '4': 4,
                '48': 48,
                '55': 55,
                '56': 56,
                '58': 58
            }
        ],
        58: [
            function (require, module, exports) {
                'use strict';
                var Transform = require(24).Transform;
                // == Exports ==================================================================
                module.exports = function (iconv) {
                    // Additional Public API.
                    iconv.encodeStream = function encodeStream(encoding, options) {
                    };
                    iconv.decodeStream = function decodeStream(encoding, options) {
                    };
                    iconv.supportsStreams = true;
                    // Not published yet.
                    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
                    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
                    iconv._collect = IconvLiteDecoderStream.prototype.collect;
                };
                // == Encoder stream =======================================================
                function IconvLiteEncoderStream(conv, options) {
                }
                IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, { constructor: { value: IconvLiteEncoderStream } });
                IconvLiteEncoderStream.prototype._transform = function (chunk, encoding, done) {
                };
                IconvLiteEncoderStream.prototype._flush = function (done) {
                };
                IconvLiteEncoderStream.prototype.collect = function (cb) {
                };
                // == Decoder stream =======================================================
                function IconvLiteDecoderStream(conv, options) {
                }
                IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, { constructor: { value: IconvLiteDecoderStream } });
                IconvLiteDecoderStream.prototype._transform = function (chunk, encoding, done) {
                };
                IconvLiteDecoderStream.prototype._flush = function (done) {
                };
                IconvLiteDecoderStream.prototype.collect = function (cb) {
                };
            },
            { '24': 24 }
        ],
        59: [
            function (require, module, exports) {
                (function (global) {
                    /*! https://mths.be/quoted-printable v0.2.1 by @mathias | MIT license */
                    ;
                    (function (root) {
                        // Detect free variables `exports`.
                        var freeExports = typeof exports == 'object' && exports;
                        // Detect free variable `module`.
                        var freeModule = typeof module == 'object' && module && module.exports == freeExports && module;
                        // Detect free variable `global`, from Node.js or Browserified code, and use
                        // it as `root`.
                        var freeGlobal = typeof global == 'object' && global;
                        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
                            root = freeGlobal;
                        }
                        /*--------------------------------------------------------------------------*/
                        var stringFromCharCode = String.fromCharCode;
                        var decode = function (input) {
                            return input    // https://tools.ietf.org/html/rfc2045#section-6.7, rule 3:
                                     // “Therefore, when decoding a `Quoted-Printable` body, any trailing white
                                     // space on a line must be deleted, as it will necessarily have been added
                                     // by intermediate transport agents.”
.replace(/[\t\x20]$/gm, '')    // Remove hard line breaks preceded by `=`. Proper `Quoted-Printable`-
                               // encoded data only contains CRLF line  endings, but for compatibility
                               // reasons we support separate CR and LF too.
.replace(/=(?:\r\n?|\n|$)/g, '')    // Decode escape sequences of the form `=XX` where `XX` is any
                                    // combination of two hexidecimal digits. For optimal compatibility,
                                    // lowercase hexadecimal digits are supported as well. See
                                    // https://tools.ietf.org/html/rfc2045#section-6.7, note 1.
.replace(/=([a-fA-F0-9]{2})/g, function ($0, $1) {
                                var codePoint = parseInt($1, 16);
                                return stringFromCharCode(codePoint);
                            });
                        };
                        var handleTrailingCharacters = function (string) {
                        };
                        var regexUnsafeSymbols = /[\0-\b\n-\x1F=\x7F-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF]/g;
                        var encode = function (string) {
                            // Encode symbols that are definitely unsafe (i.e. unsafe in any context).
                            var encoded = string.replace(regexUnsafeSymbols, function (symbol) {
                                if (symbol > 'ÿ') {
                                    throw RangeError('`quotedPrintable.encode()` expects extended ASCII input only. ' + 'Don\u2019t forget to encode the input first using a character ' + 'encoding like UTF-8.');
                                }
                                var codePoint = symbol.charCodeAt(0);
                                var hexadecimal = codePoint.toString(16).toUpperCase();
                                return '=' + ('0' + hexadecimal).slice(-2);
                            });
                            // Limit lines to 76 characters (not counting the CRLF line endings).
                            var lines = encoded.split(/\r\n?|\n/g);
                            var lineIndex = -1;
                            var lineCount = lines.length;
                            var result = [];
                            while (++lineIndex < lineCount) {
                                var line = lines[lineIndex];
                                // Leave room for the trailing `=` for soft line breaks.
                                var LINE_LENGTH = 75;
                                var index = 0;
                                var length = line.length;
                                while (index < length) {
                                    var buffer = encoded.slice(index, index + LINE_LENGTH);
                                    // If this line ends with `=`, optionally followed by a single uppercase
                                    // hexadecimal digit, we broke an escape sequence in half. Fix it by
                                    // moving these characters to the next line.
                                    if (/=$/.test(buffer)) {
                                        buffer = buffer.slice(0, LINE_LENGTH - 1);
                                        index += LINE_LENGTH - 1;
                                    } else if (/=[A-F0-9]$/.test(buffer)) {
                                        buffer = buffer.slice(0, LINE_LENGTH - 2);
                                        index += LINE_LENGTH - 2;
                                    } else {
                                        index += LINE_LENGTH;
                                    }
                                    result.push(buffer);
                                }
                            }
                            // Encode space and tab characters at the end of encoded lines. Note that
                            // with the current implementation, this can only occur at the very end of
                            // the encoded string — every other line ends with `=` anyway.
                            var lastLineLength = buffer.length;
                            if (/[\t\x20]$/.test(buffer)) {
                                // There’s a space or a tab at the end of the last encoded line. Remove
                                // this line from the `result` array, as it needs to change.
                                result.pop();
                                if (lastLineLength + 2 <= LINE_LENGTH + 1) {
                                    // It’s possible to encode the character without exceeding the line
                                    // length limit.
                                    result.push(handleTrailingCharacters(buffer));
                                } else {
                                    // It’s not possible to encode the character without exceeding the line
                                    // length limit. Remvoe the character from the line, and insert a new
                                    // line that contains only the encoded character.
                                    result.push(buffer.slice(0, lastLineLength - 1), handleTrailingCharacters(buffer.slice(lastLineLength - 1, lastLineLength)));
                                }
                            }
                            // `Quoted-Printable` uses CRLF.
                            return result.join('=\r\n');
                        };
                        var quotedPrintable = {
                            'encode': encode,
                            'decode': decode,
                            'version': '0.2.1'
                        };
                        // Some AMD build optimizers, like r.js, check for specific condition patterns
                        // like the following:
                        if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
                            define(function () {
                            });
                        } else if (freeExports && !freeExports.nodeType) {
                            if (freeModule) {
                                // in Node.js or RingoJS v0.8.0+
                                freeModule.exports = quotedPrintable;
                            } else {
                                // in Narwhal or RingoJS v0.7.0-
                                for (var key in quotedPrintable) {
                                    quotedPrintable.hasOwnProperty(key) && (freeExports[key] = quotedPrintable[key]);
                                }
                            }
                        } else {
                            // in Rhino or a web browser
                            root.quotedPrintable = quotedPrintable;
                        }
                    }(this));
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {}
        ],
        60: [
            function (require, module, exports) {
                (function (Buffer) {
                    /*jshint regexp:false*/
                    /*global unescape*/
                    var isUtf8RegExp = /^utf-?8$/i, isLatin1RegExp = /^(?:iso-8859-1|latin1)$/i, iconvLite = require(62), rfc2047 = module.exports = {};
                    function stringify(obj) {
                        if (typeof obj === 'string') {
                            return obj;
                        } else if (obj === null || typeof obj === 'undefined') {
                            return '';
                        } else {
                            return String(obj);
                        }
                    }
                    var iconv;
                    try {
                        iconv = require('' + 'iconv');    // Prevent browserify from detecting iconv and failing
                    } catch (e) {
                    }
                    function decodeBuffer(encodedText, encoding) {
                    }
                    // Returns either a string (if successful) or undefined
                    function decodeEncodedWord(encodedText, encoding, charset) {
                        if (encoding === 'q' && isLatin1RegExp.test(charset)) {
                            return unescape(encodedText.replace(/_/g, ' ').replace(/%/g, '%25').replace(/\=(?=[0-9a-f]{2})/gi, '%'));
                        } else {
                            var buffer;
                            try {
                                buffer = decodeBuffer(encodedText, encoding);
                            } catch (e) {
                                return;
                            }
                            if (/^ks_c_5601/i.test(charset)) {
                                charset = 'CP949';
                            }
                            var decoded;
                            if (iconv) {
                                var converter;
                                try {
                                    converter = new iconv.Iconv(charset, 'utf-8//TRANSLIT');
                                } catch (e1) {
                                    // Assume EINVAL (unsupported charset) and fall back to assuming iso-8859-1:
                                    converter = new iconv.Iconv('iso-8859-1', 'utf-8//TRANSLIT');
                                }
                                try {
                                    return converter.convert(buffer).toString('utf-8');
                                } catch (e2) {
                                    return;
                                }
                            } else if (isUtf8RegExp.test(charset)) {
                                decoded = buffer.toString('utf-8');
                                if (!/\ufffd/.test(decoded)) {
                                    return decoded;
                                }
                            } else if (/^(?:us-)?ascii$/i.test(charset)) {
                                return buffer.toString('ascii');
                            } else if (iconvLite.encodingExists(charset)) {
                                decoded = iconvLite.decode(buffer, charset);
                                if (!/\ufffd/.test(decoded)) {
                                    return decoded;
                                }
                            }
                        }
                    }
                    var encodedWordRegExp = /\=\?([^\?]+)\?([QB])\?([^\?]*)\?=/gi;
                    rfc2047.decode = function (text) {
                        text = stringify(text).replace(/\?\=\s+\=\?/g, '?==?');
                        // Strip whitespace between neighbouring encoded words
                        var numEncodedWordsToIgnore = 0;
                        return text.replace(encodedWordRegExp, function (encodedWord, charset, encoding, encodedText, index) {
                            if (numEncodedWordsToIgnore > 0) {
                                numEncodedWordsToIgnore -= 1;
                                return '';
                            }
                            encoding = encoding.toLowerCase();
                            var decodedTextOrBuffer = decodeEncodedWord(encodedText, encoding, charset);
                            while (typeof decodedTextOrBuffer !== 'string') {
                                // The encoded word couldn't be decoded because it contained a partial character in a multibyte charset.
                                // Keep trying to look ahead and consume an additional encoded word right after this one, and if its
                                // encoding and charsets match, try to decode the concatenation.
                                // The ongoing replace call is unaffected by this trick, so we don't need to reset .lastIndex afterwards:
                                encodedWordRegExp.lastIndex = index + encodedWord.length;
                                var matchNextEncodedWord = encodedWordRegExp.exec(text);
                                if (matchNextEncodedWord && matchNextEncodedWord.index === index + encodedWord.length && matchNextEncodedWord[1] === charset && matchNextEncodedWord[2].toLowerCase() === encoding) {
                                    numEncodedWordsToIgnore += 1;
                                    encodedWord += matchNextEncodedWord[0];
                                    encodedText += matchNextEncodedWord[3];
                                    decodedTextOrBuffer = decodeEncodedWord(encodedText, encoding, charset);
                                } else {
                                    return encodedWord;
                                }
                            }
                            return decodedTextOrBuffer;
                        });
                    };
                    // Fast encoder for quoted-printable data in the "encoded-text" part of encoded words.
                    // This scenario differs from regular quoted-printable (as used in e.g. email bodies)
                    // in that the space character is represented by underscore, and fewer ASCII are
                    // allowed (see rfc 2047, section 2).
                    // Initialize array used as lookup table (int (octet) => string)
                    var qpTokenByOctet = new Array(256), i;
                    for (i = 0; i < 256; i += 1) {
                        qpTokenByOctet[i] = '=' + (i < 16 ? '0' : '') + i.toString(16).toUpperCase();
                    }
                    '!#$%&\'*+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\\^_`abcdefghijklmnopqrstuvwxyz{|}~'.split(/(?:)/).forEach(function (encodedWordSafeAsciiChar) {
                        qpTokenByOctet[encodedWordSafeAsciiChar.charCodeAt(0)] = encodedWordSafeAsciiChar;
                    });
                    qpTokenByOctet[32] = '_';
                    function bufferToQuotedPrintableString(buffer) {
                        var result = '';
                        for (var i = 0; i < buffer.length; i += 1) {
                            result += qpTokenByOctet[buffer[i]];
                        }
                        return result;
                    }
                    // Build a regexp for determining whether (part of) a token has to be encoded:
                    var headerSafeAsciiChars = ' !"#$%&\'()*+-,-./0123456789:;<=>@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~', headerUnsafeAsciiChars = '';
                    for (i = 0; i < 128; i += 1) {
                        var ch = String.fromCharCode(i);
                        if (headerSafeAsciiChars.indexOf(ch) === -1) {
                            // O(n^2) but only happens at startup
                            headerUnsafeAsciiChars += ch;
                        }
                    }
                    function quoteCharacterClass(chars) {
                        return chars.replace(/[\\\|\^\*\+\?\[\]\(\)\-\.]/g, '\\$&');
                    }
                    var unsafeTokenRegExp = new RegExp('[\x80-\uFFFF' + quoteCharacterClass(headerUnsafeAsciiChars) + ']'), maxNumCharsPerEncodedWord = 8;
                    // Very conservative limit to prevent creating an encoded word of more than 72 ascii chars
                    rfc2047.encode = function (text) {
                        text = stringify(text).replace(/\s/g, ' ');
                        // Normalize whitespace
                        var tokens = text.match(/([^\s]*\s*)/g),
                            // Split at space, but keep trailing space as part of each token
                            previousTokenWasEncodedWord = false,
                            // Consecutive encoded words must have a space between them, so this state must be kept
                            previousTokenWasWhitespaceFollowingEncodedWord = false, result = '';
                        if (tokens) {
                            for (var i = 0; i < tokens.length; i += 1) {
                                var token = tokens[i];
                                if (unsafeTokenRegExp.test(token)) {
                                    var matchQuotesAtBeginning = token.match(/^"+/);
                                    if (matchQuotesAtBeginning) {
                                        result += matchQuotesAtBeginning[0];
                                        tokens[i] = token = token.substr(matchQuotesAtBeginning[0].length);
                                        tokens.splice(i, 0, matchQuotesAtBeginning[0]);
                                        i += 1;
                                    }
                                    var matchWhitespaceOrQuotesAtEnd = token.match(/\\?[\s"]+$/);
                                    if (matchWhitespaceOrQuotesAtEnd) {
                                        tokens.splice(i + 1, 0, matchWhitespaceOrQuotesAtEnd[0]);
                                        token = token.substr(0, token.length - matchWhitespaceOrQuotesAtEnd[0].length);
                                    }
                                    // Word contains at least one header unsafe char, an encoded word must be created.
                                    if (token.length > maxNumCharsPerEncodedWord) {
                                        tokens.splice(i + 1, 0, token.substr(maxNumCharsPerEncodedWord));
                                        token = token.substr(0, maxNumCharsPerEncodedWord);
                                    }
                                    if (previousTokenWasWhitespaceFollowingEncodedWord) {
                                        token = ' ' + token;
                                    }
                                    var charset = 'utf-8';
                                    // Around 25% faster than encodeURIComponent(token.replace(/ /g, "_")).replace(/%/g, "="):
                                    var encodedWordBody = bufferToQuotedPrintableString(new Buffer(token, 'utf-8'));
                                    if (previousTokenWasEncodedWord) {
                                        result += ' ';
                                    }
                                    result += '=?' + charset + '?Q?' + encodedWordBody + '?=';
                                    previousTokenWasWhitespaceFollowingEncodedWord = false;
                                    previousTokenWasEncodedWord = true;
                                } else {
                                    // Word only contains header safe chars, no need to encode:
                                    result += token;
                                    previousTokenWasWhitespaceFollowingEncodedWord = /^\s*$/.test(token) && previousTokenWasEncodedWord;
                                    previousTokenWasEncodedWord = false;
                                }
                            }
                        }
                        return result;
                    };
                }.call(this, require(4).Buffer));
            },
            {
                '4': 4,
                '62': 62
            }
        ],
        61: [
            function (require, module, exports) {
                // == Extend Node primitives to use iconv-lite =================================
                module.exports = function (iconv) {
                    var original = undefined;
                    // Place to keep original methods.
                    iconv.extendNodeEncodings = function extendNodeEncodings() {
                    };
                    // Remove iconv-lite Node primitive extensions.
                    iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
                    };
                };
            },
            {}
        ],
        62: [
            function (require, module, exports) {
                (function (process) {
                    var iconv = module.exports;
                    // All codecs and aliases are kept here, keyed by encoding name/alias.
                    // They are lazy loaded in `iconv.getCodec` from `encodings/index.js`.
                    iconv.encodings = null;
                    // Characters emitted in case of error.
                    iconv.defaultCharUnicode = '\uFFFD';
                    iconv.defaultCharSingleByte = '?';
                    // Public API.
                    iconv.encode = function encode(str, encoding, options) {
                    };
                    iconv.decode = function decode(buf, encoding, options) {
                    };
                    iconv.encodingExists = function encodingExists(enc) {
                    };
                    // Legacy aliases to convert functions
                    iconv.toEncoding = iconv.encode;
                    iconv.fromEncoding = iconv.decode;
                    // Search for a codec in iconv.encodings. Cache codec data in iconv._codecDataCache.
                    iconv._codecDataCache = {};
                    iconv.getCodec = function getCodec(encoding) {
                    };
                    // Load extensions in Node. All of them are omitted in Browserify build via 'browser' field in package.json.
                    var nodeVer = typeof process !== 'undefined' && process.versions && process.versions.node;
                    if (nodeVer) {
                        // Load streaming support in Node v0.10+
                        var nodeVerArr = nodeVer.split('.').map(Number);
                        if (nodeVerArr[0] > 0 || nodeVerArr[1] >= 10) {
                            require(63)(iconv);
                        }
                        // Load Node primitive extensions.
                        require(61)(iconv);
                    }
                }.call(this, require(12)));
            },
            {
                '12': 12,
                '61': 61,
                '63': 63
            }
        ],
        63: [
            function (require, module, exports) {
                var Transform = require(24).Transform;
                // == Exports ==================================================================
                module.exports = function (iconv) {
                    // Additional Public API.
                    iconv.encodeStream = function encodeStream(encoding, options) {
                    };
                    iconv.decodeStream = function decodeStream(encoding, options) {
                    };
                    iconv.supportsStreams = true;
                    // Not published yet.
                    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
                    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
                    iconv._collect = IconvLiteDecoderStream.prototype.collect;
                };
                // == Encoder stream =======================================================
                function IconvLiteEncoderStream(conv, options) {
                }
                IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, { constructor: { value: IconvLiteEncoderStream } });
                IconvLiteEncoderStream.prototype._transform = function (chunk, encoding, done) {
                };
                IconvLiteEncoderStream.prototype._flush = function (done) {
                };
                IconvLiteEncoderStream.prototype.collect = function (cb) {
                };
                // == Decoder stream =======================================================
                function IconvLiteDecoderStream(conv, options) {
                }
                IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, { constructor: { value: IconvLiteDecoderStream } });
                IconvLiteDecoderStream.prototype._transform = function (chunk, encoding, done) {
                };
                IconvLiteDecoderStream.prototype._flush = function (done) {
                };
                IconvLiteDecoderStream.prototype.collect = function (cb) {
                };
            },
            { '24': 24 }
        ],
        64: [
            function (require, module, exports) {
                (function (Buffer) {
                    /*global unescape*/
                    var isUtf8RegExp = /^utf-?8$/i, isLatin1RegExp = /^(?:iso-8859-1|latin1)$/i, canBeLatin1EncodedRegExp = /^[\u0000-\u00ff]*$/, iconvLite = require(66), rfc2231 = module.exports = {};
                    var iconv;
                    try {
                        iconv = require('' + 'iconv');    // Prevent browserify from detecting iconv and failing
                    } catch (e) {
                    }
                    function decodeUnfoldedParameter(text) {
                        return text.replace(/^([^\']+)\'([^\']*)\'(.*)$/, function ($0, charset, localeId, encodedText) {
                            if (isUtf8RegExp.test(charset)) {
                                try {
                                    return decodeURIComponent(encodedText);
                                } catch (e) {
                                    // Assume URI malformed (invalid utf-8 byte sequence)
                                    return $0;
                                }
                            } else if (isLatin1RegExp.test(charset)) {
                                return unescape(encodedText);
                            } else {
                                var numPercentSigns = 0, i;
                                for (i = 0; i < encodedText.length; i += 1) {
                                    if (encodedText[i] === '%') {
                                        numPercentSigns += 1;
                                    }
                                }
                                var buffer = new Buffer(encodedText.length - numPercentSigns * 2), j = 0;
                                for (i = 0; i < encodedText.length; i += 1) {
                                    if (encodedText[i] === '%') {
                                        buffer[j] = parseInt(encodedText.substr(i + 1, 2), 16);
                                        i += 2;
                                    } else {
                                        buffer[j] = encodedText.charCodeAt(i);
                                    }
                                    j += 1;
                                }
                                var decoded;
                                if (iconv) {
                                    var converter;
                                    try {
                                        converter = new iconv.Iconv(charset, 'utf-8//TRANSLIT//IGNORE');
                                    } catch (e1) {
                                        // Assume EINVAL (unsupported charset) and fall back to assuming iso-8859-1:
                                        converter = new iconv.Iconv('iso-8859-1', 'utf-8//TRANSLIT//IGNORE');
                                    }
                                    try {
                                        return converter.convert(buffer).toString('utf-8');
                                    } catch (e2) {
                                    }
                                } else if (isUtf8RegExp.test(charset)) {
                                    decoded = buffer.toString('utf-8');
                                    if (!/\ufffd/.test(decoded)) {
                                        return decoded;
                                    }
                                } else if (/^(?:us-)?ascii$/i.test(charset)) {
                                    return buffer.toString('ascii');
                                } else if (iconvLite.encodingExists(charset)) {
                                    decoded = iconvLite.decode(buffer, charset);
                                    if (!/\ufffd/.test(decoded)) {
                                        return decoded;
                                    }
                                }
                                return $0;
                            }
                        });
                    }
                    rfc2231.unfoldAndDecodeParameters = function (encodedParameters) {
                        if (!encodedParameters || typeof encodedParameters !== 'object') {
                            return {};
                        }
                        var decodedObj = {}, foldedParameters = {};
                        Object.keys(encodedParameters).forEach(function (key) {
                            var value = encodedParameters[key];
                            // Guard against bogus input:
                            if (typeof value !== 'string') {
                                return;
                            }
                            value = value.replace(/^"|"$/g, '').replace(/\\(["\\])/g, '$1');
                            var matchRfc2231FoldedParameter = key.match(/^([^\*]+)(?:\*(\d+))?(\*?)$/);
                            if (matchRfc2231FoldedParameter) {
                                var parameterName = matchRfc2231FoldedParameter[1], sequenceNumber = matchRfc2231FoldedParameter[2] ? parseInt(matchRfc2231FoldedParameter[2], 10) : 0;
                                if (!(parameterName in foldedParameters)) {
                                    foldedParameters[parameterName] = [];
                                }
                                foldedParameters[parameterName][sequenceNumber] = value;
                            } else {
                                decodedObj[key] = value;
                            }
                        });
                        Object.keys(foldedParameters).forEach(function (key) {
                            var valueArray = foldedParameters[key];
                            decodedObj[key] = decodeUnfoldedParameter(valueArray.join(''));
                        });
                        return decodedObj;
                    };
                    // We want to percent-encode all everything that'd require a fragment to be enclosed in double quotes:
                    // Allowed in output: <any (US-ASCII) CHAR except SPACE, CTLs (\u0000-\u001f\u007f), "*", "'", "%", or tspecials>
                    var unsafeParameterValueRegExp = /[\u0000-\u001f \u007f*'%\u0080-\uffff]/;
                    function quoteParameterIfNecessary(value) {
                        // tspecials, see definition in rfc2045
                        if (/[()<>@,;:\\"\/[\]?=]/.test(value)) {
                            return '"' + value.replace(/[\\"]/g, '\\$&') + '"';
                        } else {
                            return value;
                        }
                    }
                    rfc2231.encodeAndFoldParameters = function (decodedParameters, maxFragmentLength, forceUtf8) {
                        var encodedParameters = {};
                        maxFragmentLength = maxFragmentLength || 60;
                        Object.keys(decodedParameters).forEach(function (parameterName) {
                            var value = decodedParameters[parameterName], isEncoded = false;
                            if (unsafeParameterValueRegExp.test(value)) {
                                var encodedValue, i;
                                if (!forceUtf8 && canBeLatin1EncodedRegExp.test(value)) {
                                    encodedValue = 'iso-8859-1\'\'';
                                    for (i = 0; i < value.length; i += 1) {
                                        var charCode = value.charCodeAt(i);
                                        if (unsafeParameterValueRegExp.test(value[i])) {
                                            encodedValue += '%' + (charCode < 16 ? '0' : '') + charCode.toString(16).toUpperCase();
                                        } else {
                                            encodedValue += value[i];
                                        }
                                    }
                                } else {
                                    encodedValue = 'utf-8\'\'';
                                    var utf8Buffer = new Buffer(value, 'utf-8');
                                    for (i = 0; i < utf8Buffer.length; i += 1) {
                                        encodedValue += '%' + (utf8Buffer[i] < 16 ? '0' : '') + utf8Buffer[i].toString(16).toUpperCase();
                                    }
                                }
                                value = encodedValue;
                                isEncoded = true;
                            }
                            if (value.length > maxFragmentLength) {
                                var fragmentNum = 0, pos = 0;
                                while (pos < value.length) {
                                    var fragment;
                                    // Avoid breaking in the middle of an encoded octet (make sure the last and second last chars aren't percent signs):
                                    if (isEncoded && value.length > pos + maxFragmentLength && value[pos + maxFragmentLength - 1] === '%') {
                                        fragment = value.substr(pos, maxFragmentLength - 1);
                                    } else if (isEncoded && value.length > pos + maxFragmentLength && value[pos + maxFragmentLength - 2] === '%') {
                                        fragment = value.substr(pos, maxFragmentLength - 2);
                                    } else {
                                        fragment = value.substr(pos, maxFragmentLength);
                                    }
                                    encodedParameters[parameterName + '*' + fragmentNum + (isEncoded ? '*' : '')] = quoteParameterIfNecessary(fragment);
                                    pos += fragment.length;
                                    fragmentNum += 1;
                                }
                            } else {
                                encodedParameters[parameterName + (isEncoded ? '*' : '')] = quoteParameterIfNecessary(value);
                            }
                        });
                        return encodedParameters;
                    };
                }.call(this, require(4).Buffer));
            },
            {
                '4': 4,
                '66': 66
            }
        ],
        65: [
            function (require, module, exports) {
                arguments[4][61][0].apply(exports, arguments);
            },
            { '61': 61 }
        ],
        66: [
            function (require, module, exports) {
                arguments[4][62][0].apply(exports, arguments);
            },
            {
                '12': 12,
                '62': 62,
                '65': 65,
                '67': 67
            }
        ],
        67: [
            function (require, module, exports) {
                arguments[4][63][0].apply(exports, arguments);
            },
            {
                '24': 24,
                '63': 63
            }
        ],
        68: [
            function (require, module, exports) {
                //     Underscore.js 1.8.3
                //     http://underscorejs.org
                //     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                //     Underscore may be freely distributed under the MIT license.
                (function () {
                    // Baseline setup
                    // --------------
                    // Establish the root object, `window` in the browser, or `exports` on the server.
                    var root = this;
                    // Save the previous value of the `_` variable.
                    var previousUnderscore = root._;
                    // Save bytes in the minified (but not gzipped) version:
                    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
                    // Create quick reference variables for speed access to core prototypes.
                    var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
                    // All **ECMAScript 5** native function implementations that we hope to use
                    // are declared here.
                    var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind, nativeCreate = Object.create;
                    // Naked function reference for surrogate-prototype-swapping.
                    var Ctor = function () {
                    };
                    // Create a safe reference to the Underscore object for use below.
                    var _ = function (obj) {
                    };
                    // Export the Underscore object for **Node.js**, with
                    // backwards-compatibility for the old `require()` API. If we're in
                    // the browser, add `_` as a global object.
                    if (typeof exports !== 'undefined') {
                        if (typeof module !== 'undefined' && module.exports) {
                            exports = module.exports = _;
                        }
                        exports._ = _;
                    } else {
                        root._ = _;
                    }
                    // Current version.
                    _.VERSION = '1.8.3';
                    // Internal function that returns an efficient (for current engines) version
                    // of the passed-in callback, to be repeatedly applied in other Underscore
                    // functions.
                    var optimizeCb = function (func, context, argCount) {
                        if (context === void 0)
                            return func;
                        switch (argCount == null ? 3 : argCount) {
                        case 1:
                            return function (value) {
                            };
                        case 2:
                            return function (value, other) {
                            };
                        case 3:
                            return function (value, index, collection) {
                            };
                        case 4:
                            return function (accumulator, value, index, collection) {
                            };
                        }
                        return function () {
                        };
                    };
                    // A mostly-internal function to generate callbacks that can be applied
                    // to each element in a collection, returning the desired result — either
                    // identity, an arbitrary callback, a property matcher, or a property accessor.
                    var cb = function (value, context, argCount) {
                        if (value == null)
                            return _.identity;
                        if (_.isFunction(value))
                            return optimizeCb(value, context, argCount);
                        if (_.isObject(value))
                            return _.matcher(value);
                        return _.property(value);
                    };
                    _.iteratee = function (value, context) {
                    };
                    // An internal function for creating assigner functions.
                    var createAssigner = function (keysFunc, undefinedOnly) {
                        return function (obj) {
                            var length = arguments.length;
                            if (length < 2 || obj == null)
                                return obj;
                            for (var index = 1; index < length; index++) {
                                var source = arguments[index], keys = keysFunc(source), l = keys.length;
                                for (var i = 0; i < l; i++) {
                                    var key = keys[i];
                                    if (!undefinedOnly || obj[key] === void 0)
                                        obj[key] = source[key];
                                }
                            }
                            return obj;
                        };
                    };
                    // An internal function for creating a new object that inherits from another.
                    var baseCreate = function (prototype) {
                    };
                    var property = function (key) {
                        return function (obj) {
                            return obj == null ? void 0 : obj[key];
                        };
                    };
                    // Helper for collection methods to determine whether a collection
                    // should be iterated as an array or as an object
                    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
                    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
                    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
                    var getLength = property('length');
                    var isArrayLike = function (collection) {
                        var length = getLength(collection);
                        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
                    };
                    // Collection Functions
                    // --------------------
                    // The cornerstone, an `each` implementation, aka `forEach`.
                    // Handles raw objects in addition to array-likes. Treats all
                    // sparse array-likes as if they were dense.
                    _.each = _.forEach = function (obj, iteratee, context) {
                        iteratee = optimizeCb(iteratee, context);
                        var i, length;
                        if (isArrayLike(obj)) {
                            for (i = 0, length = obj.length; i < length; i++) {
                                iteratee(obj[i], i, obj);
                            }
                        } else {
                            var keys = _.keys(obj);
                            for (i = 0, length = keys.length; i < length; i++) {
                                iteratee(obj[keys[i]], keys[i], obj);
                            }
                        }
                        return obj;
                    };
                    // Return the results of applying the iteratee to each element.
                    _.map = _.collect = function (obj, iteratee, context) {
                        iteratee = cb(iteratee, context);
                        var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length);
                        for (var index = 0; index < length; index++) {
                            var currentKey = keys ? keys[index] : index;
                            results[index] = iteratee(obj[currentKey], currentKey, obj);
                        }
                        return results;
                    };
                    // Create a reducing function iterating left or right.
                    function createReduce(dir) {
                        // Optimized iterator function as using arguments.length
                        // in the main function will deoptimize the, see #1991.
                        function iterator(obj, iteratee, memo, keys, index, length) {
                        }
                        return function (obj, iteratee, memo, context) {
                        };
                    }
                    // **Reduce** builds up a single result from a list of values, aka `inject`,
                    // or `foldl`.
                    _.reduce = _.foldl = _.inject = createReduce(1);
                    // The right-associative version of reduce, also known as `foldr`.
                    _.reduceRight = _.foldr = createReduce(-1);
                    // Return the first value which passes a truth test. Aliased as `detect`.
                    _.find = _.detect = function (obj, predicate, context) {
                    };
                    // Return all the elements that pass a truth test.
                    // Aliased as `select`.
                    _.filter = _.select = function (obj, predicate, context) {
                    };
                    // Return all the elements for which a truth test fails.
                    _.reject = function (obj, predicate, context) {
                    };
                    // Determine whether all of the elements match a truth test.
                    // Aliased as `all`.
                    _.every = _.all = function (obj, predicate, context) {
                    };
                    // Determine if at least one element in the object matches a truth test.
                    // Aliased as `any`.
                    _.some = _.any = function (obj, predicate, context) {
                    };
                    // Determine if the array or object contains a given item (using `===`).
                    // Aliased as `includes` and `include`.
                    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
                        if (!isArrayLike(obj))
                            obj = _.values(obj);
                        if (typeof fromIndex != 'number' || guard)
                            fromIndex = 0;
                        return _.indexOf(obj, item, fromIndex) >= 0;
                    };
                    // Invoke a method (with arguments) on every item in a collection.
                    _.invoke = function (obj, method) {
                    };
                    // Convenience version of a common use case of `map`: fetching a property.
                    _.pluck = function (obj, key) {
                    };
                    // Convenience version of a common use case of `filter`: selecting only objects
                    // containing specific `key:value` pairs.
                    _.where = function (obj, attrs) {
                    };
                    // Convenience version of a common use case of `find`: getting the first object
                    // containing specific `key:value` pairs.
                    _.findWhere = function (obj, attrs) {
                    };
                    // Return the maximum element (or element-based computation).
                    _.max = function (obj, iteratee, context) {
                    };
                    // Return the minimum element (or element-based computation).
                    _.min = function (obj, iteratee, context) {
                    };
                    // Shuffle a collection, using the modern version of the
                    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
                    _.shuffle = function (obj) {
                    };
                    // Sample **n** random values from a collection.
                    // If **n** is not specified, returns a single random element.
                    // The internal `guard` argument allows it to work with `map`.
                    _.sample = function (obj, n, guard) {
                    };
                    // Sort the object's values by a criterion produced by an iteratee.
                    _.sortBy = function (obj, iteratee, context) {
                    };
                    // An internal function used for aggregate "group by" operations.
                    var group = function (behavior) {
                        return function (obj, iteratee, context) {
                        };
                    };
                    // Groups the object's values by a criterion. Pass either a string attribute
                    // to group by, or a function that returns the criterion.
                    _.groupBy = group(function (result, value, key) {
                    });
                    // Indexes the object's values by a criterion, similar to `groupBy`, but for
                    // when you know that your index values will be unique.
                    _.indexBy = group(function (result, value, key) {
                    });
                    // Counts instances of an object that group by a certain criterion. Pass
                    // either a string attribute to count by, or a function that returns the
                    // criterion.
                    _.countBy = group(function (result, value, key) {
                    });
                    // Safely create a real, live array from anything iterable.
                    _.toArray = function (obj) {
                    };
                    // Return the number of elements in an object.
                    _.size = function (obj) {
                    };
                    // Split a collection into two arrays: one whose elements all satisfy the given
                    // predicate, and one whose elements all do not satisfy the predicate.
                    _.partition = function (obj, predicate, context) {
                    };
                    // Array Functions
                    // ---------------
                    // Get the first element of an array. Passing **n** will return the first N
                    // values in the array. Aliased as `head` and `take`. The **guard** check
                    // allows it to work with `_.map`.
                    _.first = _.head = _.take = function (array, n, guard) {
                    };
                    // Returns everything but the last entry of the array. Especially useful on
                    // the arguments object. Passing **n** will return all the values in
                    // the array, excluding the last N.
                    _.initial = function (array, n, guard) {
                    };
                    // Get the last element of an array. Passing **n** will return the last N
                    // values in the array.
                    _.last = function (array, n, guard) {
                    };
                    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
                    // Especially useful on the arguments object. Passing an **n** will return
                    // the rest N values in the array.
                    _.rest = _.tail = _.drop = function (array, n, guard) {
                    };
                    // Trim out all falsy values from an array.
                    _.compact = function (array) {
                    };
                    // Internal implementation of a recursive `flatten` function.
                    var flatten = function (input, shallow, strict, startIndex) {
                        var output = [], idx = 0;
                        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
                            var value = input[i];
                            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                                //flatten current level of array or arguments object
                                if (!shallow)
                                    value = flatten(value, shallow, strict);
                                var j = 0, len = value.length;
                                output.length += len;
                                while (j < len) {
                                    output[idx++] = value[j++];
                                }
                            } else if (!strict) {
                                output[idx++] = value;
                            }
                        }
                        return output;
                    };
                    // Flatten out an array, either recursively (by default), or just one level.
                    _.flatten = function (array, shallow) {
                    };
                    // Return a version of the array that does not contain the specified value(s).
                    _.without = function (array) {
                    };
                    // Produce a duplicate-free version of the array. If the array has already
                    // been sorted, you have the option of using a faster algorithm.
                    // Aliased as `unique`.
                    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
                    };
                    // Produce an array that contains the union: each distinct element from all of
                    // the passed-in arrays.
                    _.union = function () {
                    };
                    // Produce an array that contains every item shared between all the
                    // passed-in arrays.
                    _.intersection = function (array) {
                    };
                    // Take the difference between one array and a number of other arrays.
                    // Only the elements present in just the first array will remain.
                    _.difference = function (array) {
                    };
                    // Zip together multiple lists into a single array -- elements that share
                    // an index go together.
                    _.zip = function () {
                    };
                    // Complement of _.zip. Unzip accepts an array of arrays and groups
                    // each array's elements on shared indices
                    _.unzip = function (array) {
                    };
                    // Converts lists into objects. Pass either a single array of `[key, value]`
                    // pairs, or two parallel arrays of the same length -- one of keys, and one of
                    // the corresponding values.
                    _.object = function (list, values) {
                    };
                    // Generator function to create the findIndex and findLastIndex functions
                    function createPredicateIndexFinder(dir) {
                        return function (array, predicate, context) {
                        };
                    }
                    // Returns the first index on an array-like that passes a predicate test
                    _.findIndex = createPredicateIndexFinder(1);
                    _.findLastIndex = createPredicateIndexFinder(-1);
                    // Use a comparator function to figure out the smallest index at which
                    // an object should be inserted so as to maintain order. Uses binary search.
                    _.sortedIndex = function (array, obj, iteratee, context) {
                    };
                    // Generator function to create the indexOf and lastIndexOf functions
                    function createIndexFinder(dir, predicateFind, sortedIndex) {
                        return function (array, item, idx) {
                            var i = 0, length = getLength(array);
                            if (typeof idx == 'number') {
                                if (dir > 0) {
                                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                                } else {
                                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                                }
                            } else if (sortedIndex && idx && length) {
                                idx = sortedIndex(array, item);
                                return array[idx] === item ? idx : -1;
                            }
                            if (item !== item) {
                                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                                return idx >= 0 ? idx + i : -1;
                            }
                            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                                if (array[idx] === item)
                                    return idx;
                            }
                            return -1;
                        };
                    }
                    // Return the position of the first occurrence of an item in an array,
                    // or -1 if the item is not included in the array.
                    // If the array is large and already in sort order, pass `true`
                    // for **isSorted** to use binary search.
                    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
                    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
                    // Generate an integer Array containing an arithmetic progression. A port of
                    // the native Python `range()` function. See
                    // [the Python documentation](http://docs.python.org/library/functions.html#range).
                    _.range = function (start, stop, step) {
                    };
                    // Function (ahem) Functions
                    // ------------------
                    // Determines whether to execute a function as a constructor
                    // or a normal function with the provided arguments
                    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
                    };
                    // Create a function bound to a given object (assigning `this`, and arguments,
                    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
                    // available.
                    _.bind = function (func, context) {
                    };
                    // Partially apply a function by creating a version that has had some of its
                    // arguments pre-filled, without changing its dynamic `this` context. _ acts
                    // as a placeholder, allowing any combination of arguments to be pre-filled.
                    _.partial = function (func) {
                        var boundArgs = slice.call(arguments, 1);
                        var bound = function () {
                        };
                        return bound;
                    };
                    // Bind a number of an object's methods to that object. Remaining arguments
                    // are the method names to be bound. Useful for ensuring that all callbacks
                    // defined on an object belong to it.
                    _.bindAll = function (obj) {
                    };
                    // Memoize an expensive function by storing its results.
                    _.memoize = function (func, hasher) {
                    };
                    // Delays a function for the given number of milliseconds, and then calls
                    // it with the arguments supplied.
                    _.delay = function (func, wait) {
                    };
                    // Defers a function, scheduling it to run after the current call stack has
                    // cleared.
                    _.defer = _.partial(_.delay, _, 1);
                    // Returns a function, that, when invoked, will only be triggered at most once
                    // during a given window of time. Normally, the throttled function will run
                    // as much as it can, without ever going more than once per `wait` duration;
                    // but if you'd like to disable the execution on the leading edge, pass
                    // `{leading: false}`. To disable execution on the trailing edge, ditto.
                    _.throttle = function (func, wait, options) {
                    };
                    // Returns a function, that, as long as it continues to be invoked, will not
                    // be triggered. The function will be called after it stops being called for
                    // N milliseconds. If `immediate` is passed, trigger the function on the
                    // leading edge, instead of the trailing.
                    _.debounce = function (func, wait, immediate) {
                    };
                    // Returns the first function passed as an argument to the second,
                    // allowing you to adjust arguments, run code before and after, and
                    // conditionally execute the original function.
                    _.wrap = function (func, wrapper) {
                    };
                    // Returns a negated version of the passed-in predicate.
                    _.negate = function (predicate) {
                    };
                    // Returns a function that is the composition of a list of functions, each
                    // consuming the return value of the function that follows.
                    _.compose = function () {
                    };
                    // Returns a function that will only be executed on and after the Nth call.
                    _.after = function (times, func) {
                    };
                    // Returns a function that will only be executed up to (but not including) the Nth call.
                    _.before = function (times, func) {
                    };
                    // Returns a function that will be executed at most one time, no matter how
                    // often you call it. Useful for lazy initialization.
                    _.once = _.partial(_.before, 2);
                    // Object Functions
                    // ----------------
                    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
                    var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
                    var nonEnumerableProps = [
                        'valueOf',
                        'isPrototypeOf',
                        'toString',
                        'propertyIsEnumerable',
                        'hasOwnProperty',
                        'toLocaleString'
                    ];
                    function collectNonEnumProps(obj, keys) {
                    }
                    // Retrieve the names of an object's own properties.
                    // Delegates to **ECMAScript 5**'s native `Object.keys`
                    _.keys = function (obj) {
                        if (!_.isObject(obj))
                            return [];
                        if (nativeKeys)
                            return nativeKeys(obj);
                        var keys = [];
                        for (var key in obj)
                            if (_.has(obj, key))
                                keys.push(key);
                        // Ahem, IE < 9.
                        if (hasEnumBug)
                            collectNonEnumProps(obj, keys);
                        return keys;
                    };
                    // Retrieve all the property names of an object.
                    _.allKeys = function (obj) {
                        if (!_.isObject(obj))
                            return [];
                        var keys = [];
                        for (var key in obj)
                            keys.push(key);
                        // Ahem, IE < 9.
                        if (hasEnumBug)
                            collectNonEnumProps(obj, keys);
                        return keys;
                    };
                    // Retrieve the values of an object's properties.
                    _.values = function (obj) {
                    };
                    // Returns the results of applying the iteratee to each element of the object
                    // In contrast to _.map it returns an object
                    _.mapObject = function (obj, iteratee, context) {
                    };
                    // Convert an object into a list of `[key, value]` pairs.
                    _.pairs = function (obj) {
                    };
                    // Invert the keys and values of an object. The values must be serializable.
                    _.invert = function (obj) {
                        var result = {};
                        var keys = _.keys(obj);
                        for (var i = 0, length = keys.length; i < length; i++) {
                            result[obj[keys[i]]] = keys[i];
                        }
                        return result;
                    };
                    // Return a sorted list of the function names available on the object.
                    // Aliased as `methods`
                    _.functions = _.methods = function (obj) {
                        var names = [];
                        for (var key in obj) {
                            if (_.isFunction(obj[key]))
                                names.push(key);
                        }
                        return names.sort();
                    };
                    // Extend a given object with all the properties in passed-in object(s).
                    _.extend = createAssigner(_.allKeys);
                    // Assigns a given object with all the own properties in the passed-in object(s)
                    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
                    _.extendOwn = _.assign = createAssigner(_.keys);
                    // Returns the first key on an object that passes a predicate test
                    _.findKey = function (obj, predicate, context) {
                    };
                    // Return a copy of the object only containing the whitelisted properties.
                    _.pick = function (object, oiteratee, context) {
                        var result = {}, obj = object, iteratee, keys;
                        if (obj == null)
                            return result;
                        if (_.isFunction(oiteratee)) {
                            keys = _.allKeys(obj);
                            iteratee = optimizeCb(oiteratee, context);
                        } else {
                            keys = flatten(arguments, false, false, 1);
                            iteratee = function (value, key, obj) {
                            };
                            obj = Object(obj);
                        }
                        for (var i = 0, length = keys.length; i < length; i++) {
                            var key = keys[i];
                            var value = obj[key];
                            if (iteratee(value, key, obj))
                                result[key] = value;
                        }
                        return result;
                    };
                    // Return a copy of the object without the blacklisted properties.
                    _.omit = function (obj, iteratee, context) {
                        if (_.isFunction(iteratee)) {
                            iteratee = _.negate(iteratee);
                        } else {
                            var keys = _.map(flatten(arguments, false, false, 1), String);
                            iteratee = function (value, key) {
                                return !_.contains(keys, key);
                            };
                        }
                        return _.pick(obj, iteratee, context);
                    };
                    // Fill in a given object with default properties.
                    _.defaults = createAssigner(_.allKeys, true);
                    // Creates an object that inherits from the given prototype object.
                    // If additional properties are provided then they will be added to the
                    // created object.
                    _.create = function (prototype, props) {
                    };
                    // Create a (shallow-cloned) duplicate of an object.
                    _.clone = function (obj) {
                    };
                    // Invokes interceptor with the obj, and then returns obj.
                    // The primary purpose of this method is to "tap into" a method chain, in
                    // order to perform operations on intermediate results within the chain.
                    _.tap = function (obj, interceptor) {
                    };
                    // Returns whether an object has a given set of `key:value` pairs.
                    _.isMatch = function (object, attrs) {
                    };
                    // Internal recursive comparison function for `isEqual`.
                    var eq = function (a, b, aStack, bStack) {
                    };
                    // Perform a deep comparison to check if two objects are equal.
                    _.isEqual = function (a, b) {
                    };
                    // Is a given array, string, or object empty?
                    // An "empty" object has no enumerable own-properties.
                    _.isEmpty = function (obj) {
                    };
                    // Is a given value a DOM element?
                    _.isElement = function (obj) {
                    };
                    // Is a given value an array?
                    // Delegates to ECMA5's native Array.isArray
                    _.isArray = nativeIsArray || function (obj) {
                    };
                    // Is a given variable an object?
                    _.isObject = function (obj) {
                        var type = typeof obj;
                        return type === 'function' || type === 'object' && !!obj;
                    };
                    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
                    _.each([
                        'Arguments',
                        'Function',
                        'String',
                        'Number',
                        'Date',
                        'RegExp',
                        'Error'
                    ], function (name) {
                        _['is' + name] = function (obj) {
                            return toString.call(obj) === '[object ' + name + ']';
                        };
                    });
                    // Define a fallback version of the method in browsers (ahem, IE < 9), where
                    // there isn't any inspectable "Arguments" type.
                    if (!_.isArguments(arguments)) {
                        _.isArguments = function (obj) {
                        };
                    }
                    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
                    // IE 11 (#1621), and in Safari 8 (#1929).
                    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
                        _.isFunction = function (obj) {
                            return typeof obj == 'function' || false;
                        };
                    }
                    // Is a given object a finite number?
                    _.isFinite = function (obj) {
                    };
                    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
                    _.isNaN = function (obj) {
                    };
                    // Is a given value a boolean?
                    _.isBoolean = function (obj) {
                    };
                    // Is a given value equal to null?
                    _.isNull = function (obj) {
                    };
                    // Is a given variable undefined?
                    _.isUndefined = function (obj) {
                    };
                    // Shortcut function for checking if an object has a given property directly
                    // on itself (in other words, not on a prototype).
                    _.has = function (obj, key) {
                    };
                    // Utility Functions
                    // -----------------
                    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
                    // previous owner. Returns a reference to the Underscore object.
                    _.noConflict = function () {
                    };
                    // Keep the identity function around for default iteratees.
                    _.identity = function (value) {
                    };
                    // Predicate-generating functions. Often useful outside of Underscore.
                    _.constant = function (value) {
                    };
                    _.noop = function () {
                    };
                    _.property = property;
                    // Generates a function for a given object that returns a given property.
                    _.propertyOf = function (obj) {
                    };
                    // Returns a predicate for checking whether an object has a given set of
                    // `key:value` pairs.
                    _.matcher = _.matches = function (attrs) {
                    };
                    // Run a function **n** times.
                    _.times = function (n, iteratee, context) {
                    };
                    // Return a random integer between min and max (inclusive).
                    _.random = function (min, max) {
                    };
                    // A (possibly faster) way to get the current timestamp as an integer.
                    _.now = Date.now || function () {
                    };
                    // List of HTML entities for escaping.
                    var escapeMap = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        '\'': '&#x27;',
                        '`': '&#x60;'
                    };
                    var unescapeMap = _.invert(escapeMap);
                    // Functions for escaping and unescaping strings to/from HTML interpolation.
                    var createEscaper = function (map) {
                        var escaper = function (match) {
                        };
                        // Regexes for identifying a key that needs to be escaped
                        var source = '(?:' + _.keys(map).join('|') + ')';
                        var testRegexp = RegExp(source);
                        var replaceRegexp = RegExp(source, 'g');
                        return function (string) {
                        };
                    };
                    _.escape = createEscaper(escapeMap);
                    _.unescape = createEscaper(unescapeMap);
                    // If the value of the named `property` is a function then invoke it with the
                    // `object` as context; otherwise, return it.
                    _.result = function (object, property, fallback) {
                    };
                    // Generate a unique integer id (unique within the entire client session).
                    // Useful for temporary DOM ids.
                    var idCounter = 0;
                    _.uniqueId = function (prefix) {
                    };
                    // By default, Underscore uses ERB-style template delimiters, change the
                    // following template settings to use alternative delimiters.
                    _.templateSettings = {
                        evaluate: /<%([\s\S]+?)%>/g,
                        interpolate: /<%=([\s\S]+?)%>/g,
                        escape: /<%-([\s\S]+?)%>/g
                    };
                    // When customizing `templateSettings`, if you don't want to define an
                    // interpolation, evaluation or escaping regex, we need one that is
                    // guaranteed not to match.
                    var noMatch = /(.)^/;
                    // Certain characters need to be escaped so that they can be put into a
                    // string literal.
                    var escapes = {
                        '\'': '\'',
                        '\\': '\\',
                        '\r': 'r',
                        '\n': 'n',
                        '\u2028': 'u2028',
                        '\u2029': 'u2029'
                    };
                    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
                    var escapeChar = function (match) {
                    };
                    // JavaScript micro-templating, similar to John Resig's implementation.
                    // Underscore templating handles arbitrary delimiters, preserves whitespace,
                    // and correctly escapes quotes within interpolated code.
                    // NB: `oldSettings` only exists for backwards compatibility.
                    _.template = function (text, settings, oldSettings) {
                    };
                    // Add a "chain" function. Start chaining a wrapped Underscore object.
                    _.chain = function (obj) {
                    };
                    // OOP
                    // ---------------
                    // If Underscore is called as a function, it returns a wrapped object that
                    // can be used OO-style. This wrapper holds altered versions of all the
                    // underscore functions. Wrapped objects may be chained.
                    // Helper function to continue chaining intermediate results.
                    var result = function (instance, obj) {
                    };
                    // Add your own custom functions to the Underscore object.
                    _.mixin = function (obj) {
                        _.each(_.functions(obj), function (name) {
                            var func = _[name] = obj[name];
                            _.prototype[name] = function () {
                            };
                        });
                    };
                    // Add all of the Underscore functions to the wrapper object.
                    _.mixin(_);
                    // Add all mutator Array functions to the wrapper.
                    _.each([
                        'pop',
                        'push',
                        'reverse',
                        'shift',
                        'sort',
                        'splice',
                        'unshift'
                    ], function (name) {
                        var method = ArrayProto[name];
                        _.prototype[name] = function () {
                        };
                    });
                    // Add all accessor Array functions to the wrapper.
                    _.each([
                        'concat',
                        'join',
                        'slice'
                    ], function (name) {
                        var method = ArrayProto[name];
                        _.prototype[name] = function () {
                        };
                    });
                    // Extracts the result from a wrapped and chained object.
                    _.prototype.value = function () {
                    };
                    // Provide unwrapping proxy for some methods used in engine operations
                    // such as arithmetic and JSON stringification.
                    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
                    _.prototype.toString = function () {
                    };
                    // AMD registration happens at the end for compatibility with AMD loaders
                    // that may not enforce next-turn semantics on modules. Even though general
                    // practice for AMD registration is to be anonymous, underscore registers
                    // as a named module because, like jQuery, it is a base library that is
                    // popular enough to be bundled in a third party lib, but not be part of
                    // an AMD load request. Those cases could generate an error when an
                    // anonymous define() is called outside of a loader request.
                    if (typeof define === 'function' && define.amd) {
                        define('underscore', [], function () {
                        });
                    }
                }.call(this));
            },
            {}
        ]
    }, {}, [44])(44);
}));