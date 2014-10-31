var dbaccess = require('./dbaccess')
var pool = dbaccess.pool
var tableName = dbaccess.prefix + 'users'

// FIXME: визначитись з тим, які поля обов’язкові, а які — ні
var schema = {
	user_id: {
		db_type: 'INT',
		primary_key: true,
		auto_increment: true
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
		values: ['M', 'T']
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
		length: 70
	},
	phone: {
		db_type: 'VARCHAR',
		length: 20
	},
	skype: {
		db_type: 'VARCHAR',
		length: 50
	},
	//FIXME: обговорити і додати "інші" контактні дані
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

exports.findById = function(id, cb) {
	pool.query('SELECT * FROM ' + tableName + ' WHERE user_id = ?', [id], function(err, rows) {
		cb(err, rows[0]);
	});
};

exports.save = function(data, cb) {
	if (typeof data.user_id == 'undefined')
		dbaccess.insertIntoTable(tableName, data, cb);
	else
		dbaccess.update(tableName, data, cb)
};

exports.initTables = function(cb) {
	pool.getConnection(function(err, conn) {
		if (err) cb(err);
		else {
			conn.query('DROP TABLE ' + tableName, function(err, result) {
				// Ignore error, it may mean that table exists
				dbaccess.createTable(tableName, schema, function(err, result){
					cb(err);
				});
			});
		}
	});
};


