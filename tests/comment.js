var should = require('should');
var helpers = require('../testhelpers/dbhelpers.js');
var user = require('../models/user');
var flashmob = require('../models/flashmob');

describe('Comment', function() {
    beforeEach(function(done) {
        var self = this;
        helpers.setUpDb(helpers.setUpUser(helpers.setUpFlashmob(function (done) {
            user.findById(1, function (err, res) {
                if (err) throw err;
                self.user = res;
                flashmob.findById(1, function(err, res) {
                    self.flashmob = res;
                    done();
                });
            });
        })))(done);
    });

    it('should support adding it to flashmob', function(done) {
        var self = this;
        self.flashmob.addComment({user_id: 1, text: 'comment 1'}, function(err) {
            if (err) throw err;
            self.flashmob.getComments(function(err, res) {
                if (err) throw err;
                res.length.should.be.equal(1);
                res[0].text.should.be.equal('comment 1');
                res[0].flashmob_id.should.be.equal(1);
                done();
            });
        });
    });
});