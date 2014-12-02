var document = require('../../models/document');

exports.get = function(req, res, next) {
    document.findById(req.params.id, function(err, doc) {
        if (err) return next(err);
        else res.download(doc.path, doc.name);
    });
};
