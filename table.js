const mysql = require('mysql');
const bodyParser = require('body-parser');


const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const get_Table = function (req, res) {
    console.log('/dashboard/tables');
    con.connect(function (err) {
        let totalResult = [];
        let tables = [];
        let billdetail = [];

        con.query("select * from mytable", function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                tables.push(value);
            })
            console.log(tables);
            totalResult.push(tables);
        });

        con.query("SELECT b.id_table, f.food_name, bd.food_count,b.total_cost \n \
                FROM `bill` as b, `food` as f, `billdetail` as bd \n \
                WHERE 	b.payment = 'no' and \n \
                        b.check_date = CURRENT_DATE and \n \
                        b.id=bd.id AND \n \
                        bd.id_food = f.id",
            function (err, results) {
                if (err) throw err;
                results.map((value, key) => {
                    billdetail.push(value);
                })
                totalResult.push(billdetail);
                res.send(JSON.stringify(totalResult));
            }
        );
    })
}

const post_table = function (req, res) {
    console.log("post tables add");

    con.connect(function (err) {
        con.query("insert into mytable(status) values('empty')");
    });
}

const post_bill = function (req, res) {
    const id = req.params.id;
    var id_bill = 0;
    con.connect(function (err) {
        var query1 = 'select id from bill where id_table = ' + Number(id) + " and check_date = CURRENT_DATE";
        con.query(query1, function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                const objectJson = value;
                id_bill = objectJson.id;
            });

            const query2 = 'select * from billdetail where id = ' + id_bill

            con.query(query2, function (err, results) {
                if (err) throw err;
                req.body.map((food, key) => {
                    let flat = 0;
                    results.map((value,key)=>{
                        if(food.id_food == value.id_food){
                            food.count = Number(food.count) + Number(value.food_count);
                            flat = 1;      
                        }
                    })
                    if(flat == 0){
                        con.query('insert into billdetail(id,id_food,food_count) values ('+id_bill+','+food.id_food+','+food.count+')', function(err){
                            if(err) throw err
                        })
                    }
                    con.query('update billdetail set food_count = '+Number(food.count)+' where id_food = '+Number(food.id_food), function(err){
                        if(err) throw err;
                    })
                })
            });
        });
    })
}

const get_food = function (req, res) {
    console.log('get list food');
    var foods = [];

    con.connect(function (err) {
        con.query('select * from food', function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                foods.push(value);
            })
            res.send(JSON.stringify(foods));
        });
    })
}

const put_status = function (req, res) {
    var today = new Date();
    var strToday = today.getFullYear() + "-" + (Number.parseInt(today.getMonth()) + Number(1)) + "-" + today.getDate();
    let status = 'true'
    console.log('todya: ' + strToday);

    con.connect(function (err) {
        const query = 'select * from mytable where id = ' + req.body.data;
        con.query(query, function (err, results) {
            if (err) throw err;
            results.map((value, key) => {
                status = value.status;
            })
        })

        if (status === 'empty') {
            const query1 = 'update mytable set status="notempty" where id = ' + req.body.data
            con.query(query1, function (err) {
                if (err) throw err;
            });

            const query2 = 'insert into bill(id_table,check_date,total_cost,payment) \n \
                            values ('+ req.body.data + ',"' + strToday + '",' + 0 + ',"no")'
            con.connect(function (err) {
                con.query(query2);
            })
        }
    })
}

module.exports = {
    get_Table,
    post_table,
    post_bill,
    get_food,
    put_status,
}