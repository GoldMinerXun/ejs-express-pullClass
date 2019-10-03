const express = require('express');
const router = express.Router();
const MongoControl = require('./tools/packagDB').MongoControl;
const ejs= require('ejs')
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: false });
const CookieTools = require('./tools/cookie').CookieTools;
const cookieParser = require('cookie-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId

const user = new MongoControl('class', 'user');
const manager =new MongoControl('class','manager');


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
                var ObjectId=result[0]._id;
                var cookieProduce = new CookieTools(ObjectId);
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

router.post('/search',urlencoded,function(req,res){
    var info=req.body;
    if(info.auto){
        if(info.auto.length==24){
            var id=ObjectId(info.auto);
            var promise=new Promise((resolve,reject)=>{
                user.find({_id:id},function(err,mongodata){
                    if(err){
                        reject(err)
                    }else{
                        resolve(mongodata)
                    }
                })
            })
        }
        else{
            var name=info.auto;
            var promise=new Promise((resolve,reject)=>{
                user.find({username:name},function(err,mongodata){
                    if(err){
                        reject(err)
                    }else{
                        resolve(mongodata)
                    }
                })
            })
           
        }
    }else if(info._id){
        var id=ObjectId(info._id);
        var promise=new Promise((resolve,reject)=>{
            user.find({_id:id},function(err,mongodata){
                if(err){
                    reject(err)
                }else{
                    resolve(mongodata)
                }
            })
        })
        promise.then((mongodata)=>{
            if(mongodata.length>0){
                ejs.renderFile('../backstage/index.ejs',{mongodata:mongodata,isLogin:true},function(err,result){
                    if(err){
                        reject(err)
                    }else{
                        res.send(result)
                    }
                })
            }
        })
    }else if(info.username){
        var name=ObjectId(info.username);
        var promise=new Promise((resolve,reject)=>{
            user.find({username:name},function(err,mongodata){
                if(err){
                    reject(err)
                }else{
                    resolve(mongodata)
                }
            })
        })
    }else{
        res.redirect('/back')
    }
    promise.then((mongodata)=>{
        if(mongodata.length>0){
            ejs.renderFile('../backstage/index.ejs',{mongodata:mongodata,isLogin:true},function(err,result){
                if(err){
                    reject(err)
                }else{
                    res.send(result)
                }
            })
        }else{
            ejs.renderFile('../backstage/index.ejs',{mongodata:[{nodata:null}],isLogin:true},function(err,result){
                if(err){
                    reject(err)
                }else{
                    res.send(result)
                }
            })
        }
    })
})

router.get('/delete',function(req,res){
    if(req.query.id){
        var promise=new Promise((resolve,reject)=>{
            user.remove({_id:ObjectId(req.query.id)},function(err,mongodata){
                if(err){
                    reject(err)
                }else{
                    resolve(mongodata)
                }
            })
        })
        promise.then((mongodata)=>{
            return new Promise((resolve,reject)=>{
                console.log(mongodata.result.ok)
                if(mongodata.result.ok==1){
                    console.log(true)
                    res.send(true)
                }else{
                    res.send(false)
                }
            })
        })
    }
})

router.get('/modify',function(req,res){
    if(req.query.username&&req.query.password&&req.query._id){
        var promise=new Promise((resolve,reject)=>{
            user.update({_id:ObjectId(req.query._id)},{username:req.query.username,password:req.query.password},function(err,mongodata){
                if(err){
                    reject(err)
                }else{
                    resolve(mongodata)
                }
            })
        })
        promise.then((result)=>{
            if(result.result.ok==1){
                res.send(true)
            }else{
                res.send(false)
            }
            
        })
    }else{
        res.send(false)
    }
})

router.post('/insert',urlencoded,function(req,res){
    if(req.body.username&&req.body.password){
        var promise=new Promise((resolve,reject)=>{
            user.insert({username:req.body.username,password:req.body.password},function(err,mongodata){
                if(err){
                    reject(err)
                }else{
                    resolve(mongodata)
                }
            })
        })
        promise.then((result)=>{
            return new Promise((resolve,reject)=>{
                if(result.result.ok==1){
                    res.send(true)
                }else{
                    res.send(false)
                }
            })
        })
    }
})

module.exports = router;