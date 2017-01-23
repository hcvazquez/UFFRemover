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
        g.unified = f();
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
                (function (global) {
                    /**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unified
 * @fileoverview Pluggable text processing interface.
 */
                    'use strict';
                    /* Dependencies. */
                    var events = require('events');
                    var has = require('has');
                    var once = require('once');
                    var extend = require('extend');
                    var bail = require('bail');
                    var vfile = require('vfile');
                    var trough = require('trough');
                    var buffer = require('is-buffer');
                    var string = require('x-is-string');
                    /* Expose an abstract processor. */
                    module.exports = unified().abstract();
                    /* Methods. */
                    var slice = [].slice;
                    /* Process pipeline. */
                    var pipeline = trough().use(function (p, ctx) {
                        ctx.tree = p.parse(ctx.file, ctx.options);
                    }).use(function (p, ctx, next) {
                        p.run(ctx.tree, ctx.file, function (err, tree, file) {
                            if (err) {
                                next(err);
                            } else {
                                ctx.tree = tree;
                                ctx.file = file;
                                next();
                            }
                        });
                    }).use(function (p, ctx) {
                        ctx.file.contents = p.stringify(ctx.tree, ctx.file, ctx.options);
                    });
                    /**
 * Function to create the first processor.
 *
 * @return {Function} - First processor.
 */
                    function unified() {
                        var attachers = [];
                        var transformers = trough();
                        var namespace = {};
                        var chunks = [];
                        var emitter = new events.EventEmitter();
                        var ended = false;
                        var concrete = true;
                        var settings;
                        var key;
                        /* Mix in methods. */
                        for (key in emitter) {
                            processor[key] = emitter[key];
                        }
                        /* Throw as early as possible.
   * As events are triggered synchroneously, the stack
   * is preserved. */
                        processor.on('pipe', function () {
                            assertConcrete();
                        });
                        /* Data management. */
                        processor.data = data;
                        /* Lock. */
                        processor.abstract = abstract;
                        /* Plug-ins. */
                        processor.attachers = attachers;
                        processor.use = use;
                        /* Streaming. */
                        processor.writable = true;
                        processor.readable = true;
                        processor.write = write;
                        processor.end = end;
                        processor.pipe = pipe;
                        /* API. */
                        processor.parse = parse;
                        processor.stringify = stringify;
                        processor.run = run;
                        processor.process = process;
                        /* Expose. */
                        return processor;
                        /**
   * Create a new processor based on the processor
   * in the current scope.
   *
   * @return {Processor} - New concrete processor based
   *   on the descendant processor.
   */
                        function processor() {
                            var destination = unified();
                            var length = attachers.length;
                            var index = -1;
                            while (++index < length) {
                                destination.use.apply(null, attachers[index]);
                            }
                            destination.data(extend(true, {}, namespace));
                            return destination;
                        }
                        /* Helpers. */
                        /**
   * Assert a parser is available.
   *
   * @param {string} name - Name of callee.
   */
                        function assertParser(name) {
                            if (!isParser(processor.Parser)) {
                                throw new Error('Cannot `' + name + '` without `Parser`');
                            }
                        }
                        /**
   * Assert a compiler is available.
   *
   * @param {string} name - Name of callee.
   */
                        function assertCompiler(name) {
                            if (!isCompiler(processor.Compiler)) {
                                throw new Error('Cannot `' + name + '` without `Compiler`');
                            }
                        }
                        /**
   * Assert the processor is concrete.
   *
   * @param {string} name - Name of callee.
   */
                        function assertConcrete(name) {
                            if (!concrete) {
                                throw new Error('Cannot ' + (name ? 'invoke `' + name + '` on' : 'pipe into') + ' abstract processor.\n' + 'To make the processor concrete, invoke it: ' + 'use `processor()` instead of `processor`.');
                            }
                        }
                        /**
   * Assert `node` is a Unist node.
   *
   * @param {*} node - Value to check.
   */
                        function assertNode(node) {
                            if (!isNode(node)) {
                                throw new Error('Expected node, got `' + node + '`');
                            }
                        }
                        /**
   * Assert, if no `done` is given, that `complete` is
   * `true`.
   *
   * @param {string} name - Name of callee.
   * @param {boolean} complete - Whether an async process
   *   is complete.
   * @param {Function?} done - Optional handler of async
   *   results.
   */
                        function assertDone(name, complete, done) {
                            if (!complete && !done) {
                                throw new Error('Expected `done` to be given to `' + name + '` ' + 'as async plug-ins are used');
                            }
                        }
                        /**
   * Abstract: used to signal an abstract processor which
   * should made concrete before using.
   *
   * For example, take unified itself.  It’s abstract.
   * Plug-ins should not be added to it.  Rather, it should
   * be made concrete (by invoking it) before modifying it.
   *
   * In essence, always invoke this when exporting a
   * processor.
   *
   * @return {Processor} - The operated on processor.
   */
                        function abstract() {
                            concrete = false;
                            return processor;
                        }
                        /**
   * Data management.
   *
   * Getter / setter for processor-specific informtion.
   *
   * @param {string} key - Key to get or set.
   * @param {*} value - Value to set.
   * @return {*} - Either the operator on processor in
   *   setter mode; or the value stored as `key` in
   *   getter mode.
   */
                        function data(key, value) {
                            assertConcrete('data');
                            if (string(key)) {
                                /* Set `key`. */
                                if (arguments.length === 2) {
                                    namespace[key] = value;
                                    return processor;
                                }
                                /* Get `key`. */
                                return has(namespace, key) && namespace[key] || null;
                            }
                            /* Get space. */
                            if (!key) {
                                return namespace;
                            }
                            /* Set space. */
                            namespace = key;
                            return processor;
                        }
                        /**
   * Plug-in management.
   *
   * Pass it:
   * *   an attacher and options,
   * *   a list of attachers and options for all of them;
   * *   a tuple of one attacher and options.
   * *   a matrix: list containing any of the above and
   *     matrices.
   * *   a processor: another processor to use all its
   *     plugins (except parser if there’s already one).
   *
   * @param {...*} value - See description.
   * @return {Processor} - The operated on processor.
   */
                        function use(value) {
                            var args = slice.call(arguments, 0);
                            var params = args.slice(1);
                            var parser;
                            var index;
                            var length;
                            var transformer;
                            var result;
                            assertConcrete('use');
                            /* Multiple attachers. */
                            if ('length' in value && !isFunction(value)) {
                                index = -1;
                                length = value.length;
                                if (!isFunction(value[0])) {
                                    /* Matrix of things. */
                                    while (++index < length) {
                                        use(value[index]);
                                    }
                                } else if (isFunction(value[1])) {
                                    /* List of things. */
                                    while (++index < length) {
                                        use.apply(null, [value[index]].concat(params));
                                    }
                                } else {
                                    /* Arguments. */
                                    use.apply(null, value);
                                }
                                return processor;
                            }
                            /* Store attacher. */
                            attachers.push(args);
                            /* Use a processor (except its parser if there’s already one.
     * Note that the processor is stored on `attachers`, making
     * it possibly mutating in the future, but also ensuring
     * the parser isn’t overwritten in the future either. */
                            if (isProcessor(value)) {
                                parser = processor.Parser;
                                result = use(value.attachers);
                                if (parser) {
                                    processor.Parser = parser;
                                }
                                return result;
                            }
                            /* Single attacher. */
                            transformer = value.apply(null, [processor].concat(params));
                            if (isFunction(transformer)) {
                                transformers.use(transformer);
                            }
                            return processor;
                        }
                        /**
   * Parse a file (in string or VFile representation)
   * into a Unist node using the `Parser` on the
   * processor.
   *
   * @param {VFile?} [file] - File to process.
   * @param {Object?} [options] - Configuration.
   * @return {Node} - Unist node.
   */
                        function parse(file, options) {
                            assertConcrete('parse');
                            assertParser('parse');
                            return new processor.Parser(vfile(file), options, processor).parse();
                        }
                        /**
   * Run transforms on a Unist node representation of a file
   * (in string or VFile representation).
   *
   * @param {Node} node - Unist node.
   * @param {(string|VFile)?} [file] - File representation.
   * @param {Function?} [done] - Callback.
   * @return {Node} - The given or resulting Unist node.
   */
                        function run(node, file, done) {
                            var complete = false;
                            var result;
                            assertConcrete('run');
                            assertNode(node);
                            result = node;
                            if (!done && isFunction(file)) {
                                done = file;
                                file = null;
                            }
                            transformers.run(node, vfile(file), function (err, tree, file) {
                                complete = true;
                                result = tree || node;
                                (done || bail)(err, tree, file);
                            });
                            assertDone('run', complete, done);
                            return result;
                        }
                        /**
   * Stringify a Unist node representation of a file
   * (in string or VFile representation) into a string
   * using the `Compiler` on the processor.
   *
   * @param {Node} node - Unist node.
   * @param {(string|VFile)?} [file] - File representation.
   * @param {Object?} [options] - Configuration.
   * @return {string} - String representation.
   */
                        function stringify(node, file, options) {
                            assertConcrete('stringify');
                            assertCompiler('stringify');
                            assertNode(node);
                            if (!options && !string(file) && !buffer(file) && !(typeof file === 'object' && 'messages' in file)) {
                                options = file;
                                file = null;
                            }
                            return new processor.Compiler(vfile(file), options, processor).compile(node);
                        }
                        /**
   * Parse a file (in string or VFile representation)
   * into a Unist node using the `Parser` on the processor,
   * then run transforms on that node, and compile the
   * resulting node using the `Compiler` on the processor,
   * and store that result on the VFile.
   *
   * @param {(string|VFile)?} file - File representation.
   * @param {Object?} [options] - Configuration.
   * @param {Function?} [done] - Callback.
   * @return {VFile} - The given or resulting VFile.
   */
                        function process(file, options, done) {
                            var complete = false;
                            assertConcrete('process');
                            assertParser('process');
                            assertCompiler('process');
                            if (!done && isFunction(options)) {
                                done = options;
                                options = null;
                            }
                            file = vfile(file);
                            pipeline.run(processor, {
                                file: file,
                                options: options || {}
                            }, function (err) {
                                complete = true;
                                if (done) {
                                    done(err, file);
                                } else {
                                    bail(err);
                                }
                            });
                            assertDone('process', complete, done);
                            return file;
                        }
                        /* Streams. */
                        /**
   * Write a chunk into memory.
   *
   * @param {(Buffer|string)?} chunk - Value to write.
   * @param {string?} [encoding] - Encoding.
   * @param {Function?} [callback] - Callback.
   * @return {boolean} - Whether the write was succesful.
   */
                        function write(chunk, encoding, callback) {
                            assertConcrete('write');
                            if (isFunction(encoding)) {
                                callback = encoding;
                                encoding = null;
                            }
                            if (ended) {
                                throw new Error('Did not expect `write` after `end`');
                            }
                            chunks.push((chunk || '').toString(encoding || 'utf8'));
                            if (callback) {
                                callback();
                            }
                            /* Signal succesful write. */
                            return true;
                        }
                        /**
   * End the writing.  Passes all arguments to a final
   * `write`.  Starts the process, which will trigger
   * `error`, with a fatal error, if any; `data`, with
   * the generated document in `string` form, if
   * succesful.  If messages are triggered during the
   * process, those are triggerd as `warning`s.
   *
   * @return {boolean} - Whether the last write was
   *   succesful.
   */
                        function end() {
                            assertConcrete('end');
                            assertParser('end');
                            assertCompiler('end');
                            write.apply(null, arguments);
                            ended = true;
                            process(chunks.join(''), settings, function (err, file) {
                                var messages = file.messages;
                                var length = messages.length;
                                var index = -1;
                                chunks = settings = null;
                                /* Trigger messages as warnings, except for fatal error. */
                                while (++index < length) {
                                    if (messages[index] !== err) {
                                        processor.emit('warning', messages[index]);
                                    }
                                }
                                if (err) {
                                    /* Don’t enter an infinite error throwing loop. */
                                    global.setTimeout(function () {
                                        processor.emit('error', err);
                                    }, 4);
                                } else {
                                    processor.emit('data', file.contents);
                                    processor.emit('end');
                                }
                            });
                            return true;
                        }
                        /**
   * Pipe the processor into a writable stream.
   *
   * Basically `Stream#pipe`, but inlined and
   * simplified to keep the bundled size down.
   *
   * @see https://github.com/nodejs/node/blob/master/lib/stream.js#L26
   *
   * @param {Stream} dest - Writable stream.
   * @param {Object?} [options] - Processing
   *   configuration.
   * @return {Stream} - The destination stream.
   */
                        function pipe(dest, options) {
                            var onend = once(onended);
                            assertConcrete('pipe');
                            settings = options || {};
                            processor.on('data', ondata);
                            processor.on('error', onerror);
                            processor.on('end', cleanup);
                            processor.on('close', cleanup);
                            /* If the 'end' option is not supplied, dest.end() will be
     * called when the 'end' or 'close' events are received.
     * Only dest.end() once. */
                            if (!dest._isStdio && settings.end !== false) {
                                processor.on('end', onend);
                            }
                            dest.on('error', onerror);
                            dest.on('close', cleanup);
                            dest.emit('pipe', processor);
                            return dest;
                            /** End destination. */
                            function onended() {
                                if (dest.end) {
                                    dest.end();
                                }
                            }
                            /**
     * Handle data.
     *
     * @param {*} chunk - Data to pass through.
     */
                            function ondata(chunk) {
                                if (dest.writable) {
                                    dest.write(chunk);
                                }
                            }
                            /**
     * Clean listeners.
     */
                            function cleanup() {
                                processor.removeListener('data', ondata);
                                processor.removeListener('end', onend);
                                processor.removeListener('error', onerror);
                                processor.removeListener('end', cleanup);
                                processor.removeListener('close', cleanup);
                                dest.removeListener('error', onerror);
                                dest.removeListener('close', cleanup);
                            }
                            /**
     * Close dangling pipes and handle unheard errors.
     *
     * @param {Error} err - Exception.
     */
                            function onerror(err) {
                                var handlers = processor._events.error;
                                cleanup();
                                /* Cannot use `listenerCount` in node <= 0.12. */
                                if (!handlers || handlers.length === 0 || handlers === onerror) {
                                    throw err;    /* Unhandled stream error in pipe. */
                                }
                            }
                        }
                    }
                    /**
 * Check if `node` is a Unist node.
 *
 * @param {*} node - Value.
 * @return {boolean} - Whether `node` is a Unist node.
 */
                    function isNode(node) {
                        return node && string(node.type) && node.type.length !== 0;
                    }
                    /**
 * Check if `fn` is a function.
 *
 * @param {*} fn - Value.
 * @return {boolean} - Whether `fn` is a function.
 */
                    function isFunction(fn) {
                        return typeof fn === 'function';
                    }
                    /**
 * Check if `compiler` is a Compiler.
 *
 * @param {*} compiler - Value.
 * @return {boolean} - Whether `compiler` is a Compiler.
 */
                    function isCompiler(compiler) {
                        return isFunction(compiler) && compiler.prototype && isFunction(compiler.prototype.compile);
                    }
                    /**
 * Check if `parser` is a Parser.
 *
 * @param {*} parser - Value.
 * @return {boolean} - Whether `parser` is a Parser.
 */
                    function isParser(parser) {
                        return isFunction(parser) && parser.prototype && isFunction(parser.prototype.parse);
                    }
                    /**
 * Check if `processor` is a unified processor.
 *
 * @param {*} processor - Value.
 * @return {boolean} - Whether `processor` is a processor.
 */
                    function isProcessor(processor) {
                        return isFunction(processor) && isFunction(processor.use) && isFunction(processor.process);
                    }
                }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            {
                'bail': 2,
                'events': 3,
                'extend': 4,
                'has': 7,
                'is-buffer': 8,
                'once': 9,
                'trough': 13,
                'vfile': 15,
                'x-is-string': 17
            }
        ],
        2: [
            function (require, module, exports) {
                /**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module bail
 * @fileoverview Throw a given error.
 */
                'use strict';
                /* Expose. */
                module.exports = bail;
                /**
 * Throw a given error.
 *
 * @example
 *   bail();
 *
 * @example
 *   bail(new Error('failure'));
 *   // Error: failure
 *   //     at repl:1:6
 *   //     at REPLServer.defaultEval (repl.js:154:27)
 *   //     ...
 *
 * @param {Error?} [err] - Optional error.
 * @throws {Error} - `err`, when given.
 */
                function bail(err) {
                    if (err) {
                        throw err;
                    }
                }
            },
            {}
        ],
        3: [
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
        4: [
            function (require, module, exports) {
                'use strict';
                var hasOwn = Object.prototype.hasOwnProperty;
                var toStr = Object.prototype.toString;
                var isArray = function isArray(arr) {
                    if (typeof Array.isArray === 'function') {
                        return Array.isArray(arr);
                    }
                    return toStr.call(arr) === '[object Array]';
                };
                var isPlainObject = function isPlainObject(obj) {
                    if (!obj || toStr.call(obj) !== '[object Object]') {
                        return false;
                    }
                    var hasOwnConstructor = hasOwn.call(obj, 'constructor');
                    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
                    // Not own constructor property must be Object
                    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
                        return false;
                    }
                    // Own properties are enumerated firstly, so to speed up,
                    // if last one is own, then all properties are own.
                    var key;
                    for (key in obj) {
                    }
                    return typeof key === 'undefined' || hasOwn.call(obj, key);
                };
                module.exports = function extend() {
                    var options, name, src, copy, copyIsArray, clone, target = arguments[0], i = 1, length = arguments.length, deep = false;
                    // Handle a deep copy situation
                    if (typeof target === 'boolean') {
                        deep = target;
                        target = arguments[1] || {};
                        // skip the boolean and the target
                        i = 2;
                    } else if (typeof target !== 'object' && typeof target !== 'function' || target == null) {
                        target = {};
                    }
                    for (; i < length; ++i) {
                        options = arguments[i];
                        // Only deal with non-null/undefined values
                        if (options != null) {
                            // Extend the base object
                            for (name in options) {
                                src = target[name];
                                copy = options[name];
                                // Prevent never-ending loop
                                if (target !== copy) {
                                    // Recurse if we're merging plain objects or arrays
                                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                                        if (copyIsArray) {
                                            copyIsArray = false;
                                            clone = src && isArray(src) ? src : [];
                                        } else {
                                            clone = src && isPlainObject(src) ? src : {};
                                        }
                                        // Never move original objects, clone them
                                        target[name] = extend(deep, clone, copy);    // Don't bring in undefined values
                                    } else if (typeof copy !== 'undefined') {
                                        target[name] = copy;
                                    }
                                }
                            }
                        }
                    }
                    // Return the modified object
                    return target;
                };
            },
            {}
        ],
        5: [
            function (require, module, exports) {
                var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
                var slice = Array.prototype.slice;
                var toStr = Object.prototype.toString;
                var funcType = '[object Function]';
                module.exports = function bind(that) {
                };
            },
            {}
        ],
        6: [
            function (require, module, exports) {
                var implementation = require('./implementation');
                module.exports = Function.prototype.bind || implementation;
            },
            { './implementation': 5 }
        ],
        7: [
            function (require, module, exports) {
                var bind = require('function-bind');
                module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
            },
            { 'function-bind': 6 }
        ],
        8: [
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
        9: [
            function (require, module, exports) {
                var wrappy = require('wrappy');
                module.exports = wrappy(once);
                module.exports.strict = wrappy(onceStrict);
                once.proto = once(function () {
                });
                function once(fn) {
                    var f = function () {
                        if (f.called)
                            return f.value;
                        f.called = true;
                        return f.value = fn.apply(this, arguments);
                    };
                    f.called = false;
                    return f;
                }
                function onceStrict(fn) {
                }
            },
            { 'wrappy': 16 }
        ],
        10: [
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
            { '_process': 11 }
        ],
        11: [
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
        12: [
            function (require, module, exports) {
                'use strict';
                var path = require('path');
                function replaceExt(npath, ext) {
                }
                module.exports = replaceExt;
            },
            { 'path': 10 }
        ],
        13: [
            function (require, module, exports) {
                /**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module trough
 * @fileoverview Middleware.  Inspired by `segmentio/ware`,
 *   but able to change the values from transformer to
 *   transformer.
 */
                'use strict';
                /* Expose. */
                module.exports = trough;
                /* Methods. */
                var slice = [].slice;
                /**
 * Create new middleware.
 *
 * @return {Object} - Middlewre.
 */
                function trough() {
                    var fns = [];
                    var middleware = {};
                    middleware.run = run;
                    middleware.use = use;
                    return middleware;
                    /**
   * Run `fns`.  Last argument must be
   * a completion handler.
   *
   * @param {...*} input - Parameters
   */
                    function run() {
                        var index = -1;
                        var input = slice.call(arguments, 0, -1);
                        var done = arguments[arguments.length - 1];
                        if (typeof done !== 'function') {
                            throw new Error('Expected function as last argument, not ' + done);
                        }
                        next.apply(null, [null].concat(input));
                        return;
                        /**
     * Run the next `fn`, if any.
     *
     * @param {Error?} err - Failure.
     * @param {...*} values - Other input.
     */
                        function next(err) {
                            var fn = fns[++index];
                            var params = slice.call(arguments, 0);
                            var values = params.slice(1);
                            var length = input.length;
                            var pos = -1;
                            if (err) {
                                done(err);
                                return;
                            }
                            /* Copy non-nully input into values. */
                            while (++pos < length) {
                                if (values[pos] === null || values[pos] === undefined) {
                                    values[pos] = input[pos];
                                }
                            }
                            input = values;
                            /* Next or done. */
                            if (fn) {
                                wrap(fn, next).apply(null, input);
                            } else {
                                done.apply(null, [null].concat(input));
                            }
                        }
                    }
                    /**
   * Add `fn` to the list.
   *
   * @param {Function} fn - Anything `wrap` accepts.
   */
                    function use(fn) {
                        if (typeof fn !== 'function') {
                            throw new Error('Expected `fn` to be a function, not ' + fn);
                        }
                        fns.push(fn);
                        return middleware;
                    }
                }
                /**
 * Wrap `fn`.  Can be sync or async; return a promise,
 * receive a completion handler, return new values and
 * errors.
 *
 * @param {Function} fn - Thing to wrap.
 * @param {Function} next - Completion handler.
 * @return {Function} - Wrapped `fn`.
 */
                function wrap(fn, next) {
                    var invoked;
                    return wrapped;
                    function wrapped() {
                        var params = slice.call(arguments, 0);
                        var callback = fn.length > params.length;
                        var result;
                        if (callback) {
                            params.push(done);
                        }
                        try {
                            result = fn.apply(null, params);
                        } catch (err) {
                            /* Well, this is quite the pickle.  `fn` received
       * a callback and invoked it (thus continuing the
       * pipeline), but later also threw an error.
       * We’re not about to restart the pipeline again,
       * so the only thing left to do is to throw the
       * thing instea. */
                            if (callback && invoked) {
                                throw err;
                            }
                            return done(err);
                        }
                        if (!callback) {
                            if (result && typeof result.then === 'function') {
                                result.then(then, done);
                            } else if (result instanceof Error) {
                                done(result);
                            } else {
                                then(result);
                            }
                        }
                    }
                    /**
   * Invoke `next`, only once.
   *
   * @param {Error?} err - Optional error.
   */
                    function done() {
                        if (!invoked) {
                            invoked = true;
                            next.apply(null, arguments);
                        }
                    }
                    /**
   * Invoke `done` with one value.
   * Tracks if an error is passed, too.
   *
   * @param {*} value - Optional value.
   */
                    function then(value) {
                        done(null, value);
                    }
                }
            },
            {}
        ],
        14: [
            function (require, module, exports) {
                /**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module unist:util:stringify-position
 * @fileoverview Stringify a Unist node, location, or position.
 */
                'use strict';
                /* eslint-env commonjs */
                /*
 * Methods.
 */
                var has = Object.prototype.hasOwnProperty;
                /**
 * Stringify a single index.
 *
 * @param {*} value - Index?
 * @return {string?} - Stringified index?
 */
                function index(value) {
                }
                /**
 * Stringify a single position.
 *
 * @param {*} pos - Position?
 * @return {string?} - Stringified position?
 */
                function position(pos) {
                }
                /**
 * Stringify a single location.
 *
 * @param {*} loc - Location?
 * @return {string?} - Stringified location?
 */
                function location(loc) {
                }
                /**
 * Stringify a node, location, or position into a range or
 * a point.
 *
 * @param {Node|Position|Location} value - Thing to stringify.
 * @return {string?} - Stringified positional information?
 */
                function stringify(value) {
                    /* Nothing. */
                    if (!value || typeof value !== 'object') {
                        return null;
                    }
                    /* Node. */
                    if (has.call(value, 'position') || has.call(value, 'type')) {
                        return location(value.position);
                    }
                    /* Location. */
                    if (has.call(value, 'start') || has.call(value, 'end')) {
                        return location(value);
                    }
                    /* Position. */
                    if (has.call(value, 'line') || has.call(value, 'column')) {
                        return position(value);
                    }
                    /* ? */
                    return null;
                }
                /*
 * Expose.
 */
                module.exports = stringify;
            },
            {}
        ],
        15: [
            function (require, module, exports) {
                (function (process) {
                    /**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module vfile
 * @fileoverview Virtual file format to attach additional
 *   information related to processed input.  Similar to
 *   `wearefractal/vinyl`.
 */
                    'use strict';
                    /* Dependencies. */
                    var path = require('path');
                    var has = require('has');
                    var replace = require('replace-ext');
                    var stringify = require('unist-util-stringify-position');
                    var buffer = require('is-buffer');
                    var string = require('x-is-string');
                    /* Expose. */
                    module.exports = VFile;
                    /* Methods. */
                    var proto = VFile.prototype;
                    proto.toString = toString;
                    proto.message = message;
                    proto.fail = fail;
                    /* Slight backwards compatibility.  Remove in the future. */
                    proto.warn = message;
                    /* Order of setting (least specific to most). */
                    var order = [
                        'history',
                        'path',
                        'basename',
                        'stem',
                        'extname',
                        'dirname'
                    ];
                    /**
 * Construct a new file.
 *
 * @constructor
 * @param {Object|VFile|string} [options] - File, contents, or config.
 */
                    function VFile(options) {
                        var prop;
                        var index;
                        var length;
                        if (!options) {
                            options = {};
                        } else if (string(options) || buffer(options)) {
                            options = { contents: options };
                        } else if ('message' in options && 'messages' in options) {
                            return options;
                        }
                        if (!(this instanceof VFile)) {
                            return new VFile(options);
                        }
                        this.data = {};
                        this.messages = [];
                        this.history = [];
                        this.cwd = process.cwd();
                        /* Set path related properties in the correct order. */
                        index = -1;
                        length = order.length;
                        while (++index < length) {
                            prop = order[index];
                            if (has(options, prop)) {
                                this[prop] = options[prop];
                            }
                        }
                        /* Set non-path related properties. */
                        for (prop in options) {
                            if (order.indexOf(prop) === -1) {
                                this[prop] = options[prop];
                            }
                        }
                    }
                    /**
 * Access complete path (`~/index.min.js`).
 */
                    Object.defineProperty(proto, 'path', {
                        get: function () {
                            return this.history[this.history.length - 1];
                        },
                        set: function (path) {
                        }
                    });
                    /**
 * Access parent path (`~`).
 */
                    Object.defineProperty(proto, 'dirname', {
                        get: function () {
                        },
                        set: function (dirname) {
                        }
                    });
                    /**
 * Access basename (`index.min.js`).
 */
                    Object.defineProperty(proto, 'basename', {
                        get: function () {
                        },
                        set: function (basename) {
                        }
                    });
                    /**
 * Access extname (`.js`).
 */
                    Object.defineProperty(proto, 'extname', {
                        get: function () {
                        },
                        set: function (extname) {
                        }
                    });
                    /**
 * Access stem (`index.min`).
 */
                    Object.defineProperty(proto, 'stem', {
                        get: function () {
                        },
                        set: function (stem) {
                        }
                    });
                    /**
 * Get the value of the file.
 *
 * @return {string} - Contents.
 */
                    function toString(encoding) {
                        var value = this.contents || '';
                        return buffer(value) ? value.toString(encoding) : String(value);
                    }
                    /**
 * Create a message with `reason` at `position`.
 * When an error is passed in as `reason`, copies the
 * stack.  This does not add a message to `messages`.
 *
 * @param {string|Error} reason - Reason for message.
 * @param {Node|Location|Position} [position] - Place of message.
 * @param {string} [ruleId] - Category of message.
 * @return {VMessage} - Message.
 */
                    function message(reason, position, ruleId) {
                        var filePath = this.path;
                        var range = stringify(position) || '1:1';
                        var location;
                        var err;
                        location = {
                            start: {
                                line: null,
                                column: null
                            },
                            end: {
                                line: null,
                                column: null
                            }
                        };
                        if (position && position.position) {
                            position = position.position;
                        }
                        if (position) {
                            /* Location. */
                            if (position.start) {
                                location = position;
                                position = position.start;
                            } else {
                                /* Position. */
                                location.start = position;
                                location.end.line = null;
                                location.end.column = null;
                            }
                        }
                        err = new VMessage(reason.message || reason);
                        err.name = (filePath ? filePath + ':' : '') + range;
                        err.file = filePath || '';
                        err.reason = reason.message || reason;
                        err.line = position ? position.line : null;
                        err.column = position ? position.column : null;
                        err.location = location;
                        err.ruleId = ruleId || null;
                        err.source = null;
                        err.fatal = false;
                        if (reason.stack) {
                            err.stack = reason.stack;
                        }
                        this.messages.push(err);
                        return err;
                    }
                    /**
 * Fail. Creates a vmessage, associates it with the file,
 * and throws it.
 *
 * @throws {VMessage} - Fatal exception.
 */
                    function fail() {
                        var message = this.message.apply(this, arguments);
                        message.fatal = true;
                        throw message;
                    }
                    /* Inherit from `Error#`. */
                    function VMessagePrototype() {
                    }
                    VMessagePrototype.prototype = Error.prototype;
                    VMessage.prototype = new VMessagePrototype();
                    /* Message properties. */
                    proto = VMessage.prototype;
                    proto.file = proto.name = proto.reason = proto.message = proto.stack = '';
                    proto.fatal = proto.column = proto.line = null;
                    /**
 * Construct a new file message.
 *
 * Note: We cannot invoke `Error` on the created context,
 * as that adds readonly `line` and `column` attributes on
 * Safari 9, thus throwing and failing the data.
 *
 * @constructor
 * @param {string} reason - Reason for messaging.
 */
                    function VMessage(reason) {
                        this.message = reason;
                    }
                    /* Assert that `part` is not a path (i.e., does
 * not contain `path.sep`). */
                    function assertPart(part, name) {
                    }
                    /* Assert that `part` is not empty. */
                    function assertNonEmpty(part, name) {
                    }
                    /* Assert `path` exists. */
                    function assertPath(path, name) {
                    }
                }.call(this, require('_process')));
            },
            {
                '_process': 11,
                'has': 7,
                'is-buffer': 8,
                'path': 10,
                'replace-ext': 12,
                'unist-util-stringify-position': 14,
                'x-is-string': 17
            }
        ],
        16: [
            function (require, module, exports) {
                // Returns a wrapper function that returns a wrapped callback
                // The wrapper function should do some stuff, and return a
                // presumably different callback function.
                // This makes sure that own properties are retained, so that
                // decorations and such are not lost along the way.
                module.exports = wrappy;
                function wrappy(fn, cb) {
                    if (fn && cb)
                        return wrappy(fn)(cb);
                    if (typeof fn !== 'function')
                        throw new TypeError('need wrapper function');
                    Object.keys(fn).forEach(function (k) {
                    });
                    return wrapper;
                    function wrapper() {
                        var args = new Array(arguments.length);
                        for (var i = 0; i < args.length; i++) {
                            args[i] = arguments[i];
                        }
                        var ret = fn.apply(this, args);
                        var cb = args[args.length - 1];
                        if (typeof ret === 'function' && ret !== cb) {
                            Object.keys(cb).forEach(function (k) {
                            });
                        }
                        return ret;
                    }
                }
            },
            {}
        ],
        17: [
            function (require, module, exports) {
                var toString = Object.prototype.toString;
                module.exports = isString;
                function isString(obj) {
                    return toString.call(obj) === '[object String]';
                }
            },
            {}
        ]
    }, {}, [1])(1);
}));