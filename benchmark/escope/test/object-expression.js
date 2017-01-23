'use strict';

var _chai = require('chai');

var _ = require('..');

describe('object expression', function () {
    it('doesn\'t require property type', function () {
        // Hardcoded AST.  Esprima adds an extra 'Property'
        // key/value to ObjectExpressions, so we're not using
        // it parse a program string.
        var ast = {
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'a'
                    },
                    init: {
                        type: 'ObjectExpression',
                        properties: [{
                            kind: 'init',
                            key: {
                                type: 'Identifier',
                                name: 'foo'
                            },
                            value: {
                                type: 'Identifier',
                                name: 'a'
                            }
                        }]
                    }
                }]
            }]
        };

        var scope = (0, _.analyze)(ast).scopes[0];
        (0, _chai.expect)(scope.variables).to.have.length(1);
        (0, _chai.expect)(scope.references).to.have.length(2);
        (0, _chai.expect)(scope.variables[0].name).to.be.equal('a');
        (0, _chai.expect)(scope.references[0].identifier.name).to.be.equal('a');
        (0, _chai.expect)(scope.references[1].identifier.name).to.be.equal('a');
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdC1leHByZXNzaW9uLmpzIl0sIm5hbWVzIjpbImRlc2NyaWJlIiwiaXQiLCJhc3QiLCJ0eXBlIiwiYm9keSIsImRlY2xhcmF0aW9ucyIsImlkIiwibmFtZSIsImluaXQiLCJwcm9wZXJ0aWVzIiwia2luZCIsImtleSIsInZhbHVlIiwic2NvcGUiLCJzY29wZXMiLCJ2YXJpYWJsZXMiLCJ0byIsImhhdmUiLCJsZW5ndGgiLCJyZWZlcmVuY2VzIiwiYmUiLCJlcXVhbCIsImlkZW50aWZpZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0FBRUFBLFNBQVMsbUJBQVQsRUFBOEIsWUFBVztBQUNyQ0MsT0FBRyxnQ0FBSCxFQUFxQyxZQUFXO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLFlBQU1DLE1BQU07QUFDUkMsa0JBQU0sU0FERTtBQUVSQyxrQkFBTSxDQUFDO0FBQ0hELHNCQUFNLHFCQURIO0FBRUhFLDhCQUFjLENBQUM7QUFDWEYsMEJBQU0sb0JBREs7QUFFWEcsd0JBQUk7QUFDQUgsOEJBQU0sWUFETjtBQUVBSSw4QkFBTTtBQUZOLHFCQUZPO0FBTVhDLDBCQUFNO0FBQ0ZMLDhCQUFNLGtCQURKO0FBRUZNLG9DQUFZLENBQUM7QUFDVEMsa0NBQU0sTUFERztBQUVUQyxpQ0FBSztBQUNEUixzQ0FBTSxZQURMO0FBRURJLHNDQUFNO0FBRkwsNkJBRkk7QUFNVEssbUNBQU87QUFDSFQsc0NBQU0sWUFESDtBQUVISSxzQ0FBTTtBQUZIO0FBTkUseUJBQUQ7QUFGVjtBQU5LLGlCQUFEO0FBRlgsYUFBRDtBQUZFLFNBQVo7O0FBNEJBLFlBQU1NLFFBQVEsZUFBUVgsR0FBUixFQUFhWSxNQUFiLENBQW9CLENBQXBCLENBQWQ7QUFDQSwwQkFBT0QsTUFBTUUsU0FBYixFQUF3QkMsRUFBeEIsQ0FBMkJDLElBQTNCLENBQWdDQyxNQUFoQyxDQUF1QyxDQUF2QztBQUNBLDBCQUFPTCxNQUFNTSxVQUFiLEVBQXlCSCxFQUF6QixDQUE0QkMsSUFBNUIsQ0FBaUNDLE1BQWpDLENBQXdDLENBQXhDO0FBQ0EsMEJBQU9MLE1BQU1FLFNBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUJSLElBQTFCLEVBQWdDUyxFQUFoQyxDQUFtQ0ksRUFBbkMsQ0FBc0NDLEtBQXRDLENBQTRDLEdBQTVDO0FBQ0EsMEJBQU9SLE1BQU1NLFVBQU4sQ0FBaUIsQ0FBakIsRUFBb0JHLFVBQXBCLENBQStCZixJQUF0QyxFQUE0Q1MsRUFBNUMsQ0FBK0NJLEVBQS9DLENBQWtEQyxLQUFsRCxDQUF3RCxHQUF4RDtBQUNBLDBCQUFPUixNQUFNTSxVQUFOLENBQWlCLENBQWpCLEVBQW9CRyxVQUFwQixDQUErQmYsSUFBdEMsRUFBNENTLEVBQTVDLENBQStDSSxFQUEvQyxDQUFrREMsS0FBbEQsQ0FBd0QsR0FBeEQ7QUFDSCxLQXRDRDtBQXVDSCxDQXhDRCIsImZpbGUiOiJvYmplY3QtZXhwcmVzc2lvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHsgYW5hbHl6ZSB9IGZyb20gJy4uJztcblxuZGVzY3JpYmUoJ29iamVjdCBleHByZXNzaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2RvZXNuXFwndCByZXF1aXJlIHByb3BlcnR5IHR5cGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gSGFyZGNvZGVkIEFTVC4gIEVzcHJpbWEgYWRkcyBhbiBleHRyYSAnUHJvcGVydHknXG4gICAgICAgIC8vIGtleS92YWx1ZSB0byBPYmplY3RFeHByZXNzaW9ucywgc28gd2UncmUgbm90IHVzaW5nXG4gICAgICAgIC8vIGl0IHBhcnNlIGEgcHJvZ3JhbSBzdHJpbmcuXG4gICAgICAgIGNvbnN0IGFzdCA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdQcm9ncmFtJyxcbiAgICAgICAgICAgIGJvZHk6IFt7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1ZhcmlhYmxlRGVjbGFyYXRpb24nLFxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uczogW3tcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1ZhcmlhYmxlRGVjbGFyYXRvcicsXG4gICAgICAgICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnSWRlbnRpZmllcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5pdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ09iamVjdEV4cHJlc3Npb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnaW5pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdJZGVudGlmaWVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2ZvbydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdJZGVudGlmaWVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2EnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHNjb3BlID0gYW5hbHl6ZShhc3QpLnNjb3Blc1swXTtcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlcykudG8uaGF2ZS5sZW5ndGgoMSk7XG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzKS50by5oYXZlLmxlbmd0aCgyKTtcbiAgICAgICAgZXhwZWN0KHNjb3BlLnZhcmlhYmxlc1swXS5uYW1lKS50by5iZS5lcXVhbCgnYScpO1xuICAgICAgICBleHBlY3Qoc2NvcGUucmVmZXJlbmNlc1swXS5pZGVudGlmaWVyLm5hbWUpLnRvLmJlLmVxdWFsKCdhJyk7XG4gICAgICAgIGV4cGVjdChzY29wZS5yZWZlcmVuY2VzWzFdLmlkZW50aWZpZXIubmFtZSkudG8uYmUuZXF1YWwoJ2EnKTtcbiAgICB9KTtcbn0pO1xuIl19
