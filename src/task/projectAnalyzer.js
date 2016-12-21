/**
 * MODULO utilizado para hacer el análisis de estadisticas
 */

'use strict';

var _astTypes = require('ast-types');

var _estraverse = require('estraverse');

var _escodegen = require('escodegen');

var parser = require('./parser.js');

/**
 * Estadisticas del proyecto
 */
var _project_stats = {
	"number_of_functions" : 0,
	"foreign_funtions" : 0,
	"local_funtions" : 0,
	"foreign_jsfile" : 0,
	"local_jsfile" : 0,
	"__PROJECT__" : {},
	"number_of_dependencies" : 0,
	"dependencies" : []
};

var _dependencies = [];

/**
 * Funcion que determina si un archivo es de una libreria TODO si se agrega
 * analisis de librerias descargas con bower hay que agregar funcionalidad
 */
var _isForeign = function(file) {
	if (file.includes("node_modules")) {
		return true;
	}
	return false;
}

/**
 * Funcion que retorna el nombre del modulo al que pertenece el archivo
 */
var _getDependencyName = function(file) {
	var arrDependencies = file.split("node_modules\\");
	if (arrDependencies.length > 1) {
		return arrDependencies[arrDependencies.length - 1].split("\\")[0];
	}
	return null;
}

/**
 * Funcion expuesta por el modulo para analizar un archivo
 */
module.exports.analyze = function(file, code) {

	var dependencyName = _getDependencyName(file);

	var foreign = false;
	if (_isForeign(file)) {
		foreign = true;
		_project_stats["foreign_jsfile"]++;
	} else {
		_project_stats["local_jsfile"]++;
	}

	var file_stats = {
		"number_of_functions" : 0,
	// "foreign_funtions" : 0,
	// "local_funtions" : 0,
	// "foreign_jsfile" : 0,
	// "local_jsfile" : 0
	};

	var ast = parser.parse(code,file);
	// Traverse syntax tree
	var builder = _astTypes.builders;
	var instrumentedAST = _estraverse.replace(ast, {
		enter : function enter(node) {
			if (_astTypes.namedTypes.FunctionDeclaration.check(node)) {
				_project_stats["number_of_functions"]++;
				file_stats["number_of_functions"]++;
				if (foreign) {
					_project_stats["foreign_funtions"]++;
				} else {
					_project_stats["local_funtions"]++;
				}
				return node;
			}
			if (_astTypes.namedTypes.FunctionExpression.check(node)) {
				_project_stats["number_of_functions"]++;
				if (foreign) {
					_project_stats["foreign_funtions"]++;
				} else {
					_project_stats["local_funtions"]++;
				}
				return node;
			}
		}
	});

	if (dependencyName === null) {
		_project_stats["__PROJECT__"][file] = file_stats;
	} else {
		if (_dependencies.indexOf(dependencyName) === -1) {
			_project_stats["number_of_dependencies"]++;
			_project_stats["dependencies"].push(dependencyName);
			_project_stats[dependencyName] = {};
			_dependencies.push(dependencyName);
		}
		_project_stats[dependencyName][file] = file_stats;
	}
}

/**
 * Funcion expuesta por el modulo para imprimir las estadisticas
 */
module.exports.printStats = function() {

	console.log(_project_stats);

}


