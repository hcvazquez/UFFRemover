A specific implementation of the [to satisfy](http://unexpected.js.org/assertions/any/to-satisfy/) assertion
for use with [messy.Headers](https://github.com/papandreou/messy) instances.

Asserts that a `messy.Headers` instance satisfies the given spec. You can assert
the presence of headers by providing an object with the expected headers:

```js
expect(new messy.Headers('foo: bar'), 'to satisfy', {
    Foo: 'bar'
});
```

Note that the header names are matched case insensitively.

You can assert the absence of a header by passing a value of `undefined`:

```js
expect(new messy.Headers('Quux: baz\r\nFoo: bar'), 'to satisfy', {
    Foo: undefined
});
```

```output
expected
Quux: baz
Foo: bar
to satisfy { Foo: undefined }

Quux: baz
Foo: bar // should be removed
```

Multi-value headers are supported. Satisfying a multi-value header against a
string will check that at least one of the values is equal to the string:

```js
expect(new messy.Headers({
    Foo: ['bar', 'quux']
}), 'to satisfy', {
    Foo: 'bar'
});
```

Satisfying a multi-value header against a string will assert that all the
array items are present as values of the given header:

```js
expect(new messy.Headers({
    Foo: 'bar'
}), 'to satisfy', {
    Foo: ['quux', 'bar']
});
```

```output
expected Foo: bar to satisfy { Foo: [ 'quux', 'bar' ] }

Foo: bar
// missing Foo: quux
```
