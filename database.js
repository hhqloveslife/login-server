const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/backend',{
  useNewUrlParser:true
})


const UserSchema = new mongoose.Schema({
  username: {type:String, unique: true},
  password: {type:String, set(val) {
    return require('bcrypt').hashSync(val, 5)//密码加密
  }}
})
const User = mongoose.model('User', UserSchema)
// Clear the DB. Only for test!
User.db.dropCollection('users')
module.exports = { User }