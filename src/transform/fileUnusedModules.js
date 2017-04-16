"use strict";

var through = require('through2');
var path = require("../model/utilpath.js");
var fs = require('fs');
var analyzer = require("../task/analyzer.js");

var modules = [];
var packages = [];
var unusedModules = [];
var unusedModulesLOC = 0;

var metaFiles = ["Gruntfile.js","gruntfile.js","Gulpfile.js","gulpfile.js","karma.conf.ci.js","karma.conf.js"];

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

    if (file.endsWith('.js') && path.isInstrumentable(file)&& file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
        modules.push(file);
        var pakage = path.getFullPackageName(file,"\\");
        if(packages.indexOf(pakage)===-1){
            packages.push(pakage);
        }
    }

    return through();
}

module.exports.getModules = function (){
    return modules;
}

module.exports.getPackages = function (){
    return packages;
}

module.exports.getUnusedModules = function (){
    return unusedModules;
}

module.exports.findUnusedModules = function(){
    for(var i in packages){
        findUnusedModules(packages[i]);
    }
}

function findUnusedModules(dir){
    fs.readdir(dir, function(err, files) {
        if (err) {
            return console.log("ERROR reading dir " + dir);
        }
        files.map(function (fileRel) {
            var file = require('path').resolve(dir, fileRel);
            if (file.indexOf("UFFOptimizer") === -1 && file.indexOf("magicpen-media\\node_modules") === -1) {
                require('fs').stat(file, function (err, stat) {
                    if (stat && stat.isDirectory() && !fileRel.startsWith(".")) {
                        findUnusedModules(file);
                    }
                });
                if (file.indexOf("\\test") === -1 && file.indexOf(".min.") === -1 && file.indexOf("-min.") === -1 &&
                    file.indexOf("\\example") === -1 &&
                    file.endsWith('.js') && modules.indexOf(file) === -1 && metaFiles.indexOf(path.getFileName(file,"\\"))===-1) {
                    if(unusedModules.indexOf(file)===-1){
                        console.log("UNUSED MODULE: " + file);
                        unusedModules.push(file);
                        var fs = require('fs');
                        module_stats["library_files"]++;
                        fs.readFile(file, 'utf8', function (err, data) {
                            if (err) {
                                return console.log("ERROR reading " + file);
                            }
                            try{
                                analyzer.library_analyze(file, data, module_stats);
                            }catch(e){
                                console.log("ERROR reading " + file);
                            }

                            require('fs').createReadStream(file)
                                .on('data', function(chunk) {
                                    var i;
                                    for (i=0; i < chunk.length; ++i)
                                        if (chunk[i] == 10) module_stats["loc"]++;
                                })
                                .on('end', function() {
                                    console.log(module_stats);
                                });
                        });
                    }
                }
            }
        });
    });
}