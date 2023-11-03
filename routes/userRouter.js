const express = require("express");
const controller = require("../controllers/controller")
const middlewear = require("../middlewear/middlewear")
const cookieParser = require("cookie-parser")
const auth = require("../globalmiddlewear/auth")
const blogModel = require("../models/blogs")
const multer = require("multer");
const userModel = require("../models/users");





const userRouter = express.Router();

userRouter.use(cookieParser())



userRouter.post("/signup", middlewear.validateCreateUser, controller.createUser) 


userRouter.post("/login",  controller.login)








module.exports = userRouter