const mongoose = require("mongoose");
const shortid = require("shortid");
const bcrypt = require("bcrypt");


const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const userSchema = new schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    profilePicture: { String }



    
})


//before save



const userModel = mongoose.model("users", userSchema);
module.exports = uploModel;