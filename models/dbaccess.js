var config = require('../config/index');
var mysql = require('mysql2');
var _ = require('lodash');
exports.pool  = mysql.createPool(config.connectionInfo);
exports.prefix = config.dbPrefix;

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

			if (!!field.required || !!field.notNull)
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
	exports.pool.query(query, cb);
};

exports.validate = function(object, schema) {
	var validation_errors = [];
	for (var field_name in schema)
		if (schema.hasOwnProperty(field_name)) {
			if (!!schema[field_name].required && typeof(object[field_name]) == 'undefined')
				validation_errors.push('required field "' + field_name + '" value not found');
			if (schema[field_name].db_type == 'ENUM' && !!object[field_name] &&
				schema[field_name].values.indexOf(object[field_name]) == -1) {
				validation_errors.push('"' + object[field_name] + '" is not a supported value for "' + field_name + '" field');
			}
		}
	return validation_errors;
};

exports.ValidationError = function(errors) {
	this.name = 'Validation Error';
	this.message = errors.join(', ');
	this.validationErrors = errors;
}

exports.ValidationError.prototype = new Error();

exports.insertIntoTable = function(name, object, schema, cb) {
	var validationErrors = exports.validate(object, schema);
	if (validationErrors.length == 0) {
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
				values.push(object[field_name]);
			}
		}

		query += ')';
		exports.pool.query(query, values, cb);
	}
	else cb(new exports.ValidationError(validationErrors));
};

exports.update = function(name, object, schema, cb) {
	var validationErrors = exports.validate(object, schema);
	if (validationErrors.length == 0) {
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
	else cb(new exports.ValidationError(validationErrors));
};

exports.RecordNotFoundError = function(message) {
	this.name = 'Record not found';
	this.message = message;
};

exports.RecordNotFoundError.prototype = new Error();

exports.findByIdFunction = function(tableName, idFieldName, objectToExtend) {
	return function(id, cb) {
		exports.pool.query('SELECT * FROM ' + tableName + ' WHERE ' + idFieldName + ' = ?',
			[id], function(err, rows) {
				if (rows.length != 1)
					cb(new exports.RecordNotFoundError('Record with id=' + id + ' not found'), null);
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
			exports.update(tableName, data, schema, cb);
	};
};

// FIXME: Refactor, get rid of this dirty hack
var tablesToDrop = _.map(['memberships', 'stages', 'comments', 'documents', 'flashmobs', 'messages', 'users'],
	function(el) { return exports.prefix + el; });

exports.dropAllTables = function(cb) {
	exports.pool.query('DROP TABLE IF EXISTS ' + tablesToDrop.join(','), cb);
};

function generateOrClause(alternatives) {
	var query = '';
	for (var i = 0; i < alternatives.length; i++) {
		if (i != 0)
			query += ' OR ';
		query += '(' + generateWhereClause(alternatives[i]) + ')';
	}
	return query;
}

function generateWhereClause(object) {
	if (object.or) {
		return generateOrClause(object.or);
	}
	else {
		var where = '';
		var first = true;
		for (var field_name in object) {
			if (object.hasOwnProperty(field_name)) {
				if (first) first = false;
				else where += ' AND ';
				where += mysql.escapeId(field_name) + ' = ' + mysql.escape(object[field_name]);
			}
		}
		return where;
	}
}

exports.findFunction = function(tableName) {
	return function(data, fields, cb) {
		var query = 'SELECT ' + (fields.length > 0 ? fields.join(', ') : '*') +
			' FROM ' + tableName + ' WHERE ' + generateWhereClause(data);
		exports.pool.query(query, [], cb);
	};
};

exports.deleteWhereFunction = function(tableName) {
	return function(data, cb) {
		var query = 'DELETE FROM ' + tableName + ' WHERE ' + generateWhereClause(data);
		exports.pool.query(query, [], cb);
	};
};
