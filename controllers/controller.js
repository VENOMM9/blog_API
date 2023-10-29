const userModel = require("../models/users")
const blogModel = require("../models/blogs")
const jwt = require("jsonwebtoken")

require('dotenv').config()



const createUser = async ({ first_name, last_name , email, password, country }) => {
    
    // const createUserProfile = {name, password, email}
   

    const existingUser = await userModel.findOne({
        email: email

    });

    console.log(existingUser)
 if (existingUser) {
        return{
            message: "user created already",
            code: 409

        }
    };

    const user = await userModel.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        country:country


    });

  const JWT_SECRET = process.env.JWT_SECRET
    const token =  await jwt.sign({ first_name: user.first_name, email: user.email, _id: user._id }, JWT_SECRET)
    console.log(token)

    console.log(user)

return {
    message: "user created successfully",
    code: 200,
    token
    };
   

}



const createBlog = async (req, res) => {

    try{
    
    const { title,description, tag, author, timestamp, state, read_count, reading_time,  body} = req.body
    const user_id = req.user_id

    
    const existingBlog = await blogModel.findOne({
         title: title,
        description: description,
        tag: tag,
        author: author,
        state: state,
        user_id: user_id,
        body: body

    });
    
    if (existingBlog) {
        return {
            message: "blog created already",
            status: 208

        }
    };

    const blog = await blogModel.create({
        title: title,
        description: description,
        tag: tag,
        author: author,
        state: state,
        user_id: user_id,
        body: body


    });
   
        res.status(200).redirect("/dashboard");
        
    }

    catch (error) {
  console.log(error);
}
};



const getAllBlogs = async (req, res) => {

    try {

        const allBlogs = await blogModel.find({})
        console.log('All blogs successfully gotten')
        return {
            status: 200,
            allBlogs
        }

    } catch (error) {

        console.log(error)
        res.status(400)
    } 
    
};



const getOneBlog = async (req, res) => {

    try {

        const blogId = req.params._id
        console.log(blogId)
        const oneBlog = await blogModel.findById(blogId)
        console.log(oneBlog)
        res.status(200).send(oneBlog);

        console.log('blog successfully gotten')
        
    } catch (error) {

        console.log(error)
        res.status(400)
    }
    
   
};




const deleteBlog = async (req, res) => {

    try {

        const blogId = req.params._id
        console.log(blogId)
        const oneBlog = await blogModel.findOneAndDelete(blogId)

        if (!blogId) {

             return res.status(404).json({msg:`No blog with id: ${blogId}`})
        }
        
        res.status(200).send(oneBlog);
        console.log('blog successfully deleted')
        

    } catch (error) {

        console.log(error)
        res.status(400)
    }
    
   
};


const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await userModel.findOne({
          email: email,
          
      });
      // console.log(user)
      if (!user) {
        return {
          message: "This user does not exist",
          code: 404,
        };
      }
  
      const validPassword = await user.isValidPassword(password);
      console.log(email);
  
      if (!validPassword) {
        return {
          message: "wrong email or password",
          code: 422,
        };
      }
  
      const token = await jwt.sign(
        { user: user},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.cookie("token", token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 });
      res.status(200).redirect("/create");
    } catch (error) {
      console.log(error);
    }
  };

    
        
    




module.exports = {
    createUser,
    login,
    getAllBlogs,
    getOneBlog,
    createBlog,
    deleteBlog
   
   
}
  
