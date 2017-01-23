/*global describe, it*/
var expect = require('unexpected'),
    HttpConversation = require('../lib/HttpConversation'),
    HttpExchange = require('../lib/HttpExchange'),
    HttpRequest = require('../lib/HttpRequest'),
    HttpResponse = require('../lib/HttpResponse');

describe('HttpConversation', function () {
    it('should accept an object with an exchanges property containing an array of objects containing an HttpRequest and HttpResponse instances', function () {
        var httpConversation = new HttpConversation({
            exchanges: [
                {
                    request: new HttpRequest('GET / HTTP/1.1\nFoo: Bar\n\nblah'),
                    response: new HttpResponse('HTTP/1.1 200 OK\nQuux: Baz\n\nblaf')
                }
            ]
        });

        expect(httpConversation.exchanges, 'to have items satisfying', 'to be an', HttpExchange);
        expect(
            httpConversation.toString(),
            'to equal',
            'GET / HTTP/1.1\r\nFoo: Bar\r\n\r\nblah\r\n\r\nHTTP/1.1 200 OK\r\nQuux: Baz\r\n\r\nblaf'
        );
    });

    it('should accept an object with an exchanges property containing array of objects containing request and response as strings', function () {
        var httpConversation = new HttpConversation({
            exchanges: [
                new HttpExchange({
                    request: 'GET / HTTP/1.1\nFoo: Bar\n\nblah',
                    response: 'HTTP/1.1 200 OK\nQuux: Baz\n\nblaf'
                })
            ]
        });
        expect(
            httpConversation.toString(),
            'to equal',
            'GET / HTTP/1.1\r\nFoo: Bar\r\n\r\nblah\r\n\r\nHTTP/1.1 200 OK\r\nQuux: Baz\r\n\r\nblaf'
        );
    });

    it('should accept an object with an exchanges property containing HttpRequest and HttpResponse options objects', function () {
        var httpConversation = new HttpConversation({
            exchanges: [
                {
                    request: {
                        requestLine: {
                            method: 'GET',
                            protocol: 'HTTP/1.1',
                            path: '/'
                        },
                        headers: {
                            'Content-Type': 'text/html'
                        },
                        body: 'The Body'
                    },
                    response: {
                        statusLine: 'HTTP/1.1 404 Not Found',
                        headers: 'Content-Type: application/json',
                        body: {foo: 123}
                    }
                }
            ]
        });
        expect(
            httpConversation.toString(),
            'to equal',
            'GET / HTTP/1.1\r\nContent-Type: text/html\r\n\r\nThe Body\r\n\r\nHTTP/1.1 404 Not Found\r\nContent-Type: application/json\r\n\r\n{"foo":123}'
        );
    });

    it('should consider identical instances equal', function () {
        var httpConversation1 = new HttpConversation({
            exchanges: [
                {
                    request: 'GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah',
                    response: {
                        statusLine: {
                            statusCode: 200,
                            protocol: 'HTTP/1.1',
                            statusMessage: 'OK'
                        },
                        body: 'blaf'
                    }
                }
            ]
        }), httpConversation2 = new HttpConversation({
            exchanges: [
                {
                    request: {
                        method: 'GET',
                        url: '/foo',
                        protocol: 'HTTP/1.1',
                        headers: {
                            host: 'foo.com'
                        },
                        body: 'blah'
                    },
                    response: 'HTTP/1.1 200 OK\r\n\r\nblaf'
                }
            ]
        });
        expect(httpConversation1.equals(httpConversation2), 'to be true');
        expect(httpConversation1.toString(), 'to equal', httpConversation2.toString());
    });

    it('should consider different instances unequal', function () {
        var httpConversation1 = new HttpConversation({
            exchanges: [
                {
                    request: 'GET /foo HTTP/1.0\r\nHost: foo.com\r\n\r\nblah',
                    response: {
                        statusLine: {
                            statusCode: 200,
                            protocol: 'HTTP/1.1',
                            statusMessage: 'OK'
                        },
                        body: 'blaf'
                    }
                }
            ]
        }), httpConversation2 = new HttpConversation({
            exchanges: [
                {
                    request: {
                        method: 'GET',
                        url: '/foo',
                        protocol: 'HTTP/1.1'
                    },
                    response: 'HTTP/1.1 200 OK\r\n\r\nblaf'
                }
            ]
        });
        expect(httpConversation1.equals(httpConversation2), 'to be false');
        expect(httpConversation1.toString(), 'not to equal', httpConversation2.toString());
    });

    describe('#toJSON', function () {
        it('should return an object with the exchanges JSONified', function () {
            expect(new HttpConversation({
                exchanges: [
                    {
                        request: new HttpRequest('GET / HTTP/1.1\nFoo: Bar\n\nblah'),
                        response: new HttpResponse('HTTP/1.1 200 OK\nQuux: Baz\n\nblaf')
                    },
                    {
                        request: new HttpRequest('GET /foo HTTP/1.1\nFoo: Barrr\n\nblahhh'),
                        response: new HttpResponse('HTTP/1.1 412 Precondition Failed\nQuux: Bazzz\n\nblafff')
                    }
                ]
            }).toJSON(), 'to equal', {
                exchanges: [
                    {
                        request: {
                            method: 'GET',
                            url: '/',
                            protocolName: 'HTTP',
                            protocolVersion: '1.1',
                            headers: {
                                Foo: 'Bar'
                            },
                            rawBody: 'blah'
                        },
                        response: {
                            statusCode: 200,
                            statusMessage: 'OK',
                            protocolName: 'HTTP',
                            protocolVersion: '1.1',
                            headers: {
                                Quux: 'Baz'
                            },
                            rawBody: 'blaf'
                        }
                    },
                    {
                        request: {
                            method: 'GET',
                            url: '/foo',
                            protocolName: 'HTTP',
                            protocolVersion: '1.1',
                            headers: {
                                Foo: 'Barrr'
                            },
                            rawBody: 'blahhh'
                        },
                        response: {
                            statusCode: 412,
                            statusMessage: 'Precondition Failed',
                            protocolName: 'HTTP',
                            protocolVersion: '1.1',
                            headers: {
                                Quux: 'Bazzz'
                            },
                            rawBody: 'blafff'
                        }
                    }
                ]
            });
        });
    });
});
