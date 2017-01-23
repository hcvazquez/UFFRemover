var Backbone = require('backbone'),
    KinView = require('backbone-kinview'),
    Row = require('./theadTr.js')

module.exports = KinView.extend({
    tagName: 'thead',
    initialize: function() {
        this.row = new Row()
        this.render()
    },
    render: function() {
        this.el.appendChild(this.row.el)
    },
    // raw add, you should probably be using this.row.addCol()
    add: function() {
        return this.row.add.apply(this.row, arguments)
    },
    remove: function() {
        this.row.remove()

        this.superRemove()
    }
})
