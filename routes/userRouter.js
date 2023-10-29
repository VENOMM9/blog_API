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



userRouter.post("/signup", middlewear.validateCreateUser, async (req, res) => {
    try {
        const { first_name, last_name, email, password, country } = req.body
        const response = await controller.createUser({ first_name, last_name, email, password, country })
        if (response.code == 200) {
            res.redirect('/login')
        }
        else if (response.code == 409) {
            res.redirect('/existinguser')
        }
        else { res.redirect('/signup') }
    } catch (error) {
        console.log(error)
    }
}) 




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'path/to/profile-pictures-directory'); // Set the path where profile pictures will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

userRouter.post('/upload', upload.single('profilePicture'), (req, res) => {
  // Handle the file upload here, save the path to the user's profilePicture field
  const userId = req.user._id; // Assuming you have user data in the request
  const profilePicturePath = req.file.path; // Path to the uploaded profile picture
  // Update the user's document with the profilePicturePath
  userModel.findByIdAndUpdate(userId, { profilePicture: profilePicturePath }, (err, user) => {
    if (err) {
      // Handle the error
    } else {
      // Profile picture path has been updated in the user document
      res.redirect('/dashboard'); // Redirect to the dashboard after successful upload
    }
  });
});



userRouter.post("/login",  controller.login)



module.exports = userRouter