var _ = require('underscore')

var Sorter = function (collection, attr, sorter) {
    this.collection = collection
    this.attr = attr
    this.isReverse = null

    this.sorter =
        typeof this[sorter] == 'function'
        ? _.bind(this[sorter], this)
        : _.bind(sorter, this)
}

module.exports = Sorter

Sorter.prototype.getSorter = function(model) {
    var that = this
    return function(model) {
        var state = model.get('state')

        if (state !== null) {
            that.isReverse = state == 'up' ? false : true
        }


        if (that.isReverse !== null) {
            that.collection.comparator = that.sorter
            that.collection.sort()
        } else {
            that.reset()
        }

    }
}
Sorter.prototype.string = function(a, b) {

    if (this.isReverse) {
        return -getAttr(a, this.attr).localeCompare(getAttr(b, this.attr))
    }
    return getAttr(a, this.attr).localeCompare(getAttr(b, this.attr))
}

Sorter.prototype.int = function(a, b) {
    var rep = /[^0-9]/g

    var i = getAttr(a, this.attr),
        j = getAttr(b, this.attr)

    i = _.isNumber(i) ? i : Number(i.replace(rep, ''))
    j = _.isNumber(j) ? j : Number(j.replace(rep, ''))

    if (this.isReverse) {
        return j <= i ? -1 : 1
    }
    return i <= j ? -1 : 1
}


Sorter.prototype.reset = function() {
   var origAttr = this.attr
   var origSorter = this.sorter

   this.attr = 'cid'
   this.isReverse = null
   this.collection.comparator = _.bind(this.int, this)
   this.collection.sort()

   this.attr = origAttr
   this.collection.comparator = origSorter

   return this
}

var getAttr = function(model, name) {
    if (name in model) {
        return model[name]
    }

    return model.get(name)
}
