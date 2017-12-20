var _browserify = require('browserify');

module.exports.library_stats = function (mainFile) {
  var p = require("./fileAnalyzer.js");
  return _browserify({
    entries: [ mainFile ],
      transform: [[p, {'global': true}]]
  })
      .bundle(function(a,b){p.printLibraryStats()})
};

module.exports.file_stats = function (file) {
    var fileAnalyzer = require("./fileAnalyzer.js");
    return fileAnalyzer.analyzeFile(file);
};

module.exports.folder_stats = function (dir) {
    var fileAnalyzer = require("./fileAnalyzer.js");
    return fileAnalyzer.analyzeFolder(dir);
};

module.exports.compare_bundles = function (file,file2) {
    var fileComparator = require("./fileComparator.js");
    return fileComparator.compare(file,file2);
};

module.exports.backup = function (mainFile) {
  return _browserify({
    entries: [ mainFile ],
      transform: [[require("./fileBackup.js"), {'global': true}]]
  })
      .bundle()
};

module.exports.test_instrument = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileTestInstrument.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.test_optimize = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileTestOptimize.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.modules = function (mainFile) {
    var p = require("./fileUsedModules.js");
    _browserify({
        entries: [ mainFile ],
        transform: [[p, {'global': true}]]
    })
        .bundle(function(a,b){p.printModules();});
};

module.exports.unused_modules = function (mainFile) {
    var p = require("./fileUnusedModules.js");
    _browserify({
        entries: [ mainFile ],
        transform: [[p, {'global': true}]]
    })
        .bundle(function(a,b){
            //console.log(p.getModules());
            //console.log(p.getPackages());
            p.findUnusedModules();
        });
};

module.exports.packages = function (mainFile) {
    var p = require("./fileUsedPackages.js");
    _browserify({
        entries: [ mainFile ],
        transform: [[p, {'global': true}]]
    }).bundle(function(a,b){p.printPackages();});

};

module.exports.instrument = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileInstrumentor.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.format = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileFormat.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.instrument_file = function (mainFile) {
    return require("./fileInstrumentor.js").instrumentFile(mainFile);
};

module.exports.instrument_file_ga = function (mainFile) {
    return require("./fileInstrumentor.js").instrumentFileGA(mainFile);
};

module.exports.min = function (mainFile) {
    return require("./fileMinify.js").minifyFile(mainFile);
};

module.exports.format_file = function (mainFile) {
    return require("./fileFormat.js").formatFile(mainFile);
};

module.exports.format_folder = function (folder) {
    return require("./fileFormat.js").formatFolder(folder);
};

module.exports.instrument_folder = function (folder) {
    return require("./fileInstrumentor.js").instrumentFolder(folder);
};

module.exports.instrument_folder_ga = function (folder) {
    return require("./fileInstrumentor.js").instrumentFolderGA(folder);
};

module.exports.desinstrument = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileDesInstrumentor.js"), {'global': true}]]
    })
        .bundle()
};


module.exports.optimize = function (mainFile,profilingFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileOptimizer.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.optimize4node = function (mainFile,profilingFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileOptimizer4Node.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.uffs = function (mainFile,profilingFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileUFFLogger.js"), {'global': true}]]
    })
        .bundle()
};

module.exports.optimize_file = function (mainFile,profilingFile) {
    return require("./fileOptimizer.js").optimizeFile(mainFile,profilingFile);
};

module.exports.optimize_file_browser = function (mainFile,profilingFile) {
    return require("./fileOptimizer.js").optimizeFileBrowser(mainFile,profilingFile);
};

module.exports.log_file_uffs = function (mainFile,profilingFile) {
    return require("./fileOptimizer.js").logUFFListFromFile(mainFile,profilingFile);
};

module.exports.desinstrument_file = function (mainFile) {
    return require("./fileOptimizer.js").desinstrumentFile(mainFile);
};

module.exports.optimize_instrumented_file = function (mainFile,profilingFile) {
    return require("./fileOptimizer.js").optimizeInstrumentedFile(mainFile,profilingFile);
};

module.exports.optimize_instrumented_file_node = function (mainFile,profilingFile) {
    return require("./fileOptimizer4Node.js").optimize4node(mainFile,profilingFile);
};

module.exports.restore = function (mainFile) {
    return _browserify({
        entries: [ mainFile ],
        transform: [[require("./fileRestore.js"), {'global': true}]]
    })
        .bundle()
};
