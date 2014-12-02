var user = require('../models/user');
var flashmob = require('../models/flashmob');
var membership = require('../models/membership');
var dbaccess = require('../models/dbaccess');
var stage = require('../models/stage');
var comment = require('../models/comment');
var message = require('../models/message');
var document = require('../models/document');
var sync = require('synchronize');

exports.setUpDb = function (cb) {
    return function(test) {
        sync.fiber(function(){
            sync.await(dbaccess.dropAllTables(sync.defer()));
            sync.await(user.initTables(sync.defer()));
            sync.parallel(function() {
                flashmob.initTables(sync.defer());
                message.initTables(sync.defer());
            });
            sync.await();
            sync.parallel(function() {
                membership.initTables(sync.defer());
                stage.initTables(sync.defer());
                comment.initTables(sync.defer());
                document.initTables(sync.defer());
            });
            sync.await();
            cb(test);
        });
    };
};

exports.setUpFlashmob = function(cb) {
    return function(test) {
        flashmob.save({
            title: 'My first flashmob',
            start_datetime: new Date(2014, 1, 1),
            end_datetime: new Date(2014, 1, 2),
            type: 'open',
            status: 'active',
            organizer: 1,
            editing_rights: 'organizer',
            invitation_rights: 'organizer',
            documents_rights: 'organizer'
        }, function (err) {
            if (err) throw err;
            cb(test);
        });
    };
};

exports.setUpUser = function(cb) {
    return function(test) {
        user.save({
            login: 'user',
            email: 'test@gmail.com',
            password: 'testpass'
        }, function (err) {
            if (err) throw err;
            cb(test);
        });
    };
};
