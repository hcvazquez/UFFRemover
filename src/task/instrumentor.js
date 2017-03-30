'use strict';

var _astTypes = require('ast-types');

var _estraverse = require('estraverse');

var _escodegen = require('escodegen');

var parser = require('./parser.js');

var register = require("../model/register.js");

module.exports.instrumentFunctions = function (file,code) {
	  var ast = parser.parseWithLOC(code);
	  ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	  // Traverse syntax tree
	  var builder = _astTypes.builders;
	  var consoleArray = true;
	  var instrumentedAST = _estraverse.replace(ast, {
	    enter: function enter(node) {
	    	if(consoleArray){
	    		consoleArray = false;
				node.body.unshift(parser.parseWithLOC("var consoleLogArray = [];"));
			}
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
	      	//console.log(parser.parseWithLOC(register.get_start_instrumentation(node,file)));
	    	node.body.body.unshift(parser.parseWithLOC(register.get_start_instrumentation(node,file)));
	    	return node;
	      }
	      if (_astTypes.namedTypes.FunctionExpression.check(node)) {
	      	//console.log(parser.parseWithLOC(register.get_start_instrumentation(node,file)));
	    	node.body.body.unshift(parser.parseWithLOC(register.get_start_instrumentation(node,file)));
	    	return node;
		  }
	      
	    },
		leave: function (node, parent) {
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
	      	return node;
	      }		
		}
	  });
	
	  return _escodegen.generate(instrumentedAST,{/*format: {preserveBlankLines: true},*/comment: true/*, sourceCode:code*/});
}


module.exports.desinstrumentFunctions = function (file,code) {
	  var ast = parser.parseWithLOC(code);
	  ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	  var builder = _astTypes.builders;
//	  console.log(register.getReg());
	  var instrumentedAST = _estraverse.replace(ast, {
	    enter: function enter(node) {
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node) /*&& register.isRegistered(node,file)*/) {
	    	//register.unregisterNode(node,file);
			  if(node.body.body[0].expression.callee.object.name === "console" &&
				  node.body.body[0].expression.callee.property.name ==="log" &&
				  node.body.body[0].expression.arguments[0].value.startsWith(register.getProfLabel())){
  				  node.body.body.shift();
			  }
	    	//node.body.body.shift();
	    	return node;
	      }
	      if (_astTypes.namedTypes.FunctionExpression.check(node) /*&& register.isRegistered(node,file)*/) {
	    	//register.unregisterNode(node,file);
		    //node.body.body.shift();
			  if(node.body.body[0].expression.callee.object.name === "console" &&
				  node.body.body[0].expression.callee.property.name ==="log" &&
				  node.body.body[0].expression.arguments[0].value.startsWith(register.getProfLabel())){
				  node.body.body.shift();
			  }
	    	return node;
		  }
	      
	    },
		leave: function (node, parent) {
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
	      	return node;
	      }		
		}
	  });
	
	  return _escodegen.generate(instrumentedAST,{comment: true});
}

module.exports.desinstrumentAndOptimizeFunctions = function (file,code) {
	var ast = parser.parseWithLOC(code);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var builder = _astTypes.builders;
//	  console.log(register.getReg());
//	register.printRegister();
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//console.log(register.get_end_instrumentation(node,file));
				if(register.isRegistered(register.get_end_instrumentation(node,file))){
					console.log("This node is registered: "+node);
					//node.body.body.shift();
				}else{
					console.log("This node is an UFF: "+node);
					node.body.body=[];
				}
				//node.body.body.shift();
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//node.body.body.shift();
				//console.log(register.get_end_instrumentation(node,file));
				if(register.isRegistered(register.get_end_instrumentation(node,file))){
					console.log("This node is registered: "+node);
					//		node.body.body.shift();
				}else{
					console.log("This node is an UFF: "+node);
					node.body.body=[];
				}
				return node;
			}

		},
		leave: function (node, parent) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
				return node;
			}
		}
	});

	return _escodegen.generate(instrumentedAST,{comment: true});
}

module.exports.optimizeFunctions = function (file,code) {
	var ast = parser.parseWithLOC(code);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var builder = _astTypes.builders;
//	  console.log(register.getReg());
//	register.printRegister();
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//console.log(register.get_end_instrumentation(node,file));
				if(register.isRegistered(register.get_end_instrumentation(node,file))){
					console.log("This node is registered: "+node);
					//node.body.body.shift();
				}else{
					console.log("This node is an UFF: "+node);
					node.body.body=[];
				}
				//node.body.body.shift();
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//node.body.body.shift();
				//console.log(register.get_end_instrumentation(node,file));
				if(register.isRegistered(register.get_end_instrumentation(node,file))){
					console.log("This node is registered: "+node);
					//		node.body.body.shift();
				}else{
					console.log("This node is an UFF: "+node);
					node.body.body=[];
				}
				return node;
			}

		},
		leave: function (node, parent) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
				return node;
			}
		}
	});

	return _escodegen.generate(instrumentedAST,{
		format: {
			indent: {
				style: '    ',
				base: 0,
				adjustMultilineComment: false
			},
			newline: '\n',
			space: ' ',
			json: false,
			renumber: false,
			hexadecimal: false,
			quotes: 'single',
			escapeless: false,
			compact: false,
			parentheses: true,
			semicolons: true,
			safeConcatenation: false
		},
		moz: {
			starlessGenerator: false,
			parenthesizedComprehensionBlock: true,
			comprehensionExpressionStartsWithAssignment: false
		},
		parse: null,
		comment: true,
		sourceMap: undefined,
		sourceMapRoot: null,
		sourceMapWithCode: false,
		file: undefined,
		sourceContent: null,
		directive: false,
		verbatim: undefined
	});
}

module.exports.prepare = function (file,code) {
	var ast = parser.parseWithLOC(code);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	// Traverse syntax tree
	var builder = _astTypes.builders;
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node)) {
				return node;
			}

		},
		leave: function (node, parent) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
				return node;
			}
		}
	});
	return _escodegen.generate(instrumentedAST,{/*format: {preserveBlankLines: true},*/comment: true/*, sourceCode:code*/});
}