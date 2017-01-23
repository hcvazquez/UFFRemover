'use strict';

var _chai = require('chai');

var _espree = require('../third_party/espree');

var _espree2 = _interopRequireDefault(_espree);

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ES6 default parameters:', function () {
    describe('a default parameter creates a writable reference for its initialization:', function () {
        var patterns = {
            FunctionDeclaration: 'function foo(a, b = 0) {}',
            FunctionExpression: 'let foo = function(a, b = 0) {};',
            ArrowExpression: 'let foo = (a, b = 0) => {};'
        };

        for (var name in patterns) {
            var code = patterns[name];
            (function (name, code) {
                it(name, function () {
                    var numVars = name === 'ArrowExpression' ? 2 : 3;
                    var ast = (0, _espree2.default)(code);

                    var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                    (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

                    var scope = scopeManager.scopes[1];
                    (0, _chai.expect)(scope.variables).to.have.length(numVars); // [arguments?, a, b]
                    (0, _chai.expect)(scope.references).to.have.length(1);

                    var reference = scope.references[0];
                    (0, _chai.expect)(reference.from).to.equal(scope);
                    (0, _chai.expect)(reference.identifier.name).to.equal('b');
                    (0, _chai.expect)(reference.resolved).to.equal(scope.variables[numVars - 1]);
                    (0, _chai.expect)(reference.writeExpr).to.not.be.undefined;
                    (0, _chai.expect)(reference.isWrite()).to.be.true;
                    (0, _chai.expect)(reference.isRead()).to.be.false;
                });
            })(name, code);
        }
    });

    describe('a default parameter creates a readable reference for references in right:', function () {
        var patterns = {
            FunctionDeclaration: '\n                let a;\n                function foo(b = a) {}\n            ',
            FunctionExpression: '\n                let a;\n                let foo = function(b = a) {}\n            ',
            ArrowExpression: '\n                let a;\n                let foo = (b = a) => {};\n            '
        };

        for (var name in patterns) {
            var code = patterns[name];
            (function (name, code) {
                it(name, function () {
                    var numVars = name === 'ArrowExpression' ? 1 : 2;
                    var ast = (0, _espree2.default)(code);

                    var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                    (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

                    var scope = scopeManager.scopes[1];
                    (0, _chai.expect)(scope.variables).to.have.length(numVars); // [arguments?, b]
                    (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

                    var reference = scope.references[1];
                    (0, _chai.expect)(reference.from).to.equal(scope);
                    (0, _chai.expect)(reference.identifier.name).to.equal('a');
                    (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
                    (0, _chai.expect)(reference.writeExpr).to.be.undefined;
                    (0, _chai.expect)(reference.isWrite()).to.be.false;
                    (0, _chai.expect)(reference.isRead()).to.be.true;
                });
            })(name, code);
        }
    });

    describe('a default parameter creates a readable reference for references in right (for const):', function () {
        var patterns = {
            FunctionDeclaration: '\n                const a = 0;\n                function foo(b = a) {}\n            ',
            FunctionExpression: '\n                const a = 0;\n                let foo = function(b = a) {}\n            ',
            ArrowExpression: '\n                const a = 0;\n                let foo = (b = a) => {};\n            '
        };

        for (var name in patterns) {
            var code = patterns[name];
            (function (name, code) {
                it(name, function () {
                    var numVars = name === 'ArrowExpression' ? 1 : 2;
                    var ast = (0, _espree2.default)(code);

                    var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                    (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

                    var scope = scopeManager.scopes[1];
                    (0, _chai.expect)(scope.variables).to.have.length(numVars); // [arguments?, b]
                    (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

                    var reference = scope.references[1];
                    (0, _chai.expect)(reference.from).to.equal(scope);
                    (0, _chai.expect)(reference.identifier.name).to.equal('a');
                    (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
                    (0, _chai.expect)(reference.writeExpr).to.be.undefined;
                    (0, _chai.expect)(reference.isWrite()).to.be.false;
                    (0, _chai.expect)(reference.isRead()).to.be.true;
                });
            })(name, code);
        }
    });

    describe('a default parameter creates a readable reference for references in right (partial):', function () {
        var patterns = {
            FunctionDeclaration: '\n                let a;\n                function foo(b = a.c) {}\n            ',
            FunctionExpression: '\n                let a;\n                let foo = function(b = a.c) {}\n            ',
            ArrowExpression: '\n                let a;\n                let foo = (b = a.c) => {};\n            '
        };

        for (var name in patterns) {
            var code = patterns[name];
            (function (name, code) {
                it(name, function () {
                    var numVars = name === 'ArrowExpression' ? 1 : 2;
                    var ast = (0, _espree2.default)(code);

                    var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                    (0, _chai.expect)(scopeManager.scopes).to.have.length(2); // [global, foo]

                    var scope = scopeManager.scopes[1];
                    (0, _chai.expect)(scope.variables).to.have.length(numVars); // [arguments?, b]
                    (0, _chai.expect)(scope.references).to.have.length(2); // [b, a]

                    var reference = scope.references[1];
                    (0, _chai.expect)(reference.from).to.equal(scope);
                    (0, _chai.expect)(reference.identifier.name).to.equal('a');
                    (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
                    (0, _chai.expect)(reference.writeExpr).to.be.undefined;
                    (0, _chai.expect)(reference.isWrite()).to.be.false;
                    (0, _chai.expect)(reference.isRead()).to.be.true;
                });
            })(name, code);
        }
    });

    describe('a default parameter creates a readable reference for references in right\'s nested scope:', function () {
        var patterns = {
            FunctionDeclaration: '\n                let a;\n                function foo(b = function() { return a; }) {}\n            ',
            FunctionExpression: '\n                let a;\n                let foo = function(b = function() { return a; }) {}\n            ',
            ArrowExpression: '\n                let a;\n                let foo = (b = function() { return a; }) => {};\n            '
        };

        for (var name in patterns) {
            var code = patterns[name];
            (function (name, code) {
                it(name, function () {
                    var ast = (0, _espree2.default)(code);

                    var scopeManager = (0, _.analyze)(ast, { ecmaVersion: 6 });
                    (0, _chai.expect)(scopeManager.scopes).to.have.length(3); // [global, foo, anonymous]

                    var scope = scopeManager.scopes[2];
                    (0, _chai.expect)(scope.variables).to.have.length(1); // [arguments]
                    (0, _chai.expect)(scope.references).to.have.length(1); // [a]

                    var reference = scope.references[0];
                    (0, _chai.expect)(reference.from).to.equal(scope);
                    (0, _chai.expect)(reference.identifier.name).to.equal('a');
                    (0, _chai.expect)(reference.resolved).to.equal(scopeManager.scopes[0].variables[0]);
                    (0, _chai.expect)(reference.writeExpr).to.be.undefined;
                    (0, _chai.expect)(reference.isWrite()).to.be.false;
                    (0, _chai.expect)(reference.isRead()).to.be.true;
                });
            })(name, code);
        }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi1kZWZhdWx0LXBhcmFtZXRlcnMuanMiXSwibmFtZXMiOlsiZGVzY3JpYmUiLCJwYXR0ZXJucyIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJGdW5jdGlvbkV4cHJlc3Npb24iLCJBcnJvd0V4cHJlc3Npb24iLCJuYW1lIiwiY29kZSIsIml0IiwibnVtVmFycyIsImFzdCIsInNjb3BlTWFuYWdlciIsImVjbWFWZXJzaW9uIiwic2NvcGVzIiwidG8iLCJoYXZlIiwibGVuZ3RoIiwic2NvcGUiLCJ2YXJpYWJsZXMiLCJyZWZlcmVuY2VzIiwicmVmZXJlbmNlIiwiZnJvbSIsImVxdWFsIiwiaWRlbnRpZmllciIsInJlc29sdmVkIiwid3JpdGVFeHByIiwibm90IiwiYmUiLCJ1bmRlZmluZWQiLCJpc1dyaXRlIiwidHJ1ZSIsImlzUmVhZCIsImZhbHNlIl0sIm1hcHBpbmdzIjoiOztBQXVCQTs7QUFDQTs7OztBQUNBOzs7O0FBRUFBLFNBQVMseUJBQVQsRUFBb0MsWUFBVztBQUMzQ0EsYUFBUywwRUFBVCxFQUFxRixZQUFXO0FBQzVGLFlBQU1DLFdBQVc7QUFDYkMsNERBRGE7QUFFYkMsa0VBRmE7QUFHYkM7QUFIYSxTQUFqQjs7QUFNQSxhQUFLLElBQU1DLElBQVgsSUFBbUJKLFFBQW5CLEVBQTZCO0FBQ3pCLGdCQUFNSyxPQUFPTCxTQUFTSSxJQUFULENBQWI7QUFDQSxhQUFDLFVBQVNBLElBQVQsRUFBZUMsSUFBZixFQUFxQjtBQUNsQkMsbUJBQUdGLElBQUgsRUFBUyxZQUFXO0FBQ2hCLHdCQUFNRyxVQUFVSCxTQUFTLGlCQUFULEdBQTZCLENBQTdCLEdBQWlDLENBQWpEO0FBQ0Esd0JBQU1JLE1BQU0sc0JBQU9ILElBQVAsQ0FBWjs7QUFFQSx3QkFBTUksZUFBZSxlQUFRRCxHQUFSLEVBQWEsRUFBQ0UsYUFBYSxDQUFkLEVBQWIsQ0FBckI7QUFDQSxzQ0FBT0QsYUFBYUUsTUFBcEIsRUFBNEJDLEVBQTVCLENBQStCQyxJQUEvQixDQUFvQ0MsTUFBcEMs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QlYsRUFBM0IsQ0FBOEJRLEtBQTlCLENBQW9DWCxhQUFhRSxNQUFiLENBQW9CLENBQXBCLEVBQXVCSyxTQUF2QixDQUFpQyxDQUFqQyxDQUFwQztBQUNBLHNDQUFPRSxVQUFVSyxTQUFqQixFQUE0QlgsRUFBNUIsQ0FBK0JhLEVBQS9CLENBQWtDQyxTQUFsQztBQUNBLHNDQUFPUixVQUFVUyxPQUFWLEVBQVAsRUFBNEJmLEVBQTVCLENBQStCYSxFQUEvQixDQUFrQ0ssS0FBbEM7QUFDQSxzQ0FBT1osVUFBVVcsTUFBVixFQUFQLEVBQTJCakIsRUFBM0IsQ0FBOEJhLEVBQTlCLENBQWlDRyxJQUFqQztBQUNILGlCQWpCRDtBQWtCSCxhQW5CRCxFQW1CR3hCLElBbkJILEVBbUJTQyxJQW5CVDtBQW9CSDtBQUNKLEtBdkNEO0FBd0NILENBeE1EOztBQTBNQTtBQXJPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJlczYtZGVmYXVsdC1wYXJhbWV0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLSotIGNvZGluZzogdXRmLTggLSotXG4vLyAgQ29weXJpZ2h0IChDKSAyMDE1IFRvcnUgTmFnYXNoaW1hXG4vL1xuLy8gIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuLy8gIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuLy9cbi8vICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbi8vICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuLy8gICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxuLy8gICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG4vLyAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4vL1xuLy8gIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4vLyAgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuLy8gIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFXG4vLyAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxuLy8gIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4vLyAgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuLy8gIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxuLy8gIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4vLyAgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GXG4vLyAgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cblxuaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgZXNwcmVlIGZyb20gJy4uL3RoaXJkX3BhcnR5L2VzcHJlZSc7XG5pbXBvcnQgeyBhbmFseXplIH0gZnJvbSAnLi4nO1xuXG5kZXNjcmliZSgnRVM2IGRlZmF1bHQgcGFyYW1ldGVyczonLCBmdW5jdGlvbigpIHtcbiAgICBkZXNjcmliZSgnYSBkZWZhdWx0IHBhcmFtZXRlciBjcmVhdGVzIGEgd3JpdGFibGUgcmVmZXJlbmNlIGZvciBpdHMgaW5pdGlhbGl6YXRpb246JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHBhdHRlcm5zID0ge1xuICAgICAgICAgICAgRnVuY3Rpb25EZWNsYXJhdGlvbjogYGZ1bmN0aW9uIGZvbyhhLCBiID0gMCkge31gLFxuICAgICAgICAgICAgRnVuY3Rpb25FeHByZXNzaW9uOiBgbGV0IGZvbyA9IGZ1bmN0aW9uKGEsIGIgPSAwKSB7fTtgLFxuICAgICAgICAgICAgQXJyb3dFeHByZXNzaW9uOiBgbGV0IGZvbyA9IChhLCBiID0gMCkgPT4ge307YFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBwYXR0ZXJucykge1xuICAgICAgICAgICAgY29uc3QgY29kZSA9IHBhdHRlcm5zW25hbWVdO1xuICAgICAgICAgICAgKGZ1bmN0aW9uKG5hbWUsIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpdChuYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtVmFycyA9IG5hbWUgPT09ICdBcnJvd0V4cHJlc3Npb24nID8gMiA6IDM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShjb2RlKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFtnbG9iYWwsIGZvb11cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMV07XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKG51bVZhcnMpOyAgLy8gW2FyZ3VtZW50cz8sIGEsIGJdXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgxKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWZlcmVuY2UgPSBzY29wZS5yZWZlcmVuY2VzWzBdO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmZyb20pLnRvLmVxdWFsKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pZGVudGlmaWVyLm5hbWUpLnRvLmVxdWFsKCdiJyk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UucmVzb2x2ZWQpLnRvLmVxdWFsKHNjb3BlLnZhcmlhYmxlc1tudW1WYXJzIC0gMV0pO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLndyaXRlRXhwcikudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1dyaXRlKCkpLnRvLmJlLnRydWU7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLmZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkobmFtZSwgY29kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhIGRlZmF1bHQgcGFyYW1ldGVyIGNyZWF0ZXMgYSByZWFkYWJsZSByZWZlcmVuY2UgZm9yIHJlZmVyZW5jZXMgaW4gcmlnaHQ6JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHBhdHRlcm5zID0ge1xuICAgICAgICAgICAgRnVuY3Rpb25EZWNsYXJhdGlvbjogYFxuICAgICAgICAgICAgICAgIGxldCBhO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvbyhiID0gYSkge31cbiAgICAgICAgICAgIGAsXG4gICAgICAgICAgICBGdW5jdGlvbkV4cHJlc3Npb246IGBcbiAgICAgICAgICAgICAgICBsZXQgYTtcbiAgICAgICAgICAgICAgICBsZXQgZm9vID0gZnVuY3Rpb24oYiA9IGEpIHt9XG4gICAgICAgICAgICBgLFxuICAgICAgICAgICAgQXJyb3dFeHByZXNzaW9uOiBgXG4gICAgICAgICAgICAgICAgbGV0IGE7XG4gICAgICAgICAgICAgICAgbGV0IGZvbyA9IChiID0gYSkgPT4ge307XG4gICAgICAgICAgICBgXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHBhdHRlcm5zKSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gcGF0dGVybnNbbmFtZV07XG4gICAgICAgICAgICAoZnVuY3Rpb24obmFtZSwgY29kZSkge1xuICAgICAgICAgICAgICAgIGl0KG5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBudW1WYXJzID0gbmFtZSA9PT0gJ0Fycm93RXhwcmVzc2lvbicgPyAxIDogMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGNvZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3BlTWFuYWdlciA9IGFuYWx5emUoYXN0LCB7ZWNtYVZlcnNpb246IDZ9KTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2dsb2JhbCwgZm9vXVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgobnVtVmFycyk7ICAvLyBbYXJndW1lbnRzPywgYl1cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIGFdXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5mcm9tKS50by5lcXVhbChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZU1hbmFnZXIuc2NvcGVzWzBdLnZhcmlhYmxlc1swXSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2Uud3JpdGVFeHByKS50by5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1JlYWQoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKG5hbWUsIGNvZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYSBkZWZhdWx0IHBhcmFtZXRlciBjcmVhdGVzIGEgcmVhZGFibGUgcmVmZXJlbmNlIGZvciByZWZlcmVuY2VzIGluIHJpZ2h0IChmb3IgY29uc3QpOicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBwYXR0ZXJucyA9IHtcbiAgICAgICAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb246IGBcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gMDtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmb28oYiA9IGEpIHt9XG4gICAgICAgICAgICBgLFxuICAgICAgICAgICAgRnVuY3Rpb25FeHByZXNzaW9uOiBgXG4gICAgICAgICAgICAgICAgY29uc3QgYSA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGZvbyA9IGZ1bmN0aW9uKGIgPSBhKSB7fVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIEFycm93RXhwcmVzc2lvbjogYFxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBmb28gPSAoYiA9IGEpID0+IHt9O1xuICAgICAgICAgICAgYFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBwYXR0ZXJucykge1xuICAgICAgICAgICAgY29uc3QgY29kZSA9IHBhdHRlcm5zW25hbWVdO1xuICAgICAgICAgICAgKGZ1bmN0aW9uKG5hbWUsIGNvZGUpIHtcbiAgICAgICAgICAgICAgICBpdChuYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtVmFycyA9IG5hbWUgPT09ICdBcnJvd0V4cHJlc3Npb24nID8gMSA6IDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShjb2RlKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY29wZU1hbmFnZXIgPSBhbmFseXplKGFzdCwge2VjbWFWZXJzaW9uOiA2fSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZU1hbmFnZXIuc2NvcGVzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFtnbG9iYWwsIGZvb11cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMV07XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKG51bVZhcnMpOyAgLy8gW2FyZ3VtZW50cz8sIGJdXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgyKTsgIC8vIFtiLCBhXVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHNjb3BlLnJlZmVyZW5jZXNbMV07XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuZnJvbSkudG8uZXF1YWwoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlkZW50aWZpZXIubmFtZSkudG8uZXF1YWwoJ2EnKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5yZXNvbHZlZCkudG8uZXF1YWwoc2NvcGVNYW5hZ2VyLnNjb3Blc1swXS52YXJpYWJsZXNbMF0pO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLndyaXRlRXhwcikudG8uYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLmlzV3JpdGUoKSkudG8uYmUuZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNSZWFkKCkpLnRvLmJlLnRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KShuYW1lLCBjb2RlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2EgZGVmYXVsdCBwYXJhbWV0ZXIgY3JlYXRlcyBhIHJlYWRhYmxlIHJlZmVyZW5jZSBmb3IgcmVmZXJlbmNlcyBpbiByaWdodCAocGFydGlhbCk6JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHBhdHRlcm5zID0ge1xuICAgICAgICAgICAgRnVuY3Rpb25EZWNsYXJhdGlvbjogYFxuICAgICAgICAgICAgICAgIGxldCBhO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvbyhiID0gYS5jKSB7fVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIEZ1bmN0aW9uRXhwcmVzc2lvbjogYFxuICAgICAgICAgICAgICAgIGxldCBhO1xuICAgICAgICAgICAgICAgIGxldCBmb28gPSBmdW5jdGlvbihiID0gYS5jKSB7fVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIEFycm93RXhwcmVzc2lvbjogYFxuICAgICAgICAgICAgICAgIGxldCBhO1xuICAgICAgICAgICAgICAgIGxldCBmb28gPSAoYiA9IGEuYykgPT4ge307XG4gICAgICAgICAgICBgXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHBhdHRlcm5zKSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gcGF0dGVybnNbbmFtZV07XG4gICAgICAgICAgICAoZnVuY3Rpb24obmFtZSwgY29kZSkge1xuICAgICAgICAgICAgICAgIGl0KG5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBudW1WYXJzID0gbmFtZSA9PT0gJ0Fycm93RXhwcmVzc2lvbicgPyAxIDogMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGNvZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3BlTWFuYWdlciA9IGFuYWx5emUoYXN0LCB7ZWNtYVZlcnNpb246IDZ9KTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlTWFuYWdlci5zY29wZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2dsb2JhbCwgZm9vXVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3BlID0gc2NvcGVNYW5hZ2VyLnNjb3Blc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgobnVtVmFycyk7ICAvLyBbYXJndW1lbnRzPywgYl1cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDIpOyAgLy8gW2IsIGFdXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5mcm9tKS50by5lcXVhbChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZU1hbmFnZXIuc2NvcGVzWzBdLnZhcmlhYmxlc1swXSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2Uud3JpdGVFeHByKS50by5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1JlYWQoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKG5hbWUsIGNvZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYSBkZWZhdWx0IHBhcmFtZXRlciBjcmVhdGVzIGEgcmVhZGFibGUgcmVmZXJlbmNlIGZvciByZWZlcmVuY2VzIGluIHJpZ2h0XFwncyBuZXN0ZWQgc2NvcGU6JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHBhdHRlcm5zID0ge1xuICAgICAgICAgICAgRnVuY3Rpb25EZWNsYXJhdGlvbjogYFxuICAgICAgICAgICAgICAgIGxldCBhO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvbyhiID0gZnVuY3Rpb24oKSB7IHJldHVybiBhOyB9KSB7fVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIEZ1bmN0aW9uRXhwcmVzc2lvbjogYFxuICAgICAgICAgICAgICAgIGxldCBhO1xuICAgICAgICAgICAgICAgIGxldCBmb28gPSBmdW5jdGlvbihiID0gZnVuY3Rpb24oKSB7IHJldHVybiBhOyB9KSB7fVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIEFycm93RXhwcmVzc2lvbjogYFxuICAgICAgICAgICAgICAgIGxldCBhO1xuICAgICAgICAgICAgICAgIGxldCBmb28gPSAoYiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gYTsgfSkgPT4ge307XG4gICAgICAgICAgICBgXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHBhdHRlcm5zKSB7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gcGF0dGVybnNbbmFtZV07XG4gICAgICAgICAgICAoZnVuY3Rpb24obmFtZSwgY29kZSkge1xuICAgICAgICAgICAgICAgIGl0KG5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoY29kZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtlY21hVmVyc2lvbjogNn0pO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3Qoc2NvcGVNYW5hZ2VyLnNjb3BlcykudG8uaGF2ZS5sZW5ndGgoMyk7ICAvLyBbZ2xvYmFsLCBmb28sIGFub255bW91c11cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY29wZSA9IHNjb3BlTWFuYWdlci5zY29wZXNbMl07XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzY29wZS52YXJpYWJsZXMpLnRvLmhhdmUubGVuZ3RoKDEpOyAgLy8gW2FyZ3VtZW50c11cbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHNjb3BlLnJlZmVyZW5jZXMpLnRvLmhhdmUubGVuZ3RoKDEpOyAgLy8gW2FdXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gc2NvcGUucmVmZXJlbmNlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5mcm9tKS50by5lcXVhbChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaWRlbnRpZmllci5uYW1lKS50by5lcXVhbCgnYScpO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QocmVmZXJlbmNlLnJlc29sdmVkKS50by5lcXVhbChzY29wZU1hbmFnZXIuc2NvcGVzWzBdLnZhcmlhYmxlc1swXSk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2Uud3JpdGVFeHByKS50by5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChyZWZlcmVuY2UuaXNXcml0ZSgpKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHJlZmVyZW5jZS5pc1JlYWQoKSkudG8uYmUudHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKG5hbWUsIGNvZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuLy8gdmltOiBzZXQgc3c9NCB0cz00IGV0IHR3PTgwIDpcbiJdfQ==
