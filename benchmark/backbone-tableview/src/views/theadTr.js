var Backbone = require('backbone'),
    _ = require('underscore'),
    KinView = require('backbone-kinview'),
    Th = require('./theadTh.js'),
    thModel = require('../models/th.js')

module.exports = KinView.extend({
    tagName: 'tr',
    exclusiveState: true,
    Th: Th,
    initialize: function() {
        this.children.model = thModel
        this.render()
    },
    addCol: function(opts) {
        var model = this.add({
            view: new this.Th({
                text: opts.text || '',
                className: opts.click ? 'sortable' : ''
            }),
            hasState: opts.click ? true : false,
            data: opts.data || {}
        })

        var view = model.get('view')
	    view.listenTo(model, 'change:state', view.renderState)

        if (opts.click) {
            view.delegate(
                'click',
                _.bind(this.clickState, this, model, opts.click)
            )
        }

        return view
    },
    clickState: function(model, done) {
        done.call(this, model)
    }
})
