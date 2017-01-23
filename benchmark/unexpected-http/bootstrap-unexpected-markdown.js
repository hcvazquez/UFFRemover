/*global unexpected:true*/
unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
unexpected.installPlugin(require('./lib/unexpectedHttp'));
