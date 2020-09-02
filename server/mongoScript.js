const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';
const client = new MongoClient(url);

//start connection
client.connect(function(err){
    console.log("MongoDB: server connected...");
    const db = client.db(dbName);
    client.close();
})