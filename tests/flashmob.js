var flashmob = require('../models/flashmob')
var dbaccess = require('../models/dbaccess')

function setUpDb(cb) {
    return function(test) {
        flashmob.initTables(function(err) {
            if (err) throw err;
            cb(test);
        });
    }
}

function setUpFlashmob(cb) {
    return function(test) {
        flashmob.save({
            title: 'My first flashmob'
        }, function (err) {
            if (err) throw err;
            cb(test);
        });
    }
}

exports.testUpdating = setUpDb(setUpFlashmob(function(test)	{
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

exports.testFlashmobNotFound = setUpDb(function(test) {
    flashmob.findById(5, function(err, data) {
        test.equals(data, null);
        test.equals(err, flashmob.err_flashmob_not_found);
        test.done();
    });
});