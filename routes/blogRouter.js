const express = require("express");
const controller = require("../controllers/controller")
const middlewear = require("../middlewear/middlewear")
const auth = require("../globalmiddlewear/auth");
const blogModel = require("../models/blogs");
const methodOverride = require('method-override');



const blogRouter = express.Router();

blogRouter.use(methodOverride('_method'));


blogRouter.post("/create", auth.authenticateUser, controller.createBlog)

blogRouter.get("/",  controller.getAllBlogs)

blogRouter.get("/:_id", controller.getOneBlog)

blogRouter.put('/update/:_id',  controller.updateBlog);


blogRouter.post('/:_id',   controller.deleteBlog);



module.exports = blogRouter


