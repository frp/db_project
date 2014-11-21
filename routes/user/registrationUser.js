var Users = require("../../models/user")

exports.get = function(req, res, next){
    res.render('registration');
}
exports.post = function(req, res, next){

    console.log(req.body)
    req.assert("login", "Incorrect email").notEmpty();
    req.assert("email", "Incorrect email").isEmail();
    req.assert("password", "Incorrect password").len(4,20);
    req.assert("passwordConfirmation", "Passwords do not match").equals(req.body.password)

    var errors = req.validationErrors();

    if (errors) {
        console.log("errors")
        res.render("registration");
    }
    else{
        delete req.body.passwordConfirmation
        delete req.body.rulesAccept
        delete req.body.captcha
        delete req.body.submit

        //FIXME: location and other contacts, show_email(on->true, off->false)
        delete req.body.location
        delete req.body.hideOtherContats
        Users.save(req.body, function(err){
                if(err){console.log("next errors")
                    next(err)}
                else{
                    console.log("qwerty")
                    res.send("Registration successful <a href='/'>on first page</a>")
                    //TODO: подумать, куда его редиректнуть
                }
            }
        )
    }

}