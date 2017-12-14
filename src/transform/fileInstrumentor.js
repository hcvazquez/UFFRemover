"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");
var instrumentor = require("../task/instrumentor.js");

module.exports = function (file) {

    if (file.endsWith('.js') && path.isInstrumentable(file) && file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
       // console.log("Reading file "+file);
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
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
        console.log("Reading file "+file);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading durring instrumentation in " + file + " " + err);
            }

            var instrumentedCode = instrumentor.instrumentFunctions(file, data);
            var newName = file.replace(".js","")+"-instrumented.js";
            fs.writeFile(newName, instrumentedCode, function (err) {
                if (err) {
                    return console.log("ERROR instrumented " + file);
                }
                console.log("file instrumented: " + newName);
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


var gaEventSender = "window._$gaLogArray||(window._$gaLogArray=[],window._$gaLogBuff=[]),window.$_gaInsider||(window.$_gaInsider=function(n){_$ga(function(o){_$ga('send','event','function call',n,o.get('clientId'))})}),window.$_gaEventSender||(window.$_gaEventSender=function(n){if(-1===window._$gaLogArray.indexOf(n)&&(window._$gaLogArray.push(n),window._$gaLogBuff.push(n),'function'==typeof _$ga)){for(var o=0;o<window._$gaLogBuff.length;o++)window.$_gaInsider(_$gaLogBuff[o]);window._$gaLogBuff=[]}});";

module.exports.instrumentFileGA = function (file) {
    //console.log("Reading file "+file);
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        var fs = require('fs');
        console.log("Reading file "+file);
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading durring instrumentation in " + file);
            }

            var instrumentedCode = instrumentor.instrumentFunctionsGA(file, data);
            fs.writeFile(file.replace(".js","")+"-instrumented-ga.js", gaEventSender+"\r\n"+instrumentedCode, function (err) {
                if (err) {
                    return console.log("ERROR instrumented " + file);
                }
                console.log("file instrumented: " + file);
            });
        });

    }

    return through();
}

module.exports.instrumentFolderGA = function (dir) {
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

                var instrumentedCode = instrumentor.instrumentFunctionsGA(file, data);

                fs.writeFile(file, gaEventSender+"\r\n"+instrumentedCode, function (err) {
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