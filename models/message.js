var dbaccess = require('./dbaccess');
var tableName = dbaccess.prefix + 'messages';
var schema = {
    id: {
        db_type: 'INT',
        primary_key: true,
        auto_increment: true
    },
    sender_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: dbaccess.prefix + 'users',
        referenceField: 'id',
        required: true
    },
    receiver_id: {
        db_type: 'INT',
        foreign_key: true,
        referenceTable: dbaccess.prefix + 'users',
        referenceField: 'id',
        required: true
    },
    sent_at: {
        db_type: 'DATETIME',
        required: true
    },
    text: {
        db_type: 'TEXT',
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

exports.findByUsers = function(id1, id2, cb) {
    exports.find({
        or: [
            {
                sender_id: id1,
                receiver_id: id2
            },
            {
                sender_id: id2,
                receiver_id: id1
            }
        ]
    }, [], cb);
};

exports.send = function(senderId, receiverId, text, cb) {
    exports.save({
        sender_id: senderId,
        receiver_id: receiverId,
        sent_at: new Date,
        text: text
    }, cb);
};