const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: false });
const MongoControl = require('./tools/packagDB').MongoControl;
const HandleClassTables = require('./tools/handleClassTable').HandleClassTable;
const ejs = require('ejs');
router.use(express.static('../server'))
router.use(express.static('../admin'))
router.get('/', function (req, res) {
    var username = req.query.username;
    var errorcode = req.query.error;
    var codenum = 0;
    if (errorcode!=undefined) {
        var codenum = errorcode;
    }
    if (username) {
        ejs.renderFile('../admin/user_home.ejs', { data: username, hascourse: false, classtime: '', errorcode: codenum }, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.send(result)
        })
    } else {
        res.redirect('/login?error=2');
    }
})
router.get('/hascourses', function (req, res) {
    var username = req.query.username;
    var nowweek = req.query.nowweek;
    var errorcode = req.query.error;
    var codenum = 0;
    if (errorcode!=undefined) {
        var codenum = errorcode;
    }
    if (username) {
        var promise = new Promise((resolve, reject) => {
            user = new MongoControl('class', 'user');
            user.find({ username: username }, function (err, mongoData) {
                if (err) {
                    console.log(err)
                } else {
                    var str = mongoData[0].classtime;
                    var handlemongoData = new HandleClassTables();
                    var result = handlemongoData.handlemongoclasstime(str);
                    // console.log(result)
                    resolve(result)
                }
            })
        })
        promise.then((result) => {
            return new Promise((resolve, reject) => {
                // console.log(result)
                ejs.renderFile('../admin/user_home.ejs', { data: username, hascourse: true, classtime: result, nowweek: nowweek,errorcode:codenum }, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    res.send(result)
                })
            })
        })
    }
})

module.exports = router;