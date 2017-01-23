var Backbone = require('backbone'),
    KinView = require('backbone-kinview'),
    Tr = require('./tfootTr.js')

module.exports = KinView.extend({
    tagName: 'tfoot',
    initialize: function() {
        this.tr = new Tr()
        this.render()
    },
    render: function(data) {
        this.tr.render(data)
        this.el.appendChild(this.tr.el)
    },
    remove: function() {
        this.tr.remove()

        this.superRemove()
    }
})
