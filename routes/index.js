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

    //app.post('/falshmob/:id', require('./flashmob/flashmobPage').post)
    app.get('/createFlashmob',require('./flashmobs/registrationFlashmob').get)
    app.post('/createFlashmob',require('./flashmobs/registrationFlashmob').post)
}
