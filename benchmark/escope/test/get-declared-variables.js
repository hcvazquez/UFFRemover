'use strict';

var _chai = require('chai');

var _esrecurse = require('esrecurse');

var _espree = require('../third_party/espree');

var _espree2 = _interopRequireDefault(_espree);

var _ = require('..');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // -*- coding: utf-8 -*-
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

describe('ScopeManager.prototype.getDeclaredVariables', function () {
    var verify = function verify(ast, type, expectedNamesList) {
        var scopeManager = (0, _.analyze)(ast, {
            ecmaVersion: 6,
            sourceType: 'module'
        });

        (0, _esrecurse.visit)(ast, _defineProperty({}, type, function (node) {
            var expected = expectedNamesList.shift();
            var actual = scopeManager.getDeclaredVariables(node);

            (0, _chai.expect)(actual).to.have.length(expected.length);
            if (actual.length > 0) {
                var end = actual.length - 1;
                for (var i = 0; i <= end; i++) {
                    (0, _chai.expect)(actual[i].name).to.be.equal(expected[i]);
                }
            }

            this.visitChildren(node);
        }));

        (0, _chai.expect)(expectedNamesList).to.have.length(0);
    };

    it('should get variables that declared on `VariableDeclaration`', function () {
        var ast = (0, _espree2.default)('\n            var {a, x: [b], y: {c = 0}} = foo;\n            let {d, x: [e], y: {f = 0}} = foo;\n            const {g, x: [h], y: {i = 0}} = foo, {j, k = function() { let l; }} = bar;\n        ');

        verify(ast, 'VariableDeclaration', [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i', 'j', 'k'], ['l']]);
    });

    it('should get variables that declared on `VariableDeclaration` in for-in/of', function () {
        var ast = (0, _espree2.default)('\n            for (var {a, x: [b], y: {c = 0}} in foo) {\n                let g;\n            }\n            for (let {d, x: [e], y: {f = 0}} of foo) {\n                let h;\n            }\n        ');

        verify(ast, 'VariableDeclaration', [['a', 'b', 'c'], ['g'], ['d', 'e', 'f'], ['h']]);
    });

    it('should get variables that declared on `VariableDeclarator`', function () {
        var ast = (0, _espree2.default)('\n            var {a, x: [b], y: {c = 0}} = foo;\n            let {d, x: [e], y: {f = 0}} = foo;\n            const {g, x: [h], y: {i = 0}} = foo, {j, k = function() { let l; }} = bar;\n        ');

        verify(ast, 'VariableDeclarator', [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i'], ['j', 'k'], ['l']]);
    });

    it('should get variables that declared on `FunctionDeclaration`', function () {
        var ast = (0, _espree2.default)('\n            function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n                let z;\n            }\n            function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n                let z;\n            }\n        ');

        verify(ast, 'FunctionDeclaration', [['foo', 'a', 'b', 'c', 'd', 'e'], ['bar', 'f', 'g', 'h', 'i', 'j']]);
    });

    it('should get variables that declared on `FunctionExpression`', function () {
        var ast = (0, _espree2.default)('\n            (function foo({a, x: [b], y: {c = 0}}, [d, e]) {\n                let z;\n            });\n            (function bar({f, x: [g], y: {h = 0}}, [i, j = function(q) { let w; }]) {\n                let z;\n            });\n        ');

        verify(ast, 'FunctionExpression', [['foo', 'a', 'b', 'c', 'd', 'e'], ['bar', 'f', 'g', 'h', 'i', 'j'], ['q']]);
    });

    it('should get variables that declared on `ArrowFunctionExpression`', function () {
        var ast = (0, _espree2.default)('\n            (({a, x: [b], y: {c = 0}}, [d, e]) => {\n                let z;\n            });\n            (({f, x: [g], y: {h = 0}}, [i, j]) => {\n                let z;\n            });\n        ');

        verify(ast, 'ArrowFunctionExpression', [['a', 'b', 'c', 'd', 'e'], ['f', 'g', 'h', 'i', 'j']]);
    });

    it('should get variables that declared on `ClassDeclaration`', function () {
        var ast = (0, _espree2.default)('\n            class A { foo(x) { let y; } }\n            class B { foo(x) { let y; } }\n        ');

        verify(ast, 'ClassDeclaration', [['A', 'A'], // outer scope's and inner scope's.
        ['B', 'B']]);
    });

    it('should get variables that declared on `ClassExpression`', function () {
        var ast = (0, _espree2.default)('\n            (class A { foo(x) { let y; } });\n            (class B { foo(x) { let y; } });\n        ');

        verify(ast, 'ClassExpression', [['A'], ['B']]);
    });

    it('should get variables that declared on `CatchClause`', function () {
        var ast = (0, _espree2.default)('\n            try {} catch ({a, b}) {\n                let x;\n                try {} catch ({c, d}) {\n                    let y;\n                }\n            }\n        ');

        verify(ast, 'CatchClause', [['a', 'b'], ['c', 'd']]);
    });

    it('should get variables that declared on `ImportDeclaration`', function () {
        var ast = (0, _espree2.default)('\n            import "aaa";\n            import * as a from "bbb";\n            import b, {c, x as d} from "ccc";', { sourceType: 'module' });

        verify(ast, 'ImportDeclaration', [[], ['a'], ['b', 'c', 'd']]);
    });

    it('should get variables that declared on `ImportSpecifier`', function () {
        var ast = (0, _espree2.default)('\n            import "aaa";\n            import * as a from "bbb";\n            import b, {c, x as d} from "ccc";', { sourceType: 'module' });

        verify(ast, 'ImportSpecifier', [['c'], ['d']]);
    });

    it('should get variables that declared on `ImportDefaultSpecifier`', function () {
        var ast = (0, _espree2.default)('\n            import "aaa";\n            import * as a from "bbb";\n            import b, {c, x as d} from "ccc";', { sourceType: 'module' });

        verify(ast, 'ImportDefaultSpecifier', [['b']]);
    });

    it('should get variables that declared on `ImportNamespaceSpecifier`', function () {
        var ast = (0, _espree2.default)('\n            import "aaa";\n            import * as a from "bbb";\n            import b, {c, x as d} from "ccc";', { sourceType: 'module' });

        verify(ast, 'ImportNamespaceSpecifier', [['a']]);
    });

    it('should not get duplicate even if it\'s declared twice', function () {
        var ast = (0, _espree2.default)('var a = 0, a = 1;');

        verify(ast, 'VariableDeclaration', [['a']]);
    });
});

// vim: set sw=4 ts=4 et tw=80 :
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldC1kZWNsYXJlZC12YXJpYWJsZXMuanMiXSwibmFtZXMiOlsiZGVzY3JpYmUiLCJ2ZXJpZnkiLCJhc3QiLCJ0eXBlIiwiZXhwZWN0ZWROYW1lc0xpc3QiLCJzY29wZU1hbmFnZXIiLCJlY21hVmVyc2lvbiIsInNvdXJjZVR5cGUiLCJub2RlIiwiZXhwZWN0ZWQiLCJzaGlmdCIsImFjdHVhbCIsImdldERlY2xhcmVkVmFyaWFibGVzIiwidG8iLCJoYXZlIiwibGVuZ3RoIiwiZW5kIiwiaSIsIm5hbWUiLCJiZSIsImVxdWFsIiwidmlzaXRDaGlsZHJlbiIsIml0Il0sIm1hcHBpbmdzIjoiOztBQXVCQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O2tOQTFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFPQUEsU0FBUyw2Q0FBVCxFQUF3RCxZQUFXO0FBQy9ELFFBQU1DLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxHQUFELEVBQU1DLElBQU4sRUFBWUMsaUJBQVosRUFBa0M7QUFDN0MsWUFBTUMsZUFBZSxlQUFRSCxHQUFSLEVBQWE7QUFDOUJJLHlCQUFhLENBRGlCO0FBRTlCQyx3QkFBWTtBQUZrQixTQUFiLENBQXJCOztBQUtBLDhCQUFNTCxHQUFOLHNCQUNLQyxJQURMLFlBQ1dLLElBRFgsRUFDaUI7QUFDVCxnQkFBTUMsV0FBV0wsa0JBQWtCTSxLQUFsQixFQUFqQjtBQUNBLGdCQUFNQyxTQUFTTixhQUFhTyxvQkFBYixDQUFrQ0osSUFBbEMsQ0FBZjs7QUFFQSw4QkFBT0csTUFBUCxFQUFlRSxFQUFmLENBQWtCQyxJQUFsQixDQUF1QkMsTUFBdkIsQ0FBOEJOLFNBQVNNLE1BQXZDO0FBQ0EsZ0JBQUlKLE9BQU9JLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDbkIsb0JBQU1DLE1BQU1MLE9BQU9JLE1BQVAs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RUFBK0IsQ0FDM0IsQ0FBQyxHQUFELENBRDJCLEVBRTNCLENBQUMsR0FBRCxDQUYyQixDQUEvQjtBQUlILEtBWkQ7O0FBZUFvQixPQUFHLGdFQUFILEVBQXFFLFlBQVc7QUFDNUUsWUFBTXBCLE1BQU0sMklBSVIsRUFBQ0ssWUFBWSxRQUFiLEVBSlEsQ0FBWjs7QUFPQU4sZUFBT0MsR0FBUCxFQUFZLHdCQUFaLEVBQXNDLENBQ2xDLENBQUMsR0FBRCxDQURrQyxDQUF0QztBQUdILEtBWEQ7O0FBY0FvQixPQUFHLGtFQUFILEVBQXVFLFlBQVc7QUFDOUUsWUFBTXBCLE1BQU0sMklBSVIsRUFBQ0ssWUFBWSxRQUFiLEVBSlEsQ0FBWjs7QUFPQU4sZUFBT0MsR0FBUCxFQUFZLDBCQUFaLEVBQXdDLENBQ3BDLENBQUMsR0FBRCxDQURvQyxDQUF4QztBQUdILEtBWEQ7O0FBY0FvQixPQUFHLHVEQUFILEVBQTRELFlBQVc7QUFDbkUsWUFBTXBCLE1BQU0sMENBQVo7O0FBRUFELGVBQU9DLEdBQVAsRUFBWSxxQkFBWixFQUFtQyxDQUMvQixDQUFDLEdBQUQsQ0FEK0IsQ0FBbkM7QUFHSCxLQU5EO0FBT0gsQ0FqUEQ7O0FBbVBBIiwiZmlsZSI6ImdldC1kZWNsYXJlZC12YXJpYWJsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAtKi0gY29kaW5nOiB1dGYtOCAtKi1cbi8vICBDb3B5cmlnaHQgKEMpIDIwMTUgVG9ydSBOYWdhc2hpbWFcbi8vXG4vLyAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4vLyAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4vL1xuLy8gICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuLy8gICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4vLyAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4vLyAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbi8vICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbi8vXG4vLyAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbi8vICBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4vLyAgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0Vcbi8vICBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgPENPUFlSSUdIVCBIT0xERVI+IEJFIExJQUJMRSBGT1IgQU5ZXG4vLyAgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbi8vICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4vLyAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EXG4vLyAgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbi8vICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0Zcbi8vICBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuXG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdjaGFpJztcbmltcG9ydCB7IHZpc2l0IH0gZnJvbSAnZXNyZWN1cnNlJztcbmltcG9ydCBlc3ByZWUgZnJvbSAnLi4vdGhpcmRfcGFydHkvZXNwcmVlJztcbmltcG9ydCB7IGFuYWx5emUgfSBmcm9tICcuLic7XG5cbmRlc2NyaWJlKCdTY29wZU1hbmFnZXIucHJvdG90eXBlLmdldERlY2xhcmVkVmFyaWFibGVzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdmVyaWZ5ID0gKGFzdCwgdHlwZSwgZXhwZWN0ZWROYW1lc0xpc3QpID0+IHtcbiAgICAgICAgY29uc3Qgc2NvcGVNYW5hZ2VyID0gYW5hbHl6ZShhc3QsIHtcbiAgICAgICAgICAgIGVjbWFWZXJzaW9uOiA2LFxuICAgICAgICAgICAgc291cmNlVHlwZTogJ21vZHVsZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmlzaXQoYXN0LCB7XG4gICAgICAgICAgICBbdHlwZV0obm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gZXhwZWN0ZWROYW1lc0xpc3Quc2hpZnQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWwgPSBzY29wZU1hbmFnZXIuZ2V0RGVjbGFyZWRWYXJpYWJsZXMobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBleHBlY3QoYWN0dWFsKS50by5oYXZlLmxlbmd0aChleHBlY3RlZC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGlmIChhY3R1YWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBhY3R1YWwubGVuZ3RoLTE7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoYWN0dWFsW2ldLm5hbWUpLnRvLmJlLmVxdWFsKGV4cGVjdGVkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGV4cGVjdGVkTmFtZXNMaXN0KS50by5oYXZlLmxlbmd0aCgwKTtcbiAgICB9O1xuXG5cbiAgICBpdCgnc2hvdWxkIGdldCB2YXJpYWJsZXMgdGhhdCBkZWNsYXJlZCBvbiBgVmFyaWFibGVEZWNsYXJhdGlvbmAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgIHZhciB7YSwgeDogW2JdLCB5OiB7YyA9IDB9fSA9IGZvbztcbiAgICAgICAgICAgIGxldCB7ZCwgeDogW2VdLCB5OiB7ZiA9IDB9fSA9IGZvbztcbiAgICAgICAgICAgIGNvbnN0IHtnLCB4OiBbaF0sIHk6IHtpID0gMH19ID0gZm9vLCB7aiwgayA9IGZ1bmN0aW9uKCkgeyBsZXQgbDsgfX0gPSBiYXI7XG4gICAgICAgIGApO1xuXG4gICAgICAgIHZlcmlmeShhc3QsICdWYXJpYWJsZURlY2xhcmF0aW9uJywgW1xuICAgICAgICAgICAgWydhJywgJ2InLCAnYyddLFxuICAgICAgICAgICAgWydkJywgJ2UnLCAnZiddLFxuICAgICAgICAgICAgWydnJywgJ2gnLCAnaScsICdqJywgJ2snXSxcbiAgICAgICAgICAgIFsnbCddXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIGdldCB2YXJpYWJsZXMgdGhhdCBkZWNsYXJlZCBvbiBgVmFyaWFibGVEZWNsYXJhdGlvbmAgaW4gZm9yLWluL29mJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICBmb3IgKHZhciB7YSwgeDogW2JdLCB5OiB7YyA9IDB9fSBpbiBmb28pIHtcbiAgICAgICAgICAgICAgICBsZXQgZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IHtkLCB4OiBbZV0sIHk6IHtmID0gMH19IG9mIGZvbykge1xuICAgICAgICAgICAgICAgIGxldCBoO1xuICAgICAgICAgICAgfVxuICAgICAgICBgKTtcblxuICAgICAgICB2ZXJpZnkoYXN0LCAnVmFyaWFibGVEZWNsYXJhdGlvbicsIFtcbiAgICAgICAgICAgIFsnYScsICdiJywgJ2MnXSxcbiAgICAgICAgICAgIFsnZyddLFxuICAgICAgICAgICAgWydkJywgJ2UnLCAnZiddLFxuICAgICAgICAgICAgWydoJ11cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgZ2V0IHZhcmlhYmxlcyB0aGF0IGRlY2xhcmVkIG9uIGBWYXJpYWJsZURlY2xhcmF0b3JgJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICB2YXIge2EsIHg6IFtiXSwgeToge2MgPSAwfX0gPSBmb287XG4gICAgICAgICAgICBsZXQge2QsIHg6IFtlXSwgeToge2YgPSAwfX0gPSBmb287XG4gICAgICAgICAgICBjb25zdCB7ZywgeDogW2hdLCB5OiB7aSA9IDB9fSA9IGZvbywge2osIGsgPSBmdW5jdGlvbigpIHsgbGV0IGw7IH19ID0gYmFyO1xuICAgICAgICBgKTtcblxuICAgICAgICB2ZXJpZnkoYXN0LCAnVmFyaWFibGVEZWNsYXJhdG9yJywgW1xuICAgICAgICAgICAgWydhJywgJ2InLCAnYyddLFxuICAgICAgICAgICAgWydkJywgJ2UnLCAnZiddLFxuICAgICAgICAgICAgWydnJywgJ2gnLCAnaSddLFxuICAgICAgICAgICAgWydqJywgJ2snXSxcbiAgICAgICAgICAgIFsnbCddXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIGdldCB2YXJpYWJsZXMgdGhhdCBkZWNsYXJlZCBvbiBgRnVuY3Rpb25EZWNsYXJhdGlvbmAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZvbyh7YSwgeDogW2JdLCB5OiB7YyA9IDB9fSwgW2QsIGVdKSB7XG4gICAgICAgICAgICAgICAgbGV0IHo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBiYXIoe2YsIHg6IFtnXSwgeToge2ggPSAwfX0sIFtpLCBqID0gZnVuY3Rpb24ocSkgeyBsZXQgdzsgfV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgejtcbiAgICAgICAgICAgIH1cbiAgICAgICAgYCk7XG5cbiAgICAgICAgdmVyaWZ5KGFzdCwgJ0Z1bmN0aW9uRGVjbGFyYXRpb24nLCBbXG4gICAgICAgICAgICBbJ2ZvbycsICdhJywgJ2InLCAnYycsICdkJywgJ2UnXSxcbiAgICAgICAgICAgIFsnYmFyJywgJ2YnLCAnZycsICdoJywgJ2knLCAnaiddXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIGdldCB2YXJpYWJsZXMgdGhhdCBkZWNsYXJlZCBvbiBgRnVuY3Rpb25FeHByZXNzaW9uYCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYFxuICAgICAgICAgICAgKGZ1bmN0aW9uIGZvbyh7YSwgeDogW2JdLCB5OiB7YyA9IDB9fSwgW2QsIGVdKSB7XG4gICAgICAgICAgICAgICAgbGV0IHo7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIChmdW5jdGlvbiBiYXIoe2YsIHg6IFtnXSwgeToge2ggPSAwfX0sIFtpLCBqID0gZnVuY3Rpb24ocSkgeyBsZXQgdzsgfV0pIHtcbiAgICAgICAgICAgICAgICBsZXQgejtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBgKTtcblxuICAgICAgICB2ZXJpZnkoYXN0LCAnRnVuY3Rpb25FeHByZXNzaW9uJywgW1xuICAgICAgICAgICAgWydmb28nLCAnYScsICdiJywgJ2MnLCAnZCcsICdlJ10sXG4gICAgICAgICAgICBbJ2JhcicsICdmJywgJ2cnLCAnaCcsICdpJywgJ2onXSxcbiAgICAgICAgICAgIFsncSddXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIGdldCB2YXJpYWJsZXMgdGhhdCBkZWNsYXJlZCBvbiBgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25gJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICAoKHthLCB4OiBbYl0sIHk6IHtjID0gMH19LCBbZCwgZV0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgejtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgKCh7ZiwgeDogW2ddLCB5OiB7aCA9IDB9fSwgW2ksIGpdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHo7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgYCk7XG5cbiAgICAgICAgdmVyaWZ5KGFzdCwgJ0Fycm93RnVuY3Rpb25FeHByZXNzaW9uJywgW1xuICAgICAgICAgICAgWydhJywgJ2InLCAnYycsICdkJywgJ2UnXSxcbiAgICAgICAgICAgIFsnZicsICdnJywgJ2gnLCAnaScsICdqJ11cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgZ2V0IHZhcmlhYmxlcyB0aGF0IGRlY2xhcmVkIG9uIGBDbGFzc0RlY2xhcmF0aW9uYCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYFxuICAgICAgICAgICAgY2xhc3MgQSB7IGZvbyh4KSB7IGxldCB5OyB9IH1cbiAgICAgICAgICAgIGNsYXNzIEIgeyBmb28oeCkgeyBsZXQgeTsgfSB9XG4gICAgICAgIGApO1xuXG4gICAgICAgIHZlcmlmeShhc3QsICdDbGFzc0RlY2xhcmF0aW9uJywgW1xuICAgICAgICAgICAgWydBJywgJ0EnXSwgLy8gb3V0ZXIgc2NvcGUncyBhbmQgaW5uZXIgc2NvcGUncy5cbiAgICAgICAgICAgIFsnQicsICdCJ11cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgZ2V0IHZhcmlhYmxlcyB0aGF0IGRlY2xhcmVkIG9uIGBDbGFzc0V4cHJlc3Npb25gJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICAoY2xhc3MgQSB7IGZvbyh4KSB7IGxldCB5OyB9IH0pO1xuICAgICAgICAgICAgKGNsYXNzIEIgeyBmb28oeCkgeyBsZXQgeTsgfSB9KTtcbiAgICAgICAgYCk7XG5cbiAgICAgICAgdmVyaWZ5KGFzdCwgJ0NsYXNzRXhwcmVzc2lvbicsIFtcbiAgICAgICAgICAgIFsnQSddLFxuICAgICAgICAgICAgWydCJ11cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgZ2V0IHZhcmlhYmxlcyB0aGF0IGRlY2xhcmVkIG9uIGBDYXRjaENsYXVzZWAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgYXN0ID0gZXNwcmVlKGBcbiAgICAgICAgICAgIHRyeSB7fSBjYXRjaCAoe2EsIGJ9KSB7XG4gICAgICAgICAgICAgICAgbGV0IHg7XG4gICAgICAgICAgICAgICAgdHJ5IHt9IGNhdGNoICh7YywgZH0pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBgKTtcblxuICAgICAgICB2ZXJpZnkoYXN0LCAnQ2F0Y2hDbGF1c2UnLCBbXG4gICAgICAgICAgICBbJ2EnLCAnYiddLFxuICAgICAgICAgICAgWydjJywgJ2QnXVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCBnZXQgdmFyaWFibGVzIHRoYXQgZGVjbGFyZWQgb24gYEltcG9ydERlY2xhcmF0aW9uYCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYFxuICAgICAgICAgICAgaW1wb3J0IFwiYWFhXCI7XG4gICAgICAgICAgICBpbXBvcnQgKiBhcyBhIGZyb20gXCJiYmJcIjtcbiAgICAgICAgICAgIGltcG9ydCBiLCB7YywgeCBhcyBkfSBmcm9tIFwiY2NjXCI7YCxcbiAgICAgICAgICAgIHtzb3VyY2VUeXBlOiAnbW9kdWxlJ31cbiAgICAgICAgKTtcblxuICAgICAgICB2ZXJpZnkoYXN0LCAnSW1wb3J0RGVjbGFyYXRpb24nLCBbXG4gICAgICAgICAgICBbXSxcbiAgICAgICAgICAgIFsnYSddLFxuICAgICAgICAgICAgWydiJywgJ2MnLCAnZCddXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIGdldCB2YXJpYWJsZXMgdGhhdCBkZWNsYXJlZCBvbiBgSW1wb3J0U3BlY2lmaWVyYCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYFxuICAgICAgICAgICAgaW1wb3J0IFwiYWFhXCI7XG4gICAgICAgICAgICBpbXBvcnQgKiBhcyBhIGZyb20gXCJiYmJcIjtcbiAgICAgICAgICAgIGltcG9ydCBiLCB7YywgeCBhcyBkfSBmcm9tIFwiY2NjXCI7YCxcbiAgICAgICAgICAgIHtzb3VyY2VUeXBlOiAnbW9kdWxlJ31cbiAgICAgICAgKTtcblxuICAgICAgICB2ZXJpZnkoYXN0LCAnSW1wb3J0U3BlY2lmaWVyJywgW1xuICAgICAgICAgICAgWydjJ10sXG4gICAgICAgICAgICBbJ2QnXVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCBnZXQgdmFyaWFibGVzIHRoYXQgZGVjbGFyZWQgb24gYEltcG9ydERlZmF1bHRTcGVjaWZpZXJgJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICBpbXBvcnQgXCJhYWFcIjtcbiAgICAgICAgICAgIGltcG9ydCAqIGFzIGEgZnJvbSBcImJiYlwiO1xuICAgICAgICAgICAgaW1wb3J0IGIsIHtjLCB4IGFzIGR9IGZyb20gXCJjY2NcIjtgLFxuICAgICAgICAgICAge3NvdXJjZVR5cGU6ICdtb2R1bGUnfVxuICAgICAgICApO1xuXG4gICAgICAgIHZlcmlmeShhc3QsICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJywgW1xuICAgICAgICAgICAgWydiJ11cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgZ2V0IHZhcmlhYmxlcyB0aGF0IGRlY2xhcmVkIG9uIGBJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXJgJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGFzdCA9IGVzcHJlZShgXG4gICAgICAgICAgICBpbXBvcnQgXCJhYWFcIjtcbiAgICAgICAgICAgIGltcG9ydCAqIGFzIGEgZnJvbSBcImJiYlwiO1xuICAgICAgICAgICAgaW1wb3J0IGIsIHtjLCB4IGFzIGR9IGZyb20gXCJjY2NcIjtgLFxuICAgICAgICAgICAge3NvdXJjZVR5cGU6ICdtb2R1bGUnfVxuICAgICAgICApO1xuXG4gICAgICAgIHZlcmlmeShhc3QsICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInLCBbXG4gICAgICAgICAgICBbJ2EnXVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCBub3QgZ2V0IGR1cGxpY2F0ZSBldmVuIGlmIGl0XFwncyBkZWNsYXJlZCB0d2ljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBhc3QgPSBlc3ByZWUoYHZhciBhID0gMCwgYSA9IDE7YCk7XG5cbiAgICAgICAgdmVyaWZ5KGFzdCwgJ1ZhcmlhYmxlRGVjbGFyYXRpb24nLCBbXG4gICAgICAgICAgICBbJ2EnXVxuICAgICAgICBdKTtcbiAgICB9KTtcbn0pO1xuXG4vLyB2aW06IHNldCBzdz00IHRzPTQgZXQgdHc9ODAgOlxuIl19
