var Flashmob = require("../../models/flashmob")

exports.get = function(req, res, next){
    var flashmobId = req.params.id
    res.render("flashmobPage")
    /*Flashmob.findById(flashmobId, function(err, flashmob){
        if(err) res.send("not found")
        else{
            //var admin = (flashmob.organizer==req.session.id)

            res.render("flashmobPage")
        }
    })*/
}
exports.post = function(req, res, next){
// TODO: are we need this method?
}