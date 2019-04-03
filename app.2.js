
const express = require('express')
const session = require('express-session')


const app = express();
let conf = {
    secret: '4ey32erfyf3fgpg',   //加密字符串。 使用该字符串来加密session数据，自定义
    resave: false,                //强制保存session即使它并没有变化
    saveUninitialized: false,     //强制将未初始化的session存储。当新建了一个session且未
    cookie: {maxAge: 3600000}							 //设定属性或值时，它就处于未初始化状态。
};
app.use(session(conf))

app.get('/setSession',(req, res)=>{
    req.session.isLogin = true;
    req.session.userIfo = {name:'小花', id:1, age:30};
    res.end('set-ok')
})

app.get('/getSession',(req, res)=>{
    console.log(req.session)
    res.end('get-ok')
})


app.get('/getCookie', (req, res)=>{
    console.log(req.headers.cookie)
})






app.listen(3000, ()=>{
    console.log('3000 启动成功')
})