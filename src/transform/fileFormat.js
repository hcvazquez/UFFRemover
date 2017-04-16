"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");
var instrumentor = require("../task/instrumentor.js");

module.exports = function (file) {

    if (file.endsWith('.js') && path.isInstrumentable(file) && file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
        console.log("Reading file "+file);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading durring format in " + file);
            }

            var instrumentedCode = instrumentor.prepare(file, data);

            fs.writeFile(file, instrumentedCode, function (err) {
                if (err) {
                    return console.log("ERROR format " + file);
                }
                console.log("file format: " + file);
            });
        });

    }

    return through();
}

module.exports.formatFile = function (file) {
    //console.log("Reading file "+file);
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
        console.log("Reading file "+file);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading durring format in " + file);
            }

            var instrumentedCode = instrumentor.prepare(file, data);

            fs.writeFile(file, instrumentedCode, function (err) {
                if (err) {
                    return console.log("ERROR format " + file);
                }
                console.log("file format: " + file);
            });
        });

    }

    return through();
}

module.exports.formatFolder = function (dir) {
        console.log("Reading dir "+dir);
        var fs = require('fs');
        fs.readdir(dir, function(err, files){
            if (err) {
                return console.log("ERROR reading dir " + dir);
            }
            files.map(function(file) {
                        console.log("Reading file "+file);
                        file = dir+"//"+file
                        fs.readFile(file, 'utf8', function (err, data) {
                            if (err) {
                                return console.log("ERROR reading durring format in " + file);
                            }

                            var instrumentedCode = instrumentor.prepare(file, data);

                            fs.writeFile(file, instrumentedCode, function (err) {
                                if (err) {
                                    return console.log("ERROR format " + file);
                                }
                                console.log("file format: " + file);
                            });
                        });

                });
        });

    return through();
}

module.exports.formatFolder = function(dir){
    formatDir(dir);
}

function formatDir(dir) {
//    console.log("Reading dir "+dir);
    var fs = require('fs');
    fs.readdir(dir, function(err, files){
        if (err) {
            return console.log("ERROR reading dir " + dir);
        }
        files.map(function(fileRel) {
            var file = require('path').resolve(dir, fileRel);
            if(file.indexOf("UFFOptimizer")===-1) {
                require('fs').stat(file, function (err, stat) {
                    if (stat && stat.isDirectory() && !fileRel.startsWith(".")) {
                        formatDir(file);
                    }else{
                        if (file.indexOf("\\test\\") === -1) {

                        }else{
                            if (file.endsWith('.js')) {
                                fileFormat(file);
                            }
                        }
                    }
                });
            }
        });
    });
}

function fileFormat(file){
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
        console.log("Reading file "+file);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading durring format in " + file);
            }

            var instrumentedCode = instrumentor.prepare(file, data);

            fs.writeFile(file, instrumentedCode, function (err) {
                if (err) {
                    return console.log("ERROR format " + file);
                }
                console.log("file format: " + file);
            });
        });

    }
}