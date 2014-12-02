var dbaccess = require('./dbaccess');
var tableName = dbaccess.prefix + 'documents';
var schema = {
    id: {
        db_type: 'INT',
        primary_key: true,
        auto_increment: true
    },
    flashmob_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: dbaccess.prefix + 'flashmobs',
        referenceField: 'id',
        required: true
    },
    name: {
        db_type: 'VARCHAR',
        length: 255,
        required: true
    },
    path: {
        db_type: 'VARCHAR',
        length: 255,
        required: true
    }
};

exports.initTables = function(cb) {
    dbaccess.createTable(tableName, schema, function(err){
        cb(err);
    });
};

exports.save = dbaccess.saveFunction(tableName, schema, 'id');
exports.findById = dbaccess.findByIdFunction(tableName, 'id', {});
exports.find = dbaccess.findFunction(tableName);
