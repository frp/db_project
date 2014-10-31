var Users = require("../models/user")

exports.get = function(req, res, next){
    res.render('registration');
}
exports.post = function(req, res, next){

    req.checkBody("email", "Incorrect email").isEmail();
    req.checkBody("password", "Incorrect password").is(/^\w{6,20}$/)
    req.checkBody("passwordConfirmation", "Passwords do not match").equals("password")
    req.checkBody("name","Name can't be empty").notEmpty()
    req.checkBody("surname", "Name can't be empty").notEmpty()

    var errors = req.validationErrors();

    if (errors) res.render("/registration");
    else{
        Users.save(req.body, function(err){
                if(err) next(err)
                else{
                    res.send("Registration successful")
                }
            }
        )
    }

}