import mongoose from "mongoose";

// Global connection state keep করার জন্য variable (Vercel optimization)
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const mongoURL = process.env.MONGODB_URL;

    if (!mongoURL) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }

    // Connect with optimal timeout settings for serverless
    const db = await mongoose.connect(mongoURL, {
      bufferCommands: false, // Prevents buffering timeouts
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    // Severless-এ process.exit(1) দেবেন না, এরর throw করুন
    throw error;
  }
};