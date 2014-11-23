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
                        for(mem in members)
                            Users.findById(mem.user_id, function(err, user){
                                if (err) res.send("fuck")
                                else{
                                    var tmp = {
                                        id: user.id,
                                        login: user.login
                                    }
                                    massUsers.push(tmp)
                                }
                            })
                        data.members = massUsers;
                        console.log(data)
                        res.render("flashmobPage", data)
                        })
                })
            })
        }
    })
}
exports.post = function(req, res, next){
// TODO: are we need this method?
}
