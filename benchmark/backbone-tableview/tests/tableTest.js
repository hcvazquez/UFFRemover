var should = require('should'),
    Backbone = require('backbone')

var Table = require('../src')

describe('Table', function(){
    beforeEach(function(){
        this.view = new Table().render()
    })

    it('creates a table', function(){
        this.view.$el[0].outerHTML
            .should.eql('<table><thead><tr></tr></thead><tbody></tbody></table>')
    })

    it('remove()', function(){
        this.view.remove()

        this.view.$el[0].outerHTML.should.eql('<table></table>')
    })

    it('addColumn()', function(){
        var view = this.view.addColumn({text: 'foo'})

        view.should.be.instanceof(Backbone.View)
        view.$el.text().should.eql('foo')
    })

    it('addRow()', function(){
        var m = new Backbone.Model({foo: 'bar'})
        var view = this.view.addRow(m)

        view.get('view').$el.text().should.eql('bar')
    })
})
