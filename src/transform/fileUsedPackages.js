"use strict";

var through = require('through2');
var path = require("../model/utilpath.js");

var packages = [];
var packagesNames = [];

module.exports = function (file) {

    if (file.endsWith('.js') && path.isInstrumentable(file)&& file.indexOf("UFFOptimizer")===-1) {
        var pakage = path.getFullPackageName(file,"\\");
        var name = path.getFileName(pakage,"\\");
        if(packages.indexOf(pakage)===-1){
            packages.push(pakage);
        }
        if(packagesNames.indexOf(name)===-1){
            packagesNames.push(name);
        }
    }
   // console.log(packages);
    return through();
}

module.exports.printPackages = function (){
    console.log("Packages: "+packages);
    console.log("Packages Names: "+packagesNames);
    console.log("Total packages: "+packages.length);
    console.log("Unique packages: "+packagesNames.length);
}