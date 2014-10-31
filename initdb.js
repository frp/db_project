var dbaccess = require('./models/dbaccess')
var user = require('./models/user')

// FIXME: remove testing logic from here
user.initTables(function(err) {
	if (err) throw err;
	console.log('Tables initialized');
	user.save({
		name: 'Roman',
		surname: 'Franchuk'
	}, function(err) {
		if (err) throw err;
		user.findById(1, function(err, row) {
			if (err) throw err;
			row['name'] = 'Serhiy';
			user.save(row, function(err) {
				if (err) throw err;
				user.findById(1, function(err, row) {
					console.log(row);
					dbaccess.pool.end(function() {});
				});
			});
		});
	});
});

