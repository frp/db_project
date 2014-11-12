var dbaccess = require('../models/dbaccess');
var nodeunit = require('nodeunit');

nodeunit.on('done', function() {
    dbaccess.pool.end(function() {});
});
