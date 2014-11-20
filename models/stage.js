var dbaccess = require('./dbaccess');
var tableName = dbaccess.prefix + 'stages';
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
    title: {
        db_type: 'VARCHAR',
        length: 150,
        required: true
    },
    responsible_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: dbaccess.prefix + 'users',
        referenceField: 'id'
    },
    parent_stage_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: tableName,
        referenceField: 'id'
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