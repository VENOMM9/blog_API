const mongoose = require("mongoose");
const shortid = require("shortid");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const blogSchema = new schema({

 _id: {
        type: String,
     default: shortid.generate
    },
    title: { type: String, required: false },
    description: { type: String, required: true },
    tag: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true, default:Date.now },
    updatedAt: { type: Date, required: true, default:Date.now },

    state: { type: String, 
    default: 'draft'},
    user_id:{type:mongoose.Schema.Types.String,
        ref:"users"
        },
    read_count: { type: Number, required: true, default: 0 },
    reading_time: { type: Number },
    body:{type:String, required: false}

})


const blogModel = mongoose.model("blogs", blogSchema);
module.exports =blogModel;