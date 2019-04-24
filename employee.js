const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "12345678",
    database: "restaurant"
});

const getListE = function (req, res) {
    let employees = [];

    con.query('select * from employee,employ_work where employee.id = employ_work.id', function (err, results) {
        if (err) console.log(err);
        res.send(JSON.stringify(results));
    })
}

const EditEmployee = function (req, res) {
    console.log(req.body)
    let query = 'update employee set \n \
                    name = "'+ req.body.name + '" ,\n\
                    sex = "'+ req.body.sex + '" ,\n \
                    birthday = "'+ req.body.birthday + '" ,\n \
                    phone = "'+ req.body.phone + '" \n \
                    where id = '+ req.body.id;
    con.query(query, function (err) {
        if (err) console.log('error1: ' + err);
    })

    let query1 = 'update employ_work set \n \
                working = "'+ req.body.working   + '" ,\n\
                salary = '+ req.body.salary + ' ,\n \
                countleave = '+ req.body.countleave + ' \n \
                where id = '+ req.body.id;
    con.query(query1, function (err) {
        if (err) console.log('error2: ' + err);
        res.send('edit success')
    })
}

const AddEmployee = function (req, res) {
    let query = 'insert into employee(id,name,sex,birthday,phone)\n \
                    values (                                    \n \
                        '+ req.body.id + ',                                        \n \
                        "'+ req.body.name + '",                                        \n \
                        "'+ req.body.sex + '",                                        \n \
                        "'+ req.body.birthday + '",                                        \n \
                        '+ req.body.phone + '                                        \n \
                    )'
    con.query(query, function (err) {
        if (err) console.log(err);
    })

    let query1 = 'insert into employ_work(id,working,salary,countleave)         \n \
                        values (                                                    \n \
                            '+ req.body.id + ',                                        \n \
                            "'+ req.body.working + '",                                    \n \
                            "'+ req.body.salary + '",                                     \n \
                            '+ req.body.countleave + '                                  \n \
                        )'
    con.query(query1, function (err) {
        if (err) console.log(err);
        res.send('add success')
    })
}

const RemoveEmployee = function (req, res) {
    con.query('delete from employ_work where id = ' + req.body.id, function (err, results) {
        if (err) console.log(err);
    })

    let query = "delete from employee where id = " + req.body.id
    con.query(query, function (err, results) {
        if (err) console.log(err);
        res.send(JSON.stringify('Success'))
    })
}

module.exports = {
    getListE,
    EditEmployee,
    AddEmployee,
    RemoveEmployee
}