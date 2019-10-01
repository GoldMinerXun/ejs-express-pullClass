const express = require('express');
const router = express.Router();
const MongoControl = require('./tools/packagDB').MongoControl;
const ejs= require('ejs')
const user = new MongoControl('class', 'user');

router.use(express.static('../server'))
router.use(express.static('../admin'))
router.use(express.static('../backstage'))
router.get('/', function (req, res) {
    if (req.headers.cookie) {
        var promise = new Promise((resolve, reject) => {
            user.find({}, function (err, mongodata) {
                if (err) {
                    reject(err)
                } else {
                    resolve(mongodata)
                }
            })
        })
        promise.then((mongodata)=>{
            return new Promise((resolve,reject)=>{
                ejs.renderFile('../backstage/index.ejs',{mongodata:mongodata,isLogin:true},function(err,result){
                    if(err)
                    {
                        reject(err)
                    }
                    res.send(result)
                })
            })
        })

    }else{
        ejs.renderFile('../backstage/index.ejs',{mongodata:[],isLogin:false},function(err,result){
            if(err)
            {
                reject(err)
            }
            res.send(result)
        })
    }
})
module.exports = router;