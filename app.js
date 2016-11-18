var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var engine = require('ejs-mate');
var pgp = require('pg-promise')();
var db = pgp('postgres://localhost:5432/generator');
var path = require('path');

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(path.join(__dirname + '/css')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res, next){
  db.any('SELECT * FROM posts')
  .then(function(data){
    return res.render('index', {data: data})
  })
  .catch(function(err){
    return next(err);
  })
});

app.get('/posts/:id', function(req, res, next){
  var id = parseInt(req.params.id);
  db.one('select * from posts where id = $1', id)
  .then(function(post){
    res.render('show', {post: post})
  })
  .catch(function(err){
    return next(err);
  });
});

app.get('/posts/:id/edit', function(req, res, next){
  var id = parseInt(req.params.id);
  db.one('select * from posts where id = $1', id)
  .then(function(post){
    res.render('edit', {post: post})
  })
  .catch(function(err){
    return next(err);
  });
});

app.post('/posts/:id/edit', function(req,res,next){
  db.none('update posts set title=$1, author=$2, message=$3 where id=$4',
  [req.body.title, req.body.author, req.body.message, parseInt(req.params.id)])
  .then(function(){
    res.redirect('/');
  })
  .catch(function(err){
    return next(err);
  });
});

app.get('/posts/views/new', function(req,res,next){
  res.render('new');
});

app.post('/posts/new', function(req, res, next){
  db.none('insert into posts(title, author, message)' +
    'values(${title}, ${author}, ${message})', req.body)
    .then(function(){
      res.redirect('/');
    })
    .catch(function(err){
      return next(err);
    });
});

app.post('/posts/:id/delete', function(req,res,next){
  var id = parseInt(req.params.id);
  db.result('delete from posts where id = $1', id)
  .then(function(){
    res.redirect('/');
  })
  .catch(function(err){
    return next(err);
  });
});

app.listen(3000, function(){
  console.log('application running at localhost on port 3000');
});
