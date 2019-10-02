const express = require('express');
const router = express.Router();
const MongoControl = require('./tools/packagDB').MongoControl;
const ejs= require('ejs')
const user = new MongoControl('class', 'user');
const manager =new MongoControl('class','manager');
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: false });
const CookieTools = require('./tools/cookie').CookieTools;
const cookieParser = require('cookie-parser');

router.use(cookieParser('manager'));
router.use(express.static('../server'));
router.use(express.static('../admin'));
router.use(express.static('../backstage'));

router.get('/', function (req, res) {
   var cookieresult=req.cookies.manager;
//    console.log(cookieresult);
    if (cookieresult) {
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
        ejs.renderFile('../backstage/index.ejs',{mongodata:[{nodata:null}],isLogin:false},function(err,result){
            if(err)
            {
                reject(err)
            }
            res.send(result)
        })
    }
});

router.post('/login',urlencoded,function(req,res){
    var password=req.body.password;
    // console.log(password)
    var promise=new Promise((resolve,reject)=>{
        manager.find({password:password},function(err,mongodata){
            if(err){
                reject(err)
            }else{
                resolve(mongodata)
            }
        })
    });
    promise.then((result)=>{
        return new Promise((resolve,reject)=>{
            if(result.length>0){
                var objectID=result[0]._id;
                var cookieProduce = new CookieTools(objectID);
                var setcookie = cookieProduce.produceCookie();
                res.setHeader('Set-Cookie','manager='+setcookie+';path=/;httponly');
                resolve(true)
            }
        })
    }).then((result)=>{
        return new Promise((resolve,reject)=>{
            if(result){
                res.redirect('/back')
            }
        })
    });
})

router.get('/logout',function(req,res){
    var promise = new Promise((resolve, reject) => {
        res.clearCookie('manager');
        resolve(true)
    })
    promise.then((result)=>{
        return new Promise((resolve,reject)=>{
            if(result){
                res.send(true)
            }
        })
    })
})
module.exports = router;