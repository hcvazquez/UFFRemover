/*global describe, it, beforeEach, setTimeout*/
var unexpected = require('unexpected'),
    http = require('http'),
    semver = require('semver'),
    stream = require('stream');

describe('unexpected-http', function () {
    var expect = unexpected.clone()
        .use(require('../lib/unexpectedHttp'))
        .addAssertion('when delayed a little bit', function (expect, subject) {
            var that = this;
            return expect.promise(function (run) {
                setTimeout(run(function () {
                    return that.shift(expect, subject, 0);
                }), 1);
            });
        });

    expect.output.preferredWidth = 80;

    expect.output.installPlugin(require('magicpen-prism'));

    it('should do a basic request @integration', function () {
        return expect('GET http://www.gofish.dk/', 'to yield HTTP response satisfying', {
            headers: {
                'Content-Type': /text\/html/
            }
        });
    });

    it('should fail with a diff @integration', function () {
        return expect(
            expect('GET http://www.gofish.dk/', 'to yield HTTP response satisfying', {
                headers: {
                    'Content-Type': /text\/plain/
                }
            }),
            'when rejected',
            'to have message',
                /Content-Type: text\/html.*\/\/ should match \/text\\\/plain/
        );
    });

    var getaddrinfoError;
    // I do not know the exact version where this change was introduced. Hopefully this is enough to get
    // it working on Travis (0.10.36 presently):
    var nodeJsVersion = process.version.replace(/^v/, '');
    if (nodeJsVersion === '0.10.29') {
        getaddrinfoError = new Error('getaddrinfo EADDRINFO');
        getaddrinfoError.code = getaddrinfoError.errno = 'EADDRINFO';
    } else if (semver.satisfies(nodeJsVersion, '>=0.12.0')) {
        getaddrinfoError = new Error('getaddrinfo ENOTFOUND www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com');
        if (semver.satisfies(nodeJsVersion, '>=2.0.0')) {
            getaddrinfoError.message += ' www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com:80';
            getaddrinfoError.host = 'www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com';
            getaddrinfoError.port = 80;
        }
        getaddrinfoError.code = getaddrinfoError.errno = 'ENOTFOUND';
        getaddrinfoError.hostname = 'www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com';
    } else {
        getaddrinfoError = new Error('getaddrinfo ENOTFOUND');
        getaddrinfoError.code = getaddrinfoError.errno = 'ENOTFOUND';
    }
    getaddrinfoError.syscall = 'getaddrinfo';

    describe('with the expected response object containing an error property @integration', function () {
        it('should expect an error #2', function () {
            return expect(
                'GET http://www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com/',
                'to yield HTTP response satisfying',
                { error: getaddrinfoError }
            );
        });
    });

    describe('with the response property given as an error instance @integration', function () {
        it('should expect an error', function () {
            return expect(
                'GET http://www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com/',
                'to yield HTTP response satisfying',
                getaddrinfoError
            );
        });

        it('should fail with a diff if the request fails with an error that does not equal the expected error', function () {
            return expect(
                expect(
                    'GET http://www.veqwjioevjqwoevijqwokevijqwioevjkqwioevq.com/',
                    'to yield HTTP response satisfying',
                    new Error('foobar')
                ),
                'when rejected',
                'to have message', function (message) {
                    // The error varies a lot depending on the node.js version:
                    expect(message.replace(/Error\(\{[\s\S]*\}\)$/, 'Error(...)'), 'to equal',
                        "expected 'GET http://www.veqwjioevjqwoevijqwokevijqwioevjkqwioevq.com/'\n" +
                        "to yield HTTP response satisfying Error('foobar')\n" +
                        "\n" +
                        "Error(...)"
                    );
                }
            );
        });
    });

    it('should expect an error if the response is given as an error @integration', function () {
        var expectedError;
        // I do not know the exact version where this change was introduced. Hopefully this is enough to get
        // it working on Travis (0.10.36 presently):
        var nodeJsVersion = process.version.replace(/^v/, '');
        if (nodeJsVersion === '0.10.29') {
            expectedError = new Error('getaddrinfo EADDRINFO');
            expectedError.code = expectedError.errno = 'EADDRINFO';
        } else if (semver.satisfies(nodeJsVersion, '>=0.12.0')) {
            expectedError = new Error('getaddrinfo ENOTFOUND www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com');
            if (semver.satisfies(nodeJsVersion, '>=2.0.0')) {
                expectedError.message += ' www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com:80';
                expectedError.host = 'www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com';
                expectedError.port = 80;
            }
            expectedError.code = expectedError.errno = 'ENOTFOUND';
            expectedError.hostname = 'www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com';
        } else {
            expectedError = new Error('getaddrinfo ENOTFOUND');
            expectedError.code = expectedError.errno = 'ENOTFOUND';
        }
        expectedError.syscall = 'getaddrinfo';
        return expect(
            'GET http://www.icwqjecoiqwjecoiwqjecoiwqjceoiwq.com/',
            'to yield HTTP response satisfying',
            expectedError
        );
    });

    it('should reject with an actual UnexpectedError mentioning the error code when an unexpected socket error is encountered', function () {
        return expect(
            expect(
                'GET http://www.veqwjioevjqwoevijqwokevijqwioevjkqwioevq.com/',
                'to yield HTTP response satisfying',
                {}
            ),
            'when rejected',
            'to have message', /getaddrinfo/
        );
    });

    describe('with a local test server', function () {
        var handleRequest,
            serverHostname,
            serverAddress,
            serverUrl;
        beforeEach(function () {
            handleRequest = undefined;
            var server = http.createServer(function (req, res, next) {
                res.sendDate = false;
                handleRequest(req, res, next);
            }).listen(0);
            serverAddress = server.address();
            serverHostname = serverAddress.address === '::' ? 'localhost' : serverAddress.address;
            serverUrl = 'http://' + serverHostname + ':' + serverAddress.port + '/';
        });

        describe('within a timeout', function () {
            beforeEach(function () {
                handleRequest = function (req, res, next) {
                    setTimeout(function () {
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('foobar');
                    }, 3);
                };
            });
            it('should not fail if its within the timeframe', function () {
                return expect({
                    url: serverUrl,
                    timeout: 20
                }, 'to yield HTTP response satisfying', 'foobar');
            });
            it('should fail if it is not within the timeframe', function () {
                return expect(
                    expect({
                        url: serverUrl,
                        timeout: 1
                    }, 'to yield HTTP response satisfying', 'foobar'),
                    'when rejected', 'to have message',
                        "expected { url: 'http://" + serverHostname + ":" + serverAddress.port + "/', timeout: 1 }\n" +
                        "to yield HTTP response satisfying 'foobar'\n" +
                        "  expected a response within 1 ms"
                );
            });
        });

        describe('with a JSON response', function () {
            beforeEach(function () {
                handleRequest = function (req, res, next) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end('{"foo": 123}');
                };
            });

            it('should succeed', function () {
                return expect('GET ' + serverUrl, 'to yield HTTP response satisfying', {
                    body: {
                        foo: 123
                    }
                });
            });

            it('should fail with a diff', function () {
                return expect(
                    expect('GET ' + serverUrl, 'to yield HTTP response satisfying', {
                        body: {
                            foo: 456
                        }
                    }),
                    'when rejected',
                    'to have message', function (message) {
                        expect(message.replace(/^\s*Connection:.*\n/m, '').replace(/\n\s*Content-Length:.*$|\s*Content-Length:.*\n/mg, '').replace(/\n\s*Transfer-Encoding:.*$|\s*Transfer-Encoding:.*\n/mg, ''), 'to equal',
                            "expected 'GET " + serverUrl + "'\n" +
                            "to yield HTTP response satisfying { body: { foo: 456 } }\n" +
                            '\n' +
                            'GET / HTTP/1.1\n' +
                            'Host: ' + serverHostname + ':' + serverAddress.port + '\n' +
                            '\n' +
                            'HTTP/1.1 200 OK\n' +
                            'Content-Type: application/json\n' +
                            '\n' +
                            '{\n' +
                            '  foo: 123 // should equal 456\n' +
                            '}'
                        );
                    }
                );
            });

            describe('with an expectation that requires async work', function () {
                it('should succeed', function () {
                    return expect('GET ' + serverUrl, 'to yield HTTP response satisfying', {
                        body: {
                            foo: expect.it('when delayed a little bit', 'to equal', 123)
                        }
                    });
                });

                it('should fail with a diff', function () {
                    return expect(
                        expect('GET ' + serverUrl, 'to yield HTTP response satisfying', {
                            body: {
                                foo: expect.it('when delayed a little bit', 'to equal', 456)
                            }
                        }),
                        'when rejected',
                        'to have message', function (message) {
                            expect(message.replace(/^\s*Connection:.*\n/m, '').replace(/\n\s*Content-Length:.*$|\s*Content-Length:.*\n/mg, '').replace(/\n\s*Transfer-Encoding:.*$|\s*Transfer-Encoding:.*\n/mg, ''), 'to equal',
                                "expected 'GET " + serverUrl + "'\n" +
                                "to yield HTTP response satisfying { body: { foo: expect.it('when delayed a little bit', 'to equal', 456) } }\n" +
                                '\n' +
                                'GET / HTTP/1.1\n' +
                                'Host: ' + serverHostname + ':' + serverAddress.port + '\n' +
                                '\n' +
                                'HTTP/1.1 200 OK\n' +
                                'Content-Type: application/json\n' +
                                '\n' +
                                '{\n' +
                                '  foo: 123 // expected: when delayed a little bit to equal 456\n' +
                                '}'
                            );
                        }
                    );
                });
            });

            it('should send the correct Authorization header when specified in the headers object', function () {
                var authorizationHeader;
                handleRequest = function (req, res, next) {
                    authorizationHeader = req.headers.authorization;
                    res.end();
                };
                return expect({
                    url: 'GET ' + serverUrl,
                    headers: {
                        Authorization: 'foobar'
                    }
                }, 'to yield HTTP response satisfying', 200).then(function () {
                    expect(authorizationHeader, 'to equal', 'foobar');
                });
            });

            it('should send the correct Authorization header when the credentials are specified in the url', function () {
                var authorizationHeader;
                handleRequest = function (req, res, next) {
                    authorizationHeader = req.headers.authorization;
                    res.end();
                };
                return expect({
                    url: 'GET http://foobar:quux@' + serverHostname + ':' + serverAddress.port + '/'
                }, 'to yield HTTP response satisfying', 200).then(function () {
                    expect(authorizationHeader, 'to equal', 'Basic Zm9vYmFyOnF1dXg=');
                });
            });
        });

        describe('with a request body stream', function () {
            beforeEach(function () {
                handleRequest = function (req, res, next) {
                    req.pipe(res);
                };
            });

            it('should succeed', function () {
                var responseBodyStream = new stream.Readable();
                responseBodyStream._read = function (num, cb) {
                    responseBodyStream._read = function () {};
                    setTimeout(function () {
                        responseBodyStream.push('foobar');
                        responseBodyStream.push(null);
                    }, 0);
                };

                return expect({
                    url: 'PUT ' + serverUrl,
                    body: responseBodyStream
                }, 'to yield HTTP response satisfying', {
                    body: new Buffer('foobar', 'utf-8')
                });
            });

            it('should fail if there was an error on the stream', function () {
                var erroringStream = new stream.Readable();
                erroringStream._read = function (num, cb) {
                    setTimeout(function () {
                        erroringStream.emit('error', new Error('Fake error'));
                    }, 0);
                };

                return expect({
                    url: 'PUT ' + serverUrl,
                    body: erroringStream
                }, 'to yield HTTP response satisfying', new Error('Fake error'));
            });
        });
    });
});
