import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connection successful!");
    return true;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
