var Stage = require('../../models/stage');
var User = require('../../models/user');
var sync = require('synchronize');
var await = sync.await;
var defer = sync.defer;

function normalizeStage(data, flashmob) {
    return {
        title: data.title,
        description: data.description,
        responsible_id: await(User.find({login: data.user}, [], defer()))[0] ,
        flashmob_id: flashmob
    };
}

exports.post = function(req, res, next) {
    sync.fiber(function() {
        try {
            var stage = normalizeStage(req.body, req.params.id);
            await(Stage.save(stage, defer()));
            res.redirect('/flashmobs/' + req.params.id);
        }
        catch (err) {
            return next(err);
        }
    });
};
