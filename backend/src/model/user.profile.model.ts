import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type : String, require : true},
    fullname: {type : String, require : true},
    profileImg: {type : String},
    coverImg: {type : String}
},
{timestamps : true})

const UserProfile = mongoose.model("UserProfile", userSchema);

export default UserProfile;

