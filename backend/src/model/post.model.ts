import mongoose from "mongoose"

const commentScheme = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "UserProfile", 
        require: true
    },
    content : {type: String, require: true}
}, {timestamps: true})

const reactScheme = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "UserProfile"},
    type: {type: String, enum: ["like" ,"love", "haha", "dislike", "sad"], require: true}
})

const postScheme = new mongoose.Schema({
    creator : { type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    content : {
        text : {type: String},
        img : {type: String}
    },
    reactCount : {type: Number, require: true, default: 0},
    reacts : {
        type: [reactScheme]
    },
    commentCount : {type: Number, require: true, default: 0},
    comments : {
        type: [commentScheme]
    }

},{timestamps:true})

const Post = mongoose.model("Post", postScheme);

export default Post;