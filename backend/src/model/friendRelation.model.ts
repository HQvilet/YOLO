import mongoose from "mongoose"

const friendRelationSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
    friendIDs: [
        new mongoose.Schema({
            userID: {type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require:true},
            status: { 
                type: String, 
                enum: ['pending', 'blocked', 'accepted'], 
                default: 'pending' 
            }
        },{_id: false})
    ]
},{_id: false, timestamps:true})

friendRelationSchema.index({userID: 1}, {unique: true})

const FriendRelation = mongoose.model("FriendRelation", friendRelationSchema);

export default FriendRelation;