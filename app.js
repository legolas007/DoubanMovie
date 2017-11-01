let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let port = process.env.PORT || 3000
let serverStatic = require('serve-static')
let mongoose = require('mongoose')
let _ = require('underscore')
let Movie = require('./models/movie')
let User = require('./models/user')
let app = express()

mongoose.connect('mongodb://localhost:27017/movie')
console.log("MongoDB connection success!")

app.locals.moment = require('moment')
//extended为false表示使用querystring来解析数据，这是URL-encoded解析器
//返回一个只解析urlencoded消息体的中间件，只接受utf-8对消息体进行编码，同时支持自动的gzip/deflate编码解析过的消息放在req.body对象中。这个对象包含的键值对，同时值可以是一个string或者一个数组(当extended为false的时候)。也可以是任何类型(当extended设置为true)
app.use(bodyParser.urlencoded({ extended: true }))
//上面那个要加extended:true，否则会在post的时候出错
app.set('views','./views/pages')
app.set('view engine','pug')
//返回一个只解析json的中间件，可以支持任何unicode编码的消息体，同时也支持gzip和deflate编码。最后保存的数据都放在req.body对象上
app.use(bodyParser.json())
// 设置静态目录，使view中引入的东西路径正确
app.use(serverStatic('bower_components'));
app.use(serverStatic(path.join(__dirname,'public')))
//app.use(express.static(path.join(__dirname, 'bower_components')));//过去版语法，现已不支持
app.listen(port)

console.log(`movie_website started on ${port}`)
//index
app.get('/', (req, res)=>{
    Movie.fetch((err,movies) => {
        err && console.log(err)
        res.render('index',{
            title: 'MovieWeb 首页',
            movies: movies
        })
    })
});
//signup
app.post('/user/signup', function (req, res) {
    let _user = req.body.user


    User.find({name: _user.name},function (err,user) {
        if (err){
            console.log(err)
        }
        if (user){
            return res.redirect('/')
        }else {
            let user = new User(_user)
            user.save(function (err,user) {
                if (err){
                    console.log(err)
                }else {
                    res.redirect('/admin/userlist')
                }
            })
        }
    })

    /*
    let _userid = req.params.userid
    let _userid = req.query.userid
    let _userid = req.body.userid

     */
})

// Userlist page
app.get('/admin/userlist', (req, res) => {
    User.fetch((err, movies) => {
        err && console.log(err);

        res.render('userlist', {
            title: 'MovieWeb 用户列表页',
            movies: musers
        });
    });
});
// detail page
app.get('/movie/:id', (req, res) => {
    let id = req.params.id;

    Movie.findById(id, (err, movie) => {
        res.render('detail', {
            title: 'MovieWeb ' + movie.title,
            movie: movie
        });
    })
});

// 后台录入页
app.get('/admin/movie', (req, res) => {
    res.render('admin', {
        title: 'admin page 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

// admin update movie
app.get('/admin/update/:id', (req, res) => {
    let id = req.params.id;

    if (id) {
        Movie.findById(id, function (req, movie) {
            res.render('admin', {
                title: 'MovieWeb 后台更新页',
                movie: movie
            });
        });
    }else {
        console.log('error')
    }
});

// admin post movie 后台录入提交
app.post('/admin/movie/new', (req, res) => {
    let id = req.body.movie._id;
    let movieObj = req.body.movie;
    let _movie;

    if (id !== 'undefined' && id !== '') {
        Movie.findById(id, (err, movie) => {
            err && console.log(err);
//复制对象的所有属性到目标对象上，覆盖已有属性
            _movie = _.extend(movie, movieObj);

            _movie.save((err, movie) => {
                err && console.log(err);
                res.redirect(`/movie/${movie._id}`);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });

        _movie.save((err, movie) => {
            err && console.log(err);

            res.redirect(`/movie/${movie._id}`);
        });
    }
});

// 5.电影真正的更新地址
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'Movie 后台管理',
        movie: {
            title: ' ',
            doctor: ' ',
            country: ' ',
            year: ' ',
            language: ' ',
            summary: ' ',
            poster: ' ',
            flash: ' '
        }
    });
});

// list page
app.get('/admin/list', (req, res) => {
    Movie.fetch((err, movies) => {
        err && console.log(err);

        res.render('list', {
            title: 'movieweb 列表页',
            movies: movies
        });
    });
});

// list delete movie
app.delete('/admin/list', (req, res) => {
    let id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, (err, movie) => {
            err && console.log(err);
            res.json({success: 1});
        });
    }
});