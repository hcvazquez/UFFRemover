/*
  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    babel = require('gulp-babel'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tagVersion = require('gulp-tag-version'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    lazypipe = require('lazypipe'),
    eslint = require('gulp-eslint'),
    fs = require('fs');

/*require('babel-register')({
    only: /JSAnalyzer\/(src|test)\//
});*/

var TEST = [ 'test/*.js' ];
var SOURCE = [ 'src/**/*.js' ];

var ESLINT_OPTION = {
    rules: {
        'quotes': 0,
        'eqeqeq': 0,
        'no-use-before-define': 0,
        'no-shadow': 0,
        'no-new': 0,
        'no-underscore-dangle': 0,
        'no-multi-spaces': 0,
        'no-native-reassign': 0,
        'no-loop-func': 0,
        'no-lone-blocks': 0
    },
    ecmaFeatures: {
        jsx: false,
        modules: true
    },
    env: {
        node: true,
        es6: true
    }
};

var BABEL_OPTIONS = JSON.parse(fs.readFileSync('.babelrc', { encoding: 'utf8' }));

var build = lazypipe()
    .pipe(sourcemaps.init)
    .pipe(babel, BABEL_OPTIONS)
    .pipe(sourcemaps.write)
    .pipe(gulp.dest, 'lib');

gulp.task('build-for-watch', function () {
    return gulp.src(SOURCE).pipe(plumber()).pipe(build());
});

gulp.task('build', function () {
    return gulp.src(SOURCE).pipe(build());
});

var through = function (file) {
    return through(function (buf, enc, next) {
        this.push(buf.toString('utf8').replace("a", "@"));
    });
};

gulp.task('test', [ 'build' ], function () {
    return gulp.src(TEST)
        .pipe(mocha({
            reporter: 'spec',
            timeout: 100000 // 100s
        }));
});

gulp.task('browserify', [ 'build' ], function () {
    return browserify({
        entries: [ './lib/task/instrumentor.js' ]
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('watch', [ 'build-for-watch' ], function () {
    gulp.watch(SOURCE, [ 'build-for-watch' ]);
});

// Currently, not works for ES6.
gulp.task('lint', function () {
    return gulp.src(SOURCE)
        .pipe(eslint(ESLINT_OPTION))
        .pipe(eslint.formatEach('stylish', process.stderr))
        .pipe(eslint.failOnError());
});

gulp.task('travis', [ 'test' ]);
gulp.task('default', [ 'travis' ]);
