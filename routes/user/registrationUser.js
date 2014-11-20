var Users = require("../../models/user")

exports.get = function(req, res, next){
    res.render('registration');
}
exports.post = function(req, res, next){

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