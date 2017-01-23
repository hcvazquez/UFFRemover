(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == 'function' && require;
                if (!u && a)
                    return a(o, !0);
                if (i)
                    return i(o, !0);
                var f = new Error('Cannot find module \'' + o + '\'');
                throw f.code = 'MODULE_NOT_FOUND', f;
            }
            var l = n[o] = { exports: {} };
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == 'function' && require;
    for (var o = 0; o < r.length; o++)
        s(r[o]);
    return s;
}({
    1: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.Definition = exports.ParameterDefinition = undefined;
            var _variable = require('./variable');
            var _variable2 = _interopRequireDefault(_variable);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
                }
                return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
            }
            function _inherits(subClass, superClass) {
                if (typeof superClass !== 'function' && superClass !== null) {
                    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass)
                    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            /*
                                                                                                                                                            Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                          
                                                                                                                                                            Redistribution and use in source and binary forms, with or without
                                                                                                                                                            modification, are permitted provided that the following conditions are met:
                                                                                                                                                          
                                                                                                                                                              * Redistributions of source code must retain the above copyright
                                                                                                                                                                notice, this list of conditions and the following disclaimer.
                                                                                                                                                              * Redistributions in binary form must reproduce the above copyright
                                                                                                                                                                notice, this list of conditions and the following disclaimer in the
                                                                                                                                                                documentation and/or other materials provided with the distribution.
                                                                                                                                                          
                                                                                                                                                            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            /**
 * @class Definition
 */
            var Definition = function Definition(type, name, node, parent, index, kind) {
                _classCallCheck(this, Definition);
                /**
   * @member {String} Definition#type - type of the occurrence (e.g. "Parameter", "Variable", ...).
   */
                this.type = type;
                /**
   * @member {esprima.Identifier} Definition#name - the identifier AST node of the occurrence.
   */
                this.name = name;
                /**
   * @member {esprima.Node} Definition#node - the enclosing node of the identifier.
   */
                this.node = node;
                /**
   * @member {esprima.Node?} Definition#parent - the enclosing statement node of the identifier.
   */
                this.parent = parent;
                /**
   * @member {Number?} Definition#index - the index in the declaration statement.
   */
                this.index = index;
                /**
   * @member {String?} Definition#kind - the kind of the declaration statement.
   */
                this.kind = kind;
            };
            /**
 * @class ParameterDefinition
 */
            exports.default = Definition;
            var ParameterDefinition = function (_Definition) {
                _inherits(ParameterDefinition, _Definition);
                function ParameterDefinition(name, node, index, rest) {
                    _classCallCheck(this, ParameterDefinition);
                    /**
     * Whether the parameter definition is a part of a rest parameter.
     * @member {boolean} ParameterDefinition#rest
     */
                    var _this = _possibleConstructorReturn(this, (ParameterDefinition.__proto__ || Object.getPrototypeOf(ParameterDefinition)).call(this, _variable2.default.Parameter, name, node, null, index, null));
                    _this.rest = rest;
                    return _this;
                }
                return ParameterDefinition;
            }(Definition);
            exports.ParameterDefinition = ParameterDefinition;
            exports.Definition = Definition;    /* vim: set sw=4 ts=4 et tw=80 : */
        },
        { './variable': 8 }
    ],
    2: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ScopeManager = exports.Scope = exports.Variable = exports.Reference = exports.version = undefined;
            var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
            };
            /*
                                                                                                                                                                                                                                                                                Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                                                                                                                                                Copyright (C) 2013 Alex Seville <hi@alexanderseville.com>
                                                                                                                                                                                                                                                                                Copyright (C) 2014 Thiago de Arruda <tpadilha84@gmail.com>
                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                Redistribution and use in source and binary forms, with or without
                                                                                                                                                                                                                                                                                modification, are permitted provided that the following conditions are met:
                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                  * Redistributions of source code must retain the above copyright
                                                                                                                                                                                                                                                                                    notice, this list of conditions and the following disclaimer.
                                                                                                                                                                                                                                                                                  * Redistributions in binary form must reproduce the above copyright
                                                                                                                                                                                                                                                                                    notice, this list of conditions and the following disclaimer in the
                                                                                                                                                                                                                                                                                    documentation and/or other materials provided with the distribution.
                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            /**
 * Escope (<a href="http://github.com/estools/escope">escope</a>) is an <a
 * href="http://www.ecma-international.org/publications/standards/Ecma-262.htm">ECMAScript</a>
 * scope analyzer extracted from the <a
 * href="http://github.com/estools/esmangle">esmangle project</a/>.
 * <p>
 * <em>escope</em> finds lexical scopes in a source program, i.e. areas of that
 * program where different occurrences of the same identifier refer to the same
 * variable. With each scope the contained variables are collected, and each
 * identifier reference in code is linked to its corresponding variable (if
 * possible).
 * <p>
 * <em>escope</em> works on a syntax tree of the parsed source code which has
 * to adhere to the <a
 * href="https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API">
 * Mozilla Parser API</a>. E.g. <a href="http://esprima.org">esprima</a> is a parser
 * that produces such syntax trees.
 * <p>
 * The main interface is the {@link analyze} function.
 * @module escope
 */
            /*jslint bitwise:true */
            exports.analyze = analyze;
            var _assert = require('assert');
            var _assert2 = _interopRequireDefault(_assert);
            var _scopeManager = require('./scope-manager');
            var _scopeManager2 = _interopRequireDefault(_scopeManager);
            var _referencer = require('./referencer');
            var _referencer2 = _interopRequireDefault(_referencer);
            var _reference = require('./reference');
            var _reference2 = _interopRequireDefault(_reference);
            var _variable = require('./variable');
            var _variable2 = _interopRequireDefault(_variable);
            var _scope = require('./scope');
            var _scope2 = _interopRequireDefault(_scope);
            var _package = require('../package.json');
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function defaultOptions() {
                return {
                    optimistic: false,
                    directive: false,
                    nodejsScope: false,
                    impliedStrict: false,
                    sourceType: 'script',
                    // one of ['script', 'module']
                    ecmaVersion: 5,
                    childVisitorKeys: null,
                    fallback: 'iteration'
                };
            }
            function updateDeeply(target, override) {
                var key, val;
                function isHashObject(target) {
                    return (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target instanceof Object && !(target instanceof Array) && !(target instanceof RegExp);
                }
                for (key in override) {
                    if (override.hasOwnProperty(key)) {
                        val = override[key];
                        if (isHashObject(val)) {
                            if (isHashObject(target[key])) {
                                updateDeeply(target[key], val);
                            } else {
                                target[key] = updateDeeply({}, val);
                            }
                        } else {
                            target[key] = val;
                        }
                    }
                }
                return target;
            }
            /**
 * Main interface function. Takes an Esprima syntax tree and returns the
 * analyzed scopes.
 * @function analyze
 * @param {esprima.Tree} tree
 * @param {Object} providedOptions - Options that tailor the scope analysis
 * @param {boolean} [providedOptions.optimistic=false] - the optimistic flag
 * @param {boolean} [providedOptions.directive=false]- the directive flag
 * @param {boolean} [providedOptions.ignoreEval=false]- whether to check 'eval()' calls
 * @param {boolean} [providedOptions.nodejsScope=false]- whether the whole
 * script is executed under node.js environment. When enabled, escope adds
 * a function scope immediately following the global scope.
 * @param {boolean} [providedOptions.impliedStrict=false]- implied strict mode
 * (if ecmaVersion >= 5).
 * @param {string} [providedOptions.sourceType='script']- the source type of the script. one of 'script' and 'module'
 * @param {number} [providedOptions.ecmaVersion=5]- which ECMAScript version is considered
 * @param {Object} [providedOptions.childVisitorKeys=null] - Additional known visitor keys. See [esrecurse](https://github.com/estools/esrecurse)'s the `childVisitorKeys` option.
 * @param {string} [providedOptions.fallback='iteration'] - A kind of the fallback in order to encounter with unknown node. See [esrecurse](https://github.com/estools/esrecurse)'s the `fallback` option.
 * @return {ScopeManager}
 */
            function analyze(tree, providedOptions) {
                var scopeManager, referencer, options;
                options = updateDeeply(defaultOptions(), providedOptions);
                scopeManager = new _scopeManager2.default(options);
                referencer = new _referencer2.default(options, scopeManager);
                referencer.visit(tree);
                (0, _assert2.default)(scopeManager.__currentScope === null, 'currentScope should be null.');
                return scopeManager;
            }
            exports.version = _package.version;
            exports.Reference = _reference2.default;
            exports.Variable = _variable2.default;
            exports.Scope = _scope2.default;
            exports.ScopeManager = _scopeManager2.default;    /* vim: set sw=4 ts=4 et tw=80 : */
        },
        {
            '../package.json': 80,
            './reference': 4,
            './referencer': 5,
            './scope': 7,
            './scope-manager': 6,
            './variable': 8,
            'assert': 9
        }
    ],
    3: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ('value' in descriptor)
                            descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function (Constructor, protoProps, staticProps) {
                    if (protoProps)
                        defineProperties(Constructor.prototype, protoProps);
                    if (staticProps)
                        defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            var _estraverse = require('estraverse');
            var _esrecurse = require('esrecurse');
            var _esrecurse2 = _interopRequireDefault(_esrecurse);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
                }
                return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
            }
            function _inherits(subClass, superClass) {
                if (typeof superClass !== 'function' && superClass !== null) {
                    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass)
                    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Redistribution and use in source and binary forms, with or without
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 modification, are permitted provided that the following conditions are met:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions of source code must retain the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions in binary form must reproduce the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     documentation and/or other materials provided with the distribution.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            function getLast(xs) {
                return xs[xs.length - 1] || null;
            }
            var PatternVisitor = function (_esrecurse$Visitor) {
                _inherits(PatternVisitor, _esrecurse$Visitor);
                _createClass(PatternVisitor, null, [{
                        key: 'isPattern',
                        value: function isPattern(node) {
                            var nodeType = node.type;
                            return nodeType === _estraverse.Syntax.Identifier || nodeType === _estraverse.Syntax.ObjectPattern || nodeType === _estraverse.Syntax.ArrayPattern || nodeType === _estraverse.Syntax.SpreadElement || nodeType === _estraverse.Syntax.RestElement || nodeType === _estraverse.Syntax.AssignmentPattern;
                        }
                    }]);
                function PatternVisitor(options, rootPattern, callback) {
                    _classCallCheck(this, PatternVisitor);
                    var _this = _possibleConstructorReturn(this, (PatternVisitor.__proto__ || Object.getPrototypeOf(PatternVisitor)).call(this, null, options));
                    _this.rootPattern = rootPattern;
                    _this.callback = callback;
                    _this.assignments = [];
                    _this.rightHandNodes = [];
                    _this.restElements = [];
                    return _this;
                }
                _createClass(PatternVisitor, [
                    {
                        key: 'Identifier',
                        value: function Identifier(pattern) {
                            var lastRestElement = getLast(this.restElements);
                            this.callback(pattern, {
                                topLevel: pattern === this.rootPattern,
                                rest: lastRestElement != null && lastRestElement.argument === pattern,
                                assignments: this.assignments
                            });
                        }
                    },
                    {
                        key: 'Property',
                        value: function Property(property) {
                            // Computed property's key is a right hand node.
                            if (property.computed) {
                                this.rightHandNodes.push(property.key);
                            }
                            // If it's shorthand, its key is same as its value.
                            // If it's shorthand and has its default value, its key is same as its value.left (the value is AssignmentPattern).
                            // If it's not shorthand, the name of new variable is its value's.
                            this.visit(property.value);
                        }
                    },
                    {
                        key: 'ArrayPattern',
                        value: function ArrayPattern(pattern) {
                            var i, iz, element;
                            for (i = 0, iz = pattern.elements.length; i < iz; ++i) {
                                element = pattern.elements[i];
                                this.visit(element);
                            }
                        }
                    },
                    {
                        key: 'AssignmentPattern',
                        value: function AssignmentPattern(pattern) {
                            this.assignments.push(pattern);
                            this.visit(pattern.left);
                            this.rightHandNodes.push(pattern.right);
                            this.assignments.pop();
                        }
                    },
                    {
                        key: 'RestElement',
                        value: function RestElement(pattern) {
                            this.restElements.push(pattern);
                            this.visit(pattern.argument);
                            this.restElements.pop();
                        }
                    },
                    {
                        key: 'MemberExpression',
                        value: function MemberExpression(node) {
                            // Computed property's key is a right hand node.
                            if (node.computed) {
                                this.rightHandNodes.push(node.property);
                            }
                            // the object is only read, write to its property.
                            this.rightHandNodes.push(node.object);
                        }    //
                             // ForInStatement.left and AssignmentExpression.left are LeftHandSideExpression.
                             // By spec, LeftHandSideExpression is Pattern or MemberExpression.
                             //   (see also: https://github.com/estree/estree/pull/20#issuecomment-74584758)
                             // But espree 2.0 and esprima 2.0 parse to ArrayExpression, ObjectExpression, etc...
                             //
                    },
                    {
                        key: 'SpreadElement',
                        value: function SpreadElement(node) {
                            this.visit(node.argument);
                        }
                    },
                    {
                        key: 'ArrayExpression',
                        value: function ArrayExpression(node) {
                            node.elements.forEach(this.visit, this);
                        }
                    },
                    {
                        key: 'AssignmentExpression',
                        value: function AssignmentExpression(node) {
                            this.assignments.push(node);
                            this.visit(node.left);
                            this.rightHandNodes.push(node.right);
                            this.assignments.pop();
                        }
                    },
                    {
                        key: 'CallExpression',
                        value: function CallExpression(node) {
                            var _this2 = this;
                            // arguments are right hand nodes.
                            node.arguments.forEach(function (a) {
                                _this2.rightHandNodes.push(a);
                            });
                            this.visit(node.callee);
                        }
                    }
                ]);
                return PatternVisitor;
            }(_esrecurse2.default.Visitor);
            /* vim: set sw=4 ts=4 et tw=80 : */
            exports.default = PatternVisitor;
        },
        {
            'esrecurse': 68,
            'estraverse': 72
        }
    ],
    4: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ('value' in descriptor)
                            descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function (Constructor, protoProps, staticProps) {
                    if (protoProps)
                        defineProperties(Constructor.prototype, protoProps);
                    if (staticProps)
                        defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            /*
  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            var READ = 1;
            var WRITE = 2;
            var RW = READ | WRITE;
            /**
 * A Reference represents a single occurrence of an identifier in code.
 * @class Reference
 */
            var Reference = function () {
                function Reference(ident, scope, flag, writeExpr, maybeImplicitGlobal, partial, init) {
                    _classCallCheck(this, Reference);
                    /**
     * Identifier syntax node.
     * @member {esprima#Identifier} Reference#identifier
     */
                    this.identifier = ident;
                    /**
     * Reference to the enclosing Scope.
     * @member {Scope} Reference#from
     */
                    this.from = scope;
                    /**
     * Whether the reference comes from a dynamic scope (such as 'eval',
     * 'with', etc.), and may be trapped by dynamic scopes.
     * @member {boolean} Reference#tainted
     */
                    this.tainted = false;
                    /**
     * The variable this reference is resolved with.
     * @member {Variable} Reference#resolved
     */
                    this.resolved = null;
                    /**
     * The read-write mode of the reference. (Value is one of {@link
     * Reference.READ}, {@link Reference.RW}, {@link Reference.WRITE}).
     * @member {number} Reference#flag
     * @private
     */
                    this.flag = flag;
                    if (this.isWrite()) {
                        /**
       * If reference is writeable, this is the tree being written to it.
       * @member {esprima#Node} Reference#writeExpr
       */
                        this.writeExpr = writeExpr;
                        /**
       * Whether the Reference might refer to a partial value of writeExpr.
       * @member {boolean} Reference#partial
       */
                        this.partial = partial;
                        /**
       * Whether the Reference is to write of initialization.
       * @member {boolean} Reference#init
       */
                        this.init = init;
                    }
                    this.__maybeImplicitGlobal = maybeImplicitGlobal;
                }
                /**
   * Whether the reference is static.
   * @method Reference#isStatic
   * @return {boolean}
   */
                _createClass(Reference, [
                    {
                        key: 'isStatic',
                        value: function isStatic() {
                            return !this.tainted && this.resolved && this.resolved.scope.isStatic();
                        }    /**
     * Whether the reference is writeable.
     * @method Reference#isWrite
     * @return {boolean}
     */
                    },
                    {
                        key: 'isWrite',
                        value: function isWrite() {
                            return !!(this.flag & Reference.WRITE);
                        }    /**
     * Whether the reference is readable.
     * @method Reference#isRead
     * @return {boolean}
     */
                    },
                    {
                        key: 'isRead',
                        value: function isRead() {
                            return !!(this.flag & Reference.READ);
                        }    /**
     * Whether the reference is read-only.
     * @method Reference#isReadOnly
     * @return {boolean}
     */
                    },
                    {
                        key: 'isReadOnly',
                        value: function isReadOnly() {
                            return this.flag === Reference.READ;
                        }    /**
     * Whether the reference is write-only.
     * @method Reference#isWriteOnly
     * @return {boolean}
     */
                    },
                    {
                        key: 'isWriteOnly',
                        value: function isWriteOnly() {
                            return this.flag === Reference.WRITE;
                        }    /**
     * Whether the reference is read-write.
     * @method Reference#isReadWrite
     * @return {boolean}
     */
                    },
                    {
                        key: 'isReadWrite',
                        value: function isReadWrite() {
                            return this.flag === Reference.RW;
                        }
                    }
                ]);
                return Reference;
            }();
            /**
 * @constant Reference.READ
 * @private
 */
            exports.default = Reference;
            Reference.READ = READ;
            /**
 * @constant Reference.WRITE
 * @private
 */
            Reference.WRITE = WRITE;
            /**
 * @constant Reference.RW
 * @private
 */
            Reference.RW = RW;    /* vim: set sw=4 ts=4 et tw=80 : */
        },
        {}
    ],
    5: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ('value' in descriptor)
                            descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function (Constructor, protoProps, staticProps) {
                    if (protoProps)
                        defineProperties(Constructor.prototype, protoProps);
                    if (staticProps)
                        defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            var _estraverse = require('estraverse');
            var _esrecurse = require('esrecurse');
            var _esrecurse2 = _interopRequireDefault(_esrecurse);
            var _reference = require('./reference');
            var _reference2 = _interopRequireDefault(_reference);
            var _variable = require('./variable');
            var _variable2 = _interopRequireDefault(_variable);
            var _patternVisitor = require('./pattern-visitor');
            var _patternVisitor2 = _interopRequireDefault(_patternVisitor);
            var _definition = require('./definition');
            var _assert = require('assert');
            var _assert2 = _interopRequireDefault(_assert);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
                }
                return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
            }
            function _inherits(subClass, superClass) {
                if (typeof superClass !== 'function' && superClass !== null) {
                    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass)
                    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Redistribution and use in source and binary forms, with or without
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 modification, are permitted provided that the following conditions are met:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions of source code must retain the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions in binary form must reproduce the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     documentation and/or other materials provided with the distribution.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            function traverseIdentifierInPattern(options, rootPattern, referencer, callback) {
                // Call the callback at left hand identifier nodes, and Collect right hand nodes.
                var visitor = new _patternVisitor2.default(options, rootPattern, callback);
                visitor.visit(rootPattern);
                // Process the right hand nodes recursively.
                if (referencer != null) {
                    visitor.rightHandNodes.forEach(referencer.visit, referencer);
                }
            }
            // Importing ImportDeclaration.
            // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-moduledeclarationinstantiation
            // https://github.com/estree/estree/blob/master/es6.md#importdeclaration
            // FIXME: Now, we don't create module environment, because the context is
            // implementation dependent.
            var Importer = function (_esrecurse$Visitor) {
                _inherits(Importer, _esrecurse$Visitor);
                function Importer(declaration, referencer) {
                    _classCallCheck(this, Importer);
                    var _this = _possibleConstructorReturn(this, (Importer.__proto__ || Object.getPrototypeOf(Importer)).call(this, null, referencer.options));
                    _this.declaration = declaration;
                    _this.referencer = referencer;
                    return _this;
                }
                _createClass(Importer, [
                    {
                        key: 'visitImport',
                        value: function visitImport(id, specifier) {
                            var _this2 = this;
                            this.referencer.visitPattern(id, function (pattern) {
                                _this2.referencer.currentScope().__define(pattern, new _definition.Definition(_variable2.default.ImportBinding, pattern, specifier, _this2.declaration, null, null));
                            });
                        }
                    },
                    {
                        key: 'ImportNamespaceSpecifier',
                        value: function ImportNamespaceSpecifier(node) {
                            var local = node.local || node.id;
                            if (local) {
                                this.visitImport(local, node);
                            }
                        }
                    },
                    {
                        key: 'ImportDefaultSpecifier',
                        value: function ImportDefaultSpecifier(node) {
                            var local = node.local || node.id;
                            this.visitImport(local, node);
                        }
                    },
                    {
                        key: 'ImportSpecifier',
                        value: function ImportSpecifier(node) {
                            var local = node.local || node.id;
                            if (node.name) {
                                this.visitImport(node.name, node);
                            } else {
                                this.visitImport(local, node);
                            }
                        }
                    }
                ]);
                return Importer;
            }(_esrecurse2.default.Visitor);
            // Referencing variables and creating bindings.
            var Referencer = function (_esrecurse$Visitor2) {
                _inherits(Referencer, _esrecurse$Visitor2);
                function Referencer(options, scopeManager) {
                    _classCallCheck(this, Referencer);
                    var _this3 = _possibleConstructorReturn(this, (Referencer.__proto__ || Object.getPrototypeOf(Referencer)).call(this, null, options));
                    _this3.options = options;
                    _this3.scopeManager = scopeManager;
                    _this3.parent = null;
                    _this3.isInnerMethodDefinition = false;
                    return _this3;
                }
                _createClass(Referencer, [
                    {
                        key: 'currentScope',
                        value: function currentScope() {
                            return this.scopeManager.__currentScope;
                        }
                    },
                    {
                        key: 'close',
                        value: function close(node) {
                            while (this.currentScope() && node === this.currentScope().block) {
                                this.scopeManager.__currentScope = this.currentScope().__close(this.scopeManager);
                            }
                        }
                    },
                    {
                        key: 'pushInnerMethodDefinition',
                        value: function pushInnerMethodDefinition(isInnerMethodDefinition) {
                            var previous = this.isInnerMethodDefinition;
                            this.isInnerMethodDefinition = isInnerMethodDefinition;
                            return previous;
                        }
                    },
                    {
                        key: 'popInnerMethodDefinition',
                        value: function popInnerMethodDefinition(isInnerMethodDefinition) {
                            this.isInnerMethodDefinition = isInnerMethodDefinition;
                        }
                    },
                    {
                        key: 'materializeTDZScope',
                        value: function materializeTDZScope(node, iterationNode) {
                            // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-runtime-semantics-forin-div-ofexpressionevaluation-abstract-operation
                            // TDZ scope hides the declaration's names.
                            this.scopeManager.__nestTDZScope(node, iterationNode);
                            this.visitVariableDeclaration(this.currentScope(), _variable2.default.TDZ, iterationNode.left, 0, true);
                        }
                    },
                    {
                        key: 'materializeIterationScope',
                        value: function materializeIterationScope(node) {
                            var _this4 = this;
                            // Generate iteration scope for upper ForIn/ForOf Statements.
                            var letOrConstDecl;
                            this.scopeManager.__nestForScope(node);
                            letOrConstDecl = node.left;
                            this.visitVariableDeclaration(this.currentScope(), _variable2.default.Variable, letOrConstDecl, 0);
                            this.visitPattern(letOrConstDecl.declarations[0].id, function (pattern) {
                                _this4.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, null, true, true);
                            });
                        }
                    },
                    {
                        key: 'referencingDefaultValue',
                        value: function referencingDefaultValue(pattern, assignments, maybeImplicitGlobal, init) {
                            var scope = this.currentScope();
                            assignments.forEach(function (assignment) {
                                scope.__referencing(pattern, _reference2.default.WRITE, assignment.right, maybeImplicitGlobal, pattern !== assignment.left, init);
                            });
                        }
                    },
                    {
                        key: 'visitPattern',
                        value: function visitPattern(node, options, callback) {
                            if (typeof options === 'function') {
                                callback = options;
                                options = { processRightHandNodes: false };
                            }
                            traverseIdentifierInPattern(this.options, node, options.processRightHandNodes ? this : null, callback);
                        }
                    },
                    {
                        key: 'visitFunction',
                        value: function visitFunction(node) {
                            var _this5 = this;
                            var i, iz;
                            // FunctionDeclaration name is defined in upper scope
                            // NOTE: Not referring variableScope. It is intended.
                            // Since
                            //  in ES5, FunctionDeclaration should be in FunctionBody.
                            //  in ES6, FunctionDeclaration should be block scoped.
                            if (node.type === _estraverse.Syntax.FunctionDeclaration) {
                                // id is defined in upper scope
                                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.FunctionName, node.id, node, null, null, null));
                            }
                            // FunctionExpression with name creates its special scope;
                            // FunctionExpressionNameScope.
                            if (node.type === _estraverse.Syntax.FunctionExpression && node.id) {
                                this.scopeManager.__nestFunctionExpressionNameScope(node);
                            }
                            // Consider this function is in the MethodDefinition.
                            this.scopeManager.__nestFunctionScope(node, this.isInnerMethodDefinition);
                            // Process parameter declarations.
                            for (i = 0, iz = node.params.length; i < iz; ++i) {
                                this.visitPattern(node.params[i], { processRightHandNodes: true }, function (pattern, info) {
                                    _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, i, info.rest));
                                    _this5.referencingDefaultValue(pattern, info.assignments, null, true);
                                });
                            }
                            // if there's a rest argument, add that
                            if (node.rest) {
                                this.visitPattern({
                                    type: 'RestElement',
                                    argument: node.rest
                                }, function (pattern) {
                                    _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, node.params.length, true));
                                });
                            }
                            // Skip BlockStatement to prevent creating BlockStatement scope.
                            if (node.body.type === _estraverse.Syntax.BlockStatement) {
                                this.visitChildren(node.body);
                            } else {
                                this.visit(node.body);
                            }
                            this.close(node);
                        }
                    },
                    {
                        key: 'visitClass',
                        value: function visitClass(node) {
                            if (node.type === _estraverse.Syntax.ClassDeclaration) {
                                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.ClassName, node.id, node, null, null, null));
                            }
                            // FIXME: Maybe consider TDZ.
                            this.visit(node.superClass);
                            this.scopeManager.__nestClassScope(node);
                            if (node.id) {
                                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.ClassName, node.id, node));
                            }
                            this.visit(node.body);
                            this.close(node);
                        }
                    },
                    {
                        key: 'visitProperty',
                        value: function visitProperty(node) {
                            var previous, isMethodDefinition;
                            if (node.computed) {
                                this.visit(node.key);
                            }
                            isMethodDefinition = node.type === _estraverse.Syntax.MethodDefinition;
                            if (isMethodDefinition) {
                                previous = this.pushInnerMethodDefinition(true);
                            }
                            this.visit(node.value);
                            if (isMethodDefinition) {
                                this.popInnerMethodDefinition(previous);
                            }
                        }
                    },
                    {
                        key: 'visitForIn',
                        value: function visitForIn(node) {
                            var _this6 = this;
                            if (node.left.type === _estraverse.Syntax.VariableDeclaration && node.left.kind !== 'var') {
                                this.materializeTDZScope(node.right, node);
                                this.visit(node.right);
                                this.close(node.right);
                                this.materializeIterationScope(node);
                                this.visit(node.body);
                                this.close(node);
                            } else {
                                if (node.left.type === _estraverse.Syntax.VariableDeclaration) {
                                    this.visit(node.left);
                                    this.visitPattern(node.left.declarations[0].id, function (pattern) {
                                        _this6.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, null, true, true);
                                    });
                                } else {
                                    this.visitPattern(node.left, { processRightHandNodes: true }, function (pattern, info) {
                                        var maybeImplicitGlobal = null;
                                        if (!_this6.currentScope().isStrict) {
                                            maybeImplicitGlobal = {
                                                pattern: pattern,
                                                node: node
                                            };
                                        }
                                        _this6.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);
                                        _this6.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, maybeImplicitGlobal, true, false);
                                    });
                                }
                                this.visit(node.right);
                                this.visit(node.body);
                            }
                        }
                    },
                    {
                        key: 'visitVariableDeclaration',
                        value: function visitVariableDeclaration(variableTargetScope, type, node, index, fromTDZ) {
                            var _this7 = this;
                            // If this was called to initialize a TDZ scope, this needs to make definitions, but doesn't make references.
                            var decl, init;
                            decl = node.declarations[index];
                            init = decl.init;
                            this.visitPattern(decl.id, { processRightHandNodes: !fromTDZ }, function (pattern, info) {
                                variableTargetScope.__define(pattern, new _definition.Definition(type, pattern, decl, node, index, node.kind));
                                if (!fromTDZ) {
                                    _this7.referencingDefaultValue(pattern, info.assignments, null, true);
                                }
                                if (init) {
                                    _this7.currentScope().__referencing(pattern, _reference2.default.WRITE, init, null, !info.topLevel, true);
                                }
                            });
                        }
                    },
                    {
                        key: 'AssignmentExpression',
                        value: function AssignmentExpression(node) {
                            var _this8 = this;
                            if (_patternVisitor2.default.isPattern(node.left)) {
                                if (node.operator === '=') {
                                    this.visitPattern(node.left, { processRightHandNodes: true }, function (pattern, info) {
                                        var maybeImplicitGlobal = null;
                                        if (!_this8.currentScope().isStrict) {
                                            maybeImplicitGlobal = {
                                                pattern: pattern,
                                                node: node
                                            };
                                        }
                                        _this8.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);
                                        _this8.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, maybeImplicitGlobal, !info.topLevel, false);
                                    });
                                } else {
                                    this.currentScope().__referencing(node.left, _reference2.default.RW, node.right);
                                }
                            } else {
                                this.visit(node.left);
                            }
                            this.visit(node.right);
                        }
                    },
                    {
                        key: 'CatchClause',
                        value: function CatchClause(node) {
                            var _this9 = this;
                            this.scopeManager.__nestCatchScope(node);
                            this.visitPattern(node.param, { processRightHandNodes: true }, function (pattern, info) {
                                _this9.currentScope().__define(pattern, new _definition.Definition(_variable2.default.CatchClause, node.param, node, null, null, null));
                                _this9.referencingDefaultValue(pattern, info.assignments, null, true);
                            });
                            this.visit(node.body);
                            this.close(node);
                        }
                    },
                    {
                        key: 'Program',
                        value: function Program(node) {
                            this.scopeManager.__nestGlobalScope(node);
                            if (this.scopeManager.__isNodejsScope()) {
                                // Force strictness of GlobalScope to false when using node.js scope.
                                this.currentScope().isStrict = false;
                                this.scopeManager.__nestFunctionScope(node, false);
                            }
                            if (this.scopeManager.__isES6() && this.scopeManager.isModule()) {
                                this.scopeManager.__nestModuleScope(node);
                            }
                            if (this.scopeManager.isStrictModeSupported() && this.scopeManager.isImpliedStrict()) {
                                this.currentScope().isStrict = true;
                            }
                            this.visitChildren(node);
                            this.close(node);
                        }
                    },
                    {
                        key: 'Identifier',
                        value: function Identifier(node) {
                            this.currentScope().__referencing(node);
                        }
                    },
                    {
                        key: 'UpdateExpression',
                        value: function UpdateExpression(node) {
                            if (_patternVisitor2.default.isPattern(node.argument)) {
                                this.currentScope().__referencing(node.argument, _reference2.default.RW, null);
                            } else {
                                this.visitChildren(node);
                            }
                        }
                    },
                    {
                        key: 'MemberExpression',
                        value: function MemberExpression(node) {
                            this.visit(node.object);
                            if (node.computed) {
                                this.visit(node.property);
                            }
                        }
                    },
                    {
                        key: 'Property',
                        value: function Property(node) {
                            this.visitProperty(node);
                        }
                    },
                    {
                        key: 'MethodDefinition',
                        value: function MethodDefinition(node) {
                            this.visitProperty(node);
                        }
                    },
                    {
                        key: 'BreakStatement',
                        value: function BreakStatement() {
                        }
                    },
                    {
                        key: 'ContinueStatement',
                        value: function ContinueStatement() {
                        }
                    },
                    {
                        key: 'LabeledStatement',
                        value: function LabeledStatement(node) {
                            this.visit(node.body);
                        }
                    },
                    {
                        key: 'ForStatement',
                        value: function ForStatement(node) {
                            // Create ForStatement declaration.
                            // NOTE: In ES6, ForStatement dynamically generates
                            // per iteration environment. However, escope is
                            // a static analyzer, we only generate one scope for ForStatement.
                            if (node.init && node.init.type === _estraverse.Syntax.VariableDeclaration && node.init.kind !== 'var') {
                                this.scopeManager.__nestForScope(node);
                            }
                            this.visitChildren(node);
                            this.close(node);
                        }
                    },
                    {
                        key: 'ClassExpression',
                        value: function ClassExpression(node) {
                            this.visitClass(node);
                        }
                    },
                    {
                        key: 'ClassDeclaration',
                        value: function ClassDeclaration(node) {
                            this.visitClass(node);
                        }
                    },
                    {
                        key: 'CallExpression',
                        value: function CallExpression(node) {
                            // Check this is direct call to eval
                            if (!this.scopeManager.__ignoreEval() && node.callee.type === _estraverse.Syntax.Identifier && node.callee.name === 'eval') {
                                // NOTE: This should be `variableScope`. Since direct eval call always creates Lexical environment and
                                // let / const should be enclosed into it. Only VariableDeclaration affects on the caller's environment.
                                this.currentScope().variableScope.__detectEval();
                            }
                            this.visitChildren(node);
                        }
                    },
                    {
                        key: 'BlockStatement',
                        value: function BlockStatement(node) {
                            if (this.scopeManager.__isES6()) {
                                this.scopeManager.__nestBlockScope(node);
                            }
                            this.visitChildren(node);
                            this.close(node);
                        }
                    },
                    {
                        key: 'ThisExpression',
                        value: function ThisExpression() {
                            this.currentScope().variableScope.__detectThis();
                        }
                    },
                    {
                        key: 'WithStatement',
                        value: function WithStatement(node) {
                            this.visit(node.object);
                            // Then nest scope for WithStatement.
                            this.scopeManager.__nestWithScope(node);
                            this.visit(node.body);
                            this.close(node);
                        }
                    },
                    {
                        key: 'VariableDeclaration',
                        value: function VariableDeclaration(node) {
                            var variableTargetScope, i, iz, decl;
                            variableTargetScope = node.kind === 'var' ? this.currentScope().variableScope : this.currentScope();
                            for (i = 0, iz = node.declarations.length; i < iz; ++i) {
                                decl = node.declarations[i];
                                this.visitVariableDeclaration(variableTargetScope, _variable2.default.Variable, node, i);
                                if (decl.init) {
                                    this.visit(decl.init);
                                }
                            }
                        }    // sec 13.11.8
                    },
                    {
                        key: 'SwitchStatement',
                        value: function SwitchStatement(node) {
                            var i, iz;
                            this.visit(node.discriminant);
                            if (this.scopeManager.__isES6()) {
                                this.scopeManager.__nestSwitchScope(node);
                            }
                            for (i = 0, iz = node.cases.length; i < iz; ++i) {
                                this.visit(node.cases[i]);
                            }
                            this.close(node);
                        }
                    },
                    {
                        key: 'FunctionDeclaration',
                        value: function FunctionDeclaration(node) {
                            this.visitFunction(node);
                        }
                    },
                    {
                        key: 'FunctionExpression',
                        value: function FunctionExpression(node) {
                            this.visitFunction(node);
                        }
                    },
                    {
                        key: 'ForOfStatement',
                        value: function ForOfStatement(node) {
                            this.visitForIn(node);
                        }
                    },
                    {
                        key: 'ForInStatement',
                        value: function ForInStatement(node) {
                            this.visitForIn(node);
                        }
                    },
                    {
                        key: 'ArrowFunctionExpression',
                        value: function ArrowFunctionExpression(node) {
                            this.visitFunction(node);
                        }
                    },
                    {
                        key: 'ImportDeclaration',
                        value: function ImportDeclaration(node) {
                            var importer;
                            (0, _assert2.default)(this.scopeManager.__isES6() && this.scopeManager.isModule(), 'ImportDeclaration should appear when the mode is ES6 and in the module context.');
                            importer = new Importer(node, this);
                            importer.visit(node);
                        }
                    },
                    {
                        key: 'visitExportDeclaration',
                        value: function visitExportDeclaration(node) {
                            if (node.source) {
                                return;
                            }
                            if (node.declaration) {
                                this.visit(node.declaration);
                                return;
                            }
                            this.visitChildren(node);
                        }
                    },
                    {
                        key: 'ExportDeclaration',
                        value: function ExportDeclaration(node) {
                            this.visitExportDeclaration(node);
                        }
                    },
                    {
                        key: 'ExportNamedDeclaration',
                        value: function ExportNamedDeclaration(node) {
                            this.visitExportDeclaration(node);
                        }
                    },
                    {
                        key: 'ExportSpecifier',
                        value: function ExportSpecifier(node) {
                            var local = node.id || node.local;
                            this.visit(local);
                        }
                    },
                    {
                        key: 'MetaProperty',
                        value: function MetaProperty() {
                        }
                    }
                ]);
                return Referencer;
            }(_esrecurse2.default.Visitor);
            /* vim: set sw=4 ts=4 et tw=80 : */
            exports.default = Referencer;
        },
        {
            './definition': 1,
            './pattern-visitor': 3,
            './reference': 4,
            './variable': 8,
            'assert': 9,
            'esrecurse': 68,
            'estraverse': 72
        }
    ],
    6: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ('value' in descriptor)
                            descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function (Constructor, protoProps, staticProps) {
                    if (protoProps)
                        defineProperties(Constructor.prototype, protoProps);
                    if (staticProps)
                        defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Redistribution and use in source and binary forms, with or without
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       modification, are permitted provided that the following conditions are met:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions of source code must retain the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions in binary form must reproduce the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           documentation and/or other materials provided with the distribution.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            var _es6WeakMap = require('es6-weak-map');
            var _es6WeakMap2 = _interopRequireDefault(_es6WeakMap);
            var _scope = require('./scope');
            var _scope2 = _interopRequireDefault(_scope);
            var _assert = require('assert');
            var _assert2 = _interopRequireDefault(_assert);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            /**
 * @class ScopeManager
 */
            var ScopeManager = function () {
                function ScopeManager(options) {
                    _classCallCheck(this, ScopeManager);
                    this.scopes = [];
                    this.globalScope = null;
                    this.__nodeToScope = new _es6WeakMap2.default();
                    this.__currentScope = null;
                    this.__options = options;
                    this.__declaredVariables = new _es6WeakMap2.default();
                }
                _createClass(ScopeManager, [
                    {
                        key: '__useDirective',
                        value: function __useDirective() {
                            return this.__options.directive;
                        }
                    },
                    {
                        key: '__isOptimistic',
                        value: function __isOptimistic() {
                            return this.__options.optimistic;
                        }
                    },
                    {
                        key: '__ignoreEval',
                        value: function __ignoreEval() {
                            return this.__options.ignoreEval;
                        }
                    },
                    {
                        key: '__isNodejsScope',
                        value: function __isNodejsScope() {
                            return this.__options.nodejsScope;
                        }
                    },
                    {
                        key: 'isModule',
                        value: function isModule() {
                            return this.__options.sourceType === 'module';
                        }
                    },
                    {
                        key: 'isImpliedStrict',
                        value: function isImpliedStrict() {
                            return this.__options.impliedStrict;
                        }
                    },
                    {
                        key: 'isStrictModeSupported',
                        value: function isStrictModeSupported() {
                            return this.__options.ecmaVersion >= 5;
                        }    // Returns appropriate scope for this node.
                    },
                    {
                        key: '__get',
                        value: function __get(node) {
                            return this.__nodeToScope.get(node);
                        }    /**
         * Get variables that are declared by the node.
         *
         * "are declared by the node" means the node is same as `Variable.defs[].node` or `Variable.defs[].parent`.
         * If the node declares nothing, this method returns an empty array.
         * CAUTION: This API is experimental. See https://github.com/estools/escope/pull/69 for more details.
         *
         * @param {Esprima.Node} node - a node to get.
         * @returns {Variable[]} variables that declared by the node.
         */
                    },
                    {
                        key: 'getDeclaredVariables',
                        value: function getDeclaredVariables(node) {
                            return this.__declaredVariables.get(node) || [];
                        }    /**
         * acquire scope from node.
         * @method ScopeManager#acquire
         * @param {Esprima.Node} node - node for the acquired scope.
         * @param {boolean=} inner - look up the most inner scope, default value is false.
         * @return {Scope?}
         */
                    },
                    {
                        key: 'acquire',
                        value: function acquire(node, inner) {
                            var scopes, scope, i, iz;
                            function predicate(scope) {
                                if (scope.type === 'function' && scope.functionExpressionScope) {
                                    return false;
                                }
                                if (scope.type === 'TDZ') {
                                    return false;
                                }
                                return true;
                            }
                            scopes = this.__get(node);
                            if (!scopes || scopes.length === 0) {
                                return null;
                            }
                            // Heuristic selection from all scopes.
                            // If you would like to get all scopes, please use ScopeManager#acquireAll.
                            if (scopes.length === 1) {
                                return scopes[0];
                            }
                            if (inner) {
                                for (i = scopes.length - 1; i >= 0; --i) {
                                    scope = scopes[i];
                                    if (predicate(scope)) {
                                        return scope;
                                    }
                                }
                            } else {
                                for (i = 0, iz = scopes.length; i < iz; ++i) {
                                    scope = scopes[i];
                                    if (predicate(scope)) {
                                        return scope;
                                    }
                                }
                            }
                            return null;
                        }    /**
         * acquire all scopes from node.
         * @method ScopeManager#acquireAll
         * @param {Esprima.Node} node - node for the acquired scope.
         * @return {Scope[]?}
         */
                    },
                    {
                        key: 'acquireAll',
                        value: function acquireAll(node) {
                            return this.__get(node);
                        }    /**
         * release the node.
         * @method ScopeManager#release
         * @param {Esprima.Node} node - releasing node.
         * @param {boolean=} inner - look up the most inner scope, default value is false.
         * @return {Scope?} upper scope for the node.
         */
                    },
                    {
                        key: 'release',
                        value: function release(node, inner) {
                            var scopes, scope;
                            scopes = this.__get(node);
                            if (scopes && scopes.length) {
                                scope = scopes[0].upper;
                                if (!scope) {
                                    return null;
                                }
                                return this.acquire(scope.block, inner);
                            }
                            return null;
                        }
                    },
                    {
                        key: 'attach',
                        value: function attach() {
                        }
                    },
                    {
                        key: 'detach',
                        value: function detach() {
                        }
                    },
                    {
                        key: '__nestScope',
                        value: function __nestScope(scope) {
                            if (scope instanceof _scope.GlobalScope) {
                                (0, _assert2.default)(this.__currentScope === null);
                                this.globalScope = scope;
                            }
                            this.__currentScope = scope;
                            return scope;
                        }
                    },
                    {
                        key: '__nestGlobalScope',
                        value: function __nestGlobalScope(node) {
                            return this.__nestScope(new _scope.GlobalScope(this, node));
                        }
                    },
                    {
                        key: '__nestBlockScope',
                        value: function __nestBlockScope(node, isMethodDefinition) {
                            return this.__nestScope(new _scope.BlockScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestFunctionScope',
                        value: function __nestFunctionScope(node, isMethodDefinition) {
                            return this.__nestScope(new _scope.FunctionScope(this, this.__currentScope, node, isMethodDefinition));
                        }
                    },
                    {
                        key: '__nestForScope',
                        value: function __nestForScope(node) {
                            return this.__nestScope(new _scope.ForScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestCatchScope',
                        value: function __nestCatchScope(node) {
                            return this.__nestScope(new _scope.CatchScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestWithScope',
                        value: function __nestWithScope(node) {
                            return this.__nestScope(new _scope.WithScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestClassScope',
                        value: function __nestClassScope(node) {
                            return this.__nestScope(new _scope.ClassScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestSwitchScope',
                        value: function __nestSwitchScope(node) {
                            return this.__nestScope(new _scope.SwitchScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestModuleScope',
                        value: function __nestModuleScope(node) {
                            return this.__nestScope(new _scope.ModuleScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestTDZScope',
                        value: function __nestTDZScope(node) {
                            return this.__nestScope(new _scope.TDZScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__nestFunctionExpressionNameScope',
                        value: function __nestFunctionExpressionNameScope(node) {
                            return this.__nestScope(new _scope.FunctionExpressionNameScope(this, this.__currentScope, node));
                        }
                    },
                    {
                        key: '__isES6',
                        value: function __isES6() {
                            return this.__options.ecmaVersion >= 6;
                        }
                    }
                ]);
                return ScopeManager;
            }();
            /* vim: set sw=4 ts=4 et tw=80 : */
            exports.default = ScopeManager;
        },
        {
            './scope': 7,
            'assert': 9,
            'es6-weak-map': 64
        }
    ],
    7: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            exports.ClassScope = exports.ForScope = exports.FunctionScope = exports.SwitchScope = exports.BlockScope = exports.TDZScope = exports.WithScope = exports.CatchScope = exports.FunctionExpressionNameScope = exports.ModuleScope = exports.GlobalScope = undefined;
            var _get = function get(object, property, receiver) {
                if (object === null)
                    object = Function.prototype;
                var desc = Object.getOwnPropertyDescriptor(object, property);
                if (desc === undefined) {
                    var parent = Object.getPrototypeOf(object);
                    if (parent === null) {
                        return undefined;
                    } else {
                        return get(parent, property, receiver);
                    }
                } else if ('value' in desc) {
                    return desc.value;
                } else {
                    var getter = desc.get;
                    if (getter === undefined) {
                        return undefined;
                    }
                    return getter.call(receiver);
                }
            };
            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ('value' in descriptor)
                            descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function (Constructor, protoProps, staticProps) {
                    if (protoProps)
                        defineProperties(Constructor.prototype, protoProps);
                    if (staticProps)
                        defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Redistribution and use in source and binary forms, with or without
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       modification, are permitted provided that the following conditions are met:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions of source code must retain the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Redistributions in binary form must reproduce the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           notice, this list of conditions and the following disclaimer in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           documentation and/or other materials provided with the distribution.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            var _estraverse = require('estraverse');
            var _es6Map = require('es6-map');
            var _es6Map2 = _interopRequireDefault(_es6Map);
            var _reference = require('./reference');
            var _reference2 = _interopRequireDefault(_reference);
            var _variable = require('./variable');
            var _variable2 = _interopRequireDefault(_variable);
            var _definition = require('./definition');
            var _definition2 = _interopRequireDefault(_definition);
            var _assert = require('assert');
            var _assert2 = _interopRequireDefault(_assert);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
                }
                return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
            }
            function _inherits(subClass, superClass) {
                if (typeof superClass !== 'function' && superClass !== null) {
                    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass)
                    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            function isStrictScope(scope, block, isMethodDefinition, useDirective) {
                var body, i, iz, stmt, expr;
                // When upper scope is exists and strict, inner scope is also strict.
                if (scope.upper && scope.upper.isStrict) {
                    return true;
                }
                // ArrowFunctionExpression's scope is always strict scope.
                if (block.type === _estraverse.Syntax.ArrowFunctionExpression) {
                    return true;
                }
                if (isMethodDefinition) {
                    return true;
                }
                if (scope.type === 'class' || scope.type === 'module') {
                    return true;
                }
                if (scope.type === 'block' || scope.type === 'switch') {
                    return false;
                }
                if (scope.type === 'function') {
                    if (block.type === _estraverse.Syntax.Program) {
                        body = block;
                    } else {
                        body = block.body;
                    }
                } else if (scope.type === 'global') {
                    body = block;
                } else {
                    return false;
                }
                // Search 'use strict' directive.
                if (useDirective) {
                    for (i = 0, iz = body.body.length; i < iz; ++i) {
                        stmt = body.body[i];
                        if (stmt.type !== _estraverse.Syntax.DirectiveStatement) {
                            break;
                        }
                        if (stmt.raw === '"use strict"' || stmt.raw === '\'use strict\'') {
                            return true;
                        }
                    }
                } else {
                    for (i = 0, iz = body.body.length; i < iz; ++i) {
                        stmt = body.body[i];
                        if (stmt.type !== _estraverse.Syntax.ExpressionStatement) {
                            break;
                        }
                        expr = stmt.expression;
                        if (expr.type !== _estraverse.Syntax.Literal || typeof expr.value !== 'string') {
                            break;
                        }
                        if (expr.raw != null) {
                            if (expr.raw === '"use strict"' || expr.raw === '\'use strict\'') {
                                return true;
                            }
                        } else {
                            if (expr.value === 'use strict') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
            function registerScope(scopeManager, scope) {
                var scopes;
                scopeManager.scopes.push(scope);
                scopes = scopeManager.__nodeToScope.get(scope.block);
                if (scopes) {
                    scopes.push(scope);
                } else {
                    scopeManager.__nodeToScope.set(scope.block, [scope]);
                }
            }
            function shouldBeStatically(def) {
                return def.type === _variable2.default.ClassName || def.type === _variable2.default.Variable && def.parent.kind !== 'var';
            }
            /**
 * @class Scope
 */
            var Scope = function () {
                function Scope(scopeManager, type, upperScope, block, isMethodDefinition) {
                    _classCallCheck(this, Scope);
                    /**
         * One of 'TDZ', 'module', 'block', 'switch', 'function', 'catch', 'with', 'function', 'class', 'global'.
         * @member {String} Scope#type
         */
                    this.type = type;
                    /**
        * The scoped {@link Variable}s of this scope, as <code>{ Variable.name
        * : Variable }</code>.
        * @member {Map} Scope#set
        */
                    this.set = new _es6Map2.default();
                    /**
         * The tainted variables of this scope, as <code>{ Variable.name :
         * boolean }</code>.
         * @member {Map} Scope#taints */
                    this.taints = new _es6Map2.default();
                    /**
         * Generally, through the lexical scoping of JS you can always know
         * which variable an identifier in the source code refers to. There are
         * a few exceptions to this rule. With 'global' and 'with' scopes you
         * can only decide at runtime which variable a reference refers to.
         * Moreover, if 'eval()' is used in a scope, it might introduce new
         * bindings in this or its parent scopes.
         * All those scopes are considered 'dynamic'.
         * @member {boolean} Scope#dynamic
         */
                    this.dynamic = this.type === 'global' || this.type === 'with';
                    /**
         * A reference to the scope-defining syntax node.
         * @member {esprima.Node} Scope#block
         */
                    this.block = block;
                    /**
        * The {@link Reference|references} that are not resolved with this scope.
        * @member {Reference[]} Scope#through
        */
                    this.through = [];
                    /**
        * The scoped {@link Variable}s of this scope. In the case of a
        * 'function' scope this includes the automatic argument <em>arguments</em> as
        * its first element, as well as all further formal arguments.
        * @member {Variable[]} Scope#variables
        */
                    this.variables = [];
                    /**
        * Any variable {@link Reference|reference} found in this scope. This
        * includes occurrences of local variables as well as variables from
        * parent scopes (including the global scope). For local variables
        * this also includes defining occurrences (like in a 'var' statement).
        * In a 'function' scope this does not include the occurrences of the
        * formal parameter in the parameter list.
        * @member {Reference[]} Scope#references
        */
                    this.references = [];
                    /**
        * For 'global' and 'function' scopes, this is a self-reference. For
        * other scope types this is the <em>variableScope</em> value of the
        * parent scope.
        * @member {Scope} Scope#variableScope
        */
                    this.variableScope = this.type === 'global' || this.type === 'function' || this.type === 'module' ? this : upperScope.variableScope;
                    /**
        * Whether this scope is created by a FunctionExpression.
        * @member {boolean} Scope#functionExpressionScope
        */
                    this.functionExpressionScope = false;
                    /**
        * Whether this is a scope that contains an 'eval()' invocation.
        * @member {boolean} Scope#directCallToEvalScope
        */
                    this.directCallToEvalScope = false;
                    /**
        * @member {boolean} Scope#thisFound
        */
                    this.thisFound = false;
                    this.__left = [];
                    /**
        * Reference to the parent {@link Scope|scope}.
        * @member {Scope} Scope#upper
        */
                    this.upper = upperScope;
                    /**
        * Whether 'use strict' is in effect in this scope.
        * @member {boolean} Scope#isStrict
        */
                    this.isStrict = isStrictScope(this, block, isMethodDefinition, scopeManager.__useDirective());
                    /**
        * List of nested {@link Scope}s.
        * @member {Scope[]} Scope#childScopes
        */
                    this.childScopes = [];
                    if (this.upper) {
                        this.upper.childScopes.push(this);
                    }
                    this.__declaredVariables = scopeManager.__declaredVariables;
                    registerScope(scopeManager, this);
                }
                _createClass(Scope, [
                    {
                        key: '__shouldStaticallyClose',
                        value: function __shouldStaticallyClose(scopeManager) {
                            return !this.dynamic || scopeManager.__isOptimistic();
                        }
                    },
                    {
                        key: '__shouldStaticallyCloseForGlobal',
                        value: function __shouldStaticallyCloseForGlobal(ref) {
                            // On global scope, let/const/class declarations should be resolved statically.
                            var name = ref.identifier.name;
                            if (!this.set.has(name)) {
                                return false;
                            }
                            var variable = this.set.get(name);
                            var defs = variable.defs;
                            return defs.length > 0 && defs.every(shouldBeStatically);
                        }
                    },
                    {
                        key: '__staticCloseRef',
                        value: function __staticCloseRef(ref) {
                            if (!this.__resolve(ref)) {
                                this.__delegateToUpperScope(ref);
                            }
                        }
                    },
                    {
                        key: '__dynamicCloseRef',
                        value: function __dynamicCloseRef(ref) {
                            // notify all names are through to global
                            var current = this;
                            do {
                                current.through.push(ref);
                                current = current.upper;
                            } while (current);
                        }
                    },
                    {
                        key: '__globalCloseRef',
                        value: function __globalCloseRef(ref) {
                            // let/const/class declarations should be resolved statically.
                            // others should be resolved dynamically.
                            if (this.__shouldStaticallyCloseForGlobal(ref)) {
                                this.__staticCloseRef(ref);
                            } else {
                                this.__dynamicCloseRef(ref);
                            }
                        }
                    },
                    {
                        key: '__close',
                        value: function __close(scopeManager) {
                            var closeRef;
                            if (this.__shouldStaticallyClose(scopeManager)) {
                                closeRef = this.__staticCloseRef;
                            } else if (this.type !== 'global') {
                                closeRef = this.__dynamicCloseRef;
                            } else {
                                closeRef = this.__globalCloseRef;
                            }
                            // Try Resolving all references in this scope.
                            for (var i = 0, iz = this.__left.length; i < iz; ++i) {
                                var ref = this.__left[i];
                                closeRef.call(this, ref);
                            }
                            this.__left = null;
                            return this.upper;
                        }
                    },
                    {
                        key: '__resolve',
                        value: function __resolve(ref) {
                            var variable, name;
                            name = ref.identifier.name;
                            if (this.set.has(name)) {
                                variable = this.set.get(name);
                                variable.references.push(ref);
                                variable.stack = variable.stack && ref.from.variableScope === this.variableScope;
                                if (ref.tainted) {
                                    variable.tainted = true;
                                    this.taints.set(variable.name, true);
                                }
                                ref.resolved = variable;
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        key: '__delegateToUpperScope',
                        value: function __delegateToUpperScope(ref) {
                            if (this.upper) {
                                this.upper.__left.push(ref);
                            }
                            this.through.push(ref);
                        }
                    },
                    {
                        key: '__addDeclaredVariablesOfNode',
                        value: function __addDeclaredVariablesOfNode(variable, node) {
                            if (node == null) {
                                return;
                            }
                            var variables = this.__declaredVariables.get(node);
                            if (variables == null) {
                                variables = [];
                                this.__declaredVariables.set(node, variables);
                            }
                            if (variables.indexOf(variable) === -1) {
                                variables.push(variable);
                            }
                        }
                    },
                    {
                        key: '__defineGeneric',
                        value: function __defineGeneric(name, set, variables, node, def) {
                            var variable;
                            variable = set.get(name);
                            if (!variable) {
                                variable = new _variable2.default(name, this);
                                set.set(name, variable);
                                variables.push(variable);
                            }
                            if (def) {
                                variable.defs.push(def);
                                if (def.type !== _variable2.default.TDZ) {
                                    this.__addDeclaredVariablesOfNode(variable, def.node);
                                    this.__addDeclaredVariablesOfNode(variable, def.parent);
                                }
                            }
                            if (node) {
                                variable.identifiers.push(node);
                            }
                        }
                    },
                    {
                        key: '__define',
                        value: function __define(node, def) {
                            if (node && node.type === _estraverse.Syntax.Identifier) {
                                this.__defineGeneric(node.name, this.set, this.variables, node, def);
                            }
                        }
                    },
                    {
                        key: '__referencing',
                        value: function __referencing(node, assign, writeExpr, maybeImplicitGlobal, partial, init) {
                            // because Array element may be null
                            if (!node || node.type !== _estraverse.Syntax.Identifier) {
                                return;
                            }
                            // Specially handle like `this`.
                            if (node.name === 'super') {
                                return;
                            }
                            var ref = new _reference2.default(node, this, assign || _reference2.default.READ, writeExpr, maybeImplicitGlobal, !!partial, !!init);
                            this.references.push(ref);
                            this.__left.push(ref);
                        }
                    },
                    {
                        key: '__detectEval',
                        value: function __detectEval() {
                            var current;
                            current = this;
                            this.directCallToEvalScope = true;
                            do {
                                current.dynamic = true;
                                current = current.upper;
                            } while (current);
                        }
                    },
                    {
                        key: '__detectThis',
                        value: function __detectThis() {
                            this.thisFound = true;
                        }
                    },
                    {
                        key: '__isClosed',
                        value: function __isClosed() {
                            return this.__left === null;
                        }    /**
         * returns resolved {Reference}
         * @method Scope#resolve
         * @param {Esprima.Identifier} ident - identifier to be resolved.
         * @return {Reference}
         */
                    },
                    {
                        key: 'resolve',
                        value: function resolve(ident) {
                            var ref, i, iz;
                            (0, _assert2.default)(this.__isClosed(), 'Scope should be closed.');
                            (0, _assert2.default)(ident.type === _estraverse.Syntax.Identifier, 'Target should be identifier.');
                            for (i = 0, iz = this.references.length; i < iz; ++i) {
                                ref = this.references[i];
                                if (ref.identifier === ident) {
                                    return ref;
                                }
                            }
                            return null;
                        }    /**
         * returns this scope is static
         * @method Scope#isStatic
         * @return {boolean}
         */
                    },
                    {
                        key: 'isStatic',
                        value: function isStatic() {
                            return !this.dynamic;
                        }    /**
         * returns this scope has materialized arguments
         * @method Scope#isArgumentsMaterialized
         * @return {boolean}
         */
                    },
                    {
                        key: 'isArgumentsMaterialized',
                        value: function isArgumentsMaterialized() {
                            return true;
                        }    /**
         * returns this scope has materialized `this` reference
         * @method Scope#isThisMaterialized
         * @return {boolean}
         */
                    },
                    {
                        key: 'isThisMaterialized',
                        value: function isThisMaterialized() {
                            return true;
                        }
                    },
                    {
                        key: 'isUsedName',
                        value: function isUsedName(name) {
                            if (this.set.has(name)) {
                                return true;
                            }
                            for (var i = 0, iz = this.through.length; i < iz; ++i) {
                                if (this.through[i].identifier.name === name) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                ]);
                return Scope;
            }();
            exports.default = Scope;
            var GlobalScope = exports.GlobalScope = function (_Scope) {
                _inherits(GlobalScope, _Scope);
                function GlobalScope(scopeManager, block) {
                    _classCallCheck(this, GlobalScope);
                    var _this = _possibleConstructorReturn(this, (GlobalScope.__proto__ || Object.getPrototypeOf(GlobalScope)).call(this, scopeManager, 'global', null, block, false));
                    _this.implicit = {
                        set: new _es6Map2.default(),
                        variables: [],
                        /**
            * List of {@link Reference}s that are left to be resolved (i.e. which
            * need to be linked to the variable they refer to).
            * @member {Reference[]} Scope#implicit#left
            */
                        left: []
                    };
                    return _this;
                }
                _createClass(GlobalScope, [
                    {
                        key: '__close',
                        value: function __close(scopeManager) {
                            var implicit = [];
                            for (var i = 0, iz = this.__left.length; i < iz; ++i) {
                                var ref = this.__left[i];
                                if (ref.__maybeImplicitGlobal && !this.set.has(ref.identifier.name)) {
                                    implicit.push(ref.__maybeImplicitGlobal);
                                }
                            }
                            // create an implicit global variable from assignment expression
                            for (var _i = 0, _iz = implicit.length; _i < _iz; ++_i) {
                                var info = implicit[_i];
                                this.__defineImplicit(info.pattern, new _definition2.default(_variable2.default.ImplicitGlobalVariable, info.pattern, info.node, null, null, null));
                            }
                            this.implicit.left = this.__left;
                            return _get(GlobalScope.prototype.__proto__ || Object.getPrototypeOf(GlobalScope.prototype), '__close', this).call(this, scopeManager);
                        }
                    },
                    {
                        key: '__defineImplicit',
                        value: function __defineImplicit(node, def) {
                            if (node && node.type === _estraverse.Syntax.Identifier) {
                                this.__defineGeneric(node.name, this.implicit.set, this.implicit.variables, node, def);
                            }
                        }
                    }
                ]);
                return GlobalScope;
            }(Scope);
            var ModuleScope = exports.ModuleScope = function (_Scope2) {
                _inherits(ModuleScope, _Scope2);
                function ModuleScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, ModuleScope);
                    return _possibleConstructorReturn(this, (ModuleScope.__proto__ || Object.getPrototypeOf(ModuleScope)).call(this, scopeManager, 'module', upperScope, block, false));
                }
                return ModuleScope;
            }(Scope);
            var FunctionExpressionNameScope = exports.FunctionExpressionNameScope = function (_Scope3) {
                _inherits(FunctionExpressionNameScope, _Scope3);
                function FunctionExpressionNameScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, FunctionExpressionNameScope);
                    var _this3 = _possibleConstructorReturn(this, (FunctionExpressionNameScope.__proto__ || Object.getPrototypeOf(FunctionExpressionNameScope)).call(this, scopeManager, 'function-expression-name', upperScope, block, false));
                    _this3.__define(block.id, new _definition2.default(_variable2.default.FunctionName, block.id, block, null, null, null));
                    _this3.functionExpressionScope = true;
                    return _this3;
                }
                return FunctionExpressionNameScope;
            }(Scope);
            var CatchScope = exports.CatchScope = function (_Scope4) {
                _inherits(CatchScope, _Scope4);
                function CatchScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, CatchScope);
                    return _possibleConstructorReturn(this, (CatchScope.__proto__ || Object.getPrototypeOf(CatchScope)).call(this, scopeManager, 'catch', upperScope, block, false));
                }
                return CatchScope;
            }(Scope);
            var WithScope = exports.WithScope = function (_Scope5) {
                _inherits(WithScope, _Scope5);
                function WithScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, WithScope);
                    return _possibleConstructorReturn(this, (WithScope.__proto__ || Object.getPrototypeOf(WithScope)).call(this, scopeManager, 'with', upperScope, block, false));
                }
                _createClass(WithScope, [{
                        key: '__close',
                        value: function __close(scopeManager) {
                            if (this.__shouldStaticallyClose(scopeManager)) {
                                return _get(WithScope.prototype.__proto__ || Object.getPrototypeOf(WithScope.prototype), '__close', this).call(this, scopeManager);
                            }
                            for (var i = 0, iz = this.__left.length; i < iz; ++i) {
                                var ref = this.__left[i];
                                ref.tainted = true;
                                this.__delegateToUpperScope(ref);
                            }
                            this.__left = null;
                            return this.upper;
                        }
                    }]);
                return WithScope;
            }(Scope);
            var TDZScope = exports.TDZScope = function (_Scope6) {
                _inherits(TDZScope, _Scope6);
                function TDZScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, TDZScope);
                    return _possibleConstructorReturn(this, (TDZScope.__proto__ || Object.getPrototypeOf(TDZScope)).call(this, scopeManager, 'TDZ', upperScope, block, false));
                }
                return TDZScope;
            }(Scope);
            var BlockScope = exports.BlockScope = function (_Scope7) {
                _inherits(BlockScope, _Scope7);
                function BlockScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, BlockScope);
                    return _possibleConstructorReturn(this, (BlockScope.__proto__ || Object.getPrototypeOf(BlockScope)).call(this, scopeManager, 'block', upperScope, block, false));
                }
                return BlockScope;
            }(Scope);
            var SwitchScope = exports.SwitchScope = function (_Scope8) {
                _inherits(SwitchScope, _Scope8);
                function SwitchScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, SwitchScope);
                    return _possibleConstructorReturn(this, (SwitchScope.__proto__ || Object.getPrototypeOf(SwitchScope)).call(this, scopeManager, 'switch', upperScope, block, false));
                }
                return SwitchScope;
            }(Scope);
            var FunctionScope = exports.FunctionScope = function (_Scope9) {
                _inherits(FunctionScope, _Scope9);
                function FunctionScope(scopeManager, upperScope, block, isMethodDefinition) {
                    _classCallCheck(this, FunctionScope);
                    // section 9.2.13, FunctionDeclarationInstantiation.
                    // NOTE Arrow functions never have an arguments objects.
                    var _this9 = _possibleConstructorReturn(this, (FunctionScope.__proto__ || Object.getPrototypeOf(FunctionScope)).call(this, scopeManager, 'function', upperScope, block, isMethodDefinition));
                    if (_this9.block.type !== _estraverse.Syntax.ArrowFunctionExpression) {
                        _this9.__defineArguments();
                    }
                    return _this9;
                }
                _createClass(FunctionScope, [
                    {
                        key: 'isArgumentsMaterialized',
                        value: function isArgumentsMaterialized() {
                            // TODO(Constellation)
                            // We can more aggressive on this condition like this.
                            //
                            // function t() {
                            //     // arguments of t is always hidden.
                            //     function arguments() {
                            //     }
                            // }
                            if (this.block.type === _estraverse.Syntax.ArrowFunctionExpression) {
                                return false;
                            }
                            if (!this.isStatic()) {
                                return true;
                            }
                            var variable = this.set.get('arguments');
                            (0, _assert2.default)(variable, 'Always have arguments variable.');
                            return variable.tainted || variable.references.length !== 0;
                        }
                    },
                    {
                        key: 'isThisMaterialized',
                        value: function isThisMaterialized() {
                            if (!this.isStatic()) {
                                return true;
                            }
                            return this.thisFound;
                        }
                    },
                    {
                        key: '__defineArguments',
                        value: function __defineArguments() {
                            this.__defineGeneric('arguments', this.set, this.variables, null, null);
                            this.taints.set('arguments', true);
                        }
                    }
                ]);
                return FunctionScope;
            }(Scope);
            var ForScope = exports.ForScope = function (_Scope10) {
                _inherits(ForScope, _Scope10);
                function ForScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, ForScope);
                    return _possibleConstructorReturn(this, (ForScope.__proto__ || Object.getPrototypeOf(ForScope)).call(this, scopeManager, 'for', upperScope, block, false));
                }
                return ForScope;
            }(Scope);
            var ClassScope = exports.ClassScope = function (_Scope11) {
                _inherits(ClassScope, _Scope11);
                function ClassScope(scopeManager, upperScope, block) {
                    _classCallCheck(this, ClassScope);
                    return _possibleConstructorReturn(this, (ClassScope.__proto__ || Object.getPrototypeOf(ClassScope)).call(this, scopeManager, 'class', upperScope, block, false));
                }
                return ClassScope;
            }(Scope);    /* vim: set sw=4 ts=4 et tw=80 : */
        },
        {
            './definition': 1,
            './reference': 4,
            './variable': 8,
            'assert': 9,
            'es6-map': 53,
            'estraverse': 72
        }
    ],
    8: [
        function (require, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', { value: true });
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError('Cannot call a class as a function');
                }
            }
            /*
  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            /**
 * A Variable represents a locally scoped identifier. These include arguments to
 * functions.
 * @class Variable
 */
            var Variable = function Variable(name, scope) {
                _classCallCheck(this, Variable);
                /**
   * The variable name, as given in the source code.
   * @member {String} Variable#name
   */
                this.name = name;
                /**
   * List of defining occurrences of this variable (like in 'var ...'
   * statements or as parameter), as AST nodes.
   * @member {esprima.Identifier[]} Variable#identifiers
   */
                this.identifiers = [];
                /**
   * List of {@link Reference|references} of this variable (excluding parameter entries)
   * in its defining scope and all nested scopes. For defining
   * occurrences only see {@link Variable#defs}.
   * @member {Reference[]} Variable#references
   */
                this.references = [];
                /**
   * List of defining occurrences of this variable (like in 'var ...'
   * statements or as parameter), as custom objects.
   * @member {Definition[]} Variable#defs
   */
                this.defs = [];
                this.tainted = false;
                /**
   * Whether this is a stack variable.
   * @member {boolean} Variable#stack
   */
                this.stack = true;
                /**
   * Reference to the enclosing Scope.
   * @member {Scope} Variable#scope
   */
                this.scope = scope;
            };
            exports.default = Variable;
            Variable.CatchClause = 'CatchClause';
            Variable.Parameter = 'Parameter';
            Variable.FunctionName = 'FunctionName';
            Variable.ClassName = 'ClassName';
            Variable.Variable = 'Variable';
            Variable.ImportBinding = 'ImportBinding';
            Variable.TDZ = 'TDZ';
            Variable.ImplicitGlobalVariable = 'ImplicitGlobalVariable';    /* vim: set sw=4 ts=4 et tw=80 : */
        },
        {}
    ],
    9: [
        function (require, module, exports) {
            // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
            //
            // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
            //
            // Originally from narwhal.js (http://narwhaljs.org)
            // Copyright (c) 2009 Thomas Robinson <280north.com>
            //
            // Permission is hereby granted, free of charge, to any person obtaining a copy
            // of this software and associated documentation files (the 'Software'), to
            // deal in the Software without restriction, including without limitation the
            // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
            // sell copies of the Software, and to permit persons to whom the Software is
            // furnished to do so, subject to the following conditions:
            //
            // The above copyright notice and this permission notice shall be included in
            // all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
            // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            // when used in node, this will actually load the util module we depend on
            // versus loading the builtin util module as happens otherwise
            // this is a bug in node module loading as far as I am concerned
            var util = require('util/');
            var pSlice = Array.prototype.slice;
            var hasOwn = Object.prototype.hasOwnProperty;
            // 1. The assert module provides functions that throw
            // AssertionError's when particular conditions are not met. The
            // assert module must conform to the following interface.
            var assert = module.exports = ok;
            // 2. The AssertionError is defined in assert.
            // new assert.AssertionError({ message: message,
            //                             actual: actual,
            //                             expected: expected })
            assert.AssertionError = function AssertionError(options) {
                this.name = 'AssertionError';
                this.actual = options.actual;
                this.expected = options.expected;
                this.operator = options.operator;
                if (options.message) {
                    this.message = options.message;
                    this.generatedMessage = false;
                } else {
                    this.message = getMessage(this);
                    this.generatedMessage = true;
                }
                var stackStartFunction = options.stackStartFunction || fail;
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, stackStartFunction);
                } else {
                    // non v8 browsers so we can have a stacktrace
                    var err = new Error();
                    if (err.stack) {
                        var out = err.stack;
                        // try to strip useless frames
                        var fn_name = stackStartFunction.name;
                        var idx = out.indexOf('\n' + fn_name);
                        if (idx >= 0) {
                            // once we have located the function frame
                            // we need to strip out everything before it (and its line)
                            var next_line = out.indexOf('\n', idx + 1);
                            out = out.substring(next_line + 1);
                        }
                        this.stack = out;
                    }
                }
            };
            // assert.AssertionError instanceof Error
            util.inherits(assert.AssertionError, Error);
            function replacer(key, value) {
                if (util.isUndefined(value)) {
                    return '' + value;
                }
                if (util.isNumber(value) && !isFinite(value)) {
                    return value.toString();
                }
                if (util.isFunction(value) || util.isRegExp(value)) {
                    return value.toString();
                }
                return value;
            }
            function truncate(s, n) {
                if (util.isString(s)) {
                    return s.length < n ? s : s.slice(0, n);
                } else {
                    return s;
                }
            }
            function getMessage(self) {
                return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' + self.operator + ' ' + truncate(JSON.stringify(self.expected, replacer), 128);
            }
            // At present only the three keys mentioned above are used and
            // understood by the spec. Implementations or sub modules can pass
            // other keys to the AssertionError's constructor - they will be
            // ignored.
            // 3. All of the following functions must throw an AssertionError
            // when a corresponding condition is not met, with a message that
            // may be undefined if not provided.  All assertion methods provide
            // both the actual and expected values to the assertion error for
            // display purposes.
            function fail(actual, expected, message, operator, stackStartFunction) {
                throw new assert.AssertionError({
                    message: message,
                    actual: actual,
                    expected: expected,
                    operator: operator,
                    stackStartFunction: stackStartFunction
                });
            }
            // EXTENSION! allows for well behaved errors defined elsewhere.
            assert.fail = fail;
            // 4. Pure assertion tests whether a value is truthy, as determined
            // by !!guard.
            // assert.ok(guard, message_opt);
            // This statement is equivalent to assert.equal(true, !!guard,
            // message_opt);. To test strictly for the value true, use
            // assert.strictEqual(true, guard, message_opt);.
            function ok(value, message) {
                if (!value)
                    fail(value, true, message, '==', assert.ok);
            }
            assert.ok = ok;
            // 5. The equality assertion tests shallow, coercive equality with
            // ==.
            // assert.equal(actual, expected, message_opt);
            assert.equal = function equal(actual, expected, message) {
                if (actual != expected)
                    fail(actual, expected, message, '==', assert.equal);
            };
            // 6. The non-equality assertion tests for whether two objects are not equal
            // with != assert.notEqual(actual, expected, message_opt);
            assert.notEqual = function notEqual(actual, expected, message) {
                if (actual == expected) {
                    fail(actual, expected, message, '!=', assert.notEqual);
                }
            };
            // 7. The equivalence assertion tests a deep equality relation.
            // assert.deepEqual(actual, expected, message_opt);
            assert.deepEqual = function deepEqual(actual, expected, message) {
                if (!_deepEqual(actual, expected)) {
                    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
                }
            };
            function _deepEqual(actual, expected) {
                // 7.1. All identical values are equivalent, as determined by ===.
                if (actual === expected) {
                    return true;
                } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
                    if (actual.length != expected.length)
                        return false;
                    for (var i = 0; i < actual.length; i++) {
                        if (actual[i] !== expected[i])
                            return false;
                    }
                    return true;    // 7.2. If the expected value is a Date object, the actual value is
                                    // equivalent if it is also a Date object that refers to the same time.
                } else if (util.isDate(actual) && util.isDate(expected)) {
                    return actual.getTime() === expected.getTime();    // 7.3 If the expected value is a RegExp object, the actual value is
                                                                       // equivalent if it is also a RegExp object with the same source and
                                                                       // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
                } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
                    return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;    // 7.4. Other pairs that do not both pass typeof value == 'object',
                                                                                                                                                                                                                                         // equivalence is determined by ==.
                } else if (!util.isObject(actual) && !util.isObject(expected)) {
                    return actual == expected;    // 7.5 For all other Object pairs, including Array objects, equivalence is
                                                  // determined by having the same number of owned properties (as verified
                                                  // with Object.prototype.hasOwnProperty.call), the same set of keys
                                                  // (although not necessarily the same order), equivalent values for every
                                                  // corresponding key, and an identical 'prototype' property. Note: this
                                                  // accounts for both named and indexed properties on Arrays.
                } else {
                    return objEquiv(actual, expected);
                }
            }
            function isArguments(object) {
                return Object.prototype.toString.call(object) == '[object Arguments]';
            }
            function objEquiv(a, b) {
                if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
                    return false;
                // an identical 'prototype' property.
                if (a.prototype !== b.prototype)
                    return false;
                // if one is a primitive, the other must be same
                if (util.isPrimitive(a) || util.isPrimitive(b)) {
                    return a === b;
                }
                var aIsArgs = isArguments(a), bIsArgs = isArguments(b);
                if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs)
                    return false;
                if (aIsArgs) {
                    a = pSlice.call(a);
                    b = pSlice.call(b);
                    return _deepEqual(a, b);
                }
                var ka = objectKeys(a), kb = objectKeys(b), key, i;
                // having the same number of owned properties (keys incorporates
                // hasOwnProperty)
                if (ka.length != kb.length)
                    return false;
                //the same set of keys (although not necessarily the same order),
                ka.sort();
                kb.sort();
                //~~~cheap key test
                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] != kb[i])
                        return false;
                }
                //equivalent values for every corresponding key, and
                //~~~possibly expensive deep test
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!_deepEqual(a[key], b[key]))
                        return false;
                }
                return true;
            }
            // 8. The non-equivalence assertion tests for any deep inequality.
            // assert.notDeepEqual(actual, expected, message_opt);
            assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
                if (_deepEqual(actual, expected)) {
                    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
                }
            };
            // 9. The strict equality assertion tests strict equality, as determined by ===.
            // assert.strictEqual(actual, expected, message_opt);
            assert.strictEqual = function strictEqual(actual, expected, message) {
                if (actual !== expected) {
                    fail(actual, expected, message, '===', assert.strictEqual);
                }
            };
            // 10. The strict non-equality assertion tests for strict inequality, as
            // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
            assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
                if (actual === expected) {
                    fail(actual, expected, message, '!==', assert.notStrictEqual);
                }
            };
            function expectedException(actual, expected) {
                if (!actual || !expected) {
                    return false;
                }
                if (Object.prototype.toString.call(expected) == '[object RegExp]') {
                    return expected.test(actual);
                } else if (actual instanceof expected) {
                    return true;
                } else if (expected.call({}, actual) === true) {
                    return true;
                }
                return false;
            }
            function _throws(shouldThrow, block, expected, message) {
                var actual;
                if (util.isString(expected)) {
                    message = expected;
                    expected = null;
                }
                try {
                    block();
                } catch (e) {
                    actual = e;
                }
                message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');
                if (shouldThrow && !actual) {
                    fail(actual, expected, 'Missing expected exception' + message);
                }
                if (!shouldThrow && expectedException(actual, expected)) {
                    fail(actual, expected, 'Got unwanted exception' + message);
                }
                if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
                    throw actual;
                }
            }
            // 11. Expected to throw an error:
            // assert.throws(block, Error_opt, message_opt);
            assert.throws = function (block, error, message) {
                _throws.apply(this, [true].concat(pSlice.call(arguments)));
            };
            // EXTENSION! This is annoying to write outside this module.
            assert.doesNotThrow = function (block, message) {
                _throws.apply(this, [false].concat(pSlice.call(arguments)));
            };
            assert.ifError = function (err) {
                if (err) {
                    throw err;
                }
            };
            var objectKeys = Object.keys || function (obj) {
                var keys = [];
                for (var key in obj) {
                    if (hasOwn.call(obj, key))
                        keys.push(key);
                }
                return keys;
            };
        },
        { 'util/': 79 }
    ],
    10: [
        function (require, module, exports) {
            'use strict';
            var copy = require('es5-ext/object/copy'), map = require('es5-ext/object/map'), callable = require('es5-ext/object/valid-callable'), validValue = require('es5-ext/object/valid-value'), bind = Function.prototype.bind, defineProperty = Object.defineProperty, hasOwnProperty = Object.prototype.hasOwnProperty, define;
            define = function (name, desc, bindTo) {
            };
            module.exports = function (props) {
            };
        },
        {
            'es5-ext/object/copy': 24,
            'es5-ext/object/map': 32,
            'es5-ext/object/valid-callable': 38,
            'es5-ext/object/valid-value': 40
        }
    ],
    11: [
        function (require, module, exports) {
            'use strict';
            var assign = require('es5-ext/object/assign'), normalizeOpts = require('es5-ext/object/normalize-options'), isCallable = require('es5-ext/object/is-callable'), contains = require('es5-ext/string/#/contains'), d;
            d = module.exports = function (dscr, value) {
            };
            d.gs = function (dscr, get, set) {
            };
        },
        {
            'es5-ext/object/assign': 21,
            'es5-ext/object/is-callable': 27,
            'es5-ext/object/normalize-options': 33,
            'es5-ext/string/#/contains': 41
        }
    ],
    12: [
        function (require, module, exports) {
            // Inspired by Google Closure:
            // http://closure-library.googlecode.com/svn/docs/
            // closure_goog_array_array.js.html#goog.array.clear
            'use strict';
            var value = require('../../object/valid-value');
            module.exports = function () {
            };
        },
        { '../../object/valid-value': 40 }
    ],
    13: [
        function (require, module, exports) {
            'use strict';
            var toPosInt = require('../../number/to-pos-integer'), value = require('../../object/valid-value'), indexOf = Array.prototype.indexOf, hasOwnProperty = Object.prototype.hasOwnProperty, abs = Math.abs, floor = Math.floor;
            module.exports = function (searchElement) {
            };
        },
        {
            '../../number/to-pos-integer': 19,
            '../../object/valid-value': 40
        }
    ],
    14: [
        function (require, module, exports) {
            'use strict';
            var toString = Object.prototype.toString, id = toString.call(function () {
                }());
            module.exports = function (x) {
            };
        },
        {}
    ],
    15: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? Math.sign : require('./shim');
        },
        {
            './is-implemented': 16,
            './shim': 17
        }
    ],
    16: [
        function (require, module, exports) {
            'use strict';
            module.exports = function () {
            };
        },
        {}
    ],
    17: [
        function (require, module, exports) {
            'use strict';
            module.exports = function (value) {
            };
        },
        {}
    ],
    18: [
        function (require, module, exports) {
            'use strict';
            var sign = require('../math/sign'), abs = Math.abs, floor = Math.floor;
            module.exports = function (value) {
            };
        },
        { '../math/sign': 15 }
    ],
    19: [
        function (require, module, exports) {
            'use strict';
            var toInteger = require('./to-integer'), max = Math.max;
            module.exports = function (value) {
            };
        },
        { './to-integer': 18 }
    ],
    20: [
        function (require, module, exports) {
            // Internal method, used by iteration functions.
            // Calls a function for each key-value pair found in object
            // Optionally takes compareFn to iterate object in specific order
            'use strict';
            var callable = require('./valid-callable'), value = require('./valid-value'), bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys, propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
            module.exports = function (method, defVal) {
            };
        },
        {
            './valid-callable': 38,
            './valid-value': 40
        }
    ],
    21: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? Object.assign : require('./shim');
        },
        {
            './is-implemented': 22,
            './shim': 23
        }
    ],
    22: [
        function (require, module, exports) {
            arguments[4][16][0].apply(exports, arguments);
        },
        { 'dup': 16 }
    ],
    23: [
        function (require, module, exports) {
            'use strict';
            var keys = require('../keys'), value = require('../valid-value'), max = Math.max;
            module.exports = function (dest, src) {
            };
        },
        {
            '../keys': 29,
            '../valid-value': 40
        }
    ],
    24: [
        function (require, module, exports) {
            'use strict';
            var assign = require('./assign'), value = require('./valid-value');
            module.exports = function (obj) {
            };
        },
        {
            './assign': 21,
            './valid-value': 40
        }
    ],
    25: [
        function (require, module, exports) {
            // Workaround for http://code.google.com/p/v8/issues/detail?id=2804
            'use strict';
            var create = Object.create, shim;
            if (!require('./set-prototype-of/is-implemented')()) {
                shim = require('./set-prototype-of/shim');
            }
            module.exports = function () {
            }();
        },
        {
            './set-prototype-of/is-implemented': 36,
            './set-prototype-of/shim': 37
        }
    ],
    26: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./_iterate')('forEach');
        },
        { './_iterate': 20 }
    ],
    27: [
        function (require, module, exports) {
            // Deprecated
            'use strict';
            module.exports = function (obj) {
            };
        },
        {}
    ],
    28: [
        function (require, module, exports) {
            'use strict';
            var map = {
                function: true,
                object: true
            };
            module.exports = function (x) {
            };
        },
        {}
    ],
    29: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? Object.keys : require('./shim');
        },
        {
            './is-implemented': 30,
            './shim': 31
        }
    ],
    30: [
        function (require, module, exports) {
            arguments[4][16][0].apply(exports, arguments);
        },
        { 'dup': 16 }
    ],
    31: [
        function (require, module, exports) {
            'use strict';
            var keys = Object.keys;
            module.exports = function (object) {
            };
        },
        {}
    ],
    32: [
        function (require, module, exports) {
            'use strict';
            var callable = require('./valid-callable'), forEach = require('./for-each'), call = Function.prototype.call;
            module.exports = function (obj, cb) {
            };
        },
        {
            './for-each': 26,
            './valid-callable': 38
        }
    ],
    33: [
        function (require, module, exports) {
            'use strict';
            var forEach = Array.prototype.forEach, create = Object.create;
            var process = function (src, obj) {
            };
            module.exports = function (options) {
            };
        },
        {}
    ],
    34: [
        function (require, module, exports) {
            'use strict';
            var forEach = Array.prototype.forEach, create = Object.create;
            module.exports = function (arg) {
            };
        },
        {}
    ],
    35: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? Object.setPrototypeOf : require('./shim');
        },
        {
            './is-implemented': 36,
            './shim': 37
        }
    ],
    36: [
        function (require, module, exports) {
            'use strict';
            var create = Object.create, getPrototypeOf = Object.getPrototypeOf, x = {};
            module.exports = function () {
            };
        },
        {}
    ],
    37: [
        function (require, module, exports) {
            // Big thanks to @WebReflection for sorting this out
            // https://gist.github.com/WebReflection/5593554
            'use strict';
            var isObject = require('../is-object'), value = require('../valid-value'), isPrototypeOf = Object.prototype.isPrototypeOf, defineProperty = Object.defineProperty, nullDesc = {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: undefined
                }, validate;
            validate = function (obj, prototype) {
            };
            module.exports = function (status) {
            }(function () {
            }());
            require('../create');
        },
        {
            '../create': 25,
            '../is-object': 28,
            '../valid-value': 40
        }
    ],
    38: [
        function (require, module, exports) {
            'use strict';
            module.exports = function (fn) {
            };
        },
        {}
    ],
    39: [
        function (require, module, exports) {
            'use strict';
            var isObject = require('./is-object');
            module.exports = function (value) {
            };
        },
        { './is-object': 28 }
    ],
    40: [
        function (require, module, exports) {
            arguments[4][17][0].apply(exports, arguments);
        },
        { 'dup': 17 }
    ],
    41: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? String.prototype.contains : require('./shim');
        },
        {
            './is-implemented': 42,
            './shim': 43
        }
    ],
    42: [
        function (require, module, exports) {
            'use strict';
            var str = 'razdwatrzy';
            module.exports = function () {
            };
        },
        {}
    ],
    43: [
        function (require, module, exports) {
            'use strict';
            var indexOf = String.prototype.indexOf;
            module.exports = function (searchString) {
            };
        },
        {}
    ],
    44: [
        function (require, module, exports) {
            'use strict';
            var toString = Object.prototype.toString, id = toString.call('');
            module.exports = function (x) {
            };
        },
        {}
    ],
    45: [
        function (require, module, exports) {
            'use strict';
            var generated = Object.create(null), random = Math.random;
            module.exports = function () {
            };
        },
        {}
    ],
    46: [
        function (require, module, exports) {
            'use strict';
            var setPrototypeOf = require('es5-ext/object/set-prototype-of'), contains = require('es5-ext/string/#/contains'), d = require('d'), Iterator = require('./'), defineProperty = Object.defineProperty, ArrayIterator;
            ArrayIterator = module.exports = function (arr, kind) {
            };
            if (setPrototypeOf)
                setPrototypeOf(ArrayIterator, Iterator);
            ArrayIterator.prototype = Object.create(Iterator.prototype, {
                constructor: d(ArrayIterator),
                _resolve: d(function (i) {
                }),
                toString: d(function () {
                })
            });
        },
        {
            './': 49,
            'd': 11,
            'es5-ext/object/set-prototype-of': 35,
            'es5-ext/string/#/contains': 41
        }
    ],
    47: [
        function (require, module, exports) {
            'use strict';
            var isArguments = require('es5-ext/function/is-arguments'), callable = require('es5-ext/object/valid-callable'), isString = require('es5-ext/string/is-string'), get = require('./get'), isArray = Array.isArray, call = Function.prototype.call, some = Array.prototype.some;
            module.exports = function (iterable, cb) {
            };
        },
        {
            './get': 48,
            'es5-ext/function/is-arguments': 14,
            'es5-ext/object/valid-callable': 38,
            'es5-ext/string/is-string': 44
        }
    ],
    48: [
        function (require, module, exports) {
            'use strict';
            var isArguments = require('es5-ext/function/is-arguments'), isString = require('es5-ext/string/is-string'), ArrayIterator = require('./array'), StringIterator = require('./string'), iterable = require('./valid-iterable'), iteratorSymbol = require('es6-symbol').iterator;
            module.exports = function (obj) {
            };
        },
        {
            './array': 46,
            './string': 51,
            './valid-iterable': 52,
            'es5-ext/function/is-arguments': 14,
            'es5-ext/string/is-string': 44,
            'es6-symbol': 59
        }
    ],
    49: [
        function (require, module, exports) {
            'use strict';
            var clear = require('es5-ext/array/#/clear'), assign = require('es5-ext/object/assign'), callable = require('es5-ext/object/valid-callable'), value = require('es5-ext/object/valid-value'), d = require('d'), autoBind = require('d/auto-bind'), Symbol = require('es6-symbol'), defineProperty = Object.defineProperty, defineProperties = Object.defineProperties, Iterator;
            module.exports = Iterator = function (list, context) {
            };
            defineProperties(Iterator.prototype, assign({
                constructor: d(Iterator),
                _next: d(function () {
                }),
                next: d(function () {
                }),
                _createResult: d(function (i) {
                }),
                _resolve: d(function (i) {
                }),
                _unBind: d(function () {
                }),
                toString: d(function () {
                })
            }, autoBind({
                _onAdd: d(function (index) {
                }),
                _onDelete: d(function (index) {
                }),
                _onClear: d(function () {
                })
            })));
            defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
            }));
            defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));
        },
        {
            'd': 11,
            'd/auto-bind': 10,
            'es5-ext/array/#/clear': 12,
            'es5-ext/object/assign': 21,
            'es5-ext/object/valid-callable': 38,
            'es5-ext/object/valid-value': 40,
            'es6-symbol': 59
        }
    ],
    50: [
        function (require, module, exports) {
            'use strict';
            var isArguments = require('es5-ext/function/is-arguments'), isString = require('es5-ext/string/is-string'), iteratorSymbol = require('es6-symbol').iterator, isArray = Array.isArray;
            module.exports = function (value) {
            };
        },
        {
            'es5-ext/function/is-arguments': 14,
            'es5-ext/string/is-string': 44,
            'es6-symbol': 59
        }
    ],
    51: [
        function (require, module, exports) {
            // Thanks @mathiasbynens
            // http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols
            'use strict';
            var setPrototypeOf = require('es5-ext/object/set-prototype-of'), d = require('d'), Iterator = require('./'), defineProperty = Object.defineProperty, StringIterator;
            StringIterator = module.exports = function (str) {
            };
            if (setPrototypeOf)
                setPrototypeOf(StringIterator, Iterator);
            StringIterator.prototype = Object.create(Iterator.prototype, {
                constructor: d(StringIterator),
                _next: d(function () {
                }),
                _resolve: d(function (i) {
                }),
                toString: d(function () {
                })
            });
        },
        {
            './': 49,
            'd': 11,
            'es5-ext/object/set-prototype-of': 35
        }
    ],
    52: [
        function (require, module, exports) {
            'use strict';
            var isIterable = require('./is-iterable');
            module.exports = function (value) {
            };
        },
        { './is-iterable': 50 }
    ],
    53: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? Map : require('./polyfill');
        },
        {
            './is-implemented': 54,
            './polyfill': 58
        }
    ],
    54: [
        function (require, module, exports) {
            'use strict';
            module.exports = function () {
                var map, iterator, result;
                if (typeof Map !== 'function')
                    return false;
                try {
                    // WebKit doesn't support arguments and crashes
                    map = new Map([
                        [
                            'raz',
                            'one'
                        ],
                        [
                            'dwa',
                            'two'
                        ],
                        [
                            'trzy',
                            'three'
                        ]
                    ]);
                } catch (e) {
                    return false;
                }
                if (String(map) !== '[object Map]')
                    return false;
                if (map.size !== 3)
                    return false;
                if (typeof map.clear !== 'function')
                    return false;
                if (typeof map.delete !== 'function')
                    return false;
                if (typeof map.entries !== 'function')
                    return false;
                if (typeof map.forEach !== 'function')
                    return false;
                if (typeof map.get !== 'function')
                    return false;
                if (typeof map.has !== 'function')
                    return false;
                if (typeof map.keys !== 'function')
                    return false;
                if (typeof map.set !== 'function')
                    return false;
                if (typeof map.values !== 'function')
                    return false;
                iterator = map.entries();
                result = iterator.next();
                if (result.done !== false)
                    return false;
                if (!result.value)
                    return false;
                if (result.value[0] !== 'raz')
                    return false;
                if (result.value[1] !== 'one')
                    return false;
                return true;
            };
        },
        {}
    ],
    55: [
        function (require, module, exports) {
            // Exports true if environment provides native `Map` implementation,
            // whatever that is.
            'use strict';
            module.exports = function () {
            }();
        },
        {}
    ],
    56: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('es5-ext/object/primitive-set')('key', 'value', 'key+value');
        },
        { 'es5-ext/object/primitive-set': 34 }
    ],
    57: [
        function (require, module, exports) {
            'use strict';
            var setPrototypeOf = require('es5-ext/object/set-prototype-of'), d = require('d'), Iterator = require('es6-iterator'), toStringTagSymbol = require('es6-symbol').toStringTag, kinds = require('./iterator-kinds'), defineProperties = Object.defineProperties, unBind = Iterator.prototype._unBind, MapIterator;
            MapIterator = module.exports = function (map, kind) {
            };
            if (setPrototypeOf)
                setPrototypeOf(MapIterator, Iterator);
            MapIterator.prototype = Object.create(Iterator.prototype, {
                constructor: d(MapIterator),
                _resolve: d(function (i) {
                }),
                _unBind: d(function () {
                }),
                toString: d(function () {
                })
            });
            Object.defineProperty(MapIterator.prototype, toStringTagSymbol, d('c', 'Map Iterator'));
        },
        {
            './iterator-kinds': 56,
            'd': 11,
            'es5-ext/object/set-prototype-of': 35,
            'es6-iterator': 49,
            'es6-symbol': 59
        }
    ],
    58: [
        function (require, module, exports) {
            'use strict';
            var clear = require('es5-ext/array/#/clear'), eIndexOf = require('es5-ext/array/#/e-index-of'), setPrototypeOf = require('es5-ext/object/set-prototype-of'), callable = require('es5-ext/object/valid-callable'), validValue = require('es5-ext/object/valid-value'), d = require('d'), ee = require('event-emitter'), Symbol = require('es6-symbol'), iterator = require('es6-iterator/valid-iterable'), forOf = require('es6-iterator/for-of'), Iterator = require('./lib/iterator'), isNative = require('./is-native-implemented'), call = Function.prototype.call, defineProperties = Object.defineProperties, getPrototypeOf = Object.getPrototypeOf, MapPoly;
            module.exports = MapPoly = function () {
            };
            if (isNative) {
                if (setPrototypeOf)
                    setPrototypeOf(MapPoly, Map);
                MapPoly.prototype = Object.create(Map.prototype, { constructor: d(MapPoly) });
            }
            ee(defineProperties(MapPoly.prototype, {
                clear: d(function () {
                }),
                delete: d(function (key) {
                }),
                entries: d(function () {
                }),
                forEach: d(function (cb) {
                }),
                get: d(function (key) {
                }),
                has: d(function (key) {
                }),
                keys: d(function () {
                }),
                set: d(function (key, value) {
                }),
                size: d.gs(function () {
                }),
                values: d(function () {
                }),
                toString: d(function () {
                })
            }));
            Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
            }));
            Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));
        },
        {
            './is-native-implemented': 55,
            './lib/iterator': 57,
            'd': 11,
            'es5-ext/array/#/clear': 12,
            'es5-ext/array/#/e-index-of': 13,
            'es5-ext/object/set-prototype-of': 35,
            'es5-ext/object/valid-callable': 38,
            'es5-ext/object/valid-value': 40,
            'es6-iterator/for-of': 47,
            'es6-iterator/valid-iterable': 52,
            'es6-symbol': 59,
            'event-emitter': 74
        }
    ],
    59: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');
        },
        {
            './is-implemented': 60,
            './polyfill': 62
        }
    ],
    60: [
        function (require, module, exports) {
            'use strict';
            var validTypes = {
                object: true,
                symbol: true
            };
            module.exports = function () {
            };
        },
        {}
    ],
    61: [
        function (require, module, exports) {
            'use strict';
            module.exports = function (x) {
            };
        },
        {}
    ],
    62: [
        function (require, module, exports) {
            // ES2015 Symbol polyfill for environments that do not support it (or partially support it)
            'use strict';
            var d = require('d'), validateSymbol = require('./validate-symbol'), create = Object.create, defineProperties = Object.defineProperties, defineProperty = Object.defineProperty, objPrototype = Object.prototype, NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null), isNativeSafe;
            if (typeof Symbol === 'function') {
                NativeSymbol = Symbol;
                try {
                    String(NativeSymbol());
                    isNativeSafe = true;
                } catch (ignore) {
                }
            }
            var generateName = function () {
            }();
            // Internal constructor (not one exposed) for creating Symbol instances.
            // This one is used to ensure that `someSymbol instanceof Symbol` always return false
            HiddenSymbol = function Symbol(description) {
            };
            // Exposed `Symbol` constructor
            // (returns instances of HiddenSymbol)
            module.exports = SymbolPolyfill = function Symbol(description) {
            };
            defineProperties(SymbolPolyfill, {
                for: d(function (key) {
                }),
                keyFor: d(function (s) {
                }),
                // If there's native implementation of given symbol, let's fallback to it
                // to ensure proper interoperability with other native functions e.g. Array.from
                hasInstance: d('', NativeSymbol && NativeSymbol.hasInstance || SymbolPolyfill('hasInstance')),
                isConcatSpreadable: d('', NativeSymbol && NativeSymbol.isConcatSpreadable || SymbolPolyfill('isConcatSpreadable')),
                iterator: d('', NativeSymbol && NativeSymbol.iterator || SymbolPolyfill('iterator')),
                match: d('', NativeSymbol && NativeSymbol.match || SymbolPolyfill('match')),
                replace: d('', NativeSymbol && NativeSymbol.replace || SymbolPolyfill('replace')),
                search: d('', NativeSymbol && NativeSymbol.search || SymbolPolyfill('search')),
                species: d('', NativeSymbol && NativeSymbol.species || SymbolPolyfill('species')),
                split: d('', NativeSymbol && NativeSymbol.split || SymbolPolyfill('split')),
                toPrimitive: d('', NativeSymbol && NativeSymbol.toPrimitive || SymbolPolyfill('toPrimitive')),
                toStringTag: d('', NativeSymbol && NativeSymbol.toStringTag || SymbolPolyfill('toStringTag')),
                unscopables: d('', NativeSymbol && NativeSymbol.unscopables || SymbolPolyfill('unscopables'))
            });
            // Internal tweaks for real symbol producer
            defineProperties(HiddenSymbol.prototype, {
                constructor: d(SymbolPolyfill),
                toString: d('', function () {
                })
            });
            // Proper implementation of methods exposed on Symbol.prototype
            // They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
            defineProperties(SymbolPolyfill.prototype, {
                toString: d(function () {
                }),
                valueOf: d(function () {
                })
            });
            defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
            }));
            defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));
            // Proper implementaton of toPrimitive and toStringTag for returned symbol instances
            defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));
            // Note: It's important to define `toPrimitive` as last one, as some implementations
            // implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
            // And that may invoke error in definition flow:
            // See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
            defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));
        },
        {
            './validate-symbol': 63,
            'd': 11
        }
    ],
    63: [
        function (require, module, exports) {
            'use strict';
            var isSymbol = require('./is-symbol');
            module.exports = function (value) {
            };
        },
        { './is-symbol': 61 }
    ],
    64: [
        function (require, module, exports) {
            'use strict';
            module.exports = require('./is-implemented')() ? WeakMap : require('./polyfill');
        },
        {
            './is-implemented': 65,
            './polyfill': 67
        }
    ],
    65: [
        function (require, module, exports) {
            'use strict';
            module.exports = function () {
                var weakMap, x;
                if (typeof WeakMap !== 'function')
                    return false;
                try {
                    // WebKit doesn't support arguments and crashes
                    weakMap = new WeakMap([
                        [
                            x = {},
                            'one'
                        ],
                        [
                            {},
                            'two'
                        ],
                        [
                            {},
                            'three'
                        ]
                    ]);
                } catch (e) {
                    return false;
                }
                if (String(weakMap) !== '[object WeakMap]')
                    return false;
                if (typeof weakMap.set !== 'function')
                    return false;
                if (weakMap.set({}, 1) !== weakMap)
                    return false;
                if (typeof weakMap.delete !== 'function')
                    return false;
                if (typeof weakMap.has !== 'function')
                    return false;
                if (weakMap.get(x) !== 'one')
                    return false;
                return true;
            };
        },
        {}
    ],
    66: [
        function (require, module, exports) {
            // Exports true if environment provides native `WeakMap` implementation, whatever that is.
            'use strict';
            module.exports = function () {
            }();
        },
        {}
    ],
    67: [
        function (require, module, exports) {
            'use strict';
            var setPrototypeOf = require('es5-ext/object/set-prototype-of'), object = require('es5-ext/object/valid-object'), value = require('es5-ext/object/valid-value'), randomUniq = require('es5-ext/string/random-uniq'), d = require('d'), getIterator = require('es6-iterator/get'), forOf = require('es6-iterator/for-of'), toStringTagSymbol = require('es6-symbol').toStringTag, isNative = require('./is-native-implemented'), isArray = Array.isArray, defineProperty = Object.defineProperty, hasOwnProperty = Object.prototype.hasOwnProperty, getPrototypeOf = Object.getPrototypeOf, WeakMapPoly;
            module.exports = WeakMapPoly = function () {
            };
            if (isNative) {
                if (setPrototypeOf)
                    setPrototypeOf(WeakMapPoly, WeakMap);
                WeakMapPoly.prototype = Object.create(WeakMap.prototype, { constructor: d(WeakMapPoly) });
            }
            Object.defineProperties(WeakMapPoly.prototype, {
                delete: d(function (key) {
                }),
                get: d(function (key) {
                }),
                has: d(function (key) {
                }),
                set: d(function (key, value) {
                }),
                toString: d(function () {
                })
            });
            defineProperty(WeakMapPoly.prototype, toStringTagSymbol, d('c', 'WeakMap'));
        },
        {
            './is-native-implemented': 66,
            'd': 11,
            'es5-ext/object/set-prototype-of': 35,
            'es5-ext/object/valid-object': 39,
            'es5-ext/object/valid-value': 40,
            'es5-ext/string/random-uniq': 45,
            'es6-iterator/for-of': 47,
            'es6-iterator/get': 48,
            'es6-symbol': 59
        }
    ],
    68: [
        function (require, module, exports) {
            /*
  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            (function () {
                'use strict';
                var assign, estraverse, isArray, objectKeys;
                assign = require('object-assign');
                estraverse = require('estraverse');
                isArray = Array.isArray || function isArray(array) {
                };
                objectKeys = Object.keys || function (o) {
                };
                function isNode(node) {
                    if (node == null) {
                        return false;
                    }
                    return typeof node === 'object' && typeof node.type === 'string';
                }
                function isProperty(nodeType, key) {
                    return (nodeType === estraverse.Syntax.ObjectExpression || nodeType === estraverse.Syntax.ObjectPattern) && key === 'properties';
                }
                function Visitor(visitor, options) {
                    options = options || {};
                    this.__visitor = visitor || this;
                    this.__childVisitorKeys = options.childVisitorKeys ? assign({}, estraverse.VisitorKeys, options.childVisitorKeys) : estraverse.VisitorKeys;
                    if (options.fallback === 'iteration') {
                        this.__fallback = objectKeys;
                    } else if (typeof options.fallback === 'function') {
                        this.__fallback = options.fallback;
                    }
                }
                /* Default method for visiting children.
     * When you need to call default visiting operation inside custom visiting
     * operation, you can use it with `this.visitChildren(node)`.
     */
                Visitor.prototype.visitChildren = function (node) {
                    var type, children, i, iz, j, jz, child;
                    if (node == null) {
                        return;
                    }
                    type = node.type || estraverse.Syntax.Property;
                    children = this.__childVisitorKeys[type];
                    if (!children) {
                        if (this.__fallback) {
                            children = this.__fallback(node);
                        } else {
                            throw new Error('Unknown node type ' + type + '.');
                        }
                    }
                    for (i = 0, iz = children.length; i < iz; ++i) {
                        child = node[children[i]];
                        if (child) {
                            if (isArray(child)) {
                                for (j = 0, jz = child.length; j < jz; ++j) {
                                    if (child[j]) {
                                        if (isNode(child[j]) || isProperty(type, children[i])) {
                                            this.visit(child[j]);
                                        }
                                    }
                                }
                            } else if (isNode(child)) {
                                this.visit(child);
                            }
                        }
                    }
                };
                /* Dispatching node. */
                Visitor.prototype.visit = function (node) {
                    var type;
                    if (node == null) {
                        return;
                    }
                    type = node.type || estraverse.Syntax.Property;
                    if (this.__visitor[type]) {
                        this.__visitor[type].call(this, node);
                        return;
                    }
                    this.visitChildren(node);
                };
                exports.version = require('./package.json').version;
                exports.Visitor = Visitor;
                exports.visit = function (node, visitor, options) {
                    var v = new Visitor(visitor, options);
                    v.visit(node);
                };
            }());    /* vim: set sw=4 ts=4 et tw=80 : */
        },
        {
            './package.json': 71,
            'estraverse': 69,
            'object-assign': 75
        }
    ],
    69: [
        function (require, module, exports) {
            /*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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
            /*jslint vars:false, bitwise:true*/
            /*jshint indent:4*/
            /*global exports:true*/
            (function clone(exports) {
                'use strict';
                var Syntax, isArray, VisitorOption, VisitorKeys, objectCreate, objectKeys, BREAK, SKIP, REMOVE;
                function ignoreJSHintError() {
                }
                isArray = Array.isArray;
                if (!isArray) {
                    isArray = function isArray(array) {
                    };
                }
                function deepCopy(obj) {
                }
                function shallowCopy(obj) {
                }
                ignoreJSHintError(shallowCopy);
                // based on LLVM libc++ upper_bound / lower_bound
                // MIT License
                function upperBound(array, func) {
                }
                function lowerBound(array, func) {
                }
                ignoreJSHintError(lowerBound);
                objectCreate = Object.create || function () {
                }();
                objectKeys = Object.keys || function (o) {
                };
                function extend(to, from) {
                }
                Syntax = {
                    AssignmentExpression: 'AssignmentExpression',
                    AssignmentPattern: 'AssignmentPattern',
                    ArrayExpression: 'ArrayExpression',
                    ArrayPattern: 'ArrayPattern',
                    ArrowFunctionExpression: 'ArrowFunctionExpression',
                    AwaitExpression: 'AwaitExpression',
                    // CAUTION: It's deferred to ES7.
                    BlockStatement: 'BlockStatement',
                    BinaryExpression: 'BinaryExpression',
                    BreakStatement: 'BreakStatement',
                    CallExpression: 'CallExpression',
                    CatchClause: 'CatchClause',
                    ClassBody: 'ClassBody',
                    ClassDeclaration: 'ClassDeclaration',
                    ClassExpression: 'ClassExpression',
                    ComprehensionBlock: 'ComprehensionBlock',
                    // CAUTION: It's deferred to ES7.
                    ComprehensionExpression: 'ComprehensionExpression',
                    // CAUTION: It's deferred to ES7.
                    ConditionalExpression: 'ConditionalExpression',
                    ContinueStatement: 'ContinueStatement',
                    DebuggerStatement: 'DebuggerStatement',
                    DirectiveStatement: 'DirectiveStatement',
                    DoWhileStatement: 'DoWhileStatement',
                    EmptyStatement: 'EmptyStatement',
                    ExportAllDeclaration: 'ExportAllDeclaration',
                    ExportDefaultDeclaration: 'ExportDefaultDeclaration',
                    ExportNamedDeclaration: 'ExportNamedDeclaration',
                    ExportSpecifier: 'ExportSpecifier',
                    ExpressionStatement: 'ExpressionStatement',
                    ForStatement: 'ForStatement',
                    ForInStatement: 'ForInStatement',
                    ForOfStatement: 'ForOfStatement',
                    FunctionDeclaration: 'FunctionDeclaration',
                    FunctionExpression: 'FunctionExpression',
                    GeneratorExpression: 'GeneratorExpression',
                    // CAUTION: It's deferred to ES7.
                    Identifier: 'Identifier',
                    IfStatement: 'IfStatement',
                    ImportDeclaration: 'ImportDeclaration',
                    ImportDefaultSpecifier: 'ImportDefaultSpecifier',
                    ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
                    ImportSpecifier: 'ImportSpecifier',
                    Literal: 'Literal',
                    LabeledStatement: 'LabeledStatement',
                    LogicalExpression: 'LogicalExpression',
                    MemberExpression: 'MemberExpression',
                    MetaProperty: 'MetaProperty',
                    MethodDefinition: 'MethodDefinition',
                    ModuleSpecifier: 'ModuleSpecifier',
                    NewExpression: 'NewExpression',
                    ObjectExpression: 'ObjectExpression',
                    ObjectPattern: 'ObjectPattern',
                    Program: 'Program',
                    Property: 'Property',
                    RestElement: 'RestElement',
                    ReturnStatement: 'ReturnStatement',
                    SequenceExpression: 'SequenceExpression',
                    SpreadElement: 'SpreadElement',
                    Super: 'Super',
                    SwitchStatement: 'SwitchStatement',
                    SwitchCase: 'SwitchCase',
                    TaggedTemplateExpression: 'TaggedTemplateExpression',
                    TemplateElement: 'TemplateElement',
                    TemplateLiteral: 'TemplateLiteral',
                    ThisExpression: 'ThisExpression',
                    ThrowStatement: 'ThrowStatement',
                    TryStatement: 'TryStatement',
                    UnaryExpression: 'UnaryExpression',
                    UpdateExpression: 'UpdateExpression',
                    VariableDeclaration: 'VariableDeclaration',
                    VariableDeclarator: 'VariableDeclarator',
                    WhileStatement: 'WhileStatement',
                    WithStatement: 'WithStatement',
                    YieldExpression: 'YieldExpression'
                };
                VisitorKeys = {
                    AssignmentExpression: [
                        'left',
                        'right'
                    ],
                    AssignmentPattern: [
                        'left',
                        'right'
                    ],
                    ArrayExpression: ['elements'],
                    ArrayPattern: ['elements'],
                    ArrowFunctionExpression: [
                        'params',
                        'body'
                    ],
                    AwaitExpression: ['argument'],
                    // CAUTION: It's deferred to ES7.
                    BlockStatement: ['body'],
                    BinaryExpression: [
                        'left',
                        'right'
                    ],
                    BreakStatement: ['label'],
                    CallExpression: [
                        'callee',
                        'arguments'
                    ],
                    CatchClause: [
                        'param',
                        'body'
                    ],
                    ClassBody: ['body'],
                    ClassDeclaration: [
                        'id',
                        'superClass',
                        'body'
                    ],
                    ClassExpression: [
                        'id',
                        'superClass',
                        'body'
                    ],
                    ComprehensionBlock: [
                        'left',
                        'right'
                    ],
                    // CAUTION: It's deferred to ES7.
                    ComprehensionExpression: [
                        'blocks',
                        'filter',
                        'body'
                    ],
                    // CAUTION: It's deferred to ES7.
                    ConditionalExpression: [
                        'test',
                        'consequent',
                        'alternate'
                    ],
                    ContinueStatement: ['label'],
                    DebuggerStatement: [],
                    DirectiveStatement: [],
                    DoWhileStatement: [
                        'body',
                        'test'
                    ],
                    EmptyStatement: [],
                    ExportAllDeclaration: ['source'],
                    ExportDefaultDeclaration: ['declaration'],
                    ExportNamedDeclaration: [
                        'declaration',
                        'specifiers',
                        'source'
                    ],
                    ExportSpecifier: [
                        'exported',
                        'local'
                    ],
                    ExpressionStatement: ['expression'],
                    ForStatement: [
                        'init',
                        'test',
                        'update',
                        'body'
                    ],
                    ForInStatement: [
                        'left',
                        'right',
                        'body'
                    ],
                    ForOfStatement: [
                        'left',
                        'right',
                        'body'
                    ],
                    FunctionDeclaration: [
                        'id',
                        'params',
                        'body'
                    ],
                    FunctionExpression: [
                        'id',
                        'params',
                        'body'
                    ],
                    GeneratorExpression: [
                        'blocks',
                        'filter',
                        'body'
                    ],
                    // CAUTION: It's deferred to ES7.
                    Identifier: [],
                    IfStatement: [
                        'test',
                        'consequent',
                        'alternate'
                    ],
                    ImportDeclaration: [
                        'specifiers',
                        'source'
                    ],
                    ImportDefaultSpecifier: ['local'],
                    ImportNamespaceSpecifier: ['local'],
                    ImportSpecifier: [
                        'imported',
                        'local'
                    ],
                    Literal: [],
                    LabeledStatement: [
                        'label',
                        'body'
                    ],
                    LogicalExpression: [
                        'left',
                        'right'
                    ],
                    MemberExpression: [
                        'object',
                        'property'
                    ],
                    MetaProperty: [
                        'meta',
                        'property'
                    ],
                    MethodDefinition: [
                        'key',
                        'value'
                    ],
                    ModuleSpecifier: [],
                    NewExpression: [
                        'callee',
                        'arguments'
                    ],
                    ObjectExpression: ['properties'],
                    ObjectPattern: ['properties'],
                    Program: ['body'],
                    Property: [
                        'key',
                        'value'
                    ],
                    RestElement: ['argument'],
                    ReturnStatement: ['argument'],
                    SequenceExpression: ['expressions'],
                    SpreadElement: ['argument'],
                    Super: [],
                    SwitchStatement: [
                        'discriminant',
                        'cases'
                    ],
                    SwitchCase: [
                        'test',
                        'consequent'
                    ],
                    TaggedTemplateExpression: [
                        'tag',
                        'quasi'
                    ],
                    TemplateElement: [],
                    TemplateLiteral: [
                        'quasis',
                        'expressions'
                    ],
                    ThisExpression: [],
                    ThrowStatement: ['argument'],
                    TryStatement: [
                        'block',
                        'handler',
                        'finalizer'
                    ],
                    UnaryExpression: ['argument'],
                    UpdateExpression: ['argument'],
                    VariableDeclaration: ['declarations'],
                    VariableDeclarator: [
                        'id',
                        'init'
                    ],
                    WhileStatement: [
                        'test',
                        'body'
                    ],
                    WithStatement: [
                        'object',
                        'body'
                    ],
                    YieldExpression: ['argument']
                };
                // unique id
                BREAK = {};
                SKIP = {};
                REMOVE = {};
                VisitorOption = {
                    Break: BREAK,
                    Skip: SKIP,
                    Remove: REMOVE
                };
                function Reference(parent, key) {
                }
                Reference.prototype.replace = function replace(node) {
                };
                Reference.prototype.remove = function remove() {
                };
                function Element(node, path, wrap, ref) {
                }
                function Controller() {
                }
                // API:
                // return property path array from root to current node
                Controller.prototype.path = function path() {
                };
                // API:
                // return type of current node
                Controller.prototype.type = function () {
                };
                // API:
                // return array of parent elements
                Controller.prototype.parents = function parents() {
                };
                // API:
                // return current node
                Controller.prototype.current = function current() {
                };
                Controller.prototype.__execute = function __execute(callback, element) {
                };
                // API:
                // notify control skip / break
                Controller.prototype.notify = function notify(flag) {
                };
                // API:
                // skip child nodes of current node
                Controller.prototype.skip = function () {
                };
                // API:
                // break traversals
                Controller.prototype['break'] = function () {
                };
                // API:
                // remove node
                Controller.prototype.remove = function () {
                };
                Controller.prototype.__initialize = function (root, visitor) {
                };
                function isNode(node) {
                }
                function isProperty(nodeType, key) {
                }
                Controller.prototype.traverse = function traverse(root, visitor) {
                };
                Controller.prototype.replace = function replace(root, visitor) {
                };
                function traverse(root, visitor) {
                }
                function replace(root, visitor) {
                }
                function extendCommentRange(comment, tokens) {
                }
                function attachComments(tree, providedComments, tokens) {
                }
                exports.version = require('./package.json').version;
                exports.Syntax = Syntax;
                exports.traverse = traverse;
                exports.replace = replace;
                exports.attachComments = attachComments;
                exports.VisitorKeys = VisitorKeys;
                exports.VisitorOption = VisitorOption;
                exports.Controller = Controller;
                exports.cloneEnvironment = function () {
                };
                return exports;
            }(exports));    /* vim: set sw=4 ts=4 et tw=80 : */
        },
        { './package.json': 70 }
    ],
    70: [
        function (require, module, exports) {
            module.exports = {
                '_args': [[
                        'estraverse@~4.1.0',
                        'C:\\Users\\Hernan\\Desktop\\Tesis Pruebas\\escope-master\\node_modules\\esrecurse'
                    ]],
                '_from': 'estraverse@>=4.1.0 <4.2.0',
                '_id': 'estraverse@4.1.1',
                '_inCache': true,
                '_installable': true,
                '_location': '/esrecurse/estraverse',
                '_nodeVersion': '4.1.1',
                '_npmUser': {
                    'email': 'utatane.tea@gmail.com',
                    'name': 'constellation'
                },
                '_npmVersion': '2.14.4',
                '_phantomChildren': {},
                '_requested': {
                    'name': 'estraverse',
                    'raw': 'estraverse@~4.1.0',
                    'rawSpec': '~4.1.0',
                    'scope': null,
                    'spec': '>=4.1.0 <4.2.0',
                    'type': 'range'
                },
                '_requiredBy': ['/esrecurse'],
                '_resolved': 'https://registry.npmjs.org/estraverse/-/estraverse-4.1.1.tgz',
                '_shasum': 'f6caca728933a850ef90661d0e17982ba47111a2',
                '_shrinkwrap': null,
                '_spec': 'estraverse@~4.1.0',
                '_where': 'C:\\Users\\Hernan\\Desktop\\Tesis Pruebas\\escope-master\\node_modules\\esrecurse',
                'bugs': { 'url': 'https://github.com/estools/estraverse/issues' },
                'dependencies': {},
                'description': 'ECMAScript JS AST traversal functions',
                'devDependencies': {
                    'chai': '^2.1.1',
                    'coffee-script': '^1.8.0',
                    'espree': '^1.11.0',
                    'gulp': '^3.8.10',
                    'gulp-bump': '^0.2.2',
                    'gulp-filter': '^2.0.0',
                    'gulp-git': '^1.0.1',
                    'gulp-tag-version': '^1.2.1',
                    'jshint': '^2.5.6',
                    'mocha': '^2.1.0'
                },
                'directories': {},
                'dist': {
                    'shasum': 'f6caca728933a850ef90661d0e17982ba47111a2',
                    'tarball': 'https://registry.npmjs.org/estraverse/-/estraverse-4.1.1.tgz'
                },
                'engines': { 'node': '>=0.10.0' },
                'gitHead': 'bbcccbfe98296585e4311c8755e1d00dcd581e3c',
                'homepage': 'https://github.com/estools/estraverse',
                'license': 'BSD-2-Clause',
                'main': 'estraverse.js',
                'maintainers': [
                    {
                        'email': 'utatane.tea@gmail.com',
                        'name': 'constellation'
                    },
                    {
                        'email': 'npm@michael.ficarra.me',
                        'name': 'michaelficarra'
                    },
                    {
                        'email': 'nicholas@nczconsulting.com',
                        'name': 'nzakas'
                    }
                ],
                'name': 'estraverse',
                'optionalDependencies': {},
                'readme': 'ERROR: No README data found!',
                'repository': {
                    'type': 'git',
                    'url': 'git+ssh://git@github.com/estools/estraverse.git'
                },
                'scripts': {
                    'lint': 'jshint estraverse.js',
                    'test': 'npm run-script lint && npm run-script unit-test',
                    'unit-test': 'mocha --compilers coffee:coffee-script/register'
                },
                'version': '4.1.1'
            };
        },
        {}
    ],
    71: [
        function (require, module, exports) {
            module.exports = {
                '_args': [[
                        'esrecurse@^4.1.0',
                        'C:\\Users\\Hernan\\Desktop\\Tesis Pruebas\\escope-master'
                    ]],
                '_from': 'esrecurse@>=4.1.0 <5.0.0',
                '_id': 'esrecurse@4.1.0',
                '_inCache': true,
                '_installable': true,
                '_location': '/esrecurse',
                '_nodeVersion': '0.12.9',
                '_npmOperationalInternal': {
                    'host': 'packages-13-west.internal.npmjs.com',
                    'tmp': 'tmp/esrecurse-4.1.0.tgz_1457712782215_0.15950557170435786'
                },
                '_npmUser': {
                    'email': 'nicholas@nczconsulting.com',
                    'name': 'nzakas'
                },
                '_npmVersion': '2.14.9',
                '_phantomChildren': {},
                '_requested': {
                    'name': 'esrecurse',
                    'raw': 'esrecurse@^4.1.0',
                    'rawSpec': '^4.1.0',
                    'scope': null,
                    'spec': '>=4.1.0 <5.0.0',
                    'type': 'range'
                },
                '_requiredBy': [
                    '/',
                    '/escope'
                ],
                '_resolved': 'https://registry.npmjs.org/esrecurse/-/esrecurse-4.1.0.tgz',
                '_shasum': '4713b6536adf7f2ac4f327d559e7756bff648220',
                '_shrinkwrap': null,
                '_spec': 'esrecurse@^4.1.0',
                '_where': 'C:\\Users\\Hernan\\Desktop\\Tesis Pruebas\\escope-master',
                'bugs': { 'url': 'https://github.com/estools/esrecurse/issues' },
                'dependencies': {
                    'estraverse': '~4.1.0',
                    'object-assign': '^4.0.1'
                },
                'description': 'ECMAScript AST recursive visitor',
                'devDependencies': {
                    'chai': '^3.3.0',
                    'coffee-script': '^1.9.1',
                    'esprima': '^2.1.0',
                    'gulp': '^3.9.0',
                    'gulp-bump': '^1.0.0',
                    'gulp-eslint': '^1.0.0',
                    'gulp-filter': '^3.0.1',
                    'gulp-git': '^1.1.0',
                    'gulp-mocha': '^2.1.3',
                    'gulp-tag-version': '^1.2.1',
                    'jsdoc': '^3.3.0-alpha10',
                    'minimist': '^1.1.0'
                },
                'directories': {},
                'dist': {
                    'shasum': '4713b6536adf7f2ac4f327d559e7756bff648220',
                    'tarball': 'https://registry.npmjs.org/esrecurse/-/esrecurse-4.1.0.tgz'
                },
                'engines': { 'node': '>=0.10.0' },
                'gitHead': '63a34714834bd7ad2063054bd4abb24fb82ca667',
                'homepage': 'https://github.com/estools/esrecurse',
                'license': 'BSD-2-Clause',
                'main': 'esrecurse.js',
                'maintainers': [
                    {
                        'email': 'utatane.tea@gmail.com',
                        'name': 'constellation'
                    },
                    {
                        'email': 'npm@michael.ficarra.me',
                        'name': 'michaelficarra'
                    },
                    {
                        'email': 'nicholas@nczconsulting.com',
                        'name': 'nzakas'
                    }
                ],
                'name': 'esrecurse',
                'optionalDependencies': {},
                'readme': 'ERROR: No README data found!',
                'repository': {
                    'type': 'git',
                    'url': 'git+https://github.com/estools/esrecurse.git'
                },
                'scripts': {
                    'lint': 'gulp lint',
                    'test': 'gulp travis',
                    'unit-test': 'gulp test'
                },
                'version': '4.1.0'
            };
        },
        {}
    ],
    72: [
        function (require, module, exports) {
            arguments[4][69][0].apply(exports, arguments);
        },
        {
            './package.json': 73,
            'dup': 69
        }
    ],
    73: [
        function (require, module, exports) {
            module.exports = {
                '_args': [[
                        'estraverse@^4.1.1',
                        'C:\\Users\\Hernan\\Desktop\\Tesis Pruebas\\escope-master'
                    ]],
                '_from': 'estraverse@>=4.1.1 <5.0.0',
                '_id': 'estraverse@4.2.0',
                '_inCache': true,
                '_installable': true,
                '_location': '/estraverse',
                '_nodeVersion': '0.12.9',
                '_npmOperationalInternal': {
                    'host': 'packages-12-west.internal.npmjs.com',
                    'tmp': 'tmp/estraverse-4.2.0.tgz_1457646738925_0.7118953282479197'
                },
                '_npmUser': {
                    'email': 'nicholas@nczconsulting.com',
                    'name': 'nzakas'
                },
                '_npmVersion': '2.14.9',
                '_phantomChildren': {},
                '_requested': {
                    'name': 'estraverse',
                    'raw': 'estraverse@^4.1.1',
                    'rawSpec': '^4.1.1',
                    'scope': null,
                    'spec': '>=4.1.1 <5.0.0',
                    'type': 'range'
                },
                '_requiredBy': [
                    '/',
                    '/call-matcher',
                    '/escope',
                    '/eslint',
                    '/espower'
                ],
                '_resolved': 'https://registry.npmjs.org/estraverse/-/estraverse-4.2.0.tgz',
                '_shasum': '0dee3fed31fcd469618ce7342099fc1afa0bdb13',
                '_shrinkwrap': null,
                '_spec': 'estraverse@^4.1.1',
                '_where': 'C:\\Users\\Hernan\\Desktop\\Tesis Pruebas\\escope-master',
                'bugs': { 'url': 'https://github.com/estools/estraverse/issues' },
                'dependencies': {},
                'description': 'ECMAScript JS AST traversal functions',
                'devDependencies': {
                    'babel-preset-es2015': '^6.3.13',
                    'babel-register': '^6.3.13',
                    'chai': '^2.1.1',
                    'espree': '^1.11.0',
                    'gulp': '^3.8.10',
                    'gulp-bump': '^0.2.2',
                    'gulp-filter': '^2.0.0',
                    'gulp-git': '^1.0.1',
                    'gulp-tag-version': '^1.2.1',
                    'jshint': '^2.5.6',
                    'mocha': '^2.1.0'
                },
                'directories': {},
                'dist': {
                    'shasum': '0dee3fed31fcd469618ce7342099fc1afa0bdb13',
                    'tarball': 'https://registry.npmjs.org/estraverse/-/estraverse-4.2.0.tgz'
                },
                'engines': { 'node': '>=0.10.0' },
                'gitHead': '6f6a4e99653908e859c7c10d04d9518bf4844ede',
                'homepage': 'https://github.com/estools/estraverse',
                'license': 'BSD-2-Clause',
                'main': 'estraverse.js',
                'maintainers': [
                    {
                        'email': 'utatane.tea@gmail.com',
                        'name': 'constellation'
                    },
                    {
                        'email': 'npm@michael.ficarra.me',
                        'name': 'michaelficarra'
                    },
                    {
                        'email': 'nicholas@nczconsulting.com',
                        'name': 'nzakas'
                    }
                ],
                'name': 'estraverse',
                'optionalDependencies': {},
                'readme': 'ERROR: No README data found!',
                'repository': {
                    'type': 'git',
                    'url': 'git+ssh://git@github.com/estools/estraverse.git'
                },
                'scripts': {
                    'lint': 'jshint estraverse.js',
                    'test': 'npm run-script lint && npm run-script unit-test',
                    'unit-test': 'mocha --compilers js:babel-register'
                },
                'version': '4.2.0'
            };
        },
        {}
    ],
    74: [
        function (require, module, exports) {
            'use strict';
            var d = require('d'), callable = require('es5-ext/object/valid-callable'), apply = Function.prototype.apply, call = Function.prototype.call, create = Object.create, defineProperty = Object.defineProperty, defineProperties = Object.defineProperties, hasOwnProperty = Object.prototype.hasOwnProperty, descriptor = {
                    configurable: true,
                    enumerable: false,
                    writable: true
                }, on, once, off, emit, methods, descriptors, base;
            on = function (type, listener) {
            };
            once = function (type, listener) {
            };
            off = function (type, listener) {
            };
            emit = function (type) {
            };
            methods = {
                on: on,
                once: once,
                off: off,
                emit: emit
            };
            descriptors = {
                on: d(on),
                once: d(once),
                off: d(off),
                emit: d(emit)
            };
            base = defineProperties({}, descriptors);
            module.exports = exports = function (o) {
            };
            exports.methods = methods;
        },
        {
            'd': 11,
            'es5-ext/object/valid-callable': 38
        }
    ],
    75: [
        function (require, module, exports) {
            'use strict';
            /* eslint-disable no-unused-vars */
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var propIsEnumerable = Object.prototype.propertyIsEnumerable;
            function toObject(val) {
            }
            function shouldUseNative() {
                try {
                    if (!Object.assign) {
                        return false;
                    }
                    // Detect buggy property enumeration order in older V8 versions.
                    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
                    var test1 = new String('abc');
                    // eslint-disable-line
                    test1[5] = 'de';
                    if (Object.getOwnPropertyNames(test1)[0] === '5') {
                        return false;
                    }
                    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                    var test2 = {};
                    for (var i = 0; i < 10; i++) {
                        test2['_' + String.fromCharCode(i)] = i;
                    }
                    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                        return test2[n];
                    });
                    if (order2.join('') !== '0123456789') {
                        return false;
                    }
                    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                    var test3 = {};
                    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                        test3[letter] = letter;
                    });
                    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
                        return false;
                    }
                    return true;
                } catch (e) {
                    // We don't expect any of the above to throw, but better to be safe.
                    return false;
                }
            }
            module.exports = shouldUseNative() ? Object.assign : function (target, source) {
            };
        },
        {}
    ],
    76: [
        function (require, module, exports) {
            // shim for using process in browser
            var process = module.exports = {};
            // cached from whatever global is present so that test runners that stub it
            // don't break things.  But we need to wrap it in a try catch in case it is
            // wrapped in strict mode code which doesn't define any globals.  It's inside a
            // function because try/catches deoptimize in certain engines.
            var cachedSetTimeout;
            var cachedClearTimeout;
            function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout() {
                throw new Error('clearTimeout has not been defined');
            }
            (function () {
                try {
                    if (typeof setTimeout === 'function') {
                        cachedSetTimeout = setTimeout;
                    } else {
                        cachedSetTimeout = defaultSetTimout;
                    }
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    if (typeof clearTimeout === 'function') {
                        cachedClearTimeout = clearTimeout;
                    } else {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                } catch (e) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            }());
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    //normal enviroments in sane situations
                    return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedSetTimeout(fun, 0);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }
            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    //normal enviroments in sane situations
                    return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedClearTimeout(marker);
                } catch (e) {
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e) {
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                        return cachedClearTimeout.call(this, marker);
                    }
                }
            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;
            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return;
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }
            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;
                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }
            process.nextTick = function (fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            };
            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = '';
            // empty string to avoid regexp issues
            process.versions = {};
            function noop() {
            }
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.binding = function (name) {
                throw new Error('process.binding is not supported');
            };
            process.cwd = function () {
                return '/';
            };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function () {
                return 0;
            };
        },
        {}
    ],
    77: [
        function (require, module, exports) {
            if (typeof Object.create === 'function') {
                // implementation from standard node.js 'util' module
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                };
            } else {
                // old school shim for old browsers
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function () {
                    };
                    TempCtor.prototype = superCtor.prototype;
                    ctor.prototype = new TempCtor();
                    ctor.prototype.constructor = ctor;
                };
            }
        },
        {}
    ],
    78: [
        function (require, module, exports) {
            module.exports = function isBuffer(arg) {
                return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
            };
        },
        {}
    ],
    79: [
        function (require, module, exports) {
            (function (process, global) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                var formatRegExp = /%[sdj%]/g;
                exports.format = function (f) {
                    if (!isString(f)) {
                        var objects = [];
                        for (var i = 0; i < arguments.length; i++) {
                            objects.push(inspect(arguments[i]));
                        }
                        return objects.join(' ');
                    }
                    var i = 1;
                    var args = arguments;
                    var len = args.length;
                    var str = String(f).replace(formatRegExp, function (x) {
                        if (x === '%%')
                            return '%';
                        if (i >= len)
                            return x;
                        switch (x) {
                        case '%s':
                            return String(args[i++]);
                        case '%d':
                            return Number(args[i++]);
                        case '%j':
                            try {
                                return JSON.stringify(args[i++]);
                            } catch (_) {
                                return '[Circular]';
                            }
                        default:
                            return x;
                        }
                    });
                    for (var x = args[i]; i < len; x = args[++i]) {
                        if (isNull(x) || !isObject(x)) {
                            str += ' ' + x;
                        } else {
                            str += ' ' + inspect(x);
                        }
                    }
                    return str;
                };
                // Mark that a method should not be used.
                // Returns a modified function which warns once by default.
                // If --no-deprecation is set, then it is a no-op.
                exports.deprecate = function (fn, msg) {
                    // Allow for deprecating things in the process of starting up.
                    if (isUndefined(global.process)) {
                        return function () {
                            return exports.deprecate(fn, msg).apply(this, arguments);
                        };
                    }
                    if (process.noDeprecation === true) {
                        return fn;
                    }
                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            if (process.throwDeprecation) {
                                throw new Error(msg);
                            } else if (process.traceDeprecation) {
                                console.trace(msg);
                            } else {
                                console.error(msg);
                            }
                            warned = true;
                        }
                        return fn.apply(this, arguments);
                    }
                    return deprecated;
                };
                var debugs = {};
                var debugEnviron;
                exports.debuglog = function (set) {
                    if (isUndefined(debugEnviron))
                        debugEnviron = process.env.NODE_DEBUG || '';
                    set = set.toUpperCase();
                    if (!debugs[set]) {
                        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                            var pid = process.pid;
                            debugs[set] = function () {
                                var msg = exports.format.apply(exports, arguments);
                                console.error('%s %d: %s', set, pid, msg);
                            };
                        } else {
                            debugs[set] = function () {
                            };
                        }
                    }
                    return debugs[set];
                };
                /**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
                /* legacy: obj, showHidden, depth, colors*/
                function inspect(obj, opts) {
                    // default options
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    // legacy...
                    if (arguments.length >= 3)
                        ctx.depth = arguments[2];
                    if (arguments.length >= 4)
                        ctx.colors = arguments[3];
                    if (isBoolean(opts)) {
                        // legacy...
                        ctx.showHidden = opts;
                    } else if (opts) {
                        // got an "options" object
                        exports._extend(ctx, opts);
                    }
                    // set default options
                    if (isUndefined(ctx.showHidden))
                        ctx.showHidden = false;
                    if (isUndefined(ctx.depth))
                        ctx.depth = 2;
                    if (isUndefined(ctx.colors))
                        ctx.colors = false;
                    if (isUndefined(ctx.customInspect))
                        ctx.customInspect = true;
                    if (ctx.colors)
                        ctx.stylize = stylizeWithColor;
                    return formatValue(ctx, obj, ctx.depth);
                }
                exports.inspect = inspect;
                // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
                inspect.colors = {
                    'bold': [
                        1,
                        22
                    ],
                    'italic': [
                        3,
                        23
                    ],
                    'underline': [
                        4,
                        24
                    ],
                    'inverse': [
                        7,
                        27
                    ],
                    'white': [
                        37,
                        39
                    ],
                    'grey': [
                        90,
                        39
                    ],
                    'black': [
                        30,
                        39
                    ],
                    'blue': [
                        34,
                        39
                    ],
                    'cyan': [
                        36,
                        39
                    ],
                    'green': [
                        32,
                        39
                    ],
                    'magenta': [
                        35,
                        39
                    ],
                    'red': [
                        31,
                        39
                    ],
                    'yellow': [
                        33,
                        39
                    ]
                };
                // Don't use 'blue' not visible on cmd.exe
                inspect.styles = {
                    'special': 'cyan',
                    'number': 'yellow',
                    'boolean': 'yellow',
                    'undefined': 'grey',
                    'null': 'bold',
                    'string': 'green',
                    'date': 'magenta',
                    // "name": intentionally not styling
                    'regexp': 'red'
                };
                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];
                    if (style) {
                        return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
                    } else {
                        return str;
                    }
                }
                function stylizeNoColor(str, styleType) {
                    return str;
                }
                function arrayToHash(array) {
                    var hash = {};
                    array.forEach(function (val, idx) {
                        hash[val] = true;
                    });
                    return hash;
                }
                function formatValue(ctx, value, recurseTimes) {
                    // Provide a hook for user-specified inspect functions.
                    // Check that value is an object with an inspect function on it
                    if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
                        value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
                        !(value.constructor && value.constructor.prototype === value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        if (!isString(ret)) {
                            ret = formatValue(ctx, ret, recurseTimes);
                        }
                        return ret;
                    }
                    // Primitive types cannot have properties
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) {
                        return primitive;
                    }
                    // Look up the keys of the object.
                    var keys = Object.keys(value);
                    var visibleKeys = arrayToHash(keys);
                    if (ctx.showHidden) {
                        keys = Object.getOwnPropertyNames(value);
                    }
                    // IE doesn't make error fields non-enumerable
                    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                    if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
                        return formatError(value);
                    }
                    // Some type of object without properties can be shortcutted.
                    if (keys.length === 0) {
                        if (isFunction(value)) {
                            var name = value.name ? ': ' + value.name : '';
                            return ctx.stylize('[Function' + name + ']', 'special');
                        }
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        }
                        if (isDate(value)) {
                            return ctx.stylize(Date.prototype.toString.call(value), 'date');
                        }
                        if (isError(value)) {
                            return formatError(value);
                        }
                    }
                    var base = '', array = false, braces = [
                            '{',
                            '}'
                        ];
                    // Make Array say that they are Array
                    if (isArray(value)) {
                        array = true;
                        braces = [
                            '[',
                            ']'
                        ];
                    }
                    // Make functions say that they are functions
                    if (isFunction(value)) {
                        var n = value.name ? ': ' + value.name : '';
                        base = ' [Function' + n + ']';
                    }
                    // Make RegExps say that they are RegExps
                    if (isRegExp(value)) {
                        base = ' ' + RegExp.prototype.toString.call(value);
                    }
                    // Make dates with properties first say the date
                    if (isDate(value)) {
                        base = ' ' + Date.prototype.toUTCString.call(value);
                    }
                    // Make error with message first say the error
                    if (isError(value)) {
                        base = ' ' + formatError(value);
                    }
                    if (keys.length === 0 && (!array || value.length == 0)) {
                        return braces[0] + base + braces[1];
                    }
                    if (recurseTimes < 0) {
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        } else {
                            return ctx.stylize('[Object]', 'special');
                        }
                    }
                    ctx.seen.push(value);
                    var output;
                    if (array) {
                        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                    } else {
                        output = keys.map(function (key) {
                            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                        });
                    }
                    ctx.seen.pop();
                    return reduceToSingleString(output, base, braces);
                }
                function formatPrimitive(ctx, value) {
                    if (isUndefined(value))
                        return ctx.stylize('undefined', 'undefined');
                    if (isString(value)) {
                        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, '\\\'').replace(/\\"/g, '"') + '\'';
                        return ctx.stylize(simple, 'string');
                    }
                    if (isNumber(value))
                        return ctx.stylize('' + value, 'number');
                    if (isBoolean(value))
                        return ctx.stylize('' + value, 'boolean');
                    // For some reason typeof null is "object", so special case here.
                    if (isNull(value))
                        return ctx.stylize('null', 'null');
                }
                function formatError(value) {
                    return '[' + Error.prototype.toString.call(value) + ']';
                }
                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    var output = [];
                    for (var i = 0, l = value.length; i < l; ++i) {
                        if (hasOwnProperty(value, String(i))) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
                        } else {
                            output.push('');
                        }
                    }
                    keys.forEach(function (key) {
                        if (!key.match(/^\d+$/)) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
                        }
                    });
                    return output;
                }
                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
                    if (desc.get) {
                        if (desc.set) {
                            str = ctx.stylize('[Getter/Setter]', 'special');
                        } else {
                            str = ctx.stylize('[Getter]', 'special');
                        }
                    } else {
                        if (desc.set) {
                            str = ctx.stylize('[Setter]', 'special');
                        }
                    }
                    if (!hasOwnProperty(visibleKeys, key)) {
                        name = '[' + key + ']';
                    }
                    if (!str) {
                        if (ctx.seen.indexOf(desc.value) < 0) {
                            if (isNull(recurseTimes)) {
                                str = formatValue(ctx, desc.value, null);
                            } else {
                                str = formatValue(ctx, desc.value, recurseTimes - 1);
                            }
                            if (str.indexOf('\n') > -1) {
                                if (array) {
                                    str = str.split('\n').map(function (line) {
                                        return '  ' + line;
                                    }).join('\n').substr(2);
                                } else {
                                    str = '\n' + str.split('\n').map(function (line) {
                                        return '   ' + line;
                                    }).join('\n');
                                }
                            }
                        } else {
                            str = ctx.stylize('[Circular]', 'special');
                        }
                    }
                    if (isUndefined(name)) {
                        if (array && key.match(/^\d+$/)) {
                            return str;
                        }
                        name = JSON.stringify('' + key);
                        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            name = name.substr(1, name.length - 2);
                            name = ctx.stylize(name, 'name');
                        } else {
                            name = name.replace(/'/g, '\\\'').replace(/\\"/g, '"').replace(/(^"|"$)/g, '\'');
                            name = ctx.stylize(name, 'string');
                        }
                    }
                    return name + ': ' + str;
                }
                function reduceToSingleString(output, base, braces) {
                    var numLinesEst = 0;
                    var length = output.reduce(function (prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf('\n') >= 0)
                            numLinesEst++;
                        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                    }, 0);
                    if (length > 60) {
                        return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
                    }
                    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                }
                // NOTE: These type checking functions intentionally don't use `instanceof`
                // because it is fragile and can be easily faked with `Object.create()`.
                function isArray(ar) {
                    return Array.isArray(ar);
                }
                exports.isArray = isArray;
                function isBoolean(arg) {
                    return typeof arg === 'boolean';
                }
                exports.isBoolean = isBoolean;
                function isNull(arg) {
                    return arg === null;
                }
                exports.isNull = isNull;
                function isNullOrUndefined(arg) {
                    return arg == null;
                }
                exports.isNullOrUndefined = isNullOrUndefined;
                function isNumber(arg) {
                    return typeof arg === 'number';
                }
                exports.isNumber = isNumber;
                function isString(arg) {
                    return typeof arg === 'string';
                }
                exports.isString = isString;
                function isSymbol(arg) {
                    return typeof arg === 'symbol';
                }
                exports.isSymbol = isSymbol;
                function isUndefined(arg) {
                    return arg === void 0;
                }
                exports.isUndefined = isUndefined;
                function isRegExp(re) {
                    return isObject(re) && objectToString(re) === '[object RegExp]';
                }
                exports.isRegExp = isRegExp;
                function isObject(arg) {
                    return typeof arg === 'object' && arg !== null;
                }
                exports.isObject = isObject;
                function isDate(d) {
                    return isObject(d) && objectToString(d) === '[object Date]';
                }
                exports.isDate = isDate;
                function isError(e) {
                    return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
                }
                exports.isError = isError;
                function isFunction(arg) {
                    return typeof arg === 'function';
                }
                exports.isFunction = isFunction;
                function isPrimitive(arg) {
                    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
                    typeof arg === 'undefined';
                }
                exports.isPrimitive = isPrimitive;
                exports.isBuffer = require('./support/isBuffer');
                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }
                function pad(n) {
                    return n < 10 ? '0' + n.toString(10) : n.toString(10);
                }
                var months = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                // 26 Feb 16:19:34
                function timestamp() {
                    var d = new Date();
                    var time = [
                        pad(d.getHours()),
                        pad(d.getMinutes()),
                        pad(d.getSeconds())
                    ].join(':');
                    return [
                        d.getDate(),
                        months[d.getMonth()],
                        time
                    ].join(' ');
                }
                // log is just a thin wrapper to console.log that prepends a timestamp
                exports.log = function () {
                    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
                };
                /**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
                exports.inherits = require('inherits');
                exports._extend = function (origin, add) {
                    // Don't do anything if add isn't an object
                    if (!add || !isObject(add))
                        return origin;
                    var keys = Object.keys(add);
                    var i = keys.length;
                    while (i--) {
                        origin[keys[i]] = add[keys[i]];
                    }
                    return origin;
                };
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }
            }.call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
        },
        {
            './support/isBuffer': 78,
            '_process': 76,
            'inherits': 77
        }
    ],
    80: [
        function (require, module, exports) {
            module.exports = {
                'name': 'escope',
                'description': 'ECMAScript scope analyzer',
                'homepage': 'http://github.com/estools/escope',
                'main': 'lib/index.js',
                'version': '3.6.0',
                'engines': { 'node': '>=0.4.0' },
                'maintainers': [{
                        'name': 'Yusuke Suzuki',
                        'email': 'utatane.tea@gmail.com',
                        'web': 'http://github.com/Constellation'
                    }],
                'repository': {
                    'type': 'git',
                    'url': 'https://github.com/estools/escope.git'
                },
                'dependencies': {
                    'es6-map': '^0.1.3',
                    'es6-weak-map': '^2.0.1',
                    'esrecurse': '^4.1.0',
                    'estraverse': '^4.1.1'
                },
                'devDependencies': {
                    'babel': '^6.3.26',
                    'babel-preset-es2015': '^6.3.13',
                    'babel-register': '^6.3.13',
                    'browserify': '^13.0.0',
                    'chai': '^3.4.1',
                    'espree': '^3.1.1',
                    'esprima': '^2.7.1',
                    'gulp': '^3.9.0',
                    'gulp-babel': '^6.1.1',
                    'gulp-bump': '^1.0.0',
                    'gulp-eslint': '^1.1.1',
                    'gulp-espower': '^1.0.2',
                    'gulp-filter': '^3.0.1',
                    'gulp-git': '^1.6.1',
                    'gulp-mocha': '^2.2.0',
                    'gulp-plumber': '^1.0.1',
                    'gulp-sourcemaps': '^1.6.0',
                    'gulp-tag-version': '^1.3.0',
                    'jsdoc': '^3.4.0',
                    'lazypipe': '^1.0.1',
                    'vinyl-source-stream': '^1.1.0'
                },
                'license': 'BSD-2-Clause',
                'scripts': {
                    'test': 'gulp travis',
                    'unit-test': 'gulp test',
                    'lint': 'gulp lint',
                    'jsdoc': 'jsdoc src/*.js README.md'
                }
            };
        },
        {}
    ]
}, {}, [2]));