var dbaccess = require('./dbaccess');
var pool = dbaccess.pool;
var tableName = dbaccess.prefix + 'users';

var schema = {
	id: {
		db_type: 'INT',
		primary_key: true,
		auto_increment: true
	},
	login: {
		db_type: 'VARCHAR',
		length: 30,
		required: true
	},
	name: {
		db_type: 'VARCHAR',
		length: 50
	},
	surname: {
		db_type: 'VARCHAR',
		length: 50
	},
	sex: {
		db_type: 'ENUM',
		values: ['M', 'F']
	},
	country: {
		db_type: 'VARCHAR',
		length: 50
	},
	city: {
		db_type: 'VARCHAR',
		length: 50
	},
	interests: {
		db_type: 'VARCHAR',
		length: 255
	},
	email: {
		db_type: 'VARCHAR',
		length: 70,
		required: true
	},
	birthDate: {
		db_type: 'DATE'
	},
	phone: {
		db_type: 'VARCHAR',
		length: 20
	},
	skype: {
		db_type: 'VARCHAR',
		length: 50
	},
	other: {
		db_type: 'TEXT'
	},
	password: {
		db_type: 'VARCHAR',
		length: 50
	},
	show_email: {
		db_type: 'BOOL'
	},
	show_phone: {
		db_type: 'BOOL'
	},
	show_skype: {
		db_type: 'BOOL'
	}
};

exports.err_wrong_password = -2;

exports.findById = dbaccess.findByIdFunction(tableName, 'id', {});

exports.save = dbaccess.saveFunction(tableName, schema, 'id');

exports.initTables = function(cb) {
	dbaccess.createTable(tableName, schema, function(err){
		cb(err);
	});
};

exports.authorization = function(login, password, cb) {
	pool.query('SELECT id, password FROM ' + tableName + ' WHERE login = ?', [login], function(err, rows) {
		if (err) throw err;
		else {
			if (typeof rows[0] == 'undefined')
				cb(dbaccess.err_record_not_found, -1);
			else if (password != rows[0].password)
				cb(exports.err_wrong_password, -1);
			else
				cb(null, rows[0].id);
		}
	});
};

exports.find = dbaccess.findFunction(tableName);
