"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");
var register = require("../model/register.js");
var fs = require('fs');
var instrumentor = require("../task/instrumentor.js");


/**
 * Private functions
 *
 * @param profilingFile
 */

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
        instrumentor.LogUFFsFromInstrumentedFiles(file, data, register);
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
