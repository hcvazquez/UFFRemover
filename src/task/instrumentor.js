'use strict';

var _astTypes = require('ast-types');

var _estraverse = require('estraverse');

var _escodegen = require('escodegen');

var parser = require('./parser.js');

var register = require("../model/register.js");

var fs = require('fs');

module.exports.instrumentFunctions = function (file,code) {
	  var ast = parser.parseWithLOC(code,file);
	  ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	  var consoleArray = true;
	  var instrumentedAST = _estraverse.replace(ast, {
	    enter: function enter(node) {
	    	if(consoleArray){
	    		consoleArray = false;
				node.body.unshift(parser.parseWithLOC("var consoleLogArray = [];"));
			}
	      if (_astTypes.namedTypes.FunctionDeclaration.check(node)||_astTypes.namedTypes.FunctionExpression.check(node)) {
	    	node.body.body.unshift(parser.parseWithLOC(register.get_start_instrumentation(node,file)));
	    	return node;
	      }
	    }
	  });
	
	  return _escodegen.generate(instrumentedAST,{/*format: {preserveBlankLines: true},comment: true, sourceCode:code*/});
}


module.exports.desinstrumentFunctions = function (file,code) {
	var ast = parser.parseWithLOC(code);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var consoleArray = true;
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if(consoleArray){
				consoleArray = false;
				node.body.shift();
			}
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					node.body.body.shift();
				}
				return node;
			}
		}
	});

	return _escodegen.generate(instrumentedAST,{comment: true});
}

module.exports.desinstrumentAndOptimizeFunctions = function (file,code) {
	var ast = parser.parseWithLOC(code);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var consoleArray = true;
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if(consoleArray){
				consoleArray = false;
				node.body.shift();
			}
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)||_astTypes.namedTypes.FunctionExpression.check(node)) {
					if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
						_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
						node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						console.log("This node is registered: "+register.getKeyFromLine(node.body.body[0].consequent.body[1].expression.arguments[0].value));
						node.body.body.shift();
					}else{
						console.log("This node is an UFF: "+register.getKeyFromLine(node.body.body[0].consequent.body[1].expression.arguments[0].value));
						node.body.body=[];
					}
				}
				return node;
			}
		}
	});

	return _escodegen.generate(instrumentedAST,{comment: true});
}

module.exports.optimizeFunctions = function (file,code) {
	var ast = parser.parseWithLOC(code);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
				if(register.isRegistered(register.get_end_instrumentation(node,file))){
					console.log("This node is registered: "+register.getKeyForFunction(node,file));
				}else{
					console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
					node.body.body=[];
				}
				return node;
			}

		}
	});

	return _escodegen.generate(instrumentedAST,{comment: true});
}

module.exports.prepare = function (file,code) {
	var ast = parser.parseWithLOC(code);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
				return node;
			}
		}
	});
	return _escodegen.generate(instrumentedAST,{comment: true});
}

//DEPRECATED
module.exports.LogUFFsFromInstrumentedFiles = function (file,code) {
	var ast = parser.parseWithLOC(code,file);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
				if(_astTypes.namedTypes.IfStatement.check(node.body.body[0]) &&
					_astTypes.namedTypes.CallExpression.check(node.body.body[0].test.left) &&
					node.body.body[0].test.left.callee.object.name === "consoleLogArray"){
					if(!register.isRegistered(node.body.body[0].consequent.body[1].expression.arguments[0].value)){
						console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
					}
				}
				return node;
			}
		}
	});

	return _escodegen.generate(instrumentedAST,{comment: true});
}

module.exports.logUFFList = function (file,code) {
    var ast = parser.parseWithLOC(code,file);
    ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
    var cont = 1;
    var instrumentedAST = _estraverse.replace(ast, {
        enter: function enter(node) {
            if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
                if(!register.isRegistered(register.get_end_instrumentation(node,file))){
                    console.log(register.getKeyForFunction(node,file));
                }
                return node;
            }
        }
    });
    return  _escodegen.generate(instrumentedAST,{comment: true});
}

//DEPRECATED
module.exports.desInstrumentAndOptimizeForNode = function (file,code) {
	var ast = parser.parseWithLOC(code,file);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var consoleArray = true;
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if(consoleArray){
				consoleArray = false;
				node.body.shift();
			}
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node) ) {
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
						//createUffFile4node(file,getHash(register.getKeyForFunction(node,file))+".uff",_escodegen.generate(node.body,{comment: true}));
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
		}
	});

	return addReturnStatement(_escodegen.generate(instrumentedAST,{comment: true}));
}

module.exports.optimizeForBrowser = function (file,code,file_stats) {
    var ast = parser.parseWithLOC(code,file);
    ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
    var cont = 1;
	console.log("*** UFF List ***");
    var instrumentedAST = _estraverse.replace(ast, {
        enter: function enter(node) {
            if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
                    if(register.isRegistered(register.get_end_instrumentation(node,file))){
                        //console.log("This node is registered: "+register.getKeyForFunction(node,file));
                    }else{
						file_stats['#UFFs detected']++;
                        //console.log("This node is an UFF: "+register.getKeyForFunction(node,file));
						console.log(register.getKeyForFunction(node,file));
						var timestamp = Date.now();

                        var hasReturn = hasReturnStatement(node.body);
                        var hasThis = hasThisExpression(node.body);
                        var functionCode = getFunctionCode(node.body,hasThis);
						var functionFileName = "$"+getHash(functionCode)+timestamp+".js"; //verificar que no pueda haber dos tiemstamp iguales y dos hash iguales
                        createFile(functionFileName, functionCode);
                        var hookcode = getHookCode(functionFileName,hasReturn,hasThis);
                        node.body.body=[];
                        //console.log(hookcode);
                        node.body.body.unshift(parser.parseWithLOC(parser.trimFileName(hookcode),file));
                        cont++;
                    }
                return node;
            }
        }
    });
	console.log("*** End UFF List ***");

    return  checkReturnStatement(_escodegen.generate(instrumentedAST/*,{comment: true}*/));
}

module.exports.countFunctions = function (file,code) {
	var ast = parser.parseWithLOC(code,file);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var cont = 0;
	var instrumentedAST = _estraverse.replace(ast, {
		enter: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
				cont++;
				return node;
			}
		}
	});

	return cont;
}

var checkReturnStatement = function(code){
    code = code.replaceAll("return$eval","return eval");
    return code;
}
var checkThatStatement = function(code){
    code = code.replaceAll("that;","that");
    return code;
}

var getFunctionCode = function(body){
    var old_code = _escodegen.generate(body,{comment: true});
    var new_code = "(function(){"+old_code+"})();";
    return new_code;
}

var getHookCode = function(functionFileName,hasReturn,hasThis){
    var uffdir = "uff";
    var hookcode = "eval($dl('"+uffdir+"/"+functionFileName+"'));";
    if(hasReturn){
    	hookcode = "return$"+hookcode;
	}
	if(hasThis){
        hookcode = "var $that = this;\r\n"+hookcode;
	}
    return hookcode;
}

var createFile = function(functionFileName,functionCode){
	var uffdir = "uff";
    if (!fs.existsSync(uffdir)){
        console.log("Creating dir: "+uffdir);
        fs.mkdirSync(uffdir);
    }
    fs.writeFile(uffdir+"/"+functionFileName, checkThatStatement(functionCode), 'utf8', (err) => {
        if (err) throw err;
    });
}

var hasReturnStatement = function(root){
    var returnStatement = false;
    var instrumentedAST = _estraverse.replace(root, {
        enter: function enter(node) {
            if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
                return _estraverse.VisitorOption.Skip;
            }
            if (_astTypes.namedTypes.ReturnStatement.check(node)) {
                returnStatement = true;
                return _estraverse.VisitorOption.Break;
            }
        }
    });
    return returnStatement;
}

var hasThisExpression = function(root){
    var thisExpression = false;
    var instrumentedAST = _estraverse.replace(root, {
        enter: function enter(node) {
            if (_astTypes.namedTypes.FunctionDeclaration.check(node) || _astTypes.namedTypes.FunctionExpression.check(node)) {
                return _estraverse.VisitorOption.Skip;
            }
            if (_astTypes.namedTypes.ThisExpression.check(node)) {
                thisExpression = true;
                return parser.parseWithLOC("$that");
            }
        }
    });
    return thisExpression;
}

var addReturnStatement = function(code){
	code = code.replaceAll("eval('(function(){' + require('fs').readFileSync(","return eval('(function(){' + require('fs').readFileSync(");
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


var createUffFile4node = function(filepath,file,content){
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

module.exports.instrumentFunctionsGA = function (file,code) {
	var ast = parser.parseWithLOC(code,file);
	ast  = _escodegen.attachComments(ast, ast.comments, ast.tokens);
	var consoleArray = true;
	var instrumentedAST = _estraverse.replace(ast, {
		leave: function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)||_astTypes.namedTypes.FunctionExpression.check(node)) {
				node.body.body.unshift(parser.parseWithLOC(register.get_ga_instrumentation(node,file)));
				//console.log(register.get_ga_instrumentation(node,file));
				return node;
			}
		}
	});

	return _escodegen.generate(instrumentedAST,{/*format: {preserveBlankLines: true},*/comment: true/*, sourceCode:code*/});
}