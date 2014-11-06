var Flashmob = require("../../models/flashmob")

exports.get = function(req, res, next){
    var flashmobId = req.params.id
    Flashmob.findById(flashmobId, function(err, flashmob){
        if(err) res.send("not found")
        else{
            //TODO: is user admin?
            var admin = true

            res.render("flashmobPage", {
                flashmob :flashmob,
                userId: req.session.userId,
                isAdmin: admin
            })
        }
    })
}
exports.post = function(req, res, next){
// TODO: are we need this method?
}