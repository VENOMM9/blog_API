const express = require("express");
const controller = require("../controllers/controller")
const middlewear = require("../middlewear/middlewear")
const cookieParser = require("cookie-parser")

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
            res.redirect('/existingUser')
        }
        else { res.redirect('/signup') }
    } catch (error) {
        console.log(error)
    }
}) 


userRouter.post("/login", middlewear.validateLogin, async (req, res) => {

    try {
        const { email, password } = req.body
        const response = await controller.login({ email, password })
        if (response.code == 201) {
            res.locals.user = response.user
            res.cookie("jwt", response.token,  { maxAge: 60 * 60 * 1000 })
            res.redirect("/dashboard")
        }
        else if (response.code == 404) {
            res.redirect("/userNotFound")
        }
        else { res.redirect("/invalidInfo") }
    } catch (error) {
        console.log(error)
        
    }
})

module.exports = userRouter