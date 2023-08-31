import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      mongoose.set("strictQuery", false);
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Database connection Error: ${error.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
