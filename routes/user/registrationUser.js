var Users = require("../../models/user")

exports.get = function(req, res, next){
    res.render('registration');
}
exports.post = function(req, res, next){

    req.assert("email", "Incorrect email").isEmail();
    req.assert("password", "Incorrect password").len(4,20);
    req.assert("passwordConfirmation", "Passwords do not match").equals(req.body.password)
    req.assert("name","Name can't be empty").notEmpty()
    req.assert("surname", "Name can't be empty").notEmpty()

    var errors = req.validationErrors();

    if (errors) {
        res.render("registration");
    }
    else{
        delete req.body.passwordConfirmation
        Users.save(req.body, function(err){
                if(err) next(err)
                else{
                    res.send("Registration successful <a href='/'>on first page</a>")
                    //TODO: подумать, куда его редиректнуть
                }
            }
        )
    }

}