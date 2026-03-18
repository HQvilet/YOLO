import mongoose from "mongoose"

mongoose.set('debug', false)

export const connectDB = async () =>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI ?? "");
        console.log(`MongoDB connected : ${connect.connection.host}`);
    } catch (error) {
        console.error("Database connect fail : " + error);
        process.exit(1);
    }
}