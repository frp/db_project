var dbaccess = require('./dbaccess');
var tableName = dbaccess.prefix + 'comments';
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
    user_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: dbaccess.prefix + 'users',
        referenceField: 'id',
        required: true
    },
    text: {
        db_type: 'TEXT',
        required: true
    },
    date: {
        db_type: 'DATETIME',
        notNull: true
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