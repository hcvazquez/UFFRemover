"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");
var register = require("../model/register.js");
var fs = require('fs');
var instrumentor = require("../task/instrumentor.js");

var uglifyJS = require('uglify-js');


/**
 * Private functions
 *
 * @param profilingFile
 */

var dl = "function $dl(scriptURL){"+
    "if(!window.uffs){"+
        "window.uffs = {};"+
    "}"+
    "if(!window.uffs[scriptURL]){"+
        "var xhReq = new XMLHttpRequest();"+
        "xhReq.open(\"GET\", scriptURL, false);"+
        "xhReq.send(null);"+
        " window.uffs[scriptURL] = xhReq.responseText;"+
    "}"+
    "return window.uffs[scriptURL];"+
"}";

var loadRegister = function (profilingFile) {
    if(profilingFile!==null  && profilingFile!==undefined && profilingFile.length >0){
        register.loadRegister(profilingFile);
    }else{
        register.loadRegister('profiling.txt');
    }
};

var desInstrumentAndOptimizeFile = function (file) {
    var desInstrumentedCode = "";
   // console.log("Reading file "+file);
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        desInstrumentedCode = instrumentor.desinstrumentAndOptimizeFunctions(file, data, register);
        fs.writeFile(file, desInstrumentedCode, function (err) {
            if (err) {
                return console.log("ERROR desinstrumented " + file);
            }
            console.log("file desinstrumented: "+file);
        });
    });
}

var desInstrumentFile = function (file) {
    var desInstrumentedCode = "";
    // console.log("Reading file "+file);
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        desInstrumentedCode = instrumentor.desinstrumentFunctions(file, data, register);
        fs.writeFile(file, desInstrumentedCode, function (err) {
            if (err) {
                return console.log("ERROR desinstrumented " + file);
            }
            console.log("file desinstrumented: "+file);
        });
    });
}

var optimizeFile = function (file) {
    var optimizedCode = "";
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        optimizedCode = instrumentor.optimizeFunctions(file, data, register);
        fs.writeFile(file, optimizedCode, function (err) {
            if (err) {
                return console.log("ERROR desinstrumented " + file);
            }
            console.log("file desinstrumented: "+file);
        });
    });
}


/**
 * Estadisticas de la optimizacion
 */
var file_stats = {
    "name": "js file analysis",
    "#Functions_in_bundle" : 0,
    "original_size" : 0,
    "original_min_size" : 0,
    "optimized_min_size" : 0,
    "#UFFs detected" : 0,
    "size_of_reduction" : 0,
	"%_of_reduction" : 0,
    "%_of_UFF_detected" :0,
};

var optimizeFileBrowser = function (file) {

    var originalCode = "";
    var optimizedCode = "";

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        originalCode = data;
        optimizedCode = instrumentor.optimizeForBrowser(file, data, file_stats);

        var newFileName = file.replace(".js","")+"-optimized.js";

        fs.writeFileSync(newFileName, dl+"\r\n"+optimizedCode);

        console.log("");
        console.log("**** Optimization ****");
        console.log("File optimized: "+file);
        console.log("Optimized file created: "+newFileName);

        var minifiedOriginal = uglifyJS.minify(originalCode);
        var minifiedOptimized = uglifyJS.minify(dl+"\r\n"+optimizedCode);

        var origMinFileName = file.replace(".js","")+"-min.js"
        var optMinFileName = file.replace(".js","")+"-optimized-min.js"

        console.log("");
        console.log("*** Minified Files ***");
        fs.writeFileSync(origMinFileName,minifiedOriginal.code);
        console.log("Original minified file created: "+origMinFileName);
        fs.writeFileSync(optMinFileName,minifiedOptimized.code)
        console.log("Optimized minified file created: "+optMinFileName);
        console.log("");
        console.log("*** Metrics***");
        /**
         * size metrics
         */
        file_stats['#Functions_in_bundle'] = instrumentor.countFunctions(file, originalCode);
        var fuctionsInOptimized = instrumentor.countFunctions(file, optimizedCode);
        file_stats['#UFFs detected'] = file_stats['#UFFs detected']+(file_stats['#Functions_in_bundle'] - fuctionsInOptimized);

        var stats = require('fs').statSync(file);
        file_stats['original_size'] = stats['size'];
        stats = require('fs').statSync(origMinFileName);
        file_stats['original_min_size'] = stats['size'];
        stats = require('fs').statSync(optMinFileName);
        file_stats['optimized_min_size'] = stats['size'];
        file_stats['size_of_reduction'] = file_stats['original_min_size'] - file_stats['optimized_min_size'];
		file_stats['%_of_reduction'] = ((file_stats['original_min_size'] - file_stats['optimized_min_size'])/file_stats['original_min_size'])*100;
        file_stats['%_of_UFF_detected'] = (file_stats['#UFFs detected']/file_stats['#Functions_in_bundle'])*100;

        console.log(file_stats);

    });
}


var logUFFList = function (file) {
    var optimizedCode = "";
    console.log("$$$ UFF LIST $$$");
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        instrumentor.logUFFList(file, data, register);
    });
}

module.exports = function (file,profilingFile) {
    loadRegister(profilingFile);
    if (file.endsWith('.js') && path.isInstrumentable(file)&& file.indexOf("UFFOptimizer")===-1) {
        if (register.isLoaded()) {
            //console.log("Sync");
            desInstrumentAndOptimizeFile(file);
        } else {
            register.getReader().on('close', function () {
                //console.log("ASync");
                desInstrumentAndOptimizeFile(file);
            })
        }
    }
    return through();
}


/**
 * Public Functions
 *
 * @param file
 * @param profilingFile
 * @returns {*}
 */

module.exports.optimizeFile = function (file, profilingFile) {
    //console.log(file);
    loadRegister(profilingFile);
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        if (register.isLoaded()) {
            optimizeFile(file);
        } else {
            register.getReader().on('close', function () {
                optimizeFile(file);
            })
        }
    }
    return through();
}

module.exports.optimizeFileBrowser = function (file, profilingFile) {
    //console.log(file);
    loadRegister(profilingFile);
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        if (register.isLoaded()) {
            optimizeFileBrowser(file);
        } else {
            register.getReader().on('close', function () {
                optimizeFileBrowser(file);
            })
        }
    }
    return through();
}

module.exports.logUFFListFromFile = function (file, profilingFile) {
    //console.log(file);
    loadRegister(profilingFile);
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        if (register.isLoaded()) {
            logUFFList(file);
        } else {
            register.getReader().on('close', function () {
                logUFFList(file);
            })
        }
    }
    return through();
}

module.exports.optimizeInstrumentedFile = function (file, profilingFile) {
    //console.log(file);
    loadRegister(profilingFile);
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        if (register.isLoaded()) {
            //console.log("Sync");
            desInstrumentAndOptimizeFile(file);
        } else {
            register.getReader().on('close', function () {
                // console.log("ASync");
                desInstrumentAndOptimizeFile(file);
            })
        }
    }
    return through();
}


module.exports.desinstrumentFile = function (file) {
    //console.log(file);
    if (file.endsWith('.js') && file.indexOf("UFFOptimizer")===-1) {
        if (register.isLoaded()) {
            //console.log("Sync");
            desInstrumentFile(file);
        } else {
            register.getReader().on('close', function () {
                // console.log("ASync");
                desInstrumentFile(file);
            })
        }
    }
    return through();
}
