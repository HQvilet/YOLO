import mongoose from "mongoose"

const postScheme = new mongoose.Schema({
    creator : { type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    content : {
        text : {type: String},
        img : {type: String}
    },
    // likeCount : {type: Number, require: true, default: 0},
    likes : [new mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: "UserProfile", default: []},
        type: {type: String, require: true}
    })],
    commentCount : {type: Number, require: true, default: 0},
    comments : [new mongoose.Schema({
        user : {type: mongoose.Schema.Types.ObjectId, ref: "UserProfile", require: true},
        context : {type: String, require: true}
    }, {timestamps: true})],

},{timestamps:true})

const Post = mongoose.model("Post", postScheme);

export default Post;