---
template: default.ejs
theme: dark
title: unexpected-messy
repository: https://github.com/unexpectedjs/unexpected-messy
---

# Unexpected-messy

Plugin for [Unexpected](https://github.com/unexpectedjs/unexpected) that adds the ability to inspect and match instances of the HttpRequest, HttpResponse, HttpExchange, HttpConversation, Mail, and Message classes from the [Messy library](https://github.com/papandreou/messy). It's originally built for [unexpected-express](https://github.com/unexpectedjs/unexpected-express), [unexpected-mitm](https://github.com/unexpectedjs/unexpected-mitm) and [unexpected-http](https://github.com/unexpectedjs/unexpected-http), but can also be used standalone.

[![NPM version](https://badge.fury.io/js/unexpected-messy.svg)](http://badge.fury.io/js/unexpected-messy)
[![Build Status](https://travis-ci.org/unexpectedjs/unexpected-messy.svg?branch=master)](https://travis-ci.org/unexpectedjs/unexpected-messy)
[![Coverage Status](https://coveralls.io/repos/unexpectedjs/unexpected-messy/badge.svg)](https://coveralls.io/r/unexpectedjs/unexpected-messy)
[![Dependency Status](https://david-dm.org/unexpectedjs/unexpected-messy.svg)](https://david-dm.org/unexpectedjs/unexpected-express)

In particular, it adds support for the `to satisfy` assertion so that you can express your assertions using a very compact and precise syntax. When the conditions are not met, you get a full diff that includes the entire object as a single unit:

```js#evaluate:false
var messy = require('messy');
var expect = require('unexpected').clone().installPlugin(require('./lib/unexpectedMessy'));
```
```js
expect(new messy.HttpResponse(
    'HTTP/1.1 200 OK\r\n' +
    'Content-Type: application/json\r\n' +
    '\r\n' +
    '{"foo":"bar","baz":456}'
), 'to satisfy', {statusCode: 404, body: {baz: expect.it('to be greater than', 1024)}});
```

```output
expected
HTTP/1.1 200 OK
Content-Type: application/json

{ foo: 'bar', baz: 456 }
to satisfy { statusCode: 404, body: { baz: expect.it('to be greater than', 1024) } }

HTTP/1.1 200 OK // should be 404 Not Found
                //
                // -HTTP/1.1 200 OK
                // +HTTP/1.1 404 Not Found
Content-Type: application/json

{
  foo: 'bar',
  baz: 456 // should be greater than 1024
}
```
