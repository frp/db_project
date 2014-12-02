var document = require('../../models/document');

exports.post = function(req, res, next) {
    console.log(req.files);
    if (!req.files.document) next(new Error("Document uploading error"));
    else if (!req.params.id) res.render('errors/notfounderr');
    else {
        document.save({
                path: req.files.document.path,
                name: req.files.document.originalname,
                flashmob_id: req.params.id
            }, function(err) {
                if (err) return next(err);
                res.redirect('/flashmobs/' + req.params.id);
            });
    }
};
