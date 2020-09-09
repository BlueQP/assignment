const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
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
//static resources
app.use('/static',express.static(path.join(__dirname, 'serverResources')));
//socket setup
sockets.connect(io, PORT);
//start server
server.listen(http, PORT);

//mongoDB settings
var mongoSettings = require('./mongoScript');
const { GroupedObservable } = require('rxjs');

(async () => {
    //connect to db
    const db = await mongoSettings.dbConnect();
    //seedings
    //uncomment this line below to seed database
    //*****
    // await mongoSettings.seed(db);
    //*****
    //controller routings
    var loginController = require('./controller/loginController')(db, app);
    var userController = require('./controller/userController')(db, app);
    var groupController = require('./controller/groupController')(db,app);
    app.use('/api/login',await loginController);
    app.use('/api/user', await userController);
    app.use('/api/group', await groupController);
})();

