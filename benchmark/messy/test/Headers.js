/*global describe, it*/
var unexpected = require('unexpected'),
    Headers = require('../lib/Headers');

describe('Headers', function () {
    var expect = unexpected.clone();

    // Not published yet
    try {
        expect.installPlugin(require('unexpected-messy'));
    } catch (e) {}

    it('should accept a string', function () {
        var headers = new Headers('Subject: hey, dude!');
        expect(headers.get('subject'), 'to equal', 'hey, dude!');
        expect(headers.toString(), 'to equal', 'Subject: hey, dude!\r\n');
    });

    it('should fold the lines when serializing', function () {
        var headers = new Headers({subject: 'hey there, dude!'});
        expect(headers.toString(10), 'to equal', 'Subject: hey\r\n there,\r\n dude!\r\n');
    });

    it('should accept an array header value when instantiating via an Object', function () {
        var headers = new Headers({received: ['foo', 'bar']});

        expect(headers.toString(), 'to equal', 'Received: foo\r\nReceived: bar\r\n');
    });

    it('should accept a string header value', function () {
        var headers = new Headers({received: 'foo'});

        expect(headers.toString(), 'to equal', 'Received: foo\r\n');
    });

    it('should accept multiple occurrences of the same header with different casing', function () {
        var headers = new Headers({cookie: 'foo=bar', Cookie: 'quux=baz'});

        expect(headers.toString(), 'to equal', 'Cookie: foo=bar\r\nCookie: quux=baz\r\n');
    });

    it('should accept multiple occurrences of the same header with different casing when the first is given as an array', function () {
        var headers = new Headers({cookie: ['foo=bar'], Cookie: 'quux=baz'});

        expect(headers.toString(), 'to equal', 'Cookie: foo=bar\r\nCookie: quux=baz\r\n');
    });

    it('should accept multiple occurrences of the same header with different casing when the second is given as an array', function () {
        var headers = new Headers({cookie: 'foo=bar', Cookie: ['quux=baz']});

        expect(headers.toString(), 'to equal', 'Cookie: foo=bar\r\nCookie: quux=baz\r\n');
    });

    describe('#remove', function () {
        it('should remove all header values for the given header when only passed one argument', function () {
            var headers = new Headers({foo: ['bla', 'bar'], quux: 'baz'});
            headers.remove('foo');
            expect(headers, 'to equal', new Headers({quux: 'baz'}));
        });

        it('should remove a single header value', function () {
            var headers = new Headers({foo: 'bar', quux: 'baz'});
            headers.remove('foo', 'bar');
            expect(headers, 'to equal', new Headers({quux: 'baz'}));
        });

        it('should remove one out of multiple values', function () {
            var headers = new Headers({foo: ['bar', 'bla'], quux: 'baz'});
            headers.remove('foo', 'bar');
            expect(headers, 'to equal', new Headers({foo: 'bla', quux: 'baz'}));
        });

        it('should remove multiple values, leaving one', function () {
            var headers = new Headers({foo: ['bar', 'bla', 'hey'], quux: 'baz'});
            headers.remove('foo', ['bar', 'hey']);
            expect(headers, 'to equal', new Headers({foo: 'bla', quux: 'baz'}));
        });

        it('should remove multiple values, leaving none', function () {
            var headers = new Headers({foo: ['bla', 'hey'], quux: 'baz'});
            headers.remove('foo', ['hey', 'bla']);
            expect(headers, 'to equal', new Headers({quux: 'baz'}));
            expect(headers.valuesByName.foo, 'to be undefined');
        });

        it('should remove all header values found in object', function () {
            var headers = new Headers({foo: ['bla', 'bar'], quux: 'baz'});
            expect(headers.remove({foo: 'bar', quux: 'baz'}), 'to equal', 2);
            expect(headers, 'to equal', new Headers({foo: 'bla'}));
        });

        it('should remove header value specified by number', function () {
            var headers = new Headers({foo: ['bla', 'bar'], quux: 'baz'});
            expect(headers.remove('foo', 1), 'to equal', 1);
            expect(headers.remove('foo', 1), 'to equal', 0);
            expect(headers, 'to equal', new Headers({foo: 'bla', quux: 'baz'}));
        });

        it('should return the number of removed values when removing all values of a header', function () {
            expect(new Headers({foo: ['bla', 'hey'], quux: 'baz'}).remove('foo'), 'to equal', 2);
        });

        it('should return the number of removed values when removing one out of two', function () {
            expect(new Headers({foo: ['bla', 'hey'], quux: 'baz'}).remove('foo', 'hey'), 'to equal', 1);
        });

        it('should return the number of removed values when removing two out of two', function () {
            expect(new Headers({foo: ['bla', 'hey'], quux: 'baz'}).remove('foo', ['bla', 'hey']), 'to equal', 2);
        });

        it('should return 0 when the attempting to remove a single value that was not found', function () {
            expect(new Headers({foo: 'hey', quux: 'baz'}).remove('foo', 'dah'), 'to equal', 0);
        });

        it('should return 0 when the attempting to remove multiple value that were not found', function () {
            expect(new Headers({foo: 'hey', quux: 'baz'}).remove('foo', ['dah', 'bla']), 'to equal', 0);
        });
    });

    describe('#toCanonicalObject', function () {
        expect(new Headers({foo: 'hey', quux: 'baz'}).toCanonicalObject(), 'to equal', {
            Foo: ['hey'],
            Quux: ['baz']
        });
    });

    describe('#set', function () {
        it('should preserve existing values when adding a string value', function () {
            var headers = new Headers({foo: 'bar'});
            expect(headers.toString(), 'to equal', 'Foo: bar\r\n');
            headers.set('foo', 'quux');
            expect(headers.toString(), 'to equal', 'Foo: bar\r\nFoo: quux\r\n');
        });

        it('should remove all existing values when passed an empty array', function () {
            var headers = new Headers({foo: 'bar'});
            expect(headers.toString(), 'to equal', 'Foo: bar\r\n');
            headers.set('foo', []);
            expect(headers.valuesByName.foo, 'to be undefined');
            expect(headers.toString(), 'to equal', '');
        });

        it('should replace existing values when passed an array of strings', function () {
            var headers = new Headers({foo: 'bar'});
            expect(headers.toString(), 'to equal', 'Foo: bar\r\n');
            headers.set('foo', ['hey']);
            expect(headers.toString(), 'to equal', 'Foo: hey\r\n');
        });

        describe('when passed an object', function () {
            it('should act as a shorthand for calling set with each (key, value)', function () {
                var headers = new Headers({foo: 'bar', baz: 'quux'});
                headers.set({
                    foo: [ 'bar2' ],
                    baz: 'quux2',
                    yadda: 'blah'
                });
                expect(headers.toString(), 'to equal', 'Foo: bar2\r\nBaz: quux\r\nBaz: quux2\r\nYadda: blah\r\n');
            });
        });
    });

    describe('#parameter()', function () {
        describe('when called with just a header name', function () {
            it('should return a hash of attributes when the header has attributes', function () {
                expect(new Headers('Foo: bar; quux=baz').parameter('Foo'), 'to equal', {quux: 'baz'});
            });

            it('should unquote quoted parameters', function () {
                expect(new Headers('Foo: bar; quux="baz"').parameter('Foo'), 'to equal', {quux: 'baz'});
            });

            it('should return an empty hash when the header has no attributes', function () {
                expect(new Headers('Foo: bar').parameter('Foo'), 'to equal', {});
            });

            it('should return undefined when the header does not exist', function () {
                expect(new Headers('Foo: bar').parameter('Quux'), 'to equal', undefined);
            });

            it('should decode rfc2231-encoded attributes', function () {
                expect(new Headers(
                'Content-Type: text/plain;\r\n' +
                ' filename*0*=utf-8\'\'%72%C3%A6%61%6C%6C%79%20%73%63%72%65%77%65%64%20%75;\r\n' +
                ' filename*1*=%70%20%6C%6F%6E%67%20%61%74%74%61%63%68%6D%65%6E%74%20%66%69;\r\n' +
                ' filename*2*=%6C%65%6E%61%6D%65%20%77%69%74%68%20%73%6D%69%6C%65%79%73%E2;\r\n' +
                ' filename*3*=%98%BA%20%61%6E%64%20%E2%98%BA%61%6E%64%20%C2%A1%48%6F%6C%61;\r\n' +
                ' filename*4*=%2C%20%73%65%C3%B1%6F%72%21%20%61%6E%64%20%66%6F%72%65%69%67;\r\n' +
                ' filename*5*=%6E%20%77%65%69%72%64%6E%65%73%73%D7%9D%D7%95%D7%9C%D7%A9%20;\r\n' +
                ' filename*6*=%D7%9F%D7%91%20%D7%99%D7%9C%D7%98%D7%A4%D7%A0%20%69%6E%20%69;\r\n' +
                ' filename*7*=%74%2E%E2%98%BA').parameter('Content-Type'), 'to equal', {
                    filename: 'ræally screwed up long attachment filename with smileys☺ and ☺and ¡Hola, señor! and foreign weirdnessםולש ןב ילטפנ in it.☺'
                });
            });
        });

        describe('when called with a header name and an attribute name', function () {
            it('should return the attribute value', function () {
                expect(new Headers('Foo: hey').parameter('Foo'), 'to equal', {});
            });

            it('should return undefined when the header has no attributes', function () {
                expect(new Headers('Foo: hey').parameter('Foo', 'bar'), 'to equal', undefined);
            });

            it('should return undefined when the header has attributes, but not the one being asked for', function () {
                expect(new Headers('Foo: hey; quux=blah').parameter('Foo', 'bar'), 'to equal', undefined);
            });

            it('should return undefined when the header is not there', function () {
                expect(new Headers('Foo: bar').parameter('Bar', 'quux'), 'to equal', undefined);
            });
        });

        describe('when called with a header name, an attribute name, and an attribute value', function () {
            it('should define the attribute if it does not exist', function () {
                var headers = new Headers('Foo: hey');
                headers.parameter('Foo', 'blah', 'baz');
                expect(headers.toString(), 'to equal', 'Foo: hey; blah=baz\r\n');
            });

            it('should update the attribute if it already exists', function () {
                var headers = new Headers('Foo: hey; blah=quux');
                headers.parameter('Foo', 'blah', 'baz');
                expect(headers.toString(), 'to equal', 'Foo: hey; blah=baz\r\n');
            });

            it('should transparently encode non-ASCII attribute values using rfc2231', function () {
                var headers = new Headers('Content-Type: text/plain');
                headers.parameter('Content-Type', 'filename', 'ræally screwed up long attachment filename with smileys☺ and ☺and ¡Hola, señor! and foreign weirdnessםולש ןב ילטפנ in it.☺');
                expect(
                    headers.toString(),
                    'to equal',
                    'Content-Type: text/plain;\r\n' +
                    ' filename*0*=utf-8\'\'%72%C3%A6%61%6C%6C%79%20%73%63%72%65%77%65%64%20%75;\r\n' +
                    ' filename*1*=%70%20%6C%6F%6E%67%20%61%74%74%61%63%68%6D%65%6E%74%20%66%69;\r\n' +
                    ' filename*2*=%6C%65%6E%61%6D%65%20%77%69%74%68%20%73%6D%69%6C%65%79%73%E2;\r\n' +
                    ' filename*3*=%98%BA%20%61%6E%64%20%E2%98%BA%61%6E%64%20%C2%A1%48%6F%6C%61;\r\n' +
                    ' filename*4*=%2C%20%73%65%C3%B1%6F%72%21%20%61%6E%64%20%66%6F%72%65%69%67;\r\n' +
                    ' filename*5*=%6E%20%77%65%69%72%64%6E%65%73%73%D7%9D%D7%95%D7%9C%D7%A9%20;\r\n' +
                    ' filename*6*=%D7%9F%D7%91%20%D7%99%D7%9C%D7%98%D7%A4%D7%A0%20%69%6E%20%69;\r\n' +
                    ' filename*7*=%74%2E%E2%98%BA\r\n'
                );
            });
        });
    });

    describe('#toJSON', function () {
        it('should output a single-value header as a string', function () {
            expect(new Headers('Foo: bar').toJSON(), 'to equal', { Foo: 'bar' });
        });

        it('should output a multi-value header as an array of strings', function () {
            expect(new Headers('Foo: bar\r\nFoo: quux').toJSON(), 'to equal', { Foo: [ 'bar', 'quux' ] });
        });
    });
});
