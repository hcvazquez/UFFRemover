/*global describe, it*/
var expect = require('unexpected'),
    HttpRequest = require('../lib/HttpRequest');

describe('HttpRequest', function () {
    it('should parse a standalone request line', function () {
        var httpRequest = new HttpRequest('GET /foo HTTP/1.1');
        expect(httpRequest.method, 'to equal', 'GET');
        expect(httpRequest.url, 'to equal', '/foo');
        expect(httpRequest.protocol, 'to equal', 'HTTP/1.1');
        expect(httpRequest.toString(), 'to equal', 'GET /foo HTTP/1.1\r\n');
    });

    it('should add a leading slash to the request url if not specified', function () {
        var httpRequest = new HttpRequest('GET foo');
        expect(httpRequest.method, 'to equal', 'GET');
        expect(httpRequest.url, 'to equal', '/foo');
    });

    it('should parse a request url with a query string', function () {
        var httpRequest = new HttpRequest({ url: 'GET /foo?quux=baz' });
        expect(httpRequest.requestLine.url, 'to equal', '/foo?quux=baz');
    });

    it('should parse a request line followed by headers', function () {
        var httpRequest = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n');
        expect(httpRequest.url, 'to equal', '/foo');
        expect(httpRequest.toString(), 'to equal', 'GET /foo HTTP/1.1\r\nHost: foo.com\r\n');
    });

    it('should parse a request line followed by headers and a body', function () {
        var httpRequest = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah');
        expect(httpRequest.url, 'to equal', '/foo');
        expect(httpRequest.body, 'to equal', 'blah');
        expect(httpRequest.toString(), 'to equal', 'GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah');
    });

    it('should accept encrypted as a parameter to the constructor', function () {
        expect(new HttpRequest({encrypted: true}), 'to have properties', {encrypted: true});
    });

    it('should accept the request line as an option to the constructor', function () {
        expect(new HttpRequest({requestLine: 'GET /foo HTTP/1.1'}), 'to have properties', {
            method: 'GET',
            url: '/foo',
            protocol: 'HTTP/1.1'
        });
    });

    it('should parse a partial request line', function () {
        expect(new HttpRequest('GET /foo'), 'to have properties', {
            method: 'GET',
            url: '/foo'
        });
    });

    it('should only include CRLFCRLF when there are no headers', function () {
        expect(new HttpRequest({
            requestLine: 'GET / HTTP/1.1',
            body: 'foo'
        }).toString(), 'to equal', 'GET / HTTP/1.1\r\n\r\nfoo');
    });

    it('should make the request line available', function () {
        expect(new HttpRequest({
            method: 'GET',
            url: '/foo',
            protocol: 'HTTP/1.1'
        }).requestLine.toString(), 'to equal', 'GET /foo HTTP/1.1');
    });

    it('should allow updating the request line via a setter', function () {
        var httpRequest = new HttpRequest({
            method: 'GET',
            url: '/foo',
            protocol: 'HTTP/1.1'
        });
        httpRequest.requestLine.populateFromString('PUT /bar HTTP/1.0');
        expect(httpRequest, 'to have properties', {
            method: 'PUT',
            url: '/bar',
            protocol: 'HTTP/1.0'
        });
    });

    it('should make the protocol version available as a getter', function () {
        expect(new HttpRequest('GET /foo HTTP/1.1').protocolVersion, 'to equal', '1.1');
    });

    it('should make the protocol name available as a getter', function () {
        expect(new HttpRequest('GET /foo HTTP/1.1').protocolName, 'to equal', 'HTTP');
    });

    it('should make the components of the request url available as individual getters', function () {
        expect(new HttpRequest('GET /foo?foo=bar HTTP/1.1'), 'to have properties', {
            path: '/foo',
            search: '?foo=bar',
            query: 'foo=bar'
        });
    });

    it('should make path, query, and search available as individual setters', function () {
        var httpRequest = new HttpRequest('GET /foo?foo=bar HTTP/1.1');
        httpRequest.search = '?blabla';
        httpRequest.path = '/bla';
        expect(httpRequest.url, 'to equal', '/bla?blabla');
        httpRequest.query = 'foobar';
        expect(httpRequest.url, 'to equal', '/bla?foobar');
    });

    it('should accept the individual request line fields as options to the constructor', function () {
        expect(new HttpRequest({
            method: 'get',
            url: '/foo',
            protocol: 'http/1.1'
        }).requestLine.toString(), 'to equal', 'GET /foo HTTP/1.1');
    });

    it('should consider an identical instance equal', function () {
        var httpRequest1 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah'),
            httpRequest2 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah');
        expect(httpRequest1.equals(httpRequest2), 'to be true');
    });

    it('should consider two instances unequal if they differ by method', function () {
        var httpRequest1 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah'),
            httpRequest2 = new HttpRequest('POST /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah');
        expect(httpRequest1.equals(httpRequest2), 'to be false');
    });

    it('should consider two instances unequal if they differ by url', function () {
        var httpRequest1 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah'),
            httpRequest2 = new HttpRequest('GET /bar HTTP/1.1\r\nHost: foo.com\r\n\r\nblah');
        expect(httpRequest1.equals(httpRequest2), 'to be false');
    });

    it('should consider two instances unequal if they differ by protocol', function () {
        var httpRequest1 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah'),
            httpRequest2 = new HttpRequest('GET /foo HTTP/1.0\r\nHost: foo.com\r\n\r\nblah');
        expect(httpRequest1.equals(httpRequest2), 'to be false');
    });

    it('should consider two instances unequal if their headers differ', function () {
        var httpRequest1 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah'),
            httpRequest2 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: bar.com\r\n\r\nblah');
        expect(httpRequest1.equals(httpRequest2), 'to be false');
    });

    it('should consider two instances unequal if their bodies differ', function () {
        var httpRequest1 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: foo.com\r\n\r\nblah'),
            httpRequest2 = new HttpRequest('GET /foo HTTP/1.1\r\nHost: bar.com\r\n\r\nquux');
        expect(httpRequest1.equals(httpRequest2), 'to be false');
    });

    it('should consider instances with different encrypted flags different', function () {
        var httpRequest1 = new HttpRequest({encrypted: true}),
            httpRequest2 = new HttpRequest({encrypted: false});
        expect(httpRequest1.equals(httpRequest2), 'to be false');
    });

    it('should parse a buffer', function () {
        var rawSrc =
            'POST / HTTP/1.1\r\n' +
            'Date: Sat, 21 Mar 2015 00:25:45 GMT\r\n' +
            'Connection: keep-alive\r\n' +
            '\r\n' +
            'blah';

        var httpRequest = new HttpRequest(new Buffer(rawSrc, 'ascii'));

        expect(httpRequest.toString(), 'to equal', rawSrc);
    });

    describe('without a verb in the request line', function () {
        it('should assume GET', function () {
            expect(new HttpRequest('/foo'), 'to satisfy', {
                method: 'GET',
                path: '/foo'
            });
        });
    });

    it('should accept host and port as options', function () {
        expect(new HttpRequest({ host: 'foo.com', port: 987 }), 'to have properties', {
            host: 'foo.com',
            port: 987
        });
    });

    it('should leave host and port as undefined when not given', function () {
        expect(new HttpRequest('GET /').port, 'to be undefined');
    });

    describe('#url', function () {
        it('should include the schema, host, port, path, and search if available', function () {
            expect(new HttpRequest('GET https://localhost:3000/foo?bar=quux').url, 'to equal', 'https://localhost:3000/foo?bar=quux');
        });

        it('should include the default http port explicitly', function () {
            expect(new HttpRequest('GET http://localhost/').url, 'to equal', 'http://localhost/');
        });

        it('should include the default https port explicitly', function () {
            expect(new HttpRequest('GET https://localhost/').url, 'to equal', 'https://localhost/');
        });

        it('should include the username and password if available', function () {
            expect(new HttpRequest('GET http://foo:bar@localhost:3000/').url, 'to equal', 'http://foo:bar@localhost:3000/');
        });

        describe('invoked as a setter', function () {
            it('should update the encrypted, host, port, path, and search properties', function () {
                var httpRequest = new HttpRequest('GET http://foo:bar@localhost:3000/yes/?i=am');
                expect(httpRequest.headers.getAll('Authorization'), 'to equal', [ 'Basic Zm9vOmJhcg==' ]);
                expect(httpRequest, 'to have property', 'encrypted', false);
                httpRequest.url = 'http://baz:quux@localhost:9876/no/not/?so=much';
                expect(httpRequest.url, 'to equal', 'http://baz:quux@localhost:9876/no/not/?so=much');
                expect(httpRequest.headers.getAll('Authorization'), 'to equal', [ 'Basic YmF6OnF1dXg=' ]);
                expect(httpRequest, 'to have property', 'encrypted', false);
            });

            it('should remove an existing Authorization header if the new url does not have credentials', function () {
                var httpRequest = new HttpRequest('GET http://foo:bar@localhost:3000/yes/?i=am');
                httpRequest.url = 'http://localhost:9876/no/not/?so=much';
                expect(httpRequest.headers.getAll('Authorization'), 'to equal', undefined);
            });
        });
    });

    describe('with a url passed in the request line', function () {
        it('should support a localhost url', function () {
            var httpRequest = new HttpRequest('GET http://localhost:3000/');
            expect(httpRequest.headers.get('Host'), 'to equal', 'localhost:3000');
            expect(httpRequest.host, 'to equal', 'localhost');
            expect(httpRequest.port, 'to equal', 3000);
        });

        it('should allow passing the same host in the host property and in the url', function () {
            var httpRequest = new HttpRequest({ url: 'GET http://localhost:3000/', host: 'localhost' });
            expect(httpRequest.host, 'to equal', 'localhost');
        });

        it('should throw if different hosts are passed in the host property and in the url', function () {
            expect(function () {
                new HttpRequest({ url: 'GET http://blabla.com:3000/', host: 'localhost' });
            }, 'to throw', 'the host property and the url specify different hosts, localhost vs. blabla.com');
        });

        it('should allow passing the same port in the port property and in the url', function () {
            var httpRequest = new HttpRequest({ url: 'GET http://localhost:3000/', port: 3000 });
            expect(httpRequest.port, 'to equal', 3000);
        });

        it('should throw if different ports are passed in the port property and in the url', function () {
            expect(function () {
                new HttpRequest({ url: 'GET http://blabla.com:3000/', port: 3020 });
            }, 'to throw', 'the port property and the url specify different ports, 3020 vs. 3000');
        });

        it('should support a url with an IP address', function () {
            var httpRequest = new HttpRequest('GET http://99.88.77.66/');
            expect(httpRequest.headers.get('Host'), 'to equal', '99.88.77.66');
            expect(httpRequest.host, 'to equal', '99.88.77.66');
        });

        it('should set the Host header', function () {
            var httpRequest = new HttpRequest('GET http://foo.com/');
            expect(httpRequest.headers.get('Host'), 'to equal', 'foo.com');
        });

        it('should set the host property', function () {
            expect(new HttpRequest('GET http://foo.com/').host, 'to equal', 'foo.com');
        });

        it('should set the port property when explicitly given', function () {
            expect(new HttpRequest('GET http://foo.com:987/').port, 'to equal', 987);
        });

        it('should set the port property to 80 when http', function () {
            expect(new HttpRequest('GET http://foo.com/').port, 'to equal', 80);
        });

        it('should set the port property to 443 when https', function () {
            expect(new HttpRequest('GET https://foo.com/').port, 'to equal', 443);
        });

        it('should set the path', function () {
            expect(new HttpRequest('GET http://foo.com/heythere/you').path, 'to equal', '/heythere/you');
        });

        it('should set the Host header and include the port if given', function () {
            expect(new HttpRequest('GET http://foo.com:987/').headers.get('Host'), 'to equal', 'foo.com:987');
        });

        it('should not overwrite an explicit Host header', function () {
            expect(new HttpRequest('GET http://foo.com/\r\nHost: bar.com').headers.getAll('Host'), 'to equal', [ 'bar.com' ]);
        });

        it('should still set the host property when there is an explicit Host header', function () {
            expect(new HttpRequest('GET http://foo.com/\r\nHost: bar.com'), 'to have property', 'host', 'foo.com');
        });

        it('should set the "encrypted" property if the protocol is https', function () {
            expect(new HttpRequest('GET https://foo.com/'), 'to satisfy', { encrypted: true });
        });

        it('should not set the "encrypted" property if the protocol is http', function () {
            expect(new HttpRequest('GET http://foo.com/'), 'to satisfy', { encrypted: expect.it('to be falsy') });
        });

        describe('with credentials passed in the url', function () {
            it('should set the Authorization header', function () {
                expect(
                    new HttpRequest('GET https://foo:bar@foo.com/').headers.get('Authorization'),
                    'to equal',
                    'Basic Zm9vOmJhcg=='
                );
            });

            it.skip('should not overwrite an existing Authorization header', function () {
                expect(
                    new HttpRequest({
                        url: 'GET https://foo:bar@foo.com/',
                        headers: {
                            Authorization: 'foobar'
                        }
                    }).headers.get('Authorization'),
                    'to equal',
                    'foobar'
                );
            });

            it('should support percent-encoded octets, including colons, and a non-encoded colon in the password', function () {
                expect(
                    new HttpRequest('GET http://fo%C3%A6o%25bar:baz%25quux:yadda@localhost:4232/').headers.get('Authorization'),
                    'to equal',
                    'Basic Zm/Dpm8lYmFyOmJheiVxdXV4OnlhZGRh'
                );
            });

            it('should leave all percent encoded octets in the username if one of them does not decode as UTF-8', function () {
                expect(
                    new HttpRequest('http://fo%C3%A6o%25bar%C3:baz%C3%A6quux:yadda@localhost:4232/').headers.get('Authorization'),
                    'to equal',
                    'Basic Zm8lQzMlQTZvJTI1YmFyJUMzOmJhesOmcXV1eDp5YWRkYQ=='
                );
            });
        });
    });

    describe('with a url passed in an options object', function () {
        it('should set the Host header', function () {
            var httpRequest = new HttpRequest({ url: 'GET http://foo.com/' });
            expect(httpRequest.headers.get('Host'), 'to equal', 'foo.com');
        });

        it('should set the host property', function () {
            expect(new HttpRequest({ url: 'GET http://foo.com/' }).host, 'to equal', 'foo.com');
        });

        it('should set the port property when explicitly given', function () {
            expect(new HttpRequest({ url: 'GET http://foo.com:987/' }).port, 'to equal', 987);
        });

        it('should set the port property to 80 when http', function () {
            expect(new HttpRequest({ url: 'GET http://foo.com/' }).port, 'to equal', 80);
        });

        it('should set the port property to 443 when https', function () {
            expect(new HttpRequest({ url: 'GET https://foo.com/' }).port, 'to equal', 443);
        });

        it('should set the path', function () {
            expect(new HttpRequest({ url: 'GET http://foo.com/heythere/you' }).path, 'to equal', '/heythere/you');
        });

        it('should set the Host header and include the port if given', function () {
            var httpRequest = new HttpRequest({ url: 'GET http://foo.com:987/' });
            expect(httpRequest.headers.get('Host'), 'to equal', 'foo.com:987');
        });

        it('should not overwrite an explicit Host header', function () {
            var httpRequest = new HttpRequest({ url: 'GET http://foo.com/', headers: { Host: 'bar.com' } });
            expect(httpRequest.headers.get('Host'), 'to equal', 'bar.com');
        });

        it('should set the "encrypted" property if the protocol is https', function () {
            expect(new HttpRequest({ url: 'GET https://foo.com/' }), 'to satisfy', { encrypted: true });
        });

        it('should not set the "encrypted" property if the protocol is http', function () {
            expect(new HttpRequest({ url: 'GET http://foo.com/' }), 'to satisfy', { encrypted: expect.it('to be falsy') });
        });

        it('should set the Authorization header if credentials are passed in the url', function () {
            var httpRequest = new HttpRequest({ url: 'GET https://foo:bar@foo.com/' });
            expect(httpRequest.headers.get('Authorization'), 'to equal', 'Basic Zm9vOmJhcg==');
        });

        it('should keep the Authorization header when no credentials are passed in the url', function () {
            var httpRequest = new HttpRequest({ url: 'GET http://localhost:36033/', headers: { Authorization: 'foobar' } } );
            expect(httpRequest.headers.get('Authorization'), 'to equal', 'foobar');
        });
    });

    describe('#toJSON', function () {
        it('should include the messy.Message properties and put the requestLine properties at the top level', function () {
            expect(new HttpRequest('GET / HTTP/1.1\r\nFoo: bar\r\n\r\nblabla').toJSON(), 'to equal', {
                method: 'GET',
                url: '/',
                protocolName: 'HTTP',
                protocolVersion: '1.1',
                headers: {
                    Foo: 'bar'
                },
                rawBody: 'blabla'
            });
        });
    });
});
