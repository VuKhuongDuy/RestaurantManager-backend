const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const get = function(req, res) {
        let totalResult = [];
        let tables = [];
        let revenue = [];
        let rank_dish = [];
        let rota = [];

        con.query("select * from mytable", function (err, results) {
            if (err) console.log(err);
            results.map((value, key) => {
                tables.push(value);
            })
            totalResult.push(tables);
        });

        con.query("SELECT sum(total_cost) as revenue FROM `bill` WHERE check_date = CURRENT_DATE", function (err, results) {
            if (err) console.log(err);
            results.map((value, key) => {
                revenue.push(value);
            })
        });

        con.query("SELECT sum(total_cost) as revenue FROM `bill` WHERE MONTH(check_date) = MONTH(CURRENT_DATE)", function (err, results) {
            if (err) console.log(err);
            results.map((value, key) => {
                revenue.push(value);
            })
        });

        con.query("SELECT sum(total_cost) as revenue FROM `bill` WHERE YEAR(check_date) = YEAR(CURRENT_DATE)", function (err, results) {
            if (err) console.log(err);
            results.map((value, key) => {
                revenue.push(value);
            })
            totalResult.push(revenue);

        })

        con.query("SELECT food_name, sum(food_count) as soluong         \n \
                        FROM `billdetail`                               \n \
                    GROUP BY food_name                                  \n \
                    order by soluong desc                               \n \
                    limit 3"
            , function (err, results) {
                if (err) console.log(err);
                results.map((value, key) => {
                    rank_dish.push(value);
                })
                totalResult.push(rank_dish);
            })

        con.query("SELECT e.name, ew.working, ew.countleave \n \
                    FROM `employee` as e,`employ_work` as ew \n \
                    WHERE e.id = ew.id",
            function (err, results) {
                if (err) console.log(err);
                results.map((value, key) => {
                    rota.push(value);
                })
                totalResult.push(rota);

                res.send(JSON.stringify(totalResult));
            })
}

const getUser = function(req,res){
    const id = req.params.id
    console.log('---------');
    con.query('select user_account from account where id = '+id,function(err,results){
        if(err) console.log(err);
        res.send(JSON.stringify(results));
    })
}

const postUser = function(req,res){
    const id = req.params.id;
    con.query('select user_password from account where id = '+id, function(err,results){
        if(err) console.log(err)
        password = results[0].user_password;
        if(password === req.body.oldPassword){
            con.query('update account set user_password = "'+ req.body.newPassword + '" where id = '+id,function(err,results){
                if(err) console.log(err);
                res.send('success')
            })
        }else{
            res.send('fail')
        }
    })
}

module.exports = {
    get,
    getUser,
    postUser
}
