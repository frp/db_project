var Users = require("../../models/user")

exports.get = function(req, res, next){
    var userId = req.params.id
    Users.findById(userId, function(err, user){
        if(err) res.send("User not found")
        else{
            res.render("userPage", {
                user :user,
                userId: req.session.userId
            })
        }
    })
}
exports.post = function(req, res, next){
// TODO: are we need this?
}