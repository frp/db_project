var Flashmob = require("../../models/flashmob")
var Users = require("../../models/user")
var sync = require('synchronize');
var _ = require('lodash');
exports.get = function(req, res, next){
    var flashmobId = req.params.id
    var data = {session:req.session}
    Flashmob.findById(flashmobId, function(err, flashmob){
        if(err) res.send("not found")
        else{
            data.flashmob = flashmob
            Users.findById(flashmob.organizer, function(err, user){
                data.organizer = {login: user.login, id: user.id}
                flashmob.getMembers(function(err, members){
                    sync.fiber(function(){
                        if (members.length > 0) {
                            sync.parallel(function () {
                                for (var i = 0; i < members.length; i++) {
                                    Users.findById(members[i].user_id, sync.defer());
                                }
                            });
                            data.members = _.map(sync.await(), function(user) {
                                return _.pick(user, ['id', 'login', 'membership_type']);
                            });
                        }
                        else data.members = [];
                        res.render("flashmobPage", data)
                    });
                })
            })
        }
    })
}
exports.post = function(req, res, next){
// TODO: are we need this method?
}
