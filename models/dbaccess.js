var mysql = require('mysql');
exports.pool  = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DBP_HOST || 'localhost',
	user: process.env.DBP_USER || 'db_project',
	password: process.env.DBP_PASSWORD || 'db_password',
	database: process.env.DBP_DATABASE || 'db_project'
});
exports.prefix = 'dbp_';

exports.createTable = function(name, schema, cb) {
	var query = 'CREATE TABLE ' + name + ' (';
	var first = true
	for (var field_name in schema)
		if (schema.hasOwnProperty(field_name)) {
			var field = schema[field_name];
			if (first) first = false; else query += ', ';
			query += field_name + ' ' + field.db_type;

			if (field.db_type == 'VARCHAR')
				query += '(' + field.length + ')';

			if (field.db_type == 'ENUM')
			{
				query += '(';
				for (var value in field.values)
				{
					if (value != 0) query += ',';
					query += '\'' + field.values[value] + '\'';
				}
				query += ')'
			}

			if (!!field.primary_key)
				query += ' PRIMARY KEY';

			if (field.db_type == 'INT')
				if (!!field.auto_increment)
					query += ' AUTO_INCREMENT'
		}
	query += ')';
	exports.pool.query(query, cb)
}

exports.insertIntoTable = function(name, object, cb) {
	var query = "INSERT INTO " + name + " (";
	var first = true
	for (var field_name in object) {
		if (first)
			first = false;
		else
			query += ',';
		query += field_name;
	}

	query += ') VALUES (';
	first = true;

	var values = [];

	for (var field_name in object) {
		if (first)
			first = false;
		else
			query += ', ';
		query += '?';
		values.push(object[field_name])
	}

	query += ')';

	exports.pool.query(query, values, cb);
}

exports.update = function(name, object, cb) {
	var query = "UPDATE " + name + " SET ";

	var first = true
	var values = []
	for (var field_name in object) {
		if (first)
			first = false;
		else
			query += ', ';
		query += field_name + " = ?";
		values.push(object[field_name]);
	}

	exports.pool.query(query, values, cb);
}
