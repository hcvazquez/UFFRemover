"use strict";

var fs = require('fs');
var uglifyJS = require('uglify-js');


module.exports.minifyFile = function (file) {

    var originalCode = "";

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log("ERROR reading file " + file);
        }
        originalCode = data;

        var minifiedOriginal = uglifyJS.minify(originalCode);
        var origMinFileName = file.replace(".js","")+"-min.js"
        fs.writeFileSync(origMinFileName,minifiedOriginal.code);
        console.log("Minified file created: "+origMinFileName);
    });
}
