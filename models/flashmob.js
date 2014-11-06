
exports.findById = function(id, cb) {
    //TODO: callback(err, flashmob)
       cb(null, {
           id: 1,
           name: "myCoolFlashmob"
       });
};

exports.save = function(data, cb) {
    //
//    if (typeof data.user_id == 'undefined')
//        dbaccess.insertIntoTable(tableName, data, cb);
//    else
//        dbaccess.update(tableName, data, cb)

};
exports.search = function(filter, callback){
    //TODO: i need this method, please =);  callback(err, arrayOfFlashmobs)
    callback(null, [{
        user_id: 1,
        name: "qwerty",
        surname: "petrov",
        email: "qweqweqweqw@kkdkas.sd"
    },{
        user_id: 2,
        name: "wqwqwerty",
        surname: "wqwqpetrov",
        email: "yuioqweqweqweqw@kkdkas.sd"
    }])
}