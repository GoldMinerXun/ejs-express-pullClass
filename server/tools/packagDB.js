const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017'; //mongodb://127.0.0.1:27017
const ObjectId = mongodb.ObjectId
//1.灵活的操作每一个库  就需要把库的名字作为参数传递
//2.灵活的操作每一个集合  就需要把集合的名字作为参数传递
//3.在封装函数里边，必须要有增删查改这四个函数
// es5将外部的this保存在that里面，在内部函数中调用that
// es6使用箭头函数
class Client{
    constructor(dbName,collName){
          this.dbName = dbName;
          this.collName = collName;
    }
    insert(data, callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            var db = client.db(this.dbName)
            db.collection(this.collName).insertOne(data, function (err, res) {
                callback(err, res)
                client.close();
            })
        })
    }
    remove (data, callback) {
        MongoClient.connect(url, { useNewUrlParser: true },(err, client)=> {
            var db = client.db(this.dbName)
            db.collection(this.collName).remove(data, function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
    update(data, changeDate, callback) {
        MongoClient.connect(url, { useNewUrlParser: true },(err, client)=>{
            var db = client.db(this.dbName)
            db.collection(this.collName).update(data, {
                $set: changeDate
            }, function (err, res) {
                callback(err, res)
                client.close()
            })
        })
    }
    find(data, callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client)=>{
            var db = client.db(this.dbName)
            db.collection(this.collName).find(data).toArray(function(err,res){
                callback(err,res);
                client.close()
            })
        })
    }
}

// var user = new Client('test', 'user');
// user.insert({name : "西安"},function(err,res){
//     console.log(res)
// })
// user.remove({
//     _id: ObjectId('5c500ad7ee57204b3848d3ac')
// }, function (err, res) {
//     console.log(res)
// })

// user.update({ name: "小刚" }, { age: 10 }, function (err, res) {
//     console.log(res)
// })

// user.find({name : "小刚"},function(err,res){
//     console.log(res)
// })

exports.MongoControl=Client