const e = require('express');
const user = require('./model/user');
const { Console } = require('console');
const { ChatGroup } = require('./model/chatGroup');
var ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'chatDB';

const collectionName_user = "user";
const collectionName_group = "group";

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
    await seedUserCollection(db);
    await seedUserData(db);
    await seedRoleDataToUser(db);
    await seedGroupCollection(db);
    await seedGroupData(db);
    await seedMembersToGroup(db);
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
            await db.createCollection(collectionName_user);
            console.log("DB after seed has collections of:");
            allCollections = await db.listCollections().toArray();
            console.log(allCollections);
        } catch (err) {
            console.log(err);
        }
    }
    else {
        console.log("!!! user collection with name: " + collectionName_user + " already existed. Seeding passed.");
    }
}

//seed - user - data
async function seedUserData(db) {
    console.log("beginning seeding user collection data...");
    console.log("current collection data:");
    var findResult = await db.collection(collectionName_user).find({});
    var userArray = findResult.toArray();
    console.log(userArray);
    console.log("starting insert...");
    var userToInsert = [
        {
            "id": 1,
            "email": "u1@t.c",
            "username": "super",
            "password": "1",
            "valid": true,
            "portraitFileName": "OIP.jpg",
            "role": 0
        },
        {
            "id": 2,
            "username": "u2@t.c",
            "password": "2",
            "email": "u2@t.c",
            "valid": true,
            "portraitFileName": "OIP.jpg",
            "role": 0
        },
        {
            "id": 3,
            "username": "u3@t.c",
            "password": "3",
            "email": "u3@t.c",
            "valid": true,
            "portraitFileName": "OIP.jpg",
            "role": 0
        },
        {
            "id": 4,
            "username": "u4@t.c",
            "password": "4",
            "email": "u4@t.c",
            "valid": true,
            "portraitFileName": "OIP.jpg",
            "role": 0
        },
        {
            "id": 5,
            "username": "u5@t.c",
            "password": "5",
            "email": "u5@t.c",
            "valid": true,
            "portraitFileName": "OIP.jpg",
            "role": 0
        },
        {
            "id": 6,
            "username": "u6@t.c",
            "password": "6",
            "email": "u6@t.c",
            "valid": true,
            "portraitFileName": "OIP.jpg",
            "role": 0
        }
    ]
    try {
        userInsertArray = [];
        //for each of the users in seeting array, check for existence.
        for (const e of userToInsert) {
            var userWithUsername = await db.collection(collectionName_user).find({ username: e.username }, { $exists: true }).toArray();
            if (userWithUsername.length >= 1) {
                console.log("User with username of: " + e.username + " already existed, insert skipped.");
            }
            else {
                console.log("user with username: " + e.username + " does not exist in collection, add to insert array");
                userInsertArray.push(e);
            }
        }
        if (userInsertArray.length >= 1) {
            //insert many for user insert array
            console.log("proceed insertMany command in DB for user-to-insert array: ");
            console.log(userInsertArray);
            await db.collection(collectionName_user).insertMany(userInsertArray);
            console.log("insertion complete for users, now the collection holding data as:");
            var collectionElelmentsAfterInsert = await db.collection(collectionName_user).find({}).toArray();
            console.log(collectionElelmentsAfterInsert);
        }
    }
    catch (err) {
        console.log("something wrong in inserting user: " + err);
    }
    console.log("insert seeding completed for users");
}

//seed - user - assign default roles to user
async function seedRoleDataToUser(db) {
    roleSuperAdminName = "Super Admin";
    roleGroupAdminName = "Group Admin";
    roleGroupAssisName = "Group Assis";
    roleGroupNormalName = "Normal";
    //ready 3 roles
    roleSuperAdmin = {
        name: roleSuperAdminName
    };
    roleGroupAdmin = {
        name: roleGroupAdminName
    };
    roleGroupAssis = {
        name: roleGroupAssisName,
        groups: null
    };
    roleGroupNormal = {
        name: roleGroupNormalName
    };

    console.log("Beginning seeding role data to users in user collection...");
    console.log("current user role data: ");
    try {
        currentUserRoleData = await db.collection(collectionName_user)
            .find({}, { _id: 0, username: 1, role: 1 }).toArray();
        console.log(currentUserRoleData);
    }
    catch (err) {
        console.log("error in fetching user data before role assignment: " + err);
    }
    console.log("begin update...");
    try {
        userToUpdate = await db.collection(collectionName_user).findOne({ username: "super" });
        if (userToUpdate.role == 0 || userToUpdate.role == null) { //if role is empty
            await db.collection(collectionName_user).updateOne(
                { username: "super" },
                { $set: { role: roleSuperAdmin } }
            );
            userUpdated = await db.collection(collectionName_user).findOne({ username: "super" });
            console.log("updated user: " + userUpdated);
        }
        else {
            console.log("user: " + userToUpdate.username + " already has a role: " + userToUpdate.role.name);
            console.log("user update skipped for user: " + userToUpdate.username);
        }
    }
    catch (err) {
        console.log("error in updating user super: " + err);
    }
    try {
        userToUpdate = await db.collection(collectionName_user).findOne({ username: "u2@t.c" });
        if (userToUpdate.role == 0 || userToUpdate.role == null) { //if role is empty
            await db.collection(collectionName_user).updateOne(
                { username: "u2@t.c" },
                { $set: { role: roleGroupAdmin } }
            );
            userUpdated = await db.collection(collectionName_user).findOne({ username: "u2@t.c" });
            console.log("updated user: " + userUpdated);
        }
        else {
            console.log("user: " + userToUpdate.username + " already has a role: " + userToUpdate.role.name);
            console.log("user update skipped for user: " + userToUpdate.username);
        }
    }
    catch (err) {
        console.log("error in updating user u2@t.c: " + err);
    }
    try {
        userToUpdate = await db.collection(collectionName_user).findOne({ username: "u3@t.c" });
        if (userToUpdate.role == 0 || userToUpdate.role == null) { //if role is empty
            await db.collection(collectionName_user).updateOne(
                { username: "u3@t.c" },
                { $set: { role: roleGroupAssis } }
            );
            userUpdated = await db.collection(collectionName_user).findOne({ username: "u3@t.c" });
            console.log("updated user: ");
            console.log(userUpdated);
        }
        else {
            console.log("user: " + userToUpdate.username + " already has a role: " + userToUpdate.role.name);
            console.log("user update skipped for user: " + userToUpdate.username);
        }
    }
    catch (err) {
        console.log("error in updating user u3@t.c: " + err);
    }
    try {
        console.log("updating other members to normal role...");
        userToUpdate = await db.collection(collectionName_user).find(
            {
                $and: [
                    { role: 0 },
                    { username: { $not: { $eq: "super" } } },
                    { username: { $not: { $eq: "u2@t.c" } } },
                    { username: { $not: { $eq: "u3@t.c" } } }
                ]
            }).toArray();
        for (const u of userToUpdate) {
            await db.collection(collectionName_user).updateOne(
                { username: u.username },
                { $set: { role: roleGroupNormal } }
            );
            userUpdated = await db.collection(collectionName_user).findOne({ username: u.username });
            console.log("updated user: ");
            console.log(userUpdated);
        }
    }
    catch (err) {
        console.log("error in updating other user: " + err);
    }
}

//seed - groups
async function seedGroupCollection(db) {
    console.log("Begginning to create collection for [group] with name: " + collectionName_group);
    console.log("Checking if collection of: " + collectionName_group + " already existed...");
    var allCollections = await db.listCollections().toArray();
    console.log(allCollections);
    if (!allCollections.map(c => c.name).includes(collectionName_group)) {
        console.log("group collection with name: " + collectionName_group + " does not exist. " +
            "proceed with seeding...");
        try {
            await db.createCollection(collectionName_group);
            console.log("DB after seed group collection has collections of: ");
            allCollections = await db.listCollections().toArray();
            console.log(allCollections);
        }
        catch (err) {
            console.log("error in creating group collection: " + err);
        }
    }
    else {
        console.log("!!! group collection with name: " + collectionName_group +
            " existed. Skipped collection creation.");
    }
}

async function seedGroupData(db) {
    console.log("seeding chat groups data:");
    console.log("beggin init groups model...");
    group1 = new ChatGroup(new ObjectId(), "test group 1", null, null, null, null);
    group2 = new ChatGroup(new ObjectId(), "test group 2", null, null, null, null);
    group3 = new ChatGroup(new ObjectId(), "test group 3", null, null, null, null);
    group4 = new ChatGroup(new ObjectId(), "test group 4", null, null, null, null);
    group5 = new ChatGroup(new ObjectId(), "test group 5", null, null, null, null);
    group6 = new ChatGroup(new ObjectId(), "test group 6", null, null, null, null);
    console.log("nesting group 5,6 to 4");
    group5.parent = group4._id;
    group6.parent = group4._id;
    group4.childrenChatGroups = [group5, group6];
    console.log(group4);
    console.log("nesting group 4 to 3");
    group4.parent = group3._id;
    group3.childrenChatGroups = [group4];
    console.log(group3);
    var groupsToAddProto = [group1, group2, group3];
    var groupsToAdd = [];
    console.log("filtering groups to add by checking if they exist in db collection.");
    for (const g of groupsToAddProto) {
        try {
            groupInfo = db.collection(collectionName_group).find({ name: g.name }, { $exists: true }).toArray();
            if (groupInfo.length >= 1) {
                console.log("group with name: " + g.name + "already exist in collection, skipping...");
            }
            else {
                console.log("group: " + g + "does not exist in collection, adding to insert queue..");
                groupsToAdd.push(g);
            }
        } catch (err) {
            console.error("error in checking collection group: " + err);
        }
    }
    if (groupsToAdd.length >= 1){
        console.log("groups to add queue: ");
        console.log(groupsToAdd);
        console.log("get super admin...");
        var superAdmin = await db.collection(collectionName_user).findOne({ username: "super" });
        console.log("super admin: ");
        console.log(superAdmin);
        console.log("assigning super admin as group creator...");
        for (const g of groupsToAdd) {
            g.createdBy = superAdmin._id;
        }
        console.log("after assigning groups looks like:");
        console.log(groupsToAdd);
        console.log("inserting groups to DB...");
        try {
            await db.collection(collectionName_group).insertMany(groupsToAdd);
        }
        catch (err) {
            console.error("error in inserting groups to DB: " + err);
        }
        console.log("listing groups after insert: ");
        groupsCollectionData = await db.collection(collectionName_group).find({}).toArray();
        console.log(groupsCollectionData);
    }
    else{
        console.log("all group to add skipped, there is nothing to add to collection.");
    }
 }

 async function seedMembersToGroup(db){
    console.log("assigning users to groups...");
    users = await db.collection(collectionName_user).find({}).toArray();
    u1 = users.find(u => {return u.id==1});console.log("u1: " + u1);
    u2 = users.find(u => {return u.id==2});console.log("u2: " + u2);
    u3 = users.find(u => {return u.id==3});console.log("u3: " + u3);
    u4 = users.find(u => {return u.id==4});console.log("u4: " + u4);
    u5 = users.find(u => {return u.id==5});console.log("u5: " + u5);
    u6 = users.find(u => {return u.id==6});console.log("u6: " + u6);

    groups = await db.collection(collectionName_group).find({}).toArray();
    g1 = groups.find(g => {return g.name == "test group 1";});console.log("g1: " + g1);
    g2 = groups.find(g => {return g.name == "test group 2";});console.log("g2: " + g2);
    g3 = groups.find(g => {return g.name == "test group 3";});console.log("g3: " + g3);
    g4 = g3.childrenChatGroups[0];console.log("g4: " + g4);
    g5 = g4.childrenChatGroups[0];console.log("g5: " + g5);
    g6 = g4.childrenChatGroups[1];console.log("g6: " + g6);

    g1.members = [u2._id, u3._id, u4._id];
    g2.members = [u4._id, u5._id];
    g3.members = [u3._id, u4._id, u5._id];
    g4.members = [u5._id, u6._id];
    g5.members = [u5._id];
    g6.members = [u6._id];

    g3.admins = [u3._id];

    g3.childrenChatGroups = [g4];
    g4.childrenChatGroups = [g5, g6];

    groups = [g1, g2, g3];
    for (const g of groups){
        try{
            objectId = g._id;
            delete g._id;
            await db.collection(collectionName_group).updateOne({_id: objectId}, {$set: g});
        }
        catch (err){
            console.error("Error in updating groups: " + err);
        }
    }
    groupsFromDb = await db.collection(collectionName_group).find({}).toArray();
    console.log("Groups now have members: " + groupsFromDb);
 }
//start connection
module.exports = {
    dbConnect, seed, seedUserCollection
};