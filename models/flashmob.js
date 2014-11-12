var dbaccess = require('./dbaccess')
var pool = dbaccess.pool
var tableName = dbaccess.prefix + 'flashmobs'

// FIXME: determine which fields are required and which aren't
var schema = {
	flashmob_id: {
		db_type: 'INT',
		primary_key: true,
		auto_increment: true
	},
	title: {
		db_type: 'VARCHAR',
		length: 255
	},
	// FIXME: rethink this field's type and usage
	status: {
		db_type: 'VARCHAR',
		length: 50
	},
	// FIXME: rethink this field's usage
	place: {
		db_type: 'VARCHAR',
		length: 100
	},
	// FIXME: maybe it should be datetime?
	date: {
		db_type: 'DATE'
	},
	description: {
		db_type: 'TEXT'
	},
	// FIXME: rethink this field's type and usage
	type: {
		db_type: 'VARCHAR',
		length: 100
	}
	// FIXME: think about other needed fields
};

exports.err_flashmob_not_found = -1;

exports.findById = function(id, cb) {
	pool.query('SELECT * FROM ' + tableName + ' WHERE flashmob_id = ?', [id], function(err, rows) {
		if (rows.length != 1)
			cb(exports.err_flashmob_not_found, null);
		else
			cb(err, rows[0]);
	});
};

exports.save = function(data, cb) {
	if (typeof data.flashmob_id == 'undefined')
		dbaccess.insertIntoTable(tableName, data, cb);
	else
		dbaccess.update(tableName, data, cb);
};

exports.initTables = function(cb) {
	pool.query('DROP TABLE ' + tableName, function(err, result) {
		// Ignore error, it may mean that table exists
		dbaccess.createTable(tableName, schema, function(err, result){
			cb(err);
		});
	});
};

exports.search = function(filter, callback){
	// TODO: think about what is needed to be done here
};
