function abcd(sql, val, fn){
    const mysql = require('mysql');
    const conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'sd',
    })
    conn.connect();
    conn.query(sql, val, fn);
    conn.end();
}

module.exports = {
    abcd
}
