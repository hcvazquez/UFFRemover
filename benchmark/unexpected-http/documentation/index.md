---
template: default.ejs
theme: dark
title: unexpected-http
repository: https://github.com/unexpectedjs/unexpected-http
---

unexpected-http
===============

This plugin provides assertions alowing HTTP requests to be declaratively
specified which are issued and the responses checked against expectations.

Works with node.js and in browsers via [browserify](http://browserify.org) (see [example](../tests/index.html)).

Request Syntax
--------------

Unexpected-HTTP has a declarative syntax for specifying requests to peform.

### String

A single string of the form "<method> <url>" that will be parsed and the appropriate
request issued - see [string assertion](./assertions/string/to-yield-response/).

```js
describe('unexpected.js.org', function () {
    it('should respond', function () {
        return expect('GET http://unexpected.js.org/', 'to yield response', 200);
    });
});
```

### Object

An object containing the request properties to be executed - see
[object assertion](./assertions/object/to-yield-response/).

```js
describe('google.com', function () {
    it('should respond appropriately disallowing POST', function () {
        return expect({
            url: 'http://google.com/',
            method: 'POST'
        }, 'to yield response', 405);
    });
});
```

License
-------

Unexpected-http is licensed under a standard 3-clause BSD license -- see the `LICENSE` file for details.
