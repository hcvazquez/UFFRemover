A specific implementation of the [to satisfy](http://unexpected.js.org/assertions/any/to-satisfy/) assertion
for use with [messy.HttpRequest](https://github.com/papandreou/messy) instances.

Asserts that a `messy.HttpRequest` instance satisfies the given spec:

```js
var httpRequest = new messy.HttpRequest(
    'GET /foo HTTP/1.1\n' +
    'Content-Type: text/plain; charset=UTF-8\n' +
    'Content-Length: 13\n' +
    '\n' +
    'Hello, world!'
);

expect(httpRequest, 'to satisfy', {
    method: 'POST',
    headers: {
        Foo: 'bar',
        'Content-Length': 13
    },
    body: /Hi/
});
```

```output
expected
GET /foo HTTP/1.1
Content-Type: text/plain; charset=UTF-8
Content-Length: 13

Hello, world!
to satisfy
{
  method: 'POST', headers: { Foo: 'bar', 'Content-Length': 13 },
  body: /Hi/
}

GET /foo HTTP/1.1 // should be POST
                  //
                  // -GET /foo HTTP/1.1
                  // +POST / HTTP/1.1
Content-Type: text/plain; charset=UTF-8
Content-Length: 13
// missing Foo: bar

Hello, world! // should match /Hi/
```
