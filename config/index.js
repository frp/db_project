exports.getCookie = function(){
    return {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
    }
}
exports.getKey = function(){
	return "key"
}
exports.getSecret = function(){
	return "SecretKey"
}
exports.getName = function(){
    return "sid"
}

exports.connectionInfo = {
    connectionLimit: 10,
    host: process.env.DBP_HOST || 'localhost',
    user: process.env.DBP_USER || 'db_project',
    password: process.env.DBP_PASSWORD || process.env.DBP_PASSWORD ? '' : 'db_password',
    database: process.env.DBP_DATABASE || 'db_project'
};

exports.db_prefix = 'dbp_';
