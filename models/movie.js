let mongoose = require('mongoose')
//引入模式这个文件
let MovieSchema = require('../schemas/movie')
//编译Movie模型
let Movie = mongoose.model('Movie',MovieSchema)
// 将模型导出
module.exports = Movie
