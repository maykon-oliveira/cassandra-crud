const express = require('express');
const routes = require('./routes');
const http = require('http');
const path = require('path');

const obras = require('./routes/obras');
const cassandrainfo = require('./routes/cassandrainfo');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/cassandrainfo', cassandrainfo.init_cassandra);
// Obras
app.get('/obras', obras.list);
app.get('/obras/add', obras.add);
app.post('/obras/add', obras.save);
app.get('/obras/delete/:id', obras.delete_customer);
app.get('/obras/edit/:id', obras.edit);
app.post('/obras/edit/:id', obras.save_edit);

app.use(app.router);

http.createServer(app)
  .listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
