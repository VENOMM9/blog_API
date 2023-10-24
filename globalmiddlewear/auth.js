const userModel = require("../models/users")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const cookieParser = require("cookie-parser");



const authenticateUser = async (req, res, next) => {

    try {

        const token = req.cookies.jwt 
        console.log(token)


        if (!token) {
            return res.redirect("/users/login")
        }

        
        const decoded =  jwt.verify(token, process.env.JWT_SECRET)
        res.locals.user = decoded
        req.user_id = decoded._id
        next()

    }
    
    catch (error) {

        console.log(error)
        
    }
}
 




module.exports = {
   
    authenticateUser
}