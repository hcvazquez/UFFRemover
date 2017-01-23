var Headers = require('./Headers'),
    rfc2047 = require('rfc2047'),
    util = require('util');

function HeadersWithRfc2047(obj, doNotStringify) {
    Headers.call(this, obj, doNotStringify);
}

util.inherits(HeadersWithRfc2047, Headers);

HeadersWithRfc2047.prototype.isMessyHeadersWithRfc2047 = true;

HeadersWithRfc2047.prototype.serializeHeaderValue = function (parsedHeaderValue) {
    return rfc2047.encode(parsedHeaderValue);
};

HeadersWithRfc2047.prototype.parseHeaderValue = function (serializedHeaderValue) {
    return rfc2047.decode(String(serializedHeaderValue));
};

module.exports = HeadersWithRfc2047;