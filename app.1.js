const path = require('path')

const express = require('express')
const template = require('express-art-template')
const bodyParser = require('body-parser')


const db = require(__dirname + '/db.js')
const app = express();

app.use('/assets/', express.static(path.join(__dirname, '/assets')))
app.engine('html', template)

app.get('/message.html', (req, res)=>{
    let fileName = path.join(__dirname, 'message.html')
    const expiresTime = new Date(Date.now()+3600000).toUTCString();
    // res.setHeader('set-cookie', 'id=101;expires='+expiresTime)
    res.set({
        'set-cookie':['hobby=chifan;expires='+expiresTime, 'goodPrice=30']
    })
    res.sendFile(fileName)
})

app.get('/getCookie', (req, res)=>{
    console.log(req.headers.cookie)
})






app.listen(3000, ()=>{
    console.log('3000 启动成功')
})