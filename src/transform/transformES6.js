var _browserify = require('browserify');

module.exports.project_stats = function (mainFile) {
  return _browserify({
    entries: [ mainFile ]
  })
      .transform(require("./fileAnalyzer.js"), {
        global: true
      })
      .bundle()
};

module.exports.file_stats = function (file) {
    var fileAnalyzer = require("./fileAnalyzer.js");
    return fileAnalyzer.analyze(file);
};

module.exports.compare_bundles = function (file,file2) {
    var fileComparator = require("./fileComparator.js");
    return fileComparator.compare(file,file2);
};

module.exports.prepare = function (mainFile) {
  return _browserify({
    entries: [ mainFile ],
      transform: [[require('babelify')], [require("./fileBackup.js"), {'global': true}]]
  })
      .bundle()
};

module.exports.instrument = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require('babelify')], [require("./fileInstrumentor.js"), {'global': true}]]
    })
        .bundle()
};


module.exports.test = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require('babelify')], [require("./fileUsedModules.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.desinstrument = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require('babelify')], [require("./fileDesInstrumentor.js"), {'global': true}]]
    })
        .bundle()
};


module.exports.optimize = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require('babelify')], [require("./fileOptimizer.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.restore = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require('babelify')], [require("./fileRestore.js"), {'global': true}]]
    })
        .bundle()
};
