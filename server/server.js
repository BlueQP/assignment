const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sockets = require('./socket.js');
const server = require('./listen.js');

var jsonParser = bodyParser.json();
app.use(jsonParser);
//define port number
const PORT = 3000;
//cross origin
app.use(cors());
//socket setup
sockets.connect(io, PORT);
//start server
server.listen(http, PORT);

var loginController = require('./controller/loginController')();
app.use('/api/login', loginController);