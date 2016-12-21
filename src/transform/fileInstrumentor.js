"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");
var instrumentor = require("../task/instrumentor.js");

module.exports = function (file) {

    if (file.endsWith('.js') && path.isInstrumentable(file) && file.indexOf("es-optimizer")===-1) {
        var fs = require('fs');
        console.log("Reading file "+file);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading durring instrumentation in " + file);
            }

            var instrumentedCode = instrumentor.instrumentFunctions(file, data);

            fs.writeFile(file, instrumentedCode, function (err) {
                if (err) {
                    return console.log("ERROR instrumented " + file);
                }
                console.log("file instrumented: " + file);
            });
        });

    }

    return through();
}

module.exports.instrumentFile = function (file) {
    //console.log("Reading file "+file);
    if (file.endsWith('.js') && file.indexOf("es-optimizer")===-1) {
        var fs = require('fs');
        console.log("Reading file "+file);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading durring instrumentation in " + file);
            }

            var instrumentedCode = instrumentor.instrumentFunctions(file, data);

            fs.writeFile(file, instrumentedCode, function (err) {
                if (err) {
                    return console.log("ERROR instrumented " + file);
                }
                console.log("file instrumented: " + file);
            });
        });

    }

    return through();
}

module.exports.instrumentFolder = function (dir) {
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
                                return console.log("ERROR reading durring instrumentation in " + file);
                            }

                            var instrumentedCode = instrumentor.instrumentFunctions(file, data);

                            fs.writeFile(file, instrumentedCode, function (err) {
                                if (err) {
                                    return console.log("ERROR instrumented " + file);
                                }
                                console.log("file instrumented: " + file);
                            });
                        });

                });
        });

    return through();
}