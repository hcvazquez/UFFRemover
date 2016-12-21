"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");


module.exports = function (file) {

    if (file.endsWith('.js') && path.isInstrumentable(file)) {
        var fs = require('fs');

        var fileOriginal = path.getBackupName(file);

        fs.rename(file, fileOriginal, function(err) {
            if (err) {
                return console.log("ERROR renaming file " + file);
            }

            fs.readFile(fileOriginal, 'utf8', function (err, data) {
                if (err) {
                    return console.log("ERROR reading durring preparation in " + file);
                }

                //var prepareCode = instrumentor.prepare(fileOriginal, data);

                fs.writeFile(file, /*prepareCode*/data, function (err) {
                    if (err) {
                        return console.log("ERROR prepared " + file);
                    }
                    console.log("file prepared: " + file);
                });
            });

        });

    }
    return through();
}