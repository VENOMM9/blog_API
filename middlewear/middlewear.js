const joi = require("joi")

const validateCreateUser = async (req, res, next) => {

    try {

        const schema = joi.object({

            first_name: joi.string().empty().required().messages({
                "string.base": `"first_name" must be of type "text"`,
                "string.empty": `"first_name" cannot be empty`,
                "string.required": `"first_name" is required`,
            }),
            last_name: joi.string().empty().required().messages({
                "string.base": `"last_name" must be of type "text"`,
                "string.empty": `"last_name" cannot be empty`,
                "string.required": `"last_name" is required`,
            }),
            email: joi.string().empty().email().required().messages({
                "string.base": `"email" must be of type "text"`,
                "string.empty": `"email" cannot be empty`,
                "string.required": `"email" is required`,
            }),
            password: joi.string().empty().min(8).required().messages({
                "string.base": `"password" must be of type "text"`,
                "string.empty": `"password" cannot be empty`,
                "string.required": `"password" is required`,
            }),
            country: joi.string().empty().required().messages({
                "string.base": `"country" must be of type "text"`,
                "string.empty": `"country" cannot be empty`,
                "string.required": `"country" is required`,
            })
        })
        await schema.validateAsync(req.body, { abortEarly: true })
        next()
    }
    
    catch (error) {

        return res.status(422).json({

            message: error.message,
            success: false
        })
        
    }
}



    
const validateLogin = async (req, res, next) => {

    try {

        const loginSchema = joi.object({

            password: joi.string().empty().required().messages({
                "string.base": `"password" must be of type "text"`,
                "string.empty": `"password" cannot be empty`,
                "string.required": `"password" is required`,
                  
            }),
            email: joi.string().email().empty().required().messages({
                "string.base": `"email" must be of type "text"`,
                "string.empty": `"email" cannot be empty`,
                "string.required": `"email" is required`,
                      
            }),
        })

            await loginSchema.validateAsync(req.body, { abortEarly: true })
            next()
  
    }

    catch (error) {

        return res.status(422).json({

            message: error.message,
            success: false
        })
    
    }
}





const validateBlog = async (req, res, next) => {

    try {

        const blogSchema = joi.object({

            title: joi.string().empty().required().messages({
                "string.base": `"title" must be of type "text"`,
                "string.empty": `"title" cannot be empty`,
                "string.required": `"title" is required`,
            }),
            description: joi.string().empty().messages({
                "string.base": `"description" must be of type "text"`,
                "string.empty": `"description" cannot be empty`,
                "string.required": `"description" is required`,
            }),
            tag: joi.string().empty().min(1).messages({
                "string.base": `"tag" must be of type "text"`,
                "string.empty": `"tag" cannot be empty`,
                "string.required": `"tag" is required`,
            }),
            author: joi.string().empty().messages({
                "string.base": `"author" must be of type "text"`,
                "string.empty": `"author" cannot be empty`,
                "string.required": `"author" is required`,
            }),
            timestamp: joi.string().empty().messages({
                "string.base": `"timestamp" must be of type "text"`,
                "string.empty": `"timestamp" cannot be empty`,
                "string.required": `"timestamp" is required`,
            }),
            state: joi.string().empty().messages({
                "string.base": `"state" must be of type "text"`,
                "string.empty": `"state" cannot be empty`,
                "string.required": `"state" is required`,
            }),
            user_id: joi.string().empty().messages({
                "string.base": `"user_id" must be of type "text"`,
                "string.empty": `"user_id" cannot be empty`,
                "string.required": `"user_id" is required`,
            }),
            read_count: joi.string().empty().messages({
                "string.base": `"read_count" must be of type "text"`,
                "string.empty": `"read_count" cannot be empty`,
                "string.required": `"read_count" is required`,
            }),
            reading_time: joi.string().empty().messages({
                "string.base": `"reading_time" must be of type "text"`,
                "string.empty": `"reading_time" cannot be empty`,
                "string.required": `"reading_time" is required`,
            }),
            body: joi.string().empty().messages({
                "string.base": `"body" must be of type "text"`,
                "string.empty": `"body" cannot be empty`,
                "string.required": `"body" is required`,
            }),
        })

        await blogSchema.validateAsync(req.body, { abortEarly: true })
        next()

    }
    
    catch (error) {

        return res.status(422).json({
            message: error.message,
            success: false
        })
    
    }
}



module.exports = {
    
    validateCreateUser,
    validateLogin,
    validateBlog

}