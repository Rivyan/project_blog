//jshint esversion:6

// Setting up the required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { includes } = require("lodash");
const _ = require('lodash');

// Setting up the constants with some example text
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Setting up the app using express.js
const app = express();

let posts = [];

// Changing the renderer to EJS
app.set('view engine', 'ejs');
// Setting up bodyparser to be able to read data from POST
app.use(bodyParser.urlencoded({
  extended: true
}));
// Setting up the server to be able to show static data
app.use(express.static("public"));

// GET for HOME route
app.get("/", function (req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts
  });
});

// GET for individual POSTS
app.get("/posts/:postTitle", function(req,res) {
  // Constant for the reqested URL post title
  const requestedTitle = _.lowerCase(req.params.postTitle); 
  // Loop over all the posts, and check if we have a post with the same title, if we do render a page based on the post template with the data from the post
  posts.forEach(function(post) {
    if (_.lowerCase(post.postTitle) === requestedTitle) {
      res.render("post", {
        postTitle: post.postTitle,
        postBody: post.postBody
      });
    } else {
      console.log("Post doesn't exist.");
    }
  });
});

// GET for ABOUT route
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  })
});

// GET for CONTACT route
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  })
});

// GET for COMPOSE route
app.get("/compose", function (req, res) {
  res.render("compose", {})
});

// POST for COMPOSE route
app.post("/compose", function (req, res) {
  const newPost = {
    postTitle: req.body.newPostTitle,
    postBody: req.body.newPostBody
  };
  posts.push(newPost);
  res.redirect("/compose");
})

// Checking if the server is running on port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
