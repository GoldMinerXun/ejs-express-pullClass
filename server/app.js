var cluster = require('cluster')
var numCPUs = require('os').cpus().length
var port = process.env.PORT || 4000
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('工作进程' + worker.process.pid + '重启')
        setTimeout(function () { cluster.fork() }, 2000)
    })
    console.log('[主进程] - ' + process.pid)
} else {
    // console.log('[工作进程] - ' + process.pid)

    // var express = require('express')
    // var app = express()
    // var path = require('path')
    // app.listen(port)
    require('./server.js')
}
