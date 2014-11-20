var dbaccess = require('./models/dbaccess');
var user = require('./models/user');
var flashmob = require('./models/flashmob');
var membership = require('./models/membership');

dbaccess.dropAllTables(function(err) {
	console.log('Tables deleted');
	if (err) throw err;
	user.initTables(function(err) {
		flashmob.initTables(function(err) {
			if (err) throw err;
			membership.initTables(function (err) {
				console.log('Tables initialized');
				dbaccess.pool.end(function() {});
			});
		});
	});
});


