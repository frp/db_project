/* GET users listing. */
var User = require("../../models/user")

exports.get = function(req, res, next){
    User.search(null, function(err, userList){
        if(err) res.send("Somethink problem, you hava 10 second for evacuations")
        else{
            res.render("users", {
                result: userList,
                userId: req.session.userId
            })
        }
    })
};
exports.post = function(req, res, next){
    //TODO: search and filter;
    res.render("users");
}
