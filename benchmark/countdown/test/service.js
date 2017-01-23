'use strict';

import angular from 'angular';
import {expect} from 'chai';
import sinon from 'sinon';

export default function () {

  let CountdownTimer, timer, $interval;
  beforeEach(angular.mock.inject(function (_CountdownTimer_, _$interval_) {
    CountdownTimer = _CountdownTimer_;
    timer = new CountdownTimer(1500);
    $interval = _$interval_;
  }));

  describe('Constructor', function () {

    it('captures the length', function () {
      expect(timer).to.have.property('length', 1500);
    });

    it('can set options', function () {
      expect(new CountdownTimer(1000, {
        tickInterval: 30
      }))
      .to.have.deep.property('options.tickInterval', 30);
    });

  });

  describe('#start', function () {

    it('emits a tick every interval', function () {
      const onTick = sinon.spy();
      timer.on('tick', onTick);
      timer.start();
      expect(onTick.callCount).to.equal(0);
      $interval.flush(15);
      expect(onTick.callCount).to.equal(1);
      $interval.flush(15);
      expect(onTick.callCount).to.equal(2);
    });

    it('emits the tick proportion', function () {
      const onTick = sinon.spy();
      timer.on('tick', onTick);
      timer.start();
      $interval.flush(15);
      expect(onTick.firstCall.args[0]).to.equal(.01);
    });

    it('emits a done event when complete', function () {
      timer = new CountdownTimer(2, {
        tickInterval: 1
      });
      const onDone = sinon.spy();
      timer.on('done', onDone);
      timer.start();
      $interval.flush(2);
      expect(onDone.callCount).to.equal(1);
    });

    it('returns itself', function () {
      expect(timer.start()).to.equal(timer);
    });

  });

  describe('#cancel', function () {

    it('is a noop if not started', function () {
      timer.cancel();
    });

    it('cancels the interval', function () {
      const onTick = sinon.spy();
      timer.on('tick', onTick);
      timer.start();
      timer.cancel();
      $interval.flush(15);
      expect(onTick.callCount).to.equal(0);
    });

    it('emits a done event', function () {
      const onDone = sinon.spy();
      timer.on('done', onDone);
      timer.start();
      timer.cancel();
      expect(onDone.callCount).to.equal(1);
    });

  });

}
