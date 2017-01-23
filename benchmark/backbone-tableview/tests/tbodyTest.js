var should = require('should'),
    Backbone = require('backbone')

var Tbody = require('../src').tbody

describe('TBody', function(){
    beforeEach(function(){
        this.view = new Tbody()
        this.collection = new Backbone.Collection([
                {foo: 'bar0'},
                {foo: 'bar1'},
                {foo: 'bar2'}
            ])
    })

    it('addRow() should add a row', function(){
        var m = new Backbone.Model({foo: 'bar'})
        this.view.addRow(m)

        this.view.$el.find('tr').eq(0).find('td').eq(0).html().should.eql('bar')
    })

    it('setCollection() should add a colleciton', function(){
        this.view.setCollection.call(this.view, this.collection)

        this.view.$el.find('tr').eq(0).find('td').eq(0).text().should.eql('bar0')
        this.view.$el.find('tr').eq(1).find('td').eq(0).text().should.eql('bar1')
        this.view.$el.find('tr').eq(2).find('td').eq(0).text().should.eql('bar2')
    })

    it('adding to a colleciton should add more tr\'s ', function(){
        this.view.setCollection.call(this.view, this.collection)

        this.view.$el.find('tr').eq(2).find('td').eq(0).text().should.eql('bar2')

        this.collection.add({foo: 'bar3'})

        this.view.$el.find('tr').eq(3).find('td').eq(0).text().should.eql('bar3')
    })

    it('clearing colleciton should remove all tr\'s', function(){
        this.view.setCollection.call(this.view, this.collection)

        this.view.$el.find('tr').eq(2).find('td').eq(0).text().should.eql('bar2')

        this.collection.remove(this.collection.models)

        this.view.$el.find('tr').length.should.eql(0)
    })

    it('Initializeing view with colleciton', function(){
        this.view = new Tbody({collection: this.collection})

        this.view.$el.find('tr').length.should.eql(3)
    })

    it('Should stop listening when a colleciton is replaced', function(){
        this.view.setCollection.call(this.view, this.collection)

        this.collection.remove(this.collection)

        this.view.setCollection.call(this.view, new Backbone.Collection())

        this.view.$el.find('tr').length.should.eql(0)
        this.collection.add({foo: 'bar4'})

        this.view.$el.find('tr').length.should.eql(0)
    })

    /*
    due to how node handels cross-package object, this is currently technically
    unfesable. See: https://github.com/jashkenas/backbone/pull/1291
    it('rerenderChildren() only render if collection is valid', function(){
        var that = this

        ;(function(){
            that.v.rerenderChildren()
        }).should.not.throw()
    })*/

    it('getSorter() should return a valid sorter', function(){
        this.view.getSorter('name', function(){}).should.be.type('function')
    })
})
