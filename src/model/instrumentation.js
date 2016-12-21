'use strict';

var _astTypes = require('ast-types');

var _estraverse = require('estraverse');

var _escodegen = require('escodegen');

var _esprima = require('esprima');

module.exports.instrumentationLine = function (command,functionName,file,line) {
	  if(functionName!=""){
		  return command+" function "+functionName+" from "+file+" in line "+line;
	  }
	  return command+" anonymous function "+functionName+" from "+file+" in line "+line;
}
