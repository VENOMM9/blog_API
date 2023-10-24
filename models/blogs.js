const mongoose = require("mongoose");
const shortid = require("shortid");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;


const blogSchema = new schema({

 _id: {
        type: String,
     default: shortid.generate
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true, default:Date.now },
    updatedAt: { type: Date, required: true, default:Date.now },

    state: { type: String, required: true,  enum : ['draft','published'],
    dafault: 'draft'},
    user_id:{type:mongoose.Schema.Types.String,
        ref:"users"
        },
    read_count: { type: String, required: true, default: 0 },
    reading_time: { type: String, },
    body:{type:String, required: false}

})


const blogModel = mongoose.model("blogs", blogSchema);
module.exports =blogModel;