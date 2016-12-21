/**
 * MODULO utilizado para hacer el análisis de estadisticas
 */

'use strict';

var _astTypes = require('ast-types');

var _estraverse = require('estraverse');

var _escodegen = require('escodegen');

var parser = require('./parser.js');


/**
 * Funcion expuesta por el modulo para analizar un archivo
 */
module.exports.analyze = function(file, code) {

	/**
	 * Estadisticas del archivo
	 */
	var file_stats = {
		"name_file": file,
		"number_of_functions" : 0,
		"empty_functions" : 0,
		"size" : 0,
		"loc" : 0
	};

	var ast = parser.parse(code,file);
	// Traverse syntax tree
	var builder = _astTypes.builders;
	var instrumentedAST = _estraverse.replace(ast, {
		enter : function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
				file_stats["number_of_functions"]++;
				if(!node.body.body.length > 0){
					file_stats["empty_functions"]++;
				}
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node)) {
				file_stats["number_of_functions"]++;
				if(!node.body.body.length > 0){
					file_stats["empty_functions"]++;
				}
				return node;
			}
		}
	});

	var stats = require('fs').statSync(file);
	file_stats["size"] = stats["size"];

	return file_stats;

}

/**
 * Funcion expuesta por el modulo para analizar un archivo
 */
module.exports.library_analyze = function(file, code, file_stats) {

	var ast = parser.parse(code,file);
	// Traverse syntax tree
	var builder = _astTypes.builders;
	var instrumentedAST = _estraverse.replace(ast, {
		enter : function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
				file_stats["number_of_functions"]++;
				if(!node.body.body.length > 0){
					file_stats["empty_functions"]++;
				}
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node)) {
				file_stats["number_of_functions"]++;
				if(!node.body.body.length > 0){
					file_stats["empty_functions"]++;
				}
				return node;
			}
		}
	});

	var stats = require('fs').statSync(file);
	file_stats["size"] = file_stats["size"] + stats["size"];

}

/**
 * Funcion expuesta por el modulo para imprimir las estadisticas
 */
module.exports.printStats = function() {

	console.log(file_stats);

}


