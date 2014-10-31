var Users = require("../models/user")
exports.get = function(req, req, next){
    if(req.session.userId)
        Users.findById(req.session.userId, function(err, user){
            if(err)
            res.render("settings", user)
        })
    else{
        res.render("error",{Error: "Session not found"})
    }
}
exports.post = function(req, res, next){
    //TODO: do something, please
    res.redirect("/users/"+req.session.id)
}