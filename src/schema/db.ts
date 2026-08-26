import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURL = process.env.MONGODB_URL!;
    console.log("MongoDB URL:", mongoURL); // Log the MongoDB URL for debugging

    if (!mongoURL) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(mongoURL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
