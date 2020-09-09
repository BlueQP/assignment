var express = require('express');
var router = express.Router();
var fs = require('fs');
const { debug } = require('console');
const User = require('../model/user').User;
const LoginResponse = require('../model/loginResponse').LoginResponse;
var ObjectId = require('mongodb').ObjectID;

var routes = async function (db, app) {
    groupCollection = db.collection("group");
    router.route('/').get(async function (req, res) {
        var groups = await groupCollection.find({}).toArray();
        res.send(JSON.stringify(groups));
    });
    return router;
}
module.exports = routes;