const express = require("express");
const userRoute = require("./routes/userRouter");
const blogRoute = require("./routes/blogRouter");
const path = require("path");
const auth = require("./globalmiddlewear/auth");

require("dotenv").config();
const { connectionToMongodb } = require("./db/connect");

const userModel = require("./models/users");
const blogModel = require("./models/blogs");
const cookieParser = require("cookie-parser");
const { title } = require("process");

const PORT = process.env.PORT || 5050;
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//connect to mongodb instance
connectionToMongodb();

app.use("/users", userRoute);
app.use("/blogs", blogRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/publishedblogs", async (req, res) => {
  try {
    // Fetch published blogs from your database (assuming 'state' represents the publish state)
    const publishedBlogs = await blogModel.find({ state: "published" });

    res.render("publishedBlogs", { blogs: publishedBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/blogsPost/:_id", async (req, res) => {
  try {
    const blogId = req.params._id;
    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    //increment the read count
    blog.read_count += 1;

    //save the updated blog
    await blog.save();

    res.render("blogsPost", { blog });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/blogs", async (req, res) => {
  try {
    // Extract query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
    const state = req.query.state; // You can add validation or use a default value
    const title = req.query.title;

    // Calculate the skip value based on pagination
    const skip = (page - 1) * limit;

    // Query the database based on the user's ID, pagination, and filtering options
    const userId = req.user_id; // User's ID retrieved from authentication
    const query = { user_id: userId };

    if (state) {
      query.state = state;
    }

    if (title) {
      query.title = title;
    }
    if (!title) {
      return res.status(400).json({ message: '"title" is required' });
    }

    const blogs = await blogModel.find(query).skip(skip).limit(limit);

    // You need to calculate the total number of blogs for pagination
    const totalNumberOfBlogs = await blogModel.countDocuments(query);

    // Send the list of blogs as a response
    res.render("blogs", {
      blogs,
      page,
      total: totalNumberOfBlogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/dashboard", auth.authenticateUser, async (req, res) => {
  try {
    const user_id = req.user_id;
    const user = req.user;

    const blogs = await blogModel.find({ user_id: user_id });

    // const users = await userModel.find({req.body.first_name })
    // console.log(blogs)
    res
      .status(200)
      .render("dashboard", { user_id, user, blogs, date: new Date() });
  } catch (err) {
    return res.json(err);
  }
});

// app.get('/users/dashboard.css', (req, res) => {
//     res.type('text/css'); // Set the content type to CSS
//     res.sendFile(path.join(__dirname, 'public/dashboard.css'));
// });

app.get("/update/:_id", async (req, res) => {
  try {
    // Retrieve the blog post by ID
    const postId = req.params._id;
    const blog = await blogModel.findById(postId);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Render the updateBlog.ejs template with the blog post data
    res.render("updateblog", { blog });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/create", (req, res) => {
  res.render("createblog");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/existinguser", (req, res) => {
  res.render("existinguser");
});

app.get("/invalidinfo", (req, res) => {
  res.render("invalidinfo");
});

app.get("/unknown", (req, res) => {
  res.render("unknown");
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
