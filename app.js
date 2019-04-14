var express = require('express');
var app = express();
var cors = require('cors');
var mysql = require('mysql');
var home = require('./home');
var login = require('./login');
var table = require('./table')
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',login.getAccount)
app.post('/',login.postAccount)
app.get('/dashboard',home.get)
app.get('/dashboard/tables', table.get_Table)
app.post('/dashboard/tables',table.post_table)
app.put('/dashboard/tables/put',table.put_status);
app.get('/dashboard/tables/addfood',table.get_food);
app.post('/dashboard/tables/addfood/:id',table.post_bill);

app.listen(3001);

