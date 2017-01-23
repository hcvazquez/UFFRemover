# TableView
**TableView** is a [Backbone.js](http://backbonejs.org/) view that provides full 
lifecycle support for tables, including headers, filtering and sorting. It remains 
simple, fluent, and idiomatic by relying on [KinView](https://github.com/mbrevda/backbone-kinview)
for the underlying view management.

# Installation

TableView has been designed to `require`'d by [browserify](http://browserify.org/),
and is currently only supported in that environment. To install:

```
npm install backbone-tableview --save
```

# Code

## CI
TableView continuous integrations is handled by Wercker:

[![wercker status](https://app.wercker.com/status/ed888333a4f3fb17e3738866f446c5b9/s/master "wercker status")](https://app.wercker.com/project/bykey/ed888333a4f3fb17e3738866f446c5b9)

## Testing
TableView maintains 100% test coverage. To manually run the tests, install with with --dev (as above) and run:

```
gulp testc
```

You can generate a HTML code coverage report by appending the `--html` switch

## Issues
Issues can be opened in the [usual location](https://github.com/mbrevda/backbone-tableview/issues), pull requests welcome!

# Usage
## Prerequisits
TableViews sorting options (see below) use [Font Awesome's](http://fortawesome.github.io/Font-Awesome/) [fa-caret-up](http://fortawesome.github.io/Font-Awesome/icon/caret-up/) and [fa-caret-down](http://fortawesome.github.io/Font-Awesome/icon/caret-down/) class to indicate sort status. Additionally, roughly the following css is used:

```css

table thead tr th {
  color: gray;
  text-align: center;
  vertical-align: middle;
  padding-left: 12px;
}
table thead tr th i {
  visibility: hidden;
  display: inline !important;
  /* force icon not to wrap */
  margin-left: 4px;
}
table thead tr th.sortable {
  cursor: pointer;
}
table thead tr th.sortable:hover {
  cursor: pointer;
  color: orange;
}
table thead tr th.active {
  color: orange;
}
```
 
## Getting started
Getting started with TableView is as simple as creating a new Backbone view:

```js
var TableView = require('backbone-tableview')

var table = TableView.extend({
    // regular Backbone.View opts here
    // remember to call this.render() in the initialize method!
})

```

Note that `this` in TableView contains an extremely limited amount of table manipulation tools. To access most methods, call their containers. I.e. `this.body.someMethod()`

### Adding Columns (table headers)
Adding table headers is straightforward:

```js
this.addColumn({text: 'foo'})

```

### Adding Rows
Adding rows to the table requires passing a valid Backbone.Model to the table:

```js

var m = new Backbone.Model({foo: 'bar'})
this.addRow(m)
```

Passing a collection to the table will allow the table to auto-append all items of the collection to the table and manage their lifecycle including adding items as they get added to the collection, appending the items to the table, and cleaning up when the child view is removed. To pass a collection to the table:

```js
var collection = new Backbone.Collection([/* models */])
table.body.setCollection(collection)
```

TabelView includes a generic `tr` generator which simple takes all attributes in a model and appends them as a `td`. In some cases, it may be desirable to have a more elaborate `tr` build that can use a custom template or manipulate values before appending them.

To do that, create a custom view that extends `TableView.tbodyTr`. Here is an example of what such a view might look like:

```js
var Backbone = require('backbone'),
    TableView = require('backbone-tableview'),
    _ = require('underscore')


module.exports = TableView.tbodyTr.extend({
    render: function() {
        var data = this.model.toJSON()
        data.amount = '$' + parseFloat(data.amount).toFixed(0)
        var tr = _.reduce(data, function(tr, attr){
            return tr += '<td>' + attr + '</td>'
        }, '')

        this.$el.html(tr)
    }
})
```

Set the body to use the custom tr view by setting the `tr` attribute of the body. i.e.:

```js
this.body.childView = require('my-custom-tr')
```

## Filtering & Sorting
**Filtering and Sorting has been delegated to [backbone-collectionview](https://github.com/mbrevda/backbone-collectionview)**

TableView delegates to Backbone CollectionView for filtering the data displayed in the table.  TableView can also sort the table based on the table header (`thead > tr > th`, herein 'column'). Sorting is done when a click event is received on the `th` element. To learn more about filtering, please see the CollectionView documentation. Currently, only the tbody view implements collectionview.

### Sorting rows
**Sorting will soon be removed from TableView** It will be replaced by sorting via CollectionView

To specify that a column should be sortable, pass it a sorter when creating it:

```js
table.addCol({
    text: 'foo',
    click: this.body.getSorter('attribute', function(){/* do something */})
})

```

The builtin `Sorter` class includes two simple sorters, 'string' and 'int'. You can use either like:

```js
table.addCol({
    text: 'foo',
    click: this.body.getSorter('attribute', 'string')
})

```

There are three sort 'states': 1. up, 2. down, 3. reset. The first two are obvious; reset resets the collection to its original order but sorting based on the the models `cid` attribute. TableView should handle the states without any intervention.

### Adding a custom sorter
Custom sorters can be passed as shown above. A sorter takes two models and returns a `true` if the first model sorts higher than the second.

A sorter should have the following signature:

```js
function(a, b)
```
where `a` and `b` are the models that will be compared. 

Sorting methods should use the `getAttr(model, attribute)` method to retrieve the value to compare:

```js
var firstValue = getAttr(a, this.attr)
var secondValue = getAttr(b, this.attr)
```

The function should check the boolean `this.isReverse` to determine the sort order and should return `true` if `a` should be sorted higher than `b`, otherwise `false`. See the [builtin sorter methods](https://github.com/mbrevda/backbone-tableview/blob/master/src/sorter.js#L35-L56) for an example. 
