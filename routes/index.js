var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    // User   = require('../models/user.js'),
    Post   = require('../models/post.js');
    // Comment = require('../models/comment.js');
//var multer = require('multer'),
//    upload = multer({ dest: './public/images/' });

// get pageSize
var pageSize = 2;

/* GET home page. */
module.exports = function(app) {
  app.get('/', function (req, res) {
      var name;
      if(!req.session.user){
          name = null;
      }else {
          name = req.session.user.name;
      }

      //判断是否是第一页，并把请求的页数转换成 number 类型
      var page = parseInt(req.query.p) || 1;
      if (page ==0){
          page =1;
      }
      //查询并返回第 page 页的 10 篇文章
      Post.getAllBySize(name, page, pageSize, function(err, posts, total){
          if(err){
              posts = [];
          }
          res.render('index', {
              title: '主页',
              user: req.session.user,
              posts: posts,
              page: page,
              isFirstPage: page ==1,
              isLastPage: ((page -1)*pageSize +posts.length) == total,
              success: req.flash('success').toString(),
              error: req.flash('error').toString()
          });
      });
  });

    app.get('/search', function (req, res) {
        Post.search(req.query.keyword, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('search', {
                title: "SEARCH:" + req.query.keyword,
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.use(function (req, res) {
        res.render("404");
    });

};

function checkLogin(req, res, next){
    if (!req.session.user){
        req.flash('error', '未登录');
        res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next){
    if(req.session.user){
        req.flash('error', '已登录');
        res.redirect('back');
    }
    next();
}
