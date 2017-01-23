var should = require('should'),
    Backbone = require('backbone')

var TheadTr = require('../src').theadTr

describe('TheadTr', function(){
    beforeEach(function(){
        this.view = new TheadTr({})
    })

    it('tagName is tr', function(){
        this.view.tagName.should.eql('tr')
    })

    it('should have exclusive state', function(){
        this.view.exclusiveState.should.be.ok
    })

    it('addCol() should add a th', function(){
        this.view.addCol({text: 'foobar'})

        this.view.$el.children().eq(0).text().should.eql('foobar')
    })

    it('should not have state if a click callback isnt passed', function(){
        var view = this.view.addCol({text: 'foo'})

        this.view.children.where({view: view})[0].get('hasState').should.be.falsse
    })

    it('should have state if a click callback is passed', function(){
        var view = this.view.addCol({text: 'foo', click: function(){}})

        this.view.children.where({view: view})[0].get('hasState').should.be.falsse
    })

    it('click should trigger the callback', function(done){
        var view = this.view.addCol({text: 'foo', click: function(){done()}})

        view.$el.trigger('click')
    })

    it('remove() should remove all children', function(){
        this.view.remove()

        this.view.children.length.should.eql(0)
    })
})
