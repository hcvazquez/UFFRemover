"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");
var instrumentor = require("../task/instrumentor.js");

module.exports = function (file) {

    if (file.endsWith('.js') && path.isInstrumentable(file)&& file.indexOf("es-optimizer")===-1) {
        var fs = require('fs');
        console.log("node ../es-optimizer optimize_file  "+"\""+file+"\"");
    }

    return through();
}