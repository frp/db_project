var Users = require("../../models/user")
var dateFormat = require("dateformat")
exports.get = function(req, res, next){
    var userId = req.params.id
    Users.findById(userId, function(err, user){
        if(err) res.send("User not found")
        else{
            console.log(user.birthDate);
            normalizeUser(user)
            if(user.id == req.session.userId) {
                res.render("profile", {user:user, session: req.session})
            }else
                res.render('userPage', {user:user, session: req.session})

        }
    })
}
exports.post = function(req, res, next){
// TODO: are we need this?
}
function normalizeUser(user)
{
    user.birthDate = dateFormat(user.birthDate, "dd mm yyyy");
    if (user.sex == "M")
        user.sex = "Male";
    else if (user.sex == "F")
        user.sex = "Female";
}