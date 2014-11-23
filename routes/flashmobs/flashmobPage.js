var Flashmob = require("../../models/flashmob")
var Users = require("../../models/user")
var sync = require('synchronize');
exports.get = function(req, res, next){
    var flashmobId = req.params.id
    var data = {session:req.session}
    var massUsers = []
    Flashmob.findById(flashmobId, function(err, flashmob){
        if(err) res.send("not found")
        else{
            data.flashmob = flashmob
            Users.findById(flashmob.organizer, function(err, user){
                data.organizer = {login: user.login, id: user.id}
                flashmob.getMembers(function(err, members){
                    sync.fiber(function(){
                        for(var i = 0; i < members.length; i++) {
                            var user = sync.await(Users.findById(members[i].user_id, sync.defer()));
                            var tmp = {
                                id: user.id,
                                login: user.login,
                                type: members[i].membership_type
                            };
                            massUsers.push(tmp)
                        }
                        data.members = massUsers;
                        flashmob.getComments(function(err, comments){
                            if(err) {console.log(err)
                            res.send("err coments")}
                            else{
                                data.comments = comments
                                res.render("flashmobPage", data)
                            }
                        })


                    });
                })
            })
        }
    })
}
exports.post = function(req, res, next){
// TODO: are we need this method?
}
