import mongoose from "mongoose"



const postSchema = new mongoose.Schema({
    creator : { type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    content : {
        text : {type: String},
        img : {type: String}
    },
    reactCount : {type: Number, require: true, default: 0},
    commentCount : {type: Number, require: true, default: 0},

},{timestamps:true})

const Post = mongoose.model("Post", postSchema);

export default Post;