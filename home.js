const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const get = function(req, res) {
    console.log('/dashboard');
    con.connect(function (err) {
        let totalResult = [];
        let tables = [];
        let revenue = [];
        let rank_dish = [];
        let rota = [];

        con.query("select * from mytable", function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                tables.push(value);
            })
            totalResult.push(tables);
        });

        con.query("SELECT sum(total_cost) as revenue FROM `bill` WHERE check_date = CURRENT_DATE", function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                revenue.push(value);
            })
        });

        con.query("SELECT sum(total_cost) as revenue FROM `bill` WHERE MONTH(check_date) = MONTH(CURRENT_DATE)", function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                revenue.push(value);
            })
        });

        con.query("SELECT sum(total_cost) as revenue FROM `bill` WHERE YEAR(check_date) = YEAR(CURRENT_DATE)", function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                revenue.push(value);
            })
            totalResult.push(revenue);

        })

        con.query("SELECT food_name, soluong                            \n \
                from                                                    \n \
                    (SELECT id_food, sum(food_count) as soluong         \n \
                        FROM `billdetail` GROUP BY id_food) as duy,     \n \
                    food                                                \n \
                where duy.id_food = food.id                             \n \
                order by duy.soluong desc                               \n \
                limit 3"
            , function (err, results) {
                if (err) throw err;
                results.map((value, key) => {
                    rank_dish.push(value);
                })
                totalResult.push(rank_dish);
            })

        con.query("SELECT e.name, ew.working, ew.countleave \n \
                    FROM `employee` as e,`employ_work` as ew \n \
                    WHERE e.id = ew.id",
            function (err, results) {
                if (err) throw err;
                results.map((value, key) => {
                    rota.push(value);
                })
                totalResult.push(rota);

                console.log(totalResult);
                res.send(JSON.stringify(totalResult));
            })
    });
}

module.exports = {
    get,
}
