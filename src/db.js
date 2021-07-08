exports.connect = function() {
    const mysql = require('mysql2');
    const connection = mysql.createConnection({
        user: process.env.MYSQL_USER,
        host: process.env.MYSQL_HOST,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });
    return connection;
}
