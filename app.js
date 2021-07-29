//jshint esversion:6
const mongoose=require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
var _ = require('lodash');
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://new-user:test123@cluster0.pqa3i.mongodb.net/blogDB", {useNewUrlParser: true});

const blogschema=new mongoose.Schema({
  title:String,
  content:String
});
const Blog=mongoose.model("blog",blogschema);

app.get("/", function(req, res) {
    Blog.find({},function(err,result){
        res.render('home', {
          para_one: homeStartingContent,
          postss:result
      });
    });
});

app.get("/about", function(req, res) {
  res.render('about', {
    para_two: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render('contact', {
    para_three: contactContent
  });
});


app.get("/compose", function(req, res) {
  res.render('compose');
});

app.get("/posts/:topic", function(req, res) {
  console.log(_.lowerCase(req.params.topic));
  var requestedPost = _.lowerCase(req.params.topic);
  Blog.find({},function(err,result){

      result.forEach(function(post) {
        var currentPost=_.lowerCase(post.title);
        if(currentPost===requestedPost)
        {
          console.log("Match Found");
          res.render("blogpage",{title:post.title,body:post.content});
        }
        else
        {
          console.log("Match not found");
        }
});
  });

});

app.post("/compose", function(req, res) {
  const blog_post=new Blog({
    title:req.body.title_text_input,
    content:req.body.post_text_input
  });

  blog_post.save(function(err){
    if(err){
      res.redirect("/");
    }
  });

  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
