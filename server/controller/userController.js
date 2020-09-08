var express = require('express');
var router = express.Router();
var fs = require('fs');
const { debug } = require('console');
const User = require('../model/user').User;
const LoginResponse = require('../model/loginResponse').LoginResponse;


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
    return router;
}
module.exports = routes;