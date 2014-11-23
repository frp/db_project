var dbaccess = require('./dbaccess');
var tableName = dbaccess.prefix + 'flashmobs';
var membership = require('./membership');
var _ = require('lodash');
var stage = require('./stage');
var comment = require('./comment');

// FIXME: determine which fields are required and which aren't
var schema = {
	id: {
		db_type: 'INT',
		primary_key: true,
		auto_increment: true
	},
	organizer: {
		db_type: 'INT',
		foreign_key: true,
		referenceTable: dbaccess.prefix + 'users',
		referenceField: 'id',
		required: true
	},
	title: {
		db_type: 'VARCHAR',
		required: true,
		length: 255
	},
	start_datetime: {
		db_type: 'DATETIME',
		required: true
	},
	end_datetime: {
		db_type: 'DATETIME',
		required: true
	},
	type: {
		db_type: 'ENUM',
		values: ['open', 'semiopen', 'closed'],
		required: true
	},
	status: {
		db_type: 'ENUM',
		values: ['active', 'finished', 'cancelled' ],
		required: true
	},
	editing_rights: {
		db_type: 'ENUM',
		values: ['organizer', 'main_moderators', 'moderators'],
		required: true
	},
	documents_rights: {
		db_type: 'ENUM',
		values: ['organizer', 'main_moderators', 'moderators', 'members'],
		required: true
	},
	invitation_rights: {
		db_type: 'ENUM',
		values: ['organizer', 'main_moderators', 'moderators', 'members'],
		required: true
	},
	location: {
		db_type: 'VARCHAR',
		length: 100,
		required: true
	},
	main_image: {
		db_type: 'VARCHAR',
		length: 255
	},
	short_description: {
		db_type: 'TEXT'
	},
	full_description: {
		db_type: 'TEXT'
	}
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
	membership.find({ flashmob_id: this.id }, [], cb);
};

Flashmob.prototype.deleteMember = function(userId, type, cb) {
	membership.deleteWhere({
		user_id: userId,
		membership_type: type,
		flashmob_id: this.id
	}, cb);
};

Flashmob.prototype.addStage = function(stageData, cb) {
	stage.save(_.assign({flashmob_id: this.id}, stageData), cb);
};

Flashmob.prototype.getStages = function(cb) {
	stage.find( {flashmob_id: this.id }, [], cb);
};

Flashmob.prototype.addComment = function(data, cb) {
	comment.save(_.assign({flashmob_id: this.id}, data), cb);
};

Flashmob.prototype.getComments = function(cb) {
	comment.find({flashmob_id: this.id}, [], cb);
};

exports.findById = dbaccess.findByIdFunction(tableName, 'id', new Flashmob());

exports.save = dbaccess.saveFunction(tableName, schema, 'id');

exports.initTables = function(cb) {
	dbaccess.createTable(tableName, schema, function(err){
		cb(err);
	});
};

exports.find = dbaccess.findFunction(tableName);