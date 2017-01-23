/*global describe, it, setTimeout*/
var messy = require('messy'),
    Headers = messy.Headers,
    Message = messy.Message,
    RequestLine = messy.RequestLine,
    HttpRequest = messy.HttpRequest,
    StatusLine = messy.StatusLine,
    HttpResponse = messy.HttpResponse,
    HttpExchange = messy.HttpExchange,
    HttpConversation = messy.HttpConversation,
    unexpected = require('unexpected');

describe('unexpected-messy', function () {
    var expect = unexpected.clone()
        .installPlugin(require('../lib/unexpectedMessy'))
        .addAssertion('<array> to produce a diff of <string>', function (expect, subject, value) {
            expect.errorMode = 'bubble';
            expect(expect.diff(
                subject[0],
                subject[1]
            ).toString(), 'to equal', value);
        })
        .addAssertion('<any> to inspect as <string>', function (expect, subject, value) {
            expect.errorMode = 'bubble';
            expect(expect.inspect(subject).toString(), 'to equal', value);
        })
        .addAssertion('<any> when delayed a little bit <assertion>', function (expect, subject) {
            var that = this;
            return expect.promise(function (run) {
                setTimeout(run(function () {
                    return that.shift(expect, subject, 0);
                }), 1);
            });
        })
        .addAssertion('<Error> 2 have message <string>', function (expect, subject, value) {
            expect.errorMode = 'nested';
            expect(subject._isUnexpected ? subject.output.toString() : subject.message, 'to equal', value);
        });


    expect.output.preferredWidth = 80;

    it('should inspect objects as blocks', function () {
        expect({
            headers: new Headers({foo: 'quux', baz: 'bar'}),
            message: new Message('Content-Type: application/json\n\n{"foo":123}'),
            httpRequest: new HttpRequest({requestLine: 'GET / HTTP/1.1', headers: {bar: 'baz'}, body: 'foo'}),
            httpResponse: new HttpResponse({statusLine: 'HTTP/1.1 200 OK', headers: {bar: 'baz'}, body: 'foo'}),
            httpExchange: new HttpExchange({
                request: 'GET / HTTP/1.1\r\nContent-Type: application/json\r\n\r\n{"foo":"bar"}',
                response: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'
            }),
            httpConversation: new HttpConversation({
                exchanges: [
                    {
                        request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                        response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                    }
                ]
            })
        }, 'to inspect as',
            "{\n" +
            "  headers:\n" +
            "    Foo: quux\n" +
            "    Baz: bar,\n" +
            "  message:\n" +
            "    Content-Type: application/json\n" +
            "\n" +
            "    { foo: 123 },\n" +
            "  httpRequest:\n" +
            "    GET / HTTP/1.1\n" +
            "    Bar: baz\n" +
            "\n" +
            "    foo,\n" +
            "  httpResponse:\n" +
            "    HTTP/1.1 200 OK\n" +
            "    Bar: baz\n" +
            "\n" +
            "    foo,\n" +
            "  httpExchange:\n" +
            "    GET / HTTP/1.1\n" +
            "    Content-Type: application/json\n" +
            "\n" +
            "    { foo: 'bar' }\n" +
            "\n" +
            "    HTTP/1.1 200 OK\n" +
            "    Content-Type: text/html\n" +
            "\n" +
            "    argh,\n" +
            "  httpConversation:\n" +
            "    GET / HTTP/1.1\n" +
            "    Content-Type: application/json\n" +
            "\n" +
            "    { foo: 123 }\n" +
            "\n" +
            "    HTTP/1.1 200 OK\n" +
            "    Content-Type: application/json\n" +
            "    Quux: Baz\n" +
            "\n" +
            "    { foo: 123 }\n" +
            "}");
    });

    it('should produce diffs that are proper blocks', function () {
        expect(function () {
            expect({
                headers: new Headers({ foo: 'quux', baz: 'bar' }),
                message: new Message('Foo: Bar\nContent-Type: application/json\n\n{"foo":123}'),
                httpRequest: new HttpRequest({ requestLine: 'GET / HTTP/1.1', headers: { bar: 'baz' }, body: 'foo' }),
                httpResponse: new HttpResponse({ statusLine: 'HTTP/1.1 200 OK', headers: { bar: 'baz' }, body: 'foo' }),
                httpExchange: new HttpExchange({
                    request: 'GET / HTTP/1.1\r\nContent-Type: application/json\r\n\r\n{"foo":"bar"}',
                    response: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'
                }),
                httpConversation: new HttpConversation({
                    exchanges: [
                        {
                            request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                            response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                        }
                    ]
                })
            }, 'to satisfy', {
                headers: { foo: 'quux1', baz: 'bar' },
                message: { headers: { Foo: 'Baz', 'Content-Type': 'application/json' }, body: { foo: 456 } },
                httpRequest: { requestLine: 'GET /foo HTTP/1.1', headers: { bar: 'baz' }, body: 'foo'},
                httpResponse: { statusLine: 'HTTP/1.1 404', headers: { bar: 'quux' }, body: 'foo' },
                httpExchange: {
                    request: { path: '/foo', headers: { Foo: 'quux' } },
                    response: { statusCode: 404, headers: { Bar: 'baz' } }
                },
                httpConversation: {
                    exchanges: [
                        {
                            request: { path: '/foo', headers: { Foo: 'quux' } },
                            response: { statusCode: 404, headers: { Bar: 'baz' } }
                        }
                    ]
                }
            });
        }, 'to throw',
            "expected\n" +
            "{\n" +
            "  headers:\n" +
            "    Foo: quux\n" +
            "    Baz: bar,\n" +
            "  message:\n" +
            "    Foo: Bar\n" +
            "    Content-Type: application/json\n" +
            "\n" +
            "    { foo: 123 },\n" +
            "  httpRequest:\n" +
            "    GET / HTTP/1.1\n" +
            "    Bar: baz\n" +
            "\n" +
            "    foo,\n" +
            "  httpResponse:\n" +
            "    HTTP/1.1 200 OK\n" +
            "    Bar: baz\n" +
            "\n" +
            "    foo,\n" +
            "  httpExchange:\n" +
            "    GET / HTTP/1.1\n" +
            "    Content-Type: application/json\n" +
            "\n" +
            "    { foo: 'bar' }\n" +
            "\n" +
            "    HTTP/1.1 200 OK\n" +
            "    Content-Type: text/html\n" +
            "\n" +
            "    argh,\n" +
            "  httpConversation:\n" +
            "    GET / HTTP/1.1\n" +
            "    Content-Type: application/json\n" +
            "\n" +
            "    { foo: 123 }\n" +
            "\n" +
            "    HTTP/1.1 200 OK\n" +
            "    Content-Type: application/json\n" +
            "    Quux: Baz\n" +
            "\n" +
            "    { foo: 123 }\n" +
            "}\n" +
            "to satisfy\n" +
            "{\n" +
            "  headers: { foo: 'quux1', baz: 'bar' },\n" +
            "  message: {\n" +
            "    headers: { Foo: 'Baz', 'Content-Type': 'application/json' },\n" +
            "    body: { foo: 456 }\n" +
            "  },\n" +
            "  httpRequest: { requestLine: 'GET /foo HTTP/1.1', headers: { bar: 'baz' }, body: 'foo' },\n" +
            "  httpResponse: { statusLine: 'HTTP/1.1 404', headers: { bar: 'quux' }, body: 'foo' },\n" +
            "  httpExchange: {\n" +
            "    request: { path: '/foo', headers: ... },\n" +
            "    response: { statusCode: 404, headers: ... }\n" +
            "  },\n" +
            "  httpConversation: { exchanges: [ ... ] }\n" +
            "}\n" +
            "\n" +
            "{\n" +
            "  headers:\n" +
            "    Foo: quux // should equal quux1\n" +
            "              //\n" +
            "              // -quux\n" +
            "              // +quux1\n" +
            "    Baz: bar,\n" +
            "  message:\n" +
            "    Foo: Bar // should equal Baz\n" +
            "             //\n" +
            "             // -Bar\n" +
            "             // +Baz\n" +
            "    Content-Type: application/json\n" +
            "\n" +
            "    {\n" +
            "      foo: 123 // should equal 456\n" +
            "    },\n" +
            "  httpRequest:\n" +
            "    GET / HTTP/1.1 // should be GET /foo HTTP/1.1\n" +
            "                   //\n" +
            "                   // -GET / HTTP/1.1\n" +
            "                   // +GET /foo HTTP/1.1\n" +
            "    Bar: baz\n" +
            "\n" +
            "    foo,\n" +
            "  httpResponse:\n" +
            "    HTTP/1.1 200 OK // should be HTTP/1.1 404 Not Found\n" +
            "                    //\n" +
            "                    // -HTTP/1.1 200 OK\n" +
            "                    // +HTTP/1.1 404 Not Found\n" +
            "    Bar: baz // should equal quux\n" +
            "             //\n" +
            "             // -baz\n" +
            "             // +quux\n" +
            "\n" +
            "    foo,\n" +
            "  httpExchange:\n" +
            "    GET / HTTP/1.1 // should be /foo\n" +
            "                   //\n" +
            "                   // -GET / HTTP/1.1\n" +
            "                   // +GET /foo HTTP/1.1\n" +
            "    Content-Type: application/json\n" +
            "    // missing Foo: quux\n" +
            "\n" +
            "    { foo: 'bar' }\n" +
            "\n" +
            "    HTTP/1.1 200 OK // should be 404 Not Found\n" +
            "                    //\n" +
            "                    // -HTTP/1.1 200 OK\n" +
            "                    // +HTTP/1.1 404 Not Found\n" +
            "    Content-Type: text/html\n" +
            "    // missing Bar: baz\n" +
            "\n" +
            "    argh,\n" +
            "  httpConversation:\n" +
            "    GET / HTTP/1.1 // should be /foo\n" +
            "                   //\n" +
            "                   // -GET / HTTP/1.1\n" +
            "                   // +GET /foo HTTP/1.1\n" +
            "    Content-Type: application/json\n" +
            "    // missing Foo: quux\n" +
            "\n" +
            "    { foo: 123 }\n" +
            "\n" +
            "    HTTP/1.1 200 OK // should be 404 Not Found\n" +
            "                    //\n" +
            "                    // -HTTP/1.1 200 OK\n" +
            "                    // +HTTP/1.1 404 Not Found\n" +
            "    Content-Type: application/json\n" +
            "    Quux: Baz\n" +
            "    // missing Bar: baz\n" +
            "\n" +
            "    { foo: 123 }\n" +
            "}"
        );
    });

    describe('Headers', function () {
        describe('#inspect', function () {
            it('should render no headers as the empty string', function () {
                expect(new Headers(''), 'to inspect as', '');
            });

            it('should render a single header headers with no newline at the end', function () {
                expect(new Headers({foo: 'bar'}), 'to inspect as', 'Foo: bar');
            });

            it('should render two headers single header headers with no newline at the end', function () {
                expect(new Headers({foo: 'bar', quux: 'baz'}), 'to inspect as', 'Foo: bar\nQuux: baz');
            });

            it('should render header names with special cased capitalization correctly', function () {
                expect(new Headers('mime-version: 1.0'), 'to inspect as', 'MIME-Version: 1.0');
            });
        });

        describe('#diff', function () {
            it('must show missing headers', function () {
                expect([
                    new Headers('Foo: Bar\nQuux: Baz'),
                    new Headers('Foo: Bar\nBaz: Blah\nQuux: Baz')
                ], 'to produce a diff of',
                    'Foo: Bar\n' +
                    'Quux: Baz\n' +
                    '// missing Baz: Blah'
                );
            });

            it('must show extraneous headers', function () {
                expect([
                    new Headers('Foo: Bar\nBaz: Blah\nQuux: Baz'),
                    new Headers('Foo: Bar\nQuux: Baz')
                ], 'to produce a diff of',
                    'Foo: Bar\n' +
                    'Baz: Blah // should be removed\n' +
                    'Quux: Baz'
                );
            });

            it('must show headers that have a wrong value', function () {
                expect([
                    new Headers('Foo: Bar\nQuux: Baz'),
                    new Headers('Foo: Baz\nQuux: Blaz')
                ], 'to produce a diff of',
                    'Foo: Bar // should be Baz\n' +
                    'Quux: Baz // should be Blaz'
                );
            });

            it('must show repeated headers where the first has a wrong value', function () {
                expect([
                    new Headers('Foo: Bar\nFoo: Baz'),
                    new Headers('Foo: Blah\nFoo: Baz')
                ], 'to produce a diff of',
                    'Foo: Baz\n' +
                    'Foo: Bar // should be Blah'
                );
            });

            it('must show repeated headers where the second has a wrong value', function () {
                expect([
                    new Headers('Foo: Bar\nFoo: Baz'),
                    new Headers('Foo: Bar\nFoo: Blaz')
                ], 'to produce a diff of',
                    'Foo: Bar\n' +
                    'Foo: Baz // should be Blaz'
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('must not break with undefined', function () {
                expect(new Headers({foo: 'a'}), 'to satisfy', undefined);
            });

            it('must match an empty object', function () {
                expect(new Headers({foo: 'a'}), 'to satisfy', {});
            });

            it('must match an empty object exhaustively', function () {
                expect(new Headers({}), 'to exhaustively satisfy', {});
            });

            it('must match a single-valued header', function () {
                expect(new Headers({foo: 'a'}), 'to satisfy', {foo: 'a'});
            });

            it('must match a single-valued header specified with a different casing', function () {
                expect(new Headers({Foo: 'a'}), 'to satisfy', {fOO: 'a'});
            });

            it('must match exhaustively when a single header is matched', function () {
                expect(new Headers({foo: 'a'}), 'to exhaustively satisfy', {foo: 'a'});
            });

            it('must match a string against a number (should stringify everything)', function () {
                expect(new Headers({foo: '123'}), 'to satisfy', {foo: 123});
            });

            it('must match a number against a string (should stringify everything)', function () {
                expect(new Headers({foo: 123}), 'to satisfy', {foo: '123'});
            });

            it('should match in spite of excess headers when not matching exhaustively', function () {
                expect(new Headers({foo: 'a', bar: 'a'}), 'to satisfy', {foo: 'a'});
            });

            it('should not match exhaustively when there are excess headers', function () {
                expect(new Headers({foo: 'a', bar: 'a'}), 'not to exhaustively satisfy', {foo: 'a'});
            });

            it('should match in spite of excess values when not matching exhaustively', function () {
                expect(new Headers({foo: ['a', 'b']}), 'to satisfy', {foo: 'a'});
            });

            it('should not match exhaustively when there are excess values', function () {
                expect(new Headers({foo: ['a', 'b']}), 'not to exhaustively satisfy', {foo: 'a'});
            });

            it('should match multiple values exhaustively', function () {
                expect(new Headers({foo: ['a', 'b']}), 'to exhaustively satisfy', {foo: ['a', 'b']});
            });

            it('should match multiple values exhaustively when ordered differently', function () {
                expect(new Headers({foo: ['a', 'b']}), 'to exhaustively satisfy', {foo: ['b', 'a']});
            });

            it('should not match exhaustively unless all values are actually named', function () {
                expect(new Headers({foo: ['a', 'b']}), 'not to exhaustively satisfy', {foo: ['a', 'a']});
            });

            it('should assert the absence of a header when the value is given as undefined', function () {
                expect(new Headers({foo: 'a'}), 'to satisfy', {bar: undefined});
                expect(new Headers({foo: 'a'}), 'not to satisfy', {foo: undefined});
            });

            it('should produce the correct output when a present header is expected to be undefined', function () {
                expect(function () {
                    expect(new Headers({foo: 'a'}), 'to satisfy', {foo: undefined});
                }, 'to throw',
                    'expected Foo: a to satisfy { foo: undefined }\n' +
                    '\n' +
                    'Foo: a // should be removed');
            });

            it('should match exhaustively even when absent headers are also asserted absent', function () {
                expect(new Headers({foo: 'a'}), 'to exhaustively satisfy', {foo: 'a', bar: undefined});
            });

            it('should support passing the expected set of headers as a string', function () {
                expect(new Headers({foo: 'a', bar: 'b'}), 'to satisfy', 'foo: a\r\nbar: b');
                expect(new Headers({foo: 'a', bar: 'b'}), 'to exhaustively satisfy', 'foo: a\r\nbar: b');

                expect(new Headers({foo: 'a'}), 'not to satisfy', 'foo: b');
                expect(new Headers({foo: 'a'}), 'to satisfy', '');
                expect(new Headers({foo: 'a'}), 'not to exhaustively satisfy', '');
            });

            it('should produce a diff when the assertion fails', function () {
                expect(function () {
                    expect(new Headers({foo: 'a', bar: 'b'}), 'to satisfy', {bar: /c/, hey: 'there'});
                }, 'to throw',
                    'expected\n' +
                    'Foo: a\n' +
                    'Bar: b\n' +
                    "to satisfy { bar: /c/, hey: 'there' }\n" +
                    '\n' +
                    'Foo: a\n' +
                    'Bar: b // should match /c/\n' +
                    '// missing Hey: there');
            });

            it('should support expect.it', function () {
                expect(new Headers({foo: 'a'}), 'to satisfy', {foo: expect.it('not to match', /b/)});
            });

            it('should produce the correct diff when an expect.it assertion fails', function () {
                expect(function () {
                    expect(new Headers({foo: 'bla'}), 'to satisfy', {foo: expect.it('not to match', /a/)});
                }, 'to throw',
                    "expected Foo: bla to satisfy { foo: expect.it('not to match', /a/) }\n" +
                    '\n' +
                    "Foo: bla // should satisfy expect.it('not to match', /a/)\n" +
                    "         //\n" +
                    "         // expected 'bla' not to match /a/\n" +
                    '         //\n' +
                    '         // bla\n' +
                    '         //   ^');
            });

            it('should display a diff if available', function () {
                expect(function () {
                    expect(new Headers('Foo: Bar'), 'to satisfy', { Foo: expect.it('to satisfy', 'Baz') });
                }, 'to throw',
                    "expected Foo: Bar to satisfy { Foo: expect.it('to satisfy', 'Baz') }\n" +
                    '\n' +
                    "Foo: Bar // should satisfy expect.it('to satisfy', 'Baz')\n" +
                    "         //\n" +
                    "         // expected 'Bar' to equal 'Baz'\n" +
                    '         //\n' +
                    '         // -Bar\n' +
                    '         // +Baz'
                );
            });

            describe('in an async setting', function () {
                it('should fail with a diff', function () {
                    return expect(
                        expect(new HttpRequest(
                            'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}'
                        ), 'to satisfy', {
                            body: expect.it('when delayed a little bit', 'to equal', {foo: 987})
                        }),
                        'when rejected',
                        'to have message',
                            "expected\n" +
                            "GET / HTTP/1.1\n" +
                            "Content-Type: application/json\n" +
                            "\n" +
                            "{ foo: 123 }\n" +
                            "to satisfy { body: expect.it('when delayed a little bit', 'to equal', { foo: 987 }) }\n" +
                            "\n" +
                            "GET / HTTP/1.1\n" +
                            "Content-Type: application/json\n" +
                            "\n" +
                            "expected { foo: 123 } when delayed a little bit to equal { foo: 987 }\n" +
                            "\n" +
                            "{\n" +
                            "  foo: 123 // should equal 987\n" +
                            "}"
                    );
                });
            });
        });
    });

    describe('Message', function () {
        describe('#inspect', function () {
            it('should render a message with no headers and no body as the empty string', function () {
                expect(new Message(), 'to inspect as', '');
            });

            it('should render a message with a single header and no body without a newline at the end', function () {
                expect(new Message({headers: {foo: 'bar'}}), 'to inspect as', 'Foo: bar');
            });

            it('should render a message with a single header and a body correctly', function () {
                expect(new Message({headers: {foo: 'bar'}, body: 'baz'}), 'to inspect as', 'Foo: bar\n\nbaz');
            });

            it('should render a message no headers and a body correctly', function () {
                expect(new Message({body: 'baz'}), 'to inspect as', 'baz');
            });

            it('should render a multipart message correctly', function () {
                var message = new Message(
                    'Content-Type: multipart/form-data;\r\n' +
                    ' boundary=--------------------------231099812216460892104111\r\n' +
                    '\r\n' +
                    '----------------------------231099812216460892104111\r\n' +
                    'Content-Disposition: form-data; name="recipient"\r\n' +
                    '\r\n' +
                    'andreas@one.com\r\n' +
                    '----------------------------231099812216460892104111\r\n' +
                    'Content-Disposition: form-data; name="Message "\r\n' +
                    '\r\n' +
                    'The message\r\n' +
                    '----------------------------231099812216460892104111--\r\n'
                );
                expect(
                    message,
                    'to inspect as',
                    'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                    '\n' +
                    '----------------------------231099812216460892104111\n' +
                    'Content-Disposition: form-data; name="recipient"\n' +
                    '\n' +
                    'andreas@one.com\n' +
                    '----------------------------231099812216460892104111\n' +
                    'Content-Disposition: form-data; name="Message "\n' +
                    '\n' +
                    'The message\n' +
                    '----------------------------231099812216460892104111--'
                );
            });
        });

        describe('#diff', function () {
            it('must show missing headers', function () {
                expect([
                    new Message('Content-Type: application/json\n\n{"foo":123}'),
                    new Message('Content-Type: application/json\nQuux: Baz\n\n{"foo":123}')
                ], 'to produce a diff of',
                    'Content-Type: application/json\n' +
                    '// missing Quux: Baz\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}'
                );
            });

            it('must diff object bodies', function () {
                expect([
                    new Message('Content-Type: application/json\n\n{"foo":123}'),
                    new Message('Content-Type: application/json\n\n{"foo":456}')
                ], 'to produce a diff of',
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123 // should equal 456\n' +
                    '}'
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('must not break with undefined', function () {
                expect(new messy.Message('a'), 'to satisfy', undefined);
            });

            it('should satisfy against a string', function () {
                expect(new messy.Message(
                    'To: <recipient@example.com>\r\n' +
                    'From: <foo@example.com>\r\n' +
                    'Subject: Hey\r\n' +
                    '\r\n' +
                    'foo\r\n'
                ), 'to satisfy',
                    'To: <recipient@example.com>\r\nFrom: <foo@example.com>\r\nSubject: Hey\r\n\r\nfoo\r\n'
                );
            });

            it('against a messy.Message instance', function () {
                expect(function () {
                    expect(new messy.Message('Content-Type: application/json'), 'to satisfy', new messy.Message('Foo: quux'));
                }, 'to throw',
                    "expected Content-Type: application/json to satisfy Foo: quux\n" +
                    "\n" +
                    "Content-Type: application/json\n" +
                    "// missing Foo: quux"
                );
            });

            it('should throw if a non-Unexpected error is caught', function () {
                expect(function () {
                    expect(new Message({headers: {foo: 'a'}}), 'to satisfy', {headers: {foo: function () {
                        throw new Error('wat');
                    }}});
                }, 'to throw', 'wat');
            });

            it('should support matching the headers', function () {
                expect(new Message({headers: {foo: 'a'}}), 'to satisfy', {headers: {foo: 'a'}});
            });

            it('should support matching the headers', function () {
                expect(new Message({headers: {foo: 'a'}}), 'to satisfy', {headers: {foo: 'a'}});

                expect(new Message({headers: {foo: 'a'}}), 'not to satisfy', {headers: {bar: 'a'}});
            });

            it('should support matching header values against numbers (implicitly stringified)', function () {
                expect(new Message({headers: {foo: '2'}}), 'to satisfy', {headers: {foo: 2}});
            });

            it('should support matching the serialized headers with a regular expression', function () {
                expect(new Message({headers: {foo: 'a', bar: 'b'}}), 'to satisfy', {headers: /a\r\nBar/});
            });

            it('should support matching individual headers with a regular expression', function () {
                expect(new Message({headers: {foo: 'abc'}}), 'to satisfy', {headers: {foo: /bc$/}});
            });

            describe('with the expected properties passed as a string', function () {
                it('should succeed', function () {
                    expect(new Message({headers: {foo: 'a'}}), 'to satisfy', 'foo: a');
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        expect(new Message({headers: {foo: 'a'}}), 'to satisfy', 'foo: b');
                    }, 'to throw',
                        "expected Foo: a to satisfy 'foo: b'\n" +
                        "\n" +
                        "Foo: a // should equal b\n" +
                        "       //\n" +
                        "       // -a\n" +
                        "       // +b"
                    );
                });

                it('should work with "not to satisfy"', function () {
                    expect(new Message({headers: {foo: 'a'}}), 'not to satisfy', 'foo: b');
                });
            });

            describe('with the expected headers passed as a string', function () {
                it('should succeed', function () {
                    expect(new Message({headers: {foo: 'a'}}), 'to satisfy', {headers: 'foo: a'});
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        expect(new Message({headers: {foo: 'a'}}), 'to satisfy', {headers: 'foo: b'});
                    }, 'to throw',
                        "expected Foo: a to satisfy { headers: 'foo: b' }\n" +
                        "\n" +
                        "Foo: a // should equal b\n" +
                        "       //\n" +
                        "       // -a\n" +
                        "       // +b"
                    );
                });

                it('should work with "not to satisfy"', function () {
                    expect(new Message({headers: {foo: 'a'}}), 'not to satisfy', {headers: 'foo: b'});
                });
            });

            it('should support matching a string body with a string', function () {
                expect(new Message('foo: bar\n\nthe body'), 'to satisfy', {body: 'the body'});
            });

            it('should support matching a string body with a regular expression', function () {
                expect(new Message('foo: bar\n\nthe body'), 'to satisfy', {body: /he b/});
            });

            describe('when matching the decoded body with a regexp', function () {
                it('should succeed', function () {
                    expect(new Message(
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Content-Transfer-Encoding: quoted-printable\n\n=F8'), 'to satisfy', {body: /ø/});
                });

                it('should produce a diff when failing to match', function () {
                    expect(function () {
                        expect(new Message(
                            'Content-Type: text/plain; charset=iso-8859-1\n' +
                            'Content-Transfer-Encoding: quoted-printable\n\n=F8'), 'to satisfy', {body: 'æ'});
                    }, 'to throw',
                        'expected\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'ø\n' +
                        "to satisfy { body: 'æ' }\n" +
                        '\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        '-ø\n' +
                        '+æ');
                });

                it('should produce a diff when failing to match and not omit the header diff', function () {
                    expect(function () {
                        expect(new Message(
                            'Foo: bar\n' +
                            'Content-Type: text/plain; charset=iso-8859-1\n' +
                            'Content-Transfer-Encoding: quoted-printable\n\n=F8'), 'to satisfy', {headers: {Foo: 'quux'}, body: 'æ'});
                    }, 'to throw',
                        'expected\n' +
                        'Foo: bar\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'ø\n' +
                        "to satisfy { headers: { Foo: 'quux' }, body: 'æ' }\n" +
                        '\n' +
                        'Foo: bar // should equal quux\n' +
                        '         //\n' +
                        '         // -bar\n' +
                        '         // +quux\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        '-ø\n' +
                        '+æ');
                });
            });

            describe('when matching the decoded body with a Buffer', function () {
                it('should succeed', function () {
                    expect(new Message(
                        Buffer.concat([
                            new Buffer('Content-Type: application/octet-stream\n\n'),
                            new Buffer([1, 2, 3, 4])
                        ])
                    ), 'to satisfy', {body: new Buffer([1, 2, 3, 4])});
                });

                it('should support matching the decoded body with a Buffer', function () {
                    expect(function () {
                        expect(new Message(
                            Buffer.concat([
                                new Buffer('Content-Type: application/octet-stream\n\n'),
                                new Buffer([1, 2, 3, 4])
                            ])
                        ), 'to satisfy', {body: new Buffer([1, 2, 3, 5])});
                    }, 'to throw',
                        'expected\n' +
                        'Content-Type: application/octet-stream\n' +
                        '\n' +
                        'Buffer([0x01, 0x02, 0x03, 0x04])\n' +
                        'to satisfy { body: Buffer([0x01, 0x02, 0x03, 0x05]) }\n' +
                        '\n' +
                        'Content-Type: application/octet-stream\n' +
                        '\n' +
                        '-01 02 03 04                                      │....│\n' +
                        '+01 02 03 05                                      │....│');
                });
            });

            var rawSrc =
                'Content-Type: text/plain; charset=UTF-8\r\n' +
                'Transfer-Encoding: chunked\r\n' +
                '\r\n' +
                '4\r\n' +
                'Wiki\r\n' +
                '5\r\n' +
                'pedia\r\n' +
                'e\r\n' +
                ' in\r\n\r\nchunks.\r\n' +
                '0\r\n' +
                '\r\n';

            it('should support matching the raw body', function () {
                expect(new Message(rawSrc), 'to satisfy', {
                    body: 'Wikipedia in\r\n\r\nchunks.',
                    rawBody: /4\r\nWiki\r\n5\r\npedia/
                });
            });

            it('should support matching the unchunked body', function () {
                expect(new Message(rawSrc), 'to satisfy', {
                    body: 'Wikipedia in\r\n\r\nchunks.',
                    unchunkedBody: /Wikipedia/
                });
            });

            it('should produce a diff when failing to match the raw body', function () {
                expect(function () {
                    expect(new Message(rawSrc), 'to satisfy', {
                        rawBody: expect.it('to contain', 'Wikipedia')
                    });
                }, 'to throw',
                    "expected\n" +
                    "Content-Type: text/plain; charset=UTF-8\n" +
                    "Transfer-Encoding: chunked\n" +
                    "\n" +
                    "Wikipedia in\r\n" +
                    "\r\n" +
                    "chunks.\n" +
                    "to satisfy { rawBody: expect.it('to contain', 'Wikipedia') }\n" +
                    "\n" +
                    "Content-Type: text/plain; charset=UTF-8\n" +
                    "Transfer-Encoding: chunked\n" +
                    "\n" +
                    "Wikipedia in\r\n" +
                    "\r\n" +
                    "chunks.\n" +
                    "// should have raw body satisfying expect.it('to contain', 'Wikipedia')\n" +
                    "// expected '4\\r\\nWiki\\r\\n5\\r\\npedia\\r\\ne\\r\\n in\\r\\n\\r\\nchunks.\\r\\n0\\r\\n\\r\\n'\n" +
                    "// to contain 'Wikipedia'\n" +
                    "//\n" +
                    "// 4\r\n" +
                    "// Wiki\r\n" +
                    "// ^^^^\n" +
                    "// 5\r\n" +
                    "// pedia\r\n" +
                    "// e\r\n" +
                    "//  in\r\n" +
                    "// \r\n" +
                    "// chunks.\r\n" +
                    "// 0\r\n" +
                    "// \r\n" +
                    "//"
                );
            });

            it('should support matching the file name', function () {
                expect(new Message(
                    'Content-Disposition: attachment; filename=abcdef.txt\n' +
                    'Content-Transfer-Encoding: quoted-printable\n\n=F8'), 'to satisfy', {fileName: /abcdef/});
            });

            it('should produce a diff when failing to match the file name', function () {
                expect(function () {
                    expect(new Message(
                        'Content-Disposition: attachment; filename=abcdef.txt\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Content-Transfer-Encoding: quoted-printable\n\n=F8'), 'to satisfy', {fileName: /foo/});
                }, 'to throw',
                    'expected\n' +
                    'Content-Disposition: attachment; filename=abcdef.txt\n' +
                    'Content-Type: text/plain; charset=iso-8859-1\n' +
                    'Content-Transfer-Encoding: quoted-printable\n' +
                    '\n' +
                    'ø\n' +
                    'to satisfy { fileName: /foo/ }\n' +
                    '\n' +
                    'Content-Disposition: attachment; filename=abcdef.txt\n' +
                    'Content-Type: text/plain; charset=iso-8859-1\n' +
                    'Content-Transfer-Encoding: quoted-printable\n' +
                    '\n' +
                    'ø\n' +
                    '// should have file name satisfying /foo/');
            });

            it('should support matching a Buffer body with a Buffer', function () {
                expect(new Message(new Buffer('foo: bar\n\nthe body', 'utf-8')), 'to satisfy', {body: new Buffer('the body', 'utf-8')});
            });

            it('should support matching a Buffer body with an object when the Content-Type is application/json', function () {
                expect(new Message(new Buffer('Content-Type: application/json\n\n{"the": "body"}', 'utf-8')), 'to satisfy', {body: {the: 'body'}});
            });

            it('should support matching a string body with an object when the Content-Type is application/json', function () {
                expect(new Message('Content-Type: application/json\n\n{"the": "body"}'), 'to satisfy', {body: {the: 'body'}});
            });

            it('should support matching an object body (JSON) with an object', function () {
                expect(new Message({body: {foo: 'bar', bar: 'baz'}}), 'to satisfy', {body: {bar: 'baz', foo: 'bar'}});
            });

            it('should produce a diff when the assertion fails', function () {
                expect(function () {
                    expect(new Message({headers: {foo: 'a', bar: 'b'}, body: 'foo'}), 'to satisfy', {headers: {bar: /c/}, body: /bar/});
                }, 'to throw',
                    'expected\n' +
                    'Foo: a\n' +
                    'Bar: b\n' +
                    '\n' +
                    'foo\n' +
                    'to satisfy { headers: { bar: /c/ }, body: /bar/ }\n' +
                    '\n' +
                    'Foo: a\n' +
                    'Bar: b // should match /c/\n' +
                    '\n' +
                    'foo // should match /bar/');
            });

            it('should use to satisfy semantics for the body', function () {
                expect(function () {
                    expect(new Message({
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            foo: 'foo',
                            bar: 'bar'
                        })
                    }), 'to satisfy', {
                        body: {
                            foo: /fo/,
                            bar: expect.it('to be a string').and('to have length', 2)
                        }
                    });
                }, 'to throw',
                       "expected\n" +
                       "Content-Type: application/json\n" +
                       "\n" +
                       "{ foo: 'foo', bar: 'bar' }\n" +
                       "to satisfy\n" +
                       "{\n" +
                       "  body: {\n" +
                       "    foo: /fo/,\n" +
                       "    bar: expect.it('to be a string')\n" +
                       "                 .and('to have length', 2)\n" +
                       "  }\n" +
                       "}\n" +
                       "\n" +
                       "Content-Type: application/json\n" +
                       "\n" +
                       "{\n" +
                       "  foo: 'foo',\n" +
                       "  bar: 'bar' // ✓ should be a string and\n" +
                       "             // ⨯ should have length 2\n" +
                       "             //     expected 3 to be 2\n" +
                       "}");
            });

            it('should produce sensible output when matching an empty body against a regexp', function () {
                expect(function () {
                    expect(new Message({headers: {Foo: 'a'}, body: ''}), 'to satisfy', {body: /bar/});
                }, 'to throw',
                    'expected Foo: a to satisfy { body: /bar/ }\n' +
                    '\n' +
                    'Foo: a\n' +
                    '\n' +
                    '// should match /bar/');
            });

            var multiPartMessage = new Message(
                'Content-Type: multipart/form-data;\r\n' +
                ' boundary=--------------------------231099812216460892104111\r\n' +
                '\r\n' +
                '----------------------------231099812216460892104111\r\n' +
                'Content-Type: text/plain; charset=iso-8859-1\r\n' +
                'Foo: bar\r\n' +
                'Content-Transfer-Encoding: quoted-printable\r\n' +
                '\r\n' +
                'fooøbar\r\n' +
                '----------------------------231099812216460892104111\r\n' +
                'Content-Disposition: attachment; filename="blah.txt"\r\n' +
                '\r\n' +
                'The message\r\n' +
                '----------------------------231099812216460892104111--\r\n'
            );

            describe('when asserting on the parts array with expect.it', function () {
                it('should succeed', function () {
                    expect(multiPartMessage, 'to satisfy', {
                        parts: expect.it('to have length', 2)
                    });
                });

                it('should produce a diff when the assertion fails', function () {
                    expect(function () {
                        expect(multiPartMessage, 'to satisfy', {
                            parts: expect.it('to have length', 3)
                        });
                    }, 'to throw',
                        'expected\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        "to satisfy { parts: expect.it('to have length', 3) }\n" +
                        '\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        '// expected\n' +
                        '// [\n' +
                        '//   Content-Type: text/plain; charset=iso-8859-1\n' +
                        '//   Foo: bar\n' +
                        '//   Content-Transfer-Encoding: quoted-printable\n' +
                        '//\n' +
                        '//   fooøbar,\n' +
                        '//   Content-Disposition: attachment; filename="blah.txt"\n' +
                        '//\n' +
                        '//   The message\n' +
                        '// ]\n' +
                        '// to have length 3\n' +
                        '//   expected 2 to be 3');
                });
            });

            describe('when satisfying against the individual parts of a multipart message', function () {
                it('should succeed', function () {
                    expect(multiPartMessage, 'to satisfy', {
                        parts: [
                            {
                                headers: {
                                    Foo: 'bar'
                                },
                                body: 'fooøbar'
                            },
                            {
                                fileName: /txt$/
                            }
                        ]
                    });
                });

                it('should throw when asserting on more parts than are present', function () {
                    expect(function () {
                        expect(multiPartMessage, 'to satisfy', {
                            parts: [{}, {}, {}]
                        });
                    }, 'to throw',
                        'expected\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        'to satisfy { parts: [ {}, {}, {} ] }\n' +
                        '\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        '// should have number of parts 3');
                });

                it('should throw when asserting on fewer parts than are present', function () {
                    expect(function () {
                        expect(multiPartMessage, 'to satisfy', {
                            parts: [{}]
                        });
                    }, 'to throw',
                        'expected\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        'to satisfy { parts: [ {} ] }\n' +
                        '\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        '// should have number of parts 1');
                });


                it('should throw when asserting on bogus part numbers', function () {
                    expect(function () {
                        expect(multiPartMessage, 'to satisfy', {
                            parts: {abc: {}}
                        });
                    }, 'to throw',
                        'expected\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        'to satisfy { parts: { abc: {} } }\n' +
                        '\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        "// invalid part specifier(s): 'abc'");
                });

                it('should produce a diff when failing the match', function () {
                    expect(function () {
                        expect(multiPartMessage, 'to satisfy', {
                            parts: [
                                {
                                    headers: {
                                        Foo: 'quux'
                                    },
                                    body: 'fooøbar'
                                },
                                {
                                    fileName: /txt$/
                                }
                            ]
                        });
                    }, 'to throw',
                        'expected\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        'fooøbar\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--\n' +
                        "to satisfy { parts: [ { headers: ..., body: 'fooøbar' }, { fileName: ... } ] }\n" +
                        '\n' +
                        'Content-Type: multipart/form-data; boundary=--------------------------231099812216460892104111\n' +
                        '\n' +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Type: text/plain; charset=iso-8859-1\n' +
                        'Foo: bar // should equal quux\n' +
                        '         //\n' +
                        '         // -bar\n' +
                        '         // +quux\n' +
                        'Content-Transfer-Encoding: quoted-printable\n' +
                        '\n' +
                        "fooøbar\n" +
                        '----------------------------231099812216460892104111\n' +
                        'Content-Disposition: attachment; filename="blah.txt"\n' +
                        '\n' +
                        'The message\n' +
                        '----------------------------231099812216460892104111--');
                });
            });
        });
    });

    describe('RequestLine', function () {
        describe('#diff', function () {
            it('must diff when the methods differ', function () {
                expect([
                    new RequestLine('GET / HTTP/1.1'),
                    new RequestLine('POST / HTTP/1.1')
                ], 'to produce a diff of',
                    "GET / HTTP/1.1 // should be POST / HTTP/1.1\n" +
                    "               //\n" +
                    "               // -GET / HTTP/1.1\n" +
                    "               // +POST / HTTP/1.1"

                );
            });

            it('must diff when the protocol differs', function () {
                expect([
                    new RequestLine('GET / HTTP/1.1'),
                    new RequestLine('GET / HTTP/1.0')
                ], 'to produce a diff of',
                    "GET / HTTP/1.1 // should be HTTP/1.0\n" +
                    "               //\n" +
                    "               // -GET / HTTP/1.1\n" +
                    "               // +GET / HTTP/1.0"
                );
            });

            it('must diff the status line when the url differs', function () {
                expect([
                    new RequestLine('GET /foo HTTP/1.1'),
                    new RequestLine('GET /bar HTTP/1.1')
                ], 'to produce a diff of',
                    "GET /foo HTTP/1.1 // should be /bar HTTP/1.1\n" +
                    "                  //\n" +
                    "                  // -GET /foo HTTP/1.1\n" +
                    "                  // +GET /bar HTTP/1.1"
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('must not break with undefined', function () {
                expect(new RequestLine('GET / HTTP/1.1'), 'to satisfy', undefined);
            });

            it('should produce a diff when the assertion fails', function () {
                expect(function () {
                    expect(new RequestLine('GET / HTTP/1.1'), 'to satisfy', {method: /^P(?:UT|POST)$/});
                }, 'to throw',
                    'expected GET / HTTP/1.1 to satisfy { method: /^P(?:UT|POST)$/ }\n' +
                    '\n' +
                    'GET / HTTP/1.1 // should satisfy { method: /^P(?:UT|POST)$/ }'
                );
            });

            it('should produce a simple diff when a failed assertion only contains equality criteria', function () {
                expect(function () {
                    expect(new RequestLine('GET / HTTP/1.1'), 'to satisfy', {method: 'POST', url: '/'});
                }, 'to throw',
                    "expected GET / HTTP/1.1 to satisfy { method: 'POST', url: '/' }\n" +
                    '\n' +
                    'GET / HTTP/1.1 // should be POST /\n' +
                    '               //\n' +
                    '               // -GET / HTTP/1.1\n' +
                    '               // +POST / HTTP/1.1'
                );
            });
        });
    });

    describe('HttpRequest', function () {
        describe('#inspect', function () {
            it('should render an http request with no headers and no body as just the request line with no newline at the end', function () {
                expect(new HttpRequest('GET / HTTP/1.1'), 'to inspect as', 'GET / HTTP/1.1');
            });

            it('should render an http request with no headers as the request line, then two newlines followed by the body', function () {
                expect(new HttpRequest({requestLine: 'GET / HTTP/1.1', body: 'foo'}), 'to inspect as', 'GET / HTTP/1.1\n\nfoo');
            });

            it('should render an http request with a single header correctly', function () {
                expect(new HttpRequest({requestLine: 'GET / HTTP/1.1', headers: {bar: 'baz'}, body: 'foo'}), 'to inspect as', 'GET / HTTP/1.1\nBar: baz\n\nfoo');
            });
        });

        describe('#diff', function () {
            it('must diff the request line', function () {
                expect([
                    new HttpRequest('GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}'),
                    new HttpRequest('POST /foo HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}')
                ], 'to produce a diff of',
                    "GET / HTTP/1.1 // should be POST /foo HTTP/1.1\n" +
                    "               //\n" +
                    "               // -GET / HTTP/1.1\n" +
                    "               // +POST /foo HTTP/1.1\n" +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}'
                );
            });

            it('must diff the headers', function () {
                expect([
                    new HttpRequest('GET / HTTP/1.1\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'),
                    new HttpRequest('GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}')
                ], 'to produce a diff of',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz // should be removed\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}'
                );
            });

            it('must diff the metadata', function () {
                expect([
                    new HttpRequest('GET https://www.example.com:987/blabla HTTP/1.1'),
                    new HttpRequest('GET http://somewhereelse.com/hey HTTP/1.1')
                ], 'to produce a diff of',
                    "GET /blabla HTTP/1.1 // should be /hey HTTP/1.1\n" +
                    "                     //\n" +
                    "                     // -GET /blabla HTTP/1.1\n" +
                    "                     // +GET /hey HTTP/1.1\n" +
                    "Host: www.example.com:987 // should be somewhereelse.com\n" +
                    "Metadata: {\n" +
                    "  host: 'www.example.com', // should equal 'somewhereelse.com'\n" +
                    "                           //\n" +
                    "                           // -www.example.com\n" +
                    "                           // +somewhereelse.com\n" +
                    "  port: 987, // should equal 80\n" +
                    "  encrypted: true // should equal false\n" +
                    "}"
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('must not break with undefined', function () {
                expect(new HttpRequest('GET / HTTP/1.1'), 'to satisfy', undefined);
            });

            it('should match on properties defined by Message', function () {
                expect(new HttpRequest('GET /foo HTTP/1.1\r\nContent-Type: text/html'), 'to satisfy', {
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            });

            describe('with a string as the RHS', function () {
                it('should succeed', function () {
                    expect(new HttpRequest('GET /foo HTTP/1.1'), 'to satisfy', '/foo');
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        expect(new HttpRequest('GET /foo HTTP/1.1'), 'to satisfy', 'POST /bar');
                    }, 'to throw',
                        "expected GET /foo HTTP/1.1 to satisfy 'POST /bar'\n" +
                        "\n" +
                        "GET /foo HTTP/1.1 // should be POST /bar\n" +
                        "                  //\n" +
                        "                  // -GET /foo HTTP/1.1\n" +
                        "                  // +POST /bar HTTP/1.1\n"
                    );
                });
            });

            describe('with metadata properties', function () {
                it('should succeed', function () {
                    expect(new HttpRequest('GET https://www.example.com:987/blabla HTTP/1.1'), 'to satisfy', {
                        host: 'www.example.com',
                        port: 987
                    });
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        expect(new HttpRequest('GET https://www.example.com:987/blabla HTTP/1.1'), 'to satisfy', {
                            host: 'blabla.com',
                            port: 123
                        });
                    }, 'to throw',
                        "expected\n" +
                        "GET /blabla HTTP/1.1\n" +
                        "Host: www.example.com:987\n" +
                        "to satisfy { host: 'blabla.com', port: 123 }\n" +
                        "\n" +
                        "GET /blabla HTTP/1.1\n" +
                        "Host: www.example.com:987\n" +
                        "// host: expected 'www.example.com' to equal 'blabla.com'\n" +
                        "//\n" +
                        "// -www.example.com\n" +
                        "// +blabla.com\n" +
                        "// port: expected 987 to equal 123"
                    );
                });
            });

            describe('when matching the encrypted flag', function () {
                it('should succeed', function () {
                    expect(new HttpRequest({encrypted: true}), 'to satisfy', {
                        encrypted: true
                    });
                });

                it('should fail when asserting non-encrypted to be encrypted', function () {
                    expect(function () {
                        expect(new HttpRequest('GET / HTTP/1.1'), 'to satisfy', {
                            encrypted: true
                        });
                    }, 'to throw',
                        'expected GET / HTTP/1.1 to satisfy { encrypted: true }\n' +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        '\n' +
                        '// expected an encrypted request');
                });

                it('should fail when asserting encrypted to be non-encrypted', function () {
                    expect(function () {
                        var httpRequest = new HttpRequest('GET / HTTP/1.1');
                        httpRequest.encrypted = true;
                        expect(httpRequest, 'to satisfy', { encrypted: false });
                    }, 'to throw',
                        'expected GET / HTTP/1.1 to satisfy { encrypted: false }\n' +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        '\n' +
                        '// expected an unencrypted request');
                });

                it('should fail when asserting encrypted against a non-boolean', function () {
                    expect(function () {
                        var httpRequest = new HttpRequest('GET / HTTP/1.1');
                        httpRequest.encrypted = false;
                        expect(httpRequest, 'to satisfy', { encrypted: expect.it('to be ok') });
                    }, 'to throw',
                        "expected GET / HTTP/1.1 to satisfy { encrypted: expect.it('to be ok') }\n" +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        '\n' +
                        "// encrypted: expected false to satisfy expect.it('to be ok')\n" +
                        '//\n' +
                        '// expected false to be ok');
                });
            });

            describe('when matching the cert/key/ca properties', function () {
                it('should succeed', function () {
                    expect(new HttpRequest({
                        cert: new Buffer([1]),
                        key: new Buffer([2]),
                        ca: new Buffer([3])
                    }), 'to satisfy', {
                        cert: new Buffer([1]),
                        key: new Buffer([2]),
                        ca: new Buffer([3])
                    });
                });

                it('should fail with a sensible error message', function () {
                    expect(function () {
                        expect(new HttpRequest({
                            requestLine: 'GET / HTTP/1.1',
                            cert: new Buffer([1]),
                            key: new Buffer([2])
                        }), 'to satisfy', {
                            cert: new Buffer([5]),
                            key: new Buffer([8])
                        });
                    }, 'to throw',
                        'expected GET / HTTP/1.1 to satisfy { cert: Buffer([0x05]), key: Buffer([0x08]) }\n' +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        '\n' +
                        '// cert: expected Buffer([0x01]) to equal Buffer([0x05])\n' +
                        '//\n' +
                        '// -01                                               │.│\n' +
                        '// +05                                               │.│\n' +
                        '// key: expected Buffer([0x02]) to equal Buffer([0x08])\n' +
                        '//\n' +
                        '// -02                                               │.│\n' +
                        '// +08                                               │.│');
                });
            });

            it('should support regexp matching', function () {
                expect(new HttpRequest('GET /foo HTTP/1.1\r\nContent-Type: text/html'), 'to satisfy', {
                    protocolName: /ttp/i
                });
            });

            it('should fail when matching on properties defined by Message', function () {
                expect(new HttpRequest('GET /foo HTTP/1.1\r\nContent-Type: text/html'), 'not to satisfy', {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            });

            it('should match on properties', function () {
                expect(new HttpRequest('GET /foo HTTP/1.1\r\nContent-Type: text/html'), 'to satisfy', {
                    method: 'GET',
                    url: '/foo',
                    protocolVersion: '1.1'
                });
            });

            it('should match exhaustively on headers', function () {
                expect(new HttpRequest('GET /foo?hey HTTP/1.1\r\nContent-Type: text/html'), 'to exhaustively satisfy', {
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            });

            it('should fail to match exhaustively on properties when a header is omitted', function () {
                expect(new HttpRequest('GET /foo?hey HTTP/1.1\r\nContent-Type: text/html'), 'not to exhaustively satisfy', {
                    headers: {}
                });
            });

            it('should produce a diff when the assertion fails', function () {
                expect(function () {
                    expect(new HttpRequest('GET / HTTP/1.1\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {requestLine: {method: 'POST'}, headers: {'Content-Type': 'application/json'}, body: 'blah'});
                }, 'to throw',
                    'expected\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    "  requestLine: { method: 'POST' },\n" +
                    "  headers: { 'Content-Type': 'application/json' },\n" +
                    "  body: 'blah'\n" +
                    '}\n' +
                    '\n' +
                    'GET / HTTP/1.1 // should be POST\n' +
                    '               //\n' +
                    '               // -GET / HTTP/1.1\n' +
                    '               // +POST / HTTP/1.1\n' +
                    'Content-Type: text/html // should equal application/json\n' +
                    '                        //\n' +
                    '                        // -text/html\n' +
                    '                        // +application/json\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when the assertion fails but there is no diff in the status line', function () {
                expect(function () {
                    expect(new HttpRequest('GET / HTTP/1.1\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {requestLine: {method: 'GET'}, headers: {'Content-Type': 'application/json'}, body: 'blah'});
                }, 'to throw',
                    'expected\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    "  requestLine: { method: 'GET' },\n" +
                    "  headers: { 'Content-Type': 'application/json' },\n" +
                    "  body: 'blah'\n" +
                    '}\n' +
                    '\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: text/html // should equal application/json\n' +
                    '                        //\n' +
                    '                        // -text/html\n' +
                    '                        // +application/json\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when the assertion fails but there is no diff in the headers', function () {
                expect(function () {
                    expect(new HttpRequest('GET / HTTP/1.1\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {requestLine: {method: 'POST'}, headers: {'Content-Type': 'text/html'}, body: 'blah'});
                }, 'to throw',
                    'expected\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    "  requestLine: { method: 'POST' },\n" +
                    "  headers: { 'Content-Type': 'text/html' },\n" +
                    "  body: 'blah'\n" +
                    '}\n' +
                    '\n' +
                    'GET / HTTP/1.1 // should be POST\n' +
                    '               //\n' +
                    '               // -GET / HTTP/1.1\n' +
                    '               // +POST / HTTP/1.1\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when the assertion fails, but there is no diff in the body', function () {
                expect(function () {
                    expect(new HttpRequest('GET / HTTP/1.1\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {requestLine: {method: 'POST'}, headers: {'Content-Type': 'application/json'}});
                }, 'to throw',
                    'expected\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    "  requestLine: { method: 'POST' },\n" +
                    "  headers: { 'Content-Type': 'application/json' }\n" +
                    '}\n' +
                    '\n' +
                    'GET / HTTP/1.1 // should be POST\n' +
                    '               //\n' +
                    '               // -GET / HTTP/1.1\n' +
                    '               // +POST / HTTP/1.1\n' +
                    'Content-Type: text/html // should equal application/json\n' +
                    '                        //\n' +
                    '                        // -text/html\n' +
                    '                        // +application/json\n' +
                    '\n' +
                    'argh'
                );
            });
        });
    });

    describe('StatusLine', function () {
        describe('#diff', function () {
            it('must diff the status line when the status code and status message differ', function () {
                expect([
                    new StatusLine('HTTP/1.1 200 OK'),
                    new StatusLine('HTTP/1.1 412 Precondition Failed')
                ], 'to produce a diff of',
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed'
                );
            });

            it('must diff the status line when the protocol differs', function () {
                expect([
                    new StatusLine('HTTP/1.1 200 OK'),
                    new StatusLine('HTTP/1.0 200 OK')
                ], 'to produce a diff of',
                    'HTTP/1.1 200 OK // should be HTTP/1.0 200 OK\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.0 200 OK'
                );
            });

            it('must diff the status line when the status mesage', function () {
                expect([
                    new StatusLine('HTTP/1.1 200 Okie-dokie'),
                    new StatusLine('HTTP/1.1 200 OK')
                ], 'to produce a diff of',
                    'HTTP/1.1 200 Okie-dokie // should be OK\n' +
                    '                        //\n' +
                    '                        // -HTTP/1.1 200 Okie-dokie\n' +
                    '                        // +HTTP/1.1 200 OK'
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('must not break with undefined', function () {
                expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', undefined);
            });

            describe('when satisfying against a number', function () {
                it('should succeed when the number is equal to the status code', function () {
                    expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', 200);
                });

                it('should fail when the number is different from the status code', function () {
                    expect(function () {
                        expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', 412);
                    }, 'to throw',
                        'expected HTTP/1.1 200 OK to satisfy 412\n' +
                        '\n' +
                        'HTTP/1.1 200 OK // should be 412 Precondition Failed');
                });
            });

            describe('when satisfying against a function (expect.it)', function () {
                it('should succeed when the function accepts the status code', function () {
                    expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', expect.it('to equal', 200));
                });

                it('should fail when the function throws when passed the status code', function () {
                    expect(function () {
                        expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', expect.it('to equal', 412));
                    }, 'to throw',
                        "expected HTTP/1.1 200 OK to satisfy expect.it('to equal', 412)\n" +
                        '\n' +
                        'HTTP/1.1 200 OK // expected 200 to equal 412');
                });

                it('should fail when the function throws when passed the status code', function () {
                    expect(function () {
                        expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', expect.it('to be within', 400, 599));
                    }, 'to throw',
                        "expected HTTP/1.1 200 OK to satisfy expect.it('to be within', 400, 599)\n" +
                        '\n' +
                        "HTTP/1.1 200 OK // expected 200 to be within 400..599");
                });
            });

            it('should produce a diff when the assertion fails', function () {
                expect(function () {
                    expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', {protocolVersion: /^2\.\d+$/});
                }, 'to throw',
                    'expected HTTP/1.1 200 OK to satisfy { protocolVersion: /^2\\.\\d+$/ }\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should satisfy { protocolVersion: /^2\\.\\d+$/ }'
                );
            });

            it('should produce a simple diff when a failed assertion only contains equality criteria', function () {
                expect(function () {
                    expect(new StatusLine('HTTP/1.1 200 OK'), 'to satisfy', {statusCode: 412});
                }, 'to throw',
                    "expected HTTP/1.1 200 OK to satisfy { statusCode: 412 }\n" +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed'
                );
            });
        });
    });

    describe('HttpResponse', function () {
        describe('#inspect', function () {
            it('should render an http response with no headers and no body as just the status line with no newline at the end', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK'), 'to inspect as', 'HTTP/1.1 200 OK');
            });

            it('should render an http response with no headers as the status line, then two newlines followed by the body', function () {
                expect(new HttpResponse({statusLine: 'HTTP/1.1 200 OK', body: 'foo'}), 'to inspect as', 'HTTP/1.1 200 OK\n\nfoo');
            });

            it('should render an http response with a single header correctly', function () {
                expect(new HttpResponse({statusLine: 'HTTP/1.1 200 OK', headers: {bar: 'baz'}, body: 'foo'}), 'to inspect as', 'HTTP/1.1 200 OK\nBar: baz\n\nfoo');
            });
        });

        describe('#diff', function () {
            it('must diff the status line', function () {
                expect([
                    new HttpResponse('HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"foo":123}'),
                    new HttpResponse('HTTP/1.1 412 Precondition Failed\nContent-Type: application/json\n\n{"foo":123}')
                ], 'to produce a diff of',
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}'
                );
            });

            it('must diff the headers', function () {
                expect([
                    new HttpResponse('HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"foo":123}'),
                    new HttpResponse('HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}')
                ], 'to produce a diff of',
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: application/json\n' +
                    '// missing Quux: Baz\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}'
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('must not break with undefined', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html'), 'to satisfy', undefined);
            });

            it('should match on properties defined by Message', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html'), 'to satisfy', {
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            });

            describe('with a string as the RHS', function () {
                it('should succeed', function () {
                    expect(new HttpResponse('HTTP/1.1 200 OK'), 'to satisfy', 'HTTP/1.1 200 OK');
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        expect(new HttpResponse('HTTP/1.1 200 OK'), 'to satisfy', 'HTTP/1.1 404 Not Found');
                    }, 'to throw',
                        "expected HTTP/1.1 200 OK to satisfy 'HTTP/1.1 404 Not Found'\n" +
                        "\n" +
                        "HTTP/1.1 200 OK // should be HTTP/1.1 404 Not Found\n" +
                        "                //\n" +
                        "                // -HTTP/1.1 200 OK\n" +
                        "                // +HTTP/1.1 404 Not Found\n"
                    );
                });
            });

            it('should support regexp matching', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html'), 'to satisfy', {
                    protocolName: /ttp/i
                });
            });

            it('should fail when matching on properties defined by Message', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html'), 'not to satisfy', {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            });

            it('should match on properties', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html'), 'to satisfy', {
                    statusCode: 200,
                    protocolVersion: '1.1'
                });
            });

            it('should match exhaustively on headers', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html'), 'to exhaustively satisfy', {
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            });

            it('should fail to match exhaustively on properties when a header is omitted', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html'), 'not to exhaustively satisfy', {
                    headers: {}
                });
            });

            it('should fail to match exhaustively on properties when a property defined by Message is omitted', function () {
                expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nargh'), 'not to exhaustively satisfy', {
                    statusLine: 'HTTP/1.1 200 OK',
                    statusCode: 200,
                    statusMessage: 'OK',
                    protocol: 'HTTP/1.1',
                    protocolName: 'HTTP',
                    protocolVersion: '1.1',
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            });

            it('should produce a diff when the assertion fails', function () {
                expect(function () {
                    expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {statusLine: {statusCode: 412}, headers: {'Content-Type': 'application/json'}, body: 'blah'});
                }, 'to throw',
                    'expected\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    '  statusLine: { statusCode: 412 },\n' +
                    "  headers: { 'Content-Type': 'application/json' },\n" +
                    "  body: 'blah'\n" +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: text/html // should equal application/json\n' +
                    '                        //\n' +
                    '                        // -text/html\n' +
                    '                        // +application/json\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when the assertion fails but there is no diff in the status line', function () {
                expect(function () {
                    expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {statusLine: {statusCode: 200}, headers: {'Content-Type': 'application/json'}, body: 'blah'});
                }, 'to throw',
                    'expected\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    '  statusLine: { statusCode: 200 },\n' +
                    "  headers: { 'Content-Type': 'application/json' },\n" +
                    "  body: 'blah'\n" +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html // should equal application/json\n' +
                    '                        //\n' +
                    '                        // -text/html\n' +
                    '                        // +application/json\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when the assertion fails but there is no diff in the headers', function () {
                expect(function () {
                    expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {statusLine: {statusCode: 200}, headers: {'Content-Type': 'application/json'}, body: 'blah'});
                }, 'to throw',
                    'expected\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    '  statusLine: { statusCode: 200 },\n' +
                    "  headers: { 'Content-Type': 'application/json' },\n" +
                    "  body: 'blah'\n" +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html // should equal application/json\n' +
                    '                        //\n' +
                    '                        // -text/html\n' +
                    '                        // +application/json\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when the assertion fails, but there is no diff in the body', function () {
                expect(function () {
                    expect(new HttpResponse('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'), 'to satisfy', {statusLine: {statusCode: 412}, headers: {'Content-Type': 'application/json'}});
                }, 'to throw',
                    'expected\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    'to satisfy\n' +
                    '{\n' +
                    '  statusLine: { statusCode: 412 },\n' +
                    "  headers: { 'Content-Type': 'application/json' }\n" +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: text/html // should equal application/json\n' +
                    '                        //\n' +
                    '                        // -text/html\n' +
                    '                        // +application/json\n' +
                    '\n' +
                    'argh'
                );
            });
        });
    });

    describe('HttpExchange', function () {
        describe('#inspect', function () {
            it('should render an exchange', function () {
                expect(new HttpExchange({
                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                }), 'to inspect as',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{ foo: 123 }\n' +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz\n' +
                    '\n' +
                    '{ foo: 123 }'
                );
            });

            it('should render an exchange without a request', function () {
                expect(new HttpExchange({
                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                }), 'to inspect as',
                    '<no request>\n' +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz\n' +
                    '\n' +
                    '{ foo: 123 }'
                );
            });

            it('should render an exchange without a response', function () {
                expect(new HttpExchange({
                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}'
                }), 'to inspect as',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{ foo: 123 }\n' +
                    '\n' +
                    '<no response>'
                );
            });
        });

        describe('#diff', function () {
            it('should diff two HttpExchange instances', function () {
                expect([
                    new HttpExchange({
                        request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                        response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                    }),
                    new HttpExchange({
                        request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                        response: 'HTTP/1.1 412 Precondition Failed\nContent-Type: application/json\n\n{"foo":456}'
                    })
                ], 'to produce a diff of',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz // should be removed\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123 // should equal 456\n' +
                    '}'
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('must not break with undefined', function () {
                expect(new HttpExchange({
                    request: 'GET / HTTP/1.1\r\nContent-Type: application/json\r\n\r\n{"foo":"bar"}',
                    response: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'
                }), 'to satisfy', undefined);
            });

            it('should produce a diff when the assertion fails', function () {
                expect(function () {
                    expect(new HttpExchange({
                        request: 'GET / HTTP/1.1\r\nContent-Type: application/json\r\n\r\n{"foo":"bar"}',
                        response: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'
                    }), 'to satisfy', {request: {url: '/foo'}, response: {body: 'blah'}});
                }, 'to throw',
                    'expected\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    "{ foo: 'bar' }\n" +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    "to satisfy { request: { url: '/foo' }, response: { body: 'blah' } }\n" +
                    '\n' +
                    'GET / HTTP/1.1 // should be /foo\n' +
                    '               //\n' +
                    '               // -GET / HTTP/1.1\n' +
                    '               // +GET /foo HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    "{ foo: 'bar' }\n" +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when there is no diff in the request', function () {
                expect(function () {
                    expect(new HttpExchange({
                        request: 'GET / HTTP/1.1\r\nContent-Type: application/json\r\n\r\n{"foo":"bar"}',
                        response: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'
                    }), 'to satisfy', {request: {url: '/'}, response: {body: 'blah'}});
                }, 'to throw',
                    'expected\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    "{ foo: 'bar' }\n" +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    "to satisfy { request: { url: '/' }, response: { body: 'blah' } }\n" +
                    '\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    "{ foo: 'bar' }\n" +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    '-argh\n' +
                    '+blah'
                );
            });

            it('should produce a diff when there is no diff in the response', function () {
                expect(function () {
                    expect(new HttpExchange({
                        request: 'GET / HTTP/1.1\r\nContent-Type: application/json\r\n\r\n{"foo":"bar"}',
                        response: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\nargh'
                    }), 'to satisfy', {request: {url: '/foo'}, response: {body: 'argh'}});
                }, 'to throw',
                    'expected\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    "{ foo: 'bar' }\n" +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh\n' +
                    "to satisfy { request: { url: '/foo' }, response: { body: 'argh' } }\n" +
                    '\n' +
                    'GET / HTTP/1.1 // should be /foo\n' +
                    '               //\n' +
                    '               // -GET / HTTP/1.1\n' +
                    '               // +GET /foo HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    "{ foo: 'bar' }\n" +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: text/html\n' +
                    '\n' +
                    'argh'
                );
            });
        });
    });

    describe('HttpConversation', function () {
        describe('#inspect', function () {
            it('should render a conversation with two exchanges', function () {
                expect(new HttpConversation({
                    exchanges: [
                        {
                            request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                            response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                        },
                        {
                            request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                            response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                        }
                    ]
                }), 'to inspect as',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{ foo: 123 }\n' +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz\n' +
                    '\n' +
                    '{ foo: 123 }\n' +
                    '\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{ foo: 123 }\n' +
                    '\n' +
                    'HTTP/1.1 200 OK\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz\n' +
                    '\n' +
                    '{ foo: 123 }'
                );
            });
        });

        describe('#diff', function () {
            it('should diff two conversations of the same length', function () {
                expect([
                    new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                            },
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                            }
                        ]
                    }),
                    new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 412 Precondition Failed\nContent-Type: application/json\n\n{"foo":456}'
                            },
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 412 Precondition Failed\nContent-Type: application/json\n\n{"foo":456}'
                            }
                        ]
                    })
                ], 'to produce a diff of',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz // should be removed\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123 // should equal 456\n' +
                    '}\n' +
                    '\n' +
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz // should be removed\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123 // should equal 456\n' +
                    '}'
                );
            });

            it('should diff conversations where the first has more exchanges', function () {
                expect([
                    new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                            },
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                            }
                        ]
                    }),
                    new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 412 Precondition Failed\nContent-Type: application/json\n\n{"foo":456}'
                            }
                        ]
                    })
                ], 'to produce a diff of',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz // should be removed\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123 // should equal 456\n' +
                    '}\n' +
                    '\n' +
                    '// should be removed:\n' +
                    '// GET / HTTP/1.1\n' +
                    '// Content-Type: application/json\n' +
                    '// \n' +
                    '// { foo: 123 }\n' +
                    '// \n' +
                    '// HTTP/1.1 200 OK\n' +
                    '// Content-Type: application/json\n' +
                    '// Quux: Baz\n' +
                    '// \n' +
                    '// { foo: 123 }'
                );
            });

            it('should diff conversations where the second has more exchanges', function () {
                expect([
                    new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":123}'
                            }
                        ]
                    }),
                    new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 412 Precondition Failed\nContent-Type: application/json\n\n{"foo":456}'
                            },
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 412 Precondition Failed\nContent-Type: application/json\n\n{"foo":456}'
                            }
                        ]
                    })
                ], 'to produce a diff of',
                    'GET / HTTP/1.1\n' +
                    'Content-Type: application/json\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123\n' +
                    '}\n' +
                    '\n' +
                    'HTTP/1.1 200 OK // should be 412 Precondition Failed\n' +
                    '                //\n' +
                    '                // -HTTP/1.1 200 OK\n' +
                    '                // +HTTP/1.1 412 Precondition Failed\n' +
                    'Content-Type: application/json\n' +
                    'Quux: Baz // should be removed\n' +
                    '\n' +
                    '{\n' +
                    '  foo: 123 // should equal 456\n' +
                    '}\n' +
                    '\n' +
                    '// missing:\n' +
                    '// GET / HTTP/1.1\n' +
                    '// Content-Type: application/json\n' +
                    '// \n' +
                    '// { foo: 123 }\n' +
                    '// \n' +
                    '// HTTP/1.1 412 Precondition Failed\n' +
                    '// Content-Type: application/json\n' +
                    '// \n' +
                    '// { foo: 456 }'
                );
            });
        });

        describe('"to satisfy" assertion', function () {
            it('should satisfy a missing HttpExchange against an object with a messy.HttpResponse instance', function () {
                return expect(function () {
                    return expect(new messy.HttpConversation({
                        exchanges: []
                    }), 'to satisfy', {
                        exchanges: [
                            {
                                response: new messy.HttpResponse(
                                    'HTTP/1.1 404 Not Found\n' +
                                    'Server: CouchDB/1.6.0 (Erlang OTP/17)\n' +
                                    'Cache-Control: must-revalidate\n' +
                                    'Content-Type: application/json\n' +
                                    '\n' +
                                    '{"error":"not_found","reason":"Document is missing attachment"}'
                                )
                            }
                        ]
                    });
                }, 'to error',
                    "expected <empty conversation> to satisfy { exchanges: [ { response: ... } ] }\n" +
                    "\n" +
                    "// missing:\n" +
                    "// <no request>\n" +
                    "//\n" +
                    "// HTTP/1.1 404 Not Found\n" +
                    "// Server: CouchDB/1.6.0 (Erlang OTP/17)\n" +
                    "// Cache-Control: must-revalidate\n" +
                    "// Content-Type: application/json\n" +
                    "//\n" +
                    "// { error: 'not_found', reason: 'Document is missing attachment' }"
                );
            });

            it('must not break with undefined', function () {
                expect(new HttpConversation(), 'to satisfy', undefined);
            });

            describe('against an array', function () {
                it('should succeed', function () {
                    expect(new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":456}'
                            }
                        ]
                    }), 'to satisfy', { exchanges: [ { request: { method: 'GET', path: '/' }, response: { headers: { Quux: 'Baz' } } } ] });
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        expect(new HttpConversation({
                            exchanges: [
                                {
                                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":456}'
                                }
                            ]
                        }), 'to satisfy', { exchanges: [ { request: { method: 'GET', path: '/foo' } } ] });
                    }, 'to throw',
                        'expected\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        'Quux: Baz\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        "to satisfy { exchanges: [ { request: ... } ] }\n" +
                        '\n' +
                        'GET / HTTP/1.1 // should be GET /foo\n' +
                        '               //\n' +
                        '               // -GET / HTTP/1.1\n' +
                        '               // +GET /foo HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        'Quux: Baz\n' +
                        '\n' +
                        '{ foo: 456 }'
                    );
                });

                it('should fail with a diff when the value contains too few exchanges', function () {
                    expect(function () {
                        expect(new HttpConversation({
                            exchanges: [
                                {
                                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"foo":456}'
                                },
                                {
                                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"foo":456}'
                                }
                            ]
                        }), 'to satisfy', { exchanges: [ {} ] });
                    }, 'to throw',
                        'expected\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        "to satisfy { exchanges: [ {} ] }\n" +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        '\n' +
                        '// should be removed:\n' +
                        '// GET / HTTP/1.1\n' +
                        '// Content-Type: application/json\n' +
                        '//\n' +
                        '// { foo: 123 }\n' +
                        '//\n' +
                        '// HTTP/1.1 200 OK\n' +
                        '// Content-Type: application/json\n' +
                        '//\n' +
                        '// { foo: 456 }'
                    );
                });

                it('should fail with a diff when the value contains too many exchanges', function () {
                    expect(function () {
                        expect(new HttpConversation({
                            exchanges: [
                                {
                                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"foo":456}'
                                }
                            ]
                        }), 'to satisfy', { exchanges: [ {}, { request: { url: 'GET /', headers: { Quux: 'baz' } } } ] });
                    }, 'to throw',
                        'expected\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        "to satisfy { exchanges: [ {}, { request: ... } ] }\n" +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        '\n' +
                        '// missing:\n' +
                        '// GET /\n' +
                        '// Quux: baz\n' +
                        '//\n' +
                        '// <no response>'
                    );
                });

                it('should fail with a diff when the value contains too many exchanges and the value contains complex "to satisfy" terms', function () {
                    expect(function () {
                        expect(new HttpConversation({
                            exchanges: [
                                {
                                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"foo":456}'
                                }
                            ]
                        }), 'to satisfy', { exchanges: [ {}, { request: { url: 'GET /', headers: { Foo: /bar/, Quux: 'baz' } } } ] });
                    }, 'to throw',
                        'expected\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        "to satisfy { exchanges: [ {}, { request: ... } ] }\n" +
                        '\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        '\n' +
                        '// missing:\n' +
                        '// GET /\n' +
                        '// Foo: // should match /bar/\n' +
                        '// Quux: baz\n' +
                        '//\n' +
                        '// <no response>'
                    );
                });
            });

            describe('against an object', function () {
                it('should succeed', function () {
                    expect(new HttpConversation({
                        exchanges: [
                            {
                                request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":456}'
                            }
                        ]
                    }), 'to satisfy', { exchanges: { 0: { request: { method: 'GET', path: '/' }, response: { headers: { Quux: 'Baz' } } } } });
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        expect(new HttpConversation({
                            exchanges: [
                                {
                                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":456}'
                                }
                            ]
                        }), 'to satisfy', { exchanges: { 0: { request: { method: 'GET', path: '/foo' } } } });
                    }, 'to throw',
                        'expected\n' +
                        'GET / HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        'Quux: Baz\n' +
                        '\n' +
                        '{ foo: 456 }\n' +
                        "to satisfy { exchanges: { 0: { request: ... } } }\n" +
                        '\n' +
                        'GET / HTTP/1.1 // should be GET /foo\n' +
                        '               //\n' +
                        '               // -GET / HTTP/1.1\n' +
                        '               // +GET /foo HTTP/1.1\n' +
                        'Content-Type: application/json\n' +
                        '\n' +
                        '{ foo: 123 }\n' +
                        '\n' +
                        'HTTP/1.1 200 OK\n' +
                        'Content-Type: application/json\n' +
                        'Quux: Baz\n' +
                        '\n' +
                        '{ foo: 456 }'
                    );
                });
            });

            describe('in an async setting', function () {
                it('should fail with a diff', function () {
                    return expect(
                        expect(new HttpConversation({
                            exchanges: [
                                {
                                    request: 'GET / HTTP/1.1\nContent-Type: application/json\n\n{"foo":123}',
                                    response: 'HTTP/1.1 200 OK\nContent-Type: application/json\nQuux: Baz\n\n{"foo":456}'
                                }
                            ]
                        }), 'to satisfy', {
                            exchanges: [
                                {
                                    request: {
                                        method: 'GET',
                                        path: '/foo',
                                        body: expect.it('when delayed a little bit', 'to equal', {foo: 987})
                                    },
                                    response: {
                                        statusCode: expect.it('when delayed a little bit', 'to equal', 200),
                                        headers: {
                                            Quux: expect.it('when delayed a little bit', 'to equal', 'bar')
                                        },
                                        body: expect.it('when delayed a little bit', 'to equal', {foo: 789})
                                    }
                                }
                            ]
                        }),
                        'when rejected',
                        'to have message',
                            'expected\n' +
                            'GET / HTTP/1.1\n' +
                            'Content-Type: application/json\n' +
                            '\n' +
                            '{ foo: 123 }\n' +
                            '\n' +
                            'HTTP/1.1 200 OK\n' +
                            'Content-Type: application/json\n' +
                            'Quux: Baz\n' +
                            '\n' +
                            '{ foo: 456 }\n' +
                            "to satisfy { exchanges: [ { request: ..., response: ... } ] }\n" +
                            '\n' +
                            'GET / HTTP/1.1 // should be GET /foo\n' +
                            '               //\n' +
                            '               // -GET / HTTP/1.1\n' +
                            '               // +GET /foo HTTP/1.1\n' +
                            'Content-Type: application/json\n' +
                            '\n' +
                            'expected { foo: 123 } when delayed a little bit to equal { foo: 987 }\n' +
                            '\n' +
                            '{\n' +
                            '  foo: 123 // should equal 987\n' +
                            '}\n' +
                            '\n' +
                            'HTTP/1.1 200 OK\n' +
                            'Content-Type: application/json\n' +
                            "Quux: Baz // should satisfy expect.it('when delayed a little bit', 'to equal', 'bar')\n" +
                            "          //\n" +
                            "          // expected 'Baz' when delayed a little bit to equal 'bar'\n" +
                            "          //\n" +
                            "          // -Baz\n" +
                            "          // +bar\n" +
                            '\n' +
                            'expected { foo: 456 } when delayed a little bit to equal { foo: 789 }\n' +
                            '\n' +
                            '{\n' +
                            '  foo: 456 // should equal 789\n' +
                            '}'
                    );
                });
            });
        });
    });
});
