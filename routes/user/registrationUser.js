var Users = require("../../models/user")

exports.get = function(req, res, next){
    if(req.session.userId)
        res.redirect("/users/"+req.session.userId)
    else
        res.render('registration',{session: req.session});
}
exports.post = function(req, res, next){


    req.assert("login", "Incorrect email").notEmpty();
    req.assert("email", "Incorrect email").isEmail();
    req.assert("password", "Incorrect password").len(4,20);
    req.assert("passwordConfirmation", "Passwords do not match").equals(req.body.password)

    var errors = req.validationErrors();

    if (errors) {
        console.log("errors")
        res.render("registration",{session: req.session});
    }
    else{
        var user = normalizeUser(req.body)
        Users.save(user, function(err){
                if(err){console.log("next errors")
                    next(err)}
                else{
                    res.send("Registration successful <a href='/'>on first page</a>")
                    //TODO: подумать, куда его редиректнуть
                }
            }
        )
    }
}
function normalizeUser(user){
    var normUser={};
    normUser.login = user.login;
    normUser.name = user.name;
    normUser.surname = user.surname;
    normUser.sex = user.sex;
    normUser.location = user.location;
    normUser.interests = user.interests;
    normUser.email = user.email;
    normUser.birthDate = user.birthDate;
    normUser.phone = user.phone;
    normUser.skype = user.skype;
    normUser.other = user.other;
    normUser.password = user.password;
    normUser.show_email = (user.show_email == 'on');
    normUser.show_phone = (user.show_phone == 'on');
    normUser.show_skype = (user.show_skype == 'on');
    return normUser
}