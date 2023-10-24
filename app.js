const express = require("express");
const userRoute = require("./routes/userRouter");
const blogRoute = require("./routes/blogRouter");
const path = require("path")
const auth = require("./globalmiddlewear/auth")

require("dotenv").config()
const {connectionToMongodb}  = require("./db/connect")

const userModel = require("./models/users");
const blogModel = require("./models/blogs");
const cookieParser = require("cookie-parser");


const PORT = process.env.PORT || 5950
const app = express()


app.set('view engine', 'ejs')
app.set('views', 'views')


app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())

app.use(express.static( path.join(__dirname,'/public')));


//connect to mongodb instance
connectionToMongodb()


app.use("/users", userRoute)
app.use("/blogs", blogRoute)


app.get('/', (req, res) => {
    res.render('home')
})

app.get("/dashboard", auth.authenticateUser,  async (req, res) => {
    try {
        console.log(req.user_id)
        const blogs = await blogModel.find({ user_id: req.params.user_id })
        const users = await userModel.find({ user_id: req.params.user_id })

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = {
            first_name: users[0].first_name
        }
        console.log( users  )

        // const users = await userModel.find({req.body.first_name })
        // console.log(blogs)
        res.status(200).render('dashboard', {  user: req.params.user_id, blogs,user, date: new Date()});
    } catch(err) {
       return res.json(err)
    }
})




app.get('/update/:_id', async (req, res) => {
    try {
        // Retrieve the blog post by ID
        const postId = req.params._id;
        const blog = await blogModel.findById(postId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Render the updateBlog.ejs template with the blog post data
        res.render('updateblog', { blog });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/create', (req, res) => {
    res.render('createblog')
})


app.get('/signup', (req, res) => {
    res.render('signup')
})


app.get('/login', (req, res) => {
    res.render('login')
})


app.get('/existinguser', (req, res) => {
    res.render('existinguser')
})


app.get('/invalidinfo', (req, res) => {
    res.render('invalidinfo')
})


app.get('/unknown', (req, res) => {
    res.render('unknown')
})


app.get("/logout", (req, res) => {

    res.clearCookie('jwt')
    res.redirect("/login")
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})