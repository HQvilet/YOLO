import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type : String, require : true},
    password: {type : String, require : true, minLength : 6},
    userID: { type: mongoose.Schema.Types.ObjectId, ref:"UserProfile", require: true},
    // role: {type: String, require: false}
    },{
        _id: true,
        timestamps : true
    }
)

const UserAuth = mongoose.model("UserAuth", userSchema);

export default UserAuth;
