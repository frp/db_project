var Users = require("../../models/user")

exports.get = function(req, res, next){
    var userId = req.params.id
    console.log(userId);
    Users.findById(userId, function(err, user){
        if(err) res.send("User not found")
        else{
            console.log(user.id);
            if(user.id == req.session.userId) {
                console.log("profile")
                res.render("profile", {user:user, session: req.session})
            }else
                res.render('userPage', {user:user, session: req.session})

        }
    })
}
exports.post = function(req, res, next){
// TODO: are we need this?
}