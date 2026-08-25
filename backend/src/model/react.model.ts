import mongoose from "mongoose";

const reactSchema = new mongoose.Schema({
    ownerID: {type: mongoose.Schema.Types.ObjectId, ref: "UserProfile"},
    postID: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    type: {type: String, enum: ["like" ,"love", "haha", "dislike", "sad"], require: true},
}, {timestamps:true})

reactSchema.index({ownerID: 1, postID: 1}, {unique: true})
reactSchema.index({postID: 1, createdAt: -1})

const Reaction = mongoose.model("Reaction", reactSchema);

export default Reaction