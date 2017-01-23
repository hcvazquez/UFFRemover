var Table = require('./views/table.js')

Table.tbody = require('./views/tbody')
Table.tbodyTr = require('./views/tbodyTr')
Table.thead = require('./views/thead')
Table.theadTh = require('./views/theadTh')
Table.theadTr = require('./views/theadTr')
Table.sorter = require('./sorter')
Table.models = {}
Table.models.th = require('./models/th')

module.exports = Table
