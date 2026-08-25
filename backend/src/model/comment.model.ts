import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    ownerID: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    postID: {type: mongoose.Schema.Types.ObjectId, ref:"Post", require:true},
    content : {type: String, require: true},
    referenceCommentID: {type: mongoose.Schema.Types.ObjectId, ref:"Comment", require:false},
},{timestamps:true})

commentSchema.index({postID: 1, createdAt: -1})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;