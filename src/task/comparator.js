/**
 * MODULO utilizado para hacer el análisis de estadisticas
 */

'use strict';

/**
 * Estadisticas del archivo
 */
var comparation_stats = {
	"name" : "comparation stats",
	"loc_removed" : 0,
	"functions_reduced" : 0,
	"UFF_emptyed" : 0,
	"UFF_loc_left" : 0,
	"UFF_optimized" : 0,
	"size_optimized" : 0
};


/**
 * Funcion expuesta por el modulo para comparar bundles
 */
module.exports.compareBundles = function(stats1, stats2) {

	comparation_stats["loc_removed"] = stats1["loc"]- stats2["loc"];
	comparation_stats["size_optimized"] = stats1["size"]- stats2["size"];
	comparation_stats["functions_reduced"] = stats1["number_of_functions"]- stats2["number_of_functions"];
	comparation_stats["UFF_emptyed"] = stats2["empty_functions"]- stats1["empty_functions"];
	comparation_stats["UFF_loc_left"] = comparation_stats["UFF_emptyed"] * 2;
	comparation_stats["UFF_optimized"] = comparation_stats["UFF_emptyed"] + comparation_stats["functions_reduced"];

	return comparation_stats;

}
