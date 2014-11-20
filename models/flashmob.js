var dbaccess = require('./dbaccess');
var tableName = dbaccess.prefix + 'flashmobs';
var membership = require('./membership');

// FIXME: determine which fields are required and which aren't
var schema = {
	id: {
		db_type: 'INT',
		primary_key: true,
		auto_increment: true
	},
	title: {
		db_type: 'VARCHAR',
		length: 255
	},
	// FIXME: rethink this field's type and usage
	status: {
		db_type: 'VARCHAR',
		length: 50
	},
	// FIXME: rethink this field's usage
	place: {
		db_type: 'VARCHAR',
		length: 100
	},
	// FIXME: maybe it should be datetime?
	date: {
		db_type: 'DATE'
	},
	description: {
		db_type: 'TEXT'
	},
	// FIXME: rethink this field's type and usage
	type: {
		db_type: 'VARCHAR',
		length: 100
	}
	// FIXME: think about other needed fields
};

function Flashmob() {

}

Flashmob.prototype.addMember = function(userId, type, cb) {
	membership.save({
		user_id: userId,
		flashmob_id: this.id,
		membership_type: type
	}, cb);
};

Flashmob.prototype.getMembers = function(cb) {
	membership.find({ flashmob_id: this.id }, cb);
};

Flashmob.prototype.deleteMember = function(userId, type, cb) {
	membership.deleteWhere({
		user_id: userId,
		membership_type: type,
		flashmob_id: this.id
	}, cb);
};

exports.findById = dbaccess.findByIdFunction(tableName, 'id', new Flashmob());

exports.save = dbaccess.saveFunction(tableName, schema, 'id');

exports.initTables = function(cb) {
	dbaccess.createTable(tableName, schema, function(err){
		cb(err);
	});
};

exports.search = function(filter, callback){
	// TODO: think about what is needed to be done here
};