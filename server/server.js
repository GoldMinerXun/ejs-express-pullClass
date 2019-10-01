const express = require('express');
const app = express();
const path = require('path');
const MongoControl = require('./tools/packagDB').MongoControl;
const CookieTools = require('./tools/cookie').CookieTools;
const HandleClassTables = require('./tools/handleClassTable').HandleClassTable;
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: false });

const http = require('http');
const cheerio = require('cheerio');
const superagent = require('superagent');
const fs = require('fs')
const iconv = require('iconv-lite');
const ejs = require('ejs');
const querystring = require('querystring')

app.use(express.static('../server'));
app.use(express.static('../home'));
app.use(express.static('../admin/'));
app.use(express.static('../backstage/'))
app.use('/admin', require('./admin'));
app.use('/back',require('./back'));

user = new MongoControl('class', 'user');

var cookie;
// 主页重定向
app.get('/', function (req, res) {
    ejs.renderFile('../home/home_login.ejs', { data: false }, function (err, result) {
        if (err) {
            console.log(err)
        }
        res.send(result)
    })
})
// 直接到登录页时是否登陆出错
app.get('/login', function (req, res) {
    var errorcode = req.query.error;
    if (errorcode) {
        ejs.renderFile('../home/home_login.ejs', { data: true }, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.send(result)
        })
    } else {
        ejs.renderFile('../home/home_login.ejs', { data: false }, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.send(result)
        })
    }

})
// 登陆提交post接口
// 登陆成功跳转到个人页
// 登陆失败重定向回去
app.post('/login', urlencoded, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var promise = new Promise((resolve, reject) => {
        user.find({ username: username, password: password }, function (err, mongoData) {
            if (err) {
                reject(err)
            } else {
                resolve(mongoData)
            }
        })
    })
    promise.then((data) => {
        return new Promise((resolve, reject) => {
            if (data.length > 0) {
                var objectID = data[0]._id;
                var cookieProduce = new CookieTools(objectID);
                var setcookie = cookieProduce.produceCookie();
                res.setHeader('Set-Cookie',setcookie+';path=/;httponly');
                res.redirect('/admin?username=' + data[0].username);
            }
            else {
                res.redirect('/login?error=1');
            }
        })
    })
})
// 注册失败----未完成
app.get('/register', function (req, res) {
    var errorcode = req.query.error;
    if (errorcode == 1) {
        ejs.renderFile('../home/register.ejs', { error: true }, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.send(result)
        })
    } else {
        ejs.renderFile('../home/register.ejs', { error: false }, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.send(result)
        })
    }
})
app.post('/register', urlencoded, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var promise= new Promise((resolve,reject)=>{
        user.insert({ username: username, password: password }, function (err, mongoData) {
            if (err) {
                resolve(false);
            } else {
                resolve(mongoData)
                // res.redirect('/admin?username=' + username);
            }
        })
    })
    promise.then((result)=>{
        return new Promise((resolve,reject)=>{
            if(result){
                var objectID=result.ops[0]._id;
                var cookieProduce = new CookieTools(objectID);
                var setcookie = cookieProduce.produceCookie();
                res.setHeader('Set-Cookie',setcookie+';path=/;httponly');
                res.redirect('/admin?username=' + result.ops[0].username);
            }else{
                res.redirect('/register?error=1');
            }
        })
    })
})
// 检查是否重名
app.get('/isNameExist', function (req, res) {
    var username = req.query.username;
    console.log(req.query)
    var promise = new Promise((resolve, reject) => {
        user.find({ username: username }, function (err, mongoData) {
            var isUsed = false;
            if (err) {
                console.log(err)
            } else {
                // console.log(mongoData)
                if (mongoData.length > 0) {
                    isUsed = true;
                    resolve(isUsed)
                } else {
                    resolve(isUsed)
                }
            }
        })
    })
    promise.then((isUsed) => {
        return new Promise((resolve, reject) => {
            // console.log(isUsed)
            res.send(isUsed)
        })
    })

})
// 拉取课表--模拟登陆教务在线
app.get('/pullClass', function (req, res) {
    http.get('http://jwzx.hrbust.edu.cn/academic/common/security/login.jsp', function (reshttp) {
        var html = '';
        reshttp.on('data', function (data) {
            html += data;
            console.log(html);

        })
        reshttp.on('end', function () {
            var $ = cheerio.load(html);
            var img = $('#jcaptcha');
            // console.log(img['0'].attribs.src)
            var validateImgUrl = 'http://jwzx.hrbust.edu.cn/' + img['0'].attribs.src;
            var req = superagent.get(validateImgUrl);

            req.end(function (err1, res1) {
                if (err1) {
                    console.log("request code failure");
                }
                cookie = reshttp.headers['set-cookie'];
                //验证码解析
                //将获取数据流转为buffer后在转为base64编码数据流
                var promise = new Promise((resolve, reject) => {
                    var s64 = Buffer(res1.body).toString('base64');
                    resolve(s64);
                })
                promise
                    .then((s64) => {
                        return new Promise((resolve, reject) => {
                            var bitmap = new Buffer(s64, 'base64');
                            resolve(bitmap)
                        })
                    })
                    .then((bitmap) => {
                        return new Promise((resolve, reject) => {
                            var result;
                            fs.writeFile("../admin/checkcodeimg/name.jpg", bitmap, function (err) {
                                if (err) {
                                    result = false;
                                    resolve(result)
                                } else {
                                    result = true;
                                    resolve(result)
                                }
                            });
                        })
                    }).then((result) => {
                        // console.log(result)
                        res.send(result)
                    })
            })
            // 已得到验证码，然后根据验证码和用户名密码用fromdata去模拟登陆

        })

    })
})
// 拉取课表成功
app.post('/postToPullClass', urlencoded, function (req, res) {
    var j_username = req.body.studentid;
    var j_password = req.body.password;
    var username = req.body.user_name;
    var j_captcha = req.body.checkcode;

    var postData = querystring.stringify({
        'j_username': j_username,
        'j_password': j_password,
        'j_captcha': j_captcha
    });

    var promise = new Promise((resolve, reject) => {
        var handlecookie = cookie[0].split(';');
        var options = {
            hostname: "jwzx.hrbust.edu.cn",
            path: "/academic/j_acegi_security_check",
            method: 'POST',
            headers: {
                'Host': 'jwzx.hrbust.edu.cn',
                'Connection': 'keep-alive',
                'Content-Length': Buffer.byteLength(postData),
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Origin': 'http://jwzx.hrbust.edu.cn',
                'Upgrade-Insecure-Requests': '1',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'Referer': 'http://jwzx.hrbust.edu.cn/academic/common/security/login.jsp',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,und;q=0.7',
                'Cookie': handlecookie[0]
            }
        }
        resolve(options)
    })
    promise.then((options) => {
        return new Promise((resolve, reject) => {
            var req = http.request(options, function (response) {
                var data = [];

                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    data.push(chunk);
                })
                response.on('end', function () {

                    var html = iconv.decode(Buffer.concat(data), 'gb2312');
                    // console.log(html)
                    var $ = cheerio.load(html, { decodeEntities: false });
                    var result = $.text().toString();
                    // console.log($)
                    if (new RegExp('用户名或密码错误').test(result)) {
                        console.log(111)
                        res.redirect('./admin?username=' + username + '&error=3');
                        // reject('err')
                    } else if (new RegExp('验证码不正确').test(result)) {
                        console.log(222)
                        res.redirect('./admin?username=' + username + '&error=4');
                        // reject('err')
                    }

                })
            })
            req.write(postData)

            req.on('response', function (response2) {
                var randomstring = '';
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDay();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();

                randomstring = '' + year + (month < 10 ? ('0' + month) : month) + (day < 10 ? ('0' + day) : day) + (hour < 10 ? ('0' + hour) : hour) + (minute < 10 ? ('0' + minute) : minute) + (second < 10 ? ('0' + second) : second)
                var str = '9Nhfj3'

                randomstring += str;

                var handlecookie2 = response2.headers['set-cookie'];
                if (handlecookie2 == undefined) {
                    res.redirect('./admin?username=' + username + '&error=4');
                    // reject('err')
                } else {
                    var cookie2 = handlecookie2[0].split(';')[0];

                    var querydata = querystring.stringify({
                        groupId: '',
                        moduleId: '2000',
                        randomstring: randomstring
                    })

                    var option2 = {
                        method: 'GET',
                        hostname: "jwzx.hrbust.edu.cn",
                        path: "/academic/student/currcourse/currcourse.jsdo?" + querydata,
                        headers: {
                            'cookie': cookie2
                        }
                    }
                    var request2 = http.request(option2, function (res) {
                        // console.log('HEADERS: ' + JSON.stringify(res.headers));
                        var data = [];

                        res.on('data', function (chunk) {
                            data.push(chunk)
                        })
                        res.on('end', function () {
                            var html = iconv.decode(Buffer.concat(data), 'gb2312');
                            // console.log(html)
                            var $ = cheerio.load(html, { decodeEntities: false });
                            var result = $('.infolist_tab')[0];
                            var HandleClassTable = new HandleClassTables(result);
                            var resstr = HandleClassTable.handlehtml();

                            resolve(resstr)

                        })
                    })
                    request2.end();
                    request2.on('error', function (e) {
                        // console.log(e)
                    })
                }

            })
        })
    }).then((resstr) => {
        // console.log(resstr)
        if (resstr) {
            return new Promise((resolve, reject) => {
                user.update({ username: username }, { classtime: resstr }, function (err, mongoData) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve(false)
                res.redirect('/admin/?username=' + username + '&error=1');
            })
        }
    }).then((result) => {
        // console.log(result)
        if (result) {
            return new Promise((resolve, reject) => {
                res.redirect('/admin/hascourses?username=' + username+'&error=0');
            })
        }

    })
})


app.listen(3011);