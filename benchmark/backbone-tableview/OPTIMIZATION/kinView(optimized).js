(function e(t, n, r) {
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
            module.exports = require('./src/index.js');
        },
        { './src/index.js': 13 }
    ],
    2: [
        function (require, module, exports) {
            var view = require('./src/view.js');
            view.childView = require('./src/childView.js');
            module.exports = view;
        },
        {
            './src/childView.js': 3,
            './src/view.js': 4
        }
    ],
    3: [
        function (require, module, exports) {
            var Backbone = require('backbone'), _ = require('underscore');
            module.exports = Backbone.View.extend({
                constructor: function () {
                    Backbone.View.apply(this, arguments);
                    this.listenTo(this.model, 'remove', this.remove);
                    this.render();
                }
            });
        },
        {
            'backbone': 10,
            'underscore': 12
        }
    ],
    4: [
        function (require, module, exports) {
            var Backbone = require('backbone'), _ = require('underscore'), KinView = require('backbone-kinview'), ChildView = require('./childView.js');
            module.exports = KinView.extend({
                childView: ChildView,
                constructor: function () {
                    // defaults
                    this.collection = null;
                    this.filters = {};
                    this.sort = null;
                    this.page = {
                        offset: null,
                        limit: 25
                    };
                    // super()
                    KinView.apply(this, arguments);
                    this.on('rerender', this.renderChildren, this);
                    // process arguments, if received
                    var options = arguments[0] || {};
                    this.setCollection(options.collection || new Backbone.Collection());
                },
                // datasource handling
                setCollection: function (collection) {
                    // stop listening to the current collection, if there is one
                    if (this.collection) {
                        this.stopListening(this.collection);
                    }
                    this.collection = collection;
                    this.renderChildren();
                    this.listenTo(this.collection, 'add', _.bind(this.addChild, this));
                    this.listenTo(this.collection, 'reset', this.renderChildren, this);
                },
                addChild: function (model) {
                    // dont bother if this model wont pass the filters anyway
                    if (!this.filter(model))
                        return false;
                    // we need to do a full re-render if there is a sorter or pagination
                    if (this.sort || this.page.offset)
                        return this.trigger('rerender');
                    return this.append(model);
                },
                append: function (model) {
                    // calling append() directly will bypass all sorting/filtering/paging
                    // instead, call addChild()
                    return this.add({ view: new this.childView({ model: model }) });
                },
                renderChildren: function () {
                    this.children.removeAll();
                    this.getCurrentChildren(this.append, this);
                },
                getCurrentChildren: function (done, context) {
                    var children = [];
                    // process collection
                    var hasFilters = !_.isEmpty(this.filters);
                    var hasPage = !_.isNull(this.page.offset);
                    var models = this.sort ? this.collection.models.slice() : this.collection.models;
                    // no point in continuing if we dont have models
                    if (!models || models.length === 0)
                        return false;
                    // sort
                    if (this.sort && hasPage)
                        models.sort(this.sort);
                    // page and append
                    var start = 0, end = models.length;
                    if (hasPage) {
                        start = this.page.offset || 0;
                        end = (this.page.limit || 25) + start;
                        // dont overshoot the amount of elements
                        end = Math.min(end, models.length);
                    }
                    for (var i = start; i < end; i++) {
                        // if there are no filters, just add the model
                        if (!hasFilters) {
                            children.push(models[i]);
                            continue;
                        }
                        // otherwise, if this model passes the filter, add it to the results
                        if (this.filter(models[i])) {
                            children.push(models[i]);
                            continue;
                        }
                        // if were going to reject this model, increment the end value so
                        // that we can test one more model from the collection, but dont
                        // let the end value to be longer than the length of the array
                        if (hasPage)
                            end = Math.min(end + 1, models.length);
                    }
                    // when filtering, we prefer to sort the filtered collection after filtering
                    // as its probably smaller. When paging, however, this is improper as 
                    // pagination is generally desired after sorting and filtering
                    if (!hasPage && this.sort)
                        children.sort(this.sort);
                    if (typeof done == 'function')
                        return children.forEach(done, context);
                    return children;
                },
                // filtering functions
                addFilter: function (name, filter) {
                },
                removeFilter: function (name) {
                },
                clearFilters: function () {
                },
                filter: function (model) {
                    // returns true if there are no filter
                    // https://github.com/jashkenas/underscore/blob/master/underscore.js#L239
                    return _.every(this.filters, function (filter) {
                    }, this);
                },
                filtered: function () {
                },
                // paging function
                setPage: function (offset, limit) {
                },
                // sorting functions
                setSort: function (val) {
                }
            });
        },
        {
            './childView.js': 3,
            'backbone': 10,
            'backbone-kinview': 5,
            'underscore': 12
        }
    ],
    5: [
        function (require, module, exports) {
            module.exports = require('./src/index.js');
        },
        { './src/index.js': 7 }
    ],
    6: [
        function (require, module, exports) {
            var Backbone = require('backbone'), _ = require('underscore'), Model = require('../models/model.js');
            module.exports = Backbone.Collection.extend({
                // default model to be used, can be overridden
                model: Model,
                initialize: function (models, opts) {
                    this.exclusiveState = opts && opts.exclusiveState || false;
                    // rememebr if a state has ever been set
                    this.stateSet = false;
                    // a models change event bubbles up to the collection causing an
                    // event for every model changed. To prevent an endless loop, listen to
                    // just the first change event, process it (via the callback), and
                    // start listening again after all the models state have been processed
                    this.once('change:state', this.toggleState);
                    // add models to collection, if provided
                    if (models) {
                        this.reset(models, _.extend({ silent: true }, opts));
                    }
                },
                removeAll: function () {
                    // removes all models in this collection
                    // Unlike Collection.reset(), the remove event will be triggered
                    // on every model, giving it the ability to clean itself up
                    this.remove(this.models);
                },
                toggleState: function (changed) {
                    this.stateSet = true;
                    // set all other models to state = null
                    this.each(function (model) {
                        // skip the model that triggered the event
                        if (_.isEqual(model, changed))
                            return true;
                        model.set('state', null);
                    });
                    // listen for changes again before triggering 'stateChange',
                    // so that we dont miss any events
                    this.once('change:state', this.toggleState);
                    // trigger stateChange event if state is exclusive
                    if (this.exclusiveState) {
                        this.trigger('stateChange', changed);
                    }
                }
            });
        },
        {
            '../models/model.js': 8,
            'backbone': 10,
            'underscore': 12
        }
    ],
    7: [
        function (require, module, exports) {
            var KinView = require('./views/kin.js');
            module.exports = KinView;
            KinView.models = KinView.collections = {};
            KinView.models.model = require('./models/model.js');
            KinView.collections.collection = require('./collections/collection.js');
        },
        {
            './collections/collection.js': 6,
            './models/model.js': 8,
            './views/kin.js': 9
        }
    ],
    8: [
        function (require, module, exports) {
            var Backbone = require('backbone');
            module.exports = Backbone.Model.extend({
                defaults: {
                    state: null,
                    hasState: true,
                    view: null,
                    data: null
                },
                initialize: function () {
                    // remove is triggerd by the collection when it removes a model
                    this.listenTo(this, 'remove', this.remove);
                },
                remove: function () {
                    // if this model contains a view, call its remove method
                    // all other model cleanup is handeled externaly from the model
                    if (this.get('view')) {
                        this.get('view').remove();
                    }
                },
                toggleState: function () {
                }
            });
        },
        { 'backbone': 10 }
    ],
    9: [
        function (require, module, exports) {
            var Backbone = require('backbone'), _ = require('underscore'), Collection = require('../collections/collection.js');
            //NativeView = require('backbone.nativeview')
            module.exports = Backbone.View.extend({
                exclusiveState: false,
                exclusiveEvent: 'click',
                constructor: function () {
                    // define children first
                    this.children = new Collection([], { exclusiveState: this.exclusiveState });
                    // listenters must be set before apply() is called
                    this.listenTo(this.children, 'add', this.appendChild);
                    this.listenTo(this.children, 'change:state', this.stateChange);
                    // proxy stateChange to children
                    this.listenTo(this.children, 'stateChange', function () {
                        var args = Array.prototype.slice.call(arguments);
                        args.unshift('stateChange');
                        this.trigger.apply(this, args);
                    });
                    // super()
                    Backbone.View.apply(this, arguments);
                    this.superRemove = Backbone.View.prototype.remove;
                },
                add: function () {
                    return this.children.add.apply(this.children, arguments);
                },
                appendChild: function (model, collection, opts) {
                    // check to see if a location (relative to the parent) is specified
                    var el = opts.to ? this.$(opts.to)[0] : this.el;
                    if (!opts || !opts.positioned || !this.el.children.length || !('at' in opts)) {
                        el.appendChild(model.get('view').el);
                    } else {
                        // at must be zero based; will fail if before el is not found
                        el.insertBefore(model.get('view').el, el.children[opts.at]);
                    }
                    // add a  handler if exclusivity is set
                    if (this.exclusiveState && model.get('hasState')) {
                        model.get('view').delegate(this.exclusiveEvent, _.bind(model.toggleState, model));
                    }
                    return model;
                },
                stateChange: function (model) {
                },
                remove: function () {
                    this.children.removeAll();
                    // call original remove
                    this.superRemove();
                }
            });
        },
        {
            '../collections/collection.js': 6,
            'backbone': 10,
            'underscore': 12
        }
    ],
    10: [
        function (require, module, exports) {
            (function (global) {
                //     Backbone.js 1.3.3
                //     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                //     Backbone may be freely distributed under the MIT license.
                //     For all details and documentation:
                //     http://backbonejs.org
                (function (factory) {
                    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
                    // We use `self` instead of `window` for `WebWorker` support.
                    var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global;
                    // Set up Backbone appropriately for the environment. Start with AMD.
                    if (typeof define === 'function' && define.amd) {
                        define([
                            'underscore',
                            'jquery',
                            'exports'
                        ], function (_, $, exports) {
                        });    // Next for Node.js or CommonJS. jQuery may not be needed as a module.
                    } else if (typeof exports !== 'undefined') {
                        var _ = require('underscore'), $;
                        try {
                            $ = require('jquery');
                        } catch (e) {
                        }
                        factory(root, exports, _, $);    // Finally, as a browser global.
                    } else {
                        root.Backbone = factory(root, {}, root._, root.jQuery || root.Zepto || root.ender || root.$);
                    }
                }(function (root, Backbone, _, $) {
                    // Initial Setup
                    // -------------
                    // Save the previous value of the `Backbone` variable, so that it can be
                    // restored later on, if `noConflict` is used.
                    var previousBackbone = root.Backbone;
                    // Create a local reference to a common array method we'll want to use later.
                    var slice = Array.prototype.slice;
                    // Current version of the library. Keep in sync with `package.json`.
                    Backbone.VERSION = '1.3.3';
                    // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
                    // the `$` variable.
                    Backbone.$ = $;
                    // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
                    // to its previous owner. Returns a reference to this Backbone object.
                    Backbone.noConflict = function () {
                    };
                    // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
                    // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
                    // set a `X-Http-Method-Override` header.
                    Backbone.emulateHTTP = false;
                    // Turn on `emulateJSON` to support legacy servers that can't deal with direct
                    // `application/json` requests ... this will encode the body as
                    // `application/x-www-form-urlencoded` instead and will send the model in a
                    // form param named `model`.
                    Backbone.emulateJSON = false;
                    // Proxy Backbone class methods to Underscore functions, wrapping the model's
                    // `attributes` object or collection's `models` array behind the scenes.
                    //
                    // collection.filter(function(model) { return model.get('age') > 10 });
                    // collection.each(this.addView);
                    //
                    // `Function#apply` can be slow so we use the method's arg count, if we know it.
                    var addMethod = function (length, method, attribute) {
                        switch (length) {
                        case 1:
                            return function () {
                            };
                        case 2:
                            return function (value) {
                            };
                        case 3:
                            return function (iteratee, context) {
                                return _[method](this[attribute], cb(iteratee, this), context);
                            };
                        case 4:
                            return function (iteratee, defaultVal, context) {
                            };
                        default:
                            return function () {
                            };
                        }
                    };
                    var addUnderscoreMethods = function (Class, methods, attribute) {
                        _.each(methods, function (length, method) {
                            if (_[method])
                                Class.prototype[method] = addMethod(length, method, attribute);
                        });
                    };
                    // Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
                    var cb = function (iteratee, instance) {
                        if (_.isFunction(iteratee))
                            return iteratee;
                        if (_.isObject(iteratee) && !instance._isModel(iteratee))
                            return modelMatcher(iteratee);
                        if (_.isString(iteratee))
                            return function (model) {
                                return model.get(iteratee);
                            };
                        return iteratee;
                    };
                    var modelMatcher = function (attrs) {
                        var matcher = _.matches(attrs);
                        return function (model) {
                            return matcher(model.attributes);
                        };
                    };
                    // Backbone.Events
                    // ---------------
                    // A module that can be mixed in to *any object* in order to provide it with
                    // a custom event channel. You may bind a callback to an event with `on` or
                    // remove with `off`; `trigger`-ing an event fires all callbacks in
                    // succession.
                    //
                    //     var object = {};
                    //     _.extend(object, Backbone.Events);
                    //     object.on('expand', function(){ alert('expanded'); });
                    //     object.trigger('expand');
                    //
                    var Events = Backbone.Events = {};
                    // Regular expression used to split event strings.
                    var eventSplitter = /\s+/;
                    // Iterates over the standard `event, callback` (as well as the fancy multiple
                    // space-separated events `"change blur", callback` and jQuery-style event
                    // maps `{event: callback}`).
                    var eventsApi = function (iteratee, events, name, callback, opts) {
                        var i = 0, names;
                        if (name && typeof name === 'object') {
                            // Handle event maps.
                            if (callback !== void 0 && 'context' in opts && opts.context === void 0)
                                opts.context = callback;
                            for (names = _.keys(name); i < names.length; i++) {
                                events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
                            }
                        } else if (name && eventSplitter.test(name)) {
                            // Handle space-separated event names by delegating them individually.
                            for (names = name.split(eventSplitter); i < names.length; i++) {
                                events = iteratee(events, names[i], callback, opts);
                            }
                        } else {
                            // Finally, standard events.
                            events = iteratee(events, name, callback, opts);
                        }
                        return events;
                    };
                    // Bind an event to a `callback` function. Passing `"all"` will bind
                    // the callback to all events fired.
                    Events.on = function (name, callback, context) {
                        return internalOn(this, name, callback, context);
                    };
                    // Guard the `listening` argument from the public API.
                    var internalOn = function (obj, name, callback, context, listening) {
                        obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
                            context: context,
                            ctx: obj,
                            listening: listening
                        });
                        if (listening) {
                            var listeners = obj._listeners || (obj._listeners = {});
                            listeners[listening.id] = listening;
                        }
                        return obj;
                    };
                    // Inversion-of-control versions of `on`. Tell *this* object to listen to
                    // an event in another object... keeping track of what it's listening to
                    // for easier unbinding later.
                    Events.listenTo = function (obj, name, callback) {
                        if (!obj)
                            return this;
                        var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
                        var listeningTo = this._listeningTo || (this._listeningTo = {});
                        var listening = listeningTo[id];
                        // This object is not listening to any other events on `obj` yet.
                        // Setup the necessary references to track the listening callbacks.
                        if (!listening) {
                            var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
                            listening = listeningTo[id] = {
                                obj: obj,
                                objId: id,
                                id: thisId,
                                listeningTo: listeningTo,
                                count: 0
                            };
                        }
                        // Bind callbacks on obj, and keep track of them on listening.
                        internalOn(obj, name, callback, this, listening);
                        return this;
                    };
                    // The reducing API that adds a callback to the `events` object.
                    var onApi = function (events, name, callback, options) {
                        if (callback) {
                            var handlers = events[name] || (events[name] = []);
                            var context = options.context, ctx = options.ctx, listening = options.listening;
                            if (listening)
                                listening.count++;
                            handlers.push({
                                callback: callback,
                                context: context,
                                ctx: context || ctx,
                                listening: listening
                            });
                        }
                        return events;
                    };
                    // Remove one or many callbacks. If `context` is null, removes all
                    // callbacks with that function. If `callback` is null, removes all
                    // callbacks for the event. If `name` is null, removes all bound
                    // callbacks for all events.
                    Events.off = function (name, callback, context) {
                        if (!this._events)
                            return this;
                        this._events = eventsApi(offApi, this._events, name, callback, {
                            context: context,
                            listeners: this._listeners
                        });
                        return this;
                    };
                    // Tell this object to stop listening to either specific events ... or
                    // to every object it's currently listening to.
                    Events.stopListening = function (obj, name, callback) {
                        var listeningTo = this._listeningTo;
                        if (!listeningTo)
                            return this;
                        var ids = obj ? [obj._listenId] : _.keys(listeningTo);
                        for (var i = 0; i < ids.length; i++) {
                            var listening = listeningTo[ids[i]];
                            // If listening doesn't exist, this object is not currently
                            // listening to obj. Break out early.
                            if (!listening)
                                break;
                            listening.obj.off(name, callback, this);
                        }
                        return this;
                    };
                    // The reducing API that removes a callback from the `events` object.
                    var offApi = function (events, name, callback, options) {
                        if (!events)
                            return;
                        var i = 0, listening;
                        var context = options.context, listeners = options.listeners;
                        // Delete all events listeners and "drop" events.
                        if (!name && !callback && !context) {
                            var ids = _.keys(listeners);
                            for (; i < ids.length; i++) {
                                listening = listeners[ids[i]];
                                delete listeners[listening.id];
                                delete listening.listeningTo[listening.objId];
                            }
                            return;
                        }
                        var names = name ? [name] : _.keys(events);
                        for (; i < names.length; i++) {
                            name = names[i];
                            var handlers = events[name];
                            // Bail out if there are no events stored.
                            if (!handlers)
                                break;
                            // Replace events if there are any remaining.  Otherwise, clean up.
                            var remaining = [];
                            for (var j = 0; j < handlers.length; j++) {
                                var handler = handlers[j];
                                if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
                                    remaining.push(handler);
                                } else {
                                    listening = handler.listening;
                                    if (listening && --listening.count === 0) {
                                        delete listeners[listening.id];
                                        delete listening.listeningTo[listening.objId];
                                    }
                                }
                            }
                            // Update tail event if the list has any events.  Otherwise, clean up.
                            if (remaining.length) {
                                events[name] = remaining;
                            } else {
                                delete events[name];
                            }
                        }
                        return events;
                    };
                    // Bind an event to only be triggered a single time. After the first time
                    // the callback is invoked, its listener will be removed. If multiple events
                    // are passed in using the space-separated syntax, the handler will fire
                    // once for each event, not once for a combination of all events.
                    Events.once = function (name, callback, context) {
                        // Map the event into a `{event: once}` object.
                        var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
                        if (typeof name === 'string' && context == null)
                            callback = void 0;
                        return this.on(events, callback, context);
                    };
                    // Inversion-of-control versions of `once`.
                    Events.listenToOnce = function (obj, name, callback) {
                    };
                    // Reduces the event callbacks into a map of `{event: onceWrapper}`.
                    // `offer` unbinds the `onceWrapper` after it has been called.
                    var onceMap = function (map, name, callback, offer) {
                        if (callback) {
                            var once = map[name] = _.once(function () {
                                offer(name, once);
                                callback.apply(this, arguments);
                            });
                            once._callback = callback;
                        }
                        return map;
                    };
                    // Trigger one or many events, firing all bound callbacks. Callbacks are
                    // passed the same arguments as `trigger` is, apart from the event name
                    // (unless you're listening on `"all"`, which will cause your callback to
                    // receive the true name of the event as the first argument).
                    Events.trigger = function (name) {
                        if (!this._events)
                            return this;
                        var length = Math.max(0, arguments.length - 1);
                        var args = Array(length);
                        for (var i = 0; i < length; i++)
                            args[i] = arguments[i + 1];
                        eventsApi(triggerApi, this._events, name, void 0, args);
                        return this;
                    };
                    // Handles triggering the appropriate event callbacks.
                    var triggerApi = function (objEvents, name, callback, args) {
                        if (objEvents) {
                            var events = objEvents[name];
                            var allEvents = objEvents.all;
                            if (events && allEvents)
                                allEvents = allEvents.slice();
                            if (events)
                                triggerEvents(events, args);
                            if (allEvents)
                                triggerEvents(allEvents, [name].concat(args));
                        }
                        return objEvents;
                    };
                    // A difficult-to-believe, but optimized internal dispatch function for
                    // triggering events. Tries to keep the usual cases speedy (most internal
                    // Backbone events have 3 arguments).
                    var triggerEvents = function (events, args) {
                        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
                        switch (args.length) {
                        case 0:
                            while (++i < l)
                                (ev = events[i]).callback.call(ev.ctx);
                            return;
                        case 1:
                            while (++i < l)
                                (ev = events[i]).callback.call(ev.ctx, a1);
                            return;
                        case 2:
                            while (++i < l)
                                (ev = events[i]).callback.call(ev.ctx, a1, a2);
                            return;
                        case 3:
                            while (++i < l)
                                (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                            return;
                        default:
                            while (++i < l)
                                (ev = events[i]).callback.apply(ev.ctx, args);
                            return;
                        }
                    };
                    // Aliases for backwards compatibility.
                    Events.bind = Events.on;
                    Events.unbind = Events.off;
                    // Allow the `Backbone` object to serve as a global event bus, for folks who
                    // want global "pubsub" in a convenient place.
                    _.extend(Backbone, Events);
                    // Backbone.Model
                    // --------------
                    // Backbone **Models** are the basic data object in the framework --
                    // frequently representing a row in a table in a database on your server.
                    // A discrete chunk of data and a bunch of useful, related methods for
                    // performing computations and transformations on that data.
                    // Create a new model with the specified attributes. A client id (`cid`)
                    // is automatically generated and assigned for you.
                    var Model = Backbone.Model = function (attributes, options) {
                        var attrs = attributes || {};
                        options || (options = {});
                        this.cid = _.uniqueId(this.cidPrefix);
                        this.attributes = {};
                        if (options.collection)
                            this.collection = options.collection;
                        if (options.parse)
                            attrs = this.parse(attrs, options) || {};
                        var defaults = _.result(this, 'defaults');
                        attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
                        this.set(attrs, options);
                        this.changed = {};
                        this.initialize.apply(this, arguments);
                    };
                    // Attach all inheritable methods to the Model prototype.
                    _.extend(Model.prototype, Events, {
                        // A hash of attributes whose current and previous value differ.
                        changed: null,
                        // The value returned during the last failed validation.
                        validationError: null,
                        // The default name for the JSON `id` attribute is `"id"`. MongoDB and
                        // CouchDB users may want to set this to `"_id"`.
                        idAttribute: 'id',
                        // The prefix is used to create the client id which is used to identify models locally.
                        // You may want to override this if you're experiencing name clashes with model ids.
                        cidPrefix: 'c',
                        // Initialize is an empty function by default. Override it with your own
                        // initialization logic.
                        initialize: function () {
                        },
                        // Return a copy of the model's `attributes` object.
                        toJSON: function (options) {
                            return _.clone(this.attributes);
                        },
                        // Proxy `Backbone.sync` by default -- but override this if you need
                        // custom syncing semantics for *this* particular model.
                        sync: function () {
                        },
                        // Get the value of an attribute.
                        get: function (attr) {
                            return this.attributes[attr];
                        },
                        // Get the HTML-escaped value of an attribute.
                        escape: function (attr) {
                        },
                        // Returns `true` if the attribute contains a value that is not null
                        // or undefined.
                        has: function (attr) {
                        },
                        // Special-cased proxy to underscore's `_.matches` method.
                        matches: function (attrs) {
                        },
                        // Set a hash of model attributes on the object, firing `"change"`. This is
                        // the core primitive operation of a model, updating the data and notifying
                        // anyone who needs to know about the change in state. The heart of the beast.
                        set: function (key, val, options) {
                            if (key == null)
                                return this;
                            // Handle both `"key", value` and `{key: value}` -style arguments.
                            var attrs;
                            if (typeof key === 'object') {
                                attrs = key;
                                options = val;
                            } else {
                                (attrs = {})[key] = val;
                            }
                            options || (options = {});
                            // Run validation.
                            if (!this._validate(attrs, options))
                                return false;
                            // Extract attributes and options.
                            var unset = options.unset;
                            var silent = options.silent;
                            var changes = [];
                            var changing = this._changing;
                            this._changing = true;
                            if (!changing) {
                                this._previousAttributes = _.clone(this.attributes);
                                this.changed = {};
                            }
                            var current = this.attributes;
                            var changed = this.changed;
                            var prev = this._previousAttributes;
                            // For each `set` attribute, update or delete the current value.
                            for (var attr in attrs) {
                                val = attrs[attr];
                                if (!_.isEqual(current[attr], val))
                                    changes.push(attr);
                                if (!_.isEqual(prev[attr], val)) {
                                    changed[attr] = val;
                                } else {
                                    delete changed[attr];
                                }
                                unset ? delete current[attr] : current[attr] = val;
                            }
                            // Update the `id`.
                            if (this.idAttribute in attrs)
                                this.id = this.get(this.idAttribute);
                            // Trigger all relevant attribute changes.
                            if (!silent) {
                                if (changes.length)
                                    this._pending = options;
                                for (var i = 0; i < changes.length; i++) {
                                    this.trigger('change:' + changes[i], this, current[changes[i]], options);
                                }
                            }
                            // You might be wondering why there's a `while` loop here. Changes can
                            // be recursively nested within `"change"` events.
                            if (changing)
                                return this;
                            if (!silent) {
                                while (this._pending) {
                                    options = this._pending;
                                    this._pending = false;
                                    this.trigger('change', this, options);
                                }
                            }
                            this._pending = false;
                            this._changing = false;
                            return this;
                        },
                        // Remove an attribute from the model, firing `"change"`. `unset` is a noop
                        // if the attribute doesn't exist.
                        unset: function (attr, options) {
                        },
                        // Clear all attributes on the model, firing `"change"`.
                        clear: function (options) {
                        },
                        // Determine if the model has changed since the last `"change"` event.
                        // If you specify an attribute name, determine if that attribute has changed.
                        hasChanged: function (attr) {
                        },
                        // Return an object containing all the attributes that have changed, or
                        // false if there are no changed attributes. Useful for determining what
                        // parts of a view need to be updated and/or what attributes need to be
                        // persisted to the server. Unset attributes will be set to undefined.
                        // You can also pass an attributes object to diff against the model,
                        // determining if there *would be* a change.
                        changedAttributes: function (diff) {
                        },
                        // Get the previous value of an attribute, recorded at the time the last
                        // `"change"` event was fired.
                        previous: function (attr) {
                        },
                        // Get all of the attributes of the model at the time of the previous
                        // `"change"` event.
                        previousAttributes: function () {
                            return _.clone(this._previousAttributes);
                        },
                        // Fetch the model from the server, merging the response with the model's
                        // local attributes. Any changed attributes will trigger a "change" event.
                        fetch: function (options) {
                        },
                        // Set a hash of model attributes, and sync the model to the server.
                        // If the server returns an attributes hash that differs, the model's
                        // state will be `set` again.
                        save: function (key, val, options) {
                        },
                        // Destroy this model on the server if it was already persisted.
                        // Optimistically removes the model from its collection, if it has one.
                        // If `wait: true` is passed, waits for the server to respond before removal.
                        destroy: function (options) {
                        },
                        // Default URL for the model's representation on the server -- if you're
                        // using Backbone's restful methods, override this to change the endpoint
                        // that will be called.
                        url: function () {
                        },
                        // **parse** converts a response into the hash of attributes to be `set` on
                        // the model. The default implementation is just to pass the response along.
                        parse: function (resp, options) {
                        },
                        // Create a new model with identical attributes to this one.
                        clone: function () {
                        },
                        // A model is new if it has never been saved to the server, and lacks an id.
                        isNew: function () {
                        },
                        // Check if the model is currently in a valid state.
                        isValid: function (options) {
                        },
                        // Run validation against the next complete set of model attributes,
                        // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
                        _validate: function (attrs, options) {
                            if (!options.validate || !this.validate)
                                return true;
                            attrs = _.extend({}, this.attributes, attrs);
                            var error = this.validationError = this.validate(attrs, options) || null;
                            if (!error)
                                return true;
                            this.trigger('invalid', this, error, _.extend(options, { validationError: error }));
                            return false;
                        }
                    });
                    // Underscore methods that we want to implement on the Model, mapped to the
                    // number of arguments they take.
                    var modelMethods = {
                        keys: 1,
                        values: 1,
                        pairs: 1,
                        invert: 1,
                        pick: 0,
                        omit: 0,
                        chain: 1,
                        isEmpty: 1
                    };
                    // Mix in each Underscore method as a proxy to `Model#attributes`.
                    addUnderscoreMethods(Model, modelMethods, 'attributes');
                    // Backbone.Collection
                    // -------------------
                    // If models tend to represent a single row of data, a Backbone Collection is
                    // more analogous to a table full of data ... or a small slice or page of that
                    // table, or a collection of rows that belong together for a particular reason
                    // -- all of the messages in this particular folder, all of the documents
                    // belonging to this particular author, and so on. Collections maintain
                    // indexes of their models, both in order, and for lookup by `id`.
                    // Create a new **Collection**, perhaps to contain a specific type of `model`.
                    // If a `comparator` is specified, the Collection will maintain
                    // its models in sort order, as they're added and removed.
                    var Collection = Backbone.Collection = function (models, options) {
                        options || (options = {});
                        if (options.model)
                            this.model = options.model;
                        if (options.comparator !== void 0)
                            this.comparator = options.comparator;
                        this._reset();
                        this.initialize.apply(this, arguments);
                        if (models)
                            this.reset(models, _.extend({ silent: true }, options));
                    };
                    // Default options for `Collection#set`.
                    var setOptions = {
                        add: true,
                        remove: true,
                        merge: true
                    };
                    var addOptions = {
                        add: true,
                        remove: false
                    };
                    // Splices `insert` into `array` at index `at`.
                    var splice = function (array, insert, at) {
                        at = Math.min(Math.max(at, 0), array.length);
                        var tail = Array(array.length - at);
                        var length = insert.length;
                        var i;
                        for (i = 0; i < tail.length; i++)
                            tail[i] = array[i + at];
                        for (i = 0; i < length; i++)
                            array[i + at] = insert[i];
                        for (i = 0; i < tail.length; i++)
                            array[i + length + at] = tail[i];
                    };
                    // Define the Collection's inheritable methods.
                    _.extend(Collection.prototype, Events, {
                        // The default model for a collection is just a **Backbone.Model**.
                        // This should be overridden in most cases.
                        model: Model,
                        // Initialize is an empty function by default. Override it with your own
                        // initialization logic.
                        initialize: function () {
                        },
                        // The JSON representation of a Collection is an array of the
                        // models' attributes.
                        toJSON: function (options) {
                            return this.map(function (model) {
                                return model.toJSON(options);
                            });
                        },
                        // Proxy `Backbone.sync` by default.
                        sync: function () {
                        },
                        // Add a model, or list of models to the set. `models` may be Backbone
                        // Models or raw JavaScript objects to be converted to Models, or any
                        // combination of the two.
                        add: function (models, options) {
                            return this.set(models, _.extend({ merge: false }, options, addOptions));
                        },
                        // Remove a model, or a list of models from the set.
                        remove: function (models, options) {
                            options = _.extend({}, options);
                            var singular = !_.isArray(models);
                            models = singular ? [models] : models.slice();
                            var removed = this._removeModels(models, options);
                            if (!options.silent && removed.length) {
                                options.changes = {
                                    added: [],
                                    merged: [],
                                    removed: removed
                                };
                                this.trigger('update', this, options);
                            }
                            return singular ? removed[0] : removed;
                        },
                        // Update a collection by `set`-ing a new list of models, adding new ones,
                        // removing models that are no longer present, and merging models that
                        // already exist in the collection, as necessary. Similar to **Model#set**,
                        // the core operation for updating the data contained by the collection.
                        set: function (models, options) {
                            if (models == null)
                                return;
                            options = _.extend({}, setOptions, options);
                            if (options.parse && !this._isModel(models)) {
                                models = this.parse(models, options) || [];
                            }
                            var singular = !_.isArray(models);
                            models = singular ? [models] : models.slice();
                            var at = options.at;
                            if (at != null)
                                at = +at;
                            if (at > this.length)
                                at = this.length;
                            if (at < 0)
                                at += this.length + 1;
                            var set = [];
                            var toAdd = [];
                            var toMerge = [];
                            var toRemove = [];
                            var modelMap = {};
                            var add = options.add;
                            var merge = options.merge;
                            var remove = options.remove;
                            var sort = false;
                            var sortable = this.comparator && at == null && options.sort !== false;
                            var sortAttr = _.isString(this.comparator) ? this.comparator : null;
                            // Turn bare objects into model references, and prevent invalid models
                            // from being added.
                            var model, i;
                            for (i = 0; i < models.length; i++) {
                                model = models[i];
                                // If a duplicate is found, prevent it from being added and
                                // optionally merge it into the existing model.
                                var existing = this.get(model);
                                if (existing) {
                                    if (merge && model !== existing) {
                                        var attrs = this._isModel(model) ? model.attributes : model;
                                        if (options.parse)
                                            attrs = existing.parse(attrs, options);
                                        existing.set(attrs, options);
                                        toMerge.push(existing);
                                        if (sortable && !sort)
                                            sort = existing.hasChanged(sortAttr);
                                    }
                                    if (!modelMap[existing.cid]) {
                                        modelMap[existing.cid] = true;
                                        set.push(existing);
                                    }
                                    models[i] = existing;    // If this is a new, valid model, push it to the `toAdd` list.
                                } else if (add) {
                                    model = models[i] = this._prepareModel(model, options);
                                    if (model) {
                                        toAdd.push(model);
                                        this._addReference(model, options);
                                        modelMap[model.cid] = true;
                                        set.push(model);
                                    }
                                }
                            }
                            // Remove stale models.
                            if (remove) {
                                for (i = 0; i < this.length; i++) {
                                    model = this.models[i];
                                    if (!modelMap[model.cid])
                                        toRemove.push(model);
                                }
                                if (toRemove.length)
                                    this._removeModels(toRemove, options);
                            }
                            // See if sorting is needed, update `length` and splice in new models.
                            var orderChanged = false;
                            var replace = !sortable && add && remove;
                            if (set.length && replace) {
                                orderChanged = this.length !== set.length || _.some(this.models, function (m, index) {
                                });
                                this.models.length = 0;
                                splice(this.models, set, 0);
                                this.length = this.models.length;
                            } else if (toAdd.length) {
                                if (sortable)
                                    sort = true;
                                splice(this.models, toAdd, at == null ? this.length : at);
                                this.length = this.models.length;
                            }
                            // Silently sort the collection if appropriate.
                            if (sort)
                                this.sort({ silent: true });
                            // Unless silenced, it's time to fire all appropriate add/sort/update events.
                            if (!options.silent) {
                                for (i = 0; i < toAdd.length; i++) {
                                    if (at != null)
                                        options.index = at + i;
                                    model = toAdd[i];
                                    model.trigger('add', model, this, options);
                                }
                                if (sort || orderChanged)
                                    this.trigger('sort', this, options);
                                if (toAdd.length || toRemove.length || toMerge.length) {
                                    options.changes = {
                                        added: toAdd,
                                        removed: toRemove,
                                        merged: toMerge
                                    };
                                    this.trigger('update', this, options);
                                }
                            }
                            // Return the added (or merged) model (or models).
                            return singular ? models[0] : models;
                        },
                        // When you have more items than you want to add or remove individually,
                        // you can reset the entire set with a new list of models, without firing
                        // any granular `add` or `remove` events. Fires `reset` when finished.
                        // Useful for bulk operations and optimizations.
                        reset: function (models, options) {
                            options = options ? _.clone(options) : {};
                            for (var i = 0; i < this.models.length; i++) {
                                this._removeReference(this.models[i], options);
                            }
                            options.previousModels = this.models;
                            this._reset();
                            models = this.add(models, _.extend({ silent: true }, options));
                            if (!options.silent)
                                this.trigger('reset', this, options);
                            return models;
                        },
                        // Add a model to the end of the collection.
                        push: function (model, options) {
                        },
                        // Remove a model from the end of the collection.
                        pop: function (options) {
                        },
                        // Add a model to the beginning of the collection.
                        unshift: function (model, options) {
                        },
                        // Remove a model from the beginning of the collection.
                        shift: function (options) {
                        },
                        // Slice out a sub-array of models from the collection.
                        slice: function () {
                        },
                        // Get a model from the set by id, cid, model object with id or cid
                        // properties, or an attributes object that is transformed through modelId.
                        get: function (obj) {
                            if (obj == null)
                                return void 0;
                            return this._byId[obj] || this._byId[this.modelId(obj.attributes || obj)] || obj.cid && this._byId[obj.cid];
                        },
                        // Returns `true` if the model is in the collection.
                        has: function (obj) {
                        },
                        // Get the model at the given index.
                        at: function (index) {
                        },
                        // Return models with matching attributes. Useful for simple cases of
                        // `filter`.
                        where: function (attrs, first) {
                            return this[first ? 'find' : 'filter'](attrs);
                        },
                        // Return the first model with matching attributes. Useful for simple cases
                        // of `find`.
                        findWhere: function (attrs) {
                        },
                        // Force the collection to re-sort itself. You don't need to call this under
                        // normal circumstances, as the set will maintain sort order as each item
                        // is added.
                        sort: function (options) {
                            var comparator = this.comparator;
                            if (!comparator)
                                throw new Error('Cannot sort a set without a comparator');
                            options || (options = {});
                            var length = comparator.length;
                            if (_.isFunction(comparator))
                                comparator = _.bind(comparator, this);
                            // Run sort based on type of `comparator`.
                            if (length === 1 || _.isString(comparator)) {
                                this.models = this.sortBy(comparator);
                            } else {
                                this.models.sort(comparator);
                            }
                            if (!options.silent)
                                this.trigger('sort', this, options);
                            return this;
                        },
                        // Pluck an attribute from each model in the collection.
                        pluck: function (attr) {
                            return this.map(attr + '');
                        },
                        // Fetch the default set of models for this collection, resetting the
                        // collection when they arrive. If `reset: true` is passed, the response
                        // data will be passed through the `reset` method instead of `set`.
                        fetch: function (options) {
                        },
                        // Create a new instance of a model in this collection. Add the model to the
                        // collection immediately, unless `wait: true` is passed, in which case we
                        // wait for the server to agree.
                        create: function (model, options) {
                        },
                        // **parse** converts a response into a list of models to be added to the
                        // collection. The default implementation is just to pass it through.
                        parse: function (resp, options) {
                        },
                        // Create a new collection with an identical list of models as this one.
                        clone: function () {
                        },
                        // Define how to uniquely identify models in the collection.
                        modelId: function (attrs) {
                            return attrs[this.model.prototype.idAttribute || 'id'];
                        },
                        // Private method to reset all internal state. Called when the collection
                        // is first initialized or reset.
                        _reset: function () {
                            this.length = 0;
                            this.models = [];
                            this._byId = {};
                        },
                        // Prepare a hash of attributes (or other model) to be added to this
                        // collection.
                        _prepareModel: function (attrs, options) {
                            if (this._isModel(attrs)) {
                                if (!attrs.collection)
                                    attrs.collection = this;
                                return attrs;
                            }
                            options = options ? _.clone(options) : {};
                            options.collection = this;
                            var model = new this.model(attrs, options);
                            if (!model.validationError)
                                return model;
                            this.trigger('invalid', this, model.validationError, options);
                            return false;
                        },
                        // Internal method called by both remove and set.
                        _removeModels: function (models, options) {
                            var removed = [];
                            for (var i = 0; i < models.length; i++) {
                                var model = this.get(models[i]);
                                if (!model)
                                    continue;
                                var index = this.indexOf(model);
                                this.models.splice(index, 1);
                                this.length--;
                                // Remove references before triggering 'remove' event to prevent an
                                // infinite loop. #3693
                                delete this._byId[model.cid];
                                var id = this.modelId(model.attributes);
                                if (id != null)
                                    delete this._byId[id];
                                if (!options.silent) {
                                    options.index = index;
                                    model.trigger('remove', model, this, options);
                                }
                                removed.push(model);
                                this._removeReference(model, options);
                            }
                            return removed;
                        },
                        // Method for checking whether an object should be considered a model for
                        // the purposes of adding to the collection.
                        _isModel: function (model) {
                            return model instanceof Model;
                        },
                        // Internal method to create a model's ties to a collection.
                        _addReference: function (model, options) {
                            this._byId[model.cid] = model;
                            var id = this.modelId(model.attributes);
                            if (id != null)
                                this._byId[id] = model;
                            model.on('all', this._onModelEvent, this);
                        },
                        // Internal method to sever a model's ties to a collection.
                        _removeReference: function (model, options) {
                            delete this._byId[model.cid];
                            var id = this.modelId(model.attributes);
                            if (id != null)
                                delete this._byId[id];
                            if (this === model.collection)
                                delete model.collection;
                            model.off('all', this._onModelEvent, this);
                        },
                        // Internal method called every time a model in the set fires an event.
                        // Sets need to update their indexes when models change ids. All other
                        // events simply proxy through. "add" and "remove" events that originate
                        // in other collections are ignored.
                        _onModelEvent: function (event, model, collection, options) {
                            if (model) {
                                if ((event === 'add' || event === 'remove') && collection !== this)
                                    return;
                                if (event === 'destroy')
                                    this.remove(model, options);
                                if (event === 'change') {
                                    var prevId = this.modelId(model.previousAttributes());
                                    var id = this.modelId(model.attributes);
                                    if (prevId !== id) {
                                        if (prevId != null)
                                            delete this._byId[prevId];
                                        if (id != null)
                                            this._byId[id] = model;
                                    }
                                }
                            }
                            this.trigger.apply(this, arguments);
                        }
                    });
                    // Underscore methods that we want to implement on the Collection.
                    // 90% of the core usefulness of Backbone Collections is actually implemented
                    // right here:
                    var collectionMethods = {
                        forEach: 3,
                        each: 3,
                        map: 3,
                        collect: 3,
                        reduce: 0,
                        foldl: 0,
                        inject: 0,
                        reduceRight: 0,
                        foldr: 0,
                        find: 3,
                        detect: 3,
                        filter: 3,
                        select: 3,
                        reject: 3,
                        every: 3,
                        all: 3,
                        some: 3,
                        any: 3,
                        include: 3,
                        includes: 3,
                        contains: 3,
                        invoke: 0,
                        max: 3,
                        min: 3,
                        toArray: 1,
                        size: 1,
                        first: 3,
                        head: 3,
                        take: 3,
                        initial: 3,
                        rest: 3,
                        tail: 3,
                        drop: 3,
                        last: 3,
                        without: 0,
                        difference: 0,
                        indexOf: 3,
                        shuffle: 1,
                        lastIndexOf: 3,
                        isEmpty: 1,
                        chain: 1,
                        sample: 3,
                        partition: 3,
                        groupBy: 3,
                        countBy: 3,
                        sortBy: 3,
                        indexBy: 3,
                        findIndex: 3,
                        findLastIndex: 3
                    };
                    // Mix in each Underscore method as a proxy to `Collection#models`.
                    addUnderscoreMethods(Collection, collectionMethods, 'models');
                    // Backbone.View
                    // -------------
                    // Backbone Views are almost more convention than they are actual code. A View
                    // is simply a JavaScript object that represents a logical chunk of UI in the
                    // DOM. This might be a single item, an entire list, a sidebar or panel, or
                    // even the surrounding frame which wraps your whole app. Defining a chunk of
                    // UI as a **View** allows you to define your DOM events declaratively, without
                    // having to worry about render order ... and makes it easy for the view to
                    // react to specific changes in the state of your models.
                    // Creating a Backbone.View creates its initial element outside of the DOM,
                    // if an existing element is not provided...
                    var View = Backbone.View = function (options) {
                        this.cid = _.uniqueId('view');
                        _.extend(this, _.pick(options, viewOptions));
                        this._ensureElement();
                        this.initialize.apply(this, arguments);
                    };
                    // Cached regex to split keys for `delegate`.
                    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
                    // List of view options to be set as properties.
                    var viewOptions = [
                        'model',
                        'collection',
                        'el',
                        'id',
                        'attributes',
                        'className',
                        'tagName',
                        'events'
                    ];
                    // Set up all inheritable **Backbone.View** properties and methods.
                    _.extend(View.prototype, Events, {
                        // The default `tagName` of a View's element is `"div"`.
                        tagName: 'div',
                        // jQuery delegate for element lookup, scoped to DOM elements within the
                        // current view. This should be preferred to global lookups where possible.
                        $: function (selector) {
                            return this.$el.find(selector);
                        },
                        // Initialize is an empty function by default. Override it with your own
                        // initialization logic.
                        initialize: function () {
                        },
                        // **render** is the core function that your view should override, in order
                        // to populate its element (`this.el`), with the appropriate HTML. The
                        // convention is for **render** to always return `this`.
                        render: function () {
                            return this;
                        },
                        // Remove this view by taking the element out of the DOM, and removing any
                        // applicable Backbone.Events listeners.
                        remove: function () {
                            this._removeElement();
                            this.stopListening();
                            return this;
                        },
                        // Remove this view's element from the document and all event listeners
                        // attached to it. Exposed for subclasses using an alternative DOM
                        // manipulation API.
                        _removeElement: function () {
                            this.$el.remove();
                        },
                        // Change the view's element (`this.el` property) and re-delegate the
                        // view's events on the new element.
                        setElement: function (element) {
                            this.undelegateEvents();
                            this._setElement(element);
                            this.delegateEvents();
                            return this;
                        },
                        // Creates the `this.el` and `this.$el` references for this view using the
                        // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
                        // context or an element. Subclasses can override this to utilize an
                        // alternative DOM manipulation API and are only required to set the
                        // `this.el` property.
                        _setElement: function (el) {
                            this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
                            this.el = this.$el[0];
                        },
                        // Set callbacks, where `this.events` is a hash of
                        //
                        // *{"event selector": "callback"}*
                        //
                        //     {
                        //       'mousedown .title':  'edit',
                        //       'click .button':     'save',
                        //       'click .open':       function(e) { ... }
                        //     }
                        //
                        // pairs. Callbacks will be bound to the view, with `this` set properly.
                        // Uses event delegation for efficiency.
                        // Omitting the selector binds the event to `this.el`.
                        delegateEvents: function (events) {
                            events || (events = _.result(this, 'events'));
                            if (!events)
                                return this;
                            this.undelegateEvents();
                            for (var key in events) {
                                var method = events[key];
                                if (!_.isFunction(method))
                                    method = this[method];
                                if (!method)
                                    continue;
                                var match = key.match(delegateEventSplitter);
                                this.delegate(match[1], match[2], _.bind(method, this));
                            }
                            return this;
                        },
                        // Add a single event listener to the view's element (or a child element
                        // using `selector`). This only works for delegate-able events: not `focus`,
                        // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
                        delegate: function (eventName, selector, listener) {
                            this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
                            return this;
                        },
                        // Clears all callbacks previously bound to the view by `delegateEvents`.
                        // You usually don't need to use this, but may wish to if you have multiple
                        // Backbone views attached to the same DOM element.
                        undelegateEvents: function () {
                            if (this.$el)
                                this.$el.off('.delegateEvents' + this.cid);
                            return this;
                        },
                        // A finer-grained `undelegateEvents` for removing a single delegated event.
                        // `selector` and `listener` are both optional.
                        undelegate: function (eventName, selector, listener) {
                        },
                        // Produces a DOM element to be assigned to your view. Exposed for
                        // subclasses using an alternative DOM manipulation API.
                        _createElement: function (tagName) {
                            return document.createElement(tagName);
                        },
                        // Ensure that the View has a DOM element to render into.
                        // If `this.el` is a string, pass it through `$()`, take the first
                        // matching element, and re-assign it to `el`. Otherwise, create
                        // an element from the `id`, `className` and `tagName` properties.
                        _ensureElement: function () {
                            if (!this.el) {
                                var attrs = _.extend({}, _.result(this, 'attributes'));
                                if (this.id)
                                    attrs.id = _.result(this, 'id');
                                if (this.className)
                                    attrs['class'] = _.result(this, 'className');
                                this.setElement(this._createElement(_.result(this, 'tagName')));
                                this._setAttributes(attrs);
                            } else {
                                this.setElement(_.result(this, 'el'));
                            }
                        },
                        // Set attributes from a hash on this view's element.  Exposed for
                        // subclasses using an alternative DOM manipulation API.
                        _setAttributes: function (attributes) {
                            this.$el.attr(attributes);
                        }
                    });
                    // Backbone.sync
                    // -------------
                    // Override this function to change the manner in which Backbone persists
                    // models to the server. You will be passed the type of request, and the
                    // model in question. By default, makes a RESTful Ajax request
                    // to the model's `url()`. Some possible customizations could be:
                    //
                    // * Use `setTimeout` to batch rapid-fire updates into a single request.
                    // * Send up the models as XML instead of JSON.
                    // * Persist models via WebSockets instead of Ajax.
                    //
                    // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
                    // as `POST`, with a `_method` parameter containing the true HTTP method,
                    // as well as all requests with the body as `application/x-www-form-urlencoded`
                    // instead of `application/json` with the model in a param named `model`.
                    // Useful when interfacing with server-side languages like **PHP** that make
                    // it difficult to read the body of `PUT` requests.
                    Backbone.sync = function (method, model, options) {
                    };
                    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
                    var methodMap = {
                        'create': 'POST',
                        'update': 'PUT',
                        'patch': 'PATCH',
                        'delete': 'DELETE',
                        'read': 'GET'
                    };
                    // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
                    // Override this if you'd like to use a different library.
                    Backbone.ajax = function () {
                    };
                    // Backbone.Router
                    // ---------------
                    // Routers map faux-URLs to actions, and fire events when routes are
                    // matched. Creating a new one sets its `routes` hash, if not set statically.
                    var Router = Backbone.Router = function (options) {
                    };
                    // Cached regular expressions for matching named param parts and splatted
                    // parts of route strings.
                    var optionalParam = /\((.*?)\)/g;
                    var namedParam = /(\(\?)?:\w+/g;
                    var splatParam = /\*\w+/g;
                    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
                    // Set up all inheritable **Backbone.Router** properties and methods.
                    _.extend(Router.prototype, Events, {
                        // Initialize is an empty function by default. Override it with your own
                        // initialization logic.
                        initialize: function () {
                        },
                        // Manually bind a single named route to a callback. For example:
                        //
                        //     this.route('search/:query/p:num', 'search', function(query, num) {
                        //       ...
                        //     });
                        //
                        route: function (route, name, callback) {
                        },
                        // Execute a route handler with the provided parameters.  This is an
                        // excellent place to do pre-route setup or post-route cleanup.
                        execute: function (callback, args, name) {
                        },
                        // Simple proxy to `Backbone.history` to save a fragment into the history.
                        navigate: function (fragment, options) {
                        },
                        // Bind all defined routes to `Backbone.history`. We have to reverse the
                        // order of the routes here to support behavior where the most general
                        // routes can be defined at the bottom of the route map.
                        _bindRoutes: function () {
                        },
                        // Convert a route string into a regular expression, suitable for matching
                        // against the current location hash.
                        _routeToRegExp: function (route) {
                        },
                        // Given a route, and a URL fragment that it matches, return the array of
                        // extracted decoded parameters. Empty or unmatched parameters will be
                        // treated as `null` to normalize cross-browser behavior.
                        _extractParameters: function (route, fragment) {
                        }
                    });
                    // Backbone.History
                    // ----------------
                    // Handles cross-browser history management, based on either
                    // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
                    // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
                    // and URL fragments. If the browser supports neither (old IE, natch),
                    // falls back to polling.
                    var History = Backbone.History = function () {
                        this.handlers = [];
                        this.checkUrl = _.bind(this.checkUrl, this);
                        // Ensure that `History` can be used outside of the browser.
                        if (typeof window !== 'undefined') {
                            this.location = window.location;
                            this.history = window.history;
                        }
                    };
                    // Cached regex for stripping a leading hash/slash and trailing space.
                    var routeStripper = /^[#\/]|\s+$/g;
                    // Cached regex for stripping leading and trailing slashes.
                    var rootStripper = /^\/+|\/+$/g;
                    // Cached regex for stripping urls of hash.
                    var pathStripper = /#.*$/;
                    // Has the history handling already been started?
                    History.started = false;
                    // Set up all inheritable **Backbone.History** properties and methods.
                    _.extend(History.prototype, Events, {
                        // The default interval to poll for hash changes, if necessary, is
                        // twenty times a second.
                        interval: 50,
                        // Are we at the app root?
                        atRoot: function () {
                        },
                        // Does the pathname match the root?
                        matchRoot: function () {
                        },
                        // Unicode characters in `location.pathname` are percent encoded so they're
                        // decoded for comparison. `%25` should not be decoded since it may be part
                        // of an encoded parameter.
                        decodeFragment: function (fragment) {
                        },
                        // In IE6, the hash fragment and search params are incorrect if the
                        // fragment contains `?`.
                        getSearch: function () {
                        },
                        // Gets the true hash value. Cannot use location.hash directly due to bug
                        // in Firefox where location.hash will always be decoded.
                        getHash: function (window) {
                        },
                        // Get the pathname and search params, without the root.
                        getPath: function () {
                        },
                        // Get the cross-browser normalized URL fragment from the path or hash.
                        getFragment: function (fragment) {
                        },
                        // Start the hash change handling, returning `true` if the current URL matches
                        // an existing route, and `false` otherwise.
                        start: function (options) {
                        },
                        // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
                        // but possibly useful for unit testing Routers.
                        stop: function () {
                        },
                        // Add a route to be tested when the fragment changes. Routes added later
                        // may override previous routes.
                        route: function (route, callback) {
                        },
                        // Checks the current URL to see if it has changed, and if it has,
                        // calls `loadUrl`, normalizing across the hidden iframe.
                        checkUrl: function (e) {
                        },
                        // Attempt to load the current URL fragment. If a route succeeds with a
                        // match, returns `true`. If no defined routes matches the fragment,
                        // returns `false`.
                        loadUrl: function (fragment) {
                        },
                        // Save a fragment into the hash history, or replace the URL state if the
                        // 'replace' option is passed. You are responsible for properly URL-encoding
                        // the fragment in advance.
                        //
                        // The options object can contain `trigger: true` if you wish to have the
                        // route callback be fired (not usually desirable), or `replace: true`, if
                        // you wish to modify the current URL without adding an entry to the history.
                        navigate: function (fragment, options) {
                        },
                        // Update the hash location, either replacing the current entry, or adding
                        // a new one to the browser history.
                        _updateHash: function (location, fragment, replace) {
                        }
                    });
                    // Create the default Backbone.history.
                    Backbone.history = new History();
                    // Helpers
                    // -------
                    // Helper function to correctly set up the prototype chain for subclasses.
                    // Similar to `goog.inherits`, but uses a hash of prototype properties and
                    // class properties to be extended.
                    var extend = function (protoProps, staticProps) {
                        var parent = this;
                        var child;
                        // The constructor function for the new subclass is either defined by you
                        // (the "constructor" property in your `extend` definition), or defaulted
                        // by us to simply call the parent constructor.
                        if (protoProps && _.has(protoProps, 'constructor')) {
                            child = protoProps.constructor;
                        } else {
                            child = function () {
                                return parent.apply(this, arguments);
                            };
                        }
                        // Add static properties to the constructor function, if supplied.
                        _.extend(child, parent, staticProps);
                        // Set the prototype chain to inherit from `parent`, without calling
                        // `parent`'s constructor function and add the prototype properties.
                        child.prototype = _.create(parent.prototype, protoProps);
                        child.prototype.constructor = child;
                        // Set a convenience property in case the parent's prototype is needed
                        // later.
                        child.__super__ = parent.prototype;
                        return child;
                    };
                    // Set up inheritance for the model, collection, router, view and history.
                    Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
                    // Throw an error when a URL is needed, and none is supplied.
                    var urlError = function () {
                    };
                    // Wrap an optional error callback with a fallback error event.
                    var wrapError = function (model, options) {
                    };
                    return Backbone;
                }));
            }.call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            'jquery': 11,
            'underscore': 12
        }
    ],
    11: [
        function (require, module, exports) {
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
                        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
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
                    },
                    // results is for internal usage only
                    makeArray: function (arr, results) {
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
                    },
                    // arg is for internal usage only
                    map: function (elems, callback, arg) {
                        var length, value, i = 0, ret = [];
                        // Go through the array, translating each of the items to their new values
                        if (isArrayLike(elems)) {
                            length = elems.length;
                            for (; i < length; i++) {
                                value = callback(elems[i], i, arg);
                                if (value != null) {
                                    ret.push(value);
                                }
                            }    // Go through every key on the object,
                        } else {
                            for (i in elems) {
                                value = callback(elems[i], i, arg);
                                if (value != null) {
                                    ret.push(value);
                                }
                            }
                        }
                        // Flatten any nested arrays
                        return concat.apply([], ret);
                    },
                    // A global GUID counter for objects
                    guid: 1,
                    // Bind a function to a context, optionally partially applying any
                    // arguments.
                    proxy: function (fn, context) {
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
                            });
                            assert(function (div) {
                            });
                        }
                        if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
                            assert(function (div) {
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
                    };
                    Sizzle.matchesSelector = function (elem, expr) {
                    };
                    Sizzle.contains = function (context, elem) {
                    };
                    Sizzle.attr = function (elem, name) {
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
                        var node, ret = '', i = 0, nodeType = elem.nodeType;
                        if (!nodeType) {
                            // If no nodeType, this is expected to be an array
                            while (node = elem[i++]) {
                                // Do not traverse comment nodes
                                ret += getText(node);
                            }
                        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                            // Use textContent for elements
                            // innerText usage removed for consistency of new lines (jQuery #11153)
                            if (typeof elem.textContent === 'string') {
                                return elem.textContent;
                            } else {
                                // Traverse its children
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                                    ret += getText(elem);
                                }
                            }
                        } else if (nodeType === 3 || nodeType === 4) {
                            return elem.nodeValue;
                        }
                        // Do not include comment or processing instruction nodes
                        return ret;
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
                            },
                            'ATTR': function (name, operator, check) {
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
                    };
                    function toSelector(tokens) {
                    }
                    function addCombinator(matcher, combinator, base) {
                    }
                    function elementMatcher(matchers) {
                    }
                    function multipleContexts(selector, contexts, results) {
                    }
                    function condense(unmatched, map, filter, context, xml) {
                    }
                    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                    }
                    function matcherFromTokens(tokens) {
                    }
                    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
                    }
                    compile = Sizzle.compile = function (selector, match) {
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
                    var matched = [];
                    for (; n; n = n.nextSibling) {
                        if (n.nodeType === 1 && n !== elem) {
                            matched.push(n);
                        }
                    }
                    return matched;
                };
                var rneedsContext = jQuery.expr.match.needsContext;
                var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
                var risSimple = /^.[^:#\[\.,]*$/;
                // Implement the identical functionality for filter and not
                function winnow(elements, qualifier, not) {
                }
                jQuery.filter = function (expr, elems, not) {
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
                    },
                    not: function (selector) {
                    },
                    is: function (selector) {
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
                        return siblings(elem.firstChild);
                    },
                    contents: function (elem) {
                    }
                }, function (name, fn) {
                    jQuery.fn[name] = function (until, selector) {
                        var matched = jQuery.map(this, fn, until);
                        if (name.slice(-5) !== 'Until') {
                            selector = until;
                        }
                        if (selector && typeof selector === 'string') {
                            matched = jQuery.filter(selector, matched);
                        }
                        if (this.length > 1) {
                            // Remove duplicates
                            if (!guaranteedUnique[name]) {
                                jQuery.uniqueSort(matched);
                            }
                            // Reverse order for parents* and prev-derivatives
                            if (rparentsprev.test(name)) {
                                matched.reverse();
                            }
                        }
                        return this.pushStack(matched);
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
                    },
                    get: function (owner, key) {
                        return key === undefined ? this.cache(owner) : owner[this.expando] && owner[this.expando][key];
                    },
                    access: function (owner, key, value) {
                    },
                    remove: function (owner, key) {
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
                    // Support: IE9-11+
                    // Use typeof to avoid zero-argument method invocation on host objects (#15151)
                    var ret = typeof context.getElementsByTagName !== 'undefined' ? context.getElementsByTagName(tag || '*') : typeof context.querySelectorAll !== 'undefined' ? context.querySelectorAll(tag || '*') : [];
                    return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
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
                                if (this.type === 'checkbox' && this.click && jQuery.nodeName(this, 'input')) {
                                    this.click();
                                    return false;
                                }
                            },
                            // For cross-browser consistency, don't fire native .click() on links
                            _default: function (event) {
                                return jQuery.nodeName(event.target, 'a');
                            }
                        },
                        beforeunload: {
                            postDispatch: function (event) {
                            }
                        }
                    }
                };
                jQuery.removeEvent = function (elem, type, handle) {
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
                    var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
                    for (; (node = nodes[i]) != null; i++) {
                        if (!keepData && node.nodeType === 1) {
                            jQuery.cleanData(getAll(node));
                        }
                        if (node.parentNode) {
                            if (keepData && jQuery.contains(node.ownerDocument, node)) {
                                setGlobalEval(getAll(node, 'script'));
                            }
                            node.parentNode.removeChild(node);
                        }
                    }
                    return elem;
                }
                jQuery.extend({
                    htmlPrefilter: function (html) {
                    },
                    clone: function (elem, dataAndEvents, deepDataAndEvents) {
                    },
                    cleanData: function (elems) {
                        var data, elem, type, special = jQuery.event.special, i = 0;
                        for (; (elem = elems[i]) !== undefined; i++) {
                            if (acceptData(elem)) {
                                if (data = elem[dataPriv.expando]) {
                                    if (data.events) {
                                        for (type in data.events) {
                                            if (special[type]) {
                                                jQuery.event.remove(elem, type);    // This is a shortcut to avoid jQuery.event.remove's overhead
                                            } else {
                                                jQuery.removeEvent(elem, type, data.handle);
                                            }
                                        }
                                    }
                                    // Support: Chrome <= 35-45+
                                    // Assign undefined instead of using delete, see Data#remove
                                    elem[dataPriv.expando] = undefined;
                                }
                                if (elem[dataUser.expando]) {
                                    // Support: Chrome <= 35-45+
                                    // Assign undefined instead of using delete, see Data#remove
                                    elem[dataUser.expando] = undefined;
                                }
                            }
                        }
                    }
                });
                jQuery.fn.extend({
                    // Keep domManip exposed until 3.0 (gh-2225)
                    domManip: domManip,
                    detach: function (selector) {
                    },
                    remove: function (selector) {
                        return remove(this, selector);
                    },
                    text: function (value) {
                        return access(this, function (value) {
                            return value === undefined ? jQuery.text(this) : this.empty().each(function () {
                            });
                        }, null, value, arguments.length);
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
                        return access(this, function (value) {
                            var elem = this[0] || {}, i = 0, l = this.length;
                            if (value === undefined && elem.nodeType === 1) {
                                return elem.innerHTML;
                            }
                            // See if we can take a shortcut and just use innerHTML
                            if (typeof value === 'string' && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || [
                                    '',
                                    ''
                                ])[1].toLowerCase()]) {
                                value = jQuery.htmlPrefilter(value);
                                try {
                                    for (; i < l; i++) {
                                        elem = this[i] || {};
                                        // Remove element nodes and prevent memory leaks
                                        if (elem.nodeType === 1) {
                                            jQuery.cleanData(getAll(elem, false));
                                            elem.innerHTML = value;
                                        }
                                    }
                                    elem = 0;    // If using innerHTML throws an exception, use the fallback method
                                } catch (e) {
                                }
                            }
                            if (elem) {
                                this.empty().append(value);
                            }
                        }, null, value, arguments.length);
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
                }
                function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
                }
                function getWidthOrHeight(elem, name, extra) {
                }
                function showHide(elements, show) {
                }
                jQuery.extend({
                    // Add in style property hooks for overriding the default
                    // behavior of getting and setting a style property
                    cssHooks: {
                        opacity: {
                            get: function (elem, computed) {
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
                        },
                        set: function (elem, value, extra) {
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
                    },
                    removeClass: function (value) {
                    },
                    toggleClass: function (value, stateVal) {
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
                }
                jQuery.offset = {
                    setOffset: function (elem, options, i) {
                    }
                };
                jQuery.fn.extend({
                    offset: function (options) {
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
        },
        {}
    ],
    12: [
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
                    if (!_.isObject(prototype))
                        return {};
                    if (nativeCreate)
                        return nativeCreate(prototype);
                    Ctor.prototype = prototype;
                    var result = new Ctor();
                    Ctor.prototype = null;
                    return result;
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
                        for (; index >= 0 && index < length; index += dir) {
                            var currentKey = keys ? keys[index] : index;
                            memo = iteratee(memo, obj[currentKey], currentKey, obj);
                        }
                        return memo;
                    }
                    return function (obj, iteratee, memo, context) {
                        iteratee = optimizeCb(iteratee, context, 4);
                        var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = dir > 0 ? 0 : length - 1;
                        // Determine the initial value if none is provided.
                        if (arguments.length < 3) {
                            memo = obj[keys ? keys[index] : index];
                            index += dir;
                        }
                        return iterator(obj, iteratee, memo, keys, index, length);
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
                    var results = [];
                    predicate = cb(predicate, context);
                    _.each(obj, function (value, index, list) {
                        if (predicate(value, index, list))
                            results.push(value);
                    });
                    return results;
                };
                // Return all the elements for which a truth test fails.
                _.reject = function (obj, predicate, context) {
                };
                // Determine whether all of the elements match a truth test.
                // Aliased as `all`.
                _.every = _.all = function (obj, predicate, context) {
                    predicate = cb(predicate, context);
                    var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length;
                    for (var index = 0; index < length; index++) {
                        var currentKey = keys ? keys[index] : index;
                        if (!predicate(obj[currentKey], currentKey, obj))
                            return false;
                    }
                    return true;
                };
                // Determine if at least one element in the object matches a truth test.
                // Aliased as `any`.
                _.some = _.any = function (obj, predicate, context) {
                };
                // Determine if the array or object contains a given item (using `===`).
                // Aliased as `includes` and `include`.
                _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
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
                    if (!(callingContext instanceof boundFunc))
                        return sourceFunc.apply(context, args);
                    var self = baseCreate(sourceFunc.prototype);
                    var result = sourceFunc.apply(self, args);
                    if (_.isObject(result))
                        return result;
                    return self;
                };
                // Create a function bound to a given object (assigning `this`, and arguments,
                // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
                // available.
                _.bind = function (func, context) {
                    if (nativeBind && func.bind === nativeBind)
                        return nativeBind.apply(func, slice.call(arguments, 1));
                    if (!_.isFunction(func))
                        throw new TypeError('Bind must be called on a function');
                    var args = slice.call(arguments, 2);
                    var bound = function () {
                    };
                    return bound;
                };
                // Partially apply a function by creating a version that has had some of its
                // arguments pre-filled, without changing its dynamic `this` context. _ acts
                // as a placeholder, allowing any combination of arguments to be pre-filled.
                _.partial = function (func) {
                    var boundArgs = slice.call(arguments, 1);
                    var bound = function () {
                        var position = 0, length = boundArgs.length;
                        var args = Array(length);
                        for (var i = 0; i < length; i++) {
                            args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
                        }
                        while (position < arguments.length)
                            args.push(arguments[position++]);
                        return executeBound(func, bound, this, this, args);
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
                    var memo;
                    return function () {
                        if (--times > 0) {
                            memo = func.apply(this, arguments);
                        }
                        if (times <= 1)
                            func = null;
                        return memo;
                    };
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
                            return key in obj;
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
                };
                // Fill in a given object with default properties.
                _.defaults = createAssigner(_.allKeys, true);
                // Creates an object that inherits from the given prototype object.
                // If additional properties are provided then they will be added to the
                // created object.
                _.create = function (prototype, props) {
                    var result = baseCreate(prototype);
                    if (props)
                        _.extendOwn(result, props);
                    return result;
                };
                // Create a (shallow-cloned) duplicate of an object.
                _.clone = function (obj) {
                    if (!_.isObject(obj))
                        return obj;
                    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
                };
                // Invokes interceptor with the obj, and then returns obj.
                // The primary purpose of this method is to "tap into" a method chain, in
                // order to perform operations on intermediate results within the chain.
                _.tap = function (obj, interceptor) {
                };
                // Returns whether an object has a given set of `key:value` pairs.
                _.isMatch = function (object, attrs) {
                    var keys = _.keys(attrs), length = keys.length;
                    if (object == null)
                        return !length;
                    var obj = Object(object);
                    for (var i = 0; i < length; i++) {
                        var key = keys[i];
                        if (attrs[key] !== obj[key] || !(key in obj))
                            return false;
                    }
                    return true;
                };
                // Internal recursive comparison function for `isEqual`.
                var eq = function (a, b, aStack, bStack) {
                    // Identical objects are equal. `0 === -0`, but they aren't identical.
                    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
                    if (a === b)
                        return a !== 0 || 1 / a === 1 / b;
                    // A strict comparison is necessary because `null == undefined`.
                    if (a == null || b == null)
                        return a === b;
                    // Unwrap any wrapped objects.
                    if (a instanceof _)
                        a = a._wrapped;
                    if (b instanceof _)
                        b = b._wrapped;
                    // Compare `[[Class]]` names.
                    var className = toString.call(a);
                    if (className !== toString.call(b))
                        return false;
                    switch (className) {
                    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
                    case '[object RegExp]':
                    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
                    case '[object String]':
                        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                        // equivalent to `new String("5")`.
                        return '' + a === '' + b;
                    case '[object Number]':
                        // `NaN`s are equivalent, but non-reflexive.
                        // Object(NaN) is equivalent to NaN
                        if (+a !== +a)
                            return +b !== +b;
                        // An `egal` comparison is performed for other numeric values.
                        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                    case '[object Date]':
                    case '[object Boolean]':
                        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                        // millisecond representations. Note that invalid dates with millisecond representations
                        // of `NaN` are not equivalent.
                        return +a === +b;
                    }
                    var areArrays = className === '[object Array]';
                    if (!areArrays) {
                        if (typeof a != 'object' || typeof b != 'object')
                            return false;
                        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
                        // from different frames are.
                        var aCtor = a.constructor, bCtor = b.constructor;
                        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
                            return false;
                        }
                    }
                    // Assume equality for cyclic structures. The algorithm for detecting cyclic
                    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
                    // Initializing stack of traversed objects.
                    // It's done here since we only need them for objects and arrays comparison.
                    aStack = aStack || [];
                    bStack = bStack || [];
                    var length = aStack.length;
                    while (length--) {
                        // Linear search. Performance is inversely proportional to the number of
                        // unique nested structures.
                        if (aStack[length] === a)
                            return bStack[length] === b;
                    }
                    // Add the first object to the stack of traversed objects.
                    aStack.push(a);
                    bStack.push(b);
                    // Recursively compare objects and arrays.
                    if (areArrays) {
                        // Compare array lengths to determine if a deep comparison is necessary.
                        length = a.length;
                        if (length !== b.length)
                            return false;
                        // Deep compare the contents, ignoring non-numeric properties.
                        while (length--) {
                            if (!eq(a[length], b[length], aStack, bStack))
                                return false;
                        }
                    } else {
                        // Deep compare objects.
                        var keys = _.keys(a), key;
                        length = keys.length;
                        // Ensure that both objects contain the same number of properties before comparing deep equality.
                        if (_.keys(b).length !== length)
                            return false;
                        while (length--) {
                            // Deep compare each member
                            key = keys[length];
                            if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack)))
                                return false;
                        }
                    }
                    // Remove the first object from the stack of traversed objects.
                    aStack.pop();
                    bStack.pop();
                    return true;
                };
                // Perform a deep comparison to check if two objects are equal.
                _.isEqual = function (a, b) {
                    return eq(a, b);
                };
                // Is a given array, string, or object empty?
                // An "empty" object has no enumerable own-properties.
                _.isEmpty = function (obj) {
                    if (obj == null)
                        return true;
                    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)))
                        return obj.length === 0;
                    return _.keys(obj).length === 0;
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
                    return obj === null;
                };
                // Is a given variable undefined?
                _.isUndefined = function (obj) {
                };
                // Shortcut function for checking if an object has a given property directly
                // on itself (in other words, not on a prototype).
                _.has = function (obj, key) {
                    return obj != null && hasOwnProperty.call(obj, key);
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
                    attrs = _.extendOwn({}, attrs);
                    return function (obj) {
                        return _.isMatch(obj, attrs);
                    };
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
                    var value = object == null ? void 0 : object[property];
                    if (value === void 0) {
                        value = fallback;
                    }
                    return _.isFunction(value) ? value.call(object) : value;
                };
                // Generate a unique integer id (unique within the entire client session).
                // Useful for temporary DOM ids.
                var idCounter = 0;
                _.uniqueId = function (prefix) {
                    var id = ++idCounter + '';
                    return prefix ? prefix + id : id;
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
                    if (!settings && oldSettings)
                        settings = oldSettings;
                    settings = _.defaults({}, settings, _.templateSettings);
                    // Combine delimiters into one regular expression via alternation.
                    var matcher = RegExp([
                        (settings.escape || noMatch).source,
                        (settings.interpolate || noMatch).source,
                        (settings.evaluate || noMatch).source
                    ].join('|') + '|$', 'g');
                    // Compile the template source, escaping string literals appropriately.
                    var index = 0;
                    var source = '__p+=\'';
                    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                        source += text.slice(index, offset).replace(escaper, escapeChar);
                        index = offset + match.length;
                        if (escape) {
                            source += '\'+\n((__t=(' + escape + '))==null?\'\':_.escape(__t))+\n\'';
                        } else if (interpolate) {
                            source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
                        } else if (evaluate) {
                            source += '\';\n' + evaluate + '\n__p+=\'';
                        }
                        // Adobe VMs need the match returned to produce the correct offest.
                        return match;
                    });
                    source += '\';\n';
                    // If a variable is not specified, place data values in local scope.
                    if (!settings.variable)
                        source = 'with(obj||{}){\n' + source + '}\n';
                    source = 'var __t,__p=\'\',__j=Array.prototype.join,' + 'print=function(){__p+=__j.call(arguments,\'\');};\n' + source + 'return __p;\n';
                    try {
                        var render = new Function(settings.variable || 'obj', '_', source);
                    } catch (e) {
                        e.source = source;
                        throw e;
                    }
                    var template = function (data) {
                        return render.call(this, data, _);
                    };
                    // Provide the compiled source as a convenience for precompilation.
                    var argument = settings.variable || 'obj';
                    template.source = 'function(' + argument + '){\n' + source + '}';
                    return template;
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
    ],
    13: [
        function (require, module, exports) {
            var Table = require('./views/table.js');
            Table.tbody = require('./views/tbody');
            Table.tbodyTr = require('./views/tbodyTr');
            Table.thead = require('./views/thead');
            Table.theadTh = require('./views/theadTh');
            Table.theadTr = require('./views/theadTr');
            Table.sorter = require('./sorter');
            Table.models = {};
            Table.models.th = require('./models/th');
            module.exports = Table;
        },
        {
            './models/th': 14,
            './sorter': 15,
            './views/table.js': 16,
            './views/tbody': 17,
            './views/tbodyTr': 18,
            './views/thead': 21,
            './views/theadTh': 22,
            './views/theadTr': 23
        }
    ],
    14: [
        function (require, module, exports) {
            var Model = require('backbone-kinview').models.model;
            module.exports = Model.extend({
                toggleState: function () {
                    switch (this.get('state')) {
                    default:
                    case false:
                        this.set('state', 'up');
                        break;
                    case 'up':
                        this.set('state', 'down');
                        break;
                    case 'down':
                        this.set('state', null);
                        break;
                    }
                }
            });
        },
        { 'backbone-kinview': 5 }
    ],
    15: [
        function (require, module, exports) {
            var _ = require('underscore');
            var Sorter = function (collection, attr, sorter) {
                this.collection = collection;
                this.attr = attr;
                this.isReverse = null;
                this.sorter = typeof this[sorter] == 'function' ? _.bind(this[sorter], this) : _.bind(sorter, this);
            };
            module.exports = Sorter;
            Sorter.prototype.getSorter = function (model) {
                var that = this;
                return function (model) {
                    var state = model.get('state');
                    if (state !== null) {
                        that.isReverse = state == 'up' ? false : true;
                    }
                    if (that.isReverse !== null) {
                        that.collection.comparator = that.sorter;
                        that.collection.sort();
                    } else {
                        that.reset();
                    }
                };
            };
            Sorter.prototype.string = function (a, b) {
                if (this.isReverse) {
                    return -getAttr(a, this.attr).localeCompare(getAttr(b, this.attr));
                }
                return getAttr(a, this.attr).localeCompare(getAttr(b, this.attr));
            };
            Sorter.prototype.int = function (a, b) {
                var rep = /[^0-9]/g;
                var i = getAttr(a, this.attr), j = getAttr(b, this.attr);
                i = _.isNumber(i) ? i : Number(i.replace(rep, ''));
                j = _.isNumber(j) ? j : Number(j.replace(rep, ''));
                if (this.isReverse) {
                    return j <= i ? -1 : 1;
                }
                return i <= j ? -1 : 1;
            };
            Sorter.prototype.reset = function () {
                var origAttr = this.attr;
                var origSorter = this.sorter;
                this.attr = 'cid';
                this.isReverse = null;
                this.collection.comparator = _.bind(this.int, this);
                this.collection.sort();
                this.attr = origAttr;
                this.collection.comparator = origSorter;
                return this;
            };
            var getAttr = function (model, name) {
                if (name in model) {
                    return model[name];
                }
                return model.get(name);
            };
        },
        { 'underscore': 12 }
    ],
    16: [
        function (require, module, exports) {
            var Backbone = require('backbone'), THead = require('./thead'), TFoot = require('./tfoot'), TBody = require('./tbody');
            module.exports = Backbone.View.extend({
                tagName: 'table',
                constructor: function () {
                    this.head = new THead();
                    this.body = new TBody();
                    Backbone.View.apply(this, arguments);
                    this.superRemove = Backbone.View.prototype.remove;
                },
                render: function () {
                    this.el.appendChild(this.head.el);
                    this.el.appendChild(this.body.el);
                    return this;
                },
                remove: function () {
                    this.head.remove();
                    if (this.foot) {
                        this.foot.remove();
                    }
                    this.body.remove();
                    this.superRemove();
                },
                addColumn: function () {
                    return this.head.row.addCol.apply(this.head.row, arguments);
                },
                addRow: function () {
                    return this.body.addRow.apply(this.body, arguments);
                },
                setFoot: function (data) {
                    if (!this.foot) {
                        this.foot = new TFoot();
                        this.$('thead')[0].parentNode.insertBefore(this.foot.el, this.$('thead')[0].nextSibling);
                    }
                    this.foot.tr.render(data);
                }
            });
        },
        {
            './tbody': 17,
            './tfoot': 19,
            './thead': 21,
            'backbone': 10
        }
    ],
    17: [
        function (require, module, exports) {
            var CollectionView = require('backbone-collectionview'), Tr = require('./tbodyTr.js'), Sorter = require('../sorter');
            module.exports = CollectionView.extend({
                childView: Tr,
                tagName: 'tbody',
                initialize: function (opts) {
                },
                addRow: function (model) {
                    return this.addChild(model);
                },
                getSorter: function (attr, sorter) {
                    var s = new Sorter(this.collection, attr, sorter);
                    return s.getSorter();
                }
            });
        },
        {
            '../sorter': 15,
            './tbodyTr.js': 18,
            'backbone-collectionview': 2
        }
    ],
    18: [
        function (require, module, exports) {
            var ChildView = require('backbone-collectionview').childView, _ = require('underscore');
            module.exports = ChildView.extend({
                tagName: 'tr',
                render: function () {
                    var tr = _.reduce(this.model.toJSON(), function (tr, attr) {
                        return tr += '<td>' + attr + '</td>';
                    }, '');
                    this.el.innerHTML = tr;
                }
            });
        },
        {
            'backbone-collectionview': 2,
            'underscore': 12
        }
    ],
    19: [
        function (require, module, exports) {
            var Backbone = require('backbone'), KinView = require('backbone-kinview'), Tr = require('./tfootTr.js');
            module.exports = KinView.extend({
                tagName: 'tfoot',
                initialize: function () {
                    this.tr = new Tr();
                    this.render();
                },
                render: function (data) {
                    this.tr.render(data);
                    this.el.appendChild(this.tr.el);
                },
                remove: function () {
                    this.tr.remove();
                    this.superRemove();
                }
            });
        },
        {
            './tfootTr.js': 20,
            'backbone': 10,
            'backbone-kinview': 5
        }
    ],
    20: [
        function (require, module, exports) {
            var Backbone = require('backbone'), _ = require('underscore');
            module.exports = Backbone.View.extend({
                tagName: 'tr',
                initialize: function () {
                    this.render({});
                },
                render: function (data) {
                    var tr = _.reduce(data, function (tr, attr) {
                        return tr += '<th>' + attr + '</th>';
                    }, '');
                    this.el.innerHTML = tr;
                }
            });
        },
        {
            'backbone': 10,
            'underscore': 12
        }
    ],
    21: [
        function (require, module, exports) {
            var Backbone = require('backbone'), KinView = require('backbone-kinview'), Row = require('./theadTr.js');
            module.exports = KinView.extend({
                tagName: 'thead',
                initialize: function () {
                    this.row = new Row();
                    this.render();
                },
                render: function () {
                    this.el.appendChild(this.row.el);
                },
                // raw add, you should probably be using this.row.addCol()
                add: function () {
                    return this.row.add.apply(this.row, arguments);
                },
                remove: function () {
                    this.row.remove();
                    this.superRemove();
                }
            });
        },
        {
            './theadTr.js': 23,
            'backbone': 10,
            'backbone-kinview': 5
        }
    ],
    22: [
        function (require, module, exports) {
            var Backbone = require('backbone'), _ = require('underscore');
            _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };
            module.exports = Backbone.View.extend({
                tagName: 'th',
                template: _.template('{{text}}<i class="fa fa-caret-up"></i>'),
                initialize: function (opts) {
                    this.text = opts.text || '';
                    this.render();
                },
                render: function () {
                    this.el.innerHTML = this.template({ text: this.text });
                },
                renderState: function (foo, order) {
                    var i = this.$('i')[0];
                    switch (order) {
                    case 'up':
                        this.el.classList.add('active');
                        i.classList.remove('fa-caret-down');
                        i.classList.add('fa-caret-up');
                        i.style.visibility = 'visible';
                        break;
                    case 'down':
                        this.el.classList.add('active');
                        i.classList.remove('fa-caret-up');
                        i.classList.add('fa-caret-down');
                        i.style.visibility = 'visible';
                        break;
                    default:
                        this.el.classList.remove('active');
                        i.style.visibility = 'hidden';
                        break;
                    }
                }
            });
        },
        {
            'backbone': 10,
            'underscore': 12
        }
    ],
    23: [
        function (require, module, exports) {
            var Backbone = require('backbone'), _ = require('underscore'), KinView = require('backbone-kinview'), Th = require('./theadTh.js'), thModel = require('../models/th.js');
            module.exports = KinView.extend({
                tagName: 'tr',
                exclusiveState: true,
                Th: Th,
                initialize: function () {
                    this.children.model = thModel;
                    this.render();
                },
                addCol: function (opts) {
                    var model = this.add({
                        view: new this.Th({
                            text: opts.text || '',
                            className: opts.click ? 'sortable' : ''
                        }),
                        hasState: opts.click ? true : false,
                        data: opts.data || {}
                    });
                    var view = model.get('view');
                    view.listenTo(model, 'change:state', view.renderState);
                    if (opts.click) {
                        view.delegate('click', _.bind(this.clickState, this, model, opts.click));
                    }
                    return view;
                },
                clickState: function (model, done) {
                    done.call(this, model);
                }
            });
        },
        {
            '../models/th.js': 14,
            './theadTh.js': 22,
            'backbone': 10,
            'backbone-kinview': 5,
            'underscore': 12
        }
    ]
}, {}, [1]));