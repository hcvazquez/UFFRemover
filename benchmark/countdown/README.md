# angular-countdown [![Build Status](https://travis-ci.org/bendrucker/angular-countdown.svg?branch=master)](https://travis-ci.org/bendrucker/angular-countdown)

Radial countdown component for Angular built with SVG.

![angular-countdown example with terrible frame rate](http://f.cl.ly/items/002W2S362V2u1I1l292b/Screen%20Recording%202015-02-20%20at%2009.21%20PM.gif)

## Installing

```sh
# npm
npm install angular-countdown
# bower
bower install angular-countdown
```

```js
angular.module('myApp', [
  require('angular-countdown')
]);
// or with script tags
angular.module('myApp', [
  'countdown'
]);
```

## API

angular-countdown provides two interfaces designed to be used together:

1. A `CountdownTimer` service which you'll typically inject into your controllers to create new timers
2. A `<countdown>` directive which consumes the `CountdownTimer` instances you'll create

### `CountdownTimer`

##### `new CountdownTimer(length [, options])`

Creates a new countdown `timer` with the given `length` (milliseconds). `options` may include:

`tickInterval`: a `Number` that specifies how often to update the radial countdown in milliseconds. Defaults to `15`.

A `CountdownTimer` is an [`EventEmitter`](http://nodejs.org/api/events.html). 

##### `timer.start()` -> `timer`

Starts the `timer`. At each interval (as defined by `options.tickInterval`), the `timer` will emit a `'tick'` event with one argument: the proportion of the tick to the `length`. So if you start a timer for 1.5 seconds, ticking every 15ms, each tick is 15/1500 or 1/100.

When the `length` has passed, the `timer` will emit a `'done'` event. 

##### `timer.cancel()` -> `timer`

Cancels the `timer` and cleans up the `$interval` backing it. Emits a `'done'` event.

### `<countdown>`

```html
<countdown timer="timer" radius="15" stroke="5"></countdown>
```

The `<countdown>` directive accepts three parameters: the `timer` to bind to, the `radius` of the timer circle, and the `width` of the stroke. It builds the SVG needed to create the radial timer effect.

For an example, run `npm run example`. 

## Credits

Inspired by [svgPieTimer.js](https://github.com/agrimsrud/svgPieTimer.js)
