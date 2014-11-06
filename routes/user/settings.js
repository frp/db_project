var Users = require("../../models/user")
exports.get = function(req, req, next){
    if(req.session.userId == req.param.id)
        Users.findById(req.session.userId, function(err, user){
            if(err)
                res.send("somethink happened")
            else
                res.render("settings", user)
        })
    else{
        res.render("error",{Error: "Session not found"})
    }
}
exports.post = function(req, res, next){
    //TODO: do something, please
    user = req.body
    Users.save(user, function(err){
        if(err) res.send("Error save")
        else res.redirect("/users/"+req.session.id+"/setings")
    })
    res.redirect("/users/"+req.session.id)
}