"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");
var register = require("../model/register.js");
var fs = require('fs');
var instrumentor = require("../task/instrumentor.js");
var uglifyJS = require('uglify-js');

var dl = "function $dl(a,b){if(document.getElementById(a))b();else{var d=document.getElementsByTagName('head')[0],e=document.createElement('script');e.async=!1,e.src=a,e.id=a,e.onload=e.onreadystatechange=function(){b()},d.insertBefore(e,d.firstChild)}}";

(function () {
    register.loadRegister('profiling.txt');
    register.printRegister();
})();

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
        fs.writeFile(file.replace(".js","")+"-optimized.js", dl+"\r\n"+optimizedCode, function (err) {
            if (err) {
                return console.log("ERROR desinstrumented " + file);
            }
            console.log("File optimized: "+file);
            console.log("File generated: "+file.replace(".js","")+"-optimized.js");
        });
    });
}

var optimizeFileMinified = function (file) {
    var optimizedCode = "";
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        optimizedCode = instrumentor.optimizeFunctions(file, data, register);
        var output = uglifyJS.minify(dl+optimizedCode);
        fs.writeFile(file.replace(".js","")+"-optimized.min.js", output.code, function (err) {
            if (err) {
                return console.log("ERROR desinstrumented " + file);
            }
            console.log("File optimized: "+file);
            console.log("File generated: "+file.replace(".js","")+"-optimized.min.js");
        });
    });
}

var addBody = function (file) {
    var optimizedCode = "";
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        optimizedCode = instrumentor.addBody(file, data, register);
        fs.writeFile(file, optimizedCode, function (err) {
            if (err) {
                return console.log("ERROR desinstrumented " + file);
            }
            console.log("file desinstrumented: "+file);
        });
    });
}

module.exports = function (file) {
    if (file.endsWith('.js') && path.isInstrumentable(file)&& file.indexOf("es-optimizer")===-1) {
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

module.exports.optimizeFile = function (file) {
    //console.log(file);
    if (file.endsWith('.js') && file.indexOf("es-optimizer")===-1) {
        if (register.isLoaded()) {
            //console.log("Sync");
            optimizeFile(file);
        } else {
            register.getReader().on('close', function () {
               // console.log("ASync");
                optimizeFile(file);
            })
        }
    }
    return through();
}

module.exports.optimizeFileMinified = function (file) {
    //console.log(file);
    if (file.endsWith('.js') && file.indexOf("es-optimizer")===-1) {
        if (register.isLoaded()) {
            //console.log("Sync");
            optimizeFileMinified(file);
        } else {
            register.getReader().on('close', function () {
                // console.log("ASync");
                optimizeFileMinified(file);
            })
        }
    }
    return through();
}

module.exports.addBody = function (file) {
    //console.log(file);
    if (file.endsWith('.js') && file.indexOf("es-optimizer")===-1) {
        if (register.isLoaded()) {
            //console.log("Sync");
            addBody(file);
        } else {
            register.getReader().on('close', function () {
                // console.log("ASync");
                addBody(file);
            })
        }
    }
    return through();
}

module.exports.optimizeInstrumentedFile = function (file) {
    //console.log(file);
    if (file.endsWith('.js') && file.indexOf("es-optimizer")===-1) {
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
    if (file.endsWith('.js') && file.indexOf("es-optimizer")===-1) {
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

module.exports.optimizeFolder = function (dir) {
    opt_folder(dir);
    return through();
}

function opt_folder (dir){
    console.log("Reading dir: "+dir);
    var fs = require('fs');
    fs.readdir(dir, function(err, files){
        if (err) {
            return console.log("ERROR reading dir: " + dir);
        }
        files.map(function(file) {
            console.log("Reading file: "+file);
            file = dir+"//"+file;
            if(file.endsWith(".js")) {
                fs.readFile(file, 'utf8', function (err, data) {
                    if (err) {
                        return console.log("ERROR reading during optimization in: " + file);
                    }

                    var instrumentedCode = instrumentor.optimizeFunctions(file, data, register);

                    fs.writeFile(file, instrumentedCode, function (err) {
                        if (err) {
                            return console.log("ERROR optimizing: " + file);
                        }
                        console.log("file instrumented: " + file);
                    });
                });
            }
            else {
                opt_folder(file);
            }
        });
    });

    return through();
}