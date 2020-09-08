//jshint esversion:6

// Setting up the required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { includes } = require("lodash");
const _ = require('lodash');
const mongoose = require("mongoose");

// Setting up the app using express.js
const app = express();

// Changing express settings
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Database connection
mongoose.connect('mongodb://localhost/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connection established")
});

// Database schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const BlogPost = mongoose.model("blogPost", blogSchema);

// Test item for the DB
// const testPost = new BlogPost({
//   title: "TestTitle",
//   content: "TestContent"
// });
// testPost.save((err)=>{
//   if (err) return console.error(err);
// });

// Setting up the constants with some example text
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// GET for HOME route
app.get("/", (req, res) => {
  BlogPost.find({}, (err,foundPosts) => {
    if (err) return console.error(err);
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: foundPosts,
    });
  })
});

// GET for individual POSTS
app.get("/posts/:postID", (req,res) => {
  const requestedPostID = req.params.postID;
  // Find the posts with the same id
  BlogPost.findById(requestedPostID, (err, foundPosts) => {
    // If any error comes up, catch it and redirect the user to the root route
    if (err) {
      res.redirect("/");
      return console.error(err);
    } else {
      // If no post found, report it to the console and redirect the user to the root route
      if (!foundPosts) {
        console.log("Post doesn't exist");
        res.redirect("/");
      // If the post is found, render it
      } else {
        res.render("post", {
          postTitle: foundPosts.title,
          postBody: foundPosts.content,
        });
      }
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
  // Create a new post from the req information
  const newPost = new BlogPost({
    title: req.body.newPostTitle,
    content: req.body.newPostBody
  });
  // Save it into the database and catch any error
  newPost.save((err)=>{
    if (err) return console.error(err);
  });
  // Redirect to the home page
  res.redirect("/");
})

// Checking if the server is running on port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
