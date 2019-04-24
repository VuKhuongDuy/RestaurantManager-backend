var express = require('express');
var app = express();
var cors = require('cors');
var home = require('./home');
var login = require('./login');
var table = require('./table')
var menu = require('./menu')
var employee = require('./employee')
var history = require('./history')
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',login.getAccount)
app.post('/',login.postAccount)
app.get('/dashboard',home.get)
app.get('/user/:id',home.getUser)
app.post('/user/:id',home.postUser)
app.get('/dashboard/tables', table.get_Table)
app.post('/dashboard/tables',table.post_table)
app.put('/dashboard/tables/put',table.put_status);
app.get('/dashboard/tables/addfood',table.get_food);
app.post('/dashboard/tables/addfood',table.post_bill);

//chuyển post thành get
app.get('/dashboard/tables/payment/:id',table.get_BillDetail);
app.post('/dashboard/tables/payment/:id',table.post_payment);
app.post('/dashboard/tables/change',table.post_changeTable);
app.get('/dashboard/menu',menu.get_menu);
app.post('/dashboard/menu/new',menu.post_newDish);
app.post('/dashboard/menu/edit',menu.post_editDish);
app.post('/dashboard/menu/remove',menu.post_remove);
app.get('/dashboard/employees',employee.getListE);
app.post('/dashboard/employees/edit',employee.EditEmployee)
app.post('/dashboard/employees/add',employee.AddEmployee)
app.post('/dashboard/employees/remove',employee.RemoveEmployee)
app.get('/dashboard/history',history.getListBill);

app.listen(3001);