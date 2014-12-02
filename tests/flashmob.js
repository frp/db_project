var flashmob = require('../models/flashmob');
var dbaccess = require('../models/dbaccess');
var document = require('../models/document')
var helpers = require('../testhelpers/dbhelpers.js');
var sync = require('synchronize');

describe('Flashmob', function() {
    beforeEach(helpers.setUpDb(function(done) {
        done();
    }));

    it('should generate error if flashmob with such id does not exist', function(done) {
        flashmob.findById(5, function(err, data) {
            (data === null).should.be.true;
            err.should.be.an.instanceOf(dbaccess.RecordNotFoundError);
            done();
        });
    });

    it('should enforce required fields', function(done) {
        flashmob.save({title: 'New flashmob'}, function(err) {
            err.should.be.an.instanceOf(dbaccess.ValidationError);
            done();
        });
    });

    describe('Operations on existing flashmobs', function() {
        beforeEach(helpers.setUpUser(helpers.setUpFlashmob(function(done) {
            done();
        })));

        it('should support updating', function(done) {
            flashmob.findById(1, function(err, row) {
                if (err) throw err;
                row.title = 'Changed title';
                flashmob.save(row, function(err) {
                    if (err) throw err;
                    flashmob.findById(1, function(err, row) {
                        if (err) throw err;
                        row.title.should.be.equal('Changed title');
                        done();
                    });
                });
            });
        });

        it ('should support adding members', function(done) {
            flashmob.findById(1, function(err, data) {
                if (err) throw err;
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
                if (err) throw err;
                data.addMember(1, 'wrong', function(err) {
                    err.should.be.ok;
                    done();
                });
            });
        });

        it ('should support deleting members', function(done) {
            flashmob.findById(1, function(err, data) {
                if (err) throw err;
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
                    });
                });
            });
        });

        it ('should support getting documents', function(done) {
            sync.fiber(function() {
                sync.await(flashmob.save({
                    title: 'My second flashmob',
                    start_datetime: new Date(2014, 1, 1),
                    end_datetime: new Date(2014, 1, 2),
                    type: 'open',
                    status: 'active',
                    organizer: 1,
                    editing_rights: 'organizer',
                    invitation_rights: 'organizer',
                    documents_rights: 'organizer'
                }, sync.defer()));
                sync.await(document.save({
                    flashmob_id: 1,
                    name: 'doc1.doc',
                    path: 'tpp1'
                }, sync.defer()));
                sync.await(document.save({
                    flashmob_id: 2,
                    name: 'doc2.doc',
                    path: 'tpp2'
                }, sync.defer()));
                var data = sync.await(flashmob.findById(1, sync.defer()));
                var documents = sync.await(data.getDocuments(sync.defer()));
                documents.length.should.be.equal(1);
                documents[0].flashmob_id.should.be.equal(1);
                done();
            });
        });
    });
});
