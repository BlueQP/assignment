var express = require('express');
var router = express.Router();
var fs = require('fs');
const { debug } = require('console');
const User = require('../model/user').User;
const LoginResponse = require('../model/loginResponse').LoginResponse;


var routes = async function (db, app) {
    userColletion = db.collection("user");
    router.route('/').post(async function (req, res) {
        var user = new User();
        user = req.body;
        var loginResponse = new LoginResponse();

        console.log(JSON.stringify(user));
        matchedUser = await userColletion.findOne({username: user.username, password: user.password});
        if (matchedUser){
            console.log(matchedUser);
            loginResponse.ok = true;

            loginResponse.user = matchedUser;
            res.send(JSON.stringify(loginResponse));
        }
        else{
            loginResponse.ok = false;
            console.log("debug: login rejection: ");
            console.log(user);
            res.send(JSON.stringify(loginResponse));
        }
    });
    return router;
}
module.exports = routes;