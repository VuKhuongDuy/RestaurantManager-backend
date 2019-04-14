const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const getAccount = function(req, res) {
    console.log('login');
    con.connect(function (err) {
        con.query('select * from account', function (err, results) {
            if (err) throw err;
            else res.send(JSON.stringify(results));
        })
    });
}

const postAccount = function(req, res) {
    con.connect(function (err) {
        var sql = 'insert into account(user_account,user_password) value("' + req.body.user.firstParam + '","' + req.body.user.secondParam + '")';
        con.query(sql, function (err, results) {
            if (err) throw err;
            else console.log('save ok');
        })
    });
}

module.exports = {
    getAccount,
    postAccount
}