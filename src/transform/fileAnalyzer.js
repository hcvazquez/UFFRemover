"use strict";

var through = require('through2')
var analyzer = require("../task/analyzer.js");
var path = require("../model/utilpath.js");

/**
 * Estadisticas de las librerias
 */
var library_stats = {
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
            library_stats["library_files"]++;
            analyzer.library_analyze(file, data, library_stats);

            require('fs').createReadStream(file)
                .on('data', function(chunk) {
                    var i;
                    for (i=0; i < chunk.length; ++i)
                        if (chunk[i] == 10) library_stats["loc"]++;
                })
                .on('end', function() {
                    console.log(library_stats);
                });
        });

    }else{
        if (file.endsWith('.js')&& file.indexOf("UFFOptimizer")===-1) {
            library_stats["program_files"]++;
        }
    }

    return through();
}

module.exports.printLibraryStats = function(){
    console.log(library_stats);
}

module.exports.analyzeFile = function (file) {

    if (file.endsWith('.js')) {
        var fs = require('fs');
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading " + file);
            }

            var file_stats = analyzer.analyze(file, data);

            require('fs').createReadStream(file)
                .on('data', function(chunk) {
                    var i;
                    for (i=0; i < chunk.length; ++i)
                        if (chunk[i] == 10) file_stats["loc"]++;
                })
                .on('end', function() {
                    console.log(file_stats);
                });
        });

    }else{
        console.log("ERROR the file " + file + " is not a JS file");
    }

}


/**
 * Estadisticas de las librerias
 */
var folder_stats = {
    "name": "library analysis",
    "number_of_functions" : 0,
    "empty_functions" : 0,
    "size" : 0,
    "loc" : 0,
    "js_files" : 0,
    "metadata_files" : 0,
    "test_files" : 0
};


module.exports.analyzeFolder = function(dir){
    analyzeDir(dir);
 //   console.log(folder_stats);
}

function analyzeDir(dir) {
//    console.log("Reading dir "+dir);
    var fs = require('fs');
    fs.readdir(dir, function(err, files){
        if (err) {
            return console.log("ERROR reading dir " + dir);
        }
        files.map(function(fileRel) {
            var file = require('path').resolve(dir, fileRel);
            if(file.indexOf("UFFOptimizer")===-1 && file.indexOf("magicpen-media\\node_modules")===-1) {
                require('fs').stat(file, function (err, stat) {
                    if (stat && stat.isDirectory() && !fileRel.startsWith(".")) {
                        analyzeDir(file);
                    }else{
                        if (file.indexOf("\\test\\") === -1) {
                            if (file.endsWith('.js')) {
                                folder_stats["js_files"]++;
                                /*fs.readFile(file, 'utf8', function (err, data) {
                                 if (err) {
                                 return console.log("ERROR reading " + file);
                                 }
                                 try {
                                 analyzer.library_analyze(file, data, folder_stats);
                                 }catch(err){
                                 console.log(err);
                                 }
                                 require('fs').createReadStream(file)
                                 .on('data', function (chunk) {
                                 var i;
                                 for (i = 0; i < chunk.length; ++i)
                                 if (chunk[i] == 10) folder_stats["loc"]++;
                                 })
                                 .on('end', function () {
                                 console.log(folder_stats);
                                 });
                                 });*/

                            } else {
                                folder_stats["metadata_files"]++;
                            }
                        }else{
                            if (file.endsWith('.js')) {
                                folder_stats["test_files"]++;
                            }else{
                                folder_stats["metadata_files"]++;
                            }
                        }
                    }
                });
            }
        });
        console.log(folder_stats);
    });
}