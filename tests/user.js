var user = require('../models/user');
var dbaccess = require('../models/dbaccess');
var helpers = require('../testhelpers/dbhelpers.js');
var should = require('should');
var sync = require('synchronize');

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

	it('should allow searching', function(done) {
		sync.fiber(function() {
			sync.await(user.save({login: 'u1', password: 'p', email: 'e1@s.com', sex: 'M'}, sync.defer()));
			sync.await(user.save({login: 'u2', password: 'p', email: 'e2@s.com', sex: 'F'}, sync.defer()));
			sync.await(user.save({login: 'u3', password: 'p', email: 'e3@s.com', sex: 'M'}, sync.defer()));

			var users = sync.await(user.find({sex: 'M'}, [], sync.defer()));
			users.length.should.be.equal(2);
			users[0].login.should.be.equal('u1');
			users[1].login.should.be.equal('u3');
			done();
		});
	});

	it('should allow selecting only specific fields in search', function(done) {
		sync.fiber(function() {
			sync.await(user.save({login: 'u1', password: 'p', email: 'e1@s.com', sex: 'M'}, sync.defer()));
			sync.await(user.save({login: 'u2', password: 'p', email: 'e2@s.com', sex: 'F'}, sync.defer()));
			sync.await(user.save({login: 'u3', password: 'p', email: 'e3@s.com', sex: 'M'}, sync.defer()));

			var users = sync.await(user.find({sex: 'M'}, ['email'], sync.defer()));
			users.length.should.be.equal(2);
			users[0].email.should.be.equal('e1@s.com');
			users[1].email.should.be.equal('e3@s.com');
			should(typeof users[0].login).be.equal('undefined');
			should(typeof users[1].login).be.equal('undefined');
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
			user.authorization('user', 'testpass', function(err, id) {
				id.should.be.equal(1);
				should(err).not.be.ok;
				done();
			});
		});

		it('should reject wrong user', function(done) {
			user.authorization('test2', 'testpass', function(err) {
				err.should.be.equal(dbaccess.err_record_not_found);
				done();
			});
		});

		it('should reject wrong password', function(done) {
			user.authorization('user', 'testvfgfdpass', function(err) {
				err.should.be.equal(user.err_wrong_password);
				done();
			});
		});
	});
});