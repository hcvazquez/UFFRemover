function RequestLine(obj) {
    this.populate(obj);
}

RequestLine.nonComputedPropertyNames = ['method', 'url', 'protocolName', 'protocolVersion'];
RequestLine.propertyNames = ['protocol', 'path', 'search', 'query'].concat(RequestLine.nonComputedPropertyNames);

RequestLine.prototype.isMessyRequestLine = true;

RequestLine.prototype.populate = function (obj) {
    if (obj && typeof obj === 'object' && !Buffer.isBuffer(obj)) {
        this.populateFromObject(obj);
    } else if (typeof obj === 'string') {
        this.populateFromString(obj);
    }
    return this;
};

RequestLine.prototype.populateFromObject = function (obj) {
    RequestLine.propertyNames.forEach(function (propertyName) {
        if (typeof obj[propertyName] !== 'undefined') {
            this[propertyName] = obj[propertyName];
        }
    }, this);
    return this;
};

RequestLine.prototype.populateProtocolFromString = function (str) {
    if (str !== '') {
        var protocolFragments = str.split('/');
        if (protocolFragments.length === 2) {
            this.protocolName = protocolFragments[0];
            this.protocolVersion = protocolFragments[1];
        } else {
            throw new Error('Could not parse protocol: ' + str);
        }
    }
    return this;
};

RequestLine.prototype.populateFromString = function (str) {
    if (str !== '') {
        var requestLineFragments = str.split(/\s+/);
        if (requestLineFragments.length > 3) {
            throw new Error('Could not parse request line: ' + str);
        } else {
            if (requestLineFragments.length > 0) {
                this.method = requestLineFragments[0].toUpperCase();
            }
            if (requestLineFragments.length > 1) {
                this.url = requestLineFragments[1];
            }
            if (requestLineFragments.length > 2) {
                this.populateProtocolFromString(requestLineFragments[2]);
            }
        }
    }
    return this;
};

RequestLine.prototype.populateUrlFromString = function (url) {
    var matchUrl = url.match(/^([^?]*)(\?.*)?$/);
    this.path = matchUrl[1] ? matchUrl[1].replace(/^\/?/, '/') : '/';
    this.search = matchUrl[2] || undefined;
    return this;
};

Object.defineProperty(RequestLine.prototype, 'protocol', {
    enumerable: true,
    get: function () {
        var fragments = [];
        if (typeof this.protocolName !== 'undefined') {
            fragments.push(String(this.protocolName).toUpperCase());
        }
        if (typeof this.protocolVersion !== 'undefined') {
            fragments.push('/' + this.protocolVersion);
        }
        if (fragments.length > 0) {
            return fragments.join('');
        }
    },
    set: function (protocol) {
        this.populateProtocolFromString(protocol);
    }
});

Object.defineProperty(RequestLine.prototype, 'url', {
    enumerable: true,
    get: function () {
        return (this.path || '') + (this.search || '');
    },
    set: function (url) {
        this.populateUrlFromString(url);
    }
});

Object.defineProperty(RequestLine.prototype, 'query', {
    enumerable: true,
    get: function () {
        return typeof this.search === 'undefined' ? undefined : String(this.search).replace(/^\?/, '');
    },
    set: function (query) {
        this.url = this.url.replace(/(?:\?.*)?$/, typeof query === 'undefined' ? '' : '?' + String(query));
    }
});

RequestLine.prototype.clone = function () {
    return new RequestLine(this);
};

RequestLine.prototype.toString = function (maxLineLength) {
    return String(this.method).toUpperCase() + (typeof this.url === 'string' ? ' ' + this.url + (typeof this.protocol === 'string' ? ' ' + this.protocol : '') : '');
};

RequestLine.prototype.equals = function (other) {
    return this === other || (
        other instanceof RequestLine &&
        this.method === other.method &&
        (this.path || '') === (other.path || '') &&
        (this.search || '') === (other.search || '') &&
        this.protocolName === other.protocolName &&
        this.protocolVersion === other.protocolVersion
    );
};

RequestLine.prototype.toJSON = function () {
    var obj = {};
    RequestLine.nonComputedPropertyNames.forEach(function (propertyName) {
        if (typeof this[propertyName] !== 'undefined') {
            obj[propertyName] = this[propertyName];
        }
    }, this);
    return obj;
};

module.exports = RequestLine;
