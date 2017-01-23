var Backbone = require('backbone'),
    THead = require('./thead'),
    TFoot = require('./tfoot'),
    TBody = require('./tbody')

module.exports = Backbone.View.extend({
    tagName: 'table',
    constructor: function() {
        this.head = new THead()
        this.body = new TBody()

        Backbone.View.apply(this, arguments)
        this.superRemove = Backbone.View.prototype.remove
    },
    render: function() {
        this.el.appendChild(this.head.el)
        this.el.appendChild(this.body.el)

        return this
    },
    remove: function() {
        this.head.remove()
        if (this.foot) {
            this.foot.remove()
        }
        this.body.remove()

        this.superRemove()
    },
    addColumn: function() {
        return this.head.row.addCol.apply(this.head.row, arguments)
    },
    addRow: function() {
        return this.body.addRow.apply(this.body, arguments)
    },
    setFoot: function(data) {
        if (!this.foot) {
            this.foot = new TFoot()
            this.$('thead')[0].parentNode.insertBefore(this.foot.el, this.$('thead')[0].nextSibling)
        }

        this.foot.tr.render(data)
    }
})
