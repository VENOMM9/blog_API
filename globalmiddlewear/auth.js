const userModel = require("../models/users")
const jwt = require("jsonwebtoken")
require("dotenv").config()



const authenticateUser = async (req, res, next) => {

    

        const token = req.cookies.jwt 
        console.log(token)


        if (!token) {
            return res.redirect("/login")
        }
    try {
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.redirect('/login')
            }
            res.locals.user = decoded   
            


            next();

        })
    } catch (error) {

        console.log(error);
        res.redirect('/login')
        
    }
}
 




module.exports = {
   
    authenticateUser
}