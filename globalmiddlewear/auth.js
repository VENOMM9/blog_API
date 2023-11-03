const userModel = require("../models/users")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const authenticateUser = async (req, res, next) => {
    try {
            
            const token = req.cookies.token 
            console.log(token)
    
            
           
            const decoded =  jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded.user
            req.user_id = decoded.user._id
    
            console.log( decoded)
    
            next()
        } catch (error) {
            console.log(error)
           return res.status(302).redirect("/login")
            
            
        }
    
    }

 module.exports = {
   
    authenticateUser
}