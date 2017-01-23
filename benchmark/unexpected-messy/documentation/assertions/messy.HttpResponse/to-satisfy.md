A specific implementation of the [to satisfy](http://unexpected.js.org/assertions/any/to-satisfy/) assertion
for use with [messy.HttpResponse](https://github.com/papandreou/messy) instances.

Asserts that a messy.HttpResponse instance satisfies the given spec:

```js
var httpResponse = new messy.HttpResponse({
    headers: {
        'Content-Type': 'image/png'
    },
    body: require('fs').readFileSync('documentation/assertions/messy.HttpResponse/magic-pen-6-colours.jpg')
});

expect(httpResponse, 'to satisfy', { headers: { 'Content-Type': 'image/gif' } });
```

```output
expected

Content-Type: image/png

Buffer[13509] (image/png)
to satisfy { headers: { 'Content-Type': 'image/gif' } }


Content-Type: image/png // should equal image/gif
                        //
                        // -image/png
                        // +image/gif

Buffer[13509] (image/png)
```
