var dbaccess = require('./models/dbaccess')
var user = require('./models/user')

user.initTables(function(err) {
	if (err) throw err;
	console.log('Tables initialized');
	dbaccess.pool.end(function() {});
});

