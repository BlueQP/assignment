var express = require('express');
var router = express.Router();
var fs = require('fs');
const { debug } = require('console');
const User = require('../model/user').User;
const LoginResponse = require('../model/loginResponse').LoginResponse;
var ObjectId = require('mongodb').ObjectID;
var formidable = require('formidable');
const multer = require('multer');
var fileExtension = require('file-extension');
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
    router.route('/save').post(async function (req, res) {
        var message = req.body.message;
        var pathToGroup = req.body.pathToGroup;
        var rootGroup = pathToGroup.root;
        rootGroupInDb = await groupCollection.findOne({ _id: new ObjectId(rootGroup._id) });
        childrenGroup = rootGroupInDb.childrenChatGroups;
        if (childrenGroup == null) {
            rootGroupInDb.childrenChatGroups = [];
        }
        currentChildGroupInDb = rootGroupInDb;
        for (var i = 0; i <= pathToGroup.length - 1; i++) {
            currentChildGroupInDb = currentChildGroupInDb.childrenChatGroups[pathToGroup[i]];
        }
        
        if (currentChildGroupInDb.messages == null)
        {
            currentChildGroupInDb.messages = [];
        }
        currentChildGroupInDb.messages.push(message);
        updateChildIds(rootGroupInDb);
        console.log(rootGroupInDb);
        await groupCollection.updateOne({ _id: rootGroupInDb._id }, { $set: rootGroupInDb });
        updatedRootGroup = await groupCollection.findOne({ _id: new ObjectId(rootGroup._id) });

        res.send(JSON.stringify(updatedRootGroup));
    });
    
    return router;
}
module.exports = routes;