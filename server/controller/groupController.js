var express = require('express');
var router = express.Router();
var fs = require('fs');
const { debug, group } = require('console');
const { ChatGroup } = require('../model/chatGroup');
const groupPath = require('../model/groupPath');
const User = require('../model/user').User;
const LoginResponse = require('../model/loginResponse').LoginResponse;
var ObjectId = require('mongodb').ObjectID;
const GroupPath = require('../model/groupPath').GroupPath;
const BSON = require('bson');

//convert all id string to objectId
function updateChildIds(group) {
    if (group._id && typeof (group._id) === 'string' && group._id.length == 24) {
        group._id = new ObjectId(group._id);
    }
    else if(group._id == null){
        group._id = new ObjectId();
    }
    if (group.parent && typeof (group.parent) === 'string' && group.parent.length == 24) {
        group.parent = new ObjectId(group.parent);
    }
    if (group.members && group.members.length >= 1) {
        group.members.forEach(function (p, i) {
            if (this[i] && typeof(this[i]) === 'string' && this[i].length == 24) {
                this[i] = new ObjectId(this[i]);
            }
        }, group.members);
    }
    if (group.admins && group.admins.length >= 1) {
        group.admins.forEach(function (p, i) {
            if (this[i] && typeof (this[i]) === 'string' && this[i].length == 24) {
                this[i] = new ObjectId(this[i]);
            }
        }, group.admins);
    }
    if (group.childrenChatGroups && group.childrenChatGroups.length >= 1){
        group.childrenChatGroups.forEach(function(p,i) {
            updateChildIds(this[i]);
        }, group.childrenChatGroups);
    }
}

var routes = async function (db, app) {
    groupCollection = db.collection("group");
    userCollection = db.collection("user");
    router.route('/').get(async function (req, res) {
        var groups = await groupCollection.find({}).toArray();
        res.send(JSON.stringify(groups));
    });
    router.route('/groupAssis').post(async function (req, res) {
        var group = req.body;
        var groupAssisList = group.admins;
        var groupAssisObjectIdList = [];

        if (groupAssisList != null && groupAssisList.length >= 1) {
            for (const groupAssisId of groupAssisList) {
                groupAssisObjectIdList.push(new ObjectId(groupAssisId));
            }
            assisList = await userCollection.find({ _id: { $in: groupAssisObjectIdList } }).toArray();
            res.send(JSON.stringify(assisList));
        }
        else {
            res.send(null);
        }

    });
    router.route('/otherAssis').post(async function (req, res) {
        var group = req.body;
        var groupAssisList = group.admins;
        var groupAssisObjectIdList = [];

        if (groupAssisList != null && groupAssisList.length >= 1) {
            for (const groupAssisId of groupAssisList) {
                groupAssisObjectIdList.push(new ObjectId(groupAssisId));
            }
        }
        assisList = await userCollection.find({ $and: [{ _id: { $nin: groupAssisObjectIdList } }, { role: { name: "Group Assis" } }] }).toArray();
        res.send(JSON.stringify(assisList));
    });
    router.route('/getGroupUsers').post(async function (req, res) {
        var group = req.body;
        var groupMembersIdsStrings = group.members;
        var groupMembersIdsObjects = [];

        if (groupMembersIdsStrings != null && groupMembersIdsStrings.length >= 1) {
            for (const groupMembersIdsString of groupMembersIdsStrings) {
                groupMembersIdsObjects.push(new ObjectId(groupMembersIdsString));
            }
        }
        membersList = await userCollection.find({ _id: { $in: groupMembersIdsObjects } }).toArray();
        res.send(JSON.stringify(membersList));
    });
    router.route('/getUsersOutsideGroup').post(async function (req, res) {
        var group = req.body;
        var groupMembersIdsStrings = group.members;
        var groupMembersIdsObjects = [];

        if (groupMembersIdsStrings != null && groupMembersIdsStrings.length >= 1) {
            for (const groupMembersIdsString of groupMembersIdsStrings) {
                groupMembersIdsObjects.push(new ObjectId(groupMembersIdsString));
            }
        }
        membersList = await userCollection.find({ _id: { $nin: groupMembersIdsObjects } }).toArray();
        res.send(JSON.stringify(membersList));
    });
    router.route('/createSubGroup').post(async function (req, res) {
        groupPathData = req.body;
        pathData = groupPathData.indexPath;
        rootGroup = groupPathData.root;
        rootGroupInDb = await groupCollection.findOne({ _id: new ObjectId(rootGroup._id) });
        childrenGroup = rootGroupInDb.childrenChatGroups;
        if (childrenGroup == null) {
            rootGroupInDb.childrenChatGroups = [];
        }
        currentChildGroupInDb = rootGroupInDb;
        currentChildGroup = rootGroup;
        for (var i = 0; i < pathData.length - 1; i++) {
            currentChildGroupInDb = currentChildGroupInDb.childrenChatGroups[pathData[i]];
            currentChildGroup = currentChildGroup.childrenChatGroups[pathData[i]];
        }
        if (currentChildGroupInDb.childrenChatGroups == null) {
            currentChildGroupInDb.childrenChatGroups = [];
        }
        var pathToGo = 0;
        if(pathData.length <= 0){
            pathToGo = 0;
        }
        else{
            pathToGo = pathData[pathData.length - 1];
        }
        var updateGroupValue = currentChildGroup.childrenChatGroups[pathToGo]
        currentChildGroupInDb.childrenChatGroups.push(updateGroupValue);
        var updateGroupInDB = currentChildGroupInDb.childrenChatGroups[pathToGo];
        updateGroupInDB._id = new ObjectId();

        if (updateGroupInDB.admins == null) {
            updateGroupInDB.admins = [];
        }
        if (updateGroupInDB.members == null) {
            updateGroupInDB.members = [];
        }
        updateChildIds(updateGroupInDB);
        // updateGroupInDB.parent = new ObjectId(updateGroupInDB.parent);
        // updateGroupInDB.admins.forEach(function (part, index) {
        //     this[index] = new ObjectId(this[index]);
        // }, updateGroupInDB.admins);
        // updateGroupInDB.members.forEach(function (part, index) {
        //     this[index] = new ObjectId(this[index]);
        // }, updateGroupInDB.members);
        console.log(rootGroupInDb);
        await groupCollection.updateOne({ _id: rootGroupInDb._id }, { $set: rootGroupInDb });
        updatedRootGroup = await groupCollection.findOne({ _id: new ObjectId(rootGroup._id) });
        res.send(JSON.stringify(updatedRootGroup));
    });
    router.route('/updateSubGroup').post(async function (req, res) {
        groupPathData = req.body;
        pathData = groupPathData.indexPath;
        rootGroup = groupPathData.root;
        rootGroupInDb = await groupCollection.findOne({ _id: new ObjectId(rootGroup._id) });
        childrenGroup = rootGroupInDb.childrenChatGroups;
        if (childrenGroup == null) {
            rootGroupInDb.childrenChatGroups = [];
        }
        currentChildGroupInDb = rootGroupInDb;
        currentChildGroup = rootGroup;
        for (var i = 0; i < pathData.length - 1; i++) {
            currentChildGroupInDb = currentChildGroupInDb.childrenChatGroups[pathData[i]];
            currentChildGroup = currentChildGroup.childrenChatGroups[pathData[i]];
        }
        if (currentChildGroupInDb.childrenChatGroups == null) {
            currentChildGroupInDb.childrenChatGroups = [];
        }
        currentChildGroupInDb.childrenChatGroups[pathData[pathData.length - 1]] =
            currentChildGroup.childrenChatGroups[pathData[pathData.length - 1]];
        currentChildGroupInDb.childrenChatGroups[pathData[pathData.length - 1]]._id =
            new ObjectId(currentChildGroup.childrenChatGroups[pathData[pathData.length - 1]]._id);
        if (currentChildGroupInDb.childrenChatGroups[pathData[pathData.length - 1]].admins == null) {
            currentChildGroupInDb.childrenChatGroups[pathData[pathData.length - 1]].admins = [];
        }
        if (currentChildGroupInDb.childrenChatGroups[pathData[pathData.length - 1]].members == null) {
            currentChildGroupInDb.childrenChatGroups[pathData[pathData.length - 1]].members = [];
        }
        var updateGroupInDB = currentChildGroupInDb.childrenChatGroups[pathData[pathData.length - 1]];
        updateChildIds(updateGroupInDB);
        // updateGroupInDB.parent
        //     = new ObjectId(updateGroupInDB.parent);
        // updateGroupInDB.admins.forEach(function (part, index) {
        //     this[index] = new ObjectId(this[index]);
        // }, updateGroupInDB.admins);
        // updateGroupInDB.members.forEach(function (part, index) {
        //     this[index] = new ObjectId(this[index]);
        // }, updateGroupInDB.members);
        console.log(rootGroupInDb);
        await groupCollection.updateOne({ _id: rootGroupInDb._id }, { $set: rootGroupInDb });
        updatedRootGroup = await groupCollection.findOne({ _id: new ObjectId(rootGroup._id) });
        res.send(JSON.stringify(updatedRootGroup));
    });
    router.route('/updateRootGroup').post(async function (req, res) {
        rootGroup = req.body;
        updateChildIds(rootGroup);
        console.log(rootGroup);
        await groupCollection.updateOne({ _id: rootGroup._id }, { $set: rootGroup });
        updatedRootGroup = await groupCollection.findOne({ _id: rootGroup._id });
        res.send(JSON.stringify(updatedRootGroup));
    });
    router.route('/createRootGroup').post(async function (req, res) {
        rootGroup = req.body;
        updateChildIds(rootGroup);
        console.log(rootGroup);
        await groupCollection.insertOne(rootGroup);
        updatedRootGroup = await groupCollection.findOne({ _id: rootGroup._id });
        res.send(JSON.stringify(updatedRootGroup));
    });
    router.route('/deleteGroup').post(async function (req, res) {
        pathToDelete = req.body;
        indexPath = pathToDelete.indexPath;
        if (pathToDelete.indexPath == null){
            await groupCollection.deleteOne({_id: new ObjectId(pathToDelete.root._id)});
        }
        else {
            rootGroupInDb = await groupCollection.findOne({_id: new ObjectId(pathToDelete.root._id)});
            groupHoldingDeleteChild = rootGroupInDb;

            for (i = 0; i < indexPath.length - 1; i ++){
                groupHoldingDeleteChild = groupHoldingDeleteChild.childrenChatGroups[indexPath[i]];
            }
            groupToBeDeleted = groupHoldingDeleteChild.childrenChatGroups[indexPath[indexPath.length - 1]];
            groupHoldingDeleteChild.childrenChatGroups.splice(groupHoldingDeleteChild.childrenChatGroups.indexOf(groupToBeDeleted),1);
        }
        console.log(rootGroupInDb);
        await groupCollection.updateOne({ _id: rootGroupInDb._id }, {$set: rootGroupInDb});
        allGroupsNow = await groupCollection.find({}).toArray();
        res.send(JSON.stringify(allGroupsNow));
    });
    return router;
}
module.exports = routes;