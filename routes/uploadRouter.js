
const express = require('express');
const multer = require('multer');
const path = require('path');

const uploadRouter = express.Router();


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
  
  uploadRouter.post('/upload', upload.single('profilePicture'), (req, res) => {
  
  
    //  file upload here, save the path to the user's profilePicture field
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
  
  module.exports = uploadRouter
