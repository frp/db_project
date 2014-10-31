/* GET users listing. */
exports.get = function(req, res, next){
  res.send('respond with a resource');
};
exports.post = function(req, res, next){
   //TODO: search and filter;
    res.render("users");
}
