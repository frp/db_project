var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')
var SessionStore = require('express-mysql-session');
var config = require('./config');
var user = require('./models/user');
var dbaccess = require('./models/dbaccess');
var sessionStore = new SessionStore(config.connectionInfo);
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
app.set("sessionStore", sessionStore)
app.use(session({
    name: config.getName(),
    key: config.getKey(),
    saveUninitialized: true,
    resave: true,
    secret: config.getSecret(),
    cookie: config.getCookie(),
    store: app.get("sessionStore")
}));
    


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

var server = http.createServer(app)

//SocetIO
var io = require('socket.io')(server);

io.use(function(socket, next) {
        var data = socket.handshake;
        if (! data.headers.cookie) {
            return next(new Error('Missing cookie headers'));
        }
        console.log('cookie header ( %s )', data.headers.cookie);
        var cookies = cookie.parse(data.headers.cookie);
        console.log('cookies parsed ( %s )', cookies[config.getName()]);
        if (! cookies[config.getName()]) {
            return next(new Error('Missing cookie ' + config.getName()));
        }
        var sid = cookieParser.signedCookie(cookies[config.getName()], config.getSecret());
        console.log(sid);
        if (! sid) {
            return next(new Error('Cookie signature is not valid'));
        }
                console.log('session ID ( %s )', sid);
        data.sid = sid;
        sessionStore.get(sid, function(err, session) {
            if (err) return next(err);
            if (! session) return next(new Error('session not found'));
            data.session = session;
            next();
                

        });
});

io.on('connection', function(socket){
    console.log(socket.handshake.session.userId)
        socket.on('chat message', function(msg){
            user.findById(socket.handshake.session.userId, function(err, user){
                io.emit('chat message', user.login+"  "+socket.handshake.session.userId, msg);
            })
        });
    
});


module.exports = server;