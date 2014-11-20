var user = require('../models/user');
var dbaccess = require('../models/dbaccess');
var helpers = require('../testhelpers/dbhelpers.js');
var should = require('should');

describe('User', function() {
	beforeEach(helpers.setUpDb(function(done) {
		done();
	}));

	it('should generate error when user does not exist', function(done) {
		user.findById(5, function(err, data) {
			(data === null).should.be.true;
			err.should.be.equal(dbaccess.err_record_not_found);
			done();
		});
	});

	it('should check for required fields', function(done) {
		user.save({email: 'aaa@bbb.com'}, function(err) {
			err.should.be.equal(dbaccess.err_validation_failed);
			done();
		});
	});

	describe('Operations with existing user', function() {
		beforeEach(helpers.setUpUser(function(done) {
			done();
		}));

		it('should support updating', function(done) {
			user.findById(1, function(err, row) {
				if (err) throw err;
				row.name = 'Serhiy';
				user.save(row, function(err) {
					if (err) throw err;
					user.findById(1, function(err, row) {
						if (err) throw err;
						row.name.should.be.equal('Serhiy');
						done();
					});
				});
			});
		});

		it('should support authorization', function(done) {
			user.authorization('test@gmail.com', 'testpass', function(err, id) {
				id.should.be.equal(1);
				should(err).not.be.ok;
				done();
			});
		});

		it('should reject wrong user', function(done) {
			user.authorization('test2@gmail.com', 'testpass', function(err) {
				err.should.be.equal(dbaccess.err_record_not_found);
				done();
			});
		});

		it('should reject wrong password', function(done) {
			user.authorization('test@gmail.com', 'testvfgfdpass', function(err) {
				err.should.be.equal(user.err_wrong_password);
				done();
			});
		});
	});
});