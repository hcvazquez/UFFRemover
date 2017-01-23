var ChildView = require('backbone-collectionview').childView,
    _ = require('underscore')

module.exports = ChildView.extend({
    tagName: 'tr',
    render: function() {
        var tr = _.reduce(this.model.toJSON(), function(tr, attr){
            return tr += '<td>' + attr + '</td>'
        }, '')

        this.el.innerHTML = tr
    }
})
