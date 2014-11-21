/**
 * Created by wolkdj on 31.10.14.
 */
var Users = require("../models/user")

module.exports.get = function(req, res, next){
    if(req.session.userId)
        res.redirect("/users/"+res.session.userId)
    else
        res.render("index");
}
module.exports.post = function(req, res, next){

    req.assert("login","Name can't be empty").notEmpty()
    req.assert("password","Name can't be empty").notEmpty()

    var errors = req.validationErrors();
    console.log(req.body)
    if (errors) {
        console.log("error")
        res.redirect("/");
    }
    else {
        //TODO: authorisation doesn't work with empty login and password

        Users.authorization(req.body.login, req.body.password, function (err, userId) {
            if (err) {
                res.render("index")}
            else {
                req.session.userId = userId;
                res.redirect("/users/" + userId);
            }
        })
    }
}