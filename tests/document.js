var helpers = require('../testhelpers/dbhelpers');
var document = require('../models/document');
var dbaccess = require('../models/dbaccess');

describe('Document', function() {
    beforeEach(helpers.setUpDb(helpers.setUpUser(helpers.setUpFlashmob(function(done) {
        done();
    }))));

    it('should support adding it to database', function(done) {
        document.save({
            path: 'public/uploads/1',
            name: 'document1.doc',
            flashmob_id: 1
        }, function(err) {
            (err === null).should.be.true;
            done();
        });
    });

    it('should enforce required fields', function(done) {
        document.save({
            flashmob_id: 1
        }, function(err) {
            err.should.be.an.instanceOf(dbaccess.ValidationError);
            done();
        })
    })
});
