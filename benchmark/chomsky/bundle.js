(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _chomsky = require('./../src/chomsky');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demo = function Demo() {
    var _this = this;

    _classCallCheck(this, Demo);

    // Setup Chomsky
    this.chomsky = new _chomsky.Chomsky();
    // Listening for changes
    this.chomsky.onLocaleChange.subscribe(function (locale) {
        console.log('[Language Change]: ' + locale);
        console.log('\t' + _this.chomsky.translate('GREETING', { name: 'John' }));
        console.log('\t' + _this.chomsky.translate('GOODBYE', { name: 'John' }));
        console.log('\t' + _this.chomsky.translate('TODAY', { today: new Date() }));
        console.log('\t' + _this.chomsky.translate('TOMORROW', { tomorrow: '7/4/1776' }));
        console.log('\t' + _this.chomsky.translate('MONEY', { debt: 123456.1 }));
        console.log('\t' + _this.chomsky.translate('NUMBER', { people: 1234567 }));
        console.log('\t' + _this.chomsky.translate('MESSAGES', 0));
        console.log('\t' + _this.chomsky.translate('MESSAGES', 1));
        console.log('\t' + _this.chomsky.translate('MESSAGES', 45));
    });
    // Locales
    var usLocale = 'en-US';
    var frLocale = 'fr-FR';
    var gbLocale = 'en-GB';
    // Swap locales
    this.chomsky.use('en');
    this.chomsky.use(usLocale);
    this.chomsky.use(frLocale);
    this.chomsky.use(gbLocale).subscribe(function () {
        // Load US again (should not fire XHR requests)
        _this.chomsky.use(usLocale);
    });
};

var demo = new Demo();

},{"./../src/chomsky":346}],2:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('./Subject');
var Subscription_1 = require('./Subscription');
/**
 * @class AsyncSubject<T>
 */
var AsyncSubject = function (_super) {
    __extends(AsyncSubject, _super);
    function AsyncSubject() {
    }
    AsyncSubject.prototype._subscribe = function (subscriber) {
    };
    AsyncSubject.prototype.next = function (value) {
    };
    AsyncSubject.prototype.complete = function () {
    };
    return AsyncSubject;
}(Subject_1.Subject);
exports.AsyncSubject = AsyncSubject;    

},{"./Subject":12,"./Subscription":15}],3:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('./Subject');
var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
/**
 * @class BehaviorSubject<T>
 */
var BehaviorSubject = function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
    }
    Object.defineProperty(BehaviorSubject.prototype, 'value', {
        get: function () {
        },
        enumerable: true,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
    };
    BehaviorSubject.prototype.getValue = function () {
    };
    BehaviorSubject.prototype.next = function (value) {
    };
    return BehaviorSubject;
}(Subject_1.Subject);
exports.BehaviorSubject = BehaviorSubject;    

},{"./Subject":12,"./util/ObjectUnsubscribedError":327}],4:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('./Subscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber);
exports.InnerSubscriber = InnerSubscriber;    

},{"./Subscriber":14}],5:[function(require,module,exports){
'use strict';
var Observable_1 = require('./Observable');
/**
 * Represents a push-based event or value that an {@link Observable} can emit.
 * This class is particularly useful for operators that manage notifications,
 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
 * others. Besides wrapping the actual delivered value, it also annotates it
 * with metadata of, for instance, what type of push message it is (`next`,
 * `error`, or `complete`).
 *
 * @see {@link materialize}
 * @see {@link dematerialize}
 * @see {@link observeOn}
 *
 * @class Notification<T>
 */
var Notification = function () {
    function Notification(kind, value, exception) {
        this.kind = kind;
        this.value = value;
        this.exception = exception;
        this.hasValue = kind === 'N';
    }
    /**
     * Delivers to the given `observer` the value wrapped by this Notification.
     * @param {Observer} observer
     * @return
     */
    Notification.prototype.observe = function (observer) {
    };
    /**
     * Given some {@link Observer} callbacks, deliver the value represented by the
     * current Notification to the correctly corresponding callback.
     * @param {function(value: T): void} next An Observer `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    Notification.prototype.do = function (next, error, complete) {
    };
    /**
     * Takes an Observer or its individual callback functions, and calls `observe`
     * or `do` methods accordingly.
     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
     * the `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
    };
    /**
     * Returns a simple Observable that just delivers the notification represented
     * by this Notification instance.
     * @return {any}
     */
    Notification.prototype.toObservable = function () {
    };
    /**
     * A shortcut to create a Notification instance of the type `next` from a
     * given value.
     * @param {T} value The `next` value.
     * @return {Notification<T>} The "next" Notification representing the
     * argument.
     */
    Notification.createNext = function (value) {
    };
    /**
     * A shortcut to create a Notification instance of the type `error` from a
     * given error.
     * @param {any} [err] The `error` exception.
     * @return {Notification<T>} The "error" Notification representing the
     * argument.
     */
    Notification.createError = function (err) {
    };
    /**
     * A shortcut to create a Notification instance of the type `complete`.
     * @return {Notification<any>} The valueless "complete" Notification.
     */
    Notification.createComplete = function () {
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}();
exports.Notification = Notification;    

},{"./Observable":6}],6:[function(require,module,exports){
'use strict';
var root_1 = require('./util/root');
var toSubscriber_1 = require('./util/toSubscriber');
var observable_1 = require('./symbol/observable');
/**
 * A representation of any set of values over any amount of time. This the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is  called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Registers handlers for handling emitted values, error and completions from the observable, and
     *  executes the observable's subscriber function, which will take action to set up the underlying data stream
     * @method subscribe
     * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
     * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled
     * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this);
        } else {
            sink.add(this._subscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.$$observable] = function () {
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
    };
    return Observable;
}();
exports.Observable = Observable;    

},{"./symbol/observable":313,"./util/root":341,"./util/toSubscriber":343}],7:[function(require,module,exports){
'use strict';
exports.empty = {
    closed: true,
    next: function (value) {
    },
    error: function (err) {
    },
    complete: function () {
    }
};    

},{}],8:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('./Subscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var OuterSubscriber = function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber);
exports.OuterSubscriber = OuterSubscriber;    

},{"./Subscriber":14}],9:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('./Subject');
var queue_1 = require('./scheduler/queue');
var observeOn_1 = require('./operator/observeOn');
/**
 * @class ReplaySubject<T>
 */
var ReplaySubject = function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
    }
    ReplaySubject.prototype.next = function (value) {
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
    };
    ReplaySubject.prototype._getNow = function () {
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
    };
    return ReplaySubject;
}(Subject_1.Subject);
exports.ReplaySubject = ReplaySubject;
var ReplayEvent = function () {
    function ReplayEvent(time, value) {
    }
    return ReplayEvent;
}();    

},{"./Subject":12,"./operator/observeOn":249,"./scheduler/queue":311}],10:[function(require,module,exports){
'use strict';
/* tslint:disable:no-unused-variable */
// Subject imported before Observable to bypass circular dependency issue since
// Subject extends Observable and Observable references Subject in it's
// definition
var Subject_1 = require('./Subject');
exports.Subject = Subject_1.Subject;
/* tslint:enable:no-unused-variable */
var Observable_1 = require('./Observable');
exports.Observable = Observable_1.Observable;
// statics
/* tslint:disable:no-use-before-declare */
require('./add/observable/bindCallback');
require('./add/observable/bindNodeCallback');
require('./add/observable/combineLatest');
require('./add/observable/concat');
require('./add/observable/defer');
require('./add/observable/empty');
require('./add/observable/forkJoin');
require('./add/observable/from');
require('./add/observable/fromEvent');
require('./add/observable/fromEventPattern');
require('./add/observable/fromPromise');
require('./add/observable/generate');
require('./add/observable/if');
require('./add/observable/interval');
require('./add/observable/merge');
require('./add/observable/race');
require('./add/observable/never');
require('./add/observable/of');
require('./add/observable/onErrorResumeNext');
require('./add/observable/pairs');
require('./add/observable/range');
require('./add/observable/using');
require('./add/observable/throw');
require('./add/observable/timer');
require('./add/observable/zip');
//dom
require('./add/observable/dom/ajax');
require('./add/observable/dom/webSocket');
//operators
require('./add/operator/buffer');
require('./add/operator/bufferCount');
require('./add/operator/bufferTime');
require('./add/operator/bufferToggle');
require('./add/operator/bufferWhen');
require('./add/operator/cache');
require('./add/operator/catch');
require('./add/operator/combineAll');
require('./add/operator/combineLatest');
require('./add/operator/concat');
require('./add/operator/concatAll');
require('./add/operator/concatMap');
require('./add/operator/concatMapTo');
require('./add/operator/count');
require('./add/operator/dematerialize');
require('./add/operator/debounce');
require('./add/operator/debounceTime');
require('./add/operator/defaultIfEmpty');
require('./add/operator/delay');
require('./add/operator/delayWhen');
require('./add/operator/distinct');
require('./add/operator/distinctKey');
require('./add/operator/distinctUntilChanged');
require('./add/operator/distinctUntilKeyChanged');
require('./add/operator/do');
require('./add/operator/exhaust');
require('./add/operator/exhaustMap');
require('./add/operator/expand');
require('./add/operator/elementAt');
require('./add/operator/filter');
require('./add/operator/finally');
require('./add/operator/find');
require('./add/operator/findIndex');
require('./add/operator/first');
require('./add/operator/groupBy');
require('./add/operator/ignoreElements');
require('./add/operator/isEmpty');
require('./add/operator/audit');
require('./add/operator/auditTime');
require('./add/operator/last');
require('./add/operator/let');
require('./add/operator/every');
require('./add/operator/map');
require('./add/operator/mapTo');
require('./add/operator/materialize');
require('./add/operator/max');
require('./add/operator/merge');
require('./add/operator/mergeAll');
require('./add/operator/mergeMap');
require('./add/operator/mergeMapTo');
require('./add/operator/mergeScan');
require('./add/operator/min');
require('./add/operator/multicast');
require('./add/operator/observeOn');
require('./add/operator/onErrorResumeNext');
require('./add/operator/pairwise');
require('./add/operator/partition');
require('./add/operator/pluck');
require('./add/operator/publish');
require('./add/operator/publishBehavior');
require('./add/operator/publishReplay');
require('./add/operator/publishLast');
require('./add/operator/race');
require('./add/operator/reduce');
require('./add/operator/repeat');
require('./add/operator/repeatWhen');
require('./add/operator/retry');
require('./add/operator/retryWhen');
require('./add/operator/sample');
require('./add/operator/sampleTime');
require('./add/operator/scan');
require('./add/operator/sequenceEqual');
require('./add/operator/share');
require('./add/operator/single');
require('./add/operator/skip');
require('./add/operator/skipUntil');
require('./add/operator/skipWhile');
require('./add/operator/startWith');
require('./add/operator/subscribeOn');
require('./add/operator/switch');
require('./add/operator/switchMap');
require('./add/operator/switchMapTo');
require('./add/operator/take');
require('./add/operator/takeLast');
require('./add/operator/takeUntil');
require('./add/operator/takeWhile');
require('./add/operator/throttle');
require('./add/operator/throttleTime');
require('./add/operator/timeInterval');
require('./add/operator/timeout');
require('./add/operator/timeoutWith');
require('./add/operator/timestamp');
require('./add/operator/toArray');
require('./add/operator/toPromise');
require('./add/operator/window');
require('./add/operator/windowCount');
require('./add/operator/windowTime');
require('./add/operator/windowToggle');
require('./add/operator/windowWhen');
require('./add/operator/withLatestFrom');
require('./add/operator/zip');
require('./add/operator/zipAll');
/* tslint:disable:no-unused-variable */
var Subscription_1 = require('./Subscription');
exports.Subscription = Subscription_1.Subscription;
var Subscriber_1 = require('./Subscriber');
exports.Subscriber = Subscriber_1.Subscriber;
var AsyncSubject_1 = require('./AsyncSubject');
exports.AsyncSubject = AsyncSubject_1.AsyncSubject;
var ReplaySubject_1 = require('./ReplaySubject');
exports.ReplaySubject = ReplaySubject_1.ReplaySubject;
var BehaviorSubject_1 = require('./BehaviorSubject');
exports.BehaviorSubject = BehaviorSubject_1.BehaviorSubject;
var MulticastObservable_1 = require('./observable/MulticastObservable');
exports.MulticastObservable = MulticastObservable_1.MulticastObservable;
var ConnectableObservable_1 = require('./observable/ConnectableObservable');
exports.ConnectableObservable = ConnectableObservable_1.ConnectableObservable;
var Notification_1 = require('./Notification');
exports.Notification = Notification_1.Notification;
var EmptyError_1 = require('./util/EmptyError');
exports.EmptyError = EmptyError_1.EmptyError;
var ArgumentOutOfRangeError_1 = require('./util/ArgumentOutOfRangeError');
exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
exports.ObjectUnsubscribedError = ObjectUnsubscribedError_1.ObjectUnsubscribedError;
var UnsubscriptionError_1 = require('./util/UnsubscriptionError');
exports.UnsubscriptionError = UnsubscriptionError_1.UnsubscriptionError;
var timeInterval_1 = require('./operator/timeInterval');
exports.TimeInterval = timeInterval_1.TimeInterval;
var timestamp_1 = require('./operator/timestamp');
exports.Timestamp = timestamp_1.Timestamp;
var TestScheduler_1 = require('./testing/TestScheduler');
exports.TestScheduler = TestScheduler_1.TestScheduler;
var VirtualTimeScheduler_1 = require('./scheduler/VirtualTimeScheduler');
exports.VirtualTimeScheduler = VirtualTimeScheduler_1.VirtualTimeScheduler;
var AjaxObservable_1 = require('./observable/dom/AjaxObservable');
exports.AjaxResponse = AjaxObservable_1.AjaxResponse;
exports.AjaxError = AjaxObservable_1.AjaxError;
exports.AjaxTimeoutError = AjaxObservable_1.AjaxTimeoutError;
var asap_1 = require('./scheduler/asap');
var async_1 = require('./scheduler/async');
var queue_1 = require('./scheduler/queue');
var animationFrame_1 = require('./scheduler/animationFrame');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
var iterator_1 = require('./symbol/iterator');
var observable_1 = require('./symbol/observable');
/* tslint:enable:no-unused-variable */
/**
 * @typedef {Object} Rx.Scheduler
 * @property {Scheduler} queue Schedules on a queue in the current event frame
 * (trampoline scheduler). Use this for iteration operations.
 * @property {Scheduler} asap Schedules on the micro task queue, which uses the
 * fastest transport mechanism available, either Node.js' `process.nextTick()`
 * or Web Worker MessageChannel or setTimeout or others. Use this for
 * asynchronous conversions.
 * @property {Scheduler} async Schedules work with `setInterval`. Use this for
 * time-based operations.
 * @property {Scheduler} animationFrame Schedules work with `requestAnimationFrame`.
 * Use this for synchronizing with the platform's painting
 */
var Scheduler = {
    asap: asap_1.asap,
    queue: queue_1.queue,
    animationFrame: animationFrame_1.animationFrame,
    async: async_1.async
};
exports.Scheduler = Scheduler;
/**
 * @typedef {Object} Rx.Symbol
 * @property {Symbol|string} rxSubscriber A symbol to use as a property name to
 * retrieve an "Rx safe" Observer from an object. "Rx safety" can be defined as
 * an object that has all of the traits of an Rx Subscriber, including the
 * ability to add and remove subscriptions to the subscription chain and
 * guarantees involving event triggering (can't "next" after unsubscription,
 * etc).
 * @property {Symbol|string} observable A symbol to use as a property name to
 * retrieve an Observable as defined by the [ECMAScript "Observable" spec](https://github.com/zenparsing/es-observable).
 * @property {Symbol|string} iterator The ES6 symbol to use as a property name
 * to retrieve an iterator from an object.
 */
var Symbol = {
    rxSubscriber: rxSubscriber_1.$$rxSubscriber,
    observable: observable_1.$$observable,
    iterator: iterator_1.$$iterator
};
exports.Symbol = Symbol;    

},{"./AsyncSubject":2,"./BehaviorSubject":3,"./Notification":5,"./Observable":6,"./ReplaySubject":9,"./Subject":12,"./Subscriber":14,"./Subscription":15,"./add/observable/bindCallback":16,"./add/observable/bindNodeCallback":17,"./add/observable/combineLatest":18,"./add/observable/concat":19,"./add/observable/defer":20,"./add/observable/dom/ajax":21,"./add/observable/dom/webSocket":22,"./add/observable/empty":23,"./add/observable/forkJoin":24,"./add/observable/from":25,"./add/observable/fromEvent":26,"./add/observable/fromEventPattern":27,"./add/observable/fromPromise":28,"./add/observable/generate":29,"./add/observable/if":30,"./add/observable/interval":31,"./add/observable/merge":32,"./add/observable/never":33,"./add/observable/of":34,"./add/observable/onErrorResumeNext":35,"./add/observable/pairs":36,"./add/observable/race":37,"./add/observable/range":38,"./add/observable/throw":39,"./add/observable/timer":40,"./add/observable/using":41,"./add/observable/zip":42,"./add/operator/audit":43,"./add/operator/auditTime":44,"./add/operator/buffer":45,"./add/operator/bufferCount":46,"./add/operator/bufferTime":47,"./add/operator/bufferToggle":48,"./add/operator/bufferWhen":49,"./add/operator/cache":50,"./add/operator/catch":51,"./add/operator/combineAll":52,"./add/operator/combineLatest":53,"./add/operator/concat":54,"./add/operator/concatAll":55,"./add/operator/concatMap":56,"./add/operator/concatMapTo":57,"./add/operator/count":58,"./add/operator/debounce":59,"./add/operator/debounceTime":60,"./add/operator/defaultIfEmpty":61,"./add/operator/delay":62,"./add/operator/delayWhen":63,"./add/operator/dematerialize":64,"./add/operator/distinct":65,"./add/operator/distinctKey":66,"./add/operator/distinctUntilChanged":67,"./add/operator/distinctUntilKeyChanged":68,"./add/operator/do":69,"./add/operator/elementAt":70,"./add/operator/every":71,"./add/operator/exhaust":72,"./add/operator/exhaustMap":73,"./add/operator/expand":74,"./add/operator/filter":75,"./add/operator/finally":76,"./add/operator/find":77,"./add/operator/findIndex":78,"./add/operator/first":79,"./add/operator/groupBy":80,"./add/operator/ignoreElements":81,"./add/operator/isEmpty":82,"./add/operator/last":83,"./add/operator/let":84,"./add/operator/map":85,"./add/operator/mapTo":86,"./add/operator/materialize":87,"./add/operator/max":88,"./add/operator/merge":89,"./add/operator/mergeAll":90,"./add/operator/mergeMap":91,"./add/operator/mergeMapTo":92,"./add/operator/mergeScan":93,"./add/operator/min":94,"./add/operator/multicast":95,"./add/operator/observeOn":96,"./add/operator/onErrorResumeNext":97,"./add/operator/pairwise":98,"./add/operator/partition":99,"./add/operator/pluck":100,"./add/operator/publish":101,"./add/operator/publishBehavior":102,"./add/operator/publishLast":103,"./add/operator/publishReplay":104,"./add/operator/race":105,"./add/operator/reduce":106,"./add/operator/repeat":107,"./add/operator/repeatWhen":108,"./add/operator/retry":109,"./add/operator/retryWhen":110,"./add/operator/sample":111,"./add/operator/sampleTime":112,"./add/operator/scan":113,"./add/operator/sequenceEqual":114,"./add/operator/share":115,"./add/operator/single":116,"./add/operator/skip":117,"./add/operator/skipUntil":118,"./add/operator/skipWhile":119,"./add/operator/startWith":120,"./add/operator/subscribeOn":121,"./add/operator/switch":122,"./add/operator/switchMap":123,"./add/operator/switchMapTo":124,"./add/operator/take":125,"./add/operator/takeLast":126,"./add/operator/takeUntil":127,"./add/operator/takeWhile":128,"./add/operator/throttle":129,"./add/operator/throttleTime":130,"./add/operator/timeInterval":131,"./add/operator/timeout":132,"./add/operator/timeoutWith":133,"./add/operator/timestamp":134,"./add/operator/toArray":135,"./add/operator/toPromise":136,"./add/operator/window":137,"./add/operator/windowCount":138,"./add/operator/windowTime":139,"./add/operator/windowToggle":140,"./add/operator/windowWhen":141,"./add/operator/withLatestFrom":142,"./add/operator/zip":143,"./add/operator/zipAll":144,"./observable/ConnectableObservable":149,"./observable/MulticastObservable":161,"./observable/dom/AjaxObservable":175,"./operator/timeInterval":284,"./operator/timestamp":287,"./scheduler/VirtualTimeScheduler":307,"./scheduler/animationFrame":308,"./scheduler/asap":309,"./scheduler/async":310,"./scheduler/queue":311,"./symbol/iterator":312,"./symbol/observable":313,"./symbol/rxSubscriber":314,"./testing/TestScheduler":319,"./util/ArgumentOutOfRangeError":321,"./util/EmptyError":322,"./util/ObjectUnsubscribedError":327,"./util/UnsubscriptionError":328}],11:[function(require,module,exports){
'use strict';
/**
 * An execution context and a data structure to order tasks and schedule their
 * execution. Provides a notion of (potentially virtual) time, through the
 * `now()` getter method.
 *
 * Each unit of work in a Scheduler is called an {@link Action}.
 *
 * ```ts
 * class Scheduler {
 *   now(): number;
 *   schedule(work, delay?, state?): Subscription;
 * }
 * ```
 *
 * @class Scheduler
 */
var Scheduler = function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    /**
     * Schedules a function, `work`, for execution. May happen at some point in
     * the future, according to the `delay` parameter, if specified. May be passed
     * some context object, `state`, which will be passed to the `work` function.
     *
     * The given arguments will be processed an stored as an Action object in a
     * queue of actions.
     *
     * @param {function(state: ?T): ?Subscription} work A function representing a
     * task, or some unit of work to be executed by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler itself.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @return {Subscription} A subscription in order to be able to unsubscribe
     * the scheduled work.
     */
    Scheduler.prototype.schedule = function (work, delay, state) {
    };
    Scheduler.now = Date.now ? Date.now : function () {
    };
    return Scheduler;
}();
exports.Scheduler = Scheduler;    

},{}],12:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('./Observable');
var Subscriber_1 = require('./Subscriber');
var Subscription_1 = require('./Subscription');
var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
var SubjectSubscription_1 = require('./SubjectSubscription');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        _super.call(this, destination);
        this.destination = destination;
    }
    return SubjectSubscriber;
}(Subscriber_1.Subscriber);
exports.SubjectSubscriber = SubjectSubscriber;
/**
 * @class Subject<T>
 */
var Subject = function (_super) {
    __extends(Subject, _super);
    function Subject() {
        _super.call(this);
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    Subject.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
    };
    Subject.prototype.lift = function (operator) {
    };
    Subject.prototype.next = function (value) {
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
    };
    Subject.prototype.unsubscribe = function () {
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        } else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        } else if (this.isStopped) {
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        } else {
            this.observers.push(subscriber);
            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
    };
    Subject.create = function (destination, source) {
    };
    return Subject;
}(Observable_1.Observable);
exports.Subject = Subject;
/**
 * @class AnonymousSubject<T>
 */
var AnonymousSubject = function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
    }
    AnonymousSubject.prototype.next = function (value) {
    };
    AnonymousSubject.prototype.error = function (err) {
    };
    AnonymousSubject.prototype.complete = function () {
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
    };
    return AnonymousSubject;
}(Subject);
exports.AnonymousSubject = AnonymousSubject;    

},{"./Observable":6,"./SubjectSubscription":13,"./Subscriber":14,"./Subscription":15,"./symbol/rxSubscriber":314,"./util/ObjectUnsubscribedError":327}],13:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = require('./Subscription');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubjectSubscription = function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        _super.call(this);
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_1.Subscription);
exports.SubjectSubscription = SubjectSubscription;    

},{"./Subscription":15}],14:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = require('./util/isFunction');
var Subscription_1 = require('./Subscription');
var Observer_1 = require('./Observer');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
        case 0:
            this.destination = Observer_1.empty;
            break;
        case 1:
            if (!destinationOrNext) {
                this.destination = Observer_1.empty;
                break;
            }
            if (typeof destinationOrNext === 'object') {
                if (destinationOrNext instanceof Subscriber) {
                    this.destination = destinationOrNext;
                    this.destination.add(this);
                } else {
                    this.syncErrorThrowable = true;
                    this.destination = new SafeSubscriber(this, destinationOrNext);
                }
                break;
            }
        default:
            this.syncErrorThrowable = true;
            this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
            break;
        }
    }
    Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
    };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
    };
    return Subscriber;
}(Subscription_1.Subscription);
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parent, observerOrNext, error, complete) {
        _super.call(this);
        this._parent = _parent;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        } else if (observerOrNext) {
            context = observerOrNext;
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (isFunction_1.isFunction(context.unsubscribe)) {
                this.add(context.unsubscribe.bind(context));
            }
            context.unsubscribe = this.unsubscribe.bind(this);
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parent = this._parent;
            if (this._error) {
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                } else {
                    this.__tryOrSetError(_parent, this._error, err);
                    this.unsubscribe();
                }
            } else if (!_parent.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            } else {
                _parent.syncErrorValue = err;
                _parent.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        } catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parent = this._parent;
        this._context = null;
        this._parent = null;
        _parent.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber);    

},{"./Observer":7,"./Subscription":15,"./symbol/rxSubscriber":314,"./util/isFunction":334}],15:[function(require,module,exports){
'use strict';
var isArray_1 = require('./util/isArray');
var isObject_1 = require('./util/isObject');
var isFunction_1 = require('./util/isFunction');
var tryCatch_1 = require('./util/tryCatch');
var errorObject_1 = require('./util/errorObject');
var UnsubscriptionError_1 = require('./util/UnsubscriptionError');
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        this.closed = true;
        var _a = this, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this._subscriptions = null;
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                (errors = errors || []).push(errorObject_1.errorObject.e);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(err.errors);
                        } else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || teardown === Subscription.EMPTY) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var sub = teardown;
        switch (typeof teardown) {
        case 'function':
            sub = new Subscription(teardown);
        case 'object':
            if (sub.closed || typeof sub.unsubscribe !== 'function') {
                break;
            } else if (this.closed) {
                sub.unsubscribe();
            } else {
                (this._subscriptions || (this._subscriptions = [])).push(sub);
            }
            break;
        default:
            throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        return sub;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
    };
    Subscription.EMPTY = function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription());
    return Subscription;
}();
exports.Subscription = Subscription;    

},{"./util/UnsubscriptionError":328,"./util/errorObject":331,"./util/isArray":332,"./util/isFunction":334,"./util/isObject":336,"./util/tryCatch":344}],16:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var bindCallback_1 = require('../../observable/bindCallback');
Observable_1.Observable.bindCallback = bindCallback_1.bindCallback;    

},{"../../Observable":6,"../../observable/bindCallback":170}],17:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var bindNodeCallback_1 = require('../../observable/bindNodeCallback');
Observable_1.Observable.bindNodeCallback = bindNodeCallback_1.bindNodeCallback;    

},{"../../Observable":6,"../../observable/bindNodeCallback":171}],18:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var combineLatest_1 = require('../../observable/combineLatest');
Observable_1.Observable.combineLatest = combineLatest_1.combineLatest;    

},{"../../Observable":6,"../../observable/combineLatest":172}],19:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var concat_1 = require('../../observable/concat');
Observable_1.Observable.concat = concat_1.concat;    

},{"../../Observable":6,"../../observable/concat":173}],20:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var defer_1 = require('../../observable/defer');
Observable_1.Observable.defer = defer_1.defer;    

},{"../../Observable":6,"../../observable/defer":174}],21:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../../Observable');
var ajax_1 = require('../../../observable/dom/ajax');
Observable_1.Observable.ajax = ajax_1.ajax;    

},{"../../../Observable":6,"../../../observable/dom/ajax":177}],22:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../../Observable');
var webSocket_1 = require('../../../observable/dom/webSocket');
Observable_1.Observable.webSocket = webSocket_1.webSocket;    

},{"../../../Observable":6,"../../../observable/dom/webSocket":178}],23:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var empty_1 = require('../../observable/empty');
Observable_1.Observable.empty = empty_1.empty;    

},{"../../Observable":6,"../../observable/empty":179}],24:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var forkJoin_1 = require('../../observable/forkJoin');
Observable_1.Observable.forkJoin = forkJoin_1.forkJoin;    

},{"../../Observable":6,"../../observable/forkJoin":180}],25:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var from_1 = require('../../observable/from');
Observable_1.Observable.from = from_1.from;    

},{"../../Observable":6,"../../observable/from":181}],26:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var fromEvent_1 = require('../../observable/fromEvent');
Observable_1.Observable.fromEvent = fromEvent_1.fromEvent;    

},{"../../Observable":6,"../../observable/fromEvent":182}],27:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var fromEventPattern_1 = require('../../observable/fromEventPattern');
Observable_1.Observable.fromEventPattern = fromEventPattern_1.fromEventPattern;    

},{"../../Observable":6,"../../observable/fromEventPattern":183}],28:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var fromPromise_1 = require('../../observable/fromPromise');
Observable_1.Observable.fromPromise = fromPromise_1.fromPromise;    

},{"../../Observable":6,"../../observable/fromPromise":184}],29:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var GenerateObservable_1 = require('../../observable/GenerateObservable');
Observable_1.Observable.generate = GenerateObservable_1.GenerateObservable.create;    

},{"../../Observable":6,"../../observable/GenerateObservable":157}],30:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var if_1 = require('../../observable/if');
Observable_1.Observable.if = if_1._if;    

},{"../../Observable":6,"../../observable/if":185}],31:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var interval_1 = require('../../observable/interval');
Observable_1.Observable.interval = interval_1.interval;    

},{"../../Observable":6,"../../observable/interval":186}],32:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var merge_1 = require('../../observable/merge');
Observable_1.Observable.merge = merge_1.merge;    

},{"../../Observable":6,"../../observable/merge":187}],33:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var never_1 = require('../../observable/never');
Observable_1.Observable.never = never_1.never;    

},{"../../Observable":6,"../../observable/never":188}],34:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var of_1 = require('../../observable/of');
Observable_1.Observable.of = of_1.of;    

},{"../../Observable":6,"../../observable/of":189}],35:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var onErrorResumeNext_1 = require('../../operator/onErrorResumeNext');
Observable_1.Observable.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNextStatic;    

},{"../../Observable":6,"../../operator/onErrorResumeNext":250}],36:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var pairs_1 = require('../../observable/pairs');
Observable_1.Observable.pairs = pairs_1.pairs;    

},{"../../Observable":6,"../../observable/pairs":190}],37:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var race_1 = require('../../operator/race');
Observable_1.Observable.race = race_1.raceStatic;    

},{"../../Observable":6,"../../operator/race":258}],38:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var range_1 = require('../../observable/range');
Observable_1.Observable.range = range_1.range;    

},{"../../Observable":6,"../../observable/range":191}],39:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var throw_1 = require('../../observable/throw');
Observable_1.Observable.throw = throw_1._throw;    

},{"../../Observable":6,"../../observable/throw":192}],40:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var timer_1 = require('../../observable/timer');
Observable_1.Observable.timer = timer_1.timer;    

},{"../../Observable":6,"../../observable/timer":193}],41:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var using_1 = require('../../observable/using');
Observable_1.Observable.using = using_1.using;    

},{"../../Observable":6,"../../observable/using":194}],42:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var zip_1 = require('../../observable/zip');
Observable_1.Observable.zip = zip_1.zip;    

},{"../../Observable":6,"../../observable/zip":195}],43:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var audit_1 = require('../../operator/audit');
Observable_1.Observable.prototype.audit = audit_1.audit;    

},{"../../Observable":6,"../../operator/audit":196}],44:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var auditTime_1 = require('../../operator/auditTime');
Observable_1.Observable.prototype.auditTime = auditTime_1.auditTime;    

},{"../../Observable":6,"../../operator/auditTime":197}],45:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var buffer_1 = require('../../operator/buffer');
Observable_1.Observable.prototype.buffer = buffer_1.buffer;    

},{"../../Observable":6,"../../operator/buffer":198}],46:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var bufferCount_1 = require('../../operator/bufferCount');
Observable_1.Observable.prototype.bufferCount = bufferCount_1.bufferCount;    

},{"../../Observable":6,"../../operator/bufferCount":199}],47:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var bufferTime_1 = require('../../operator/bufferTime');
Observable_1.Observable.prototype.bufferTime = bufferTime_1.bufferTime;    

},{"../../Observable":6,"../../operator/bufferTime":200}],48:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var bufferToggle_1 = require('../../operator/bufferToggle');
Observable_1.Observable.prototype.bufferToggle = bufferToggle_1.bufferToggle;    

},{"../../Observable":6,"../../operator/bufferToggle":201}],49:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var bufferWhen_1 = require('../../operator/bufferWhen');
Observable_1.Observable.prototype.bufferWhen = bufferWhen_1.bufferWhen;    

},{"../../Observable":6,"../../operator/bufferWhen":202}],50:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var cache_1 = require('../../operator/cache');
Observable_1.Observable.prototype.cache = cache_1.cache;    

},{"../../Observable":6,"../../operator/cache":203}],51:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var catch_1 = require('../../operator/catch');
Observable_1.Observable.prototype.catch = catch_1._catch;
Observable_1.Observable.prototype._catch = catch_1._catch;    

},{"../../Observable":6,"../../operator/catch":204}],52:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var combineAll_1 = require('../../operator/combineAll');
Observable_1.Observable.prototype.combineAll = combineAll_1.combineAll;    

},{"../../Observable":6,"../../operator/combineAll":205}],53:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var combineLatest_1 = require('../../operator/combineLatest');
Observable_1.Observable.prototype.combineLatest = combineLatest_1.combineLatest;    

},{"../../Observable":6,"../../operator/combineLatest":206}],54:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var concat_1 = require('../../operator/concat');
Observable_1.Observable.prototype.concat = concat_1.concat;    

},{"../../Observable":6,"../../operator/concat":207}],55:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var concatAll_1 = require('../../operator/concatAll');
Observable_1.Observable.prototype.concatAll = concatAll_1.concatAll;    

},{"../../Observable":6,"../../operator/concatAll":208}],56:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var concatMap_1 = require('../../operator/concatMap');
Observable_1.Observable.prototype.concatMap = concatMap_1.concatMap;    

},{"../../Observable":6,"../../operator/concatMap":209}],57:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var concatMapTo_1 = require('../../operator/concatMapTo');
Observable_1.Observable.prototype.concatMapTo = concatMapTo_1.concatMapTo;    

},{"../../Observable":6,"../../operator/concatMapTo":210}],58:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var count_1 = require('../../operator/count');
Observable_1.Observable.prototype.count = count_1.count;    

},{"../../Observable":6,"../../operator/count":211}],59:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var debounce_1 = require('../../operator/debounce');
Observable_1.Observable.prototype.debounce = debounce_1.debounce;    

},{"../../Observable":6,"../../operator/debounce":212}],60:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var debounceTime_1 = require('../../operator/debounceTime');
Observable_1.Observable.prototype.debounceTime = debounceTime_1.debounceTime;    

},{"../../Observable":6,"../../operator/debounceTime":213}],61:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var defaultIfEmpty_1 = require('../../operator/defaultIfEmpty');
Observable_1.Observable.prototype.defaultIfEmpty = defaultIfEmpty_1.defaultIfEmpty;    

},{"../../Observable":6,"../../operator/defaultIfEmpty":214}],62:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var delay_1 = require('../../operator/delay');
Observable_1.Observable.prototype.delay = delay_1.delay;    

},{"../../Observable":6,"../../operator/delay":215}],63:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var delayWhen_1 = require('../../operator/delayWhen');
Observable_1.Observable.prototype.delayWhen = delayWhen_1.delayWhen;    

},{"../../Observable":6,"../../operator/delayWhen":216}],64:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var dematerialize_1 = require('../../operator/dematerialize');
Observable_1.Observable.prototype.dematerialize = dematerialize_1.dematerialize;    

},{"../../Observable":6,"../../operator/dematerialize":217}],65:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var distinct_1 = require('../../operator/distinct');
Observable_1.Observable.prototype.distinct = distinct_1.distinct;    

},{"../../Observable":6,"../../operator/distinct":218}],66:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var distinctKey_1 = require('../../operator/distinctKey');
Observable_1.Observable.prototype.distinctKey = distinctKey_1.distinctKey;    

},{"../../Observable":6,"../../operator/distinctKey":219}],67:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var distinctUntilChanged_1 = require('../../operator/distinctUntilChanged');
Observable_1.Observable.prototype.distinctUntilChanged = distinctUntilChanged_1.distinctUntilChanged;    

},{"../../Observable":6,"../../operator/distinctUntilChanged":220}],68:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var distinctUntilKeyChanged_1 = require('../../operator/distinctUntilKeyChanged');
Observable_1.Observable.prototype.distinctUntilKeyChanged = distinctUntilKeyChanged_1.distinctUntilKeyChanged;    

},{"../../Observable":6,"../../operator/distinctUntilKeyChanged":221}],69:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var do_1 = require('../../operator/do');
Observable_1.Observable.prototype.do = do_1._do;
Observable_1.Observable.prototype._do = do_1._do;    

},{"../../Observable":6,"../../operator/do":222}],70:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var elementAt_1 = require('../../operator/elementAt');
Observable_1.Observable.prototype.elementAt = elementAt_1.elementAt;    

},{"../../Observable":6,"../../operator/elementAt":223}],71:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var every_1 = require('../../operator/every');
Observable_1.Observable.prototype.every = every_1.every;    

},{"../../Observable":6,"../../operator/every":224}],72:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var exhaust_1 = require('../../operator/exhaust');
Observable_1.Observable.prototype.exhaust = exhaust_1.exhaust;    

},{"../../Observable":6,"../../operator/exhaust":225}],73:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var exhaustMap_1 = require('../../operator/exhaustMap');
Observable_1.Observable.prototype.exhaustMap = exhaustMap_1.exhaustMap;    

},{"../../Observable":6,"../../operator/exhaustMap":226}],74:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var expand_1 = require('../../operator/expand');
Observable_1.Observable.prototype.expand = expand_1.expand;    

},{"../../Observable":6,"../../operator/expand":227}],75:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var filter_1 = require('../../operator/filter');
Observable_1.Observable.prototype.filter = filter_1.filter;    

},{"../../Observable":6,"../../operator/filter":228}],76:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var finally_1 = require('../../operator/finally');
Observable_1.Observable.prototype.finally = finally_1._finally;
Observable_1.Observable.prototype._finally = finally_1._finally;    

},{"../../Observable":6,"../../operator/finally":229}],77:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var find_1 = require('../../operator/find');
Observable_1.Observable.prototype.find = find_1.find;    

},{"../../Observable":6,"../../operator/find":230}],78:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var findIndex_1 = require('../../operator/findIndex');
Observable_1.Observable.prototype.findIndex = findIndex_1.findIndex;    

},{"../../Observable":6,"../../operator/findIndex":231}],79:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var first_1 = require('../../operator/first');
Observable_1.Observable.prototype.first = first_1.first;    

},{"../../Observable":6,"../../operator/first":232}],80:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var groupBy_1 = require('../../operator/groupBy');
Observable_1.Observable.prototype.groupBy = groupBy_1.groupBy;    

},{"../../Observable":6,"../../operator/groupBy":233}],81:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var ignoreElements_1 = require('../../operator/ignoreElements');
Observable_1.Observable.prototype.ignoreElements = ignoreElements_1.ignoreElements;    

},{"../../Observable":6,"../../operator/ignoreElements":234}],82:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var isEmpty_1 = require('../../operator/isEmpty');
Observable_1.Observable.prototype.isEmpty = isEmpty_1.isEmpty;    

},{"../../Observable":6,"../../operator/isEmpty":235}],83:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var last_1 = require('../../operator/last');
Observable_1.Observable.prototype.last = last_1.last;    

},{"../../Observable":6,"../../operator/last":236}],84:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var let_1 = require('../../operator/let');
Observable_1.Observable.prototype.let = let_1.letProto;
Observable_1.Observable.prototype.letBind = let_1.letProto;    

},{"../../Observable":6,"../../operator/let":237}],85:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var map_1 = require('../../operator/map');
Observable_1.Observable.prototype.map = map_1.map;    

},{"../../Observable":6,"../../operator/map":238}],86:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var mapTo_1 = require('../../operator/mapTo');
Observable_1.Observable.prototype.mapTo = mapTo_1.mapTo;    

},{"../../Observable":6,"../../operator/mapTo":239}],87:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var materialize_1 = require('../../operator/materialize');
Observable_1.Observable.prototype.materialize = materialize_1.materialize;    

},{"../../Observable":6,"../../operator/materialize":240}],88:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var max_1 = require('../../operator/max');
Observable_1.Observable.prototype.max = max_1.max;    

},{"../../Observable":6,"../../operator/max":241}],89:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var merge_1 = require('../../operator/merge');
Observable_1.Observable.prototype.merge = merge_1.merge;    

},{"../../Observable":6,"../../operator/merge":242}],90:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var mergeAll_1 = require('../../operator/mergeAll');
Observable_1.Observable.prototype.mergeAll = mergeAll_1.mergeAll;    

},{"../../Observable":6,"../../operator/mergeAll":243}],91:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var mergeMap_1 = require('../../operator/mergeMap');
Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;    

},{"../../Observable":6,"../../operator/mergeMap":244}],92:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var mergeMapTo_1 = require('../../operator/mergeMapTo');
Observable_1.Observable.prototype.flatMapTo = mergeMapTo_1.mergeMapTo;
Observable_1.Observable.prototype.mergeMapTo = mergeMapTo_1.mergeMapTo;    

},{"../../Observable":6,"../../operator/mergeMapTo":245}],93:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var mergeScan_1 = require('../../operator/mergeScan');
Observable_1.Observable.prototype.mergeScan = mergeScan_1.mergeScan;    

},{"../../Observable":6,"../../operator/mergeScan":246}],94:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var min_1 = require('../../operator/min');
Observable_1.Observable.prototype.min = min_1.min;    

},{"../../Observable":6,"../../operator/min":247}],95:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var multicast_1 = require('../../operator/multicast');
Observable_1.Observable.prototype.multicast = multicast_1.multicast;    

},{"../../Observable":6,"../../operator/multicast":248}],96:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var observeOn_1 = require('../../operator/observeOn');
Observable_1.Observable.prototype.observeOn = observeOn_1.observeOn;    

},{"../../Observable":6,"../../operator/observeOn":249}],97:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var onErrorResumeNext_1 = require('../../operator/onErrorResumeNext');
Observable_1.Observable.prototype.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNext;    

},{"../../Observable":6,"../../operator/onErrorResumeNext":250}],98:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var pairwise_1 = require('../../operator/pairwise');
Observable_1.Observable.prototype.pairwise = pairwise_1.pairwise;    

},{"../../Observable":6,"../../operator/pairwise":251}],99:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var partition_1 = require('../../operator/partition');
Observable_1.Observable.prototype.partition = partition_1.partition;    

},{"../../Observable":6,"../../operator/partition":252}],100:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var pluck_1 = require('../../operator/pluck');
Observable_1.Observable.prototype.pluck = pluck_1.pluck;    

},{"../../Observable":6,"../../operator/pluck":253}],101:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var publish_1 = require('../../operator/publish');
Observable_1.Observable.prototype.publish = publish_1.publish;    

},{"../../Observable":6,"../../operator/publish":254}],102:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var publishBehavior_1 = require('../../operator/publishBehavior');
Observable_1.Observable.prototype.publishBehavior = publishBehavior_1.publishBehavior;    

},{"../../Observable":6,"../../operator/publishBehavior":255}],103:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var publishLast_1 = require('../../operator/publishLast');
Observable_1.Observable.prototype.publishLast = publishLast_1.publishLast;    

},{"../../Observable":6,"../../operator/publishLast":256}],104:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var publishReplay_1 = require('../../operator/publishReplay');
Observable_1.Observable.prototype.publishReplay = publishReplay_1.publishReplay;    

},{"../../Observable":6,"../../operator/publishReplay":257}],105:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var race_1 = require('../../operator/race');
Observable_1.Observable.prototype.race = race_1.race;    

},{"../../Observable":6,"../../operator/race":258}],106:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var reduce_1 = require('../../operator/reduce');
Observable_1.Observable.prototype.reduce = reduce_1.reduce;    

},{"../../Observable":6,"../../operator/reduce":259}],107:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var repeat_1 = require('../../operator/repeat');
Observable_1.Observable.prototype.repeat = repeat_1.repeat;    

},{"../../Observable":6,"../../operator/repeat":260}],108:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var repeatWhen_1 = require('../../operator/repeatWhen');
Observable_1.Observable.prototype.repeatWhen = repeatWhen_1.repeatWhen;    

},{"../../Observable":6,"../../operator/repeatWhen":261}],109:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var retry_1 = require('../../operator/retry');
Observable_1.Observable.prototype.retry = retry_1.retry;    

},{"../../Observable":6,"../../operator/retry":262}],110:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var retryWhen_1 = require('../../operator/retryWhen');
Observable_1.Observable.prototype.retryWhen = retryWhen_1.retryWhen;    

},{"../../Observable":6,"../../operator/retryWhen":263}],111:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var sample_1 = require('../../operator/sample');
Observable_1.Observable.prototype.sample = sample_1.sample;    

},{"../../Observable":6,"../../operator/sample":264}],112:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var sampleTime_1 = require('../../operator/sampleTime');
Observable_1.Observable.prototype.sampleTime = sampleTime_1.sampleTime;    

},{"../../Observable":6,"../../operator/sampleTime":265}],113:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var scan_1 = require('../../operator/scan');
Observable_1.Observable.prototype.scan = scan_1.scan;    

},{"../../Observable":6,"../../operator/scan":266}],114:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var sequenceEqual_1 = require('../../operator/sequenceEqual');
Observable_1.Observable.prototype.sequenceEqual = sequenceEqual_1.sequenceEqual;    

},{"../../Observable":6,"../../operator/sequenceEqual":267}],115:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var share_1 = require('../../operator/share');
Observable_1.Observable.prototype.share = share_1.share;    

},{"../../Observable":6,"../../operator/share":268}],116:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var single_1 = require('../../operator/single');
Observable_1.Observable.prototype.single = single_1.single;    

},{"../../Observable":6,"../../operator/single":269}],117:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var skip_1 = require('../../operator/skip');
Observable_1.Observable.prototype.skip = skip_1.skip;    

},{"../../Observable":6,"../../operator/skip":270}],118:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var skipUntil_1 = require('../../operator/skipUntil');
Observable_1.Observable.prototype.skipUntil = skipUntil_1.skipUntil;    

},{"../../Observable":6,"../../operator/skipUntil":271}],119:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var skipWhile_1 = require('../../operator/skipWhile');
Observable_1.Observable.prototype.skipWhile = skipWhile_1.skipWhile;    

},{"../../Observable":6,"../../operator/skipWhile":272}],120:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var startWith_1 = require('../../operator/startWith');
Observable_1.Observable.prototype.startWith = startWith_1.startWith;    

},{"../../Observable":6,"../../operator/startWith":273}],121:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var subscribeOn_1 = require('../../operator/subscribeOn');
Observable_1.Observable.prototype.subscribeOn = subscribeOn_1.subscribeOn;    

},{"../../Observable":6,"../../operator/subscribeOn":274}],122:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var switch_1 = require('../../operator/switch');
Observable_1.Observable.prototype.switch = switch_1._switch;
Observable_1.Observable.prototype._switch = switch_1._switch;    

},{"../../Observable":6,"../../operator/switch":275}],123:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var switchMap_1 = require('../../operator/switchMap');
Observable_1.Observable.prototype.switchMap = switchMap_1.switchMap;    

},{"../../Observable":6,"../../operator/switchMap":276}],124:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var switchMapTo_1 = require('../../operator/switchMapTo');
Observable_1.Observable.prototype.switchMapTo = switchMapTo_1.switchMapTo;    

},{"../../Observable":6,"../../operator/switchMapTo":277}],125:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var take_1 = require('../../operator/take');
Observable_1.Observable.prototype.take = take_1.take;    

},{"../../Observable":6,"../../operator/take":278}],126:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var takeLast_1 = require('../../operator/takeLast');
Observable_1.Observable.prototype.takeLast = takeLast_1.takeLast;    

},{"../../Observable":6,"../../operator/takeLast":279}],127:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var takeUntil_1 = require('../../operator/takeUntil');
Observable_1.Observable.prototype.takeUntil = takeUntil_1.takeUntil;    

},{"../../Observable":6,"../../operator/takeUntil":280}],128:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var takeWhile_1 = require('../../operator/takeWhile');
Observable_1.Observable.prototype.takeWhile = takeWhile_1.takeWhile;    

},{"../../Observable":6,"../../operator/takeWhile":281}],129:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var throttle_1 = require('../../operator/throttle');
Observable_1.Observable.prototype.throttle = throttle_1.throttle;    

},{"../../Observable":6,"../../operator/throttle":282}],130:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var throttleTime_1 = require('../../operator/throttleTime');
Observable_1.Observable.prototype.throttleTime = throttleTime_1.throttleTime;    

},{"../../Observable":6,"../../operator/throttleTime":283}],131:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var timeInterval_1 = require('../../operator/timeInterval');
Observable_1.Observable.prototype.timeInterval = timeInterval_1.timeInterval;    

},{"../../Observable":6,"../../operator/timeInterval":284}],132:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var timeout_1 = require('../../operator/timeout');
Observable_1.Observable.prototype.timeout = timeout_1.timeout;    

},{"../../Observable":6,"../../operator/timeout":285}],133:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var timeoutWith_1 = require('../../operator/timeoutWith');
Observable_1.Observable.prototype.timeoutWith = timeoutWith_1.timeoutWith;    

},{"../../Observable":6,"../../operator/timeoutWith":286}],134:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var timestamp_1 = require('../../operator/timestamp');
Observable_1.Observable.prototype.timestamp = timestamp_1.timestamp;    

},{"../../Observable":6,"../../operator/timestamp":287}],135:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var toArray_1 = require('../../operator/toArray');
Observable_1.Observable.prototype.toArray = toArray_1.toArray;    

},{"../../Observable":6,"../../operator/toArray":288}],136:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var toPromise_1 = require('../../operator/toPromise');
Observable_1.Observable.prototype.toPromise = toPromise_1.toPromise;    

},{"../../Observable":6,"../../operator/toPromise":289}],137:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var window_1 = require('../../operator/window');
Observable_1.Observable.prototype.window = window_1.window;    

},{"../../Observable":6,"../../operator/window":290}],138:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var windowCount_1 = require('../../operator/windowCount');
Observable_1.Observable.prototype.windowCount = windowCount_1.windowCount;    

},{"../../Observable":6,"../../operator/windowCount":291}],139:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var windowTime_1 = require('../../operator/windowTime');
Observable_1.Observable.prototype.windowTime = windowTime_1.windowTime;    

},{"../../Observable":6,"../../operator/windowTime":292}],140:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var windowToggle_1 = require('../../operator/windowToggle');
Observable_1.Observable.prototype.windowToggle = windowToggle_1.windowToggle;    

},{"../../Observable":6,"../../operator/windowToggle":293}],141:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var windowWhen_1 = require('../../operator/windowWhen');
Observable_1.Observable.prototype.windowWhen = windowWhen_1.windowWhen;    

},{"../../Observable":6,"../../operator/windowWhen":294}],142:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var withLatestFrom_1 = require('../../operator/withLatestFrom');
Observable_1.Observable.prototype.withLatestFrom = withLatestFrom_1.withLatestFrom;    

},{"../../Observable":6,"../../operator/withLatestFrom":295}],143:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var zip_1 = require('../../operator/zip');
Observable_1.Observable.prototype.zip = zip_1.zipProto;    

},{"../../Observable":6,"../../operator/zip":296}],144:[function(require,module,exports){
'use strict';
var Observable_1 = require('../../Observable');
var zipAll_1 = require('../../operator/zipAll');
Observable_1.Observable.prototype.zipAll = zipAll_1.zipAll;    

},{"../../Observable":6,"../../operator/zipAll":297}],145:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ScalarObservable_1 = require('./ScalarObservable');
var EmptyObservable_1 = require('./EmptyObservable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ArrayLikeObservable = function (_super) {
    __extends(ArrayLikeObservable, _super);
    function ArrayLikeObservable(arrayLike, scheduler) {
    }
    ArrayLikeObservable.create = function (arrayLike, scheduler) {
    };
    ArrayLikeObservable.dispatch = function (state) {
    };
    ArrayLikeObservable.prototype._subscribe = function (subscriber) {
    };
    return ArrayLikeObservable;
}(Observable_1.Observable);
exports.ArrayLikeObservable = ArrayLikeObservable;    

},{"../Observable":6,"./EmptyObservable":151,"./ScalarObservable":166}],146:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ScalarObservable_1 = require('./ScalarObservable');
var EmptyObservable_1 = require('./EmptyObservable');
var isScheduler_1 = require('../util/isScheduler');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ArrayObservable = function (_super) {
    __extends(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
        _super.call(this);
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    ArrayObservable.create = function (array, scheduler) {
    };
    /**
     * Creates an Observable that emits some values you specify as arguments,
     * immediately one after the other, and then emits a complete notification.
     *
     * <span class="informal">Emits the arguments you provide, then completes.
     * </span>
     *
     * <img src="./img/of.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the arguments given, and the complete notification thereafter. It can
     * be used for composing with other Observables, such as with {@link concat}.
     * By default, it uses a `null` Scheduler, which means the `next`
     * notifications are sent synchronously, although with a different Scheduler
     * it is possible to determine when those notifications will be delivered.
     *
     * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
     * var numbers = Rx.Observable.of(10, 20, 30);
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var interval = Rx.Observable.interval(1000);
     * var result = numbers.concat(letters).concat(interval);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link throw}
     *
     * @param {...T} values Arguments that represent `next` values to be emitted.
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emissions of the `next` notifications.
     * @return {Observable<T>} An Observable that emits each given input value.
     * @static true
     * @name of
     * @owner Observable
     */
    ArrayObservable.of = function () {
    };
    ArrayObservable.dispatch = function (state) {
    };
    ArrayObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var array = this.array;
        var count = array.length;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array,
                index: index,
                count: count,
                subscriber: subscriber
            });
        } else {
            for (var i = 0; i < count && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayObservable;
}(Observable_1.Observable);
exports.ArrayObservable = ArrayObservable;    

},{"../Observable":6,"../util/isScheduler":338,"./EmptyObservable":151,"./ScalarObservable":166}],147:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var AsyncSubject_1 = require('../AsyncSubject');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var BoundCallbackObservable = function (_super) {
    __extends(BoundCallbackObservable, _super);
    function BoundCallbackObservable(callbackFunc, selector, args, scheduler) {
    }
    /* tslint:enable:max-line-length */
    /**
     * Converts a callback API to a function that returns an Observable.
     *
     * <span class="informal">Give it a function `f` of type `f(x, callback)` and
     * it will return a function `g` that when called as `g(x)` will output an
     * Observable.</span>
     *
     * `bindCallback` is not an operator because its input and output are not
     * Observables. The input is a function `func` with some parameters, but the
     * last parameter must be a callback function that `func` calls when it is
     * done. The output of `bindCallback` is a function that takes the same
     * parameters as `func`, except the last one (the callback). When the output
     * function is called with arguments, it will return an Observable where the
     * results will be delivered to.
     *
     * @example <caption>Convert jQuery's getJSON to an Observable API</caption>
     * // Suppose we have jQuery.getJSON('/my/url', callback)
     * var getJSONAsObservable = Rx.Observable.bindCallback(jQuery.getJSON);
     * var result = getJSONAsObservable('/my/url');
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindNodeCallback}
     * @see {@link from}
     * @see {@link fromPromise}
     *
     * @param {function} func Function with a callback as the last parameter.
     * @param {function} selector A function which takes the arguments from the
     * callback and maps those a value to emit on the output Observable.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * callbacks.
     * @return {function(...params: *): Observable} A function which returns the
     * Observable that delivers the same values the callback would deliver.
     * @static true
     * @name bindCallback
     * @owner Observable
     */
    BoundCallbackObservable.create = function (func, selector, scheduler) {
    };
    BoundCallbackObservable.prototype._subscribe = function (subscriber) {
    };
    BoundCallbackObservable.dispatch = function (state) {
    };
    return BoundCallbackObservable;
}(Observable_1.Observable);
exports.BoundCallbackObservable = BoundCallbackObservable;
function dispatchNext(arg) {
}
function dispatchError(arg) {
}    

},{"../AsyncSubject":2,"../Observable":6,"../util/errorObject":331,"../util/tryCatch":344}],148:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var AsyncSubject_1 = require('../AsyncSubject');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var BoundNodeCallbackObservable = function (_super) {
    __extends(BoundNodeCallbackObservable, _super);
    function BoundNodeCallbackObservable(callbackFunc, selector, args, scheduler) {
    }
    /* tslint:enable:max-line-length */
    /**
     * Converts a Node.js-style callback API to a function that returns an
     * Observable.
     *
     * <span class="informal">It's just like {@link bindCallback}, but the
     * callback is expected to be of type `callback(error, result)`.</span>
     *
     * `bindNodeCallback` is not an operator because its input and output are not
     * Observables. The input is a function `func` with some parameters, but the
     * last parameter must be a callback function that `func` calls when it is
     * done. The callback function is expected to follow Node.js conventions,
     * where the first argument to the callback is an error, while remaining
     * arguments are the callback result. The output of `bindNodeCallback` is a
     * function that takes the same parameters as `func`, except the last one (the
     * callback). When the output function is called with arguments, it will
     * return an Observable where the results will be delivered to.
     *
     * @example <caption>Read a file from the filesystem and get the data as an Observable</caption>
     * import * as fs from 'fs';
     * var readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile);
     * var result = readFileAsObservable('./roadNames.txt', 'utf8');
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindCallback}
     * @see {@link from}
     * @see {@link fromPromise}
     *
     * @param {function} func Function with a callback as the last parameter.
     * @param {function} selector A function which takes the arguments from the
     * callback and maps those a value to emit on the output Observable.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * callbacks.
     * @return {function(...params: *): Observable} A function which returns the
     * Observable that delivers the same values the Node.js callback would
     * deliver.
     * @static true
     * @name bindNodeCallback
     * @owner Observable
     */
    BoundNodeCallbackObservable.create = function (func, selector, scheduler) {
    };
    BoundNodeCallbackObservable.prototype._subscribe = function (subscriber) {
    };
    return BoundNodeCallbackObservable;
}(Observable_1.Observable);
exports.BoundNodeCallbackObservable = BoundNodeCallbackObservable;
function dispatch(state) {
}
function dispatchNext(arg) {
}
function dispatchError(arg) {
}    

},{"../AsyncSubject":2,"../Observable":6,"../util/errorObject":331,"../util/tryCatch":344}],149:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var Observable_1 = require('../Observable');
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
/**
 * @class ConnectableObservable<T>
 */
var ConnectableObservable = function (_super) {
    __extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        _super.call(this);
        this.source = source;
        this.subjectFactory = subjectFactory;
        this._refCount = 0;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            connection = this._connection = new Subscription_1.Subscription();
            connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription_1.Subscription.EMPTY;
            } else {
                this._connection = connection;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return this.lift(new RefCountOperator(this));
    };
    return ConnectableObservable;
}(Observable_1.Observable);
exports.ConnectableObservable = ConnectableObservable;
var ConnectableSubscriber = function (_super) {
    __extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(Subject_1.SubjectSubscriber);
var RefCountOperator = function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source._subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}();
var RefCountSubscriber = function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's dowstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // Observable.range(0, 10)
        //   .publish()
        //   .refCount()
        //   .take(5)
        //   .subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Observable":6,"../Subject":12,"../Subscriber":14,"../Subscription":15}],150:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var DeferObservable = function (_super) {
    __extends(DeferObservable, _super);
    function DeferObservable(observableFactory) {
    }
    /**
     * Creates an Observable that, on subscribe, calls an Observable factory to
     * make an Observable for each new Observer.
     *
     * <span class="informal">Creates the Observable lazily, that is, only when it
     * is subscribed.
     * </span>
     *
     * <img src="./img/defer.png" width="100%">
     *
     * `defer` allows you to create the Observable only when the Observer
     * subscribes, and create a fresh Observable for each Observer. It waits until
     * an Observer subscribes to it, and then it generates an Observable,
     * typically with an Observable factory function. It does this afresh for each
     * subscriber, so although each subscriber may think it is subscribing to the
     * same Observable, in fact each subscriber gets its own individual
     * Observable.
     *
     * @example <caption>Subscribe to either an Observable of clicks or an Observable of interval, at random</caption>
     * var clicksOrInterval = Rx.Observable.defer(function () {
     *   if (Math.random() > 0.5) {
     *     return Rx.Observable.fromEvent(document, 'click');
     *   } else {
     *     return Rx.Observable.interval(1000);
     *   }
     * });
     * clicksOrInterval.subscribe(x => console.log(x));
     *
     * @see {@link create}
     *
     * @param {function(): Observable|Promise} observableFactory The Observable
     * factory function to invoke for each Observer that subscribes to the output
     * Observable. May also return a Promise, which will be converted on the fly
     * to an Observable.
     * @return {Observable} An Observable whose Observers' subscriptions trigger
     * an invocation of the given Observable factory function.
     * @static true
     * @name defer
     * @owner Observable
     */
    DeferObservable.create = function (observableFactory) {
    };
    DeferObservable.prototype._subscribe = function (subscriber) {
    };
    return DeferObservable;
}(Observable_1.Observable);
exports.DeferObservable = DeferObservable;
var DeferSubscriber = function (_super) {
    __extends(DeferSubscriber, _super);
    function DeferSubscriber(destination, factory) {
    }
    DeferSubscriber.prototype.tryDefer = function () {
    };
    DeferSubscriber.prototype._callFactory = function () {
    };
    return DeferSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../Observable":6,"../OuterSubscriber":8,"../util/subscribeToResult":342}],151:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var EmptyObservable = function (_super) {
    __extends(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits a complete notification.
     *
     * <span class="informal">Just emits 'complete', and nothing else.
     * </span>
     *
     * <img src="./img/empty.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the complete notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then complete.</caption>
     * var result = Rx.Observable.empty().startWith(7);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
     * );
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emission of the complete notification.
     * @return {Observable} An "empty" Observable: emits only the complete
     * notification.
     * @static true
     * @name empty
     * @owner Observable
     */
    EmptyObservable.create = function (scheduler) {
    };
    EmptyObservable.dispatch = function (arg) {
    };
    EmptyObservable.prototype._subscribe = function (subscriber) {
    };
    return EmptyObservable;
}(Observable_1.Observable);
exports.EmptyObservable = EmptyObservable;    

},{"../Observable":6}],152:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ErrorObservable = function (_super) {
    __extends(ErrorObservable, _super);
    function ErrorObservable(error, scheduler) {
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits an error notification.
     *
     * <span class="informal">Just emits 'error', and nothing else.
     * </span>
     *
     * <img src="./img/throw.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the error notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then emit an error.</caption>
     * var result = Rx.Observable.throw(new Error('oops!')).startWith(7);
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @example <caption>Map and flattens numbers to the sequence 'a', 'b', 'c', but throw an error for 13</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x === 13 ?
     *     Rx.Observable.throw('Thirteens are bad') :
     *     Rx.Observable.of('a', 'b', 'c')
     * );
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link of}
     *
     * @param {any} error The particular Error to pass to the error notification.
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emission of the error notification.
     * @return {Observable} An error Observable: emits only the error notification
     * using the given error argument.
     * @static true
     * @name throw
     * @owner Observable
     */
    ErrorObservable.create = function (error, scheduler) {
    };
    ErrorObservable.dispatch = function (arg) {
    };
    ErrorObservable.prototype._subscribe = function (subscriber) {
    };
    return ErrorObservable;
}(Observable_1.Observable);
exports.ErrorObservable = ErrorObservable;    

},{"../Observable":6}],153:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var EmptyObservable_1 = require('./EmptyObservable');
var isArray_1 = require('../util/isArray');
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ForkJoinObservable = function (_super) {
    __extends(ForkJoinObservable, _super);
    function ForkJoinObservable(sources, resultSelector) {
    }
    /* tslint:enable:max-line-length */
    /**
     * @param sources
     * @return {any}
     * @static true
     * @name forkJoin
     * @owner Observable
     */
    ForkJoinObservable.create = function () {
    };
    ForkJoinObservable.prototype._subscribe = function (subscriber) {
    };
    return ForkJoinObservable;
}(Observable_1.Observable);
exports.ForkJoinObservable = ForkJoinObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ForkJoinSubscriber = function (_super) {
    __extends(ForkJoinSubscriber, _super);
    function ForkJoinSubscriber(destination, sources, resultSelector) {
    }
    ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return ForkJoinSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../Observable":6,"../OuterSubscriber":8,"../util/isArray":332,"../util/subscribeToResult":342,"./EmptyObservable":151}],154:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var tryCatch_1 = require('../util/tryCatch');
var isFunction_1 = require('../util/isFunction');
var errorObject_1 = require('../util/errorObject');
var Subscription_1 = require('../Subscription');
function isNodeStyleEventEmmitter(sourceObj) {
}
function isJQueryStyleEventEmitter(sourceObj) {
}
function isNodeList(sourceObj) {
}
function isHTMLCollection(sourceObj) {
}
function isEventTarget(sourceObj) {
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var FromEventObservable = function (_super) {
    __extends(FromEventObservable, _super);
    function FromEventObservable(sourceObj, eventName, selector, options) {
    }
    /* tslint:enable:max-line-length */
    /**
     * Creates an Observable that emits events of a specific type coming from the
     * given event target.
     *
     * <span class="informal">Creates an Observable from DOM events, or Node
     * EventEmitter events or others.</span>
     *
     * <img src="./img/fromEvent.png" width="100%">
     *
     * Creates an Observable by attaching an event listener to an "event target",
     * which may be an object with `addEventListener` and `removeEventListener`,
     * a Node.js EventEmitter, a jQuery style EventEmitter, a NodeList from the
     * DOM, or an HTMLCollection from the DOM. The event handler is attached when
     * the output Observable is subscribed, and removed when the Subscription is
     * unsubscribed.
     *
     * @example <caption>Emits clicks happening on the DOM document</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * clicks.subscribe(x => console.log(x));
     *
     * @see {@link from}
     * @see {@link fromEventPattern}
     *
     * @param {EventTargetLike} target The DOMElement, event target, Node.js
     * EventEmitter, NodeList or HTMLCollection to attach the event handler to.
     * @param {string} eventName The event name of interest, being emitted by the
     * `target`.
     * @parm {EventListenerOptions} [options] Options to pass through to addEventListener
     * @param {SelectorMethodSignature<T>} [selector] An optional function to
     * post-process results. It takes the arguments from the event handler and
     * should return a single value.
     * @return {Observable<T>}
     * @static true
     * @name fromEvent
     * @owner Observable
     */
    FromEventObservable.create = function (target, eventName, options, selector) {
    };
    FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber, options) {
    };
    FromEventObservable.prototype._subscribe = function (subscriber) {
    };
    return FromEventObservable;
}(Observable_1.Observable);
exports.FromEventObservable = FromEventObservable;    

},{"../Observable":6,"../Subscription":15,"../util/errorObject":331,"../util/isFunction":334,"../util/tryCatch":344}],155:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var Subscription_1 = require('../Subscription');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var FromEventPatternObservable = function (_super) {
    __extends(FromEventPatternObservable, _super);
    function FromEventPatternObservable(addHandler, removeHandler, selector) {
    }
    /**
     * Creates an Observable from an API based on addHandler/removeHandler
     * functions.
     *
     * <span class="informal">Converts any addHandler/removeHandler API to an
     * Observable.</span>
     *
     * <img src="./img/fromEventPattern.png" width="100%">
     *
     * Creates an Observable by using the `addHandler` and `removeHandler`
     * functions to add and remove the handlers, with an optional selector
     * function to project the event arguments to a result. The `addHandler` is
     * called when the output Observable is subscribed, and `removeHandler` is
     * called when the Subscription is unsubscribed.
     *
     * @example <caption>Emits clicks happening on the DOM document</caption>
     * function addClickHandler(handler) {
     *   document.addEventListener('click', handler);
     * }
     *
     * function removeClickHandler(handler) {
     *   document.removeEventListener('click', handler);
     * }
     *
     * var clicks = Rx.Observable.fromEventPattern(
     *   addClickHandler,
     *   removeClickHandler
     * );
     * clicks.subscribe(x => console.log(x));
     *
     * @see {@link from}
     * @see {@link fromEvent}
     *
     * @param {function(handler: Function): any} addHandler A function that takes
     * a `handler` function as argument and attaches it somehow to the actual
     * source of events.
     * @param {function(handler: Function): void} removeHandler A function that
     * takes a `handler` function as argument and removes it in case it was
     * previously attached using `addHandler`.
     * @param {function(...args: any): T} [selector] An optional function to
     * post-process results. It takes the arguments from the event handler and
     * should return a single value.
     * @return {Observable<T>}
     * @static true
     * @name fromEventPattern
     * @owner Observable
     */
    FromEventPatternObservable.create = function (addHandler, removeHandler, selector) {
    };
    FromEventPatternObservable.prototype._subscribe = function (subscriber) {
    };
    FromEventPatternObservable.prototype._callSelector = function (subscriber, args) {
    };
    FromEventPatternObservable.prototype._callAddHandler = function (handler, errorSubscriber) {
    };
    return FromEventPatternObservable;
}(Observable_1.Observable);
exports.FromEventPatternObservable = FromEventPatternObservable;    

},{"../Observable":6,"../Subscription":15}],156:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isArray_1 = require('../util/isArray');
var isPromise_1 = require('../util/isPromise');
var PromiseObservable_1 = require('./PromiseObservable');
var IteratorObservable_1 = require('./IteratorObservable');
var ArrayObservable_1 = require('./ArrayObservable');
var ArrayLikeObservable_1 = require('./ArrayLikeObservable');
var iterator_1 = require('../symbol/iterator');
var Observable_1 = require('../Observable');
var observeOn_1 = require('../operator/observeOn');
var observable_1 = require('../symbol/observable');
var isArrayLike = function (x) {
};
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var FromObservable = function (_super) {
    __extends(FromObservable, _super);
    function FromObservable(ish, scheduler) {
    }
    /**
     * Creates an Observable from an Array, an array-like object, a Promise, an
     * iterable object, or an Observable-like object.
     *
     * <span class="informal">Converts almost anything to an Observable.</span>
     *
     * <img src="./img/from.png" width="100%">
     *
     * Convert various other objects and data types into Observables. `from`
     * converts a Promise or an array-like or an
     * [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
     * object into an Observable that emits the items in that promise or array or
     * iterable. A String, in this context, is treated as an array of characters.
     * Observable-like objects (contains a function named with the ES2015 Symbol
     * for Observable) can also be converted through this operator.
     *
     * @example <caption>Converts an array to an Observable</caption>
     * var array = [10, 20, 30];
     * var result = Rx.Observable.from(array);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Convert an infinite iterable (from a generator) to an Observable</caption>
     * function* generateDoubles(seed) {
     *   var i = seed;
     *   while (true) {
     *     yield i;
     *     i = 2 * i; // double it
     *   }
     * }
     *
     * var iterator = generateDoubles(3);
     * var result = Rx.Observable.from(iterator).take(10);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link fromEvent}
     * @see {@link fromEventPattern}
     * @see {@link fromPromise}
     *
     * @param {ObservableInput<T>} ish A subscribable object, a Promise, an
     * Observable-like, an Array, an iterable or an array-like object to be
     * converted.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * emissions of values.
     * @return {Observable<T>} The Observable whose values are originally from the
     * input object that was converted.
     * @static true
     * @name from
     * @owner Observable
     */
    FromObservable.create = function (ish, scheduler) {
    };
    FromObservable.prototype._subscribe = function (subscriber) {
    };
    return FromObservable;
}(Observable_1.Observable);
exports.FromObservable = FromObservable;    

},{"../Observable":6,"../operator/observeOn":249,"../symbol/iterator":312,"../symbol/observable":313,"../util/isArray":332,"../util/isPromise":337,"./ArrayLikeObservable":145,"./ArrayObservable":146,"./IteratorObservable":160,"./PromiseObservable":164}],157:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var isScheduler_1 = require('../util/isScheduler');
var selfSelector = function (value) {
};
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var GenerateObservable = function (_super) {
    __extends(GenerateObservable, _super);
    function GenerateObservable(initialState, condition, iterate, resultSelector, scheduler) {
    }
    GenerateObservable.create = function (initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
    };
    GenerateObservable.prototype._subscribe = function (subscriber) {
    };
    GenerateObservable.dispatch = function (state) {
    };
    return GenerateObservable;
}(Observable_1.Observable);
exports.GenerateObservable = GenerateObservable;    

},{"../Observable":6,"../util/isScheduler":338}],158:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var IfObservable = function (_super) {
    __extends(IfObservable, _super);
    function IfObservable(condition, thenSource, elseSource) {
    }
    IfObservable.create = function (condition, thenSource, elseSource) {
    };
    IfObservable.prototype._subscribe = function (subscriber) {
    };
    return IfObservable;
}(Observable_1.Observable);
exports.IfObservable = IfObservable;
var IfSubscriber = function (_super) {
    __extends(IfSubscriber, _super);
    function IfSubscriber(destination, condition, thenSource, elseSource) {
    }
    IfSubscriber.prototype.tryIf = function () {
    };
    return IfSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../Observable":6,"../OuterSubscriber":8,"../util/subscribeToResult":342}],159:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isNumeric_1 = require('../util/isNumeric');
var Observable_1 = require('../Observable');
var async_1 = require('../scheduler/async');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var IntervalObservable = function (_super) {
    __extends(IntervalObservable, _super);
    function IntervalObservable(period, scheduler) {
    }
    /**
     * Creates an Observable that emits sequential numbers every specified
     * interval of time, on a specified Scheduler.
     *
     * <span class="informal">Emits incremental numbers periodically in time.
     * </span>
     *
     * <img src="./img/interval.png" width="100%">
     *
     * `interval` returns an Observable that emits an infinite sequence of
     * ascending integers, with a constant interval of time of your choosing
     * between those emissions. The first emission is not sent immediately, but
     * only after the first period has passed. By default, this operator uses the
     * `async` Scheduler to provide a notion of time, but you may pass any
     * Scheduler to it.
     *
     * @example <caption>Emits ascending numbers, one every second (1000ms)</caption>
     * var numbers = Rx.Observable.interval(1000);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link timer}
     * @see {@link delay}
     *
     * @param {number} [period=0] The interval size in milliseconds (by default)
     * or the time unit determined by the scheduler's clock.
     * @param {Scheduler} [scheduler=async] The Scheduler to use for scheduling
     * the emission of values, and providing a notion of "time".
     * @return {Observable} An Observable that emits a sequential number each time
     * interval.
     * @static true
     * @name interval
     * @owner Observable
     */
    IntervalObservable.create = function (period, scheduler) {
    };
    IntervalObservable.dispatch = function (state) {
    };
    IntervalObservable.prototype._subscribe = function (subscriber) {
    };
    return IntervalObservable;
}(Observable_1.Observable);
exports.IntervalObservable = IntervalObservable;    

},{"../Observable":6,"../scheduler/async":310,"../util/isNumeric":335}],160:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = require('../util/root');
var Observable_1 = require('../Observable');
var iterator_1 = require('../symbol/iterator');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var IteratorObservable = function (_super) {
    __extends(IteratorObservable, _super);
    function IteratorObservable(iterator, scheduler) {
    }
    IteratorObservable.create = function (iterator, scheduler) {
    };
    IteratorObservable.dispatch = function (state) {
    };
    IteratorObservable.prototype._subscribe = function (subscriber) {
    };
    return IteratorObservable;
}(Observable_1.Observable);
exports.IteratorObservable = IteratorObservable;
var StringIterator = function () {
    function StringIterator(str, idx, len) {
    }
    StringIterator.prototype[iterator_1.$$iterator] = function () {
    };
    StringIterator.prototype.next = function () {
    };
    return StringIterator;
}();
var ArrayIterator = function () {
    function ArrayIterator(arr, idx, len) {
    }
    ArrayIterator.prototype[iterator_1.$$iterator] = function () {
    };
    ArrayIterator.prototype.next = function () {
    };
    return ArrayIterator;
}();
function getIterator(obj) {
}
var maxSafeInteger = Math.pow(2, 53) - 1;
function toLength(o) {
}
function numberIsFinite(value) {
}
function sign(value) {
}    

},{"../Observable":6,"../symbol/iterator":312,"../util/root":341}],161:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
var MulticastObservable = function (_super) {
    __extends(MulticastObservable, _super);
    function MulticastObservable(source, subjectFactory, selector) {
    }
    MulticastObservable.prototype._subscribe = function (subscriber) {
    };
    return MulticastObservable;
}(Observable_1.Observable);
exports.MulticastObservable = MulticastObservable;    

},{"../Observable":6,"../observable/ConnectableObservable":149}],162:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var noop_1 = require('../util/noop');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var NeverObservable = function (_super) {
    __extends(NeverObservable, _super);
    function NeverObservable() {
    }
    /**
     * Creates an Observable that emits no items to the Observer.
     *
     * <span class="informal">An Observable that never emits anything.</span>
     *
     * <img src="./img/never.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that emits
     * neither values nor errors nor the completion notification. It can be used
     * for testing purposes or for composing with other Observables. Please not
     * that by never emitting a complete notification, this Observable keeps the
     * subscription from being disposed automatically. Subscriptions need to be
     * manually disposed.
     *
     * @example <caption>Emit the number 7, then never emit anything else (not even complete).</caption>
     * function info() {
     *   console.log('Will not be called');
     * }
     * var result = Rx.Observable.never().startWith(7);
     * result.subscribe(x => console.log(x), info, info);
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link of}
     * @see {@link throw}
     *
     * @return {Observable} A "never" Observable: never emits anything.
     * @static true
     * @name never
     * @owner Observable
     */
    NeverObservable.create = function () {
    };
    NeverObservable.prototype._subscribe = function (subscriber) {
    };
    return NeverObservable;
}(Observable_1.Observable);
exports.NeverObservable = NeverObservable;    

},{"../Observable":6,"../util/noop":339}],163:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
function dispatch(state) {
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var PairsObservable = function (_super) {
    __extends(PairsObservable, _super);
    function PairsObservable(obj, scheduler) {
    }
    /**
     * Convert an object into an observable sequence of [key, value] pairs
     * using an optional Scheduler to enumerate the object.
     *
     * @example <caption>Converts a javascript object to an Observable</caption>
     * var obj = {
     *   foo: 42,
     *   bar: 56,
     *   baz: 78
     * };
     *
     * var source = Rx.Observable.pairs(obj);
     *
     * var subscription = source.subscribe(
     *   function (x) {
     *     console.log('Next: %s', x);
     *   },
     *   function (err) {
     *     console.log('Error: %s', err);
     *   },
     *   function () {
     *     console.log('Completed');
     *   });
     *
     * @param {Object} obj The object to inspect and turn into an
     * Observable sequence.
     * @param {Scheduler} [scheduler] An optional Scheduler to run the
     * enumeration of the input sequence on.
     * @returns {(Observable<Array<string | T>>)} An observable sequence of
     * [key, value] pairs from the object.
     */
    PairsObservable.create = function (obj, scheduler) {
    };
    PairsObservable.prototype._subscribe = function (subscriber) {
    };
    return PairsObservable;
}(Observable_1.Observable);
exports.PairsObservable = PairsObservable;    

},{"../Observable":6}],164:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = require('../util/root');
var Observable_1 = require('../Observable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var PromiseObservable = function (_super) {
    __extends(PromiseObservable, _super);
    function PromiseObservable(promise, scheduler) {
        _super.call(this);
        this.promise = promise;
        this.scheduler = scheduler;
    }
    /**
     * Converts a Promise to an Observable.
     *
     * <span class="informal">Returns an Observable that just emits the Promise's
     * resolved value, then completes.</span>
     *
     * Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an
     * Observable. If the Promise resolves with a value, the output Observable
     * emits that resolved value as a `next`, and then completes. If the Promise
     * is rejected, then the output Observable emits the corresponding Error.
     *
     * @example <caption>Convert the Promise returned by Fetch to an Observable</caption>
     * var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindCallback}
     * @see {@link from}
     *
     * @param {Promise<T>} promise The promise to be converted.
     * @param {Scheduler} [scheduler] An optional Scheduler to use for scheduling
     * the delivery of the resolved value (or the rejection).
     * @return {Observable<T>} An Observable which wraps the Promise.
     * @static true
     * @name fromPromise
     * @owner Observable
     */
    PromiseObservable.create = function (promise, scheduler) {
        return new PromiseObservable(promise, scheduler);
    };
    PromiseObservable.prototype._subscribe = function (subscriber) {
        var _this = this;
        var promise = this.promise;
        var scheduler = this.scheduler;
        if (scheduler == null) {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    subscriber.next(this.value);
                    subscriber.complete();
                }
            } else {
                promise.then(function (value) {
                }, function (err) {
                    if (!subscriber.closed) {
                        subscriber.error(err);
                    }
                }).then(null, function (err) {
                });
            }
        } else {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    return scheduler.schedule(dispatchNext, 0, {
                        value: this.value,
                        subscriber: subscriber
                    });
                }
            } else {
                promise.then(function (value) {
                }, function (err) {
                }).then(null, function (err) {
                });
            }
        }
    };
    return PromiseObservable;
}(Observable_1.Observable);
exports.PromiseObservable = PromiseObservable;
function dispatchNext(arg) {
}
function dispatchError(arg) {
}    

},{"../Observable":6,"../util/root":341}],165:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var RangeObservable = function (_super) {
    __extends(RangeObservable, _super);
    function RangeObservable(start, count, scheduler) {
    }
    /**
     * Creates an Observable that emits a sequence of numbers within a specified
     * range.
     *
     * <span class="informal">Emits a sequence of numbers in a range.</span>
     *
     * <img src="./img/range.png" width="100%">
     *
     * `range` operator emits a range of sequential integers, in order, where you
     * select the `start` of the range and its `length`. By default, uses no
     * Scheduler and just delivers the notifications synchronously, but may use
     * an optional Scheduler to regulate those deliveries.
     *
     * @example <caption>Emits the numbers 1 to 10</caption>
     * var numbers = Rx.Observable.range(1, 10);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link timer}
     * @see {@link interval}
     *
     * @param {number} [start=0] The value of the first integer in the sequence.
     * @param {number} [count=0] The number of sequential integers to generate.
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emissions of the notifications.
     * @return {Observable} An Observable of numbers that emits a finite range of
     * sequential integers.
     * @static true
     * @name range
     * @owner Observable
     */
    RangeObservable.create = function (start, count, scheduler) {
    };
    RangeObservable.dispatch = function (state) {
    };
    RangeObservable.prototype._subscribe = function (subscriber) {
    };
    return RangeObservable;
}(Observable_1.Observable);
exports.RangeObservable = RangeObservable;    

},{"../Observable":6}],166:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ScalarObservable = function (_super) {
    __extends(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
    }
    ScalarObservable.create = function (value, scheduler) {
    };
    ScalarObservable.dispatch = function (state) {
    };
    ScalarObservable.prototype._subscribe = function (subscriber) {
    };
    return ScalarObservable;
}(Observable_1.Observable);
exports.ScalarObservable = ScalarObservable;    

},{"../Observable":6}],167:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var asap_1 = require('../scheduler/asap');
var isNumeric_1 = require('../util/isNumeric');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var SubscribeOnObservable = function (_super) {
    __extends(SubscribeOnObservable, _super);
    function SubscribeOnObservable(source, delayTime, scheduler) {
    }
    SubscribeOnObservable.create = function (source, delay, scheduler) {
    };
    SubscribeOnObservable.dispatch = function (arg) {
    };
    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
    };
    return SubscribeOnObservable;
}(Observable_1.Observable);
exports.SubscribeOnObservable = SubscribeOnObservable;    

},{"../Observable":6,"../scheduler/asap":309,"../util/isNumeric":335}],168:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isNumeric_1 = require('../util/isNumeric');
var Observable_1 = require('../Observable');
var async_1 = require('../scheduler/async');
var isScheduler_1 = require('../util/isScheduler');
var isDate_1 = require('../util/isDate');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var TimerObservable = function (_super) {
    __extends(TimerObservable, _super);
    function TimerObservable(dueTime, period, scheduler) {
    }
    /**
     * Creates an Observable that starts emitting after an `initialDelay` and
     * emits ever increasing numbers after each `period` of time thereafter.
     *
     * <span class="informal">Its like {@link interval}, but you can specify when
     * should the emissions start.</span>
     *
     * <img src="./img/timer.png" width="100%">
     *
     * `timer` returns an Observable that emits an infinite sequence of ascending
     * integers, with a constant interval of time, `period` of your choosing
     * between those emissions. The first emission happens after the specified
     * `initialDelay`. The initial delay may be a {@link Date}. By default, this
     * operator uses the `async` Scheduler to provide a notion of time, but you
     * may pass any Scheduler to it. If `period` is not specified, the output
     * Observable emits only one value, `0`. Otherwise, it emits an infinite
     * sequence.
     *
     * @example <caption>Emits ascending numbers, one every second (1000ms), starting after 3 seconds</caption>
     * var numbers = Rx.Observable.timer(3000, 1000);
     * numbers.subscribe(x => console.log(x));
     *
     * @example <caption>Emits one number after five seconds</caption>
     * var numbers = Rx.Observable.timer(5000);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link interval}
     * @see {@link delay}
     *
     * @param {number|Date} initialDelay The initial delay time to wait before
     * emitting the first value of `0`.
     * @param {number} [period] The period of time between emissions of the
     * subsequent numbers.
     * @param {Scheduler} [scheduler=async] The Scheduler to use for scheduling
     * the emission of values, and providing a notion of "time".
     * @return {Observable} An Observable that emits a `0` after the
     * `initialDelay` and ever increasing numbers after each `period` of time
     * thereafter.
     * @static true
     * @name timer
     * @owner Observable
     */
    TimerObservable.create = function (initialDelay, period, scheduler) {
    };
    TimerObservable.dispatch = function (state) {
    };
    TimerObservable.prototype._subscribe = function (subscriber) {
    };
    return TimerObservable;
}(Observable_1.Observable);
exports.TimerObservable = TimerObservable;    

},{"../Observable":6,"../scheduler/async":310,"../util/isDate":333,"../util/isNumeric":335,"../util/isScheduler":338}],169:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var UsingObservable = function (_super) {
    __extends(UsingObservable, _super);
    function UsingObservable(resourceFactory, observableFactory) {
    }
    UsingObservable.create = function (resourceFactory, observableFactory) {
    };
    UsingObservable.prototype._subscribe = function (subscriber) {
    };
    return UsingObservable;
}(Observable_1.Observable);
exports.UsingObservable = UsingObservable;
var UsingSubscriber = function (_super) {
    __extends(UsingSubscriber, _super);
    function UsingSubscriber(destination, resource, observableFactory) {
    }
    UsingSubscriber.prototype.tryUse = function () {
    };
    return UsingSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../Observable":6,"../OuterSubscriber":8,"../util/subscribeToResult":342}],170:[function(require,module,exports){
'use strict';
var BoundCallbackObservable_1 = require('./BoundCallbackObservable');
exports.bindCallback = BoundCallbackObservable_1.BoundCallbackObservable.create;    

},{"./BoundCallbackObservable":147}],171:[function(require,module,exports){
'use strict';
var BoundNodeCallbackObservable_1 = require('./BoundNodeCallbackObservable');
exports.bindNodeCallback = BoundNodeCallbackObservable_1.BoundNodeCallbackObservable.create;    

},{"./BoundNodeCallbackObservable":148}],172:[function(require,module,exports){
'use strict';
var isScheduler_1 = require('../util/isScheduler');
var isArray_1 = require('../util/isArray');
var ArrayObservable_1 = require('./ArrayObservable');
var combineLatest_1 = require('../operator/combineLatest');
/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from all the Observables passed as
 * arguments. This is done by subscribing to each Observable, in order, and
 * collecting an array of each of the most recent values any time any of the
 * input Observables emits, then either taking that array and passing it as
 * arguments to an optional `project` function and emitting the return value of
 * that, or just emitting the array of recent values directly if there is no
 * `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = Rx.Observable.combineLatest(weight, height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} observable1 An input Observable to combine with the
 * source Observable.
 * @param {Observable} observable2 An input Observable to combine with the
 * source Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for subscribing to
 * each input Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @static true
 * @name combineLatest
 * @owner Observable
 */
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    var scheduler = null;
    if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
        observables = observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new combineLatest_1.CombineLatestOperator(project));
}
exports.combineLatest = combineLatest;    

},{"../operator/combineLatest":206,"../util/isArray":332,"../util/isScheduler":338,"./ArrayObservable":146}],173:[function(require,module,exports){
'use strict';
var concat_1 = require('../operator/concat');
exports.concat = concat_1.concatStatic;    

},{"../operator/concat":207}],174:[function(require,module,exports){
'use strict';
var DeferObservable_1 = require('./DeferObservable');
exports.defer = DeferObservable_1.DeferObservable.create;    

},{"./DeferObservable":150}],175:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = require('../../util/root');
var tryCatch_1 = require('../../util/tryCatch');
var errorObject_1 = require('../../util/errorObject');
var Observable_1 = require('../../Observable');
var Subscriber_1 = require('../../Subscriber');
var map_1 = require('../../operator/map');
function getCORSRequest() {
}
function getXMLHttpRequest() {
}
function ajaxGet(url, headers) {
}
exports.ajaxGet = ajaxGet;
;
function ajaxPost(url, body, headers) {
}
exports.ajaxPost = ajaxPost;
;
function ajaxDelete(url, headers) {
}
exports.ajaxDelete = ajaxDelete;
;
function ajaxPut(url, body, headers) {
}
exports.ajaxPut = ajaxPut;
;
function ajaxGetJSON(url, headers) {
}
exports.ajaxGetJSON = ajaxGetJSON;
;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var AjaxObservable = function (_super) {
    __extends(AjaxObservable, _super);
    function AjaxObservable(urlOrRequest) {
    }
    AjaxObservable.prototype._subscribe = function (subscriber) {
    };
    /**
     * Creates an observable for an Ajax request with either a request object with
     * url, headers, etc or a string for a URL.
     *
     * @example
     * source = Rx.Observable.ajax('/products');
     * source = Rx.Observable.ajax({ url: 'products', method: 'GET' });
     *
     * @param {string|Object} request Can be one of the following:
     *   A string of the URL to make the Ajax call.
     *   An object with the following properties
     *   - url: URL of the request
     *   - body: The body of the request
     *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
     *   - async: Whether the request is async
     *   - headers: Optional headers
     *   - crossDomain: true if a cross domain request, else false
     *   - createXHR: a function to override if you need to use an alternate
     *   XMLHttpRequest implementation.
     *   - resultSelector: a function to use to alter the output value type of
     *   the Observable. Gets {@link AjaxResponse} as an argument.
     * @return {Observable} An observable sequence containing the XMLHttpRequest.
     * @static true
     * @name ajax
     * @owner Observable
    */
    AjaxObservable.create = function () {
        var create = function (urlOrRequest) {
        };
        create.get = ajaxGet;
        create.post = ajaxPost;
        create.delete = ajaxDelete;
        create.put = ajaxPut;
        create.getJSON = ajaxGetJSON;
        return create;
    }();
    return AjaxObservable;
}(Observable_1.Observable);
exports.AjaxObservable = AjaxObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AjaxSubscriber = function (_super) {
    __extends(AjaxSubscriber, _super);
    function AjaxSubscriber(destination, request) {
    }
    AjaxSubscriber.prototype.next = function (e) {
    };
    AjaxSubscriber.prototype.send = function () {
    };
    AjaxSubscriber.prototype.serializeBody = function (body, contentType) {
    };
    AjaxSubscriber.prototype.setHeaders = function (xhr, headers) {
    };
    AjaxSubscriber.prototype.setupEvents = function (xhr, request) {
    };
    AjaxSubscriber.prototype.unsubscribe = function () {
    };
    return AjaxSubscriber;
}(Subscriber_1.Subscriber);
exports.AjaxSubscriber = AjaxSubscriber;
/**
 * A normalized AJAX response.
 *
 * @see {@link ajax}
 *
 * @class AjaxResponse
 */
var AjaxResponse = function () {
    function AjaxResponse(originalEvent, xhr, request) {
    }
    return AjaxResponse;
}();
exports.AjaxResponse = AjaxResponse;
/**
 * A normalized AJAX error.
 *
 * @see {@link ajax}
 *
 * @class AjaxError
 */
var AjaxError = function (_super) {
    __extends(AjaxError, _super);
    function AjaxError(message, xhr, request) {
    }
    return AjaxError;
}(Error);
exports.AjaxError = AjaxError;
/**
 * @see {@link ajax}
 *
 * @class AjaxTimeoutError
 */
var AjaxTimeoutError = function (_super) {
    __extends(AjaxTimeoutError, _super);
    function AjaxTimeoutError(xhr, request) {
    }
    return AjaxTimeoutError;
}(AjaxError);
exports.AjaxTimeoutError = AjaxTimeoutError;    

},{"../../Observable":6,"../../Subscriber":14,"../../operator/map":238,"../../util/errorObject":331,"../../util/root":341,"../../util/tryCatch":344}],176:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../../Subject');
var Subscriber_1 = require('../../Subscriber');
var Observable_1 = require('../../Observable');
var Subscription_1 = require('../../Subscription');
var root_1 = require('../../util/root');
var ReplaySubject_1 = require('../../ReplaySubject');
var tryCatch_1 = require('../../util/tryCatch');
var errorObject_1 = require('../../util/errorObject');
var assign_1 = require('../../util/assign');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var WebSocketSubject = function (_super) {
    __extends(WebSocketSubject, _super);
    function WebSocketSubject(urlConfigOrSource, destination) {
    }
    WebSocketSubject.prototype.resultSelector = function (e) {
    };
    /**
     * @param urlConfigOrSource
     * @return {WebSocketSubject}
     * @static true
     * @name webSocket
     * @owner Observable
     */
    WebSocketSubject.create = function (urlConfigOrSource) {
    };
    WebSocketSubject.prototype.lift = function (operator) {
    };
    // TODO: factor this out to be a proper Operator/Subscriber implementation and eliminate closures
    WebSocketSubject.prototype.multiplex = function (subMsg, unsubMsg, messageFilter) {
    };
    WebSocketSubject.prototype._connectSocket = function () {
    };
    WebSocketSubject.prototype._subscribe = function (subscriber) {
    };
    WebSocketSubject.prototype.unsubscribe = function () {
    };
    return WebSocketSubject;
}(Subject_1.AnonymousSubject);
exports.WebSocketSubject = WebSocketSubject;    

},{"../../Observable":6,"../../ReplaySubject":9,"../../Subject":12,"../../Subscriber":14,"../../Subscription":15,"../../util/assign":330,"../../util/errorObject":331,"../../util/root":341,"../../util/tryCatch":344}],177:[function(require,module,exports){
'use strict';
var AjaxObservable_1 = require('./AjaxObservable');
exports.ajax = AjaxObservable_1.AjaxObservable.create;    

},{"./AjaxObservable":175}],178:[function(require,module,exports){
'use strict';
var WebSocketSubject_1 = require('./WebSocketSubject');
exports.webSocket = WebSocketSubject_1.WebSocketSubject.create;    

},{"./WebSocketSubject":176}],179:[function(require,module,exports){
'use strict';
var EmptyObservable_1 = require('./EmptyObservable');
exports.empty = EmptyObservable_1.EmptyObservable.create;    

},{"./EmptyObservable":151}],180:[function(require,module,exports){
'use strict';
var ForkJoinObservable_1 = require('./ForkJoinObservable');
exports.forkJoin = ForkJoinObservable_1.ForkJoinObservable.create;    

},{"./ForkJoinObservable":153}],181:[function(require,module,exports){
'use strict';
var FromObservable_1 = require('./FromObservable');
exports.from = FromObservable_1.FromObservable.create;    

},{"./FromObservable":156}],182:[function(require,module,exports){
'use strict';
var FromEventObservable_1 = require('./FromEventObservable');
exports.fromEvent = FromEventObservable_1.FromEventObservable.create;    

},{"./FromEventObservable":154}],183:[function(require,module,exports){
'use strict';
var FromEventPatternObservable_1 = require('./FromEventPatternObservable');
exports.fromEventPattern = FromEventPatternObservable_1.FromEventPatternObservable.create;    

},{"./FromEventPatternObservable":155}],184:[function(require,module,exports){
'use strict';
var PromiseObservable_1 = require('./PromiseObservable');
exports.fromPromise = PromiseObservable_1.PromiseObservable.create;    

},{"./PromiseObservable":164}],185:[function(require,module,exports){
'use strict';
var IfObservable_1 = require('./IfObservable');
exports._if = IfObservable_1.IfObservable.create;    

},{"./IfObservable":158}],186:[function(require,module,exports){
'use strict';
var IntervalObservable_1 = require('./IntervalObservable');
exports.interval = IntervalObservable_1.IntervalObservable.create;    

},{"./IntervalObservable":159}],187:[function(require,module,exports){
'use strict';
var merge_1 = require('../operator/merge');
exports.merge = merge_1.mergeStatic;    

},{"../operator/merge":242}],188:[function(require,module,exports){
'use strict';
var NeverObservable_1 = require('./NeverObservable');
exports.never = NeverObservable_1.NeverObservable.create;    

},{"./NeverObservable":162}],189:[function(require,module,exports){
'use strict';
var ArrayObservable_1 = require('./ArrayObservable');
exports.of = ArrayObservable_1.ArrayObservable.of;    

},{"./ArrayObservable":146}],190:[function(require,module,exports){
'use strict';
var PairsObservable_1 = require('./PairsObservable');
exports.pairs = PairsObservable_1.PairsObservable.create;    

},{"./PairsObservable":163}],191:[function(require,module,exports){
'use strict';
var RangeObservable_1 = require('./RangeObservable');
exports.range = RangeObservable_1.RangeObservable.create;    

},{"./RangeObservable":165}],192:[function(require,module,exports){
'use strict';
var ErrorObservable_1 = require('./ErrorObservable');
exports._throw = ErrorObservable_1.ErrorObservable.create;    

},{"./ErrorObservable":152}],193:[function(require,module,exports){
'use strict';
var TimerObservable_1 = require('./TimerObservable');
exports.timer = TimerObservable_1.TimerObservable.create;    

},{"./TimerObservable":168}],194:[function(require,module,exports){
'use strict';
var UsingObservable_1 = require('./UsingObservable');
exports.using = UsingObservable_1.UsingObservable.create;    

},{"./UsingObservable":169}],195:[function(require,module,exports){
'use strict';
var zip_1 = require('../operator/zip');
exports.zip = zip_1.zipStatic;    

},{"../operator/zip":296}],196:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Ignores source values for a duration determined by another Observable, then
 * emits the most recent value from the source Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link auditTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * <img src="./img/audit.png" width="100%">
 *
 * `audit` is similar to `throttle`, but emits the last value from the silenced
 * time window, instead of the first value. `audit` emits the most recent value
 * from the source Observable on the output Observable as soon as its internal
 * timer becomes disabled, and ignores source values while the timer is enabled.
 * Initially, the timer is disabled. As soon as the first source value arrives,
 * the timer is enabled by calling the `durationSelector` function with the
 * source value, which returns the "duration" Observable. When the duration
 * Observable emits a value or completes, the timer is disabled, then the most
 * recent source value is emitted on the output Observable, and this process
 * repeats for the next source value.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.audit(ev => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttle}
 *
 * @param {function(value: T): Observable|Promise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration, returned as an Observable or a Promise.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method audit
 * @owner Observable
 */
function audit(durationSelector) {
}
exports.audit = audit;
var AuditOperator = function () {
    function AuditOperator(durationSelector) {
    }
    AuditOperator.prototype.call = function (subscriber, source) {
    };
    return AuditOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AuditSubscriber = function (_super) {
    __extends(AuditSubscriber, _super);
    function AuditSubscriber(destination, durationSelector) {
    }
    AuditSubscriber.prototype._next = function (value) {
    };
    AuditSubscriber.prototype.clearThrottle = function () {
    };
    AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
    };
    AuditSubscriber.prototype.notifyComplete = function () {
    };
    return AuditSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],197:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var async_1 = require('../scheduler/async');
var Subscriber_1 = require('../Subscriber');
/**
 * Ignores source values for `duration` milliseconds, then emits the most recent
 * value from the source Observable, then repeats this process.
 *
 * <span class="informal">When it sees a source values, it ignores that plus
 * the next ones for `duration` milliseconds, and then it emits the most recent
 * value from the source.</span>
 *
 * <img src="./img/auditTime.png" width="100%">
 *
 * `auditTime` is similar to `throttleTime`, but emits the last value from the
 * silenced time window, instead of the first value. `auditTime` emits the most
 * recent value from the source Observable on the output Observable as soon as
 * its internal timer becomes disabled, and ignores source values while the
 * timer is enabled. Initially, the timer is disabled. As soon as the first
 * source value arrives, the timer is enabled. After `duration` milliseconds (or
 * the time unit determined internally by the optional `scheduler`) has passed,
 * the timer is disabled, then the most recent source value is emitted on the
 * output Observable, and this process repeats for the next source value.
 * Optionally takes a {@link Scheduler} for managing timers.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.auditTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} duration Time to wait before emitting the most recent source
 * value, measured in milliseconds or the time unit determined internally
 * by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the rate-limiting behavior.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method auditTime
 * @owner Observable
 */
function auditTime(duration, scheduler) {
}
exports.auditTime = auditTime;
var AuditTimeOperator = function () {
    function AuditTimeOperator(duration, scheduler) {
    }
    AuditTimeOperator.prototype.call = function (subscriber, source) {
    };
    return AuditTimeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AuditTimeSubscriber = function (_super) {
    __extends(AuditTimeSubscriber, _super);
    function AuditTimeSubscriber(destination, duration, scheduler) {
    }
    AuditTimeSubscriber.prototype._next = function (value) {
    };
    AuditTimeSubscriber.prototype.clearThrottle = function () {
    };
    return AuditTimeSubscriber;
}(Subscriber_1.Subscriber);
function dispatchNext(subscriber) {
}    

},{"../Subscriber":14,"../scheduler/async":310}],198:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Buffers the source Observable values until `closingNotifier` emits.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when another Observable emits.</span>
 *
 * <img src="./img/buffer.png" width="100%">
 *
 * Buffers the incoming Observable values until the given `closingNotifier`
 * Observable emits a value, at which point it emits the buffer on the output
 * Observable and starts a new buffer internally, awaiting the next time
 * `closingNotifier` emits.
 *
 * @example <caption>On every click, emit array of most recent interval events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var interval = Rx.Observable.interval(1000);
 * var buffered = interval.buffer(clicks);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link window}
 *
 * @param {Observable<any>} closingNotifier An Observable that signals the
 * buffer to be emitted on the output Observable.
 * @return {Observable<T[]>} An Observable of buffers, which are arrays of
 * values.
 * @method buffer
 * @owner Observable
 */
function buffer(closingNotifier) {
}
exports.buffer = buffer;
var BufferOperator = function () {
    function BufferOperator(closingNotifier) {
    }
    BufferOperator.prototype.call = function (subscriber, source) {
    };
    return BufferOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferSubscriber = function (_super) {
    __extends(BufferSubscriber, _super);
    function BufferSubscriber(destination, closingNotifier) {
    }
    BufferSubscriber.prototype._next = function (value) {
    };
    BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    return BufferSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],199:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Buffers the source Observable values until the size hits the maximum
 * `bufferSize` given.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when its size reaches `bufferSize`.</span>
 *
 * <img src="./img/bufferCount.png" width="100%">
 *
 * Buffers a number of values from the source Observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * @example <caption>Emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2);
 * buffered.subscribe(x => console.log(x));
 *
 * @example <caption>On every click, emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2, 1);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link pairwise}
 * @see {@link windowCount}
 *
 * @param {number} bufferSize The maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] Interval at which to start a new buffer.
 * For example if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source. A new buffer is started at the
 * beginning of the source by default.
 * @return {Observable<T[]>} An Observable of arrays of buffered values.
 * @method bufferCount
 * @owner Observable
 */
function bufferCount(bufferSize, startBufferEvery) {
}
exports.bufferCount = bufferCount;
var BufferCountOperator = function () {
    function BufferCountOperator(bufferSize, startBufferEvery) {
    }
    BufferCountOperator.prototype.call = function (subscriber, source) {
    };
    return BufferCountOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferCountSubscriber = function (_super) {
    __extends(BufferCountSubscriber, _super);
    function BufferCountSubscriber(destination, bufferSize, startBufferEvery) {
    }
    BufferCountSubscriber.prototype._next = function (value) {
    };
    BufferCountSubscriber.prototype._complete = function () {
    };
    return BufferCountSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],200:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var async_1 = require('../scheduler/async');
var Subscriber_1 = require('../Subscriber');
var isScheduler_1 = require('../util/isScheduler');
/**
 * Buffers the source Observable values for a specific time period.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * those arrays periodically in time.</span>
 *
 * <img src="./img/bufferTime.png" width="100%">
 *
 * Buffers values from the source for a specific time duration `bufferTimeSpan`.
 * Unless the optional argument `bufferCreationInterval` is given, it emits and
 * resets the buffer every `bufferTimeSpan` milliseconds. If
 * `bufferCreationInterval` is given, this operator opens the buffer every
 * `bufferCreationInterval` milliseconds and closes (emits and resets) the
 * buffer every `bufferTimeSpan` milliseconds. When the optional argument
 * `maxBufferSize` is specified, the buffer will be closed either after
 * `bufferTimeSpan` milliseconds or when it contains `maxBufferSize` elements.
 *
 * @example <caption>Every second, emit an array of the recent click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferTime(1000);
 * buffered.subscribe(x => console.log(x));
 *
 * @example <caption>Every 5 seconds, emit the click events from the next 2 seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferTime(2000, 5000);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link windowTime}
 *
 * @param {number} bufferTimeSpan The amount of time to fill each buffer array.
 * @param {number} [bufferCreationInterval] The interval at which to start new
 * buffers.
 * @param {number} [maxBufferSize] The maximum buffer size.
 * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine buffer boundaries.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferTime
 * @owner Observable
 */
function bufferTime(bufferTimeSpan) {
}
exports.bufferTime = bufferTime;
var BufferTimeOperator = function () {
    function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
    }
    BufferTimeOperator.prototype.call = function (subscriber, source) {
    };
    return BufferTimeOperator;
}();
var Context = function () {
    function Context() {
    }
    return Context;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferTimeSubscriber = function (_super) {
    __extends(BufferTimeSubscriber, _super);
    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
    }
    BufferTimeSubscriber.prototype._next = function (value) {
    };
    BufferTimeSubscriber.prototype._error = function (err) {
    };
    BufferTimeSubscriber.prototype._complete = function () {
    };
    BufferTimeSubscriber.prototype._unsubscribe = function () {
    };
    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
    };
    BufferTimeSubscriber.prototype.openContext = function () {
    };
    BufferTimeSubscriber.prototype.closeContext = function (context) {
    };
    return BufferTimeSubscriber;
}(Subscriber_1.Subscriber);
function dispatchBufferTimeSpanOnly(state) {
}
function dispatchBufferCreation(state) {
}
function dispatchBufferClose(arg) {
}    

},{"../Subscriber":14,"../scheduler/async":310,"../util/isScheduler":338}],201:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = require('../Subscription');
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * Buffers the source Observable values starting from an emission from
 * `openings` and ending when the output of `closingSelector` emits.
 *
 * <span class="informal">Collects values from the past as an array. Starts
 * collecting only when `opening` emits, and calls the `closingSelector`
 * function to get an Observable that tells when to close the buffer.</span>
 *
 * <img src="./img/bufferToggle.png" width="100%">
 *
 * Buffers values from the source by opening the buffer via signals from an
 * Observable provided to `openings`, and closing and sending the buffers when
 * a Subscribable or Promise returned by the `closingSelector` function emits.
 *
 * @example <caption>Every other second, emit the click events from the next 500ms</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var openings = Rx.Observable.interval(1000);
 * var buffered = clicks.bufferToggle(openings, i =>
 *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
 * );
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferWhen}
 * @see {@link windowToggle}
 *
 * @param {SubscribableOrPromise<O>} openings A Subscribable or Promise of notifications to start new
 * buffers.
 * @param {function(value: O): SubscribableOrPromise} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns a Subscribable or Promise,
 * which, when it emits, signals that the associated buffer should be emitted
 * and cleared.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferToggle
 * @owner Observable
 */
function bufferToggle(openings, closingSelector) {
}
exports.bufferToggle = bufferToggle;
var BufferToggleOperator = function () {
    function BufferToggleOperator(openings, closingSelector) {
    }
    BufferToggleOperator.prototype.call = function (subscriber, source) {
    };
    return BufferToggleOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferToggleSubscriber = function (_super) {
    __extends(BufferToggleSubscriber, _super);
    function BufferToggleSubscriber(destination, openings, closingSelector) {
    }
    BufferToggleSubscriber.prototype._next = function (value) {
    };
    BufferToggleSubscriber.prototype._error = function (err) {
    };
    BufferToggleSubscriber.prototype._complete = function () {
    };
    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    BufferToggleSubscriber.prototype.openBuffer = function (value) {
    };
    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
    };
    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
    };
    return BufferToggleSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subscription":15,"../util/subscribeToResult":342}],202:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = require('../Subscription');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Buffers the source Observable values, using a factory function of closing
 * Observables to determine when to close, emit, and reset the buffer.
 *
 * <span class="informal">Collects values from the past as an array. When it
 * starts collecting values, it calls a function that returns an Observable that
 * tells when to close the buffer and restart collecting.</span>
 *
 * <img src="./img/bufferWhen.png" width="100%">
 *
 * Opens a buffer immediately, then closes the buffer when the observable
 * returned by calling `closingSelector` function emits a value. When it closes
 * the buffer, it immediately opens a new buffer and repeats the process.
 *
 * @example <caption>Emit an array of the last clicks every [1-5] random seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferWhen(() =>
 *   Rx.Observable.interval(1000 + Math.random() * 4000)
 * );
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link windowWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals buffer closure.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferWhen
 * @owner Observable
 */
function bufferWhen(closingSelector) {
}
exports.bufferWhen = bufferWhen;
var BufferWhenOperator = function () {
    function BufferWhenOperator(closingSelector) {
    }
    BufferWhenOperator.prototype.call = function (subscriber, source) {
    };
    return BufferWhenOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferWhenSubscriber = function (_super) {
    __extends(BufferWhenSubscriber, _super);
    function BufferWhenSubscriber(destination, closingSelector) {
    }
    BufferWhenSubscriber.prototype._next = function (value) {
    };
    BufferWhenSubscriber.prototype._complete = function () {
    };
    BufferWhenSubscriber.prototype._unsubscribe = function () {
    };
    BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    BufferWhenSubscriber.prototype.notifyComplete = function () {
    };
    BufferWhenSubscriber.prototype.openBuffer = function () {
    };
    return BufferWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subscription":15,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],203:[function(require,module,exports){
'use strict';
var Observable_1 = require('../Observable');
var ReplaySubject_1 = require('../ReplaySubject');
/**
 * @param bufferSize
 * @param windowTime
 * @param scheduler
 * @return {Observable<any>}
 * @method cache
 * @owner Observable
 */
function cache(bufferSize, windowTime, scheduler) {
}
exports.cache = cache;    

},{"../Observable":6,"../ReplaySubject":9}],204:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
 * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
 *  is returned by the `selector` will be used to continue the observable chain.
 * @return {Observable} an observable that originates from either the source or the observable returned by the
 *  catch `selector` function.
 * @method catch
 * @owner Observable
 */
function _catch(selector) {
}
exports._catch = _catch;
var CatchOperator = function () {
    function CatchOperator(selector) {
    }
    CatchOperator.prototype.call = function (subscriber, source) {
    };
    return CatchOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CatchSubscriber = function (_super) {
    __extends(CatchSubscriber, _super);
    function CatchSubscriber(destination, selector, caught) {
    }
    // NOTE: overriding `error` instead of `_error` because we don't want
    // to have this flag this subscriber as `isStopped`.
    CatchSubscriber.prototype.error = function (err) {
    };
    return CatchSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],205:[function(require,module,exports){
'use strict';
var combineLatest_1 = require('./combineLatest');
/**
 * Converts a higher-order Observable into a first-order Observable by waiting
 * for the outer Observable to complete, then applying {@link combineLatest}.
 *
 * <span class="informal">Flattens an Observable-of-Observables by applying
 * {@link combineLatest} when the Observable-of-Observables completes.</span>
 *
 * <img src="./img/combineAll.png" width="100%">
 *
 * Takes an Observable of Observables, and collects all Observables from it.
 * Once the outer Observable completes, it subscribes to all collected
 * Observables and combines their values using the {@link combineLatest}
 * strategy, such that:
 * - Every time an inner Observable emits, the output Observable emits.
 * - When the returned observable emits, it emits all of the latest values by:
 *   - If a `project` function is provided, it is called with each recent value
 *     from each inner Observable in whatever order they arrived, and the result
 *     of the `project` function is what is emitted by the output Observable.
 *   - If there is no `project` function, an array of all of the most recent
 *     values is emitted by the output Observable.
 *
 * @example <caption>Map two click events to a finite interval Observable, then apply combineAll</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map(ev =>
 *   Rx.Observable.interval(Math.random()*2000).take(3)
 * ).take(2);
 * var result = higherOrder.combineAll();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineLatest}
 * @see {@link mergeAll}
 *
 * @param {function} [project] An optional function to map the most recent
 * values from each inner Observable into a new result. Takes each of the most
 * recent values from each collected inner Observable as arguments, in order.
 * @return {Observable} An Observable of projected results or arrays of recent
 * values.
 * @method combineAll
 * @owner Observable
 */
function combineAll(project) {
}
exports.combineAll = combineAll;    

},{"./combineLatest":206}],206:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayObservable_1 = require('../observable/ArrayObservable');
var isArray_1 = require('../util/isArray');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
var none = {};
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from this Observable with values from
 * Observables passed as arguments. This is done by subscribing to each
 * Observable, in order, and collecting an array of each of the most recent
 * values any time any of the input Observables emits, then either taking that
 * array and passing it as arguments to an optional `project` function and
 * emitting the return value of that, or just emitting the array of recent
 * values directly if there is no `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = weight.combineLatest(height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method combineLatest
 * @owner Observable
 */
function combineLatest() {
}
exports.combineLatest = combineLatest;
/* tslint:enable:max-line-length */
var CombineLatestOperator = function () {
    function CombineLatestOperator(project) {
        this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new CombineLatestSubscriber(subscriber, this.project));
    };
    return CombineLatestOperator;
}();
exports.CombineLatestOperator = CombineLatestOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CombineLatestSubscriber = function (_super) {
    __extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
        _super.call(this, destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(none);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        } else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
    };
    return CombineLatestSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.CombineLatestSubscriber = CombineLatestSubscriber;    

},{"../OuterSubscriber":8,"../observable/ArrayObservable":146,"../util/isArray":332,"../util/subscribeToResult":342}],207:[function(require,module,exports){
'use strict';
var isScheduler_1 = require('../util/isScheduler');
var ArrayObservable_1 = require('../observable/ArrayObservable');
var mergeAll_1 = require('./mergeAll');
/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins this Observable with multiple other Observables by subscribing to them
 * one at a time, starting with the source, and merging their results into the
 * output Observable. Will wait for each Observable to complete before moving
 * on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = timer.concat(sequence);
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = timer1.concat(timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {Observable} other An input Observable to concatenate after the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @method concat
 * @owner Observable
 */
function concat() {
}
exports.concat = concat;
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins multiple Observables together by subscribing to them one at a time and
 * merging their results into the output Observable. Will wait for each
 * Observable to complete before moving on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = Rx.Observable.concat(timer, sequence);
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = Rx.Observable.concat(timer1, timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {Observable} input1 An input Observable to concatenate with others.
 * @param {Observable} input2 An input Observable to concatenate with others.
 * More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @static true
 * @name concat
 * @owner Observable
 */
function concatStatic() {
}
exports.concatStatic = concatStatic;    

},{"../observable/ArrayObservable":146,"../util/isScheduler":338,"./mergeAll":243}],208:[function(require,module,exports){
'use strict';
var mergeAll_1 = require('./mergeAll');
/**
 * Converts a higher-order Observable into a first-order Observable by
 * concatenating the inner Observables in order.
 *
 * <span class="informal">Flattens an Observable-of-Observables by putting one
 * inner Observable after the other.</span>
 *
 * <img src="./img/concatAll.png" width="100%">
 *
 * Joins every Observable emitted by the source (a higher-order Observable), in
 * a serial fashion. It subscribes to each inner Observable only after the
 * previous inner Observable has completed, and merges all of their values into
 * the returned observable.
 *
 * __Warning:__ If the source Observable emits Observables quickly and
 * endlessly, and the inner Observables it emits generally complete slower than
 * the source emits, you can run into memory issues as the incoming Observables
 * collect in an unbounded buffer.
 *
 * Note: `concatAll` is equivalent to `mergeAll` with concurrency parameter set
 * to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map(ev => Rx.Observable.interval(1000).take(4));
 * var firstOrder = higherOrder.concatAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concat}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 * @see {@link exhaust}
 * @see {@link mergeAll}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @return {Observable} An Observable emitting values from all the inner
 * Observables concatenated.
 * @method concatAll
 * @owner Observable
 */
function concatAll() {
}
exports.concatAll = concatAll;    

},{"./mergeAll":243}],209:[function(require,module,exports){
'use strict';
var mergeMap_1 = require('./mergeMap');
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, in a serialized fashion waiting for each one to complete before
 * merging the next.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link concatAll}.</span>
 *
 * <img src="./img/concatMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each new inner Observable is
 * concatenated with the previous inner Observable.
 *
 * __Warning:__ if source values arrive endlessly and faster than their
 * corresponding inner Observables can complete, it will result in memory issues
 * as inner Observables amass in an unbounded buffer waiting for their turn to
 * be subscribed to.
 *
 * Note: `concatMap` is equivalent to `mergeMap` with concurrency parameter set
 * to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.concatMap(ev => Rx.Observable.interval(1000).take(4));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concat}
 * @see {@link concatAll}
 * @see {@link concatMapTo}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} an observable of values merged from the projected
 * Observables as they were subscribed to, one at a time. Optionally, these
 * values may have been projected from a passed `projectResult` argument.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking values from each projected inner
 * Observable sequentially.
 * @method concatMap
 * @owner Observable
 */
function concatMap(project, resultSelector) {
}
exports.concatMap = concatMap;    

},{"./mergeMap":244}],210:[function(require,module,exports){
'use strict';
var mergeMapTo_1 = require('./mergeMapTo');
/**
 * Projects each source value to the same Observable which is merged multiple
 * times in a serialized fashion on the output Observable.
 *
 * <span class="informal">It's like {@link concatMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * <img src="./img/concatMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. Each new `innerObservable`
 * instance emitted on the output Observable is concatenated with the previous
 * `innerObservable` instance.
 *
 * __Warning:__ if source values arrive endlessly and faster than their
 * corresponding inner Observables can complete, it will result in memory issues
 * as inner Observables amass in an unbounded buffer waiting for their turn to
 * be subscribed to.
 *
 * Note: `concatMapTo` is equivalent to `mergeMapTo` with concurrency parameter
 * set to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.concatMapTo(Rx.Observable.interval(1000).take(4));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concat}
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link mergeMapTo}
 * @see {@link switchMapTo}
 *
 * @param {Observable} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An observable of values merged together by joining the
 * passed observable with itself, one after the other, for each value emitted
 * from the source.
 * @method concatMapTo
 * @owner Observable
 */
function concatMapTo(innerObservable, resultSelector) {
}
exports.concatMapTo = concatMapTo;    

},{"./mergeMapTo":245}],211:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Counts the number of emissions on the source and emits that number when the
 * source completes.
 *
 * <span class="informal">Tells how many values were emitted, when the source
 * completes.</span>
 *
 * <img src="./img/count.png" width="100%">
 *
 * `count` transforms an Observable that emits values into an Observable that
 * emits a single value that represents the number of values emitted by the
 * source Observable. If the source Observable terminates with an error, `count`
 * will pass this error notification along without emitting an value first. If
 * the source Observable does not terminate at all, `count` will neither emit
 * a value nor terminate. This operator takes an optional `predicate` function
 * as argument, in which case the output emission will represent the number of
 * source values that matched `true` with the `predicate`.
 *
 * @example <caption>Counts how many seconds have passed before the first click happened</caption>
 * var seconds = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var secondsBeforeClick = seconds.takeUntil(clicks);
 * var result = secondsBeforeClick.count();
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Counts how many odd numbers are there between 1 and 7</caption>
 * var numbers = Rx.Observable.range(1, 7);
 * var result = numbers.count(i => i % 2 === 1);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link max}
 * @see {@link min}
 * @see {@link reduce}
 *
 * @param {function(value: T, i: number, source: Observable<T>): boolean} [predicate] A
 * boolean function to select what values are to be counted. It is provided with
 * arguments of:
 * - `value`: the value from the source Observable.
 * - `index`: the (zero-based) "index" of the value from the source Observable.
 * - `source`: the source Observable instance itself.
 * @return {Observable} An Observable of one number that represents the count as
 * described above.
 * @method count
 * @owner Observable
 */
function count(predicate) {
}
exports.count = count;
var CountOperator = function () {
    function CountOperator(predicate, source) {
    }
    CountOperator.prototype.call = function (subscriber, source) {
    };
    return CountOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CountSubscriber = function (_super) {
    __extends(CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
    }
    CountSubscriber.prototype._next = function (value) {
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
    };
    CountSubscriber.prototype._complete = function () {
    };
    return CountSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],212:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Emits a value from the source Observable only after a particular time span
 * determined by another Observable has passed without another source emission.
 *
 * <span class="informal">It's like {@link debounceTime}, but the time span of
 * emission silence is determined by a second Observable.</span>
 *
 * <img src="./img/debounce.png" width="100%">
 *
 * `debounce` delays values emitted by the source Observable, but drops previous
 * pending delayed emissions if a new value arrives on the source Observable.
 * This operator keeps track of the most recent value from the source
 * Observable, and spawns a duration Observable by calling the
 * `durationSelector` function. The value is emitted only when the duration
 * Observable emits a value or completes, and if no other value was emitted on
 * the source Observable since the duration Observable was spawned. If a new
 * value appears before the duration Observable emits, the previous value will
 * be dropped and will not be emitted on the output Observable.
 *
 * Like {@link debounceTime}, this is a rate-limiting operator, and also a
 * delay-like operator since output emissions do not necessarily occur at the
 * same time as they did on the source Observable.
 *
 * @example <caption>Emit the most recent click after a burst of clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.debounce(() => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delayWhen}
 * @see {@link throttle}
 *
 * @param {function(value: T): Observable|Promise} durationSelector A function
 * that receives a value from the source Observable, for computing the timeout
 * duration for each source value, returned as an Observable or a Promise.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified duration Observable returned by
 * `durationSelector`, and may drop some values if they occur too frequently.
 * @method debounce
 * @owner Observable
 */
function debounce(durationSelector) {
}
exports.debounce = debounce;
var DebounceOperator = function () {
    function DebounceOperator(durationSelector) {
    }
    DebounceOperator.prototype.call = function (subscriber, source) {
    };
    return DebounceOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DebounceSubscriber = function (_super) {
    __extends(DebounceSubscriber, _super);
    function DebounceSubscriber(destination, durationSelector) {
    }
    DebounceSubscriber.prototype._next = function (value) {
    };
    DebounceSubscriber.prototype._complete = function () {
    };
    DebounceSubscriber.prototype._tryNext = function (value, duration) {
    };
    DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    DebounceSubscriber.prototype.notifyComplete = function () {
    };
    DebounceSubscriber.prototype.emitValue = function () {
    };
    return DebounceSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],213:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var async_1 = require('../scheduler/async');
/**
 * Emits a value from the source Observable only after a particular time span
 * has passed without another source emission.
 *
 * <span class="informal">It's like {@link delay}, but passes only the most
 * recent value from each burst of emissions.</span>
 *
 * <img src="./img/debounceTime.png" width="100%">
 *
 * `debounceTime` delays values emitted by the source Observable, but drops
 * previous pending delayed emissions if a new value arrives on the source
 * Observable. This operator keeps track of the most recent value from the
 * source Observable, and emits that only when `dueTime` enough time has passed
 * without any other value appearing on the source Observable. If a new value
 * appears before `dueTime` silence occurs, the previous value will be dropped
 * and will not be emitted on the output Observable.
 *
 * This is a rate-limiting operator, because it is impossible for more than one
 * value to be emitted in any time window of duration `dueTime`, but it is also
 * a delay-like operator since output emissions do not occur at the same time as
 * they did on the source Observable. Optionally takes a {@link Scheduler} for
 * managing timers.
 *
 * @example <caption>Emit the most recent click after a burst of clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.debounceTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} dueTime The timeout duration in milliseconds (or the time
 * unit determined internally by the optional `scheduler`) for the window of
 * time required to wait for emission silence before emitting the most recent
 * source value.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the timeout for each value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified `dueTime`, and may drop some values if they occur
 * too frequently.
 * @method debounceTime
 * @owner Observable
 */
function debounceTime(dueTime, scheduler) {
}
exports.debounceTime = debounceTime;
var DebounceTimeOperator = function () {
    function DebounceTimeOperator(dueTime, scheduler) {
    }
    DebounceTimeOperator.prototype.call = function (subscriber, source) {
    };
    return DebounceTimeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DebounceTimeSubscriber = function (_super) {
    __extends(DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
    };
    DebounceTimeSubscriber.prototype._complete = function () {
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
    };
    return DebounceTimeSubscriber;
}(Subscriber_1.Subscriber);
function dispatchNext(subscriber) {
}    

},{"../Subscriber":14,"../scheduler/async":310}],214:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Emits a given value if the source Observable completes without emitting any
 * `next` value, otherwise mirrors the source Observable.
 *
 * <span class="informal">If the source Observable turns out to be empty, then
 * this operator will emit a default value.</span>
 *
 * <img src="./img/defaultIfEmpty.png" width="100%">
 *
 * `defaultIfEmpty` emits the values emitted by the source Observable or a
 * specified default value if the source Observable is empty (completes without
 * having emitted any `next` value).
 *
 * @example <caption>If no clicks happen in 5 seconds, then emit "no clicks"</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var clicksBeforeFive = clicks.takeUntil(Rx.Observable.interval(5000));
 * var result = clicksBeforeFive.defaultIfEmpty('no clicks');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link empty}
 * @see {@link last}
 *
 * @param {any} [defaultValue=null] The default value used if the source
 * Observable is empty.
 * @return {Observable} An Observable that emits either the specified
 * `defaultValue` if the source Observable emits no items, or the values emitted
 * by the source Observable.
 * @method defaultIfEmpty
 * @owner Observable
 */
function defaultIfEmpty(defaultValue) {
}
exports.defaultIfEmpty = defaultIfEmpty;
var DefaultIfEmptyOperator = function () {
    function DefaultIfEmptyOperator(defaultValue) {
    }
    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
    };
    return DefaultIfEmptyOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DefaultIfEmptySubscriber = function (_super) {
    __extends(DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
    };
    return DefaultIfEmptySubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],215:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var async_1 = require('../scheduler/async');
var isDate_1 = require('../util/isDate');
var Subscriber_1 = require('../Subscriber');
var Notification_1 = require('../Notification');
/**
 * Delays the emission of items from the source Observable by a given timeout or
 * until a given Date.
 *
 * <span class="informal">Time shifts each item by some specified amount of
 * milliseconds.</span>
 *
 * <img src="./img/delay.png" width="100%">
 *
 * If the delay argument is a Number, this operator time shifts the source
 * Observable by that amount of time expressed in milliseconds. The relative
 * time intervals between the values are preserved.
 *
 * If the delay argument is a Date, this operator time shifts the start of the
 * Observable execution until the given date occurs.
 *
 * @example <caption>Delay each click by one second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var delayedClicks = clicks.delay(1000); // each click emitted after 1 second
 * delayedClicks.subscribe(x => console.log(x));
 *
 * @example <caption>Delay all clicks until a future date happens</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var date = new Date('March 15, 2050 12:00:00'); // in the future
 * var delayedClicks = clicks.delay(date); // click emitted only after that date
 * delayedClicks.subscribe(x => console.log(x));
 *
 * @see {@link debounceTime}
 * @see {@link delayWhen}
 *
 * @param {number|Date} delay The delay duration in milliseconds (a `number`) or
 * a `Date` until which the emission of the source items is delayed.
 * @param {Scheduler} [scheduler=async] The Scheduler to use for
 * managing the timers that handle the time-shift for each item.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified timeout or Date.
 * @method delay
 * @owner Observable
 */
function delay(delay, scheduler) {
}
exports.delay = delay;
var DelayOperator = function () {
    function DelayOperator(delay, scheduler) {
    }
    DelayOperator.prototype.call = function (subscriber, source) {
    };
    return DelayOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DelaySubscriber = function (_super) {
    __extends(DelaySubscriber, _super);
    function DelaySubscriber(destination, delay, scheduler) {
    }
    DelaySubscriber.dispatch = function (state) {
    };
    DelaySubscriber.prototype._schedule = function (scheduler) {
    };
    DelaySubscriber.prototype.scheduleNotification = function (notification) {
    };
    DelaySubscriber.prototype._next = function (value) {
    };
    DelaySubscriber.prototype._error = function (err) {
    };
    DelaySubscriber.prototype._complete = function () {
    };
    return DelaySubscriber;
}(Subscriber_1.Subscriber);
var DelayMessage = function () {
    function DelayMessage(time, notification) {
    }
    return DelayMessage;
}();    

},{"../Notification":5,"../Subscriber":14,"../scheduler/async":310,"../util/isDate":333}],216:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Observable_1 = require('../Observable');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Delays the emission of items from the source Observable by a given time span
 * determined by the emissions of another Observable.
 *
 * <span class="informal">It's like {@link delay}, but the time span of the
 * delay duration is determined by a second Observable.</span>
 *
 * <img src="./img/delayWhen.png" width="100%">
 *
 * `delayWhen` time shifts each emitted value from the source Observable by a
 * time span determined by another Observable. When the source emits a value,
 * the `delayDurationSelector` function is called with the source value as
 * argument, and should return an Observable, called the "duration" Observable.
 * The source value is emitted on the output Observable only when the duration
 * Observable emits a value or completes.
 *
 * Optionally, `delayWhen` takes a second argument, `subscriptionDelay`, which
 * is an Observable. When `subscriptionDelay` emits its first value or
 * completes, the source Observable is subscribed to and starts behaving like
 * described in the previous paragraph. If `subscriptionDelay` is not provided,
 * `delayWhen` will subscribe to the source Observable as soon as the output
 * Observable is subscribed.
 *
 * @example <caption>Delay each click by a random amount of time, between 0 and 5 seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var delayedClicks = clicks.delayWhen(event =>
 *   Rx.Observable.interval(Math.random() * 5000)
 * );
 * delayedClicks.subscribe(x => console.log(x));
 *
 * @see {@link debounce}
 * @see {@link delay}
 *
 * @param {function(value: T): Observable} delayDurationSelector A function that
 * returns an Observable for each value emitted by the source Observable, which
 * is then used to delay the emission of that item on the output Observable
 * until the Observable returned from this function emits a value.
 * @param {Observable} subscriptionDelay An Observable that triggers the
 * subscription to the source Observable once it emits any value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by an amount of time specified by the Observable returned by
 * `delayDurationSelector`.
 * @method delayWhen
 * @owner Observable
 */
function delayWhen(delayDurationSelector, subscriptionDelay) {
}
exports.delayWhen = delayWhen;
var DelayWhenOperator = function () {
    function DelayWhenOperator(delayDurationSelector) {
    }
    DelayWhenOperator.prototype.call = function (subscriber, source) {
    };
    return DelayWhenOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DelayWhenSubscriber = function (_super) {
    __extends(DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    DelayWhenSubscriber.prototype._next = function (value) {
    };
    DelayWhenSubscriber.prototype._complete = function () {
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
    };
    return DelayWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelayObservable = function (_super) {
    __extends(SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(source, subscriptionDelay) {
    }
    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
    };
    return SubscriptionDelayObservable;
}(Observable_1.Observable);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelaySubscriber = function (_super) {
    __extends(SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
    };
    return SubscriptionDelaySubscriber;
}(Subscriber_1.Subscriber);    

},{"../Observable":6,"../OuterSubscriber":8,"../Subscriber":14,"../util/subscribeToResult":342}],217:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Converts an Observable of {@link Notification} objects into the emissions
 * that they represent.
 *
 * <span class="informal">Unwraps {@link Notification} objects as actual `next`,
 * `error` and `complete` emissions. The opposite of {@link materialize}.</span>
 *
 * <img src="./img/dematerialize.png" width="100%">
 *
 * `dematerialize` is assumed to operate an Observable that only emits
 * {@link Notification} objects as `next` emissions, and does not emit any
 * `error`. Such Observable is the output of a `materialize` operation. Those
 * notifications are then unwrapped using the metadata they contain, and emitted
 * as `next`, `error`, and `complete` on the output Observable.
 *
 * Use this operator in conjunction with {@link materialize}.
 *
 * @example <caption>Convert an Observable of Notifications to an actual Observable</caption>
 * var notifA = new Rx.Notification('N', 'A');
 * var notifB = new Rx.Notification('N', 'B');
 * var notifE = new Rx.Notification('E', void 0,
 *   new TypeError('x.toUpperCase is not a function')
 * );
 * var materialized = Rx.Observable.of(notifA, notifB, notifE);
 * var upperCase = materialized.dematerialize();
 * upperCase.subscribe(x => console.log(x), e => console.error(e));
 *
 * @see {@link Notification}
 * @see {@link materialize}
 *
 * @return {Observable} An Observable that emits items and notifications
 * embedded in Notification objects emitted by the source Observable.
 * @method dematerialize
 * @owner Observable
 */
function dematerialize() {
}
exports.dematerialize = dematerialize;
var DeMaterializeOperator = function () {
    function DeMaterializeOperator() {
    }
    DeMaterializeOperator.prototype.call = function (subscriber, source) {
    };
    return DeMaterializeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DeMaterializeSubscriber = function (_super) {
    __extends(DeMaterializeSubscriber, _super);
    function DeMaterializeSubscriber(destination) {
    }
    DeMaterializeSubscriber.prototype._next = function (value) {
    };
    return DeMaterializeSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],218:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
 * An optional parameter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinct
 * @owner Observable
 */
function distinct(compare, flushes) {
}
exports.distinct = distinct;
var DistinctOperator = function () {
    function DistinctOperator(compare, flushes) {
    }
    DistinctOperator.prototype.call = function (subscriber, source) {
    };
    return DistinctOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DistinctSubscriber = function (_super) {
    __extends(DistinctSubscriber, _super);
    function DistinctSubscriber(destination, compare, flushes) {
    }
    DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
    };
    DistinctSubscriber.prototype._next = function (value) {
    };
    DistinctSubscriber.prototype.compare = function (x, y) {
    };
    return DistinctSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.DistinctSubscriber = DistinctSubscriber;    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],219:[function(require,module,exports){
'use strict';
var distinct_1 = require('./distinct');
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items,
 * using a property accessed by using the key provided to check if the two items are distinct.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
 * An optional parameter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
 * @param {string} key string key for object property lookup on each item.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinctKey
 * @owner Observable
 */
function distinctKey(key, compare, flushes) {
}
exports.distinctKey = distinctKey;    

},{"./distinct":218}],220:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinctUntilChanged
 * @owner Observable
 */
function distinctUntilChanged(compare, keySelector) {
}
exports.distinctUntilChanged = distinctUntilChanged;
var DistinctUntilChangedOperator = function () {
    function DistinctUntilChangedOperator(compare, keySelector) {
    }
    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
    };
    return DistinctUntilChangedOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DistinctUntilChangedSubscriber = function (_super) {
    __extends(DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
    };
    return DistinctUntilChangedSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../util/errorObject":331,"../util/tryCatch":344}],221:[function(require,module,exports){
'use strict';
var distinctUntilChanged_1 = require('./distinctUntilChanged');
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item,
 * using a property accessed by using the key provided to check if the two items are distinct.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * @param {string} key string key for object property lookup on each item.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values based on the key specified.
 * @method distinctUntilKeyChanged
 * @owner Observable
 */
function distinctUntilKeyChanged(key, compare) {
}
exports.distinctUntilKeyChanged = distinctUntilKeyChanged;    

},{"./distinctUntilChanged":220}],222:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Perform a side effect for every emission on the source Observable, but return
 * an Observable that is identical to the source.
 *
 * <span class="informal">Intercepts each emission on the source and runs a
 * function, but returns an output which is identical to the source.</span>
 *
 * <img src="./img/do.png" width="100%">
 *
 * Returns a mirrored Observable of the source Observable, but modified so that
 * the provided Observer is called to perform a side effect for every value,
 * error, and completion emitted by the source. Any errors that are thrown in
 * the aforementioned Observer or handlers are safely sent down the error path
 * of the output Observable.
 *
 * This operator is useful for debugging your Observables for the correct values
 * or performing other side effects.
 *
 * Note: this is different to a `subscribe` on the Observable. If the Observable
 * returned by `do` is not subscribed, the side effects specified by the
 * Observer will never happen. `do` therefore simply spies on existing
 * execution, it does not trigger an execution to happen like `subscribe` does.
 *
 * @example <caption>Map every every click to the clientX position of that click, while also logging the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks
 *   .do(ev => console.log(ev))
 *   .map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link map}
 * @see {@link subscribe}
 *
 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
 * callback for `next`.
 * @param {function} [error] Callback for errors in the source.
 * @param {function} [complete] Callback for the completion of the source.
 * @return {Observable} An Observable identical to the source, but runs the
 * specified Observer or callback(s) for each item.
 * @method do
 * @name do
 * @owner Observable
 */
function _do(nextOrObserver, error, complete) {
}
exports._do = _do;
var DoOperator = function () {
    function DoOperator(nextOrObserver, error, complete) {
    }
    DoOperator.prototype.call = function (subscriber, source) {
    };
    return DoOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DoSubscriber = function (_super) {
    __extends(DoSubscriber, _super);
    function DoSubscriber(destination, nextOrObserver, error, complete) {
    }
    DoSubscriber.prototype._next = function (value) {
    };
    DoSubscriber.prototype._error = function (err) {
    };
    DoSubscriber.prototype._complete = function () {
    };
    return DoSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],223:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
/**
 * Emits the single value at the specified `index` in a sequence of emissions
 * from the source Observable.
 *
 * <span class="informal">Emits only the i-th value, then completes.</span>
 *
 * <img src="./img/elementAt.png" width="100%">
 *
 * `elementAt` returns an Observable that emits the item at the specified
 * `index` in the source Observable, or a default value if that `index` is out
 * of range and the `default` argument is provided. If the `default` argument is
 * not given and the `index` is out of range, the output Observable will emit an
 * `ArgumentOutOfRangeError` error.
 *
 * @example <caption>Emit only the third click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.elementAt(2);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link skip}
 * @see {@link single}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `elementAt(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0` or the
 * Observable has completed before emitting the i-th `next` notification.
 *
 * @param {number} index Is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {T} [defaultValue] The default value returned for missing indices.
 * @return {Observable} An Observable that emits a single item, if it is found.
 * Otherwise, will emit the default value if given. If not, then emits an error.
 * @method elementAt
 * @owner Observable
 */
function elementAt(index, defaultValue) {
}
exports.elementAt = elementAt;
var ElementAtOperator = function () {
    function ElementAtOperator(index, defaultValue) {
    }
    ElementAtOperator.prototype.call = function (subscriber, source) {
    };
    return ElementAtOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ElementAtSubscriber = function (_super) {
    __extends(ElementAtSubscriber, _super);
    function ElementAtSubscriber(destination, index, defaultValue) {
    }
    ElementAtSubscriber.prototype._next = function (x) {
    };
    ElementAtSubscriber.prototype._complete = function () {
    };
    return ElementAtSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../util/ArgumentOutOfRangeError":321}],224:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that emits whether or not every item of the source satisfies the condition specified.
 * @param {function} predicate a function for determining if an item meets a specified condition.
 * @param {any} [thisArg] optional object to use for `this` in the callback
 * @return {Observable} an Observable of booleans that determines if all items of the source Observable meet the condition specified.
 * @method every
 * @owner Observable
 */
function every(predicate, thisArg) {
}
exports.every = every;
var EveryOperator = function () {
    function EveryOperator(predicate, thisArg, source) {
    }
    EveryOperator.prototype.call = function (observer, source) {
    };
    return EveryOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var EverySubscriber = function (_super) {
    __extends(EverySubscriber, _super);
    function EverySubscriber(destination, predicate, thisArg, source) {
    }
    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
    };
    EverySubscriber.prototype._next = function (value) {
    };
    EverySubscriber.prototype._complete = function () {
    };
    return EverySubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],225:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Converts a higher-order Observable into a first-order Observable by dropping
 * inner Observables while the previous inner Observable has not yet completed.
 *
 * <span class="informal">Flattens an Observable-of-Observables by dropping the
 * next inner Observables while the current inner is still executing.</span>
 *
 * <img src="./img/exhaust.png" width="100%">
 *
 * `exhaust` subscribes to an Observable that emits Observables, also known as a
 * higher-order Observable. Each time it observes one of these emitted inner
 * Observables, the output Observable begins emitting the items emitted by that
 * inner Observable. So far, it behaves like {@link mergeAll}. However,
 * `exhaust` ignores every new inner Observable if the previous Observable has
 * not yet completed. Once that one completes, it will accept and flatten the
 * next inner Observable and repeat this process.
 *
 * @example <caption>Run a finite timer for each click, only if there is no currently active timer</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var result = higherOrder.exhaust();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link switch}
 * @see {@link mergeAll}
 * @see {@link exhaustMap}
 * @see {@link zipAll}
 *
 * @return {Observable} Returns an Observable that takes a source of Observables
 * and propagates the first observable exclusively until it completes before
 * subscribing to the next.
 * @method exhaust
 * @owner Observable
 */
function exhaust() {
}
exports.exhaust = exhaust;
var SwitchFirstOperator = function () {
    function SwitchFirstOperator() {
    }
    SwitchFirstOperator.prototype.call = function (subscriber, source) {
    };
    return SwitchFirstOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchFirstSubscriber = function (_super) {
    __extends(SwitchFirstSubscriber, _super);
    function SwitchFirstSubscriber(destination) {
    }
    SwitchFirstSubscriber.prototype._next = function (value) {
    };
    SwitchFirstSubscriber.prototype._complete = function () {
    };
    SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return SwitchFirstSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],226:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable only if the previous projected Observable has completed.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link exhaust}.</span>
 *
 * <img src="./img/exhaustMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. When it projects a source value to
 * an Observable, the output Observable begins emitting the items emitted by
 * that projected Observable. However, `exhaustMap` ignores every new projected
 * Observable if the previous projected Observable has not yet completed. Once
 * that one completes, it will accept and flatten the next projected Observable
 * and repeat this process.
 *
 * @example <caption>Run a finite timer for each click, only if there is no currently active timer</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.exhaustMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaust}
 * @see {@link mergeMap}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable containing projected Observables
 * of each item of the source, ignoring projected Observables that start before
 * their preceding Observable has completed.
 * @method exhaustMap
 * @owner Observable
 */
function exhaustMap(project, resultSelector) {
}
exports.exhaustMap = exhaustMap;
var SwitchFirstMapOperator = function () {
    function SwitchFirstMapOperator(project, resultSelector) {
    }
    SwitchFirstMapOperator.prototype.call = function (subscriber, source) {
    };
    return SwitchFirstMapOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchFirstMapSubscriber = function (_super) {
    __extends(SwitchFirstMapSubscriber, _super);
    function SwitchFirstMapSubscriber(destination, project, resultSelector) {
    }
    SwitchFirstMapSubscriber.prototype._next = function (value) {
    };
    SwitchFirstMapSubscriber.prototype.tryNext = function (value) {
    };
    SwitchFirstMapSubscriber.prototype._complete = function () {
    };
    SwitchFirstMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    SwitchFirstMapSubscriber.prototype.trySelectResult = function (outerValue, innerValue, outerIndex, innerIndex) {
    };
    SwitchFirstMapSubscriber.prototype.notifyError = function (err) {
    };
    SwitchFirstMapSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return SwitchFirstMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],227:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Recursively projects each source value to an Observable which is merged in
 * the output Observable.
 *
 * <span class="informal">It's similar to {@link mergeMap}, but applies the
 * projection function to every source value as well as every output value.
 * It's recursive.</span>
 *
 * <img src="./img/expand.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger. *Expand* will re-emit on the output
 * Observable every source value. Then, each output value is given to the
 * `project` function which returns an inner Observable to be merged on the
 * output Observable. Those output values resulting from the projection are also
 * given to the `project` function to produce new output values. This is how
 * *expand* behaves recursively.
 *
 * @example <caption>Start emitting the powers of two on every click, at most 10 of them</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var powersOfTwo = clicks
 *   .mapTo(1)
 *   .expand(x => Rx.Observable.of(2 * x).delay(1000))
 *   .take(10);
 * powersOfTwo.subscribe(x => console.log(x));
 *
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 *
 * @param {function(value: T, index: number) => Observable} project A function
 * that, when applied to an item emitted by the source or the output Observable,
 * returns an Observable.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for subscribing to
 * each projected inner Observable.
 * @return {Observable} An Observable that emits the source values and also
 * result of applying the projection function to each value emitted on the
 * output Observable and and merging the results of the Observables obtained
 * from this transformation.
 * @method expand
 * @owner Observable
 */
function expand(project, concurrent, scheduler) {
}
exports.expand = expand;
var ExpandOperator = function () {
    function ExpandOperator(project, concurrent, scheduler) {
    }
    ExpandOperator.prototype.call = function (subscriber, source) {
    };
    return ExpandOperator;
}();
exports.ExpandOperator = ExpandOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ExpandSubscriber = function (_super) {
    __extends(ExpandSubscriber, _super);
    function ExpandSubscriber(destination, project, concurrent, scheduler) {
    }
    ExpandSubscriber.dispatch = function (arg) {
    };
    ExpandSubscriber.prototype._next = function (value) {
    };
    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
    };
    ExpandSubscriber.prototype._complete = function () {
    };
    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return ExpandSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.ExpandSubscriber = ExpandSubscriber;    

},{"../OuterSubscriber":8,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],228:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Filter items emitted by the source Observable by only emitting those that
 * satisfy a specified predicate.
 *
 * <span class="informal">Like
 * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
 * it only emits a value from the source if it passes a criterion function.</span>
 *
 * <img src="./img/filter.png" width="100%">
 *
 * Similar to the well-known `Array.prototype.filter` method, this operator
 * takes values from the source Observable, passes them through a `predicate`
 * function and only emits those values that yielded `true`.
 *
 * @example <caption>Emit only click events whose target was a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV');
 * clicksOnDivs.subscribe(x => console.log(x));
 *
 * @see {@link distinct}
 * @see {@link distinctKey}
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 * @see {@link ignoreElements}
 * @see {@link partition}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted, if `false` the value is not passed to the output
 * Observable. The `index` parameter is the number `i` for the i-th source
 * emission that has happened since the subscription, starting from the number
 * `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of values from the source that were
 * allowed by the `predicate` function.
 * @method filter
 * @owner Observable
 */
function filter(predicate, thisArg) {
}
exports.filter = filter;
var FilterOperator = function () {
    function FilterOperator(predicate, thisArg) {
    }
    FilterOperator.prototype.call = function (subscriber, source) {
    };
    return FilterOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FilterSubscriber = function (_super) {
    __extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
    }
    // the try catch block below is left specifically for
    // optimization and perf reasons. a tryCatcher is not necessary here.
    FilterSubscriber.prototype._next = function (value) {
    };
    return FilterSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],229:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
/**
 * Returns an Observable that mirrors the source Observable, but will call a specified function when
 * the source terminates on complete or error.
 * @param {function} callback function to be called when source terminates.
 * @return {Observable} an Observable that mirrors the source, but will call the specified function on termination.
 * @method finally
 * @owner Observable
 */
function _finally(callback) {
}
exports._finally = _finally;
var FinallyOperator = function () {
    function FinallyOperator(callback) {
    }
    FinallyOperator.prototype.call = function (subscriber, source) {
    };
    return FinallyOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FinallySubscriber = function (_super) {
    __extends(FinallySubscriber, _super);
    function FinallySubscriber(destination, callback) {
    }
    return FinallySubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../Subscription":15}],230:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Emits only the first value emitted by the source Observable that meets some
 * condition.
 *
 * <span class="informal">Finds the first value that passes some test and emits
 * that.</span>
 *
 * <img src="./img/find.png" width="100%">
 *
 * `find` searches for the first item in the source Observable that matches the
 * specified condition embodied by the `predicate`, and returns the first
 * occurrence in the source. Unlike {@link first}, the `predicate` is required
 * in `find`, and does not emit an error if a valid value is not found.
 *
 * @example <caption>Find and emit the first click that happens on a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.find(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link first}
 * @see {@link findIndex}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable<T>} An Observable of the first item that matches the
 * condition.
 * @method find
 * @owner Observable
 */
function find(predicate, thisArg) {
}
exports.find = find;
var FindValueOperator = function () {
    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
    }
    FindValueOperator.prototype.call = function (observer, source) {
    };
    return FindValueOperator;
}();
exports.FindValueOperator = FindValueOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FindValueSubscriber = function (_super) {
    __extends(FindValueSubscriber, _super);
    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
    }
    FindValueSubscriber.prototype.notifyComplete = function (value) {
    };
    FindValueSubscriber.prototype._next = function (value) {
    };
    FindValueSubscriber.prototype._complete = function () {
    };
    return FindValueSubscriber;
}(Subscriber_1.Subscriber);
exports.FindValueSubscriber = FindValueSubscriber;    

},{"../Subscriber":14}],231:[function(require,module,exports){
'use strict';
var find_1 = require('./find');
/**
 * Emits only the index of the first value emitted by the source Observable that
 * meets some condition.
 *
 * <span class="informal">It's like {@link find}, but emits the index of the
 * found value, not the value itself.</span>
 *
 * <img src="./img/findIndex.png" width="100%">
 *
 * `findIndex` searches for the first item in the source Observable that matches
 * the specified condition embodied by the `predicate`, and returns the
 * (zero-based) index of the first occurrence in the source. Unlike
 * {@link first}, the `predicate` is required in `findIndex`, and does not emit
 * an error if a valid value is not found.
 *
 * @example <caption>Emit the index of first click that happens on a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.findIndex(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link find}
 * @see {@link first}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of the index of the first item that
 * matches the condition.
 * @method find
 * @owner Observable
 */
function findIndex(predicate, thisArg) {
}
exports.findIndex = findIndex;    

},{"./find":230}],232:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyError_1 = require('../util/EmptyError');
/**
 * Emits only the first value (or the first value that meets some condition)
 * emitted by the source Observable.
 *
 * <span class="informal">Emits only the first value. Or emits only the first
 * value that passes some test.</span>
 *
 * <img src="./img/first.png" width="100%">
 *
 * If called with no arguments, `first` emits the first value of the source
 * Observable, then completes. If called with a `predicate` function, `first`
 * emits the first value of the source that matches the specified condition. It
 * may also take a `resultSelector` function to produce the output value from
 * the input value, and a `defaultValue` to emit in case the source completes
 * before it is able to emit a valid value. Throws an error if `defaultValue`
 * was not provided and a matching element is not found.
 *
 * @example <caption>Emit only the first click that happens on the DOM</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.first();
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Emits the first click that happens on a DIV</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.first(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link find}
 * @see {@link take}
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} [predicate]
 * An optional function called with each item to test for condition matching.
 * @param {function(value: T, index: number): R} [resultSelector] A function to
 * produce the value on the output Observable based on the values
 * and the indices of the source Observable. The arguments passed to this
 * function are:
 * - `value`: the value that was emitted on the source.
 * - `index`: the "index" of the value from the source.
 * @param {R} [defaultValue] The default value emitted in case no valid value
 * was found on the source.
 * @return {Observable<T|R>} an Observable of the first item that matches the
 * condition.
 * @method first
 * @owner Observable
 */
function first(predicate, resultSelector, defaultValue) {
}
exports.first = first;
var FirstOperator = function () {
    function FirstOperator(predicate, resultSelector, defaultValue, source) {
    }
    FirstOperator.prototype.call = function (observer, source) {
    };
    return FirstOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FirstSubscriber = function (_super) {
    __extends(FirstSubscriber, _super);
    function FirstSubscriber(destination, predicate, resultSelector, defaultValue, source) {
    }
    FirstSubscriber.prototype._next = function (value) {
    };
    FirstSubscriber.prototype._tryPredicate = function (value, index) {
    };
    FirstSubscriber.prototype._emit = function (value, index) {
    };
    FirstSubscriber.prototype._tryResultSelector = function (value, index) {
    };
    FirstSubscriber.prototype._emitFinal = function (value) {
    };
    FirstSubscriber.prototype._complete = function () {
    };
    return FirstSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../util/EmptyError":322}],233:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
var Observable_1 = require('../Observable');
var Subject_1 = require('../Subject');
var Map_1 = require('../util/Map');
var FastMap_1 = require('../util/FastMap');
/**
 * Groups the items emitted by an Observable according to a specified criterion,
 * and emits these grouped items as `GroupedObservables`, one
 * {@link GroupedObservable} per group.
 *
 * <img src="./img/groupBy.png" width="100%">
 *
 * @param {function(value: T): K} keySelector a function that extracts the key
 * for each item.
 * @param {function(value: T): R} [elementSelector] a function that extracts the
 * return element for each item.
 * @param {function(grouped: GroupedObservable<K,R>): Observable<any>} [durationSelector]
 * a function that returns an Observable to determine how long each group should
 * exist.
 * @return {Observable<GroupedObservable<K,R>>} an Observable that emits
 * GroupedObservables, each of which corresponds to a unique key value and each
 * of which emits those items from the source Observable that share that key
 * value.
 * @method groupBy
 * @owner Observable
 */
function groupBy(keySelector, elementSelector, durationSelector) {
}
exports.groupBy = groupBy;
var GroupByOperator = function () {
    function GroupByOperator(source, keySelector, elementSelector, durationSelector) {
    }
    GroupByOperator.prototype.call = function (subscriber, source) {
    };
    return GroupByOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupBySubscriber = function (_super) {
    __extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector) {
    }
    GroupBySubscriber.prototype._next = function (value) {
    };
    GroupBySubscriber.prototype._group = function (value, key) {
    };
    GroupBySubscriber.prototype._error = function (err) {
    };
    GroupBySubscriber.prototype._complete = function () {
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
    };
    return GroupBySubscriber;
}(Subscriber_1.Subscriber);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var GroupDurationSubscriber = function (_super) {
    __extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
    }
    GroupDurationSubscriber.prototype._next = function (value) {
    };
    GroupDurationSubscriber.prototype._error = function (err) {
    };
    GroupDurationSubscriber.prototype._complete = function () {
    };
    return GroupDurationSubscriber;
}(Subscriber_1.Subscriber);
/**
 * An Observable representing values belonging to the same group represented by
 * a common key. The values emitted by a GroupedObservable come from the source
 * Observable. The common key is available as the field `key` on a
 * GroupedObservable instance.
 *
 * @class GroupedObservable<K, T>
 */
var GroupedObservable = function (_super) {
    __extends(GroupedObservable, _super);
    function GroupedObservable(key, groupSubject, refCountSubscription) {
    }
    GroupedObservable.prototype._subscribe = function (subscriber) {
    };
    return GroupedObservable;
}(Observable_1.Observable);
exports.GroupedObservable = GroupedObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerRefCountSubscription = function (_super) {
    __extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
    };
    return InnerRefCountSubscription;
}(Subscription_1.Subscription);    

},{"../Observable":6,"../Subject":12,"../Subscriber":14,"../Subscription":15,"../util/FastMap":323,"../util/Map":325}],234:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var noop_1 = require('../util/noop');
/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * <img src="./img/ignoreElements.png" width="100%">
 *
 * @return {Observable} an empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 * @method ignoreElements
 * @owner Observable
 */
function ignoreElements() {
}
exports.ignoreElements = ignoreElements;
;
var IgnoreElementsOperator = function () {
    function IgnoreElementsOperator() {
    }
    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
    };
    return IgnoreElementsOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var IgnoreElementsSubscriber = function (_super) {
    __extends(IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
    };
    return IgnoreElementsSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../util/noop":339}],235:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * If the source Observable is empty it returns an Observable that emits true, otherwise it emits false.
 *
 * <img src="./img/isEmpty.png" width="100%">
 *
 * @return {Observable} an Observable that emits a Boolean.
 * @method isEmpty
 * @owner Observable
 */
function isEmpty() {
}
exports.isEmpty = isEmpty;
var IsEmptyOperator = function () {
    function IsEmptyOperator() {
    }
    IsEmptyOperator.prototype.call = function (observer, source) {
    };
    return IsEmptyOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var IsEmptySubscriber = function (_super) {
    __extends(IsEmptySubscriber, _super);
    function IsEmptySubscriber(destination) {
    }
    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
    };
    IsEmptySubscriber.prototype._next = function (value) {
    };
    IsEmptySubscriber.prototype._complete = function () {
    };
    return IsEmptySubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],236:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyError_1 = require('../util/EmptyError');
/**
 * Returns an Observable that emits only the last item emitted by the source Observable.
 * It optionally takes a predicate function as a parameter, in which case, rather than emitting
 * the last item from the source Observable, the resulting Observable will emit the last item
 * from the source Observable that satisfies the predicate.
 *
 * <img src="./img/last.png" width="100%">
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {function} predicate - the condition any source emitted item has to satisfy.
 * @return {Observable} an Observable that emits only the last item satisfying the given condition
 * from the source, or an NoSuchElementException if no such items are emitted.
 * @throws - Throws if no items that match the predicate are emitted by the source Observable.
 * @method last
 * @owner Observable
 */
function last(predicate, resultSelector, defaultValue) {
}
exports.last = last;
var LastOperator = function () {
    function LastOperator(predicate, resultSelector, defaultValue, source) {
    }
    LastOperator.prototype.call = function (observer, source) {
    };
    return LastOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var LastSubscriber = function (_super) {
    __extends(LastSubscriber, _super);
    function LastSubscriber(destination, predicate, resultSelector, defaultValue, source) {
    }
    LastSubscriber.prototype._next = function (value) {
    };
    LastSubscriber.prototype._tryPredicate = function (value, index) {
    };
    LastSubscriber.prototype._tryResultSelector = function (value, index) {
    };
    LastSubscriber.prototype._complete = function () {
    };
    return LastSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../util/EmptyError":322}],237:[function(require,module,exports){
'use strict';
/**
 * @param func
 * @return {Observable<R>}
 * @method let
 * @owner Observable
 */
function letProto(func) {
}
exports.letProto = letProto;    

},{}],238:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
}
exports.map = map;
var MapOperator = function () {
    function MapOperator(project, thisArg) {
    }
    MapOperator.prototype.call = function (subscriber, source) {
    };
    return MapOperator;
}();
exports.MapOperator = MapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapSubscriber = function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    MapSubscriber.prototype._next = function (value) {
    };
    return MapSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],239:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Emits the given constant value on the output Observable every time the source
 * Observable emits a value.
 *
 * <span class="informal">Like {@link map}, but it maps every source value to
 * the same output value every time.</span>
 *
 * <img src="./img/mapTo.png" width="100%">
 *
 * Takes a constant `value` as argument, and emits that whenever the source
 * Observable emits a value. In other words, ignores the actual source value,
 * and simply uses the emission moment to know when to emit the given `value`.
 *
 * @example <caption>Map every every click to the string 'Hi'</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var greetings = clicks.mapTo('Hi');
 * greetings.subscribe(x => console.log(x));
 *
 * @see {@link map}
 *
 * @param {any} value The value to map each source value to.
 * @return {Observable} An Observable that emits the given `value` every time
 * the source Observable emits something.
 * @method mapTo
 * @owner Observable
 */
function mapTo(value) {
}
exports.mapTo = mapTo;
var MapToOperator = function () {
    function MapToOperator(value) {
    }
    MapToOperator.prototype.call = function (subscriber, source) {
    };
    return MapToOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapToSubscriber = function (_super) {
    __extends(MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
    }
    MapToSubscriber.prototype._next = function (x) {
    };
    return MapToSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],240:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Notification_1 = require('../Notification');
/**
 * Represents all of the notifications from the source Observable as `next`
 * emissions marked with their original types within {@link Notification}
 * objects.
 *
 * <span class="informal">Wraps `next`, `error` and `complete` emissions in
 * {@link Notification} objects, emitted as `next` on the output Observable.
 * </span>
 *
 * <img src="./img/materialize.png" width="100%">
 *
 * `materialize` returns an Observable that emits a `next` notification for each
 * `next`, `error`, or `complete` emission of the source Observable. When the
 * source Observable emits `complete`, the output Observable will emit `next` as
 * a Notification of type "complete", and then it will emit `complete` as well.
 * When the source Observable emits `error`, the output will emit `next` as a
 * Notification of type "error", and then `complete`.
 *
 * This operator is useful for producing metadata of the source Observable, to
 * be consumed as `next` emissions. Use it in conjunction with
 * {@link dematerialize}.
 *
 * @example <caption>Convert a faulty Observable to an Observable of Notifications</caption>
 * var letters = Rx.Observable.of('a', 'b', 13, 'd');
 * var upperCase = letters.map(x => x.toUpperCase());
 * var materialized = upperCase.materialize();
 * materialized.subscribe(x => console.log(x));
 *
 * @see {@link Notification}
 * @see {@link dematerialize}
 *
 * @return {Observable<Notification<T>>} An Observable that emits
 * {@link Notification} objects that wrap the original emissions from the source
 * Observable with metadata.
 * @method materialize
 * @owner Observable
 */
function materialize() {
}
exports.materialize = materialize;
var MaterializeOperator = function () {
    function MaterializeOperator() {
    }
    MaterializeOperator.prototype.call = function (subscriber, source) {
    };
    return MaterializeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MaterializeSubscriber = function (_super) {
    __extends(MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
    }
    MaterializeSubscriber.prototype._next = function (value) {
    };
    MaterializeSubscriber.prototype._error = function (err) {
    };
    MaterializeSubscriber.prototype._complete = function () {
    };
    return MaterializeSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Notification":5,"../Subscriber":14}],241:[function(require,module,exports){
'use strict';
var reduce_1 = require('./reduce');
/**
 * The Max operator operates on an Observable that emits numbers (or items that can be evaluated as numbers),
 * and when source Observable completes it emits a single item: the item with the largest number.
 *
 * <img src="./img/max.png" width="100%">
 *
 * @param {Function} optional comparer function that it will use instead of its default to compare the value of two
 * items.
 * @return {Observable} an Observable that emits item with the largest number.
 * @method max
 * @owner Observable
 */
function max(comparer) {
}
exports.max = max;    

},{"./reduce":259}],242:[function(require,module,exports){
'use strict';
var ArrayObservable_1 = require('../observable/ArrayObservable');
var mergeAll_1 = require('./mergeAll');
var isScheduler_1 = require('../util/isScheduler');
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (either the source or an
 * Observable given as argument), and simply forwards (without doing any
 * transformation) all the values from all the input Observables to the output
 * Observable. The output Observable only completes once all input Observables
 * have completed. Any error delivered by an input Observable will be immediately
 * emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = clicks.merge(timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = timer1.merge(timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {Observable} other An input Observable to merge with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @method merge
 * @owner Observable
 */
function merge() {
}
exports.merge = merge;
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (as arguments), and simply
 * forwards (without doing any transformation) all the values from all the input
 * Observables to the output Observable. The output Observable only completes
 * once all input Observables have completed. Any error delivered by an input
 * Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {Observable} input1 An input Observable to merge with others.
 * @param {Observable} input2 An input Observable to merge with others.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @static true
 * @name merge
 * @owner Observable
 */
function mergeStatic() {
}
exports.mergeStatic = mergeStatic;    

},{"../observable/ArrayObservable":146,"../util/isScheduler":338,"./mergeAll":243}],243:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Converts a higher-order Observable into a first-order Observable which
 * concurrently delivers all values that are emitted on the inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables.</span>
 *
 * <img src="./img/mergeAll.png" width="100%">
 *
 * `mergeAll` subscribes to an Observable that emits Observables, also known as
 * a higher-order Observable. Each time it observes one of these emitted inner
 * Observables, it subscribes to that and delivers all the values from the
 * inner Observable on the output Observable. The output Observable only
 * completes once all inner Observables have completed. Any error delivered by
 * a inner Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var firstOrder = higherOrder.mergeAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
 * var firstOrder = higherOrder.mergeAll(2);
 * firstOrder.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link merge}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits values coming from all the
 * inner Observables emitted by the source Observable.
 * @method mergeAll
 * @owner Observable
 */
function mergeAll(concurrent) {
}
exports.mergeAll = mergeAll;
var MergeAllOperator = function () {
    function MergeAllOperator(concurrent) {
    }
    MergeAllOperator.prototype.call = function (observer, source) {
    };
    return MergeAllOperator;
}();
exports.MergeAllOperator = MergeAllOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeAllSubscriber = function (_super) {
    __extends(MergeAllSubscriber, _super);
    function MergeAllSubscriber(destination, concurrent) {
    }
    MergeAllSubscriber.prototype._next = function (observable) {
    };
    MergeAllSubscriber.prototype._complete = function () {
    };
    MergeAllSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return MergeAllSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.MergeAllSubscriber = MergeAllSubscriber;    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],244:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
 * var letters = Rx.Observable.of('a', 'b', 'c');
 * var result = letters.mergeMap(x =>
 *   Rx.Observable.interval(1000).map(i => x+i)
 * );
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and merging the results of the Observables obtained
 * from this transformation.
 * @method mergeMap
 * @owner Observable
 */
function mergeMap(project, resultSelector, concurrent) {
}
exports.mergeMap = mergeMap;
var MergeMapOperator = function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
    }
    MergeMapOperator.prototype.call = function (observer, source) {
    };
    return MergeMapOperator;
}();
exports.MergeMapOperator = MergeMapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeMapSubscriber = function (_super) {
    __extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
    }
    MergeMapSubscriber.prototype._next = function (value) {
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
    };
    MergeMapSubscriber.prototype._complete = function () {
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return MergeMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.MergeMapSubscriber = MergeMapSubscriber;    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],245:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Projects each source value to the same Observable which is merged multiple
 * times in the output Observable.
 *
 * <span class="informal">It's like {@link mergeMap}, but maps each value always
 * to the same inner Observable.</span>
 *
 * <img src="./img/mergeMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then merges those resulting Observables into one
 * single Observable, which is the output Observable.
 *
 * @example <caption>For each click event, start an interval Observable ticking every 1 second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.mergeMapTo(Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMapTo}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 * @see {@link switchMapTo}
 *
 * @param {Observable} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` (and optionally transformed through `resultSelector`) every
 * time a value is emitted on the source Observable.
 * @method mergeMapTo
 * @owner Observable
 */
function mergeMapTo(innerObservable, resultSelector, concurrent) {
}
exports.mergeMapTo = mergeMapTo;
// TODO: Figure out correct signature here: an Operator<Observable<T>, R>
//       needs to implement call(observer: Subscriber<R>): Subscriber<Observable<T>>
var MergeMapToOperator = function () {
    function MergeMapToOperator(ish, resultSelector, concurrent) {
    }
    MergeMapToOperator.prototype.call = function (observer, source) {
    };
    return MergeMapToOperator;
}();
exports.MergeMapToOperator = MergeMapToOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeMapToSubscriber = function (_super) {
    __extends(MergeMapToSubscriber, _super);
    function MergeMapToSubscriber(destination, ish, resultSelector, concurrent) {
    }
    MergeMapToSubscriber.prototype._next = function (value) {
    };
    MergeMapToSubscriber.prototype._innerSub = function (ish, destination, resultSelector, value, index) {
    };
    MergeMapToSubscriber.prototype._complete = function () {
    };
    MergeMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    MergeMapToSubscriber.prototype.trySelectResult = function (outerValue, innerValue, outerIndex, innerIndex) {
    };
    MergeMapToSubscriber.prototype.notifyError = function (err) {
    };
    MergeMapToSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return MergeMapToSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.MergeMapToSubscriber = MergeMapToSubscriber;    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],246:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var subscribeToResult_1 = require('../util/subscribeToResult');
var OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * @param project
 * @param seed
 * @param concurrent
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method mergeScan
 * @owner Observable
 */
function mergeScan(project, seed, concurrent) {
}
exports.mergeScan = mergeScan;
var MergeScanOperator = function () {
    function MergeScanOperator(project, seed, concurrent) {
    }
    MergeScanOperator.prototype.call = function (subscriber, source) {
    };
    return MergeScanOperator;
}();
exports.MergeScanOperator = MergeScanOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeScanSubscriber = function (_super) {
    __extends(MergeScanSubscriber, _super);
    function MergeScanSubscriber(destination, project, acc, concurrent) {
    }
    MergeScanSubscriber.prototype._next = function (value) {
    };
    MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
    };
    MergeScanSubscriber.prototype._complete = function () {
    };
    MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    return MergeScanSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.MergeScanSubscriber = MergeScanSubscriber;    

},{"../OuterSubscriber":8,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],247:[function(require,module,exports){
'use strict';
var reduce_1 = require('./reduce');
/**
 * The Min operator operates on an Observable that emits numbers (or items that can be evaluated as numbers),
 * and when source Observable completes it emits a single item: the item with the smallest number.
 *
 * <img src="./img/min.png" width="100%">
 *
 * @param {Function} optional comparer function that it will use instead of its default to compare the value of two items.
 * @return {Observable<R>} an Observable that emits item with the smallest number.
 * @method min
 * @owner Observable
 */
function min(comparer) {
}
exports.min = min;    

},{"./reduce":259}],248:[function(require,module,exports){
'use strict';
var MulticastObservable_1 = require('../observable/MulticastObservable');
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
/**
 * Returns an Observable that emits the results of invoking a specified selector on items
 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
 *
 * <img src="./img/multicast.png" width="100%">
 *
 * @param {Function|Subject} Factory function to create an intermediate subject through
 * which the source sequence's elements will be multicast to the selector function
 * or Subject to push source elements into.
 * @param {Function} Optional selector function that can use the multicasted source stream
 * as many times as needed, without causing multiple subscriptions to the source stream.
 * Subscribers to the given source will receive all notifications of the source from the
 * time of the subscription forward.
 * @return {Observable} an Observable that emits the results of invoking the selector
 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
 * the underlying stream.
 * @method multicast
 * @owner Observable
 */
function multicast(subjectOrSubjectFactory, selector) {
    var subjectFactory;
    if (typeof subjectOrSubjectFactory === 'function') {
        subjectFactory = subjectOrSubjectFactory;
    } else {
        subjectFactory = function subjectFactory() {
        };
    }
    return !selector ? new ConnectableObservable_1.ConnectableObservable(this, subjectFactory) : new MulticastObservable_1.MulticastObservable(this, subjectFactory, selector);
}
exports.multicast = multicast;    

},{"../observable/ConnectableObservable":149,"../observable/MulticastObservable":161}],249:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Notification_1 = require('../Notification');
/**
 * @see {@link Notification}
 *
 * @param scheduler
 * @param delay
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method observeOn
 * @owner Observable
 */
function observeOn(scheduler, delay) {
}
exports.observeOn = observeOn;
var ObserveOnOperator = function () {
    function ObserveOnOperator(scheduler, delay) {
    }
    ObserveOnOperator.prototype.call = function (subscriber, source) {
    };
    return ObserveOnOperator;
}();
exports.ObserveOnOperator = ObserveOnOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ObserveOnSubscriber = function (_super) {
    __extends(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
    }
    ObserveOnSubscriber.dispatch = function (arg) {
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
    };
    ObserveOnSubscriber.prototype._next = function (value) {
    };
    ObserveOnSubscriber.prototype._error = function (err) {
    };
    ObserveOnSubscriber.prototype._complete = function () {
    };
    return ObserveOnSubscriber;
}(Subscriber_1.Subscriber);
exports.ObserveOnSubscriber = ObserveOnSubscriber;
var ObserveOnMessage = function () {
    function ObserveOnMessage(notification, destination) {
    }
    return ObserveOnMessage;
}();
exports.ObserveOnMessage = ObserveOnMessage;    

},{"../Notification":5,"../Subscriber":14}],250:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FromObservable_1 = require('../observable/FromObservable');
var isArray_1 = require('../util/isArray');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
function onErrorResumeNext() {
}
exports.onErrorResumeNext = onErrorResumeNext;
/* tslint:enable:max-line-length */
function onErrorResumeNextStatic() {
}
exports.onErrorResumeNextStatic = onErrorResumeNextStatic;
var OnErrorResumeNextOperator = function () {
    function OnErrorResumeNextOperator(nextSources) {
    }
    OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
    };
    return OnErrorResumeNextOperator;
}();
var OnErrorResumeNextSubscriber = function (_super) {
    __extends(OnErrorResumeNextSubscriber, _super);
    function OnErrorResumeNextSubscriber(destination, nextSources) {
    }
    OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
    };
    OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    OnErrorResumeNextSubscriber.prototype._error = function (err) {
    };
    OnErrorResumeNextSubscriber.prototype._complete = function () {
    };
    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
    };
    return OnErrorResumeNextSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../observable/FromObservable":156,"../util/isArray":332,"../util/subscribeToResult":342}],251:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Groups pairs of consecutive emissions together and emits them as an array of
 * two values.
 *
 * <span class="informal">Puts the current value and previous value together as
 * an array, and emits that.</span>
 *
 * <img src="./img/pairwise.png" width="100%">
 *
 * The Nth emission from the source Observable will cause the output Observable
 * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
 * pair. For this reason, `pairwise` emits on the second and subsequent
 * emissions from the source Observable, but not on the first emission, because
 * there is no previous value in that case.
 *
 * @example <caption>On every click (starting from the second), emit the relative distance to the previous click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var pairs = clicks.pairwise();
 * var distance = pairs.map(pair => {
 *   var x0 = pair[0].clientX;
 *   var y0 = pair[0].clientY;
 *   var x1 = pair[1].clientX;
 *   var y1 = pair[1].clientY;
 *   return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
 * });
 * distance.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 *
 * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
 * consecutive values from the source Observable.
 * @method pairwise
 * @owner Observable
 */
function pairwise() {
}
exports.pairwise = pairwise;
var PairwiseOperator = function () {
    function PairwiseOperator() {
    }
    PairwiseOperator.prototype.call = function (subscriber, source) {
    };
    return PairwiseOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var PairwiseSubscriber = function (_super) {
    __extends(PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
    }
    PairwiseSubscriber.prototype._next = function (value) {
    };
    return PairwiseSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],252:[function(require,module,exports){
'use strict';
var not_1 = require('../util/not');
var filter_1 = require('./filter');
/**
 * Splits the source Observable into two, one with values that satisfy a
 * predicate, and another with values that don't satisfy the predicate.
 *
 * <span class="informal">It's like {@link filter}, but returns two Observables:
 * one like the output of {@link filter}, and the other with values that did not
 * pass the condition.</span>
 *
 * <img src="./img/partition.png" width="100%">
 *
 * `partition` outputs an array with two Observables that partition the values
 * from the source Observable through the given `predicate` function. The first
 * Observable in that array emits source values for which the predicate argument
 * returns true. The second Observable emits source values for which the
 * predicate returns false. The first behaves like {@link filter} and the second
 * behaves like {@link filter} with the predicate negated.
 *
 * @example <caption>Partition click events into those on DIV elements and those elsewhere</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var parts = clicks.partition(ev => ev.target.tagName === 'DIV');
 * var clicksOnDivs = parts[0];
 * var clicksElsewhere = parts[1];
 * clicksOnDivs.subscribe(x => console.log('DIV clicked: ', x));
 * clicksElsewhere.subscribe(x => console.log('Other clicked: ', x));
 *
 * @see {@link filter}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted on the first Observable in the returned array, if
 * `false` the value is emitted on the second Observable in the array. The
 * `index` parameter is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {[Observable<T>, Observable<T>]} An array with two Observables: one
 * with values that passed the predicate, and another with values that did not
 * pass the predicate.
 * @method partition
 * @owner Observable
 */
function partition(predicate, thisArg) {
}
exports.partition = partition;    

},{"../util/not":340,"./filter":228}],253:[function(require,module,exports){
'use strict';
var map_1 = require('./map');
/**
 * Maps each source value (an object) to its specified nested property.
 *
 * <span class="informal">Like {@link map}, but meant only for picking one of
 * the nested properties of every emitted object.</span>
 *
 * <img src="./img/pluck.png" width="100%">
 *
 * Given a list of strings describing a path to an object property, retrieves
 * the value of a specified nested property from all values in the source
 * Observable. If a property can't be resolved, it will return `undefined` for
 * that value.
 *
 * @example <caption>Map every every click to the tagName of the clicked target element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var tagNames = clicks.pluck('target', 'tagName');
 * tagNames.subscribe(x => console.log(x));
 *
 * @see {@link map}
 *
 * @param {...string} properties The nested properties to pluck from each source
 * value (an object).
 * @return {Observable} Returns a new Observable of property values from the
 * source values.
 * @method pluck
 * @owner Observable
 */
function pluck() {
}
exports.pluck = pluck;
function plucker(props, length) {
}    

},{"./map":238}],254:[function(require,module,exports){
'use strict';
var Subject_1 = require('../Subject');
var multicast_1 = require('./multicast');
/**
 * Returns a ConnectableObservable, which is a variety of Observable that waits until its connect method is called
 * before it begins emitting items to those Observers that have subscribed to it.
 *
 * <img src="./img/publish.png" width="100%">
 *
 * @param {Function} Optional selector function which can use the multicasted source sequence as many times as needed,
 * without causing multiple subscriptions to the source sequence.
 * Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
 * @return a ConnectableObservable that upon connection causes the source Observable to emit items to its Observers.
 * @method publish
 * @owner Observable
 */
function publish(selector) {
}
exports.publish = publish;    

},{"../Subject":12,"./multicast":248}],255:[function(require,module,exports){
'use strict';
var BehaviorSubject_1 = require('../BehaviorSubject');
var multicast_1 = require('./multicast');
/**
 * @param value
 * @return {ConnectableObservable<T>}
 * @method publishBehavior
 * @owner Observable
 */
function publishBehavior(value) {
}
exports.publishBehavior = publishBehavior;    

},{"../BehaviorSubject":3,"./multicast":248}],256:[function(require,module,exports){
'use strict';
var AsyncSubject_1 = require('../AsyncSubject');
var multicast_1 = require('./multicast');
/**
 * @return {ConnectableObservable<T>}
 * @method publishLast
 * @owner Observable
 */
function publishLast() {
}
exports.publishLast = publishLast;    

},{"../AsyncSubject":2,"./multicast":248}],257:[function(require,module,exports){
'use strict';
var ReplaySubject_1 = require('../ReplaySubject');
var multicast_1 = require('./multicast');
/**
 * @param bufferSize
 * @param windowTime
 * @param scheduler
 * @return {ConnectableObservable<T>}
 * @method publishReplay
 * @owner Observable
 */
function publishReplay(bufferSize, windowTime, scheduler) {
}
exports.publishReplay = publishReplay;    

},{"../ReplaySubject":9,"./multicast":248}],258:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isArray_1 = require('../util/isArray');
var ArrayObservable_1 = require('../observable/ArrayObservable');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that mirrors the first source Observable to emit an item
 * from the combination of this Observable and supplied Observables
 * @param {...Observables} ...observables sources used to race for which Observable emits first.
 * @return {Observable} an Observable that mirrors the output of the first Observable to emit an item.
 * @method race
 * @owner Observable
 */
function race() {
}
exports.race = race;
function raceStatic() {
}
exports.raceStatic = raceStatic;
var RaceOperator = function () {
    function RaceOperator() {
    }
    RaceOperator.prototype.call = function (subscriber, source) {
    };
    return RaceOperator;
}();
exports.RaceOperator = RaceOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RaceSubscriber = function (_super) {
    __extends(RaceSubscriber, _super);
    function RaceSubscriber(destination) {
    }
    RaceSubscriber.prototype._next = function (observable) {
    };
    RaceSubscriber.prototype._complete = function () {
    };
    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    return RaceSubscriber;
}(OuterSubscriber_1.OuterSubscriber);
exports.RaceSubscriber = RaceSubscriber;    

},{"../OuterSubscriber":8,"../observable/ArrayObservable":146,"../util/isArray":332,"../util/subscribeToResult":342}],259:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Applies an accumulator function over the source Observable, and returns the
 * accumulated result when the source completes, given an optional seed value.
 *
 * <span class="informal">Combines together all values emitted on the source,
 * using an accumulator function that knows how to join a new source value into
 * the accumulation from the past.</span>
 *
 * <img src="./img/reduce.png" width="100%">
 *
 * Like
 * [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce),
 * `reduce` applies an `accumulator` function against an accumulation and each
 * value of the source Observable (from the past) to reduce it to a single
 * value, emitted on the output Observable. Note that `reduce` will only emit
 * one value, only when the source Observable completes. It is equivalent to
 * applying operator {@link scan} followed by operator {@link last}.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * @example <caption>Count the number of click events that happened in 5 seconds</caption>
 * var clicksInFiveSeconds = Rx.Observable.fromEvent(document, 'click')
 *   .takeUntil(Rx.Observable.interval(5000));
 * var ones = clicksInFiveSeconds.mapTo(1);
 * var seed = 0;
 * var count = ones.reduce((acc, one) => acc + one, seed);
 * count.subscribe(x => console.log(x));
 *
 * @see {@link count}
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link scan}
 *
 * @param {function(acc: R, value: T): R} accumulator The accumulator function
 * called on each source value.
 * @param {R} [seed] The initial accumulation value.
 * @return {Observable<R>} An observable of the accumulated values.
 * @return {Observable<R>} An Observable that emits a single value that is the
 * result of accumulating the values emitted by the source Observable.
 * @method reduce
 * @owner Observable
 */
function reduce(accumulator, seed) {
}
exports.reduce = reduce;
var ReduceOperator = function () {
    function ReduceOperator(accumulator, seed) {
    }
    ReduceOperator.prototype.call = function (subscriber, source) {
    };
    return ReduceOperator;
}();
exports.ReduceOperator = ReduceOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ReduceSubscriber = function (_super) {
    __extends(ReduceSubscriber, _super);
    function ReduceSubscriber(destination, accumulator, seed) {
    }
    ReduceSubscriber.prototype._next = function (value) {
    };
    ReduceSubscriber.prototype._tryReduce = function (value) {
    };
    ReduceSubscriber.prototype._complete = function () {
    };
    return ReduceSubscriber;
}(Subscriber_1.Subscriber);
exports.ReduceSubscriber = ReduceSubscriber;    

},{"../Subscriber":14}],260:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyObservable_1 = require('../observable/EmptyObservable');
/**
 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times,
 * on a particular Scheduler.
 *
 * <img src="./img/repeat.png" width="100%">
 *
 * @param {Scheduler} [scheduler] the Scheduler to emit the items on.
 * @param {number} [count] the number of times the source Observable items are repeated, a count of 0 will yield
 * an empty Observable.
 * @return {Observable} an Observable that repeats the stream of items emitted by the source Observable at most
 * count times.
 * @method repeat
 * @owner Observable
 */
function repeat(count) {
}
exports.repeat = repeat;
var RepeatOperator = function () {
    function RepeatOperator(count, source) {
    }
    RepeatOperator.prototype.call = function (subscriber, source) {
    };
    return RepeatOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RepeatSubscriber = function (_super) {
    __extends(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
    }
    RepeatSubscriber.prototype.complete = function () {
    };
    return RepeatSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../observable/EmptyObservable":151}],261:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that emits the same values as the source observable with the exception of a `complete`.
 * A `complete` will cause the emission of the Throwable that cause the complete to the Observable returned from
 * notificationHandler. If that Observable calls onComplete or `complete` then retry will call `complete` or `error`
 * on the child subscription. Otherwise, this Observable will resubscribe to the source observable, on a particular
 * Scheduler.
 *
 * <img src="./img/repeatWhen.png" width="100%">
 *
 * @param {notificationHandler} receives an Observable of notifications with which a user can `complete` or `error`,
 * aborting the retry.
 * @param {scheduler} the Scheduler on which to subscribe to the source Observable.
 * @return {Observable} the source Observable modified with retry logic.
 * @method repeatWhen
 * @owner Observable
 */
function repeatWhen(notifier) {
}
exports.repeatWhen = repeatWhen;
var RepeatWhenOperator = function () {
    function RepeatWhenOperator(notifier, source) {
    }
    RepeatWhenOperator.prototype.call = function (subscriber, source) {
    };
    return RepeatWhenOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RepeatWhenSubscriber = function (_super) {
    __extends(RepeatWhenSubscriber, _super);
    function RepeatWhenSubscriber(destination, notifier, source) {
    }
    RepeatWhenSubscriber.prototype.complete = function () {
    };
    RepeatWhenSubscriber.prototype._unsubscribe = function () {
    };
    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    return RepeatWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subject":12,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],262:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that mirrors the source Observable, resubscribing to it if it calls `error` and the
 * predicate returns true for that specific exception and retry count.
 * If the source Observable calls `error`, this method will resubscribe to the source Observable for a maximum of
 * count resubscriptions (given as a number parameter) rather than propagating the `error` call.
 *
 * <img src="./img/retry.png" width="100%">
 *
 * Any and all items emitted by the source Observable will be emitted by the resulting Observable, even those emitted
 * during failed subscriptions. For example, if an Observable fails at first but emits [1, 2] then succeeds the second
 * time and emits: [1, 2, 3, 4, 5] then the complete stream of emissions and notifications
 * would be: [1, 2, 1, 2, 3, 4, 5, `complete`].
 * @param {number} number of retry attempts before failing.
 * @return {Observable} the source Observable modified with the retry logic.
 * @method retry
 * @owner Observable
 */
function retry(count) {
}
exports.retry = retry;
var RetryOperator = function () {
    function RetryOperator(count, source) {
    }
    RetryOperator.prototype.call = function (subscriber, source) {
    };
    return RetryOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RetrySubscriber = function (_super) {
    __extends(RetrySubscriber, _super);
    function RetrySubscriber(destination, count, source) {
    }
    RetrySubscriber.prototype.error = function (err) {
    };
    return RetrySubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],263:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that emits the same values as the source observable with the exception of an `error`.
 * An `error` will cause the emission of the Throwable that cause the error to the Observable returned from
 * notificationHandler. If that Observable calls onComplete or `error` then retry will call `complete` or `error`
 * on the child subscription. Otherwise, this Observable will resubscribe to the source observable, on a particular
 * Scheduler.
 *
 * <img src="./img/retryWhen.png" width="100%">
 *
 * @param {notificationHandler} receives an Observable of notifications with which a user can `complete` or `error`,
 * aborting the retry.
 * @param {scheduler} the Scheduler on which to subscribe to the source Observable.
 * @return {Observable} the source Observable modified with retry logic.
 * @method retryWhen
 * @owner Observable
 */
function retryWhen(notifier) {
}
exports.retryWhen = retryWhen;
var RetryWhenOperator = function () {
    function RetryWhenOperator(notifier, source) {
    }
    RetryWhenOperator.prototype.call = function (subscriber, source) {
    };
    return RetryWhenOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RetryWhenSubscriber = function (_super) {
    __extends(RetryWhenSubscriber, _super);
    function RetryWhenSubscriber(destination, notifier, source) {
    }
    RetryWhenSubscriber.prototype.error = function (err) {
    };
    RetryWhenSubscriber.prototype._unsubscribe = function () {
    };
    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    return RetryWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subject":12,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],264:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Emits the most recently emitted value from the source Observable whenever
 * another Observable, the `notifier`, emits.
 *
 * <span class="informal">It's like {@link sampleTime}, but samples whenever
 * the `notifier` Observable emits something.</span>
 *
 * <img src="./img/sample.png" width="100%">
 *
 * Whenever the `notifier` Observable emits a value or completes, `sample`
 * looks at the source Observable and emits whichever value it has most recently
 * emitted since the previous sampling, unless the source has not emitted
 * anything since the previous sampling. The `notifier` is subscribed to as soon
 * as the output Observable is subscribed.
 *
 * @example <caption>On every click, sample the most recent "seconds" timer</caption>
 * var seconds = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = seconds.sample(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {Observable<any>} notifier The Observable to use for sampling the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable whenever the notifier Observable
 * emits value or completes.
 * @method sample
 * @owner Observable
 */
function sample(notifier) {
}
exports.sample = sample;
var SampleOperator = function () {
    function SampleOperator(notifier) {
    }
    SampleOperator.prototype.call = function (subscriber, source) {
    };
    return SampleOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SampleSubscriber = function (_super) {
    __extends(SampleSubscriber, _super);
    function SampleSubscriber(destination, notifier) {
    }
    SampleSubscriber.prototype._next = function (value) {
    };
    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    SampleSubscriber.prototype.notifyComplete = function () {
    };
    SampleSubscriber.prototype.emitValue = function () {
    };
    return SampleSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],265:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var async_1 = require('../scheduler/async');
/**
 * Emits the most recently emitted value from the source Observable within
 * periodic time intervals.
 *
 * <span class="informal">Samples the source Observable at periodic time
 * intervals, emitting what it samples.</span>
 *
 * <img src="./img/sampleTime.png" width="100%">
 *
 * `sampleTime` periodically looks at the source Observable and emits whichever
 * value it has most recently emitted since the previous sampling, unless the
 * source has not emitted anything since the previous sampling. The sampling
 * happens periodically in time every `period` milliseconds (or the time unit
 * defined by the optional `scheduler` argument). The sampling starts as soon as
 * the output Observable is subscribed.
 *
 * @example <caption>Every second, emit the most recent click at most once</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.sampleTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {number} period The sampling period expressed in milliseconds or the
 * time unit determined internally by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the sampling.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable at the specified time interval.
 * @method sampleTime
 * @owner Observable
 */
function sampleTime(period, scheduler) {
}
exports.sampleTime = sampleTime;
var SampleTimeOperator = function () {
    function SampleTimeOperator(period, scheduler) {
    }
    SampleTimeOperator.prototype.call = function (subscriber, source) {
    };
    return SampleTimeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SampleTimeSubscriber = function (_super) {
    __extends(SampleTimeSubscriber, _super);
    function SampleTimeSubscriber(destination, period, scheduler) {
    }
    SampleTimeSubscriber.prototype._next = function (value) {
    };
    SampleTimeSubscriber.prototype.notifyNext = function () {
    };
    return SampleTimeSubscriber;
}(Subscriber_1.Subscriber);
function dispatchNotification(state) {
}    

},{"../Subscriber":14,"../scheduler/async":310}],266:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Applies an accumulator function over the source Observable, and returns each
 * intermediate result, with an optional seed value.
 *
 * <span class="informal">It's like {@link reduce}, but emits the current
 * accumulation whenever the source emits a value.</span>
 *
 * <img src="./img/scan.png" width="100%">
 *
 * Combines together all values emitted on the source, using an accumulator
 * function that knows how to join a new source value into the accumulation from
 * the past. Is similar to {@link reduce}, but emits the intermediate
 * accumulations.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * @example <caption>Count the number of click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var ones = clicks.mapTo(1);
 * var seed = 0;
 * var count = ones.scan((acc, one) => acc + one, seed);
 * count.subscribe(x => console.log(x));
 *
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link reduce}
 *
 * @param {function(acc: R, value: T, index: number): R} accumulator
 * The accumulator function called on each source value.
 * @param {T|R} [seed] The initial accumulation value.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method scan
 * @owner Observable
 */
function scan(accumulator, seed) {
}
exports.scan = scan;
var ScanOperator = function () {
    function ScanOperator(accumulator, seed) {
    }
    ScanOperator.prototype.call = function (subscriber, source) {
    };
    return ScanOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ScanSubscriber = function (_super) {
    __extends(ScanSubscriber, _super);
    function ScanSubscriber(destination, accumulator, seed) {
    }
    Object.defineProperty(ScanSubscriber.prototype, 'seed', {
        get: function () {
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    ScanSubscriber.prototype._next = function (value) {
    };
    ScanSubscriber.prototype._tryNext = function (value) {
    };
    return ScanSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],267:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
/**
 * Compares all values of two observables in sequence using an optional comparor function
 * and returns an observable of a single boolean value representing whether or not the two sequences
 * are equal.
 *
 * <span class="informal">Checks to see of all values emitted by both observables are equal, in order.</span>
 *
 * <img src="./img/sequenceEqual.png" width="100%">
 *
 * `sequenceEqual` subscribes to two observables and buffers incoming values from each observable. Whenever either
 * observable emits a value, the value is buffered and the buffers are shifted and compared from the bottom
 * up; If any value pair doesn't match, the returned observable will emit `false` and complete. If one of the
 * observables completes, the operator will wait for the other observable to complete; If the other
 * observable emits before completing, the returned observable will emit `false` and complete. If one observable never
 * completes or emits after the other complets, the returned observable will never complete.
 *
 * @example <caption>figure out if the Konami code matches</caption>
 * var code = Observable.from([
 *  "ArrowUp",
 *  "ArrowUp",
 *  "ArrowDown",
 *  "ArrowDown",
 *  "ArrowLeft",
 *  "ArrowRight",
 *  "ArrowLeft",
 *  "ArrowRight",
 *  "KeyB",
 *  "KeyA",
 *  "Enter" // no start key, clearly.
 * ]);
 *
 * var keys = Rx.Observable.fromEvent(document, 'keyup')
 *  .map(e => e.code);
 * var matches = keys.bufferCount(11, 1)
 *  .mergeMap(
 *    last11 =>
 *      Rx.Observable.from(last11)
 *        .sequenceEqual(code)
 *   );
 * matches.subscribe(matched => console.log('Successful cheat at Contra? ', matched));
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} compareTo the observable sequence to compare the source sequence to.
 * @param {function} [comparor] An optional function to compare each value pair
 * @return {Observable} An Observable of a single boolean value representing whether or not
 * the values emitted by both observables were equal in sequence
 * @method sequenceEqual
 * @owner Observable
 */
function sequenceEqual(compareTo, comparor) {
}
exports.sequenceEqual = sequenceEqual;
var SequenceEqualOperator = function () {
    function SequenceEqualOperator(compareTo, comparor) {
    }
    SequenceEqualOperator.prototype.call = function (subscriber, source) {
    };
    return SequenceEqualOperator;
}();
exports.SequenceEqualOperator = SequenceEqualOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SequenceEqualSubscriber = function (_super) {
    __extends(SequenceEqualSubscriber, _super);
    function SequenceEqualSubscriber(destination, compareTo, comparor) {
    }
    SequenceEqualSubscriber.prototype._next = function (value) {
    };
    SequenceEqualSubscriber.prototype._complete = function () {
    };
    SequenceEqualSubscriber.prototype.checkValues = function () {
    };
    SequenceEqualSubscriber.prototype.emit = function (value) {
    };
    SequenceEqualSubscriber.prototype.nextB = function (value) {
    };
    return SequenceEqualSubscriber;
}(Subscriber_1.Subscriber);
exports.SequenceEqualSubscriber = SequenceEqualSubscriber;
var SequenceEqualCompareToSubscriber = function (_super) {
    __extends(SequenceEqualCompareToSubscriber, _super);
    function SequenceEqualCompareToSubscriber(destination, parent) {
    }
    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
    };
    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
    };
    SequenceEqualCompareToSubscriber.prototype._complete = function () {
    };
    return SequenceEqualCompareToSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../util/errorObject":331,"../util/tryCatch":344}],268:[function(require,module,exports){
'use strict';
var multicast_1 = require('./multicast');
var Subject_1 = require('../Subject');
function shareSubjectFactory() {
    return new Subject_1.Subject();
}
/**
 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
 * This is an alias for .publish().refCount().
 *
 * <img src="./img/share.png" width="100%">
 *
 * @return {Observable<T>} an Observable that upon connection causes the source Observable to emit items to its Observers
 * @method share
 * @owner Observable
 */
function share() {
    return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
}
exports.share = share;
;    

},{"../Subject":12,"./multicast":248}],269:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var EmptyError_1 = require('../util/EmptyError');
/**
 * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
 * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
 * such items, notify of an IllegalArgumentException or NoSuchElementException respectively.
 *
 * <img src="./img/single.png" width="100%">
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {Function} a predicate function to evaluate items emitted by the source Observable.
 * @return {Observable<T>} an Observable that emits the single item emitted by the source Observable that matches
 * the predicate.
 .
 * @method single
 * @owner Observable
 */
function single(predicate) {
}
exports.single = single;
var SingleOperator = function () {
    function SingleOperator(predicate, source) {
    }
    SingleOperator.prototype.call = function (subscriber, source) {
    };
    return SingleOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SingleSubscriber = function (_super) {
    __extends(SingleSubscriber, _super);
    function SingleSubscriber(destination, predicate, source) {
    }
    SingleSubscriber.prototype.applySingleValue = function (value) {
    };
    SingleSubscriber.prototype._next = function (value) {
    };
    SingleSubscriber.prototype.tryNext = function (value) {
    };
    SingleSubscriber.prototype._complete = function () {
    };
    return SingleSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../util/EmptyError":322}],270:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that skips `n` items emitted by an Observable.
 *
 * <img src="./img/skip.png" width="100%">
 *
 * @param {Number} the `n` of times, items emitted by source Observable should be skipped.
 * @return {Observable} an Observable that skips values emitted by the source Observable.
 *
 * @method skip
 * @owner Observable
 */
function skip(total) {
}
exports.skip = skip;
var SkipOperator = function () {
    function SkipOperator(total) {
    }
    SkipOperator.prototype.call = function (subscriber, source) {
    };
    return SkipOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipSubscriber = function (_super) {
    __extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
    }
    SkipSubscriber.prototype._next = function (x) {
    };
    return SkipSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],271:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
 *
 * <img src="./img/skipUntil.png" width="100%">
 *
 * @param {Observable} the second Observable that has to emit an item before the source Observable's elements begin to
 * be mirrored by the resulting Observable.
 * @return {Observable<T>} an Observable that skips items from the source Observable until the second Observable emits
 * an item, then emits the remaining items.
 * @method skipUntil
 * @owner Observable
 */
function skipUntil(notifier) {
}
exports.skipUntil = skipUntil;
var SkipUntilOperator = function () {
    function SkipUntilOperator(notifier) {
    }
    SkipUntilOperator.prototype.call = function (subscriber, source) {
    };
    return SkipUntilOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipUntilSubscriber = function (_super) {
    __extends(SkipUntilSubscriber, _super);
    function SkipUntilSubscriber(destination, notifier) {
    }
    SkipUntilSubscriber.prototype._next = function (value) {
    };
    SkipUntilSubscriber.prototype._complete = function () {
    };
    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    SkipUntilSubscriber.prototype.notifyComplete = function () {
    };
    return SkipUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],272:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
 * true, but emits all further source items as soon as the condition becomes false.
 *
 * <img src="./img/skipWhile.png" width="100%">
 *
 * @param {Function} predicate - a function to test each item emitted from the source Observable.
 * @return {Observable<T>} an Observable that begins emitting items emitted by the source Observable when the
 * specified predicate becomes false.
 * @method skipWhile
 * @owner Observable
 */
function skipWhile(predicate) {
}
exports.skipWhile = skipWhile;
var SkipWhileOperator = function () {
    function SkipWhileOperator(predicate) {
    }
    SkipWhileOperator.prototype.call = function (subscriber, source) {
    };
    return SkipWhileOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipWhileSubscriber = function (_super) {
    __extends(SkipWhileSubscriber, _super);
    function SkipWhileSubscriber(destination, predicate) {
    }
    SkipWhileSubscriber.prototype._next = function (value) {
    };
    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
    };
    return SkipWhileSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],273:[function(require,module,exports){
'use strict';
var ArrayObservable_1 = require('../observable/ArrayObservable');
var ScalarObservable_1 = require('../observable/ScalarObservable');
var EmptyObservable_1 = require('../observable/EmptyObservable');
var concat_1 = require('./concat');
var isScheduler_1 = require('../util/isScheduler');
/**
 * Returns an Observable that emits the items in a specified Iterable before it begins to emit items emitted by the
 * source Observable.
 *
 * <img src="./img/startWith.png" width="100%">
 *
 * @param {Values} an Iterable that contains the items you want the modified Observable to emit first.
 * @return {Observable} an Observable that emits the items in the specified Iterable and then emits the items
 * emitted by the source Observable.
 * @method startWith
 * @owner Observable
 */
function startWith() {
}
exports.startWith = startWith;    

},{"../observable/ArrayObservable":146,"../observable/EmptyObservable":151,"../observable/ScalarObservable":166,"../util/isScheduler":338,"./concat":207}],274:[function(require,module,exports){
'use strict';
var SubscribeOnObservable_1 = require('../observable/SubscribeOnObservable');
/**
 * Asynchronously subscribes Observers to this Observable on the specified Scheduler.
 *
 * <img src="./img/subscribeOn.png" width="100%">
 *
 * @param {Scheduler} the Scheduler to perform subscription actions on.
 * @return {Observable<T>} the source Observable modified so that its subscriptions happen on the specified Scheduler
 .
 * @method subscribeOn
 * @owner Observable
 */
function subscribeOn(scheduler, delay) {
}
exports.subscribeOn = subscribeOn;    

},{"../observable/SubscribeOnObservable":167}],275:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Converts a higher-order Observable into a first-order Observable by
 * subscribing to only the most recently emitted of those inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables by dropping the
 * previous inner Observable once a new one appears.</span>
 *
 * <img src="./img/switch.png" width="100%">
 *
 * `switch` subscribes to an Observable that emits Observables, also known as a
 * higher-order Observable. Each time it observes one of these emitted inner
 * Observables, the output Observable subscribes to the inner Observable and
 * begins emitting the items emitted by that. So far, it behaves
 * like {@link mergeAll}. However, when a new inner Observable is emitted,
 * `switch` unsubscribes from the earlier-emitted inner Observable and
 * subscribes to the new inner Observable and begins emitting items from it. It
 * continues to behave like this for subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * // Each click event is mapped to an Observable that ticks every second
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var switched = higherOrder.switch();
 * // The outcome is that `switched` is essentially a timer that restarts
 * // on every click. The interval Observables from older clicks do not merge
 * // with the current interval Observable.
 * switched.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link mergeAll}
 * @see {@link switchMap}
 * @see {@link switchMapTo}
 * @see {@link zipAll}
 *
 * @return {Observable<T>} An Observable that emits the items emitted by the
 * Observable most recently emitted by the source Observable.
 * @method switch
 * @name switch
 * @owner Observable
 */
function _switch() {
}
exports._switch = _switch;
var SwitchOperator = function () {
    function SwitchOperator() {
    }
    SwitchOperator.prototype.call = function (subscriber, source) {
    };
    return SwitchOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchSubscriber = function (_super) {
    __extends(SwitchSubscriber, _super);
    function SwitchSubscriber(destination) {
    }
    SwitchSubscriber.prototype._next = function (value) {
    };
    SwitchSubscriber.prototype._complete = function () {
    };
    SwitchSubscriber.prototype.unsubscribeInner = function () {
    };
    SwitchSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    SwitchSubscriber.prototype.notifyError = function (err) {
    };
    SwitchSubscriber.prototype.notifyComplete = function () {
    };
    return SwitchSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],276:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, emitting values only from the most recently projected Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link switch}.</span>
 *
 * <img src="./img/switchMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each time it observes one of these
 * inner Observables, the output Observable begins emitting the items emitted by
 * that inner Observable. When a new inner Observable is emitted, `switchMap`
 * stops emitting items from the earlier-emitted inner Observable and begins
 * emitting items from the new one. It continues to behave like this for
 * subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switch}
 * @see {@link switchMapTo}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method switchMap
 * @owner Observable
 */
function switchMap(project, resultSelector) {
}
exports.switchMap = switchMap;
var SwitchMapOperator = function () {
    function SwitchMapOperator(project, resultSelector) {
    }
    SwitchMapOperator.prototype.call = function (subscriber, source) {
    };
    return SwitchMapOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchMapSubscriber = function (_super) {
    __extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project, resultSelector) {
    }
    SwitchMapSubscriber.prototype._next = function (value) {
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
    };
    SwitchMapSubscriber.prototype._complete = function () {
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    SwitchMapSubscriber.prototype._tryNotifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
    };
    return SwitchMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],277:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Projects each source value to the same Observable which is flattened multiple
 * times with {@link switch} in the output Observable.
 *
 * <span class="informal">It's like {@link switchMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * <img src="./img/switchMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. The output Observables
 * emits values only from the most recently emitted instance of
 * `innerObservable`.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMapTo(Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMapTo}
 * @see {@link switch}
 * @see {@link switchMap}
 * @see {@link mergeMapTo}
 *
 * @param {Observable} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` every time a value is emitted on the source Observable.
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` (and optionally transformed through `resultSelector`) every
 * time a value is emitted on the source Observable, and taking only the values
 * from the most recently projected inner Observable.
 * @method switchMapTo
 * @owner Observable
 */
function switchMapTo(innerObservable, resultSelector) {
}
exports.switchMapTo = switchMapTo;
var SwitchMapToOperator = function () {
    function SwitchMapToOperator(observable, resultSelector) {
    }
    SwitchMapToOperator.prototype.call = function (subscriber, source) {
    };
    return SwitchMapToOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchMapToSubscriber = function (_super) {
    __extends(SwitchMapToSubscriber, _super);
    function SwitchMapToSubscriber(destination, inner, resultSelector) {
    }
    SwitchMapToSubscriber.prototype._next = function (value) {
    };
    SwitchMapToSubscriber.prototype._complete = function () {
    };
    SwitchMapToSubscriber.prototype._unsubscribe = function () {
    };
    SwitchMapToSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    SwitchMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    SwitchMapToSubscriber.prototype.tryResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
    };
    return SwitchMapToSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],278:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
var EmptyObservable_1 = require('../observable/EmptyObservable');
/**
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * <img src="./img/take.png" width="100%">
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
 * var interval = Rx.Observable.interval(1000);
 * var five = interval.take(5);
 * five.subscribe(x => console.log(x));
 *
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of `next` values to emit.
 * @return {Observable<T>} An Observable that emits only the first `count`
 * values emitted by the source Observable, or all of the values from the source
 * if the source emits fewer than `count` values.
 * @method take
 * @owner Observable
 */
function take(count) {
}
exports.take = take;
var TakeOperator = function () {
    function TakeOperator(total) {
    }
    TakeOperator.prototype.call = function (subscriber, source) {
    };
    return TakeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeSubscriber = function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
    }
    TakeSubscriber.prototype._next = function (value) {
    };
    return TakeSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../observable/EmptyObservable":151,"../util/ArgumentOutOfRangeError":321}],279:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
var EmptyObservable_1 = require('../observable/EmptyObservable');
/**
 * Emits only the last `count` values emitted by the source Observable.
 *
 * <span class="informal">Remembers the latest `count` values, then emits those
 * only when the source completes.</span>
 *
 * <img src="./img/takeLast.png" width="100%">
 *
 * `takeLast` returns an Observable that emits at most the last `count` values
 * emitted by the source Observable. If the source emits fewer than `count`
 * values then all of its values are emitted. This operator must wait until the
 * `complete` notification emission from the source in order to emit the `next`
 * values on the output Observable, because otherwise it is impossible to know
 * whether or not more values will be emitted on the source. For this reason,
 * all values are emitted synchronously, followed by the complete notification.
 *
 * @example <caption>Take the last 3 values of an Observable with many values</caption>
 * var many = Rx.Observable.range(1, 100);
 * var lastThree = many.takeLast(3);
 * lastThree.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `takeLast(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of values to emit from the end of
 * the sequence of values emitted by the source Observable.
 * @return {Observable<T>} An Observable that emits at most the last count
 * values emitted by the source Observable.
 * @method takeLast
 * @owner Observable
 */
function takeLast(count) {
}
exports.takeLast = takeLast;
var TakeLastOperator = function () {
    function TakeLastOperator(total) {
    }
    TakeLastOperator.prototype.call = function (subscriber, source) {
    };
    return TakeLastOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeLastSubscriber = function (_super) {
    __extends(TakeLastSubscriber, _super);
    function TakeLastSubscriber(destination, total) {
    }
    TakeLastSubscriber.prototype._next = function (value) {
    };
    TakeLastSubscriber.prototype._complete = function () {
    };
    return TakeLastSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../observable/EmptyObservable":151,"../util/ArgumentOutOfRangeError":321}],280:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits something. Then, it completes.</span>
 *
 * <img src="./img/takeUntil.png" width="100%">
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value or a complete notification, the output Observable stops
 * mirroring the source Observable and completes.
 *
 * @example <caption>Tick every second until the first click happens</caption>
 * var interval = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = interval.takeUntil(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable until such time as `notifier` emits its first value.
 * @method takeUntil
 * @owner Observable
 */
function takeUntil(notifier) {
}
exports.takeUntil = takeUntil;
var TakeUntilOperator = function () {
    function TakeUntilOperator(notifier) {
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
    };
    return TakeUntilOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeUntilSubscriber = function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination, notifier) {
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
    };
    return TakeUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],281:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Emits values emitted by the source Observable so long as each value satisfies
 * the given `predicate`, and then completes as soon as this `predicate` is not
 * satisfied.
 *
 * <span class="informal">Takes values from the source only while they pass the
 * condition given. When the first value does not satisfy, it completes.</span>
 *
 * <img src="./img/takeWhile.png" width="100%">
 *
 * `takeWhile` subscribes and begins mirroring the source Observable. Each value
 * emitted on the source is given to the `predicate` function which returns a
 * boolean, representing a condition to be satisfied by the source values. The
 * output Observable emits the source values until such time as the `predicate`
 * returns false, at which point `takeWhile` stops mirroring the source
 * Observable and completes the output Observable.
 *
 * @example <caption>Emit click events only while the clientX property is greater than 200</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.takeWhile(ev => ev.clientX > 200);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates a value emitted by the source Observable and returns a boolean.
 * Also takes the (zero-based) index as the second argument.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable so long as each value satisfies the condition defined by the
 * `predicate`, then completes.
 * @method takeWhile
 * @owner Observable
 */
function takeWhile(predicate) {
}
exports.takeWhile = takeWhile;
var TakeWhileOperator = function () {
    function TakeWhileOperator(predicate) {
    }
    TakeWhileOperator.prototype.call = function (subscriber, source) {
    };
    return TakeWhileOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeWhileSubscriber = function (_super) {
    __extends(TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate) {
    }
    TakeWhileSubscriber.prototype._next = function (value) {
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
    };
    return TakeWhileSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],282:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for a duration determined by another Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link throttleTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * <img src="./img/throttle.png" width="100%">
 *
 * `throttle` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled by calling the `durationSelector` function with the source value,
 * which returns the "duration" Observable. When the duration Observable emits a
 * value or completes, the timer is disabled, and this process repeats for the
 * next source value.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.throttle(ev => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {function(value: T): Observable|Promise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration for each source value, returned as an Observable or a Promise.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttle
 * @owner Observable
 */
function throttle(durationSelector) {
}
exports.throttle = throttle;
var ThrottleOperator = function () {
    function ThrottleOperator(durationSelector) {
    }
    ThrottleOperator.prototype.call = function (subscriber, source) {
    };
    return ThrottleOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ThrottleSubscriber = function (_super) {
    __extends(ThrottleSubscriber, _super);
    function ThrottleSubscriber(destination, durationSelector) {
    }
    ThrottleSubscriber.prototype._next = function (value) {
    };
    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
    };
    ThrottleSubscriber.prototype.emitAndThrottle = function (value, duration) {
    };
    ThrottleSubscriber.prototype._unsubscribe = function () {
    };
    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    ThrottleSubscriber.prototype.notifyComplete = function () {
    };
    return ThrottleSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],283:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var async_1 = require('../scheduler/async');
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for `duration` milliseconds, then repeats this process.
 *
 * <span class="informal">Lets a value pass, then ignores source values for the
 * next `duration` milliseconds.</span>
 *
 * <img src="./img/throttleTime.png" width="100%">
 *
 * `throttleTime` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled. After `duration` milliseconds (or the time unit determined
 * internally by the optional `scheduler`) has passed, the timer is disabled,
 * and this process repeats for the next source value. Optionally takes a
 * {@link Scheduler} for managing timers.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.throttleTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {number} duration Time to wait before emitting another value after
 * emitting the last value, measured in milliseconds or the time unit determined
 * internally by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the sampling.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttleTime
 * @owner Observable
 */
function throttleTime(duration, scheduler) {
}
exports.throttleTime = throttleTime;
var ThrottleTimeOperator = function () {
    function ThrottleTimeOperator(duration, scheduler) {
    }
    ThrottleTimeOperator.prototype.call = function (subscriber, source) {
    };
    return ThrottleTimeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ThrottleTimeSubscriber = function (_super) {
    __extends(ThrottleTimeSubscriber, _super);
    function ThrottleTimeSubscriber(destination, duration, scheduler) {
    }
    ThrottleTimeSubscriber.prototype._next = function (value) {
    };
    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
    };
    return ThrottleTimeSubscriber;
}(Subscriber_1.Subscriber);
function dispatchNext(arg) {
}    

},{"../Subscriber":14,"../scheduler/async":310}],284:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var async_1 = require('../scheduler/async');
/**
 * @param scheduler
 * @return {Observable<TimeInterval<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timeInterval
 * @owner Observable
 */
function timeInterval(scheduler) {
}
exports.timeInterval = timeInterval;
var TimeInterval = function () {
    function TimeInterval(value, interval) {
    }
    return TimeInterval;
}();
exports.TimeInterval = TimeInterval;
;
var TimeIntervalOperator = function () {
    function TimeIntervalOperator(scheduler) {
    }
    TimeIntervalOperator.prototype.call = function (observer, source) {
    };
    return TimeIntervalOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeIntervalSubscriber = function (_super) {
    __extends(TimeIntervalSubscriber, _super);
    function TimeIntervalSubscriber(destination, scheduler) {
    }
    TimeIntervalSubscriber.prototype._next = function (value) {
    };
    return TimeIntervalSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../scheduler/async":310}],285:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var async_1 = require('../scheduler/async');
var isDate_1 = require('../util/isDate');
var Subscriber_1 = require('../Subscriber');
/**
 * @param due
 * @param errorToSend
 * @param scheduler
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method timeout
 * @owner Observable
 */
function timeout(due, errorToSend, scheduler) {
}
exports.timeout = timeout;
var TimeoutOperator = function () {
    function TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler) {
    }
    TimeoutOperator.prototype.call = function (subscriber, source) {
    };
    return TimeoutOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeoutSubscriber = function (_super) {
    __extends(TimeoutSubscriber, _super);
    function TimeoutSubscriber(destination, absoluteTimeout, waitFor, errorToSend, scheduler) {
    }
    Object.defineProperty(TimeoutSubscriber.prototype, 'previousIndex', {
        get: function () {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeoutSubscriber.prototype, 'hasCompleted', {
        get: function () {
        },
        enumerable: true,
        configurable: true
    });
    TimeoutSubscriber.dispatchTimeout = function (state) {
    };
    TimeoutSubscriber.prototype.scheduleTimeout = function () {
    };
    TimeoutSubscriber.prototype._next = function (value) {
    };
    TimeoutSubscriber.prototype._error = function (err) {
    };
    TimeoutSubscriber.prototype._complete = function () {
    };
    TimeoutSubscriber.prototype.notifyTimeout = function () {
    };
    return TimeoutSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../scheduler/async":310,"../util/isDate":333}],286:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var async_1 = require('../scheduler/async');
var isDate_1 = require('../util/isDate');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * @param due
 * @param withObservable
 * @param scheduler
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method timeoutWith
 * @owner Observable
 */
function timeoutWith(due, withObservable, scheduler) {
}
exports.timeoutWith = timeoutWith;
var TimeoutWithOperator = function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
    }
    TimeoutWithOperator.prototype.call = function (subscriber, source) {
    };
    return TimeoutWithOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeoutWithSubscriber = function (_super) {
    __extends(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
    }
    Object.defineProperty(TimeoutWithSubscriber.prototype, 'previousIndex', {
        get: function () {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeoutWithSubscriber.prototype, 'hasCompleted', {
        get: function () {
        },
        enumerable: true,
        configurable: true
    });
    TimeoutWithSubscriber.dispatchTimeout = function (state) {
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
    };
    TimeoutWithSubscriber.prototype._error = function (err) {
    };
    TimeoutWithSubscriber.prototype._complete = function () {
    };
    TimeoutWithSubscriber.prototype.handleTimeout = function () {
    };
    return TimeoutWithSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../scheduler/async":310,"../util/isDate":333,"../util/subscribeToResult":342}],287:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var async_1 = require('../scheduler/async');
/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
function timestamp(scheduler) {
}
exports.timestamp = timestamp;
var Timestamp = function () {
    function Timestamp(value, timestamp) {
    }
    return Timestamp;
}();
exports.Timestamp = Timestamp;
;
var TimestampOperator = function () {
    function TimestampOperator(scheduler) {
    }
    TimestampOperator.prototype.call = function (observer, source) {
    };
    return TimestampOperator;
}();
var TimestampSubscriber = function (_super) {
    __extends(TimestampSubscriber, _super);
    function TimestampSubscriber(destination, scheduler) {
    }
    TimestampSubscriber.prototype._next = function (value) {
    };
    return TimestampSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14,"../scheduler/async":310}],288:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * @return {Observable<any[]>|WebSocketSubject<T>|Observable<T>}
 * @method toArray
 * @owner Observable
 */
function toArray() {
}
exports.toArray = toArray;
var ToArrayOperator = function () {
    function ToArrayOperator() {
    }
    ToArrayOperator.prototype.call = function (subscriber, source) {
    };
    return ToArrayOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ToArraySubscriber = function (_super) {
    __extends(ToArraySubscriber, _super);
    function ToArraySubscriber(destination) {
    }
    ToArraySubscriber.prototype._next = function (x) {
    };
    ToArraySubscriber.prototype._complete = function () {
    };
    return ToArraySubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subscriber":14}],289:[function(require,module,exports){
'use strict';
var root_1 = require('../util/root');
/**
 * @param PromiseCtor
 * @return {Promise<T>}
 * @method toPromise
 * @owner Observable
 */
function toPromise(PromiseCtor) {
}
exports.toPromise = toPromise;    

},{"../util/root":341}],290:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Branch out the source Observable values as a nested Observable whenever
 * `windowBoundaries` emits.
 *
 * <span class="informal">It's like {@link buffer}, but emits a nested Observable
 * instead of an array.</span>
 *
 * <img src="./img/window.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping
 * windows. It emits the current window and opens a new one whenever the
 * Observable `windowBoundaries` emits an item. Because each window is an
 * Observable, the output is a higher-order Observable.
 *
 * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var interval = Rx.Observable.interval(1000);
 * var result = clicks.window(interval)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link buffer}
 *
 * @param {Observable<any>} windowBoundaries An Observable that completes the
 * previous window and starts a new window.
 * @return {Observable<Observable<T>>} An Observable of windows, which are
 * Observables emitting values of the source Observable.
 * @method window
 * @owner Observable
 */
function window(windowBoundaries) {
}
exports.window = window;
var WindowOperator = function () {
    function WindowOperator(windowBoundaries) {
    }
    WindowOperator.prototype.call = function (subscriber, source) {
    };
    return WindowOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowSubscriber = function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination) {
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    WindowSubscriber.prototype._next = function (value) {
    };
    WindowSubscriber.prototype._error = function (err) {
    };
    WindowSubscriber.prototype._complete = function () {
    };
    WindowSubscriber.prototype._unsubscribe = function () {
    };
    WindowSubscriber.prototype.openWindow = function () {
    };
    return WindowSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subject":12,"../util/subscribeToResult":342}],291:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
var Subject_1 = require('../Subject');
/**
 * Branch out the source Observable values as a nested Observable with each
 * nested Observable emitting at most `windowSize` values.
 *
 * <span class="informal">It's like {@link bufferCount}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowCount.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows every `startWindowEvery`
 * items, each containing no more than `windowSize` items. When the source
 * Observable completes or encounters an error, the output Observable emits
 * the current window and propagates the notification from the source
 * Observable. If `startWindowEvery` is not provided, then new windows are
 * started immediately at the start of the source and when each window completes
 * with size `windowSize`.
 *
 * @example <caption>Ignore every 3rd click event, starting from the first one</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowCount(3)
 *   .map(win => win.skip(1)) // skip first of every 3 clicks
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Ignore every 3rd click event, starting from the third one</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowCount(2, 3)
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link bufferCount}
 *
 * @param {number} windowSize The maximum number of values emitted by each
 * window.
 * @param {number} [startWindowEvery] Interval at which to start a new window.
 * For example if `startWindowEvery` is `2`, then a new window will be started
 * on every other value from the source. A new window is started at the
 * beginning of the source by default.
 * @return {Observable<Observable<T>>} An Observable of windows, which in turn
 * are Observable of values.
 * @method windowCount
 * @owner Observable
 */
function windowCount(windowSize, startWindowEvery) {
}
exports.windowCount = windowCount;
var WindowCountOperator = function () {
    function WindowCountOperator(windowSize, startWindowEvery) {
    }
    WindowCountOperator.prototype.call = function (subscriber, source) {
    };
    return WindowCountOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowCountSubscriber = function (_super) {
    __extends(WindowCountSubscriber, _super);
    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
    }
    WindowCountSubscriber.prototype._next = function (value) {
    };
    WindowCountSubscriber.prototype._error = function (err) {
    };
    WindowCountSubscriber.prototype._complete = function () {
    };
    WindowCountSubscriber.prototype._unsubscribe = function () {
    };
    return WindowCountSubscriber;
}(Subscriber_1.Subscriber);    

},{"../Subject":12,"../Subscriber":14}],292:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var async_1 = require('../scheduler/async');
var Subscriber_1 = require('../Subscriber');
/**
 * Branch out the source Observable values as a nested Observable periodically
 * in time.
 *
 * <span class="informal">It's like {@link bufferTime}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowTime.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable starts a new window periodically, as
 * determined by the `windowCreationInterval` argument. It emits each window
 * after a fixed timespan, specified by the `windowTimeSpan` argument. When the
 * source Observable completes or encounters an error, the output Observable
 * emits the current window and propagates the notification from the source
 * Observable. If `windowCreationInterval` is not provided, the output
 * Observable starts a new window when the previous window of duration
 * `windowTimeSpan` completes.
 *
 * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowTime(1000)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Every 5 seconds start a window 1 second long, and emit at most 2 click events per window</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowTime(1000, 5000)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link bufferTime}
 *
 * @param {number} windowTimeSpan The amount of time to fill each window.
 * @param {number} [windowCreationInterval] The interval at which to start new
 * windows.
 * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine window boundaries.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowTime
 * @owner Observable
 */
function windowTime(windowTimeSpan, windowCreationInterval, scheduler) {
}
exports.windowTime = windowTime;
var WindowTimeOperator = function () {
    function WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler) {
    }
    WindowTimeOperator.prototype.call = function (subscriber, source) {
    };
    return WindowTimeOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowTimeSubscriber = function (_super) {
    __extends(WindowTimeSubscriber, _super);
    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, scheduler) {
    }
    WindowTimeSubscriber.prototype._next = function (value) {
    };
    WindowTimeSubscriber.prototype._error = function (err) {
    };
    WindowTimeSubscriber.prototype._complete = function () {
    };
    WindowTimeSubscriber.prototype.openWindow = function () {
    };
    WindowTimeSubscriber.prototype.closeWindow = function (window) {
    };
    return WindowTimeSubscriber;
}(Subscriber_1.Subscriber);
function dispatchWindowTimeSpanOnly(state) {
}
function dispatchWindowCreation(state) {
}
function dispatchWindowClose(arg) {
}    

},{"../Subject":12,"../Subscriber":14,"../scheduler/async":310}],293:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var Subscription_1 = require('../Subscription');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Branch out the source Observable values as a nested Observable starting from
 * an emission from `openings` and ending when the output of `closingSelector`
 * emits.
 *
 * <span class="informal">It's like {@link bufferToggle}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowToggle.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows that contain those items
 * emitted by the source Observable between the time when the `openings`
 * Observable emits an item and when the Observable returned by
 * `closingSelector` emits an item.
 *
 * @example <caption>Every other second, emit the click events from the next 500ms</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var openings = Rx.Observable.interval(1000);
 * var result = clicks.windowToggle(openings, i =>
 *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
 * ).mergeAll();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowWhen}
 * @see {@link bufferToggle}
 *
 * @param {Observable<O>} openings An observable of notifications to start new
 * windows.
 * @param {function(value: O): Observable} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns an Observable,
 * which, when it emits (either `next` or `complete`), signals that the
 * associated window should complete.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowToggle
 * @owner Observable
 */
function windowToggle(openings, closingSelector) {
}
exports.windowToggle = windowToggle;
var WindowToggleOperator = function () {
    function WindowToggleOperator(openings, closingSelector) {
    }
    WindowToggleOperator.prototype.call = function (subscriber, source) {
    };
    return WindowToggleOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowToggleSubscriber = function (_super) {
    __extends(WindowToggleSubscriber, _super);
    function WindowToggleSubscriber(destination, openings, closingSelector) {
    }
    WindowToggleSubscriber.prototype._next = function (value) {
    };
    WindowToggleSubscriber.prototype._error = function (err) {
    };
    WindowToggleSubscriber.prototype._complete = function () {
    };
    WindowToggleSubscriber.prototype._unsubscribe = function () {
    };
    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    WindowToggleSubscriber.prototype.notifyError = function (err) {
    };
    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
    };
    WindowToggleSubscriber.prototype.closeWindow = function (index) {
    };
    return WindowToggleSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subject":12,"../Subscription":15,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],294:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var tryCatch_1 = require('../util/tryCatch');
var errorObject_1 = require('../util/errorObject');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Branch out the source Observable values as a nested Observable using a
 * factory function of closing Observables to determine when to start a new
 * window.
 *
 * <span class="informal">It's like {@link bufferWhen}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowWhen.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping windows.
 * It emits the current window and opens a new one whenever the Observable
 * produced by the specified `closingSelector` function emits an item. The first
 * window is opened immediately when subscribing to the output Observable.
 *
 * @example <caption>Emit only the first two clicks events in every window of [1-5] random seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks
 *   .windowWhen(() => Rx.Observable.interval(1000 + Math.random() * 4000))
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link bufferWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals (on either `next` or
 * `complete`) when to close the previous window and start a new one.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowWhen
 * @owner Observable
 */
function windowWhen(closingSelector) {
}
exports.windowWhen = windowWhen;
var WindowOperator = function () {
    function WindowOperator(closingSelector) {
    }
    WindowOperator.prototype.call = function (subscriber, source) {
    };
    return WindowOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowSubscriber = function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination, closingSelector) {
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
    };
    WindowSubscriber.prototype._next = function (value) {
    };
    WindowSubscriber.prototype._error = function (err) {
    };
    WindowSubscriber.prototype._complete = function () {
    };
    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
    };
    WindowSubscriber.prototype.openWindow = function (innerSub) {
    };
    return WindowSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subject":12,"../util/errorObject":331,"../util/subscribeToResult":342,"../util/tryCatch":344}],295:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Combines the source Observable with other Observables to create an Observable
 * whose values are calculated from the latest values of each, only when the
 * source emits.
 *
 * <span class="informal">Whenever the source Observable emits a value, it
 * computes a formula using that value plus the latest values from other input
 * Observables, then emits the output of that formula.</span>
 *
 * <img src="./img/withLatestFrom.png" width="100%">
 *
 * `withLatestFrom` combines each value from the source Observable (the
 * instance) with the latest values from the other input Observables only when
 * the source emits a value, optionally using a `project` function to determine
 * the value to be emitted on the output Observable. All input Observables must
 * emit at least one value before the output Observable will emit a value.
 *
 * @example <caption>On every click event, emit an array with the latest timer event plus the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var result = clicks.withLatestFrom(timer);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineLatest}
 *
 * @param {Observable} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Function} [project] Projection function for combining values
 * together. Receives all values in order of the Observables passed, where the
 * first parameter is a value from the source Observable. (e.g.
 * `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not
 * passed, arrays will be emitted on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method withLatestFrom
 * @owner Observable
 */
function withLatestFrom() {
}
exports.withLatestFrom = withLatestFrom;
/* tslint:enable:max-line-length */
var WithLatestFromOperator = function () {
    function WithLatestFromOperator(observables, project) {
    }
    WithLatestFromOperator.prototype.call = function (subscriber, source) {
    };
    return WithLatestFromOperator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WithLatestFromSubscriber = function (_super) {
    __extends(WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {
    };
    WithLatestFromSubscriber.prototype._next = function (value) {
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
    };
    return WithLatestFromSubscriber;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../util/subscribeToResult":342}],296:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArrayObservable_1 = require('../observable/ArrayObservable');
var isArray_1 = require('../util/isArray');
var Subscriber_1 = require('../Subscriber');
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
var iterator_1 = require('../symbol/iterator');
/**
 * @param observables
 * @return {Observable<R>}
 * @method zip
 * @owner Observable
 */
function zipProto() {
}
exports.zipProto = zipProto;
/* tslint:enable:max-line-length */
/**
 * @param observables
 * @return {Observable<R>}
 * @static true
 * @name zip
 * @owner Observable
 */
function zipStatic() {
}
exports.zipStatic = zipStatic;
var ZipOperator = function () {
    function ZipOperator(project) {
    }
    ZipOperator.prototype.call = function (subscriber, source) {
    };
    return ZipOperator;
}();
exports.ZipOperator = ZipOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ZipSubscriber = function (_super) {
    __extends(ZipSubscriber, _super);
    function ZipSubscriber(destination, project, values) {
    }
    ZipSubscriber.prototype._next = function (value) {
    };
    ZipSubscriber.prototype._complete = function () {
    };
    ZipSubscriber.prototype.notifyInactive = function () {
    };
    ZipSubscriber.prototype.checkIterators = function () {
    };
    ZipSubscriber.prototype._tryProject = function (args) {
    };
    return ZipSubscriber;
}(Subscriber_1.Subscriber);
exports.ZipSubscriber = ZipSubscriber;
var StaticIterator = function () {
    function StaticIterator(iterator) {
    }
    StaticIterator.prototype.hasValue = function () {
    };
    StaticIterator.prototype.next = function () {
    };
    StaticIterator.prototype.hasCompleted = function () {
    };
    return StaticIterator;
}();
var StaticArrayIterator = function () {
    function StaticArrayIterator(array) {
    }
    StaticArrayIterator.prototype[iterator_1.$$iterator] = function () {
    };
    StaticArrayIterator.prototype.next = function (value) {
    };
    StaticArrayIterator.prototype.hasValue = function () {
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
    };
    return StaticArrayIterator;
}();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ZipBufferIterator = function (_super) {
    __extends(ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable, index) {
    }
    ZipBufferIterator.prototype[iterator_1.$$iterator] = function () {
    };
    // NOTE: there is actually a name collision here with Subscriber.next and Iterator.next
    //    this is legit because `next()` will never be called by a subscription in this case.
    ZipBufferIterator.prototype.next = function () {
    };
    ZipBufferIterator.prototype.hasValue = function () {
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
    };
    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    };
    ZipBufferIterator.prototype.subscribe = function (value, index) {
    };
    return ZipBufferIterator;
}(OuterSubscriber_1.OuterSubscriber);    

},{"../OuterSubscriber":8,"../Subscriber":14,"../observable/ArrayObservable":146,"../symbol/iterator":312,"../util/isArray":332,"../util/subscribeToResult":342}],297:[function(require,module,exports){
'use strict';
var zip_1 = require('./zip');
/**
 * @param project
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method zipAll
 * @owner Observable
 */
function zipAll(project) {
}
exports.zipAll = zipAll;    

},{"./zip":296}],298:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = require('../Subscription');
/**
 * A unit of work to be executed in a {@link Scheduler}. An action is typically
 * created from within a Scheduler and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
var Action = function (_super) {
    __extends(Action, _super);
    function Action(scheduler, work) {
    }
    /**
     * Schedules this action on its parent Scheduler for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    Action.prototype.schedule = function (state, delay) {
    };
    return Action;
}(Subscription_1.Subscription);
exports.Action = Action;    

},{"../Subscription":15}],299:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncAction_1 = require('./AsyncAction');
var AnimationFrame_1 = require('../util/AnimationFrame');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AnimationFrameAction = function (_super) {
    __extends(AnimationFrameAction, _super);
    function AnimationFrameAction(scheduler, work) {
    }
    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    };
    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
    };
    return AnimationFrameAction;
}(AsyncAction_1.AsyncAction);
exports.AnimationFrameAction = AnimationFrameAction;    

},{"../util/AnimationFrame":320,"./AsyncAction":303}],300:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncScheduler_1 = require('./AsyncScheduler');
var AnimationFrameScheduler = function (_super) {
    __extends(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
        _super.apply(this, arguments);
    }
    AnimationFrameScheduler.prototype.flush = function () {
    };
    return AnimationFrameScheduler;
}(AsyncScheduler_1.AsyncScheduler);
exports.AnimationFrameScheduler = AnimationFrameScheduler;    

},{"./AsyncScheduler":304}],301:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immediate_1 = require('../util/Immediate');
var AsyncAction_1 = require('./AsyncAction');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AsapAction = function (_super) {
    __extends(AsapAction, _super);
    function AsapAction(scheduler, work) {
    }
    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    };
    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
    };
    return AsapAction;
}(AsyncAction_1.AsyncAction);
exports.AsapAction = AsapAction;    

},{"../util/Immediate":324,"./AsyncAction":303}],302:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncScheduler_1 = require('./AsyncScheduler');
var AsapScheduler = function (_super) {
    __extends(AsapScheduler, _super);
    function AsapScheduler() {
        _super.apply(this, arguments);
    }
    AsapScheduler.prototype.flush = function () {
    };
    return AsapScheduler;
}(AsyncScheduler_1.AsyncScheduler);
exports.AsapScheduler = AsapScheduler;    

},{"./AsyncScheduler":304}],303:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var root_1 = require('../util/root');
var Action_1 = require('./Action');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AsyncAction = function (_super) {
    __extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
    }
    AsyncAction.prototype.schedule = function (state, delay) {
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
    };
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    AsyncAction.prototype.execute = function (state, delay) {
    };
    AsyncAction.prototype._execute = function (state, delay) {
    };
    AsyncAction.prototype._unsubscribe = function () {
    };
    return AsyncAction;
}(Action_1.Action);
exports.AsyncAction = AsyncAction;    

},{"../util/root":341,"./Action":298}],304:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Scheduler_1 = require('../Scheduler');
var AsyncScheduler = function (_super) {
    __extends(AsyncScheduler, _super);
    function AsyncScheduler() {
        _super.apply(this, arguments);
        this.actions = [];
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         */
        this.active = false;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         */
        this.scheduled = undefined;
    }
    AsyncScheduler.prototype.flush = function (action) {
    };
    return AsyncScheduler;
}(Scheduler_1.Scheduler);
exports.AsyncScheduler = AsyncScheduler;    

},{"../Scheduler":11}],305:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncAction_1 = require('./AsyncAction');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var QueueAction = function (_super) {
    __extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
    }
    QueueAction.prototype.schedule = function (state, delay) {
    };
    QueueAction.prototype.execute = function (state, delay) {
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    };
    return QueueAction;
}(AsyncAction_1.AsyncAction);
exports.QueueAction = QueueAction;    

},{"./AsyncAction":303}],306:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncScheduler_1 = require('./AsyncScheduler');
var QueueScheduler = function (_super) {
    __extends(QueueScheduler, _super);
    function QueueScheduler() {
        _super.apply(this, arguments);
    }
    return QueueScheduler;
}(AsyncScheduler_1.AsyncScheduler);
exports.QueueScheduler = QueueScheduler;    

},{"./AsyncScheduler":304}],307:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AsyncAction_1 = require('./AsyncAction');
var AsyncScheduler_1 = require('./AsyncScheduler');
var VirtualTimeScheduler = function (_super) {
    __extends(VirtualTimeScheduler, _super);
    function VirtualTimeScheduler(SchedulerAction, maxFrames) {
    }
    /**
     * Prompt the Scheduler to execute all of its queued actions, therefore
     * clearing its queue.
     * @return {void}
     */
    VirtualTimeScheduler.prototype.flush = function () {
    };
    VirtualTimeScheduler.frameTimeFactor = 10;
    return VirtualTimeScheduler;
}(AsyncScheduler_1.AsyncScheduler);
exports.VirtualTimeScheduler = VirtualTimeScheduler;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var VirtualAction = function (_super) {
    __extends(VirtualAction, _super);
    function VirtualAction(scheduler, work, index) {
    }
    VirtualAction.prototype.schedule = function (state, delay) {
    };
    VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    };
    VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
    };
    VirtualAction.sortActions = function (a, b) {
    };
    return VirtualAction;
}(AsyncAction_1.AsyncAction);
exports.VirtualAction = VirtualAction;    

},{"./AsyncAction":303,"./AsyncScheduler":304}],308:[function(require,module,exports){
'use strict';
var AnimationFrameAction_1 = require('./AnimationFrameAction');
var AnimationFrameScheduler_1 = require('./AnimationFrameScheduler');
exports.animationFrame = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);    

},{"./AnimationFrameAction":299,"./AnimationFrameScheduler":300}],309:[function(require,module,exports){
'use strict';
var AsapAction_1 = require('./AsapAction');
var AsapScheduler_1 = require('./AsapScheduler');
exports.asap = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);    

},{"./AsapAction":301,"./AsapScheduler":302}],310:[function(require,module,exports){
'use strict';
var AsyncAction_1 = require('./AsyncAction');
var AsyncScheduler_1 = require('./AsyncScheduler');
exports.async = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);    

},{"./AsyncAction":303,"./AsyncScheduler":304}],311:[function(require,module,exports){
'use strict';
var QueueAction_1 = require('./QueueAction');
var QueueScheduler_1 = require('./QueueScheduler');
exports.queue = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);    

},{"./QueueAction":305,"./QueueScheduler":306}],312:[function(require,module,exports){
'use strict';
var root_1 = require('../util/root');
var Symbol = root_1.root.Symbol;
if (typeof Symbol === 'function') {
    if (Symbol.iterator) {
        exports.$$iterator = Symbol.iterator;
    } else if (typeof Symbol.for === 'function') {
        exports.$$iterator = Symbol.for('iterator');
    }
} else {
    if (root_1.root.Set && typeof new root_1.root.Set()['@@iterator'] === 'function') {
        // Bug for mozilla version
        exports.$$iterator = '@@iterator';
    } else if (root_1.root.Map) {
        // es6-shim specific logic
        var keys = Object.getOwnPropertyNames(root_1.root.Map.prototype);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (key !== 'entries' && key !== 'size' && root_1.root.Map.prototype[key] === root_1.root.Map.prototype['entries']) {
                exports.$$iterator = key;
                break;
            }
        }
    } else {
        exports.$$iterator = '@@iterator';
    }
}    

},{"../util/root":341}],313:[function(require,module,exports){
'use strict';
var root_1 = require('../util/root');
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        } else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    } else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.$$observable = getSymbolObservable(root_1.root);    

},{"../util/root":341}],314:[function(require,module,exports){
'use strict';
var root_1 = require('../util/root');
var Symbol = root_1.root.Symbol;
exports.$$rxSubscriber = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('rxSubscriber') : '@@rxSubscriber';    

},{"../util/root":341}],315:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var Subscription_1 = require('../Subscription');
var SubscriptionLoggable_1 = require('./SubscriptionLoggable');
var applyMixins_1 = require('../util/applyMixins');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ColdObservable = function (_super) {
    __extends(ColdObservable, _super);
    function ColdObservable(messages, scheduler) {
    }
    ColdObservable.prototype.scheduleMessages = function (subscriber) {
    };
    return ColdObservable;
}(Observable_1.Observable);
exports.ColdObservable = ColdObservable;
applyMixins_1.applyMixins(ColdObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);    

},{"../Observable":6,"../Subscription":15,"../util/applyMixins":329,"./SubscriptionLoggable":318}],316:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var Subscription_1 = require('../Subscription');
var SubscriptionLoggable_1 = require('./SubscriptionLoggable');
var applyMixins_1 = require('../util/applyMixins');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var HotObservable = function (_super) {
    __extends(HotObservable, _super);
    function HotObservable(messages, scheduler) {
    }
    HotObservable.prototype._subscribe = function (subscriber) {
    };
    HotObservable.prototype.setup = function () {
    };
    return HotObservable;
}(Subject_1.Subject);
exports.HotObservable = HotObservable;
applyMixins_1.applyMixins(HotObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);    

},{"../Subject":12,"../Subscription":15,"../util/applyMixins":329,"./SubscriptionLoggable":318}],317:[function(require,module,exports){
'use strict';
var SubscriptionLog = function () {
    function SubscriptionLog(subscribedFrame, unsubscribedFrame) {
    }
    return SubscriptionLog;
}();
exports.SubscriptionLog = SubscriptionLog;    

},{}],318:[function(require,module,exports){
'use strict';
var SubscriptionLog_1 = require('./SubscriptionLog');
var SubscriptionLoggable = function () {
    function SubscriptionLoggable() {
    }
    SubscriptionLoggable.prototype.logSubscribedFrame = function () {
    };
    SubscriptionLoggable.prototype.logUnsubscribedFrame = function (index) {
    };
    return SubscriptionLoggable;
}();
exports.SubscriptionLoggable = SubscriptionLoggable;    

},{"./SubscriptionLog":317}],319:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var Notification_1 = require('../Notification');
var ColdObservable_1 = require('./ColdObservable');
var HotObservable_1 = require('./HotObservable');
var SubscriptionLog_1 = require('./SubscriptionLog');
var VirtualTimeScheduler_1 = require('../scheduler/VirtualTimeScheduler');
var defaultMaxFrame = 750;
var TestScheduler = function (_super) {
    __extends(TestScheduler, _super);
    function TestScheduler(assertDeepEqual) {
    }
    TestScheduler.prototype.createTime = function (marbles) {
    };
    TestScheduler.prototype.createColdObservable = function (marbles, values, error) {
    };
    TestScheduler.prototype.createHotObservable = function (marbles, values, error) {
    };
    TestScheduler.prototype.materializeInnerObservable = function (observable, outerFrame) {
    };
    TestScheduler.prototype.expectObservable = function (observable, unsubscriptionMarbles) {
    };
    TestScheduler.prototype.expectSubscriptions = function (actualSubscriptionLogs) {
    };
    TestScheduler.prototype.flush = function () {
    };
    TestScheduler.parseMarblesAsSubscriptions = function (marbles) {
    };
    TestScheduler.parseMarbles = function (marbles, values, errorValue, materializeInnerObservables) {
    };
    return TestScheduler;
}(VirtualTimeScheduler_1.VirtualTimeScheduler);
exports.TestScheduler = TestScheduler;    

},{"../Notification":5,"../Observable":6,"../scheduler/VirtualTimeScheduler":307,"./ColdObservable":315,"./HotObservable":316,"./SubscriptionLog":317}],320:[function(require,module,exports){
'use strict';
var root_1 = require('./root');
var RequestAnimationFrameDefinition = function () {
    function RequestAnimationFrameDefinition(root) {
        if (root.requestAnimationFrame) {
            this.cancelAnimationFrame = root.cancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.requestAnimationFrame.bind(root);
        } else if (root.mozRequestAnimationFrame) {
            this.cancelAnimationFrame = root.mozCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.mozRequestAnimationFrame.bind(root);
        } else if (root.webkitRequestAnimationFrame) {
            this.cancelAnimationFrame = root.webkitCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.webkitRequestAnimationFrame.bind(root);
        } else if (root.msRequestAnimationFrame) {
            this.cancelAnimationFrame = root.msCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.msRequestAnimationFrame.bind(root);
        } else if (root.oRequestAnimationFrame) {
            this.cancelAnimationFrame = root.oCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.oRequestAnimationFrame.bind(root);
        } else {
            this.cancelAnimationFrame = root.clearTimeout.bind(root);
            this.requestAnimationFrame = function (cb) {
            };
        }
    }
    return RequestAnimationFrameDefinition;
}();
exports.RequestAnimationFrameDefinition = RequestAnimationFrameDefinition;
exports.AnimationFrame = new RequestAnimationFrameDefinition(root_1.root);    

},{"./root":341}],321:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an element was queried at a certain index of an
 * Observable, but no such index or position exists in that sequence.
 *
 * @see {@link elementAt}
 * @see {@link take}
 * @see {@link takeLast}
 *
 * @class ArgumentOutOfRangeError
 */
var ArgumentOutOfRangeError = function (_super) {
    __extends(ArgumentOutOfRangeError, _super);
    function ArgumentOutOfRangeError() {
    }
    return ArgumentOutOfRangeError;
}(Error);
exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;    

},{}],322:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an Observable or a sequence was queried but has no
 * elements.
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link single}
 *
 * @class EmptyError
 */
var EmptyError = function (_super) {
    __extends(EmptyError, _super);
    function EmptyError() {
    }
    return EmptyError;
}(Error);
exports.EmptyError = EmptyError;    

},{}],323:[function(require,module,exports){
'use strict';
var FastMap = function () {
    function FastMap() {
    }
    FastMap.prototype.delete = function (key) {
    };
    FastMap.prototype.set = function (key, value) {
    };
    FastMap.prototype.get = function (key) {
    };
    FastMap.prototype.forEach = function (cb, thisArg) {
    };
    FastMap.prototype.clear = function () {
    };
    return FastMap;
}();
exports.FastMap = FastMap;    

},{}],324:[function(require,module,exports){
/**
Some credit for this helper goes to http://github.com/YuzuJS/setImmediate
*/
'use strict';
var root_1 = require('./root');
var ImmediateDefinition = function () {
    function ImmediateDefinition(root) {
        this.root = root;
        if (root.setImmediate && typeof root.setImmediate === 'function') {
            this.setImmediate = root.setImmediate.bind(root);
            this.clearImmediate = root.clearImmediate.bind(root);
        } else {
            this.nextHandle = 1;
            this.tasksByHandle = {};
            this.currentlyRunningATask = false;
            // Don't get fooled by e.g. browserify environments.
            if (this.canUseProcessNextTick()) {
                // For Node.js before 0.9
                this.setImmediate = this.createProcessNextTickSetImmediate();
            } else if (this.canUsePostMessage()) {
                // For non-IE10 modern browsers
                this.setImmediate = this.createPostMessageSetImmediate();
            } else if (this.canUseMessageChannel()) {
                // For web workers, where supported
                this.setImmediate = this.createMessageChannelSetImmediate();
            } else if (this.canUseReadyStateChange()) {
                // For IE 6–8
                this.setImmediate = this.createReadyStateChangeSetImmediate();
            } else {
                // For older browsers
                this.setImmediate = this.createSetTimeoutSetImmediate();
            }
            var ci = function clearImmediate(handle) {
            };
            ci.instance = this;
            this.clearImmediate = ci;
        }
    }
    ImmediateDefinition.prototype.identify = function (o) {
    };
    ImmediateDefinition.prototype.canUseProcessNextTick = function () {
    };
    ImmediateDefinition.prototype.canUseMessageChannel = function () {
    };
    ImmediateDefinition.prototype.canUseReadyStateChange = function () {
    };
    ImmediateDefinition.prototype.canUsePostMessage = function () {
    };
    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    ImmediateDefinition.prototype.partiallyApplied = function (handler) {
    };
    ImmediateDefinition.prototype.addFromSetImmediateArguments = function (args) {
    };
    ImmediateDefinition.prototype.createProcessNextTickSetImmediate = function () {
    };
    ImmediateDefinition.prototype.createPostMessageSetImmediate = function () {
    };
    ImmediateDefinition.prototype.runIfPresent = function (handle) {
    };
    ImmediateDefinition.prototype.createMessageChannelSetImmediate = function () {
    };
    ImmediateDefinition.prototype.createReadyStateChangeSetImmediate = function () {
    };
    ImmediateDefinition.prototype.createSetTimeoutSetImmediate = function () {
    };
    return ImmediateDefinition;
}();
exports.ImmediateDefinition = ImmediateDefinition;
exports.Immediate = new ImmediateDefinition(root_1.root);    

},{"./root":341}],325:[function(require,module,exports){
'use strict';
var root_1 = require('./root');
var MapPolyfill_1 = require('./MapPolyfill');
exports.Map = root_1.root.Map || function () {
}();    

},{"./MapPolyfill":326,"./root":341}],326:[function(require,module,exports){
'use strict';
var MapPolyfill = function () {
    function MapPolyfill() {
    }
    MapPolyfill.prototype.get = function (key) {
    };
    MapPolyfill.prototype.set = function (key, value) {
    };
    MapPolyfill.prototype.delete = function (key) {
    };
    MapPolyfill.prototype.clear = function () {
    };
    MapPolyfill.prototype.forEach = function (cb, thisArg) {
    };
    return MapPolyfill;
}();
exports.MapPolyfill = MapPolyfill;    

},{}],327:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
var ObjectUnsubscribedError = function (_super) {
    __extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
    }
    return ObjectUnsubscribedError;
}(Error);
exports.ObjectUnsubscribedError = ObjectUnsubscribedError;    

},{}],328:[function(require,module,exports){
'use strict';
var __extends = this && this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
    }
    return UnsubscriptionError;
}(Error);
exports.UnsubscriptionError = UnsubscriptionError;    

},{}],329:[function(require,module,exports){
'use strict';
function applyMixins(derivedCtor, baseCtors) {
    for (var i = 0, len = baseCtors.length; i < len; i++) {
        var baseCtor = baseCtors[i];
        var propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
        for (var j = 0, len2 = propertyKeys.length; j < len2; j++) {
            var name_1 = propertyKeys[j];
            derivedCtor.prototype[name_1] = baseCtor.prototype[name_1];
        }
    }
}
exports.applyMixins = applyMixins;    

},{}],330:[function(require,module,exports){
'use strict';
var root_1 = require('./root');
var Object = root_1.root.Object;
if (typeof Object.assign != 'function') {
    (function () {
    }());
}
exports.assign = Object.assign;    

},{"./root":341}],331:[function(require,module,exports){
'use strict';
// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };    

},{}],332:[function(require,module,exports){
'use strict';
exports.isArray = Array.isArray || function (x) {
};    

},{}],333:[function(require,module,exports){
'use strict';
function isDate(value) {
}
exports.isDate = isDate;    

},{}],334:[function(require,module,exports){
'use strict';
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;    

},{}],335:[function(require,module,exports){
'use strict';
var isArray_1 = require('../util/isArray');
function isNumeric(val) {
}
exports.isNumeric = isNumeric;
;    

},{"../util/isArray":332}],336:[function(require,module,exports){
'use strict';
function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;    

},{}],337:[function(require,module,exports){
'use strict';
function isPromise(value) {
}
exports.isPromise = isPromise;    

},{}],338:[function(require,module,exports){
'use strict';
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
exports.isScheduler = isScheduler;    

},{}],339:[function(require,module,exports){
'use strict';
/* tslint:disable:no-empty */
function noop() {
}
exports.noop = noop;    

},{}],340:[function(require,module,exports){
'use strict';
function not(pred, thisArg) {
}
exports.not = not;    

},{}],341:[function(require,module,exports){
(function (global){
'use strict';
var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
};
exports.root = objectTypes[typeof self] && self || objectTypes[typeof window] && window;
var freeGlobal = objectTypes[typeof global] && global;
if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    exports.root = freeGlobal;
}    

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],342:[function(require,module,exports){
'use strict';
var root_1 = require('./root');
var isArray_1 = require('./isArray');
var isPromise_1 = require('./isPromise');
var Observable_1 = require('../Observable');
var iterator_1 = require('../symbol/iterator');
var InnerSubscriber_1 = require('../InnerSubscriber');
var observable_1 = require('../symbol/observable');
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_1.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        } else {
            return result.subscribe(destination);
        }
    }
    if (isArray_1.isArray(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    } else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
        }, function (err) {
        }).then(null, function (err) {
        });
        return destination;
    } else if (typeof result[iterator_1.$$iterator] === 'function') {
        var iterator = result[iterator_1.$$iterator]();
        do {
            var item = iterator.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    } else if (typeof result[observable_1.$$observable] === 'function') {
        var obs = result[observable_1.$$observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new Error('invalid observable'));
        } else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    } else {
        destination.error(new TypeError('unknown type returned'));
    }
    return null;
}
exports.subscribeToResult = subscribeToResult;    

},{"../InnerSubscriber":4,"../Observable":6,"../symbol/iterator":312,"../symbol/observable":313,"./isArray":332,"./isPromise":337,"./root":341}],343:[function(require,module,exports){
'use strict';
var Subscriber_1 = require('../Subscriber');
var rxSubscriber_1 = require('../symbol/rxSubscriber');
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber();
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;    

},{"../Subscriber":14,"../symbol/rxSubscriber":314}],344:[function(require,module,exports){
'use strict';
var errorObject_1 = require('./errorObject');
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    } catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;    

},{"./errorObject":331}],345:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AsyncLoader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Rx = require('rxjs/Rx');

var Rx = _interopRequireWildcard(_Rx);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AsyncLoader = exports.AsyncLoader = function () {
    function AsyncLoader() {
        _classCallCheck(this, AsyncLoader);
    }

    _createClass(AsyncLoader, [{
        key: 'load',

        /**
         * @public
         * @name load
         * @param {String} url - url of i18n JSON file
         * @returns {Observable}
         */
        value: function load(url) {
            return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        } catch (e) {
                            console.error('[Chomsky] (' + url + ') - Parse Error: ' + e.toString());
                            reject(new Error('Parse Error: ' + e.toString()));
                        }
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                };

                xhr.onerror = function () {
                    reject(new Error('Network Error'));
                };

                xhr.send();
            }));
        }
    }]);

    return AsyncLoader;
}();

},{"rxjs/Rx":10}],346:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Chomsky = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dictionarymanager = require('./dictionarymanager');

var _asyncloader = require('./asyncloader');

var _formats = require('./formats');

var _Rx = require('rxjs/Rx');

var Rx = _interopRequireWildcard(_Rx);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chomsky = exports.Chomsky = function () {
    function Chomsky(locale) {
        _classCallCheck(this, Chomsky);

        // TODO - prefix/suffix
        // Dictionary Manger to handle translations that have been loaded
        this.dictionaryManager = new _dictionarymanager.DictionaryManager();
        // Loader to load translations from a JSON file
        this.asyncLoader = new _asyncloader.AsyncLoader();
        // Handle for when the locale changes
        this.onLocaleChange = new Rx.Subject();
        // Custom formats based on the locale
        this.formats = new _formats.Formats();
        // Default location for translations
        this.location = 'i18n/';
        // Current locale
        this.currentLocale = locale || window.navigator.language;
        // Use the locale if passed in
        if (locale) {
            this.use(locale);
        }
    }

    /**
     * @public
     * @name setLocation
     * @param {String} location - path where the i18n JSON files live
     * @default 'i18n/'
     */


    _createClass(Chomsky, [{
        key: 'setLocation',
        value: function setLocation(location) {
            this.location = location;
        }

        /**
         * @public
         * @description: public method for changing the language
         * @param locale MUST BE formatted as such: 'en-US' or 'en'
         * @returns {Promise}
         */

    }, {
        key: 'use',
        value: function use(locale) {
            // Capture the pending task
            var pending = void 0;
            // If we don't have the translations, load them
            if (!this.dictionaryManager.get(locale)) {
                pending = this._getTranslations(locale);
            }
            // Return the pending if we are fetching
            if (typeof pending !== 'undefined') {
                return pending;
            } else {
                // Split out the language code from the locale
                var languageCode = (locale.split('-')[0] || '').toLowerCase();
                // Return the translations if they are already loaded
                var currentTranslations = [this.dictionaryManager.get(locale), this.dictionaryManager.get(languageCode)];
                this._applyLanguage(locale, currentTranslations[0], currentTranslations[1]);
                return Rx.Observable.of(currentTranslations);
            }
        }

        /**
         * @public
         * @name translate
         * @param key
         * @param interpolation
         * @returns {*}
         */

    }, {
        key: 'translate',
        value: function translate(key, interpolation) {
            var _this = this;

            var value = this._getValue(key);

            // Handle pluralization
            if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                if (typeof interpolation === 'number') {
                    var pluralization = value;
                    if (pluralization) {
                        if (pluralization.hasOwnProperty(interpolation)) {
                            value = pluralization[interpolation];
                        } else {
                            if (interpolation === 0) {
                                value = pluralization.zero;
                            } else {
                                value = pluralization.many;
                            }
                        }
                    }
                }
            }

            // Handle interpolation
            if (interpolation && value) {
                value = value.replace(/{([^}]*)}/gi, function (m, param) {
                    var params = param.split(':');
                    if (params.length === 1) {
                        var match = '';
                        if (interpolation.hasOwnProperty(param)) {
                            match = interpolation[param];
                        } else {
                            match = interpolation;
                        }
                        return match;
                    }
                    var unparsedValue = interpolation[params[0]] || interpolation;
                    switch (params[1]) {
                        case 'date':
                            return _this.formatDate(unparsedValue, params[2] || undefined, params[3] || undefined);
                        case 'currency':
                            return _this.formatCurrency(unparsedValue, params[2] || undefined, params[3] || undefined);
                        case 'number':
                            return _this.formatNumber(unparsedValue, params[2] || undefined);
                        default:
                            return '';
                    }
                });
            }

            // Return the key if no value is present.
            return value || '';
        }

        /**
         * @public
         * @name formatDate
         * @param date
         * @param format
         * @param mask
         * @returns {*}
         * @private
         */

    }, {
        key: 'formatDate',
        value: function formatDate(date, format, mask) {
            return this.formats.formatDate(date, format, mask);
        }

        /**
         * @public
         * @name formatCurrency
         * @param value
         * @param format
         * @param localeOverride
         * @returns {*}
         * @private
         */

    }, {
        key: 'formatCurrency',
        value: function formatCurrency(value, format, localeOverride) {
            return this.formats.formatCurrency(value, format, localeOverride);
        }

        /**
         * @public
         * @name formatNumber
         * @param numberString
         * @param format
         * @returns {*}
         * @private
         */

    }, {
        key: 'formatNumber',
        value: function formatNumber(numberString, format) {
            return this.formats.formatNumber(numberString, format);
        }

        /**
         * @private
         * @name getValue
         * @param key
         * @returns {string}
         */

    }, {
        key: '_getValue',
        value: function _getValue(key) {
            var value = null;
            var translations = this.dictionaryManager.get(this.currentLocale);

            if (translations) {
                var tokens = key.split('.');
                for (var i = 0; i < tokens.length; i++) {
                    if (!value) {
                        value = translations[tokens[i]];
                    } else {
                        value = value[tokens[i]];
                    }
                }
            }
            return value;
        }

        /**
         * @private
         * @name _getTranslations
         * @param locale
         * @returns {*|Observable.<T>}
         */

    }, {
        key: '_getTranslations',
        value: function _getTranslations(locale) {
            var _this2 = this;

            // Split out the language code from the locale
            var languageCode = (locale.split('-')[0] || '').toLowerCase();
            // Cue up two observables to grab the locale and the fallback locale
            // en-US - locale (en-US) / fallback (en)
            var translations = this._translationFetcher(locale);
            var fallbackTranslations = this._translationFetcher(languageCode);
            // Combine the two observables and share the same subscription
            this.pending = Rx.Observable.combineLatest(translations, fallbackTranslations).share();
            // Subscribe to the result
            this.pending.subscribe(function (result) {
                _this2._applyLanguage(locale, result[0], result[1]);
            }, function (err) {
                console.error('[Chomsky] - Fetching Translations Error:', err);
            }, function () {
                _this2.pending = undefined;
            });

            return this.pending;
        }

        /**
         * @private
         * @name _applyLanguage
         * @description This method is the setter for the active language
         * @param locale
         * @param translations
         * @param fallbackTranslations
         */

    }, {
        key: '_applyLanguage',
        value: function _applyLanguage(locale, translations, fallbackTranslations) {
            // Set current locale
            this.currentLocale = locale;
            // Set locale on formats too
            this.formats.setLocale(locale);
            // Handle overrides
            if (translations && translations.hasOwnProperty('formats')) {
                this.formats.override(translations.formats);
                delete translations['formats'];
            } else if (fallbackTranslations && fallbackTranslations.hasOwnProperty('formats')) {
                this.formats.override(fallbackTranslations.formats);
                delete fallbackTranslations['formats'];
            }
            // Add the translations to the DictionaryManager
            this.dictionaryManager.add(locale, translations, fallbackTranslations);
            // Emit a change event
            this.onLocaleChange.next(locale);
        }

        /**
         * @private
         * @name _translationFetcher
         * @param {String} locale - locale to fetch
         * @returns {Observable}
         */

    }, {
        key: '_translationFetcher',
        value: function _translationFetcher(locale) {
            return this.asyncLoader.load('' + this.location + locale + '.json');
        }
    }]);

    return Chomsky;
}();

exports.default = Chomsky;

},{"./asyncloader":345,"./dictionarymanager":347,"./formats":348,"rxjs/Rx":10}],347:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DictionaryManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssignDeep = require('./object-assign-deep');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DictionaryManager = exports.DictionaryManager = function () {
    function DictionaryManager() {
        _classCallCheck(this, DictionaryManager);

        this.dictionaries = {};
    }

    /**
     * @public
     * @name contains
     * @param locale
     * @returns {boolean}
     */


    _createClass(DictionaryManager, [{
        key: 'contains',
        value: function contains(locale) {
            return !!this.dictionaries[locale];
        }

        /**
         * @public
         * @name get
         * @param locale
         * @returns {Object}
         */

    }, {
        key: 'get',
        value: function get(locale) {
            return this.dictionaries[locale];
        }

        /**
         * @public
         * @name add
         * @description
         * @param locale
         * @param translations
         * @param fallbackTranslations
         */

    }, {
        key: 'add',
        value: function add(locale, translations, fallbackTranslations) {
            this.dictionaries[locale] = (0, _objectAssignDeep.mergeDeep)({}, fallbackTranslations, translations);
        }
    }]);

    return DictionaryManager;
}();

},{"./object-assign-deep":349}],348:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Formats = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssignDeep = require('./object-assign-deep');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Formats = exports.Formats = function () {
    function Formats() {
        _classCallCheck(this, Formats);

        // Format formatDefaults
        this.formatDefaults = {
            currency: {
                display: '0,0.00'
            },
            date: {
                short: 'l'
            },
            number: {
                default: ''
            }
        };
        // Initially set the locale to the browser
        this.setLocale(navigator.language);
    }

    _createClass(Formats, [{
        key: 'override',
        value: function override(formatOverrides) {
            if (formatOverrides.locale) {
                this.setLocale(formatOverrides.locale);
                delete formatOverrides['locale'];
            }
            this.formatDefaults = (0, _objectAssignDeep.mergeDeep)(this.formatDefaults, formatOverrides);
        }
    }, {
        key: 'setLocale',
        value: function setLocale(locale) {
            this.formatDefaults.locale = locale;
            if (moment && locale) {
                // Allows en and us-EN
                // TODO: probably want to disable this. It should always be a full locale 'en-US'
                var timeLocale = locale.split('-')[0] || locale;
                moment.locale(timeLocale);
            }
            if (numbro) {
                numbro.setCulture(this.formatDefaults.locale);
            }
        }
    }, {
        key: 'formatNumber',
        value: function formatNumber(value, format) {
            return numbro(value).format(format || this.formatDefaults.number.default);
        }
    }, {
        key: 'parseNumber',
        value: function parseNumber(numberStr) {
            return numbro().unformat(numberStr);
        }
    }, {
        key: 'formatCurrency',
        value: function formatCurrency(value, format, locale) {
            var currency = void 0;
            if (locale) {
                var currentLocale = this.formatDefaults.locale;
                numbro.setCulture(locale);
                currency = numbro(value).formatCurrency(format || this.formatDefaults.currency.display);
                numbro.setCulture(currentLocale);
            } else {
                currency = numbro(value).formatCurrency(format || this.formatDefaults.currency.display);
            }
            return currency;
        }
    }, {
        key: 'formatDate',
        value: function formatDate(date) {
            var format = arguments.length <= 1 || arguments[1] === undefined ? this.formatDefaults.date.short : arguments[1];
            var mask = arguments[2];

            return moment(date, mask).format(format);
        }
    }]);

    return Formats;
}();

},{"./object-assign-deep":349}],349:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.isFunction = isFunction;
exports.mergeDeep = mergeDeep;
/**
 * Simple is object check
 * @param obj
 * @returns {boolean}
 */
function isObject(obj) {
    return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj) && obj !== null;
}

/**
 * Simple is function check
 * @param obj
 * @returns {boolean}
 */
function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

/**
 * Deep merges two JS objects
 * @param target - target object
 * @param source - source object
 */
function mergeDeep(target, source) {
    var args = Array.prototype.slice.call(arguments);
    var startIndex = 1;
    var output = Object(target || {});

    // Cycle the source object arguments.
    for (var a = startIndex; a < args.length; a++) {
        var from = args[a];
        var keys = Object.keys(Object(from));

        // Cycle the properties.
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];

            // Merge arrays.
            if (Array.isArray(output[key]) || Array.isArray(from[key])) {
                var o = Array.isArray(output[key]) ? output[key].slice() : [];
                var f = Array.isArray(from[key]) ? from[key].slice() : [];
                output[key] = o.concat(f);
            }

            // Copy functions references.
            else if (isFunction(output[key]) || isFunction(from[key])) {
                    output[key] = from[key];
                }

                // Extend objects.
                else if (isObject(output[key]) || isObject(from[key])) {
                        output[key] = mergeDeep(output[key], from[key]);
                    }

                    // Copy all other types.
                    else {
                            output[key] = from[key];
                        }
        }
    }
    return output;
}

},{}]},{},[1])


//# sourceMappingURL=bundle.js.map
