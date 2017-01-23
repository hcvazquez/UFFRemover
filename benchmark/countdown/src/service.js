'use strict';

import EventEmitter from 'events';
import angular from 'angular';

function factory ($interval, $q) {
  return class CountdownTimer extends EventEmitter {
    constructor (length, options) {
      this.length = length;
      this.options = angular.extend({
        tickInterval: 15
      }, options);
      this.$$deferred = $q.defer();
    }
    start () {
      const tickInterval = this.options.tickInterval;
      this.$$interval = $interval(() => {
        this.emit('tick', tickInterval / this.length);
      }, tickInterval, this.length / tickInterval);

      this.$$interval.then(() => {
        this.emit('done');
        this.$$deferred.resolve();
      });

      return this;
    }
    cancel () {
      if (this.$$interval) {
        $interval.cancel(this.$$interval);
        this.emit('done');
        this.$$deferred.reject(new Error('Timer cancelled'));
      }
      return this;
    }
    then (handler) {
      return this.$$deferred.promise.then(handler);
    }
    catch (handler) {
      return this.$$deferred.promise.catch(handler);
    }
    finally (handler) {
      return this.$$deferred.promise.finally(handler);
    }
  };
}
factory.$inject = ['$interval', '$q'];

export default factory;
