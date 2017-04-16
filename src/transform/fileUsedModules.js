"use strict";

var through = require('through2');
var path = require("../model/utilpath.js");
var analyzer = require("../task/analyzer.js");

/**
 * Estadisticas de los modulos
 */
var module_stats = {
    "name": "library analysis",
    "number_of_functions" : 0,
    "empty_functions" : 0,
    "size" : 0,
    "loc" : 0,
    "library_files" : 0,
    "program_files" : 0
};

module.exports = function (file) {

    if (file.endsWith('.js')&& path.isInstrumentable(file)&& file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading " + file);
            }
            console.log("library module: "+file)
            module_stats["library_files"]++;
            analyzer.library_analyze(file, data, module_stats);

            require('fs').createReadStream(file)
                .on('data', function(chunk) {
                    var i;
                    for (i=0; i < chunk.length; ++i)
                        if (chunk[i] == 10) module_stats["loc"]++;
                })
                .on('end', function() {
                   // console.log(module_stats);
                });
        });

    }else{
        if (file.endsWith('.js')&& file.indexOf("UFFOptimizer")===-1) {
        	console.log("program module: "+file);
            module_stats["program_files"]++;
        }
    }

    return through();
}

module.exports.printModules = function(){
    console.log(module_stats);
}