var should = require('should'),
    Backbone = require('backbone')

var TheadTh = require('../src').theadTh

describe('TheadTh', function(){
    beforeEach(function(){
        this.view = new TheadTh({text: 'foo'})
    })

    it('Should render state up', function(){
        this.view.renderState(null, 'up')

        this.view.$el.find('i').hasClass('fa-caret-down').should.be.false
        this.view.$el.find('i').hasClass('fa-caret-up').should.be.true
        this.view.$el.hasClass('active').should.be.true
    })

    it('Should render state down', function(){
        this.view.renderState(null, 'down')

        this.view.$el.find('i').hasClass('fa-caret-down').should.be.true
        this.view.$el.find('i').hasClass('fa-caret-up').should.be.false
        this.view.$el.hasClass('active').should.be.true
    })

    it('Should reset state', function(){
        this.view.renderState(null, null)

        this.view.$el.find('i').css('visibility').should.eql('hidden')
        this.view.$el.hasClass('active').should.be.false
    })

    it('Should toggel state down', function(){
        this.view.renderState(null, 'up')
        this.view.renderState(null, 'down')

        this.view.$el.find('i').hasClass('fa-caret-down').should.be.true
        this.view.$el.find('i').hasClass('fa-caret-up').should.be.false
        this.view.$el.hasClass('active').should.be.true
    })

    it('Should toggel state up', function(){
        this.view.renderState(null, 'down')
        this.view.renderState(null, 'up')

        this.view.$el.find('i').hasClass('fa-caret-down').should.be.false
        this.view.$el.find('i').hasClass('fa-caret-up').should.be.true
        this.view.$el.hasClass('active').should.be.true
    })
})
