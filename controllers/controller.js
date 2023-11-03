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
      return res.redirect("/existinguser");
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
    res.status(302).redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(500).message("Internal Server Error");
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

    
    const blog = await blogModel.create({
      title: title,
      description: description,
      tag: tag,
      author: author,
      state: state,
      user_id: user_id,
      body: body,
    });

    res.status(302).redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const totalBlogs = await blogModel.countDocuments()
  // Get page and limit from query string
        let page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Set your default limit

    const totalPages = Math.ceil(totalBlogs / limit)
    console.log(totalPages)
    console.log(page )

    
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

        // Calculate the skip value
        const skip = (page - 1) * limit;

        // Fetch blogs based on pagination parameters
    const blogs = await blogModel.find()
      
   
    
            .skip(skip)
      .limit(limit);
    
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        blog.read_count = parseInt(blog.read_count) + 1;
        await blog.save();
      }    const users = await blogModel.find({ user_id });
  

    console.log("All blogs successfully gotten");
      res.render("allblogs", { user_id:user_id, users:users, totalPages:totalPages, page:page, totalBlogs:totalBlogs, limit:limit, blogs:blogs, date: new Date() });

   
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

const getOneBlog = async (req, res) => {
  try {
    const blogId = req.params._id;
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment the read_count by 1
    blog.read_count = parseInt(blog.read_count) + 1;
    await blog.save();

    // Fetch the user information
    const user_id = blog.user_id; // Assuming the user_id is stored in the blog document
    const user = await userModel.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.render("blog", { user_id:user_id, user:user, blog:blog, date: new Date() });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBlog = async (req, res) => {
  try {
    // Extract the blog post ID from the request parameters
    const postId = req.params._id;

    // Retrieve the existing blog post from the database
    const existingBlogPost = await blogModel.findById(postId);

    if (!existingBlogPost) {
      return res.status(302).redirect("/create");
    }
    existingBlogPost.read_count = parseInt(existingBlogPost.read_count) + 1;
    await existingBlogPost.save();
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

    res.status(302).redirect("/dashboard");
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

    res.status(302).redirect("/dashboard");
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
      return  res.status(404).redirect("/signup");

    }

    const validPassword = await user.isValidPassword(password);
    console.log(email);

    if (!validPassword) {
       return res.status(302).redirect("/unknown");

    }

    const token = await jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 });
    res.status(200).redirect("/create");
  } catch (error) {
    console.log(error); // Log the error for debugging
    res.status(500).send("Internal Server Error");
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
