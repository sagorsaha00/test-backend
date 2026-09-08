import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);

let cachedConnection: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection");
    return cachedConnection;
  }
  if (cachedPromise) {
    return cachedPromise;
  }

  const mongoURL = process.env.MONGODB_URL;

  if (!mongoURL) {
    throw new Error("MONGODB_URL is not defined");
  }

  cachedPromise = mongoose.connect(mongoURL, {
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    cachedConnection = await cachedPromise;

    console.log("✅ MongoDB Connected");

    return cachedConnection;
  } catch (error) {
    cachedPromise = null;
    cachedConnection = null;

    console.error("❌ MongoDB Connection Error:", error);

    throw error;
  }
};

export default mongoose;
