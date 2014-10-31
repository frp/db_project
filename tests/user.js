var user = require('../models/user')
var dbaccess = require('../models/dbaccess')

function setUpDb(cb) {
	return function(test) {
		user.initTables(function(err) {
			if (err) throw err;
			cb(test);
		});
	}
}

function setUpUser(cb) {
	return function(test) {
		user.save({
			name: 'User',
			surname: 'Test',
			email: 'test@gmail.com',
			password: 'testpass'
		}, function (err) {
			if (err) throw err;
			cb(test);
		});
	}
}

exports.testUpdating = setUpDb(setUpUser(function(test)	{
	user.findById(1, function(err, row) {
		if (err) throw err;
		row['name'] = 'Serhiy';
		user.save(row, function(err) {
			if (err) throw err;
			user.findById(1, function(err, row) {
				if (err) throw err;
				test.ok(row.name == 'Serhiy', 'test updating');
				test.done();
			});
		});
	});
}));

exports.testAuthorizationOK = setUpDb(setUpUser(function(test){
	user.authorization('test@gmail.com', 'testpass', function(err, id) {
		test.equals(id, 1);
		test.equals(!err, true);
		test.done();
	});
}));

exports.testAuthorizationWrongUser = setUpDb(setUpUser(function(test) {
	user.authorization('test2@gmail.com', 'testpass', function(err, id) {
		test.equals(err, user.err_user_not_found);
		test.done();
	});
}));

exports.testAuthorizationWrongPassword = setUpDb(setUpUser(function(test) {
	user.authorization('test@gmail.com', 'testvfgfdpass', function(err, id) {
		test.equals(err, user.err_wrong_password);
		test.done();
	});
}));

exports.testUserNotFound = setUpDb(function(test) {
	user.findById(5, function(err, data) {
		test.equals(data, null);
		test.equals(err, user.err_user_not_found);
		test.done();
	});
});

exports.testKillDb = function(test) {
	dbaccess.pool.end(function() {
		test.done();
	});
}
