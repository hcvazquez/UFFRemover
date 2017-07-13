'use strict';

var _astTypes = require('ast-types');

var _estraverse = require('estraverse');

var _escodegen = require('escodegen');

var parser = require('./parser.js');

var register = require("../model/register.js");

module.exports.instrumentFunctions = function (file,code) {
	  var ast = parser.parseWithLOC(code,file);
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
	var consoleArray = true;
//	  console.log(register.getReg());
//	register.printRegister();
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if(consoleArray){
				consoleArray = false;
				node.body.shift();
			}
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					node.body.body.shift();
				}
				//node.body.body.shift();
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//node.body.body.shift();
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
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
	var consoleArray = true;
//	  console.log(register.getReg());
//	register.printRegister();
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if(consoleArray){
				consoleArray = false;
				node.body.shift();
			}
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
					if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
						_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
						node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						console.log("This node is registered: "+register.getKeyForFunction(node,file));
						node.body.body.shift();
					}else{
						console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
						node.body.body=[];
					}
				}
				//node.body.body.shift();
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//node.body.body.shift();
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						console.log("This node is registered: "+register.getKeyForFunction(node,file));
						node.body.body.shift();
					}else{
						console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
						node.body.body=[];
					}
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
				if(register.isRegistered(register.get_end_instrumentation(node,file))){
					console.log("This node is registered: "+register.getKeyForFunction(node,file));
					//node.body.body.shift();
				}else{
					console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
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
					console.log("This node is registered: "+register.getKeyForFunction(node,file));
					//		node.body.body.shift();
				}else{
					console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
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

module.exports.LogUFFsFromInstrumentedFiles = function (file,code) {
	var ast = parser.parseWithLOC(code,file);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var builder = _astTypes.builders;
	var consoleArray = true;
//	  console.log(register.getReg());
//	register.printRegister();
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if(consoleArray){
				consoleArray = false;
				//node.body.shift();
			}
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						//console.log("This node is registered: "+register.getKeyForFunction(node,file));
						//node.body.body.shift();
					}else{
						console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
						//node.body.body=[];
					}
				}
				//node.body.body.shift();
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//node.body.body.shift();
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						//console.log("This node is registered: "+register.getKeyForFunction(node,file));
						//node.body.body.shift();
					}else{
						console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
						//node.body.body=[];
					}
				}
				return node;
			}

		}
	});

	return _escodegen.generate(instrumentedAST,{comment: true});
}

module.exports.desInstrumentAndOptimizeForNode = function (file,code) {
	var ast = parser.parseWithLOC(code,file);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var builder = _astTypes.builders;
	var consoleArray = true;
//	  console.log(register.getReg());
//	register.printRegister();
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if(consoleArray){
				consoleArray = false;
				node.body.shift();
			}
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						console.log("This node is registered: "+register.getKeyForFunction(node,file));
						node.body.body.shift();
					}else{
						console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
						node.body.body.shift();
						var hash = getHash(register.getKeyForFunction(node,file));
						var uffdir = getuffdir(file,hash);
						//createUffFile(file,getHash(register.getKeyForFunction(node,file))+".uff",_escodegen.generate(node.body,{comment: true}));
						//var hookcode = "eval(\"require("+uffdir+"/"+hash+")\")";
						//var hookcode = "console.log(\""+register.getKeyForFunction(node,file)+"\");eval(\"require("+uffdir+"/"+hash+")\")";
						//var hookcode = "console.log(\""+register.getKeyForFunction(node,file)+"\");";
						var hookcode = "console.log(\""+register.getKeyForFunction(node,file)+"\");" +
							"eval('(function(){'+require('fs').readFileSync('"+uffdir+"/"+hash+".uff"+"').toString()+'})()')";
						node.body.body=[];
						//console.log(hookcode);
						node.body.body.unshift(parser.parseWithLOC(parser.trimFileName(hookcode),file));
					}
				}
				//node.body.body.shift();
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node) /*&& register.isRegistered(node,file)*/) {
				//register.unregisterNode(node,file);
				//node.body.body.shift();
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						console.log("This node is registered: "+register.getKeyForFunction(node,file));
						node.body.body.shift();
					}else{
						console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
						node.body.body.shift();
						var hash = getHash(register.getKeyForFunction(node,file));
						var uffdir = getuffdir(file,hash);
						//createUffFile(file,getHash(register.getKeyForFunction(node,file))+".uff",_escodegen.generate(node.body,{comment: true}));
						//var hookcode = "eval(\"require("+uffdir+"/"+hash+")\")";
						//var hookcode = "console.log(\""+register.getKeyForFunction(node,file)+"\");eval(\"require("+uffdir+"/"+hash+")\")";
						//var hookcode = "console.log(\""+register.getKeyForFunction(node,file)+"\");";
						var hookcode = "console.log(\""+register.getKeyForFunction(node,file)+"\");" +
							"eval(\"(function(){\"+require(\"fs\").readFileSync(\""+uffdir+"/"+hash+".uff"+"\").toString()+\"})()\");";
						node.body.body=[];
						//console.log(hookcode);
						node.body.body.unshift(parser.parseWithLOC(parser.trimFileName(hookcode),file));
					}
				}
				return node;
			}

		}
	});

	return addReturnStatement(_escodegen.generate(instrumentedAST,{comment: true}));
}

var addReturnStatement = function(code){
	code = code.replaceAll("eval('(function(){' + require('fs').readFileSync(","return eval('(function(){' + require('fs').readFileSync(");
	console.log(code);
	return code;
}

var getHash = function(string) {
	var hash = 0, i, chr;
	if (string.length === 0) return hash;
	for (i = 0; i < string.length; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return "_"+hash;
};


var createUffFile = function(filepath,file,content){
	var fs = require('fs');
	var uffdir = getuffdir(filepath,file);
	if (!fs.existsSync(uffdir)){
		console.log("Creating dir: "+uffdir);
		fs.mkdirSync(uffdir);
	}
	fs.writeFile(uffdir+"/"+file, content, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("created file "+file);
	});
}

var getuffdir = function(filepath,file){
	var path = require("../model/utilpath.js");
	var dir = path.getProjectPath(filepath,"/");
	return dir+"_uff";
}