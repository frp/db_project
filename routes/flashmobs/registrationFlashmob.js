var Flash = require("../../models/flashmob")

exports.get = function(req, res, next){
    if (req.session.userId)
        res.render('flashmobs_create',{session:req.session});
    else
        res.redirect("/")
}
exports.post = function(req, res, next){

    req.assert("title", "Incorrect email").notEmpty();
    req.assert("start_datetime", "Incorrect email").isDate()
    req.assert("end_datetime", "Incorrect email").isDate();

    var errors = req.validationErrors();

    if (errors) {
        res.render("flashmobs_create", {session:req.session});
    }
    else{
        var flashmob = normalizeFlashmob(req.body, req.session.userId)
        Flash.save(flashmob, function(err){
                if(err) console.log(err)
                else{
                    res.send("Registration successful <a href='/'>on first page</a>")
                    //TODO: подумать, куда его редиректнуть
                }
            }
        )
    }
}

function normalizeFlashmob(flashmob, id)
{
    var newFlashmob = {
        organizer: id,
        title: flashmob.title,
        start_datetime: new Date(flashmob.start_datetime),
        end_datetime: new Date(flashmob.end_datetime),
        type: flashmob.type,
        status: "active",
        editing_rights: flashmob.editing_rights,
        documents_rights: flashmob.documents_rights,
        invitation_rights: flashmob.invitation_rights,
        main_image:"bla-bla-bla",
        short_description: flashmob.short_description,
        full_description: flashmob.full_description
    }
    return newFlashmob
}