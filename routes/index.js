var Flashmob = require("../models/flashmob")

var multer = require('multer');

module.exports = function(app){
    app.get('/', require("./home").get)
    app.post('/', require("./home").post)

    app.get('/users', require('./user/users').get)
    app.post('/users', require('./user/users').post)

    app.get('/registration', require('./user/registrationUser').get)
    app.post('/registration', require('./user/registrationUser').post)

    app.get('/users/:id', require('./user/userPage').get)
    app.get('/users/:id/settings', require('./user/settings').get)

    app.get('/flashmobs/:id', require('./flashmobs/flashmobPage').get)

    app.get('/documents/:id', require('./documents/download').get);

    //app.post('/falshmob/:id', require('./flashmob/flashmobPage').post)
    app.get('/createFlashmob',require('./flashmobs/registrationFlashmob').get)
    app.post('/createFlashmob',require('./flashmobs/registrationFlashmob').post)

    app.get('/flashmobs/:id/in', function(req,res){
        Flashmob.findById(req.params.id, function(err, flashmob){
            if(err) res.send("{HTYM GJKYFZ !")
            else{
                flashmob.addMember(req.session.userId, "member", function(err){
                    if(err) res.send("ХРЕНЬ ПОЛНАЯ")
                    else{
                        res.redirect('/flashmobs/'+req.params.id)
                    }
                })
            }
        })
    })

    app.post('/flashmobs/:id/addcomment', function(req,res){
        Flashmob.findById(req.params.id, function(err, flashmob){
            if(err) res.send("{HTYM GJKYFZ !")
            else{
                var comm = {text: req.body.text, flashmob_id: req.params.id, user_id: req.session.userId, date: new Date() }
                flashmob.addComment(comm, function(err){
                    if(err) res.send("ХРЕНЬ ПОЛНАЯ")
                    else{
                        res.redirect('/flashmobs/'+req.params.id)
                    }
                })
            }
        })
    })

    app.post('/flashmobs/:id/documents/', multer({dest: "./public/uploads"}), require('./flashmobs/documents').post)


    app.get('/exit', function(req,res){
        req.session.userId = null;
        req.session.login = null;
        res.redirect('/');
    })
}
