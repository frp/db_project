var Flash = require("../../models/flashmob")
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
    var flash = req.body
    flash.id = req.param.id;

    Flash.save(user, function(err){
        if(err) res.send("Error save")
        else res.redirect("/flashmobs/"+flash.id+"/setings")
    })
}