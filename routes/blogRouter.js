const express = require("express");
const controller = require("../controllers/controller")
const middlewear = require("../middlewear/middlewear")
const auth = require("../globalmiddlewear/auth");
const blogModel = require("../models/blogs");

const blogRouter = express.Router();




blogRouter.post("/create", auth.authenticateUser, controller.createBlog)

blogRouter.get("/", middlewear.validateBlog, controller.getAllBlogs)

blogRouter.get("/:id", middlewear.validateBlog, controller.getOneBlog)

blogRouter.post('/update/:_id', middlewear.validateBlog, controller.updateBlog);


blogRouter.post('/:_id',  middlewear.validateBlog, controller.deleteBlog);



module.exports = blogRouter


