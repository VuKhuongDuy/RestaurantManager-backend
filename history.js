const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const getListBill = function (req, res) {
    let totalData = []
    con.query('select * from bill', function (err, results) {
        if (err) console.log(err);
        totalData.push(results);
    });

    con.query('SELECT bd.id, bd.food_name, f.food_price, bd.food_count, (f.food_price*bd.food_count) as total_cost \n \
                FROM billdetail as bd, food as f \n \
                WHERE bd.food_name = f.food_name',
        function (err, results) {
            if (err) console.log(err);
            totalData.push(results)
            res.send(JSON.stringify(totalData));
        });
}

module.exports = {
    getListBill
}