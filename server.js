const express = require('express')
const { User } = require('./database')
const jwt = require('jsonwebtoken')
const SECRET = 'sadfh2358u43252134hdfgjkn932q89udfs'
//获得一个express实例
const app = express()
app.use(express.json())

//这一段是用来测试的，没什么实际作用
// app.get('/users', async(req, res) => {
//   const usersData = await User.find()
//   res.send(usersData)
// })

//注册接口
app.post('/register', async(req, res) => {
  //存储账号和密码到数据库里
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user)
})

//登录接口
app.post('/login', async(req, res) => {
  //从数据库里找传进来的账号
  const user = await User.findOne({
    username: req.body.username
  })
  //判断账号是否正确
  if(!user) {
    return res.status(422).send({
      message: '账号错误'
    })
  } 
  //判断密码是否正确
  const isPasswordValid = require('bcrypt').compareSync(req.body.password,user.password)
  if(!isPasswordValid) {
    return res.status(422).send({
      message: '账号错误'
    })
  }
  //生成token
  const token = jwt.sign({
    id: String(user._id)
  }, SECRET)
  res.send({ user, token });
})

const auth = async(req, res, next) => {
  //将token取出
  const raw = String(req.headers.authorization).split(' ').pop()
  //从token中解密出id
  const { id } = jwt.verify(raw, SECRET)
  //利用id找到对应的用户
  req.user = await User.findById(id)
  next()
}
//获取用户信息接口
app.get('/profile', auth, async(req, res) => {
  res.send(req.user)
})

//监听3001端口
app.listen(3001, () => {
  console.log('http://localhost:3001')
})