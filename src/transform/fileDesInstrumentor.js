"use strict";

var through = require('through2')
var instrumentation = require("../model/instrumentation.js");
var path = require("../model/utilpath.js");
var instrumentor = require("../task/instrumentor.js");
var register = require("../model/register.js");
var fs = require('fs');

/*(function () {
    register.loadRegister('profiling.txt');
})();*/

var desInstrumentFile = function (file) {
    var desInstrumentedCode = "";
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        desInstrumentedCode = instrumentor.desinstrumentFunctions(file, data, register);
        fs.writeFile(file, desInstrumentedCode, function (err) {
            if (err) {
                return console.log("ERROR desinstrumented " + file);
            }
            //console.log("file desinstrumented: "+file);
        });
    });
}

module.exports = function (file) {
    if (file.endsWith('.js') && path.isInstrumentable(file)) {
        if (register.isLoaded()) {
            //console.log("Sync");
            desInstrumentFile(file);
        } else {
            register.getReader().on('close', function () {
                //console.log("ASync");
                desInstrumentFile(file);
            })
        }
    }
    return through();
}