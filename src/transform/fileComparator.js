"use strict";

var analyzer = require("../task/analyzer.js");

module.exports.compare = function (file, file2) {

    if (file.endsWith('.js')) {
        var fs = require('fs');
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log("ERROR reading " + file);
            }

            var file_stats_1 = analyzer.analyze(file, data);

            require('fs').createReadStream(file)
                .on('data', function (chunk) {
                    var i;
                    for (i = 0; i < chunk.length; ++i)
                        if (chunk[i] == 10) file_stats_1["loc"]++;
                })
                .on('end', function () {
                    console.log(file_stats_1);
                    fs.readFile(file2, 'utf8', function (err, data) {
                        if (err) {
                            return console.log("ERROR reading " + file2);
                        }

                        var file_stats_2 = analyzer.analyze(file2, data);

                        require('fs').createReadStream(file2)
                            .on('data', function (chunk) {
                                var i;
                                for (i = 0; i < chunk.length; ++i)
                                    if (chunk[i] == 10) file_stats_2["loc"]++;
                            })
                            .on('end', function () {
                                console.log(file_stats_2);
                                var comparator = require("../task/comparator.js");
                                console.log(comparator.compareBundles(file_stats_1, file_stats_2));
                            });
                    });
                });
        });

    }else{
        console.log("ERROR the file " + file + " is not a JS file");
    }

}