import mongoose from "mongoose"

const schema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    status: {type: String, enum:["pending", "accepted", "declined"], default: "pending"},
    acceptedAt: {type: Date},
},{timestamps:true})

schema.pre('save', async function(){
    if(this.isModified('sender') || this.isModified('recipient')){
        if(this.sender?.equals(this.recipient))
            throw new Error("Cannot request to yourself.")
    }
})

schema.index({sender: 1, recipient: 1},{unique: true});

const FriendRequest = mongoose.model("FriendRequest", schema);

export default FriendRequest;