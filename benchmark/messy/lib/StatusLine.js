function StatusLine(obj) {
    this.populate(obj);
}

StatusLine.nonComputedPropertyNames = ['protocolName', 'protocolVersion', 'statusCode', 'statusMessage'];
StatusLine.propertyNames = ['protocol'].concat(StatusLine.nonComputedPropertyNames);

StatusLine.prototype.isMessyStatusLine = true;

StatusLine.prototype.populate = function (obj) {
    if (typeof obj === 'number') {
        this.populateFromObject({ statusCode: obj });
    } else if (typeof obj === 'string') {
        this.populateFromString(obj);
    } else if (obj && typeof obj === 'object' && !Buffer.isBuffer(obj)) {
        this.populateFromObject(obj);
    }
    return this;
};

StatusLine.prototype.populateFromObject = function (obj) {
    StatusLine.propertyNames.forEach(function (propertyName) {
        if (typeof obj[propertyName] !== 'undefined') {
            this[propertyName] = obj[propertyName];
        }
    }, this);
    return this;
};

StatusLine.prototype.populateFromString = function (str) {
    var statusLineFragments = str.split(/\s+/);
    if (statusLineFragments.length > 0) {
        this.populateProtocolFromString(statusLineFragments[0]);
    }
    if (statusLineFragments.length > 1) {
        this.statusCode = parseInt(statusLineFragments[1], 10);
    }
    if (statusLineFragments.length > 2) {
        this.statusMessage = statusLineFragments.slice(2).join(' ');
    }
    return this;
};

StatusLine.prototype.populateProtocolFromString = function (protocol) {
    if (protocol !== '') {
        var protocolFragments = protocol.split('/');
        if (protocolFragments.length === 2) {
            this.protocolName = protocolFragments[0];
            this.protocolVersion = protocolFragments[1];
        } else {
            throw new Error('Could not parse protocol: ' + protocol);
        }
    }
    return this;
};

Object.defineProperty(StatusLine.prototype, 'protocol', {
    enumerable: true,
    get: function () {
        var fragments = [];
        if (typeof this.protocolName !== 'undefined') {
            fragments.push(String(this.protocolName).toUpperCase());
        }
        if (typeof this.protocolVersion !== 'undefined') {
            fragments.push(this.protocolVersion);
        }
        if (fragments.length > 0) {
            return fragments.join('/');
        }
    },
    set: function (protocol) {
        this.populateProtocolFromString(protocol);
    }
});

StatusLine.prototype.clone = function () {
    return new StatusLine(this);
};

StatusLine.prototype.toString = function () {
    return this.protocol + ' ' + this.statusCode + ' ' + this.statusMessage;
};

StatusLine.prototype.equals = function (other) {
    return this === other || (
        other instanceof StatusLine &&
        this.protocolName === other.protocolName &&
        this.protocolVersion === other.protocolVersion &&
        this.statusCode === other.statusCode &&
        this.statusMessage === other.statusMessage
    );
};

StatusLine.prototype.toJSON = function () {
    var obj = {};
    StatusLine.nonComputedPropertyNames.forEach(function (propertyName) {
        if (typeof this[propertyName] !== 'undefined') {
            obj[propertyName] = this[propertyName];
        }
    }, this);
    return obj;
};

module.exports = StatusLine;
