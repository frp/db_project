exports = function(app){
    app.get('/', require("/home").get)
    app.post('/', require("/home").post)

    app.get('/users', require('users').get)
    app.post('/users', require('users').post)

    app.get('/registration', require('registration').get)
    app.post('/registration', require('registration').post)

    app.get('/users/:id', require('userPage'.get))
    app.get('/users/settings', require('settings'.get))

}