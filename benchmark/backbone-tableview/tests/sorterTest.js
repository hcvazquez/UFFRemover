var should = require('should'),
    Backbone = require('backbone')

var Sorter = require('../src').sorter

describe('Sorter', function(){
    beforeEach(function(){
        this.collection = new Backbone.Collection([
                {name: 'jim', age: 18, postcode: 'NW6'},
                {name: 'marry', age: 71, postcode: 'E2'},
                {name: 'zach', age: 12, postcode: 'X54'},
                {name: 'adam', age: 34, postcode: 'S5'},
            ])
    })

    it('should return a sorter', function(){
        var s = (new Sorter(this.collection, 'name', function(){})).getSorter()
        s.should.be.type('function')
    })

    it('should determain sort order up', function(){
        var m = new Backbone.Model({state: 'up'})
        var sorter = new Sorter(this.collection, 'name', function(){})
        var sort = sorter.getSorter()(m)

        sorter.isReverse.should.be.false
    })

    it('should determain sort order down', function(){
        var m = new Backbone.Model({state: 'down'})
        var sorter = new Sorter(this.collection, 'name', function(){})
        var sort = sorter.getSorter()(m)

        sorter.isReverse.should.be.true
    })

    it('should determain sort order null', function(){
        var m = new Backbone.Model({state: null})
        var sorter = new Sorter(this.collection, 'name', function(){})
        var sort = sorter.getSorter()(m)

        ;(sorter.isReverse === null).should.be.true
    })

    it('string should sort up', function(){
        var s = (new Sorter(this.collection, 'name', 'string')).getSorter()
        var m = new Backbone.Model({state: 'up'})

        s(m)

        this.collection.pluck('name').should.eql(['adam', 'jim', 'marry', 'zach'])
    })

    it('string should sort down', function(){
        var s = (new Sorter(this.collection, 'name', 'string')).getSorter()
        var m = new Backbone.Model({state: 'down'})

        s(m)

        this.collection.pluck('name').should.eql(['zach', 'marry', 'jim', 'adam'])
    })

    it('int should sort up', function(){
        var s = (new Sorter(this.collection, 'age', 'int')).getSorter()
        var m = new Backbone.Model({state: 'up'})

        s(m)

        this.collection.pluck('name').should.eql(['zach', 'jim', 'adam', 'marry'])
    })

    it('int should sort down', function(){
        var s = (new Sorter(this.collection, 'age', 'int')).getSorter()
        var m = new Backbone.Model({state: 'down'})
        s(m)

        this.collection.pluck('name').should.eql(['marry', 'adam', 'jim', 'zach'])
    })

    it('int should sort even on mixed strings', function(){
        var s = (new Sorter(this.collection, 'postcode', 'int')).getSorter()
        var m = new Backbone.Model({state: 'up'})
        s(m)

        this.collection.pluck('name').should.eql(['marry', 'adam', 'jim', 'zach'])
    })

    it('reset', function(){
        var orig = this.collection.toJSON()
        var s = (new Sorter(this.collection, 'name', 'string')).getSorter()
        var m = new Backbone.Model({state: 'down'})

        s(m)

        this.collection.pluck('name').should.eql(['zach', 'marry', 'jim', 'adam'])
        this.collection.toJSON().should.not.eql(orig)

        var s2 = (new Sorter(this.collection, 'name', 'string')).getSorter()
        var m2 = new Backbone.Model({state: null})

        s2(m2)

        this.collection.toJSON().should.eql(orig)
    })
})
