var user = require('../models/user');
var flashmob = require('../models/flashmob');
var membership = require('../models/membership');
var dbaccess = require('../models/dbaccess');
var stage = require('../models/stage');
var comment = require('../models/comment');

exports.setUpFlashmobTables = function (cb) {
    return function(test) {
        flashmob.initTables(function(err) {
            if (err) throw err;
            cb(test);
        });
    }
};

exports.setUpUserTables = function (cb) {
    return function(test) {
        user.initTables(function(err) {
            if (err) throw err;
            cb(test);
        });
    }
};

exports.setUpMembershipTables = function (cb) {
    return function(test) {
        membership.initTables(function(err) {
            if (err) throw err;
            cb(test);
        });
    }
};

exports.setUpStageTables = function (cb) {
    return function(test) {
        stage.initTables(function(err) {
            if (err) throw err;
            cb(test);
        });
    }
};

exports.setUpCommentTables = function (cb) {
    return function(test) {
        comment.initTables(function(err) {
            if (err) throw err;
            cb(test);
        });
    }
};

exports.setUpDb = function (cb) {
    return function(test) {
        dbaccess.dropAllTables(function(err, result) {
            if (err) throw(err);
            exports.setUpUserTables(exports.setUpFlashmobTables(exports.setUpMembershipTables(
                exports.setUpStageTables(exports.setUpCommentTables(cb)))))(test);
        });
    }
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
    }
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
    }
};
