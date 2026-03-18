import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderID : {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    conversationID: {type: mongoose.Schema.Types.ObjectId, ref:"Conversation", require: true},
    answerFor: {type: mongoose.Schema.Types.ObjectId, ref:"Message",},
    content : {
        text : {type: String},
        imgURL : {type: String}
    },

},{timestamps:true})

messageSchema.index({conversationID: 1, createdAt: -1})

const Message = mongoose.model("Message", messageSchema);

export default Message;