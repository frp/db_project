var mysql = require('mysql2');
var _ = require('lodash');
exports.pool  = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DBP_HOST || 'localhost',
	user: process.env.DBP_USER || 'db_project',
	password: process.env.DBP_PASSWORD || process.env.DBP_USER ? '' : 'db_password',
	database: process.env.DBP_DATABASE || 'db_project'
});
exports.prefix = 'dbp_';

exports.createTable = function(name, schema, cb) {
	var query = 'CREATE TABLE ' + name + ' (';
	var first = true;
	for (var field_name in schema)
		if (schema.hasOwnProperty(field_name)) {
			var field = schema[field_name];
			if (first) first = false; else query += ', ';
			query += field_name + ' ' + field.db_type;

			if (field.db_type == 'VARCHAR')
				query += '(' + field.length + ')';

			if (field.db_type == 'ENUM') {
				query += '(' + mysql.escape(field.values) +')';
			}

			if (!!field.required)
				query += ' NOT NULL';

			if (!!field.primary_key)
				query += ' PRIMARY KEY';

			if (field.db_type == 'INT')
				if (!!field.auto_increment)
					query += ' AUTO_INCREMENT';

			if (field.foreign_key)
				query += ', FOREIGN KEY (' + field_name + ') REFERENCES ' +
				field.referenceTable + '(' + field.referenceField + ')';
		}
	query += ')';
	exports.pool.query(query, cb)
};

exports.err_validation_failed = -3;

exports.validate = function(object, schema) {
	for (var field_name in schema)
		if (schema.hasOwnProperty(field_name))
			if (!!schema[field_name].required && typeof(object[field_name]) == 'undefined')
				return false;
	return true;
};

exports.insertIntoTable = function(name, object, schema, cb) {
	if (exports.validate(object, schema)) {
		var query = "INSERT INTO " + name + " (";
		var first = true;
		for (var field_name in object)
			if (object.hasOwnProperty(field_name)) {
				if (first)
					first = false;
				else
					query += ',';
				query += field_name;
			}

		query += ') VALUES (';
		first = true;

		var values = [];

		for (field_name in object) {
			if (object.hasOwnProperty(field_name)) {
				if (first)
					first = false;
				else
					query += ', ';
				query += '?';
				values.push(object[field_name])
			}
		}

		query += ')';

		exports.pool.query(query, values, cb);
	}
	else cb(exports.err_validation_failed)
};

exports.update = function(name, object, schema, cb) {
	if (exports.validate(object, schema)) {
		var query = "UPDATE " + name + " SET ";

		var first = true;
		var values = [];
		for (var field_name in object) {
			if (object.hasOwnProperty(field_name)) {
				if (first)
					first = false;
				else
					query += ', ';
				query += field_name + " = ?";
				values.push(object[field_name]);
			}
		}

		exports.pool.query(query, values, cb);
	}
	else cb(exports.err_validation_failed);
};

exports.err_record_not_found = -1;
exports.findByIdFunction = function(tableName, idFieldName, objectToExtend) {
	return function(id, cb) {
		exports.pool.query('SELECT * FROM ' + tableName + ' WHERE ' + idFieldName + ' = ?',
			[id], function(err, rows) {
				if (rows.length != 1)
					cb(exports.err_record_not_found, null);
				else
					cb(err, _.assign(objectToExtend, rows[0]));
			});
	};
};

exports.saveFunction = function(tableName, schema, idField) {
	return function(data, cb) {
		if (typeof data[idField] == 'undefined')
			exports.insertIntoTable(tableName, data, schema, cb);
		else
			exports.update(tableName, data, schema, cb)
	}
};

// FIXME: Refactor, get rid of this dirty hack
var tablesToDrop = ['dbp_memberships', 'dbp_stages', 'dbp_flashmobs', 'dbp_users'];

exports.dropAllTables = function(cb) {
	exports.pool.query('DROP TABLE IF EXISTS ' + tablesToDrop.join(','), cb);
};

exports.findFunction = function(tableName) {
	return function(data, cb) {
		var query = 'SELECT * FROM ' + tableName + ' WHERE ';
		var first = true;
		for (var field_name in data) {
			if (data.hasOwnProperty(field_name)) {
				if (first) first = false;
				else query += ' AND ';
				query += mysql.escapeId(field_name) + ' = ' + mysql.escape(data[field_name]);
			}
		}
		exports.pool.query(query, [], cb)
	}
};

exports.deleteWhereFunction = function(tableName) {
	return function(data, cb) {
		var query = 'DELETE FROM ' + tableName + ' WHERE ';
		var first = true;
		for (var field_name in data) {
			if (data.hasOwnProperty(field_name)) {
				if (first) first = false;
				else query += ' AND ';
				query += mysql.escapeId(field_name) + ' = ' + mysql.escape(data[field_name]);
			}
		}
		exports.pool.query(query, [], cb)
	}
};