/**
 * MODULO utilizado para hacer el análisis de estadisticas
 */

'use strict';

var _esprima = require('esprima');

var trimHashbang = function(code) {
	if (code.substring(0, 2) !== '#!')
		return code;
	var end = code.indexOf('\n');
	var filler = '';
	_.each(_.range(end), function() {
		filler += ' ';
	});
	code = filler + code.substring(end, code.length);
	return code;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/**
 * Funcion expuesta por el modulo para fixear ILLEGAL tokens
 */
module.exports.trimCode = function(code) {
	return trimHashbang(code);
}

/**
 * Funcion expuesta por el modulo para fixear ILLEGAL tokens
 */
module.exports.trimFileName = function(file) {
	var fileName = trimHashbang(file).replaceAll("\\","\\\\");
	return fileName;
}

/**
 * Funcion expuesta por el modulo para parsear un archivo
 */
module.exports.parse = function(code, file) {
	var result = '';
	try {
		result = _esprima.parse(trimHashbang(code));
	} catch (e) {
		throw new Error('parse error in ' + file);
	}
	return result;
}

/**
 * Funcion expuesta por el modulo para parsear un archivo incluyendo el numero de linea
 */
module.exports.parseWithLOC = function(code, file) {
	var result = '';
	try {
		//console.log(file);
		//console.log(code);

		result = _esprima.parse(trimHashbang(code),{loc: true, range: true, tokens: true, comment:true});
	} catch (e) {
		throw new Error('parse error in ' + file);
	}
	return result;
}
