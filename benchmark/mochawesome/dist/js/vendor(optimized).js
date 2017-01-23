/*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:23Z
 */
(function (global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ? factory(global, true) : function (w) {
        };
    } else {
        factory(global);
    }    // Pass this if window is not defined yet
}(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
    // Support: Firefox 18+
    // Can't be in strict mode, several libs including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    //"use strict";
    var arr = [];
    var document = window.document;
    var slice = arr.slice;
    var concat = arr.concat;
    var push = arr.push;
    var indexOf = arr.indexOf;
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var support = {};
    var version = '2.2.4',
        // Define a local copy of jQuery
        jQuery = function (selector, context) {
            // The jQuery object is actually just the init constructor 'enhanced'
            // Need init if jQuery is called (just allow error to be thrown if not included)
            return new jQuery.fn.init(selector, context);
        },
        // Support: Android<4.1
        // Make sure we trim BOM and NBSP
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi,
        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        };
    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // Start with an empty selector
        selector: '',
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function () {
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {
            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);
            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;
            // Return the newly-formed element set
            return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function (callback) {
            return jQuery.each(this, callback);
        },
        map: function (callback) {
        },
        slice: function () {
        },
        first: function () {
        },
        last: function () {
        },
        eq: function (i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function () {
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
    };
    jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;
            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && !jQuery.isFunction(target)) {
            target = {};
        }
        // Extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);    // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: 'jQuery' + (version + Math.random()).replace(/\D/g, ''),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function (msg) {
        },
        noop: function () {
        },
        isFunction: function (obj) {
            return jQuery.type(obj) === 'function';
        },
        isArray: Array.isArray,
        isWindow: function (obj) {
            return obj != null && obj === obj.window;
        },
        isNumeric: function (obj) {
        },
        isPlainObject: function (obj) {
            var key;
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if (jQuery.type(obj) !== 'object' || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }
            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype || {}, 'isPrototypeOf')) {
                return false;
            }
            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own
            for (key in obj) {
            }
            return key === undefined || hasOwn.call(obj, key);
        },
        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        type: function (obj) {
            if (obj == null) {
                return obj + '';
            }
            // Support: Android<4.0, iOS<6 (functionish RegExp)
            return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
        },
        // Evaluates a script in a global context
        globalEval: function (code) {
        },
        // Convert dashed to camelCase; used by the css and data modules
        // Support: IE9-11+
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function (string) {
            return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
        },
        nodeName: function (elem, name) {
        },
        each: function (obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        // Support: Android<4.1
        trim: function (text) {
            return text == null ? '' : (text + '').replace(rtrim, '');
        },
        // results is for internal usage only
        makeArray: function (arr, results) {
            var ret = results || [];
            if (arr != null) {
                if (isArrayLike(Object(arr))) {
                    jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr);
                } else {
                    push.call(ret, arr);
                }
            }
            return ret;
        },
        inArray: function (elem, arr, i) {
        },
        merge: function (first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },
        grep: function (elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }
            return matches;
        },
        // arg is for internal usage only
        map: function (elems, callback, arg) {
        },
        // A global GUID counter for objects
        guid: 1,
        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function (fn, context) {
            var tmp, args, proxy;
            if (typeof context === 'string') {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }
            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }
            // Simulated bind
            args = slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            };
            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            return proxy;
        },
        now: Date.now,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
    });
    // JSHint would error on this code due to the Symbol not being defined in ES5.
    // Defining this global in .jshintrc would create a danger of using the global
    // unguarded in another place, it seems safer to just disable JSHint for these
    // three lines.
    /* jshint ignore: start */
    if (typeof Symbol === 'function') {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
    }
    /* jshint ignore: end */
    // Populate the class2type map
    jQuery.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '), function (i, name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
    });
    function isArrayLike(obj) {
        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && 'length' in obj && obj.length, type = jQuery.type(obj);
        if (type === 'function' || jQuery.isWindow(obj)) {
            return false;
        }
        return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
    }
    var Sizzle = /*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
    function (window) {
        var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate,
            // Local document vars
            setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains,
            // Instance-specific data
            expando = 'sizzle' + 1 * new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                }
                return 0;
            },
            // General-purpose constants
            MAX_NEGATIVE = 1 << 31,
            // Instance methods
            hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice,
            // Use a stripped-down indexOf as it's faster than native
            // http://jsperf.com/thor-indexof-vs-for/5
            indexOf = function (list, elem) {
            }, booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
            // Regular expressions
            // http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = '[\\x20\\t\\r\\n\\f]',
            // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+',
            // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
            attributes = '\\[' + whitespace + '*(' + identifier + ')(?:' + whitespace + // Operator (capture 2)
            '*([*^$|!~]?=)' + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
            '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + identifier + '))|)' + whitespace + '*\\]', pseudos = ':(' + identifier + ')(?:\\((' + // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
            // 1. quoted (capture 3; capture 4 or capture 5)
            '(\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|' + // 2. simple (capture 6)
            '((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' + // 3. anything else (capture 2)
            '.*' + ')\\)|)',
            // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rwhitespace = new RegExp(whitespace + '+', 'g'), rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g'), rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*'), rcombinators = new RegExp('^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace + '*'), rattributeQuotes = new RegExp('=' + whitespace + '*([^\\]\'"]*?)' + whitespace + '*\\]', 'g'), rpseudo = new RegExp(pseudos), ridentifier = new RegExp('^' + identifier + '$'), matchExpr = {
                'ID': new RegExp('^#(' + identifier + ')'),
                'CLASS': new RegExp('^\\.(' + identifier + ')'),
                'TAG': new RegExp('^(' + identifier + '|[*])'),
                'ATTR': new RegExp('^' + attributes),
                'PSEUDO': new RegExp('^' + pseudos),
                'CHILD': new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + whitespace + '*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' + whitespace + '*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
                'bool': new RegExp('^(?:' + booleans + ')$', 'i'),
                // For use in libraries implementing .is()
                // We use this for POS matching in `select`
                'needsContext': new RegExp('^' + whitespace + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + whitespace + '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)', 'i')
            }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/,
            // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g,
            // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
            runescape = new RegExp('\\\\([\\da-f]{1,6}' + whitespace + '?|(' + whitespace + ')|.)', 'ig'), funescape = function (_, escaped, escapedWhitespace) {
            },
            // Used for iframes
            // See setDocument()
            // Removing the function wrapper causes a "Permission Denied"
            // error in IE
            unloadHandler = function () {
            };
        // Optimize for push.apply( _, NodeList )
        try {
            push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ? // Leverage slice if possible
                function (target, els) {
                } : // Support: IE<9
                // Otherwise append directly
                function (target, els) {
                }
            };
        }
        function Sizzle(selector, context, results, seed) {
            var m, i, elem, nid, nidselect, match, groups, newSelector, newContext = context && context.ownerDocument,
                // nodeType defaults to 9, since context defaults to document
                nodeType = context ? context.nodeType : 9;
            results = results || [];
            // Return early from calls with invalid selector or context
            if (typeof selector !== 'string' || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
                return results;
            }
            // Try to shortcut find operations (as opposed to filters) in HTML documents
            if (!seed) {
                if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                    setDocument(context);
                }
                context = context || document;
                if (documentIsHTML) {
                    // If the selector is sufficiently simple, try using a "get*By*" DOM method
                    // (excepting DocumentFragment context, where the methods don't exist)
                    if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
                        // ID selector
                        if (m = match[1]) {
                            // Document context
                            if (nodeType === 9) {
                                if (elem = context.getElementById(m)) {
                                    // Support: IE, Opera, Webkit
                                    // TODO: identify versions
                                    // getElementById can match elements by name instead of ID
                                    if (elem.id === m) {
                                        results.push(elem);
                                        return results;
                                    }
                                } else {
                                    return results;
                                }    // Element context
                            } else {
                                // Support: IE, Opera, Webkit
                                // TODO: identify versions
                                // getElementById can match elements by name instead of ID
                                if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            }    // Type selector
                        } else if (match[2]) {
                            push.apply(results, context.getElementsByTagName(selector));
                            return results;    // Class selector
                        } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                            push.apply(results, context.getElementsByClassName(m));
                            return results;
                        }
                    }
                    // Take advantage of querySelectorAll
                    if (support.qsa && !compilerCache[selector + ' '] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                        if (nodeType !== 1) {
                            newContext = context;
                            newSelector = selector;    // qSA looks outside Element context, which is not what we want
                                                       // Thanks to Andrew Dupont for this workaround technique
                                                       // Support: IE <=8
                                                       // Exclude object elements
                        } else if (context.nodeName.toLowerCase() !== 'object') {
                            // Capture the context ID, setting it first if necessary
                            if (nid = context.getAttribute('id')) {
                                nid = nid.replace(rescape, '\\$&');
                            } else {
                                context.setAttribute('id', nid = expando);
                            }
                            // Prefix every selector in the list
                            groups = tokenize(selector);
                            i = groups.length;
                            nidselect = ridentifier.test(nid) ? '#' + nid : '[id=\'' + nid + '\']';
                            while (i--) {
                                groups[i] = nidselect + ' ' + toSelector(groups[i]);
                            }
                            newSelector = groups.join(',');
                            // Expand context for sibling selectors
                            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                        }
                        if (newSelector) {
                            try {
                                push.apply(results, newContext.querySelectorAll(newSelector));
                                return results;
                            } catch (qsaError) {
                            } finally {
                                if (nid === expando) {
                                    context.removeAttribute('id');
                                }
                            }
                        }
                    }
                }
            }
            // All others
            return select(selector.replace(rtrim, '$1'), context, results, seed);
        }
        /**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
        function createCache() {
            var keys = [];
            function cache(key, value) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if (keys.push(key + ' ') > Expr.cacheLength) {
                    // Only keep the most recent entries
                    delete cache[keys.shift()];
                }
                return cache[key + ' '] = value;
            }
            return cache;
        }
        /**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }
        /**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
        function assert(fn) {
            var div = document.createElement('div');
            try {
                return !!fn(div);
            } catch (e) {
                return false;
            } finally {
                // Remove from its parent by default
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                // release memory in IE
                div = null;
            }
        }
        /**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
        function addHandle(attrs, handler) {
        }
        /**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
        function siblingCheck(a, b) {
        }
        /**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
        function createInputPseudo(type) {
            return function (elem) {
            };
        }
        /**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
        function createButtonPseudo(type) {
            return function (elem) {
            };
        }
        /**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
            });
        }
        /**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
        function testContext(context) {
        }
        // Expose support vars for convenience
        support = Sizzle.support = {};
        /**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
        isXML = Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== 'HTML' : false;
        };
        /**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
        setDocument = Sizzle.setDocument = function (node) {
            var hasCompare, parent, doc = node ? node.ownerDocument || node : preferredDoc;
            // Return early if doc is invalid or already selected
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }
            // Update global variables
            document = doc;
            docElem = document.documentElement;
            documentIsHTML = !isXML(document);
            // Support: IE 9-11, Edge
            // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
            if ((parent = document.defaultView) && parent.top !== parent) {
                // Support: IE 11
                if (parent.addEventListener) {
                    parent.addEventListener('unload', unloadHandler, false);    // Support: IE 9 - 10 only
                } else if (parent.attachEvent) {
                    parent.attachEvent('onunload', unloadHandler);
                }
            }
            /* Attributes
	---------------------------------------------------------------------- */
            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties
            // (excepting IE8 booleans)
            support.attributes = assert(function (div) {
                div.className = 'i';
                return !div.getAttribute('className');
            });
            /* getElement(s)By*
	---------------------------------------------------------------------- */
            // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function (div) {
                div.appendChild(document.createComment(''));
                return !div.getElementsByTagName('*').length;
            });
            // Support: IE<9
            support.getElementsByClassName = rnative.test(document.getElementsByClassName);
            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function (div) {
                docElem.appendChild(div).id = expando;
                return !document.getElementsByName || !document.getElementsByName(expando).length;
            });
            // ID find and filter
            if (support.getById) {
                Expr.find['ID'] = function (id, context) {
                    if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
                        var m = context.getElementById(id);
                        return m ? [m] : [];
                    }
                };
                Expr.filter['ID'] = function (id) {
                };
            } else {
                // Support: IE6/7
                // getElementById is not reliable as a find shortcut
                delete Expr.find['ID'];
                Expr.filter['ID'] = function (id) {
                };
            }
            // Tag
            Expr.find['TAG'] = support.getElementsByTagName ? function (tag, context) {
                if (typeof context.getElementsByTagName !== 'undefined') {
                    return context.getElementsByTagName(tag);    // DocumentFragment nodes don't have gEBTN
                } else if (support.qsa) {
                    return context.querySelectorAll(tag);
                }
            } : function (tag, context) {
            };
            // Class
            Expr.find['CLASS'] = support.getElementsByClassName && function (className, context) {
            };
            /* QSA/matchesSelector
	---------------------------------------------------------------------- */
            // QSA and matchesSelector support
            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];
            // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See http://bugs.jquery.com/ticket/13378
            rbuggyQSA = [];
            if (support.qsa = rnative.test(document.querySelectorAll)) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function (div) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explicitly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    docElem.appendChild(div).innerHTML = '<a id=\'' + expando + '\'></a>' + '<select id=\'' + expando + '-\r\\\' msallowcapture=\'\'>' + '<option selected=\'\'></option></select>';
                    // Support: IE8, Opera 11-12.16
                    // Nothing should be selected when empty strings follow ^= or $= or *=
                    // The test attribute must be unknown in Opera but "safe" for WinRT
                    // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                    if (div.querySelectorAll('[msallowcapture^=\'\']').length) {
                        rbuggyQSA.push('[*^$]=' + whitespace + '*(?:\'\'|"")');
                    }
                    // Support: IE8
                    // Boolean attributes and "value" are not treated correctly
                    if (!div.querySelectorAll('[selected]').length) {
                        rbuggyQSA.push('\\[' + whitespace + '*(?:value|' + booleans + ')');
                    }
                    // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
                    if (!div.querySelectorAll('[id~=' + expando + '-]').length) {
                        rbuggyQSA.push('~=');
                    }
                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(':checked').length) {
                        rbuggyQSA.push(':checked');
                    }
                    // Support: Safari 8+, iOS 8+
                    // https://bugs.webkit.org/show_bug.cgi?id=136851
                    // In-page `selector#id sibing-combinator selector` fails
                    if (!div.querySelectorAll('a#' + expando + '+*').length) {
                        rbuggyQSA.push('.#.+[+~]');
                    }
                });
                assert(function (div) {
                    // Support: Windows 8 Native Apps
                    // The type and name attributes are restricted during .innerHTML assignment
                    var input = document.createElement('input');
                    input.setAttribute('type', 'hidden');
                    div.appendChild(input).setAttribute('name', 'D');
                    // Support: IE8
                    // Enforce case-sensitivity of name attribute
                    if (div.querySelectorAll('[name=d]').length) {
                        rbuggyQSA.push('name' + whitespace + '*[*^$|!~]?=');
                    }
                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here and will not see later tests
                    if (!div.querySelectorAll(':enabled').length) {
                        rbuggyQSA.push(':enabled', ':disabled');
                    }
                    // Opera 10-11 does not throw on post-comma invalid pseudos
                    div.querySelectorAll('*,:x');
                    rbuggyQSA.push(',.*:');
                });
            }
            if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
                assert(function (div) {
                    // Check to see if it's possible to do matchesSelector
                    // on a disconnected node (IE 9)
                    support.disconnectedMatch = matches.call(div, 'div');
                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call(div, '[s!=\'\']:x');
                    rbuggyMatches.push('!=', pseudos);
                });
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'));
            /* Contains
	---------------------------------------------------------------------- */
            hasCompare = rnative.test(docElem.compareDocumentPosition);
            // Element contains another
            // Purposefully self-exclusive
            // As in, an element does not contain itself
            contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            } : function (a, b) {
            };
            /* Sorting
	---------------------------------------------------------------------- */
            // Document order sorting
            sortOrder = hasCompare ? function (a, b) {
            } : function (a, b) {
            };
            return document;
        };
        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };
        Sizzle.matchesSelector = function (elem, expr) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, '=\'$1\']');
            if (support.matchesSelector && documentIsHTML && !compilerCache[expr + ' '] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
                try {
                    var ret = matches.call(elem, expr);
                    // IE 9's matchesSelector returns false on disconnected nodes
                    if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                        elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) {
                }
            }
            return Sizzle(expr, document, null, [elem]).length > 0;
        };
        Sizzle.contains = function (context, elem) {
            // Set document vars if needed
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };
        Sizzle.attr = function (elem, name) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            var fn = Expr.attrHandle[name.toLowerCase()],
                // Don't get fooled by Object.prototype properties (jQuery #13807)
                val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
            return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        };
        Sizzle.error = function (msg) {
        };
        /**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
        Sizzle.uniqueSort = function (results) {
        };
        /**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
        getText = Sizzle.getText = function (elem) {
        };
        Expr = Sizzle.selectors = {
            // Can be adjusted by the user
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
                '>': {
                    dir: 'parentNode',
                    first: true
                },
                ' ': { dir: 'parentNode' },
                '+': {
                    dir: 'previousSibling',
                    first: true
                },
                '~': { dir: 'previousSibling' }
            },
            preFilter: {
                'ATTR': function (match) {
                    match[1] = match[1].replace(runescape, funescape);
                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[3] || match[4] || match[5] || '').replace(runescape, funescape);
                    if (match[2] === '~=') {
                        match[3] = ' ' + match[3] + ' ';
                    }
                    return match.slice(0, 4);
                },
                'CHILD': function (match) {
                },
                'PSEUDO': function (match) {
                }
            },
            filter: {
                'TAG': function (nodeNameSelector) {
                },
                'CLASS': function (className) {
                    var pattern = classCache[className + ' '];
                    return pattern || (pattern = new RegExp('(^|' + whitespace + ')' + className + '(' + whitespace + '|$)')) && classCache(className, function (elem) {
                        return pattern.test(typeof elem.className === 'string' && elem.className || typeof elem.getAttribute !== 'undefined' && elem.getAttribute('class') || '');
                    });
                },
                'ATTR': function (name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);
                        if (result == null) {
                            return operator === '!=';
                        }
                        if (!operator) {
                            return true;
                        }
                        result += '';
                        return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.slice(-check.length) === check : operator === '~=' ? (' ' + result.replace(rwhitespace, ' ') + ' ').indexOf(check) > -1 : operator === '|=' ? result === check || result.slice(0, check.length + 1) === check + '-' : false;
                    };
                },
                'CHILD': function (type, what, argument, first, last) {
                },
                'PSEUDO': function (pseudo, argument) {
                }
            },
            pseudos: {
                // Potentially complex pseudos
                'not': markFunction(function (selector) {
                }),
                'has': markFunction(function (selector) {
                }),
                'contains': markFunction(function (text) {
                }),
                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                'lang': markFunction(function (lang) {
                }),
                // Miscellaneous
                'target': function (elem) {
                },
                'root': function (elem) {
                },
                'focus': function (elem) {
                },
                // Boolean properties
                'enabled': function (elem) {
                },
                'disabled': function (elem) {
                },
                'checked': function (elem) {
                },
                'selected': function (elem) {
                },
                // Contents
                'empty': function (elem) {
                },
                'parent': function (elem) {
                },
                // Element/input types
                'header': function (elem) {
                },
                'input': function (elem) {
                },
                'button': function (elem) {
                },
                'text': function (elem) {
                },
                // Position-in-collection
                'first': createPositionalPseudo(function () {
                }),
                'last': createPositionalPseudo(function (matchIndexes, length) {
                }),
                'eq': createPositionalPseudo(function (matchIndexes, length, argument) {
                }),
                'even': createPositionalPseudo(function (matchIndexes, length) {
                }),
                'odd': createPositionalPseudo(function (matchIndexes, length) {
                }),
                'lt': createPositionalPseudo(function (matchIndexes, length, argument) {
                }),
                'gt': createPositionalPseudo(function (matchIndexes, length, argument) {
                })
            }
        };
        Expr.pseudos['nth'] = Expr.pseudos['eq'];
        // Add button/input type pseudos
        for (i in {
                radio: true,
                checkbox: true,
                file: true,
                password: true,
                image: true
            }) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in {
                submit: true,
                reset: true
            }) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }
        // Easy API for creating new setFilters
        function setFilters() {
        }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        tokenize = Sizzle.tokenize = function (selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + ' '];
            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
                // Comma and first run
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push(tokens = []);
                }
                matched = false;
                // Combinators
                if (match = rcombinators.exec(soFar)) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        // Cast descendant combinators to space
                        type: match[0].replace(rtrim, ' ')
                    });
                    soFar = soFar.slice(matched.length);
                }
                // Filters
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match
                        });
                        soFar = soFar.slice(matched.length);
                    }
                }
                if (!matched) {
                    break;
                }
            }
            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : // Cache the tokens
            tokenCache(selector, groups).slice(0);
        };
        function toSelector(tokens) {
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && dir === 'parentNode', doneName = done++;
            return combinator.first ? // Check against closest ancestor/preceding element
            function (elem, context, xml) {
                while (elem = elem[dir]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
            } : // Check against all ancestor/preceding elements
            function (elem, context, xml) {
            };
        }
        function elementMatcher(matchers) {
            return matchers.length > 1 ? function (elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
        }
        function condense(unmatched, map, filter, context, xml) {
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
        }
        function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[' '], i = leadingRelative ? 1 : 0,
                // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator(function (elem) {
                    return elem === checkContext;
                }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
                }, implicitRelative, true), matchers = [function (elem, context, xml) {
                        var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                        // Avoid hanging onto element (issue #299)
                        checkContext = null;
                        return ret;
                    }];
            for (; i < len; i++) {
                if (matcher = Expr.relative[tokens[i].type]) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                    // Return special upon seeing a positional matcher
                    if (matcher[expando]) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(// If the preceding token was a descendant combinator, insert an implicit any-element `*`
                        tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === ' ' ? '*' : '' })).replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                    }
                    matchers.push(matcher);
                }
            }
            return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function (seed, context, xml, results, outermost) {
                    var elem, j, matcher, matchedCount = 0, i = '0', unmatched = seed && [], setMatched = [], contextBackup = outermostContext,
                        // We must always have either seed elements or outermost context
                        elems = seed || byElement && Expr.find['TAG']('*', outermost),
                        // Use integer dirruns iff this is the outermost matcher
                        dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
                    if (outermost) {
                        outermostContext = context === document || context || outermost;
                    }
                    // Add elements passing elementMatchers directly to results
                    // Support: IE<9, Safari
                    // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                    for (; i !== len && (elem = elems[i]) != null; i++) {
                        if (byElement && elem) {
                            j = 0;
                            if (!context && elem.ownerDocument !== document) {
                                setDocument(elem);
                                xml = !documentIsHTML;
                            }
                            while (matcher = elementMatchers[j++]) {
                                if (matcher(elem, context || document, xml)) {
                                    results.push(elem);
                                    break;
                                }
                            }
                            if (outermost) {
                                dirruns = dirrunsUnique;
                            }
                        }
                        // Track unmatched elements for set filters
                        if (bySet) {
                            // They will have gone through all possible matchers
                            if (elem = !matcher && elem) {
                                matchedCount--;
                            }
                            // Lengthen the array for every element, matched or not
                            if (seed) {
                                unmatched.push(elem);
                            }
                        }
                    }
                    // `i` is now the count of elements visited above, and adding it to `matchedCount`
                    // makes the latter nonnegative.
                    matchedCount += i;
                    // Apply set filters to unmatched elements
                    // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
                    // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
                    // no element matchers and no seed.
                    // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
                    // case, which will result in a "00" `matchedCount` that differs from `i` but is also
                    // numerically zero.
                    if (bySet && i !== matchedCount) {
                        j = 0;
                        while (matcher = setMatchers[j++]) {
                            matcher(unmatched, setMatched, context, xml);
                        }
                        if (seed) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if (matchedCount > 0) {
                                while (i--) {
                                    if (!(unmatched[i] || setMatched[i])) {
                                        setMatched[i] = pop.call(results);
                                    }
                                }
                            }
                            // Discard index placeholder values to get only actual matches
                            setMatched = condense(setMatched);
                        }
                        // Add matches to results
                        push.apply(results, setMatched);
                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
                        if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                            Sizzle.uniqueSort(results);
                        }
                    }
                    // Override manipulation of globals by nested matchers
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }
                    return unmatched;
                };
            return bySet ? markFunction(superMatcher) : superMatcher;
        }
        compile = Sizzle.compile = function (selector, match) {
            var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + ' '];
            if (!cached) {
                // Generate a function of recursive functions that can be used to check each element
                if (!match) {
                    match = tokenize(selector);
                }
                i = match.length;
                while (i--) {
                    cached = matcherFromTokens(match[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }
                // Cache the compiled function
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
                // Save selector and tokenization
                cached.selector = selector;
            }
            return cached;
        };
        /**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
        select = Sizzle.select = function (selector, context, results, seed) {
            var i, tokens, token, type, find, compiled = typeof selector === 'function' && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            results = results || [];
            // Try to minimize operations if there is only one selector in the list and no seed
            // (the latter of which guarantees us context)
            if (match.length === 1) {
                // Reduce context if the leading compound selector is an ID
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                    context = (Expr.find['ID'](token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) {
                        return results;    // Precompiled matchers will still verify ancestry, so step up a level
                    } else if (compiled) {
                        context = context.parentNode;
                    }
                    selector = selector.slice(tokens.shift().value.length);
                }
                // Fetch a seed set for right-to-left matching
                i = matchExpr['needsContext'].test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];
                    // Abort if we hit a combinator
                    if (Expr.relative[type = token.type]) {
                        break;
                    }
                    if (find = Expr.find[type]) {
                        // Search, expanding context for leading sibling combinators
                        if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
                            // If seed is empty or no tokens remain, we can return early
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {
                                push.apply(results, seed);
                                return results;
                            }
                            break;
                        }
                    }
                }
            }
            // Compile and execute a filtering function if one is not provided
            // Provide `match` to avoid retokenization if we modified the selector above
            (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
            return results;
        };
        // One-time assignments
        // Sort stability
        support.sortStable = expando.split('').sort(sortOrder).join('') === expando;
        // Support: Chrome 14-35+
        // Always assume duplicates if they aren't passed to the comparison function
        support.detectDuplicates = !!hasDuplicate;
        // Initialize against the default document
        setDocument();
        // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
        // Detached nodes confoundingly follow *each other*
        support.sortDetached = assert(function (div1) {
            // Should return 1, but returns 4 (following)
            return div1.compareDocumentPosition(document.createElement('div')) & 1;
        });
        // Support: IE<8
        // Prevent attribute/property "interpolation"
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        if (!assert(function (div) {
                div.innerHTML = '<a href=\'#\'></a>';
                return div.firstChild.getAttribute('href') === '#';
            })) {
            addHandle('type|href|height|width', function (elem, name, isXML) {
            });
        }
        // Support: IE<9
        // Use defaultValue in place of getAttribute("value")
        if (!support.attributes || !assert(function (div) {
                div.innerHTML = '<input/>';
                div.firstChild.setAttribute('value', '');
                return div.firstChild.getAttribute('value') === '';
            })) {
            addHandle('value', function (elem, name, isXML) {
            });
        }
        // Support: IE<9
        // Use getAttributeNode to fetch booleans when getAttribute lies
        if (!assert(function (div) {
                return div.getAttribute('disabled') == null;
            })) {
            addHandle(booleans, function (elem, name, isXML) {
            });
        }
        return Sizzle;
    }(window);
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[':'] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    var dir = function (elem, dir, until) {
    };
    var siblings = function (n, elem) {
    };
    var rneedsContext = jQuery.expr.match.needsContext;
    var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
    var risSimple = /^.[^:#\[\.,]*$/;
    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
            });
        }
        if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem) {
                return elem === qualifier !== not;
            });
        }
        if (typeof qualifier === 'string') {
            if (risSimple.test(qualifier)) {
                return jQuery.filter(qualifier, elements, not);
            }
            qualifier = jQuery.filter(qualifier, elements);
        }
        return jQuery.grep(elements, function (elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
        });
    }
    jQuery.filter = function (expr, elems, not) {
        var elem = elems[0];
        if (not) {
            expr = ':not(' + expr + ')';
        }
        return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
            return elem.nodeType === 1;
        }));
    };
    jQuery.fn.extend({
        find: function (selector) {
            var i, len = this.length, ret = [], self = this;
            if (typeof selector !== 'string') {
                return this.pushStack(jQuery(selector).filter(function () {
                }));
            }
            for (i = 0; i < len; i++) {
                jQuery.find(selector, self[i], ret);
            }
            // Needed because $( selector, context ) becomes $( context ).find( selector )
            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + ' ' + selector : selector;
            return ret;
        },
        filter: function (selector) {
            return this.pushStack(winnow(this, selector || [], false));
        },
        not: function (selector) {
        },
        is: function (selector) {
            return !!winnow(this, // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === 'string' && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
        }
    });
    // Initialize a jQuery object
    // A central reference to the root jQuery(document)
    var rootjQuery,
        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        // Strict HTML recognition (#11290: must start with <)
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, init = jQuery.fn.init = function (selector, context, root) {
            var match, elem;
            // HANDLE: $(""), $(null), $(undefined), $(false)
            if (!selector) {
                return this;
            }
            // Method init() accepts an alternate rootjQuery
            // so migrate can support jQuery.sub (gh-2101)
            root = root || rootjQuery;
            // Handle HTML strings
            if (typeof selector === 'string') {
                if (selector[0] === '<' && selector[selector.length - 1] === '>' && selector.length >= 3) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [
                        null,
                        selector,
                        null
                    ];
                } else {
                    match = rquickExpr.exec(selector);
                }
                // Match html or make sure no context is specified for #id
                if (match && (match[1] || !context)) {
                    // HANDLE: $(html) -> $(array)
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;
                        // Option to run scripts is true for back-compat
                        // Intentionally let the error be thrown if parseHTML is not present
                        jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
                        // HANDLE: $(html, props)
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            for (match in context) {
                                // Properties of context are called as methods if possible
                                if (jQuery.isFunction(this[match])) {
                                    this[match](context[match]);    // ...and otherwise set as attributes
                                } else {
                                    this.attr(match, context[match]);
                                }
                            }
                        }
                        return this;    // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById(match[2]);
                        // Support: Blackberry 4.6
                        // gEBID returns nodes no longer in the document (#6963)
                        if (elem && elem.parentNode) {
                            // Inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }    // HANDLE: $(expr, $(...))
                } else if (!context || context.jquery) {
                    return (context || root).find(selector);    // HANDLE: $(expr, context)
                                                                // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor(context).find(selector);
                }    // HANDLE: $(DOMElement)
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;    // HANDLE: $(function)
                                // Shortcut for document ready
            } else if (jQuery.isFunction(selector)) {
                return root.ready !== undefined ? root.ready(selector) : // Execute immediately if ready is not present
                selector(jQuery);
            }
            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            return jQuery.makeArray(selector, this);
        };
    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;
    // Initialize central reference
    rootjQuery = jQuery(document);
    var rparentsprev = /^(?:parents|prev(?:Until|All))/,
        // Methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };
    jQuery.fn.extend({
        has: function (target) {
        },
        closest: function (selectors, context) {
        },
        // Determine the position of an element within the set
        index: function (elem) {
        },
        add: function (selector, context) {
        },
        addBack: function (selector) {
        }
    });
    function sibling(cur, dir) {
    }
    jQuery.each({
        parent: function (elem) {
        },
        parents: function (elem) {
        },
        parentsUntil: function (elem, i, until) {
        },
        next: function (elem) {
        },
        prev: function (elem) {
        },
        nextAll: function (elem) {
        },
        prevAll: function (elem) {
        },
        nextUntil: function (elem, i, until) {
        },
        prevUntil: function (elem, i, until) {
        },
        siblings: function (elem) {
        },
        children: function (elem) {
        },
        contents: function (elem) {
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
        };
    });
    var rnotwhite = /\S+/g;
    // Convert String-formatted options into Object-formatted ones
    function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
    }
    /*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
    jQuery.Callbacks = function (options) {
        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === 'string' ? createOptions(options) : jQuery.extend({}, options);
        var
            // Flag to know if list is currently firing
            firing,
            // Last fire value for non-forgettable lists
            memory,
            // Flag to know if list was already fired
            fired,
            // Flag to prevent firing
            locked,
            // Actual callback list
            list = [],
            // Queue of execution data for repeatable lists
            queue = [],
            // Index of currently firing callback (modified by add/remove as needed)
            firingIndex = -1,
            // Fire callbacks
            fire = function () {
                // Enforce single-firing
                locked = options.once;
                // Execute callbacks for all pending executions,
                // respecting firingIndex overrides and runtime changes
                fired = firing = true;
                for (; queue.length; firingIndex = -1) {
                    memory = queue.shift();
                    while (++firingIndex < list.length) {
                        // Run callback and check for early termination
                        if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                            // Jump to end and forget the data so .add doesn't re-fire
                            firingIndex = list.length;
                            memory = false;
                        }
                    }
                }
                // Forget the data if we're done with it
                if (!options.memory) {
                    memory = false;
                }
                firing = false;
                // Clean up if we're done firing for good
                if (locked) {
                    // Keep an empty list if we have data for future add calls
                    if (memory) {
                        list = [];    // Otherwise, this object is spent
                    } else {
                        list = '';
                    }
                }
            },
            // Actual Callbacks object
            self = {
                // Add a callback or a collection of callbacks to the list
                add: function () {
                    if (list) {
                        // If we have memory from a past run, we should fire after adding
                        if (memory && !firing) {
                            firingIndex = list.length - 1;
                            queue.push(memory);
                        }
                        (function add(args) {
                            jQuery.each(args, function (_, arg) {
                                if (jQuery.isFunction(arg)) {
                                    if (!options.unique || !self.has(arg)) {
                                        list.push(arg);
                                    }
                                } else if (arg && arg.length && jQuery.type(arg) !== 'string') {
                                    // Inspect recursively
                                    add(arg);
                                }
                            });
                        }(arguments));
                        if (memory && !firing) {
                            fire();
                        }
                    }
                    return this;
                },
                // Remove a callback from the list
                remove: function () {
                },
                // Check if a given callback is in the list.
                // If no argument is given, return whether or not list has callbacks attached.
                has: function (fn) {
                },
                // Remove all callbacks from the list
                empty: function () {
                },
                // Disable .fire and .add
                // Abort any current/pending executions
                // Clear all callbacks and values
                disable: function () {
                    locked = queue = [];
                    list = memory = '';
                    return this;
                },
                disabled: function () {
                },
                // Disable .fire
                // Also disable .add unless we have memory (since it would have no effect)
                // Abort any pending executions
                lock: function () {
                    locked = queue = [];
                    if (!memory) {
                        list = memory = '';
                    }
                    return this;
                },
                locked: function () {
                },
                // Call all callbacks with the given context and arguments
                fireWith: function (context, args) {
                    if (!locked) {
                        args = args || [];
                        args = [
                            context,
                            args.slice ? args.slice() : args
                        ];
                        queue.push(args);
                        if (!firing) {
                            fire();
                        }
                    }
                    return this;
                },
                // Call all the callbacks with the given arguments
                fire: function () {
                },
                // To know if the callbacks have already been called at least once
                fired: function () {
                }
            };
        return self;
    };
    jQuery.extend({
        Deferred: function (func) {
            var tuples = [
                    // action, add listener, listener list, final state
                    [
                        'resolve',
                        'done',
                        jQuery.Callbacks('once memory'),
                        'resolved'
                    ],
                    [
                        'reject',
                        'fail',
                        jQuery.Callbacks('once memory'),
                        'rejected'
                    ],
                    [
                        'notify',
                        'progress',
                        jQuery.Callbacks('memory')
                    ]
                ], state = 'pending', promise = {
                    state: function () {
                    },
                    always: function () {
                    },
                    then: function () {
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                }, deferred = {};
            // Keep pipe for back-compat
            promise.pipe = promise.then;
            // Add list-specific methods
            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                // promise[ done | fail | progress ] = list.add
                promise[tuple[1]] = list.add;
                // Handle state
                if (stateString) {
                    list.add(function () {
                        // state = [ resolved | rejected ]
                        state = stateString;    // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }
                // deferred[ resolve | reject | notify ]
                deferred[tuple[0]] = function () {
                };
                deferred[tuple[0] + 'With'] = list.fireWith;
            });
            // Make the deferred a promise
            promise.promise(deferred);
            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }
            // All done!
            return deferred;
        },
        // Deferred helper
        when: function (subordinate) {
        }
    });
    // The deferred used on DOM ready
    var readyList;
    jQuery.fn.ready = function (fn) {
        // Add the callback
        jQuery.ready.promise().done(fn);
        return this;
    };
    jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Hold (or release) the ready event
        holdReady: function (hold) {
        },
        // Handle when the DOM is ready
        ready: function (wait) {
            // Abort if there are pending holds or we're already ready
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }
            // Remember that the DOM is ready
            jQuery.isReady = true;
            // If a normal DOM Ready event fired, decrement, and wait if need be
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }
            // If there are functions bound, to execute
            readyList.resolveWith(document, [jQuery]);
            // Trigger any bound ready events
            if (jQuery.fn.triggerHandler) {
                jQuery(document).triggerHandler('ready');
                jQuery(document).off('ready');
            }
        }
    });
    /**
 * The ready event handler and self cleanup method
 */
    function completed() {
        document.removeEventListener('DOMContentLoaded', completed);
        window.removeEventListener('load', completed);
        jQuery.ready();
    }
    jQuery.ready.promise = function (obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();
            // Catch cases where $(document).ready() is called
            // after the browser event has already occurred.
            // Support: IE9-10 only
            // Older IE sometimes signals "interactive" too soon
            if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                window.setTimeout(jQuery.ready);
            } else {
                // Use the handy event callback
                document.addEventListener('DOMContentLoaded', completed);
                // A fallback to window.onload, that will always work
                window.addEventListener('load', completed);
            }
        }
        return readyList.promise(obj);
    };
    // Kick off the DOM ready check even if the user does not
    jQuery.ready.promise();
    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = key == null;
        // Sets many values
        if (jQuery.type(key) === 'object') {
            chainable = true;
            for (i in key) {
                access(elems, fn, i, key[i], true, emptyGet, raw);
            }    // Sets one value
        } else if (value !== undefined) {
            chainable = true;
            if (!jQuery.isFunction(value)) {
                raw = true;
            }
            if (bulk) {
                // Bulk operations run against the entire set
                if (raw) {
                    fn.call(elems, value);
                    fn = null;    // ...except when executing function values
                } else {
                    bulk = fn;
                    fn = function (elem, key, value) {
                    };
                }
            }
            if (fn) {
                for (; i < len; i++) {
                    fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                }
            }
        }
        return chainable ? elems : // Gets
        bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet;
    };
    var acceptData = function (owner) {
        // Accepts only:
        //  - Node
        //    - Node.ELEMENT_NODE
        //    - Node.DOCUMENT_NODE
        //  - Object
        //    - Any
        /* jshint -W018 */
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
    };
    function Data() {
        this.expando = jQuery.expando + Data.uid++;
    }
    Data.uid = 1;
    Data.prototype = {
        register: function (owner, initial) {
        },
        cache: function (owner) {
            // We can accept data for non-element nodes in modern browsers,
            // but we should not, see #8335.
            // Always return an empty object.
            if (!acceptData(owner)) {
                return {};
            }
            // Check if the owner object already has a cache
            var value = owner[this.expando];
            // If not, create one
            if (!value) {
                value = {};
                // We can accept data for non-element nodes in modern browsers,
                // but we should not, see #8335.
                // Always return an empty object.
                if (acceptData(owner)) {
                    // If it is a node unlikely to be stringify-ed or looped over
                    // use plain assignment
                    if (owner.nodeType) {
                        owner[this.expando] = value;    // Otherwise secure it in a non-enumerable property
                                                        // configurable must be true to allow the property to be
                                                        // deleted when data is removed
                    } else {
                        Object.defineProperty(owner, this.expando, {
                            value: value,
                            configurable: true
                        });
                    }
                }
            }
            return value;
        },
        set: function (owner, data, value) {
            var prop, cache = this.cache(owner);
            // Handle: [ owner, key, value ] args
            if (typeof data === 'string') {
                cache[data] = value;    // Handle: [ owner, { properties } ] args
            } else {
                // Copy the properties one-by-one to the cache object
                for (prop in data) {
                    cache[prop] = data[prop];
                }
            }
            return cache;
        },
        get: function (owner, key) {
            return key === undefined ? this.cache(owner) : owner[this.expando] && owner[this.expando][key];
        },
        access: function (owner, key, value) {
        },
        remove: function (owner, key) {
            var i, name, camel, cache = owner[this.expando];
            if (cache === undefined) {
                return;
            }
            if (key === undefined) {
                this.register(owner);
            } else {
                // Support array or space separated string of keys
                if (jQuery.isArray(key)) {
                    // If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name = key.concat(key.map(jQuery.camelCase));
                } else {
                    camel = jQuery.camelCase(key);
                    // Try the string as a key before any manipulation
                    if (key in cache) {
                        name = [
                            key,
                            camel
                        ];
                    } else {
                        // If a key with the spaces exists, use it.
                        // Otherwise, create an array by matching non-whitespace
                        name = camel;
                        name = name in cache ? [name] : name.match(rnotwhite) || [];
                    }
                }
                i = name.length;
                while (i--) {
                    delete cache[name[i]];
                }
            }
            // Remove the expando if there's no more data
            if (key === undefined || jQuery.isEmptyObject(cache)) {
                // Support: Chrome <= 35-45+
                // Webkit & Blink performance suffers when deleting properties
                // from DOM nodes, so set to undefined instead
                // https://code.google.com/p/chromium/issues/detail?id=378607
                if (owner.nodeType) {
                    owner[this.expando] = undefined;
                } else {
                    delete owner[this.expando];
                }
            }
        },
        hasData: function (owner) {
            var cache = owner[this.expando];
            return cache !== undefined && !jQuery.isEmptyObject(cache);
        }
    };
    var dataPriv = new Data();
    var dataUser = new Data();
    //	Implementation Summary
    //
    //	1. Enforce API surface and semantic compatibility with 1.9.x branch
    //	2. Improve the module's maintainability by reducing the storage
    //		paths to a single mechanism.
    //	3. Use the same single mechanism to support "private" and "user" data.
    //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    //	5. Avoid exposing implementation details on user objects (eg. expando properties)
    //	6. Provide a clear path for implementation upgrade to WeakMap in 2014
    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
    function dataAttr(elem, key, data) {
        var name;
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {
            name = 'data-' + key.replace(rmultiDash, '-$&').toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === 'string') {
                try {
                    data = data === 'true' ? true : data === 'false' ? false : data === 'null' ? null : // Only convert to a number if it doesn't change the string
                    +data + '' === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                } catch (e) {
                }
                // Make sure we set the data so it isn't changed later
                dataUser.set(elem, key, data);
            } else {
                data = undefined;
            }
        }
        return data;
    }
    jQuery.extend({
        hasData: function (elem) {
        },
        data: function (elem, name, data) {
        },
        removeData: function (elem, name) {
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function (elem, name, data) {
        },
        _removeData: function (elem, name) {
        }
    });
    jQuery.fn.extend({
        data: function (key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            // Gets all values
            if (key === undefined) {
                if (this.length) {
                    data = dataUser.get(elem);
                    if (elem.nodeType === 1 && !dataPriv.get(elem, 'hasDataAttrs')) {
                        i = attrs.length;
                        while (i--) {
                            // Support: IE11+
                            // The attrs elements can be null (#14894)
                            if (attrs[i]) {
                                name = attrs[i].name;
                                if (name.indexOf('data-') === 0) {
                                    name = jQuery.camelCase(name.slice(5));
                                    dataAttr(elem, name, data[name]);
                                }
                            }
                        }
                        dataPriv.set(elem, 'hasDataAttrs', true);
                    }
                }
                return data;
            }
            // Sets multiple values
            if (typeof key === 'object') {
                return this.each(function () {
                });
            }
            return access(this, function (value) {
                var data, camelKey;
                // The calling jQuery object (element matches) is not empty
                // (and therefore has an element appears at this[ 0 ]) and the
                // `value` parameter was not undefined. An empty jQuery object
                // will result in `undefined` for elem = this[ 0 ] which will
                // throw an exception if an attempt to read a data cache is made.
                if (elem && value === undefined) {
                    // Attempt to get data from the cache
                    // with the key as-is
                    data = dataUser.get(elem, key) || // Try to find dashed key if it exists (gh-2779)
                    // This is for 2.2.x only
                    dataUser.get(elem, key.replace(rmultiDash, '-$&').toLowerCase());
                    if (data !== undefined) {
                        return data;
                    }
                    camelKey = jQuery.camelCase(key);
                    // Attempt to get data from the cache
                    // with the key camelized
                    data = dataUser.get(elem, camelKey);
                    if (data !== undefined) {
                        return data;
                    }
                    // Attempt to "discover" the data in
                    // HTML5 custom data-* attrs
                    data = dataAttr(elem, camelKey, undefined);
                    if (data !== undefined) {
                        return data;
                    }
                    // We tried really hard, but the data doesn't exist.
                    return;
                }
                // Set the data...
                camelKey = jQuery.camelCase(key);
                this.each(function () {
                    // First, attempt to store a copy or reference of any
                    // data that might've been store with a camelCased key.
                    var data = dataUser.get(this, camelKey);
                    // For HTML5 data-* attribute interop, we have to
                    // store property names with dashes in a camelCase form.
                    // This might not apply to all properties...*
                    dataUser.set(this, camelKey, value);
                    // *... In the case of properties that might _actually_
                    // have dashes, we need to also store a copy of that
                    // unchanged property.
                    if (key.indexOf('-') > -1 && data !== undefined) {
                        dataUser.set(this, key, value);
                    }
                });
            }, null, value, arguments.length > 1, null, true);
        },
        removeData: function (key) {
        }
    });
    jQuery.extend({
        queue: function (elem, type, data) {
        },
        dequeue: function (elem, type) {
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function (elem, type) {
        }
    });
    jQuery.fn.extend({
        queue: function (type, data) {
        },
        dequeue: function (type) {
        },
        clearQueue: function (type) {
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function (type, obj) {
        }
    });
    var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
    var rcssNum = new RegExp('^(?:([+-])=|)(' + pnum + ')([a-z%]*)$', 'i');
    var cssExpand = [
        'Top',
        'Right',
        'Bottom',
        'Left'
    ];
    var isHidden = function (elem, el) {
    };
    function adjustCSS(elem, prop, valueParts, tween) {
    }
    var rcheckableType = /^(?:checkbox|radio)$/i;
    var rtagName = /<([\w:-]+)/;
    var rscriptType = /^$|\/(?:java|ecma)script/i;
    // We have to close these tags to support XHTML (#13200)
    var wrapMap = {
        // Support: IE9
        option: [
            1,
            '<select multiple=\'multiple\'>',
            '</select>'
        ],
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [
            1,
            '<table>',
            '</table>'
        ],
        col: [
            2,
            '<table><colgroup>',
            '</colgroup></table>'
        ],
        tr: [
            2,
            '<table><tbody>',
            '</tbody></table>'
        ],
        td: [
            3,
            '<table><tbody><tr>',
            '</tr></tbody></table>'
        ],
        _default: [
            0,
            '',
            ''
        ]
    };
    // Support: IE9
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    function getAll(context, tag) {
    }
    // Mark scripts as having already been evaluated
    function setGlobalEval(elems, refElements) {
    }
    var rhtml = /<|&#?\w+;/;
    function buildFragment(elems, context, scripts, selection, ignored) {
    }
    (function () {
        var fragment = document.createDocumentFragment(), div = fragment.appendChild(document.createElement('div')), input = document.createElement('input');
        // Support: Android 4.0-4.3, Safari<=5.1
        // Check state lost if the name is set (#11217)
        // Support: Windows Web Apps (WWA)
        // `name` and `type` must use .setAttribute for WWA (#14901)
        input.setAttribute('type', 'radio');
        input.setAttribute('checked', 'checked');
        input.setAttribute('name', 't');
        div.appendChild(input);
        // Support: Safari<=5.1, Android<4.2
        // Older WebKit doesn't clone checked state correctly in fragments
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        // Support: IE<=11+
        // Make sure textarea (and checkbox) defaultValue is properly cloned
        div.innerHTML = '<textarea>x</textarea>';
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
    }());
    var rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
    function returnTrue() {
    }
    function returnFalse() {
        return false;
    }
    // Support: IE9
    // See #13393 for more info
    function safeActiveElement() {
    }
    function on(elem, types, selector, data, fn, one) {
        var origFn, type;
        // Types can be a map of types/handlers
        if (typeof types === 'object') {
            // ( types-Object, selector, data )
            if (typeof selector !== 'string') {
                // ( types-Object, data )
                data = data || selector;
                selector = undefined;
            }
            for (type in types) {
                on(elem, type, selector, data, types[type], one);
            }
            return elem;
        }
        if (data == null && fn == null) {
            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if (fn == null) {
            if (typeof selector === 'string') {
                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {
                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if (fn === false) {
            fn = returnFalse;
        } else if (!fn) {
            return elem;
        }
        if (one === 1) {
            origFn = fn;
            fn = function (event) {
                // Can use an empty set, since event contains the info
                jQuery().off(event);
                return origFn.apply(this, arguments);
            };
            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function () {
            jQuery.event.add(this, types, fn, data, selector);
        });
    }
    /*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
    jQuery.event = {
        global: {},
        add: function (elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if (!elemData) {
                return;
            }
            // Caller can pass in an object of custom data in lieu of the handler
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }
            // Make sure that the handler has a unique ID, used to find/remove it later
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }
            // Init the element's event structure and main handler, if this is the first
            if (!(events = elemData.events)) {
                events = elemData.events = {};
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== 'undefined' && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
                };
            }
            // Handle multiple events separated by a space
            types = (types || '').match(rnotwhite) || [''];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || '').split('.').sort();
                // There *must* be a type, no attaching namespace-only handlers
                if (!type) {
                    continue;
                }
                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[type] || {};
                // If selector defined, determine special event api type, otherwise given type
                type = (selector ? special.delegateType : special.bindType) || type;
                // Update special based on newly reset type
                special = jQuery.event.special[type] || {};
                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join('.')
                }, handleObjIn);
                // Init the event handler queue if we're the first
                if (!(handlers = events[type])) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;
                    // Only use addEventListener if the special events handler returns false
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle);
                        }
                    }
                }
                if (special.add) {
                    special.add.call(elem, handleObj);
                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }
                // Add to the element's handler list, delegates in front
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }
                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[type] = true;
            }
        },
        // Detach an event or set of events from an element
        remove: function (elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (!elemData || !(events = elemData.events)) {
                return;
            }
            // Once for each type.namespace in types; type may be omitted
            types = (types || '').match(rnotwhite) || [''];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || '').split('.').sort();
                // Unbind all events (on this namespace, if provided) for the element
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                handlers = events[type] || [];
                tmp = tmp[2] && new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)');
                // Remove matching events
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];
                    if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === '**' && handleObj.selector)) {
                        handlers.splice(j, 1);
                        if (handleObj.selector) {
                            handlers.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }
                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if (origCount && !handlers.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }
                    delete events[type];
                }
            }
            // Remove data and the expando if it's no longer used
            if (jQuery.isEmptyObject(events)) {
                dataPriv.remove(elem, 'handle events');
            }
        },
        dispatch: function (event) {
            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix(event);
            var i, j, ret, matched, handleObj, handlerQueue = [], args = slice.call(arguments), handlers = (dataPriv.get(this, 'events') || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;
            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }
            // Determine handlers
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem;
                j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                    // Triggered event must either 1) have no namespace, or 2) have namespace(s)
                    // a subset or equal to those in the bound event (both can have no namespace).
                    if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {
                        event.handleObj = handleObj;
                        event.data = handleObj.data;
                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                        if (ret !== undefined) {
                            if ((event.result = ret) === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
            // Call the postDispatch hook for the mapped type
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }
            return event.result;
        },
        handlers: function (event, handlers) {
            var i, matches, sel, handleObj, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            // Support (at least): Chrome, IE9
            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            //
            // Support: Firefox<=42+
            // Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
            if (delegateCount && cur.nodeType && (event.type !== 'click' || isNaN(event.button) || event.button < 1)) {
                for (; cur !== this; cur = cur.parentNode || this) {
                    // Don't check non-elements (#13208)
                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== 'click')) {
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];
                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + ' ';
                            if (matches[sel] === undefined) {
                                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (matches[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({
                                elem: cur,
                                handlers: matches
                            });
                        }
                    }
                }
            }
            // Add the remaining (directly-bound) handlers
            if (delegateCount < handlers.length) {
                handlerQueue.push({
                    elem: this,
                    handlers: handlers.slice(delegateCount)
                });
            }
            return handlerQueue;
        },
        // Includes some event props shared by KeyEvent and MouseEvent
        props: ('altKey bubbles cancelable ctrlKey currentTarget detail eventPhase ' + 'metaKey relatedTarget shiftKey target timeStamp view which').split(' '),
        fixHooks: {},
        keyHooks: {
            props: 'char charCode key keyCode'.split(' '),
            filter: function (event, original) {
            }
        },
        mouseHooks: {
            props: ('button buttons clientX clientY offsetX offsetY pageX pageY ' + 'screenX screenY toElement').split(' '),
            filter: function (event, original) {
                var eventDoc, doc, body, button = original.button;
                // Calculate pageX/Y if missing and clientX/Y available
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;
                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }
                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if (!event.which && button !== undefined) {
                    event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
                }
                return event;
            }
        },
        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }
            // Create a writable copy of the event object and normalize some properties
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            if (!fixHook) {
                this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
            event = new jQuery.Event(originalEvent);
            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }
            // Support: Cordova 2.5 (WebKit) (#13255)
            // All events should have a target; Cordova deviceready doesn't
            if (!event.target) {
                event.target = document;
            }
            // Support: Safari 6.0+, Chrome<28
            // Target should not be a text node (#504, #13143)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function () {
                },
                delegateType: 'focusin'
            },
            blur: {
                trigger: function () {
                },
                delegateType: 'focusout'
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function () {
                },
                // For cross-browser consistency, don't fire native .click() on links
                _default: function (event) {
                }
            },
            beforeunload: {
                postDispatch: function (event) {
                }
            }
        }
    };
    jQuery.removeEvent = function (elem, type, handle) {
        // This "if" is needed for plain objects
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle);
        }
    };
    jQuery.Event = function (src, props) {
        // Allow instantiation without the 'new' keyword
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }
        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && // Support: Android<4.0
            src.returnValue === false ? returnTrue : returnFalse;    // Event type
        } else {
            this.type = src;
        }
        // Put explicitly provided properties onto the event object
        if (props) {
            jQuery.extend(this, props);
        }
        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();
        // Mark it as fixed
        this[jQuery.expando] = true;
    };
    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && !this.isSimulated) {
                e.preventDefault();
            }
        },
        stopPropagation: function () {
        },
        stopImmediatePropagation: function () {
        }
    };
    // Create mouseenter/leave events using mouseover/out and event-time checks
    // so that event delegation works in jQuery.
    // Do the same for pointerenter/pointerleave and pointerover/pointerout
    //
    // Support: Safari 7 only
    // Safari sends mouseenter too often; see:
    // https://code.google.com/p/chromium/issues/detail?id=470258
    // for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each({
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
        pointerenter: 'pointerover',
        pointerleave: 'pointerout'
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function (event) {
            }
        };
    });
    jQuery.fn.extend({
        on: function (types, selector, data, fn) {
            return on(this, types, selector, data, fn);
        },
        one: function (types, selector, data, fn) {
            return on(this, types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + '.' + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
                return this;
            }
            if (typeof types === 'object') {
                // ( types-object [, selector] )
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === 'function') {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        }
    });
    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
        // Support: IE 10-11, Edge 10240+
        // In IE/Edge using regex groups here causes severe slowdowns.
        // See https://connect.microsoft.com/IE/feedback/details/1736512/
        rnoInnerhtml = /<script|<style|<link/i,
        // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    // Manipulating tables requires a tbody
    function manipulationTarget(elem, content) {
    }
    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript(elem) {
    }
    function restoreScript(elem) {
    }
    function cloneCopyEvent(src, dest) {
    }
    // Fix IE bugs, see support tests
    function fixInput(src, dest) {
    }
    function domManip(collection, args, callback, ignored) {
    }
    function remove(elem, selector, keepData) {
    }
    jQuery.extend({
        htmlPrefilter: function (html) {
        },
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
        },
        cleanData: function (elems) {
        }
    });
    jQuery.fn.extend({
        // Keep domManip exposed until 3.0 (gh-2225)
        domManip: domManip,
        detach: function (selector) {
        },
        remove: function (selector) {
        },
        text: function (value) {
        },
        append: function () {
        },
        prepend: function () {
        },
        before: function () {
        },
        after: function () {
        },
        empty: function () {
        },
        clone: function (dataAndEvents, deepDataAndEvents) {
        },
        html: function (value) {
        },
        replaceWith: function () {
        }
    });
    jQuery.each({
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after',
        replaceAll: 'replaceWith'
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
        };
    });
    var iframe, elemdisplay = {
            // Support: Firefox
            // We have to pre-define these values for FF (#10227)
            HTML: 'block',
            BODY: 'block'
        };
    /**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
    // Called only from within defaultDisplay
    function actualDisplay(name, doc) {
    }
    /**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
    function defaultDisplay(nodeName) {
    }
    var rmargin = /^margin/;
    var rnumnonpx = new RegExp('^(' + pnum + ')(?!px)[a-z%]+$', 'i');
    var getStyles = function (elem) {
        // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
            view = window;
        }
        return view.getComputedStyle(elem);
    };
    var swap = function (elem, options, callback, args) {
    };
    var documentElement = document.documentElement;
    (function () {
        var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal, container = document.createElement('div'), div = document.createElement('div');
        // Finish early in limited (non-browser) environments
        if (!div.style) {
            return;
        }
        // Support: IE9-11+
        // Style of cloned element affects source element cloned (#8908)
        div.style.backgroundClip = 'content-box';
        div.cloneNode(true).style.backgroundClip = '';
        support.clearCloneStyle = div.style.backgroundClip === 'content-box';
        container.style.cssText = 'border:0;width:8px;height:0;top:0;left:-9999px;' + 'padding:0;margin-top:1px;position:absolute';
        container.appendChild(div);
        // Executing both pixelPosition & boxSizingReliable tests require only one layout
        // so they're executed at the same time to save the second computation.
        function computeStyleTests() {
            div.style.cssText = // Support: Firefox<29, Android 2.3
            // Vendor-prefix box-sizing
            '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;' + 'position:relative;display:block;' + 'margin:auto;border:1px;padding:1px;' + 'top:1%;width:50%';
            div.innerHTML = '';
            documentElement.appendChild(container);
            var divStyle = window.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== '1%';
            reliableMarginLeftVal = divStyle.marginLeft === '2px';
            boxSizingReliableVal = divStyle.width === '4px';
            // Support: Android 4.0 - 4.3 only
            // Some styles come back with percentage values, even though they shouldn't
            div.style.marginRight = '50%';
            pixelMarginRightVal = divStyle.marginRight === '4px';
            documentElement.removeChild(container);
        }
        jQuery.extend(support, {
            pixelPosition: function () {
            },
            boxSizingReliable: function () {
            },
            pixelMarginRight: function () {
                // Support: Android 4.0-4.3
                // We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
                // since that compresses better and they're computed together anyway.
                if (boxSizingReliableVal == null) {
                    computeStyleTests();
                }
                return pixelMarginRightVal;
            },
            reliableMarginLeft: function () {
            },
            reliableMarginRight: function () {
            }
        });
    }());
    function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, style = elem.style;
        computed = computed || getStyles(elem);
        ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;
        // Support: Opera 12.1x only
        // Fall back to style even without computed
        // computed is undefined for elems on document fragments
        if ((ret === '' || ret === undefined) && !jQuery.contains(elem.ownerDocument, elem)) {
            ret = jQuery.style(elem, name);
        }
        // Support: IE9
        // getPropertyValue is only needed for .css('filter') (#12537)
        if (computed) {
            // A tribute to the "awesome hack by Dean Edwards"
            // Android Browser returns percentage for some values,
            // but width seems to be reliably pixels.
            // This is against the CSSOM draft spec:
            // http://dev.w3.org/csswg/cssom/#resolved-values
            if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {
                // Remember the original values
                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;
                // Put in the new values to get a computed value out
                style.minWidth = style.maxWidth = style.width = ret;
                ret = computed.width;
                // Revert the changed values
                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }
        return ret !== undefined ? // Support: IE9-11+
        // IE returns zIndex value as an integer.
        ret + '' : ret;
    }
    function addGetHookIf(conditionFn, hookFn) {
        // Define the hook, we'll check on the first run if it's really needed.
        return {
            get: function () {
            }
        };
    }
    var
        // Swappable if display is none or starts with table
        // except "table", "table-cell", or "table-caption"
        // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = {
            position: 'absolute',
            visibility: 'hidden',
            display: 'block'
        }, cssNormalTransform = {
            letterSpacing: '0',
            fontWeight: '400'
        }, cssPrefixes = [
            'Webkit',
            'O',
            'Moz',
            'ms'
        ], emptyStyle = document.createElement('div').style;
    // Return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(name) {
        // Shortcut for names that are not vendor prefixed
        if (name in emptyStyle) {
            return name;
        }
        // Check for vendor prefixed names
        var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in emptyStyle) {
                return name;
            }
        }
    }
    function setPositiveNumber(elem, value, subtract) {
        // Any relative (+/-) values have already been
        // normalized at this point
        var matches = rcssNum.exec(value);
        return matches ? // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || 'px') : value;
    }
    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? 'border' : 'content') ? // If we already have the right measurement, avoid augmentation
            4 : // Otherwise initialize for horizontal or vertical properties
            name === 'width' ? 1 : 0, val = 0;
        for (; i < 4; i += 2) {
            // Both box models exclude margin, so add it if we want it
            if (extra === 'margin') {
                val += jQuery.css(elem, extra + cssExpand[i], true, styles);
            }
            if (isBorderBox) {
                // border-box includes padding, so remove it if we want content
                if (extra === 'content') {
                    val -= jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
                }
                // At this point, extra isn't border nor margin, so remove border
                if (extra !== 'margin') {
                    val -= jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
                }
            } else {
                // At this point, extra isn't content, so add padding
                val += jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
                // At this point, extra isn't content nor padding, so add border
                if (extra !== 'padding') {
                    val += jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
                }
            }
        }
        return val;
    }
    function getWidthOrHeight(elem, name, extra) {
        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true, val = name === 'width' ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = jQuery.css(elem, 'boxSizing', false, styles) === 'border-box';
        // Some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if (val <= 0 || val == null) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }
            // Computed unit is not pixels. Stop here and return.
            if (rnumnonpx.test(val)) {
                return val;
            }
            // Check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
            // Normalize "", auto, and prepare for extra
            val = parseFloat(val) || 0;
        }
        // Use the active box-sizing model to add/subtract irrelevant styles
        return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? 'border' : 'content'), valueIsBorderBox, styles) + 'px';
    }
    function showHide(elements, show) {
    }
    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, 'opacity');
                        return ret === '' ? '1' : ret;
                    }
                }
            }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            'animationIterationCount': true,
            'columnCount': true,
            'fillOpacity': true,
            'flexGrow': true,
            'flexShrink': true,
            'fontWeight': true,
            'lineHeight': true,
            'opacity': true,
            'order': true,
            'orphans': true,
            'widows': true,
            'zIndex': true,
            'zoom': true
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: { 'float': 'cssFloat' },
        // Get and set the style property on a DOM Node
        style: function (elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }
            // Make sure that we're working with the right name
            var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);
            // Gets hook for the prefixed version, then unprefixed version
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            // Check if we're setting a value
            if (value !== undefined) {
                type = typeof value;
                // Convert "+=" or "-=" to relative numbers (#7345)
                if (type === 'string' && (ret = rcssNum.exec(value)) && ret[1]) {
                    value = adjustCSS(elem, name, ret);
                    // Fixes bug #9237
                    type = 'number';
                }
                // Make sure that null and NaN values aren't set (#7116)
                if (value == null || value !== value) {
                    return;
                }
                // If a number was passed in, add the unit (except for certain CSS properties)
                if (type === 'number') {
                    value += ret && ret[3] || (jQuery.cssNumber[origName] ? '' : 'px');
                }
                // Support: IE9-11+
                // background-* props affect original clone's values
                if (!support.clearCloneStyle && value === '' && name.indexOf('background') === 0) {
                    style[name] = 'inherit';
                }
                // If a hook was provided, use that value, otherwise just set the specified value
                if (!hooks || !('set' in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    style[name] = value;
                }
            } else {
                // If a hook was provided get the non-computed value from there
                if (hooks && 'get' in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }
                // Otherwise just get the value from the style object
                return style[name];
            }
        },
        css: function (elem, name, extra, styles) {
            var val, num, hooks, origName = jQuery.camelCase(name);
            // Make sure that we're working with the right name
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);
            // Try prefixed name followed by the unprefixed name
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            // If a hook was provided get the computed value from there
            if (hooks && 'get' in hooks) {
                val = hooks.get(elem, true, extra);
            }
            // Otherwise, if a way to get the computed value exists, use that
            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }
            // Convert "normal" to computed value
            if (val === 'normal' && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }
            // Make numeric if forced or a qualifier was provided and val looks numeric
            if (extra === '' || extra) {
                num = parseFloat(val);
                return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
        }
    });
    jQuery.each([
        'height',
        'width'
    ], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                if (computed) {
                    // Certain elements can have dimension info if we invisibly show them
                    // but it must have a current display style that would benefit
                    return rdisplayswap.test(jQuery.css(elem, 'display')) && elem.offsetWidth === 0 ? swap(elem, cssShow, function () {
                    }) : getWidthOrHeight(elem, name, extra);
                }
            },
            set: function (elem, value, extra) {
                var matches, styles = extra && getStyles(elem), subtract = extra && augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, 'boxSizing', false, styles) === 'border-box', styles);
                // Convert to pixels if value adjustment is needed
                if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || 'px') !== 'px') {
                    elem.style[name] = value;
                    value = jQuery.css(elem, name);
                }
                return setPositiveNumber(elem, value, subtract);
            }
        };
    });
    jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
    });
    // Support: Android 2.3
    jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function (elem, computed) {
    });
    // These hooks are used by animate to expand properties
    jQuery.each({
        margin: '',
        padding: '',
        border: 'Width'
    }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
            }
        };
        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });
    jQuery.fn.extend({
        css: function (name, value) {
            return access(this, function (elem, name, value) {
                var styles, len, map = {}, i = 0;
                if (jQuery.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;
                    for (; i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }
                    return map;
                }
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function () {
        },
        hide: function () {
        },
        toggle: function (state) {
        }
    });
    function Tween(elem, options, prop, end, easing) {
    }
    jQuery.Tween = Tween;
    Tween.prototype = {
        constructor: Tween,
        init: function (elem, options, prop, end, easing, unit) {
        },
        cur: function () {
        },
        run: function (percent) {
        }
    };
    Tween.prototype.init.prototype = Tween.prototype;
    Tween.propHooks = {
        _default: {
            get: function (tween) {
            },
            set: function (tween) {
            }
        }
    };
    // Support: IE9
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (tween) {
        }
    };
    jQuery.easing = {
        linear: function (p) {
        },
        swing: function (p) {
        },
        _default: 'swing'
    };
    jQuery.fx = Tween.prototype.init;
    // Back Compat <1.8 extension point
    jQuery.fx.step = {};
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
    // Animations created synchronously will run synchronously
    function createFxNow() {
    }
    // Generate parameters to create a standard animation
    function genFx(type, includeWidth) {
        var which, i = 0, attrs = { height: type };
        // If we include width, step value is 1 to do all cssExpand values,
        // otherwise step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs['margin' + which] = attrs['padding' + which] = type;
        }
        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }
        return attrs;
    }
    function createTween(value, prop, animation) {
    }
    function defaultPrefilter(elem, props, opts) {
    }
    function propFilter(props, specialEasing) {
    }
    function Animation(elem, properties, options) {
    }
    jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
            '*': [function (prop, value) {
                }]
        },
        tweener: function (props, callback) {
        },
        prefilters: [defaultPrefilter],
        prefilter: function (callback, prepend) {
        }
    });
    jQuery.speed = function (speed, easing, fn) {
    };
    jQuery.fn.extend({
        fadeTo: function (speed, to, easing, callback) {
        },
        animate: function (prop, speed, easing, callback) {
        },
        stop: function (type, clearQueue, gotoEnd) {
        },
        finish: function (type) {
        }
    });
    jQuery.each([
        'toggle',
        'show',
        'hide'
    ], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
        };
    });
    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx('show'),
        slideUp: genFx('hide'),
        slideToggle: genFx('toggle'),
        fadeIn: { opacity: 'show' },
        fadeOut: { opacity: 'hide' },
        fadeToggle: { opacity: 'toggle' }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
        };
    });
    jQuery.timers = [];
    jQuery.fx.tick = function () {
    };
    jQuery.fx.timer = function (timer) {
    };
    jQuery.fx.interval = 13;
    jQuery.fx.start = function () {
    };
    jQuery.fx.stop = function () {
    };
    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };
    // Based off of the plugin by Clint Helfers, with permission.
    // http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function (time, type) {
    };
    (function () {
        var input = document.createElement('input'), select = document.createElement('select'), opt = select.appendChild(document.createElement('option'));
        input.type = 'checkbox';
        // Support: iOS<=5.1, Android<=4.2+
        // Default value for a checkbox should be "on"
        support.checkOn = input.value !== '';
        // Support: IE<=11+
        // Must access selectedIndex to make default options select
        support.optSelected = opt.selected;
        // Support: Android<=2.3
        // Options inside disabled selects are incorrectly marked as disabled
        select.disabled = true;
        support.optDisabled = !opt.disabled;
        // Support: IE<=11+
        // An input loses its value after becoming a radio
        input = document.createElement('input');
        input.value = 't';
        input.type = 'radio';
        support.radioValue = input.value === 't';
    }());
    var boolHook, attrHandle = jQuery.expr.attrHandle;
    jQuery.fn.extend({
        attr: function (name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function (name) {
        }
    });
    jQuery.extend({
        attr: function (elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            // Don't get/set attributes on text, comment and attribute nodes
            if (nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            // Fallback to prop when attributes are not supported
            if (typeof elem.getAttribute === 'undefined') {
                return jQuery.prop(elem, name, value);
            }
            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
            }
            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                    return;
                }
                if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                }
                elem.setAttribute(name, value + '');
                return value;
            }
            if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            }
            ret = jQuery.find.attr(elem, name);
            // Non-existent attributes return null, we normalize to undefined
            return ret == null ? undefined : ret;
        },
        attrHooks: {
            type: {
                set: function (elem, value) {
                }
            }
        },
        removeAttr: function (elem, value) {
        }
    });
    // Hooks for boolean attributes
    boolHook = {
        set: function (elem, value, name) {
        }
    };
    jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function (elem, name, isXML) {
        };
    });
    var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
    jQuery.fn.extend({
        prop: function (name, value) {
        },
        removeProp: function (name) {
        }
    });
    jQuery.extend({
        prop: function (elem, name, value) {
        },
        propHooks: {
            tabIndex: {
                get: function (elem) {
                }
            }
        },
        propFix: {
            'for': 'htmlFor',
            'class': 'className'
        }
    });
    // Support: IE <=11 only
    // Accessing the selectedIndex property
    // forces the browser to respect setting selected
    // on the option
    // The getter ensures a default option is selected
    // when in an optgroup
    if (!support.optSelected) {
        jQuery.propHooks.selected = {
            get: function (elem) {
            },
            set: function (elem) {
            }
        };
    }
    jQuery.each([
        'tabIndex',
        'readOnly',
        'maxLength',
        'cellSpacing',
        'cellPadding',
        'rowSpan',
        'colSpan',
        'useMap',
        'frameBorder',
        'contentEditable'
    ], function () {
        jQuery.propFix[this.toLowerCase()] = this;
    });
    var rclass = /[\t\r\n\f]/g;
    function getClass(elem) {
        return elem.getAttribute && elem.getAttribute('class') || '';
    }
    jQuery.fn.extend({
        addClass: function (value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                });
            }
            if (typeof value === 'string' && value) {
                classes = value.match(rnotwhite) || [];
                while (elem = this[i++]) {
                    curValue = getClass(elem);
                    cur = elem.nodeType === 1 && (' ' + curValue + ' ').replace(rclass, ' ');
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {
                            if (cur.indexOf(' ' + clazz + ' ') < 0) {
                                cur += clazz + ' ';
                            }
                        }
                        // Only assign if different to avoid unneeded rendering.
                        finalValue = jQuery.trim(cur);
                        if (curValue !== finalValue) {
                            elem.setAttribute('class', finalValue);
                        }
                    }
                }
            }
            return this;
        },
        removeClass: function (value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                });
            }
            if (!arguments.length) {
                return this.attr('class', '');
            }
            if (typeof value === 'string' && value) {
                classes = value.match(rnotwhite) || [];
                while (elem = this[i++]) {
                    curValue = getClass(elem);
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && (' ' + curValue + ' ').replace(rclass, ' ');
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {
                            // Remove *all* instances
                            while (cur.indexOf(' ' + clazz + ' ') > -1) {
                                cur = cur.replace(' ' + clazz + ' ', ' ');
                            }
                        }
                        // Only assign if different to avoid unneeded rendering.
                        finalValue = jQuery.trim(cur);
                        if (curValue !== finalValue) {
                            elem.setAttribute('class', finalValue);
                        }
                    }
                }
            }
            return this;
        },
        toggleClass: function (value, stateVal) {
            var type = typeof value;
            if (typeof stateVal === 'boolean' && type === 'string') {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                });
            }
            return this.each(function () {
            });
        },
        hasClass: function (selector) {
            var className, elem, i = 0;
            className = ' ' + selector + ' ';
            while (elem = this[i++]) {
                if (elem.nodeType === 1 && (' ' + getClass(elem) + ' ').replace(rclass, ' ').indexOf(className) > -1) {
                    return true;
                }
            }
            return false;
        }
    });
    var rreturn = /\r/g, rspaces = /[\x20\t\r\n\f]+/g;
    jQuery.fn.extend({
        val: function (value) {
        }
    });
    jQuery.extend({
        valHooks: {
            option: {
                get: function (elem) {
                }
            },
            select: {
                get: function (elem) {
                },
                set: function (elem, value) {
                }
            }
        }
    });
    // Radios and checkboxes getter/setter
    jQuery.each([
        'radio',
        'checkbox'
    ], function () {
        jQuery.valHooks[this] = {
            set: function (elem, value) {
            }
        };
        if (!support.checkOn) {
            jQuery.valHooks[this].get = function (elem) {
            };
        }
    });
    // Return jQuery for attributes-only inclusion
    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
    jQuery.extend(jQuery.event, {
        trigger: function (event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, eventPath = [elem || document], type = hasOwn.call(event, 'type') ? event.type : event, namespaces = hasOwn.call(event, 'namespace') ? event.namespace.split('.') : [];
            cur = tmp = elem = elem || document;
            // Don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }
            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }
            if (type.indexOf('.') > -1) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split('.');
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(':') < 0 && 'on' + type;
            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === 'object' && event);
            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join('.');
            event.rnamespace = event.namespace ? new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)') : null;
            // Clean up the event in case it is being reused
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }
            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ? [event] : jQuery.makeArray(data, [event]);
            // Allow special events to draw outside the lines
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }
            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                bubbleType = special.delegateType || type;
                if (!rfocusMorph.test(bubbleType + type)) {
                    cur = cur.parentNode;
                }
                for (; cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }
                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if (tmp === (elem.ownerDocument || document)) {
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }
            // Fire handlers on the event path
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
                event.type = i > 1 ? bubbleType : special.bindType || type;
                // jQuery handler
                handle = (dataPriv.get(cur, 'events') || {})[event.type] && dataPriv.get(cur, 'handle');
                if (handle) {
                    handle.apply(cur, data);
                }
                // Native handler
                handle = ontype && cur[ontype];
                if (handle && handle.apply && acceptData(cur)) {
                    event.result = handle.apply(cur, data);
                    if (event.result === false) {
                        event.preventDefault();
                    }
                }
            }
            event.type = type;
            // If nobody prevented the default action, do it now
            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
                    // Call a native DOM method on the target with the same name name as the event.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {
                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ontype];
                        if (tmp) {
                            elem[ontype] = null;
                        }
                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        elem[type]();
                        jQuery.event.triggered = undefined;
                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }
            return event.result;
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function (type, elem, event) {
        }
    });
    jQuery.fn.extend({
        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function (type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });
    jQuery.each(('blur focus focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select submit keydown keypress keyup error contextmenu').split(' '), function (i, name) {
        // Handle event binding
        jQuery.fn[name] = function (data, fn) {
        };
    });
    jQuery.fn.extend({
        hover: function (fnOver, fnOut) {
        }
    });
    support.focusin = 'onfocusin' in window;
    // Support: Firefox
    // Firefox doesn't have focus(in | out) events
    // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
    //
    // Support: Chrome, Safari
    // focus(in | out) events fire after focus & blur events,
    // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
    // Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
    if (!support.focusin) {
        jQuery.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function (orig, fix) {
            // Attach a single capturing handler on the document while someone wants focusin/focusout
            var handler = function (event) {
            };
            jQuery.event.special[fix] = {
                setup: function () {
                },
                teardown: function () {
                }
            };
        });
    }
    var location = window.location;
    var nonce = jQuery.now();
    var rquery = /\?/;
    // Support: Android 2.3
    // Workaround failure to string-cast null input
    jQuery.parseJSON = function (data) {
    };
    // Cross-browser xml parsing
    jQuery.parseXML = function (data) {
    };
    var rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//,
        /* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
        prefilters = {},
        /* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
        transports = {},
        // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = '*/'.concat('*'),
        // Anchor tag for parsing the document origin
        originAnchor = document.createElement('a');
    originAnchor.href = location.href;
    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports(structure) {
        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {
            if (typeof dataTypeExpression !== 'string') {
                func = dataTypeExpression;
                dataTypeExpression = '*';
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
            if (jQuery.isFunction(func)) {
                // For each dataType in the dataTypeExpression
                while (dataType = dataTypes[i++]) {
                    // Prepend if requested
                    if (dataType[0] === '+') {
                        dataType = dataType.slice(1) || '*';
                        (structure[dataType] = structure[dataType] || []).unshift(func);    // Otherwise append
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }
    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    }
    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }
        return target;
    }
    /* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
    function ajaxHandleResponses(s, jqXHR, responses) {
    }
    /* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
    function ajaxConvert(s, response, jqXHR, isSuccess) {
    }
    jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: location.href,
            type: 'GET',
            isLocal: rlocalProtocol.test(location.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            /*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/
            accepts: {
                '*': allTypes,
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript'
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: 'responseXML',
                text: 'responseText',
                json: 'responseJSON'
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
                // Convert anything to text
                '* text': String,
                // Text to html (true = no transformation)
                'text html': true,
                // Evaluate text as a json expression
                'text json': jQuery.parseJSON,
                // Parse text as xml
                'text xml': jQuery.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function (target, settings) {
            return settings ? // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function (url, options) {
        },
        getJSON: function (url, data, callback) {
        },
        getScript: function (url, callback) {
        }
    });
    jQuery.each([
        'get',
        'post'
    ], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
        };
    });
    jQuery._evalUrl = function (url) {
    };
    jQuery.fn.extend({
        wrapAll: function (html) {
        },
        wrapInner: function (html) {
        },
        wrap: function (html) {
        },
        unwrap: function () {
        }
    });
    jQuery.expr.filters.hidden = function (elem) {
    };
    jQuery.expr.filters.visible = function (elem) {
    };
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    function buildParams(prefix, obj, traditional, add) {
    }
    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function (a, traditional) {
    };
    jQuery.fn.extend({
        serialize: function () {
        },
        serializeArray: function () {
        }
    });
    jQuery.ajaxSettings.xhr = function () {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {
        }
    };
    var xhrSuccessStatus = {
            // File protocol always yields status code 0, assume 200
            0: 200,
            // Support: IE9
            // #1450: sometimes IE returns 1223 when it should be 204
            1223: 204
        }, xhrSupported = jQuery.ajaxSettings.xhr();
    support.cors = !!xhrSupported && 'withCredentials' in xhrSupported;
    support.ajax = xhrSupported = !!xhrSupported;
    jQuery.ajaxTransport(function (options) {
    });
    // Install script dataType
    jQuery.ajaxSetup({
        accepts: { script: 'text/javascript, application/javascript, ' + 'application/ecmascript, application/x-ecmascript' },
        contents: { script: /\b(?:java|ecma)script\b/ },
        converters: {
            'text script': function (text) {
            }
        }
    });
    // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter('script', function (s) {
    });
    // Bind script tag hack transport
    jQuery.ajaxTransport('script', function (s) {
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: 'callback',
        jsonpCallback: function () {
        }
    });
    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter('json jsonp', function (s, originalSettings, jqXHR) {
    });
    // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function (data, context, keepScripts) {
    };
    // Keep a copy of the old load method
    var _load = jQuery.fn.load;
    /**
 * Load a url into a page
 */
    jQuery.fn.load = function (url, params, callback) {
    };
    // Attach a bunch of functions for handling common AJAX events
    jQuery.each([
        'ajaxStart',
        'ajaxStop',
        'ajaxComplete',
        'ajaxError',
        'ajaxSuccess',
        'ajaxSend'
    ], function (i, type) {
        jQuery.fn[type] = function (fn) {
        };
    });
    jQuery.expr.filters.animated = function (elem) {
    };
    /**
 * Gets a window from an element
 */
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    jQuery.offset = {
        setOffset: function (elem, options, i) {
        }
    };
    jQuery.fn.extend({
        offset: function (options) {
            if (arguments.length) {
                return options === undefined ? this : this.each(function (i) {
                });
            }
            var docElem, win, elem = this[0], box = {
                    top: 0,
                    left: 0
                }, doc = elem && elem.ownerDocument;
            if (!doc) {
                return;
            }
            docElem = doc.documentElement;
            // Make sure it's not a disconnected DOM node
            if (!jQuery.contains(docElem, elem)) {
                return box;
            }
            box = elem.getBoundingClientRect();
            win = getWindow(doc);
            return {
                top: box.top + win.pageYOffset - docElem.clientTop,
                left: box.left + win.pageXOffset - docElem.clientLeft
            };
        },
        position: function () {
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function () {
        }
    });
    // Create scrollLeft and scrollTop methods
    jQuery.each({
        scrollLeft: 'pageXOffset',
        scrollTop: 'pageYOffset'
    }, function (method, prop) {
        var top = 'pageYOffset' === prop;
        jQuery.fn[method] = function (val) {
            return access(this, function (elem, method, val) {
                var win = getWindow(elem);
                if (val === undefined) {
                    return win ? win[prop] : elem[method];
                }
                if (win) {
                    win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length);
        };
    });
    // Support: Safari<7-8+, Chrome<37-44+
    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
    // getComputedStyle returns percent when specified for top/left/bottom/right;
    // rather than make the css module depend on the offset module, just check for it here
    jQuery.each([
        'top',
        'left'
    ], function (i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
        });
    });
    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each({
        Height: 'height',
        Width: 'width'
    }, function (name, type) {
        jQuery.each({
            padding: 'inner' + name,
            content: type,
            '': 'outer' + name
        }, function (defaultExtra, funcName) {
            // Margin is only for outerHeight, outerWidth
            jQuery.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== 'boolean'), extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');
                return access(this, function (elem, type, value) {
                    var doc;
                    if (jQuery.isWindow(elem)) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement['client' + name];
                    }
                    // Get document width or height
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;
                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                        // whichever is greatest
                        return Math.max(elem.body['scroll' + name], doc['scroll' + name], elem.body['offset' + name], doc['offset' + name], doc['client' + name]);
                    }
                    return value === undefined ? // Get width or height on the element, requesting but not forcing parseFloat
                    jQuery.css(elem, type, extra) : // Set width or height on the element
                    jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });
    jQuery.fn.extend({
        bind: function (types, data, fn) {
        },
        unbind: function (types, fn) {
        },
        delegate: function (selector, types, data, fn) {
        },
        undelegate: function (selector, types, fn) {
        },
        size: function () {
        }
    });
    jQuery.fn.andSelf = jQuery.fn.addBack;
    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.
    // Note that for maximum portability, libraries that are not jQuery should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. jQuery is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
    if (typeof define === 'function' && define.amd) {
        define('jquery', [], function () {
        });
    }
    var
        // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,
        // Map over the $ in case of overwrite
        _$ = window.$;
    jQuery.noConflict = function (deep) {
    };
    // Expose jQuery and $ identifiers, even in AMD
    // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    if (!noGlobal) {
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
}));
/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
    'use strict';
    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================
    function transitionEnd() {
        var el = document.createElement('bootstrap');
        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] };
            }
        }
        return false    // explicit for ie8 (  ._.)
;
    }
    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('bsTransitionEnd', function () {
            called = true;
        });
        var callback = function () {
            if (!called)
                $($el).trigger($.support.transition.end);
        };
        setTimeout(callback, duration);
        return this;
    };
    $(function () {
        $.support.transition = transitionEnd();
        if (!$.support.transition)
            return;
        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this))
                    return e.handleObj.handler.apply(this, arguments);
            }
        };
    });
}(jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/* jshint latedef: false */
+function ($) {
    'use strict';
    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================
    var Collapse = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Collapse.DEFAULTS, options);
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
        this.transitioning = null;
        if (this.options.parent) {
            this.$parent = this.getParent();
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger);
        }
        if (this.options.toggle)
            this.toggle();
    };
    Collapse.VERSION = '3.3.7';
    Collapse.TRANSITION_DURATION = 350;
    Collapse.DEFAULTS = { toggle: true };
    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width');
        return hasWidth ? 'width' : 'height';
    };
    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in'))
            return;
        var activesData;
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');
        if (actives && actives.length) {
            activesData = actives.data('bs.collapse');
            if (activesData && activesData.transitioning)
                return;
        }
        var startEvent = $.Event('show.bs.collapse');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented())
            return;
        if (actives && actives.length) {
            Plugin.call(actives, 'hide');
            activesData || actives.data('bs.collapse', null);
        }
        var dimension = this.dimension();
        this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);
        this.$trigger.removeClass('collapsed').attr('aria-expanded', true);
        this.transitioning = 1;
        var complete = function () {
            this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
            this.transitioning = 0;
            this.$element.trigger('shown.bs.collapse');
        };
        if (!$.support.transition)
            return complete.call(this);
        var scrollSize = $.camelCase([
            'scroll',
            dimension
        ].join('-'));
        this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
    };
    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in'))
            return;
        var startEvent = $.Event('hide.bs.collapse');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented())
            return;
        var dimension = this.dimension();
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
        this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);
        this.$trigger.addClass('collapsed').attr('aria-expanded', false);
        this.transitioning = 1;
        var complete = function () {
            this.transitioning = 0;
            this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
        };
        if (!$.support.transition)
            return complete.call(this);
        this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
    };
    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']();
    };
    Collapse.prototype.getParent = function () {
    };
    Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass('in');
        $element.attr('aria-expanded', isOpen);
        $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
    };
    function getTargetFromTrigger($trigger) {
        var href;
        var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
        // strip for ie7
        return $(target);
    }
    // COLLAPSE PLUGIN DEFINITION
    // ==========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.collapse');
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data && options.toggle && /show|hide/.test(option))
                options.toggle = false;
            if (!data)
                $this.data('bs.collapse', data = new Collapse(this, options));
            if (typeof option == 'string')
                data[option]();
        });
    }
    var old = $.fn.collapse;
    $.fn.collapse = Plugin;
    $.fn.collapse.Constructor = Collapse;
    // COLLAPSE NO CONFLICT
    // ====================
    $.fn.collapse.noConflict = function () {
    };
    // COLLAPSE DATA-API
    // =================
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
        var $this = $(this);
        if (!$this.attr('data-target'))
            e.preventDefault();
        var $target = getTargetFromTrigger($this);
        var data = $target.data('bs.collapse');
        var option = data ? 'toggle' : $this.data();
        Plugin.call($target, option);
    });
}(jQuery);
/**
 * @license
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash include="throttle,debounce" exports="global"`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;
(function () {
    /** Used as a safe reference for `undefined` in pre-ES5 environments. */
    var undefined;
    /** Used as the semantic version number. */
    var VERSION = '3.1.0';
    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';
    /** `Object#toString` result references. */
    var funcTag = '[object Function]';
    /** Used to detect host constructors (Safari > 5). */
    var reHostCtor = /^\[object .+?Constructor\]$/;
    /**
   * Used to match `RegExp` special characters.
   * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
   * for more details.
   */
    var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g, reHasRegExpChars = RegExp(reRegExpChars.source);
    /** Used as an internal `_.debounce` options object by `_.throttle`. */
    var debounceOptions = {
        'leading': false,
        'maxWait': 0,
        'trailing': false
    };
    /** Used to determine if values are of the language type `Object`. */
    var objectTypes = {
        'function': true,
        'object': true
    };
    /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it is the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
    var root = objectTypes[typeof window] && window !== (this && this.window) ? window : this;
    /** Detect free variable `exports`. */
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
    /** Detect free variable `module`. */
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
    /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
    var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
        root = freeGlobal;
    }
    /*--------------------------------------------------------------------------*/
    /**
   * Converts `value` to a string if it is not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
    function baseToString(value) {
        if (typeof value == 'string') {
            return value;
        }
        return value == null ? '' : value + '';
    }
    /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
    var isHostObject = function () {
        try {
            Object({ 'toString': 0 } + '');
        } catch (e) {
            return function () {
            };
        }
        return function (value) {
        };
    }();
    /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
    function isObjectLike(value) {
    }
    /*--------------------------------------------------------------------------*/
    /** Used for native method references. */
    var objectProto = Object.prototype;
    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;
    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;
    /**
   * Used to resolve the `toStringTag` of values.
   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
   * for more details.
   */
    var objToString = objectProto.toString;
    /** Used to detect if a method is native. */
    var reNative = RegExp('^' + escapeRegExp(objToString).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
    /** Native method references. */
    var Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array;
    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max, nativeNow = isNative(nativeNow = Date.now) && nativeNow;
    /*------------------------------------------------------------------------*/
    /**
   * Creates a `lodash` object which wraps `value` to enable intuitive chaining.
   * Methods that operate on and return arrays, collections, and functions can
   * be chained together. Methods that return a boolean or single value will
   * automatically end the chain returning the unwrapped value. Explicit chaining
   * may be enabled using `_.chain`. The execution of chained methods is lazy,
   * that is, execution is deferred until `_#value` is implicitly or explicitly
   * called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
   * fusion is an optimization that merges iteratees to avoid creating intermediate
   * arrays and reduce the number of iteratee executions.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers also have the following `Array` methods:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
   * and `unshift`
   *
   * The wrapper functions that support shortcut fusion are:
   * `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`, `first`,
   * `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`, `slice`,
   * `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `where`
   *
   * The chainable wrapper functions are:
   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
   * `callback`, `chain`, `chunk`, `compact`, `concat`, `constant`, `countBy`,
   * `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`, `difference`,
   * `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`, `flatten`,
   * `flattenDeep`, `flow`, `flowRight`, `forEach`, `forEachRight`, `forIn`,
   * `forInRight`, `forOwn`, `forOwnRight`, `functions`, `groupBy`, `indexBy`,
   * `initial`, `intersection`, `invert`, `invoke`, `keys`, `keysIn`, `map`,
   * `mapValues`, `matches`, `memoize`, `merge`, `mixin`, `negate`, `noop`,
   * `omit`, `once`, `pairs`, `partial`, `partialRight`, `partition`, `pick`,
   * `pluck`, `property`, `propertyOf`, `pull`, `pullAt`, `push`, `range`,
   * `rearg`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
   * `sortBy`, `sortByAll`, `splice`, `take`, `takeRight`, `takeRightWhile`,
   * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
   * `transform`, `union`, `uniq`, `unshift`, `unzip`, `values`, `valuesIn`,
   * `where`, `without`, `wrap`, `xor`, `zip`, and `zipObject`
   *
   * The wrapper functions that are **not** chainable by default are:
   * `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
   * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
   * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
   * `identity`, `includes`, `indexOf`, `isArguments`, `isArray`, `isBoolean`,
   * `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`, `isFinite`,
   * `isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`,
   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`,
   * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`,
   * `noConflict`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`,
   * `random`, `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`,
   * `shift`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`,
   * `startCase`, `startsWith`, `template`, `trim`, `trimLeft`, `trimRight`,
   * `trunc`, `unescape`, `uniqueId`, `value`, and `words`
   *
   * The wrapper function `sample` will return a wrapped value when `n` is provided,
   * otherwise an unwrapped value is returned.
   *
   * @name _
   * @constructor
   * @category Chain
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns a `lodash` instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(sum, n) { return sum + n; });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(n) { return n * n; });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
    function lodash(value) {
    }
    /*------------------------------------------------------------------------*/
    /**
   * Gets the number of milliseconds that have elapsed since the Unix epoch
   * (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @category Date
   * @example
   *
   * _.defer(function(stamp) { console.log(_.now() - stamp); }, _.now());
   * // => logs the number of milliseconds it took for the deferred function to be invoked
   */
    var now = nativeNow || function () {
    };
    /*------------------------------------------------------------------------*/
    /**
   * Creates a function that delays invoking `func` until after `wait` milliseconds
   * have elapsed since the last time it was invoked. The created function comes
   * with a `cancel` method to cancel delayed invocations. Provide an options
   * object to indicate that `func` should be invoked on the leading and/or
   * trailing edge of the `wait` timeout. Subsequent calls to the debounced
   * function return the result of the last `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
   * on the trailing edge of the timeout only if the the debounced function is
   * invoked more than once during the `wait` timeout.
   *
   * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} wait The number of milliseconds to delay.
   * @param {Object} [options] The options object.
   * @param {boolean} [options.leading=false] Specify invoking on the leading
   *  edge of the timeout.
   * @param {number} [options.maxWait] The maximum time `func` is allowed to be
   *  delayed before it is invoked.
   * @param {boolean} [options.trailing=true] Specify invoking on the trailing
   *  edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // avoid costly calculations while the window size is in flux
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
   * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // ensure `batchLog` is invoked once after 1 second of debounced calls
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', _.debounce(batchLog, 250, {
   *   'maxWait': 1000
   * }));
   *
   * // cancel a debounced call
   * var todoChanges = _.debounce(batchLog, 1000);
   * Object.observe(models.todo, todoChanges);
   *
   * Object.observe(models, function(changes) {
   *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
   *     todoChanges.cancel();
   *   }
   * }, ['delete']);
   *
   * // ...at some point `models.todo` is changed
   * models.todo.completed = true;
   *
   * // ...before 1 second has passed `models.todo` is deleted
   * // which cancels the debounced `todoChanges` call
   * delete models.todo;
   */
    function debounce(func, wait, options) {
        var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = false, trailing = true;
        if (!isFunction(func)) {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = wait < 0 ? 0 : wait;
        if (options === true) {
            var leading = true;
            trailing = false;
        } else if (isObject(options)) {
            leading = options.leading;
            maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
            trailing = 'trailing' in options ? options.trailing : trailing;
        }
        function cancel() {
        }
        function delayed() {
            var remaining = wait - (now() - stamp);
            if (remaining <= 0 || remaining > wait) {
                if (maxTimeoutId) {
                    clearTimeout(maxTimeoutId);
                }
                var isCalled = trailingCall;
                maxTimeoutId = timeoutId = trailingCall = undefined;
                if (isCalled) {
                    lastCalled = now();
                    result = func.apply(thisArg, args);
                    if (!timeoutId && !maxTimeoutId) {
                        args = thisArg = null;
                    }
                }
            } else {
                timeoutId = setTimeout(delayed, remaining);
            }
        }
        function maxDelayed() {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            maxTimeoutId = timeoutId = trailingCall = undefined;
            if (trailing || maxWait !== wait) {
                lastCalled = now();
                result = func.apply(thisArg, args);
                if (!timeoutId && !maxTimeoutId) {
                    args = thisArg = null;
                }
            }
        }
        function debounced() {
            args = arguments;
            stamp = now();
            thisArg = this;
            trailingCall = trailing && (timeoutId || !leading);
            if (maxWait === false) {
                var leadingCall = leading && !timeoutId;
            } else {
                if (!maxTimeoutId && !leading) {
                    lastCalled = stamp;
                }
                var remaining = maxWait - (stamp - lastCalled), isCalled = remaining <= 0 || remaining > maxWait;
                if (isCalled) {
                    if (maxTimeoutId) {
                        maxTimeoutId = clearTimeout(maxTimeoutId);
                    }
                    lastCalled = stamp;
                    result = func.apply(thisArg, args);
                } else if (!maxTimeoutId) {
                    maxTimeoutId = setTimeout(maxDelayed, remaining);
                }
            }
            if (isCalled && timeoutId) {
                timeoutId = clearTimeout(timeoutId);
            } else if (!timeoutId && wait !== maxWait) {
                timeoutId = setTimeout(delayed, wait);
            }
            if (leadingCall) {
                isCalled = true;
                result = func.apply(thisArg, args);
            }
            if (isCalled && !timeoutId && !maxTimeoutId) {
                args = thisArg = null;
            }
            return result;
        }
        debounced.cancel = cancel;
        return debounced;
    }
    /**
   * Creates a function that only invokes `func` at most once per every `wait`
   * milliseconds. The created function comes with a `cancel` method to cancel
   * delayed invocations. Provide an options object to indicate that `func`
   * should be invoked on the leading and/or trailing edge of the `wait` timeout.
   * Subsequent calls to the throttled function return the result of the last
   * `func` call.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
   * on the trailing edge of the timeout only if the the throttled function is
   * invoked more than once during the `wait` timeout.
   *
   * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
   * for details over the differences between `_.throttle` and `_.debounce`.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to throttle.
   * @param {number} wait The number of milliseconds to throttle invocations to.
   * @param {Object} [options] The options object.
   * @param {boolean} [options.leading=true] Specify invoking on the leading
   *  edge of the timeout.
   * @param {boolean} [options.trailing=true] Specify invoking on the trailing
   *  edge of the timeout.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * // avoid excessively updating the position while scrolling
   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
   *
   * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
   * var throttled =  _.throttle(renewToken, 300000, { 'trailing': false })
   * jQuery('.interactive').on('click', throttled);
   *
   * // cancel a trailing throttled call
   * jQuery(window).on('popstate', throttled.cancel);
   */
    function throttle(func, wait, options) {
        var leading = true, trailing = true;
        if (!isFunction(func)) {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (options === false) {
            leading = false;
        } else if (isObject(options)) {
            leading = 'leading' in options ? !!options.leading : leading;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        debounceOptions.leading = leading;
        debounceOptions.maxWait = +wait;
        debounceOptions.trailing = trailing;
        return debounce(func, wait, debounceOptions);
    }
    /*------------------------------------------------------------------------*/
    /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
    function isFunction(value) {
        // Avoid a Chakra JIT bug in compatibility modes of IE 11.
        // See https://github.com/jashkenas/underscore/issues/1621 for more details.
        return typeof value == 'function' || false;
    }
    // Fallback for environments that return incorrect `typeof` operator results.
    if (isFunction(/x/) || Uint8Array && !isFunction(Uint8Array)) {
        isFunction = function (value) {
        };
    }
    /**
   * Checks if `value` is the language type of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
    function isObject(value) {
        // Avoid a V8 JIT bug in Chrome 19-20.
        // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
        var type = typeof value;
        return type == 'function' || value && type == 'object' || false;
    }
    /**
   * Checks if `value` is a native function.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
    function isNative(value) {
        if (value == null) {
            return false;
        }
        if (objToString.call(value) == funcTag) {
            return reNative.test(fnToString.call(value));
        }
        return isObjectLike(value) && (isHostObject(value) ? reNative : reHostCtor).test(value) || false;
    }
    /*------------------------------------------------------------------------*/
    /**
   * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
   * "+", "(", ")", "[", "]", "{" and "}" in `string`.
   *
   * @static
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escapeRegExp('[lodash](https://lodash.com/)');
   * // => '\[lodash\]\(https://lodash\.com/\)'
   */
    function escapeRegExp(string) {
        string = baseToString(string);
        return string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, '\\$&') : string;
    }
    /*------------------------------------------------------------------------*/
    // Add functions that return wrapped values when chaining.
    lodash.debounce = debounce;
    lodash.throttle = throttle;
    /*------------------------------------------------------------------------*/
    // Add functions that return unwrapped values when chaining.
    lodash.escapeRegExp = escapeRegExp;
    lodash.isFunction = isFunction;
    lodash.isNative = isNative;
    lodash.isObject = isObject;
    lodash.now = now;
    /*------------------------------------------------------------------------*/
    /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
    lodash.VERSION = VERSION;
    /*--------------------------------------------------------------------------*/
    // Export for a browser or Rhino.
    root._ = lodash;
}.call(this));
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.1.1
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */
(function () {
    'use strict';
    //Declare root variable - window in the browser, global on the server
    var root = this, previous = root.Chart;
    //Occupy the global variable of Chart, and create a simple base class
    var Chart = function (context) {
        var chart = this;
        this.canvas = context.canvas;
        this.ctx = context;
        //Variables global to the chart
        var computeDimension = function (element, dimension) {
            if (element['offset' + dimension]) {
                return element['offset' + dimension];
            } else {
                return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
            }
        };
        var width = this.width = computeDimension(context.canvas, 'Width') || context.canvas.width;
        var height = this.height = computeDimension(context.canvas, 'Height') || context.canvas.height;
        this.aspectRatio = this.width / this.height;
        //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
        helpers.retinaScale(this);
        return this;
    };
    //Globally expose the defaults to allow for user updating/changing
    Chart.defaults = {
        global: {
            // Boolean - Whether to animate the chart
            animation: true,
            // Number - Number of animation steps
            animationSteps: 60,
            // String - Animation easing effect
            animationEasing: 'easeOutQuart',
            // Boolean - If we should show the scale at all
            showScale: true,
            // Boolean - If we want to override with a hard coded scale
            scaleOverride: false,
            // ** Required if scaleOverride is true **
            // Number - The number of steps in a hard coded scale
            scaleSteps: null,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: null,
            // Number - The scale starting value
            scaleStartValue: null,
            // String - Colour of the scale line
            scaleLineColor: 'rgba(0,0,0,.1)',
            // Number - Pixel width of the scale line
            scaleLineWidth: 1,
            // Boolean - Whether to show labels on the scale
            scaleShowLabels: true,
            // Interpolated JS string - can access value
            scaleLabel: '<%=value%>',
            // Boolean - Whether the scale should stick to integers, and not show any floats even if drawing space is there
            scaleIntegersOnly: true,
            // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: false,
            // String - Scale label font declaration for the scale label
            scaleFontFamily: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
            // Number - Scale label font size in pixels
            scaleFontSize: 12,
            // String - Scale label font weight style
            scaleFontStyle: 'normal',
            // String - Scale label font colour
            scaleFontColor: '#666',
            // Boolean - whether or not the chart should be responsive and resize when the browser does.
            responsive: false,
            // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
            maintainAspectRatio: true,
            // Boolean - Determines whether to draw tooltips on the canvas or not - attaches events to touchmove & mousemove
            showTooltips: true,
            // Boolean - Determines whether to draw built-in tooltip or call custom tooltip function
            customTooltips: false,
            // Array - Array of string names to attach tooltip events
            tooltipEvents: [
                'mousemove',
                'touchstart',
                'touchmove',
                'mouseout'
            ],
            // String - Tooltip background colour
            tooltipFillColor: 'rgba(0,0,0,0.8)',
            // String - Tooltip label font declaration for the scale label
            tooltipFontFamily: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
            // Number - Tooltip label font size in pixels
            tooltipFontSize: 14,
            // String - Tooltip font weight style
            tooltipFontStyle: 'normal',
            // String - Tooltip label font colour
            tooltipFontColor: '#fff',
            // String - Tooltip title font declaration for the scale label
            tooltipTitleFontFamily: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
            // Number - Tooltip title font size in pixels
            tooltipTitleFontSize: 14,
            // String - Tooltip title font weight style
            tooltipTitleFontStyle: 'bold',
            // String - Tooltip title font colour
            tooltipTitleFontColor: '#fff',
            // String - Tooltip title template
            tooltipTitleTemplate: '<%= label%>',
            // Number - pixel width of padding around tooltip text
            tooltipYPadding: 6,
            // Number - pixel width of padding around tooltip text
            tooltipXPadding: 6,
            // Number - Size of the caret on the tooltip
            tooltipCaretSize: 8,
            // Number - Pixel radius of the tooltip border
            tooltipCornerRadius: 6,
            // Number - Pixel offset from point x to tooltip edge
            tooltipXOffset: 10,
            // String - Template string for single tooltips
            tooltipTemplate: '<%if (label){%><%=label%>: <%}%><%= value %>',
            // String - Template string for single tooltips
            multiTooltipTemplate: '<%= datasetLabel %>: <%= value %>',
            // String - Colour behind the legend colour block
            multiTooltipKeyBackground: '#fff',
            // Array - A list of colors to use as the defaults
            segmentColorDefault: [
                '#A6CEE3',
                '#1F78B4',
                '#B2DF8A',
                '#33A02C',
                '#FB9A99',
                '#E31A1C',
                '#FDBF6F',
                '#FF7F00',
                '#CAB2D6',
                '#6A3D9A',
                '#B4B482',
                '#B15928'
            ],
            // Array - A list of highlight colors to use as the defaults
            segmentHighlightColorDefaults: [
                '#CEF6FF',
                '#47A0DC',
                '#DAFFB2',
                '#5BC854',
                '#FFC2C1',
                '#FF4244',
                '#FFE797',
                '#FFA728',
                '#F2DAFE',
                '#9265C2',
                '#DCDCAA',
                '#D98150'
            ],
            // Function - Will fire on animation progression.
            onAnimationProgress: function () {
            },
            // Function - Will fire on animation completion.
            onAnimationComplete: function () {
            }
        }
    };
    //Create a dictionary of chart types, to allow for extension of existing types
    Chart.types = {};
    //Global Chart helpers object for utility methods and classes
    var helpers = Chart.helpers = {};
    //-- Basic js utility methods
    var each = helpers.each = function (loopable, callback, self) {
            var additionalArgs = Array.prototype.slice.call(arguments, 3);
            // Check to see if null or undefined firstly.
            if (loopable) {
                if (loopable.length === +loopable.length) {
                    var i;
                    for (i = 0; i < loopable.length; i++) {
                        callback.apply(self, [
                            loopable[i],
                            i
                        ].concat(additionalArgs));
                    }
                } else {
                    for (var item in loopable) {
                        callback.apply(self, [
                            loopable[item],
                            item
                        ].concat(additionalArgs));
                    }
                }
            }
        }, clone = helpers.clone = function (obj) {
            var objClone = {};
            each(obj, function (value, key) {
                if (obj.hasOwnProperty(key)) {
                    objClone[key] = value;
                }
            });
            return objClone;
        }, extend = helpers.extend = function (base) {
            each(Array.prototype.slice.call(arguments, 1), function (extensionObject) {
                each(extensionObject, function (value, key) {
                    if (extensionObject.hasOwnProperty(key)) {
                        base[key] = value;
                    }
                });
            });
            return base;
        }, merge = helpers.merge = function (base, master) {
            //Merge properties in left object over to a shallow clone of object right.
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift({});
            return extend.apply(null, args);
        }, indexOf = helpers.indexOf = function (arrayToSearch, item) {
        }, where = helpers.where = function (collection, filterCallback) {
        }, findNextWhere = helpers.findNextWhere = function (arrayToSearch, filterCallback, startIndex) {
            // Default to start of the array
            if (!startIndex) {
                startIndex = -1;
            }
            for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        }, findPreviousWhere = helpers.findPreviousWhere = function (arrayToSearch, filterCallback, startIndex) {
        }, inherits = helpers.inherits = function (extensions) {
            //Basic javascript inheritance based on the model created in Backbone.js
            var parent = this;
            var ChartElement = extensions && extensions.hasOwnProperty('constructor') ? extensions.constructor : function () {
                return parent.apply(this, arguments);
            };
            var Surrogate = function () {
                this.constructor = ChartElement;
            };
            Surrogate.prototype = parent.prototype;
            ChartElement.prototype = new Surrogate();
            ChartElement.extend = inherits;
            if (extensions)
                extend(ChartElement.prototype, extensions);
            ChartElement.__super__ = parent.prototype;
            return ChartElement;
        }, noop = helpers.noop = function () {
        }, uid = helpers.uid = function () {
            var id = 0;
            return function () {
                return 'chart-' + id++;
            };
        }(), warn = helpers.warn = function (str) {
        }, amd = helpers.amd = typeof define === 'function' && define.amd,
        //-- Math methods
        isNumber = helpers.isNumber = function (n) {
        }, max = helpers.max = function (array) {
        }, min = helpers.min = function (array) {
            return Math.min.apply(Math, array);
        }, cap = helpers.cap = function (valueToCap, maxValue, minValue) {
        }, getDecimalPlaces = helpers.getDecimalPlaces = function (num) {
        }, toRadians = helpers.radians = function (degrees) {
        },
        // Gets the angle from vertical upright to the point about a centre.
        getAngleFromPoint = helpers.getAngleFromPoint = function (centrePoint, anglePoint) {
        }, aliasPixel = helpers.aliasPixel = function (pixelWidth) {
        }, splineCurve = helpers.splineCurve = function (FirstPoint, MiddlePoint, AfterPoint, t) {
        }, calculateOrderOfMagnitude = helpers.calculateOrderOfMagnitude = function (val) {
        }, calculateScaleRange = helpers.calculateScaleRange = function (valuesArray, drawingSize, textSize, startFromZero, integersOnly) {
        },
        /* jshint ignore:start */
        // Blows up jshint errors based on the new Function constructor
        //Templating methods
        //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
        template = helpers.template = function (templateString, valuesObject) {
        },
        /* jshint ignore:end */
        generateLabels = helpers.generateLabels = function (templateString, numberOfSteps, graphMin, stepValue) {
        },
        //--Animation methods
        //Easing functions adapted from Robert Penner's easing equations
        //http://www.robertpenner.com/easing/
        easingEffects = helpers.easingEffects = {
            linear: function (t) {
            },
            easeInQuad: function (t) {
            },
            easeOutQuad: function (t) {
            },
            easeInOutQuad: function (t) {
            },
            easeInCubic: function (t) {
            },
            easeOutCubic: function (t) {
            },
            easeInOutCubic: function (t) {
            },
            easeInQuart: function (t) {
            },
            easeOutQuart: function (t) {
            },
            easeInOutQuart: function (t) {
            },
            easeInQuint: function (t) {
            },
            easeOutQuint: function (t) {
                return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
            },
            easeInOutQuint: function (t) {
            },
            easeInSine: function (t) {
            },
            easeOutSine: function (t) {
            },
            easeInOutSine: function (t) {
            },
            easeInExpo: function (t) {
            },
            easeOutExpo: function (t) {
            },
            easeInOutExpo: function (t) {
            },
            easeInCirc: function (t) {
            },
            easeOutCirc: function (t) {
            },
            easeInOutCirc: function (t) {
            },
            easeInElastic: function (t) {
            },
            easeOutElastic: function (t) {
            },
            easeInOutElastic: function (t) {
            },
            easeInBack: function (t) {
            },
            easeOutBack: function (t) {
            },
            easeInOutBack: function (t) {
            },
            easeInBounce: function (t) {
            },
            easeOutBounce: function (t) {
            },
            easeInOutBounce: function (t) {
            }
        },
        //Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimFrame = helpers.requestAnimFrame = function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            };
        }(), cancelAnimFrame = helpers.cancelAnimFrame = function () {
            return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (callback) {
            };
        }(), animationLoop = helpers.animationLoop = function (callback, totalSteps, easingString, onProgress, onComplete, chartInstance) {
        },
        //-- DOM methods
        getRelativePosition = helpers.getRelativePosition = function (evt) {
        }, addEvent = helpers.addEvent = function (node, eventType, method) {
            if (node.addEventListener) {
                node.addEventListener(eventType, method);
            } else if (node.attachEvent) {
                node.attachEvent('on' + eventType, method);
            } else {
                node['on' + eventType] = method;
            }
        }, removeEvent = helpers.removeEvent = function (node, eventType, handler) {
        }, bindEvents = helpers.bindEvents = function (chartInstance, arrayOfEvents, handler) {
        }, unbindEvents = helpers.unbindEvents = function (chartInstance, arrayOfEvents) {
        }, getMaximumWidth = helpers.getMaximumWidth = function (domNode) {
            var container = domNode.parentNode, padding = parseInt(getStyle(container, 'padding-left')) + parseInt(getStyle(container, 'padding-right'));
            // TODO = check cross browser stuff with this.
            return container ? container.clientWidth - padding : 0;
        }, getMaximumHeight = helpers.getMaximumHeight = function (domNode) {
        }, getStyle = helpers.getStyle = function (el, property) {
            return el.currentStyle ? el.currentStyle[property] : document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
        }, getMaximumSize = helpers.getMaximumSize = helpers.getMaximumWidth,
        // legacy support
        retinaScale = helpers.retinaScale = function (chart) {
            var ctx = chart.ctx, width = chart.canvas.width, height = chart.canvas.height;
            if (window.devicePixelRatio) {
                ctx.canvas.style.width = width + 'px';
                ctx.canvas.style.height = height + 'px';
                ctx.canvas.height = height * window.devicePixelRatio;
                ctx.canvas.width = width * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        },
        //-- Canvas methods
        clear = helpers.clear = function (chart) {
            chart.ctx.clearRect(0, 0, chart.width, chart.height);
        }, fontString = helpers.fontString = function (pixelSize, fontStyle, fontFamily) {
        }, longestText = helpers.longestText = function (ctx, font, arrayOfStrings) {
        }, drawRoundedRectangle = helpers.drawRoundedRectangle = function (ctx, x, y, width, height, radius) {
        };
    //Store a reference to each instance - allowing us to globally resize chart instances on window resize.
    //Destroy method on the chart will remove the instance of the chart from this reference.
    Chart.instances = {};
    Chart.Type = function (data, options, chart) {
        this.options = options;
        this.chart = chart;
        this.id = uid();
        //Add the chart instance to the global namespace
        Chart.instances[this.id] = this;
        // Initialize is always called when a chart type is created
        // By default it is a no op, but it should be extended
        if (options.responsive) {
            this.resize();
        }
        this.initialize.call(this, data);
    };
    //Core methods that'll be a part of every chart type
    extend(Chart.Type.prototype, {
        initialize: function () {
        },
        clear: function () {
            clear(this.chart);
            return this;
        },
        stop: function () {
            // Stops any current animation loop occuring
            Chart.animationService.cancelAnimation(this);
            return this;
        },
        resize: function (callback) {
            this.stop();
            var canvas = this.chart.canvas, newWidth = getMaximumWidth(this.chart.canvas), newHeight = this.options.maintainAspectRatio ? newWidth / this.chart.aspectRatio : getMaximumHeight(this.chart.canvas);
            canvas.width = this.chart.width = newWidth;
            canvas.height = this.chart.height = newHeight;
            retinaScale(this.chart);
            if (typeof callback === 'function') {
                callback.apply(this, Array.prototype.slice.call(arguments, 1));
            }
            return this;
        },
        reflow: noop,
        render: function (reflow) {
            if (reflow) {
                this.reflow();
            }
            if (this.options.animation && !reflow) {
                var animation = new Chart.Animation();
                animation.numSteps = this.options.animationSteps;
                animation.easing = this.options.animationEasing;
                // render function
                animation.render = function (chartInstance, animationObject) {
                    var easingFunction = helpers.easingEffects[animationObject.easing];
                    var stepDecimal = animationObject.currentStep / animationObject.numSteps;
                    var easeDecimal = easingFunction(stepDecimal);
                    chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);
                };
                // user events
                animation.onAnimationProgress = this.options.onAnimationProgress;
                animation.onAnimationComplete = this.options.onAnimationComplete;
                Chart.animationService.addAnimation(this, animation);
            } else {
                this.draw();
                this.options.onAnimationComplete.call(this);
            }
            return this;
        },
        generateLegend: function () {
        },
        destroy: function () {
        },
        showTooltip: function (ChartElements, forceRedraw) {
        },
        toBase64Image: function () {
        }
    });
    Chart.Type.extend = function (extensions) {
        var parent = this;
        var ChartType = function () {
            return parent.apply(this, arguments);
        };
        //Copy the prototype object of the this class
        ChartType.prototype = clone(parent.prototype);
        //Now overwrite some of the properties in the base class with the new extensions
        extend(ChartType.prototype, extensions);
        ChartType.extend = Chart.Type.extend;
        if (extensions.name || parent.prototype.name) {
            var chartName = extensions.name || parent.prototype.name;
            //Assign any potential default values of the new chart type
            //If none are defined, we'll use a clone of the chart type this is being extended from.
            //I.e. if we extend a line chart, we'll use the defaults from the line chart if our new chart
            //doesn't define some defaults of their own.
            var baseDefaults = Chart.defaults[parent.prototype.name] ? clone(Chart.defaults[parent.prototype.name]) : {};
            Chart.defaults[chartName] = extend(baseDefaults, extensions.defaults);
            Chart.types[chartName] = ChartType;
            //Register this new chart type in the Chart prototype
            Chart.prototype[chartName] = function (data, options) {
                var config = merge(Chart.defaults.global, Chart.defaults[chartName], options || {});
                return new ChartType(data, config, this);
            };
        } else {
            warn('Name not provided for this chart, so it hasn\'t been registered');
        }
        return parent;
    };
    Chart.Element = function (configuration) {
        extend(this, configuration);
        this.initialize.apply(this, arguments);
        this.save();
    };
    extend(Chart.Element.prototype, {
        initialize: function () {
        },
        restore: function (props) {
        },
        save: function () {
            this._saved = clone(this);
            delete this._saved._saved;
            return this;
        },
        update: function (newProps) {
            each(newProps, function (value, key) {
                this._saved[key] = this[key];
                this[key] = value;
            }, this);
            return this;
        },
        transition: function (props, ease) {
            each(props, function (value, key) {
                this[key] = (value - this._saved[key]) * ease + this._saved[key];
            }, this);
            return this;
        },
        tooltipPosition: function () {
        },
        hasValue: function () {
        }
    });
    Chart.Element.extend = inherits;
    Chart.Point = Chart.Element.extend({
        display: true,
        inRange: function (chartX, chartY) {
        },
        draw: function () {
        }
    });
    Chart.Arc = Chart.Element.extend({
        inRange: function (chartX, chartY) {
        },
        tooltipPosition: function () {
        },
        draw: function (animationPercent) {
            var easingDecimal = animationPercent || 1;
            var ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.outerRadius < 0 ? 0 : this.outerRadius, this.startAngle, this.endAngle);
            ctx.arc(this.x, this.y, this.innerRadius < 0 ? 0 : this.innerRadius, this.endAngle, this.startAngle, true);
            ctx.closePath();
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.fillStyle = this.fillColor;
            ctx.fill();
            ctx.lineJoin = 'bevel';
            if (this.showStroke) {
                ctx.stroke();
            }
        }
    });
    Chart.Rectangle = Chart.Element.extend({
        draw: function () {
        },
        height: function () {
        },
        inRange: function (chartX, chartY) {
        }
    });
    Chart.Animation = Chart.Element.extend({
        currentStep: null,
        // the current animation step
        numSteps: 60,
        // default number of steps
        easing: '',
        // the easing to use for this animation
        render: null,
        // render function used by the animation service
        onAnimationProgress: null,
        // user specified callback to fire on each step of the animation 
        onAnimationComplete: null
    });
    Chart.Tooltip = Chart.Element.extend({
        draw: function () {
        }
    });
    Chart.MultiTooltip = Chart.Element.extend({
        initialize: function () {
        },
        getLineHeight: function (index) {
        },
        draw: function () {
        }
    });
    Chart.Scale = Chart.Element.extend({
        initialize: function () {
        },
        buildYLabels: function () {
        },
        addXLabel: function (label) {
        },
        removeXLabel: function () {
        },
        // Fitting loop to rotate x Labels and figure out what fits there, and also calculate how many Y steps to use
        fit: function () {
        },
        calculateXLabelRotation: function () {
        },
        // Needs to be overidden in each Chart type
        // Otherwise we need to pass all the data into the scale class
        calculateYRange: noop,
        drawingArea: function () {
        },
        calculateY: function (value) {
        },
        calculateX: function (index) {
        },
        update: function (newProps) {
        },
        draw: function () {
        }
    });
    Chart.RadialScale = Chart.Element.extend({
        initialize: function () {
        },
        calculateCenterOffset: function (value) {
        },
        update: function () {
        },
        buildYLabels: function () {
        },
        getCircumference: function () {
        },
        setScaleSize: function () {
        },
        setCenterPoint: function (leftMovement, rightMovement) {
        },
        getIndexAngle: function (index) {
        },
        getPointPosition: function (index, distanceFromCenter) {
        },
        draw: function () {
        }
    });
    Chart.animationService = {
        frameDuration: 17,
        animations: [],
        dropFrames: 0,
        addAnimation: function (chartInstance, animationObject) {
            for (var index = 0; index < this.animations.length; ++index) {
                if (this.animations[index].chartInstance === chartInstance) {
                    // replacing an in progress animation
                    this.animations[index].animationObject = animationObject;
                    return;
                }
            }
            this.animations.push({
                chartInstance: chartInstance,
                animationObject: animationObject
            });
            // If there are no animations queued, manually kickstart a digest, for lack of a better word
            if (this.animations.length == 1) {
                helpers.requestAnimFrame.call(window, this.digestWrapper);
            }
        },
        // Cancel the animation for a given chart instance
        cancelAnimation: function (chartInstance) {
            var index = helpers.findNextWhere(this.animations, function (animationWrapper) {
                return animationWrapper.chartInstance === chartInstance;
            });
            if (index) {
                this.animations.splice(index, 1);
            }
        },
        // calls startDigest with the proper context
        digestWrapper: function () {
            Chart.animationService.startDigest.call(Chart.animationService);
        },
        startDigest: function () {
            var startTime = Date.now();
            var framesToDrop = 0;
            if (this.dropFrames > 1) {
                framesToDrop = Math.floor(this.dropFrames);
                this.dropFrames -= framesToDrop;
            }
            for (var i = 0; i < this.animations.length; i++) {
                if (this.animations[i].animationObject.currentStep === null) {
                    this.animations[i].animationObject.currentStep = 0;
                }
                this.animations[i].animationObject.currentStep += 1 + framesToDrop;
                if (this.animations[i].animationObject.currentStep > this.animations[i].animationObject.numSteps) {
                    this.animations[i].animationObject.currentStep = this.animations[i].animationObject.numSteps;
                }
                this.animations[i].animationObject.render(this.animations[i].chartInstance, this.animations[i].animationObject);
                // Check if executed the last frame.
                if (this.animations[i].animationObject.currentStep == this.animations[i].animationObject.numSteps) {
                    // Call onAnimationComplete
                    this.animations[i].animationObject.onAnimationComplete.call(this.animations[i].chartInstance);
                    // Remove the animation.
                    this.animations.splice(i, 1);
                    // Keep the index in place to offset the splice
                    i--;
                }
            }
            var endTime = Date.now();
            var delay = endTime - startTime - this.frameDuration;
            var frameDelay = delay / this.frameDuration;
            if (frameDelay > 1) {
                this.dropFrames += frameDelay;
            }
            // Do we have more stuff to animate?
            if (this.animations.length > 0) {
                helpers.requestAnimFrame.call(window, this.digestWrapper);
            }
        }
    };
    // Attach global event to resize each chart instance when the browser resizes
    helpers.addEvent(window, 'resize', function () {
        // Basic debounce of resize function so it doesn't hurt performance when resizing browser.
        var timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                each(Chart.instances, function (instance) {
                    // If the responsive flag is set in the chart instance config
                    // Cascade the resize event down to the chart.
                    if (instance.options.responsive) {
                        instance.resize(instance.render, true);
                    }
                });
            }, 50);
        };
    }());
    if (amd) {
        define('Chart', [], function () {
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = Chart;
    }
    root.Chart = Chart;
    Chart.noConflict = function () {
    };
}.call(this));
(function () {
    'use strict';
    var root = this, Chart = root.Chart, helpers = Chart.helpers;
    var defaultConfig = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,
        //String - Colour of the grid lines
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - If there is a stroke on each bar
        barShowStroke: true,
        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,
        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,
        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,
        //String - A legend template
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span class="<%=name.toLowerCase()%>-legend-icon" style="background-color:<%=datasets[i].fillColor%>"></span><span class="<%=name.toLowerCase()%>-legend-text"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'
    };
    Chart.Type.extend({
        name: 'Bar',
        defaults: defaultConfig,
        initialize: function (data) {
        },
        update: function () {
        },
        eachBars: function (callback) {
        },
        getBarsAtEvent: function (e) {
        },
        buildScale: function (labels) {
        },
        addData: function (valuesArray, label) {
        },
        removeData: function () {
        },
        reflow: function () {
        },
        draw: function (ease) {
        }
    });
}.call(this));
(function () {
    'use strict';
    var root = this, Chart = root.Chart,
        //Cache a local reference to Chart.helpers
        helpers = Chart.helpers;
    var defaultConfig = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: '#fff',
        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,
        //The percentage of the chart that we cut out of the middle.
        percentageInnerCutout: 50,
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: 'easeOutBounce',
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //String - A legend template
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span class="<%=name.toLowerCase()%>-legend-icon" style="background-color:<%=segments[i].fillColor%>"></span><span class="<%=name.toLowerCase()%>-legend-text"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>'
    };
    Chart.Type.extend({
        //Passing in a name registers this chart in the Chart namespace
        name: 'Doughnut',
        //Providing a defaults will also register the defaults in the chart namespace
        defaults: defaultConfig,
        //Initialize is fired when the chart is initialized - Data is passed in as a parameter
        //Config is automatically merged by the core of Chart.js, and is available at this.options
        initialize: function (data) {
            //Declare segments as a static property to prevent inheriting across the Chart type prototype
            this.segments = [];
            this.outerRadius = (helpers.min([
                this.chart.width,
                this.chart.height
            ]) - this.options.segmentStrokeWidth / 2) / 2;
            this.SegmentArc = Chart.Arc.extend({
                ctx: this.chart.ctx,
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            //Set up tooltip events on the chart
            if (this.options.showTooltips) {
                helpers.bindEvents(this, this.options.tooltipEvents, function (evt) {
                });
            }
            this.calculateTotal(data);
            helpers.each(data, function (datapoint, index) {
                if (!datapoint.color) {
                    datapoint.color = 'hsl(' + 360 * index / data.length + ', 100%, 50%)';
                }
                this.addData(datapoint, index, true);
            }, this);
            this.render();
        },
        getSegmentsAtEvent: function (e) {
        },
        addData: function (segment, atIndex, silent) {
            var index = atIndex !== undefined ? atIndex : this.segments.length;
            if (typeof segment.color === 'undefined') {
                segment.color = Chart.defaults.global.segmentColorDefault[index % Chart.defaults.global.segmentColorDefault.length];
                segment.highlight = Chart.defaults.global.segmentHighlightColorDefaults[index % Chart.defaults.global.segmentHighlightColorDefaults.length];
            }
            this.segments.splice(index, 0, new this.SegmentArc({
                value: segment.value,
                outerRadius: this.options.animateScale ? 0 : this.outerRadius,
                innerRadius: this.options.animateScale ? 0 : this.outerRadius / 100 * this.options.percentageInnerCutout,
                fillColor: segment.color,
                highlightColor: segment.highlight || segment.color,
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                startAngle: Math.PI * 1.5,
                circumference: this.options.animateRotate ? 0 : this.calculateCircumference(segment.value),
                label: segment.label
            }));
            if (!silent) {
                this.reflow();
                this.update();
            }
        },
        calculateCircumference: function (value) {
            if (this.total > 0) {
                return Math.PI * 2 * (value / this.total);
            } else {
                return 0;
            }
        },
        calculateTotal: function (data) {
            this.total = 0;
            helpers.each(data, function (segment) {
                this.total += Math.abs(segment.value);
            }, this);
        },
        update: function () {
        },
        removeData: function (atIndex) {
        },
        reflow: function () {
            helpers.extend(this.SegmentArc.prototype, {
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            this.outerRadius = (helpers.min([
                this.chart.width,
                this.chart.height
            ]) - this.options.segmentStrokeWidth / 2) / 2;
            helpers.each(this.segments, function (segment) {
                segment.update({
                    outerRadius: this.outerRadius,
                    innerRadius: this.outerRadius / 100 * this.options.percentageInnerCutout
                });
            }, this);
        },
        draw: function (easeDecimal) {
            var animDecimal = easeDecimal ? easeDecimal : 1;
            this.clear();
            helpers.each(this.segments, function (segment, index) {
                segment.transition({
                    circumference: this.calculateCircumference(segment.value),
                    outerRadius: this.outerRadius,
                    innerRadius: this.outerRadius / 100 * this.options.percentageInnerCutout
                }, animDecimal);
                segment.endAngle = segment.startAngle + segment.circumference;
                segment.draw();
                if (index === 0) {
                    segment.startAngle = Math.PI * 1.5;
                }
                //Check to see if it's the last segment, if not get the next and update the start angle
                if (index < this.segments.length - 1) {
                    this.segments[index + 1].startAngle = segment.endAngle;
                }
            }, this);
        }
    });
    Chart.types.Doughnut.extend({
        name: 'Pie',
        defaults: helpers.merge(defaultConfig, { percentageInnerCutout: 0 })
    });
}.call(this));
(function () {
    'use strict';
    var root = this, Chart = root.Chart, helpers = Chart.helpers;
    var defaultConfig = {
        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,
        //String - Colour of the grid lines
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.4,
        //Boolean - Whether to show a dot for each point
        pointDot: true,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,
        //String - A legend template
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span class="<%=name.toLowerCase()%>-legend-icon" style="background-color:<%=datasets[i].strokeColor%>"></span><span class="<%=name.toLowerCase()%>-legend-text"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>',
        //Boolean - Whether to horizontally center the label and point dot inside the grid
        offsetGridLines: false
    };
    Chart.Type.extend({
        name: 'Line',
        defaults: defaultConfig,
        initialize: function (data) {
        },
        update: function () {
        },
        eachPoints: function (callback) {
        },
        getPointsAtEvent: function (e) {
        },
        buildScale: function (labels) {
        },
        addData: function (valuesArray, label) {
        },
        removeData: function () {
        },
        reflow: function () {
        },
        draw: function (ease) {
        }
    });
}.call(this));
(function () {
    'use strict';
    var root = this, Chart = root.Chart,
        //Cache a local reference to Chart.helpers
        helpers = Chart.helpers;
    var defaultConfig = {
        //Boolean - Show a backdrop to the scale label
        scaleShowLabelBackdrop: true,
        //String - The colour of the label backdrop
        scaleBackdropColor: 'rgba(255,255,255,0.75)',
        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,
        //Number - The backdrop padding above & below the label in pixels
        scaleBackdropPaddingY: 2,
        //Number - The backdrop padding to the side of the label in pixels
        scaleBackdropPaddingX: 2,
        //Boolean - Show line for each value in the scale
        scaleShowLine: true,
        //Boolean - Stroke a line around each segment in the chart
        segmentShowStroke: true,
        //String - The colour of the stroke on each segment.
        segmentStrokeColor: '#fff',
        //Number - The width of the stroke value in pixels
        segmentStrokeWidth: 2,
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect.
        animationEasing: 'easeOutBounce',
        //Boolean - Whether to animate the rotation of the chart
        animateRotate: true,
        //Boolean - Whether to animate scaling the chart from the centre
        animateScale: false,
        //String - A legend template
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span class="<%=name.toLowerCase()%>-legend-icon" style="background-color:<%=segments[i].fillColor%>"></span><span class="<%=name.toLowerCase()%>-legend-text"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>'
    };
    Chart.Type.extend({
        //Passing in a name registers this chart in the Chart namespace
        name: 'PolarArea',
        //Providing a defaults will also register the defaults in the chart namespace
        defaults: defaultConfig,
        //Initialize is fired when the chart is initialized - Data is passed in as a parameter
        //Config is automatically merged by the core of Chart.js, and is available at this.options
        initialize: function (data) {
        },
        getSegmentsAtEvent: function (e) {
        },
        addData: function (segment, atIndex, silent) {
        },
        removeData: function (atIndex) {
        },
        calculateTotal: function (data) {
        },
        updateScaleRange: function (datapoints) {
        },
        update: function () {
        },
        reflow: function () {
        },
        draw: function (ease) {
        }
    });
}.call(this));
(function () {
    'use strict';
    var root = this, Chart = root.Chart, helpers = Chart.helpers;
    Chart.Type.extend({
        name: 'Radar',
        defaults: {
            //Boolean - Whether to show lines for each scale point
            scaleShowLine: true,
            //Boolean - Whether we show the angle lines out of the radar
            angleShowLineOut: true,
            //Boolean - Whether to show labels on the scale
            scaleShowLabels: false,
            // Boolean - Whether the scale should begin at zero
            scaleBeginAtZero: true,
            //String - Colour of the angle line
            angleLineColor: 'rgba(0,0,0,.1)',
            //Number - Pixel width of the angle line
            angleLineWidth: 1,
            //Number - Interval at which to draw angle lines ("every Nth point")
            angleLineInterval: 1,
            //String - Point label font declaration
            pointLabelFontFamily: '\'Arial\'',
            //String - Point label font weight
            pointLabelFontStyle: 'normal',
            //Number - Point label font size in pixels
            pointLabelFontSize: 10,
            //String - Point label font colour
            pointLabelFontColor: '#666',
            //Boolean - Whether to show a dot for each point
            pointDot: true,
            //Number - Radius of each point dot in pixels
            pointDotRadius: 3,
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,
            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,
            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,
            //String - A legend template
            legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span class="<%=name.toLowerCase()%>-legend-icon" style="background-color:<%=datasets[i].strokeColor%>"></span><span class="<%=name.toLowerCase()%>-legend-text"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'
        },
        initialize: function (data) {
        },
        eachPoints: function (callback) {
        },
        getPointsAtEvent: function (evt) {
        },
        buildScale: function (data) {
        },
        updateScaleRange: function (datasets) {
        },
        addData: function (valuesArray, label) {
        },
        removeData: function () {
        },
        update: function () {
        },
        reflow: function () {
        },
        draw: function (ease) {
        }
    });
}.call(this));