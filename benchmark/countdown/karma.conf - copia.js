'use strict';

module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      './node_modules/angular/angular.js',
      './test/index.js'
    ],
    preprocessors: {
      './test/index.js': 'browserify'
    },
    browserify: {
      debug: true
    },
    browsers: ['PhantomJS']
  });
};
