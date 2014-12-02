var Flashmob = require("../../models/flashmob")
var Users = require("../../models/user")
var sync = require('synchronize');
var _ = require('lodash');

var await = sync.await;
var defer = sync.defer;

exports.get = function(req, res, next){
    var flashmobId = req.params.id
    var data = {session:req.session}
    var massUsers = []
    sync.fiber(function() {
        var flashmob = await(Flashmob.findById(flashmobId, defer()));
        data.flashmob = flashmob;

        data.organizer = await(Users.findById(flashmob.organizer, defer()));
        var members = await(flashmob.getMembers(defer()));
        if (members.length > 0) {
            sync.parallel(function () {
                for (var i = 0; i < members.length; i++) {
                    Users.findById(members[i].user_id, sync.defer());
                }
            });
            data.members = _.map(sync.await(), function(user) {
                return _.pick(user, ['id', 'login']);
            });
            for (var i = 0; i < data.members.length; i++)
                data.members[i].type = members[i].membership_type;
        }
        else data.members = [];

        data.comments = await(flashmob.getComments(defer()));
        res.render("flashmobPage", data);
    }, function(err) {
        return next(err);
    });
};



exports.post = function(req, res, next){
// TODO: are we need this method?
}
