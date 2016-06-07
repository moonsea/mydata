var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(name, head, title, tags, post){
    this.name = name;
    this.title = title;
    this.tags = tags;
    this.post = post;
    this.head = head;
}

module.exports = Post;

// 根据用户名查所有该用户的文章
Post.getAllBySize = function (name, page, pageSize, callback){
    // open db
  mongodb.open(function(err, db){
      if(err){
          return callback(err);
      }

      db.collection('user', function(err, collection){
         if(err){
             mongodb.close();
             return callback(err);
         }
          var query = {};
        //   if (name) {
        //       query.name = name;
        //   }
          //使用 count 返回特定查询的文档数 total
          collection.count(query, function (err, total) {
              if (err){
                  return callback(err);
              }
              //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
              collection.find(query).skip((page -1)*pageSize).limit(pageSize).
                toArray(function (err, docs) {
                  db.close();
                  if (err){
                      return callback(err);
                  }
                //   docs.forEach(function (doc) {
                //       doc.post = markdown.toHTML(doc.post);
                //   });
                  return callback(null, docs, total);
              });
          });
      });
  });
};

// search
Post.search = function (keyword, callback) {
    mongodb.open(function (err, db) {

        if (err){
            return callback(err);
        }

        db.collection('user', function (err, collection) {
            if (err){
                mongodb.close();
                return callback(err);
            }

            var pattern = new RegExp(keyword, "i");
            collection.find({
                username: pattern
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err){
                    return callback(err);
                }

                return callback(null, docs);
            });
        });
    });
};
