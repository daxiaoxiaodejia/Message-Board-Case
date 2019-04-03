const path = require('path')
const session = require('express-session')
const express = require('express')
const template = require('express-art-template')
const bodyParser = require('body-parser');
const moment = require('moment')
const artTemplate = require('art-template')

const db = require(__dirname + '/db.js')
const app = express();

app.use('/assets/', express.static(path.join(__dirname, '/assets')))
app.engine('html', template);
//中间件,会将请求体中的数据放到req中
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    secret: '4ey32erfyf3fgpg',   //加密字符串。 使用该字符串来加密session数据，自定义
    resave: false,                //强制保存session即使它并没有变化
    saveUninitialized: false,
}));

//方法二,通过注册过滤器修改时间
artTemplate.defaults.imports.mytime = function(value){
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
};


app.get('/message.html', (req, res)=>{
    let fileName = path.join(__dirname, 'message.html')
    // res.sendFile(fileName)
    let flag = req.session.isLogin ? true : false;
    // console.log(req.session.isLogin) //undefined flag默认值是false
    // console.log(flag) //false
    res.render(fileName, {
        isLogin: flag,
        
    })
})


app.get('/getMsg', (req, res)=>{
    // res.send('123')
    let fileName = path.join(__dirname, 'li.html')
    // let liuyan = require(__dirname+'/db.js')
    db.abcd('select * from msg', null, (err, result)=>{
        if(err) throw err;
        //console.log(result); //[RowDataPacket {
           // m_id: 33,
           // m_name: '虞姬',
           // m_content: 'hello',
           // m_time: 2019-04-03T05:10:07.000Z } ,{}]

        //第一种办法: 进行循环,把原来的时间换成正常时间
        // for(var i in result){
        //     result[i].m_time = moment(result[i].m_time).format('YYYY-MM-DD HH:mm:ss')
        // }
        res.render(fileName,{
            xyz: result
        })
    })
})




app.post('/login',(req,res)=>{
    //接收数据
    // console.log(req.body)
    let user = req.body.u_name;
    let pwd = req.body.u_pwd;

    //检测用户名密码是否正确
    let sql ='select * from user where u_name =? and u_pwd=?';
    db.abcd(sql, [user, pwd], (err, result)=>{
        if(err) throw err;
        // console.log(result) //[ RowDataPacket { u_id: 1, u_name: '小花', u_pwd: '123' } ]       
        //将用户的信息存储到session中
        // console.log(req.session)
        req.session.isLogin = true;
        req.session.userInfo = result[0]; //{u_id:1, u_name:'小花',u_pwd:123}
        // req.session.userInfo = 'QWE'; //{u_id:1, u_name:'小花',u_pwd:123}
        res.send(result.length+''); //根据数组长度来判断,如果有的话则为1
    })
})


//处理留言发布,监视/addMsg
app.post('/addMsg',(req, res)=>{
    //接收提交的留言和称呼
    // console.log(req.body) //{ m_name: '323', m_content: '2323' }
    req.body.m_name = req.session.userInfo.u_name;
    req.body.m_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let sql = 'insert into msg set ?'
    db.abcd(sql, req.body, (err, result)=>{
        if(err) throw err;
        //console.log(result); //可以查看受影响的行数,是否添加成功
        // res.send(result.affectedRows+'');
        res.send(req.body)

    })


    //将新的留言添加到数据库

})




app.listen(3000, ()=>{
    console.log('3000 启动成功')
})