const express = require("express");
const controller = require("../controllers/controller")
const middlewear = require("../middlewear/middlewear")
const cookieParser = require("cookie-parser")
const auth = require("../globalmiddlewear/auth");
const blogModel = require("../models/blogs");

const blogRouter = express.Router();
blogRouter.use(cookieParser())




blogRouter.post("/create", auth.authenticateUser, async (req, res) => {
    try {
        const { title,description, tag, author, timestamp, state, read_count, reading_time,  body} = req.body
        const user_id = req.params.user_id

        const response = await controller.createBlog({ title,description, tag, author, timestamp, state, read_count, reading_time, user_id, body })
        if (response.code == 201) {
            res.redirect('/dashboard')
            
        }

        else {
            res.redirect('/invalidInfo')
    
        }
    } catch (error) {
        console.log(error)
    }
})
blogRouter.get("/", middlewear.validateBlog, controller.getAllBlogs)

blogRouter.get("/:id", middlewear.validateBlog, controller.getOneBlog)





blogRouter.post('/update/:_id', async (req, res) => {
    try {
        // Extract the blog post ID from the request parameters
        const postId = req.params._id;

        // Retrieve the existing blog post from the database
        const existingBlogPost = await blogModel.findById(postId);

        if (!existingBlogPost) {
            return res.status(404).json({ message: 'blog not found' });
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

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

blogRouter.post('/:_id', async (req, res) => {
    try {
        // Extract the blog post ID from the request parameters
        const postId = req.params._id;

        // Delete the blog post from the database
        const deletedBlogPost = await blogModel.findByIdAndDelete(postId);

        if (!deletedBlogPost) {
            return res.status(404).json({ message: 'blog not found' });
        }
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = blogRouter


