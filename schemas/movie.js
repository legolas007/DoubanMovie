let mongoose = require('mongoose')

let MovieSchema = new mongoose.Schema({
    director:String,//作者
    title:String,//标题
    country:String,//国家
    language:String,//语言
    year:String,//年份
    poster:String,//海报
    summary:String,//简介
    flash:String, //视频源


    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

MovieSchema.pre('save',function (next) {
    if (this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
        // 判断是否是新加的,若是新加的则让更新时间和创建时间一致
        // 若是再次保存，则只更新最新的更新时间
    }
    else {
        this.meta.updateAt = Date.now()
    }
    next()
})

// 定义静态方法，静态方法在Model层就能够使用
MovieSchema.statics = {
    // 用fetch方法获取所有的数据
    fetch:function (callback) {
        return this
            .find({})
            .sort('meta.updateAt')// 根据更新的时间排序
            .exec(callback)
    },
    findById:function (id,callback) {
        return this
            .findOne({_id:id})
            .exec(callback)
    }
}
//导出模式
module.exports = MovieSchema