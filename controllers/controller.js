const userModel = require("../models/users");
const blogModel = require("../models/blogs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const createUser = async (req, res) => {
  // const createUserProfile = {name, password, email}
  const { first_name, last_name, email, password, country } = req.body;
  try {
    const existingUser = await userModel.findOne({
      email: email,
    });

    if (existingUser) {
      res.redirect("/existinguser");
    }

    const user = await userModel.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      country: country,
    });

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = await jwt.sign(
      { first_name: user.first_name, email: user.email, _id: user._id },
      JWT_SECRET
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      tag,
      author,
      timestamp,
      state,
      read_count,
      reading_time,
      body,
    } = req.body;
    const user_id = req.user_id;

    const existingBlog = await blogModel.findOne({
      title: title,
      description: description,
      tag: tag,
      author: author,
      state: state,
      user_id: user_id,
      body: body,
    });

    if (existingBlog) {
      return {
        message: "blog created already",
        status: 208,
      };
    }

    const blog = await blogModel.create({
      title: title,
      description: description,
      tag: tag,
      author: author,
      state: state,
      user_id: user_id,
      body: body,
    });

    res.status(200).redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await blogModel.find({});
    console.log("All blogs successfully gotten");
    return {
      status: 200,
      allBlogs,
    };
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

const getOneBlog = async (req, res) => {
  try {
    const blogId = req.params._id;
    console.log(blogId);
    const oneBlog = await blogModel.findById(blogId);
    console.log(oneBlog);
    res.status(200).send(oneBlog);

    console.log("blog successfully gotten");
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

const updateBlog = async (req, res) => {
  try {
    // Extract the blog post ID from the request parameters
    const postId = req.params._id;

    // Retrieve the existing blog post from the database
    const existingBlogPost = await blogModel.findById(postId);

    if (!existingBlogPost) {
      return res.status(404).json({ message: "blog not found" });
    }

    // Update the fields of the existing blog post
    // You can update title, description, tag, author, state, or other fields
    existingBlogPost.title = req.body.title;
    existingBlogPost.description = req.body.description;
    existingBlogPost.tag = req.body.tag;
    existingBlogPost.author = req.body.author;
    existingBlogPost.state = req.body.state;
    existingBlogPost.body = req.body.body;

    // Save the updated blog post
    const updatedBlogPost = await existingBlogPost.save();

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    // Extract the blog post ID from the request parameters
    const postId = req.params._id;

    // Delete the blog post from the database
    const deletedBlogPost = await blogModel.findByIdAndDelete(postId);

    if (!deletedBlogPost) {
      return res.status(404).json({ message: "blog not found" });
    }

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      email: email,
    });
    // console.log(user)

    if (!user) {
        res.redirect("/signup");

    }

    const validPassword = await user.isValidPassword(password);
    console.log(email);

    if (!validPassword) {
        res.redirect("/unknown");

    }

    const token = await jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 });
    res.status(200).redirect("/create");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  login,
  getAllBlogs,
  getOneBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
