var message = require('../models/message');
var helpers = require('../testhelpers/dbhelpers.js');
var sync = require('synchronize');
var user = require('../models/user');

describe('Message', function() {
    beforeEach(helpers.setUpDb(function(done) {
        done();
    }));

    it('should allow sending message from one user to another', function(done) {
        sync.fiber(function() {
            sync.parallel(function() {
                user.save({login: 'u1', password: 'xxx', email: 'x1@gmail.com'}, sync.defer());
                user.save({login: 'u2', password: 'xxx', email: 'x2@gmail.com'}, sync.defer());
                user.save({login: 'u3', password: 'xxx', email: 'x3@gmail.com'}, sync.defer());
            });
            sync.await();
            sync.await(message.send(1, 2, 'text1', sync.defer()));
            sync.await(message.send(2, 1, 'text2', sync.defer()));
            sync.await(message.send(1, 3, 'text3', sync.defer()));
            var messages = sync.await(message.findByUsers(1, 2, sync.defer()));
            messages.length.should.be.equal(2);
            messages[0].sender_id.should.be.equal(1);
            messages[1].sender_id.should.be.equal(2);
            messages[0].text.should.be.equal('text1');
            messages[1].text.should.be.equal('text2');
            done();
        });
    });
});