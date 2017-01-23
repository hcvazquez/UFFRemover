'use strict';

import angular from 'angular';
import directive from './directive';
import service from './service';

export default angular.module('countdown', [])
  .directive('countdown', directive)
  .factory('CountdownTimer', service)
  .name;
