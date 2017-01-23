Executes a request defined as a compact string asserts the response received
matches what was expected.

```js
describe('unexpected.js.org', function () {
    it('should reply with HTML', function () {
        return expect('GET http://unexpected.js.org/', 'to yield response', {
            statusCode: 200,
            headers: {
                'Content-Type': /text\/html/
            },
            body: /<html>/
        });
    });
});
```
