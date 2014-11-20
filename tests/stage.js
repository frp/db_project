var stage = require('../models/stage');
var helpers = require('../testhelpers/dbhelpers');
var dbaccess = require('../models/dbaccess');

describe('Stage', function() {
    beforeEach(helpers.setUpDb(helpers.setUpUser(helpers.setUpFlashmob(function(done) {
        done();
    }))));

    it('should be possible to create and update', function(done) {
        stage.save({
            flashmob_id: 1,
            title: 'test flashmob'
        }, function(err) {
            if (err) throw err;
            stage.findById(1, function(err, res) {
                if (err) throw err;
                res.title = 'test update flashmob';
                stage.save(res, function(err) {
                    if (err) throw err;
                    stage.findById(1, function(err, res) {
                        if (err) throw err;
                        res.title.should.be.equal('test update flashmob');
                        done();
                    })
                })
            })
        });
    });

    it('should enforce required fields', function(done) {
        stage.save({title: 't'}, function(err) {
            err.should.be.equal(dbaccess.err_validation_failed);
            done();
        });
    })
});