/*global unescape, btoa, atob, JSON*/
var Headers = require('./Headers'),
    isRegExp = require('./isRegExp'),
    iconvLite = require('iconv-lite'),
    quotedPrintable = require('quoted-printable'),
    decodeChunkedTransferEncoding = require('./decodeChunkedTransferEncoding'),
    zlib;

try {
    zlib = require('' + 'zlib');
} catch (e) {}

function isDefined(obj) {
    return obj !== null && typeof obj !== 'undefined';
}

function quoteRegExp(str) {
    return str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function Message(obj, doNotStringify) {
    this.headers = new this.HeadersConstructor();
    this.populate(obj, doNotStringify);
}


// Descending priority:
var bodyPropertyNames = ['parts', 'body', 'unchunkedBody', 'rawBody'];

Message.propertyNames = ['headers', 'fileName', 'isJson', 'isMultipart', 'boundary', 'charset'].concat(bodyPropertyNames);

Message.prototype.isMessyMessage = true;

Message.prototype.HeadersConstructor = Headers;

Message.prototype.populate = function (obj) {
    if (typeof Buffer === 'function' && Buffer.isBuffer(obj)) {
        this.populateFromBuffer(obj);
    } else if (typeof obj === 'string') {
        this.populateFromString(obj);
    } else if (obj && typeof obj === 'object') {
        this.populateFromObject(obj);
    }
    return this;
};

Message.prototype.populateFromObject = function (obj) {
    if (typeof obj.headers !== 'undefined') {
        this.headers.populate(obj.headers);
    }
    if (typeof obj.parts !== 'undefined') {
        this.parts = (Array.isArray(obj.parts) ? obj.parts : [ obj.parts ]).map(function (part) {
            return part && part.isMessyMessage ? part : new Message(part);
        });
    } else if (typeof obj.rawBody !== 'undefined') {
        this.rawBody = obj.rawBody;
    } else if (typeof obj.body !== 'undefined') {
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(obj.body)) {
            this.unchunkedBody = obj.body;
        } else {
            this.body = obj.body;
        }
    } else if (typeof obj.unchunkedBody !== 'undefined') {
        this.unchunkedBody = obj.unchunkedBody;
    }
    return this;
};

Message.prototype.populateFromBuffer = function (buffer) {
    // Hack: Interpret non-ASCII in headers as iso-8859-1:
    var str = '';
    for (var i = 0 ; i < buffer.length ; i += 1) {
        var octet = buffer[i];
        if (octet > 127) {
            str += unescape('%' + octet.toString(16));
        } else {
            str += String.fromCharCode(octet);
        }
        if (/\r\r$|\n\n$|\r\n\r\n$|\n\r\n\r$/.test(str)) {
            i += 1;
            if (i < buffer.length) {
                this.rawBody = buffer.slice(i);
            }
            break;
        }
    }
    this.headers.populateFromString(str, true);
    return this;
};

Message.prototype.populateFromString = function (str) {
    var bodyStartIndex = this.headers.populateFromStringAndReturnBodyStartIndex(str);
    if (bodyStartIndex < str.length) {
        this.rawBody = str.substr(bodyStartIndex);
    }
    return this;
};

Object.defineProperty(Message.prototype, 'hasTextualContentType', {
    get: function () {
        var contentType = this.headers.get('Content-Type');
        if (typeof contentType === 'string') {
            contentType = contentType.toLowerCase().trim().replace(/\s*;.*$/, '');
            return (
                /^text\//.test(contentType) ||
                /^application\/(?:json|javascript)$/.test(contentType) ||
                /^application\/xml/.test(contentType) ||
                /^application\/x-www-form-urlencoded\b/.test(contentType) ||
                /\+xml$/.test(contentType) ||
                /\+json$/.test(contentType)
            );
        }
        return false;
    }
});

Object.defineProperty(Message.prototype, 'isJson', {
    get: function () {
        return /^application\/json\b|\+json\b/i.test(this.headers.get('Content-Type'));
    }
});

Object.defineProperty(Message.prototype, 'charset', {
    get: function () {
        var charset = this.headers.parameter('Content-Type', 'charset');
        if (charset) {
            return charset;
        }
        var contentType = this.headers.get('Content-Type');
        if (contentType && /^application\/json\b|\+json\b/i.test(contentType)) {
            return 'utf-8';
        }
        return 'iso-8859-1';
    }
});

Object.defineProperty(Message.prototype, 'isMultipart', {
    enumerable: true,
    get: function () {
        return /^multipart\//.test(this.headers.get('Content-Type'));
    }
});

Object.defineProperty(Message.prototype, 'boundary', {
    enumerable: true,
    get: function () {
        return this.isMultipart && this.headers.parameter('Content-Type', 'boundary');
    }
});

Object.defineProperty(Message.prototype, '_bodyMustBeBuffer', {
    get: function () {
        if (this._parts) {
            return this._parts.some(function (part) {
                return part._bodyMustBeBuffer;
            });
        } else {
            return typeof Buffer === 'function' && Buffer.isBuffer(this.body);
        }
    }
});

Object.defineProperty(Message.prototype, 'unchunkedBody', {
    enumerable: true,
    get: function () {
        if (!isDefined(this._unchunkedBody)) {
            if (isDefined(this._rawBody)) {
                this._unchunkedBody = this._rawBody;
                var transferEncoding = this.headers.get('Transfer-Encoding');
                if (transferEncoding && transferEncoding === 'chunked') {
                    try {
                        this._unchunkedBody = decodeChunkedTransferEncoding(this._unchunkedBody);
                    } catch (e) {}
                }
            } else if (isDefined(this._body) || isDefined(this._parts)) {
                this._unchunkedBody = this.body;
                if (
                    ((this.isJson && typeof this._unchunkedBody !== 'undefined') || this._unchunkedBody && typeof this._unchunkedBody === 'object') &&
                    (typeof Buffer === 'undefined' || !Buffer.isBuffer(this._unchunkedBody))
                ) {
                    try {
                        this._unchunkedBody = JSON.stringify(this._unchunkedBody);
                    } catch (e) {}
                }
                var charset = this.charset;
                if (/^utf-?8$/i.test(charset) && typeof Buffer !== 'undefined') {
                    this._unchunkedBody = new Buffer(this._unchunkedBody, 'utf-8');
                } else if (iconvLite.encodingExists(charset) && !/^utf-?8$/i.test(charset)) {
                    this._unchunkedBody = iconvLite.encode(this._unchunkedBody, charset);
                }
                var contentTransferEncoding = this.headers.get('Content-Transfer-Encoding');
                if (contentTransferEncoding) {
                    contentTransferEncoding = contentTransferEncoding.trim().toLowerCase();
                    if (contentTransferEncoding === 'base64') {
                        if (typeof Buffer !== 'undefined') {
                            if (!Buffer.isBuffer(this._unchunkedBody)) {
                                this._unchunkedBody = new Buffer(this._unchunkedBody, 'utf-8');
                            }
                            this._unchunkedBody = this.rawBody.toString('base64');
                        } else {
                            this._unchunkedBody = btoa(this._unchunkedBody);
                        }
                    } else if (contentTransferEncoding === 'quoted-printable') {
                        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(this._unchunkedBody)) {
                            this._unchunkedBody = this._unchunkedBody.toString('binary');
                        }
                        this._unchunkedBody = quotedPrintable.encode(this._unchunkedBody);
                    }
                }
                if (zlib && zlib.gzipSync) {
                    var contentEncoding = this.headers.get('Content-Encoding');
                    if (contentEncoding) {
                        contentEncoding = contentEncoding.trim().toLowerCase();
                        if (contentEncoding === 'gzip' || contentEncoding === 'deflate') {
                            try {
                                this._unchunkedBody = zlib[contentEncoding === 'gzip' ? 'gzipSync' : 'deflateSync'](this._unchunkedBody || '');
                            } catch (e) {}
                        }
                    }
                }
            }
        }
        return this._unchunkedBody;
    },
    set: function (unchunkedBody) {
        this._unchunkedBody = unchunkedBody;
        this._body = null;
        this._rawBody = null;
        this._parts = null;
    }
});

Object.defineProperty(Message.prototype, 'rawBody', {
    enumerable: true,
    get: function () {
        if (!isDefined(this._rawBody) && (isDefined(this._body) || isDefined(this._parts) || isDefined(this._unchunkedBody))) {
            this._rawBody = this.unchunkedBody;
            var transferEncoding = this.headers.get('Transfer-Encoding');
            if (transferEncoding && transferEncoding === 'chunked') {
                if (typeof Buffer !== 'undefined' && !Buffer.isBuffer(this._rawBody)) {
                    this._rawBody = new Buffer(this._rawBody, 'utf-8');
                }
                var chunks = [];
                if (this._rawBody.length > 0) {
                    chunks.push(
                        new Buffer(this._rawBody.length.toString(16) + '\r\n', 'ascii'),
                        this._rawBody,
                        new Buffer('\r\n', 'ascii')
                    );
                }
                chunks.push(new Buffer('0\r\n\r\n', 'ascii'));
                this._rawBody = Buffer.concat(chunks);
            }
        }
        return this._rawBody;
    },
    set: function (rawBody) {
        this._rawBody = rawBody;
        this._unchunkedBody = null;
        this._body = null;
        this._parts = null;
    }
});

Object.defineProperty(Message.prototype, 'body', {
    enumerable: true,
    get: function () {
        if (this._parts) {
            if (this._parts.length === 0) {
                return;
            } else {
                var boundary = this.boundary || '';
                if (this._bodyMustBeBuffer) {
                    var chunks = [];

                    this._parts.forEach(function (part, i) {
                        if (i > 0) {
                            chunks.push(new Buffer('\r\n'));
                        }
                        chunks.push(new Buffer('--' + boundary + '\r\n'));
                        var serializedPart = part.serialize();
                        if (!Buffer.isBuffer(serializedPart)) {
                            serializedPart = new Buffer(serializedPart);
                        }
                        chunks.push(serializedPart);
                    }, this);

                    chunks.push(new Buffer('\r\n--' + boundary + '--\r\n'));
                    return Buffer.concat(chunks);
                } else {
                    return '--' + boundary + '\r\n' + this._parts.join('\r\n--' + boundary + '\r\n') + '\r\n--' + boundary + '--\r\n';
                }
            }
        } else if (!isDefined(this._body) && (isDefined(this._rawBody) || isDefined(this._unchunkedBody))) {
            this._body = this.unchunkedBody;
            if (zlib && zlib.gunzipSync) {
                var contentEncoding = this.headers.get('Content-Encoding');
                if (contentEncoding) {
                    contentEncoding = contentEncoding.trim().toLowerCase();
                    if (contentEncoding === 'gzip' || contentEncoding === 'deflate') {
                        if (typeof Buffer !== 'undefined' && !Buffer.isBuffer(this._rawBody)) {
                            this._rawBody = new Buffer(this._rawBody, 'utf-8');
                        }

                        try {
                            this._body = zlib[contentEncoding === 'gzip' ? 'gunzipSync' : 'inflateSync'](this._body);
                        } catch (e) {}
                    }
                }
            }
            var contentTransferEncoding = this.headers.get('Content-Transfer-Encoding'),
                contentTransferEncodingIsHonored = !contentTransferEncoding;
            if (contentTransferEncoding) {
                contentTransferEncoding = contentTransferEncoding.trim().toLowerCase();
                if (contentTransferEncoding === 'quoted-printable') {
                    if (typeof Buffer === 'function' && Buffer.isBuffer(this._body)) {
                        this._body = this._body.toString('ascii');
                    }
                    var qpDecodedBodyAsByteString = quotedPrintable.decode(this._body);
                    this._body = new Buffer(qpDecodedBodyAsByteString.length);
                    for (var i = 0 ; i < qpDecodedBodyAsByteString.length ; i += 1) {
                        this._body[i] = qpDecodedBodyAsByteString.charCodeAt(i);
                    }
                    contentTransferEncodingIsHonored = true;
                } else if (contentTransferEncoding === 'base64') {
                    if (typeof Buffer === 'function' && Buffer.isBuffer(this._body)) {
                        this._body = this._body.toString('ascii');
                    }
                    if (typeof Buffer !== 'undefined') {
                        this._body = new Buffer(this._body, 'base64');
                    } else {
                        this._body = atob(this._body);
                    }
                    contentTransferEncodingIsHonored = true;
                } else if (contentTransferEncoding === '8bit' || contentTransferEncoding === '7bit') {
                    contentTransferEncodingIsHonored = true;
                }
            }
            if (this.hasTextualContentType && contentTransferEncodingIsHonored && this._body && typeof this._body !== 'string') {
                var charset = this.charset;
                if (iconvLite.encodingExists(charset)) {
                    this._body = iconvLite.decode(this._body, charset);
                }
            }
            if (this.isJson && typeof this._body === 'string') {
                try {
                    this._body = JSON.parse(this._body);
                } catch (e) {}
            }
        }
        return this._body;
    },
    set: function (body) {
        this._body = body;
        if (this.isJson && typeof this._body === 'string') {
            try {
                this._body = JSON.parse(this._body);
            } catch (e) {}
        }
        this._rawBody = null;
        this._unchunkedBody = null;
        this._parts = null;
    }
});

Object.defineProperty(Message.prototype, 'parts', {
    enumerable: true,
    set: function (parts) {
        this._parts = parts;
        this._body = null;
        this._rawBody = null;
        this._unchunkedBody = null;
    },
    get: function () {
        if (!this._parts && this.isMultipart) {
            var boundary = this.boundary || '',
                bodyAsString;
            if (typeof Buffer === 'function' && Buffer.isBuffer(this.body)) {
                bodyAsString = this.body.toString('ascii');
            } else {
                bodyAsString = this.body;
            }
            var boundaryRegExp = new RegExp('(^|\r\n?|\n\r?)--' + quoteRegExp(boundary) + '(--)?(?:\r\n?|\n\r?|$)', 'g'),
                startIndex = -1,
                parts = [],
                match;
            // TODO: Basic validation of end marker etc.
            while ((match = boundaryRegExp.exec(bodyAsString))) {
                var index = match.index;
                if (startIndex !== -1) {
                    parts.push(new Message(this.body.slice(startIndex, index)));
                }
                startIndex = index + match[0].length;
            }
            if (parts.length > 0) {
                this._parts = parts;
            }
        }
        return this._parts;
    }
});

Object.defineProperty(Message.prototype, 'fileName', {
    get: function () {
        return this.headers.parameter('Content-Disposition', 'filename') || (this.isMessyMail && this.headers.parameter('Content-Type', 'name'));
    },
    set: function (fileName) {
        if (!this.headers.has('Content-Disposition')) {
            this.headers.set('Content-Disposition', 'attachment');
        }
        this.headers.parameter('Content-Disposition', 'filename', fileName);
        if (this.isMessyMail && this.headers.has('Content-Type')) {
            this.headers.parameter('Content-Type', 'name', fileName);
        }
    }
});

function buffersEqual(a, b) {
    if (a === b) {
        return true;
    }

    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

function isNonBufferNonRegExpObject(obj) {
    return obj && typeof obj === 'object' && (typeof Buffer === 'undefined' || !Buffer.isBuffer(obj)) && !isRegExp(obj);
}

Message.prototype.clone = function () {
    return new Message({
        headers: this.headers.clone(),
        body: this.body // Not sure
    });
};

Message.prototype.serialize = function (maxLineLength, forceString) {
    if (typeof maxLineLength === 'undefined') {
        maxLineLength = 72;
    }
    var result = this.headers.toString(maxLineLength);
    if (typeof this.body !== 'undefined') {
        result += '\r\n';
        if (this.body && typeof this.body === 'object' && isNonBufferNonRegExpObject(this.body)) {
            result += JSON.stringify(this.body);
        } else {
            if (!forceString && this._bodyMustBeBuffer) {
                result = Buffer.concat([new Buffer(result), this.body]);
            } else {
                result += this.body;
            }
        }
    }
    return result;
};

Message.prototype.toString = function (maxLineLength) {
    return this.serialize(maxLineLength, true);
};

Message.prototype.equals = function (other) {
    return this === other || (
        this.headers.equals(other.headers) &&
        (this.body === other.body ||
        (typeof Buffer === 'function' && Buffer.isBuffer(this.body) && Buffer.isBuffer(other.body) && buffersEqual(this.body, other.body)))
    );
};

Message.prototype.hasEmptyBody = function () {
    if (typeof this.body === 'string') {
        return this.body.length === 0;
    } else if (typeof Buffer === 'function' && Buffer.isBuffer(this.body)) {
        return this.body.length === 0;
    } else if (this.body && typeof this.body === 'object') {
        return false;
    } else {
        return true;
    }
};

Message.prototype.toJSON = function () {
    var obj = {};
    if (this.headers.getNames().length > 0) {
        obj.headers = this.headers.toJSON();
    }
    bodyPropertyNames.some(function (bodyPropertyName) {
        var propertyValue = this['_' + bodyPropertyName];
        if (propertyValue !== null && typeof propertyValue !== 'undefined') { // An empty string is OK, but we use both null and undefined
            if (bodyPropertyName === 'parts') {
                propertyValue = propertyValue.map(function (part) {
                    return part.toJSON();
                });
            }
            obj[bodyPropertyName] = propertyValue;
            return true;
        }
    }, this);
    return obj;
};

module.exports = Message;
