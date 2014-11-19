var flashmob = require('../models/flashmob');
var dbaccess = require('../models/dbaccess');
var helpers = require('../testhelpers/dbhelpers.js');

exports.testUpdating = helpers.setUpDb(helpers.setUpFlashmob(function(test)	{
    flashmob.findById(1, function(err, row) {
        if (err) throw err;
        row['title'] = 'Changed title';
        flashmob.save(row, function(err) {
            if (err) throw err;
            flashmob.findById(1, function(err, row) {
                if (err) throw err;
                test.ok(row.title == 'Changed title', 'test updating');
                test.done();
            });
        });
    });
}));

exports.testFlashmobNotFound = helpers.setUpDb(function(test) {
    flashmob.findById(5, function(err, data) {
        test.equals(data, null);
        test.equals(err, dbaccess.err_record_not_found);
        test.done();
    });
});

exports.testAddingAMember = helpers.setUpDb(helpers.setUpFlashmob(helpers.setUpUser(function(test) {
    flashmob.findById(1, function(err, data) {
        data.addMember(1, 'admin', function(err) {
            if (err) throw err;
            flashmob.findById(1, function(err, data) {
                if (err) throw err;
                data.getMembers(function(err, data) {
                    if (err) throw err;
                    test.equals(data.length, 1);
                    test.done();
                });
            });
        });
    });
})));

exports.testDeletingAMember = helpers.setUpDb(helpers.setUpFlashmob(helpers.setUpUser(function(test) {
    flashmob.findById(1, function(err, data) {
        data.addMember(1, 'admin', function(err) {
            if (err) throw err;
            flashmob.findById(1, function(err, data) {
                if (err) throw err;
                data.deleteMember(1, 'admin', function(err) {
                    if (err) throw err;
                    data.getMembers(function(err, data) {
                        if (err) throw err;
                        test.equals(data.length, 0);
                        test.done();
                    });
                });
            });
        });
    });
})));