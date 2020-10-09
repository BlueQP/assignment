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
var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'server/serverResources/images')
    },

    // Setting name of file saved
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension(file.originalname))
    }
});
var upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            //Error 
            cb(new Error('Please upload JPG and PNG images only!'))
        }
        //Success 
        cb(undefined, true)
    }
});

var routes = async function (db, app) {
    userColletion = db.collection("user");
    router.route('/').get(async function (req, res) {
        var users = await userColletion.find({}).toArray();
        res.send(JSON.stringify(users));
    });
    router.route('/roles').get(async function (req, res) {
        var roleNames = ['Super Admin', 'Group Admin', 'Group Assis', 'Normal'];
        var roles = [];
        for (const r of roleNames) {
            roles.push({ name: r });
        }
        res.send(JSON.stringify(roles));
    });
    router.route('/updateOrCreate').post(async function (req, res) {
        var user = req.body;
        user_id = null;
        if (user._id == null) {
            insertResponse = await userColletion.insertOne(user);
            user_id = insertResponse.insertedId;
        }
        else {
            user_id = new ObjectId(user._id);
            delete user._id;
            await userColletion.updateOne({ _id: user_id }, { $set: user });
        }
        user = await userColletion.findOne({ _id: user_id });
        res.send(JSON.stringify(user));
    });

    router.route('/changePortrait').post(upload.single('portrait'), (req, res, next) => {
        const file = req.file
        console.log(req);
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error);
        }
        res.status(200).send({
            name: file.filename
        });
    
    }, (error, req, res, next) => {
        res.status(400).send({
            error: error.message
        });
    });
    return router;
}
module.exports = routes;