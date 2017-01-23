var CollectionView = require('backbone-collectionview'),
    Tr = require('./tbodyTr.js'),
    Sorter = require('../sorter')

module.exports = CollectionView.extend({
    childView: Tr,
    tagName: 'tbody',
    initialize: function(opts) {

    },
    addRow: function(model) {
        return this.addChild(model)
    },
    getSorter: function (attr, sorter) {
        var s = new Sorter(this.collection, attr, sorter)
        return s.getSorter()
    },
})
