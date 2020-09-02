const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

const collectionName_user = "user";

//connect
async function dbConnect() {
    try {
        const client = await MongoClient.connect(
            url,
            {
                poolSize: 10,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        const db = client.db(dbName);
        console.log('db connected... DB name: ' + db.databaseName);
        return db;
    } catch (err) { console.log(err); }
}

//seed
async function seed(db) {
    await this.seedUserCollection(db);
}

//seed - user
async function seedUserCollection(db) {
    console.log("Beginning trying to create collections for [user] with name: " + collectionName_user);
    console.log("checking if user collection exists. Looking for collection with " +
        "name of: " + collectionName_user);
    console.log("listing all current collections in db...");
    var allCollections = await db.listCollections().toArray();
    console.log(allCollections);
    if (!allCollections.map(c => c.name).includes(collectionName_user)) {
        console.log("user collection with name: " + collectionName_user + " does NOT exist. " +
            "proceed with seeding...");
        try {
            console.log("seeding DB - Create collection [user] with name: " + collectionName_user);
            await db.createCollection("user");
            console.log("DB after seed has collections of:");
            allCollections = await db.listCollections().toArray();
            console.log(allCollections);
        }catch (err){
            console.log(err);
        }
    }
    else {
        console.log("!!! user collection with name: " + collectionName_user + " already existed. Seeding passed.");
    }
}

async function seedUserData(db){
    console.log("beginning seeding user collection data...");
    console.log("current collection data:");
    var findResult = await db.collection(collectionName_user).find({});
    var userArray = findResult.toArray();
    console.log(userArray);
    
}

//start connection
module.exports = {
    dbConnect, seed, seedUserCollection
};