var should = require('should'),
    Backbone = require('backbone')

var Tr = require('../src').tbodyTr

describe('tbodyTr', function(){
    it('td should render from model', function(){
        var v = new Tr({
            model: new Backbone.Model({foo: 'bar'})
        })

        v.$el.find('td').length.should.eql(1)
        v.$el.find('td').text().should.eql('bar')
    })
})
