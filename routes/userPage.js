var Users = require("../models/user")

exports.get = function(req, res, next){
    var userId = req.body.id
    Users.findById(userId, function(err, user){
        if(err) res.rendor("error")
        else{
            res.render("userPage", {
                user :user,
                id: req.session.userId
            })
        }
    })
}
exports.post = function(req, res, next){

}