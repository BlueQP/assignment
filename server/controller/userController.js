var express = require('express');
var router = express.Router();
var fs = require('fs');
const { debug } = require('console');
const User = require('../model/user').User;
const LoginResponse = require('../model/loginResponse').LoginResponse;
var ObjectId = require('mongodb').ObjectID;

var routes = async function (db, app) {
    userColletion = db.collection("user");
    router.route('/').get(async function (req, res) {
        var users = await userColletion.find({}).toArray();
        res.send(JSON.stringify(users));
    });
    router.route('/roles').get(async function (req, res) {
        var roleNames = ['Super Admin', 'Group Admin', 'Group Assis', 'Normal'];
        var roles = [];
        for (const r of roleNames){
            roles.push({name: r});
        }
        res.send(JSON.stringify(roles));
    });
    router.route('/updateOrCreate').post(async function (req, res) {
        var user = req.body;
        user_id = null;
        if (user._id == null){
            insertResponse = await userColletion.insertOne(user);
            user_id = insertResponse.insertedId;
        }
        else {
            user_id = new ObjectId(user._id);
            delete user._id;
            await userColletion.updateOne({_id: user_id}, {$set: user});
        }
        user = await userColletion.findOne({_id: user_id});
        res.send(JSON.stringify(user));
    });
    return router;
}
module.exports = routes;