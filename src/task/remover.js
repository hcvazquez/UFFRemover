'use strict';

var _astTypes = require('ast-types');

var _estraverse = require('estraverse');

var _escodegen = require('escodegen');

var parser = require('./parser.js');

var register = require("../model/register.js");

module.exports.removeFunctions = function (file,code,keys) {
	  var ast = parser.parseWithLOC(code);
	  ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	  // Traverse syntax tree
	  var builder = _astTypes.builders;
	  var instrumentedAST = _estraverse.replace(ast, {
	    enter: function enter(node) {
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
	    	//console.log(get_start_instrumentation(node.id.name,file,node.loc.start.line));
	  		//console.log(get_end_instrumentation(node.id.name,file,node.loc.start.line));
	    	//node.body.body.unshift(parser.parseWithLOC(get_start_instrumentation(node.id.name,parser.trimFileName(file),node.loc.start.line)));
	    	//node.body.body.push(_esprima.parse(get_end_instrumentation(node.id.name,file,node.loc.start.line)));
	    	return node;
	      }
	      /*if (_astTypes.namedTypes.VariableDeclarator.check(node)&& node.init !== null && _astTypes.namedTypes.FunctionExpression.check(node.init.type)) {
		    	console.log(get_start_instrumentation(node.id.name,file,node.loc.start.line));
		  		//console.log(get_end_instrumentation(node.id.name,file,node.loc.start.line));
		    	node.init.body.body.unshift(parser.parse(get_start_instrumentation(node.id.name,parser.trimFileName(file),node.loc.start.line)));
		    	//node.body.body.push(_esprima.parse(get_end_instrumentation(node.id.name,file,node.loc.start.line)));
		    	return node;
		  }
	      if (_astTypes.namedTypes.Property.check(node)&& node.value !== null && _astTypes.namedTypes.FunctionExpression.check(node.value)) {
		    	console.log(get_start_instrumentation(node.key.name,file,node.loc.start.line));
		  		//console.log(get_end_instrumentation(node.id.name,file,node.loc.start.line));
		    	node.value.body.body.unshift(parser.parse(get_start_instrumentation(node.key.name,parser.trimFileName(file),node.loc.start.line)));
		    	//node.body.body.push(_esprima.parse(get_end_instrumentation(node.id.name,file,node.loc.start.line)));
		    	return node;
		  }*/
	      if (_astTypes.namedTypes.FunctionExpression.check(node)) {
	    	//console.log(get_start_instrumentation(node.id,file,node.loc.start.line));
	  		//console.log(get_end_instrumentation(node.id.name,file,node.loc.start.line));
	    	node.body.body.unshift(parser.parseWithLOC(get_start_instrumentation(node,file)));
	    	//node.body.body.push(_esprima.parse(get_end_instrumentation(node.id.name,file,node.loc.start.line)));
	    	return node;
		  }
	      
	    },
		leave: function (node, parent) {
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
	    	//console.log(node);  
	      	return node;
	      }		
		}
	  });
	
	  //console.log(_escodegen.generate(instrumentedAST));
	  return _escodegen.generate(instrumentedAST,{/*format: {preserveBlankLines: true},*/comment: true/*, sourceCode:code*/});
}


module.exports.desinstrumentFunctions = function (file,code) {
	  var ast = parser.parseWithLOC(code);
	  ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	  // Traverse syntax tree
	  var builder = _astTypes.builders;
	  var instrumentedAST = _estraverse.replace(ast, {
	    enter: function enter(node) {
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
	    	node.body.body.shift();
	    	return node;
	      }
	      if (_astTypes.namedTypes.FunctionExpression.check(node)) {
		    node.body.body.shift();
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