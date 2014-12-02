var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')

var config = require('./config');

var user = require('./models/user');
var dbaccess = require('./models/dbaccess');


var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.session({secret: "my secret string",
    cookie: config.getCookie()}))

app.use(expressValidator());

app.use(app.router);



require('./routes')(app);





/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// nice error handlers
app.use(function(err, req, res, next) {
    if (err instanceof user.AuthenticationError)
        res.render('errors/autherror', {session: req.session});
    else if (err instanceof dbaccess.RecordNotFoundError)
        res.status(404).render('errors/notfounderr', {session: req.session});
    else return next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('errors/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
