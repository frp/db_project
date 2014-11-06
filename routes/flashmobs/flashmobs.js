/* GET users listing. */
var Flashmob = require("../../models/falshmob")

exports.get = function(req, res, next){
   Flashmob.search(null, function(err, flashmobList){
       if(err) res.send("Somethink problem, you hava 10 second for evacuations")
       else{
           res.render("flashmobs", {
               result: flashmobList,
               userId: req.session.userId
           })
       }
   })
};
exports.post = function(req, res, next){
   //TODO: search and filter;
    res.render("flashmobs");
}
