var Flash = require("../../models/flashmob")

exports.get = function(req, res, next){
    if (req.session.userId)
        res.render('createFlashmob');
    else
        res.redirect("/")
}
exports.post = function(req, res, next){

    req.assert("title", "Incorrect email").notEmpty();
    req.assert("title", "Incorrect email").notEmpty();
    req.assert("title", "Incorrect email").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render("registration");
    }
    else{
        req.body.organizer = req.session.id;
        Flash.save(req.body, function(err){
                if(err) next(err)
                else{
                    res.send("Registration successful <a href='/'>on first page</a>")
                    //TODO: подумать, куда его редиректнуть
                }
            }
        )
    }

}