const mysql = require('mysql');

const connect  = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const getAccount = function(req, res) {
    console.log('login');
    connect.connect((err) => {
        connect.query('select * from account', function (err, results) {
            // con.release();
            if (err) throw err;
            else res.send(JSON.stringify(results));
        })
    });
}

const postAccount = function(req, res) {
    connect.connect(function (err) {
        var sql = 'insert into account(user_account,user_password) value("' + req.body.user.firstParam + '","' + req.body.user.secondParam + '")';
        connect.query(sql, function (err, results) {
            // con.release();
            if (err) throw err;
            else console.log('save ok');
        })
    });
}

module.exports = {
    getAccount,
    postAccount
}