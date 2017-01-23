Executes a request from the object definition provided and asserts that the
response received matches what was expected.

```js
describe('google.com', function () {
    it('should return an error on POST', function () {
        return expect({
            url: 'POST http://www.google.com',
            body: {
                foo: 'bar'
            }
        }, 'to yield response', {
            statusCode: 405
        });
    });
});
```
