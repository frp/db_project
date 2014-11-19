var dbaccess = require('./dbaccess');
var tableName = dbaccess.prefix + 'memberships';
var schema = {
    id: {
        db_type: 'INT',
        primary_key: true,
        auto_increment: true
    },
    user_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: dbaccess.prefix + 'users',
        referenceField: 'id'
    },
    flashmob_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: dbaccess.prefix + 'flashmobs',
        referenceField: 'id'
    },
    // FIXME: change to enum
    membership_type: {
        db_type: 'VARCHAR',
        length: 20
    }
};

exports.initTables = function(cb) {
    dbaccess.createTable(tableName, schema, function(err, result){
        cb(err);
    });
};

exports.save = dbaccess.saveFunction(tableName, 'id');
exports.find = dbaccess.findFunction(tableName);
exports.deleteWhere = dbaccess.deleteWhereFunction(tableName);