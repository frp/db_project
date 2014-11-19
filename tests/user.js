var user = require('../models/user');
var dbaccess = require('../models/dbaccess');
var helpers = require('../testhelpers/dbhelpers.js');

exports.testUpdating = helpers.setUpDb(helpers.setUpUser(function(test)	{
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

exports.testAuthorizationOK = helpers.setUpDb(helpers.setUpUser(function(test){
	user.authorization('test@gmail.com', 'testpass', function(err, id) {
		test.equals(id, 1);
		test.equals(!err, true);
		test.done();
	});
}));

exports.testAuthorizationWrongUser = helpers.setUpDb(helpers.setUpUser(function(test) {
	user.authorization('test2@gmail.com', 'testpass', function(err, id) {
		test.equals(err, dbaccess.err_record_not_found);
		test.done();
	});
}));

exports.testAuthorizationWrongPassword = helpers.setUpDb(helpers.setUpUser(function(test) {
	user.authorization('test@gmail.com', 'testvfgfdpass', function(err, id) {
		test.equals(err, user.err_wrong_password);
		test.done();
	});
}));

exports.testUserNotFound = helpers.setUpDb(function(test) {
	user.findById(5, function(err, data) {
		test.equals(data, null);
		test.equals(err, dbaccess.err_record_not_found);
		test.done();
	});
});

exports.testRequiredFields = helpers.setUpDb(function(test) {
	user.save({email: 'aaa@bbb.com'}, function(err) {
		test.equals(err, dbaccess.err_validation_failed);
		test.done();
	})
});