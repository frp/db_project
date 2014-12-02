exports.getCookie = function(){
    return {
        httpOnly:true,
        maxAge: null
    }
}

exports.connectionInfo = {
    connectionLimit: 10,
    host: process.env.DBP_HOST || 'localhost',
    user: process.env.DBP_USER || 'db_project',
    password: process.env.DBP_PASSWORD || process.env.DBP_PASSWORD ? '' : 'db_password',
    database: process.env.DBP_DATABASE || 'db_project'
};

exports.dbPrefix = 'dbp_';
