'use strict';

var _chai = require('chai');

var _espree = require('../third_party/espree');

var _espree2 = _interopRequireDefault(_espree);

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('References:', function () {
    describe('When there is a `let` declaration on global,', function () {
        it('the reference on global should be resolved.', function () {
            var ast = (0, _espree2.default)('let a = 0;');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(1);

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(1);
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });

        it('the reference in functions should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                let a = 0;\n                function foo() {\n                    let b = a;\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

            var scope = scopeManager.scopes[1];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });

        it('the reference in default parameters should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                let a = 0;\n                function foo(b = a) {\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

            var scope = scopeManager.scopes[1];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });
    });

    describe('When there is a `const` declaration on global,', function () {
        it('the reference on global should be resolved.', function () {
            var ast = (0, _espree2.default)('const a = 0;');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(1);

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(1);
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });

        it('the reference in functions should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                const a = 0;\n                function foo() {\n                    const b = a;\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

            var scope = scopeManager.scopes[1];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });
    });

    describe('When there is a `var` declaration on global,', function () {
        it('the reference on global should NOT be resolved.', function () {
            var ast = (0, _espree2.default)('var a = 0;');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(1);

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(1);
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.be.null;
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });

        it('the reference in functions should NOT be resolved.', function () {
            var ast = (0, _espree2.default)('\n                var a = 0;\n                function foo() {\n                    var b = a;\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

            var scope = scopeManager.scopes[1];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.be.null;
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });
    });

    describe('When there is a `function` declaration on global,', function () {
        it('the reference on global should NOT be resolved.', function () {
            var ast = (0, _espree2.default)('\n                function a() {}\n                a();\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, a]

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(1);
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.be.null;
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });

        it('the reference in functions should NOT be resolved.', function () {
            var ast = (0, _espree2.default)('\n                function a() {}\n                function foo() {\n                    let b = a();\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(3); // [global, a, foo]

            var scope = scopeManager.scopes[2];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.be.null;
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });
    });

    describe('When there is a `class` declaration on global,', function () {
        it('the reference on global should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                class A {}\n                let b = new A();\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, A]

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [A, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, A]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('A');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });

        it('the reference in functions should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                class A {}\n                function foo() {\n                    let b = new A();\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(3); // [global, A, foo]

            var scope = scopeManager.scopes[2];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, A]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('A');
            (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });
    });

    describe('When there is a `let` declaration in functions,', function () {
        it('the reference on the function should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                function foo() {\n                    let a = 0;\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

            var scope = scopeManager.scopes[1];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, a]
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[1]);
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });

        it('the reference in nested functions should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                function foo() {\n                    let a = 0;\n                    function bar() {\n                        let b = a;\n                    }\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(3); // [global, foo, bar]

            var scope = scopeManager.scopes[2];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[1].variables[1]);
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });
    });

    describe('When there is a `var` declaration in functions,', function () {
        it('the reference on the function should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                function foo() {\n                    var a = 0;\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

            var scope = scopeManager.scopes[1];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, a]
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[1]);
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });

        it('the reference in nested functions should be resolved.', function () {
            var ast = (0, _espree2.default)('\n                function foo() {\n                    var a = 0;\n                    function bar() {\n                        var b = a;\n                    }\n                }\n            ');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(3); // [global, foo, bar]

            var scope = scopeManager.scopes[2];
            (0, _chai.expect)(scope.variables).to.have.length(2); // [arguments, b]
            (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

            var reference = scope.references[1];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[1].variables[1]);
            (0, _chai.expect)(reference.writeExpr).to.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.false;
            (0, _chai.expect)(reference.isRead()).to.be.true;
        });
    });

    describe('When there is a `let` declaration with destructuring assignment', function () {
        it('"let [a] = [1];", the reference should be resolved.', function () {
            var ast = (0, _espree2.default)('let [a] = [1];');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(1);

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(1);
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });

        it('"let {a} = {a: 1};", the reference should be resolved.', function () {
            var ast = (0, _espree2.default)('let {a} = {a: 1};');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(1);

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(1);
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });

        it('"let {a: {a}} = {a: {a: 1}};", the reference should be resolved.', function () {
            var ast = (0, _espree2.default)('let {a: {a}} = {a: {a: 1}};');

            var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
            (0, _chai.expect)(scopeManager.scopes).to.have.length(1);

            var scope = scopeManager.scopes[0];
            (0, _chai.expect)(scope.variables).to.have.length(1);
            (0, _chai.expect)(scope.references).to.have.length(1);

            var reference = scope.references[0];
            (0, _chai.expect)(reference.from).to.equal(scope);
            (0, _chai.expect)(reference.identifier.name).to.equal('a');
            (0, _chai.expect)(reference.resolved).to.equal(scope.variables[0]);
            (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
            (0, _chai.expect)(reference.isWrite()).to.be.true;
            (0, _chai.expect)(reference.isRead()).to.be.false;
        });
    });

    describe('Reference.init should be a boolean value of whether it is one to initialize or not.', function () {
        var trueCodes = ['var a = 0;', 'let a = 0;', 'const a = 0;', 'var [a] = [];', 'let [a] = [];', 'const [a] = [];', 'var [a = 1] = [];', 'let [a = 1] = [];', 'const [a = 1] = [];', 'var {a} = {};', 'let {a} = {};', 'const {a} = {};', 'var {b: a} = {};', 'let {b: a} = {};', 'const {b: a} = {};', 'var {b: a = 0} = {};', 'let {b: a = 0} = {};', 'const {b: a = 0} = {};', 'for (var a in []);', 'for (let a in []);', 'for (var [a] in []);', 'for (let [a] in []);', 'for (var [a = 0] in []);', 'for (let [a = 0] in []);', 'for (var {a} in []);', 'for (let {a} in []);', 'for (var {a = 0} in []);', 'for (let {a = 0} in []);', 'new function(a = 0) {}', 'new function([a = 0] = []) {}', 'new function({b: a = 0} = {}) {}'];

        trueCodes.forEach(function (code) {
            return it('"' + code + '", all references should be true.', function () {
                var ast = (0, _espree2.default)(code);

                var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                (0, _chai.expect)(scopeManager.scopes).to.be.length.of.at.least(1);

                var scope = scopeManager.scopes[scopeManager.scopes.length - 1];
                (0, _chai.expect)(scope.variables).to.have.length.of.at.least(1);
                (0, _chai.expect)(scope.references).to.have.length.of.at.least(1);

                scope.references.forEach(function (reference) {
                    (0, _chai.expect)(reference.identifier.name).to.equal('a');
                    (0, _chai.expect)(reference.isWrite()).to.be.true;
                    (0, _chai.expect)(reference.init).to.be.true;
                });
            });
        });

        var falseCodes = ['let a; a = 0;', 'let a; [a] = [];', 'let a; [a = 1] = [];', 'let a; ({a}) = {};', 'let a; ({b: a}) = {};', 'let a; ({b: a = 0}) = {};', 'let a; for (a in []);', 'let a; for ([a] in []);', 'let a; for ([a = 0] in []);', 'let a; for ({a} in []);', 'let a; for ({a = 0} in []);'];
        falseCodes.forEach(function (code) {
            return it('"' + code + '", all references should be false.', function () {
                var ast = (0, _espree2.default)(code);

                var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                (0, _chai.expect)(scopeManager.scopes).to.be.length.of.at.least(1);

                var scope = scopeManager.scopes[scopeManager.scopes.length - 1];
                (0, _chai.expect)(scope.variables).to.have.length(1);
                (0, _chai.expect)(scope.references).to.have.length.of.at.least(1);

                scope.references.forEach(function (reference) {
                    (0, _chai.expect)(reference.identifier.name).to.equal('a');
                    (0, _chai.expect)(reference.isWrite()).to.be.true;
                    (0, _chai.expect)(reference.init).to.be.false;
                });
            });
        });

        falseCodes = ['let a; let b = a;', 'let a; let [b] = a;', 'let a; let [b = a] = [];', 'let a; for (var b in a);', 'let a; for (var [b = a] in []);', 'let a; for (let b in a);', 'let a; for (let [b = a] in []);', 'let a,b; b = a;', 'let a,b; [b] = a;', 'let a,b; [b = a] = [];', 'let a,b; for (b in a);', 'let a,b; for ([b = a] in []);', 'let a; a.foo = 0;', 'let a,b; b = a.foo;'];
        falseCodes.forEach(function (code) {
            return it('"' + code + '", readonly references of "a" should be undefined.', function () {
                var ast = (0, _espree2.default)(code);

                var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                (0, _chai.expect)(scopeManager.scopes).to.be.length.of.at.least(1);

                var scope = scopeManager.scopes[0];
                (0, _chai.expect)(scope.variables).to.have.length.of.at.least(1);
                (0, _chai.expect)(scope.variables[0].name).to.equal('a');

                var references = scope.variables[0].references;

                (0, _chai.expect)(references).to.have.length.of.at.least(1);

                references.forEach(function (reference) {
                    (0, _chai.expect)(reference.isRead()).to.be.true;
                    (0, _chai.expect)(reference.init).to.be.undefined;
                });
            });
        });
    });
});

// vim: set sw=4 ts=4 et tw=80 :
// -*- coding: utf-8 -*-
//  Copyright (C) 2015 Toru Nagashima
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
//  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
//  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
//  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
//  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZmVyZW5jZXMuanMiXSwibmFtZXMiOlsiZGVzY3JpYmUiLCJpdCIsImFzdCIsInNjb3BlTWFuYWdlciIsImVjbWFWZXJzaW9uIiwic2NvcGVzIiwidG8iLCJoYXZlIiwibGVuZ3RoIiwic2NvcGUiLCJ2YXJpYWJsZXMiLCJyZWZlcmVuY2VzIiwicmVmZXJlbmNlIiwiZnJvbSIsImVxdWFsIiwiaWRlbnRpZmllciIsIm5hbWUiLCJyZXNvbHZlZCIsIndyaXRlRXhwciIsIm5vdCIsImJlIiwidW5kZWZpbmVkIiwiaXNXcml0ZSIsInRydWUiLCJpc1JlYWQiLCJmYWxzZSIsIm51bGwiLCJ0cnVlQ29kZXMiLCJmb3JFYWNoIiwiY29kZSIsIm9mIiwiYXQiLCJsZWFzdCIsImluaXQiLCJmYWxzZUNvZGVzIl0sIm1hcHBpbmdzIjoiOztBQXVCQTs7QUFDQTs7OztBQUNBOzs7O0FBRUFBLFNBQVMsYUFBVCxFQUF3QixZQUFXO0FBQy9CQSxhQUFTLDhDQUFULEVBQXlELFlBQVc7QUFDaEVDLFdBQUcsNkNBQUgsRUFBa0QsWUFBVztBQUN6RCxnQkFBTUMsTUFBTSxtQ0FBWjs7QUFFQSxnQkFBTUMsZUFBZSxlQUFRRCxHQUFSLEVBQWEsRUFBQ0UsYUFBYSxDQUFkLEVBQWIsQ0FBckI7QUFDQSw4QkFBT0QsYUFBYUUsTUFBcEIsRUFBNEJDLEVBQTVCLENBQStCQyxJQUEvQixDQUFvQ0MsTUFBcEMsQ0FBMkMsQ0FBM0M7O0FBRUEsZ0JBQU1DLFFBQVFOLGFBQWFFLE1BQWIsQ0FBb0IsQ0FBcEIsQ0FBZDtBQUNBLDhCQUFPSSxNQUFNQyxTQUFiLEVBQXdCSixFQUF4QixDQUEyQkMsSUFBM0IsQ0FBZ0NDLE1BQWhDLENBQXVDLENBQXZDO0FBQ0EsOEJBQU9DLE1BQU1FLFVBQWIsRUFBeUJMLEVBQXpCLENBQTRCQyxJQUE1QixDQUFpQ0MsTUFBakMsQ0FBd0MsQ0FBeEM7O0FBRUEsZ0JBQU1JLFlBQVlILE1BQU1FLFVBQU4sQ0FBaUIsQ0FBakIsQ0FBbEI7QUFDQSw4QkFB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N0MsQ0FBbUQsQ0FBbkQ7QUFDQSxrQ0FBT3ZCLE1BQU1DLFNBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUJNLElBQTFCLEVBQWdDVixFQUFoQyxDQUFtQ1EsS0FBbkMsQ0FBeUMsR0FBekM7O0FBUndFLG9CQVVoRUgsVUFWZ0UsR0FVakRGLE1BQU1DLFNBQU4sQ0FBZ0IsQ0FBaEIsQ0FWaUQsQ0FVaEVDLFVBVmdFOztBQVd4RSxrQ0FBT0EsVUFBUCxFQUFtQkwsRUFBbkIsQ0FBc0JDLElBQXRCLENBQTJCQyxNQUEzQixDQUFrQ3NCLEVBQWxDLENBQXFDQyxFQUFyQyxDQUF3Q0MsS0FBeEMsQ0FBOEMsQ0FBOUM7O0FBRUFyQiwyQkFBV2lCLE9BQVgsQ0FBbUIscUJBQWE7QUFDNUIsc0NBQU9oQixVQUFVWSxNQUFWLEVBQVAsRUFBMkJsQixFQUEzQixDQUE4QmMsRUFBOUIsQ0FBaUNHLElBQWpDO0FBQ0Esc0NBQU9YLFVBQVVxQixJQUFqQixFQUF1QjNCLEVBQXZCLENBQTBCYyxFQUExQixDQUE2QkMsU0FBN0I7QUFDSCxpQkFIRDtBQUlILGFBakJELENBRGU7QUFBQSxTQUFuQjtBQW9CSCxLQTFIRDtBQTJISCxDQTNoQkQ7O0FBNmhCQTtBQXhqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicmVmZXJlbmNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0qLSBjb2Rpbmc6IHV0Zi04IC0qLVxuLy8gIENvcHlyaWdodCAoQykgMjAxNSBUb3J1IE5hZ2FzaGltYVxuLy9cbi8vICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbi8vICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbi8vXG4vLyAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4vLyAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbi8vICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbi8vICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuLy8gICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuLy9cbi8vICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuLy8gIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbi8vICBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuLy8gIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCA8Q09QWVJJR0hUIEhPTERFUj4gQkUgTElBQkxFIEZPUiBBTllcbi8vICBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuLy8gIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbi8vICBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkRcbi8vICBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuLy8gIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRlxuLy8gIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG5cbmltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IGVzcHJlZSBmcm9tICcuLi90aGlyZF9wYXJ0eS9lc3ByZWUnO1xuaW1wb3J0IHsgYW5hbHl6ZSB9IGZyb20gJy4uJztcblxuZGVzY3JpYmUoJ1JlZmVyZW5jZXM6JywgZnVuY3Rpb24oKSB7XG4gICAgZGVzY3JpYmUoJ1doZW4gdGhlcmUgaXMgYSBgbGV0YCBkZWNsYXJhdGlvbiBvbiBnbG9iYWwsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCd0aGUgcmVmZXJlbmNlIG9uIGdsb2JhbCBzaG91bGQgYmUgcmVzb2x2ZWQuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYGxldCBhID0gMDtgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMF07XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgxKTtcblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZS52YXJpYWJsZXNbMF0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBpbiBmdW5jdGlvbnMgc2hvdWxkIGJlIHJlc29sdmVkLicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgICAgICBsZXQgYSA9IDA7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9vKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlTWFuYWdlciA9IGFuYWx5emUoYXN0LCB7ZWNtYVZlcnNpb246IDZ9KTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFtnbG9iYWwsIGZvb11cblxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzFdO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbYXJndW1lbnRzLCBiXVxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIGFdXG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMV07XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uZXF1YWwoc2NvcGVNYW5hZ2VyLnNjb3Blc1swXS52YXJpYWJsZXNbMF0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLnRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0aGUgcmVmZXJlbmNlIGluIGRlZmF1bHQgcGFyYW1ldGVycyBzaG91bGQgYmUgcmVzb2x2ZWQuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYFxuICAgICAgICAgICAgICAgIGxldCBhID0gMDtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmb28oYiA9IGEpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2dsb2JhbCwgZm9vXVxuXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMV07XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFthcmd1bWVudHMsIGJdXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbYiwgYV1cblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1sxXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZU1hbmFnZXIuc2NvcGVzWzBdLnZhcmlhYmxlc1swXSk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLndyaXRlRXhwcikudG8uYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1dyaXRlKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1JlYWQoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnV2hlbiB0aGVyZSBpcyBhIGBjb25zdGAgZGVjbGFyYXRpb24gb24gZ2xvYmFsLCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBvbiBnbG9iYWwgc2hvdWxkIGJlIHJlc29sdmVkLicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBjb25zdCBhID0gMDtgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMF07XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgxKTtcblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZS52YXJpYWJsZXNbMF0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBpbiBmdW5jdGlvbnMgc2hvdWxkIGJlIHJlc29sdmVkLicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gMDtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmb28oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbZ2xvYmFsLCBmb29dXG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2FyZ3VtZW50cywgYl1cbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFtiLCBhXVxuXG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBzY29wZS5yZWZlcmVuY2VzWzFdO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5mcm9tKS50by5lcXVhbChzY29wZSk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlkZW50aWZpZXIubmFtZSkudG8uZXF1YWwoJ2EnKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UucmVzb2x2ZWQpLnRvLmVxdWFsKHNjb3BlTWFuYWdlci5zY29wZXNbMF0udmFyaWFibGVzWzBdKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2Uud3JpdGVFeHByKS50by5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUuZmFsc2U7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzUmVhZCgpKS50by5iZS50cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXaGVuIHRoZXJlIGlzIGEgYHZhcmAgZGVjbGFyYXRpb24gb24gZ2xvYmFsLCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBvbiBnbG9iYWwgc2hvdWxkIE5PVCBiZSByZXNvbHZlZC4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgdmFyIGEgPSAwO2ApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBzY29wZS5yZWZlcmVuY2VzWzBdO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5mcm9tKS50by5lcXVhbChzY29wZSk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlkZW50aWZpZXIubmFtZSkudG8uZXF1YWwoJ2EnKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UucmVzb2x2ZWQpLnRvLmJlLm51bGw7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLndyaXRlRXhwcikudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS50cnVlO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1JlYWQoKSkudG8uYmUuZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd0aGUgcmVmZXJlbmNlIGluIGZ1bmN0aW9ucyBzaG91bGQgTk9UIGJlIHJlc29sdmVkLicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgICAgICB2YXIgYSA9IDA7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9vKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlTWFuYWdlciA9IGFuYWx5emUoYXN0LCB7ZWNtYVZlcnNpb246IDZ9KTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFtnbG9iYWwsIGZvb11cblxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzFdO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbYXJndW1lbnRzLCBiXVxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIGFdXG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMV07XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uYmUubnVsbDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2Uud3JpdGVFeHByKS50by5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUuZmFsc2U7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzUmVhZCgpKS50by5iZS50cnVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXaGVuIHRoZXJlIGlzIGEgYGZ1bmN0aW9uYCBkZWNsYXJhdGlvbiBvbiBnbG9iYWwsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCd0aGUgcmVmZXJlbmNlIG9uIGdsb2JhbCBzaG91bGQgTk9UIGJlIHJlc29sdmVkLicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhKCkge31cbiAgICAgICAgICAgICAgICBhKCk7XG4gICAgICAgICAgICBgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2dsb2JhbCwgYV1cblxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzBdO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgoMSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlcykudG8uaGF2ZS5sZW5ndGgoMSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMF07XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uYmUubnVsbDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2Uud3JpdGVFeHByKS50by5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUuZmFsc2U7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzUmVhZCgpKS50by5iZS50cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBpbiBmdW5jdGlvbnMgc2hvdWxkIE5PVCBiZSByZXNvbHZlZC4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYSgpIHt9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9vKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IGEoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDMpOyAgLy8gW2dsb2JhbCwgYSwgZm9vXVxuXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMl07XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFthcmd1bWVudHMsIGJdXG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbYiwgYV1cblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1sxXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5iZS5udWxsO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLnRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1doZW4gdGhlcmUgaXMgYSBgY2xhc3NgIGRlY2xhcmF0aW9uIG9uIGdsb2JhbCwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaXQoJ3RoZSByZWZlcmVuY2Ugb24gZ2xvYmFsIHNob3VsZCBiZSByZXNvbHZlZC4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICAgICAgY2xhc3MgQSB7fVxuICAgICAgICAgICAgICAgIGxldCBiID0gbmV3IEEoKTtcbiAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbZ2xvYmFsLCBBXVxuXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMF07XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFtBLCBiXVxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIEFdXG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMV07XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnQScpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uZXF1YWwoc2NvcGUudmFyaWFibGVzWzBdKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2Uud3JpdGVFeHByKS50by5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUuZmFsc2U7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzUmVhZCgpKS50by5iZS50cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBpbiBmdW5jdGlvbnMgc2hvdWxkIGJlIHJlc29sdmVkLicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgICAgICBjbGFzcyBBIHt9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9vKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYiA9IG5ldyBBKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlTWFuYWdlciA9IGFuYWx5emUoYXN0LCB7ZWNtYVZlcnNpb246IDZ9KTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5oYXZlLmxlbmd0aCgzKTsgIC8vIFtnbG9iYWwsIEEsIGZvb11cblxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzJdO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbYXJndW1lbnRzLCBiXVxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIEFdXG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMV07XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnQScpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uZXF1YWwoc2NvcGVNYW5hZ2VyLnNjb3Blc1swXS52YXJpYWJsZXNbMF0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLnRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1doZW4gdGhlcmUgaXMgYSBgbGV0YCBkZWNsYXJhdGlvbiBpbiBmdW5jdGlvbnMsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCd0aGUgcmVmZXJlbmNlIG9uIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgcmVzb2x2ZWQuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvbygpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGEgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbZ2xvYmFsLCBmb29dXG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2FyZ3VtZW50cywgYV1cbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgxKTtcblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZS52YXJpYWJsZXNbMV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBpbiBuZXN0ZWQgZnVuY3Rpb25zIHNob3VsZCBiZSByZXNvbHZlZC4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9vKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGJhcigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiID0gYTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMyk7ICAvLyBbZ2xvYmFsLCBmb28sIGJhcl1cblxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzJdO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbYXJndW1lbnRzLCBiXVxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIGFdXG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMV07XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uZXF1YWwoc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXS52YXJpYWJsZXNbMV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLnRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1doZW4gdGhlcmUgaXMgYSBgdmFyYCBkZWNsYXJhdGlvbiBpbiBmdW5jdGlvbnMsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGl0KCd0aGUgcmVmZXJlbmNlIG9uIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgcmVzb2x2ZWQuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvbygpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbZ2xvYmFsLCBmb29dXG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2FyZ3VtZW50cywgYV1cbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgxKTtcblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZS52YXJpYWJsZXNbMV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgndGhlIHJlZmVyZW5jZSBpbiBuZXN0ZWQgZnVuY3Rpb25zIHNob3VsZCBiZSByZXNvbHZlZC4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9vKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGJhcigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiID0gYTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMyk7ICAvLyBbZ2xvYmFsLCBmb28sIGJhcl1cblxuICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzJdO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgoMik7ICAvLyBbYXJndW1lbnRzLCBiXVxuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIGFdXG5cbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMV07XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uZXF1YWwoc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXS52YXJpYWJsZXNbMV0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLnRydWU7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1doZW4gdGhlcmUgaXMgYSBgbGV0YCBkZWNsYXJhdGlvbiB3aXRoIGRlc3RydWN0dXJpbmcgYXNzaWdubWVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpdCgnXCJsZXQgW2FdID0gWzFdO1wiLCB0aGUgcmVmZXJlbmNlIHNob3VsZCBiZSByZXNvbHZlZC4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgbGV0IFthXSA9IFsxXTtgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMF07XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgxKTtcblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZS52YXJpYWJsZXNbMF0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnXCJsZXQge2F9ID0ge2E6IDF9O1wiLCB0aGUgcmVmZXJlbmNlIHNob3VsZCBiZSByZXNvbHZlZC4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgbGV0IHthfSA9IHthOiAxfTtgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMF07XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgxKTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgxKTtcblxuICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZS52YXJpYWJsZXNbMF0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS53cml0ZUV4cHIpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnXCJsZXQge2E6IHthfX0gPSB7YToge2E6IDF9fTtcIiwgdGhlIHJlZmVyZW5jZSBzaG91bGQgYmUgcmVzb2x2ZWQuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYGxldCB7YToge2F9fSA9IHthOiB7YTogMX19O2ApO1xuXG4gICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1swXTtcbiAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBzY29wZS5yZWZlcmVuY2VzWzBdO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5mcm9tKS50by5lcXVhbChzY29wZSk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlkZW50aWZpZXIubmFtZSkudG8uZXF1YWwoJ2EnKTtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UucmVzb2x2ZWQpLnRvLmVxdWFsKHNjb3BlLnZhcmlhYmxlc1swXSk7XG4gICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLndyaXRlRXhwcikudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS50cnVlO1xuICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1JlYWQoKSkudG8uYmUuZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1JlZmVyZW5jZS5pbml0IHNob3VsZCBiZSBhIGJvb2xlYW4gdmFsdWUgb2Ygd2hldGhlciBpdCBpcyBvbmUgdG8gaW5pdGlhbGl6ZSBvciBub3QuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHRydWVDb2RlcyA9IFtcbiAgICAgICAgICAgICd2YXIgYSA9IDA7JyxcbiAgICAgICAgICAgICdsZXQgYSA9IDA7JyxcbiAgICAgICAgICAgICdjb25zdCBhID0gMDsnLFxuICAgICAgICAgICAgJ3ZhciBbYV0gPSBbXTsnLFxuICAgICAgICAgICAgJ2xldCBbYV0gPSBbXTsnLFxuICAgICAgICAgICAgJ2NvbnN0IFthXSA9IFtdOycsXG4gICAgICAgICAgICAndmFyIFthID0gMV0gPSBbXTsnLFxuICAgICAgICAgICAgJ2xldCBbYSA9IDFdID0gW107JyxcbiAgICAgICAgICAgICdjb25zdCBbYSA9IDFdID0gW107JyxcbiAgICAgICAgICAgICd2YXIge2F9ID0ge307JyxcbiAgICAgICAgICAgICdsZXQge2F9ID0ge307JyxcbiAgICAgICAgICAgICdjb25zdCB7YX0gPSB7fTsnLFxuICAgICAgICAgICAgJ3ZhciB7YjogYX0gPSB7fTsnLFxuICAgICAgICAgICAgJ2xldCB7YjogYX0gPSB7fTsnLFxuICAgICAgICAgICAgJ2NvbnN0IHtiOiBhfSA9IHt9OycsXG4gICAgICAgICAgICAndmFyIHtiOiBhID0gMH0gPSB7fTsnLFxuICAgICAgICAgICAgJ2xldCB7YjogYSA9IDB9ID0ge307JyxcbiAgICAgICAgICAgICdjb25zdCB7YjogYSA9IDB9ID0ge307JyxcbiAgICAgICAgICAgICdmb3IgKHZhciBhIGluIFtdKTsnLFxuICAgICAgICAgICAgJ2ZvciAobGV0IGEgaW4gW10pOycsXG4gICAgICAgICAgICAnZm9yICh2YXIgW2FdIGluIFtdKTsnLFxuICAgICAgICAgICAgJ2ZvciAobGV0IFthXSBpbiBbXSk7JyxcbiAgICAgICAgICAgICdmb3IgKHZhciBbYSA9IDBdIGluIFtdKTsnLFxuICAgICAgICAgICAgJ2ZvciAobGV0IFthID0gMF0gaW4gW10pOycsXG4gICAgICAgICAgICAnZm9yICh2YXIge2F9IGluIFtdKTsnLFxuICAgICAgICAgICAgJ2ZvciAobGV0IHthfSBpbiBbXSk7JyxcbiAgICAgICAgICAgICdmb3IgKHZhciB7YSA9IDB9IGluIFtdKTsnLFxuICAgICAgICAgICAgJ2ZvciAobGV0IHthID0gMH0gaW4gW10pOycsXG4gICAgICAgICAgICAnbmV3IGZ1bmN0aW9uKGEgPSAwKSB7fScsXG4gICAgICAgICAgICAnbmV3IGZ1bmN0aW9uKFthID0gMF0gPSBbXSkge30nLFxuICAgICAgICAgICAgJ25ldyBmdW5jdGlvbih7YjogYSA9IDB9ID0ge30pIHt9J1xuICAgICAgICBdO1xuXG4gICAgICAgIHRydWVDb2Rlcy5mb3JFYWNoKGNvZGUgPT5cbiAgICAgICAgICAgIGl0KGBcIiR7Y29kZX1cIiwgYWxsIHJlZmVyZW5jZXMgc2hvdWxkIGJlIHRydWUuYCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGNvZGUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5iZS5sZW5ndGgub2YuYXQubGVhc3QoMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbc2NvcGVNYW5hZ2VyLnNjb3Blcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aC5vZi5hdC5sZWFzdCgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlcykudG8uaGF2ZS5sZW5ndGgub2YuYXQubGVhc3QoMSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5yZWZlcmVuY2VzLmZvckVhY2gocmVmZXJlbmNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS50cnVlO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmluaXQpLnRvLmJlLnRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIGxldCBmYWxzZUNvZGVzID0gW1xuICAgICAgICAgICAgJ2xldCBhOyBhID0gMDsnLFxuICAgICAgICAgICAgJ2xldCBhOyBbYV0gPSBbXTsnLFxuICAgICAgICAgICAgJ2xldCBhOyBbYSA9IDFdID0gW107JyxcbiAgICAgICAgICAgICdsZXQgYTsgKHthfSkgPSB7fTsnLFxuICAgICAgICAgICAgJ2xldCBhOyAoe2I6IGF9KSA9IHt9OycsXG4gICAgICAgICAgICAnbGV0IGE7ICh7YjogYSA9IDB9KSA9IHt9OycsXG4gICAgICAgICAgICAnbGV0IGE7IGZvciAoYSBpbiBbXSk7JyxcbiAgICAgICAgICAgICdsZXQgYTsgZm9yIChbYV0gaW4gW10pOycsXG4gICAgICAgICAgICAnbGV0IGE7IGZvciAoW2EgPSAwXSBpbiBbXSk7JyxcbiAgICAgICAgICAgICdsZXQgYTsgZm9yICh7YX0gaW4gW10pOycsXG4gICAgICAgICAgICAnbGV0IGE7IGZvciAoe2EgPSAwfSBpbiBbXSk7J1xuICAgICAgICBdO1xuICAgICAgICBmYWxzZUNvZGVzLmZvckVhY2goY29kZSA9PlxuICAgICAgICAgICAgaXQoYFwiJHtjb2RlfVwiLCBhbGwgcmVmZXJlbmNlcyBzaG91bGQgYmUgZmFsc2UuYCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGNvZGUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5iZS5sZW5ndGgub2YuYXQubGVhc3QoMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbc2NvcGVNYW5hZ2VyLnNjb3Blcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUudmFyaWFibGVzKS50by5oYXZlLmxlbmd0aCgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlcykudG8uaGF2ZS5sZW5ndGgub2YuYXQubGVhc3QoMSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5yZWZlcmVuY2VzLmZvckVhY2gocmVmZXJlbmNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdhJyk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS50cnVlO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmluaXQpLnRvLmJlLmZhbHNlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIGZhbHNlQ29kZXMgPSBbXG4gICAgICAgICAgICAnbGV0IGE7IGxldCBiID0gYTsnLFxuICAgICAgICAgICAgJ2xldCBhOyBsZXQgW2JdID0gYTsnLFxuICAgICAgICAgICAgJ2xldCBhOyBsZXQgW2IgPSBhXSA9IFtdOycsXG4gICAgICAgICAgICAnbGV0IGE7IGZvciAodmFyIGIgaW4gYSk7JyxcbiAgICAgICAgICAgICdsZXQgYTsgZm9yICh2YXIgW2IgPSBhXSBpbiBbXSk7JyxcbiAgICAgICAgICAgICdsZXQgYTsgZm9yIChsZXQgYiBpbiBhKTsnLFxuICAgICAgICAgICAgJ2xldCBhOyBmb3IgKGxldCBbYiA9IGFdIGluIFtdKTsnLFxuICAgICAgICAgICAgJ2xldCBhLGI7IGIgPSBhOycsXG4gICAgICAgICAgICAnbGV0IGEsYjsgW2JdID0gYTsnLFxuICAgICAgICAgICAgJ2xldCBhLGI7IFtiID0gYV0gPSBbXTsnLFxuICAgICAgICAgICAgJ2xldCBhLGI7IGZvciAoYiBpbiBhKTsnLFxuICAgICAgICAgICAgJ2xldCBhLGI7IGZvciAoW2IgPSBhXSBpbiBbXSk7JyxcbiAgICAgICAgICAgICdsZXQgYTsgYS5mb28gPSAwOycsXG4gICAgICAgICAgICAnbGV0IGEsYjsgYiA9IGEuZm9vOydcbiAgICAgICAgXTtcbiAgICAgICAgZmFsc2VDb2Rlcy5mb3JFYWNoKGNvZGUgPT5cbiAgICAgICAgICAgIGl0KGBcIiR7Y29kZX1cIiwgcmVhZG9ubHkgcmVmZXJlbmNlcyBvZiBcImFcIiBzaG91bGQgYmUgdW5kZWZpbmVkLmAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShjb2RlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNjb3BlTWFuYWdlciA9IGFuYWx5emUoYXN0LCB7ZWNtYVZlcnNpb246IDZ9KTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uYmUubGVuZ3RoLm9mLmF0LmxlYXN0KDEpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NvcGUgPSBzY29wZU1hbmFnZXIuc2NvcGVzWzBdO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoLm9mLmF0LmxlYXN0KDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXNbMF0ubmFtZSkudG8uZXF1YWwoJ2EnKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHsgcmVmZXJlbmNlcyB9ID0gc2NvcGUudmFyaWFibGVzWzBdO1xuICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aC5vZi5hdC5sZWFzdCgxKTtcblxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZXMuZm9yRWFjaChyZWZlcmVuY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzUmVhZCgpKS50by5iZS50cnVlO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmluaXQpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICB9KTtcbn0pO1xuXG4vLyB2aW06IHNldCBzdz00IHRzPTQgZXQgdHc9ODAgOlxuIl19
