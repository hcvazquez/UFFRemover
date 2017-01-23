/*global btoa*/
var Message = require('./Message'),
    RequestLine = require('./RequestLine'),
    util = require('util'),
    _ = require('underscore');

function HttpRequest(obj, doNotStringify) {
    this.requestLine = new RequestLine();
    this.encrypted = false;
    Message.call(this, obj);
}

HttpRequest.metadataPropertyNames = ['host', 'port', 'encrypted', 'cert', 'key', 'ca', 'rejectUnauthorized'];

HttpRequest.propertyNames = Message.propertyNames.concat(HttpRequest.metadataPropertyNames).concat(RequestLine.propertyNames).concat(['requestLine']);

util.inherits(HttpRequest, Message);

HttpRequest.prototype.isMessyHttpRequest = true;

HttpRequest.prototype.populate = function (obj) {
    if (obj && typeof obj === 'object' && (typeof Buffer === 'undefined' || !Buffer.isBuffer(obj))) {
        this.populateFromObject(obj);
    } else {
        Message.prototype.populate.call(this, obj);
    }
    return this;
};

HttpRequest.prototype.populateFromObject = function (obj) {
    Message.prototype.populateFromObject.call(this, obj);
    HttpRequest.metadataPropertyNames.forEach(function (metadataPropertyName) {
        if (typeof obj[metadataPropertyName] !== 'undefined') {
            this[metadataPropertyName] = obj[metadataPropertyName];
        }
    }, this);
    if (typeof obj.url === 'string') {
        var fragments = obj.url.split(' ');
        if (fragments.length > 1) {
            this.method = fragments.shift();
        }
        if (fragments.length > 0) {
            this._updateUrl(fragments[0]);
            obj = _.extend({}, obj);
            obj.url = this.path;
        }
        if (fragments.length > 1) {
            this.protocol = fragments[1];
        }
    }
    if (typeof obj.requestLine !== 'undefined') {
        this.requestLine.populate(obj.requestLine);
    }
    this.requestLine.populateFromObject(_.omit(obj, 'url'));
    return this;
};

function safeDecodeURIComponent(str) {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        // Assume URIError: URI malformed (percent encoded octets that don't decode as UTF-8)
        return str;
    }
}

HttpRequest.prototype.populateFromString = function (str) {
    var matchRequestLine = str.match(/^([^\r\n]*)(\r\n?|\n\r?|$)/);

    if (matchRequestLine) {
        Message.prototype.populateFromString.call(this, str.substr(matchRequestLine[0].length));
        var requestLineStr = matchRequestLine[1],
            requestLineFragments = requestLineStr.split(' ');
        if (requestLineFragments.length === 1) {
            requestLineFragments.unshift('GET');
        }
        if (requestLineFragments.length >= 2) {
            this.url = requestLineFragments[1];
            requestLineFragments[1] = this.requestLine.url;
        }
        requestLineStr = requestLineFragments.join(' ');
        this.requestLine.populateFromString(requestLineStr);
    }
    return this;
};

HttpRequest.prototype.populateFromBuffer = function (buffer) {
    var i = 0;
    while (i < buffer.length && buffer[i] !== 0x0d && buffer[i] !== 0x0a) {
        i += 1;
    }
    if (i > 0) {
        this.requestLine.populateFromString(buffer.slice(0, i).toString('ascii'));
    }
    if (buffer[i] === 0x0d) {
        i += 1;
    }
    if (buffer[i] === 0x0a) {
        i += 1;
    }
    Message.prototype.populateFromBuffer.call(this, buffer.slice(i));
    return this;
};

Object.defineProperty(HttpRequest.prototype, 'basicAuthCredentials', {
    get: function () {
        var authorizationHeaderValue = this.headers.get('Authorization');
        if (typeof authorizationHeaderValue === 'string') {
            var authorizationFragments = authorizationHeaderValue.split(' ');
            if (authorizationFragments.length === 2 && authorizationFragments[0] === 'Basic') {
                var credentials = new Buffer(authorizationFragments[1], 'base64').toString('utf-8').split(':'),
                    username = credentials.shift(),
                    password = credentials.join(':') || undefined;
                return {
                    username: username,
                    password: password
                };
            }
        }
    }
});

Object.defineProperty(HttpRequest.prototype, 'username', {
    get: function () {
        var basicAuthCredentials = this.basicAuthCredentials;
        return basicAuthCredentials && basicAuthCredentials.username;
    }
});

Object.defineProperty(HttpRequest.prototype, 'password', {
    get: function () {
        var basicAuthCredentials = this.basicAuthCredentials;
        return basicAuthCredentials && basicAuthCredentials.password;
    }
});

Object.defineProperty(HttpRequest.prototype, 'url', {
    get: function () {
        var host = this.host;
        if (host) {
            var port = this.port,
                encrypted = this.encrypted,
                basicAuthCredentials = this.basicAuthCredentials;
            return (
                'http' + (encrypted ? 's' : '') + '://' +
                (basicAuthCredentials ?
                    encodeURIComponent(basicAuthCredentials.username) +
                        (basicAuthCredentials.password ? ':' + encodeURIComponent(basicAuthCredentials.password) : '') + '@' :
                    ''
                ) +
                host +
                (typeof port === 'number' && port !== (encrypted ? 443 : 80) ? ':' + port : '') +
                (this.requestLine.url || '/')
            );
        } else {
            return this.requestLine.url || '/';
        }
    },
    set: function (url) {
        this.host = undefined;
        this.port = undefined;
        this._updateUrl(url, true);
    }
});

HttpRequest.prototype._updateUrl = function (url, invokedAsSetter) {
    var fragments = url.split(' ');
    if (fragments.length > 1) {
        this.method = fragments.shift();
    }
    if (fragments.length > 0) {
        var matchUrl = fragments[0].match(/^(https?:)\/\/(?:([^:@\/]+(?::[^@\/]+?))@)?((?:[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?\.)*[a-z][\-a-z]*[a-z]|(?:(?:[0-9]|1?[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|1?[0-9][0-9]|2[0-4][0-9]|25[0-5]))(:\d{1,5})?(\/[\w\-\.~%!$&'\(\)*+,;=:@\/]*(?:\?[\w\-\.~%!$&'\(\)*+,;=:@\/?]*)?(?:#[\w\-\.~%!$&'\(\)*+,;=:@\/?#]*)?)?$/);
        if (matchUrl) {
            var protocol = matchUrl[1],
                auth = matchUrl[2],
                host = matchUrl[3],
                port = matchUrl[4],
                path = matchUrl[5];
            if (!this.headers.has('Host')) {
                this.headers.set('Host', host + (port || ''));
            }
            if (typeof this.host !== 'undefined' && this.host !== host) {
                throw new Error('the host property and the url specify different hosts, ' + this.host + ' vs. ' + host);
            }
            this.host = host;
            if (typeof port !== 'undefined') {
                port = parseInt(port.substr(1), 10);
                if (typeof this.port !== 'undefined' && this.port !== port) {
                    throw new Error('the port property and the url specify different ports, ' + this.port + ' vs. ' + port);
                }
                this.port = port;
            } else if (typeof this.port === 'undefined') {
                if (protocol === 'https:') {
                    this.port = 443;
                } else {
                    this.port = 80;
                }
            }

            if (invokedAsSetter) {
                this.headers.remove('Authorization');
            }
            if (typeof auth === 'string' && auth.length > 0) {
                var authFragments = auth.split(':'),
                    username = safeDecodeURIComponent(authFragments.shift()),
                    password = safeDecodeURIComponent(authFragments.join(':'));
                this.headers.set('Authorization', 'Basic ' + (typeof Buffer !== 'undefined' ? new Buffer(username + ':' + password, 'utf-8').toString('base64') : btoa(auth)));
            }

            this.encrypted = protocol === 'https:';
            this.requestLine.url = path || '/';
        } else {
            this.requestLine.url = fragments[0] || '/';
        }
    }
    if (fragments.length >= 2) {
        this.protocol = fragments[2];
    }
};

HttpRequest.prototype.clone = function () {
    return new HttpRequest({
        requestLine: this.requestLine.clone(),
        headers: this.headers.clone(),
        body: this.body // Not sure
    });
};

HttpRequest.prototype.toString = function (maxLineLength) {
    return (
        this.requestLine.toString() + '\r\n' +
        Message.prototype.toString.call(this, maxLineLength)
    );
};

HttpRequest.prototype.equals = function (other) {
    return this === other || (
        other instanceof HttpRequest &&
        this.requestLine.equals(other.requestLine) &&
        Boolean(this.encrypted) === Boolean(other.encrypted) &&
        Message.prototype.equals.call(this, other)
    );
};

RequestLine.propertyNames.forEach(function (requestLinePropertyName) {
    if (requestLinePropertyName !== 'url') {
        Object.defineProperty(HttpRequest.prototype, requestLinePropertyName, {
            enumerable: true,
            get: function () {
                return this.requestLine[requestLinePropertyName];
            },
            set: function (value) {
                this.requestLine[requestLinePropertyName] = value;
            }
        });
    }
});

HttpRequest.prototype.toJSON = function () {
    return _.extend(Message.prototype.toJSON.call(this), this.requestLine.toJSON());
};

module.exports = HttpRequest;
