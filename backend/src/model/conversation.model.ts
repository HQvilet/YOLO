import mongoose from "mongoose"

const participantSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    joinedAt: {type: Date, require: true, default: new Date()},
    nickName: {type: String},
    status: {type: String, enum: ["joined", "left"], default: "joined"},
    invitedBy: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile"},
},{
    _id: false,
})

const groupProfileSchema = new mongoose.Schema({
    name: {type: String},
    avatar: {type: String},
    createBy: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
},{
    _id: false,
    timestamps: true,
})

const conversationSchema = new mongoose.Schema({
    group: {
        type: groupProfileSchema,
        require: true
    },
    participants: {
        type: [participantSchema],
        require: true
    },
    lastMessageAt:{
        type: Date,
        require: false,
    },
    type: {
        type: String,
        require: true,
        enum: ["direct", "group"]
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },

},{timestamps:true})

conversationSchema.index({"participant.userID": 1, lastMessageAt: -1})

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;