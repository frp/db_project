var dbaccess = require('./models/dbaccess');
var user = require('./models/user');
var flashmob = require('./models/flashmob');
var membership = require('./models/membership');
var stage = require('./models/stage');
var comment = require('./models/comment');
var message = require('./models/message');
var document = require('./models/document');
var sync = require('synchronize');

sync.fiber(function() {
	sync.await(dbaccess.dropAllTables(sync.defer()));
	console.log('Tables deleted');
	sync.await(dbaccess.dropAllTables(sync.defer()));
	sync.await(user.initTables(sync.defer()));
	sync.await(flashmob.initTables(sync.defer()));
	sync.await(membership.initTables(sync.defer()));
	sync.await(stage.initTables(sync.defer()));
	sync.await(comment.initTables(sync.defer()));
	sync.await(message.initTables(sync.defer()));
	sync.await(document.initTables(sync.defer()));
	console.log('Tables initialized');
	dbaccess.pool.end(function() {});
});
