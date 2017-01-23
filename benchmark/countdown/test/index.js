'use strict';

import angular from 'angular';
import 'angular-mocks';
import countdown from '../';
import service from './service';
import directive from './directive';

describe('angular-countdown', function () {

  beforeEach(angular.mock.module(countdown));
  describe('CountdownTimer service', service);
  describe('<countdown> directive', directive);

});
