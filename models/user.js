let mongoose = require('mongoose')
//引入模式这个文件
let UserSchema = require('../schemas/user')
//编译User模型
let User = mongoose.model('User',UserSchema)
// 将模型导出
module.exports = User
