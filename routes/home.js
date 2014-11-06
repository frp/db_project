/**
 * Created by wolkdj on 31.10.14.
 */
var Users = require("../models/user")

module.exports.get = function(req, res, next){
    res.render("home");
}
module.exports.post = function(req, res, next){

    req.assert("login","Name can't be empty").notEmpty()
    req.assert("password","Name can't be empty").notEmpty()

    var errors = req.validationErrors();

    if (errors) {
        res.redirect("/");
    }
    else {
        //TODO: authorisation doesn't work with empty login and password

        Users.authorization(req.body.login, req.body.password, function (err, userId) {
            if (err) res.render("/home")
            else {
                req.session.userId = userId;
                res.redirect("/users/" + userId);
            }
        })
    }
}