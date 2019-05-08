const mysql = require('mysql');
const bodyParser = require('body-parser');

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const get_menu = function (req, res) {
    let foods = []
    let drinks = []
    let totalResults = []
    
    con.query('select * from food where category = "food"', function (err, results) {
        results.map((value, key) => {
            foods.push(value);
        })
        totalResults.push(foods);
    })
    con.query('select * from food where category = "drinks"', function (err, results) {
        if (err) console.log(err);
        results.map((value, key) => {
            drinks.push(value);
        })
        totalResults.push(drinks);
        res.send(JSON.stringify(totalResults))
    })
}
const post_newDish = function (req, res) {
    con.query('insert into food(id,category,food_name,food_price) \n \
            values('+ req.body.id + ',"' + req.body.category + '","' + req.body.food_name + '",' + req.body.food_price + ')', function (err) {
                if(err) console.log(err);
                res.send('Thành công');
        })
}

const post_editDish = function (req, res) {
    const query2 = 'update food set food_name = "' + req.body.food_name_New +             ' ",\n \
                    id = ' + req.body.id +                                                  ',\n \
                    category = "' + req.body.category +                                    '",\n \
                    food_price = ' + req.body.food_price +                                  '\n \
                    where food_name = "' + req.body.food_name_Old + '"'
    const query1 = 'update billdetail set food_name = "'+req.body.food_name_New+'" where food_name = "'+req.body.food_name_Old+'"'
    con.query(query2,function(err){
        if(err) console.log(err);
    });
    con.query(query1,function(err){
        if(err) console.log(err);
        res.send('Thành công');
    });
}

const post_remove = function (req, res) {
    con.query('delete from food where food_name = "' + req.body.food_name + '"', function (err) {
        if (err) console.log(err);
    })
}

module.exports = {
    get_menu,
    post_newDish,
    post_editDish,
    post_remove
}