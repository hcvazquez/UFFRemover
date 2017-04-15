"use strict";

var through = require('through2')
var path = require("../model/utilpath.js");

module.exports = function (file) {

    if (file.endsWith('.js') && path.isInstrumentable(file)) {
        var fs = require('fs');

        var fileOriginal = path.getBackupName(file);

        fs.unlink(file, function (err) {
            if (err) {
                console.log("ERROR removing file " + file + err);
            }

            fs.readFile(fileOriginal, 'utf8', function (err, data) {
                if (err) {
                    return console.log("ERROR reading " + file);
                }

                fs.writeFile(file, data, function (err) {
                    if (err) {
                        return console.log("ERROR restoring " + file);
                    }
                    console.log("file restored: " + file);

                    fs.unlink(fileOriginal, function (err) {
                        if (err) {
                            console.log("ERROR removing file " + fileOriginal + err);
                        }
                    });
                });
            });
        });

    }

    return through();
}