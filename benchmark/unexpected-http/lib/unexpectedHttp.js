/*global window, setTimeout, clearTimeout, Uint8Array*/
var http = require('http'),
    https = require('https'),
    messy = require('messy'),
    _ = require('underscore');

module.exports = {
    name: 'unexpected-http',
    installInto: function (expect) {
        expect
            .use(require('unexpected-messy'))
            .addAssertion([
                '<string|object> to yield [HTTP] response <any>',
                '<string|object> to yield [HTTP] response satisfying <any>'
            ], function (expect, subject, value) {
                var that = this;
                var context = {},
                    expectedResponseError;
                if (Object.prototype.toString.call(value) === '[object Error]' || value instanceof Error) {
                    expectedResponseError = value;
                } else if (typeof value === 'number') {
                    value = {statusCode: value};
                } else if (typeof value === 'string' || (typeof Buffer !== 'undefined' && Buffer.isBuffer(value))) {
                    value = {body: value};
                } else {
                    value = _.extend({}, value);
                    if (value.error) {
                        expectedResponseError = value.error;
                    }
                }

                return expect.promise(function (resolve, reject) {
                    var callbackCalled = false;
                    function handleError(err) {
                        if (!callbackCalled) {
                            callbackCalled = true;
                            if (expectedResponseError) {
                                try {
                                    expect(err, 'to equal', expectedResponseError);
                                } catch (e) {
                                    return reject(e);
                                }
                                resolve(context);
                            } else if (err.code) {
                                // Socket or DNS error
                                try {
                                    expect.fail({
                                        diff: function (output) {
                                            output.error(err.message);
                                            return { diff: output };
                                        },
                                        code: err.code
                                    });
                                } catch (e) {
                                    reject(e);
                                }
                            } else {
                                reject(err);
                            }
                        }
                    }
                    var requestOptions = {};
                    var requestTimeout = subject.timeout || 0;
                    var requestBody = subject.body;
                    var requestBodyIsJson = false;
                    var requestBodyIsStream = false;

                    if (Array.isArray(requestBody) || (requestBody && typeof requestBody === 'object' && (typeof Buffer === 'undefined' || !Buffer.isBuffer(requestBody)))) {
                        if (typeof requestBody.pipe === 'function') {
                            subject = _.omit(subject, 'body');
                            requestBodyIsStream = true;
                        } else {
                            requestBodyIsJson = true;
                        }
                    }

                    if (!subject.isMessyHttpRequest) {
                        subject = new messy.HttpRequest(subject);
                    }

                    var httpRequest = context.httpRequest = subject;
                    httpRequest.protocol = httpRequest.protocol || 'HTTP/1.1';
                    if (requestBodyIsJson) {
                        if (!httpRequest.headers.has('Content-Type')) {
                            httpRequest.headers.set('Content-Type', 'application/json');
                        }
                        httpRequest.body = JSON.stringify(httpRequest.body);
                    }
                    // Avoid using Transfer-Encoding: chunked for the request body as that confuses NGINX -- and we know the length
                    // of the request body:
                    if (!requestBodyIsStream && !httpRequest.headers.has('Content-Length')) {
                        var contentLength = 0;
                        if (httpRequest.unchunkedBody) {
                            contentLength = httpRequest.unchunkedBody.length;
                        }
                        httpRequest.headers.set('Content-Length', contentLength);
                    }

                    var headers = httpRequest.headers.toCanonicalObject();
                    Object.keys(headers).forEach(function (headerName) {
                        headers[headerName] = headers[headerName].join(', ');
                    });
                    _.extend(requestOptions, {
                        host: httpRequest.host || (typeof window === 'object' && typeof window.location !== 'undefined' ? window.location.hostname : 'localhost'),
                        port: httpRequest.port || (typeof window === 'object' && (typeof window.location !== 'undefined' ? window.location.port : window.location.protocol === 'https:' ? 443 : 80)) || (httpRequest.encrypted ? 443 : 80),
                        method: httpRequest.method,
                        path: httpRequest.path + (httpRequest.search || ''),
                        headers: headers,
                        mode: 'disable-fetch'
                    }, _.pick(subject, ['ca', 'cert', 'key', 'rejectUnauthorized']));

                    // set the protocol and scheme for HTTPS requests in the browser
                    if (typeof window === 'object' && httpRequest.encrypted) {
                        _.extend(requestOptions, {
                            scheme: 'https',
                            protocol: 'https:'
                        });
                    }

                    var timeout = null;
                    if (requestTimeout > 0) {
                        timeout = setTimeout(function () {
                            that.errorMode = 'nested';
                            try {
                                expect.fail('expected a response within {0} ms', requestTimeout);
                            } catch (e) {
                                return handleError(e);
                            }
                        }, requestTimeout);
                    }

                    var request = (httpRequest.encrypted ? https : http).request(requestOptions).on('response', function (response) {
                        if (callbackCalled) {
                            return;
                        }
                        var chunks = [];
                        response.on('data', function (chunk) {
                            chunks.push(chunk);
                        }).on('end', function () {
                            if (callbackCalled) {
                                return;
                            }
                            if (timeout) {
                                clearTimeout(timeout);
                            }

                            var body;
                            if (chunks.length > 0 && typeof Buffer !== 'undefined' && Buffer.isBuffer(chunks[0])) {
                                body = Buffer.concat(chunks);
                            } else if (chunks.length > 0 && chunks[0] instanceof Uint8Array) {
                                // Browserify: Make sure we end up with a Buffer instance:
                                if (chunks.length === 1) {
                                    body = new Buffer(chunks[0]);
                                } else {
                                    var totalLength = 0;
                                    var i;
                                    for (i = 0 ; i < chunks.length ; i += 1) {
                                        totalLength += chunks[i].length;
                                    }
                                    body = new Buffer(totalLength);
                                    var offset = 0;
                                    for (i = 0 ; i < chunks.length ; i += 1) {
                                        for (var j = 0 ; j < chunks[i].length ; j += 1) {
                                            body[offset] = chunks[i][j];
                                            offset += 1;
                                        }
                                    }
                                }
                            } else {
                                // String or no chunks
                                body = chunks.join('');
                            }
                            var httpResponse = context.httpResponse = new messy.HttpResponse({
                                statusCode: response.statusCode,
                                statusMessage: http.STATUS_CODES[response.statusCode],
                                protocol: 'HTTP/' + (response.httpVersionMajor || '1') + '.' + (response.httpVersionMinor || '1'),
                                headers: response.headers,
                                unchunkedBody: body
                            });
                            expect.promise(function () {
                                expect(expectedResponseError, 'to be undefined');
                                return expect(context.httpExchange = new messy.HttpExchange({
                                    request: httpRequest,
                                    response: httpResponse
                                }), 'to satisfy', {response: value});
                            }).caught(function (e) {
                                if (!callbackCalled) {
                                    callbackCalled = true;
                                    return reject(e);
                                }
                            }).then(function () {
                                if (!callbackCalled) {
                                    callbackCalled = true;
                                    resolve(context);
                                }
                            });
                        }).on('error', handleError);
                    }).on('error', handleError);

                    if (request.xhr) {
                        // In browserify: Make sure the response comes back as a Uint8Array
                        request.xhr.responseType = 'arraybuffer';
                    }

                    if (requestBodyIsStream) {
                        requestBody.pipe(request);
                        requestBody.on('error', handleError);
                    } else {
                        request.end(httpRequest.unchunkedBody);
                    }
                });
            });
    }
};

module.exports.messy = messy;
