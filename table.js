const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const get_Table = function (req, res) {
    let totalResult = [];
    let tables = [];
    let billdetail = [];

    con.query("select * from mytable", function (err, results) {
        if (err) console.log(err);
        results.map((value, key) => {
            tables.push(value);
        })
        totalResult.push(tables);
    });

    con.query('select bill.id_table, billdetail.food_name, billdetail.food_count \n \
        from bill,billdetail \n \
        where bill.id = billdetail.id and payment = "no"',
        function (err, results) {
            if (err) console.log(err);
            results.map((value, key) => {
                billdetail.push(value);
            })
            totalResult.push(billdetail);
            res.send(JSON.stringify(totalResult));
        }
    );
}

const post_table = function (req, res) {
    con.query("insert into mytable(status) values('empty')", function (err) {
        if (err) console.log(err);
        res.send('Thành công');
    });

}

const post_bill = function (req, res) {
    const id = req.body.id_table;
    var id_bill = 0;
    var query1 = 'select id from bill where id_table = ' + Number(id) + " and payment = 'no'";
    con.query(query1, function (err, results) {
        if (err){
            console.error(err)
        }

        results.map((value, key) => {
            const objectJson = value;
            id_bill = objectJson.id;
        });

        if (id_bill > 0) {
            const query2 = 'select * from billdetail where id = ' + id_bill
            con.query(query2, function (err, results) {
                if (err) {
                    console.error(err)
                }
                req.body.data.map((food, key) => {
                    let flat = 0;
                    results.map((value, key) => {
                        if (food.food_name == value.food_name) {
                            food.count = Number(food.count) + Number(value.food_count);
                            flat = 1;
                        }
                    })
                    if (flat === 0) {
                        con.query('insert into billdetail(id,food_name,food_count) values (' + id_bill + ',"' + food.food_name + '",' + food.count + ')', function (err) {
                            if (err) {
                                console.error(err)
                            }
                            res.send('Thành công');
                        })
                    } else {
                        con.query('update billdetail set food_count = ' + Number.parseInt(food.count) + ' where food_name = "' + food.food_name + '" and id = ' + id_bill, function (err) {
                            if (err){
                                console.error(err)
                            }
                            res.send('Thành công');
                        })
                    }
                })
            });
        }
    });
}

const get_food = function (req, res) {
    var foods = [];
    con.query('select * from food', function (err, results) {
        if (err) console.log(err);
        results.map((value, key) => {
            foods.push(value);
        })
        res.send(JSON.stringify(foods));
    });
}

const put_status = function (req, res) {
    var today = new Date();
    var strToday = today.getFullYear() + "-" + (Number.parseInt(today.getMonth()) + Number(1)) + "-" + today.getDate();
    let status = 'true'

    const query = 'select * from mytable where id = ' + req.body.data;
    con.query(query, function (err, results) {
        if (err) console.log(err);
        results.map((value, key) => {
            status = value.status;
        })
        if (status === 'empty') {
            const query1 = 'update mytable set status="notempty" where id = ' + req.body.data
            con.query(query1, function (err) {
                if (err) console.log(err);
            });

            const query2 = 'insert into bill(id_table,check_date,total_cost,payment) \n \
                            values ('+ req.body.data + ',"' + strToday + '",' + 0 + ',"no")';
            con.query(query2, function (err) {
                if (err) console.log(err);
                res.send('Thành công');
            });
        }
    })
}

const get_BillDetail = function (req, res) {
    const id_table = req.params.id;
    let id_bill = 0;
    const query = 'select id from bill where id_table = ' + id_table + ' and payment = "no" ';
    con.query(query, function (err, results) {
        if (err) console.log(err)
        results.map((value, key) => {
            id_bill = value.id
        })

        const query2 = 'SELECT food.food_name, billdetail.food_count, (food.food_price*billdetail.food_count) as price \n \
                            FROM billdetail, food \n \
                            WHERE billdetail.id = '+ id_bill + ' and billdetail.food_name = food.food_name'
        con.query(query2, function (err, results) {
            if (err) console.log(err);
            res.send(JSON.stringify(results));
        })
    })
}

const post_payment = function (req, res) {
    const id_table = req.params.id;
    let query = "update mytable set status='empty' where id = " + Number(id_table);
    con.query(query, function (err) {
        if (err) console.log(err)
    })

    con.query("update bill set payment='yes', total_cost = "+req.body.totalPrice+" where id_table = " + Number(id_table) + " and payment = 'no'", function (err) {
        if (err) console.log(err);
        res.send('Thành công');
    })
}

const post_changeTable = function (req, res) {
    con.query('update bill set id_table = ' + Number(req.body.id_New) + ' where payment = "no" and id_table = ' + Number(req.body.id_Old), function (err) {
        if (err) console.log('error 1')
    });

    con.query('update mytable set status = "empty" where id = ' + Number(req.body.id_Old), function (err) {
        if (err) console.log('error 2')
    });

    con.query('update mytable set status = "notempty" where id = ' + Number(req.body.id_New), function (err) {
        if (err) console.log('error 3')
        res.send('Thành công');
    });
}

module.exports = {
    get_Table,
    post_table,
    post_bill,
    get_food,
    put_status,
    get_BillDetail,
    post_payment,
    post_changeTable
}