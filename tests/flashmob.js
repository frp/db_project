var flashmob = require('../models/flashmob');
var dbaccess = require('../models/dbaccess');
var helpers = require('../testhelpers/dbhelpers.js');

describe('Flashmob', function() {
    beforeEach(helpers.setUpDb(function(done) {
        done();
    }));

    it('should generate error if flashmob with such id does not exist', function(done) {
        flashmob.findById(5, function(err, data) {
            (data === null).should.be.true;
            err.should.be.equal(dbaccess.err_record_not_found);
            done();
        });
    });

    it('should enforce required fields', function(done) {
        flashmob.save({title: 'New flashmob'}, function(err) {
            err.should.be.equal(dbaccess.err_validation_failed);
            done();
        })
    });

    describe('Operations on existing flashmobs', function() {
        beforeEach(helpers.setUpUser(helpers.setUpFlashmob(function(done) {
            done();
        })));

        it('should support updating', function(done) {
            flashmob.findById(1, function(err, row) {
                if (err) throw err;
                row['title'] = 'Changed title';
                flashmob.save(row, function(err) {
                    if (err) throw err;
                    flashmob.findById(1, function(err, row) {
                        if (err) throw err;
                        row.title.should.be.equal('Changed title')
                        done();
                    });
                });
            });
        });

        it ('should support adding members', function(done) {
            flashmob.findById(1, function(err, data) {
                data.addMember(1, 'member', function(err) {
                    if (err) throw err;
                    flashmob.findById(1, function(err, data) {
                        if (err) throw err;
                        data.getMembers(function(err, data) {
                            if (err) throw err;
                            data.length.should.be.equal(1);
                            done();
                        });
                    });
                });
            });
        });

        it ('should return error in case of wrong membership type', function (done) {
            flashmob.findById(1, function(err, data) {
                data.addMember(1, 'wrong', function(err) {
                    err.should.be.ok;
                    done();
                });
            });
        });

        it ('should support deleting members', function(done) {
            flashmob.findById(1, function(err, data) {
                data.addMember(1, 'member', function(err) {
                    if (err) throw err;
                    flashmob.findById(1, function(err, data) {
                        if (err) throw err;
                        data.deleteMember(1, 'member', function(err) {
                            if (err) throw err;
                            data.getMembers(function(err, data) {
                                if (err) throw err;
                                data.length.should.be.equal(0);
                                done();
                            });
                        });
                    });
                });
            });
        });

        it ('should support adding stages', function(done) {
            flashmob.findById(1, function(err, data) {
                if (err) throw err;
                data.addStage({title: 'Stage 1'}, function(err) {
                    if (err) throw err;
                    data.getStages(function(err, data) {
                        if (err) throw err;
                        data.length.should.be.equal(1);
                        done();
                    })
                });
            })
        });
    });
});