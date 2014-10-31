/**
 * Created by wolkdj on 31.10.14.
 */
var Users = require("../models/user")

exports.get = function(req, req, next){
    res.render("home");
}
exports.post = function(req, res, next){
    Users.authorization(req.body.login, req.body.password, function(err, userId){
        if(err) res.render("/home", {Error: "User not found or wrong password"})
        else {
            req.session.userId = userId;
            res.redirect(200,"/users/"+userId);
        }
    })
}